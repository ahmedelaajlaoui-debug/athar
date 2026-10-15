/* checkout.js — demo checkout: validation, totals and confirmation (no payment) */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const layout = document.getElementById("checkout-layout");
  const emptyBox = document.getElementById("checkout-empty");
  const confirmation = document.getElementById("order-confirmation");
  const citySelect = document.getElementById("c-city");

  // Empty cart: nothing to order
  if (!AA.cart.items().length) {
    layout.classList.add("hidden");
    emptyBox.classList.remove("hidden");
    return;
  }

  AA.shippingCities.forEach((c) => citySelect.add(new Option(c.name, c.name)));
  citySelect.insertBefore(new Option("Choisir…", ""), citySelect.firstChild);
  citySelect.value = "";

  // Estimated weight: 0.8 kg per item (illustrative)
  const weight = () => AA.cart.count() * 0.8;
  const mode = () => form.elements.shipping.value;
  const quote = () => AA.shippingQuote(citySelect.value || AA.shippingCities[0].name, weight(), mode());

  function renderSummary() {
    document.getElementById("checkout-items").innerHTML = AA.cart
      .items()
      .map((item) => {
        const p = AA.getProduct(item.id);
        return `<div class="price-line"><span>${AA.esc(p.name)} × ${item.qty}</span><span>${AA.formatMAD(p.price * item.qty)}</span></div>`;
      })
      .join("");

    const city = citySelect.value || AA.shippingCities[0].name;
    const pooled = AA.shippingQuote(city, weight(), "pooled");
    const express = AA.shippingQuote(city, weight(), "express");
    document.getElementById("ship-pooled-info").textContent = `${AA.formatMAD(pooled.price)} · ${pooled.delay}`;
    document.getElementById("ship-express-info").textContent = `${AA.formatMAD(express.price)} · ${express.delay}`;

    const subtotal = AA.cart.subtotal();
    const shipping = quote().price;
    document.getElementById("sum-subtotal").textContent = AA.formatMAD(subtotal);
    document.getElementById("sum-shipping").textContent = AA.formatMAD(shipping);
    document.getElementById("sum-total").textContent = AA.formatMAD(subtotal + shipping);
  }

  function validate() {
    const f = form.elements;
    const checks = [
      AA.fieldError(f.name, f.name.value.trim().length >= 3 ? "" : "Entrez votre nom complet."),
      AA.fieldError(f.phone, AA.isPhone(f.phone.value) ? "" : "Numéro marocain attendu (ex. 06 12 34 56 78)."),
      AA.fieldError(f.email, AA.isEmail(f.email.value) ? "" : "Entrez un email valide."),
      AA.fieldError(f.address, f.address.value.trim().length >= 6 ? "" : "Entrez votre adresse complète."),
      AA.fieldError(f.city, f.city.value ? "" : "Choisissez une ville."),
      AA.fieldError(f.zip, !f.zip.value || /^\d{5}$/.test(f.zip.value.trim()) ? "" : "Le code postal doit avoir 5 chiffres."),
    ];
    return checks.every(Boolean);
  }

  form.addEventListener("input", (event) => {
    if (event.target.classList.contains("is-invalid")) AA.fieldError(event.target, "");
    renderSummary();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      AA.toast("Merci de corriger les champs en rouge.", true);
      const firstError = form.querySelector(".is-invalid");
      if (firstError) firstError.focus();
      return;
    }

    const subtotal = AA.cart.subtotal();
    const shipping = quote();
    const order = {
      id: "AA-" + Date.now().toString().slice(-7),
      date: new Date().toLocaleDateString("fr-FR"),
      items: AA.cart.items().map((i) => ({ name: AA.getProduct(i.id).name, qty: i.qty })),
      shippingMode: mode() === "pooled" ? "mutualisée" : "express",
      city: citySelect.value,
      total: subtotal + shipping.price,
    };
    AA.store.set("aa_orders", [order, ...AA.store.get("aa_orders", [])]);
    AA.cart.clear();

    document.getElementById("order-summary").textContent =
      `Merci ${form.elements.name.value.trim()} ! Commande ${order.id} — total ${AA.formatMAD(order.total)}, livraison ${order.shippingMode} vers ${order.city} (${shipping.delay}, indicatif).`;
    layout.classList.add("hidden");
    confirmation.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  renderSummary();
});
