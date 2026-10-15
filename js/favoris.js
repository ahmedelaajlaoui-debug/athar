/* favoris.js — saved products and artisans (re-renders when a heart is clicked) */
document.addEventListener("DOMContentLoaded", () => {
  const productsBox = document.getElementById("fav-products");
  const artisansBox = document.getElementById("fav-artisans");

  function render() {
    const favs = AA.favs.all();
    const products = favs.product.map(AA.getProduct).filter(Boolean);
    const artisans = favs.artisan.map(AA.getArtisan).filter(Boolean);

    productsBox.innerHTML = products.length
      ? products.map(AA.productCard).join("")
      : AA.emptyState({ icon: "heart", text: AA.t("empty.fav.products"), href: "boutique.html", label: AA.t("cta.shop.explore") });

    artisansBox.innerHTML = artisans.length
      ? artisans.map(AA.artisanCard).join("")
      : AA.emptyState({ icon: "thread", text: AA.t("empty.fav.artisans"), href: "artisans.html", label: AA.t("cta.artisans.discover") });
  }

  // main.js announces every change of favorites with this event
  document.addEventListener("aa:favs", render);
  render();
});
