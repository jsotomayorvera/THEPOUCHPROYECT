/* ==========================================================================
   THE POUCH PROJECT — comportamiento de la landing
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.TPP;
  var checkout = window.TPPCheckout;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!cfg || !checkout) return;
  if (/^593900000000$/.test(String(cfg.whatsapp))) {
    console.warn('[TPP] Falta el número real de WhatsApp: edítalo en assets/js/config.js');
  }

  /* ------------------------------------------------ Estado del pedido */
  var producto = cfg.productos.filter(function (p) { return p.stage === 'live'; })[0];
  var state = {
    opcion: producto ? producto.opciones.filter(function (o) { return o.destacado; })[0] || producto.opciones[0] : null,
    cantidad: 1,
  };

  /* --------------------------------------------------- Datos al DOM */
  $('#year').textContent = new Date().getFullYear();
  $('#cityLine').textContent = cfg.ciudad || '';
  $('#igLink').href = 'https://instagram.com/' + cfg.instagram;
  $('#igLink').textContent = '@' + cfg.instagram;
  $('#mailLink').href = 'mailto:' + cfg.email;
  $('#mailLink').textContent = cfg.email;
  $('#pvName').textContent = cfg.puntoVenta.nombre;
  $('#pvDetail').textContent = cfg.puntoVenta.detalle;
  $('#shipTitle').textContent = cfg.envio.titulo;
  $('#shipDetail').textContent = cfg.envio.detalle;

  if (producto) {
    $('#prodName').textContent = producto.nombre;
    $('#prodDesc').textContent = producto.descripcion;
    $('#packName').innerHTML = producto.nombre.replace(' ', '<br>');
    $('#packUnits').textContent = producto.unidades;

    $('#prodTags').innerHTML = producto.tags.map(function (t) {
      return '<li class="tag">' + t + '</li>';
    }).join('');

    $('#opts').innerHTML = producto.opciones.map(function (o, i) {
      return '' +
        '<label class="opt">' +
          (o.destacado ? '<span class="opt__flag">Más pedido</span>' : '') +
          '<input type="radio" name="opcion" value="' + o.id + '"' +
            (o.id === state.opcion.id ? ' checked' : '') + '>' +
          '<span class="opt__mark" aria-hidden="true"></span>' +
          '<span class="opt__txt"><b>' + o.etiqueta + '</b><small>' + (o.nota || '') + '</small></span>' +
          '<span class="opt__price">' + checkout.money(o.precio) + '</span>' +
        '</label>';
    }).join('');
  }

  /* Tarjetas de etapas que todavía no están a la venta */
  $('#soon').innerHTML = cfg.productos.filter(function (p) { return p.stage === 'soon'; })
    .map(function (p, i) {
      return '' +
        '<article class="soon-card reveal" style="--d:' + (i * 90) + 'ms">' +
          '<p class="eyebrow">' + p.categoria + ' · próximamente</p>' +
          '<h3>' + p.nombre + '</h3>' +
          '<p>' + p.descripcion + '</p>' +
          '<p class="tag" style="width:max-content">' + p.promesa + '</p>' +
        '</article>';
    }).join('');

  /* ------------------------------------------------------- Pedido UI */
  function currentOrder() {
    if (!producto || !state.opcion) return null;
    return { producto: producto, opcion: state.opcion, cantidad: state.cantidad };
  }

  function render() {
    var order = currentOrder();
    if (!order) return;
    var total = checkout.money(order.opcion.precio * order.cantidad);
    $('#qty').textContent = order.cantidad;
    $('#total').textContent = total;
    $('#barTotal').textContent = total;
    $('#barLabel').textContent = order.cantidad + ' × ' + order.opcion.etiqueta;
    var url = checkout.link(order);
    $('#buyCta').href = url;
    $('#barCta').href = url;
  }

  $$('input[name="opcion"]').forEach(function (input) {
    input.addEventListener('change', function () {
      state.opcion = producto.opciones.filter(function (o) { return o.id === input.value; })[0];
      render();
    });
  });

  var plus = $('#plus'), minus = $('#minus');
  if (plus) plus.addEventListener('click', function () { state.cantidad = Math.min(20, state.cantidad + 1); render(); });
  if (minus) minus.addEventListener('click', function () { state.cantidad = Math.max(1, state.cantidad - 1); render(); });

  var form = $('#buyForm');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  render();

  /* CTA de contexto (sin pedido armado) */
  $$('[data-wa]').forEach(function (el) {
    el.href = checkout.link(null, el.getAttribute('data-wa'));
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ------------------------------------------- Cabecera y barra móvil */
  var header = $('#header'), buybar = $('#buybar'), shop = $('#producto');
  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 8);
    if (buybar && shop) {
      var past = shop.getBoundingClientRect().top < window.innerHeight * 0.4;
      var atEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 220;
      buybar.classList.toggle('is-on', past && !atEnd);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------ Nav activo */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------ Revelado al scroll */
  function revealAll() { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }
  if (reduced || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------ Vídeo del hero
     Rota los clips de cfg.heroVideos con fundido. Si no hay clips,
     se queda el fondo animado de respaldo (.hero__fallback).           */
  var media = $('#heroMedia');
  var clips = (cfg.heroVideos || []).filter(Boolean);
  if (media && clips.length && !reduced) {
    var els = clips.map(function (c, i) {
      var v = document.createElement('video');
      v.src = c.src;
      if (c.poster) v.poster = c.poster;
      v.muted = true; v.playsInline = true; v.loop = clips.length === 1;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.preload = i === 0 ? 'auto' : 'metadata';
      media.appendChild(v);
      return v;
    });
    var idx = 0;
    function show(i) {
      els.forEach(function (v, n) { v.classList.toggle('is-on', n === i); });
      var v = els[i];
      v.currentTime = 0;
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: queda el respaldo */ });
    }
    if (clips.length > 1) {
      els.forEach(function (v) {
        v.addEventListener('ended', function () { idx = (idx + 1) % els.length; show(idx); });
      });
    }
    show(0);
  }
})();
