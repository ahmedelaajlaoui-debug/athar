/* ==========================================================
   data.js — sample data shared by all pages
   Everything here is ILLUSTRATIVE demo data (fictional
   artisans, prices and counters). Replace it with real data
   from a backend when the project grows.
   ========================================================== */

const AA = {};

/* ---------- Photos ----------
   Remote photos (Unsplash). If one fails to load, main.js swaps
   in a generated illustration, so the site never looks broken. */
const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

AA.photos = {
  dunes: "assets/images/covers/dunes.svg",
  desert: "assets/images/covers/desert.svg",
  morocco: "assets/images/covers/morocco.svg",
  market: "assets/images/covers/market.svg",
  heritage: "assets/images/covers/heritage.svg",
  workshop: "assets/images/covers/workshop.svg",
  coast: "assets/images/covers/coast.svg",
};

/* One small pool of photos per product category (used when a product has no photo) */
const categoryPhotos = {
  Lait: ["assets/images/products/halib-sakya-al-hamra-lben.jpg", "assets/images/products/halib-dakhla-lait-de-chamelle.jpg", "assets/images/products/halib-sakya-al-hamra-beurre.jpg"],
  Argan: ["assets/images/products/al-bouraq-huile-d-argan.jpg", "assets/images/products/al-bouraq-amlou-prestige.jpg"],
  Huiles: ["assets/images/products/lamsa-sahraouia-huile-de-romarin.jpg", "assets/images/products/aachab-oued-noun-huile-de-thym.jpg", "assets/images/products/lamsa-sahraouia-regalisse.jpg"],
  Cosmétique: ["assets/images/products/rayhana-sel-de-bain.jpg", "assets/images/products/ahl-al-jid-savon.jpg", "assets/images/products/rayhana-masque-nila.jpg"],
  Miel: ["assets/images/products/adouar-miel-de-sidr.jpg", "assets/images/products/adouar-miel-de-chardon.jpg"],
  Épicerie: ["assets/images/products/ahl-al-jid-khlii.jpg", "assets/images/products/wifaq-laayoune-coucsous-talthi.jpg", "assets/images/products/ahl-al-jid-tidkit.jpg"],
  Tourisme: ["assets/images/products/alaasli-asyaha-tentes-sahariennes.jpg", "assets/images/products/alaasli-asyaha-resturation.jpg"],
};

AA.categories = ["Lait", "Argan", "Huiles", "Cosmétique", "Miel", "Épicerie", "Tourisme"];

/* ---------- Destinations ---------- */
/* x / y = position on the illustrated map, in % */
AA.cities = [
  { id: "laayoune", name: "Laâyoune", x: 54, y: 17, photo: AA.photos.coast,
    intro: "Grande ville du Sahara marocain, point de départ des expéditions mutualisées ATHAR.",
    crafts: ["Épicerie", "Lait", "Tourisme"] },
  { id: "dakhla", name: "Dakhla", x: 15, y: 86, photo: AA.photos.dunes,
    intro: "Entre océan et désert, une presqu'île où se rencontrent tissage, tapis et savoir-faire des femmes de la région.",
    crafts: ["Lait"] },
  { id: "smara", name: "Smara", x: 76, y: 25, photo: AA.photos.desert,
    intro: "Ville de l'intérieur, connue pour son artisanat du cuir et ses ateliers de textiles.",
    crafts: ["Épicerie", "Cosmétique"] },
  { id: "boujdour", name: "Boujdour", x: 36, y: 38, photo: AA.photos.market,
    intro: "Ville côtière où l'on travaille le cuir et la melhfa, étoffe portée par les femmes hassanies.",
    crafts: [] },
];

/* ---------- Coopératives (source : fichier ATHAR_cooperativesproducts_VF.xlsx) ---------- */
AA.artisans = [
  { id: "c001", name: "HALIB DAKHLA", coop: "HALIB DAKHLA", city: "Dakhla", craft: "Lait", specialty: "Lait et dérivés", verified: true, bio: "Coopérative spécialisée dans la production et la transformation du lait et de ses dérivés, notamment issus de l'élevage camelin.", region: "Dakhla-Oued Ed Dahab", locality: "Tawarta 1, commune d’El Argoub, Dakhla", certification: "ONSSA", photo: "assets/images/coops/halib-dakhla.jpg" },
  { id: "c003", name: "LAMSA SAHRAOUIA", coop: "LAMSA SAHRAOUIA", city: "Guelmim", craft: "Huiles", specialty: "Produits naturels et cosmétiques", verified: true, bio: "Une gamme comprenant des huiles naturelles et des produits de nettoyage et cosmétiques issus notamment de l'argan et des amandes.", region: "Guelmim-Oued Noun", locality: "Quartier Tiyert, Guelmim", certification: "HFO.67.66.23", photo: "assets/images/coops/lamsa-sahraouia.jpg" },
  { id: "c005", name: "AL BOURAQ", coop: "AL BOURAQ", city: "Guelmim", craft: "Argan", specialty: "Argan et dérivés", verified: true, bio: "Coopérative fondée en 2016 à Guelmim, qui travaille autour de l'argan : amlou et huiles végétales.", region: "Guelmim-Oued Noun", locality: "Commune de Takanat, Guelmim", certification: "HFO.67.86.24 ; PPV 67.87.24", photo: "assets/images/coops/al-bouraq.jpg" },
  { id: "c006", name: "ADOUAR", coop: "ADOUAR", city: "Sidi Ifni", craft: "Miel", specialty: "Miel, argan et amlou", verified: true, bio: "Coopérative fondée en 2016 à Sidi Ifni, active dans le miel, l'argan et l'amlou.", region: "Guelmim-Oued Noun", locality: "Douar Adhamou Lahrwash, commune de Tiyoughza, Sidi Ifni", certification: "ONSSA", photo: "assets/images/coops/adouar.jpg" },
  { id: "c008", name: "WIFAQ LAAYOUNE", coop: "WIFAQ LAAYOUNE", city: "Laâyoune", craft: "Épicerie", specialty: "Couscous", verified: true, bio: "Coopérative fondée en 2016 par cinq femmes, spécialisée dans la production de couscous.", region: "Laâyoune-Sakia El Hamra", locality: "Quartier Al Qods, lotissement Al Wifaq, n° 815, Laâyoune", certification: "ONSSA", photo: "assets/images/coops/wifaq-laayoune.jpg" },
  { id: "c010", name: "AHL AL JID", coop: "AHL AL JID", city: "Smara", craft: "Épicerie", specialty: "Produits alimentaires", verified: true, bio: "Fondée à Smara par neuf jeunes porteurs de projet sahraouis, la coopérative valorise la viande de chameau et préserve le patrimoine culinaire sahraoui.", region: "Laâyoune-Sakia El Hamra", locality: "Smara", certification: "ONSSA", photo: "assets/images/coops/ahl-al-jid.jpg" },
  { id: "c012", name: "AACHAB OUED NOUN", coop: "AACHAB OUED NOUN", city: "Guelmim", craft: "Huiles", specialty: "Plantes médicinales et aromatiques", verified: true, bio: "Créée en 2024 par neuf membres, dont sept femmes, la coopérative valorise les plantes aromatiques et médicinales locales.", region: "Guelmim-Oued Noun", locality: "Hay Tayert Soufla, Bloc C, Rue El Houda N°48, Guelmim", nameAr: "أعشاب واد نون", certification: "Certification sanitaire", photo: "assets/images/coops/aachab-oued-noun.jpg" },
  { id: "c013", name: "RAYHANA", coop: "RAYHANA", city: "Agadir", craft: "Cosmétique", specialty: "Cosmétiques", verified: false, bio: "Coopérative de cosmétiques naturels basée à Agadir.", region: "Agadir", locality: "Agadir", photo: "assets/images/coops/rayhana.jpg" },
  { id: "c014", name: "HALIB SAKIA AL HAMRA", coop: "HALIB SAKIA AL HAMRA", city: "Laâyoune", craft: "Lait", specialty: "Lait et dérivés", verified: false, bio: "Coopérative agricole de la région de Laâyoune-Sakia El Hamra : lben, yaourt et beurre.", region: "Laâyoune-Sakia El Hamra", locality: "Laâyoune", certification: "Agrément sanitaire", photo: "assets/images/coops/halib-sakia-al-hamra.jpg" },
  { id: "c015", name: "ALAASLI ASYAHA", coop: "ALAASLI ASYAHA", city: "Laâyoune", craft: "Tourisme", specialty: "Tourisme", verified: false, bio: "Coopérative de tourisme : restauration et tentes sahariennes.", region: "Laâyoune-Sakia El Hamra", locality: "Laâyoune", photo: "assets/images/coops/alaasli-asyaha.jpg" },
];

/* ---------- Motifs (illustrative meanings) ---------- */
AA.motifs = [
  { id: "lune", name: "Motif du croissant", meaning: "Souvent associé au renouveau et à la protection.",
    svg: '<path d="M62 12a38 38 0 1 0 0 76 30 30 0 1 1 0-76z" fill="currentColor"/>' },
  { id: "etoile", name: "Motif de l'étoile", meaning: "Évoque l'orientation dans le désert et la lumière de la nuit.",
    svg: '<path d="M50 8l9 31 31 11-31 11-9 31-9-31-31-11 31-11z" fill="currentColor"/>' },
  { id: "croix", name: "Motif en croix", meaning: "Représente l'équilibre et les quatre directions.",
    svg: '<path d="M42 8h16v34h34v16H58v34H42V58H8V42h34z" fill="currentColor"/>' },
  { id: "losange", name: "Motif du losange", meaning: "Forme répétée dans le tissage, symbole d'abondance et de continuité.",
    svg: '<path d="M50 6l44 44-44 44L6 50z M50 26L26 50l24 24 24-24z" fill="currentColor" fill-rule="evenodd"/>' },
  { id: "dune", name: "Motif des dunes", meaning: "Les lignes ondulées rappellent le paysage et le mouvement du sable.",
    svg: '<path d="M4 40q23-24 46 0t46 0v12q-23-24-46 0t-46 0z M4 68q23-24 46 0t46 0v12q-23-24-46 0t-46 0z" fill="currentColor"/>' },
  { id: "tente", name: "Motif de la tente", meaning: "Symbolise l'abri, l'hospitalité et la vie nomade.",
    svg: '<path d="M50 10L94 88H6z M50 40L30 76h40z" fill="currentColor" fill-rule="evenodd"/>' },
];

/* ---------- Produits (source : fichier Excel + dossier Products) ---------- */
AA.products = [
  { id: "p1", ref: "P003", name: "Lait de chamelle", cat: "Lait", price: null, priceFrom: false, artisan: "c001", city: "Dakhla", coop: "HALIB DAKHLA", verified: true, pop: 100, desc: "Lait de chamelle — produit de la coopérative HALIB DAKHLA (Dakhla).", stock: 10, images: ["assets/images/products/halib-dakhla-lait-de-chamelle.jpg"], image: "assets/images/products/halib-dakhla-lait-de-chamelle.jpg", videoUrl: "assets/videos/p1.mp4" },
  { id: "p2", ref: "P010", name: "Lḥamis (viande conservée)", cat: "Épicerie", price: 40, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 99, desc: "Lḥamis (viande conservée) — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-lahmis.jpg"], image: "assets/images/products/ahl-al-jid-lahmis.jpg", videoUrl: "assets/videos/p2.mp4" },
  { id: "p3", ref: "P011", name: "Savon", cat: "Cosmétique", price: 50, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 98, desc: "Savon — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-savon.jpg"], image: "assets/images/products/ahl-al-jid-savon.jpg", videoUrl: "assets/videos/p3.mp4" },
  { id: "p4", ref: "P012", name: "Tidkit (mélange d'épices et d'herbes)", cat: "Épicerie", price: 100, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 97, desc: "Tidkit (mélange d'épices et d'herbes) — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-tidkit.jpg"], image: "assets/images/products/ahl-al-jid-tidkit.jpg", videoUrl: "assets/videos/p4.mp4" },
  { id: "p5", ref: "P013", name: "Pommade hydratante", cat: "Cosmétique", price: 50, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 96, desc: "Pommade hydratante — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-pommade.jpg"], image: "assets/images/products/ahl-al-jid-pommade.jpg", videoUrl: "assets/videos/p5.mp4" },
  { id: "p6", ref: "P014", name: "Khlii à la viande de chameau", cat: "Épicerie", price: 100, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 95, desc: "Khlii à la viande de chameau — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-khlii.jpg"], image: "assets/images/products/ahl-al-jid-khlii.jpg", videoUrl: "assets/videos/p6.mp4" },
  { id: "p7", ref: "P015", name: "Lwadka (graisse animale pour cuisine)", cat: "Épicerie", price: 20, priceFrom: true, artisan: "c010", city: "Smara", coop: "AHL AL JID", verified: true, pop: 94, desc: "Lwadka (graisse animale pour cuisine) — produit de la coopérative AHL AL JID (Smara).", stock: 10, images: ["assets/images/products/ahl-al-jid-lwadka.jpg"], image: "assets/images/products/ahl-al-jid-lwadka.jpg", videoUrl: "assets/videos/p7.mp4" },
  { id: "p8", ref: "P016", name: "Huile d'armoise", cat: "Huiles", price: 180, priceFrom: true, artisan: "c012", city: "Guelmim", coop: "AACHAB OUED NOUN", verified: true, pop: 93, desc: "Huile d'armoise — produit de la coopérative AACHAB OUED NOUN (Guelmim).", stock: 10, images: ["assets/images/products/aachab-oued-noun-huile-d-armoise.jpg"], image: "assets/images/products/aachab-oued-noun-huile-d-armoise.jpg", videoUrl: "assets/videos/p8.mp4" },
  { id: "p9", ref: "P029", name: "Huile de thym", cat: "Huiles", price: 180, priceFrom: true, artisan: "c012", city: "Guelmim", coop: "AACHAB OUED NOUN", verified: true, pop: 92, desc: "Huile de thym — produit de la coopérative AACHAB OUED NOUN (Guelmim).", stock: 10, images: ["assets/images/products/aachab-oued-noun-huile-de-thym.jpg"], image: "assets/images/products/aachab-oued-noun-huile-de-thym.jpg", videoUrl: "assets/videos/p9.mp4" },
  { id: "p10", ref: "P030", name: "Huile de lavande", cat: "Huiles", price: 120, priceFrom: true, artisan: "c012", city: "Guelmim", coop: "AACHAB OUED NOUN", verified: true, pop: 91, desc: "Huile de lavande — produit de la coopérative AACHAB OUED NOUN (Guelmim).", stock: 10, images: [], image: "", videoUrl: "assets/videos/p10.mp4" },
  { id: "p11", ref: "P017", name: "Lben", cat: "Lait", price: 5, priceFrom: true, artisan: "c014", city: "Laâyoune", coop: "HALIB SAKIA AL HAMRA", verified: false, pop: 90, desc: "Lben — produit de la coopérative HALIB SAKIA AL HAMRA (Laâyoune).", stock: 10, images: ["assets/images/products/halib-sakya-al-hamra-lben.jpg"], image: "assets/images/products/halib-sakya-al-hamra-lben.jpg", videoUrl: "assets/videos/p11.mp4" },
  { id: "p12", ref: "P018", name: "Yaourt à boire", cat: "Lait", price: 3, priceFrom: true, artisan: "c014", city: "Laâyoune", coop: "HALIB SAKIA AL HAMRA", verified: false, pop: 89, desc: "Yaourt à boire — produit de la coopérative HALIB SAKIA AL HAMRA (Laâyoune).", stock: 10, images: ["assets/images/products/halib-sakya-al-hamra-yaourt-a-boire.jpg"], image: "assets/images/products/halib-sakya-al-hamra-yaourt-a-boire.jpg", videoUrl: "assets/videos/p12.mp4" },
  { id: "p13", ref: "P019", name: "Beurre", cat: "Lait", price: 4, priceFrom: true, artisan: "c014", city: "Laâyoune", coop: "HALIB SAKIA AL HAMRA", verified: false, pop: 88, desc: "Beurre — produit de la coopérative HALIB SAKIA AL HAMRA (Laâyoune).", stock: 10, images: ["assets/images/products/halib-sakya-al-hamra-beurre.jpg"], image: "assets/images/products/halib-sakya-al-hamra-beurre.jpg", videoUrl: "assets/videos/p13.mp4" },
  { id: "p14", ref: "P020", name: "Huile essentielle de clou de girofle", cat: "Huiles", price: 40, priceFrom: true, artisan: "c003", city: "Guelmim", coop: "LAMSA SAHRAOUIA", verified: true, pop: 87, desc: "Huile essentielle de clou de girofle — produit de la coopérative LAMSA SAHRAOUIA (Guelmim).", stock: 10, images: ["assets/images/products/lamsa-sahraouia-huile-essentielle-de-girofle.jpg"], image: "assets/images/products/lamsa-sahraouia-huile-essentielle-de-girofle.jpg", videoUrl: "assets/videos/p14.mp4" },
  { id: "p15", ref: "P021", name: "Huile de graines de lin", cat: "Huiles", price: 25, priceFrom: true, artisan: "c003", city: "Guelmim", coop: "LAMSA SAHRAOUIA", verified: true, pop: 86, desc: "Huile de graines de lin — produit de la coopérative LAMSA SAHRAOUIA (Guelmim).", stock: 10, images: ["assets/images/products/lamsa-sahraouia-huile-de-graines-de-lin.jpg"], image: "assets/images/products/lamsa-sahraouia-huile-de-graines-de-lin.jpg", videoUrl: "assets/videos/p15.mp4" },
  { id: "p16", ref: "P022", name: "Huile de réglisse", cat: "Huiles", price: 50, priceFrom: true, artisan: "c003", city: "Guelmim", coop: "LAMSA SAHRAOUIA", verified: true, pop: 85, desc: "Huile de réglisse — produit de la coopérative LAMSA SAHRAOUIA (Guelmim).", stock: 10, images: ["assets/images/products/lamsa-sahraouia-regalisse.jpg"], image: "assets/images/products/lamsa-sahraouia-regalisse.jpg", videoUrl: "assets/videos/p16.mp4" },
  { id: "p17", ref: "P022b", name: "Huile de romarin", cat: "Huiles", price: 50, priceFrom: true, artisan: "c003", city: "Guelmim", coop: "LAMSA SAHRAOUIA", verified: true, pop: 84, desc: "Huile de romarin — produit de la coopérative LAMSA SAHRAOUIA (Guelmim).", stock: 10, images: ["assets/images/products/lamsa-sahraouia-huile-de-romarin.jpg"], image: "assets/images/products/lamsa-sahraouia-huile-de-romarin.jpg", videoUrl: "assets/videos/p17.mp4" },
  { id: "p18", ref: "P023", name: "Huile d'argan 30 ml", cat: "Argan", price: 50, priceFrom: true, artisan: "c005", city: "Guelmim", coop: "AL BOURAQ", verified: true, pop: 83, desc: "Huile d'argan 30 ml — produit de la coopérative AL BOURAQ (Guelmim).", stock: 10, images: ["assets/images/products/al-bouraq-huile-d-argan.jpg"], image: "assets/images/products/al-bouraq-huile-d-argan.jpg", videoUrl: "assets/videos/p18.mp4" },
  { id: "p19", ref: "P024", name: "Amlou Prestige à base de caroube", cat: "Argan", price: 70, priceFrom: true, artisan: "c005", city: "Guelmim", coop: "AL BOURAQ", verified: true, pop: 82, desc: "Amlou Prestige à base de caroube — produit de la coopérative AL BOURAQ (Guelmim).", stock: 10, images: ["assets/images/products/al-bouraq-amlou-prestige.jpg"], image: "assets/images/products/al-bouraq-amlou-prestige.jpg", videoUrl: "assets/videos/p19.mp4" },
  { id: "p20", ref: "P025", name: "Miel de chardon", cat: "Miel", price: 150, priceFrom: true, artisan: "c006", city: "Sidi Ifni", coop: "ADOUAR", verified: true, pop: 81, desc: "Miel de chardon — produit de la coopérative ADOUAR (Sidi Ifni).", stock: 10, images: ["assets/images/products/adouar-miel-de-chardon.jpg"], image: "assets/images/products/adouar-miel-de-chardon.jpg", videoUrl: "assets/videos/p20.mp4" },
  { id: "p21", ref: "P026", name: "Miel de sidr (jujubier)", cat: "Miel", price: 200, priceFrom: true, artisan: "c006", city: "Sidi Ifni", coop: "ADOUAR", verified: true, pop: 80, desc: "Miel de sidr (jujubier) — produit de la coopérative ADOUAR (Sidi Ifni).", stock: 10, images: ["assets/images/products/adouar-miel-de-sidr.jpg"], image: "assets/images/products/adouar-miel-de-sidr.jpg", videoUrl: "assets/videos/p21.mp4" },
  { id: "p22", ref: "P027", name: "Couscous tlathi", cat: "Épicerie", price: 8, priceFrom: true, artisan: "c008", city: "Laâyoune", coop: "WIFAQ LAAYOUNE", verified: true, pop: 79, desc: "Couscous tlathi — produit de la coopérative WIFAQ LAAYOUNE (Laâyoune).", stock: 10, images: ["assets/images/products/wifaq-laayoune-coucsous-talthi.jpg"], image: "assets/images/products/wifaq-laayoune-coucsous-talthi.jpg", videoUrl: "assets/videos/p22.mp4" },
  { id: "p23", ref: "P028", name: "Couscous khoumassi type 1", cat: "Épicerie", price: 10, priceFrom: true, artisan: "c008", city: "Laâyoune", coop: "WIFAQ LAAYOUNE", verified: true, pop: 78, desc: "Couscous khoumassi type 1 — produit de la coopérative WIFAQ LAAYOUNE (Laâyoune).", stock: 10, images: ["assets/images/products/wifaq-laayoune-couscous-khoumassi-type1.jpg"], image: "assets/images/products/wifaq-laayoune-couscous-khoumassi-type1.jpg", videoUrl: "assets/videos/p23.mp4" },
  { id: "p24", ref: "P031", name: "Sel de bain naturel", cat: "Cosmétique", price: 25, priceFrom: true, artisan: "c013", city: "Agadir", coop: "RAYHANA", verified: false, pop: 77, desc: "Sel de bain naturel — produit de la coopérative RAYHANA (Agadir).", stock: 10, images: ["assets/images/products/rayhana-sel-de-bain.jpg"], image: "assets/images/products/rayhana-sel-de-bain.jpg", videoUrl: "assets/videos/p24.mp4" },
  { id: "p25", ref: "P032", name: "Masque Nila sahraouia", cat: "Cosmétique", price: 150, priceFrom: true, artisan: "c013", city: "Agadir", coop: "RAYHANA", verified: false, pop: 76, desc: "Masque Nila sahraouia — produit de la coopérative RAYHANA (Agadir).", stock: 10, images: ["assets/images/products/rayhana-masque-nila.jpg"], image: "assets/images/products/rayhana-masque-nila.jpg", videoUrl: "assets/videos/p25.mp4" },
  { id: "p26", ref: "P033", name: "Restauration", cat: "Tourisme", price: 3, priceFrom: true, artisan: "c015", city: "Laâyoune", coop: "ALAASLI ASYAHA", verified: false, pop: 75, desc: "Restauration — produit de la coopérative ALAASLI ASYAHA (Laâyoune).", stock: 10, images: ["assets/images/products/alaasli-asyaha-resturation.jpg"], image: "assets/images/products/alaasli-asyaha-resturation.jpg", videoUrl: "assets/videos/p26.mp4" },
  { id: "p27", ref: "P034", name: "Tentes sahariennes (différentes tailles)", cat: "Tourisme", price: 100, priceFrom: true, artisan: "c015", city: "Laâyoune", coop: "ALAASLI ASYAHA", verified: false, pop: 74, desc: "Tentes sahariennes (différentes tailles) — produit de la coopérative ALAASLI ASYAHA (Laâyoune).", stock: 10, images: ["assets/images/products/alaasli-asyaha-tentes-sahariennes.jpg"], image: "assets/images/products/alaasli-asyaha-tentes-sahariennes.jpg", videoUrl: "assets/videos/p27.mp4" },
];

/* Story text used by the passport page */
AA.passportStory = (p) =>
  `« ${p.name} » est un produit de la coopérative ${p.coop}, à ${p.city}.`;

/* ---------- Experiences ---------- */
AA.experiences = [
  { id: "e1", title: "Visite d'atelier d'argenterie", type: "Visite", city: "Laâyoune", duration: "2 heures", price: 150, photo: AA.photos.workshop, desc: "Découvrez comment un bijou prend forme, du métal brut à la pièce finie." },
  { id: "e2", title: "Initiation à la ciselure", type: "Atelier", city: "Laâyoune", duration: "3 heures", price: 350, photo: AA.photos.dunes, desc: "Réalisez votre propre petit pendentif sous la guidance d'un artisan." },
  { id: "e3", title: "Atelier de tissage", type: "Atelier", city: "Dakhla", duration: "2 heures", price: 280, photo: AA.photos.heritage, desc: "Essayez le métier à tisser et comprenez le travail de la laine." },
  { id: "e4", title: "Visite d'une coopérative de cuir", type: "Visite", city: "Smara", duration: "1 h 30", price: 120, photo: AA.photos.market, desc: "Rencontrez l'équipe et observez les étapes de fabrication du cuir." },
  { id: "e5", title: "Cérémonie du thé sahraoui", type: "Culture", city: "Dakhla", duration: "1 h 30", price: 180, photo: AA.photos.desert, desc: "Un moment de partage autour du thé, avec histoires et musique locale." },
  { id: "e6", title: "Soirée contes et bakhour", type: "Culture", city: "Boujdour", duration: "2 heures", price: 200, photo: AA.photos.coast, desc: "Contes du désert et découverte des encens traditionnels." },
];


/* ---------- Small lookups ---------- */
AA.getProduct = (id) => AA.products.find((p) => p.id === id);
AA.getArtisan = (id) => AA.artisans.find((a) => a.id === id);
AA.getMotif = (id) => AA.motifs.find((m) => m.id === id);
AA.getCity = (id) => AA.cities.find((c) => c.id === id);
AA.cityByName = (name) => AA.cities.find((c) => c.name === name);

/* ---------- Shipping (ILLUSTRATIVE prices and delays) ---------- */
/* Delivery destinations of the (simulated) shipping calculator: Saharan towns first, then two large
   delivery hubs. Prices and delays are illustrative; nothing is really shipped. */
AA.shippingCities = [
  { name: "Laâyoune", factor: 0.9 },
  { name: "Dakhla", factor: 1.0 },
  { name: "Smara", factor: 0.95 },
  { name: "Boujdour", factor: 0.95 },
  { name: "Guelmim", factor: 0.9 },
  { name: "Agadir", factor: 1.0 },
  { name: "Casablanca", factor: 1.1 },
];

/* Returns the price (MAD) and delay for one parcel. mode = "pooled" or "express" */
AA.shippingQuote = (cityName, kg, mode) => {
  const city = AA.shippingCities.find((c) => c.name === cityName) || AA.shippingCities[0];
  const weight = Math.max(0.5, kg);
  if (mode === "express") {
    return { price: Math.round((35 + 12 * weight) * city.factor), delay: "1 à 3 jours" };
  }
  return { price: Math.round((20 + 6 * weight) * city.factor), delay: "5 à 8 jours" };
};