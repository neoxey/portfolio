import { qs, qsa } from '../dom.js';

/* ── 10. Hero Cursor Spotlight ───────────────────────────── */
(function initSpotlight() {
  const hero      = qs('#home');
  const spotlight = qs('#hero-spotlight');
  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    spotlight.style.setProperty('--spotlight-x', `${x}%`);
    spotlight.style.setProperty('--spotlight-y', `${y}%`);
    spotlight.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(0,242,195,0.06), transparent 50%)`;
  }, { passive: true });
})();
