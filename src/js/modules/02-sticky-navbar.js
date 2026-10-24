import { qs, qsa } from '../dom.js';

/* ── 2. Sticky Navbar ─────────────────────────────────────── */
(function initNavbar() {
  const nav = qs('#navbar');
  const fn  = () => nav.classList.toggle('stuck', window.scrollY > 24);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
})();
