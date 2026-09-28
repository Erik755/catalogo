# Extreme Solutions — despliegue

Repositorio: https://github.com/Erik755/extreme-solutions

En el proyecto existente `extreme-solutions` de Vercel:

1. Settings → Git: conectar `Erik755/extreme-solutions`.
2. Root Directory: la raíz del repositorio. `vercel.json` publica automáticamente
   la carpeta `extreme-solutions` y expone sus funciones mediante `api/`.
3. Framework Preset: **Other**. Build Command y Output Directory se leen de
   `vercel.json`; no es necesario configurarlos manualmente.
4. Variables de entorno: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `SITE_URL`.
   `SITE_URL` debe ser `https://extreme-solutions-eosin.vercel.app` para producción.
   Usar claves de TEST hasta verificar Checkout y webhook. No poner claves en GitHub.
5. Desplegar la rama que contenga esta actualización.
6. Completar la configuración de eventos indicada en `STRIPE_SETUP.md` y probar
   Checkout y entregas del webhook en Stripe TEST.

El build genera las tarjetas desde `data/projects.json`, sin dependencias externas. Las funciones de `api/`
requieren Vercel y las variables de Stripe. El webhook existente registra eventos;
no implementa entrega automática de productos ni persistencia en una base de datos.

## Cambios de interfaz

- Navegación fija con sección activa y menú móvil accesible por teclado.
- Filtros Android, Web y Herramientas e IA.
- Entradas suaves al recorrer secciones y transiciones de botones y tarjetas.
- Respeto a movimiento reducido y contenido disponible sin JavaScript.
- Imágenes recuperadas y recursos incrustados extraídos para permitir caché.
- Contraste de la sección de pagos corregido.

## Vista local

Desde esta carpeta: `npm run build` y `npm run dev`.
Abrir http://127.0.0.1:4174. Incluye páginas dinámicas; no ejecuta Stripe.

## Catálogo y preferencias

Editar `data/projects.json` para cambiar proyectos, imágenes, enlaces y tecnologías.
El build actualiza la portada y una plantilla de servidor genera `/proyecto/:slug`.
No se duplican páginas HTML a mano. Para publicar cambios de contenido, hacer commit y desplegar.
Esto no es un CMS en tiempo real: no hay base de datos ni panel de administración.

La búsqueda y categoría se guardan en la URL para compartirlas. Los favoritos y el
tema se guardan en el navegador, sin cuentas ni transferencia de datos personales.
Si el almacenamiento está bloqueado, las funciones siguen disponibles durante la visita.

Validación: `npm test`. Mantener las variables y el webhook de Stripe descritos arriba.
