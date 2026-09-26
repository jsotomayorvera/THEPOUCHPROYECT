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
  $('#mailLink').href = 'mailto:' + cfg.email;
  $('#mailLink').textContent = cfg.email;
  $('#igLink').href = 'https://instagram.com/' + cfg.instagram;
  $('#igLink').textContent = '@' + cfg.instagram;
  $('#igFoot').textContent = '@' + cfg.instagram;
  $('#zonaLine').textContent = 'Ecuador · 24–72 h';

  /* Vitrina de producto */
  $('#cards').innerHTML = cfg.vitrina.map(function (v) {
    var live = v.estado === 'live';
    return '<article class="card ' + (live ? 'card--live' : 'card--soon') + '" data-anim="stagger">' +
      '<div class="card__media">' +
        '<img src="' + v.foto + '" alt="' + (live ? v.titulo : '') + '" loading="lazy" width="1100" height="1100">' +
        (live ? '' : '<p class="card__flag">Próximamente</p>') +
      '</div>' +
      '<div class="card__bar">' +
        '<div class="card__name"><span>' + v.sabor + '</span><b>' + v.titulo + '</b></div>' +
        (live
          ? '<a class="btn" href="#pedido">Pedir</a>'
          : '<a class="btn btn--ghost" data-wa="aviso" href="#">Avísame</a>') +
      '</div></article>';
  }).join('');

  /* Selectores del pedido */
  $('#f-pack').innerHTML = cfg.packs.map(function (p) {
    return '<option value="' + p.id + '"' + (p.id === order.packId ? ' selected' : '') + '>' +
      p.titulo + ' — ' + C.money(p.precio) + '</option>';
  }).join('');
  $('#f-ciudad').innerHTML = cfg.envios.ciudades.map(function (c) {
    var extra = c.precio === 0 ? 'sin costo' : C.money(c.precio);
    return '<option value="' + c.id + '"' + (c.id === order.ciudadId ? ' selected' : '') + '>' +
      c.nombre + ' — ' + extra + '</option>';
  }).join('');

  $$('[data-wa]').forEach(function (el) {
    el.href = C.link(null, el.getAttribute('data-wa'));
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* ═══════════════════════════════════════════════ 2. PEDIDO */
  function resumen() {
    var t = C.totals(order);
    var envio = t.ciudad.retiro ? 'retiro sin costo'
              : t.envioGratis ? 'envío gratis'
              : 'envío ' + C.money(t.envio);
    $('#totalNote').textContent = t.pack.titulo + ' × ' + order.cantidad + ' · ' + envio +
      ' · total ' + C.money(t.total);
    $('#wrap-direccion').hidden = !!t.ciudad.retiro;
  }

  var CAMPOS = ['nombre', 'telefono', 'direccion', 'notas'];
  CAMPOS.forEach(function (f) {
    var el = $('#f-' + f); if (!el) return;
    el.addEventListener('input', function () {
      order[f] = el.value;
      var w = el.closest('.field'); if (w) w.classList.remove('has-error');
      var e = $('#e-' + f); if (e) e.textContent = '';
    });
  });
  $('#f-pack').addEventListener('change', function () { order.packId = this.value; resumen(); });
  $('#f-ciudad').addEventListener('change', function () { order.ciudadId = this.value; resumen(); });

  $('#orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    CAMPOS.forEach(function (f) { var el = $('#f-' + f); if (el) order[f] = el.value; });

    var errs = C.validate(order);
    $$('.field').forEach(function (w) { w.classList.remove('has-error'); });
    ['nombre', 'telefono', 'ciudad', 'direccion'].forEach(function (k) {
      var e2 = $('#e-' + k); if (!e2) return;
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
      if (d.tono && sec) {
        sec.dataset.tone = d.tono;
        sec.style.setProperty('--bg', d.tono);
        if (toneOwner === sec) setTone(d.tono);
      }
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

  /* ═══════════════════════════════════════════════ 4. TONO DE LA PÁGINA */
  var toneNow = '', toneOwner = null;
  function setTone(hex) {
    if (!hex || hex === toneNow) return;
    toneNow = hex;
    document.body.style.backgroundColor = hex;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', hex);
  }

  (function tones() {
    var secciones = $$('[data-tone]');
    if (!('IntersectionObserver' in window) || !secciones.length) return;
    var io = new IntersectionObserver(function (entries) {
      var mejor = null;
      entries.forEach(function (e) {
        if (e.isIntersecting && (!mejor || e.intersectionRatio > mejor.intersectionRatio)) mejor = e;
      });
      if (mejor) { toneOwner = mejor.target; setTone(mejor.target.dataset.tone); }
    }, { threshold: [0.12, 0.35, 0.6], rootMargin: '-25% 0px -25% 0px' });
    secciones.forEach(function (s) { io.observe(s); });
  })();

  /* ═══════════════════════════════════════════════ 5. NAV */
  var nav = $('#nav'), hero = $('#hero');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90); }
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

    gsap.matchMedia().add({
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, function (ctx) {
      if (ctx.conditions.reduce) return;

      /* Entrada del hero: solo el eslogan, palabra a palabra */
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero__claim .word', { autoAlpha: 0, yPercent: 110, duration: 1, stagger: .09 })
        .from('.hero__scroll', { autoAlpha: 0, duration: .7 }, '-=.3');

      /* Titulares: el tween se crea dentro de onEnter para que el texto
         esté visible aunque el disparador no llegue a saltar. */
      $$('[data-split]').forEach(function (el) {
        if (el.classList.contains('hero__claim')) return;
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
      gsap.to('.hero__claim', {
        yPercent: -16, autoAlpha: .3, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 },
      });
      gsap.to('.hero__scroll', {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: true },
      });

      /* El rótulo del pie se desplaza al pasar: da sensación de remate */
      gsap.to('.footer__word span', {
        xPercent: -4, ease: 'none',
        scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: .8 },
        startAt: { xPercent: 4 },
      });

      /* Seguimiento del ratón en las tarjetas */
      if (window.matchMedia('(hover:hover)').matches) {
        $$('.pop, .card').forEach(function (card) {
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
