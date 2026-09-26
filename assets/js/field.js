/* ==========================================================================
   THE POUCH PROJECT — campo iridiscente
   Fondo animado sobre base clara: mancha de color en movimiento + burbujas
   con borde tornasolado. Sin librerías, sin imágenes, sin peticiones.
   ========================================================================== */
(function (global) {
  'use strict';

  var REDUCED = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createField(canvas, opts) {
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var o = Object.assign({
      bubbles: 16,     // cuántas burbujas
      intensity: 1,    // fuerza del color (0–1.4)
      speed: 1,        // multiplicador de velocidad
      hue: 150,        // matiz base: 150 = verde menta de marca
    }, opts || {});

    var w = 0, h = 0, dpr = 1;
    var blobs = [], bubbles = [];
    var hue = o.hue, hueTarget = o.hue;
    var raf = null, running = false, t = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function seed() {
      var d = Math.min(w, h);
      blobs = [
        { x: 0.18, y: 0.24, r: 0.78, sx: 0.00021, sy: 0.00014, ph: 0.0,  h: 0,   a: 0.55 },
        { x: 0.84, y: 0.66, r: 0.72, sx: -0.00017, sy: 0.00019, ph: 1.7, h: 42,  a: 0.50 },
        { x: 0.52, y: 0.92, r: 0.66, sx: 0.00013, sy: -0.00022, ph: 3.1, h: -38, a: 0.42 },
      ];
      bubbles = [];
      for (var i = 0; i < o.bubbles; i++) {
        bubbles.push({
          x: Math.random(), y: Math.random(),
          r: rnd(0.045, 0.19) * (d / Math.max(w, h) + 0.7),
          vx: rnd(-0.00016, 0.00016), vy: rnd(-0.00022, -0.00005),
          h: rnd(-60, 120), a: rnd(0.22, 0.52), spin: rnd(-0.3, 0.3),
        });
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      w = Math.round(rect.width); h = Math.round(rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bubbles.length) seed();
      return true;
    }

    function paintBlob(b) {
      var cx = (b.x + Math.sin(t * b.sx * 1000 + b.ph) * 0.09) * w;
      var cy = (b.y + Math.cos(t * b.sy * 1000 + b.ph) * 0.08) * h;
      var r = b.r * Math.max(w, h) * 0.62;
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      var hh = hue + b.h;
      g.addColorStop(0, 'hsla(' + hh + ',62%,84%,' + (b.a * o.intensity) + ')');
      g.addColorStop(0.55, 'hsla(' + (hh + 26) + ',58%,88%,' + (b.a * 0.45 * o.intensity) + ')');
      g.addColorStop(1, 'hsla(' + (hh + 50) + ',55%,92%,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function paintBubble(b) {
      var cx = b.x * w, cy = b.y * h;
      var r = b.r * Math.min(w, h) * 0.9;
      if (r < 2) return;
      var hh = hue + b.h + Math.sin(t * 0.0004 + b.spin) * 18;
      var g = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.3, r * 0.04, cx, cy, r);
      g.addColorStop(0.00, 'hsla(' + (hh + 40) + ',80%,97%,' + (b.a * 0.55) + ')');
      g.addColorStop(0.46, 'hsla(' + (hh + 8)  + ',70%,90%,' + (b.a * 0.16) + ')');
      g.addColorStop(0.74, 'hsla(' + (hh + 62) + ',75%,84%,' + (b.a * 0.34) + ')');
      g.addColorStop(0.90, 'hsla(' + (hh + 148) + ',78%,82%,' + (b.a * 0.62) + ')');
      g.addColorStop(0.985, 'hsla(' + (hh + 210) + ',82%,90%,' + (b.a * 0.8) + ')');
      g.addColorStop(1.00, 'hsla(' + (hh + 240) + ',80%,88%,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();

      // reflejo especular: lo que hace que lea como burbuja y no como mancha
      var s = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, 0, cx - r * 0.34, cy - r * 0.38, r * 0.34);
      s.addColorStop(0, 'rgba(255,255,255,' + (b.a * 0.75) + ')');
      s.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = s;
      ctx.beginPath(); ctx.arc(cx - r * 0.34, cy - r * 0.38, r * 0.34, 0, 6.2832); ctx.fill();
    }

    function frame(dt) {
      hue += (hueTarget - hue) * 0.045;

      var base = ctx.createLinearGradient(0, 0, w * 0.35, h);
      base.addColorStop(0, '#FBF7EE');
      base.addColorStop(1, '#F1EBDC');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < blobs.length; i++) paintBlob(blobs[i]);

      for (var j = 0; j < bubbles.length; j++) {
        var b = bubbles[j];
        b.x += b.vx * dt * o.speed;
        b.y += b.vy * dt * o.speed;
        if (b.y < -0.28) { b.y = 1.28; b.x = Math.random(); }
        if (b.x < -0.3) b.x = 1.3;
        if (b.x > 1.3) b.x = -0.3;
        paintBubble(b);
      }
    }

    var last = 0;
    function loop(now) {
      if (!running) return;
      var dt = Math.min(now - last, 48);
      last = now;
      t += dt;
      frame(dt);
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
    frame(16);                 // un fotograma siempre pintado, aunque no se anime
    if (REDUCED) { t = 4000; frame(16); }

    var ro = global.ResizeObserver ? new ResizeObserver(function () {
      if (resize()) frame(16);
    }) : null;
    if (ro) ro.observe(canvas);

    // Solo gasta CPU mientras se ve
    if (global.IntersectionObserver && !REDUCED) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.01 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : (canvas.getBoundingClientRect().bottom > 0 && start());
    });

    return {
      setHue: function (v) { hueTarget = v; },
      start: start,
      stop: stop,
    };
  }

  global.TPPField = createField;
})(window);
