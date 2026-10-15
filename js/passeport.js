/* passeport.js — heritage passport for one product (passeport.html?id=...) */
document.addEventListener("DOMContentLoaded", async () => {
  const targetId = AA.getParam("id");

  // ============================================================
  // 1. CHARGEMENT ET FUSION DES PRODUITS DE L'API DU BOT
  // ============================================================
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const apiProducts = await res.json();
      const formattedApi = apiProducts.map((p) => {
        const firstImg = (p.imagesUrls && p.imagesUrls.length > 0)
          ? p.imagesUrls[0]
          : (p.images && p.images[0] ? `/uploads/${p.images[0]}` : 'assets/placeholder.jpg');

        return {
          id: p.id,
          name: p.name,
          cat: p.category || p.cat || "Melhfa",
          city: p.city || "Laâyoune",
          price: p.price,
          desc: p.description || p.desc || "Création artisanale saharienne confectionnée à la main.",
          stock: p.stock === null || p.stock === undefined ? 10 : p.stock,
          verified: true,
          demoCoop: false,
          image: firstImg,
          images: p.imagesUrls || [firstImg],
          qrCodeUrl: p.qrCodeUrl || (p.qrCode ? `/qrcodes/${p.qrCode}` : null),
          artisan: p.managerName || p.phone || "Artisan",
          coop: p.cooperativeName || "Coopérative partenaire",
          tech: "Tissage, broderie et confection traditionnelle",
          mat: "Tissu saharien noble et ornements",
          motif: null
        };
      });

      const existingIds = new Set(formattedApi.map((p) => String(p.id)));
      const staticFiltered = (AA.products || []).filter((p) => !existingIds.has(String(p.id)));
      AA.products = [...formattedApi, ...staticFiltered];
    }
  } catch (err) {
    console.warn("API produits non joignable, utilisation des données locales :", err);
  }

  // ============================================================
  // 2. RÉCUPÉRATION DU PRODUIT CIBLE
  // ============================================================
  const product = (AA.products || []).find((p) => String(p.id) === String(targetId))
    || (AA.getProduct ? AA.getProduct(targetId) : null)
    || AA.products[0];

  const artisanObj = AA.getArtisan ? AA.getArtisan(product.artisan) : null;
  const artisanName = artisanObj?.name || product.artisan || "Artisan du Sahara";
  const artisanCoop = artisanObj?.coop || product.coop || "Coopérative partenaire";
  const motif = (AA.getMotif && product.motif) ? AA.getMotif(product.motif) : null;

  const passport = document.getElementById("passport");
  const backBtn = document.getElementById("back-to-product");
  if (backBtn) backBtn.href = `produit.html?id=${product.id}`;
  document.title = AA.pageTitle ? AA.pageTitle(`${AA.t ? AA.t("title.passeport") : "Passeport"} — ${product.name}`) : `Passeport — ${product.name}`;

  // Mémorisation de la visite
  if (AA.store) {
    const seen = AA.store.get("aa_passports", []);
    if (!seen.includes(product.id)) AA.store.set("aa_passports", [...seen, product.id]);
  }

  /* Textes multilingues */
  const TEXT = {
    fr: { dir: "ltr", title: "Passeport patrimonial", origin: "Origine", maker: "Artisan / coopérative", tech: "Technique", mat: "Matières", symbol: "Symbole", story: "Histoire de la pièce", workshop: "Dans l'atelier", qr: "Scanner. Découvrir. Comprendre.", qrNote: "Lien du passeport :", copy: "Copier le lien", copied: "Lien copié" },
    ar: { dir: "rtl", title: "جواز التراث", origin: "الأصل", maker: "الحرفي / التعاونية", tech: "التقنية", mat: "المواد", symbol: "الرمز", story: "قصة القطعة", workshop: "داخل الورشة", qr: "امسح. اكتشف. افهم.", qrNote: "رابط الجواز:", copy: "نسخ الرابط", copied: "تم نسخ الرابط" },
    en: { dir: "ltr", title: "Heritage passport", origin: "Origin", maker: "Artisan / cooperative", tech: "Technique", mat: "Materials", symbol: "Symbol", story: "Story of the piece", workshop: "In the workshop", qr: "Scan. Discover. Understand.", qrNote: "Passport link:", copy: "Copy link", copied: "Link copied" },
  };

  /* Générateur SVG de secours si aucun QR code réel n'est disponible */
  function fakeQr(seedText) {
    const size = 25;
    let seed = 0;
    for (const ch of String(seedText)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const inFinder = (x, y) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
    let rects = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (inFinder(x, y)) continue;
        if (rand() > 0.52) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
    const finder = (fx, fy) =>
      `<rect x="${fx}" y="${fy}" width="7" height="7" fill="#3b2a1c"/><rect x="${fx + 1}" y="${fy + 1}" width="5" height="5" fill="#fff"/><rect x="${fx + 2}" y="${fy + 2}" width="3" height="3" fill="#3b2a1c"/>`;
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="QR Code"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#3b2a1c">${rects}</g>${finder(0, 0)}${finder(size - 7, 0)}${finder(0, size - 7)}</svg>`;
  }

  // URL exacte du passeport pour ce produit précis
  const passportUrl = new URL(`passeport.html?id=${product.id}`, window.location.href).href;
  const pieceNumber = `AA-2026-${String(product.id).toUpperCase().slice(-6)}-${String(product.price).padStart(4, "0")}`;

  function render(lang) {
    const t = TEXT[lang];
    passport.setAttribute("dir", t.dir);

    // QR code réel s'il existe, sinon SVG calculé
    const qrMarkup = product.qrCodeUrl
      ? `<img src="${product.qrCodeUrl}" alt="QR Code du produit" style="width:120px;height:120px;object-fit:contain;background:#fff;padding:6px;border-radius:8px;border:1px solid #e5e7eb;">`
      : fakeQr(product.id);

    // Histoire de la pièce (description générée par Gemini ou fonction par défaut)
    const storyText = product.desc || product.description || (AA.passportStory ? AA.passportStory(product) : "Pièce authentique réalisée dans le respect des traditions sahariennes.");

    passport.innerHTML = `
      <div class="passport__head">
        <span class="eyebrow">ATHAR</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);margin:.2rem 0">${t.title}</h1>
        <p class="passport__id" dir="ltr">N° ${pieceNumber}</p>
      </div>
      <div class="passport__grid">
        <div class="passport__photo">${AA.img ? AA.img(product.image, product.name, product.cat) : `<img src="${product.image}" alt="${product.name}">`}</div>
        <dl>
          <div><dt>${t.origin}</dt><dd>${product.city}, Sahara marocain</dd></div>
          <div><dt>${t.maker}</dt><dd>${AA.esc ? AA.esc(artisanName) : artisanName} — ${AA.esc ? AA.esc(artisanCoop) : artisanCoop}</dd></div>
          <div><dt>${t.tech}</dt><dd>${AA.esc ? AA.esc(product.tech || "Artisanat d'art fait main") : (product.tech || "Artisanat d'art fait main")}</dd></div>
          <div><dt>${t.mat}</dt><dd>${AA.esc ? AA.esc(product.mat || "Matières premières naturelles") : (product.mat || "Matières premières naturelles")}</dd></div>
          ${motif ? `<div><dt>${t.symbol}</dt><dd>${motif.name} <span style="display:inline-block;width:22px;height:22px;vertical-align:middle;color:var(--terracotta)">${AA.motifSvg ? AA.motifSvg(motif) : ''}</span></dd></div>` : `<div><dt>${t.symbol}</dt><dd>Authenticité & Savoir-faire</dd></div>`}
        </dl>
      </div>
      <h2 style="font-size:1.6rem;margin-top:1.8rem">${AA.esc ? AA.esc(product.name) : product.name}</h2>
      <h3>${t.story}</h3>
      <p lang="fr" dir="ltr">${AA.esc ? AA.esc(storyText) : storyText}</p>
      ${motif ? `<p lang="fr" dir="ltr" class="muted">Signification du motif (illustrative) : ${motif.meaning}</p>` : ''}

      <h3 class="mt-2">${t.workshop}</h3>
      <div class="video-box" style="position:relative; border-radius:12px; overflow:hidden; background:#000; max-height:420px; display:flex; justify-content:center;">
        <video controls playsinline preload="metadata" poster="${product.images ? product.images[0] : (product.image || '')}" style="width:100%; max-height:420px; object-fit:contain; border-radius:12px;">
          <source src="${product.videoUrl || (product.video ? `/videos/${product.video}` : 'assets/videos/atelier_demo.mp4')}" type="video/mp4">
          Votre navigateur ne prend pas en charge la lecture de vidéos.
        </video>
      </div>

      <div class="qr-box" dir="ltr">
        ${qrMarkup}
        <div>
          <h3 style="margin-bottom:.3rem">${t.qr}</h3>
          <p class="muted" style="margin-bottom:.4rem">${t.qrNote} <a href="${AA.esc ? AA.esc(passportUrl) : passportUrl}" style="word-break:break-all;text-decoration:underline">${AA.esc ? AA.esc(passportUrl) : passportUrl}</a></p>
          <button class="btn btn--primary btn--sm" type="button" id="copy-link">${t.copy}</button>
          <a class="btn btn--outline btn--sm" href="produit.html?id=${product.id}">${AA.icon ? AA.icon("arrowLeft") : '←'} ${AA.t ? AA.t("passport.backToProduct") : "Fiche produit"}</a>
        </div>
      </div>`;

    if (AA.applyBackgrounds) AA.applyBackgrounds(passport);

    document.getElementById("play-btn")?.addEventListener("click", () => {
      if (AA.toast) AA.toast("Vidéo en cours de préparation dans l'atelier", true);
    });

    document.getElementById("copy-link")?.addEventListener("click", () => {
      const done = () => { if (AA.toast) AA.toast(t.copied); };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(passportUrl).then(done, () => { if (AA.toast) AA.toast(passportUrl); });
      } else {
        if (AA.toast) AA.toast(passportUrl);
      }
    });
  }

  document.querySelectorAll("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("is-active", b === btn));
      render(btn.dataset.lang);
    })
  );

  render("fr");
});