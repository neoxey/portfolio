import { qs, qsa } from '../dom.js';

/* ── 6. Scroll Reveal ─────────────────────────────────────── */
(function initReveal() {
  const els = qsa('.reveal, .reveal-stagger');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.style.getPropertyValue('--delay') || '0ms';
        e.target.style.transitionDelay = delay;
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();
