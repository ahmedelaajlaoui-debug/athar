/* panier.js — shopping cart page (data lives in localStorage via AA.cart) */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("cart-root");

  function render() {
    const items = AA.cart.items();

    // Empty cart
    if (!items.length) {
      root.innerHTML = `
        ${AA.emptyState({ icon: "cart", title: AA.t("empty.cart.title"), text: AA.t("empty.cart.text"), href: "boutique.html", label: AA.t("cta.continue") })}`;
      return;
    }

    const rows = items
      .map((item) => {
        const p = AA.getProduct(item.id);
        return `
        <article class="cart-item">
          <a href="produit.html?id=${p.id}">${AA.img(p.image, p.name, p.cat)}</a>
          <div>
            <h3><a href="produit.html?id=${p.id}">${AA.esc(p.name)}</a></h3>
            <p class="card__meta">${AA.esc(AA.getArtisan(p.artisan).name)} · ${p.city}</p>
            <p class="card__meta">${AA.formatMAD(p.price)} l'unité</p>
          </div>
          <div class="cart-item__right">
            <strong>${AA.formatMAD(p.price * item.qty)}</strong>
            <div class="qty">
              <button type="button" data-minus="${p.id}" aria-label="Diminuer la quantité de ${AA.esc(p.name)}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-plus="${p.id}" aria-label="Augmenter la quantité de ${AA.esc(p.name)}">+</button>
            </div>
            <button class="link-btn" type="button" data-remove="${p.id}">Supprimer</button>
          </div>
        </article>`;
      })
      .join("");

    const subtotal = AA.cart.subtotal();
    root.innerHTML = `
      <div class="cart-layout">
        <div>
          ${rows}
          <div class="hero__actions">
            <a class="btn btn--outline" href="boutique.html">${AA.icon("arrowLeft")}${AA.t("cta.continue")}</a>
            <button class="btn btn--outline" type="button" id="clear-cart">Vider le panier</button>
          </div>
        </div>
        <aside class="summary">
          <h2 style="font-size:1.5rem">Récapitulatif</h2>
          <div class="price-line"><span>Sous-total (${AA.cart.count()} article${AA.cart.count() > 1 ? "s" : ""})</span><span>${AA.formatMAD(subtotal)}</span></div>
          <div class="price-line"><span>Livraison</span><span class="muted">Calculée à l'étape suivante</span></div>
          <div class="price-line price-line--total"><span>Total</span><span>${AA.formatMAD(subtotal)}</span></div>
          <a class="btn btn--primary btn--block mt-1" href="checkout.html">Passer à la commande</a>
          <p class="muted mt-1" style="font-size:.8rem">Démonstration : aucun paiement réel n'est effectué.</p>
        </aside>
      </div>`;
  }

  // One listener for all the small buttons
  root.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const remove = event.target.closest("[data-remove]");
    if (plus || minus) {
      const id = (plus || minus).dataset.plus || (plus || minus).dataset.minus;
      const current = AA.cart.items().find((i) => i.id === id);
      AA.cart.setQty(id, current.qty + (plus ? 1 : -1));
    } else if (remove) {
      AA.cart.remove(remove.dataset.remove);
      AA.toast("Produit retiré du panier");
    } else if (event.target.id === "clear-cart") {
      AA.cart.clear();
      AA.toast("Panier vidé");
    }
  });

  document.addEventListener("aa:cart", render);
  render();
});
