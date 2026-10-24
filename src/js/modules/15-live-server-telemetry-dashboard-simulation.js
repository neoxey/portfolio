import { qs, qsa } from '../dom.js';

/* ── 15. Live Server Telemetry Dashboard Simulation ─────────── */
(function initTelemetryDashboard() {
  const chartCanvas = qs('#telemetry-chart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');

  function resizeCanvas() {
    const rect = chartCanvas.parentElement.getBoundingClientRect();
    chartCanvas.width  = rect.width;
    chartCanvas.height = 100;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const dataPoints = Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 15);
  let totalQueries   = 84291;
  let blockedQueries = 26130;

  function drawChart() {
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    const w = chartCanvas.width;
    const h = chartCanvas.height;
    const padding = 10;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth   = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const step = w / (dataPoints.length - 1);
    ctx.beginPath();
    dataPoints.forEach((v, i) => {
      const x = i * step;
      const y = h - padding - ((v / 100) * (h - 2 * padding));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const strokeGrad = ctx.createLinearGradient(0, 0, w, 0);
    strokeGrad.addColorStop(0, '#00f2c3');
    strokeGrad.addColorStop(1, '#0ea5e9');
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = 'rgba(0, 242, 195, 0.4)';
    ctx.shadowBlur  = 8;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, h);
    dataPoints.forEach((v, i) => {
      const x = i * step;
      const y = h - padding - ((v / 100) * (h - 2 * padding));
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, 'rgba(0, 242, 195, 0.15)');
    fillGrad.addColorStop(1, 'rgba(0, 242, 195, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    const lastX = w;
    const lastY = h - padding - ((dataPoints[dataPoints.length - 1] / 100) * (h - 2 * padding));
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, 2 * Math.PI);
    ctx.fillStyle   = '#0ea5e9';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur  = 12;
    ctx.fill();
    ctx.shadowBlur  = 0;
  }

  setInterval(() => {
    const cpuBar = qs('#cpu-bar'), cpuVal = qs('#cpu-val');
    const ramBar = qs('#ram-bar'), ramVal = qs('#ram-val');
    if (cpuBar && cpuVal) { const cpu = Math.floor(Math.random() * 35) + 15; cpuBar.style.width = cpu + '%'; cpuVal.textContent = cpu + '%'; }
    if (ramBar && ramVal) { const ram = Math.floor(Math.random() * 8)  + 68; ramBar.style.width = ram + '%'; ramVal.textContent = ram + '%'; }
    const nginxStatus = qs('#nginx-status'), sambaStatus = qs('#samba-status');
    if (nginxStatus) nginxStatus.textContent = `Active (${Math.floor(Math.random() * 40) + 60} req/min)`;
    if (sambaStatus) sambaStatus.textContent = `Active (${Math.floor(Math.random() * 3) + 2} clients connected)`;
    const qEl = qs('#pihole-queries'), bEl = qs('#pihole-blocked'), pEl = qs('#pihole-percent');
    if (qEl && bEl && pEl) {
      const nq = Math.floor(Math.random() * 4) + 1;
      totalQueries += nq;
      if (Math.random() < 0.32) blockedQueries += nq;
      qEl.textContent = totalQueries.toLocaleString();
      bEl.textContent = blockedQueries.toLocaleString();
      pEl.textContent = ((blockedQueries / totalQueries) * 100).toFixed(1) + '%';
    }
    const lastVal = dataPoints[dataPoints.length - 1];
    let next = Math.max(10, Math.min(90, lastVal + Math.floor(Math.random() * 16) - 8));
    dataPoints.shift(); dataPoints.push(next);
    drawChart();
  }, 2000);

  setTimeout(() => { resizeCanvas(); drawChart(); }, 300);
})();
