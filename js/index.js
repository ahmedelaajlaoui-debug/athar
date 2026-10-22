/* index.js — fills the homepage sections from the shared data (FR / EN / AR) */
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

  // Cooperatives to discover: 3 listings from the shared directory (the full directory is on the Patrimoine page)
  document.getElementById("home-coops").innerHTML = AA.dir.all().slice(0, 3).map((c) => AA.dir.card(c)).join("");

  AA.applyBackgrounds(); // for the cards created above
  AA.initReveal();       // the cards above use .reveal
});
