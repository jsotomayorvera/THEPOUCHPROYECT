/* ==========================================================================
   THE POUCH PROJECT — comportamiento de la landing
   Animación con GSAP + ScrollTrigger (alojados en assets/js/vendor/).
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.TPP, checkout = window.TPPCheckout;
  if (!cfg || !checkout) return;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGsap = typeof window.gsap !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (/^593900000000$/.test(String(cfg.whatsapp))) {
    console.warn('[TPP] Falta el número real de WhatsApp: edítalo en assets/js/config.js');
  }

  /* ═══════════════════════════════════════════════ 1. DATOS AL DOM */
  var producto = cfg.productos.filter(function (p) { return p.stage === 'live'; })[0];
  var state = {
    opcion: producto ? (producto.opciones.filter(function (o) { return o.destacado; })[0] || producto.opciones[0]) : null,
    cantidad: 1,
  };

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
    $('#prodCat').textContent = producto.categoria;
    $('#prodName').textContent = producto.nombre;
    $('#prodDesc').textContent = producto.descripcion;
    $('#packName').innerHTML = producto.nombre.replace(' ', '<br>');
    $('#packUnits').textContent = producto.unidades;

    var tags = (producto.tags || []).concat(producto.activos || []);
    $('#prodTags').innerHTML = tags.map(function (t) { return '<li class="tag">' + t + '</li>'; }).join('');

    $('#opts').innerHTML = producto.opciones.map(function (o) {
      return '<label class="opt">' +
        (o.destacado ? '<span class="opt__flag">Más pedido</span>' : '') +
        '<input type="radio" name="opcion" value="' + o.id + '"' + (o.id === state.opcion.id ? ' checked' : '') + '>' +
        '<span class="opt__mark" aria-hidden="true"></span>' +
        '<span class="opt__txt"><b>' + o.etiqueta + '</b><small>' + (o.nota || '') + '</small></span>' +
        '<span class="opt__price">' + checkout.money(o.precio) + '</span>' +
      '</label>';
    }).join('');

    // La foto solo sustituye a la lata dibujada si el archivo existe de verdad
    if (producto.foto) {
      var photo = $('#packPhoto'), can = $('#packCan');
      photo.addEventListener('load', function () { photo.hidden = false; if (can) can.hidden = true; });
      photo.addEventListener('error', function () { photo.remove(); });
      photo.src = producto.foto;
    }
  }

  $('#soon').innerHTML = cfg.productos.filter(function (p) { return p.stage === 'soon'; })
    .map(function (p) {
      return '<article class="soon-card" data-anim="stagger">' +
        '<p class="eyebrow">' + p.categoria + ' · próximamente</p>' +
        '<h3>' + p.nombre + '</h3><p>' + p.descripcion + '</p>' +
        '<p class="tag" style="width:max-content">' + p.promesa + '</p></article>';
    }).join('');

  /* ═══════════════════════════════════════════════ 2. PEDIDO */
  function currentOrder() {
    if (!producto || !state.opcion) return null;
    return { producto: producto, opcion: state.opcion, cantidad: state.cantidad };
  }

  function render() {
    var order = currentOrder(); if (!order) return;
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
      if (hasGsap && !reduced) gsap.fromTo('#total', { scale: 1.12 }, { scale: 1, duration: .45, ease: 'back.out(2)' });
    });
  });
  $('#plus').addEventListener('click', function () { state.cantidad = Math.min(20, state.cantidad + 1); render(); });
  $('#minus').addEventListener('click', function () { state.cantidad = Math.max(1, state.cantidad - 1); render(); });
  $('#buyForm').addEventListener('submit', function (e) { e.preventDefault(); });
  render();

  $$('[data-wa]').forEach(function (el) {
    el.href = checkout.link(null, el.getAttribute('data-wa'));
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* ═══════════════════════════════════════════════ 3. FONDOS ANIMADOS */
  var heroField = window.TPPField ? window.TPPField($('#heroField'), { bubbles: 18, intensity: 1.2, speed: .85, hue: 150 }) : null;
  var fxField   = window.TPPField ? window.TPPField($('#fxField'),   { bubbles: 22, intensity: 1.3, speed: 1,   hue: 150 }) : null;
  var ctaField  = window.TPPField ? window.TPPField($('#ctaField'),  { bubbles: 14, intensity: 1.15, speed: .8, hue: 168 }) : null;
  if (ctaField) { /* referenciado para que quede claro que se usa */ }

  /* ═══════════════════════════════════════════════ 4. PESTAÑAS DE EFECTOS */
  (function tabs() {
    var list = $('.tabs'); if (!list) return;
    var thumb = $('#fxThumb');
    var btns = $$('.tab', list);
    var panels = btns.map(function (b) { return document.getElementById(b.getAttribute('aria-controls')); });

    function moveThumb(btn, animate) {
      var x = btn.offsetLeft - list.clientLeft;
      var w = btn.offsetWidth;
      if (hasGsap && animate && !reduced) {
        gsap.to(thumb, { x: x, width: w, duration: .55, ease: 'power3.out' });
      } else {
        thumb.style.width = w + 'px';
        thumb.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
    }

    function select(i, animate) {
      btns.forEach(function (b, n) {
        var on = n === i;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, n) {
        if (!p) return;
        if (n === i) {
          p.hidden = false;
          if (hasGsap && animate && !reduced) {
            gsap.fromTo(p.children,
              { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
              { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .5, stagger: .06, ease: 'power2.out' });
          }
        } else {
          p.hidden = true;
        }
      });
      moveThumb(btns[i], animate);
      if (fxField) fxField.setHue(Number(btns[i].dataset.hue) || 150);
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i, true); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + btns.length) % btns.length;
        btns[n].focus(); select(n, true);
      });
    });

    // Posición inicial cuando las fuentes ya midieron el texto
    function init() { select(0, false); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(init); else init();
    init();
    window.addEventListener('resize', function () {
      var active = btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0];
      moveThumb(active, false);
    });
  })();

  /* ═══════════════════════════════════════════════ 5. CABECERA Y BARRA */
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

  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ═══════════════════════════════════════════════ 6. ANIMACIÓN (GSAP) */
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: .8 });

    var mm = gsap.matchMedia();

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, function (ctx) {
      if (ctx.conditions.reduce) return;   // sin movimiento: la página ya está completa

      /* Entrada del hero: una sola secuencia, no efectos sueltos */
      // Ojo: nada de `filter` aquí. El titular usa background-clip:text y un
      // filter en línea le crea su propio contexto de pintado, que lo borra.
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-anim="hero"]', {
          autoAlpha: 0, yPercent: 24,
          duration: 1.05, stagger: .09, clearProps: 'transform',
        })
        .from('.efectos__glyph', { autoAlpha: 0, scale: .85, duration: .8 }, '-=.6');

      /* Las elipses del glifo respiran en onda */
      gsap.to('.efectos__glyph ellipse', {
        scaleX: 1.08, yPercent: -6,
        duration: 1.9, ease: 'sine.inOut',
        stagger: { each: .08, yoyo: true, repeat: -1 },
        yoyo: true, repeat: -1,
      });

      /* Revelado al entrar en pantalla, por lotes */
      ['up', 'fx'].forEach(function (kind) {
        ScrollTrigger.batch('[data-anim="' + kind + '"]', {
          start: 'top 88%',
          onEnter: function (batch) {
            gsap.from(batch, { autoAlpha: 0, y: 30, duration: .85, stagger: .1, overwrite: true });
          },
        });
      });

      ScrollTrigger.batch('[data-anim="stagger"]', {
        start: 'top 86%', batchMax: 4,
        onEnter: function (batch) {
          gsap.from(batch, { autoAlpha: 0, y: 34, scale: .98, duration: .8, stagger: .09, overwrite: true });
        },
      });

      /* Paralaje suave del campo del hero, atado al scroll */
      gsap.to('#heroField', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
      });

      /* La lata del producto se acerca mientras se sube */
      gsap.from('.pack', {
        scale: .94, autoAlpha: .6, ease: 'none',
        scrollTrigger: { trigger: '#producto', start: 'top 80%', end: 'top 30%', scrub: .5 },
      });
    });

    ScrollTrigger.refresh();
  }

  /* ═══════════════════════════════════════════════ 7. VÍDEO DEL HERO */
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
      els[i].currentTime = 0;
      var p = els[i].play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: queda el campo animado */ });
    }
    if (clips.length > 1) {
      els.forEach(function (v) { v.addEventListener('ended', function () { idx = (idx + 1) % els.length; show(idx); }); });
    }
    if (heroField) heroField.stop();
    show(0);
  }
})();
