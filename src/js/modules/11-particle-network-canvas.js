import { qs, qsa } from '../dom.js';

/* ── 11. Particle Network Canvas ─────────────────────────── */
(function initParticles() {
  const canvas = qs('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT   = 80;
  const MAXDIST = 140;
  const SPEED   = 0.3;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.5 + 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  function getAccentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#00f2c3';
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccentColor();

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) {
        p.vx += (dx / d) * 0.12;
        p.vy += (dy / d) * 0.12;
      }
      // Speed cap
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > SPEED * 3) { p.vx *= 0.95; p.vy *= 0.95; }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAXDIST) {
          const alpha = (1 - d / MAXDIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  loop();
})();
