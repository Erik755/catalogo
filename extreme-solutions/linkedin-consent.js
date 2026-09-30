// Distintivo de LinkedIn solo con consentimiento expreso: el script de LinkedIn puede leer o establecer cookies de terceros.
(() => {
  const KEY = 'extreme-linkedin-consent';
  const SRC = 'https://platform.linkedin.com/badges/js/profile.js';
  const t = value => window.extremeI18n?.t(value) || value;
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = value => {
    try { value ? localStorage.setItem(KEY, value) : localStorage.removeItem(KEY); } catch { /* Sin almacenamiento: la decisión vale solo para esta visita. */ }
  };
  function loadBadge() {
    if ([...document.scripts].some(script => script.src === SRC)) return;
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    document.body.append(script);
  }

  // Portada: aviso previo y botón para cargar el distintivo.
  const box = document.querySelector('[data-linkedin-consent]');
  if (box) {
    if (read() === 'granted') loadBadge();
    else {
      box.hidden = false;
      box.querySelector('[data-linkedin-load]').addEventListener('click', () => {
        write('granted');
        box.hidden = true;
        loadBadge();
      });
    }
  }

  // Centro de privacidad: estado y revocación del consentimiento.
  const panel = document.querySelector('[data-linkedin-panel]');
  if (panel) {
    const status = panel.querySelector('.consent-status');
    const revoke = panel.querySelector('[data-linkedin-revoke]');
    const render = () => {
      const granted = read() === 'granted';
      status.textContent = t(granted
        ? 'Aceptaste cargar el distintivo de LinkedIn en este navegador.'
        : 'El distintivo de LinkedIn no está autorizado en este navegador.');
      revoke.hidden = !granted;
    };
    revoke.addEventListener('click', () => {
      write(null);
      render();
      status.textContent = t('Consentimiento retirado. El distintivo ya no se cargará; las cookies que LinkedIn haya establecido pueden borrarse desde tu navegador.');
    });
    panel.hidden = false;
    render();
    window.addEventListener('extreme:languagechange', render);
  }
})();
