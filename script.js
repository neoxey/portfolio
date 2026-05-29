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

/* ── 9. Interactive Terminal Shell ─────────────────────────── */
(function initTerminal() {
  const container = qs('#term-body');
  const termWin   = qs('.term-window');
  if (!container || !termWin) return;

  const script = [
    { type: 'cmd',       text: 'whoami' },
    { type: 'out',       text: 'navaneeth' },
    { type: 'cmd',       text: 'cat role.txt' },
    { type: 'out',       text: 'Aspiring Ethical Hacker & SOC Analyst' },
    { type: 'cmd',       text: 'systemctl status learning' },
    { type: 'out-green', text: '● Active: running (4 years)' },
    { type: 'cmd',       text: 'ls projects/' },
    { type: 'out',       text: 'home-server  pi-hole  samba  nginx  tg-bot' },
  ];

  let li = 0, ci = 0, activeLine = null, simTimer = null;
  let isSimulating = true;
  const cmdHistory = [];
  let historyIndex = -1;

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

  function tick() {
    if (li >= script.length) {
      endSimulation();
      return;
    }
    const line = script[li];
    if (ci === 0) activeLine = newLine(line.type);
    const target = line.text;
    const el = line.type === 'cmd' ? activeLine.querySelector('.tcmd') : activeLine;
    if (ci < target.length) {
      el.textContent += target[ci];
      ci++;
      simTimer = setTimeout(tick, line.type === 'cmd' ? 50 : 15);
    } else {
      ci = 0; li++;
      simTimer = setTimeout(tick, line.type === 'cmd' ? 150 : 300);
    }
    container.scrollTop = container.scrollHeight;
  }

  function skipSimulation() {
    if (!isSimulating) return;
    clearTimeout(simTimer);
    container.innerHTML = '';
    script.forEach(line => {
      const p = newLine(line.type);
      const el = line.type === 'cmd' ? p.querySelector('.tcmd') : p;
      el.innerHTML = line.text;
    });
    endSimulation();
  }

  function endSimulation() {
    isSimulating = false;
    // Add interactive prompt
    const promptLine = document.createElement('div');
    promptLine.className = 'term-input-line';
    promptLine.id = 'term-input-line';
    promptLine.innerHTML = `
      <span class="tprompt">$</span>
      <input type="text" class="term-input" id="term-input" autocomplete="off" spellcheck="false" placeholder="type 'help'..." />
    `;
    container.appendChild(promptLine);
    container.scrollTop = container.scrollHeight;

    const input = qs('#term-input');
    if (input) {
      input.focus();
      input.addEventListener('keydown', handleKeydown);
    }
  }

  termWin.addEventListener('click', () => {
    if (isSimulating) {
      skipSimulation();
    } else {
      const input = qs('#term-input');
      if (input) input.focus();
    }
  });

  const commands = {
    help: () => [
      'Available commands:',
      '  neofetch   - Display system and profile details',
      '  projects   - List highlighted networks/systems projects',
      '  skills     - Render horizontal skill proficiency bars',
      '  pihole     - Get simulated live Pi-hole ad blocking stats',
      '  systemctl  - Check service status (e.g. systemctl nginx)',
      '  contact    - View email, phone, and GitHub developer links',
      '  clear      - Clear the terminal screen log'
    ],
    neofetch: () => [
      '    _  _      <span class="tout-green" style="font-weight:bold;">neoxey@homeserver</span>',
      '   | \\| |     -----------------',
      '   | .  |     <span style="color:var(--accent);">OS</span>: Ubuntu 24.04 LTS x86_64',
      '   |_|\\_|     <span style="color:var(--accent);">Host</span>: Acer TN Gov Laptop (ELCOT)',
      '              <span style="color:var(--accent);">UPS</span>: Integrated Battery UPS Backup',
      '              <span style="color:var(--accent);">Aspiration</span>: Ethical Hacker / SOC Analyst',
      '              <span style="color:var(--accent);">Uptime</span>: 24 days, 6 hours, 12 mins',
      '              <span style="color:var(--accent);">Shell</span>: bash 5.2.21',
      '              <span style="color:var(--accent);">CPU</span>: Intel Dual-Core Processor',
      '              <span style="color:var(--accent);">Memory</span>: 2.84 GiB / 3.82 GiB (74% - 4GB)',
      '              <span style="color:var(--accent);">Disk</span>: 98 GiB / 238 GiB (41% - 256GB SSD)',
      '              <span style="color:var(--accent);">Stack</span>: HTML/CSS/JS, Python (Basic)'
    ],
    skills: () => [
      'Skill Proficiency (Learned hands-on by building systems):',
      '  HTML/CSS/JS  [======================----] 88%',
      '  Linux & CLI  [====================------] 85%',
      '  Nginx Proxy  [==================--------] 78%',
      '  Networking   [=================---------] 72%',
      '  Python (Basic)[==========----------------] 40%',
      '  Samba Setup  [================----------] 70%'
    ],
    pihole: () => [
      '[ Pi-hole DNS Ad-blocker Stats ]',
      '  • Total Network Queries: 84,291',
      '  • Ad-queries Blocked:   26,130',
      '  • Percentage Blocked:   31.0%',
      '  • Domains on Blocklist: 2,491,085',
      '  • Filter Status:        <span class="tout-green">active &amp; blocking</span>'
    ],
    contact: () => [
      'Contact Details:',
      '  • Email:  <a href="mailto:navaneethnavaneeth769@gmail.com" style="color:var(--accent);text-decoration:underline;">navaneethnavaneeth769@gmail.com</a>',
      '  • Phone:  <a href="tel:+917695996284" style="color:var(--accent);text-decoration:underline;">+91 7695 996 284</a>',
      '  • GitHub: <a href="https://github.com/neoxey" target="_blank" style="color:var(--accent);text-decoration:underline;">github.com/neoxey</a>'
    ]
  };

  function handleProjects(args) {
    if (!args || args.length === 0) {
      return [
        'Highlighted Systems Projects:',
        '  • <span style="color:var(--accent);">home-server</span>  - Personal server virtualization & hosting',
        '  • <span style="color:var(--accent);">pi-hole</span>      - Network-wide DNS sinkhole ad-blocking',
        '  • <span style="color:var(--accent);">samba-share</span>  - Cross-platform secure SMB file storage',
        '  • <span style="color:var(--accent);">nginx-web</span>    - Web service blocks & port management',
        '  • <span style="color:var(--accent);">tg-bot</span>       - Remote SSH controller bot with AI parsing',
        '',
        'Type "projects [name]" for details. e.g. projects tg-bot'
      ];
    }
    const name = args[0].toLowerCase();
    switch (name) {
      case 'home-server':
      case 'homeserver':
        return [
          'Project: Home Server Setup',
          '-------------------------',
          'Personal hardware host running Ubuntu Linux. Manages systemd configuration profiles, custom firewall tables, remote key access (SSH), and system-level logging.'
        ];
      case 'pi-hole':
      case 'pihole':
        return [
          'Project: Pi-hole DNS Sinkhole',
          '-----------------------------',
          'Deployed network-wide ad blocker intercepting DNS queries. Configured blocklists, Whitelists, DHCP servers, and customized local LAN domains.'
        ];
      case 'samba-share':
      case 'samba':
      case 'sambashare':
        return [
          'Project: Samba File Server',
          '--------------------------',
          'Cross-platform file server configuring SMB/CIFS directories. Features user-isolated logins, read/write locks, and persistent network storage mounts.'
        ];
      case 'nginx-web':
      case 'nginx':
        return [
          'Project: Personal Website on Nginx',
          '----------------------------------',
          'Configured custom Nginx server blocks, virtual directory bindings, port mapping interfaces, and secure network gateways for personal web host services.'
        ];
      case 'tg-bot':
      case 'tgbot':
      case 'telegram':
      case 'telegram-bot':
        return [
          'Project: Telegram Remote SSH Bot',
          '--------------------------------',
          'Python API script linking remote secure SSH command execution with whitelist-filtered Telegram commands. Supports automated diagnostics and natural language prompts.'
        ];
      default:
        return [`Project "${args[0]}" not recognized. Type "projects" to list items.`];
    }
  }

  function handleSystemctl(args) {
    if (!args || args.length === 0 || args[0] !== 'status') {
      return ['Usage: systemctl status [nginx | pihole | samba | telegram-bot]'];
    }
    const service = args[1];
    if (!service) {
      return ['Error: Specify service name. e.g., systemctl status nginx'];
    }
    switch (service.toLowerCase()) {
      case 'nginx':
        return [
          '● nginx.service - High performance web server',
          '   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)',
          '   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago',
          '   Main PID: 1042 (nginx)',
          '   CGroup: /system.slice/nginx.service',
          '           ├─1042 nginx: master process /usr/sbin/nginx',
          '           └─1043 nginx: worker process /var/www'
        ];
      case 'pihole':
      case 'pi-hole':
        return [
          '● pihole-FTL.service - Pi-hole DNS Forwarder and Ad-blocking engine',
          '   Loaded: loaded (/etc/systemd/system/pihole-FTL.service; enabled)',
          '   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago',
          '   Main PID: 820 (pihole-FTL)',
          '   Tasks: 9 (limit: 4915)',
          '   CGroup: /system.slice/pihole-FTL.service'
        ];
      case 'samba':
      case 'smb':
        return [
          '● smbd.service - Samba SMB Daemon',
          '   Loaded: loaded (/lib/systemd/system/smbd.service; enabled)',
          '   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago',
          '   Main PID: 955 (smbd)',
          '   CGroup: /system.slice/smbd.service'
        ];
      case 'telegram-bot':
      case 'tg-bot':
      case 'telegram':
        return [
          '● telegram-remote.service - Remote SSH Control Telegram Bot',
          '   Loaded: loaded (/lib/systemd/system/telegram-remote.service; enabled)',
          '   Active: <span class="tout-green">active (running)</span> since Wed 2026-05-13; 7 days ago',
          '   Main PID: 1104 (python3)',
          '   CGroup: /system.slice/telegram-remote.service'
        ];
      default:
        return [`Unit ${service}.service not found. Try: nginx, pihole, samba, telegram-bot`];
    }
  }

  function handleKeydown(e) {
    const input = e.target;
    if (e.key === 'Enter') {
      const fullCmd = input.value.trim();
      const parts = fullCmd.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Record History
      if (fullCmd) {
        cmdHistory.push(fullCmd);
        if (cmdHistory.length > 50) cmdHistory.shift();
      }
      historyIndex = -1;

      // Print input line
      const oldPrompt = document.createElement('p');
      oldPrompt.innerHTML = `<span class="tprompt">$</span> <span class="tcmd">${fullCmd}</span>`;
      container.insertBefore(oldPrompt, qs('#term-input-line'));

      input.value = '';

      if (cmd) {
        let output = [];
        if (cmd === 'clear') {
          // Keep only the input prompt
          const line = qs('#term-input-line');
          container.innerHTML = '';
          container.appendChild(line);
          input.focus();
          return;
        } else if (commands[cmd]) {
          output = commands[cmd]();
        } else if (cmd === 'projects') {
          output = handleProjects(args);
        } else if (cmd === 'systemctl') {
          output = handleSystemctl(args);
        } else {
          output = [`bash: command not found: ${cmd}. Type "help" to see available commands.`];
        }

        // Print outputs
        output.forEach(line => {
          const p = document.createElement('p');
          p.className = 'tout';
          p.innerHTML = line;
          container.insertBefore(p, qs('#term-input-line'));
        });
      }
      container.scrollTop = container.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIndex === -1) historyIndex = cmdHistory.length - 1;
      else historyIndex = Math.max(0, historyIndex - 1);
      input.value = cmdHistory[historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex === cmdHistory.length - 1) {
        historyIndex = -1;
        input.value = '';
      } else {
        historyIndex++;
        input.value = cmdHistory[historyIndex];
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const allCmds = [...Object.keys(commands), 'projects', 'systemctl'];
      const matches = allCmds.filter(c => c.startsWith(val));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        // Print tab completions
        const matchLine = document.createElement('p');
        matchLine.className = 'tout';
        matchLine.style.color = 'var(--text-faint)';
        matchLine.innerHTML = matches.join('&nbsp;&nbsp;&nbsp;');
        matchLine.style.wordBreak = 'break-word';
        container.insertBefore(matchLine, qs('#term-input-line'));
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  setTimeout(tick, 700);
})();

/* ── 10. Mouse Tracking Glow Effect ─────────────────────────── */
(function initGlow() {
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.glow-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, { passive: true });
})();

/* ── 11. Contact Form — Formspree ─────────────────────────── */
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

/* ── 12. Live Server Telemetry Dashboard Simulation ─────────── */
(function initTelemetryDashboard() {
  const chartCanvas = qs('#telemetry-chart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  
  // Responsive canvas resizing
  function resizeCanvas() {
    const rect = chartCanvas.parentElement.getBoundingClientRect();
    chartCanvas.width = rect.width;
    chartCanvas.height = 100;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Initial simulation data
  const dataPoints = Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 15);
  
  let totalQueries = 84291;
  let blockedQueries = 26130;
  
  function drawChart() {
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    
    const w = chartCanvas.width;
    const h = chartCanvas.height;
    const padding = 10;
    
    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    const step = w / (dataPoints.length - 1);
    
    // Create line path
    ctx.beginPath();
    for (let i = 0; i < dataPoints.length; i++) {
      const x = i * step;
      const y = h - padding - ((dataPoints[i] / 100) * (h - 2 * padding));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    // Gradient Stroke for line
    const strokeGrad = ctx.createLinearGradient(0, 0, w, 0);
    strokeGrad.addColorStop(0, '#00f2c3'); // var(--accent)
    strokeGrad.addColorStop(1, '#0ea5e9'); // var(--accent-secondary)
    
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0, 242, 195, 0.4)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    
    // Draw Area under line (Gradient Fill)
    ctx.shadowBlur = 0; // turn off shadow for fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < dataPoints.length; i++) {
      const x = i * step;
      const y = h - padding - ((dataPoints[i] / 100) * (h - 2 * padding));
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, 'rgba(0, 242, 195, 0.15)');
    fillGrad.addColorStop(1, 'rgba(0, 242, 195, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();
    
    // Draw a blinking current point dot at the end
    const lastX = w;
    const lastY = h - padding - ((dataPoints[dataPoints.length - 1] / 100) * (h - 2 * padding));
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#0ea5e9';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Live updates loop
  setInterval(() => {
    // 1. Telemetry Gauges Update (CPU & RAM)
    const cpuBar = qs('#cpu-bar');
    const cpuVal = qs('#cpu-val');
    const ramBar = qs('#ram-bar');
    const ramVal = qs('#ram-val');
    
    if (cpuBar && cpuVal) {
      const cpu = Math.floor(Math.random() * 35) + 15; // 15-50%
      cpuBar.style.width = cpu + '%';
      cpuVal.textContent = cpu + '%';
    }
    if (ramBar && ramVal) {
      const ram = Math.floor(Math.random() * 8) + 68; // 68-75%
      ramBar.style.width = ram + '%';
      ramVal.textContent = ram + '%';
    }
    
    // 2. Services Stats Update
    const nginxStatus = qs('#nginx-status');
    const sambaStatus = qs('#samba-status');
    if (nginxStatus) {
      const reqs = Math.floor(Math.random() * 40) + 60; // 60-100 req
      nginxStatus.textContent = `Active (${reqs} req/min)`;
    }
    if (sambaStatus) {
      const clients = Math.floor(Math.random() * 3) + 2; // 2-4 clients
      sambaStatus.textContent = `Active (${clients} clients connected)`;
    }
    
    // 3. Pi-hole Stats Update
    const qEl = qs('#pihole-queries');
    const bEl = qs('#pihole-blocked');
    const pEl = qs('#pihole-percent');
    
    if (qEl && bEl && pEl) {
      const newQueries = Math.floor(Math.random() * 4) + 1;
      const isBlocked = Math.random() < 0.32; // 32% block rate
      totalQueries += newQueries;
      if (isBlocked) blockedQueries += newQueries;
      
      qEl.textContent = totalQueries.toLocaleString();
      bEl.textContent = blockedQueries.toLocaleString();
      pEl.textContent = ((blockedQueries / totalQueries) * 100).toFixed(1) + '%';
    }
    
    // 4. Update and shift chart data
    const lastVal = dataPoints[dataPoints.length - 1];
    let nextVal = lastVal + (Math.floor(Math.random() * 16) - 8); // drift value
    nextVal = Math.max(10, Math.min(90, nextVal));
    dataPoints.shift();
    dataPoints.push(nextVal);
    
    drawChart();
  }, 2000);

  // Initial draw
  setTimeout(() => {
    resizeCanvas();
    drawChart();
  }, 300);
})();

/* ── 13. GitHub Repositories Dynamic Fetching ───────────────── */
(function initGitHubProjects() {
  const filterBtns      = qsa('.filter-btn');
  const featuredGrid    = qs('#featured-projects');
  const githubGrid      = qs('#github-projects');
  
  if (!filterBtns.length || !featuredGrid || !githubGrid) return;
  
  const GITHUB_USERNAME = 'neoxey';
  let hasFetched = false;
  
  // Color codes for primary languages
  const langColors = {
    javascript: '#f1e05a',
    typescript: '#3178c6',
    html:       '#e34c26',
    css:        '#563d7c',
    python:     '#3572a5',
    shell:      '#89e051',
    java:       '#b07219',
    c:          '#555555',
    cpp:        '#f34b7d',
    'c#':       '#178600'
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      if (filter === 'featured') {
        githubGrid.style.display = 'none';
        featuredGrid.style.display = '';
      } else {
        featuredGrid.style.display = 'none';
        githubGrid.style.display = '';
        if (!hasFetched) {
          fetchRepos();
        }
      }
    });
  });

  async function fetchRepos() {
    hasFetched = true;
    githubGrid.innerHTML = `
      <div class="tel-loader">
        <div class="spinner"></div>
        <p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem;">Connecting to GitHub API...</p>
      </div>
    `;

    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
      if (!res.ok) throw new Error('API request failed');
      const repos = await res.json();
      
      // Filter out forks (or keep them but prioritize original)
      const ownRepos = repos.filter(r => !r.fork).slice(0, 6);
      
      githubGrid.innerHTML = '';
      
      if (!ownRepos.length) {
        githubGrid.innerHTML = `
          <div class="tel-loader">
            <i class="fas fa-folder-open" style="font-size:2rem; color:var(--text-faint);"></i>
            <p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem;">No original public repositories found.</p>
            <a href="https://github.com/neoxey" target="_blank" class="btn btn-ghost" style="padding:10px 20px; font-size:0.8rem; margin-top:8px;">View Profile</a>
          </div>
        `;
        return;
      }

      ownRepos.forEach((repo, idx) => {
        const card = document.createElement('article');
        card.className = 'repo-card glow-card reveal';
        card.style.setProperty('--delay', `${idx * 80}ms`);
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        const desc = repo.description || 'No description provided for this repository.';
        const lang = repo.language || 'HTML/CSS';
        const langKey = lang.toLowerCase();
        const dotColor = langColors[langKey] || 'var(--accent)';
        
        card.innerHTML = `
          <div class="repo-header">
            <h3 class="repo-name">${repo.name}</h3>
            <a href="${repo.html_url}" target="_blank" class="repo-link" aria-label="View ${repo.name} on GitHub">
              <i class="fab fa-github"></i>
            </a>
          </div>
          <p class="repo-desc">${desc}</p>
          <div class="repo-footer">
            <span class="repo-lang">
              <span class="lang-dot" style="background: ${dotColor};"></span>
              <span>${lang}</span>
            </span>
            <div class="repo-stats">
              <span class="repo-stat" title="${repo.stargazers_count} stars">
                <i class="fas fa-star"></i> ${repo.stargazers_count}
              </span>
              <span class="repo-stat" title="${repo.forks_count} forks">
                <i class="fas fa-code-fork"></i> ${repo.forks_count}
              </span>
            </div>
          </div>
        `;
        
        githubGrid.appendChild(card);
        
        // Trigger visual fade-in since we inject them dynamically
        setTimeout(() => {
          card.classList.add('in');
        }, 50);
      });

    } catch (err) {
      console.error(err);
      // Fallback UI
      githubGrid.innerHTML = `
        <div class="tel-loader">
          <i class="fas fa-circle-exclamation" style="font-size:2rem; color:#ef4444;"></i>
          <p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem; text-align:center;">
            Failed to load repositories (GitHub API rate limit exceeded).<br>
            <span style="font-size:0.75rem; color:var(--text-faint);">Direct profile link is active below.</span>
          </p>
          <a href="https://github.com/neoxey" target="_blank" class="btn btn-primary" style="padding:12px 24px; font-size:0.85rem; margin-top:8px;">
            Visit github.com/neoxey <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      `;
    }
  }
})();

/* ── 14. Interactive Resume Print Trigger ────────────────────── */
(function initResumePrint() {
  const resumeBtn = qs('#resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', e => {
      e.preventDefault();
      window.print();
    });
  }
})();

