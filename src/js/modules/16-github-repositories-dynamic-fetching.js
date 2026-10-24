import { qs, qsa } from '../dom.js';

/* ── 16. GitHub Repositories Dynamic Fetching ───────────────── */
(function initGitHubProjects() {
  const filterBtns   = qsa('.filter-btn');
  const featuredGrid = qs('#featured-projects');
  const githubGrid   = qs('#github-projects');
  if (!filterBtns.length || !featuredGrid || !githubGrid) return;

  const GITHUB_USERNAME = 'neoxey';
  let hasFetched = false;

  const langColors = {
    javascript: '#f1e05a', typescript: '#3178c6', html: '#e34c26',
    css: '#563d7c', python: '#3572a5', shell: '#89e051',
    java: '#b07219', c: '#555555', cpp: '#f34b7d', 'c#': '#178600'
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'featured') {
        githubGrid.style.display  = 'none';
        featuredGrid.style.display = '';
      } else {
        featuredGrid.style.display = 'none';
        githubGrid.style.display   = '';
        if (!hasFetched) fetchRepos();
      }
    });
  });

  async function fetchRepos() {
    hasFetched = true;
    githubGrid.innerHTML = `<div class="tel-loader"><div class="spinner"></div><p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem;">Connecting to GitHub API...</p></div>`;
    try {
      const res   = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
      if (!res.ok) throw new Error('API request failed');
      const repos = await res.json();
      const ownRepos = repos.filter(r => !r.fork).slice(0, 6);
      githubGrid.innerHTML = '';
      if (!ownRepos.length) {
        githubGrid.innerHTML = `<div class="tel-loader"><i class="fas fa-folder-open" style="font-size:2rem; color:var(--text-faint);"></i><p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem;">No original public repositories found.</p><a href="https://github.com/neoxey" target="_blank" class="btn btn-ghost" style="padding:10px 20px; font-size:0.8rem; margin-top:8px;">View Profile</a></div>`;
        return;
      }
      ownRepos.forEach((repo, idx) => {
        const card = document.createElement('article');
        card.className = 'repo-card glow-card reveal';
        card.style.setProperty('--delay', `${idx * 80}ms`);
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
        const desc     = repo.description || 'No description provided for this repository.';
        const lang     = repo.language    || 'HTML/CSS';
        const langKey  = lang.toLowerCase();
        const dotColor = langColors[langKey] || 'var(--accent)';
        card.innerHTML = `
          <div class="repo-header">
            <h3 class="repo-name">${repo.name}</h3>
            <a href="${repo.html_url}" target="_blank" class="repo-link" aria-label="View ${repo.name} on GitHub"><i class="fab fa-github"></i></a>
          </div>
          <p class="repo-desc">${desc}</p>
          <div class="repo-footer">
            <span class="repo-lang"><span class="lang-dot" style="background: ${dotColor};"></span><span>${lang}</span></span>
            <div class="repo-stats">
              <span class="repo-stat" title="${repo.stargazers_count} stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
              <span class="repo-stat" title="${repo.forks_count} forks"><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
            </div>
          </div>
        `;
        githubGrid.appendChild(card);
        setTimeout(() => { card.classList.add('in'); }, 50);
      });
    } catch (err) {
      console.error(err);
      githubGrid.innerHTML = `<div class="tel-loader"><i class="fas fa-circle-exclamation" style="font-size:2rem; color:#ef4444;"></i><p style="font-family:'JetBrains Mono', monospace; font-size:0.9rem; text-align:center;">Failed to load repositories (GitHub API rate limit exceeded).<br><span style="font-size:0.75rem; color:var(--text-faint);">Direct profile link is active below.</span></p><a href="https://github.com/neoxey" target="_blank" class="btn btn-primary" style="padding:12px 24px; font-size:0.85rem; margin-top:8px;">Visit github.com/neoxey <i class="fas fa-arrow-right"></i></a></div>`;
    }
  }
})();
