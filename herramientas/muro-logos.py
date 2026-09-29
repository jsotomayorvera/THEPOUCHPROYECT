"""Empapelado del pie: solo nuestro logo, repetido en distintos acabados.
   El original lleva dos tintas planas (#003F25 y #F6EFE2) con alfa, así que
   cada acabado es una reasignación de esas dos tintas, más dos tratamientos
   de forma: silueta maciza y estampa gastada."""
from PIL import Image, ImageChops, ImageFilter
import random, math

BASE = '/home/user/THEPOUCHPROYECT/assets/img/'
src = Image.open(BASE + 'logo-full.png').convert('RGBA').crop((11, 11, 1014, 774))

TINTA_OK = (0, 63, 37)
PAPEL_OK = (246, 239, 226)

def mascaras(im):
    """Separa el logo en sus dos tintas y en su silueta completa."""
    px = im.load(); w, h = im.size
    tinta = Image.new('L', (w, h), 0); papel = Image.new('L', (w, h), 0)
    tp = tinta.load(); pp = papel.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 40: continue
            dt = (r-TINTA_OK[0])**2 + (g-TINTA_OK[1])**2 + (b-TINTA_OK[2])**2
            dp = (r-PAPEL_OK[0])**2 + (g-PAPEL_OK[1])**2 + (b-PAPEL_OK[2])**2
            if dt < dp: tp[x, y] = a
            else:       pp[x, y] = a
    return tinta, papel

TINTA, PAPEL = mascaras(src)
SILUETA = ImageChops.lighter(TINTA, PAPEL)

def pinta(mascaras_colores, size):
    """Compone el logo con las tintas que se le pidan."""
    w, h = SILUETA.size
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for mask, color in mascaras_colores:
        capa = Image.new('RGBA', (w, h), color + (255,))
        out = Image.composite(capa, out, mask)
    return out.resize(size, Image.LANCZOS)

def gastada(im, semilla):
    """Estampa urbana: se le come el borde y se le abren calvas, como una
       serigrafía mal entintada."""
    random.seed(semilla)
    w, h = im.size
    ruido = Image.effect_noise((w, h), 46).filter(ImageFilter.GaussianBlur(1.1))
    ruido = ruido.point(lambda v: 255 if v > 118 else 0)
    a = im.getchannel('A')
    a = ImageChops.multiply(a, ruido.point(lambda v: 90 + v * 165 // 255))
    im = im.copy(); im.putalpha(a)
    return im

COBALTO=(0,56,255); ARENA=(255,216,136); CORAL=(255,90,60)
MENTA=(127,227,192); CREMA=(251,247,239); NEGRO=(18,7,4); TIERRA=(74,39,31)

def variante(k, size):
    if k == 'original':   return pinta([(TINTA, TINTA_OK), (PAPEL, PAPEL_OK)], size)
    if k == 'arena':      return pinta([(TINTA, NEGRO), (PAPEL, ARENA)], size)
    if k == 'cobalto':    return pinta([(TINTA, NEGRO), (PAPEL, COBALTO)], size)
    if k == 'coral':      return pinta([(TINTA, NEGRO), (PAPEL, CORAL)], size)
    if k == 'menta':      return pinta([(TINTA, NEGRO), (PAPEL, MENTA)], size)
    if k == 'negativo':   return pinta([(TINTA, CREMA), (PAPEL, TIERRA)], size)
    if k == 'silueta':    return pinta([(SILUETA, NEGRO)], size)
    if k == 'silueta-c':  return pinta([(SILUETA, COBALTO)], size)
    if k == 'contorno':   return pinta([(TINTA, NEGRO)], size)         # solo la cáscara
    if k == 'contorno-a': return pinta([(TINTA, ARENA)], size)
    raise KeyError(k)

# Las siluetas macizas se descartaron: al rellenar también las letras el
# logo se convierte en un bloque negro y deja de leerse.
ACABADOS = ['original','arena','cobalto','coral','menta','negativo',
            'contorno','contorno-a']
PESOS    = [    5,        5,       3,        3,      3,       3,
                 2,          2]

N = 1400                    # lado del mosaico
FONDO = (255, 216, 136)     # skin sand
lienzo = Image.new('RGBA', (N, N), FONDO + (255,))

random.seed(31337)
PASO = 108
puestos = []
for gy in range(0, N, PASO):
    for gx in range(0, N, PASO):
        k = random.choices(ACABADOS, weights=PESOS)[0]
        esc = random.uniform(0.66, 1.34)
        ancho = int(PASO * 1.62 * esc)
        alto = max(1, int(ancho * SILUETA.size[1] / SILUETA.size[0]))
        pieza = variante(k, (ancho, alto))
        if random.random() < 0.30:
            pieza = gastada(pieza, gx * 977 + gy)
        pieza = pieza.rotate(random.uniform(-23, 23), expand=True,
                             resample=Image.BICUBIC)
        cx = gx + PASO // 2 + int(random.uniform(-30, 30))
        cy = gy + PASO // 2 + int(random.uniform(-30, 30))
        puestos.append((pieza, cx, cy))

# se pega nueve veces para que el mosaico empalme por los cuatro bordes
for pieza, cx, cy in puestos:
    for ox in (-N, 0, N):
        for oy in (-N, 0, N):
            x = cx + ox - pieza.size[0] // 2
            y = cy + oy - pieza.size[1] // 2
            if x > N or y > N or x + pieza.size[0] < 0 or y + pieza.size[1] < 0:
                continue
            lienzo.alpha_composite(pieza, (x, y))

lienzo.convert('RGB').save(BASE + 'muro-logos.webp', 'WEBP', quality=80, method=6)
print('listo', lienzo.size)
