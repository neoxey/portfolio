import { qs, qsa } from '../dom.js';

/* ── 12. Stat Counters ─────────────────────────────────────── */
(function initCounters() {
  const nums = qsa('.astat-num');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const max = parseInt(el.dataset.target) || 0;
      let n = 0;
      const steps = 40;
      const inc  = Math.ceil(max / steps);
      const tick = setInterval(() => {
        n = Math.min(n + inc, max);
        el.textContent = n;
        if (n >= max) clearInterval(tick);
      }, max > 100 ? 30 : 48);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(el => obs.observe(el));
})();
