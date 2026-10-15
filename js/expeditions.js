/* expeditions.js — shipping cost simulator (illustrative formula in data.js) */
document.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("s-city");
  const weight = document.getElementById("s-weight");
  const weightLabel = document.getElementById("s-weight-label");
  const result = document.getElementById("shipping-result");

  AA.shippingCities.forEach((c) => citySelect.add(new Option(c.name, c.name)));

  function update() {
    const kg = Number(weight.value);
    const mode = document.querySelector('input[name="s-mode"]:checked').value;
    weightLabel.textContent = `${kg.toLocaleString("fr-FR")} kg`;

    const chosen = AA.shippingQuote(citySelect.value, kg, mode);
    const express = AA.shippingQuote(citySelect.value, kg, "express");
    const pooled = AA.shippingQuote(citySelect.value, kg, "pooled");
    const saving = express.price - pooled.price;
    const percent = Math.round((saving / express.price) * 100);

    result.innerHTML = `
      <p style="margin:0">Livraison ${mode === "pooled" ? "mutualisée" : "express"} vers ${AA.esc(citySelect.value)}</p>
      <strong>${AA.formatMAD(chosen.price)}</strong>
      <p style="margin:.3rem 0 0">Délai estimé : ${chosen.delay}</p>
      <p style="margin:.3rem 0 0">${mode === "pooled"
        ? `Économie par rapport à l'express : ${AA.formatMAD(saving)} (≈ ${percent} %)`
        : `En choisissant la mutualisée, vous économiseriez ${AA.formatMAD(saving)} (≈ ${percent} %).`}</p>`;
  }

  document.getElementById("shipping-form").addEventListener("input", update);
  update();
});
