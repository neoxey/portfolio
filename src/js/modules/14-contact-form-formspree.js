import { qs, qsa } from '../dom.js';

/* ── 14. Contact Form — Formspree ─────────────────────────── */
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
        body: JSON.stringify({ name, email, subject: subject || '(No subject)', message }),
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
      } else { throw new Error('error'); }
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
