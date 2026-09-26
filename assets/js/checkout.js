/* ==========================================================================
   THE POUCH PROJECT — checkout por WhatsApp
   Único punto de contacto con la "pasarela". Si mañana llegas con otro
   código de checkout, reemplaza SOLO este archivo manteniendo la misma
   superficie pública:  TPPCheckout.link(order)  y  TPPCheckout.text(order)
   ========================================================================== */
(function (global) {
  'use strict';

  var cfg = global.TPP || {};

  function money(n) {
    return '$' + (Math.round(n * 100) / 100).toString().replace(/\.00$/, '');
  }

  /* Mensajes de contexto para los CTA que no llevan pedido armado. */
  var INTENTS = {
    general: '¡Hola! Vengo de la web de The Pouch Project. Quiero información de los pouches.',
    hero:    '¡Hola! Vengo de la web. Quiero pedir pouches de rendimiento.',
    cierre:  '¡Hola! Vengo de la web y quiero hacer un pedido.',
    footer:  '¡Hola! Vengo de la web de The Pouch Project.',
    flotante:'¡Hola! Tengo una pregunta sobre los pouches.',
    retiro:  '¡Hola! Quiero coordinar un retiro en ' + ((cfg.puntoVenta && cfg.puntoVenta.nombre) || 'el punto de venta') + '.',
    envio:   '¡Hola! Quiero cotizar un envío a mi ciudad.',
  };

  /**
   * Construye el texto del pedido.
   * @param {{producto:object, opcion:object, cantidad:number}|null} order
   * @param {string} [intent] clave de INTENTS cuando no hay pedido armado
   */
  function text(order, intent) {
    if (!order) return INTENTS[intent] || INTENTS.general;

    var total = order.opcion.precio * order.cantidad;
    var lineas = [
      '¡Hola! Quiero hacer este pedido 👇',
      '',
      '• Producto: ' + order.producto.nombre + ' (' + order.producto.categoria + ')',
      '• Presentación: ' + order.opcion.etiqueta,
      '• Cantidad: ' + order.cantidad,
      '• Total estimado: ' + money(total),
      '',
      '¿Lo retiro en ' + ((cfg.puntoVenta && cfg.puntoVenta.nombre) || 'el punto de venta') + ' o me lo envían?',
    ];
    return lineas.join('\n');
  }

  /** Devuelve la URL wa.me lista para abrir. */
  function link(order, intent) {
    var num = String(cfg.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text(order, intent));
  }

  global.TPPCheckout = { link: link, text: text, money: money };
})(window);
