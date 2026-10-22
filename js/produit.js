/* produit.js — product details, chosen with the URL: produit.html?id=p1  (ou ?id=1001 pour un produit du bot) */
document.addEventListener("DOMContentLoaded", async () => {
  // Attendre que les produits du bot (WhatsApp) soient chargés dans AA.products
  if (AA.botReady) await AA.botReady;

  const root = document.getElementById("product-root");
  const product = AA.getProduct(AA.getParam("id"));

  // Unknown or missing id: friendly message instead of an empty page
  if (!product) {
    root.innerHTML = AA.emptyState({ icon: "search_empty", title: AA.t("empty.productMissing.title"), text: AA.t("empty.productMissing.text"), href: "boutique.html", label: AA.t("cta.shop.back") });
    document.getElementById("related-products").closest("section").classList.add("hidden");
    return;
  }

  const fromBot = !!product.fromBot;
  if (fromBot) { product.tech = product.tech || "Artisanat traditionnel"; product.days = product.days || 7; }

  // Produit du bot : la "coopérative" tient lieu d'artisan (pas de fiche artisan dans data.js)
  const artisan = (!fromBot && AA.getArtisan(product.artisan)) || {
    id: "",
    name: product.coopName || "Coopérative",
    coop: product.coopName || ""
  };
  const motif = fromBot ? null : AA.getMotif(product.motif);

  document.title = AA.pageTitle(product.name);
  document.getElementById("breadcrumb-cat").textContent = product.cat;
  document.getElementById("breadcrumb-name").textContent = product.name;

  let qty = 1;

  // AJOUT : gestion du stock
  // Stock illimité (null) pour un produit du bot = achetable ; sinon il faut stock > 0
  const unlimited = fromBot && (product.stock === null || product.stock === undefined);
  const inStock = unlimited || product.stock > 0;
  const maxQty = product.stock > 0 ? product.stock : (inStock ? 99 : 1);

  const artisanLink = (!fromBot && artisan.id)
    ? `<a href="artisans.html?id=${artisan.id}">${AA.esc(artisan.name)}</a> — ${AA.esc(artisan.coop)}`
    : (product.coopId
        ? `<a href="cooperative.html?id=${encodeURIComponent(product.coopId)}">${AA.esc(artisan.name)}</a>`
        : AA.esc(artisan.name));

  root.innerHTML = `
    <div class="product-layout">
      <div class="gallery">
        <div class="gallery__main" id="gallery-main">${AA.img(product.images[0], product.name, product.cat)}</div>
        <div class="gallery__thumbs" id="gallery-thumbs">
          ${product.images.map((src, i) => `<button type="button" class="${i === 0 ? "is-active" : ""}" data-thumb="${i}" aria-label="Voir la photo ${i + 1}">${AA.img(src, product.name, product.cat)}</button>`).join("")}
        </div>
        ${false && product.video ? `<video src="${AA.esc(product.video)}" controls playsinline preload="metadata" style="width:100%;max-height:460px;margin-top:.8rem;border-radius:12px;background:#000"></video>` : ""}
      </div>

      <div>
        <div class="tags mb-1">
          <span class="tag">${AA.esc(product.cat)}</span>
          <span class="tag tag--terra">Fait main</span>
          ${product.verified ? '<span class="tag tag--green">Coopérative vérifiée</span>' : ""}
          ${product.demoCoop ? `<span class="tag">${AA.t("coop.tag.demo")}</span>` : ""}
        </div>
        <h1 style="font-size:clamp(2rem,4vw,3rem)">${AA.esc(product.name)}</h1>
        <p class="price-big">${AA.formatMAD(product.price)}</p>
        <p>${AA.esc(product.desc)}</p>
        <p class="${inStock ? "tag tag--green" : "tag tag--terra"}">${inStock ? (product.stock > 0 ? `Disponible (${product.stock} en stock)` : "Disponible") : "Épuisé"}</p>

        <div class="hero__actions" style="margin:1.2rem 0">
          <div class="qty" aria-label="Quantité" ${inStock ? "" : 'style="display:none"'}>
            <button type="button" id="qty-minus" aria-label="Diminuer la quantité">−</button>
            <span id="qty-value" aria-live="polite">1</span>
            <button type="button" id="qty-plus" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="btn btn--primary" type="button" id="add-btn" data-add-cart data-id="${AA.esc(product.id)}" data-qty="1" ${inStock ? "" : "disabled"}>${inStock ? "Ajouter au panier" : "Produit épuisé"}</button>
          <button class="btn btn--accent" type="button" id="buy-now" ${inStock ? "" : "disabled"}>Acheter maintenant</button>
          ${AA.favButton("product", product.id).replace('class="fav-btn', 'class="btn btn--outline fav-inline fav-btn')}
        </div>

        <ul class="spec-list">
          <li><strong>${fromBot ? "Coopérative" : "Artisan"}</strong><span>${artisanLink}</span></li>
          <li><strong>Origine</strong><span>${AA.esc(product.city)}${fromBot && product.region ? ` (${AA.esc(product.region)})` : ", Sahara marocain"}</span></li>
          <li><strong>Technique</strong><span>${AA.esc(product.tech)}</span></li>
          ${fromBot ? "" : `<li><strong>Matières</strong><span>${AA.esc(product.mat)}</span></li>`}
          <li><strong>Préparation estimée</strong><span>${product.days} jour${product.days > 1 ? "s" : ""} (indicatif)</span></li>
          ${(product.demoCoop || fromBot || !motif) ? "" : `<li><strong>Motif</strong><span>${motif.name} — ${motif.meaning} <em>(signification illustrative)</em></span></li>`}
        </ul>

        ${false ? "" : `
        <div class="passport-teaser">
          <div class="stamp">${AA.icon("scroll")}</div>
          <div>
            <h3 style="margin-bottom:.2rem">Passeport patrimonial</h3>
            <p style="margin-bottom:.7rem">Découvrez l'origine, l'artisan, la technique et l'histoire de cette pièce.</p>
            <a class="btn btn--primary btn--sm" href="passeport.html?id=${product.id}">Voir le passeport patrimonial</a>
          </div>
        </div>`}
      </div>
    </div>`;

  /* The favorite button inside the page is shown as a normal outline button */
  const favInline = root.querySelector(".fav-inline");
  if (favInline) favInline.style.cssText = "position:static;width:auto;height:auto;border-radius:999px;padding:.8rem 1.2rem";

  /* Gallery: click a thumbnail to change the main photo */
  const main = document.getElementById("gallery-main");
  document.getElementById("gallery-thumbs").addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-thumb]");
    if (!thumb) return;
    const index = Number(thumb.dataset.thumb);
    main.innerHTML = AA.img(product.images[index], product.name, product.cat);
    document.querySelectorAll("#gallery-thumbs button").forEach((b) => b.classList.toggle("is-active", b === thumb));
  });

  /* Quantity selector (the "Ajouter" button reads data-qty, see main.js) */
  const qtyValue = document.getElementById("qty-value");
  const addBtn = document.getElementById("add-btn");
  const setQty = (value) => {
    qty = Math.max(1, Math.min(maxQty, value)); // MODIFIÉ : limité au stock
    qtyValue.textContent = qty;
    addBtn.dataset.qty = qty;
  };
  document.getElementById("qty-minus").addEventListener("click", () => setQty(qty - 1));
  document.getElementById("qty-plus").addEventListener("click", () => setQty(qty + 1));

  /* "Acheter maintenant": add to cart, then go straight to the cart page */
  document.getElementById("buy-now").addEventListener("click", () => {
    if (!inStock) return; // AJOUT : sécurité si le bouton est contourné
    AA.cart.add(product.id, qty);
    window.location.href = "panier.html";
  });

  /* Related products: same category first, then the most popular others */
  const related = AA.products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.cat === product.cat) - (a.cat === product.cat) || b.pop - a.pop)
    .slice(0, 4);
  document.getElementById("related-products").innerHTML = related.map(AA.productCard).join("");
});