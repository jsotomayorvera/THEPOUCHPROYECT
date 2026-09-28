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
  whatsapp: '593962618755',   // 0962618755
  instagram: 'pouchproject',
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
  },

  /* ---- TARJETAS DE PRODUCTO -------------------------------------------- */
  // La del medio es la que se vende; las de los lados salen difuminadas
  // con el sello "Próximamente".
  vitrina: [
    { id: 'cafeina', estado: 'soon', titulo: 'Línea con cafeína', sabor: 'Energía',
      foto: 'assets/img/proximo-cafeina.webp' },
    { id: 'nze',     estado: 'live', titulo: 'NZE Peppermint',    sabor: 'Focus · sin cafeína',
      foto: 'assets/img/producto-nze-peppermint.webp' },
    { id: 'electro', estado: 'soon', titulo: 'Electrolitos',      sabor: 'Hidratación',
      foto: 'assets/img/proximo-electrolitos.webp' },
  ],

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
  /* Cuándo usarlos. Cada caso tiene su propia imagen: para cambiarla,
     deja el archivo en assets/img/ y apunta aquí la ruta. Nada más. */
  usos: [
    {
      id: 'entrenamiento', label: 'Entrenamiento',
      foto: 'assets/img/uso-entrenamiento.webp',
      titulo: 'Diez minutos antes de la primera serie',
      copy: 'Te lo pones al calentar y ya estás dentro cuando tocas la barra. Sin líquido ' +
            'que cargar, sin azúcar que te baje a media sesión y sin las manos ocupadas. ' +
            'Aguanta puesto toda la rutina y lo retiras al terminar.',
    },
    {
      id: 'trabajo', label: 'Trabajo',
      foto: 'assets/img/uso-trabajo.webp',
      titulo: 'Para el bloque largo, no para el sprint',
      copy: 'La L-Teanina sostiene una atención tranquila y la L-Tirosina es el precursor que ' +
            'el cerebro gasta bajo presión. Al no llevar azúcar no hay pico de insulina y, ' +
            'por tanto, tampoco la caída de una hora después.',
    },
    {
      id: 'estudio', label: 'Estudio',
      foto: 'assets/img/uso-estudio.webp',
      titulo: 'Sesiones seguidas sin ir por otro café',
      copy: 'Cada pouch trae siempre la misma cantidad, así que dejas de adivinar la dosis. ' +
            'Sin cafeína no te roba el sueño de la noche, que es justo lo que arruina el ' +
            'estudio del día siguiente.',
    },
    {
      id: 'donde-sea', label: 'Donde sea',
      foto: 'assets/img/uso-donde-sea.webp',
      titulo: 'En el bolsillo, en el bolso o en el carro',
      copy: 'No se derrama, no hay que enfriarlo y no necesita agua. Carretera, turno largo, ' +
            'viaje o mudanza: cabe donde quepa una lata pequeña y no deja olor, humo ni ' +
            'nada que limpiar.',
    },
  ],
};
