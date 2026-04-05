/* ================================================================
   NAVANEETH PORTFOLIO — script.js
   Pure vanilla JS. No dependencies.
   ================================================================ */
'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

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

/* ── 2. Sticky Navbar ─────────────────────────────────────── */
(function initNavbar() {
  const nav = qs('#navbar');
  const fn  = () => nav.classList.toggle('stuck', window.scrollY > 24);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
})();

/* ── 3. Active Nav Link ───────────────────────────────────── */
(function initActiveLink() {
  const links    = qsa('.nav-link');
  const sections = qsa('section[id]');
  const fn = () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', fn, { passive: true });
  fn();
})();

/* ── 4. Hamburger Menu ────────────────────────────────────── */
(function initHamburger() {
  const btn  = qs('#hamburger');
  const menu = qs('#nav-links');
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
  qsa('.nav-link').forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();

/* ── 5. Smooth Scroll ─────────────────────────────────────── */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = qs(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();

/* ── 6. Scroll Reveal ─────────────────────────────────────── */
(function initReveal() {
  const els = qsa('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = e.target.style.getPropertyValue('--delay') || '0ms';
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();

/* ── 7. Skill Bar Animations ──────────────────────────────── */
(function initSkillBars() {
  const bars = qsa('.bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.width || '0') + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

/* ── 8. Stat Counters ─────────────────────────────────────── */
(function initCounters() {
  const nums = qsa('.astat-num');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const max = parseInt(el.dataset.target) || 0;
      let n = 0;
      const inc  = Math.ceil(max / 30);
      const tick = setInterval(() => {
        n = Math.min(n + inc, max);
        el.textContent = n;
        if (n >= max) clearInterval(tick);
      }, 48);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(el => obs.observe(el));
})();

/* ── 9. Terminal Typing Animation ─────────────────────────── */
(function initTerminal() {
  const container = qs('#term-body');
  if (!container) return;

  const script = [
    { type: 'cmd',       text: 'whoami' },
    { type: 'out',       text: 'navaneeth' },
    { type: 'cmd',       text: 'cat role.txt' },
    { type: 'out',       text: 'Student · Linux · System Builder' },
    { type: 'cmd',       text: 'systemctl status learning' },
    { type: 'out-green', text: '● Active: running (3 years)' },
    { type: 'cmd',       text: 'ls projects/' },
    { type: 'out',       text: 'home-server  pi-hole  samba  nginx  tg-bot' },
  ];

  let li = 0, ci = 0, activeLine = null;

  function newLine(type) {
    const p = document.createElement('p');
    if (type === 'cmd') {
      p.innerHTML = '<span class="tprompt">$</span> ';
      const cmd = document.createElement('span');
      cmd.className = 'tcmd';
      p.appendChild(cmd);
    } else if (type === 'out-green') {
      p.className = 'tout-green';
    } else {
      p.className = 'tout';
    }
    container.appendChild(p);
    return p;
  }

  function addFinalCursor() {
    const p = document.createElement('p');
    p.innerHTML = '<span class="tprompt">$</span> <span class="tcursor">&#9608;</span>';
    container.appendChild(p);
  }

  function tick() {
    if (li >= script.length) { addFinalCursor(); return; }
    const line = script[li];
    if (ci === 0) activeLine = newLine(line.type);
    const target = line.text;
    const el = line.type === 'cmd' ? activeLine.querySelector('.tcmd') : activeLine;
    if (ci < target.length) {
      el.textContent += target[ci];
      ci++;
      setTimeout(tick, line.type === 'cmd' ? 60 : 18);
    } else {
      ci = 0; li++;
      setTimeout(tick, line.type === 'cmd' ? 180 : 320);
    }
  }

  setTimeout(tick, 700);
})();

/* ── 10. Contact Form — Formspree ─────────────────────────── */
(function initContactForm() {
  const form     = qs('#contact-form');
  const feedback = qs('#form-feedback');
  if (!form) return;

  const FORMSPREE_ID = 'maqllyvq';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = qs('#cf-name',    form).value.trim();
    const email   = qs('#cf-email',   form).value.trim();
    const subject = qs('#cf-subject', form).value.trim();
    const message = qs('#cf-message', form).value.trim();

    if (!name || !email || !message) {
      feedback.style.color = '#f87171';
      feedback.textContent = 'Please fill in all required fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.style.color = '#f87171';
      feedback.textContent = 'Please enter a valid email address.';
      return;
    }

    const btn      = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled   = true;
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    feedback.textContent = '';

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    name,
          email:   email,
          subject: subject || '(No subject)',
          message: message,
        }),
      });

      if (res.ok) {
        btn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#22c55e';
        btn.style.color      = '#fff';
        feedback.style.color = 'var(--accent)';
        feedback.textContent = "Thanks! I'll get back to you within 24-48 hours.";
        form.reset();
        setTimeout(() => {
          btn.innerHTML        = origHTML;
          btn.style.background = '';
          btn.style.color      = '';
          btn.disabled         = false;
          feedback.textContent = '';
        }, 5000);
      } else {
        throw new Error('error');
      }
    } catch {
      btn.innerHTML        = origHTML;
      btn.style.background = '';
      btn.style.color      = '';
      btn.disabled         = false;
      feedback.style.color = '#f87171';
      feedback.textContent = 'Something went wrong. Email: navaneethnavaneeth769@gmail.com';
    }
  });
})();
