const nav = document.querySelector('.nav');
const menu = document.querySelector('.nav-links');
const toggle = document.querySelector('.menu-toggle');
const mobile = matchMedia('(max-width: 680px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const links = [...menu.querySelectorAll('a')];
menu.classList.add('is-enhanced');
toggle.hidden = false;

function closeMenu(returnFocus = false) {
  menu.hidden = mobile.matches;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menú';
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Cerrar' : 'Menú';
});
mobile.addEventListener('change', () => closeMenu());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target)) closeMenu();
});
links.forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const section = document.querySelector(link.hash);
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
}));
closeMenu();

const sections = links.map(link => document.querySelector(link.hash));
let scheduled = false;
function updateNavigation() {
  nav.classList.toggle('is-scrolled', scrollY > 24);
  let active;
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= nav.offsetHeight + 100) active = section.id;
  });
  links.forEach(link => {
    if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
addEventListener('resize', updateNavigation);
updateNavigation();

// Animate on entry without ever hiding content in CSS (including failed JS loads).
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!reduced.matches && target.animate) target.animate(
        [{ opacity: .3, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
      );
      observer.unobserve(target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.section-head, .capability, .tool-card, .method-step, .project').forEach(el => observer.observe(el));
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
}

const filters = document.querySelector('.project-filters');
const projects = [...document.querySelectorAll('.project')];
const count = document.querySelector('.filter-count');
filters.hidden = false;
count.hidden = false;
function filterProjects(category) {
  let visible = 0;
  projects.forEach(project => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) visible++;
  });
  filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  count.textContent = `${visible} proyectos disponibles`;
}
filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (button) filterProjects(button.dataset.filter);
});
filterProjects('all');
