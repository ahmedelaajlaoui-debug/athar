/* produit.js — product details, chosen with the URL: produit.html?id=... */
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("product-root");
  const targetId = AA.getParam("id");
  const currentLang = AA.lang || "fr";

  // ============================================================
  // 1. CHARGEMENT ET FUSION DES PRODUITS DU BOT WHATSAPP (/api/products)
  // ============================================================
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const apiProducts = await res.json();
      
      const formattedApi = apiProducts.map((p) => {
        // Extraction des images (limite fixée à 3 maximum)
        const rawImages = (p.imagesUrls && p.imagesUrls.length > 0)
          ? p.imagesUrls
          : (p.images && p.images.length > 0 ? p.images.map(img => `/uploads/${img}`) : []);

        const validImages = rawImages.length > 0 ? rawImages.slice(0, 3) : ['assets/placeholder.jpg'];
        const firstImg = validImages[0];

        // Prise en charge des langues générées par Gemini
        const nameI18n = p.name_i18n || { fr: p.name, ar: p.name, en: p.name };
        const descI18n = p.description_i18n || { 
          fr: p.description || p.desc, 
          ar: p.description || p.desc, 
          en: p.description || p.desc 
        };

        const localizedName = nameI18n[currentLang] || nameI18n.fr || p.name;
        const localizedDesc = descI18n[currentLang] || descI18n.fr || p.description || p.desc || "Création artisanale confectionnée à la main.";

        // Stock exact
        const stock = Number.isInteger(Number(p.stock)) ? Math.max(0, Number(p.stock)) : 10;

        return {
          id: p.id,
          name: localizedName,
          name_i18n: nameI18n,
          desc: localizedDesc,
          description_i18n: descI18n,
          cat: p.category || p.cat || "Melhfa",
          city: p.city || "Laâyoune",
          price: Number(p.price) || 0,
          stock: stock,
          verified: true,
          demoCoop: false,
          pop: 99,
          image: firstImg,
          images: validImages,
          artisan: p.managerName || p.phone || "Artisan",
          coop: p.cooperativeName || "Coopérative partenaire",
          tech: "Fait main, tissage et broderie traditionnelle",
          mat: "Tissu noble et fil de coton",
          days: 3,
          motif: null
        };
      });

      // Fusion sans doublon (les données du bot prennent la priorité)
      const existingIds = new Set(formattedApi.map(p => String(p.id)));
      const staticFiltered = (AA.products || []).filter(p => !existingIds.has(String(p.id)));
      AA.products = [...formattedApi, ...staticFiltered];
    }
  } catch (err) {
    console.warn("API produits non joignable, utilisation des données locales :", err);
  }

  // ============================================================
  // 2. RÉCUPÉRATION DU PRODUIT CIBLE
  // ============================================================
  const product = (AA.products || []).find(p => String(p.id) === String(targetId)) || (AA.getProduct ? AA.getProduct(targetId) : null);

  if (!product) {
    root.innerHTML = AA.emptyState({
      icon: "search_empty",
      title: AA.t ? AA.t("empty.productMissing.title") : "Produit introuvable",
      text: AA.t ? AA.t("empty.productMissing.text") : "Ce produit n'existe pas ou n'est plus disponible.",
      href: "boutique.html",
      label: AA.t ? AA.t("cta.shop.back") : "Retour à la boutique"
    });
    const relatedSection = document.getElementById("related-products")?.closest("section");
    if (relatedSection) relatedSection.classList.add("hidden");
    return;
  }

  // Objets liés
  const artisanObj = AA.getArtisan ? AA.getArtisan(product.artisan) : null;
  const artisanName = artisanObj?.name || product.artisan || "Artisan partenaire";
  const artisanCoop = artisanObj?.coop || product.coop || "Coopérative partenaire";
  const motif = (AA.getMotif && product.motif) ? AA.getMotif(product.motif) : null;

  document.title = AA.pageTitle ? AA.pageTitle(product.name) : `${product.name} — ATHAR`;
  const breadcrumbCat = document.getElementById("breadcrumb-cat");
  const breadcrumbName = document.getElementById("breadcrumb-name");
  if (breadcrumbCat) breadcrumbCat.textContent = product.cat;
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  let qty = 1;
  // Limiter les images affichées à 3 au maximum
  const images = (product.images && product.images.length > 0)
    ? product.images.slice(0, 3)
    : [product.image || 'assets/placeholder.jpg'];

  // ============================================================
  // 3. RENDU DU PRODUIT DANS LA PAGE
  // ============================================================
  root.innerHTML = `
    <div class="product-layout">
      <div class="gallery" style="display:flex; flex-direction:column; gap:14px;">
        <!-- Image Principale -->
        <div class="gallery__main" id="gallery-main" style="width:100%; height:420px; border-radius:14px; overflow:hidden; background:#f7f4ee;">
          <img src="${images[0]}" alt="${AA.esc(product.name)}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>

        <!-- Miniatures (jusqu'à 3 images) en dessous -->
        ${images.length > 1 ? `
        <div class="gallery__thumbs" id="gallery-thumbs" style="display:flex; gap:12px;">
          ${images.map((src, i) => `
            <button type="button" class="${i === 0 ? "is-active" : ""}" data-thumb="${i}" aria-label="Photo ${i + 1}"
              style="width:85px; height:85px; padding:0; border:2px solid ${i === 0 ? 'var(--terracotta, #b85d38)' : '#e5e0d8'}; border-radius:10px; overflow:hidden; cursor:pointer; background:#f7f4ee; flex-shrink:0;">
              <img src="${src}" alt="${AA.esc(product.name)}" style="width:100%; height:100%; object-fit:cover; display:block;">
            </button>
          `).join("")}
        </div>` : ''}
      </div>

      <div>
        <div class="tags mb-1">
          <span class="tag">${product.cat}</span>
          <span class="tag tag--terra">Fait main</span>
          ${product.verified ? '<span class="tag tag--green">Coopérative vérifiée</span>' : ""}
          ${product.demoCoop ? `<span class="tag">${AA.t("coop.tag.demo")}</span>` : ""}
        </div>
        <h1 style="font-size:clamp(2rem,4vw,3rem)">${AA.esc(product.name)}</h1>
        <p class="price-big">${AA.formatMAD(product.price)}</p>
        <p>${AA.esc(product.desc || product.description || "")}</p>
        <p class="${product.stock > 0 ? "tag tag--green" : "tag tag--terra"}">
          ${product.stock > 0 ? `Disponible (${product.stock} en stock)` : "Épuisé"}
        </p>

        <div class="hero__actions" style="margin:1.2rem 0">
          <div class="qty" aria-label="Quantité">
            <button type="button" id="qty-minus" aria-label="Diminuer la quantité">−</button>
            <span id="qty-value" aria-live="polite">1</span>
            <button type="button" id="qty-plus" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="btn btn--primary" type="button" id="add-btn" data-add-cart data-id="${product.id}" data-qty="1" ${product.stock > 0 ? "" : "disabled"}>Ajouter au panier</button>
          <button class="btn btn--accent" type="button" id="buy-now" ${product.stock > 0 ? "" : "disabled"}>Acheter maintenant</button>
          ${AA.favButton ? AA.favButton("product", product.id).replace('class="fav-btn', 'class="btn btn--outline fav-inline fav-btn') : ""}
        </div>

        <ul class="spec-list">
          <li><strong>Artisan</strong><span><a href="artisans.html?id=${artisanObj?.id || ''}">${AA.esc(artisanName)}</a> — ${AA.esc(artisanCoop)}</span></li>
          <li><strong>Origine</strong><span>${product.city}, Sahara marocain</span></li>
          <li><strong>Technique</strong><span>${AA.esc(product.tech || "Artisanat traditionnel")}</span></li>
          <li><strong>Matières</strong><span>${AA.esc(product.mat || "Matières premières authentiques")}</span></li>
          <li><strong>Préparation estimée</strong><span>${product.days || 3} jour${(product.days || 3) > 1 ? "s" : ""} (indicatif)</span></li>
          ${motif ? `<li><strong>Motif</strong><span>${motif.name} —${motif.meaning} <em>(signification illustrative)</em></span></li>` : ""}
        </ul>

        <div class="passport-teaser">
          <div class="stamp">${AA.icon("scroll")}</div>
          <div>
            <h3 style="margin-bottom:.2rem">Passeport patrimonial</h3>
            <p style="margin-bottom:.7rem">Découvrez l'origine, l'artisan, la technique et l'histoire de cette pièce.</p>
            <a class="btn btn--primary btn--sm" href="passeport.html?id=${product.id}">Voir le passeport patrimonial</a>
          </div>
        </div>
      </div>
    </div>`;

  const favInline = root.querySelector(".fav-inline");
  if (favInline) favInline.style.cssText = "position:static;width:auto;height:auto;border-radius:999px;padding:.8rem 1.2rem";

  // Clic sur miniature : change l'image principale au-dessus
  const mainEl = document.getElementById("gallery-main");
  const thumbsContainer = document.getElementById("gallery-thumbs");
  if (thumbsContainer && mainEl) {
    thumbsContainer.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-thumb]");
      if (!btn) return;
      const index = Number(btn.dataset.thumb);
      
      const mainImg = mainEl.querySelector("img");
      if (mainImg) mainImg.src = images[index];

      thumbsContainer.querySelectorAll("button").forEach((b) => {
        const isActive = (b === btn);
        b.classList.toggle("is-active", isActive);
        b.style.borderColor = isActive ? "var(--terracotta, #b85d38)" : "#e5e0d8";
      });
    });
  }

  // Sélecteur de quantité
  const qtyValue = document.getElementById("qty-value");
  const addBtn = document.getElementById("add-btn");
  const setQty = (value) => {
    qty = Math.max(1, Math.min(Math.max(product.stock, 1), value));
    if (qtyValue) qtyValue.textContent = qty;
    if (addBtn) addBtn.dataset.qty = qty;
  };
  document.getElementById("qty-minus")?.addEventListener("click", () => setQty(qty - 1));
  document.getElementById("qty-plus")?.addEventListener("click", () => setQty(qty + 1));

  // Achat direct
  document.getElementById("buy-now")?.addEventListener("click", () => {
    if (AA.cart?.add) AA.cart.add(product.id, qty);
    window.location.href = "panier.html";
  });

  // Produits similaires
  const relatedEl = document.getElementById("related-products");
  if (relatedEl && AA.productCard) {
    const related = (AA.products || [])
      .filter((p) => String(p.id) !== String(product.id))
      .sort((a, b) => (b.cat === product.cat) - (a.cat === product.cat) || (b.pop || 0) - (a.pop || 0))
      .slice(0, 4);
    relatedEl.innerHTML = related.map(AA.productCard).join("");
  }
});