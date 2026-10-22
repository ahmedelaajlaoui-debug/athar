/* boutique.js — product catalog: search, filters, sorting, "load more" (Connecté au Bot WhatsApp) */
document.addEventListener("DOMContentLoaded", async () => {
  const PAGE_SIZE = 9;

  // Craft types group several categories together
  const CRAFT_TYPES = {
    "Ciselure et métal": ["Bijoux"],
    "Tissage": ["Tapis", "Melhfa"],
    "Travail du cuir": ["Cuir"],
    "Mélange d'encens": ["Bakhour"],
  };

  const el = {
    search: document.getElementById("shop-search"),
    chips: document.getElementById("category-chips"),
    price: document.getElementById("filter-price"),
    priceLabel: document.getElementById("price-label"),
    dest: document.getElementById("filter-dest"),
    types: document.getElementById("craft-types"),
    verified: document.getElementById("filter-verified"),
    stock: document.getElementById("filter-stock"),
    sort: document.getElementById("sort-select"),
    grid: document.getElementById("product-grid"),
    count: document.getElementById("result-count"),
    more: document.getElementById("load-more"),
    reset: document.getElementById("reset-filters"),
  };

  let category = ""; // "" = all
  let visible = PAGE_SIZE;

  // ==========================================
  // 1. RÉCUPÉRATION DES DONNÉES DU BOT WHATSAPP
  // ==========================================
  try {
    el.grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Chargement des créations depuis WhatsApp...</p>';
    
    const reponse = await fetch('/api/products');
    if (!reponse.ok) throw new Error("Erreur réseau");
    const produitsBot = await reponse.json();

    // ASTUCE ANTI-CRASH : Création d'un artisan générique pour les produits du bot
    if (typeof AA.artisans !== 'undefined' && !AA.artisans.find(a => a.id === "bot_artisan")) {
      AA.artisans.push({
        id: "bot_artisan",
        name: "Artisan Partenaire",
        coop: "Réseau ATHAR",
        verified: true,
        city: "Maroc"
      });
    }

    // Remplacement des données statiques par les vraies données du bot
    AA.products = produitsBot.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description || "",
      cat: p.category || 'Autre',
      city: p.city || (p.cooperativeDetails && p.cooperativeDetails.city) || 'Maroc',
      coop: p.cooperativeName || 'Coopérative',
      image: (p.imagesUrls && p.imagesUrls.length > 0) ? p.imagesUrls[0] : 'assets/img/default.jpg',
      images: p.imagesUrls || [], 
      stock: p.stock === null ? 999 : (p.stock || 0),
      verified: true, 
      pop: 100, 
      artisan: "bot_artisan" // Empêche AA.productCard de planter !
    }));

  } catch (erreur) {
    console.warn("Bot WhatsApp injoignable. Utilisation des données statiques (js/data.js).", erreur);
  }

  el.grid.innerHTML = '';

  // ==========================================
  // 2. INITIALISATION DES FILTRES
  // ==========================================

  const maxPriceInArray = AA.products.length > 0 ? Math.max(...AA.products.map((p) => p.price)) : 1500;
  const topPrice = Math.max(Number(el.price.max), Math.ceil(maxPriceInArray / 50) * 50);
  el.price.max = String(topPrice);
  el.price.value = String(topPrice);

  if (typeof AA.cities !== 'undefined') {
    AA.cities.forEach((c) => el.dest.add(new Option(c.name, c.name)));
  }
  
  [...new Set(AA.products.map((p) => p.city))]
    .filter((name) => typeof AA.cities === 'undefined' || !AA.cities.some((c) => c.name === name))
    .sort()
    .forEach((name) => {
      const label = (typeof AA.cityLabel === 'function') ? AA.cityLabel(name) : name;
      el.dest.add(new Option(label, name));
    });

  el.types.innerHTML = Object.keys(CRAFT_TYPES)
    .map((t) => `<label class="check"><input type="checkbox" value="${t}" data-type> ${t}</label>`)
    .join("");

  function renderChips() {
    if (typeof AA.categories === 'undefined') return;
    el.chips.innerHTML = ["", ...AA.categories]
      .map((c) => `<button type="button" class="chip ${category === c ? "is-active" : ""}" data-cat="${c}">${c || "Tous"}</button>`)
      .join("");
  }

  // ==========================================
  // 3. LOGIQUE DE RECHERCHE ET D'AFFICHAGE
  // ==========================================

  function getResults() {
    const query = el.search.value.trim().toLowerCase();
    const maxPrice = Number(el.price.value);
    const checkedTypes = [...el.types.querySelectorAll("input:checked")].map((i) => i.value);
    const allowedCats = checkedTypes.flatMap((t) => CRAFT_TYPES[t]);

    const list = AA.products.filter((p) => {
      const artisanData = (p.artisan && typeof AA.getArtisan === 'function') ? AA.getArtisan(p.artisan) : null;
      const artisanName = artisanData ? artisanData.name : "";
      
      const text = `${p.name} ${p.cat} ${p.city} ${artisanName} ${p.coop}`.toLowerCase();
      
      return (
        (!query || text.includes(query)) &&
        (!category || p.cat === category) &&
        p.price <= maxPrice &&
        (!el.dest.value || p.city === el.dest.value) &&
        (!allowedCats.length || allowedCats.includes(p.cat)) &&
        (!el.verified.checked || p.verified) &&
        (!el.stock.checked || p.stock > 0)
      );
    });

    if (el.sort.value === "asc") list.sort((a, b) => a.price - b.price);
    else if (el.sort.value === "desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => (b.pop || 0) - (a.pop || 0));
    
    return list;
  }

  function render() {
    el.priceLabel.textContent = (typeof AA.formatMAD === 'function') ? AA.formatMAD(el.price.value) : `${el.price.value} DH`;
    renderChips();
    
    const results = getResults();
    el.count.textContent = `${results.length} produit${results.length > 1 ? "s" : ""}`;

    if (!results.length) {
      if (typeof AA.emptyState === 'function' && typeof AA.t === 'function') {
        el.grid.innerHTML = AA.emptyState({ icon: "vase", title: AA.t("empty.products.title"), text: AA.t("empty.products.text"), extra: `<button class="btn btn--outline" type="button" data-reset>${AA.t("action.resetFilters")}</button>` });
      } else {
        el.grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Aucun produit trouvé.</p>`;
      }
      el.more.classList.add("hidden");
      return;
    }
    
    // Génération sécurisée des cartes HTML
    try {
        el.grid.innerHTML = results.slice(0, visible).map(AA.productCard).join("");
    } catch (e) {
        console.error("Erreur de rendu de la carte produit:", e);
        el.grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: red;">Erreur d'affichage des produits. Vérifiez la console.</p>`;
    }
    
    el.more.classList.toggle("hidden", visible >= results.length);
  }

  function resetFilters() {
    el.search.value = "";
    el.price.value = el.price.max;
    el.dest.value = "";
    el.verified.checked = el.stock.checked = false;
    el.types.querySelectorAll("input").forEach((i) => (i.checked = false));
    el.sort.value = "pop";
    category = "";
    visible = PAGE_SIZE;
    render();
  }

  [el.search, el.price, el.dest, el.verified, el.stock, el.sort, el.types].forEach((control) =>
    control.addEventListener("input", () => { visible = PAGE_SIZE; render(); })
  );
  el.more.addEventListener("click", () => { visible += PAGE_SIZE; render(); });
  el.reset.addEventListener("click", resetFilters);
  document.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip[data-cat]");
    if (chip) { category = chip.dataset.cat; visible = PAGE_SIZE; render(); }
    if (event.target.closest("[data-reset]")) resetFilters();
  });

  if (typeof AA.getParam === 'function') {
    el.search.value = AA.getParam("q") || "";
    if (typeof AA.categories !== 'undefined' && AA.categories.includes(AA.getParam("cat"))) category = AA.getParam("cat");
    if (typeof AA.cities !== 'undefined' && AA.cities.some((c) => c.name === AA.getParam("dest"))) el.dest.value = AA.getParam("dest");
  }

  render();
});