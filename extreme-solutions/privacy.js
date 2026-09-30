// Página de privacidad: índice activo, buscador y filtros, acordeones animados y enlaces profundos.
(() => {
  const t = value => window.extremeI18n?.t(value) || value;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const policies = [...document.querySelectorAll('details.policy')];
  const tools = document.querySelector('.policy-tools');
  const search = document.querySelector('#policy-search');
  const count = document.querySelector('.policy-count');
  const empty = document.querySelector('.policy-empty');
  let topic = 'all';

  // Acordeones con animación suave (sin estilos inline: solo Web Animations API).
  function animate(details, open) {
    const body = details.querySelector('.policy-body');
    if (reduced.matches || !body.animate) { details.open = open; return; }
    if (open) details.open = true;
    const height = body.scrollHeight;
    const frames = [{ height: '0px', opacity: 0 }, { height: height + 'px', opacity: 1 }];
    const animation = body.animate(open ? frames : frames.reverse(), { duration: 260, easing: 'cubic-bezier(.2,.7,.3,1)' });
    if (!open) animation.onfinish = () => { details.open = false; };
  }
  policies.forEach(details => details.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    animate(details, !details.open);
    const url = new URL(location.href);
    url.hash = details.open ? details.id : '';
    history.replaceState(null, '', url);
  }));
  document.querySelectorAll('[data-expand]').forEach(button => button.addEventListener('click', () => {
    const open = button.dataset.expand === 'open';
    policies.filter(details => !details.hidden && details.open !== open).forEach(details => animate(details, open));
  }));

  // Buscador y filtros por tema.
  function render() {
    const query = normalize(search.value.trim());
    let visible = 0;
    policies.forEach(details => {
      const matchesTopic = topic === 'all' || details.dataset.topics.split(' ').includes(topic);
      const matchesText = !query || normalize(details.textContent).includes(query);
      details.hidden = !(matchesTopic && matchesText);
      if (!details.hidden) visible++;
      if (query && !details.hidden) details.open = true;
    });
    tools.querySelectorAll('[data-topic]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    count.textContent = window.extremeI18n?.language === 'en'
      ? `${visible} of ${policies.length} policies`
      : `${visible} de ${policies.length} políticas`;
    empty.hidden = visible !== 0;
  }
  tools.hidden = false;
  tools.addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (button) { topic = button.dataset.topic; render(); }
  });
  search.addEventListener('input', render);
  document.querySelector('.policy-clear').addEventListener('click', () => { topic = 'all'; search.value = ''; render(); search.focus(); });
  window.addEventListener('extreme:languagechange', render);
  render();

  // Enlace profundo: /privacidad#lentes abre y muestra esa política.
  function openFromHash() {
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (target?.matches('details.policy')) { target.open = true; target.scrollIntoView({ block: 'start' }); }
  }
  addEventListener('hashchange', openFromHash);
  openFromHash();

  // Índice con la sección activa.
  const links = [...document.querySelectorAll('.privacy-toc a')];
  const sections = links.map(link => document.querySelector(link.hash));
  let scheduled = false;
  function updateToc() {
    let active = sections[0]?.id;
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) active = section.id; });
    links.forEach(link => {
      const current = link.hash === '#' + active;
      current ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current');
      if (current && matchMedia('(max-width: 980px)').matches) link.parentElement.parentElement.scrollLeft = link.offsetLeft - 20;
    });
    scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateToc); } }, { passive: true });
  updateToc();

  // Entradas suaves al recorrer la página, sin ocultar contenido en CSS.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.animate?.([{ opacity: .3, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.3,1)' });
      observer.unobserve(target);
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
})();
