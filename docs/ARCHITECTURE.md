# Portfolio Architecture

## Overview

This is a static browser-native site using semantic HTML, one shared stylesheet, and native JavaScript ES modules. It requires no framework, bundler, or build pipeline.

## Source layout

- `index.html`: page structure, navigation, content sections, and resource declarations.
- `src/css/style.css`: design tokens, component styling, responsive breakpoints, motion, and print layout.
- `src/js/main.js`: entry point that imports feature modules in stable order.
- `src/js/dom.js`: shared `qs` and `qsa` DOM query helpers.
- `src/js/modules/`: one module per feature, including theme, navigation, visual effects, terminal, contact form, simulated telemetry, GitHub repositories, and resume printing.

## Runtime flow

1. The browser loads `index.html` and the stylesheet.
2. The module entry point imports each feature in declared order.
3. Each feature initializes its own behavior and uses shared DOM helpers where appropriate.
4. CSS manages presentation, responsive behavior, and print styles independently of JavaScript.

## Add a feature

1. Create a focused file in `src/js/modules/`.
2. Import helpers from `../dom.js` if needed.
3. Add its import to `src/js/main.js` in the appropriate order.
4. Add required markup to `index.html` and styles to `src/css/style.css`.
5. Test mobile/desktop, keyboard navigation, reduced motion, and external-service failure states.

## Reliability notes

Guard optional elements before attaching listeners. Keep core content readable if external APIs or CDNs fail. Do not rely on animation to communicate essential information. The telemetry panel is a visual simulation; it is not a real monitoring connection.

## External dependencies

The page currently loads fonts and icons from CDNs and Three.js for the WebGL background. Consider lazy-loading decorative effects and reducing overlapping background animations in a future performance pass.
