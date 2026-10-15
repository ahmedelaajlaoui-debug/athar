/* region.js — one template for all Saharan destination pages
   URL: region.html?city=<id>   (ids are listed in js/regions.js → AA.regions)
   Every text comes from regions.js ({fr,en,ar}) or regions-i18n.js (interface), so the page
   follows the language chosen in the header and uses right-to-left layout for Arabic. */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("region-root");
  const region = AA.findRegion(AA.getParam("city"));

  // Unknown or missing city: friendly message and a way back to the map
  if (!region) {
    document.title = AA.pageTitle(AA.t("title.region"));
    root.innerHTML = `<section class="section"><div class="container">${AA.emptyState({
      icon: "search_empty",
      title: AA.t("reg.notfound.title"),
      text: AA.t("reg.notfound.text"),
      href: "explorer.html#carte",
      label: AA.t("reg.notfound.cta"),
    })}</div></section>`;
    return;
  }

  const name = AA.rt(region.name);
  const index = AA.regionIndex(region.id);
  const total = AA.regions.length;
  const prev = AA.regions[(index - 1 + total) % total];
  const next = AA.regions[(index + 1) % total];
  const mapUrl = AA.regionMapUrl(region.id);
  const pos = AA.mapProject(region.lon, region.lat);

  document.title = AA.pageTitle(name);

  // "À découvrir": 3 cards
  const discoverCards = region.discover
    .map((item) => `
      <article class="card reveal">
        <div class="card__body">
          <span class="icon-lg icon-lg--accent">${AA.icon(item.icon)}</span>
          <h3>${AA.esc(AA.rt(item.title))}</h3>
          <p class="card__meta">${AA.esc(AA.rt(item.text))}</p>
        </div>
      </article>`)
    .join("");

  // Crafts: cards with the existing craft illustrations, or an honest "to be completed" message
  const craftCards = region.crafts
    .map((id) => `
      <a class="card reveal" href="savoir-faire.html?id=${id}">
        <div class="card__img craft-art">${AA.craftArt(id)}</div>
        <div class="card__body">
          <h3>${AA.rt(AA.getArticle(id).name)}</h3>
          <p class="card__meta">${AA.t("reg.crafts.read")} ${AA.icon("arrowRight")}</p>
        </div>
      </a>`)
    .join("");
  const craftNote = AA.rt(region.craftNote);
  const craftsBlock = region.crafts.length
    ? `<div class="grid grid--4">${craftCards}</div>`
    : `<p class="notice">${AA.t("reg.crafts.none")}</p>`;

  // Other regions: previous / next + every city as a chip
  const chips = AA.regions
    .filter((r) => r.id !== region.id)
    .map((r) => `<a class="chip" href="${AA.regionUrl(r.id)}">${AA.icon(r.icon)} ${AA.esc(AA.rt(r.name))}</a>`)
    .join("");

  root.innerHTML = `
    <section class="section section--sand article-head">
      <div class="container">
        <a class="btn btn--outline btn--sm mb-2" href="${mapUrl}" data-role="back">${AA.icon("arrowLeft")} ${AA.t("reg.back")}</a>
        <div class="split">
          <div>
            <span class="eyebrow">${AA.t("reg.eyebrow", { n: index + 1, total })}</span>
            <h1>${AA.esc(name)}</h1>
            <p class="region-tagline">${AA.esc(AA.rt(region.tagline))}</p>
            <p class="lead">${AA.esc(AA.rt(region.intro))}</p>
            <div class="hero__actions" style="margin-top:1.4rem">
              <a class="btn btn--primary" href="${mapUrl}" data-role="onmap">${AA.icon("pin")} ${AA.t("reg.onmap")}</a>
            </div>
          </div>
          <div class="region-visual">
            <div class="craft-art craft-art--lg">${AA.regionArt(region, "head")}</div>
            <figure class="region-locator" role="img" aria-label="${AA.esc(AA.t("reg.locator.aria", { name }))}">
              <div class="region-locator__map" style="aspect-ratio:${AA.MAP.w.toFixed(0)} / ${AA.MAP.h.toFixed(0)}">
                ${AA.regionMapSvg({ mini: true })}
                <span class="region-locator__pin" style="left:${pos.px.toFixed(2)}%;top:${pos.py.toFixed(2)}%"></span>
              </div>
              <figcaption>${AA.t("reg.locator.note")}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${AA.t("reg.identity.eyebrow")}</span>
          <h2>${AA.t("reg.identity.title")}</h2>
        </div>
        <div class="info-box reveal region-identity"><p>${AA.esc(AA.rt(region.identity))}</p></div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${AA.t("reg.discover.eyebrow")}</span>
          <h2>${AA.t("reg.discover.title")}</h2>
        </div>
        <div class="grid grid--3">${discoverCards}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${AA.t("reg.crafts.eyebrow")}</span>
          <h2>${AA.t("reg.crafts.title")}</h2>
        </div>
        ${craftsBlock}
        ${craftNote ? `<div class="info-box mt-2 reveal"><p>${AA.esc(craftNote)}</p></div>` : ""}
      </div>
    </section>

    <section class="section section--green">
      <div class="container">
        <div class="section-head"><span class="eyebrow" style="color:#f0c9a0">${AA.t("reg.more.eyebrow")}</span><h2>${AA.t("reg.more.title")}</h2></div>
        <div class="region-pager">
          <a class="btn btn--light" href="${AA.regionUrl(prev.id)}" data-role="prev">${AA.icon("arrowLeft")} <span><small>${AA.t("reg.prev")}</small> ${AA.esc(AA.rt(prev.name))}</span></a>
          <a class="btn btn--light" href="${mapUrl}" data-role="onmap-bottom">${AA.icon("map")} ${AA.t("reg.onmap")}</a>
          <a class="btn btn--light" href="${AA.regionUrl(next.id)}" data-role="next"><span><small>${AA.t("reg.next")}</small> ${AA.esc(AA.rt(next.name))}</span> ${AA.icon("arrowRight")}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="chip-row region-chips">${chips}</div>
        <p class="notice mt-2">${AA.t("reg.notice")}</p>
      </div>
    </section>`;

  AA.initReveal(); // the cards above use .reveal
});
