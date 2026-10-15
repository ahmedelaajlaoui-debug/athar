/* ==========================================================
   cooperative.js — cooperative dashboard (Account Phase 2, FRONTEND DEMO ONLY)
   - profile, products and job ads of ONE demo cooperative, kept in this browser's localStorage
   - the "current cooperative" is the Phase 1 demo account (aa_demo_account, type "coop"). No password, no real login.
   - every list only shows items whose ownerId equals the current cooperative, and every change re-checks it.
     This is a DISPLAY rule for the normal interface, NOT a security permission: anyone can edit localStorage by hand.
   - products land in aa_coop_products and are merged into AA.products by coop-data.js (so boutique.html shows them);
     job ads land in aa_coop_jobs and are listed by emploi.html
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const A = AA.coop;
  const K = A.KEYS;
  const $ = (id) => document.getElementById(id);
  const gate = $("co-gate");
  const app = $("co-app");

  let coopId = null;
  let profile = null;
  let currentTab = "profile";
  const edit = { product: null, job: null };       // null = form closed, "new" = creating, otherwise the id being edited
  const confirmDel = { product: null, job: null };  // id waiting for a delete confirmation
  const pending = { logo: undefined, product: undefined }; // undefined = unchanged, "" = removed, string = new image (data URL)
  const lastErrors = new Map();                     // form -> [{ name, key }] so messages follow a language change

  const forms = { profile: $("form-profile"), product: $("form-product"), job: $("form-job") };

  /* ---------- Small helpers ---------- */
  const now = () => new Date().toISOString();
  const val = (form, name) => (form.elements[name].value || "").trim();
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(AA.getLangInfo(AA.lang).locale); } catch (e) { return ""; } };
  const isMine = (item) => Boolean(item) && Boolean(coopId) && item.ownerId === coopId; // display rule only — see header comment
  const myProducts = () => A.rawProducts().filter(isMine).sort((a, b) => String(b.updated || b.created).localeCompare(String(a.updated || a.created)));
  const myJobs = () => A.rawJobs().filter(isMine).sort((a, b) => String(b.updated || b.created).localeCompare(String(a.updated || a.created)));
  const WA_OK = (raw) => { const w = raw.replace(/[\s.\-()]/g, ""); return /^\+[1-9]\d{7,14}$/.test(w) || /^0[5-7]\d{8}$/.test(w); };

  function profileComplete() {
    return Boolean(profile && profile.name && profile.name.length >= 3 && AA.isEmail(profile.email || "") && WA_OK(profile.whatsapp || "") &&
      A.REGION_IDS.includes(profile.region) && profile.category && (profile.description || "").length >= 20);
  }

  /* ---------- Selects (re-filled on language change, keeping the chosen value) ---------- */
  function fillSelects() {
    document.querySelectorAll("#co-app select[data-fill]").forEach((sel) => {
      const keep = sel.value;
      let opts = [];
      const kind = sel.dataset.fill;
      if (kind === "regions") opts = A.REGION_IDS.map((id) => [id, A.regionLabel(id)]);
      else if (kind === "categories") opts = AA.categories.map((c) => [c, AA.catLabel(c)]);
      else if (kind === "categories-other") opts = AA.categories.map((c) => [c, AA.catLabel(c)]).concat([["other", AA.t("ins.cat.other")]]);
      else if (kind === "jobcats") opts = A.JOB_CATS.map((k) => [k, A.jobCatLabel(k)]);
      sel.innerHTML = `<option value="">${AA.esc(AA.t("ins.f.select"))}</option>` + opts.map(([v, l]) => `<option value="${AA.esc(v)}">${AA.esc(l)}</option>`).join("");
      sel.value = keep;
    });
  }

  /* ---------- Image fields (preview only; a shrunk copy is stored when the form is saved) ---------- */
  const imgField = (kind) => document.querySelector(`[data-img="${kind}"]`);
  function setPreview(kind, src) {
    const f = imgField(kind);
    const img = f.querySelector("img");
    const icon = f.querySelector(".photo-field__preview .icon");
    const rm = f.querySelector("[data-img-remove]");
    if (src) { img.src = src; img.alt = AA.t("ins.f.photo.preview"); img.hidden = false; if (icon) icon.hidden = true; rm.hidden = false; }
    else { img.removeAttribute("src"); img.hidden = true; if (icon) icon.hidden = false; rm.hidden = true; }
    f.querySelector("input[type=file]").value = "";
    AA.fieldError(f.querySelector("input[type=file]"), "");
  }
  document.querySelectorAll("[data-img]").forEach((f) => {
    const kind = f.dataset.img;
    const input = f.querySelector("input[type=file]");
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const data = await A.resizeImage(file, kind === "logo" ? 256 : 640);
        pending[kind] = data;
        setPreview(kind, data);
      } catch (error) {
        input.value = "";
        AA.fieldError(input, AA.t(error.message || "ins.err.image.type"));
      }
    });
    f.querySelector("[data-img-remove]").addEventListener("click", () => { pending[kind] = ""; setPreview(kind, ""); });
  });

  /* ---------- Error display ---------- */
  function showErrors(form, errors) {
    lastErrors.set(form, errors);
    form.querySelectorAll("input:not([type=file]), select, textarea").forEach((el) => AA.fieldError(el, ""));
    errors.forEach((e) => AA.fieldError(form.elements[e.name], AA.t(e.key)));
    const box = form.querySelector(".form-alert");
    if (errors.length) { box.hidden = false; box.innerHTML = `${AA.icon("alert")}<span>${AA.esc(AA.t("ins.err.summary", { n: errors.length }))}</span>`; }
    else { box.hidden = true; box.innerHTML = ""; }
  }
  const failSave = () => AA.toast(AA.t("co.err.save"), true);

  /* ---------- Gate (no cooperative account) ---------- */
  function renderGate() {
    gate.innerHTML = `
      <div class="empty-state">
        <span class="icon-lg">${AA.icon("store")}</span>
        <h3>${AA.esc(AA.t("co.gate.t"))}</h3>
        <p>${AA.esc(AA.t("co.gate.x"))}</p>
        <div class="confirmation__actions">
          <a class="btn btn--primary" href="inscription.html#coop">${AA.esc(AA.t("co.gate.create"))}${AA.icon("arrowRight")}</a>
          <button class="btn btn--outline" type="button" id="co-start">${AA.esc(AA.t("co.gate.start"))}</button>
        </div>
      </div>`;
    $("co-start").addEventListener("click", startDemoCoop);
  }
  function startDemoCoop() {
    const created = now();
    const account = { type: "coop", name: AA.t("co.demo.name"), email: "", created, demo: true, coopId: A.uid("c") };
    AA.store.set(K.account, account);
    AA.account.clearRole(); // show the cooperative role in the menus (Account Phase 3)
    AA.account.refresh();
    init();
  }

  /* ---------- Load / create the profile of the current cooperative ---------- */
  function load() {
    const acc = A.account();
    if (!acc) return false;
    if (!acc.coopId) { // first visit after a Phase 1 registration: keep a stable id even if the name or email change later
      acc.coopId = A.currentId();
      AA.store.set(K.account, acc);
    }
    coopId = acc.coopId;
    const all = A.coops();
    profile = all[coopId];
    if (!profile) {
      profile = { id: coopId, name: acc.name || "", email: acc.email || "", whatsapp: "", region: A.REGION_IDS.includes(acc.city) ? acc.city : "", category: acc.category || "", description: "", logo: "", demo: true, updated: now() };
      all[coopId] = profile;
      A.write(K.coops, all);
    }
    return true;
  }

  /* ---------- Header card ---------- */
  function renderHead() {
    $("co-name").textContent = profile.name || AA.t("co.demo.name");
    const bits = [];
    if (profile.region) bits.push(A.regionLabel(profile.region));
    if (profile.category) bits.push(profile.category === "other" ? AA.t("ins.cat.other") : AA.catLabel(profile.category));
    $("co-meta").textContent = bits.join(" · ");
    $("co-logo").innerHTML = profile.logo ? `<img src="${AA.esc(profile.logo)}" alt="">` : AA.icon("store");
    $("stat-products").textContent = myProducts().length;
    $("stat-jobs").textContent = myJobs().length;
    const inc = $("co-incomplete");
    if (profileComplete()) { inc.hidden = true; inc.innerHTML = ""; }
    else { inc.hidden = false; inc.innerHTML = `${AA.icon("alert")}<span>${AA.esc(AA.t("co.incomplete"))}</span>`; }
    $("pr-shop-link").href = `boutique.html?q=${encodeURIComponent(profile.name || "")}`;
  }

  /* ---------- Tabs ---------- */
  function setTab(name, focus = false) {
    if (!["profile", "products", "jobs"].includes(name)) name = "profile";
    currentTab = name;
    document.querySelectorAll("[data-tab]").forEach((b) => {
      const on = b.dataset.tab === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $(`panel-${b.dataset.tab}`).hidden = !on;
      if (on && focus) b.focus();
    });
    try { history.replaceState(null, "", `#${name}`); } catch (e) { /* file:// or blocked */ }
  }
  $("co-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });
  $("co-tabs").addEventListener("keydown", (e) => {
    const order = ["profile", "products", "jobs"];
    const dir = (e.key === "ArrowRight") ? 1 : (e.key === "ArrowLeft") ? -1 : 0;
    if (!dir) return;
    const flip = document.documentElement.dir === "rtl" ? -1 : 1;
    setTab(order[(order.indexOf(currentTab) + dir * flip + order.length) % order.length], true);
    e.preventDefault();
  });

  /* ---------- PROFILE ---------- */
  function fillProfileForm() {
    const f = forms.profile;
    f.elements.name.value = profile.name || "";
    f.elements.email.value = profile.email || "";
    f.elements.whatsapp.value = profile.whatsapp || "";
    f.elements.region.value = profile.region || "";
    f.elements.category.value = profile.category || "";
    f.elements.description.value = profile.description || "";
    pending.logo = undefined;
    setPreview("logo", profile.logo || "");
    updateCount();
  }
  const updateCount = () => { $("cp-desc-count").textContent = AA.t("ins.f.desc.count", { n: forms.profile.elements.description.value.length }); };
  forms.profile.elements.description.addEventListener("input", updateCount);

  function checkProfile(f) {
    const errors = [];
    const e = (name, key) => errors.push({ name, key });
    if (!val(f, "name")) e("name", "ins.err.required"); else if (val(f, "name").length < 3) e("name", "ins.err.name.short");
    if (!val(f, "email")) e("email", "ins.err.required"); else if (!AA.isEmail(val(f, "email"))) e("email", "ins.err.email");
    if (!val(f, "whatsapp")) e("whatsapp", "ins.err.required"); else if (!WA_OK(val(f, "whatsapp"))) e("whatsapp", "ins.err.whatsapp");
    if (!val(f, "region")) e("region", "ins.err.required");
    if (!val(f, "category")) e("category", "ins.err.required");
    if (!val(f, "description")) e("description", "ins.err.required"); else if (val(f, "description").length < 20) e("description", "ins.err.desc.short");
    return errors;
  }

  forms.profile.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = forms.profile;
    f.dataset.submitted = "1";
    const errors = checkProfile(f);
    showErrors(f, errors);
    if (errors.length) { AA.toast(AA.t("co.err.fix"), true); f.elements[errors[0].name].focus(); return; }
    const all = A.coops();
    if (!all[coopId]) { AA.toast(AA.t("co.err.notfound"), true); return; }
    const updated = {
      ...all[coopId], id: coopId, name: val(f, "name"), email: val(f, "email"), whatsapp: val(f, "whatsapp"),
      region: val(f, "region"), category: val(f, "category"), description: val(f, "description"),
      logo: pending.logo === undefined ? (all[coopId].logo || "") : pending.logo, demo: true, updated: now(),
    };
    all[coopId] = updated;
    if (!A.write(K.coops, all)) return failSave();
    profile = updated;
    // keep the Phase 1 demo account in step (non-sensitive details only — never a password, never an image)
    const acc = A.account();
    if (acc) AA.store.set(K.account, { ...acc, name: updated.name, email: updated.email, city: updated.region, category: updated.category });
    AA.store.set("aa_profile", { ...AA.store.get("aa_profile", {}), name: updated.name, email: updated.email });
    A.mergeProducts();
    pending.logo = undefined;
    renderAll(false);
    AA.toast(AA.t("co.p.saved"));
  });
  forms.profile.addEventListener("input", () => { if (forms.profile.dataset.submitted) showErrors(forms.profile, checkProfile(forms.profile)); });

  /* ---------- Row list shared by products and jobs ---------- */
  function actionsHtml(type, item, name) {
    if (confirmDel[type] === item.id) {
      return `<div class="co-confirm" role="alert"><span>${AA.esc(AA.t("co.confirm.q", { name }))}</span>
        <button class="btn btn--accent btn--sm" type="button" data-do-delete="${type}" data-id="${item.id}">${AA.icon("trash")}${AA.esc(AA.t("co.confirm.yes"))}</button>
        <button class="btn btn--outline btn--sm" type="button" data-cancel-delete="${type}">${AA.esc(AA.t("co.cancel"))}</button></div>`;
    }
    return `<button class="btn btn--outline btn--sm" type="button" data-edit="${type}" data-id="${item.id}" aria-label="${AA.esc(AA.t("co.edit"))} — ${AA.esc(name)}">${AA.icon("edit")}${AA.esc(AA.t("co.edit"))}</button>
      <button class="btn btn--outline btn--sm co-danger" type="button" data-delete="${type}" data-id="${item.id}" aria-label="${AA.esc(AA.t("co.delete"))} — ${AA.esc(name)}">${AA.icon("trash")}${AA.esc(AA.t("co.delete"))}</button>`;
  }
  const empty = (icon, t, x) => AA.emptyState({ icon, title: AA.esc(AA.t(t)), text: AA.esc(AA.t(x)) });

  function renderProducts() {
    const list = myProducts();
    $("pr-list").innerHTML = list.length ? list.map((p) => {
      const shown = AA.getProduct(p.id) || { image: "", cat: p.cat };
      return `<article class="co-row">
        <a class="co-row__img" href="produit.html?id=${encodeURIComponent(p.id)}" tabindex="-1" aria-hidden="true">${AA.img(shown.image, p.name, p.cat)}</a>
        <div class="co-row__main">
          <h4><a href="produit.html?id=${encodeURIComponent(p.id)}">${AA.esc(p.name)}</a></h4>
          <p class="card__meta">${AA.esc(AA.catLabel(p.cat))} · ${AA.formatMAD(p.price)} · ${AA.esc(AA.t("co.pr.stock"))} : ${AA.esc(String(p.stock ?? 5))}</p>
          <p class="co-row__desc">${AA.esc(p.desc)}</p>
          <p class="muted form-hint">${AA.esc(AA.t("co.updated", { date: fmtDate(p.updated || p.created) }))}</p>
        </div>
        <div class="co-row__actions">${actionsHtml("product", p, p.name)}</div>
      </article>`;
    }).join("") : empty("vase", "co.pr.empty.t", "co.pr.empty.x");
  }

  function renderJobs() {
    const list = myJobs();
    $("jb-list").innerHTML = list.length ? list.map((j) => `
      <article class="co-row co-row--job">
        <div class="co-row__main">
          <h4>${AA.esc(j.title)}</h4>
          <p class="card__meta">${AA.esc(A.jobCatLabel(j.cat))} · ${AA.esc(A.regionLabel(j.region))}</p>
          <p class="co-row__desc">${AA.esc(j.desc)}</p>
          <p class="muted form-hint">${AA.esc(AA.t("co.updated", { date: fmtDate(j.updated || j.created) }))}</p>
        </div>
        <div class="co-row__actions">${actionsHtml("job", j, j.title)}</div>
      </article>`).join("") : empty("briefcase", "co.j.empty.t", "co.j.empty.x");
  }

  /* ---------- PRODUCT form ---------- */
  function guardProfile(tab) {
    if (profileComplete()) return true;
    AA.toast(AA.t("co.needprofile"), true);
    setTab("profile", true);
    return false;
  }
  function setFormTitle() {
    $("pr-form-title").textContent = AA.t(edit.product === "new" ? "co.pr.new.t" : "co.pr.edit.t");
    $("jb-form-title").textContent = AA.t(edit.job === "new" ? "co.j.new.t" : "co.j.edit.t");
  }
  function openProductForm(id) {
    if (!guardProfile()) return;
    const f = forms.product;
    f.reset(); delete f.dataset.submitted; showErrors(f, []);
    pending.product = undefined;
    if (id === "new") {
      edit.product = "new"; f.elements.stock.value = ""; setPreview("product", "");
    } else {
      const p = myProducts().find((x) => x.id === id);
      if (!p) { AA.toast(AA.t("co.err.notfound"), true); return; }
      edit.product = id;
      f.elements.name.value = p.name; f.elements.desc.value = p.desc; f.elements.cat.value = p.cat;
      f.elements.price.value = p.price; f.elements.stock.value = p.stock ?? "";
      setPreview("product", p.image || "");
    }
    setFormTitle();
    f.hidden = false;
    f.elements.name.focus();
    f.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function closeForm(type) {
    edit[type] = null;
    forms[type].hidden = true;
  }

  function checkProduct(f) {
    const errors = [];
    const e = (name, key) => errors.push({ name, key });
    const name = val(f, "name"), desc = val(f, "desc"), price = val(f, "price"), stock = val(f, "stock");
    if (!name) e("name", "ins.err.required"); else if (name.length < 3 || name.length > 80) e("name", "co.pr.err.name");
    if (!desc) e("desc", "ins.err.required"); else if (desc.length < 10 || desc.length > 500) e("desc", "co.pr.err.desc");
    if (!AA.categories.includes(val(f, "cat"))) e("cat", "ins.err.required");
    if (!price) e("price", "ins.err.required");
    else { const n = Number(price.replace(",", ".")); if (!Number.isFinite(n) || n <= 0 || n > 100000) e("price", "co.pr.err.price"); }
    if (stock !== "" && !/^\d{1,3}$/.test(stock)) e("stock", "co.pr.err.stock");
    return errors;
  }

  forms.product.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = forms.product;
    if (!guardProfile()) return;
    f.dataset.submitted = "1";
    const errors = checkProduct(f);
    showErrors(f, errors);
    if (errors.length) { AA.toast(AA.t("co.err.fix"), true); f.elements[errors[0].name].focus(); return; }
    const all = A.rawProducts();
    const creating = edit.product === "new";
    const idx = creating ? -1 : all.findIndex((p) => p.id === edit.product && isMine(p));
    if (!creating && idx < 0) { AA.toast(AA.t("co.err.notfound"), true); closeForm("product"); renderAll(false); return; }
    const old = creating ? null : all[idx];
    const record = {
      id: creating ? A.uid("cp") : old.id, ownerId: coopId, name: val(f, "name"), desc: val(f, "desc"), cat: val(f, "cat"),
      price: Math.round(Number(val(f, "price").replace(",", ".")) * 100) / 100,
      stock: val(f, "stock") === "" ? 5 : Number(val(f, "stock")),
      image: pending.product === undefined ? (old ? old.image || "" : "") : pending.product,
      created: creating ? now() : old.created, updated: now(),
    };
    if (creating) all.push(record); else all[idx] = record;
    if (!A.write(K.products, all)) return failSave();
    A.mergeProducts();
    closeForm("product");
    renderAll(false);
    AA.toast(AA.t(creating ? "co.pr.created" : "co.pr.updated"));
  });
  forms.product.addEventListener("input", () => { if (forms.product.dataset.submitted) showErrors(forms.product, checkProduct(forms.product)); });

  function deleteProduct(id) {
    const all = A.rawProducts();
    const target = all.find((p) => p.id === id);
    if (!isMine(target)) { AA.toast(AA.t("co.err.notfound"), true); return; }
    if (!A.write(K.products, all.filter((p) => p.id !== id))) return failSave();
    purgeLocal([id]);
    A.mergeProducts();
    AA.updateBadges();
    confirmDel.product = null;
    if (edit.product === id) closeForm("product");
    renderAll(false);
    AA.toast(AA.t("co.pr.deleted"));
  }
  /* a deleted product must also leave this browser's favorites and cart (the shop only knows existing products) */
  function purgeLocal(ids) {
    const favs = AA.favs.all();
    favs.product = favs.product.filter((x) => !ids.includes(x));
    AA.store.set(AA.favs.KEY, favs);
    AA.store.set(AA.cart.KEY, AA.store.get(AA.cart.KEY, []).filter((i) => !ids.includes(i.id)));
    AA.updateBadges();
  }

  /* ---------- JOB form ---------- */
  function openJobForm(id) {
    if (!guardProfile()) return;
    const f = forms.job;
    f.reset(); delete f.dataset.submitted; showErrors(f, []);
    if (id === "new") {
      edit.job = "new"; f.elements.region.value = profile.region || "";
    } else {
      const j = myJobs().find((x) => x.id === id);
      if (!j) { AA.toast(AA.t("co.err.notfound"), true); return; }
      edit.job = id;
      f.elements.title.value = j.title; f.elements.desc.value = j.desc; f.elements.cat.value = j.cat;
      f.elements.region.value = j.region; f.elements.showContact.checked = Boolean(j.showContact);
    }
    setFormTitle();
    f.hidden = false;
    f.elements.title.focus();
    f.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function checkJob(f) {
    const errors = [];
    const e = (name, key) => errors.push({ name, key });
    const title = val(f, "title"), desc = val(f, "desc");
    if (!title) e("title", "ins.err.required"); else if (title.length < 3 || title.length > 100) e("title", "co.j.err.title");
    if (!desc) e("desc", "ins.err.required"); else if (desc.length < 20 || desc.length > 800) e("desc", "co.j.err.desc");
    if (!A.JOB_CATS.includes(val(f, "cat"))) e("cat", "ins.err.required");
    if (!A.REGION_IDS.includes(val(f, "region"))) e("region", "ins.err.required");
    if (f.elements.showContact.checked && !(profile.email && profile.whatsapp)) e("showContact", "co.j.err.nocontact");
    return errors;
  }
  forms.job.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = forms.job;
    if (!guardProfile()) return;
    f.dataset.submitted = "1";
    const errors = checkJob(f);
    showErrors(f, errors);
    if (errors.length) { AA.toast(AA.t("co.err.fix"), true); f.elements[errors[0].name].focus(); return; }
    const all = A.rawJobs();
    const creating = edit.job === "new";
    const idx = creating ? -1 : all.findIndex((j) => j.id === edit.job && isMine(j));
    if (!creating && idx < 0) { AA.toast(AA.t("co.err.notfound"), true); closeForm("job"); renderAll(false); return; }
    const old = creating ? null : all[idx];
    const record = {
      id: creating ? A.uid("cj") : old.id, ownerId: coopId, title: val(f, "title"), desc: val(f, "desc"), cat: val(f, "cat"),
      region: val(f, "region"), showContact: f.elements.showContact.checked, created: creating ? now() : old.created, updated: now(),
    };
    if (creating) all.push(record); else all[idx] = record;
    if (!A.write(K.jobs, all)) return failSave();
    closeForm("job");
    renderAll(false);
    AA.toast(AA.t(creating ? "co.j.created" : "co.j.updated"));
  });
  forms.job.addEventListener("input", () => { if (forms.job.dataset.submitted) showErrors(forms.job, checkJob(forms.job)); });
  forms.job.addEventListener("change", () => { if (forms.job.dataset.submitted) showErrors(forms.job, checkJob(forms.job)); });

  function deleteJob(id) {
    const all = A.rawJobs();
    if (!isMine(all.find((j) => j.id === id))) { AA.toast(AA.t("co.err.notfound"), true); return; }
    if (!A.write(K.jobs, all.filter((j) => j.id !== id))) return failSave();
    confirmDel.job = null;
    if (edit.job === id) closeForm("job");
    renderAll(false);
    AA.toast(AA.t("co.j.deleted"));
  }

  /* ---------- Clicks (edit / delete / cancel) ---------- */
  $("pr-add").addEventListener("click", () => openProductForm("new"));
  $("jb-add").addEventListener("click", () => openJobForm("new"));
  document.querySelectorAll("[data-cancel]").forEach((b) => b.addEventListener("click", () => closeForm(b.dataset.cancel)));
  app.addEventListener("click", (event) => {
    const t = event.target.closest("button");
    if (!t) return;
    if (t.dataset.edit) { (t.dataset.edit === "product" ? openProductForm : openJobForm)(t.dataset.id); return; }
    if (t.dataset.delete) { confirmDel[t.dataset.delete] = t.dataset.id; renderAll(false); const c = app.querySelector(`[data-do-delete="${t.dataset.delete}"]`); if (c) c.focus(); return; }
    if (t.dataset.cancelDelete) { confirmDel[t.dataset.cancelDelete] = null; renderAll(false); return; }
    if (t.dataset.doDelete) { (t.dataset.doDelete === "product" ? deleteProduct : deleteJob)(t.dataset.id); }
  });

  /* ---------- Delete everything for this demo cooperative ---------- */
  $("co-reset").addEventListener("click", () => {
    if (!window.confirm(AA.t("co.reset.confirm"))) return;
    const mine = A.rawProducts().filter(isMine).map((p) => p.id);
    const coops = A.coops(); delete coops[coopId];
    const ok = A.write(K.coops, coops) && A.write(K.products, A.rawProducts().filter((p) => !isMine(p))) && A.write(K.jobs, A.rawJobs().filter((j) => !isMine(j)));
    if (!ok) return failSave();
    purgeLocal(mine);
    try { localStorage.removeItem(K.account); } catch (e) { /* ignore */ }
    A.mergeProducts();
    AA.toast(AA.t("co.reset.done"));
    init();
  });

  /* ---------- Render everything ---------- */
  function renderAll(refillProfile = true) {
    renderHead();
    renderProducts();
    renderJobs();
    if (refillProfile) fillProfileForm();
    setFormTitle();
    AA.hydrateIcons();
  }

  /* ---------- Start (and restart after demo account creation / reset) ---------- */
  function init() {
    Object.keys(edit).forEach((k) => { edit[k] = null; confirmDel[k] = null; });
    Object.keys(forms).forEach((k) => { if (k !== "profile") forms[k].hidden = true; });
    if (!load()) { app.hidden = true; gate.hidden = false; renderGate(); AA.hydrateIcons(); return; }
    gate.hidden = true; app.hidden = false;
    fillSelects();
    renderAll(true);
    setTab((location.hash || "").slice(1) || (profileComplete() ? "products" : "profile"));
  }

  /* Language change (page runs in "soft" mode: forms in progress are kept) */
  document.addEventListener("aa:lang", () => {
    AA.hydrateIcons();
    AA.applyStatic();
    AA.applyTitle();
    if (!coopId || app.hidden) { renderGate(); AA.hydrateIcons(); return; }
    fillSelects();
    renderHead(); renderProducts(); renderJobs(); setFormTitle(); updateCount();
    lastErrors.forEach((errs, form) => { if (errs.length) showErrors(form, errs); });
    Object.values(forms).forEach((f) => { const img = f.querySelector(".photo-field__preview img"); if (img && !img.hidden) img.alt = AA.t("ins.f.photo.preview"); });
    AA.hydrateIcons();
  });

  /* menu links such as cooperative.html#jobs work even when the dashboard is already open */
  window.addEventListener("hashchange", () => { if (!app.hidden) setTab((location.hash || "").slice(1)); });

  AA.hydrateIcons();
  AA.applyStatic();
  init();
});
