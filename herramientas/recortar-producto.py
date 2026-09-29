"""Recorta las latas de su fondo. Vienen sobre gris muy claro casi plano, así
   que el fondo se encuentra inundando desde los bordes: así no se comen los
   blancos de dentro de la lata, que es lo que pasaría con un simple umbral."""
from PIL import Image, ImageFilter
from collections import deque
import sys

IMG = '/tmp/claude-0/-home-user-THEPOUCHPROYECT/efaf1adb-b50e-5c64-9320-e3084cc1a078/images/'

def recorta(nombre, caja=None, tol=17, salida=None):
    im = Image.open(IMG + nombre).convert('RGB')
    if caja: im = im.crop(caja)
    w, h = im.size
    px = im.load()

    # color del fondo: la media de las cuatro esquinas
    esq = [px[2,2], px[w-3,2], px[2,h-3], px[w-3,h-3]]
    fr = sum(c[0] for c in esq)//4; fg = sum(c[1] for c in esq)//4; fb = sum(c[2] for c in esq)//4

    fondo = bytearray(w*h)
    cola = deque()
    for x in range(w):
        for y in (0, h-1):
            cola.append((x,y))
    for y in range(h):
        for x in (0, w-1):
            cola.append((x,y))
    while cola:
        x, y = cola.popleft()
        i = y*w + x
        if fondo[i]: continue
        r, g, b = px[x, y]
        if abs(r-fr) > tol or abs(g-fg) > tol or abs(b-fb) > tol: continue
        fondo[i] = 1
        if x > 0:   cola.append((x-1, y))
        if x < w-1: cola.append((x+1, y))
        if y > 0:   cola.append((x, y-1))
        if y < h-1: cola.append((x, y+1))

    alfa = Image.frombytes('L', (w, h), bytes(255 - v*255 for v in fondo))
    alfa = alfa.filter(ImageFilter.MinFilter(3))       # muerde 1 px de halo
    alfa = alfa.filter(ImageFilter.GaussianBlur(0.8))  # y suaviza el filo
    out = im.convert('RGBA'); out.putalpha(alfa)
    out = out.crop(out.getbbox())
    if salida: out.save(salida)
    return out

if __name__ == '__main__':
    # 39: la lata de frente con las cuatro apiladas detrás
    a = recorta('39.webp', salida='corte-frente.png')
    # 37: la misma lata en tres cuartos, la mitad izquierda del cuadro
    b = recorta('37.webp', caja=(150, 430, 720, 1120), salida='corte-tres-cuartos.png')
    print('frente', a.size, '| tres cuartos', b.size)
