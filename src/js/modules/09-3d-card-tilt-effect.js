import { qs, qsa } from '../dom.js';

/* ── 9. 3D Card Tilt Effect ──────────────────────────────── */
(function initTilt() {
  const cards = qsa('.proj-card, .tel-card, .tl-card');
  const MAX_TILT = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * MAX_TILT;
      const rotY   =  dx * MAX_TILT;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();
