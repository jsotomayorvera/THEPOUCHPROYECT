"""Bodegón de producto al estilo de la referencia: latas flotando sobre un
   fondo de estudio en nuestra paleta, con sombra blanda bajo cada una."""
from PIL import Image, ImageDraw, ImageFilter

frente = Image.open('corte-frente.png')          # lata de frente con la pila
tc     = Image.open('corte-tres-cuartos.png')    # la misma en tres cuartos

def escala(im, alto):
    r = alto / im.height
    return im.resize((max(1, int(im.width * r)), alto), Image.LANCZOS)

def fondo(W, H):
    """Estudio cálido: degradado vertical más viñeta, en arena."""
    claro  = Image.new('RGB', (W, H), (249, 238, 214))
    medio  = Image.new('RGB', (W, H), (226, 200, 154))
    rampa  = Image.new('L', (1, H))
    for y in range(H):
        t = y / H
        rampa.putpixel((0, y), int(255 * (0.04 + 0.70 * t * t)))
    base = Image.composite(medio, claro, rampa.resize((W, H)))
    vig = Image.new('L', (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W*0.22, -H*0.30, W*1.22, H*1.30), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(170))
    return Image.composite(base, Image.new('RGB', (W, H), (206, 176, 126)), vig)

def compone(W, H, plan, dst):
    base = fondo(W, H).convert('RGBA')
    puestas = []
    for im, alto, giro, cx, base_y, (sw, sh, sb, sf) in plan:
        p = escala(im, alto).rotate(giro, expand=True, resample=Image.BICUBIC)
        x = cx - p.width // 2
        y = base_y - p.height
        # sombra pegada al borde inferior de la pieza, un poco por debajo
        s = Image.new('L', (W, H), 0)
        sy = base_y + int(alto * 0.05)
        ImageDraw.Draw(s).ellipse((cx - sw//2, sy - sh//2, cx + sw//2, sy + sh//2), fill=sf)
        s = s.filter(ImageFilter.GaussianBlur(sb))
        tinta = Image.new('RGBA', (W, H), (74, 41, 28, 255))
        tinta.putalpha(s)
        base.alpha_composite(tinta)
        puestas.append((p, x, y))
    for p, x, y in puestas:
        base.alpha_composite(p, (x, y))
    base.convert('RGB').save(dst, quality=92)
    return base.size

# Una sola toma, centrada. Con una segunda lata arriba parecía que había
# una montada sobre la pila, y el bodegón se leía mal.
compone(1400, 1400, [
    (frente, 880, 2, 700, 1170, (700, 130, 58, 150)),
], '/home/user/THEPOUCHPROYECT/assets/img/producto-nze-energy.webp')

# Apaisado, para la imagen que se ve al compartir el enlace
compone(1600, 900, [
    (frente, 640, 2, 800, 790, (540, 104, 48, 148)),
], '/home/user/THEPOUCHPROYECT/assets/img/producto-nze-energy-ancho.webp')
print('bodegones listos')
