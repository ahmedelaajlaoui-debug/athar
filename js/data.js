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
  dunes: unsplash("1509316785289-025f5b846b35", 1600),
  desert: unsplash("1489493887464-892be6d1daae", 1600),
  morocco: unsplash("1539020140153-e479b8c22e70", 1600),
  market: unsplash("1547036967-23d11aacaee0", 1600),
  heritage: unsplash("1531219572328-a0171b4448a3", 1600),
  workshop: unsplash("1573855619003-97b4799dcd8b", 1200),
  coast: unsplash("1469474968028-56623f02e42e", 1200),
};

/* One small pool of photos per craft category */
const categoryPhotos = {
  Bijoux: [unsplash("1603561591411-07134e71a2a9"), unsplash("1535632066927-ab7c9ab60908"), unsplash("1573855619003-97b4799dcd8b")],
  Tapis: [unsplash("1600166898405-da9535204843"), unsplash("1584100936595-c0654b55a2e2"), unsplash("1547036967-23d11aacaee0")],
  Cuir: [unsplash("1590874103328-eac38a683ce7"), unsplash("1531219572328-a0171b4448a3"), unsplash("1539020140153-e479b8c22e70")],
  Melhfa: [unsplash("1539020140153-e479b8c22e70"), unsplash("1547036967-23d11aacaee0"), unsplash("1531219572328-a0171b4448a3")],
  Bakhour: [unsplash("1531219572328-a0171b4448a3"), unsplash("1590874103328-eac38a683ce7"), unsplash("1535632066927-ab7c9ab60908")],
};

AA.categories = ["Bijoux", "Tapis", "Cuir", "Melhfa", "Bakhour"];

/* ---------- Destinations ---------- */
/* x / y = position on the illustrated map, in % */
AA.cities = [
  { id: "laayoune", name: "Laâyoune", x: 54, y: 17, photo: AA.photos.coast,
    intro: "Grande ville du Sahara marocain, point de départ des expéditions mutualisées ATHAR.",
    crafts: ["Bijoux", "Bakhour", "Melhfa"] },
  { id: "dakhla", name: "Dakhla", x: 15, y: 86, photo: AA.photos.dunes,
    intro: "Entre océan et désert, une presqu'île où se rencontrent tissage, tapis et savoir-faire des femmes de la région.",
    crafts: ["Tapis", "Melhfa", "Bijoux"] },
  { id: "smara", name: "Smara", x: 76, y: 25, photo: AA.photos.desert,
    intro: "Ville de l'intérieur, connue pour son artisanat du cuir et ses ateliers de textiles.",
    crafts: ["Cuir", "Tapis", "Bijoux"] },
  { id: "boujdour", name: "Boujdour", x: 36, y: 38, photo: AA.photos.market,
    intro: "Ville côtière où l'on travaille le cuir et la melhfa, étoffe portée par les femmes hassanies.",
    crafts: ["Cuir", "Melhfa"] },
];

/* ---------- Artisans (fictional demo profiles) ---------- */
AA.artisans = [
  { id: "a1", name: "Fatima El Mansouri", coop: "Coopérative Al Amal", city: "Laâyoune", craft: "Bijoux", specialty: "Bijoux en argent ciselé", verified: true,
    bio: "Fatima travaille l'argent depuis plus de vingt ans (profil fictif de démonstration). Elle transmet la ciselure traditionnelle aux jeunes de la coopérative.",
    techniques: "Fonte, ciselure et sertissage manuel", photo: unsplash("1573855619003-97b4799dcd8b", 600) },
  { id: "a2", name: "Aïcha Boulahcen", coop: "Coopérative Nour Dakhla", city: "Dakhla", craft: "Tapis", specialty: "Tapis tissés à la main", verified: true,
    bio: "Aïcha dirige un atelier de tissage de tapis à Dakhla (profil fictif de démonstration), avec des laines teintes de façon naturelle.",
    techniques: "Tissage sur métier horizontal, teinture végétale", photo: unsplash("1531219572328-a0171b4448a3", 600) },
  { id: "a3", name: "Zahra Mohamed", coop: "Atelier Zahra", city: "Smara", craft: "Cuir", specialty: "Maroquinerie et coussins en cuir", verified: false,
    bio: "Zahra façonne le cuir de façon artisanale à Smara (profil fictif de démonstration).",
    techniques: "Découpe, couture à la main, gravure à chaud", photo: unsplash("1590874103328-eac38a683ce7", 600) },
  { id: "a4", name: "Khadija Lkhair", coop: "Coopérative Tissage Boujdour", city: "Boujdour", craft: "Melhfa", specialty: "Melhfas tissées et teintes", verified: true,
    bio: "Khadija crée des melhfas aux couleurs vives (profil fictif de démonstration) et forme des apprenties.",
    techniques: "Teinture, tissage, finitions à la main", photo: unsplash("1539020140153-e479b8c22e70", 600) },
  { id: "a5", name: "Oum El Banine", coop: "Coopérative Parfums du Désert", city: "Laâyoune", craft: "Bakhour", specialty: "Encens et mélanges de bakhour", verified: true,
    bio: "Oum El Banine compose des mélanges d'encens (profil fictif de démonstration) à partir de résines et d'épices.",
    techniques: "Mélange de résines, séchage, conditionnement artisanal", photo: unsplash("1535632066927-ab7c9ab60908", 600) },
  { id: "a6", name: "Saïda Ahmed", coop: "Coopérative Nour Dakhla", city: "Dakhla", craft: "Tapis", specialty: "Tapis et textiles décoratifs", verified: true,
    bio: "Saïda crée des tapis et des textiles de décoration (profil fictif de démonstration).",
    techniques: "Tissage, broderie, assemblage", photo: unsplash("1584100936595-c0654b55a2e2", 600) },
  { id: "a7", name: "Mohamed Salem", coop: "Atelier Salem", city: "Smara", craft: "Bijoux", specialty: "Bagues et bracelets", verified: false,
    bio: "Mohamed est bijoutier à Smara (profil fictif de démonstration).",
    techniques: "Moulage, limage, polissage", photo: unsplash("1603561591411-07134e71a2a9", 600) },
  { id: "a8", name: "Lalla Mariem", coop: "Coopérative Cuir du Sud", city: "Boujdour", craft: "Cuir", specialty: "Sacs et poufs en cuir", verified: true,
    bio: "Lalla Mariem coordonne une coopérative de maroquinerie (profil fictif de démonstration).",
    techniques: "Tannage végétal, couture, teinture", photo: unsplash("1600166898405-da9535204843", 600) },
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

/* ---------- Products ---------- */
/* Short helper to keep the list readable */
function makeProduct(id, name, cat, price, artisan, pop, desc, tech, mat, days, motif, stock) {
  const a = AA.artisans.find((x) => x.id === artisan);
  const pool = categoryPhotos[cat];
  const shift = Number(id.slice(1)) % pool.length;
  const images = [pool[shift], pool[(shift + 1) % pool.length], pool[(shift + 2) % pool.length]];
  return { id, name, cat, price, artisan, city: a.city, coop: a.coop, verified: a.verified, pop, desc, tech, mat, days, motif, stock, images, image: images[0] };
}

AA.products = [
  makeProduct("p1", "Bracelet Hassani", "Bijoux", 280, "a1", 98, "Bracelet en argent orné de pierres bleues, inspiré des parures traditionnelles.", "Ciselure et sertissage à la main", "Argent, pierres bleues", 3, "lune", 8),
  makeProduct("p2", "Bague berbère ciselée", "Bijoux", 190, "a7", 70, "Bague large en argent gravée de motifs géométriques.", "Fonte à la cire perdue et gravure", "Argent", 2, "losange", 12),
  makeProduct("p3", "Collier ambre du désert", "Bijoux", 420, "a1", 85, "Collier de perles et pendentif en argent, pièce élégante pour les grandes occasions.", "Assemblage manuel et ciselure", "Argent, perles d'ambre", 5, "etoile", 5),
  makeProduct("p4", "Fibule traditionnelle", "Bijoux", 340, "a7", 52, "Broche en argent utilisée pour fermer le voile, aujourd'hui portée comme bijou.", "Moulage et polissage", "Argent", 4, "croix", 6),
  makeProduct("p5", "Tapis traditionnel Dakhla", "Tapis", 1200, "a2", 95, "Grand tapis en laine tissé à la main, aux couleurs chaudes.", "Tissage sur métier horizontal", "Laine, teintures végétales", 21, "losange", 4),
  makeProduct("p6", "Petit tapis de prière", "Tapis", 650, "a6", 64, "Tapis de petite taille, idéal comme décoration murale.", "Tissage serré à la main", "Laine de mouton", 10, "dune", 9),
  makeProduct("p7", "Tapis Dunes", "Tapis", 1450, "a2", 78, "Tapis aux lignes ondulées qui rappellent les dunes du Sahara.", "Tissage et teinture naturelle", "Laine, coton", 25, "dune", 3),
  makeProduct("p8", "Coussin brodé", "Tapis", 220, "a6", 48, "Housse de coussin tissée et brodée, parfaite pour un salon.", "Tissage et broderie", "Laine, coton", 4, "etoile", 15),
  makeProduct("p9", "Pouf en cuir naturel", "Cuir", 480, "a8", 82, "Pouf cousu à la main dans un cuir souple teint de façon naturelle.", "Tannage végétal et couture", "Cuir de chèvre", 7, "tente", 7),
  makeProduct("p10", "Sac bandoulière Smara", "Cuir", 560, "a3", 74, "Sac en cuir avec gravure géométrique et fermoir en métal.", "Découpe et gravure à chaud", "Cuir, laiton", 6, "croix", 6),
  makeProduct("p11", "Porte-cartes gravé", "Cuir", 140, "a3", 55, "Petit porte-cartes en cuir, idéal comme cadeau.", "Couture à la main", "Cuir", 2, "losange", 20),
  makeProduct("p12", "Babouches du désert", "Cuir", 320, "a8", 66, "Babouches souples, cousues à la main.", "Découpe et couture", "Cuir, fil de coton", 5, "dune", 10),
  makeProduct("p13", "Melhfa tissée", "Melhfa", 900, "a4", 90, "Voile traditionnel porté par les femmes hassanies, tissé dans des couleurs vives.", "Teinture et tissage", "Coton, teintures", 8, "dune", 6),
  makeProduct("p14", "Melhfa indigo", "Melhfa", 780, "a4", 72, "Melhfa bleu profond aux reflets naturels.", "Teinture à l'indigo", "Coton", 7, "etoile", 5),
  makeProduct("p15", "Melhfa de cérémonie", "Melhfa", 1100, "a4", 60, "Étoffe légère avec fines bordures, pour les grandes occasions.", "Tissage fin et broderie", "Coton fin", 12, "lune", 3),
  makeProduct("p16", "Foulard léger", "Melhfa", 260, "a6", 45, "Foulard en tissu léger, inspiré de la melhfa.", "Tissage léger", "Coton", 3, "losange", 18),
  makeProduct("p17", "Bkhour artisanal", "Bakhour", 150, "a5", 88, "Mélange d'encens parfumé pour vos moments de détente.", "Mélange de résines et séchage", "Résines, épices", 3, "tente", 25),
  makeProduct("p18", "Brûle-encens en métal", "Bakhour", 210, "a5", 50, "Brûle-encens décoratif, à poser sur une table ou une étagère.", "Moulage et finition à la main", "Laiton", 4, "etoile", 10),
  makeProduct("p19", "Coffret de bakhour", "Bakhour", 290, "a5", 68, "Trois mélanges d'encens dans un joli coffret.", "Mélange et conditionnement", "Résines, bois, épices", 5, "croix", 8),
  makeProduct("p20", "Bakhour de nuit", "Bakhour", 120, "a5", 40, "Mélange aux notes chaudes, pensé pour les soirées.", "Mélange et séchage", "Résines, épices", 3, "lune", 22),
];

/* Story text used by the passport page (illustrative, not a historical claim) */
AA.passportStory = (p) =>
  `Cette pièce, « ${p.name} », est une création de démonstration réalisée à ${p.city} avec la technique « ${p.tech.toLowerCase()} ». ` +
  `Son histoire est illustrative : sur la vraie plateforme, chaque artisan raconterait ici l'origine de la pièce, ses gestes et ce qu'elle représente pour lui.`;

/* ---------- Experiences ---------- */
AA.experiences = [
  { id: "e1", title: "Visite d'atelier d'argenterie", type: "Visite", city: "Laâyoune", duration: "2 heures", price: 150, photo: AA.photos.workshop, desc: "Découvrez comment un bijou prend forme, du métal brut à la pièce finie." },
  { id: "e2", title: "Initiation à la ciselure", type: "Atelier", city: "Laâyoune", duration: "3 heures", price: 350, photo: unsplash("1603561591411-07134e71a2a9"), desc: "Réalisez votre propre petit pendentif sous la guidance d'un artisan." },
  { id: "e3", title: "Atelier de tissage", type: "Atelier", city: "Dakhla", duration: "2 heures", price: 280, photo: unsplash("1600166898405-da9535204843"), desc: "Essayez le métier à tisser et comprenez le travail de la laine." },
  { id: "e4", title: "Visite d'une coopérative de cuir", type: "Visite", city: "Smara", duration: "1 h 30", price: 120, photo: unsplash("1590874103328-eac38a683ce7"), desc: "Rencontrez l'équipe et observez les étapes de fabrication du cuir." },
  { id: "e5", title: "Cérémonie du thé sahraoui", type: "Culture", city: "Dakhla", duration: "1 h 30", price: 180, photo: AA.photos.dunes, desc: "Un moment de partage autour du thé, avec histoires et musique locale." },
  { id: "e6", title: "Soirée contes et bakhour", type: "Culture", city: "Boujdour", duration: "2 heures", price: 200, photo: AA.photos.desert, desc: "Contes du désert et découverte des encens traditionnels." },
];

/* ---------- Stories (illustrative) ---------- */
AA.stories = [
  { id: "s1", title: "Le geste de l'argent", text: "Chaque bijou naît de gestes répétés : chauffer, marteler, ciseler. Ce récit est une illustration pour la démonstration.", photo: AA.photos.workshop, link: "artisans.html" },
  { id: "s2", title: "La melhfa, couleur du désert", text: "La melhfa se porte au quotidien et lors des fêtes. Texte illustratif, à remplacer par des témoignages réels.", photo: AA.photos.morocco, link: "boutique.html?cat=Melhfa" },
  { id: "s3", title: "Le parfum du bakhour", text: "Résines et épices composent des parfums qui accompagnent l'accueil. Contenu illustratif de démonstration.", photo: AA.photos.heritage, link: "boutique.html?cat=Bakhour" },
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
