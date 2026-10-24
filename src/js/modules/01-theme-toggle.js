import { qs, qsa } from '../dom.js';

/* ── 1. Theme Toggle ──────────────────────────────────────── */
(function initTheme() {
  const html  = document.documentElement;
  const btn   = qs('#theme-toggle');
  const saved = localStorage.getItem('nv-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('nv-theme', next);
  });
})();
