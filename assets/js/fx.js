/* ==========================================================================
   THE POUCH PROJECT — animaciones del módulo de efectos
   Un tema por pestaña, dibujado en canvas. Sin librerías, sin imágenes y
   sin peticiones de red. El lenguaje visual sale del nicho: frío de menta,
   ritmo de carrera, repetición diaria y progresión.
   ========================================================================== */
(function (global) {
  'use strict';

  var REDUCED = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Paleta de marca en RGB, para mezclar con alfa sin repetir literales */
  var INK = '0,63,37', INK3 = '60,132,98', SAGE = '150,190,165';

  /* ---------------------------------------------------------------- TEMAS */
  var TEMAS = {

    /* Minutos — el golpe de frío: ondas que nacen del centro y cristales */
    frost: function (ctx, w, h, t, seed) {
      var cx = w / 2, cy = h / 2;
      for (var i = 0; i < 5; i++) {
        var p = ((t / 3400) + i / 5) % 1;
        var r = Math.max(0, p * Math.max(w, h) * 0.62);
        if (r < 0.5) continue;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 6.2832);
        ctx.strokeStyle = 'rgba(' + INK3 + ',' + (0.20 * (1 - p)) + ')';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      for (var j = 0; j < seed.length; j++) {
        var s = seed[j];
        var y = ((s.y + t * 0.000034 * s.v) % 1.25) - 0.12;
        var x = s.x + Math.sin(t * 0.0004 + s.p) * 0.02;
        var size = s.r * Math.min(w, h) * 0.05;
        ctx.save();
        ctx.translate(x * w, y * h);
        ctx.rotate(t * 0.0003 * s.v + s.p);
        ctx.beginPath();
        for (var k = 0; k < 6; k++) {
          var a = k * Math.PI / 3;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        }
        ctx.strokeStyle = 'rgba(' + SAGE + ',' + (0.42 * s.o) + ')';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      }
    },

    /* Horas — ritmo sostenido: estelas horizontales a velocidad constante */
    pace: function (ctx, w, h, t, seed) {
      for (var i = 0; i < seed.length; i++) {
        var s = seed[i];
        var len = (0.14 + s.r * 0.5) * w;
        var x = ((s.x + t * 0.000075 * s.v) % 1.4) * w - len;
        var y = s.y * h;
        var g = ctx.createLinearGradient(x, y, x + len, y);
        g.addColorStop(0, 'rgba(' + INK3 + ',0)');
        g.addColorStop(0.55, 'rgba(' + INK3 + ',' + (0.30 * s.o) + ')');
        g.addColorStop(1, 'rgba(' + INK3 + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, len, 1 + s.r * 2.6);
      }
    },

    /* Días — repetición: barras que suben y bajan como un día tras otro */
    pulse: function (ctx, w, h, t, seed) {
      var n = 26, gap = w / n;
      for (var i = 0; i < n; i++) {
        var ph = i * 0.42;
        var a = (Math.sin(t / 900 + ph) + 1) / 2;
        var bh = (0.06 + a * 0.30) * h;
        var x = i * gap + gap * 0.28;
        var g = ctx.createLinearGradient(0, h / 2 - bh / 2, 0, h / 2 + bh / 2);
        g.addColorStop(0, 'rgba(' + INK + ',0)');
        g.addColorStop(0.5, 'rgba(' + INK + ',' + (0.13 + a * 0.10) + ')');
        g.addColorStop(1, 'rgba(' + INK + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(x, h / 2 - bh / 2, Math.max(2, gap * 0.28), bh);
      }
      if (seed.length) { /* el tema no usa semillas, pero mantiene la firma */ }
    },

    /* Largo plazo — progresión: diagonales que ascienden y convergen */
    climb: function (ctx, w, h, t, seed) {
      for (var i = 0; i < seed.length; i++) {
        var s = seed[i];
        var p = ((s.x + t * 0.000042 * s.v) % 1.2) - 0.1;
        var x0 = p * w * 1.25 - w * 0.2;
        var y0 = h + 20;
        var x1 = x0 + w * 0.42;
        var y1 = -20;
        var g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, 'rgba(' + INK3 + ',0)');
        g.addColorStop(0.5, 'rgba(' + INK3 + ',' + (0.24 * s.o) + ')');
        g.addColorStop(1, 'rgba(' + SAGE + ',0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1 + s.r * 2.4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    },
  };

  function seedOf(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
      a.push({
        x: Math.random(), y: Math.random(),
        r: Math.random(), v: 0.6 + Math.random() * 1.1,
        o: 0.45 + Math.random() * 0.55, p: Math.random() * 6.28,
      });
    }
    return a;
  }

  /**
   * Crea el lienzo de efectos.
   * @param {HTMLCanvasElement} canvas
   * @returns {{setTema:function(string), start:function, stop:function}|null}
   */
  function createFx(canvas) {
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var w = 0, h = 0, dpr = 1, t = 0, raf = null, running = false, last = 0;
    var tema = 'frost', seed = seedOf(22);
    var fade = 1;   // 0→1 al cambiar de tema, para que el cambio no sea un corte

    function resize() {
      var r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      w = Math.round(r.width); h = Math.round(r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      fade = Math.min(1, fade + 0.035);
      ctx.globalAlpha = fade;
      (TEMAS[tema] || TEMAS.frost)(ctx, w, h, t, seed);
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      if (!running) return;
      t += Math.max(0, Math.min(now - last, 48));
      last = now;
      frame();
      raf = global.requestAnimationFrame(loop);
    }

    function start() {
      if (running || REDUCED) return;
      running = true; last = performance.now();
      raf = global.requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (raf) global.cancelAnimationFrame(raf);
      raf = null;
    }

    if (!resize()) return null;
    frame();

    if (global.ResizeObserver) new ResizeObserver(function () { if (resize()) frame(); }).observe(canvas);
    if (global.IntersectionObserver && !REDUCED) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }, { threshold: 0.01 })
        .observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : (canvas.getBoundingClientRect().bottom > 0 && start());
    });

    return {
      setTema: function (v) {
        if (v === tema || !TEMAS[v]) return;
        tema = v; seed = seedOf(22); fade = 0;
        if (REDUCED) { fade = 1; frame(); }
      },
      start: start, stop: stop,
    };
  }

  global.TPPFx = createFx;
})(window);
