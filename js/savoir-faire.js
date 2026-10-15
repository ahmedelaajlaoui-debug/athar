/* savoir-faire.js — information page for one craft or one article (FR / EN / AR).
   URL: savoir-faire.html?id=<id>  (ids are listed in js/crafts.js: AA.crafts and AA.topics) */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("article-root");
  const item = AA.getArticle(AA.getParam("id"));

  // Unknown or missing id: friendly message and a way back
  if (!item) {
    document.title = AA.pageTitle(AA.t("title.patrimoine"));
    root.innerHTML = `<section class="section"><div class="container">${AA.emptyState({
      icon: "search_empty",
      title: AA.t("sf.nf.title"),
      text: AA.t("sf.nf.text"),
      href: "patrimoine.html",
      label: AA.t("sf.back"),
    })}</div></section>`;
    return;
  }

  const isCraft = AA.crafts.some((c) => c.id === item.id);
  document.title = AA.pageTitle(AA.rt(item.name));

  const sectionCards = item.sections
    .map(
      (sec) => `
      <article class="card reveal">
        <div class="card__body">
          <span class="icon-lg icon-lg--accent">${AA.icon(sec.icon)}</span>
          <h3>${AA.esc(AA.rt(sec.title))}</h3>
          <p class="card__meta">${AA.esc(AA.rt(sec.text))}</p>
        </div>
      </article>`
    )
    .join("");

  // Other pages to read next (everything except the current one)
  const others = [...AA.crafts, ...AA.topics]
    .filter((x) => x.id !== item.id)
    .map((x) => `<a class="chip" href="savoir-faire.html?id=${x.id}">${AA.icon(x.icon)} ${AA.esc(AA.rt(x.name))}</a>`)
    .join("");

  root.innerHTML = `
    <section class="section section--sand article-head">
      <div class="container">
        <a class="btn btn--outline btn--sm mb-2" href="patrimoine.html">${AA.icon("arrowLeft")} ${AA.t("sf.back")}</a>
        <div class="split">
          <div>
            <span class="eyebrow">${AA.t(isCraft ? "sf.eyebrow.craft" : "sf.eyebrow.topic")}</span>
            <h1>${AA.esc(AA.rt(item.name))}</h1>
            <p class="lead">${AA.esc(AA.rt(item.intro))}</p>
          </div>
          <div class="craft-art craft-art--lg">${AA.craftArt(item.id)}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${AA.t(isCraft ? "sf.sec.craft.eyebrow" : "sf.sec.topic.eyebrow")}</span>
          <h2>${AA.t(isCraft ? "sf.sec.craft.title" : "sf.sec.topic.title")}</h2>
        </div>
        <div class="grid grid--3">${sectionCards}</div>
        ${item.places ? `<div class="info-box mt-2 reveal"><h3>${AA.t("sf.where")}</h3><p>${AA.esc(AA.rt(item.places))}</p></div>` : ""}
      </div>
    </section>

    <section class="section section--green">
      <div class="container">
        <div class="section-head"><span class="eyebrow" style="color:#f0c9a0">${AA.t("sf.brief.eyebrow")}</span><h2>${AA.t("sf.brief.title")}</h2></div>
        <div class="grid grid--3">
          ${item.keypoints.map((point) => `<p class="keypoint">${AA.icon("checkCircle")}<span>${AA.esc(AA.rt(point))}</span></p>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">${AA.t("sf.next.eyebrow")}</span><h2>${AA.t("sf.next.title")}</h2></div>
        <div class="chip-row">${others}</div>
        <p class="notice mt-2">${AA.t("sf.note")}</p>
      </div>
    </section>`;

  AA.initReveal(); // the cards above use .reveal
});
