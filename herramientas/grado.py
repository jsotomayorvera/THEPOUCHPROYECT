from PIL import Image, ImageEnhance, ImageFilter
import random

# Anclas tomadas del propio póster del vídeo del banner:
# sombras #180B08, medios #664933, luces #8F705B. Se extiende el tramo alto
# hacia la arena para que las fotos no queden planas.
ANCLAS = [(0.00,(18,10,8)), (0.16,(46,28,20)), (0.40,(90,64,48)),
          (0.62,(143,112,91)), (0.82,(186,150,108)), (1.00,(232,207,162))]

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
    """Negros levantados y una S suave: el aire lavado del clip."""
    t=v/255
    t=0.055+t*0.945                      # levanta el negro
    t=t*t*(3-2*t)*0.55 + t*0.45          # contraste blando
    return max(0,min(255,int(t*255)))
CURVA=[curva(i) for i in range(256)]
DIANA=74      # luminancia media antes de teñir
DIANA_FIN=58  # y la del resultado final, ya con el tinte y el grano

def recorta(im, foco=0.5, rel=16/9):
    w,h=im.size
    if w/h > rel:
        nh=h; nw=int(h*rel); x=int((w-nw)*0.5); y=0
    else:
        nw=w; nh=int(w/rel); y=int((h-nh)*foco); x=0
        y=max(0,min(h-nh,y))
    return im.crop((x,y,x+nw,y+nh))

def grada(src, dst, foco=0.5, color=0.12, grano=7, ancho=1920):
    im=Image.open(src).convert('RGB')
    im=recorta(im, foco)
    im=im.resize((ancho,int(ancho*9/16)), Image.LANCZOS)
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
    salida=ImageEnhance.Contrast(salida).enhance(1.04)
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
for src, dst, foco in [('31.webp','uso-entrenamiento.webp',0.46),
                       ('32.webp','uso-trabajo.webp',0.46),
                       ('33.webp','uso-estudio.webp',0.44),
                       ('34.webp','uso-donde-sea.webp',0.50)]:
    s=grada(BASE+src, OUT+dst, foco)
    print(dst, s, os.path.getsize(OUT+dst)//1024, 'KB')
