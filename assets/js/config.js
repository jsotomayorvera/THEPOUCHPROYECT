/* ==========================================================================
   THE POUCH PROJECT — configuración única del sitio
   Todo lo editable vive aquí: contacto, producto, packs, envíos y descuentos.
   ========================================================================== */
window.TPP = {

  /* ---- MARCA ----------------------------------------------------------- */
  marca: {
    tagline: 'Pouches de rendimiento en pequeños lotes, elegidos uno a uno, ' +
             'para foco limpio sin azúcar, sin tabaco y sin cargar nada.',
  },

  /* ---- CONTACTO -------------------------------------------------------- */
  // ⚠️ REEMPLAZA con el número real, formato internacional SIN "+" ni espacios.
  //    Ecuador = 593 + número sin el 0 inicial.  Ej: 0991234567 -> 593991234567
  whatsapp: '593900000000',
  instagram: 'thepouchproject',
  email: 'hola@thepouchproject.ec',

  /* ---- PRODUCTO -------------------------------------------------------- */
  // Datos tomados de la lata. Las dosis por pouch no están impresas en el
  // envase: complétalas cuando las tengas de la ficha del fabricante.
  producto: {
    nombre: 'NZE Peppermint',
    linea: 'Focus · Nootropic Pouches',
    sabor: 'Peppermint',
    unidades: 15,
    foto: 'assets/img/producto-nze-peppermint.jpg',
    resumen:
      'Pouch nootrópico de menta fría. Sostiene la atención sin estimulante: ' +
      'cero cafeína, cero azúcar, cero tabaco y sin edulcorantes artificiales.',
    sellos: ['Sin cafeína', 'Sin azúcar', 'Sin tabaco', 'Sin edulcorantes artificiales'],
    activos: [
      { nombre: 'Alpha GPC',   rol: 'Señal',   texto: 'Precursor de colina que alimenta la acetilcolina, el neurotransmisor de la señal de contracción y de la memoria.' },
      { nombre: 'L-Tirosina',  rol: 'Reserva', texto: 'Precursor de dopamina y noradrenalina. Su efecto aparece cuando el sistema está exigido: estrés, frío o carga mental alta.' },
      { nombre: 'L-Teanina',   rol: 'Calma',   texto: 'Aminoácido del té verde asociado a una atención tranquila, sin el filo nervioso de un estimulante.' },
    ],
    // Sabores de la línea. `activo:false` = todavía no lo traemos.
    sabores: [
      { nombre: 'Peppermint',   activo: true  },
      { nombre: 'Black Cherry', activo: false },
    ],
  },

  /* ---- PACKS ----------------------------------------------------------- */
  packs: [
    { id: '1x', titulo: '1 lata',  latas: 1, precio: 12, nota: 'Prueba el formato' },
    { id: '2x', titulo: '2 latas', latas: 2, precio: 20, nota: 'Ahorras $4', destacado: true },
  ],

  /* ---- ENVÍOS ---------------------------------------------------------- */
  // ⚠️ Precios y tiempos de ejemplo tomados de tu maqueta: ajústalos a tus
  //    tarifas reales antes de publicar.
  envios: {
    ciudades: [
      { id: 'gye',    nombre: 'Guayaquil',          precio: 2.50, eta: 'Entrega en 24 h' },
      { id: 'uio',    nombre: 'Quito',              precio: 3.50, eta: 'Entrega en 24 a 48 h' },
      { id: 'cue',    nombre: 'Cuenca',             precio: 3.50, eta: 'Entrega en 24 a 48 h' },
      { id: 'otras',  nombre: 'Otras ciudades',     precio: 4.50, eta: 'Entrega en 48 a 72 h' },
      { id: 'retiro', nombre: 'Retiro en persona',  precio: 0,    eta: 'Coordinamos punto y hora', retiro: true },
    ],
    // Envío gratis a partir de este subtotal (solo ciudades con `gratisAplica`).
    gratisDesde: 30,
    gratisEn: ['gye'],
    cierreDespacho: '18:00',
  },

  /* ---- DESCUENTOS ------------------------------------------------------ */
  // Código en MAYÚSCULAS -> porcentaje sobre el subtotal.
  descuentos: { POUCH10: 10 },

  /* ---- CLIPS DEL HERO -------------------------------------------------- */
  // Vacío = se usa el fondo animado de respaldo.
  // Ver assets/video/README.md para formato, peso y encuadre.
  heroVideos: [
    // { src: 'assets/video/hero-01.mp4', poster: 'assets/img/poster-01.jpg' },
  ],
};
