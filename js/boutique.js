/* boutique.js — product catalog: search, filters, sorting, "load more" */
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

  // ============================================================
  // CHARGEMENT ET FUSION DES PRODUITS DU BOT WHATSAPP (/api/products)
  // ============================================================
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const apiProducts = await res.json();
      
      // Adaptation du format API vers le format AA.products
      const formattedApiProducts = apiProducts.map((p) => {
        const firstImg = (p.imagesUrls && p.imagesUrls.length > 0) ? p.imagesUrls[0] : (p.images && p.images[0] ? `/uploads/${p.images[0]}` : 'assets/placeholder.jpg');
        return {
          id: p.id,
          name: p.name,
          cat: p.cat || p.category || "Cuir",
          city: p.city || "Laâyoune",
          price: p.price,
          stock: p.stock === null || p.stock === undefined ? 10 : p.stock,
          verified: true,
          pop: 99, // Priorité d'affichage pour les nouveaux ajouts
          image: firstImg,
          images: p.imagesUrls || [firstImg],
          artisan: p.managerName || p.phone || "Artisan",
          coop: p.cooperativeName || "Coopérative partenaire",
          description: p.description || ""
        };
      });

      // Fusion sans doublon (les produits du bot viennent en premier)
      const existingIds = new Set(formattedApiProducts.map(p => String(p.id)));
      const staticFiltered = (AA.products || []).filter(p => !existingIds.has(String(p.id)));
      AA.products = [...formattedApiProducts, ...staticFiltered];
    }
  } catch (err) {
    console.warn("API produits non joignable, utilisation des données locales :", err);
  }

  /* Build the filter controls */
  if (AA.cities) {
    AA.cities.forEach((c) => el.dest.add(new Option(c.name, c.name)));
  }
  
  // cooperative demo products can come from other Saharan towns (Tarfaya, Guelmim, Tan-Tan)
  [...new Set(AA.products.map((p) => p.city))].filter((name) => !AA.cities.some((c) => c.name === name)).sort()
    .forEach((name) => el.dest.add(new Option(AA.cityLabel ? AA.cityLabel(name) : name, name)));
    
  el.types.innerHTML = Object.keys(CRAFT_TYPES)
    .map((t) => `<label class="check"><input type="checkbox" value="${t}" data-type> ${t}</label>`)
    .join("");

  function renderChips() {
    el.chips.innerHTML = ["", ...AA.categories]
      .map((c) => `<button type="button" class="chip ${category === c ? "is-active" : ""}" data-cat="${c}">${c || "Tous"}</button>`)
      .join("");
  }

  /* Apply every filter, then sort */
  function getResults() {
    const query = el.search.value.trim().toLowerCase();
    const maxPrice = Number(el.price.value);
    const checkedTypes = [...el.types.querySelectorAll("input:checked")].map((i) => i.value);
    const allowedCats = checkedTypes.flatMap((t) => CRAFT_TYPES[t]);

    const list = AA.products.filter((p) => {
      const artisanObj = AA.getArtisan ? AA.getArtisan(p.artisan) : null;
      const artisanName = artisanObj?.name || p.artisan || "";
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
    el.priceLabel.textContent = AA.formatMAD(el.price.value);
    renderChips();
    const results = getResults();
    el.count.textContent = `${results.length} produit${results.length > 1 ? "s" : ""}`;

    if (!results.length) {
      el.grid.innerHTML = AA.emptyState({ 
        icon: "vase", 
        title: AA.t ? AA.t("empty.products.title") : "Aucun produit trouvé", 
        text: AA.t ? AA.t("empty.products.text") : "Essayez de modifier vos filtres.", 
        extra: `<button class="btn btn--outline" type="button" data-reset>${AA.t ? AA.t("action.resetFilters") : "Réinitialiser"}</button>` 
      });
      el.more.classList.add("hidden");
      return;
    }
    el.grid.innerHTML = results.slice(0, visible).map(AA.productCard).join("");
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

  /* Events: any filter change restarts from the first page */
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

  /* Start values coming from the URL (?q=, ?cat=, ?dest=) */
  el.search.value = AA.getParam ? (AA.getParam("q") || "") : "";
  if (AA.categories && AA.getParam && AA.categories.includes(AA.getParam("cat"))) category = AA.getParam("cat");
  if (AA.cities && AA.getParam && AA.cities.some((c) => c.name === AA.getParam("dest"))) el.dest.value = AA.getParam("dest");

  render();
});