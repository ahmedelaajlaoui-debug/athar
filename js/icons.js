/* ==========================================================
   icons.js — one consistent line-icon set (24x24, stroke 1.7)
   Usage in JS:   AA.icon("cart")
   Usage in HTML: <span data-icon="cart"></span>   (hydrated by main.js)
   Replaces every decorative emoji of the previous version.
   ========================================================== */
AA.ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
  cart: '<path d="M3 4h2.4l2 10.2h9.4l1.9-7.4H6.2"/><circle cx="9" cy="18.6" r="1.4"/><circle cx="16.6" cy="18.6" r="1.4"/>',
  user: '<circle cx="12" cy="8.2" r="3.7"/><path d="M4.8 20c.6-3.7 3.4-5.8 7.2-5.8s6.6 2.1 7.2 5.8"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S9.4 5.9 12 3.5z"/>',
  check: '<path d="M5 12.5l4.3 4.3L19 7.2"/>',
  checkCircle: '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/>',
  arrowRight: '<path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5"/>',
  arrowLeft: '<path d="M19.5 12h-15M10 6.5L4.5 12l5.5 5.5"/>',
  play: '<path d="M8.5 6.2v11.6L18 12z"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18v-0.5M12 9v11M12 9c-1.2-4.2-5.2-4.6-5.2-2.2S10 9 12 9zM12 9c1.2-4.2 5.2-4.6 5.2-2.2S14 9 12 9z"/>',
  pin: '<path d="M12 21s6.5-5.8 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.2 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  box: '<path d="M3.5 7.8L12 3.5l8.5 4.3v8.4L12 20.5l-8.5-4.3z"/><path d="M3.5 7.8L12 12l8.5-4.2M12 12v8.5"/>',
  truck: '<path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4l3 3.2V16h-7"/><circle cx="7" cy="17.4" r="1.6"/><circle cx="17" cy="17.4" r="1.6"/>',
  city: '<path d="M4 20.5V9.5l4-2.5v13.5M8 20.5V4.5l5-1.8v17.8M13 20.5v-8l7 2.5v5.5M3 20.5h18M10.5 8h.01M10.5 11.5h.01M10.5 15h.01"/>',
  home: '<path d="M4 11l8-6.8 8 6.8M6 9.6V20h12V9.6"/><path d="M10 20v-5.4h4V20"/>',
  handshake: '<path d="M2.5 11.5l4-4 4 1.2 2.4-1.2 3 1.4 4.6-.6 1 4.2-5.6 5.6a2.2 2.2 0 0 1-3.1 0l-.9-.9M10.7 8.7L8 12.4a1.7 1.7 0 0 0 2.5 2.2l2.2-2"/>',
  graduation: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.8v4.2c1.4 1.4 3.3 2.2 5.5 2.2s4.1-.8 5.5-2.2v-4.2M21.5 9.5V15"/>',
  vase: '<path d="M9 3.5h6M10 3.5v3c0 1.6-3.5 3-3.5 7.2 0 3.5 2.4 6.3 5.5 6.3s5.5-2.8 5.5-6.3c0-4.2-3.5-5.6-3.5-7.2v-3"/><path d="M7 13.2h10"/>',
  telescope: '<path d="M3.5 12.5l11-4.6 1.7 4-11 4.6zM14.6 7.9l-.8-1.8 3.7-1.5 1.5 3.6-3.7 1.5M10 15.2l-2.5 5.3M11 15.8l2.6 4.7"/>',
  scroll: '<path d="M8 4.5h10.5v12.8a2.5 2.5 0 0 1-2.5 2.5H6.8a2.3 2.3 0 0 0 2.3-2.3V6.2A1.7 1.7 0 0 0 7.4 4.5 1.7 1.7 0 0 0 5.5 6.2v1.3H9"/><path d="M11.5 9h4M11.5 12.5h4"/>',
  thread: '<circle cx="12" cy="12" r="8"/><path d="M5 9.6c4.5 1.2 9 .6 14 3M5.6 14.6c4 .6 8-.2 12-2.6M9 4.6c-1.5 5.4-.9 9.8 1.2 15M14.4 4.4c-1 5.4-.2 10 2.4 14.4"/>',
  gem: '<path d="M7 4.5h10l3.5 5-8.5 10.5L3.5 9.5z"/><path d="M3.5 9.5h17M9.5 4.5L8 9.5l4 10.5 4-10.5-1.5-5"/>',
  ring: '<circle cx="12" cy="14.5" r="5.5"/><path d="M9.2 5.2l1.5-2h2.6l1.5 2-2.8 3.3z"/>',
  bag: '<path d="M5.5 8.5h13l1 11.5h-15z"/><path d="M8.7 8.5V7a3.3 3.3 0 0 1 6.6 0v1.5"/>',
  incense: '<path d="M5 12.5h14a7 7 0 0 1-14 0zM8.5 19.5L7.5 21h9l-1-1.5M12 9.6c-1.6-1.4-1.6-2.6 0-3.8s1.6-2.2 0-3.3"/>',
  shield: '<path d="M12 3.5l7 2.6v5.6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6.1z"/><path d="M8.8 12l2.3 2.3 4.2-4.6"/>',
  dune: '<circle cx="16.5" cy="7.5" r="2.6"/><path d="M2.5 19c3-5 6-7.6 9-7.6s5 2.2 10 7.6M2.5 19h19"/>',
  search_empty: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8.3 11h5.4"/>',
  alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v5M12 16.2h.01"/>',
  star8: '<path d="M12 2.5l2.8 3.8 4.7-.1-.1 4.7 3.6 2.9-3.6 2.9.1 4.7-4.7-.1L12 21.5l-2.8-3.8-4.7.1.1-4.7L1.9 10.3l3.6-2.9-.1-4.7 4.7.1z" transform="translate(0.3 0.3) scale(.97)"/>',
  chisel: '<path d="M15 3.5l5.5 5.5-3 3-5.5-5.5z"/><path d="M12 7.5L4.5 15v4.5H9l7.5-7.5M9 12l3 3"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11.5v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12.5v15h6a1.5 1.5 0 0 1 1.5 1.5z"/>',
  landmark: '<path d="M3.5 9.5L12 4l8.5 5.5M5.5 10.5v7.5M9.5 10.5v7.5M14.5 10.5v7.5M18.5 10.5v7.5M3.5 20h17"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.5-3.4 2.8-5.2 5.5-5.2s5 1.8 5.5 5.2"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16 14.2c2.4 0 4 1.5 4.5 4.3"/>',
  userPlus: '<circle cx="10" cy="8.2" r="3.7"/><path d="M3.5 20c.6-3.7 3-5.8 6.5-5.8 1.2 0 2.300.2 3.300.7M18 14v6M15 17h6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  eyeOff: '<path d="M3 3l18 18M10.1 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.5 7.3A15.600 15.600 0 0 0 2.5 12S6 18.500 12 18.500c1.500 0 2.800-.3 4-.9M9.900 9.900a2.800 2.800 0 0 0 4.200 3.700"/>',
  upload: '<path d="M12 15.5V4.5M7.500 9L12 4.500 16.500 9M4.500 15v3.500a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V15"/>',
  briefcase: '<rect x="3.500" y="7.500" width="17" height="12" rx="1.800"/><path d="M9 7.500V5.800A1.300 1.300 0 0 1 10.300 4.500h3.400A1.300 1.300 0 0 1 15 5.800v1.700M3.500 12.500h17M10.500 12.500v1.500h3v-1.500"/>',
  userCircle: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="10" r="2.800"/><path d="M6.800 17.800c1.200-2.100 3.100-3.100 5.200-3.100s4 1 5.200 3.100"/>',
  store: '<path d="M4 9.500L5.500 4.500h13L20 9.500M4 9.500a2.700 2.700 0 0 0 5.300 0 2.700 2.700 0 0 0 5.400 0 2.700 2.700 0 0 0 5.300 0M5.500 12.500V20h13v-7.500M10 20v-4.500h4V20"/>',
  whatsapp: '<path d="M4 20l1.200-4.100A8 8 0 1 1 8.200 18.900z"/><path d="M9.200 8.800c.2 2.800 2.600 5.200 5.700 6.200l1.300-1.400-2.100-1-1 .8c-.9-.4-1.700-1.200-2.100-2.100l.8-.9-.9-2.100z"/>',
  edit: '<path d="M4.5 19.5l1-4L16.8 4.2a1.800 1.800 0 0 1 2.500 0l.5.5a1.800 1.800 0 0 1 0 2.500L8.500 18.500z M14.800 6.200l3 3"/>',
  trash: '<path d="M4.500 7h15M9.500 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.500 7l.8 12a1.500 1.500 0 0 0 1.500 1.400h6.400a1.500 1.500 0 0 0 1.500-1.400l.8-12M10 11v6M14 11v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  dashboard: '<rect x="3.500" y="3.500" width="7" height="8" rx="1.500"/><rect x="13.500" y="3.500" width="7" height="5" rx="1.500"/><rect x="13.500" y="11.500" width="7" height="9" rx="1.500"/><rect x="3.500" y="14.500" width="7" height="6" rx="1.500"/>',
};

AA.icon = (name, cls = "") => {
  const body = AA.ICON_PATHS[name] || AA.ICON_PATHS.star8;
  if (name === "arrowRight" || name === "arrowLeft") cls += " icon--dir"; // mirrored in right-to-left languages
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
};

/* Filled heart (favorite active) */
AA.iconFilled = (name, cls = "") => AA.icon(name, cls + " icon--filled");

/* ATHAR logo mark, inlined so colors follow the page (see assets/icons/logo-mark.svg) */
AA.logoMark = () => `<svg class="logo__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><polygon points="32.00,2.00 40.61,11.21 53.21,10.79 52.79,23.39 62.00,32.00 52.79,40.61 53.21,53.21 40.61,52.79 32.00,62.00 23.39,52.79 10.79,53.21 11.21,40.61 2.00,32.00 11.21,23.39 10.79,10.79 23.39,11.21" fill="#1f4a3a"/><polygon points="32.00,7.50 38.96,15.19 49.32,14.68 48.81,25.04 56.50,32.00 48.81,38.96 49.32,49.32 38.96,48.81 32.00,56.50 25.04,48.81 14.68,49.32 15.19,38.96 7.50,32.00 15.19,25.04 14.68,14.68 25.04,15.19" fill="none" stroke="#e9c58a" stroke-width="1.2" stroke-linejoin="round"/><path d="M24.5 43V33.2a7.5 7.5 0 1 1 15 0V43z" fill="#fbf6ec"/><path d="M28.6 43v-8.6a3.4 3.4 0 1 1 6.8 0V43z" fill="#b5532f"/><path d="M18 43.4c4.4-2.6 8-2.6 12 0s7.6 2.6 16 0" fill="none" stroke="#e9c58a" stroke-width="1.6" stroke-linecap="round"/></svg>`;

/* Replace every <span data-icon="name"></span> in the page (or in a given root) */
AA.hydrateIcons = (root = document) => {
  root.querySelectorAll("[data-icon]:not([data-icon-done])").forEach((el) => {
    el.innerHTML = AA.icon(el.dataset.icon);
    el.setAttribute("data-icon-done", "1");
    el.classList.add("icon-wrap");
  });
};
