# transilvaniahalloween.com: sitio estático

```
site/
├── index.html            HOME TEMPORAL (splash → /elpacto). Se reemplaza por la HOME corporativa.
├── elpacto/index.html    Landing del evento El Pacto de la Noche × Festival H3B
├── assets/
│   ├── css/base.css      Tokens, tipografía, botones (compartido)
│   ├── css/elpacto.css   Estilos exclusivos de /elpacto
│   ├── js/config.js      ENLACES CENTRALES (boletera, redes, legales) + medición
│   ├── js/elpacto.js     Nav, hero video, reproductor, animaciones
│   ├── img/              WebP optimizados + og-elpacto.jpg (vista previa WhatsApp/redes)
│   └── video/            MP4 H.264 optimizados para web (los MASTER en /material no se tocan)
├── favicon.svg, robots.txt, sitemap.xml
└── .htaccess   (solo si algún día se usa hosting Apache)

netlify.toml (raíz del repo): publica `site/` y define caché y cabeceras.
```

## Publicar (Netlify)
1. Netlify → Add new site → Import an existing project → GitHub → `24821717/transilvania`.
2. Branch: `main`. Build command: vacío. Publish directory: `site` (ya viene en `netlify.toml`).
3. Deploy. Cada push a `main` vuelve a desplegar.
4. Domain management → agregar `transilvaniahalloween.com` y seguir las instrucciones DNS de Netlify (HTTPS automático).

`/elpacto` se resuelve con `elpacto/index.html`. Comparte siempre el enlace en minúsculas: `/elpacto`.

Para verlo en local: `cd site && python3 -m http.server 8787` y abre http://localhost:8787/elpacto/

## PENDIENTES antes de publicar (en `assets/js/config.js`)
- [ ] `ticketsUrl`: URL de la boletera oficial. Mientras esté vacía, los botones "Comprar boletos" llevan a #boletos.
- [ ] Redes: Instagram / TikTok / YouTube / Spotify. Las que estén vacías no se muestran.
- [ ] Legales: Aviso de privacidad, Términos y condiciones, Contacto. Los que estén vacíos no se muestran.
- [ ] FAQ: hora de inicio, estacionamiento, edad mínima (marcados "por confirmar" en `elpacto/index.html`).
- [ ] Medición: pegar el snippet de GA4 o GTM en el `<head>`. Los eventos ya se envían a `dataLayer`/`gtag`:
  - `/elpacto`: `ticket_click` (con `location`), `video_play`, `maps_click`
  - HOME: `event_landing_click`

## Videos
| Archivo | Origen | Uso |
|---|---|---|
| splash-desktop.mp4 (16:9, 16 s, sin audio) | SPLASHHEROdesktop.mp4 | Hero (pantallas horizontales) |
| splash-mobile.mp4 (9:16, 16 s, sin audio) | Splashhero.mobil | Hero (pantallas verticales) |
| trailer-patros.mp4 | TRAILERPATROS.mp4 | Modal "Ver tráiler" |
| aftermovie-2025.mp4 | AFTERMOVIE2025_16_9DESKTOP.mp4 | Modal "Ver aftermovie" |

El hero descarga solo una versión según la orientación. No se carga con `prefers-reduced-motion` ni con ahorro de datos; en ese caso queda el póster.
