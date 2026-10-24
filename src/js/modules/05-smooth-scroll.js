import { qs, qsa } from '../dom.js';

/* ── 5. Smooth Scroll ─────────────────────────────────────── */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = qs(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
