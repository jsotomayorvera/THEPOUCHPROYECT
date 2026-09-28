# The Pouch Project — landing page

Landing de una sola página para **The Pouch Project**, la primera tienda de pouches de
rendimiento del Ecuador. Eslogan: **RINDE SIN LÍMITES**.

Venta 100 % por WhatsApp: no hay carrito, ni cuenta, ni pasarela de pago. El visitante
arma su pedido y el botón abre WhatsApp con el mensaje ya escrito.

## Cómo verla

Es un sitio estático: no hay build, ni dependencias, ni `npm install`.

```bash
# opción 1 — abrir directo
open index.html

# opción 2 — servidor local (recomendado, para que carguen bien las fuentes)
python3 -m http.server 8080
# → http://localhost:8080
```

Para publicarla sirve cualquier hosting estático: GitHub Pages, Netlify, Vercel o
Cloudflare Pages. Se sube la carpeta tal cual.

## La paleta

Viven al principio de `assets/css/styles.css`, en un bloque marcado.
Cambiar esos valores cambia la página entera:

```css
--tierra:#4A271F;   /* TIERRA — fondo dominante, plano */
--cobalto:#0038FF;  /* HYPER COBALT — bloques, nav sólido, botones */
--arena:#FFD888;    /* SKIN SAND — cajas, tarjetas y pie */
--negro:#0A0A0E;    /* tinta sobre arena */
--crema:#FBF7EF;    /* tinta sobre tierra y cobalto */
--coral:#FF5A3C;    /* acento cálido */
--menta:#7FE3C0;    /* acento frío */
```

Cómo se reparten: el fondo es tierra plana de arriba abajo. El cobalto
entra en bloques enteros (el módulo de efectos, el menú al hacer scroll,
la cabecera del cajón de pedido) y en los botones. La arena es toda
superficie que lleva texto largo: tarjetas, preguntas, formulario y pie.
Coral y menta aparecen en dosis pequeñas.

**Texto flotante.** Nada del texto que va sobre el fondo está impreso en
él: lleva una sombra dura pegada más una larga difusa (`--lift-txt`, y
`--lift-display` para los titulares), y las cajas llevan sombra dura sin
desenfoque (`--lift`). Eso es lo que da la sensación de capas despegadas.
Dentro de las cajas claras la sombra se anula.

El verde de marca (`--verde`) se conserva aparte, solo para el logo.

## Lo primero que tienes que cambiar

Abre **`assets/js/config.js`**. Todo lo editable está ahí y en un solo lugar:

| Campo | Qué es |
|---|---|
| `whatsapp` | ⚠️ **Obligatorio.** Tu número real, formato internacional sin `+`. Ecuador: `593` + número sin el 0. Hoy tiene un valor de ejemplo (`593900000000`) que **no funciona**. |
| `instagram`, `email`, `ciudad` | Datos de contacto del pie de página |
| `puntoVenta`, `envio` | Los dos canales de entrega |
| `productos` | Catálogo. `stage: 'live'` se vende hoy; `stage: 'soon'` sale como "próximamente" |
| `productos[].opciones` | Presentaciones y precios ($12 la lata, 2×$20) |
| `heroVideos` | Los clips del banner principal (ver más abajo) |
| `producto.foto` | Ruta de la foto del producto. Si el archivo no existe, la web dibuja una lata de respaldo y no se rompe nada |
| `efectos` | Las cuatro pestañas del módulo de efectos. Cada una trae su animación (`tema`) y su tono de página (`tono`). Si le pones `video`, ese clip sustituye a la animación |
| `envios`, `descuentos`, `packs` | Tarifas, códigos y precios del pedido |
| `usos` | Los cuatro casos de "Cuándo usarlos": botón, titular, texto y **ruta de la imagen de fondo** |

No hace falta tocar HTML para cambiar precios, nombres ni textos del producto.

## Estructura

```
index.html                 La página completa
assets/css/styles.css      Sistema de diseño y todos los estilos
assets/css/fonts.css       Fraunces · Instrument Sans (autoalojadas)
assets/js/config.js        ⚙️ Configuración: contacto, producto, vitrina, packs, envíos
assets/js/checkout.js      Cálculo del pedido y enlace de WhatsApp
assets/js/stickers.js      Las pegatinas del muro (velocidad y atletismo), en SVG
assets/js/main.js          Comportamiento y animación de la página
assets/js/vendor/          GSAP + ScrollTrigger alojados en el proyecto
assets/img/                Logo, iconos, foto del producto, portadas de uso y grafiti
assets/img/atletas/        Fotos de la banda de atletas (ver aviso abajo)
assets/img/marmol-*.webp   Texturas de piedra generadas, una por color de módulo
assets/fonts/              Tipografías (no dependen de Google Fonts)
assets/video/              Clip del hero (webm + mp4) e instrucciones
docs/MARCA.md              Guía de marca: paleta, tipografía, voz, precios
docs/CIENCIA.md            Respaldo de cada dato científico, con fuentes
DEPLOY.md                  Cómo publicarlo en Vercel
```

Los módulos, en orden: hero con el eslogan sobre vídeo · cintillo · muro de pegatinas ·
vitrina de producto · cuándo usarlos por pestañas · bloque mitad y mitad · preguntas · cierre
de venta (abre el cajón lateral) · pie con el rótulo grande, que además es el botón de
volver al inicio.

El fondo es **cobalto plano** en toda la página, como en la referencia: no cambia de
tono por módulo. El contraste lo ponen las cajas de arena (tarjetas, formulario,
preguntas, pie) y los acentos de coral y menta.

## Las imágenes de "Cuándo usarlos"

Cada pestaña pinta su imagen a sangre detrás del texto, con el mismo velo del
banner. Hoy llevan portadas gráficas generadas en la paleta, pensadas para
sustituirse por fotos: deja el archivo en `assets/img/` y cambia el campo
`foto` del caso en `assets/js/config.js`. Nada más.

Formato recomendado: **1920×1080 webp**, motivo algo descentrado (el texto va
en el medio) y tono oscuro o medio, porque el velo aclara poco.

⚠️ **Pinterest no es una fuente de fotos libres**: casi todo lo que hay ahí
está subido por terceros y conserva los derechos de su autor. Para uso
comercial, las fuentes con licencia limpia son **Unsplash**, **Pexels** y
**Pixabay**. Desde este entorno están bloqueadas por política de red, así que
la descarga la tienes que hacer tú.

## El banner de vídeo

El hero está preparado para vídeo de atletas. Mientras no haya clips muestra un fondo
animado de respaldo (barrido de velocidad + grano) que ya transmite la vibra, así que el
sitio nunca se ve incompleto. Para añadir los tuyos: **`assets/video/README.md`** tiene
las especificaciones exactas (duración, peso, encuadre y tratamiento de color).

## El checkout

Vive en un **cajón lateral**, no en el scroll. La página solo muestra un bloque compacto
con las tres condiciones de envío y un botón; al pulsarlo (o cualquier enlace "Pedir")
entra desde la derecha un panel con la elección de ciudad, el resumen y el formulario.
En móvil sube desde abajo como hoja. Se cierra con la ✕, con la tecla `Esc` o tocando
fuera; mientras está abierto el fondo no hace scroll y el foco queda atrapado dentro.

`assets/js/checkout.js` es el único archivo que toca la "pasarela". Expone dos funciones:

```js
TPPCheckout.text(order, intent)  // el mensaje de WhatsApp
TPPCheckout.link(order, intent)  // la URL wa.me lista para abrir
```

Si más adelante cambias de sistema de checkout, se reemplaza ese archivo manteniendo esas
dos funciones y el resto de la página sigue funcionando sin tocarse.

## El logo

Partimos de tu imagen y generamos los formatos que faltaban:

- `logo.svg` — vectorizado, escala sin perder nitidez. Lee las variables CSS
  `--logo-ink` y `--logo-paper`, así que se adapta solo a fondo claro u oscuro.
- `logo-full.png` — bicolor con fondo transparente. Para fondos claros.
- `logo-cream.png` — versión crema en una sola tinta. Para fondos oscuros o verdes.
- `logo-green.png` — versión verde en una sola tinta. Para sellos y estampados.
- `icon-32/180/192/512.png` — favicon e icono de aplicación.

## Accesibilidad y rendimiento

- Sin dependencias externas en tiempo de ejecución: ni CDN, ni Google Fonts, ni analítica.
- Respeta `prefers-reduced-motion`: se desactivan marquesinas, grano, vídeo y animaciones.
- Navegación por teclado con foco visible, `aria-current` en el menú y textos alternativos.
- Sin desbordamiento horizontal desde 320 px.

## Pendientes conocidos

- [ ] **Confirmar la formulación.** La web está escrita para la lata de la foto: NZE Peppermint
      FOCUS **sin cafeína** (Alpha GPC, L-Tirosina, L-Teanina). El plan original hablaba de una
      referencia con cafeína. Ver el aviso en `docs/CIENCIA.md`
- [ ] Poner el número real de WhatsApp en `config.js`
- [ ] Guardar la foto del producto en `assets/img/producto-nze-peppermint.jpg`
- [ ] Grabar o licenciar los 3 clips del hero
- [ ] Confirmar usuario de Instagram y dominio definitivos
