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
  // Formato internacional SIN "+" ni espacios: 593 + número sin el 0 inicial.
  whatsapp: '593940238603',   // 0940238603
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
    foto: 'assets/img/producto-nze-peppermint.webp',
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
    { src: 'assets/video/hero.mp4', poster: 'assets/img/poster-hero.jpg' },
  ],

  /* ---- MÓDULO DE EFECTOS ----------------------------------------------- */
  // Cada pestaña tiene su propia animación de fondo, generada en código.
  // Si consigues un clip real para alguna, añade `video: 'assets/video/xxx.mp4'`
  // y esa pestaña lo usará en lugar de la animación.
  efectos: [
    {
      id: 'minutos', label: 'Minutos', when: '0 – 10 minutos', tema: 'frost', tono: '#DCEFE2',
      copy: 'El frescor de la menta llega al primer segundo. Mientras el pouch sigue puesto, ' +
            'los activos se liberan por la mucosa de la boca, una vía muy vascularizada que entra ' +
            'a circulación sin pasar primero por el hígado. Enciendes sin haber tomado un mililitro de líquido.',
    },
    {
      id: 'horas', label: 'Horas', when: '1 – 3 horas', tema: 'pace', tono: '#DEEAF1',
      copy: 'La ventana de trabajo. La L-Teanina sostiene una atención tranquila y la L-Tirosina es ' +
            'el precursor que el cerebro gasta bajo presión. Sin azúcar no hay pico de insulina y, ' +
            'por tanto, no hay caída reactiva una hora después.',
    },
    {
      id: 'dias', label: 'Días', when: 'Día tras día', tema: 'pulse', tono: '#F0E4CB',
      copy: 'Un pouch trae siempre la misma cantidad, así que dejas de adivinar la dosis. Nada que ' +
            'cargar, nada que enfriar, nada que manche el esmalte. Y si quieres cortar, lo retiras: ' +
            'con una lata ya te la tomaste.',
    },
    {
      id: 'largo', label: 'A largo plazo', when: 'A largo plazo', tema: 'climb', tono: '#E3EDDF',
      copy: 'Cambias la lata azucarada por un formato limpio y controlas tu día real. Cuando lleguen ' +
            'la línea con cafeína y los electrolitos se cierra el círculo: foco para la cabeza, ' +
            'energía para arrancar, sales para recuperar.',
    },
  ],
};
