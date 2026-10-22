/* checkout.js — checkout: validation, totals, envoi de la commande à la coopérative via le bot WhatsApp */
document.addEventListener("DOMContentLoaded", () => {
  // AJOUT : '' si le site est ouvert via le bot (http://localhost:3001/...).
  // Sinon mets l'URL publique du bot, ex : "https://xxxx.ngrok-free.app"
  const API_BASE = "";

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

  // AJOUT : envoi de la commande au bot (qui prévient la coopérative sur WhatsApp)
  async function sendOrderToCoop() {
    const f = form.elements;
    const modeLabel = mode() === "pooled" ? "mutualisée" : "express";
    const zip = f.zip.value.trim();

    const payload = {
      customer: {
        name: f.name.value.trim(),
        phone: f.phone.value.trim(),
        city: f.city.value,
        // email, code postal et mode de livraison sont ajoutés à l'adresse
        // pour que la coopérative les voie dans le message WhatsApp
        address: `${f.address.value.trim()}${zip ? " (" + zip + ")" : ""} | Livraison ${modeLabel} | ${f.email.value.trim()}`,
      },
      items: AA.cart.items().map((i) => ({ id: i.id, qty: i.qty })),
    };

    let res;
    try {
      res = await fetch(API_BASE + "/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      throw new Error("Serveur injoignable. Réessayez dans un instant.");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === "Stock insuffisant") {
        throw new Error(`Stock insuffisant pour « ${data.name} » (il en reste ${data.stock}).`);
      }
      if (data.error === "Produit introuvable") {
        throw new Error("Un produit de votre panier n'est pas disponible à la commande.");
      }
      throw new Error(data.error || "Erreur lors de la commande.");
    }
    return data.order;
  }

  form.addEventListener("input", (event) => {
    if (event.target.classList.contains("is-invalid")) AA.fieldError(event.target, "");
    renderSummary();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) {
      AA.toast("Merci de corriger les champs en rouge.", true);
      const firstError = form.querySelector(".is-invalid");
      if (firstError) firstError.focus();
      return;
    }

    // AJOUT : on envoie d'abord la commande, l'écran de succès vient ensuite
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    let serverOrder;
    try {
      serverOrder = await sendOrderToCoop();
    } catch (err) {
      AA.toast(err.message, true);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      return;
    }

    const subtotal = AA.cart.subtotal();
    const shipping = quote();
    const order = {
      id: serverOrder.ref, // MODIFIÉ : vraie référence (CMD-xxxxxxxx) au lieu de DEMO-xxxxxxx
      date: new Date().toLocaleDateString("fr-FR"),
      items: AA.cart.items().map((i) => ({ name: AA.getProduct(i.id).name, qty: i.qty })),
      shippingMode: mode() === "pooled" ? "mutualisée" : "express",
      city: citySelect.value,
      total: subtotal + shipping.price,
    };
    AA.store.set("aa_orders", [order, ...AA.store.get("aa_orders", [])]);
    AA.cart.clear();

    document.getElementById("order-summary").textContent =
      `Merci ${form.elements.name.value.trim()} ! Votre commande (réf. ${order.id}) a été transmise à la coopérative — total ${AA.formatMAD(order.total)}, livraison ${order.shippingMode} vers ${order.city} (${shipping.delay}, indicatif). Paiement à la livraison. La coopérative vous contactera.`;
    layout.classList.add("hidden");
    confirmation.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  renderSummary();
});