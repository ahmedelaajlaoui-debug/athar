/* experiences.js — experience cards + booking REQUEST form (no real booking) */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("experience-grid");
  const chips = document.getElementById("experience-chips");
  const form = document.getElementById("booking-form");
  const confirmation = document.getElementById("booking-confirmation");
  const select = document.getElementById("b-experience");
  const dateInput = document.getElementById("b-date");
  const peopleInput = document.getElementById("b-people");
  const estimate = document.getElementById("booking-estimate");

  let type = ""; // "" = all types

  AA.experiences.forEach((e) => select.add(new Option(`${e.title} — ${e.city}`, e.id)));

  // Earliest date = tomorrow
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  dateInput.min = tomorrow;

  function renderCards() {
    chips.innerHTML = ["", "Visite", "Atelier", "Culture"]
      .map((t) => `<button type="button" class="chip ${type === t ? "is-active" : ""}" data-type="${t}">${t || "Toutes"}</button>`)
      .join("");
    grid.innerHTML = AA.experiences
      .filter((e) => !type || e.type === type)
      .map(
        (e) => `
        <article class="card">
          <div class="card__img">${AA.img(e.photo, e.title)}</div>
          <div class="card__body">
            <div class="tags"><span class="tag tag--terra">${e.type}</span><span class="tag">${e.city}</span></div>
            <h3>${e.title}</h3>
            <p class="card__meta">${e.desc}</p>
            <p class="card__meta">⏱ ${e.duration} · à partir de <strong>${AA.formatMAD(e.price)}</strong> / pers. (indicatif)</p>
            <div class="card__actions"><button class="btn btn--primary btn--sm" type="button" data-book="${e.id}">Demander une réservation</button></div>
          </div>
        </article>`
      )
      .join("");
  }

  function updateEstimate() {
    const exp = AA.experiences.find((e) => e.id === select.value);
    const people = Number(peopleInput.value) || 0;
    estimate.textContent = exp && people > 0 ? `Estimation indicative : ${AA.formatMAD(exp.price * people)} pour ${people} personne${people > 1 ? "s" : ""}.` : "";
  }

  /* Validation: returns true when every field is correct */
  function validate() {
    const f = form.elements;
    const people = Number(f.people.value);
    const checks = [
      AA.fieldError(f.name, f.name.value.trim().length < 3 ? "Entrez votre nom complet." : ""),
      AA.fieldError(f.email, AA.isEmail(f.email.value) ? "" : "Entrez un email valide."),
      AA.fieldError(f.phone, AA.isPhone(f.phone.value) ? "" : "Numéro marocain attendu (ex. 06 12 34 56 78)."),
      AA.fieldError(f.experience, f.experience.value ? "" : "Choisissez une expérience."),
      AA.fieldError(f.date, f.date.value && f.date.value >= tomorrow ? "" : "Choisissez une date à partir de demain."),
      AA.fieldError(f.people, people >= 1 && people <= 12 ? "" : "Entre 1 et 12 personnes."),
    ];
    return checks.every(Boolean);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      AA.toast("Merci de corriger les champs en rouge.", true);
      return;
    }
    const f = form.elements;
    const exp = AA.experiences.find((e) => e.id === f.experience.value);
    const request = {
      id: "R" + Date.now().toString().slice(-6),
      experience: exp.title, city: exp.city, date: f.date.value,
      people: Number(f.people.value), estimate: exp.price * Number(f.people.value),
      name: f.name.value.trim(),
    };
    AA.store.set("aa_requests", [request, ...AA.store.get("aa_requests", [])]);

    document.getElementById("booking-summary").textContent =
      `${request.name}, votre demande pour « ${request.experience} » (${request.city}) le ${request.date}, ${request.people} personne(s), a bien été notée. Référence : ${request.id}.`;
    form.classList.add("hidden");
    confirmation.classList.remove("hidden");
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("new-request").addEventListener("click", () => {
    form.reset();
    peopleInput.value = 2;
    estimate.textContent = "";
    confirmation.classList.add("hidden");
    form.classList.remove("hidden");
  });

  // Clear an error as soon as the visitor edits the field again
  form.addEventListener("input", (event) => {
    if (event.target.classList.contains("is-invalid")) AA.fieldError(event.target, "");
    updateEstimate();
  });

  document.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-type]");
    const book = event.target.closest("[data-book]");
    if (chip) { type = chip.dataset.type; renderCards(); }
    if (book) {
      select.value = book.dataset.book;
      updateEstimate();
      document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
      document.getElementById("b-name").focus({ preventScroll: true });
    }
  });

  renderCards();
});
