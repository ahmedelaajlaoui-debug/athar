/* panier.js — shopping cart page (data lives in localStorage via AA.cart) */
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("cart-root");

  // 1. Charger et fusionner les produits créés par le bot WhatsApp
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const apiProducts = await res.json();
      const formattedApi = apiProducts.map((p) => {
        const firstImg = (p.imagesUrls && p.imagesUrls.length > 0)
          ? p.imagesUrls[0]
          : (p.images && p.images[0] ? `/uploads/${p.images[0]}` : 'assets/placeholder.jpg');

        return {
          id: p.id,
          name: p.name,
          cat: p.category || p.cat || "Melhfa",
          city: p.city || "Laâyoune",
          price: p.price,
          stock: p.stock === null || p.stock === undefined ? 10 : p.stock,
          verified: true,
          image: firstImg,
          images: p.imagesUrls || [firstImg],
          artisan: p.managerName || p.phone || "Artisan",
          coop: p.cooperativeName || "Coopérative partenaire"
        };
      });

      const existingIds = new Set(formattedApi.map((p) => String(p.id)));
      const staticFiltered = (window.AA?.products || []).filter((p) => !existingIds.has(String(p.id)));
      window.AA.products = [...formattedApi, ...staticFiltered];
    }
  } catch (err) {
    console.warn("API produits non joignable :", err);
  }

  function getCartProduct(id) {
    return (window.AA?.products || []).find((p) => String(p.id) === String(id))
      || (AA.getProduct ? AA.getProduct(id) : null);
  }

  function render() {
    const items = AA.cart.items();

    // Panier vide
    if (!items.length) {
      root.innerHTML = `${AA.emptyState({
        icon: "cart",
        title: AA.t("empty.cart.title"),
        text: AA.t("empty.cart.text"),
        href: "boutique.html",
        label: AA.t("cta.continue")
      })}`;
      return;
    }

    const rows = items
      .map((item) => {
        const p = getCartProduct(item.id);
        if (!p) return "";

        const artisanObj = AA.getArtisan ? AA.getArtisan(p.artisan) : null;
        const artisanName = artisanObj?.name || p.artisan || p.coop || "Artisan partenaire";

        // Détection de l'image (upload bot ou fichier statique)
        const imgSrc = (p.images && p.images[0]) ? p.images[0] : (p.image || "assets/placeholder.jpg");

        return `
        <article class="cart-item">
          <a href="produit.html?id=${p.id}" style="display:block; width:90px; height:90px; border-radius:10px; overflow:hidden; background:#f5f2eb; flex-shrink:0;">
            <img src="${imgSrc}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </a>
          <div>
            <h3><a href="produit.html?id=${p.id}">${AA.esc(p.name)}</a></h3>
            <p class="card__meta">${AA.esc(artisanName)} · ${p.city || "Sahara"}</p>
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
      .filter(Boolean)
      .join("");

    // Calcul du sous-total sécurisé
    const subtotal = items.reduce((sum, item) => {
      const p = getCartProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

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
          <div class="price-line"><span>Sous-total (${totalCount} article${totalCount > 1 ? "s" : ""})</span><span>${AA.formatMAD(subtotal)}</span></div>
          <div class="price-line"><span>Livraison</span><span class="muted">Calculée à l'étape suivante</span></div>
          <div class="price-line price-line--total"><span>Total</span><span>${AA.formatMAD(subtotal)}</span></div>
          <a class="btn btn--primary btn--block mt-1" href="checkout.html">Passer à la commande</a>
          <p class="muted mt-1" style="font-size:.8rem">Démonstration : aucun paiement réel n'est effectué.</p>
        </aside>
      </div>`;
  }

  // Écouteur global pour les boutons d'action du panier
  root.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const remove = event.target.closest("[data-remove]");

    if (plus || minus) {
      const id = (plus || minus).dataset.plus || (plus || minus).dataset.minus;
      const current = AA.cart.items().find((i) => String(i.id) === String(id));
      if (current) {
        AA.cart.setQty(id, current.qty + (plus ? 1 : -1));
      }
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