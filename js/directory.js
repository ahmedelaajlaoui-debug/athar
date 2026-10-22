/* ==========================================================
   directory.js — ONE cooperative directory shared by the Explorer, the Patrimoine page and the homepage
   Load after coop-data.js, regions.js and main.js (needs AA.coop, AA.regions, AA.t, AA.icon, AA.img).

   There is a single source of truth, so a cooperative is never copied:
   - registered cooperatives : the profiles saved by the cooperative dashboard (localStorage "aa_coops"),
                               read again on every call → an edit in the dashboard shows everywhere
   - demo listings           : derived from the fictional artisans of data.js (one listing per `coop` name),
                               clearly marked as illustrative. No address, phone or email is invented.
   Both kinds are "not verified": ATHAR has no verified real-world cooperative yet.

   API
   - AA.dir.all()              every listing (registered first, then demo)
   - AA.dir.get(id)            one listing or null
   - AA.dir.inRegion(regionId) listings of one city / region
   - AA.dir.url(id)            patrimoine.html?coop=<id>#cooperative   (the profile view of the Patrimoine page)
   - AA.dir.card(c, {compact}) HTML of a cooperative card (whole card + name + logo link to the profile)
   - AA.dir.facts              data of the "Saviez-vous ?" cards
   ========================================================== */
(() => {
  AA.ICON_PATHS.mail = '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>';
  const slug = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const regionByFr = {};
  Object.keys(AA.coop.REGION_FR).forEach((id) => { regionByFr[AA.coop.REGION_FR[id]] = id; });
  const photos = () => (typeof categoryPhotos !== "undefined" ? categoryPhotos : {});
  const waDigits = (raw) => String(raw || "").replace(/[\s.\-()]/g, "");
  const waOk = (raw) => { const w = waDigits(raw); return /^\+[1-9]\d{7,14}$/.test(w) || /^0[5-7]\d{8}$/.test(w); };
  /* Moroccan national format 06… → international for the wa.me link */
  const waLink = (raw) => { const w = waDigits(raw); return `https://wa.me/${w.startsWith("+") ? w.slice(1) : "212" + w.slice(1)}`; };

  const catLabel = (cat) => (cat === "other" || !cat ? AA.t("dir.other") : AA.catLabel(cat));
  const regionLabel = (id) => (id ? AA.coop.regionLabel(id) : "");

  const demoListings = () => {
    const map = new Map();
    AA.artisans.forEach((a) => {
      const id = `demo-${slug(a.coop)}`;
      if (!map.has(id)) map.set(id, { id, source: "demo", name: a.coop, region: regionByFr[a.city] || "", categories: [], artisans: [] });
      const c = map.get(id);
      if (!c.categories.includes(a.craft)) c.categories.push(a.craft);
      c.artisans.push(a);
    });
    return [...map.values()].map((c) => ({
      ...c,
      category: c.categories[0],
      logo: "",
      photo: (photos()[c.categories[0]] || [])[0] || AA.photos.workshop,
      contact: null,
      products: AA.products.filter((p) => !p.demoCoop && p.coop === c.name),
    }));
  };

  const registeredListings = () => {
    const all = AA.coop.coops();
    return Object.keys(all)
      .map((key) => {
        const p = all[key];
        if (!p || typeof p !== "object" || !p.name || !AA.coop.REGION_IDS.includes(p.region)) return null;
        const category = AA.categories.includes(p.category) ? p.category : "other";
        const contact = p.publicContact === true
          ? { email: AA.isEmail(p.email || "") ? String(p.email).trim() : "", whatsapp: waOk(p.whatsapp) ? String(p.whatsapp).trim() : "" }
          : null;
        return {
          id: key, source: "registered", name: String(p.name), region: p.region, category, categories: [category],
          description: String(p.description || ""), logo: typeof p.logo === "string" ? p.logo : "",
          photo: (photos()[category] || [])[0] || AA.photos.workshop, artisans: [],
          contact: contact && (contact.email || contact.whatsapp) ? contact : null,
          products: AA.products.filter((x) => x.demoCoop && x.ownerId === key),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const dir = {
    catLabel, regionLabel, waLink,
    all: () => registeredListings().concat(demoListings()),
    get(id) { return dir.all().find((c) => c.id === id) || null; },
    inRegion(regionId) { return dir.all().filter((c) => c.region === regionId); },
    url: (id) => `patrimoine.html?coop=${encodeURIComponent(id)}#cooperative`,
    description(c) {
      if (c.source === "registered") return c.description;
      return AA.t("dir.demo.desc", { city: regionLabel(c.region), craft: c.categories.map(catLabel).join(", ") });
    },
    badge: (c) => AA.t(c.source === "registered" ? "dir.badge.registered" : "dir.badge.demo"),
    plural: (key, n) => (n === 0 ? AA.t("dir.count.none") : AA.plural(key, n)),

    /* Logo or photo of a listing (a registered cooperative's own logo wins) */
    image(c) { return c.logo ? AA.img(c.logo, c.name, "") : AA.img(c.photo, c.name, c.category === "other" ? "" : c.category); },

    card(c, { compact = false } = {}) {
      const url = dir.url(c.id);
      const meta = `${AA.icon("pin")}<span>${AA.esc(regionLabel(c.region))}</span><span aria-hidden="true">·</span><span>${AA.esc(catLabel(c.category))}</span>`;
      const aria = AA.esc(AA.t("dir.view.aria", { name: c.name }));
      if (compact) {
        return `<a class="coop-mini" href="${url}" data-coop="${AA.esc(c.id)}" aria-label="${aria}">
          <span class="coop-mini__img">${dir.image(c)}</span>
          <span class="coop-mini__body"><strong>${AA.esc(c.name)}</strong><small class="coop-meta">${meta}</small><small class="tag tag--terra">${AA.esc(dir.badge(c))}</small></span>
          <span class="coop-mini__go" aria-hidden="true">${AA.icon("arrowRight")}</span></a>`;
      }
      return `<article class="card coop-card reveal" data-coop="${AA.esc(c.id)}">
        <a class="coop-card__img" href="${url}" tabindex="-1" aria-hidden="true">${dir.image(c)}</a>
        <div class="card__body">
          <span class="tag tag--terra">${AA.esc(dir.badge(c))}</span>
          <h3><a href="${url}">${AA.esc(c.name)}</a></h3>
          <p class="coop-meta">${meta}</p>
          <p class="card__meta coop-card__desc">${AA.esc(dir.description(c))}</p>
          <div class="card__actions"><a class="btn btn--outline btn--sm" href="${url}" aria-label="${aria}">${AA.esc(AA.t("dir.view"))}${AA.icon("arrowRight")}</a></div>
        </div></article>`;
    },
  };

  /* "Saviez-vous ?" — short, cautious general facts (texts: directory-i18n.js, keys dyk.1 … dyk.6) */
  dir.facts = [
    { n: 1, icon: "thread", tag: "culture" },
    { n: 2, icon: "book", tag: "culture" },
    { n: 3, icon: "users", tag: "culture" },
    { n: 4, icon: "home", tag: "craft" },
    { n: 5, icon: "incense", tag: "craft" },
    { n: 6, icon: "wave", tag: "env" },
  ];

  AA.dir = dir;
})();
