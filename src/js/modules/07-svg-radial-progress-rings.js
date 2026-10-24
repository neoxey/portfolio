import { qs, qsa } from '../dom.js';

/* ── 7. SVG Radial Progress Rings ─────────────────────────── */
(function initRings() {
  const rings = qsa('.ring-fill');
  if (!rings.length) return;

  const circumference = 2 * Math.PI * 32; // r=32 → ~201

  // Init all rings to 0
  rings.forEach(r => {
    r.style.strokeDasharray  = circumference;
    r.style.strokeDashoffset = circumference;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const ring = e.target;
      const pct  = parseFloat(ring.dataset.pct) || 0;
      const offset = circumference * (1 - pct / 100);
      // Small delay for stagger effect
      const idx = Array.from(rings).indexOf(ring);
      setTimeout(() => {
        ring.style.strokeDashoffset = offset;
      }, idx * 120);
      obs.unobserve(ring);
    });
  }, { threshold: 0.3 });

  rings.forEach(r => obs.observe(r));
})();
