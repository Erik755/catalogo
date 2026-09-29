(() => {
  const grid = document.querySelector('.projects');
  const cards = [...grid.querySelectorAll('.project')];
  const search = document.querySelector('#project-search');
  const savedOnly = document.querySelector('#saved-only');
  const filters = document.querySelector('.project-filters');
  const count = document.querySelector('.filter-count');
  const empty = document.querySelector('.catalog-empty');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const t = value => window.extremeI18n?.t(value) || value;
  let searchable = new Map(cards.map(card => [card, normalize(card.querySelector('.project-body').textContent)]));
  let saved = new Set();
  try {
    const value = JSON.parse(localStorage.getItem('extreme-saved') || '[]');
    if (Array.isArray(value)) saved = new Set(value.filter(id => cards.some(card => card.dataset.projectId === id)));
  } catch { /* Corrupt or unavailable storage must not hide the catalog. */ }
  const params = new URLSearchParams(location.search);
  let category = ['android', 'web', 'tools'].includes(params.get('category')) ? params.get('category') : 'all';
  search.value = (params.get('q') || '').slice(0, 120);
  let onlySaved = false;
  function render(updateUrl = true) {
    const query = normalize(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const favorite = saved.has(card.dataset.projectId);
      card.hidden = !(category === 'all' || card.dataset.category === category) || !searchable.get(card).includes(query) || (onlySaved && !favorite);
      if (!card.hidden) visible++;
      const button = card.querySelector('[data-save]');
      button.hidden = false;
      button.setAttribute('aria-pressed', String(favorite));
      button.textContent = t(favorite ? 'Guardado' : 'Guardar');
      button.setAttribute('aria-label', `${t(favorite ? 'Quitar de favoritos' : 'Guardar')} ${card.querySelector('h3').textContent}`);
    });
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    savedOnly.setAttribute('aria-pressed', String(onlySaved));
    count.textContent = window.extremeI18n?.language === 'en'
      ? `${visible} of ${cards.length} projects${onlySaved ? ' · favorites' : ''}`
      : `${visible} de ${cards.length} proyectos${onlySaved ? ' · favoritos' : ''}`;
    empty.hidden = visible !== 0;
    if (updateUrl) {
      const url = new URL(location.href);
      category === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', category);
      search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) { category = button.dataset.filter; render(); }
  });
  search.addEventListener('input', () => render());
  savedOnly.addEventListener('click', () => { onlySaved = !onlySaved; render(); });
  document.querySelector('#clear-filters').addEventListener('click', () => {
    category = 'all'; onlySaved = false; search.value = ''; render(); search.focus();
  });
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-save]');
    if (!button) return;
    const id = button.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    try { localStorage.setItem('extreme-saved', JSON.stringify([...saved])); } catch { /* Session-only fallback. */ }
    render();
    if (onlySaved && !saved.has(id)) savedOnly.focus();
  });
  document.querySelector('.catalog-controls').hidden = false;
  filters.hidden = false;
  count.hidden = false;
  window.addEventListener('extreme:languagechange', () => {
    searchable = new Map(cards.map(card => [card, normalize(card.querySelector('.project-body').textContent)]));
    render(false);
  });
  render(false);
})();
