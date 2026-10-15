/* patrimoine.js — motif cards, "Saviez-vous que ?", craft cards and article cards (FR / EN / AR) */
document.addEventListener("DOMContentLoaded", () => {
  // Motif cards, each linking to a product that uses the motif
  document.getElementById("motif-grid").innerHTML = AA.motifs
    .map((motif) => {
      const product = AA.products.find((p) => p.motif === motif.id);
      return `
      <article class="motif-card reveal">
        ${AA.motifSvg(motif)}
        <h3>${AA.t("motif." + motif.id + ".name")}</h3>
        <p>${AA.t("motif." + motif.id + ".meaning")}</p>
        <p class="tag tag--terra">${AA.t("hp.motif.tag")}</p>
        ${product ? `<p><a href="produit.html?id=${product.id}">${AA.t("heritage.seePiece")}${AA.icon("arrowRight")}</a></p>` : ""}
      </article>`;
    })
    .join("");

  // "Saviez-vous que ?" — simple rotation through a short list
  let index = 0;
  const factCount = 5;
  const factText = document.getElementById("fact-text");
  const showFact = () => { factText.textContent = AA.t("hp.fact.prefix") + " " + AA.t("hp.fact." + (index + 1)); };
  showFact();
  document.getElementById("next-fact").addEventListener("click", () => {
    index = (index + 1) % factCount;
    showFact();
  });

  // The 5 craft cards. Each button opens savoir-faire.html?id=<craft> (information page only).
  document.getElementById("craft-grid").innerHTML = AA.crafts
    .map((craft) => {
      const name = AA.rt(craft.name);
      return `
      <article class="card reveal">
        <div class="card__img craft-art">${AA.craftArt(craft.id)}</div>
        <div class="card__body">
          <h3>${AA.esc(name)}</h3>
          <p class="card__meta">${AA.esc(AA.rt(craft.short))}</p>
          <p class="card__meta"><strong>${AA.t("hp.tech")}</strong> ${AA.esc(AA.rt(craft.tech))}</p>
          <p class="card__meta"><strong>${AA.t("hp.meaning")}</strong> ${AA.esc(AA.rt(craft.meaning))}</p>
          <div class="card__actions">
            <a class="btn btn--primary btn--sm" href="savoir-faire.html?id=${craft.id}" aria-label="${AA.esc(AA.t("hp.more.aria", { name }))}">${AA.t("hp.more")}${AA.icon("arrowRight")}</a>
          </div>
        </div>
      </article>`;
    })
    .join("");

  // Four culture articles: tea and hospitality, music and poetry, cuisine, desert and oases
  document.getElementById("topic-grid").innerHTML = AA.topics
    .map(
      (topic) => `
      <article class="card reveal">
        <div class="card__body">
          <span class="icon-lg">${AA.icon(topic.icon)}</span>
          <h3>${AA.esc(AA.rt(topic.name))}</h3>
          <p class="card__meta">${AA.esc(AA.rt(topic.intro))}</p>
          <div class="card__actions"><a class="btn btn--outline btn--sm" href="savoir-faire.html?id=${topic.id}">${AA.t("hp.read")}${AA.icon("arrowRight")}</a></div>
        </div>
      </article>`
    )
    .join("");

  AA.initReveal(); // the cards above use .reveal
});
