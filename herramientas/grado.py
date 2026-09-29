from PIL import Image, ImageEnhance, ImageFilter
import random

# Anclas tomadas del propio póster del vídeo del banner:
# sombras #180B08, medios #664933, luces #8F705B. Se extiende el tramo alto
# hacia la arena para que las fotos no queden planas.
ANCLAS = [(0.00,(22,13,10)), (0.14,(54,34,25)), (0.38,(104,76,57)),
          (0.60,(158,126,101)), (0.80,(202,166,122)), (1.00,(244,224,186))]

def lut():
    tabla=[[],[],[]]
    for i in range(256):
        t=i/255
        for k in range(len(ANCLAS)-1):
            a,ca=ANCLAS[k]; b,cb=ANCLAS[k+1]
            if a<=t<=b:
                f=(t-a)/(b-a) if b>a else 0
                for c in range(3): tabla[c].append(int(ca[c]+(cb[c]-ca[c])*f))
                break
        else:
            for c in range(3): tabla[c].append(ANCLAS[-1][1][c])
    return tabla[0]+tabla[1]+tabla[2]
LUT = lut()

def curva(v):
    """Negros levantados y una S algo más marcada que antes: el aire lavado
       del clip se mantiene, pero el motivo se separa del fondo."""
    t=v/255
    t=0.045+t*0.955                      # levanta el negro, menos que antes
    t=t*t*(3-2*t)*0.72 + t*0.28          # contraste más firme
    return max(0,min(255,int(t*255)))
CURVA=[curva(i) for i in range(256)]
DIANA=86      # luminancia media antes de teñir
DIANA_FIN=74  # y la del resultado final, ya con el tinte y el grano

def recorta(im, foco=0.5, rel=16/9):
    w,h=im.size
    if w/h > rel:
        nh=h; nw=int(h*rel); x=int((w-nw)*0.5); y=0
    else:
        nw=w; nh=int(w/rel); y=int((h-nh)*foco); x=0
        y=max(0,min(h-nh,y))
    return im.crop((x,y,x+nw,y+nh))

def grada(src, dst, foco=0.5, color=0.14, grano=7, ancho=1920, rel=16/9):
    im=Image.open(src).convert('RGB')
    im=recorta(im, foco, rel)
    im=im.resize((ancho,int(ancho/rel)), Image.LANCZOS)
    gris=im.convert('L')
    # Igualar exposición: todas acaban con la misma luminancia media, que es
    # lo que hace que la serie se lea como una sola sesión de fotos.
    media=sum(gris.histogram()[i]*i for i in range(256))/(gris.size[0]*gris.size[1])
    if media > 2:
        import math
        g=math.log(DIANA/255.0)/math.log(media/255.0)
        g=max(0.55, min(1.9, g))
        gris=gris.point([int(255*((i/255)**g)) for i in range(256)])
    gris=gris.point(CURVA)
    tenido=Image.merge('RGB',(gris,gris,gris)).point(LUT)
    # una pizca del color original, para que no parezca un filtro plano
    salida=Image.blend(tenido, im, color)
    salida=ImageEnhance.Contrast(salida).enhance(1.06)
    # Realce local: devuelve el filo que se pierde al reducir y al teñir,
    # que es lo que hace que la foto se lea de lejos y en una pantalla chica.
    salida=salida.filter(ImageFilter.UnsharpMask(radius=2.2, percent=68, threshold=3))
    # grano
    random.seed(11)
    ruido=Image.effect_noise(salida.size,grano).convert('L')
    salida=Image.blend(salida, Image.merge('RGB',(ruido,ruido,ruido)), 0.045)
    # Ajuste final: se mide el resultado ya teñido y se iguala a la diana,
    # porque el grano y la mezcla de color vuelven a mover la media.
    for _ in range(3):
        g2=salida.convert('L')
        m2=sum(g2.histogram()[i]*i for i in range(256))/(g2.size[0]*g2.size[1])
        if abs(m2-DIANA_FIN) < 1.2: break
        salida=ImageEnhance.Brightness(salida).enhance(max(0.7, min(1.4, DIANA_FIN/m2)))
    salida.save(dst,'WEBP',quality=82,method=6)
    return salida.size

BASE='/tmp/claude-0/-home-user-THEPOUCHPROYECT/efaf1adb-b50e-5c64-9320-e3084cc1a078/images/'
OUT='/home/user/THEPOUCHPROYECT/assets/img/'
import os
# En el móvil el módulo es alto y estrecho: con el recorte 16:9 el motivo
# se va por los lados. Se genera un segundo juego en 4:5, más cerrado.
for src, dst, foco, focoM in [('31.webp','uso-entrenamiento',0.46,0.44),
                              ('32.webp','uso-trabajo',      0.46,0.46),
                              ('33.webp','uso-estudio',      0.44,0.42),
                              ('34.webp','uso-donde-sea',    0.50,0.50)]:
    a=grada(BASE+src, OUT+dst+'.webp', foco, ancho=1920, rel=16/9)
    b=grada(BASE+src, OUT+dst+'-movil.webp', focoM, ancho=1080, rel=4/5)
    print(dst.ljust(20), a, os.path.getsize(OUT+dst+'.webp')//1024, 'KB  |  movil',
          b, os.path.getsize(OUT+dst+'-movil.webp')//1024, 'KB')
