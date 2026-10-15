/* ==========================================================
   inscription.js — account selection + three registration forms (FRONTEND DEMO ONLY)
   - no server, no real account, no secure authentication
   - passwords are checked in the page and never stored (not in localStorage, not anywhere)
   - chosen images are only previewed in the page; they are never uploaded or stored
   - only non-sensitive demo details are kept in localStorage ("aa_demo_account", and "aa_profile" name/email)
   - URL hash opens a form directly: inscription.html#coop | #client | #job
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const ROLES = ["coop", "client", "job"];
  const chooser = document.getElementById("role-chooser");
  const formsWrap = document.getElementById("role-forms");
  const done = document.getElementById("role-done");
  const forms = {};
  ROLES.forEach((r) => { forms[r] = document.getElementById(`form-${r}`); });

  const INTERESTS = ["craft", "sales", "tourism", "comm", "logistics", "training"];
  const MAX_IMAGE = 2 * 1024 * 1024;
  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  /* ---------- Shared building blocks (photo, email, password, terms) ---------- */
  const blocks = {
    photo: (p, el) => {
      const label = el.dataset.label || "ins.f.photo";
      const required = el.dataset.required === "1";
      return `
        <div class="form-row photo-field" data-photo>
          <span class="label-like" id="${p}-photo-label"><span data-i18n="${label}"></span> ${required ? "*" : `<span class="muted" data-i18n="ins.f.optional"></span>`}</span>
          <div class="photo-field__body">
            <div class="photo-field__preview" aria-hidden="true">${AA.icon("userCircle")}<img alt="" hidden></div>
            <div>
              <input class="sr-only" id="${p}-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" aria-labelledby="${p}-photo-label" aria-describedby="${p}-photo-hint">
              <label class="btn btn--outline btn--sm" for="${p}-photo">${AA.icon("upload")}<span data-photo-btn data-i18n="ins.f.photo.choose"></span></label>
              <button class="link-btn" type="button" data-photo-remove hidden data-i18n="ins.f.photo.remove"></button>
              <div class="muted form-hint" id="${p}-photo-hint" data-i18n="ins.f.photo.hint"></div>
            </div>
          </div>
          <div class="field-error"></div>
        </div>`;
    },
    email: (p) => `
      <div class="form-row">
        <label for="${p}-email"><span data-i18n="ins.f.email"></span> *</label>
        <input id="${p}-email" name="email" type="email" autocomplete="email" maxlength="120" required>
        <div class="field-error"></div>
      </div>`,
    password: (p) => `
      <div class="form-grid">
        <div class="form-row">
          <label for="${p}-password"><span data-i18n="ins.f.password"></span> *</label>
          <div class="pw-wrap">
            <input id="${p}-password" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required aria-describedby="${p}-password-hint">
            <button class="icon-btn pw-toggle" type="button" data-pw-toggle aria-pressed="false">${AA.icon("eye")}</button>
          </div>
          <div class="muted form-hint" id="${p}-password-hint" data-i18n="ins.f.password.hint"></div>
          <div class="field-error"></div>
        </div>
        <div class="form-row">
          <label for="${p}-confirm"><span data-i18n="ins.f.confirm"></span> *</label>
          <input id="${p}-confirm" name="confirm" type="password" autocomplete="new-password" maxlength="128" required>
          <div class="field-error"></div>
        </div>
      </div>`,
    terms: (p) => `
      <div class="form-row">
        <label class="check"><input id="${p}-terms" name="terms" type="checkbox" required><span data-i18n="ins.f.terms"></span></label>
        <div class="field-error"></div>
      </div>`,
  };
  document.querySelectorAll("[data-slot]").forEach((el) => {
    el.outerHTML = blocks[el.dataset.slot](el.dataset.prefix, el);
  });

  /* ---------- Fill selects / chips (re-run on language change, keeping the choice) ---------- */
  function fillSelects() {
    document.querySelectorAll("select[data-fill]").forEach((sel) => {
      const keep = sel.value;
      const kind = sel.dataset.fill;
      let opts = [];
      if (kind === "regions") {
        opts = AA.regions.map((r) => [r.id, AA.rt(r.name)]);
        if (sel.dataset.any) opts.unshift(["any", AA.t("ins.f.anyregion")]);
      } else if (kind === "categories") {
        opts = AA.categories.map((c) => [c, AA.catLabel(c)]).concat([["other", AA.t("ins.cat.other")]]);
      } else if (kind === "experience") {
        opts = [0, 1, 2, 3].map((i) => [String(i), AA.t(`ins.exp.${i}`)]);
      }
      sel.innerHTML = `<option value="">${AA.esc(AA.t("ins.f.select"))}</option>` +
        opts.map(([v, l]) => `<option value="${AA.esc(v)}">${AA.esc(l)}</option>`).join("");
      sel.value = keep;
    });
    const chips = document.querySelector(".chips[data-fill=\"interests\"]");
    if (chips) {
      const checked = [...chips.querySelectorAll("input:checked")].map((i) => i.value);
      chips.innerHTML = INTERESTS.map((k) =>
        `<label class="chip-check"><input type="checkbox" name="interests" value="${k}"${checked.includes(k) ? " checked" : ""}><span>${AA.esc(AA.t(`ins.int.${k}`))}</span></label>`).join("");
    }
  }

  /* ---------- Show / hide steps ---------- */
  function show(role) {
    done.hidden = true;
    if (!ROLES.includes(role)) {
      chooser.hidden = false;
      formsWrap.hidden = true;
      return;
    }
    chooser.hidden = true;
    formsWrap.hidden = false;
    ROLES.forEach((r) => { forms[r].hidden = r !== role; });
    const first = forms[role].querySelector("input:not([type=file]), select, textarea");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (first) first.focus({ preventScroll: true });
  }
  const go = (role) => {
    const hash = role ? `#${role}` : window.location.pathname.split("/").pop();
    history.pushState(null, "", hash);
    show(role);
  };
  chooser.querySelectorAll("[data-role]").forEach((btn) => btn.addEventListener("click", () => go(btn.dataset.role)));
  document.getElementById("role-back").addEventListener("click", () => go(""));
  window.addEventListener("popstate", () => show(location.hash.slice(1)));
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));

  /* ---------- Photo preview (never uploaded, never stored) ---------- */
  function setPhotoError(field, key) {
    const slot = field.querySelector(".field-error");
    slot.textContent = key ? AA.t(key) : "";
    field.dataset.err = key || "";
  }
  document.querySelectorAll("[data-photo]").forEach((field) => {
    const input = field.querySelector("input[type=file]");
    const img = field.querySelector("img");
    const icon = field.querySelector(".photo-field__preview .icon");
    const removeBtn = field.querySelector("[data-photo-remove]");
    const btnLabel = field.querySelector("[data-photo-btn]");
    const reset = () => {
      if (img.src && img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
      img.removeAttribute("src"); img.hidden = true; icon.hidden = false; removeBtn.hidden = true;
      input.value = "";
      btnLabel.dataset.i18n = "ins.f.photo.choose"; btnLabel.textContent = AA.t("ins.f.photo.choose");
    };
    input.addEventListener("change", () => {
      const file = input.files[0];
      setPhotoError(field, "");
      if (!file) return reset();
      if (!IMAGE_TYPES.includes(file.type)) { reset(); return setPhotoError(field, "ins.err.image.type"); }
      if (file.size > MAX_IMAGE) { reset(); return setPhotoError(field, "ins.err.image.size"); }
      if (img.src && img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
      img.src = URL.createObjectURL(file);
      img.alt = AA.t("ins.f.photo.preview");
      img.hidden = false; icon.hidden = true; removeBtn.hidden = false;
      btnLabel.dataset.i18n = "ins.f.photo.change"; btnLabel.textContent = AA.t("ins.f.photo.change");
    });
    removeBtn.addEventListener("click", () => { reset(); setPhotoError(field, ""); });
  });

  /* ---------- Password show / hide ---------- */
  function syncToggle(btn) {
    const input = btn.parentElement.querySelector("input");
    const visible = input.type === "text";
    btn.setAttribute("aria-label", AA.t(visible ? "ins.f.hide" : "ins.f.show"));
    btn.setAttribute("aria-pressed", String(visible));
    btn.innerHTML = AA.icon(visible ? "eyeOff" : "eye");
  }
  document.querySelectorAll("[data-pw-toggle]").forEach((btn) => {
    syncToggle(btn);
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      syncToggle(btn);
    });
  });

  /* ---------- Validation ---------- */
  const field = (form, name) => form.elements[name];
  const val = (form, name) => (field(form, name).value || "").trim();
  const rows = (el) => el.closest(".form-row");

  function check(form, role) {
    const errors = []; // { el, key }
    const need = (name, key = "ins.err.required") => { if (!val(form, name)) errors.push({ el: field(form, name), key }); };

    if (role === "coop") {
      if (!val(form, "name")) errors.push({ el: field(form, "name"), key: "ins.err.required" });
      else if (val(form, "name").length < 3) errors.push({ el: field(form, "name"), key: "ins.err.name.short" });
    }
    if (!val(form, "email")) errors.push({ el: field(form, "email"), key: "ins.err.required" });
    else if (!AA.isEmail(val(form, "email"))) errors.push({ el: field(form, "email"), key: "ins.err.email" });

    const pw = field(form, "password").value; // never trimmed, never stored
    if (!pw) errors.push({ el: field(form, "password"), key: "ins.err.required" });
    else if (pw.length < 8 || !/[A-Za-z\u0600-\u06FF]/.test(pw) || !/\d/.test(pw)) errors.push({ el: field(form, "password"), key: "ins.err.password" });
    const cf = field(form, "confirm").value;
    if (!cf) errors.push({ el: field(form, "confirm"), key: "ins.err.required" });
    else if (cf !== pw) errors.push({ el: field(form, "confirm"), key: "ins.err.confirm" });

    if (role === "coop") {
      const wa = val(form, "whatsapp").replace(/[\s.\-()]/g, "");
      if (!wa) errors.push({ el: field(form, "whatsapp"), key: "ins.err.required" });
      else if (!/^\+[1-9]\d{7,14}$/.test(wa) && !/^0[5-7]\d{8}$/.test(wa)) errors.push({ el: field(form, "whatsapp"), key: "ins.err.whatsapp" });
      need("city"); need("category");
      if (!val(form, "description")) errors.push({ el: field(form, "description"), key: "ins.err.required" });
      else if (val(form, "description").length < 20) errors.push({ el: field(form, "description"), key: "ins.err.desc.short" });
    }
    if (role === "job") {
      if (!val(form, "skills")) errors.push({ el: field(form, "skills"), key: "ins.err.required" });
      else if (val(form, "skills").length < 2) errors.push({ el: field(form, "skills"), key: "ins.err.skills.short" });
      need("region"); need("exp");
      if (!form.querySelector("input[name=interests]:checked")) errors.push({ el: form.querySelector("input[name=interests]"), key: "ins.err.interests", group: true });
    }
    if (!field(form, "terms").checked) errors.push({ el: field(form, "terms"), key: "ins.err.terms" });
    const photoField = form.querySelector("[data-photo]");
    if (photoField && photoField.dataset.err) errors.push({ el: photoField.querySelector("input"), key: photoField.dataset.err, photo: true });
    return errors;
  }

  function render(form, errors) {
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      if (el.type === "file" || el.name === "interests") return;
      AA.fieldError(el, "");
    });
    const chipsSlot = form.querySelector("#job-interests .field-error");
    if (chipsSlot) chipsSlot.textContent = "";
    errors.forEach((e) => {
      if (e.photo) return; // photo message is already shown by the photo field
      if (e.group) { chipsSlot.textContent = AA.t(e.key); return; }
      AA.fieldError(e.el, AA.t(e.key));
    });
    const alertBox = form.querySelector(".form-alert");
    if (errors.length) {
      alertBox.hidden = false;
      alertBox.innerHTML = `${AA.icon("alert")}<span>${AA.esc(AA.t("ins.err.summary", { n: errors.length }))}</span>`;
    } else {
      alertBox.hidden = true;
      alertBox.innerHTML = "";
    }
  }

  /* live feedback once a field was touched after a first submit */
  ROLES.forEach((role) => {
    const form = forms[role];
    form.addEventListener("input", () => { if (form.dataset.submitted) render(form, check(form, role)); });
    form.addEventListener("change", () => { if (form.dataset.submitted) render(form, check(form, role)); });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.dataset.submitted = "1";
      const errors = check(form, role);
      render(form, errors);
      if (errors.length) {
        AA.toast(AA.t("toast.ins.err"), true);
        const target = errors[0].el;
        if (target) target.focus();
        return;
      }
      finish(role, form);
    });
  });

  /* description counter */
  const desc = document.getElementById("coop-desc");
  const descCount = document.getElementById("coop-desc-count");
  const updateCount = () => { descCount.textContent = AA.t("ins.f.desc.count", { n: desc.value.length }); };
  desc.addEventListener("input", updateCount);

  /* ---------- Success (demo) ---------- */
  let lastDone = null;
  function finish(role, form) {
    const name = role === "coop" ? val(form, "name") : val(form, "email").split("@")[0];
    // Only non-sensitive demo details are kept. NEVER the password, and not the image.
    const account = { type: role, name, email: val(form, "email"), created: new Date().toISOString(), demo: true };
    if (role === "coop") Object.assign(account, { city: val(form, "city"), category: val(form, "category") });
    if (role === "job") Object.assign(account, { region: val(form, "region"), interests: [...form.querySelectorAll("input[name=interests]:checked")].map((i) => i.value) });
    AA.store.set("aa_demo_account", account);
    AA.store.set("aa_profile", { name, email: account.email });
    AA.account.clearRole(); // a new demo account shows its own role (Account Phase 3)
    if (role === "job") {
      // non-sensitive preferences, editable later on profil.html
      AA.account.write(AA.account.KEYS.job, {
        skills: val(form, "skills").split(/[,;،]/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean).map((x) => x.slice(0, 40)).slice(0, 12),
        region: account.region || "any", interests: account.interests, exp: val(form, "exp"), expDetail: val(form, "expDetail").slice(0, 600),
      });
    }
    AA.account.refresh();

    form.reset();
    delete form.dataset.submitted;
    form.querySelectorAll("[data-photo-remove]").forEach((b) => b.click());
    form.querySelectorAll("input[type=text][name=password], input[name=password], input[name=confirm]").forEach((i) => { i.type = "password"; });
    form.querySelectorAll("[data-pw-toggle]").forEach(syncToggle);
    render(form, []);
    updateCount();

    lastDone = { role, name };
    renderDone();
    AA.toast(AA.t("toast.ins.ok"));
    formsWrap.hidden = true;
    done.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    done.querySelector("h2").focus();
  }
  function renderDone() {
    if (!lastDone) return;
    done.innerHTML = `
      <div class="confirmation">
        <div class="check-big">${AA.icon("check")}</div>
        <h2 tabindex="-1">${AA.esc(AA.t("ins.ok.title"))}</h2>
        <p>${AA.esc(AA.t(`ins.ok.text.${lastDone.role}`, { name: lastDone.name }))}</p>
        <p class="notice">${AA.esc(AA.t("ins.ok.note"))}</p>
        <div class="confirmation__actions">
          ${lastDone.role === "coop" ? `<a class="btn btn--primary" href="cooperative.html">${AA.esc(AA.t("ins.ok.coop.dash"))}${AA.icon("arrowRight")}</a>` : `<a class="btn btn--primary" href="${lastDone.role === "job" ? "emploi.html" : "boutique.html"}">${AA.esc(AA.t(lastDone.role === "job" ? "acc.menu.jobs" : "acc.menu.shop"))}${AA.icon("arrowRight")}</a><a class="btn btn--outline" href="profil.html">${AA.esc(AA.t("acc.menu.profile"))}</a>`}
          <a class="btn btn--outline" href="index.html">${AA.esc(AA.t("ins.ok.home"))}</a>
          <button class="btn btn--outline" type="button" id="another">${AA.esc(AA.t("ins.ok.another"))}</button>
        </div>
      </div>`;
    document.getElementById("another").addEventListener("click", () => { lastDone = null; go(""); });
  }

  /* ---------- Language change (page runs in "soft" mode: nothing is lost) ---------- */
  function refreshLang() {
    AA.hydrateIcons();
    fillSelects();
    AA.applyStatic();
    AA.applyTitle();
    updateCount();
    document.querySelectorAll("[data-pw-toggle]").forEach(syncToggle);
    document.querySelectorAll("[data-photo]").forEach((f) => {
      const img = f.querySelector("img");
      if (!img.hidden) img.alt = AA.t("ins.f.photo.preview");
      if (f.dataset.err) f.querySelector(".field-error").textContent = AA.t(f.dataset.err);
    });
    ROLES.forEach((r) => { if (forms[r].dataset.submitted) render(forms[r], check(forms[r], r)); });
    renderDone();
  }
  document.addEventListener("aa:lang", refreshLang);

  /* ---------- Start ---------- */
  fillSelects();
  AA.hydrateIcons();
  AA.applyStatic();
  updateCount();
  show(location.hash.slice(1));
});
