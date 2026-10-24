import { qs, qsa } from '../dom.js';

/* ── 13. Interactive Terminal Shell ─────────────────────────── */
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
    if (li >= script.length) { endSimulation(); return; }
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
      const p  = newLine(line.type);
      const el = line.type === 'cmd' ? p.querySelector('.tcmd') : p;
      el.innerHTML = line.text;
    });
    endSimulation();
  }

  function endSimulation() {
    isSimulating = false;
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
    if (input) { input.focus(); input.addEventListener('keydown', handleKeydown); }
  }

  termWin.addEventListener('click', () => {
    if (isSimulating) { skipSimulation(); }
    else { const input = qs('#term-input'); if (input) input.focus(); }
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
      '  • Filter Status:        <span class="tout-green">active & blocking</span>'
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
      case 'home-server': case 'homeserver':
        return ['Project: Home Server Setup','-------------------------','Personal hardware host running Ubuntu Linux. Manages systemd configuration profiles, custom firewall tables, remote key access (SSH), and system-level logging.'];
      case 'pi-hole': case 'pihole':
        return ['Project: Pi-hole DNS Sinkhole','-----------------------------','Deployed network-wide ad blocker intercepting DNS queries. Configured blocklists, Whitelists, DHCP servers, and customized local LAN domains.'];
      case 'samba-share': case 'samba': case 'sambashare':
        return ['Project: Samba File Server','--------------------------','Cross-platform file server configuring SMB/CIFS directories. Features user-isolated logins, read/write locks, and persistent network storage mounts.'];
      case 'nginx-web': case 'nginx':
        return ['Project: Personal Website on Nginx','----------------------------------','Configured custom Nginx server blocks, virtual directory bindings, port mapping interfaces, and secure network gateways for personal web host services.'];
      case 'tg-bot': case 'tgbot': case 'telegram': case 'telegram-bot':
        return ['Project: Telegram Remote SSH Bot','--------------------------------','Python API script linking remote secure SSH command execution with whitelist-filtered Telegram commands. Supports automated diagnostics and natural language prompts.'];
      default:
        return [`Project "${args[0]}" not recognized. Type "projects" to list items.`];
    }
  }

  function handleSystemctl(args) {
    if (!args || args.length === 0 || args[0] !== 'status') return ['Usage: systemctl status [nginx | pihole | samba | telegram-bot]'];
    const service = args[1];
    if (!service) return ['Error: Specify service name. e.g., systemctl status nginx'];
    switch (service.toLowerCase()) {
      case 'nginx':
        return ['● nginx.service - High performance web server','   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)','   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago','   Main PID: 1042 (nginx)'];
      case 'pihole': case 'pi-hole':
        return ['● pihole-FTL.service - Pi-hole DNS Forwarder','   Loaded: loaded (/etc/systemd/system/pihole-FTL.service; enabled)','   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago'];
      case 'samba': case 'smb':
        return ['● smbd.service - Samba SMB Daemon','   Loaded: loaded (/lib/systemd/system/smbd.service; enabled)','   Active: <span class="tout-green">active (running)</span> since Tue 2026-05-12; 8 days ago'];
      case 'telegram-bot': case 'tg-bot': case 'telegram':
        return ['● telegram-remote.service - Remote SSH Control Bot','   Loaded: loaded; enabled','   Active: <span class="tout-green">active (running)</span> since Wed 2026-05-13; 7 days ago'];
      default:
        return [`Unit ${service}.service not found. Try: nginx, pihole, samba, telegram-bot`];
    }
  }

  function handleKeydown(e) {
    const input = e.target;
    if (e.key === 'Enter') {
      const fullCmd = input.value.trim();
      const parts   = fullCmd.split(/\s+/);
      const cmd     = parts[0].toLowerCase();
      const args    = parts.slice(1);
      if (fullCmd) { cmdHistory.push(fullCmd); if (cmdHistory.length > 50) cmdHistory.shift(); }
      historyIndex = -1;
      const oldPrompt = document.createElement('p');
      oldPrompt.innerHTML = `<span class="tprompt">$</span> <span class="tcmd">${fullCmd}</span>`;
      container.insertBefore(oldPrompt, qs('#term-input-line'));
      input.value = '';
      if (cmd) {
        let output = [];
        if (cmd === 'clear') {
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
      if (!cmdHistory.length) return;
      if (historyIndex === -1) historyIndex = cmdHistory.length - 1;
      else historyIndex = Math.max(0, historyIndex - 1);
      input.value = cmdHistory[historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex === cmdHistory.length - 1) { historyIndex = -1; input.value = ''; }
      else { historyIndex++; input.value = cmdHistory[historyIndex]; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const allCmds = [...Object.keys(commands), 'projects', 'systemctl'];
      const matches = allCmds.filter(c => c.startsWith(val));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        const matchLine = document.createElement('p');
        matchLine.className = 'tout';
        matchLine.style.color = 'var(--text-faint)';
        matchLine.innerHTML = matches.join('&nbsp;&nbsp;&nbsp;');
        container.insertBefore(matchLine, qs('#term-input-line'));
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  setTimeout(tick, 700);
})();
