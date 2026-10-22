/* patrimoine.js — cooperative directory, cooperative profiles, crafts → products, "Saviez-vous ?"
   Data: js/directory.js (AA.dir: one shared source with the Explorer and the cooperative dashboard)
   URLs: patrimoine.html                      → directory
         patrimoine.html?coop=<id>#cooperative → profile of that cooperative
         patrimoine.html?region=<id>&craft=<Category>&q=<text> → pre-filtered directory */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const esc = AA.esc;

  /* ---------- "Saviez-vous ?" ---------- */
  $("dyk-grid").innerHTML = AA.dir.facts.map((f) => `
    <article class="dyk-card reveal">
      <span class="icon-lg">${AA.icon(f.icon)}</span>
      <span class="tag">${esc(AA.t("dyk.tag." + f.tag))}</span>
      <p>${esc(AA.t("dyk." + f.n))}</p>
    </article>`).join("");

  /* ---------- Cooperative profile ---------- */
  const coopId = AA.getParam("coop");
  if (coopId) {
    $("view-directory").hidden = true;
    $("cooperative").hidden = false;
    renderProfile(coopId);
    AA.applyBackgrounds();
    AA.initReveal();
    return;
  }

  function renderProfile(id) {
    const root = $("coop-profile");
    const back = `<a class="text-link" href="patrimoine.html#annuaire">${AA.icon("arrowLeft")}${esc(AA.t("dir.p.back"))}</a>`;
    const c = AA.dir.get(id);
    if (!c) {
      document.title = AA.pageTitle(AA.t("dir.p.notfound.t"));
      root.innerHTML = `${back}${AA.emptyState({ icon: "search_empty", title: esc(AA.t("dir.p.notfound.t")), text: esc(AA.t("dir.p.notfound.x")), href: "patrimoine.html#annuaire", label: esc(AA.t("dir.p.back")) })}`;
      return;
    }
    document.title = AA.pageTitle(c.name);

    const city = AA.dir.regionLabel(c.region);
    const craft = AA.dir.catLabel(c.category);
    const crafts = c.categories.map((k) => AA.dir.catLabel(k)).join(", ");

    const team = c.artisans.length
      ? `<div class="grid grid--3">${c.artisans.map(AA.artisanCard).join("")}</div><p class="muted mt-1">${esc(AA.t("dir.p.team.demo"))}</p>`
      : `<p class="muted explorer-empty">${AA.icon("users")}<span>${esc(AA.t("dir.p.team.empty"))}</span></p>`;

    const products = c.products.length
      ? `<div class="grid grid--4" id="coop-products">${c.products.map(AA.productCard).join("")}</div>`
      : `<p class="muted explorer-empty">${AA.icon("vase")}<span>${esc(AA.t("dir.p.products.empty"))}</span></p>`;

    let contact = "";
    if (c.contact) {
      const rows = [];
      if (c.contact.email) rows.push(`<li><a href="mailto:${esc(c.contact.email)}">${AA.icon("mail")}<span class="sr-only">${esc(AA.t("dir.p.email"))}: </span>${esc(c.contact.email)}</a></li>`);
      if (c.contact.whatsapp) rows.push(`<li><a href="${esc(AA.dir.waLink(c.contact.whatsapp))}" target="_blank" rel="noopener">${AA.icon("whatsapp")}<span class="sr-only">${esc(AA.t("dir.p.whatsapp"))}: </span>${esc(c.contact.whatsapp)}</a></li>`);
      contact = `<div class="coop-profile__box"><h2>${esc(AA.t("dir.p.contact"))}</h2><ul class="coop-contact">${rows.join("")}</ul><p class="muted form-hint">${esc(AA.t("dir.p.contact.note"))}</p></div>`;
    }

    root.innerHTML = `
      ${back}
      <div class="coop-profile__head">
        <div class="coop-profile__logo">${AA.dir.image(c)}</div>
        <div class="coop-profile__title">
          <span class="tag tag--terra">${esc(AA.dir.badge(c))}</span> <span class="tag">${esc(AA.t("dir.notverified"))}</span>
          <h1>${esc(c.name)}</h1>
          <p class="coop-meta">${AA.icon("pin")}<span>${esc(city)}</span><span aria-hidden="true">·</span><span>${esc(craft)}</span></p>
        </div>
      </div>
      <div class="coop-profile__grid">
        <div>
          <div class="coop-profile__box">
            <h2>${esc(AA.t("dir.p.about"))}</h2>
            <p>${esc(AA.dir.description(c))}</p>
            <p class="notice">${esc(AA.t(c.source === "registered" ? "dir.p.reg.note" : "dir.p.demo.note"))}</p>
          </div>
        </div>
        <aside>
          <div class="coop-profile__box">
            <dl class="coop-profile__facts">
              <div><dt>${esc(AA.t("dir.p.location"))}</dt><dd>${esc(city)}</dd></div>
              <div><dt>${esc(AA.t("dir.p.craft"))}</dt><dd>${esc(crafts)}</dd></div>
            </dl>
            <p class="mt-1"><a class="text-link" href="${AA.regionMapUrl(c.region)}">${AA.icon("pin")}${esc(AA.t("dir.p.onmap"))}</a></p>
          </div>
          ${contact}
        </aside>
      </div>
      <div class="coop-profile__section"><h2>${esc(AA.t("dir.p.team"))}</h2>${team}</div>
      <div class="coop-profile__section">
        <div class="section-head section-head--row">
          <h2>${esc(AA.t("dir.p.products"))}</h2>
          <a class="btn btn--outline btn--sm" href="boutique.html?q=${encodeURIComponent(c.name)}">${AA.icon("store")}${esc(AA.t("dir.p.shop"))}</a>
        </div>
        ${products}
      </div>`;
  }

  /* ---------- Directory with filters ---------- */
  const q = $("dir-q"), selRegion = $("dir-region"), selCraft = $("dir-craft"), grid = $("coop-grid"), status = $("dir-status");
  const all = AA.dir.all();

  selRegion.innerHTML = `<option value="">${esc(AA.t("dir.f.all"))}</option>` + AA.regions.map((r) => `<option value="${r.id}">${esc(AA.rt(r.name))}</option>`).join("");
  selCraft.innerHTML = `<option value="">${esc(AA.t("dir.f.all"))}</option>` + AA.categories.map((k) => `<option value="${k}">${esc(AA.catLabel(k))}</option>`).join("") + `<option value="other">${esc(AA.t("dir.other"))}</option>`;

  const fromRegion = AA.findRegion(AA.getParam("region"));
  if (fromRegion) selRegion.value = fromRegion.id;
  const fromCraft = AA.getParam("craft");
  if (AA.categories.includes(fromCraft) || fromCraft === "other") selCraft.value = fromCraft;
  q.value = (AA.getParam("q") || "").slice(0, 60);

  function renderDirectory() {
    const text = q.value.trim().toLowerCase();
    const list = all.filter((c) =>
      (!selRegion.value || c.region === selRegion.value) &&
      (!selCraft.value || c.categories.includes(selCraft.value)) &&
      (!text || [c.name, AA.dir.description(c), AA.dir.regionLabel(c.region), c.categories.map(AA.dir.catLabel).join(" ")].join(" ").toLowerCase().includes(text)));
    status.textContent = list.length ? AA.plural("dir.results", list.length) : AA.t("dir.results.none");
    grid.innerHTML = list.length
      ? list.map((c) => AA.dir.card(c)).join("")
      : `<div style="grid-column:1/-1">${AA.emptyState({ icon: "search_empty", title: esc(AA.t("dir.empty.t")), text: esc(AA.t("dir.empty.x")) })}</div>`;
    AA.initReveal();
  }
  [q, selRegion, selCraft].forEach((el) => el.addEventListener("input", renderDirectory));
  $("dir-reset").addEventListener("click", () => { q.value = ""; selRegion.value = ""; selCraft.value = ""; renderDirectory(); q.focus(); });
  renderDirectory();

  AA.applyBackgrounds();
  AA.initReveal();
});
