/* ==========================================================
   coop-data.js — cooperative demo data layer (Account Phase 2)
   Synchronisé avec l'API WhatsApp Bot (/api/products)
   ========================================================== */
(() => {
  const KEYS = { coops: "aa_coops", products: "aa_coop_products", jobs: "aa_coop_jobs", account: "aa_demo_account" };

  /* ----- shared texts ----- */
  const T = {
    "coop.tag.demo": ["Démo coopérative", "Cooperative demo", "عرض تجريبي لتعاونية"],
    "nav.jobs.menu": ["Offres d'emploi", "Job offers", "عروض الشغل"],
    "footer.jobs": ["Offres d'emploi", "Job offers", "عروض الشغل"],
    "nav.reviews.menu": ["Avis", "Reviews", "الآراء"],
    "footer.reviews": ["Avis", "Reviews", "الآراء"],
    "title.avis": ["Avis", "Reviews", "الآراء"],
    "footer.coop": ["Espace coopérative", "Cooperative area", "فضاء التعاونية"],
    "title.cooperative": ["Espace coopérative", "Cooperative dashboard", "فضاء التعاونية"],
    "title.emploi": ["Offres d'emploi", "Job offers", "عروض الشغل"],
    "city.Tarfaya": ["Tarfaya", "Tarfaya", "طرفاية"],
    "city.Guelmim": ["Guelmim", "Guelmim", "كلميم"],
    "city.Tan-Tan": ["Tan-Tan", "Tan-Tan", "طانطان"],
    "ins.ok.coop.dash": ["Ouvrir mon espace coopérative", "Open my cooperative dashboard", "فتح فضاء تعاونيتي"],
  };
  ["fr", "en", "ar"].forEach((lang, i) => Object.keys(T).forEach((k) => {
    if (AA.translations && AA.translations[lang]) AA.translations[lang][k] = T[k][i];
  }));

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { return false; }
  };
  const asList = (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : []);
  const asMap = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

  // Échappement HTML : les noms/descriptions venant de WhatsApp sont du texte libre.
  // À utiliser partout où tu fais du innerHTML (ou préfère textContent).
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const REGION_FR = { laayoune: "Laâyoune", dakhla: "Dakhla", smara: "Smara", boujdour: "Boujdour", tarfaya: "Tarfaya", guelmim: "Guelmim", tantan: "Tan-Tan" };
  const REGION_IDS = Object.keys(REGION_FR);
  const JOB_CATS = ["craft", "sales", "tourism", "comm", "logistics", "training"];

  const hash = (text) => {
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };
  const uid = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const tx = (field) => (field && typeof field === "object" ? field[AA.lang] || field.fr || "" : field || "");

  const account = () => {
    const a = read(KEYS.account, null);
    return a && a.type === "coop" ? a : null;
  };
  const currentId = () => {
    const a = account();
    return a ? (a.coopId || `c_${hash(`${a.created || ""}|${(a.email || "").toLowerCase()}|${a.name || ""}`)}`) : null;
  };

  const coops = () => asMap(read(KEYS.coops, {}));
  const rawProducts = () => asList(read(KEYS.products, []));
  const rawJobs = () => asList(read(KEYS.jobs, []));

  const CAT_PHOTO = () => (typeof categoryPhotos !== "undefined" ? categoryPhotos : {});
  const validCat = (c) => (AA.categories && AA.categories.includes(c) ? c : (AA.categories ? AA.categories[0] : "Épicerie"));

  const toProduct = (cp, profile) => {
    const cat = validCat(cp.cat);
    const photos = CAT_PHOTO()[cat] || [];
    const image = cp.image || photos[0] || "";
    const city = REGION_FR[profile && profile.region] || REGION_FR[cp.region] || "Laâyoune";
    return {
      id: cp.id, name: String(cp.name || ""), cat, price: Number(cp.price) || 0,
      artisan: `coop_${cp.ownerId}`, city, coop: (profile && profile.name) || "Coopérative (démo)", verified: false,
      pop: 50, desc: String(cp.desc || ""), tech: "Fait main (fiche de démonstration)", mat: "Non précisé", days: 7,
      motif: "etoile", stock: Number.isFinite(Number(cp.stock)) ? Number(cp.stock) : 5,
      images: [image], image, demoCoop: true, ownerId: cp.ownerId, customImage: Boolean(cp.image),
    };
  };

  AA.coopArtisans = AA.coopArtisans || {};
  const toArtisan = (ownerId, profile) => ({
    id: `coop_${ownerId}`, name: profile.name, coop: profile.name, city: REGION_FR[profile.region] || "Laâyoune",
    craft: validCat(profile.category), specialty: "",
    verified: false, bio: `${profile.description || ""} (profil de coopérative de démonstration)`, techniques: "—",
    photo: profile.logo || "", demoCoop: true,
  });

  /* ---------- Produits du Bot WhatsApp ---------- */
  let botProductsCache = [];
  let botArtisansCache = {};
  let botSignature = "";

  const toBotArtisan = (p, cat) => {
    const d = p.cooperativeDetails || {};
    const name = d.name || p.cooperativeName || "Coopérative partenaire";
    return {
      id: `coopbot_${p.coopId || hash(name)}`, name, coop: name,
      city: d.city || p.city || "Laâyoune", craft: cat, specialty: d.specialty || "",
      verified: true, bio: d.specialty ? `${name} — ${d.specialty}` : name,
      techniques: d.specialty || "—", photo: "", fromBot: true,
    };
  };

  const toBotProduct = (p) => {
    const cat = validCat(p.category || p.cat);
    const firstImg = (p.imagesUrls && p.imagesUrls.length > 0)
      ? p.imagesUrls[0]
      : (p.images && p.images[0] ? `/uploads/${p.images[0]}` : "assets/placeholder.jpg");
    const artisan = toBotArtisan(p, cat);
    botArtisansCache[artisan.id] = artisan;

    // Stock : null/absent côté bot = non renseigné → 10 par défaut ; 0 = épuisé.
    // (Attention : Number(null) vaut 0, d'où le test explicite.)
    const hasStock = p.stock !== null && p.stock !== undefined && p.stock !== "" && Number.isFinite(Number(p.stock));
    const stock = hasStock ? Math.max(0, Math.floor(Number(p.stock))) : 10;

    // Textes multilingues (name_i18n / description_i18n si l'API les fournit)
    const baseName = String(p.name || "");
    const baseDesc = p.description || p.desc || "Création artisanale confectionnée à la main.";
    const nameI18n = p.name_i18n || { fr: baseName, ar: baseName, en: baseName };
    const descI18n = p.description_i18n || { fr: baseDesc, ar: baseDesc, en: baseDesc };
    const pick = (map, fallback) => (map && (map[AA.lang || "fr"] || map.fr)) || fallback;

    return {
      id: String(p.id),
      // Getters : le texte suit la langue courante, même si on change de langue après le chargement
      get name() { return pick(nameI18n, baseName); },
      name_i18n: nameI18n,
      get desc() { return pick(descI18n, baseDesc); },
      description_i18n: descI18n,
      cat,
      city: p.city || artisan.city,
      price: Number(p.price) || 0,
      stock,
      verified: true,
      demoCoop: false,
      fromBot: true,
      pop: 99,
      image: firstImg,
      images: (p.imagesUrls && p.imagesUrls.length > 0) ? p.imagesUrls : [firstImg],
      artisan: artisan.id,
      coop: artisan.coop,
      tech: artisan.specialty || "Fait main",
      mat: "Non précisé",
      days: 3,
      motif: null,
      video: p.video || null,
      videoUrl: p.videoUrl || (p.video ? `/videos/${p.video}` : null),
      qrCodeUrl: p.qrCodeUrl || (p.qrCode ? `/qrcodes/${p.qrCode}` : null),
      createdAt: p.createdAt || "",
    };
  };

  // FUSION : Produits locaux + Produits Démo Coopérative + Produits WhatsApp
  const mergeProducts = () => {
    AA.products = (AA.products || []).filter((p) => !p.demoCoop && !p.fromBot);
    AA.coopArtisans = { ...botArtisansCache };
    const all = coops();

    rawProducts().forEach((cp) => {
      if (!cp.id || !cp.ownerId || !cp.name) return;
      const profile = all[cp.ownerId] || { name: "Coopérative (démo)" };
      AA.coopArtisans[`coop_${cp.ownerId}`] = AA.coopArtisans[`coop_${cp.ownerId}`] || toArtisan(cp.ownerId, profile);
      AA.products.push(toProduct(cp, profile));
    });

    if (botProductsCache.length > 0) {
      const botIds = new Set(botProductsCache.map((p) => String(p.id)));
      AA.products = AA.products.filter((p) => !botIds.has(String(p.id)));
      AA.products.unshift(...botProductsCache);
    }
  };

  // Chargement (et rafraîchissement) des produits du Bot depuis l'API
  const fetchBotProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) return;
      const apiProducts = await res.json();
      if (!Array.isArray(apiProducts)) return;

      // Évite de re-rendre la page si rien n'a changé
      const signature = JSON.stringify(apiProducts.map((p) => [p.id, p.name, p.description, p.price, p.stock, p.video, p.category, p.name_i18n, p.description_i18n]));
      if (signature === botSignature) return;
      botSignature = signature;

      botArtisansCache = {};
      botProductsCache = apiProducts.map(toBotProduct);
      mergeProducts();
      document.dispatchEvent(new CustomEvent("aa:products-loaded"));
    } catch (e) {
      console.warn("Impossible de joindre /api/products :", e);
    }
  };

  const baseGetArtisan = AA.getArtisan;
  AA.getArtisan = (id) => (baseGetArtisan && baseGetArtisan(id)) || AA.coopArtisans[id] || {
    id, name: "Coopérative partenaire", coop: "Coopérative partenaire", city: "Laâyoune",
    craft: (AA.categories && AA.categories[0]) || "", specialty: "", verified: false, bio: "", techniques: "—", photo: ""
  };

  // Reconnaît indifféremment les ID texte et nombre
  AA.getProduct = (id) => (AA.products || []).find((p) => String(p.id) === String(id));

  // Initialisations
  mergeProducts();
  fetchBotProducts();
  setInterval(fetchBotProducts, 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) fetchBotProducts(); });

  /* ---------- Job advertisements ---------- */
  const SEED_JOBS = [];

  const jobs = () => {
    const all = coops();
    const own = rawJobs().filter((j) => j.id && j.title).map((j) => {
      const c = all[j.ownerId] || {};
      return {
        id: j.id, ownerId: j.ownerId, title: j.title, desc: j.desc, cat: j.cat, region: j.region,
        coopName: c.name || "Coopérative (démo)", coopRegion: c.region || "", coopLogo: c.logo || "",
        contact: j.showContact ? { email: c.email || "", whatsapp: c.whatsapp || "" } : null,
        created: j.created || "", updated: j.updated || "", seed: false,
      };
    }).sort((a, b) => String(b.updated || b.created).localeCompare(String(a.updated || a.created)));
    const seeds = SEED_JOBS.map((s) => ({ ...s, seed: true, contact: null, coopLogo: "" }));
    return own.concat(seeds);
  };

  /* ---------- Public helpers ---------- */
  AA.coop = {
    KEYS, REGION_FR, REGION_IDS, JOB_CATS, MAX_IMAGE: 2 * 1024 * 1024, IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    read, write, uid, tx, hash, esc, account, currentId, coops, rawProducts, rawJobs, jobs, mergeProducts, fetchBotProducts,
    regionFr: (id) => REGION_FR[id] || "",
    regionLabel(id) {
      if (typeof AA.regions !== "undefined" && typeof AA.rt === "function") {
        const r = AA.regions.find((x) => x.id === id);
        if (r) return AA.rt(r.name);
      }
      return AA.cityLabel ? AA.cityLabel(REGION_FR[id] || "") : (REGION_FR[id] || "");
    },
    jobCatLabel: (k) => (AA.has && AA.has(`ins.int.${k}`) ? AA.t(`ins.int.${k}`) : k),

    resizeImage(file, maxSide = 640, quality = 0.75) {
      return new Promise((resolve, reject) => {
        if (!AA.coop.IMAGE_TYPES.includes(file.type)) return reject(new Error("ins.err.image.type"));
        if (file.size > AA.coop.MAX_IMAGE) return reject(new Error("ins.err.image.size"));
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * ratio));
          canvas.height = Math.max(1, Math.round(img.height * ratio));
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("ins.err.image.type")); };
        img.src = url;
      });
    },
  };
})();