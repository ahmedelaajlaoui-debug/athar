/* ==========================================================
   profil.js — "Mon espace": one page, four demo roles (Account Phase 3, FRONTEND DEMO ONLY)
   - customer     : profile, favorites, cart (quantities / remove), discover (boutique, cooperatives)
   - job seeker   : profile, skills + preferences + experience, matching job offers
   - cooperative  : card pointing to the cooperative dashboard (cooperative.html, unchanged)
   - visitor      : public browsing + optional registration
   Reuses AA.favs, AA.cart, AA.store and the shared card templates. Only non-sensitive demo data is stored
   (aa_profile, aa_client_profile, aa_job_profile). No password. The role only changes what the interface shows:
   it is NOT access control (see README).
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const content = $("tab-content");
  const tabsEl = $("profile-tabs");
  const extra = $("role-extra");
  const ACC = AA.account;
  const A = AA.coop;
  const esc = AA.esc;

  const TABS = { client: ["info", "favs", "cart", "discover"], job: ["info", "prefs", "match"], coop: [], visitor: [] };
  let role = ACC.role();
  let tab = (location.hash || "").slice(1);
  let skillsDraft = [];
  let skillMsg = "";

  const regionOptions = (selected) =>
    `<option value="any"${selected === "any" || !selected ? " selected" : ""}>${esc(AA.t("ins.f.anyregion"))}</option>` +
    AA.regions.map((r) => `<option value="${r.id}"${selected === r.id ? " selected" : ""}>${esc(AA.rt(r.name))}</option>`).join("");

  const field = (id, label, inner, extraHtml = "") =>
    `<div class="form-row"><label for="${id}">${esc(label)}</label>${inner}${extraHtml}<div class="field-error"></div></div>`;

  /* ---------- header of the page ---------- */
  function renderHead() {
    const profile = AA.store.get("aa_profile", { name: "", email: "" });
    const name = profile.name || AA.t("ac.default.name");
    $("profile-name").textContent = name;
    $("profile-email").textContent = profile.email || AA.t("ac.default.email");
    $("avatar").textContent = name.trim().charAt(0).toUpperCase() || "V";
    $("profile-role").textContent = AA.t("acc.role.demo", { role: ACC.roleLabel(role) });
    document.querySelector(".profile-head").hidden = role === "visitor";
  }

  /* ---------- customer views ---------- */
  const clientInfo = () => {
    const profile = AA.store.get("aa_profile", { name: "", email: "" });
    const cp = ACC.clientProfile();
    const chips = AA.categories.map((c) =>
      `<label class="chip-check"><input type="checkbox" name="cats" value="${esc(c)}"${cp.cats.includes(c) ? " checked" : ""}><span>${esc(AA.catLabel(c))}</span></label>`).join("");
    return `
      <form class="form-card" id="profile-form" data-kind="client" novalidate style="max-width:620px">
        <p class="muted">${esc(AA.t("ac.client.note"))}</p>
        ${field("p-name", AA.t("ac.f.name"), `<input id="p-name" type="text" maxlength="80" autocomplete="name" value="${esc(profile.name)}">`)}
        ${field("p-email", AA.t("ins.f.email"), `<input id="p-email" type="email" maxlength="120" autocomplete="email" value="${esc(profile.email)}">`)}
        ${field("p-city", AA.t("ac.f.city"), `<input id="p-city" type="text" maxlength="60" value="${esc(cp.city)}">`)}
        <fieldset class="chips-field"><legend>${esc(AA.t("ac.f.cats"))}</legend><div class="chips">${chips}</div></fieldset>
        <button class="btn btn--primary mt-1" type="submit">${esc(AA.t("ac.save"))}</button>
      </form>`;
  };

  const favsView = () => {
    const f = AA.favs.all();
    const products = f.product.map(AA.getProduct).filter(Boolean);
    const artisans = f.artisan.map(AA.getArtisan).filter(Boolean);
    return `
      <h3>${esc(AA.t("ac.fav.products"))}</h3>
      ${products.length ? `<div class="grid grid--3">${products.map(AA.productCard).join("")}</div>`
        : AA.emptyState({ icon: "heart", text: esc(AA.t("empty.fav.products")), href: "boutique.html", label: esc(AA.t("cta.shop.explore")) })}
      <h3 class="mt-2">${esc(AA.t("ac.fav.artisans"))}</h3>
      ${artisans.length ? `<div class="grid grid--3">${artisans.map(AA.artisanCard).join("")}</div>`
        : AA.emptyState({ icon: "thread", text: esc(AA.t("empty.fav.artisans")), href: "artisans.html", label: esc(AA.t("cta.artisans.discover")) })}
      <p class="mt-2"><a class="btn btn--outline" href="favoris.html">${esc(AA.t("ac.fav.manage"))}${AA.icon("arrowRight")}</a></p>`;
  };

  const cartView = () => {
    const items = AA.cart.items();
    if (!items.length) return AA.emptyState({ icon: "cart", title: esc(AA.t("empty.cart.title")), text: esc(AA.t("empty.cart.text")), href: "boutique.html", label: esc(AA.t("cta.continue")) });
    const rows = items.map((item) => {
      const p = AA.getProduct(item.id);
      return `
        <article class="cart-item">
          <a href="produit.html?id=${esc(p.id)}">${AA.img(p.image, p.name, p.cat)}</a>
          <div>
            <h3><a href="produit.html?id=${esc(p.id)}">${esc(p.name)}</a></h3>
            <p class="card__meta">${esc(AA.getArtisan(p.artisan).name)} · ${esc(AA.cityLabel(p.city))}</p>
            <p class="card__meta">${esc(AA.t("ac.cart.each", { price: AA.formatMAD(p.price) }))}</p>
          </div>
          <div class="cart-item__right">
            <strong>${AA.formatMAD(p.price * item.qty)}</strong>
            <div class="qty" role="group" aria-label="${esc(AA.t("ac.cart.qty"))}">
              <button type="button" data-minus="${esc(p.id)}" aria-label="${esc(AA.t("ac.cart.minus", { name: p.name }))}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-plus="${esc(p.id)}" aria-label="${esc(AA.t("ac.cart.plus", { name: p.name }))}">+</button>
            </div>
            <button class="link-btn" type="button" data-remove="${esc(p.id)}">${esc(AA.t("ac.cart.remove"))}</button>
          </div>
        </article>`;
    }).join("");
    return `
      ${rows}
      <div class="list-row"><strong>${esc(AA.t("ac.cart.sub", { n: AA.plural("ac.cart.items", AA.cart.count()) }))}</strong><strong>${AA.formatMAD(AA.cart.subtotal())}</strong></div>
      <p class="muted">${esc(AA.t("ac.cart.demo"))}</p>
      <div class="hero__actions" style="margin-top:.5rem">
        <a class="btn btn--primary" href="panier.html">${AA.icon("cart")}${esc(AA.t("ac.cart.full"))}</a>
        <a class="btn btn--outline" href="boutique.html">${esc(AA.t("cta.continue"))}</a>
      </div>`;
  };

  const discoverView = () => `
    <div class="grid grid--2">
      <div class="form-card"><h3>${AA.icon("bag")} ${esc(AA.t("ac.d.shop.t"))}</h3><p class="muted">${esc(AA.t("ac.d.shop.x"))}</p>
        <a class="btn btn--primary" href="boutique.html">${esc(AA.t("ac.d.shop.btn"))}${AA.icon("arrowRight")}</a></div>
      <div class="form-card"><h3>${AA.icon("users")} ${esc(AA.t("ac.d.coops.t"))}</h3><p class="muted">${esc(AA.t("ac.d.coops.x"))}</p>
        <a class="btn btn--primary" href="artisans.html">${esc(AA.t("ac.d.coops.btn"))}${AA.icon("arrowRight")}</a></div>
    </div>
    <h3 class="mt-2">${esc(AA.t("ac.d.cats"))}</h3>
    <div class="chip-row">${AA.categories.map((c) => `<a class="chip" href="boutique.html?cat=${encodeURIComponent(c)}">${esc(AA.catLabel(c))}</a>`).join("")}</div>`;

  /* ---------- job seeker views ---------- */
  const jobInfo = () => {
    const profile = AA.store.get("aa_profile", { name: "", email: "" });
    return `
      <form class="form-card" id="profile-form" data-kind="job" novalidate style="max-width:620px">
        ${field("p-name", AA.t("ac.f.name"), `<input id="p-name" type="text" maxlength="80" autocomplete="name" value="${esc(profile.name)}">`)}
        ${field("p-email", AA.t("ins.f.email"), `<input id="p-email" type="email" maxlength="120" autocomplete="email" value="${esc(profile.email)}">`)}
        <button class="btn btn--primary" type="submit">${esc(AA.t("ac.save"))}</button>
      </form>`;
  };

  const skillChips = () => skillsDraft.length
    ? skillsDraft.map((s, i) => `<span class="skill-chip">${esc(s)}<button type="button" data-skill-remove="${i}" aria-label="${esc(AA.t("ac.j.skills.remove", { s }))}">${AA.icon("close")}</button></span>`).join("")
    : `<span class="muted">${esc(AA.t("ac.j.skills.none"))}</span>`;

  const prefsView = () => {
    const jp = ACC.jobProfile();
    skillsDraft = jp.skills.slice();
    const chips = A.JOB_CATS.map((k) =>
      `<label class="chip-check"><input type="checkbox" name="interests" value="${k}"${jp.interests.includes(k) ? " checked" : ""}><span>${esc(AA.t(`ins.int.${k}`))}</span></label>`).join("");
    const exp = `<option value="">${esc(AA.t("ins.f.select"))}</option>` +
      [0, 1, 2, 3].map((i) => `<option value="${i}"${jp.exp === String(i) ? " selected" : ""}>${esc(AA.t(`ins.exp.${i}`))}</option>`).join("");
    return `
      <form class="form-card" id="prefs-form" novalidate style="max-width:700px">
        <p class="muted">${esc(AA.t("ac.j.note"))}</p>
        <div class="form-row">
          <label for="skill-input">${esc(AA.t("ac.j.skills.label"))}</label>
          <div class="skill-add"><input id="skill-input" type="text" maxlength="40" placeholder="${esc(AA.t("ac.j.skills.ph"))}" aria-describedby="skill-msg"><button class="btn btn--outline" type="button" id="skill-add">${AA.icon("plus")}${esc(AA.t("ac.j.skills.add"))}</button></div>
          <div class="field-error" id="skill-msg" role="status"></div>
          <div class="skill-list" id="skill-list" aria-label="${esc(AA.t("ac.j.skills"))}">${skillChips()}</div>
        </div>
        ${field("p-region", AA.t("ac.j.region"), `<select id="p-region">${regionOptions(jp.region)}</select>`)}
        <fieldset class="chips-field"><legend>${esc(AA.t("ac.j.interests"))}</legend><div class="chips">${chips}</div></fieldset>
        <div class="form-row mt-1"><label for="p-exp">${esc(AA.t("ac.j.exp"))}</label><select id="p-exp">${exp}</select></div>
        <div class="form-row"><label for="p-exp-detail">${esc(AA.t("ac.j.expdetail"))}</label>
          <textarea id="p-exp-detail" maxlength="600" rows="4" placeholder="${esc(AA.t("ac.j.expdetail.ph"))}">${esc(jp.expDetail)}</textarea>
          <div class="muted form-hint" id="p-exp-count"></div></div>
        <button class="btn btn--primary" type="submit">${esc(AA.t("ac.save"))}</button>
      </form>`;
  };

  const matchView = () => {
    const jp = ACC.jobProfile();
    if (!ACC.hasJobPrefs(jp)) {
      return AA.emptyState({ icon: "briefcase", text: esc(AA.t("ac.m.empty.profile")), href: "#prefs", label: esc(AA.t("ac.tab.prefs")) });
    }
    const list = A.jobs().filter((j) => ACC.jobMatches(j, jp));
    const q = new URLSearchParams();
    if (jp.region && jp.region !== "any") q.set("region", jp.region);
    q.set("match", "1");
    const all = `<a class="btn btn--outline" href="emploi.html">${esc(AA.t("ac.m.all"))}</a>`;
    return `
      <h3>${esc(AA.t("ac.m.title"))}</h3>
      <p class="muted" role="status">${esc(list.length ? AA.plural("ac.m.count", list.length) : AA.t("ac.m.none"))}</p>
      ${list.map((j) => `
        <div class="list-row"><div><strong>${esc(A.tx(j.title))}</strong><br><span class="muted">${esc(j.coopName)} · ${esc(A.regionLabel(j.region))} · ${esc(A.jobCatLabel(j.cat))}</span></div>
        <a class="btn btn--outline btn--sm" href="emploi.html?job=${encodeURIComponent(j.id)}">${esc(AA.t("ac.m.detail"))}</a></div>`).join("")}
      <div class="hero__actions" style="margin-top:1rem"><a class="btn btn--primary" href="emploi.html?${q.toString()}">${AA.icon("briefcase")}${esc(AA.t("jb.h1"))}</a>${all}</div>`;
  };

  /* ---------- cooperative + visitor ---------- */
  const coopView = () => `
    <div class="form-card">
      <h3>${AA.icon("store")} ${esc(AA.t("ac.coop.t"))}</h3>
      <p class="muted">${esc(AA.t("ac.coop.x"))}</p>
      <div class="hero__actions" style="margin-top:.5rem">
        <a class="btn btn--primary" href="cooperative.html">${AA.icon("dashboard")}${esc(AA.t("acc.menu.dash"))}</a>
        <a class="btn btn--outline" href="cooperative.html#products">${esc(AA.t("acc.menu.products"))}</a>
        <a class="btn btn--outline" href="cooperative.html#jobs">${esc(AA.t("acc.menu.myjobs"))}</a>
      </div>
    </div>`;

  const visitorView = () => `
    <div class="form-card">
      <h3>${AA.icon("globe")} ${esc(AA.t("ac.v.t"))}</h3>
      <p class="muted">${esc(AA.t("ac.v.x"))}</p>
      <h4>${esc(AA.t("ac.v.links"))}</h4>
      <div class="chip-row">
        <a class="chip" href="explorer.html">${esc(AA.t("nav.explore"))}</a>
        <a class="chip" href="patrimoine.html">${esc(AA.t("nav.heritage"))}</a>
        <a class="chip" href="artisans.html">${esc(AA.t("nav.artisans"))}</a>
        <a class="chip" href="boutique.html">${esc(AA.t("nav.shop"))}</a>
        <a class="chip" href="emploi.html">${esc(AA.t("acc.menu.jobs"))}</a>
      </div>
      <p class="muted mt-1">${esc(AA.t("ac.v.register.x"))}</p>
      <a class="btn btn--outline" href="inscription.html">${AA.icon("userPlus")}${esc(AA.t("ac.v.register"))}</a>
    </div>`;

  /* ---------- role switcher + demo data (shown under every role) ---------- */
  const ROLE_ICON = { client: "bag", job: "briefcase", coop: "store", visitor: "globe" };
  function renderExtra() {
    const cards = ACC.ROLES.map((r) => `
      <div class="role-mini${r === role ? " is-current" : ""}">
        <span class="role-mini__icon">${AA.icon(ROLE_ICON[r])}</span>
        <strong>${esc(ACC.roleLabel(r))}</strong>
        <span class="muted">${esc(AA.t(`ac.sw.${r}.x`))}</span>
        ${r === role ? `<span class="tag tag--green">${esc(AA.t("ac.sw.current"))}</span>`
          : `<button class="btn btn--outline btn--sm" type="button" data-role="${r}">${esc(AA.t("ac.sw.use"))}</button>`}
      </div>`).join("");
    extra.innerHTML = `
      <section class="mt-2" aria-labelledby="sw-title">
        <h3 id="sw-title">${esc(AA.t("ac.sw.t"))}</h3>
        <p class="muted">${esc(AA.t("ac.sw.x"))}</p>
        <div class="role-mini-grid">${cards}</div>
      </section>
      <section class="mt-2">
        <h3>${esc(AA.t("ac.data.t"))}</h3>
        <div class="hero__actions" style="margin-top:.5rem">
          <button class="btn btn--outline" type="button" id="clear-data">${AA.icon("trash")}${esc(AA.t("ac.clear"))}</button>
          <a class="btn btn--outline" href="index.html">${AA.icon("home")}${esc(AA.t("ac.back"))}</a>
        </div>
      </section>`;
  }

  /* ---------- render ---------- */
  const VIEWS = {
    client: { info: clientInfo, favs: favsView, cart: cartView, discover: discoverView },
    job: { info: jobInfo, prefs: prefsView, match: matchView },
  };

  function render() {
    role = ACC.role();
    const names = TABS[role];
    if (names.length && !names.includes(tab)) tab = names[0];
    tabsEl.hidden = !names.length;
    tabsEl.innerHTML = names.map((n) => `<button class="tab${n === tab ? " is-active" : ""}" role="tab" type="button" data-tab="${n}" aria-selected="${n === tab}">${esc(AA.t(`ac.tab.${n}`))}</button>`).join("");
    if (role === "coop") content.innerHTML = coopView();
    else if (role === "visitor") content.innerHTML = visitorView();
    else content.innerHTML = VIEWS[role][tab]();
    content.setAttribute("aria-label", names.length ? AA.t(`ac.tab.${tab}`) : "");
    renderHead();
    renderExtra();
    AA.hydrateIcons();
    const area = $("p-exp-detail");
    if (area) updateCount();
  }

  function updateCount() {
    const area = $("p-exp-detail");
    if (area) $("p-exp-count").textContent = AA.t("ac.j.expdetail.count", { n: area.value.length });
  }

  /* ---------- events ---------- */
  tabsEl.addEventListener("click", (event) => {
    const t = event.target.closest("[data-tab]");
    if (t) { tab = t.dataset.tab; history.replaceState(null, "", `#${tab}`); render(); }
  });
  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if (TABS[role].includes(h)) { tab = h; render(); }
  });

  const addSkill = () => {
    const input = $("skill-input");
    const text = input.value.replace(/\s+/g, " ").trim();
    skillMsg = "";
    if (text) {
      if (text.length > 40) skillMsg = AA.t("ac.j.skills.long");
      else if (skillsDraft.length >= 12) skillMsg = AA.t("ac.j.skills.max");
      else if (!skillsDraft.some((s) => s.toLowerCase() === text.toLowerCase())) { skillsDraft.push(text); input.value = ""; }
      else input.value = "";
    }
    $("skill-msg").textContent = skillMsg;
    $("skill-list").innerHTML = skillChips();
    input.focus();
  };

  content.addEventListener("click", (event) => {
    if (event.target.closest("#skill-add")) { addSkill(); return; }
    const rm = event.target.closest("[data-skill-remove]");
    if (rm) { skillsDraft.splice(Number(rm.dataset.skillRemove), 1); $("skill-list").innerHTML = skillChips(); $("skill-msg").textContent = ""; return; }
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const remove = event.target.closest("[data-remove]");
    if (plus || minus) {
      const id = plus ? plus.dataset.plus : minus.dataset.minus;
      const current = AA.cart.items().find((i) => i.id === id);
      if (current) AA.cart.setQty(id, current.qty + (plus ? 1 : -1));
    } else if (remove) {
      AA.cart.remove(remove.dataset.remove);
      AA.toast(AA.t("ac.cart.removed"));
    }
  });

  content.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.id === "skill-input") { event.preventDefault(); addSkill(); }
  });
  content.addEventListener("input", (event) => { if (event.target.id === "p-exp-detail") updateCount(); });

  content.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target.id === "profile-form") {
      const name = $("p-name"), email = $("p-email");
      const ok = [
        AA.fieldError(name, name.value.trim().length >= 2 ? "" : AA.t("ac.err.name")),
        AA.fieldError(email, !email.value.trim() || AA.isEmail(email.value) ? "" : AA.t("ac.err.email")),
      ].every(Boolean);
      if (!ok) return;
      AA.store.set("aa_profile", { ...AA.store.get("aa_profile", {}), name: name.value.trim(), email: email.value.trim() });
      if (event.target.dataset.kind === "client") {
        ACC.write(ACC.KEYS.client, { city: $("p-city").value.trim().slice(0, 60), cats: [...content.querySelectorAll("input[name=cats]:checked")].map((i) => i.value) });
      }
      renderHead();
      AA.toast(AA.t("ac.saved"));
    } else if (event.target.id === "prefs-form") {
      if ($("skill-input").value.trim()) addSkill();
      ACC.write(ACC.KEYS.job, {
        skills: skillsDraft.slice(0, 12),
        region: $("p-region").value || "any",
        interests: [...content.querySelectorAll("input[name=interests]:checked")].map((i) => i.value),
        exp: $("p-exp").value,
        expDetail: $("p-exp-detail").value.trim().slice(0, 600),
      });
      AA.toast(AA.t("ac.j.saved"));
    }
  });

  extra.addEventListener("click", (event) => {
    const sw = event.target.closest("[data-role]");
    if (sw) {
      ACC.setRole(sw.dataset.role);
      tab = "";
      history.replaceState(null, "", location.pathname);
      ACC.refresh();
      render();
      AA.toast(AA.t("ac.sw.done", { role: ACC.roleLabel(sw.dataset.role) }));
      return;
    }
    if (!event.target.closest("#clear-data")) return;
    if (!window.confirm(AA.t("ac.clear.confirm"))) return;
    ["aa_favs", "aa_cart", "aa_orders", "aa_requests", "aa_passports", "aa_profile", ACC.KEYS.client, ACC.KEYS.job].forEach((k) => ACC.remove(k));
    ACC.clearRole();
    const acc = ACC.account();
    if (acc && acc.type !== "coop") ACC.remove(ACC.KEYS.account); // the cooperative account is kept: its dashboard content is not touched
    ACC.refresh();
    AA.toast(AA.t("ac.cleared"));
    render();
  });

  document.addEventListener("aa:favs", () => { if (role === "client" && tab === "favs") render(); });
  document.addEventListener("aa:cart", () => { if (role === "client" && tab === "cart") render(); });
  render();
});
