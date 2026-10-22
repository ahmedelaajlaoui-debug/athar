/* ==========================================================
   avis.js — Reviews page (demo)
   - illustrative sample reviews (clearly labelled, text lives in reviews-i18n.js)
   - category filter + sort
   - demo review form: 1–5 star rating, validation, confirmation
   - demo reviews are saved in localStorage ("aa_reviews") on this device only. No server, no name, no email.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const KEY = "aa_reviews";
  const MAX_SAVED = 50;
  const TITLE_MIN = 3, TITLE_MAX = 80, COMMENT_MIN = 10, COMMENT_MAX = 600;
  const CATS = ["platform", "coop", "artisan", "product", "experience"];

  /* Illustrative samples: fictional, labelled as such. Subject ids point to the site's own sample data. */
  const SAMPLES = [
    { id: "s1", cat: "platform", rating: 5 },
    { id: "s2", cat: "platform", rating: 3 },
    { id: "s3", cat: "coop", rating: 4, subject: "Coopérative Al Amal" },
    { id: "s4", cat: "artisan", rating: 5, subject: "a1" },
    { id: "s5", cat: "product", rating: 4, subject: "p1" },
    { id: "s6", cat: "experience", rating: 4, subject: "e1" },
  ];

  const $ = (id) => document.getElementById(id);
  const els = {
    chips: $("rv-chips"), list: $("rv-list"), count: $("rv-count"), sort: $("rv-sort"), clear: $("rv-clear"),
    form: $("rv-form"), stars: $("rv-stars"), ratingText: $("rv-rating-text"), ratingErr: $("rv-rating-err"),
    cat: $("rv-cat"), catErr: $("rv-cat-err"), subjectRow: $("rv-subject-row"), subject: $("rv-subject"),
    title: $("rv-title"), titleErr: $("rv-title-err"), comment: $("rv-comment"), commentErr: $("rv-comment-err"),
    counter: $("rv-counter"), success: $("rv-success"), reset: $("rv-reset"),
  };

  /* ---------- storage (own helpers: we want to know when saving fails) ---------- */
  const sanitize = (r) => {
    if (!r || typeof r !== "object") return null;
    const rating = Math.round(Number(r.rating));
    if (!CATS.includes(r.cat) || !(rating >= 1 && rating <= 5)) return null;
    const title = String(r.title || "").trim().slice(0, TITLE_MAX);
    const comment = String(r.comment || "").trim().slice(0, COMMENT_MAX);
    if (!title || !comment) return null;
    return {
      id: String(r.id || "").slice(0, 40) || `u${Date.now()}`,
      cat: r.cat, rating, title, comment,
      subject: typeof r.subject === "string" ? r.subject.slice(0, 80) : "",
      ts: Number(r.ts) || 0,
    };
  };
  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(sanitize).filter(Boolean).slice(0, MAX_SAVED) : [];
    } catch (error) { return []; }
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(mine)); return true; } catch (error) { return false; }
  };

  let mine = load();
  const state = { cat: "all", sort: "recent", rating: 0 };

  /* ---------- subjects (optional "about" list, built from the site's sample data) ---------- */
  const subjectOptions = (cat) => {
    if (cat === "coop") return [...new Set(AA.artisans.map((a) => a.coop).filter(Boolean))].map((name) => ({ value: name, label: name }));
    if (cat === "artisan") return AA.artisans.map((a) => ({ value: a.id, label: a.name }));
    if (cat === "product") return AA.products.map((p) => ({ value: p.id, label: p.name }));
    if (cat === "experience") return (AA.experiences || []).map((e) => ({ value: e.id, label: e.title }));
    return [];
  };
  const subjectLabel = (cat, ref) => {
    if (!ref) return "";
    if (cat === "coop") return ref;
    if (cat === "artisan") { const a = AA.artisans.find((x) => x.id === ref); return a ? a.name : ""; }
    if (cat === "product") { const p = AA.getProduct(ref); return p ? p.name : ""; }
    if (cat === "experience") { const e = (AA.experiences || []).find((x) => x.id === ref); return e ? e.title : ""; }
    return "";
  };

  /* ---------- star graphics ---------- */
  const STAR_PATH = "M12 2.8l2.84 5.76 6.36.92-4.6 4.48 1.08 6.34L12 17.3l-5.68 3 1.08-6.34-4.6-4.48 6.36-.92z";
  const starSvg = (on) => `<svg class="star ${on ? "is-on" : ""}" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="${STAR_PATH}"/></svg>`;
  const starsReadonly = (n) => `<span class="stars" role="img" aria-label="${AA.esc(AA.t("rv.stars.aria", { n }))}">${[1, 2, 3, 4, 5].map((i) => starSvg(i <= n)).join("")}</span>`;

  /* ---------- list ---------- */
  const allReviews = () => [
    ...mine.map((r) => ({ ...r, kind: "mine" })),
    ...SAMPLES.map((s, i) => ({ ...s, kind: "sample", order: i })),
  ];

  const visibleReviews = () => {
    let list = allReviews();
    if (state.cat === "mine") list = list.filter((r) => r.kind === "mine");
    else if (state.cat !== "all") list = list.filter((r) => r.cat === state.cat);
    const recent = (a, b) => (b.ts || 0) - (a.ts || 0) || (a.order ?? 0) - (b.order ?? 0);
    if (state.sort === "high") list.sort((a, b) => b.rating - a.rating || recent(a, b));
    else if (state.sort === "low") list.sort((a, b) => a.rating - b.rating || recent(a, b));
    else list.sort(recent); // your own reviews (with a date) first, then the samples in their fixed order
    return list;
  };

  const reviewCard = (r) => {
    const sample = r.kind === "sample";
    const title = sample ? AA.t(`rv.${r.id}.t`) : r.title;
    const text = sample ? AA.t(`rv.${r.id}.x`) : r.comment;
    const about = subjectLabel(r.cat, r.subject);
    const date = !sample && r.ts ? new Date(r.ts).toLocaleDateString(AA.getLangInfo(AA.lang).locale, { year: "numeric", month: "long", day: "numeric" }) : "";
    return `
      <article class="review-card ${sample ? "" : "review-card--mine"}">
        <header class="review-card__head">
          ${starsReadonly(r.rating)}
          <span class="tag ${sample ? "" : "tag--green"}">${AA.esc(AA.t(sample ? "rv.tag.sample" : "rv.tag.mine"))}</span>
        </header>
        <h3 class="review-card__title">${AA.esc(title)}</h3>
        <p class="review-card__text">${AA.esc(text)}</p>
        <div class="review-card__meta muted">
          <span class="tag tag--terra">${AA.esc(AA.t(`rv.cat.${r.cat}`))}</span>
          ${about ? `<span>${AA.esc(AA.t("rv.about"))} <bdi>${AA.esc(about)}</bdi></span>` : ""}
        </div>
        <footer class="review-card__foot muted">
          <span>${AA.esc(AA.t(sample ? "rv.author.sample" : "rv.author.mine"))}${date ? ` · ${AA.esc(date)}` : ""}</span>
          ${sample ? "" : `<button type="button" class="btn btn--outline btn--sm" data-del="${AA.esc(r.id)}" aria-label="${AA.esc(AA.t("rv.delete.aria", { title: r.title }))}">${AA.esc(AA.t("rv.delete"))}</button>`}
        </footer>
      </article>`;
  };

  const renderList = () => {
    const list = visibleReviews();
    els.count.textContent = list.length === 0 ? AA.t("rv.count.zero") : AA.plural("rv.count", list.length);
    els.list.innerHTML = list.length
      ? list.map(reviewCard).join("")
      : AA.emptyState({ icon: "star8", title: AA.t("rv.empty.title"), text: AA.t(state.cat === "mine" ? "rv.empty.mine" : "rv.empty.text") });
    els.clear.hidden = mine.length === 0;
  };

  const renderChips = () => {
    const defs = [["all", "rv.cat.all"], ...CATS.map((c) => [c, `rv.cat.${c}`]), ["mine", "rv.cat.mine"]];
    els.chips.innerHTML = defs.map(([value, key]) =>
      `<button type="button" class="chip ${state.cat === value ? "is-active" : ""}" data-cat="${value}" aria-pressed="${state.cat === value}">${AA.esc(AA.t(key))}</button>`).join("");
  };

  /* ---------- form: rating ---------- */
  const buildStars = () => {
    els.stars.innerHTML = [1, 2, 3, 4, 5].map((n) => `
      <input type="radio" class="sr-only" name="rating" id="rv-star-${n}" value="${n}">
      <label for="rv-star-${n}" title="${AA.esc(AA.t("rv.f.star", { n }))}">${starSvg(false)}<span class="sr-only">${AA.esc(AA.t("rv.f.star", { n }))}</span></label>`).join("");
  };
  const paintStars = () => {
    els.stars.querySelectorAll("label").forEach((label, i) => label.querySelector(".star").classList.toggle("is-on", i < state.rating));
    els.ratingText.textContent = state.rating ? AA.t("rv.f.rating.val", { n: state.rating }) : AA.t("rv.f.rating.none");
  };

  /* ---------- form: category / subject ---------- */
  const buildCategorySelect = () => {
    els.cat.innerHTML = `<option value="">${AA.esc(AA.t("rv.f.cat.ph"))}</option>` +
      CATS.map((c) => `<option value="${c}">${AA.esc(AA.t(`rv.cat.${c}`))}</option>`).join("");
  };
  const buildSubjectSelect = () => {
    const opts = subjectOptions(els.cat.value);
    els.subjectRow.hidden = opts.length === 0;
    els.subject.innerHTML = `<option value="">${AA.esc(AA.t("rv.f.subject.ph"))}</option>` +
      opts.map((o) => `<option value="${AA.esc(o.value)}">${AA.esc(o.label)}</option>`).join("");
  };

  const updateCounter = () => {
    els.counter.textContent = AA.t("rv.f.counter", { n: els.comment.value.length, max: COMMENT_MAX });
  };

  /* ---------- validation ---------- */
  const setError = (input, box, message) => {
    box.textContent = message || "";
    if (input) {
      input.classList.toggle("is-invalid", Boolean(message));
      if (message) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    }
  };
  const validate = () => {
    const errors = [];
    const title = els.title.value.trim();
    const comment = els.comment.value.trim();
    const check = (ok, input, box, message) => { setError(input, box, ok ? "" : message); if (!ok) errors.push(input); };

    check(state.rating >= 1 && state.rating <= 5, null, els.ratingErr, AA.t("rv.err.rating"));
    if (state.rating < 1) errors[errors.length - 1] = els.stars.querySelector("input");
    check(CATS.includes(els.cat.value), els.cat, els.catErr, AA.t("rv.err.cat"));
    check(title.length >= TITLE_MIN, els.title, els.titleErr, AA.t(title ? "rv.err.title.min" : "rv.err.title.req"));
    check(comment.length >= COMMENT_MIN, els.comment, els.commentErr, AA.t(comment ? "rv.err.comment.min" : "rv.err.comment.req"));
    return errors.filter(Boolean);
  };
  const clearErrors = () => {
    setError(null, els.ratingErr, "");
    setError(els.cat, els.catErr, ""); setError(els.title, els.titleErr, ""); setError(els.comment, els.commentErr, "");
  };

  const hideSuccess = () => { els.success.hidden = true; els.success.innerHTML = ""; };
  const resetForm = () => {
    els.form.reset();
    state.rating = 0;
    paintStars();
    buildSubjectSelect();
    updateCounter();
    clearErrors();
  };

  /* ---------- events ---------- */
  els.chips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-cat]");
    if (!chip) return;
    state.cat = chip.dataset.cat;
    renderChips();
    renderList();
    els.chips.querySelector(`[data-cat="${state.cat}"]`).focus();
  });
  els.sort.addEventListener("change", () => { state.sort = els.sort.value; renderList(); });

  els.stars.addEventListener("change", (event) => {
    if (event.target.name !== "rating") return;
    state.rating = Number(event.target.value);
    paintStars();
    setError(null, els.ratingErr, "");
    hideSuccess();
  });
  els.cat.addEventListener("change", () => { buildSubjectSelect(); if (els.cat.value) setError(els.cat, els.catErr, ""); });
  els.title.addEventListener("input", () => { if (els.title.value.trim().length >= TITLE_MIN) setError(els.title, els.titleErr, ""); hideSuccess(); });
  els.comment.addEventListener("input", () => { updateCounter(); if (els.comment.value.trim().length >= COMMENT_MIN) setError(els.comment, els.commentErr, ""); hideSuccess(); });
  els.reset.addEventListener("click", () => { resetForm(); hideSuccess(); });

  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideSuccess();
    const errors = validate();
    if (errors.length) {
      AA.toast(AA.t("rv.err.fix"), true);
      errors[0].focus();
      return;
    }
    const review = {
      id: `u${Date.now()}${Math.floor(Math.random() * 1000)}`,
      cat: els.cat.value,
      rating: state.rating,
      title: els.title.value.trim().slice(0, TITLE_MAX),
      comment: els.comment.value.trim().slice(0, COMMENT_MAX),
      subject: els.subject.value || "",
      ts: Date.now(),
    };
    mine.unshift(review);
    mine = mine.slice(0, MAX_SAVED);
    const saved = save();
    resetForm();
    state.cat = "mine"; state.sort = "recent"; els.sort.value = "recent";
    renderChips();
    renderList();
    els.success.innerHTML = `<strong>${AA.esc(AA.t("rv.ok.title"))}</strong><p>${AA.esc(AA.t("rv.ok.text"))}</p>${saved ? "" : `<p><em>${AA.esc(AA.t("rv.ok.nosave"))}</em></p>`}`;
    els.success.hidden = false;
    els.success.focus();
    AA.toast(AA.t(saved ? "rv.ok.toast" : "rv.ok.nosave"), !saved);
  });

  els.list.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-del]");
    if (!btn) return;
    mine = mine.filter((r) => r.id !== btn.dataset.del);
    save();
    renderList();
    AA.toast(AA.t("rv.deleted"));
  });
  els.clear.addEventListener("click", () => {
    if (!window.confirm(AA.t("rv.clear.confirm"))) return;
    mine = [];
    save();
    renderList();
    AA.toast(AA.t("rv.cleared"));
  });

  /* ---------- start ---------- */
  buildStars();
  buildCategorySelect();
  buildSubjectSelect();
  paintStars();
  updateCounter();
  renderChips();
  renderList();
});
