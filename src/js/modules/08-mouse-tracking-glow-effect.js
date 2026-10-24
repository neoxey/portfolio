import { qs, qsa } from '../dom.js';

/* ── 8. Mouse Tracking Glow Effect ─────────────────────────── */
(function initGlow() {
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.glow-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, { passive: true });
})();
