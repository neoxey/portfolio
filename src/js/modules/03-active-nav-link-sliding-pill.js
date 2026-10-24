import { qs, qsa } from '../dom.js';

/* ── 3. Active Nav Link + Sliding Pill ───────────────────── */
(function initActiveLink() {
  const links    = qsa('.nav-link');
  const sections = qsa('section[id]');
  const navLinksEl = qs('#nav-links');

  // Create pill
  const pill = document.createElement('div');
  pill.className = 'nav-pill';
  navLinksEl && navLinksEl.appendChild(pill);

  function movePill(target) {
    if (!target || !navLinksEl) return;
    const linkRect = target.getBoundingClientRect();
    const listRect = navLinksEl.getBoundingClientRect();
    pill.style.left    = (linkRect.left - listRect.left) + 'px';
    pill.style.width   = linkRect.width + 'px';
    pill.style.opacity = '1';
  }

  const fn = () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    links.forEach(l => {
      const active = l.getAttribute('href') === '#' + current;
      l.classList.toggle('active', active);
      if (active) movePill(l);
    });
  };
  window.addEventListener('scroll', fn, { passive: true });
  fn();

  // Hover pill
  links.forEach(l => {
    l.addEventListener('mouseenter', () => movePill(l));
    l.addEventListener('mouseleave', fn);
  });
})();
