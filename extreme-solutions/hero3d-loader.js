// Carga diferida de la escena 3D de la portada (no bloquea el LCP).
// Sin WebGL 2, con "reducir movimiento" o con ahorro de datos se queda la imagen estática.
(() => {
  const stage = document.querySelector('.hero-stage');
  if (!stage) return;
  const fallback = reason => { stage.dataset.state = 'fallback'; stage.dataset.reason = reason; };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return fallback('reduced-motion');
  if (navigator.connection?.saveData) return fallback('save-data');
  const hasWebGL2 = (() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return false;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch { return false; }
  })();
  if (!hasWebGL2) return fallback('no-webgl');
  stage.dataset.state = 'loading';
  const start = () => import('/hero3d.js')
    .then(module => module.mount(stage))
    .catch(() => { stage.classList.remove('is-live'); fallback('error'); });
  const idle = callback => ('requestIdleCallback' in window ? requestIdleCallback(callback, { timeout: 1200 }) : setTimeout(callback, 200));
  if (document.readyState === 'complete') idle(start);
  else addEventListener('load', () => idle(start), { once: true });
})();
