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
  puntoVenta: { nombre: 'Fitness Inc', detalle: 'Retiro en mostrador, sin costo.' },
  envio:      { titulo: 'Envíos a todo el país', detalle: 'Servientrega / Laar. 1–3 días laborables.' },

  /* ---- CATÁLOGO -------------------------------------------------------- */
  // `stage`: 'live' se vende hoy · 'soon' se muestra como próximamente.
  // `foto`: ruta de la imagen del producto. Si el archivo no existe, la web
  //         dibuja una lata de respaldo en CSS y no se rompe nada.
  productos: [
    {
      id: 'nze-peppermint-focus',
      stage: 'live',
      nombre: 'NZE Peppermint',
      categoria: 'Foco · sin cafeína',
      promesa: 'Foco & calma activa',
      unidades: '15 pouches por lata',
      foto: 'assets/img/producto-nze-peppermint.jpg',
      descripcion:
        'Pouch nootrópico de menta fría. Alpha GPC, L-Tirosina y L-Teanina para sostener ' +
        'la atención sin estimulante: cero cafeína, cero azúcar, cero tabaco y sin ' +
        'edulcorantes artificiales. Se coloca entre labio y encía y trabaja mientras entrenas, ' +
        'manejas o estudias.',
      tags: ['Sin cafeína', 'Sin azúcar', 'Sin tabaco', 'Sin edulcorantes artificiales'],
      activos: ['Alpha GPC', 'L-Tirosina', 'L-Teanina'],
      opciones: [
        { id: '1x', etiqueta: '1 lata', precio: 12, nota: 'Prueba el formato' },
        { id: '2x', etiqueta: '2 latas · combo', precio: 20, nota: 'Ahorras $4', destacado: true },
      ],
    },
    {
      id: 'cafeina',
      stage: 'soon',
      nombre: 'Línea con cafeína',
      categoria: 'Etapa 2',
      promesa: 'Energía & potencia',
      unidades: 'Niveles suave / fuerte',
      descripcion:
        'Para quien sí quiere estimulante. Dos niveles de intensidad y varios sabores, ' +
        'para elegir según el día: sesión suave o sesión de récord.',
      tags: [], activos: [], opciones: [],
    },
    {
      id: 'electrolitos',
      stage: 'soon',
      nombre: 'Electrolitos en pouch',
      categoria: 'Etapa 3',
      promesa: 'Hidratación & recuperación',
      unidades: 'Sodio · potasio · magnesio',
      descripcion:
        'El diferenciador: reposición de sales sin cargar botella. Pensado para calor, ' +
        'rutas largas y anti-calambres.',
      tags: [], activos: [], opciones: [],
    },
  ],

  /* ---- CLIPS DEL HERO -------------------------------------------------- */
  // Deja el array vacío para usar el campo animado de respaldo.
  // Coloca tus clips en assets/video/ y lístalos aquí (ver assets/video/README.md).
  heroVideos: [
    // { src: 'assets/video/hero-01.mp4', poster: 'assets/img/poster-01.jpg' },
  ],
};
