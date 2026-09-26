# Clips del hero

El banner principal está preparado para vídeo. Mientras no haya clips, muestra un
fondo animado de respaldo (barrido de velocidad + grano) que ya da la vibra correcta,
así que el sitio nunca se ve roto.

## Cómo añadir tus vídeos

1. Deja los archivos aquí, en `assets/video/`, con nombres tipo `hero-01.mp4`.
2. Ábrelos en `assets/js/config.js` dentro de `heroVideos`:

```js
heroVideos: [
  { src: 'assets/video/hero-01.mp4', poster: 'assets/img/poster-01.jpg' },
  { src: 'assets/video/hero-02.mp4', poster: 'assets/img/poster-02.jpg' },
],
```

Si pones más de uno, el hero los encadena con fundido al terminar cada clip.

## Especificaciones recomendadas

| Punto | Valor |
|---|---|
| Formato | `.mp4` (H.264) · añade `.webm` si quieres máxima compresión |
| Resolución | 1920×1080 mínimo; exporta también una versión vertical si la quieres en móvil |
| Duración | 6–10 s por clip, en bucle limpio |
| Peso | **Máximo 3–4 MB por clip.** Pesa más, el hero tarda y Google castiga |
| Audio | Sin audio (el vídeo se reproduce silenciado por obligación del navegador) |
| Encuadre | Deja aire en la mitad inferior izquierda: ahí va el titular |

## Qué se debe ver en esos clips

La idea es **rendimiento**, no producto. Tres tomas que funcionan:

1. **Explosión** — salida de sprint, salto o arrancada de barra. Cámara baja, contraluz.
2. **Sostener** — corredor o ciclista en ritmo, barrido lateral con desenfoque de movimiento.
3. **El gesto** — mano sacando un pouch del bolso del gym, muy cerca, fuera de foco al fondo.

Tratamiento de color para que peguen con la referencia que elegiste:
contraste alto, negros cálidos (#0D100F), luces con leve halo ámbar, grano visible y
obturador lento para que el movimiento se estire. Nada de saturación de más.
