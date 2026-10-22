/* artisans.js — artisan directory: search, filters and profile view */
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("artisan-search");
  const citySelect = document.getElementById("artisan-city");
  const craftSelect = document.getElementById("artisan-craft");
  const verified = document.getElementById("artisan-verified");
  const grid = document.getElementById("artisan-grid");
  const count = document.getElementById("artisan-count");
  const detail = document.getElementById("artisan-detail");

  // Fill the two <select> menus from the data
  [...new Set(AA.artisans.map((a) => a.city))].sort().forEach((city) => citySelect.add(new Option(city, city)));
  [...new Set(AA.artisans.map((a) => a.craft))].sort().forEach((craft) => craftSelect.add(new Option(AA.catLabel(craft), craft)));

  function renderList() {
    const query = search.value.trim().toLowerCase();
    const list = AA.artisans.filter((a) => {
      const text = `${a.name} ${a.nameAr || ""} ${a.coop} ${a.specialty}`.toLowerCase();
      return (
        (!query || text.includes(query)) &&
        (!citySelect.value || a.city === citySelect.value) &&
        (!craftSelect.value || a.craft === craftSelect.value) &&
        (!verified.checked || a.verified)
      );
    });
    count.textContent = `${list.length} coopérative${list.length > 1 ? "s" : ""} trouvée${list.length > 1 ? "s" : ""}`;
    grid.innerHTML = list.length
      ? list.map(AA.artisanCard).join("")
      : AA.emptyState({ icon: "search_empty", title: AA.t("empty.artisans.title"), text: AA.t("empty.artisans.text"), extra: `<button class="btn btn--outline" type="button" id="reset-artisans">${AA.t("action.reset")}</button>` });
  }

  function openDetail(id, scroll = true) {
    const a = AA.getArtisan(id);
    if (!a) return;
    const products = AA.products.filter((p) => p.artisan === a.id);
    detail.innerHTML = `
      <div class="artisan-detail__grid">
        <div>${`<img class="portrait" src="${AA.esc(a.photo)}" alt="${AA.esc(a.name)}" data-label="${AA.esc(a.name)}" data-cat="${a.craft}" onerror="AA.fallback(this)">`}</div>
        <div>
          <div class="tags mb-1"><span class="tag">${AA.catLabel(a.craft)}</span>${a.verified ? '<span class="tag tag--green">Coopérative vérifiée</span>' : ""}</div>
          <h2>${AA.esc(a.name)}${a.nameAr ? ` <small dir="rtl" lang="ar">${AA.esc(a.nameAr)}</small>` : ""}</h2>
          <p class="muted">${AA.esc(a.region || "")} · ${a.city}</p>
          <p>${AA.esc(a.bio)}</p>
          <p><strong>Localité :</strong> ${AA.esc(a.locality || a.city)}</p>${a.certification ? `<p><strong>Certification :</strong> ${AA.esc(a.certification)}</p>` : ""}
          <h3 class="mt-1">Ses produits</h3>
          <ul class="mini-list">${products.map((p) => `<li><a href="produit.html?id=${p.id}">${AA.esc(p.name)}</a> — ${AA.formatMAD(p.price)}</li>`).join("")}</ul>
          <div class="hero__actions" style="margin-top:1rem">
            <a class="btn btn--primary btn--sm" href="boutique.html?q=${encodeURIComponent(a.name)}">Voir ses produits</a>
            <a class="btn btn--outline btn--sm" href="patrimoine.html">Lire les histoires du patrimoine</a>
            ${AA.favButton("artisan", a.id)}
            <button class="btn btn--outline btn--sm" type="button" id="close-detail">Fermer</button>
          </div>
        </div>
      </div>`;
    // the favorite button inside the detail should look like a normal button
    const fav = detail.querySelector(".fav-btn");
    if (fav) fav.style.cssText = "position:static;width:auto;height:auto;border-radius:999px;padding:.5rem 1rem;border:1.5px solid var(--beige-border)";
    detail.classList.add("is-open");
    if (scroll) detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeDetail() {
    detail.classList.remove("is-open");
    history.replaceState(null, "", "artisans.html");
  }

  // Filters
  [search, citySelect, craftSelect, verified].forEach((el) => el.addEventListener("input", renderList));

  // Clicks: open a profile without reloading the page, close it, reset filters
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="artisans.html?id="]');
    if (link) {
      event.preventDefault();
      const id = new URL(link.href).searchParams.get("id");
      history.pushState(null, "", `artisans.html?id=${id}`);
      openDetail(id);
    } else if (event.target.id === "close-detail") {
      closeDetail();
    } else if (event.target.id === "reset-artisans") {
      search.value = citySelect.value = craftSelect.value = "";
      verified.checked = false;
      renderList();
    }
  });

  renderList();
  const startId = AA.getParam("id");
  if (startId) openDetail(startId, false);
});