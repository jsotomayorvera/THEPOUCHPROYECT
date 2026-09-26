/* ==========================================================================
   THE POUCH PROJECT — comportamiento de la landing
   Animación con GSAP + ScrollTrigger (alojados en assets/js/vendor/).
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.TPP, C = window.TPPCheckout;
  if (!cfg || !C) return;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGsap = typeof window.gsap !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var P = cfg.producto;

  if (/^593900000000$/.test(String(cfg.whatsapp))) {
    console.warn('[TPP] Falta el número real de WhatsApp: edítalo en assets/js/config.js');
  }

  /* Estado único del pedido */
  var order = {
    packId: (cfg.packs.filter(function (p) { return p.destacado; })[0] || cfg.packs[0]).id,
    cantidad: 1,
    ciudadId: cfg.envios.ciudades[0].id,
    codigo: '',
    nombre: '', telefono: '', direccion: '', notas: '',
  };

  /* ═══════════════════════════════════════════════ 1. CONTENIDO */
  $('#year').textContent = new Date().getFullYear();
  $('#statementCopy').textContent = cfg.marca.tagline;
  $('#footerTagline').textContent = cfg.marca.tagline;
  $('#igLink').href = 'https://instagram.com/' + cfg.instagram;
  $('#igLink').textContent = '@' + cfg.instagram;
  $('#mailLink').href = 'mailto:' + cfg.email;
  $('#mailLink').textContent = cfg.email;
  $('#cutoffText').textContent =
    'Los pedidos de hoy salen mañana. Cierre de despacho: ' + cfg.envios.cierreDespacho + '.';

  $('#prodLinea').textContent = P.linea;
  $('#prodNombre').textContent = P.nombre;
  $('#prodResumen').textContent = P.resumen;
  $('#shotName').innerHTML = P.nombre.replace(' ', '<br>');
  $('#shotUnits').textContent = P.unidades + ' pouches';
  $('#seals').innerHTML = P.sellos.map(function (s) { return '<li class="seal">' + s + '</li>'; }).join('');

  $('#flavours').innerHTML = P.sabores.map(function (s) {
    return '<span class="flavour" data-on="' + (s.activo ? 'true' : 'false') + '"' +
      (s.activo ? '' : ' aria-disabled="true" title="Todavía no lo traemos"') + '>' +
      s.nombre + (s.activo ? '' : ' · pronto') + '</span>';
  }).join('');

  $('#ingredientes').innerHTML = P.activos.map(function (a) {
    return '<article class="ing pop" data-anim="stagger">' +
      '<p class="ing__rol">' + a.rol + '</p>' +
      '<h3>' + a.nombre + '</h3><p>' + a.texto + '</p></article>';
  }).join('');

  $('#packs').innerHTML = cfg.packs.map(function (p) {
    return '<label class="pack">' +
      (p.destacado ? '<span class="pack__flag">Más pedido</span>' : '') +
      '<input type="radio" name="pack" value="' + p.id + '"' + (p.id === order.packId ? ' checked' : '') + '>' +
      '<span class="pack__mark" aria-hidden="true"></span>' +
      '<span class="pack__txt"><b>' + p.titulo + '</b><small>' + (p.nota || '') + '</small></span>' +
      '<span class="pack__price">' + C.money(p.precio) + '</span></label>';
  }).join('');

  $('#cities').innerHTML = cfg.envios.ciudades.map(function (c) {
    var precio = c.precio === 0
      ? '<span class="city__price free">Gratis</span>'
      : '<span class="city__price">' + C.money(c.precio) + '</span>';
    return '<label class="city">' +
      '<input type="radio" name="ciudad" value="' + c.id + '"' + (c.id === order.ciudadId ? ' checked' : '') + '>' +
      '<svg class="city__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
        '<path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>' +
      '<span class="city__txt"><b>' + c.nombre + '</b><small>' + c.eta + '</small></span>' + precio + '</label>';
  }).join('');

  $('#f-ciudad').innerHTML = cfg.envios.ciudades.map(function (c) {
    return '<option value="' + c.id + '"' + (c.id === order.ciudadId ? ' selected' : '') + '>' + c.nombre + '</option>';
  }).join('');

  if (P.foto) {
    var photo = $('#shotPhoto'), can = $('#shotCan');
    photo.addEventListener('load', function () { photo.hidden = false; if (can) can.hidden = true; });
    photo.addEventListener('error', function () { photo.remove(); });
    photo.src = P.foto;
  }

  $$('[data-wa]').forEach(function (el) {
    el.href = C.link(null, el.getAttribute('data-wa'));
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* ═══════════════════════════════════════════════ 2. RESUMEN Y TOTALES */
  function renderSummary() {
    var t = C.totals(order);
    var box = $('#summary');

    box.classList.remove('is-empty');
    var rows = [
      '<div class="sumrow"><span>' + t.pack.titulo + ' × ' + order.cantidad +
        '</span><span>' + C.money(t.subtotal) + '</span></div>',
    ];
    if (t.pct) {
      rows.push('<div class="sumrow sumrow--save"><span>Descuento ' +
        order.codigo.toUpperCase() + ' (-' + t.pct + '%)</span><span>-' + C.money(t.ahorro) + '</span></div>');
    }
    rows.push('<div class="sumrow"><span>Envío · ' + t.ciudad.nombre + '</span><span>' +
      (t.ciudad.retiro ? 'Sin costo' : (t.envioGratis ? 'Gratis' : C.money(t.envio))) + '</span></div>');
    rows.push('<div class="sumrow sumrow--total"><span>Total</span><span>' + C.money(t.total) + '</span></div>');
    box.innerHTML = rows.join('');

    $('#barTotal').textContent = C.money(t.total);
    $('#barLabel').textContent = t.pack.titulo + ' × ' + order.cantidad;
    $('#qty').textContent = order.cantidad;

    // Aviso de envío gratis
    var note = $('#shipNote');
    if (t.faltaGratis > 0) {
      note.hidden = false;
      $('#shipNoteText').innerHTML = 'Te faltan <b>' + C.money(t.faltaGratis) +
        '</b> para el envío gratis en ' + t.ciudad.nombre + '.';
      var pct = Math.max(0, Math.min(100, (t.subtotal - t.ahorro) / cfg.envios.gratisDesde * 100));
      $('#shipBar').style.width = pct + '%';
    } else if (t.envioGratis) {
      note.hidden = false;
      $('#shipNoteText').innerHTML = '<b>Envío gratis</b> desbloqueado en ' + t.ciudad.nombre + '.';
      $('#shipBar').style.width = '100%';
    } else {
      note.hidden = true;
    }

    // La dirección no aplica si retira en persona
    $('#wrap-direccion').hidden = !!t.ciudad.retiro;
  }

  function setCiudad(id, from) {
    order.ciudadId = id;
    var radio = $('input[name="ciudad"][value="' + id + '"]');
    if (radio && from !== 'radio') radio.checked = true;
    if (from !== 'select') $('#f-ciudad').value = id;
    renderSummary();
  }

  $$('input[name="pack"]').forEach(function (i) {
    i.addEventListener('change', function () {
      order.packId = i.value; renderSummary();
      if (hasGsap && !reduced) gsap.fromTo('.sumrow--total span:last-child', { scale: 1.16 }, { scale: 1, duration: .45, ease: 'back.out(2)' });
    });
  });
  $$('input[name="ciudad"]').forEach(function (i) {
    i.addEventListener('change', function () { setCiudad(i.value, 'radio'); });
  });
  $('#f-ciudad').addEventListener('change', function () { setCiudad(this.value, 'select'); });

  $('#plus').addEventListener('click', function () { order.cantidad = Math.min(20, order.cantidad + 1); renderSummary(); });
  $('#minus').addEventListener('click', function () { order.cantidad = Math.max(1, order.cantidad - 1); renderSummary(); });

  /* Código de descuento */
  $('#applyCode').addEventListener('click', function () {
    var v = $('#f-codigo').value.trim();
    var pct = C.descuento(v);
    var err = $('#e-codigo');
    if (!v) { order.codigo = ''; err.textContent = ''; err.className = 'err'; renderSummary(); return; }
    if (pct) {
      order.codigo = v; err.textContent = 'Código aplicado: -' + pct + '%'; err.className = 'promo-ok';
    } else {
      order.codigo = ''; err.textContent = 'Ese código no existe o ya venció.'; err.className = 'err';
    }
    renderSummary();
  });

  /* ═══════════════════════════════════════════════ 3. ENVÍO DEL PEDIDO */
  var FIELDS = ['nombre', 'telefono', 'direccion', 'notas'];
  FIELDS.forEach(function (f) {
    var el = $('#f-' + f);
    if (!el) return;
    el.addEventListener('input', function () {
      order[f] = el.value;
      var wrap = el.closest('.field');
      if (wrap) wrap.classList.remove('has-error');
      var err = $('#e-' + f);
      if (err) err.textContent = '';
    });
  });

  $('#orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    FIELDS.forEach(function (f) { var el = $('#f-' + f); if (el) order[f] = el.value; });

    var errs = C.validate(order);
    $$('.field').forEach(function (w) { w.classList.remove('has-error'); });
    ['nombre', 'telefono', 'ciudad', 'direccion'].forEach(function (k) {
      var err = $('#e-' + k);
      if (!err) return;
      err.className = 'err';
      err.textContent = errs[k] || '';
      if (errs[k]) {
        var el = $('#f-' + k);
        if (el && el.closest('.field')) el.closest('.field').classList.add('has-error');
      }
    });

    var keys = Object.keys(errs);
    if (keys.length) {
      var first = $('#f-' + (keys.indexOf('pack') === 0 ? 'nombre' : keys[0]));
      if (first) first.focus();
      if (hasGsap && !reduced) gsap.fromTo('#orderForm', { x: -7 }, { x: 0, duration: .5, ease: 'elastic.out(1,0.35)' });
      return;
    }

    window.open(C.link(order), '_blank', 'noopener');
  });

  renderSummary();

  /* ═══════════════════════════════════════════════ 4. FONDOS ANIMADOS */
  var heroField = window.TPPField ? window.TPPField($('#heroField'), { bubbles: 16, intensity: 1.05, speed: .8, hue: 150, dark: true }) : null;
  var fxField   = window.TPPField ? window.TPPField($('#fxField'),   { bubbles: 22, intensity: 1.3,  speed: 1,  hue: 150 }) : null;

  /* ═══════════════════════════════════════════════ 5. PESTAÑAS */
  (function tabs() {
    var list = $('.tabs'); if (!list) return;
    var thumb = $('#fxThumb');
    var btns = $$('.tab', list);
    var panels = btns.map(function (b) { return document.getElementById(b.getAttribute('aria-controls')); });

    function moveThumb(btn, animate) {
      var x = btn.offsetLeft - list.clientLeft, w = btn.offsetWidth;
      if (hasGsap && animate && !reduced) gsap.to(thumb, { x: x, width: w, duration: .55, ease: 'power3.out' });
      else { thumb.style.width = w + 'px'; thumb.style.transform = 'translate3d(' + x + 'px,0,0)'; }
    }

    function select(i, animate) {
      btns.forEach(function (b, n) {
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
        b.tabIndex = n === i ? 0 : -1;
      });
      panels.forEach(function (p, n) {
        if (!p) return;
        if (n === i) {
          p.hidden = false;
          if (hasGsap && animate && !reduced) {
            gsap.fromTo(p.children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .06, ease: 'power2.out' });
          }
        } else { p.hidden = true; }
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

    function init() { select(0, false); }
    init();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
    window.addEventListener('resize', function () {
      var on = btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0];
      moveThumb(on, false);
    });
  })();

  /* ═══════════════════════════════════════════════ 6. NAV Y BARRA MÓVIL */
  var nav = $('#nav'), buybar = $('#buybar'), hero = $('#hero'), prod = $('#producto');
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
    if (buybar && prod) {
      var past = prod.getBoundingClientRect().top < window.innerHeight * .4;
      var atEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 220;
      buybar.classList.toggle('is-on', past && !atEnd);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var links = $$('.nav__links a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ═══════════════════════════════════════════════ 7. ANIMACIÓN (GSAP) */
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: .8 });

    /* Parte cada [data-split] en palabras para animarlas de una en una */
    $$('[data-split]').forEach(function (el) {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = '1';
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
    });

    gsap.matchMedia().add({
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, function (ctx) {
      if (ctx.conditions.reduce) return;

      /* Entrada: logo, tagline palabra a palabra, botones */
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('#heroLogo', { autoAlpha: 0, scale: .9, yPercent: 6, duration: 1.2 })
        .from('.hero__tagline .word', { autoAlpha: 0, yPercent: 110, duration: .7, stagger: .035 }, '-=.55')
        .from('[data-anim="hero"]', { autoAlpha: 0, y: 20, duration: .7 }, '-=.35')
        .from('.hero__scroll', { autoAlpha: 0, duration: .6 }, '-=.3');

      /* Titulares: palabra a palabra al entrar en pantalla */
      $$('[data-split]').forEach(function (el) {
        if (el.classList.contains('hero__tagline')) return;
        gsap.from(el.querySelectorAll('.word'), {
          autoAlpha: 0, yPercent: 100, duration: .7, stagger: .045,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });

      /* Glifo que respira */
      gsap.to('.efectos__glyph ellipse', {
        scaleX: 1.08, yPercent: -6, duration: 1.9, ease: 'sine.inOut',
        stagger: { each: .08, yoyo: true, repeat: -1 }, yoyo: true, repeat: -1,
      });

      /* Revelado por lotes */
      ['up', 'fx'].forEach(function (kind) {
        ScrollTrigger.batch('[data-anim="' + kind + '"]', {
          start: 'top 88%', once: true,   // una vez y ya: no reaparece al volver a pasar
          onEnter: function (b) { gsap.from(b, { autoAlpha: 0, y: 28, duration: .8, stagger: .09, overwrite: true }); },
        });
      });
      ScrollTrigger.batch('[data-anim="stagger"]', {
        start: 'top 86%', batchMax: 4, once: true,
        onEnter: function (b) { gsap.from(b, { autoAlpha: 0, y: 32, scale: .98, duration: .8, stagger: .09, overwrite: true }); },
      });

      /* Paralaje del hero */
      gsap.to('#heroField', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
      });
      gsap.to('#heroLogo', {
        yPercent: -18, autoAlpha: .2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 },
      });

      /* La lata se acerca al subir */
      gsap.from('.shot', {
        scale: .94, autoAlpha: .65, ease: 'none',
        scrollTrigger: { trigger: '#producto', start: 'top 80%', end: 'top 30%', scrub: .5 },
      });

      /* Seguimiento suave del ratón en las tarjetas que hacen "pop" */
      if (window.matchMedia('(hover:hover)').matches) {
        $$('.pop').forEach(function (card) {
          var qx = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
          var qy = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
          card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            qx(((e.clientX - r.left) / r.width - .5) * 9);
            qy(((e.clientY - r.top) / r.height - .5) * -9);
          });
          card.addEventListener('mouseleave', function () { qx(0); qy(0); });
        });
      }
    });

    // Las posiciones dependen de la altura real del texto: recalcula cuando
    // las fuentes ya midieron y cuando todo (imágenes incluidas) terminó de cargar.
    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ═══════════════════════════════════════════════ 8. VÍDEO DEL HERO */
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
      var pr = els[i].play();
      if (pr && pr.catch) pr.catch(function () {});
    }
    if (clips.length > 1) {
      els.forEach(function (v) { v.addEventListener('ended', function () { idx = (idx + 1) % els.length; show(idx); }); });
    }
    if (heroField) heroField.stop();
    show(0);
  }
})();
