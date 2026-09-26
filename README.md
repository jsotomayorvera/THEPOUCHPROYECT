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

No hace falta tocar HTML para cambiar precios, nombres ni textos del producto.

## Estructura

```
index.html                 La página completa
assets/css/styles.css      Sistema de diseño y todos los estilos
assets/css/fonts.css       Fraunces · Instrument Sans (autoalojadas)
assets/js/config.js        ⚙️ Configuración: contacto, producto, vitrina, packs, envíos
assets/js/checkout.js      Cálculo del pedido y enlace de WhatsApp
assets/js/fx.js            Animaciones del módulo de efectos (una por pestaña)
assets/js/main.js          Comportamiento y animación de la página
assets/js/vendor/          GSAP + ScrollTrigger alojados en el proyecto
assets/img/                Logo, iconos, foto del producto y latas de "próximamente"
assets/fonts/              Tipografías (no dependen de Google Fonts)
assets/video/              Clip del hero (webm + mp4) e instrucciones
docs/MARCA.md              Guía de marca: paleta, tipografía, voz, precios
docs/CIENCIA.md            Respaldo de cada dato científico, con fuentes
DEPLOY.md                  Cómo publicarlo en Vercel
```

Los módulos, en orden: hero con el eslogan sobre vídeo · vitrina de producto ·
dos bloques mitad y mitad · efectos por pestañas · cierre de venta por WhatsApp ·
pie con el rótulo grande.

## El banner de vídeo

El hero está preparado para vídeo de atletas. Mientras no haya clips muestra un fondo
animado de respaldo (barrido de velocidad + grano) que ya transmite la vibra, así que el
sitio nunca se ve incompleto. Para añadir los tuyos: **`assets/video/README.md`** tiene
las especificaciones exactas (duración, peso, encuadre y tratamiento de color).

## El checkout

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
