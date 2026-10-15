/* explorer.js — illustrated map of the Moroccan Sahara, destination panel and the 7 destination cards
   Data: js/regions.js   Helpers: js/regions-ui.js   Texts: js/regions-i18n.js (FR / EN / AR)
   URL: explorer.html?city=<id>  → that city is highlighted on the map (kept when coming back
   from a region page, and updated when another city is chosen). */
document.addEventListener("DOMContentLoaded", () => {
  const regions = AA.regions;

  const mapBox = document.getElementById("map-box");
  const panel = document.getElementById("destination-panel");
  const cardsEl = document.getElementById("city-cards");
  const state = { city: null };

  /* ---------- Map: SVG + one pin per city, placed from real coordinates ---------- */
  function renderMap() {
    const m = AA.MAP;
    mapBox.style.aspectRatio = `${m.w.toFixed(0)} / ${m.h.toFixed(0)}`;

    const seaLabels = [
      ["map.atlantic", -16.7, 26.4, "region-map__sea region-map__sea--v"],
      ["map.sahara", -9.9, 25.2, "region-map__land"],
    ]
      .map(([key, lon, lat, cls]) => {
        const p = AA.mapProject(lon, lat);
        return `<span class="${cls}" style="left:${p.px.toFixed(2)}%;top:${p.py.toFixed(2)}%">${AA.t(key)}</span>`;
      })
      .join("");

    const pins = regions
      .map((r) => {
        const p = AA.mapProject(r.lon, r.lat);
        const name = AA.rt(r.name);
        return `<button type="button" class="region-pin region-pin--${r.label}" data-city="${r.id}" style="left:${p.px.toFixed(2)}%;top:${p.py.toFixed(2)}%"
          aria-label="${AA.esc(AA.t("exp.pin.aria", { name }))}" aria-pressed="false">
          <span class="region-pin__dot"></span><span class="region-pin__label">${AA.esc(name)}</span></button>`;
      })
      .join("");

    mapBox.innerHTML = AA.regionMapSvg() + seaLabels + pins;
  }

  /* ---------- Panel: overview of the selected city ---------- */
  function renderPanel() {
    const region = AA.regionById(state.city);
    if (!region) {
      panel.innerHTML = `
        <div class="destination-panel__body region-panel-empty">
          <span class="icon-lg icon-lg--accent">${AA.icon("pin")}</span>
          <h2>${AA.t("exp.panel.emptyTitle")}</h2>
          <p class="muted">${AA.t("exp.panel.emptyText")}</p>
        </div>`;
      return;
    }
    const name = AA.rt(region.name);
    const crafts = region.crafts.length
      ? region.crafts.map((c) => `<span class="tag">${AA.rt(AA.getArticle(c).name)}</span>`).join("")
      : `<span class="tag">${AA.t("exp.crafts.none")}</span>`;
    panel.innerHTML = `
      <div class="destination-panel__img craft-art">${AA.regionArt(region, "panel")}</div>
      <div class="destination-panel__body">
        <span class="eyebrow">${AA.t("exp.panel.eyebrow")}</span>
        <h2>${AA.esc(name)}</h2>
        <p class="region-tagline">${AA.esc(AA.rt(region.tagline))}</p>
        <p>${AA.esc(AA.rt(region.intro))}</p>
        <h3>${AA.t("exp.crafts")}</h3>
        <div class="tags mb-1">${crafts}</div>
        <a class="btn btn--primary" href="${AA.regionUrl(region.id)}" aria-label="${AA.esc(AA.t("exp.discover.aria", { name }))}">${AA.t("exp.discover")} ${AA.icon("arrowRight")}</a>
      </div>`;
  }

  /* ---------- Cards: one per destination ---------- */
  function renderCards() {
    cardsEl.innerHTML = regions
      .map((r, i) => {
        const name = AA.rt(r.name);
        return `
        <article class="card region-card" data-card="${r.id}">
          <div class="card__img craft-art">${AA.regionArt(r, "card")}<span class="region-card__num">${String(i + 1).padStart(2, "0")}</span></div>
          <div class="card__body">
            <h3>${AA.esc(name)}</h3>
            <p class="card__meta">${AA.esc(AA.rt(r.tagline))}</p>
            <div class="card__actions">
              <a class="btn btn--primary btn--sm" href="${AA.regionUrl(r.id)}" data-action="discover" aria-label="${AA.esc(AA.t("exp.discover.aria", { name }))}">${AA.t("exp.discover")}</a>
              <a class="btn btn--outline btn--sm" href="${AA.regionMapUrl(r.id)}" data-action="onmap" data-city="${r.id}" aria-label="${AA.esc(AA.t("exp.onmap.aria", { name }))}">${AA.icon("pin")} ${AA.t("exp.onmap")}</a>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  /* ---------- Selection (map pin, panel, card, URL) ---------- */
  function selectCity(id, { scroll = false, focus = false } = {}) {
    const region = AA.regionById(id);
    if (!region) return;
    state.city = id;

    mapBox.querySelectorAll(".region-pin").forEach((pin) => {
      const active = pin.dataset.city === id;
      pin.classList.toggle("is-active", active);
      pin.setAttribute("aria-pressed", String(active));
    });
    cardsEl.querySelectorAll(".region-card").forEach((card) => {
      const active = card.dataset.card === id;
      card.classList.toggle("is-selected", active);
      if (active) card.setAttribute("aria-current", "true"); else card.removeAttribute("aria-current");
    });
    renderPanel();

    // Keep the selection in the address bar (no page reload) so it survives a refresh or a shared link
    try { history.replaceState(null, "", `${location.pathname}?city=${encodeURIComponent(id)}${location.hash}`); } catch (error) { /* file:// or blocked: ignore */ }

    const pin = mapBox.querySelector(`.region-pin[data-city="${id}"]`);
    if (scroll) document.getElementById("carte").scrollIntoView({ behavior: "smooth", block: "start" });
    else if (window.matchMedia("(max-width: 1024px)").matches) panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); // stacked layout: show the panel under the map
    if (focus && pin) pin.focus({ preventScroll: true });
  }

  /* ---------- Events ---------- */
  mapBox.addEventListener("click", (event) => {
    const pin = event.target.closest(".region-pin");
    if (pin) selectCity(pin.dataset.city);
  });

  // "Voir sur la carte": a real link (works without JS) that is handled in place here
  cardsEl.addEventListener("click", (event) => {
    const link = event.target.closest('[data-action="onmap"]');
    if (!link) return;
    event.preventDefault();
    selectCity(link.dataset.city, { scroll: true, focus: true });
  });

  /* ---------- Start ---------- */
  renderMap();
  renderCards();

  const fromUrl = AA.findRegion(AA.getParam("city"));
  if (fromUrl) {
    selectCity(fromUrl.id, { focus: false });
  } else {
    renderPanel(); // nothing selected yet: invitation to choose
  }
});
