(() => {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('extreme-theme'); } catch { /* Storage is optional. */ }
  if (!['light', 'dark'].includes(preference)) preference = null;
  const apply = () => {
    const dark = preference ? preference === 'dark' : system.matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.hidden = false;
      button.textContent = dark ? 'Tema claro' : 'Tema oscuro';
      button.setAttribute('aria-label', dark ? 'Activar tema claro' : 'Activar tema oscuro');
    });
  };
  apply();
  system.addEventListener('change', apply);
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('extreme-theme', preference); } catch { /* Keep this visit functional. */ }
      apply();
    }));
  });
})();
