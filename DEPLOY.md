# Publicar en Vercel

El sitio es estático: no hay build, ni dependencias, ni variables de entorno.
Vercel solo tiene que servir la carpeta tal cual. `vercel.json` ya deja
configuradas las cabeceras de caché para fuentes, imágenes y vídeo.

## Opción 1 — desde GitHub (recomendada, 2 minutos)

1. Entra a https://vercel.com/new
2. **Import Git Repository** → elige `jsotomayorvera/THEPOUCHPROYECT`.
   Si no aparece, pulsa *Adjust GitHub App Permissions* y dale acceso al repo.
3. En la pantalla de configuración:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** déjalo vacío
   - **Output Directory:** déjalo vacío
4. **Deploy**.

A partir de ahí, cada push a la rama que elijas vuelve a desplegar solo.
La rama de trabajo actual es `claude/pouch-project-landing-a55hl7`: en
*Settings → Git → Production Branch* eliges cuál es la de producción.

## Opción 2 — desde tu computadora

```bash
npm i -g vercel
cd THEPOUCHPROYECT
vercel          # primera vez: te pide iniciar sesión y crea el proyecto
vercel --prod   # publica a producción
```

## Dominio propio

En *Settings → Domains* añades `thepouchproject.ec` (o el que registres) y
Vercel te da los registros DNS que hay que poner en tu proveedor.

## Antes de publicar

- [ ] **Número de WhatsApp real** en `assets/js/config.js`. Ahora mismo tiene
      `593900000000`, que es un ejemplo y no funciona.
- [ ] **Tarifas de envío reales** en `config.js → envios`. Las actuales salen
      de la maqueta, no de tus costos.
- [ ] **Confirmar la formulación** del producto (ver `docs/CIENCIA.md`).
- [ ] Foto del producto en `assets/img/producto-nze-peppermint.jpg`.
- [ ] Clips del hero en `assets/video/` (ver `assets/video/README.md`).
