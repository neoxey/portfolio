import { qs, qsa } from '../dom.js';

/* ── 17. Interactive Resume Print Trigger ────────────────────── */
(function initResumePrint() {
  const resumeBtn = qs('#resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', e => {
      e.preventDefault();
      window.print();
    });
  }
})();
