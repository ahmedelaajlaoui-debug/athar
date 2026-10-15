/* coffret.js — gift-box builder with live price */
document.addEventListener("DOMContentLoaded", () => {
  const MAX_ITEMS = 6;

  // Which categories we suggest first for each occasion
  const OCCASIONS = {
    "Cadeau": ["Bijoux", "Bakhour"],
    "Maison": ["Tapis", "Cuir", "Bakhour"],
    "Personnel": ["Melhfa", "Bijoux"],
    "Souvenir": ["Cuir", "Bijoux", "Bakhour"],
  };

  let occasion = "Cadeau";
  let selected = []; // product ids

  const el = {
    chips: document.getElementById("occasion-chips"),
    list: document.getElementById("coffret-products"),
    visual: document.getElementById("box-visual"),
    lines: document.getElementById("coffret-lines"),
    total: document.getElementById("coffret-total"),
    message: document.getElementById("coffret-message"),
    note: document.getElementById("gift-note"),
    count: document.getElementById("msg-count"),
    builder: document.getElementById("coffret-builder"),
    confirmation: document.getElementById("coffret-confirmation"),
  };

  function renderChips() {
    el.chips.innerHTML = Object.keys(OCCASIONS)
      .map((o) => `<button type="button" class="chip ${o === occasion ? "is-active" : ""}" data-occasion="${o}">${o}</button>`)
      .join("");
  }

  function renderProducts() {
    const suggested = OCCASIONS[occasion];
    // suggested categories first, then by popularity
    const sorted = [...AA.products].sort(
      (a, b) => suggested.includes(b.cat) - suggested.includes(a.cat) || b.pop - a.pop
    );
    el.list.innerHTML = sorted
      .map((p) => {
        const isOn = selected.includes(p.id);
        return `
        <div class="coffret-item ${isOn ? "is-selected" : ""}">
          ${AA.img(p.image, p.name, p.cat)}
          <div class="coffret-item__info">
            <strong>${AA.esc(p.name)}</strong>
            <span class="muted">${p.cat} · ${AA.formatMAD(p.price)}</span>
            ${suggested.includes(p.cat) ? '<span class="tag tag--terra">Suggéré</span>' : ""}
          </div>
          <button type="button" class="btn btn--sm ${isOn ? "btn--outline" : "btn--primary"}" data-toggle="${p.id}">${isOn ? "Retirer" : "Ajouter"}</button>
        </div>`;
      })
      .join("");
  }

  /* Box preview, price lines and total */
  function renderBox() {
    let slots = "";
    for (let i = 0; i < MAX_ITEMS; i++) {
      const p = AA.getProduct(selected[i]);
      slots += `<div class="slot">${p ? AA.img(p.image, p.name, p.cat) : "vide"}</div>`;
    }
    el.visual.innerHTML = slots;

    el.lines.innerHTML = selected.length
      ? selected.map((id) => { const p = AA.getProduct(id); return `<div class="price-line"><span>${AA.esc(p.name)}</span><span>${AA.formatMAD(p.price)}</span></div>`; }).join("")
      : '<p class="muted">Aucun produit sélectionné.</p>';

    const total = selected.reduce((sum, id) => sum + AA.getProduct(id).price, 0);
    el.total.textContent = AA.formatMAD(total);
  }

  function renderAll() {
    renderChips();
    renderProducts();
    renderBox();
  }

  function reset() {
    selected = [];
    el.message.value = "";
    el.count.textContent = "0";
    el.note.textContent = "Votre message apparaîtra ici.";
    renderAll();
  }

  document.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-occasion]");
    const toggle = event.target.closest("[data-toggle]");
    if (chip) {
      occasion = chip.dataset.occasion;
      renderAll();
    } else if (toggle) {
      const id = toggle.dataset.toggle;
      if (selected.includes(id)) {
        selected = selected.filter((x) => x !== id);
      } else if (selected.length >= MAX_ITEMS) {
        AA.toast(`Un coffret contient ${MAX_ITEMS} créations au maximum.`, true);
        return;
      } else {
        selected.push(id);
      }
      renderAll();
    }
  });

  el.message.addEventListener("input", () => {
    el.count.textContent = el.message.value.length;
    el.note.textContent = el.message.value.trim() || "Votre message apparaîtra ici.";
  });

  document.getElementById("coffret-reset").addEventListener("click", () => {
    reset();
    AA.toast("Coffret réinitialisé");
  });

  document.getElementById("coffret-confirm").addEventListener("click", () => {
    if (selected.length < 2) {
      AA.toast("Choisissez au moins 2 créations pour composer un coffret.", true);
      return;
    }
    selected.forEach((id) => AA.cart.add(id, 1));
    const total = selected.reduce((sum, id) => sum + AA.getProduct(id).price, 0);
    const message = el.message.value.trim();
    document.getElementById("coffret-summary").textContent =
      `Coffret « ${occasion} » : ${selected.length} créations, total ${AA.formatMAD(total)}.` + (message ? ` Message : « ${message} »` : "");
    el.builder.classList.add("hidden");
    el.confirmation.classList.remove("hidden");
    el.confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("coffret-again").addEventListener("click", () => {
    reset();
    el.confirmation.classList.add("hidden");
    el.builder.classList.remove("hidden");
  });

  renderAll();
});
