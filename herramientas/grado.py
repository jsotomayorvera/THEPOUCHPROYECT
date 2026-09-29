"""Grado de las fotos de "Cuándo usarlos".

   Antes se pasaban a gris y se teñían de sepia: se veía la serie unida pero
   la foto perdía cuerpo. Ahora se trabaja sobre el color original y solo se
   le da temperatura: la imagen se reconoce, y el conjunto sigue casando con
   el clip cálido del banner."""
from PIL import Image, ImageEnhance, ImageFilter
import math, os, random

DIANA = 96          # luminancia media a la que se lleva cada foto
CALIDO = 0.55       # cuánto se empuja hacia el ámbar (0 = sin tocar)

def curva(v):
    """Negros apenas levantados y una S suave: aire de película sin lavar."""
    t = v / 255
    t = 0.028 + t * 0.972
    t = t * t * (3 - 2 * t) * 0.34 + t * 0.66
    return max(0, min(255, int(t * 255)))
CURVA = [curva(i) for i in range(256)]

def temperatura(k):
    """Tabla por canal: sube el rojo, deja el verde casi igual y baja el azul.
       Es un balance de blancos hacia el ámbar, no un tinte plano encima."""
    r = [min(255, int(i + (255 - i) * 0.165 * k)) for i in range(256)]
    g = [min(255, int(i + (255 - i) * 0.055 * k)) for i in range(256)]
    b = [max(0,   int(i - i * 0.115 * k)) for i in range(256)]
    return r + g + b

def recorta(im, foco=0.5, rel=16/9):
    w, h = im.size
    if w / h > rel:
        nh = h; nw = int(h * rel); x = int((w - nw) * 0.5); y = 0
    else:
        nw = w; nh = int(w / rel); x = 0
        y = max(0, min(h - nh, int((h - nh) * foco)))
    return im.crop((x, y, x + nw, y + nh))

def media(im):
    g = im.convert('L')
    return sum(g.histogram()[i] * i for i in range(256)) / (g.size[0] * g.size[1])

def grada(src, dst, foco=0.5, ancho=1920, rel=16/9, grano=6):
    im = Image.open(src).convert('RGB')
    im = recorta(im, foco, rel)
    im = im.resize((ancho, int(ancho / rel)), Image.LANCZOS)

    # 1. exposición: todas parten de la misma luminancia media
    m = media(im)
    if m > 2:
        gm = math.log(DIANA / 255.0) / math.log(m / 255.0)
        im = im.point([int(255 * ((i / 255) ** max(0.5, min(1.9, gm)))) for i in range(256)] * 3)

    # 2. curva de contraste y temperatura, sobre el color de verdad
    im = im.point(CURVA * 3)
    im = im.point(temperatura(CALIDO))

    # 3. una pizca menos de saturación, para que el ámbar no chille
    im = ImageEnhance.Color(im).enhance(0.90)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = im.filter(ImageFilter.UnsharpMask(radius=2.0, percent=62, threshold=3))

    # 4. grano fino
    random.seed(11)
    ruido = Image.effect_noise(im.size, grano).convert('L')
    im = Image.blend(im, Image.merge('RGB', (ruido, ruido, ruido)), 0.032)

    # 5. ajuste final de exposición, que el grano y la curva la mueven
    for _ in range(3):
        m2 = media(im)
        if abs(m2 - DIANA) < 1.2: break
        im = ImageEnhance.Brightness(im).enhance(max(0.7, min(1.4, DIANA / m2)))

    im.save(dst, 'WEBP', quality=84, method=6)
    return im.size

BASE = '/tmp/claude-0/-home-user-THEPOUCHPROYECT/efaf1adb-b50e-5c64-9320-e3084cc1a078/images/'
OUT  = '/home/user/THEPOUCHPROYECT/assets/img/'

if __name__ == '__main__':
    for src, dst, foco, focoM in [('31.webp', 'uso-entrenamiento', 0.46, 0.44),
                                  ('32.webp', 'uso-trabajo',       0.46, 0.46),
                                  ('33.webp', 'uso-estudio',       0.44, 0.42),
                                  ('34.webp', 'uso-donde-sea',     0.50, 0.50)]:
        a = grada(BASE + src, OUT + dst + '.webp', foco, 1920, 16/9)
        b = grada(BASE + src, OUT + dst + '-movil.webp', focoM, 1080, 4/5)
        print(dst.ljust(20), a, os.path.getsize(OUT+dst+'.webp')//1024, 'KB | movil',
              b, os.path.getsize(OUT+dst+'-movil.webp')//1024, 'KB')
