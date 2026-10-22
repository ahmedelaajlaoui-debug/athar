/* passeport.js — heritage passport for one product (passeport.html?id=p1) */
document.addEventListener("DOMContentLoaded", () => {
  // If no valid id is given we show the first product, so the demo page is never empty
  const product = AA.getProduct(AA.getParam("id")) || AA.products[0];
  const fromBot = !!product.fromBot;
  const artisan = fromBot ? { name: product.coopName || "Coopérative", coop: "" } : AA.getArtisan(product.artisan);
  const motif = fromBot ? null : AA.getMotif(product.motif);
  const passport = document.getElementById("passport");
  document.getElementById("back-to-product").href = `produit.html?id=${product.id}`;
  document.title = AA.pageTitle(`${AA.t("title.passeport")} — ${product.name}`);

  // Remember which passports were viewed (shown on the profile page)
  const seen = AA.store.get("aa_passports", []);
  if (!seen.includes(product.id)) AA.store.set("aa_passports", [...seen, product.id]);

  /* Texts in three languages (titles only) */
  const TEXT = {
    fr: { dir: "ltr", title: "Passeport patrimonial", origin: "Origine", maker: "Artisan / coopérative", tech: "Technique", mat: "Matières", symbol: "Symbole", story: "Histoire de la pièce", workshop: "Dans l'atelier", qr: "Scanner. Découvrir. Comprendre.", qrNote: "Lien du passeport :", copy: "Copier le lien", copied: "Lien copié" },
    ar: { dir: "rtl", title: "جواز التراث", origin: "الأصل", maker: "الحرفي / التعاونية", tech: "التقنية", mat: "المواد", symbol: "الرمز", story: "قصة القطعة", workshop: "داخل الورشة", qr: "امسح. اكتشف. افهم.", qrNote: "رابط الجواز:", copy: "نسخ الرابط", copied: "تم نسخ الرابط" },
    en: { dir: "ltr", title: "Heritage passport", origin: "Origin", maker: "Artisan / cooperative", tech: "Technique", mat: "Materials", symbol: "Symbol", story: "Story of the piece", workshop: "In the workshop", qr: "Scan. Discover. Understand.", qrNote: "Passport link:", copy: "Copy link", copied: "Link copied" },
  };

  /* Decorative QR-like pattern: NOT a real QR code (see the notice in the page) */
  function fakeQr(seedText) {
    const size = 25;
    let seed = 0;
    for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
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
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Motif illustratif de QR code, non scannable"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#3b2a1c">${rects}</g>${finder(0, 0)}${finder(size - 7, 0)}${finder(0, size - 7)}</svg>`;
  }

  const passportUrl = new URL(`passeport.html?id=${product.id}`, window.location.href).href;
  const pieceNumber = `AA-2026-${String(product.id).toUpperCase()}-${String(product.price).padStart(4, "0")}`;

  function render(lang) {
    const t = TEXT[lang];
    passport.setAttribute("dir", t.dir);
    passport.innerHTML = `
      <div class="passport__head">
        <span class="eyebrow">ATHAR</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);margin:.2rem 0">${t.title}</h1>
        <p class="passport__id" dir="ltr">N° ${pieceNumber}</p>
      </div>
      <div class="passport__grid">
        <div class="passport__photo">${AA.img(product.image, product.name, product.cat)}</div>
        <dl>
          <div><dt>${t.origin}</dt><dd>${product.city}, Sahara marocain</dd></div>
          <div><dt>${t.maker}</dt><dd>${AA.esc(artisan.name)}${artisan.coop ? " — " + AA.esc(artisan.coop) : ""}</dd></div>
          ${fromBot ? "" : `<div><dt>${t.tech}</dt><dd>${AA.esc(product.tech)}</dd></div>`}
          ${fromBot ? "" : `<div><dt>${t.mat}</dt><dd>${AA.esc(product.mat)}</dd></div>`}
          ${motif ? `<div><dt>${t.symbol}</dt><dd>${motif.name} <span style="display:inline-block;width:22px;height:22px;vertical-align:middle;color:var(--terracotta)">${AA.motifSvg(motif)}</span></dd></div>` : ""}
        </dl>
      </div>
      <h2 style="font-size:1.6rem;margin-top:1.8rem">${AA.esc(product.name)}</h2>
      <h3>${t.story}</h3>
      <p lang="fr" dir="ltr">${AA.esc(fromBot ? (product.desc || "") : AA.passportStory(product))}</p>
      ${motif ? `<p lang="fr" dir="ltr" class="muted">Signification du motif (illustrative) : ${motif.meaning}</p>` : ""}

      <h3 class="mt-2"${fromBot && !product.video ? ' style="display:none"' : ""}>${t.workshop}</h3>
      ${fromBot && product.video ? `<video src="${AA.esc(product.video)}" controls playsinline preload="metadata" style="width:100%;max-height:460px;border-radius:12px;background:#000"></video>` : ""}
      <div class="video-box" data-bg="workshop"${fromBot ? ' style="display:none"' : ""}>
        <button class="play" type="button" id="play-btn" aria-label="Lancer la vidéo de l'atelier">${AA.icon("play")}</button>
        <span class="video-note">Photo d'atelier illustrative — vidéo non incluse dans la démonstration</span>
      </div>

      <div class="qr-box" dir="ltr">
        ${fromBot ? (product.qrCode ? `<img src="${AA.esc(product.qrCode)}" alt="QR code du produit" style="width:150px;height:150px;border-radius:8px;background:#fff;padding:6px">` : "") : fakeQr(String(product.id))}
        <div>
          <h3 style="margin-bottom:.3rem">${t.qr}</h3>
          <p class="muted" style="margin-bottom:.4rem">${t.qrNote} <a href="${AA.esc(passportUrl)}" style="word-break:break-all;text-decoration:underline">${AA.esc(passportUrl)}</a></p>
          <button class="btn btn--primary btn--sm" type="button" id="copy-link">${t.copy}</button>
          <a class="btn btn--outline btn--sm" href="produit.html?id=${product.id}">${AA.icon("arrowLeft")}${AA.t("passport.backToProduct")}</a>
        </div>
      </div>`;
    AA.applyBackgrounds(passport);

    document.getElementById("play-btn").addEventListener("click", () => AA.toast("Pas de vidéo dans cette démonstration", true));
    document.getElementById("copy-link").addEventListener("click", () => {
      const done = () => AA.toast(t.copied);
      if (navigator.clipboard) navigator.clipboard.writeText(passportUrl).then(done, () => AA.toast(passportUrl));
      else AA.toast(passportUrl);
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
