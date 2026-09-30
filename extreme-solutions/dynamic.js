const nav = document.querySelector('.nav');
const menu = document.querySelector('.nav-links');
const toggle = document.querySelector('.menu-toggle');
const mobile = matchMedia('(max-width: 680px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const t = value => window.extremeI18n?.t(value) || value;
const links = [...menu.querySelectorAll('a')];
menu.classList.add('is-enhanced');
toggle.hidden = false;

// Menú móvil: sale desde el botón que lo abre (transform-origin en el disparador) y se cierra
// por el mismo camino. La animación es interrumpible: si se pulsa a mitad, se invierte desde
// el valor en pantalla. Solo se animan transform y opacity (Web Animations API, sin estilos inline).
let menuMotion = null;
function setMenu(open, animated = true) {
  if (!mobile.matches) { menuMotion?.animation.cancel(); menuMotion = null; menu.hidden = false; return; }
  if (menuMotion) {
    if (menuMotion.open !== open) { menuMotion.open = open; if (open) menu.hidden = false; menuMotion.animation.reverse(); }
    return;
  }
  if (!animated || !menu.animate || menu.hidden === !open) { menu.hidden = !open; return; }
  if (open) menu.hidden = false;
  const trigger = toggle.getBoundingClientRect();
  const origin = `${Math.round(trigger.left + trigger.width / 2 - menu.getBoundingClientRect().left)}px 0px`;
  const frames = reduced.matches
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [{ opacity: 0, transform: 'translateY(-0.5rem) scale(.96)', transformOrigin: origin }, { opacity: 1, transform: 'none', transformOrigin: origin }];
  const animation = menu.animate(frames, { duration: reduced.matches ? 150 : 200, easing: 'cubic-bezier(.23, 1, .32, 1)', direction: open ? 'normal' : 'reverse', fill: 'both' });
  const motion = { animation, open };
  menuMotion = motion;
  animation.onfinish = () => {
    if (menuMotion === motion) menuMotion = null;
    if (!motion.open) menu.hidden = true;
    animation.cancel();
  };
}

function closeMenu(returnFocus = false, animated = true) {
  setMenu(false, animated);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = t('Menú');
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = t(open ? 'Cerrar' : 'Menú');
});
mobile.addEventListener('change', () => closeMenu(false, false));
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
closeMenu(false, false);
window.addEventListener('extreme:languagechange', () => {
  toggle.textContent = t(toggle.getAttribute('aria-expanded') === 'true' ? 'Cerrar' : 'Menú');
});

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
  // Revelado suave y escalonado entre hermanos (solo opacity/transform; el contenido nunca se oculta en CSS).
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({ target }, order) => {
      if (!reduced.matches && target.animate) target.animate(
        [{ opacity: 0, transform: 'translateY(24px) scale(.985)' }, { opacity: 1, transform: 'none' }],
        { duration: 650, delay: Math.min(order, 5) * 70, easing: 'cubic-bezier(.23, 1, .32, 1)', fill: 'backwards' }
      );
      observer.unobserve(target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.section-head, .capability, .tool-card, .method-step, .project, .metric, .play-card, .image-panel, .badge-list span').forEach(el => observer.observe(el));
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
}
