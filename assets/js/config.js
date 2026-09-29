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
    linea: 'Energy · Nootropic Pouches',
    sabor: 'Peppermint',
    unidades: 15,
    foto: 'assets/img/producto-nze-energy.webp',
    resumen:
      'Pouch nootrópico de menta fría con 50 mg de cafeína por unidad. ' +
      'Energía y foco en el mismo formato: cero azúcar, cero tabaco y sin ' +
      'edulcorantes artificiales.',
    sellos: ['50 mg de cafeína', 'Sin azúcar', 'Sin tabaco', 'Sin edulcorantes artificiales'],
    /* Dosis por pouch, leídas del panel de la lata */
    activos: [
      { nombre: 'Cafeína 50 mg',   rol: 'Chispa',  texto: 'La dosis de una taza de café corta, en un formato que no hay que preparar ni cargar. Entra por la mucosa, así que se nota antes que un café.' },
      { nombre: 'Alpha GPC 40 mg', rol: 'Señal',   texto: 'Precursor de colina que alimenta la acetilcolina, el neurotransmisor de la señal de contracción y de la memoria.' },
      { nombre: 'L-Teanina 40 mg', rol: 'Calma',   texto: 'Aminoácido del té verde. Junto a la cafeína suaviza el filo nervioso: atención sostenida en vez de acelere.' },
      { nombre: 'L-Tirosina 40 mg',rol: 'Reserva', texto: 'Precursor de dopamina y noradrenalina. Su efecto aparece cuando el sistema está exigido: estrés, frío o carga mental alta.' },
    ],
    /* Del panel de la lata, para el aviso legal */
    limite: 'No excedas 2 pouches por hora ni 8 al día, ni 400 mg de cafeína diarios.',
  },

  /* ---- TARJETAS DE PRODUCTO -------------------------------------------- */
  // La del medio es la que se vende; las de los lados salen difuminadas
  // con el sello "Próximamente".
  vitrina: [
    { id: 'focus',   estado: 'soon', titulo: 'Línea Focus',    sabor: 'Sin cafeína',
      foto: 'assets/img/proximo-focus.webp' },
    { id: 'energy',  estado: 'live', titulo: 'NZE Peppermint', sabor: 'Energy · 50 mg cafeína',
      foto: 'assets/img/producto-nze-energy.webp' },
    { id: 'electro', estado: 'soon', titulo: 'Electrolitos',   sabor: 'Hidratación',
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
  // Velocidad del clip del hero. 1 = normal. Por debajo de 0.5 se ve a tirones.
  heroVelocidad: 0.7,

  /* ---- CUÁNDO USARLOS -------------------------------------------------- */
  /* Cuándo usarlos. Cada caso tiene su propia imagen: para cambiarla,
     deja el archivo en assets/img/ y apunta aquí la ruta. Nada más. */
  /* Cuándo usarlos. Los cuatro textos se escriben a la misma medida para
     que el módulo no cambie de alto al saltar de pestaña. Para cambiar una
     imagen, deja el archivo en assets/img/ y apunta aquí la ruta. */
  usos: [
    {
      id: 'entrenamiento', label: 'Entrenamiento',
      foto: 'assets/img/uso-entrenamiento.webp',
      fotoMovil: 'assets/img/uso-entrenamiento-movil.webp',
      titulo: 'Puesto antes de la primera serie',
      copy: 'Te lo pones al calentar y los 50 mg entran antes de la primera serie. Nada que ' +
            'cargar, nada de azúcar que te baje a media sesión y las manos libres. Aguanta ' +
            'toda la rutina puesto y lo retiras al terminar.',
    },
    {
      id: 'trabajo', label: 'Trabajo',
      foto: 'assets/img/uso-trabajo.webp',
      fotoMovil: 'assets/img/uso-trabajo-movil.webp',
      titulo: 'Para el bloque largo, no el sprint',
      copy: 'La cafeína enciende y la L-Teanina le quita el filo nervioso: atención sostenida ' +
            'en vez de acelere. Al no llevar azúcar no hay pico de insulina, y sin pico no ' +
            'llega la caída de la hora siguiente.',
    },
    {
      id: 'estudio', label: 'Estudio',
      foto: 'assets/img/uso-estudio.webp',
      fotoMovil: 'assets/img/uso-estudio-movil.webp',
      titulo: 'Sesiones seguidas, sin otro café',
      copy: 'Cada pouch trae siempre 50 mg, así que dejas de calcular la dosis a ojo como con ' +
            'el café. Sabes exactamente cuánto llevas encima y a qué hora conviene parar para ' +
            'no pagarlo esa noche.',
    },
    {
      id: 'donde-sea', label: 'Donde sea',
      foto: 'assets/img/uso-donde-sea.webp',
      fotoMovil: 'assets/img/uso-donde-sea-movil.webp',
      titulo: 'Va donde vayas, sin cargar nada',
      copy: 'No se derrama, no pide agua y no necesita frío. Carretera, turno largo, viaje o ' +
            'mudanza: te da la cafeína de un café donde no hay dónde comprarlo, y no deja ' +
            'atrás humo, olor ni un vaso que lavar.',
    },
  ],
};
