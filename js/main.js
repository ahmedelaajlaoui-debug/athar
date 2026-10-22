/* ==========================================================
   main.js — loaded on EVERY page (after data.js, icons.js, translations.js, i18n.js)
   - localStorage helpers (favorites, cart)
   - reusable header (logo, nav, search, favorites, cart, profile, language) and footer
   - toast messages, image fallback, shared card templates
   ========================================================== */

/* ---------- Small helpers ---------- */
AA.esc = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

AA.formatMAD = (n) => `${Math.round(n).toLocaleString(AA.getLangInfo(AA.lang).locale)} ${AA.t("currency")}`;

AA.getParam = (name) => new URLSearchParams(window.location.search).get(name);

/* ---------- localStorage (with a safety net) ---------- */
AA.store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* storage can be blocked (private mode): the site still works, just without saving */
    }
  },
};

/* ---------- Favorites ---------- */
AA.favs = {
  KEY: "aa_favs",
  all() {
    const data = AA.store.get(this.KEY, {});
    /* ignore ids that no longer exist (a deleted cooperative product, a removed cooperative) so lists and badges stay consistent */
    const products = (Array.isArray(data.product) ? data.product : []).filter((id) => AA.getProduct(id));
    const artisans = (Array.isArray(data.artisan) ? data.artisan : []).filter((id) => (AA.hasArtisan ? AA.hasArtisan(id) : true));
    return { product: products, artisan: artisans };
  },
  has(type, id) {
    return this.all()[type].includes(id);
  },
  toggle(type, id) {
    const data = this.all();
    const list = data[type];
    const index = list.indexOf(id);
    if (index === -1) list.push(id);
    else list.splice(index, 1);
    AA.store.set(this.KEY, data);
    AA.updateBadges();
    document.dispatchEvent(new CustomEvent("aa:favs"));
    return index === -1; // true = just added
  },
  count() {
    const data = this.all();
    // only count items that still exist (a cooperative product may have been deleted)
    return data.product.filter((id) => AA.getProduct(id)).length + data.artisan.length;
  },
};

/* ---------- Cart ---------- */
AA.cart = {
  KEY: "aa_cart",
  items() {
    // keep only products that still exist in the sample data
    return AA.store.get(this.KEY, []).filter((item) => AA.getProduct(item.id));
  },
  save(items) {
    AA.store.set(this.KEY, items);
    AA.updateBadges();
    document.dispatchEvent(new CustomEvent("aa:cart"));
  },
  add(id, qty = 1) {
    const items = this.items();
    const found = items.find((item) => item.id === id);
    if (found) found.qty += qty;
    else items.push({ id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.items();
    const found = items.find((item) => item.id === id);
    if (!found) return;
    found.qty = Math.max(1, Math.min(20, qty));
    this.save(items);
  },
  remove(id) {
    this.save(this.items().filter((item) => item.id !== id));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.items().reduce((sum, item) => sum + item.qty, 0);
  },
  subtotal() {
    return this.items().reduce((sum, item) => sum + AA.getProduct(item.id).price * item.qty, 0);
  },
};

/* ---------- Toast notifications ---------- */
AA.toast = (message, isError = false) => {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " is-error" : "");
  toast.innerHTML = AA.icon(isError ? "alert" : "checkCircle");
  toast.appendChild(document.createTextNode(message));
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

/* ---------- Images with graceful fallback ---------- */
const FALLBACK_COLORS = {
  Bijoux: ["#d9c9a8", "#8a8f94"], Tapis: ["#c9663d", "#6e2e1a"], Cuir: ["#a8693a", "#4a2c17"],
  Melhfa: ["#2f5d8a", "#1b3452"], Bakhour: ["#6b5a3e", "#2f2418"], default: ["#e0b876", "#8a5a34"],
};

/* If a photo cannot load, draw a simple illustration instead */
AA.fallback = (img) => {
  img.onerror = null; // avoid loops
  const [c1, c2] = FALLBACK_COLORS[img.dataset.cat] || FALLBACK_COLORS.default;
  const label = AA.esc(img.dataset.label || "ATHAR");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` +
    `<rect width="400" height="300" fill="url(#g)"/>` +
    `<path d="M0 230q60-40 120 0t120 0 120 0 40-10v80H0z" fill="rgba(255,255,255,.14)"/>` +
    `<path d="M200 70l22 40 40 22-40 22-22 40-22-40-40-22 40-22z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>` +
    `<text x="200" y="262" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="#fff">${label}</text></svg>`;
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

AA.img = (src, alt, cat = "") =>
  `<img src="${AA.esc(src)}" alt="${AA.esc(alt)}" loading="lazy" data-label="${AA.esc(alt)}" data-cat="${AA.esc(cat)}" onerror="AA.fallback(this)">`;

/* ---------- Shared card templates ---------- */
AA.favButton = (type, id) => {
  const active = AA.favs.has(type, id);
  return `<button class="fav-btn ${active ? "is-fav" : ""}" type="button" data-fav="${type}" data-id="${id}" aria-pressed="${active}" aria-label="${AA.t(active ? "fav.remove" : "fav.add")}">${AA.icon("heart")}</button>`;
};

AA.productCard = (p) => `
  <article class="card">
    <div class="card__img">
      <a href="produit.html?id=${p.id}" aria-label="${AA.esc(AA.t("card.viewProductAria", { name: p.name }))}">${AA.img(p.image, p.name, p.cat)}</a>
      ${AA.favButton("product", p.id)}
    </div>
    <div class="card__body">
      <div class="tags">
        <span class="tag">${AA.catLabel(p.cat)}</span>
        ${p.verified ? `<span class="tag tag--green">${AA.t("card.verified")}</span>` : ""}
        ${p.demoCoop ? `<span class="tag tag--terra">${AA.t("coop.tag.demo")}</span>` : ""}
      </div>
      <h3><a href="produit.html?id=${p.id}">${AA.esc(p.name)}</a></h3>
      <p class="card__meta">${AA.esc(AA.getArtisan(p.artisan).name)} · ${AA.cityLabel(p.city)}</p>
      <p class="card__price">${AA.formatMAD(p.price)}</p>
      <div class="card__actions">
        <a class="btn btn--outline btn--sm" href="produit.html?id=${p.id}">${AA.t("card.viewProduct")}</a>
        <button class="btn btn--primary btn--sm" type="button" data-add-cart data-id="${p.id}">${AA.t("card.add")}</button>
      </div>
    </div>
  </article>`;

AA.artisanCard = (a) => {
  const count = AA.products.filter((p) => p.artisan === a.id).length;
  return `
  <article class="card">
    <div class="card__img">
      <a href="artisans.html?id=${a.id}" aria-label="${AA.esc(AA.t("card.profileAria", { name: a.name }))}">${AA.img(a.photo, a.name, a.craft)}</a>
      ${AA.favButton("artisan", a.id)}
    </div>
    <div class="card__body">
      <div class="tags">
        <span class="tag">${AA.catLabel(a.craft)}</span>
        ${a.verified ? `<span class="tag tag--green">${AA.t("card.verified")}</span>` : ""}
      </div>
      <h3>${AA.esc(a.name)}</h3>
      <p class="card__meta">${AA.cityLabel(a.city)} · ${AA.esc(a.specialty)}</p>
      <p class="card__meta">${AA.plural("card.product", count)}</p>
      <div class="card__actions">
        <a class="btn btn--outline btn--sm" href="artisans.html?id=${a.id}">${AA.t("card.viewProfile")}</a>
      </div>
    </div>
  </article>`;
};

/* Shared empty state: icon + (optional title) + text + (optional button or custom HTML) */
AA.emptyState = ({ icon, title = "", text = "", href = "", label = "", extra = "" }) => `
  <div class="empty-state">
    <span class="icon-lg">${AA.icon(icon)}</span>
    ${title ? `<h3>${title}</h3>` : ""}
    ${text ? `<p>${text}</p>` : ""}
    ${href ? `<a class="btn btn--primary" href="${href}">${label}</a>` : ""}
    ${extra}
  </div>`;

/* Inline SVG for a motif (used on several pages) */
AA.motifSvg = (motif) => `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${motif.svg}</svg>`;

/* ---------- Header & footer components ---------- */
const NAV_LINKS = [
  { key: "nav.home", href: "index.html", pages: ["index"] },
  { key: "nav.explore", href: "explorer.html", pages: ["explorer", "region"] },
  { key: "nav.heritage", href: "patrimoine.html", pages: ["patrimoine", "savoir-faire"] },
  { key: "nav.artisans", href: "artisans.html", pages: ["artisans"] },
  {
    key: "nav.shop", href: "boutique.html", pages: ["boutique", "produit", "passeport", "coffret"],
    menu: () => [
      { label: AA.t("menu.shop.all"), href: "boutique.html" },
      ...AA.categories.map((c) => ({ label: AA.catLabel(c), href: `boutique.html?cat=${c}` })),
      { label: AA.t("menu.shop.coffret"), href: "coffret.html" },
    ],
  },
  {
    key: "nav.experiences", href: "experiences.html", pages: ["experiences", "expeditions", "impact", "emploi", "avis"],
    menu: () => [
      { label: AA.t("menu.exp.workshops"), href: "experiences.html" },
      { label: AA.t("menu.exp.shipping"), href: "expeditions.html" },
      { label: AA.t("menu.exp.impact"), href: "impact.html" },
      { label: AA.t("nav.jobs.menu"), href: "emploi.html" },
      { label: AA.t("nav.reviews.menu"), href: "avis.html" },
    ],
  },
];

/* Language selector (globe + current code, menu with the three languages) */
AA.languageSelectorHtml = () => {
  const current = AA.getLangInfo(AA.lang);
  const options = AA.LANGS.map((l) =>
    `<button type="button" role="menuitemradio" class="lang-option ${l.code === AA.lang ? "is-current" : ""}" data-lang="${l.code}" lang="${l.code}" aria-checked="${l.code === AA.lang}">
       <span>${l.label}</span>${l.code === AA.lang ? AA.icon("check") : ""}
     </button>`).join("");
  return `
    <div class="lang-selector" id="lang-selector">
      <button type="button" class="lang-selector__btn" id="lang-btn" aria-haspopup="true" aria-expanded="false" aria-controls="lang-menu" aria-label="${AA.t("lang.menu")}">
        ${AA.icon("globe")}<span class="lang-selector__code">${current.short}</span>${AA.icon("chevron", "icon--sm")}
      </button>
      <div class="lang-selector__menu" id="lang-menu" role="menu" aria-label="${AA.t("lang.menu")}">${options}</div>
    </div>`;
};

/* Logo + fixed tagline: one builder for header and footer. Never translated (translate="no", lang="fr"). */
AA.logoHtml = () => `
        <a class="logo" href="index.html" aria-label="${AA.t("header.home")}">
          ${AA.logoMark()}
          <span class="logo__text" translate="no"><span class="logo__word" lang="fr" dir="ltr">${AA.BRAND.name}</span><span class="logo__tag" lang="fr" dir="ltr">${AA.BRAND.taglineLines.map((l) => `<span class="logo__tag-line">${l}</span>`).join(" ")}</span></span>
        </a>`;

AA.renderHeader = () => {
  const host = document.getElementById("site-header");
  if (!host) return;
  const page = document.body.dataset.page || "";

  const navHtml = NAV_LINKS.map((link) => {
    const active = link.pages.includes(page) ? "is-active" : "";
    const label = AA.t(link.key);
    if (!link.menu) return `<a class="${active}" href="${link.href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
    const items = link.menu().map((m) => `<a href="${m.href}">${m.label}</a>`).join("");
    return `<div class="nav-dropdown"><button type="button" class="${active}" aria-haspopup="true">${label}${AA.icon("chevron", "icon--sm")}</button><div class="nav-dropdown__menu">${items}</div></div>`;
  }).join("");

  host.innerHTML = `
    <a class="sr-only sr-only--focusable" href="#main">${AA.t("skip")}</a>
    <header class="site-header">
      <div class="container site-header__inner">
${AA.logoHtml()}
        <nav class="main-nav" id="main-nav" aria-label="${AA.t("nav.aria")}">${navHtml}</nav>
        <div class="header-actions">
          <button class="icon-btn" type="button" id="search-toggle" aria-label="${AA.t("search.open")}" aria-expanded="false" aria-controls="search-bar">${AA.icon("search")}</button>
          <a class="icon-btn" href="favoris.html" aria-label="${AA.t("fav.link")}">${AA.icon("heart")}<span class="badge-count" id="fav-count"></span></a>
          <a class="icon-btn" href="panier.html" aria-label="${AA.t("cart.link")}">${AA.icon("cart")}<span class="badge-count" id="cart-count"></span></a>
          ${AA.account.menuHtml()}
          ${AA.account.role() === "visitor" ? `<a class="icon-btn" href="inscription.html" aria-label="${AA.t("ins.link")}" title="${AA.t("ins.link")}">${AA.icon("userPlus")}</a>` : ""}
          <span class="header-actions__sep" aria-hidden="true"></span>
          ${AA.languageSelectorHtml()}
          <button class="icon-btn menu-toggle" type="button" id="menu-toggle" aria-label="${AA.t("menu.open")}" aria-expanded="false" aria-controls="main-nav">${AA.icon("menu")}</button>
        </div>
      </div>
    </header>
    <div class="search-bar" id="search-bar">
      <div class="container">
        <form id="search-form" role="search">
          <label class="sr-only" for="search-input">${AA.t("search.label")}</label>
          <div class="search-field">
            ${AA.icon("search")}
            <input id="search-input" type="search" placeholder="${AA.t("search.placeholder")}">
          </div>
          <button class="btn btn--primary" type="submit">${AA.t("search.submit")}</button>
          <button class="icon-btn" type="button" id="search-close" aria-label="${AA.t("search.close")}">${AA.icon("close")}</button>
        </form>
      </div>
    </div>`;

  // Mobile menu
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", AA.t(open ? "menu.close" : "menu.open"));
    toggle.innerHTML = AA.icon(open ? "close" : "menu");
  });

  // Search bar: send the query to the shop page
  const bar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-toggle");
  const setSearch = (open) => {
    bar.classList.toggle("is-open", open);
    searchBtn.setAttribute("aria-expanded", open);
    if (open) document.getElementById("search-input").focus();
  };
  searchBtn.addEventListener("click", () => setSearch(!bar.classList.contains("is-open")));
  document.getElementById("search-close").addEventListener("click", () => { setSearch(false); searchBtn.focus(); });
  document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    window.location.href = query ? `boutique.html?q=${encodeURIComponent(query)}` : "boutique.html";
  });

  AA.account.bindMenu();  // profile menu (account.js)

  // Language selector
  const langBtn = document.getElementById("lang-btn");
  const langMenu = document.getElementById("lang-menu");
  const setLangMenu = (open) => {
    langMenu.classList.toggle("is-open", open);
    langBtn.setAttribute("aria-expanded", open);
  };
  langBtn.addEventListener("click", (event) => { event.stopPropagation(); setLangMenu(!langMenu.classList.contains("is-open")); });
  langMenu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-lang]");
    if (option) AA.setLang(option.dataset.lang);
    setLangMenu(false);
  });
};

/* Close menus with a click outside or the Escape key (registered once) */
document.addEventListener("click", (event) => {
  const menu = document.getElementById("lang-menu");
  if (menu && !event.target.closest("#lang-selector")) {
    menu.classList.remove("is-open");
    const btn = document.getElementById("lang-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const menu = document.getElementById("lang-menu");
  if (menu && menu.classList.contains("is-open")) {
    menu.classList.remove("is-open");
    const btn = document.getElementById("lang-btn");
    if (btn) { btn.setAttribute("aria-expanded", "false"); btn.focus(); }
  }
  const bar = document.getElementById("search-bar");
  if (bar && bar.classList.contains("is-open")) {
    bar.classList.remove("is-open");
    const toggle = document.getElementById("search-toggle");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
  }
});

AA.renderFooter = () => {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
${AA.logoHtml()}
            <p class="mt-1">${AA.t("footer.about")}</p>
          </div>
          <div>
            <h4>${AA.t("footer.discover")}</h4>
            <ul>
              <li><a href="explorer.html">${AA.t("footer.explore")}</a></li>
              <li><a href="patrimoine.html">${AA.t("nav.heritage")}</a></li>
              <li><a href="artisans.html">${AA.t("nav.artisans")}</a></li>
              <li><a href="experiences.html">${AA.t("nav.experiences")}</a></li>
              <li><a href="emploi.html">${AA.t("footer.jobs")}</a></li>
              <li><a href="avis.html">${AA.t("footer.reviews")}</a></li>
            </ul>
          </div>
          <div>
            <h4>${AA.t("footer.shop")}</h4>
            <ul>
              <li><a href="boutique.html">${AA.t("menu.shop.all")}</a></li>
              <li><a href="coffret.html">${AA.t("menu.shop.coffret")}</a></li>
              <li><a href="expeditions.html">${AA.t("menu.exp.shipping")}</a></li>
              <li><a href="impact.html">${AA.t("menu.exp.impact")}</a></li>
            </ul>
          </div>
          <div>
            <h4>${AA.t("footer.myspace")}</h4>
            <ul>
              ${AA.account.footerLinks()}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>${AA.t("footer.copy")}</span>
          <span>${AA.t("footer.disclaimer")}</span>
        </div>
      </div>
    </footer>`;
};

AA.updateBadges = () => {
  const cart = document.getElementById("cart-count");
  const favs = document.getElementById("fav-count");
  if (cart) { cart.textContent = AA.cart.count() || ""; }
  if (favs) { favs.textContent = AA.favs.count() || ""; }
};

/* Scroll reveal for elements with the class .reveal */
AA.initReveal = () => {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
};

/* ---------- Global click handling (favorites + add to cart) ---------- */
document.addEventListener("click", (event) => {
  const favBtn = event.target.closest("[data-fav]");
  if (favBtn) {
    const type = favBtn.dataset.fav;
    const id = favBtn.dataset.id;
    const added = AA.favs.toggle(type, id);
    document.querySelectorAll(`[data-fav="${type}"][data-id="${id}"]`).forEach((btn) => {
      btn.classList.toggle("is-fav", added);
      btn.setAttribute("aria-pressed", added);
      if (btn.classList.contains("fav-btn")) btn.setAttribute("aria-label", AA.t(added ? "fav.remove" : "fav.add"));
    });
    AA.toast(AA.t(added ? "toast.fav.add" : "toast.fav.remove"));
    return;
  }

  const addBtn = event.target.closest("[data-add-cart]");
  if (addBtn) {
    const qty = Number(addBtn.dataset.qty) || 1;
    AA.cart.add(addBtn.dataset.id, qty);
    AA.toast(AA.t("toast.cart.add"));
  }
});

/* ---------- Form validation helpers (used by experiences + checkout) ---------- */
AA.isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
AA.isPhone = (value) => /^(\+212|0)[5-7]\d{8}$/.test(value.replace(/[\s.-]/g, ""));

/* Shows (or clears) an error under a field. Returns true when the field is valid. */
AA.fieldError = (input, message) => {
  input.classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  const holder = input.closest(".form-row");
  const slot = holder && holder.querySelector(".field-error");
  if (slot) slot.textContent = message || "";
  return !message;
};

/* Elements with data-bg="dunes" get their background photo from AA.photos
   (the CSS shows a gradient underneath if the photo cannot load). */
AA.applyBackgrounds = (root = document) => {
  root.querySelectorAll("[data-bg]").forEach((el) => {
    const url = AA.photos[el.dataset.bg] || el.dataset.bg;
    el.style.setProperty("--bg", `url("${url}")`);
  });
};

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  AA.applyBackgrounds();
  AA.renderHeader();
  AA.renderFooter();
  AA.updateBadges();
  AA.hydrateIcons();   // <span data-icon="..."> placeholders in the page HTML
  AA.applyStatic();    // data-i18n texts
  AA.applyTitle();     // <title> in the current language
  AA.initReveal();
});
