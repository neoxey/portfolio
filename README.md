# Navaneeth | Portfolio

Personal portfolio for web development, Linux, networking, cybersecurity learning, and practical engineering projects.

🌐 **Live site:** https://neoxey.github.io/portfolio/  
💻 **GitHub:** https://github.com/neoxey

## Architecture

A lightweight static website built with semantic HTML, CSS, and native JavaScript ES modules. No bundler or build step is required.

```text
.
├── index.html                 # Page structure and section markup
├── src/
│   ├── css/style.css          # Design tokens, responsive and print styles
│   └── js/
│       ├── main.js            # Ordered module entry point
│       ├── dom.js             # Shared DOM query helpers
│       └── modules/           # One focused file per interactive feature
├── docs/ARCHITECTURE.md       # Architecture and extension guide
└── .github/                   # GitHub Pages workflow
```

## Run locally

Run `python -m http.server 8000` from the repository root and open `http://localhost:8000`. Serve over HTTP rather than opening `index.html` directly so browser module imports work.

## Principles

- Separate markup, styling, and behavior.
- Keep interactions in small feature modules.
- Keep essential content usable when animations or external APIs fail.
- Preserve responsive layouts, keyboard access, and print styles.

**Note:** The server telemetry panel is a front-end simulation, not live server metrics. GitHub's public API panel may be affected by rate limits.
