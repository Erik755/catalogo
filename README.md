# Extreme Solutions — sitio web

Sitio de Extreme Solutions (Erik Sanchez): portafolio de productos móviles y web, páginas de proyecto y centro de privacidad.

**Sitio oficial:** https://extreme-solutions-eosin.vercel.app/ (Vercel, rama `main`)

| Ruta | Contenido |
|---|---|
| `/` | Portada (`extreme-solutions/index.html`) |
| `/proyecto/:slug` | Páginas de proyecto generadas desde `extreme-solutions/data/projects.json` |
| `/privacidad` | Política general, privacidad del sitio y resumen de la política oficial de cada app |

`npm run build` genera las tarjetas del catálogo, `i18n-data.js` y la carpeta `dist/` (solo archivos públicos).
`npm test` valida el catálogo, las páginas de proyecto, la exportación pública y las traducciones.
Documentación interna: [`docs/`](docs/).

## Políticas de privacidad oficiales de las apps

Estas URL están registradas en Google Play Console y viven en sus propios repositorios; no se mueven:

- Reporte Servicio Pro: https://erik755.github.io/reporte-de-servicio-docs/reporte-servicio-pro-privacidad.html
- Reporte de Servicio: https://erik755.github.io/reporte-de-servicio-docs/privacy.html
- Control de Gastos Pro: https://erik755.github.io/control-de-gastos-pro-privacy/
- Lentes: https://erik755.github.io/lentes-docs/lentes-privacidad.html

## Carpetas heredadas

`demos/`, `ai-duet/`, `p/` y los archivos HTML/PNG de la raíz pertenecen al antiguo portafolio publicado con
GitHub Pages. GitHub Pages se desactivó el 29 de septiembre de 2026 porque Vercel es el sitio oficial, así que
esas carpetas ya no se publican.

© Erik Sanchez
