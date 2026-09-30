// Inclinación 3D de las tarjetas de servicios al pasar el cursor (con inercia) y brillo que sigue al puntero.
// Solo con puntero fino y sin "reducir movimiento". Anima únicamente transform/opacity.
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const MAX = 7;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, last: 0 };
    // Amortiguación exponencial por tiempo: se asienta en ~0.3 s sin importar los FPS.
    const step = now => {
      const dt = Math.min(0.1, s.last ? (now - s.last) / 1000 : 0.016);
      s.last = now;
      const k = 1 - Math.exp(-14 * dt);
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      const settled = Math.abs(s.tx - s.x) < 0.05 && Math.abs(s.ty - s.y) < 0.05;
      if (settled) { s.x = s.tx; s.y = s.ty; }
      card.style.setProperty('--tilt-x', s.x.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', s.y.toFixed(2) + 'deg');
      if (!settled) s.raf = requestAnimationFrame(step);
      else { s.raf = 0; s.last = 0; if (!s.tx && !s.ty) card.classList.remove('is-tilting'); }
    };
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(step); };
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      s.ty = (px - 0.5) * 2 * MAX;
      s.tx = (0.5 - py) * 2 * MAX;
      card.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
      card.classList.add('is-tilting');
      kick();
    });
    card.addEventListener('pointerleave', () => { s.tx = 0; s.ty = 0; kick(); });
  });
})();
