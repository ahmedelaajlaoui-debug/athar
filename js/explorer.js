/* explorer.js — illustrated map of the Moroccan Sahara, city details panel and the 7 clickable city cards
   Data: js/regions.js (cities)  ·  js/directory.js (cooperatives, shared with Patrimoine)  ·  js/data.js (artisans)
   Texts: js/regions-i18n.js and js/directory-i18n.js (FR / EN / AR)
   URL: explorer.html?city=<id> → that city is selected (kept when coming back from another page).

   The map is a drawing (SVG + HTML pins). "Zoom" simply scales that drawing and "drag" moves it: there is no
   real map service, tile or geographic database behind it. */
document.addEventListener("DOMContentLoaded", () => {
  const regions = AA.regions;
  const mapBox = document.getElementById("map-box");
  const panel = document.getElementById("destination-panel");
  const cardsEl = document.getElementById("city-cards");
  const ZOOMS = [1, 2.2, 3.2];
  const state = { city: null, zoom: 0, cx: 50, cy: 50 };
  let stage = null;

  /* ---------- Map: SVG + one pin per city, inside a stage that can be zoomed and moved ---------- */
  function renderMap() {
    const m = AA.MAP;
    mapBox.style.aspectRatio = `${m.w.toFixed(0)} / ${m.h.toFixed(0)}`;
    const seaLabels = [["map.atlantic", -16.7, 26.4, "region-map__sea region-map__sea--v"], ["map.sahara", -9.9, 25.2, "region-map__land"]]
      .map(([key, lon, lat, cls]) => {
        const p = AA.mapProject(lon, lat);
        return `<span class="${cls}" style="left:${p.px.toFixed(2)}%;top:${p.py.toFixed(2)}%">${AA.t(key)}</span>`;
      }).join("");
    const pins = regions.map((r) => {
      const p = AA.mapProject(r.lon, r.lat);
      const name = AA.rt(r.name);
      return `<button type="button" class="region-pin region-pin--${r.label}" data-city="${r.id}" style="left:${p.px.toFixed(2)}%;top:${p.py.toFixed(2)}%"
        aria-label="${AA.esc(AA.t("exp.pin.aria", { name }))}" aria-pressed="false">
        <span class="region-pin__dot"></span><span class="region-pin__label">${AA.esc(name)}</span></button>`;
    }).join("");
    const btn = (action, icon, key) => `<button type="button" class="map-ctrl" data-zoom="${action}" aria-label="${AA.esc(AA.t(key))}" title="${AA.esc(AA.t(key))}">${AA.icon(icon)}</button>`;
    mapBox.innerHTML = `<div class="region-map__stage" id="map-stage">${AA.regionMapSvg()}${seaLabels}${pins}</div>
      <div class="map-controls">${btn("in", "plus", "dir.map.zoomIn")}${btn("out", "minus", "dir.map.zoomOut")}${btn("reset", "map", "dir.map.reset")}</div>`;
    stage = document.getElementById("map-stage");
  }

  /* ---------- Zoom / pan (visual only) ---------- */
  function applyView(animate = true) {
    const z = ZOOMS[state.zoom];
    const minC = 50 / z, maxC = 100 - 50 / z;
    state.cx = z === 1 ? 50 : Math.min(maxC, Math.max(minC, state.cx));
    state.cy = z === 1 ? 50 : Math.min(maxC, Math.max(minC, state.cy));
    const tx = z === 1 ? 0 : 50 - z * state.cx;
    const ty = z === 1 ? 0 : 50 - z * state.cy;
    stage.style.transition = animate ? "transform .35s ease" : "none";
    stage.style.setProperty("--z", z);
    stage.style.transform = z === 1 ? "none" : `translate(${tx}%, ${ty}%) scale(${z})`;
    mapBox.classList.toggle("is-zoomed", z > 1);
    mapBox.querySelector('[data-zoom="in"]').disabled = state.zoom === ZOOMS.length - 1;
    mapBox.querySelector('[data-zoom="out"]').disabled = state.zoom === 0;
    mapBox.querySelector('[data-zoom="reset"]').disabled = z === 1 && !state.city;
  }
  function focusOn(region) {
    const p = AA.mapProject(region.lon, region.lat);
    state.cx = p.px; state.cy = p.py;
  }
  function zoomBy(step) {
    state.zoom = Math.min(ZOOMS.length - 1, Math.max(0, state.zoom + step));
    const region = AA.regionById(state.city);
    if (region && state.zoom > 0) focusOn(region);
    applyView();
  }

  // Drag to move the zoomed drawing (pins stay clickable: a drag that starts on a pin is a click)
  let drag = null;
  mapBox.addEventListener("pointerdown", (e) => {
    if (ZOOMS[state.zoom] === 1 || e.target.closest(".map-controls") || e.target.closest(".region-pin")) return;
    drag = { x: e.clientX, y: e.clientY, cx: state.cx, cy: state.cy };
    mapBox.setPointerCapture(e.pointerId);
    mapBox.classList.add("is-dragging");
  });
  mapBox.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const r = mapBox.getBoundingClientRect(), z = ZOOMS[state.zoom];
    state.cx = drag.cx - ((e.clientX - drag.x) / r.width) * 100 / z;
    state.cy = drag.cy - ((e.clientY - drag.y) / r.height) * 100 / z;
    applyView(false);
  });
  const endDrag = () => { drag = null; mapBox.classList.remove("is-dragging"); };
  mapBox.addEventListener("pointerup", endDrag);
  mapBox.addEventListener("pointercancel", endDrag);

  /* ---------- Panel: details of the selected city ---------- */
  function artisanRows(region) {
    const frName = AA.coop.REGION_FR[region.id];
    const list = AA.artisans.filter((a) => a.city === frName);
    if (!list.length) return `<p class="muted explorer-empty">${AA.icon("users")}<span>${AA.esc(AA.t("dir.exp.artisans.empty"))}</span></p>`;
    return `<ul class="artisan-mini-list">${list.map((a) => `
      <li><a class="artisan-mini" href="artisans.html?id=${encodeURIComponent(a.id)}">
        <span class="artisan-mini__img">${AA.img(a.photo, a.name, a.craft)}</span>
        <span><strong>${AA.esc(a.name)}</strong><small>${AA.esc(a.specialty)} · ${AA.esc(a.coop)}</small>
        <small class="muted">${AA.esc(AA.t("dir.p.team.demo"))}</small></span></a></li>`).join("")}</ul>`;
  }

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
    const coops = AA.dir.inRegion(region.id);
    const coopBlock = coops.length
      ? `<div class="coop-mini-list">${coops.map((c) => AA.dir.card(c, { compact: true })).join("")}</div>`
      : `<div class="explorer-empty explorer-empty--box" role="status">${AA.icon("store")}<div><strong>${AA.esc(AA.t("dir.exp.coops.empty.t"))}</strong><p class="muted">${AA.esc(AA.t("dir.exp.coops.empty.x", { name }))}</p></div></div>`;
    panel.innerHTML = `
      <div class="destination-panel__img craft-art">${AA.regionArt(region, "panel")}</div>
      <div class="destination-panel__body">
        <span class="eyebrow">${AA.t("exp.panel.eyebrow")}</span>
        <h2>${AA.esc(name)}</h2>
        <p class="region-tagline">${AA.esc(AA.rt(region.tagline))}</p>
        <h3 class="panel-h">${AA.t("dir.exp.about")}</h3>
        <p>${AA.esc(AA.rt(region.intro))}</p>
        <p>${AA.esc(AA.rt(region.identity))}</p>
        <h3 class="panel-h">${AA.esc(AA.t("dir.exp.coops", { name }))} <span class="tag tag--green">${AA.esc(AA.dir.plural("dir.count", coops.length))}</span></h3>
        ${coopBlock}
        <h3 class="panel-h">${AA.t("dir.exp.artisans")}</h3>
        ${artisanRows(region)}
        <p class="notice panel-notice">${AA.esc(AA.t("dir.exp.demo"))}</p>
        <a class="text-link" href="${AA.regionUrl(region.id)}">${AA.esc(AA.t("dir.exp.more"))}${AA.icon("arrowRight")}</a>
      </div>`;
  }

  /* ---------- Cards: one clickable card per destination ---------- */
  function renderCards() {
    cardsEl.innerHTML = regions.map((r, i) => {
      const name = AA.rt(r.name);
      const n = AA.dir.inRegion(r.id).length;
      return `
        <article class="card region-card region-card--click" data-card="${r.id}" role="button" tabindex="0" aria-pressed="false" aria-label="${AA.esc(AA.t("dir.exp.card.aria", { name }))}">
          <div class="card__img craft-art">${AA.regionArt(r, "card")}<span class="region-card__num">${String(i + 1).padStart(2, "0")}</span></div>
          <div class="card__body">
            <h3>${AA.esc(name)}</h3>
            <p class="card__meta">${AA.esc(AA.rt(r.tagline))}</p>
            <p class="region-card__coops"><span class="tag ${n ? "tag--green" : ""}">${AA.icon("store")} ${AA.esc(AA.dir.plural("dir.count", n))}</span></p>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- Selection (map pin, card, panel, URL) ---------- */
  function selectCity(id, { scroll = false, zoom = true } = {}) {
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
      card.setAttribute("aria-pressed", String(active));
    });
    if (zoom) { state.zoom = Math.max(state.zoom, 1); focusOn(region); }
    applyView();
    renderPanel();
    try { history.replaceState(null, "", `${location.pathname}?city=${encodeURIComponent(id)}${location.hash}`); } catch (error) { /* file:// or blocked: ignore */ }
    if (scroll) document.getElementById("carte").scrollIntoView({ behavior: "smooth", block: "start" });
    else if (window.matchMedia("(max-width: 1024px)").matches) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- Events ---------- */
  mapBox.addEventListener("click", (event) => {
    const ctrl = event.target.closest("[data-zoom]");
    if (ctrl) {
      const a = ctrl.dataset.zoom;
      if (a === "in") zoomBy(1);
      else if (a === "out") zoomBy(-1);
      else { state.zoom = 0; applyView(); }
      return;
    }
    const pin = event.target.closest(".region-pin");
    if (pin) selectCity(pin.dataset.city);
  });
  cardsEl.addEventListener("click", (event) => {
    const card = event.target.closest(".region-card");
    if (card) selectCity(card.dataset.card, { scroll: true });
  });
  cardsEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".region-card");
    if (!card) return;
    event.preventDefault();
    selectCity(card.dataset.card, { scroll: true });
  });

  /* ---------- Start ---------- */
  renderMap();
  renderCards();
  applyView(false);
  const fromUrl = AA.findRegion(AA.getParam("city"));
  if (fromUrl) selectCity(fromUrl.id); else renderPanel();
});
