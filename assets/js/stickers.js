/* ==========================================================================
   THE POUCH PROJECT — pegatinas
   Formas dibujadas en SVG, con el borde blanco de troquel. Se colocan
   alrededor del muro y flotan despacio. Sin imágenes ni peticiones.
   ========================================================================== */
(function (global) {
  'use strict';

  /* Cada forma se dibuja en una caja de 100×100 */
  var FORMAS = {
    llama: 'M50 6c10 18 2 26 10 34 5 5 12 3 14-4 8 12 12 22 12 32 0 20-16 32-36 32S14 88 14 68c0-16 10-28 20-38 8-8 14-14 16-24Z',
    rayo:  'M56 4 22 54h22l-8 42 36-52H50l6-40Z',
    flor:  'M50 8c6 0 9 10 9 18 6-5 15-10 19-6s0 13-5 19c8 0 18 3 18 9s-10 9-18 9c5 6 9 15 5 19s-13-1-19-6c0 8-3 18-9 18s-9-10-9-18c-6 5-15 9-19 5s0-13 5-19c-8 0-18-3-18-9s10-9 18-9c-5-6-9-15-5-19s13 1 19 6c0-8 3-18 9-18Z',
    cara:  'M50 8a42 42 0 1 1 0 84 42 42 0 0 1 0-84Zm-16 28a6 7 0 1 0 0 14 6 7 0 0 0 0-14Zm32 0a6 7 0 1 0 0 14 6 7 0 0 0 0-14ZM30 62h40c0 12-9 20-20 20s-20-8-20-20Z',
    lata:  'M50 16a34 34 0 1 1 0 68 34 34 0 0 1 0-68Zm0 11a23 23 0 1 0 0 46 23 23 0 0 0 0-46Z',
    hoja:  'M50 8c22 10 34 26 34 42 0 22-16 42-34 42S16 72 16 50C16 34 28 18 50 8Zm0 16c-12 8-20 18-20 28 0 14 9 26 20 30Z',
    chispa:'M50 4c4 22 20 38 42 42-22 4-38 20-42 42-4-22-20-38-42-42 22-4 38-20 42-42Z',
    paz:   'M50 8a42 42 0 1 1 0 84 42 42 0 0 1 0-84Zm-6 12v26L28 32a31 31 0 0 0 16 40V20Zm12 0v52a31 31 0 0 0 16-40L56 46V20Z',
  };

  /* Reparto fijo: los bordes se llenan y el centro queda libre para el texto */
  var PLAN = [
    { f: 'llama',  x:  4, y:  8, s: 1.25, r: -14 },
    { f: 'cara',   x: 16, y: 62, s: 1.05, r:  10 },
    { f: 'flor',   x: 28, y: 14, s:  .8,  r:  18 },
    { f: 'rayo',   x:  8, y: 36, s:  .9,  r:  -6 },
    { f: 'lata',   x: 34, y: 80, s: 1.0,  r: -12 },
    { f: 'chispa', x: 48, y:  5, s:  .7,  r:   8 },
    { f: 'hoja',   x: 62, y: 76, s:  .95, r:  16 },
    { f: 'paz',    x: 74, y: 16, s:  .9,  r: -10 },
    { f: 'llama',  x: 88, y: 46, s: 1.15, r:  12 },
    { f: 'flor',   x: 84, y: 62, s:  .62, r:  -8 },
    { f: 'cara',   x: 90, y: 82, s:  .85, r:  -6 },
    { f: 'rayo',   x: 50, y: 93, s:  .7,  r:  14 },
  ];

  function pinta(host, tintas) {
    if (!host) return;
    host.innerHTML = PLAN.map(function (p, i) {
      var tinta = tintas[i % tintas.length];
      return '<span class="sticker" style="' +
        'left:' + p.x + '%; top:' + p.y + '%;' +
        '--s:' + p.s + '; --r:' + p.r + 'deg; --d:' + (i * 0.37).toFixed(2) + 's">' +
        '<svg viewBox="0 0 100 100" aria-hidden="true">' +
          '<path d="' + FORMAS[p.f] + '" fill="' + tinta + '"/>' +
        '</svg></span>';
    }).join('');
  }

  global.TPPStickers = { pinta: pinta, FORMAS: FORMAS };
})(window);
