/* ==========================================================
   account.js — demo roles + role-aware menus (Account Phase 3, FRONTEND DEMO ONLY)
   Loaded on EVERY page, right after coop-data.js (it only needs AA, translations and localStorage).

   What it does
   - AA.account.role()  -> "visitor" | "client" | "job" | "coop"   (the role the interface is showing)
   - AA.account.menuItems(role) -> the links of the profile menu / footer "my space" column for that role
   - AA.account.menuHtml() / bindMenu() -> the profile dropdown of the header (used by main.js)
   - stores two small non-sensitive profiles: aa_client_profile and aa_job_profile

   Honest limits
   - The role comes from the Phase 1 demo account (aa_demo_account) or from the role chosen on profil.html (aa_demo_role).
   - It only decides which links and screens the NORMAL interface shows. It is NOT security: any visitor can change
     localStorage in the browser tools or open any page by its address. Real role checks need a server.
   - No password is ever stored. Nothing is sent anywhere. One browser, one device.
   ========================================================== */
(() => {
  const KEYS = { account: "aa_demo_account", role: "aa_demo_role", client: "aa_client_profile", job: "aa_job_profile" };
  const ROLES = ["visitor", "client", "job", "coop"];

  /* ----- shared texts (menus, footer, role names) ----- */
  const T = {
    "acc.menu.aria": ["Menu du compte", "Account menu", "قائمة الحساب"],
    "acc.menu.open": ["Mon espace", "My account", "حسابي"],
    "acc.role.visitor": ["Visiteur", "Visitor", "زائر"],
    "acc.role.client": ["Client", "Customer", "زبون"],
    "acc.role.job": ["Chercheur d'emploi", "Job seeker", "باحث عن عمل"],
    "acc.role.coop": ["Coopérative", "Cooperative", "تعاونية"],
    "acc.role.demo": ["{role} · démo", "{role} · demo", "{role} · تجريبي"],
    "acc.menu.profile": ["Mon profil", "My profile", "ملفي الشخصي"],
    "acc.menu.shop": ["Parcourir la boutique", "Browse the shop", "تصفح المتجر"],
    "acc.menu.coops": ["Coopératives et artisans", "Cooperatives and artisans", "التعاونيات والحرفيون"],
    "acc.menu.jobs": ["Offres d'emploi", "Job offers", "عروض الشغل"],
    "acc.menu.dash": ["Tableau de bord coopérative", "Cooperative dashboard", "لوحة تحكم التعاونية"],
    "acc.menu.products": ["Mes produits", "My products", "منتجاتي"],
    "acc.menu.myjobs": ["Mes offres d'emploi", "My job ads", "عروض الشغل الخاصة بي"],
    "acc.menu.register": ["Créer un compte (facultatif)", "Create an account (optional)", "إنشاء حساب (اختياري)"],
    "acc.menu.visitor": ["Choisir un rôle de démo", "Choose a demo role", "اختيار دور تجريبي"],
    "acc.menu.home": ["Retour au site principal", "Back to the main website", "العودة إلى الموقع الرئيسي"],
    "acc.menu.note": ["Rôle de démonstration : aucune vraie connexion.", "Demo role: no real sign-in.", "دور تجريبي: لا يوجد تسجيل دخول حقيقي."],
  };
  ["fr", "en", "ar"].forEach((lang, i) => Object.keys(T).forEach((k) => { AA.translations[lang][k] = T[k][i]; }));

  const read = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (error) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { return false; }
  };
  const remove = (key) => { try { localStorage.removeItem(key); } catch (error) { /* storage blocked */ } };
  const asObj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

  const account = () => { const a = read(KEYS.account, null); return a && typeof a === "object" ? a : null; };

  /* The role shown by the interface: the role chosen on profil.html if any, else the type of the demo account, else visitor */
  const role = () => {
    const chosen = read(KEYS.role, null);
    if (ROLES.includes(chosen)) return chosen;
    const a = account();
    return a && ["client", "job", "coop"].includes(a.type) ? a.type : "visitor";
  };
  const setRole = (r) => (ROLES.includes(r) ? write(KEYS.role, r) : false);
  const clearRole = () => remove(KEYS.role);

  /* Small non-sensitive profiles (no password, no phone number, no image) */
  const clientProfile = () => {
    const p = asObj(read(KEYS.client, {}));
    return { city: String(p.city || ""), cats: Array.isArray(p.cats) ? p.cats.filter((c) => typeof c === "string") : [] };
  };
  const jobProfile = () => {
    const p = asObj(read(KEYS.job, {}));
    const a = account();
    const fromAccount = a && a.type === "job" ? a : {};
    return {
      skills: Array.isArray(p.skills) ? p.skills.filter((s) => typeof s === "string").slice(0, 12) : [],
      region: String(p.region || fromAccount.region || "any"),
      interests: Array.isArray(p.interests) ? p.interests.filter((s) => typeof s === "string") : (Array.isArray(fromAccount.interests) ? fromAccount.interests : []),
      exp: String(p.exp ?? ""),
      expDetail: String(p.expDetail || ""),
    };
  };

  /* Does a job ad fit the saved job-seeker preferences? (region "any"/empty = no region filter; no interests = no field filter) */
  const hasJobPrefs = (p = jobProfile()) => Boolean((p.region && p.region !== "any") || p.interests.length);
  const jobMatches = (job, p = jobProfile()) =>
    (!p.region || p.region === "any" || job.region === p.region) && (!p.interests.length || p.interests.includes(job.cat));

  /* ----- menu content per role: [icon, label key, href] ----- */
  const ITEMS = {
    visitor: [["user", "acc.menu.visitor", "profil.html"], ["userPlus", "acc.menu.register", "inscription.html"]],
    client: [["user", "acc.menu.profile", "profil.html"], ["heart", "fav.link", "favoris.html"], ["cart", "cart.link", "panier.html"], ["bag", "acc.menu.shop", "boutique.html"], ["users", "acc.menu.coops", "artisans.html"]],
    job: [["user", "acc.menu.profile", "profil.html"], ["briefcase", "acc.menu.jobs", "emploi.html"]],
    coop: [["dashboard", "acc.menu.dash", "cooperative.html"], ["box", "acc.menu.products", "cooperative.html#products"], ["briefcase", "acc.menu.myjobs", "cooperative.html#jobs"], ["user", "acc.menu.profile", "profil.html"]],
  };
  const menuItems = (r = role()) => (ITEMS[r] || ITEMS.visitor).map(([icon, key, href]) => ({ icon, key, href, label: AA.t(key) }));
  const roleLabel = (r = role()) => AA.t("acc.role." + r);

  /* ----- header dropdown ----- */
  const menuHtml = () => {
    const r = role();
    const links = menuItems(r).map((m) => `<a role="menuitem" href="${m.href}">${AA.icon(m.icon)}<span>${AA.esc(m.label)}</span></a>`).join("");
    const label = AA.t("acc.menu.open");
    return `
      <div class="profile-menu" id="profile-menu" data-role="${r}">
        <button type="button" class="icon-btn profile-menu__btn" id="profile-btn" aria-haspopup="true" aria-expanded="false" aria-controls="profile-menu-list" aria-label="${AA.esc(label)}" title="${AA.esc(label)}">${AA.icon("user")}${r === "visitor" ? "" : '<span class="profile-menu__dot" aria-hidden="true"></span>'}</button>
        <div class="profile-menu__list" id="profile-menu-list" role="menu" aria-label="${AA.esc(AA.t("acc.menu.aria"))}">
          <div class="profile-menu__head"><strong>${AA.esc(AA.t("acc.role.demo", { role: roleLabel(r) }))}</strong><span class="muted">${AA.esc(AA.t("acc.menu.note"))}</span></div>
          ${links}
          <a role="menuitem" class="profile-menu__home" href="index.html">${AA.icon("home")}<span>${AA.esc(AA.t("acc.menu.home"))}</span></a>
        </div>
      </div>`;
  };

  let globalBound = false;
  const closeMenu = (focus) => {
    const list = document.getElementById("profile-menu-list");
    const btn = document.getElementById("profile-btn");
    if (!list || !list.classList.contains("is-open")) return false;
    list.classList.remove("is-open");
    if (btn) { btn.setAttribute("aria-expanded", "false"); if (focus) btn.focus(); }
    return true;
  };
  const bindMenu = () => {
    const btn = document.getElementById("profile-btn");
    const list = document.getElementById("profile-menu-list");
    if (btn && list) {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !list.classList.contains("is-open");
        list.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    }
    if (globalBound) return;
    globalBound = true;
    document.addEventListener("click", (event) => { if (!event.target.closest("#profile-menu")) closeMenu(false); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(true); });
  };

  /* Footer column "my space": same links as the profile menu, plus the optional registration for visitors */
  const footerLinks = () => menuItems().map((m) => `<li><a href="${m.href}">${AA.esc(m.label)}</a></li>`).join("");

  /* Re-draw header + footer after a role change (without reloading the page) */
  const refresh = () => {
    if (typeof AA.renderHeader === "function") AA.renderHeader();
    if (typeof AA.renderFooter === "function") AA.renderFooter();
    if (typeof AA.updateBadges === "function") AA.updateBadges();
    if (typeof AA.hydrateIcons === "function") AA.hydrateIcons();
  };

  AA.account = {
    KEYS, ROLES, read, write, remove, account, role, setRole, clearRole, clientProfile, jobProfile,
    hasJobPrefs, jobMatches, menuItems, roleLabel, menuHtml, bindMenu, footerLinks, refresh,
  };
})();
