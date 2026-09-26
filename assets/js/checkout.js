/* ==========================================================================
   THE POUCH PROJECT — pedido y checkout por WhatsApp
   Único punto de contacto con la "pasarela". Si mañana cambias de sistema,
   reemplaza este archivo manteniendo la superficie pública:
     TPPCheckout.money / totals / validate / text / link
   ========================================================================== */
(function (global) {
  'use strict';

  var cfg = global.TPP || {};

  function money(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  }

  function ciudad(id) {
    return (cfg.envios.ciudades || []).filter(function (c) { return c.id === id; })[0] || null;
  }

  function pack(id) {
    return (cfg.packs || []).filter(function (p) { return p.id === id; })[0] || null;
  }

  /** Normaliza y valida un código de descuento. Devuelve el % o 0. */
  function descuento(code) {
    if (!code) return 0;
    return cfg.descuentos[String(code).trim().toUpperCase()] || 0;
  }

  /**
   * Calcula el desglose del pedido.
   * @param {{packId:string, cantidad:number, ciudadId:string, codigo:string}} o
   */
  function totals(o) {
    var p = pack(o.packId);
    var c = ciudad(o.ciudadId);
    var subtotal = p ? p.precio * o.cantidad : 0;

    var pct = descuento(o.codigo);
    var ahorro = subtotal * pct / 100;
    var base = subtotal - ahorro;

    var envio = c ? c.precio : 0;
    var gratis = false;
    if (c && !c.retiro && cfg.envios.gratisEn.indexOf(c.id) !== -1 && base >= cfg.envios.gratisDesde) {
      envio = 0; gratis = true;
    }

    var faltaGratis = 0;
    if (c && !c.retiro && cfg.envios.gratisEn.indexOf(c.id) !== -1 && !gratis) {
      faltaGratis = cfg.envios.gratisDesde - base;
    }

    return {
      pack: p, ciudad: c,
      subtotal: subtotal, pct: pct, ahorro: ahorro,
      envio: envio, envioGratis: gratis, faltaGratis: faltaGratis,
      total: base + envio,
    };
  }

  /** Devuelve un objeto con los campos que faltan o están mal. */
  function validate(o) {
    var e = {};
    if (!pack(o.packId)) e.pack = 'Elige un pack.';
    if (!o.nombre || o.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre y apellido.';
    if (!/^0?\d{9}$/.test(String(o.telefono || '').replace(/[\s-]/g, ''))) e.telefono = 'Un celular de 10 dígitos, por ejemplo 0991234567.';
    if (!ciudad(o.ciudadId)) e.ciudad = 'Elige a dónde va.';
    var c = ciudad(o.ciudadId);
    if (c && !c.retiro && (!o.direccion || o.direccion.trim().length < 8)) {
      e.direccion = 'Necesitamos la dirección para poder entregar.';
    }
    return e;
  }

  /* Mensajes para los botones que no llevan pedido armado. */
  var INTENTS = {
    general:  '¡Hola! Vengo de la web de The Pouch Project. Quiero información de los pouches.',
    hero:     '¡Hola! Vengo de la web. Quiero pedir pouches de rendimiento.',
    cierre:   '¡Hola! Vengo de la web y quiero hacer un pedido.',
    footer:   '¡Hola! Vengo de la web de The Pouch Project.',
    flotante: '¡Hola! Tengo una pregunta sobre los pouches.',
    aviso:    '¡Hola! Quiero que me avisen cuando llegue esa referencia.',
  };

  /** Arma el texto del pedido completo. */
  function text(o, intent) {
    if (!o) return INTENTS[intent] || INTENTS.general;
    var t = totals(o);
    var L = [];

    L.push('¡Hola! Quiero hacer este pedido 👇', '');
    L.push('*PRODUCTO*');
    L.push('• ' + cfg.producto.nombre + ' — ' + cfg.producto.linea);
    L.push('• ' + t.pack.titulo + ' × ' + o.cantidad +
           '  (' + (t.pack.latas * o.cantidad) + ' latas · ' +
           (t.pack.latas * o.cantidad * cfg.producto.unidades) + ' pouches)');
    L.push('');

    L.push('*ENTREGA*');
    L.push('• Nombre: ' + o.nombre.trim());
    L.push('• Teléfono: ' + o.telefono.trim());
    L.push('• ' + (t.ciudad.retiro ? 'Retiro en persona' : 'Ciudad: ' + t.ciudad.nombre));
    if (!t.ciudad.retiro) L.push('• Dirección: ' + o.direccion.trim());
    if (o.notas && o.notas.trim()) L.push('• Notas: ' + o.notas.trim());
    L.push('');

    L.push('*TOTAL*');
    L.push('• Subtotal: ' + money(t.subtotal));
    if (t.pct) L.push('• Descuento ' + String(o.codigo).toUpperCase() + ' (-' + t.pct + '%): -' + money(t.ahorro));
    L.push('• Envío: ' + (t.ciudad.retiro ? 'retiro, sin costo' : (t.envioGratis ? 'gratis' : money(t.envio))));
    L.push('• *Total: ' + money(t.total) + '*');
    L.push('');
    L.push('Quedo atento a que me confirmen disponibilidad y forma de pago.');

    return L.join('\n');
  }

  function link(o, intent) {
    var num = String(cfg.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text(o, intent));
  }

  global.TPPCheckout = {
    money: money, pack: pack, ciudad: ciudad, descuento: descuento,
    totals: totals, validate: validate, text: text, link: link,
  };
})(window);
