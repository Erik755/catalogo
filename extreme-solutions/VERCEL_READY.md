# Extreme Solutions — despliegue

Repositorio: https://github.com/Erik755/extreme-solutions

En el proyecto existente `extreme-solutions` de Vercel:

1. Settings → Git: conectar `Erik755/extreme-solutions`.
2. Root Directory: `extreme-solutions` (el repositorio conserva otros proyectos).
3. Framework Preset: **Other**. Sin comando de build ni instalación; Output Directory: **.**.
4. Variables de entorno: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `SITE_URL`.
   `SITE_URL` debe ser `https://extreme-solutions-eosin.vercel.app` para producción.
   Usar claves de TEST hasta verificar Checkout y webhook. No poner claves en GitHub.
5. Desplegar la rama que contenga esta actualización.
6. Completar la configuración de eventos indicada en `STRIPE_SETUP.md` y probar
   Checkout y entregas del webhook en Stripe TEST.

La interfaz funciona sin compilación ni dependencias. Las funciones de `api/`
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

Desde esta carpeta: `python -m http.server 4173`.
Abrir http://localhost:4173. Este servidor solo sirve la interfaz; no ejecuta Stripe.
