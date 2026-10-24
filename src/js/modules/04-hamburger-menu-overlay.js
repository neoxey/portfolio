import { qs, qsa } from '../dom.js';

/* ── 4. Hamburger Menu + Overlay ─────────────────────────── */
(function initHamburger() {
  const btn     = qs('#hamburger');
  const menu    = qs('#nav-links');
  const overlay = qs('#mobile-overlay');

  function close() {
    menu && menu.classList.remove('open');
    btn  && btn.classList.remove('open');
    overlay && overlay.classList.remove('open');
  }

  btn && btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    overlay && overlay.classList.toggle('open', open);
  });

  qsa('.nav-link').forEach(l => l.addEventListener('click', close));
  overlay && overlay.addEventListener('click', close);
})();
