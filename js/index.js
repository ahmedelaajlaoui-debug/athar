/* index.js — fills the homepage sections from the sample data (FR / EN / AR) */
document.addEventListener("DOMContentLoaded", () => {
  // Featured products: the 4 most popular
  const featured = [...AA.products].sort((a, b) => b.pop - a.pop).slice(0, 4);
  document.getElementById("featured-products").innerHTML = featured.map(AA.productCard).join("");

  // Destinations: the Saharan destinations of the Explorer (each card opens its map selection)
  document.getElementById("home-cities").innerHTML = AA.regions
    .map(
      (r) => `
      <a class="card" href="explorer.html?city=${r.id}#carte">
        <div class="card__img craft-art">${AA.regionArt(r, "home")}</div>
        <div class="card__body">
          <h3>${AA.esc(AA.rt(r.name))}</h3>
          <p class="card__meta">${AA.esc(AA.rt(r.tagline))}</p>
        </div>
      </a>`
    )
    .join("");

  // "Lire, comprendre, partager": 4 informational cards. Every link goes to an information page.
  const reads = [
    { icon: "book", title: AA.t("hm.r1.t"), text: AA.t("hm.r1.x"), href: "patrimoine.html", label: AA.t("hm.cta.heritage") },
    { icon: "users", title: AA.rt(AA.getArticle("the").name), text: AA.t("hm.r2.x"), href: "savoir-faire.html?id=the", label: AA.t("hp.read") },
    { icon: "star8", title: AA.rt(AA.getArticle("musique-poesie").name), text: AA.t("hm.r3.x"), href: "savoir-faire.html?id=musique-poesie", label: AA.t("hp.read") },
    { icon: "palm", title: AA.rt(AA.getArticle("oasis").name), text: AA.t("hm.r4.x"), href: "savoir-faire.html?id=oasis", label: AA.t("hp.read") },
  ];
  document.getElementById("home-reads").innerHTML = reads
    .map(
      (item) => `
      <article class="card reveal">
        <div class="card__body">
          <span class="icon-lg">${AA.icon(item.icon)}</span>
          <h3>${AA.esc(item.title)}</h3>
          <p class="card__meta">${AA.esc(item.text)}</p>
          <div class="card__actions"><a class="btn btn--outline btn--sm" href="${item.href}">${AA.esc(item.label)}${AA.icon("arrowRight")}</a></div>
        </div>
      </article>`
    )
    .join("");

  // Quick links to the 5 craft detail pages
  document.getElementById("home-craft-links").innerHTML = AA.crafts
    .map((craft) => `<a class="chip" href="savoir-faire.html?id=${craft.id}">${AA.icon(craft.icon)} ${AA.esc(AA.rt(craft.name))}</a>`)
    .join("");

  AA.applyBackgrounds(); // for the cards created above
  AA.initReveal();       // the cards above use .reveal
});
