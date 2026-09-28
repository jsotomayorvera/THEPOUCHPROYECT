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

  var order = {
    packId: (cfg.packs.filter(function (p) { return p.destacado; })[0] || cfg.packs[0]).id,
    cantidad: 1,
    ciudadId: cfg.envios.ciudades[0].id,
    codigo: '',
    nombre: '', telefono: '', direccion: '', notas: '',
  };

  /* ═══════════════════════════════════════════════ 1. CONTENIDO */
  var waLegible = String(cfg.whatsapp).replace(/^593/, '0');
  $('#year').textContent = new Date().getFullYear();
  $('#waLine').textContent = waLegible;
  $('#igLink').href = 'https://instagram.com/' + cfg.instagram;
  $('#igLink').textContent = '@' + cfg.instagram;
  $('#igFoot').textContent = '@' + cfg.instagram;
  var igSocial = $('#igSocial');
  if (igSocial) igSocial.href = 'https://instagram.com/' + cfg.instagram;
  $('#zonaLine').textContent = 'Ecuador · 24–72 h';

  /* Vitrina de producto: carrusel horizontal */
  $('#flowStage').innerHTML = cfg.vitrina.map(function (v, i) {
    var live = v.estado === 'live';
    return '<article class="pcard ' + (live ? 'pcard--live' : 'pcard--soon') + '" data-i="' + i + '">' +
      '<div class="pcard__media">' +
        '<img src="' + v.foto + '" alt="' + (live ? v.titulo : '') + '" loading="lazy" width="1100" height="1100">' +
        (live ? '' : '<p class="pcard__flag">¡Pronto!</p>') +
      '</div>' +
      '<div class="pcard__bar">' +
        '<div class="pcard__name"><span>' + v.sabor + '</span><b>' + v.titulo + '</b></div>' +
        (live
          ? '<a class="btn btn--cobalto" href="#pedido">Pedir</a>'
          : '<a class="btn btn--outline" data-wa="aviso" href="#">Avísame</a>') +
      '</div></article>';
  }).join('');

  /* Cinta superior */
  (function ticker() {
    var frase = '¡Rinde sin límites!   ·   Envíos a todo el Ecuador   ·   Sin cafeína, sin azúcar, sin tabaco   ·   Pedidos por WhatsApp   ·   ';
    var texto = new Array(4).join(frase) + frase;
    var a = $('#tickerA'), b = $('#tickerB');
    if (a) a.textContent = texto;
    if (b) b.textContent = texto;
  })();

  /* Muro de pegatinas */
  if (window.TPPStickers) {
    var estilo = getComputedStyle(document.documentElement);
    window.TPPStickers.pinta($('#stickers'), [
      estilo.getPropertyValue('--cobalto').trim() || '#0038FF',
      estilo.getPropertyValue('--arena').trim() || '#FFD888',
      estilo.getPropertyValue('--crema').trim() || '#F6EFE2',
      estilo.getPropertyValue('--negro-3').trim() || '#2C241E',
    ]);
  }

  /* Coverflow: la tarjeta activa al frente, las demás giradas a los lados */
  (function flow() {
    var stage = $('#flowStage'), dots = $('#flowDots');
    var prev = $('#flowPrev'), next = $('#flowNext');
    if (!stage) return;
    var cards = $$('.pcard', stage);
    if (!cards.length) return;

    // Arranca en la referencia disponible
    var activo = Math.max(0, cfg.vitrina.map(function (v) { return v.estado; }).indexOf('live'));

    if (dots) {
      dots.innerHTML = cards.map(function (_, i) {
        return '<button type="button" aria-label="Ver producto ' + (i + 1) + '"></button>';
      }).join('');
      $$('button', dots).forEach(function (b, i) {
        b.addEventListener('click', function () { ir(i); });
      });
    }

    function ir(i) {
      activo = (i + cards.length) % cards.length;
      cards.forEach(function (c, n) {
        var d = n - activo;
        c.setAttribute('data-pos', Math.abs(d) > 2 ? 'off' : String(d));
        c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        $$('a, button', c).forEach(function (el) { el.tabIndex = d === 0 ? 0 : -1; });
      });
      if (dots) {
        $$('button', dots).forEach(function (b, n) {
          b.setAttribute('aria-current', n === activo ? 'true' : 'false');
        });
      }
    }

    cards.forEach(function (c, i) {
      c.addEventListener('click', function () { if (i !== activo) ir(i); });
    });
    if (prev) prev.addEventListener('click', function () { ir(activo - 1); });
    if (next) next.addEventListener('click', function () { ir(activo + 1); });

    // Arrastre y deslizamiento táctil
    var x0 = null;
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var d = e.clientX - x0; x0 = null;
      if (Math.abs(d) > 45) ir(activo + (d < 0 ? 1 : -1));
    });

    // Flechas del teclado cuando el carrusel tiene el foco
    stage.tabIndex = 0;
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(activo + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); ir(activo - 1); }
    });

    ir(activo);
  })();

  /* Selectores del pedido */
  $('#f-pack').innerHTML = cfg.packs.map(function (p) {
    return '<option value="' + p.id + '"' + (p.id === order.packId ? ' selected' : '') + '>' +
      p.titulo + ' — ' + C.money(p.precio) + '</option>';
  }).join('');
  $('#f-cantidad').innerHTML = [1,2,3,4,5,6,8,10].map(function (n) {
    return '<option value="' + n + '"' + (n === order.cantidad ? ' selected' : '') + '>' + n + '</option>';
  }).join('');
  $('#f-ciudad').innerHTML = cfg.envios.ciudades.map(function (c) {
    return '<option value="' + c.id + '"' + (c.id === order.ciudadId ? ' selected' : '') + '>' +
      c.nombre + '</option>';
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

  $('#cutoffText').textContent =
    'Los pedidos de hoy salen mañana. Cierre de despacho: ' + cfg.envios.cierreDespacho + '.';

  $$('[data-wa]').forEach(function (el) {
    el.href = C.link(null, el.getAttribute('data-wa'));
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* ═══════════════════════════════════════════════ 2. PEDIDO */
  function resumen() {
    var t = C.totals(order);
    var filas = [
      '<div class="sumrow"><span>' + t.pack.titulo + ' × ' + order.cantidad +
        '</span><span>' + C.money(t.subtotal) + '</span></div>',
    ];
    if (t.pct) {
      filas.push('<div class="sumrow sumrow--save"><span>Descuento ' + order.codigo.toUpperCase() +
        ' (-' + t.pct + '%)</span><span>-' + C.money(t.ahorro) + '</span></div>');
    }
    filas.push('<div class="sumrow"><span>Envío · ' + t.ciudad.nombre + '</span><span>' +
      (t.ciudad.retiro ? 'Sin costo' : (t.envioGratis ? 'Gratis' : C.money(t.envio))) + '</span></div>');
    filas.push('<div class="sumrow sumrow--total"><span>Total</span><span>' + C.money(t.total) + '</span></div>');
    $('#summary').innerHTML = filas.join('');

    var nota = $('#shipNote');
    if (t.faltaGratis > 0) {
      nota.hidden = false;
      $('#shipNoteText').innerHTML = 'Te faltan <b>' + C.money(t.faltaGratis) +
        '</b> para el envío gratis en ' + t.ciudad.nombre + '.';
      var pct = Math.max(0, Math.min(100, (t.subtotal - t.ahorro) / cfg.envios.gratisDesde * 100));
      $('#shipBar').style.width = pct + '%';
    } else if (t.envioGratis) {
      nota.hidden = false;
      $('#shipNoteText').innerHTML = '<b>Envío gratis</b> desbloqueado en ' + t.ciudad.nombre + '.';
      $('#shipBar').style.width = '100%';
    } else {
      nota.hidden = true;
    }

    $('#wrap-direccion').hidden = !!t.ciudad.retiro;
  }

  function setCiudad(id, desde) {
    order.ciudadId = id;
    if (desde !== 'radio') {
      var r = $('input[name="ciudad"][value="' + id + '"]');
      if (r) r.checked = true;
    }
    if (desde !== 'select') $('#f-ciudad').value = id;
    resumen();
  }

  $$('input[name="ciudad"]').forEach(function (i) {
    i.addEventListener('change', function () { setCiudad(i.value, 'radio'); });
  });
  $('#f-ciudad').addEventListener('change', function () { setCiudad(this.value, 'select'); });
  $('#f-pack').addEventListener('change', function () { order.packId = this.value; resumen(); });
  $('#f-cantidad').addEventListener('change', function () { order.cantidad = Number(this.value); resumen(); });

  $('#applyCode').addEventListener('click', function () {
    var v = $('#f-codigo').value.trim();
    var pct = C.descuento(v), err = $('#e-codigo');
    if (!v) { order.codigo = ''; err.textContent = ''; err.className = 'err'; resumen(); return; }
    if (pct) { order.codigo = v; err.textContent = 'Código aplicado: -' + pct + '%'; err.className = 'promo-ok'; }
    else { order.codigo = ''; err.textContent = 'Ese código no existe o ya venció.'; err.className = 'err'; }
    resumen();
  });

  var CAMPOS = ['nombre', 'telefono', 'direccion', 'notas'];
  CAMPOS.forEach(function (f) {
    var el = $('#f-' + f); if (!el) return;
    el.addEventListener('input', function () {
      order[f] = el.value;
      var w = el.closest('.field'); if (w) w.classList.remove('has-error');
      var e = $('#e-' + f); if (e) e.textContent = '';
    });
  });

  $('#orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    CAMPOS.forEach(function (f) { var el = $('#f-' + f); if (el) order[f] = el.value; });

    var errs = C.validate(order);
    $$('.field').forEach(function (w) { w.classList.remove('has-error'); });
    ['nombre', 'telefono', 'ciudad', 'direccion'].forEach(function (k) {
      var e2 = $('#e-' + k); if (!e2) return;
      e2.className = 'err';
      e2.textContent = errs[k] || '';
      if (errs[k]) {
        var el = $('#f-' + k);
        if (el && el.closest('.field')) el.closest('.field').classList.add('has-error');
      }
    });

    var keys = Object.keys(errs).filter(function (k) { return k !== 'pack'; });
    if (keys.length) {
      var first = $('#f-' + keys[0]);
      if (first) first.focus();
      if (hasGsap && !reduced) gsap.fromTo('#orderForm', { x: -7 }, { x: 0, duration: .5, ease: 'elastic.out(1,0.35)' });
      return;
    }
    window.open(C.link(order), '_blank', 'noopener');
  });

  resumen();

  /* ═══════════════════════════════════════════════ 3. EFECTOS */
  var fx = window.TPPFx ? window.TPPFx($('#fxField')) : null;

  (function tabs() {
    var list = $('#fxTabs'), panels = $('#fxPanels'), thumb = $('#fxThumb');
    if (!list || !panels) return;
    var datos = cfg.efectos || [];

    panels.innerHTML = datos.map(function (d, i) {
      return '<div class="fxpanel" id="panel-' + d.id + '" role="tabpanel" ' +
        'aria-labelledby="tab-' + d.id + '" tabindex="0"' + (i ? ' hidden' : '') + '>' +
        '<p class="fxpanel__when">' + d.when + '</p>' +
        '<p class="fxpanel__copy">' + d.copy + '</p></div>';
    }).join('');

    list.insertAdjacentHTML('beforeend', datos.map(function (d, i) {
      return '<button class="tab" type="button" role="tab" id="tab-' + d.id + '" ' +
        'aria-controls="panel-' + d.id + '" aria-selected="' + (i === 0) + '"' +
        (i ? ' tabindex="-1"' : '') + '>' + d.label + '</button>';
    }).join(''));

    var btns = $$('.tab', list), media = $('#fxMedia');

    function moveThumb(btn, animate) {
      var x = btn.offsetLeft - list.clientLeft, w = btn.offsetWidth;
      if (hasGsap && animate && !reduced) gsap.to(thumb, { x: x, width: w, duration: .55, ease: 'power3.out' });
      else { thumb.style.width = w + 'px'; thumb.style.transform = 'translate3d(' + x + 'px,0,0)'; }
    }

    function select(i, animate) {
      var d = datos[i];
      btns.forEach(function (b, n) {
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
        b.tabIndex = n === i ? 0 : -1;
      });
      $$('.fxpanel', panels).forEach(function (p, n) {
        if (n === i) {
          p.hidden = false;
          if (hasGsap && animate && !reduced) {
            gsap.fromTo(p.children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .06, ease: 'power2.out' });
          }
        } else { p.hidden = true; }
      });
      moveThumb(btns[i], animate);

      if (media) {
        if (d.video) { media.innerHTML = '<video src="' + d.video + '" muted playsinline loop autoplay></video>'; media.hidden = false; }
        else { media.innerHTML = ''; media.hidden = true; }
      }
      if (fx && !d.video) fx.setTema(d.tema);

      var sec = document.getElementById('efectos');
      if (d.tono && sec) sec.style.setProperty('--bg', d.tono);
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i, true); });
      b.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var n = (i + dir + btns.length) % btns.length;
        btns[n].focus(); select(n, true);
      });
    });

    select(0, false);
    function recolocar() {
      var on = btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0];
      moveThumb(on, false);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recolocar);
    window.addEventListener('resize', recolocar);
  })();

  /* ═══════════════════════════════════════ 4. CAJÓN LATERAL DE PEDIDO */
  (function checkout() {
    var caja = $('#checkout');
    if (!caja) return;
    var panel = caja.querySelector('.drawer__panel');
    var devolver = null;

    function focusables() {
      return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', panel)
        .filter(function (el) { return el.offsetParent !== null; });
    }

    function abrir(origen) {
      if (caja.classList.contains('is-open')) return;
      devolver = origen || document.activeElement;
      caja.hidden = false;
      document.body.classList.add('has-drawer');
      requestAnimationFrame(function () { caja.classList.add('is-open'); });
      var f = focusables();
      if (f[0]) f[0].focus({ preventScroll: true });
    }

    function cerrar() {
      if (!caja.classList.contains('is-open')) return;
      caja.classList.remove('is-open');
      document.body.classList.remove('has-drawer');
      var fin = function () { if (!caja.classList.contains('is-open')) caja.hidden = true; };
      panel.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 420);
      if (devolver && devolver.focus) devolver.focus({ preventScroll: true });
    }

    /* Todo lo que llevaba al módulo de pedido abre el cajón */
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-checkout], a[href="#pedido"]');
      if (t) { e.preventDefault(); abrir(t); return; }
      if (e.target.closest('[data-checkout-close]')) { e.preventDefault(); cerrar(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!caja.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });

    window.abrirPedido = abrir;
  })();

  /* ═══════════════════════════════════════════════ 5. NAV */
  var nav = $('#nav'), hero = $('#hero');
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var links = $$('.nav__side a');
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

  /* ═══════════════════════════════════════════════ 6. ANIMACIÓN */
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: .8 });

    /* Parte cada [data-split] en palabras, respetando los <em> de acento. */
    function partir(el) {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = '1';
      var salida = document.createDocumentFragment(), ultima = null;

      function palabra(contenido) {
        var sp = document.createElement('span');
        sp.className = 'word';
        if (typeof contenido === 'string') sp.textContent = contenido;
        else sp.appendChild(contenido);
        salida.appendChild(sp);
        salida.appendChild(document.createTextNode(' '));
        ultima = sp;
      }

      Array.prototype.slice.call(el.childNodes).forEach(function (nodo) {
        if (nodo.nodeType === 3) {
          var texto = nodo.textContent;
          var pegado = texto.match(/^([.,;:!?)]+)/);
          if (pegado && ultima) {
            ultima.appendChild(document.createTextNode(pegado[1]));
            texto = texto.slice(pegado[1].length);
          }
          texto.split(/\s+/).forEach(function (w) { if (w) palabra(w); });
        } else if (nodo.nodeType === 1) {
          palabra(nodo.cloneNode(true));
        }
      });
      el.innerHTML = '';
      el.appendChild(salida);
    }
    $$('[data-split]').forEach(partir);
    if (!$$('[data-split]').length) { /* esta versión no usa titulares partidos */ }

    gsap.matchMedia().add({
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, function (ctx) {
      if (ctx.conditions.reduce) return;

      /* Entrada del hero: las líneas del eslogan y luego las pegatinas */
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-anim="claim"]', { autoAlpha: 0, yPercent: 40, duration: .95, stagger: .12 })
        .from('.claim .tag', { scale: .7, rotate: -16, duration: .7, ease: 'back.out(2.2)', stagger: .1 }, '-=.5')
        .from('.hero__scroll', { autoAlpha: 0, duration: .7 }, '-=.4');

      /* Las pegatinas se mueven a distinta velocidad: da profundidad al muro */
      $$('.sticker').forEach(function (el) {
        gsap.to(el, {
          y: Number(el.dataset.p) || 0, ease: 'none',
          scrollTrigger: { trigger: '#muro', start: 'top bottom', end: 'bottom top', scrub: .7 },
        });
      });

      /* Las pegatinas del muro entran girando */
      ScrollTrigger.batch('.sticker', {
        start: 'top 92%', once: true,
        onEnter: function (b) {
          gsap.from(b, { autoAlpha: 0, scale: .4, rotate: -40, duration: .8, stagger: .05, ease: 'back.out(1.8)', overwrite: true });
        },
      });

      /* Titulares: el tween se crea dentro de onEnter para que el texto
         esté visible aunque el disparador no llegue a saltar. */
      $$('[data-split]').forEach(function (el) {
        if (el.classList.contains('claim')) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: function () {
            gsap.from(el.querySelectorAll('.word'), {
              autoAlpha: 0, yPercent: 100, duration: .7, stagger: .045, ease: 'power3.out',
            });
          },
        });
      });

      ['up', 'fx'].forEach(function (kind) {
        ScrollTrigger.batch('[data-anim="' + kind + '"]', {
          start: 'top 88%', once: true,
          onEnter: function (b) { gsap.from(b, { autoAlpha: 0, y: 28, duration: .8, stagger: .09, overwrite: true }); },
        });
      });
      ScrollTrigger.batch('[data-anim="stagger"]', {
        start: 'top 86%', once: true, batchMax: 3,
        onEnter: function (b) { gsap.from(b, { autoAlpha: 0, y: 36, duration: .9, stagger: .12, overwrite: true }); },
      });

      /* Paralaje del hero */
      gsap.to('.hero__media', {
        yPercent: 12, scale: 1.06, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
      });
      gsap.to('.claim', {
        yPercent: -16, autoAlpha: .3, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 },
      });
      gsap.to('.hero__scroll', {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: true },
      });

      /* Seguimiento del ratón en las tarjetas */
      if (window.matchMedia('(hover:hover)').matches) {
        $$('.about__fig').forEach(function (card) {
          var qx = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
          var qy = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
          card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            qx(((e.clientX - r.left) / r.width - .5) * 7);
            qy(((e.clientY - r.top) / r.height - .5) * -7);
          });
          card.addEventListener('mouseleave', function () { qx(0); qy(0); });
        });
      }
    });

    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ═══════════════════════════════════════════════ 7. VÍDEO DEL HERO */
  (function heroVideo() {
    var v = $('#heroVideo');
    if (!v) return;
    if (reduced) { v.pause(); return; }
    v.addEventListener('playing', function () { v.classList.add('is-on'); });
    v.addEventListener('error', function () { v.classList.remove('is-on'); });
    var intento = v.play();
    if (intento && intento.catch) intento.catch(function () {});
  })();
})();
