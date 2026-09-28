/* ==========================================================================
   THE POUCH PROJECT — pegatinas
   Formas de velocidad y atletismo dibujadas en SVG, con el borde blanco de
   troquel. Flotan y se mueven con el scroll. Sin imágenes ni peticiones.
   ========================================================================== */
(function (global) {
  'use strict';

  /* Cada forma se dibuja dentro de una caja de 100×100 */
  var FORMAS = {
    rayo:     'M58 4 20 56h24l-6 40 38-54H50l8-38Z',
    chevron:  'M12 14 44 50 12 86l16 0 32-36L28 14H12Zm34 0 32 36-32 36h16l32-36-32-36H46Z',
    crono:    'M50 14a36 36 0 1 1 0 72 36 36 0 0 1 0-72Zm0 12a24 24 0 1 0 0 48 24 24 0 0 0 0-48Zm-4 6h8v18l12 8-4 7-16-11V32ZM38 2h24v9H38V2Z',
    diana:    'M50 8a42 42 0 1 1 0 84 42 42 0 0 1 0-84Zm0 13a29 29 0 1 0 0 58 29 29 0 0 0 0-58Zm0 13a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z',
    pesa:     'M14 34h12v32H14V34Zm60 0h12v32H74V34ZM28 42h6v16h-6V42Zm38 0h6v16h-6V42ZM36 45h28v10H36V45ZM4 44h8v12H4V44Zm84 0h8v12h-8V44Z',
    flecha:   'M22 78 68 32H40V18h52v52H78V42L32 88l-10-10Z',
    bandera:  'M18 6h8v88h-8V6Zm12 4h56v18H66v18H48V28H30V10Zm18 18h18v18H48V28Zm18 18h20v18H66V46Zm-36 0h18v18H30V46Z',
    estela:   'M6 26h62c7 0 7 12 0 12H6c-7 0-7-12 0-12Zm22 22h60c7 0 7 12 0 12H28c-7 0-7-12 0-12Zm-18 22h52c7 0 7 12 0 12H10c-7 0-7-12 0-12Z',
    lata:     'M50 16a34 34 0 1 1 0 68 34 34 0 0 1 0-68Zm0 11a23 23 0 1 0 0 46 23 23 0 0 0 0-46Z',
  };

  /* Reparto fijo: los bordes se llenan y el centro queda libre para el texto.
     `p` es el factor de paralaje: cuánto se mueve la pegatina con el scroll. */
  var PLAN = [
    { f: 'rayo',    x:  5, y: 12, s: 1.25, r: -12, p:  38 },
    { f: 'chevron', x: 17, y: 64, s: 1.05, r:   8, p: -26 },
    { f: 'diana',   x: 29, y: 15, s:  .82, r:  16, p:  22 },
    { f: 'estela',  x:  8, y: 40, s:  .95, r:  -6, p: -34 },
    { f: 'lata',    x: 33, y: 82, s: 1.0,  r: -12, p:  30 },
    { f: 'flecha',  x: 48, y:  5, s:  .72, r:   9, p: -20 },
    { f: 'pesa',    x: 63, y: 78, s:  .98, r:  14, p:  36 },
    { f: 'crono',   x: 74, y: 14, s:  .9,  r: -10, p: -28 },
    { f: 'rayo',    x: 90, y: 44, s: 1.12, r:  13, p:  24 },
    { f: 'bandera', x: 84, y: 64, s:  .66, r:  -8, p: -18 },
    { f: 'chevron', x: 92, y: 84, s:  .82, r:  -5, p:  32 },
    { f: 'estela',  x: 50, y: 93, s:  .72, r:  12, p: -24 },
  ];

  function pinta(host, tintas) {
    if (!host) return [];
    host.innerHTML = PLAN.map(function (p, i) {
      var tinta = tintas[i % tintas.length];
      return '<span class="sticker" data-p="' + p.p + '" style="' +
        'left:' + p.x + '%; top:' + p.y + '%;' +
        '--s:' + p.s + '; --r:' + p.r + 'deg; --d:' + (i * 0.37).toFixed(2) + 's">' +
        '<svg viewBox="0 0 100 100" aria-hidden="true">' +
          '<path d="' + FORMAS[p.f] + '" fill="' + tinta + '"/>' +
        '</svg></span>';
    }).join('');
    return Array.prototype.slice.call(host.children);
  }

  global.TPPStickers = { pinta: pinta, FORMAS: FORMAS };
})(window);
