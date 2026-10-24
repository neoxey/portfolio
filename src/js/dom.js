/* Shared DOM helpers for portfolio modules. */
export const qs = (selector, context = document) => context.querySelector(selector);
export const qsa = (selector, context = document) => context.querySelectorAll(selector);
