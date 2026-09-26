/* ==========================================================================
   THE POUCH PROJECT — configuración única del sitio
   Cambia SOLO este archivo para precios, número de WhatsApp y catálogo.
   ========================================================================== */
window.TPP = {

  /* ---- CONTACTO -------------------------------------------------------- */
  // ⚠️ REEMPLAZA con el número real, formato internacional SIN "+" ni espacios.
  //    Ecuador = 593 + número sin el 0 inicial.  Ej: 0991234567 -> 593991234567
  whatsapp: '593900000000',
  instagram: 'thepouchproject',
  email: 'hola@thepouchproject.ec',
  ciudad: 'Quito, Ecuador',

  /* ---- PUNTO DE VENTA -------------------------------------------------- */
  puntoVenta: {
    nombre: 'Fitness Inc',
    detalle: 'Retiro en mostrador, sin costo.',
  },
  envio: {
    titulo: 'Envíos a todo el país',
    detalle: 'Servientrega / Laar. 1–3 días laborables.',
  },

  /* ---- CATÁLOGO -------------------------------------------------------- */
  // `stage`: 'live' se vende hoy · 'soon' se muestra como próximamente.
  productos: [
    {
      id: 'nze-peppermint',
      stage: 'live',
      nombre: 'NZE Peppermint',
      categoria: 'Cafeína',
      promesa: 'Energía & foco',
      unidades: '15 pouches por lata',
      descripcion:
        'El pouch de arranque. Menta fría, cero azúcar, cero tabaco. Se coloca entre labio y encía y trabaja mientras tú entrenas, manejas o estudias.',
      tags: ['Sin azúcar', 'Sin tabaco', 'Sin líquido', 'Portátil'],
      opciones: [
        { id: '1x', etiqueta: '1 lata', precio: 12, nota: 'Prueba el formato' },
        { id: '2x', etiqueta: '2 latas · COMBO', precio: 20, nota: 'Ahorras $4', destacado: true },
      ],
    },
    {
      id: 'cafeina-surtido',
      stage: 'soon',
      nombre: 'Surtido de cafeína',
      categoria: 'Etapa 2',
      promesa: 'Variedad & potencia',
      unidades: 'Niveles suave / fuerte',
      descripcion:
        'Más marcas, más sabores y dos niveles de intensidad para que elijas según el día: sesión suave o sesión de récord.',
      tags: ['Varios sabores', 'Suave / fuerte'],
      opciones: [],
    },
    {
      id: 'electrolitos',
      stage: 'soon',
      nombre: 'Electrolitos en pouch',
      categoria: 'Etapa 3',
      promesa: 'Hidratación & recuperación',
      unidades: 'Sodio · potasio · magnesio',
      descripcion:
        'El diferenciador: reposición de sales sin cargar botella ni cafeína extra. Pensado para calor, rutas largas y anti-calambres.',
      tags: ['Cero cafeína', 'Anti-calambres'],
      opciones: [],
    },
  ],

  /* ---- CLIPS DEL HERO -------------------------------------------------- */
  // Deja el array vacío para usar el fondo animado de respaldo.
  // Coloca tus clips en assets/video/ y lístalos aquí (ver assets/video/README.md).
  heroVideos: [
    // { src: 'assets/video/hero-01.mp4', poster: 'assets/img/poster-01.jpg' },
  ],
};
