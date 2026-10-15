/* ==========================================================
   regions.js — the 7 Saharan destinations of the Explorer
   Used by: index.html, explorer.html (map + cards) and region.html (destination page template)
   Load after data.js and crafts.js (needs AA and AA.tri), before i18n.js.

   - AA.regions        : the destinations, in display order
   - each text field   : { fr, en, ar }  → read it with AA.rt(field)
   - AA.regionById(id) : lookup (ids are the URL parameter: ?city=laayoune)
   - AA.mapProject()   : real latitude / longitude → position on the illustrated map
   - AA.MAP_SHAPES     : simplified Atlantic coastline used to draw the illustrated map

   CONTENT RULES: general, simplified introductions about local culture. No cooperative, business,
   address, phone or contact is named. No administrative boundary or border is drawn or claimed:
   places are only named and located by their coordinates. Where reliable information was not
   compiled, `crafts` is empty and `craftNote` says so.
   Add a destination = one object here (three-language texts) — nothing else to change.
   ========================================================== */

AA.regions = [
  {
    id: "laayoune", lat: 27.15, lon: -13.2, label: "r", theme: "desert", icon: "dune",
    name: tri("Laâyoune", "Laayoune", "العيون"),
    tagline: tri("Grande ville du Sahara marocain, culture hassanie", "Main city of the Moroccan Sahara, Hassani culture", "كبرى مدن الصحراء المغربية والثقافة الحسانية"),
    intro: tri(
      "Laâyoune est la plus grande ville du Sahara marocain, près de l'océan Atlantique. C'est un centre administratif et culturel de la région, et un point de départ pour découvrir la côte et le désert.",
      "Laayoune is the largest city of the Moroccan Sahara, near the Atlantic Ocean. It is an administrative and cultural centre of the region and a starting point to discover the coast and the desert.",
      "العيون أكبر مدن الصحراء المغربية، قرب المحيط الأطلسي. وهي مركز إداري وثقافي في المنطقة ونقطة انطلاق لاكتشاف الساحل والصحراء."),
    identity: tri(
      "La culture hassanie, liée au parler hassaniya, marque la ville : thé partagé, poésie, musique, tente nomade et vêtements comme la melhfa, voile porté par les femmes.",
      "Hassani culture, tied to the Hassaniya dialect, shapes the city: shared tea, poetry, music, the nomad tent and garments such as the melhfa, a veil worn by women.",
      "تطبع الثقافة الحسانية، المرتبطة باللهجة الحسانية، المدينة: الشاي المشترك والشعر والموسيقى والخيمة والأزياء مثل الملحفة، وهي لباس تضعه النساء."),
    discover: [
      { icon: "thread", title: tri("La melhfa", "The melhfa", "الملحفة"),
        text: tri("Ce voile coloré porté par les femmes est l'un des textiles emblématiques du Sahara.", "This colourful veil worn by women is one of the Sahara's emblematic textiles.", "هذا اللباس الملوّن الذي تضعه النساء من أبرز الأقمشة الرمزية في الصحراء.") },
      { icon: "users", title: tri("Le thé sahraoui", "Saharan tea", "الشاي الصحراوي"),
        text: tri("Le service du thé, en plusieurs verres, est un moment central de l'hospitalité.", "Serving tea, in several glasses, is a central moment of hospitality.", "يُعدّ تقديم الشاي على عدة كؤوس لحظة أساسية في الضيافة.") },
      { icon: "wave", title: tri("La côte atlantique", "The Atlantic coast", "الساحل الأطلسي"),
        text: tri("Près de la ville, la côte offre de longues plages au bord du désert, comme celle de Foum El Oued.", "Near the city, the coast offers long beaches on the edge of the desert, such as Foum El Oued.", "قرب المدينة يقدم الساحل شواطئ طويلة على حافة الصحراء، مثل شاطئ فم الواد.") },
    ],
    crafts: ["melhfa", "tapis", "bijoux", "bakhour"],
    craftNote: tri("Ces savoir-faire sont associés plus largement à la culture hassanie du Sahara.", "These skills are associated more broadly with the Hassani culture of the Sahara.", "ترتبط هذه المهارات بالثقافة الحسانية في الصحراء عمومًا."),
  },
  {
    id: "dakhla", lat: 23.71, lon: -15.93, label: "r", theme: "coast", icon: "wave",
    name: tri("Dakhla", "Dakhla", "الداخلة"),
    tagline: tri("Presqu'île entre océan et désert", "A peninsula between ocean and desert", "شبه جزيرة بين المحيط والصحراء"),
    intro: tri(
      "Dakhla s'étire sur une presqu'île au bord d'une vaste lagune, entre l'océan Atlantique et le désert. Elle est connue pour ses paysages, sa pêche et les sports de glisse.",
      "Dakhla stretches along a peninsula beside a vast lagoon, between the Atlantic Ocean and the desert. It is known for its landscapes, fishing and board sports.",
      "تمتد الداخلة على شبه جزيرة بجانب بحيرة واسعة، بين المحيط الأطلسي والصحراء. وتُعرف بمناظرها وصيد السمك والرياضات الشراعية."),
    identity: tri(
      "La ville partage la culture hassanie du Sahara : hospitalité, thé, poésie, textiles. Son économie est liée à la mer, notamment à la pêche et à l'aquaculture.",
      "The city shares the Hassani culture of the Sahara: hospitality, tea, poetry, textiles. Its economy is tied to the sea, notably fishing and aquaculture.",
      "تتقاسم المدينة الثقافة الحسانية للصحراء: الضيافة والشاي والشعر والأقمشة. ويرتبط اقتصادها بالبحر، خاصة الصيد وتربية الأحياء المائية."),
    discover: [
      { icon: "wave", title: tri("La lagune de Dakhla", "The Dakhla lagoon", "بحيرة الداخلة"),
        text: tri("Ses eaux calmes et ses vents réguliers attirent les adeptes du kitesurf et du windsurf.", "Its calm water and steady winds attract kitesurfers and windsurfers.", "تجذب مياهها الهادئة ورياحها المنتظمة هواة التزلج الشراعي.") },
      { icon: "dune", title: tri("Les dunes et le désert", "Dunes and desert", "الكثبان والصحراء"),
        text: tri("Le désert rejoint l'océan : dunes, plages et grands horizons.", "The desert meets the ocean: dunes, beaches and wide horizons.", "تلتقي الصحراء بالمحيط: كثبان وشواطئ وآفاق واسعة.") },
      { icon: "users", title: tri("Pêche et huîtres", "Fishing and oysters", "الصيد والمحار"),
        text: tri("La pêche et l'élevage d'huîtres font partie de la vie économique locale.", "Fishing and oyster farming are part of local economic life.", "يُعدّ الصيد وتربية المحار جزءًا من الحياة الاقتصادية المحلية.") },
    ],
    crafts: ["melhfa", "tapis", "bijoux"],
    craftNote: tri("Ces savoir-faire sont associés plus largement à la culture hassanie du Sahara.", "These skills are associated more broadly with the Hassani culture of the Sahara.", "ترتبط هذه المهارات بالثقافة الحسانية في الصحراء عمومًا."),
  },
  {
    id: "smara", lat: 26.74, lon: -11.67, label: "r", theme: "desert", icon: "landmark",
    name: tri("Smara", "Smara", "السمارة"),
    tagline: tri("Ville de l'intérieur, entre désert et histoire", "An inland city between desert and history", "مدينة داخلية بين الصحراء والتاريخ"),
    intro: tri(
      "Smara se trouve à l'intérieur des terres, au cœur de la région d'Es-Semara. Fondée à la fin du XIXe siècle par le cheikh Ma el-Aïnine, elle a longtemps été un lieu d'étape et de savoir au milieu du désert.",
      "Smara lies inland, in the heart of the Es-Semara region. Founded in the late 19th century by Sheikh Ma al-Aynin, it long served as a place of rest and learning in the middle of the desert.",
      "تقع السمارة في الداخل، في قلب منطقة السمارة. أسسها الشيخ ماء العينين في أواخر القرن التاسع عشر، وظلت طويلًا محطة للاستراحة والعلم وسط الصحراء."),
    identity: tri(
      "Sa culture est hassanie, marquée par la vie nomade, la poésie, le thé et des savoir-faire comme le travail du cuir, le tissage et la bijouterie.",
      "Its culture is Hassani, shaped by nomadic life, poetry, tea and skills such as leatherwork, weaving and jewellery making.",
      "ثقافتها حسانية، طبعتها حياة الترحال والشعر والشاي ومهارات مثل العمل في الجلد والنسيج وصناعة الحلي."),
    discover: [
      { icon: "landmark", title: tri("L'héritage de Ma el-Aïnine", "The legacy of Ma al-Aynin", "إرث ماء العينين"),
        text: tri("Les vestiges de la zaouïa et de l'ancienne kasbah rappellent l'histoire religieuse et savante de la ville.", "The remains of the zawiya and the old kasbah recall the city's religious and scholarly history.", "تذكّر بقايا الزاوية والقصبة القديمة بتاريخ المدينة الديني والعلمي.") },
      { icon: "dune", title: tri("Le désert alentour", "The surrounding desert", "الصحراء المحيطة"),
        text: tri("Plaines de pierres, dunes et grands horizons se découvrent en excursion autour de la ville.", "Stony plains, dunes and wide horizons can be explored on trips around the city.", "تُكتشف السهول الحجرية والكثبان والآفاق الواسعة في رحلات حول المدينة.") },
      { icon: "home", title: tri("La vie sous la tente", "Life in the tent", "الحياة تحت الخيمة"),
        text: tri("La tente et l'élevage de chameaux font partie de la mémoire nomade de la région.", "The tent and camel herding are part of the region's nomadic memory.", "تُعدّ الخيمة وتربية الإبل جزءًا من الذاكرة البدوية للمنطقة.") },
    ],
    crafts: ["cuir", "tapis", "bijoux"],
    craftNote: tri("Ces savoir-faire sont associés plus largement à la culture hassanie du Sahara.", "These skills are associated more broadly with the Hassani culture of the Sahara.", "ترتبط هذه المهارات بالثقافة الحسانية في الصحراء عمومًا."),
  },
  {
    id: "boujdour", lat: 26.13, lon: -14.48, label: "l", theme: "coast", icon: "wave",
    name: tri("Boujdour", "Boujdour", "بوجدور"),
    tagline: tri("Ville côtière, cap et pêche sur l'Atlantique", "Coastal town, cape and fishing on the Atlantic", "مدينة ساحلية ورأس وصيد على الأطلسي"),
    intro: tri(
      "Boujdour est une ville côtière, connue pour son cap sur l'océan Atlantique. Ce cap a longtemps été une limite redoutée des navigateurs, avant d'être franchi par des marins portugais au XVe siècle.",
      "Boujdour is a coastal town known for its cape on the Atlantic Ocean. The cape was long a dreaded limit for sailors before Portuguese mariners sailed past it in the 15th century.",
      "بوجدور مدينة ساحلية تُعرف برأسها على المحيط الأطلسي. وقد ظل هذا الرأس طويلًا حدًّا يخشاه البحارة، قبل أن يتجاوزه بحارة برتغاليون في القرن الخامس عشر."),
    identity: tri(
      "La pêche rythme la vie locale, et la culture hassanie s'exprime dans le thé, la poésie et les textiles comme la melhfa.",
      "Fishing shapes local life, and Hassani culture is expressed through tea, poetry and textiles such as the melhfa.",
      "يطبع الصيد الحياة المحلية، وتتجلى الثقافة الحسانية في الشاي والشعر والأقمشة مثل الملحفة."),
    discover: [
      { icon: "landmark", title: tri("Le cap et le phare", "The cape and lighthouse", "الرأس والمنارة"),
        text: tri("Le cap Boujdour et son phare sont l'un des repères de cette côte.", "Cape Boujdour and its lighthouse are among the landmarks of this coast.", "يُعدّ رأس بوجدور ومنارته من معالم هذا الساحل.") },
      { icon: "wave", title: tri("La pêche", "Fishing", "الصيد"),
        text: tri("Le port et la vente du poisson font partie du quotidien de la ville.", "The port and the fish sale are part of the town's daily life.", "الميناء وبيع السمك جزء من يوميات المدينة.") },
      { icon: "thread", title: tri("Melhfa et tissage", "Melhfa and weaving", "الملحفة والنسيج"),
        text: tri("Les étoffes colorées font partie de l'identité vestimentaire locale.", "Colourful fabrics are part of the local clothing identity.", "الأقمشة الملونة جزء من هوية اللباس المحلية.") },
    ],
    crafts: ["melhfa", "cuir"],
    craftNote: tri("Ces savoir-faire sont associés plus largement à la culture hassanie du Sahara.", "These skills are associated more broadly with the Hassani culture of the Sahara.", "ترتبط هذه المهارات بالثقافة الحسانية في الصحراء عمومًا."),
  },
  {
    id: "tarfaya", lat: 27.94, lon: -12.92, label: "l", theme: "coast", icon: "scroll",
    name: tri("Tarfaya", "Tarfaya", "طرفاية"),
    tagline: tri("Cap Juby, l'Aéropostale et le vent de l'Atlantique", "Cape Juby, the Aéropostale and the Atlantic wind", "رأس جوبي والأيروبوستال ورياح الأطلسي"),
    intro: tri(
      "Tarfaya est une petite ville de la côte atlantique, face aux îles Canaries. Elle était autrefois connue sous le nom de Cap Juby.",
      "Tarfaya is a small town on the Atlantic coast, facing the Canary Islands. It was formerly known as Cape Juby.",
      "طرفاية مدينة صغيرة على الساحل الأطلسي، قبالة جزر الكناري. وكانت تُعرف قديمًا باسم رأس جوبي."),
    identity: tri(
      "Escale de l'Aéropostale dans les années 1920, elle a accueilli l'écrivain-pilote Antoine de Saint-Exupéry, qui y a dirigé l'escale en 1927-1928. Une culture hassanie de pêcheurs et de nomades s'y mêle à cette mémoire.",
      "A stop for the Aéropostale air-mail line in the 1920s, it welcomed the writer-pilot Antoine de Saint-Exupéry, who ran the stopover there in 1927–1928. A Hassani culture of fishermen and nomads blends with this memory.",
      "كانت محطة لخط الأيروبوستال البريدي الجوي في عشرينيات القرن الماضي، واستقبلت الكاتب الطيار أنطوان دو سانت إكزوبيري الذي أدار المحطة فيها بين 1927 و1928. وتمتزج بهذه الذاكرة ثقافة حسانية للصيادين والرحّل."),
    discover: [
      { icon: "scroll", title: tri("Souvenirs de l'Aéropostale", "Memories of the Aéropostale", "ذكريات الأيروبوستال"),
        text: tri("L'histoire des pilotes de l'Aéropostale, dont Saint-Exupéry, fait partie de la mémoire de la ville.", "The story of the Aéropostale pilots, including Saint-Exupéry, is part of the town's memory.", "تاريخ طياري الأيروبوستال، ومنهم سانت إكزوبيري، جزء من ذاكرة المدينة.") },
      { icon: "wave", title: tri("La côte et le vent", "Coast and wind", "الساحل والرياح"),
        text: tri("De longues plages et un vent presque constant caractérisent cette côte.", "Long beaches and an almost constant wind characterise this coast.", "تتميز هذه السواحل بشواطئ طويلة ورياح شبه دائمة.") },
      { icon: "landmark", title: tri("Casa Mar", "Casa Mar", "كازا مار"),
        text: tri("Cet ancien comptoir commercial, bâti près du rivage, rappelle l'histoire maritime de la ville.", "This former trading post, built near the shore, recalls the town's maritime history.", "يذكّر هذا المركز التجاري القديم، المبني قرب الشاطئ، بتاريخ المدينة البحري.") },
    ],
    crafts: [],
    craftNote: tri("Les savoir-faire hassanis, comme la melhfa et le thé, se retrouvent aussi ici. Fiche artisanale locale à compléter avec des sources fiables.", "Hassani skills, such as the melhfa and tea, are found here too. Local craft page still to be completed with reliable sources.", "تحضر هنا أيضًا المهارات الحسانية مثل الملحفة والشاي. وبطاقة الحرف المحلية ما تزال قيد الإعداد بمصادر موثوقة."),
  },
  {
    id: "guelmim", lat: 28.99, lon: -10.06, label: "r", theme: "oasis", icon: "palm",
    name: tri("Guelmim", "Guelmim", "كلميم"),
    tagline: tri("Porte du désert, entre oasis et caravanes", "Gateway to the desert, between oases and caravans", "بوابة الصحراء بين الواحات والقوافل"),
    intro: tri(
      "Guelmim est souvent présentée comme la porte du désert, à la jonction de l'Anti-Atlas et du Sahara. La ville a longtemps été une étape pour les caravanes et les échanges.",
      "Guelmim is often presented as the gateway to the desert, where the Anti-Atlas meets the Sahara. The town was long a stop for caravans and trade.",
      "تُقدَّم كلميم غالبًا باعتبارها بوابة الصحراء، عند ملتقى الأطلس الصغير والصحراء. وقد كانت طويلًا محطة للقوافل والتبادل."),
    identity: tri(
      "Ville de passage où se croisent cultures hassanie et amazighe. La région compte plusieurs oasis, et les étoffes teintes en bleu indigo y sont associées à l'image des « hommes bleus ».",
      "A crossroads town where Hassani and Amazigh cultures meet. The region has several oases, and indigo-blue cloth is linked there to the image of the “blue men”.",
      "مدينة عبور تلتقي فيها الثقافتان الحسانية والأمازيغية. وتضم المنطقة عدة واحات، وترتبط الأقمشة المصبوغة بالنيلي فيها بصورة «الرجال الزرق»."),
    discover: [
      { icon: "users", title: tri("Le marché aux chameaux", "The camel market", "سوق الجمال"),
        text: tri("Le marché hebdomadaire de chameaux a longtemps été l'un des symboles de la ville.", "The weekly camel market has long been one of the town's symbols.", "ظل سوق الجمال الأسبوعي طويلًا من رموز المدينة.") },
      { icon: "palm", title: tri("Les oasis alentour", "The surrounding oases", "الواحات المحيطة"),
        text: tri("Palmeraies et jardins irrigués se découvrent à quelques kilomètres de la ville.", "Palm groves and irrigated gardens can be discovered a few kilometres from town.", "تُكتشف واحات النخيل والبساتين المسقية على بعد كيلومترات قليلة من المدينة.") },
      { icon: "scroll", title: tri("Le carrefour caravanier", "The caravan crossroads", "ملتقى القوافل"),
        text: tri("Guelmim a été une étape entre le Sahara et le nord du pays.", "Guelmim was a stop between the Sahara and the north of the country.", "كانت كلميم محطة بين الصحراء وشمال البلاد.") },
    ],
    crafts: ["melhfa", "bijoux"],
    craftNote: tri("Ces savoir-faire sont associés plus largement à la culture hassanie du Sahara.", "These skills are associated more broadly with the Hassani culture of the Sahara.", "ترتبط هذه المهارات بالثقافة الحسانية في الصحراء عمومًا."),
  },
  {
    id: "tantan", lat: 28.44, lon: -11.1, label: "l", theme: "desert", icon: "users",
    name: tri("Tan-Tan", "Tan-Tan", "طانطان"),
    tagline: tri("Le moussem des tribus nomades", "The moussem of the nomadic tribes", "موسم القبائل الرحّل"),
    intro: tri(
      "Tan-Tan est une ville du sud-ouest du Maroc, aux portes du Sahara et près de l'océan. Elle est surtout connue pour son moussem, un grand rassemblement de tribus nomades.",
      "Tan-Tan is a town in south-western Morocco, at the gateway to the Sahara and near the ocean. It is best known for its moussem, a great gathering of nomadic tribes.",
      "طانطان مدينة في جنوب غرب المغرب، عند مدخل الصحراء وقرب المحيط. وتُعرف خاصة بموسمها، وهو تجمع كبير للقبائل الرحّل."),
    identity: tri(
      "Le moussem de Tan-Tan, inscrit par l'UNESCO en 2008 au patrimoine culturel immatériel, met en scène la vie nomade : tentes, chameaux, poésie, chants et danses.",
      "The Tan-Tan moussem, listed by UNESCO in 2008 as intangible cultural heritage, showcases nomadic life: tents, camels, poetry, songs and dances.",
      "يُبرز موسم طانطان، المدرج لدى اليونسكو عام 2008 في التراث الثقافي غير المادي، حياة الترحال: الخيام والإبل والشعر والأغاني والرقصات."),
    discover: [
      { icon: "users", title: tri("Le moussem", "The moussem", "الموسم"),
        text: tri("Ce rassemblement réunit des tribus autour des tentes, des courses de chameaux et des veillées.", "This gathering brings tribes together around tents, camel races and evening gatherings.", "يجمع هذا التجمع القبائل حول الخيام وسباقات الإبل والسهرات.") },
      { icon: "book", title: tri("Poésie et chants", "Poetry and songs", "الشعر والأغاني"),
        text: tri("Poésie hassanie, chants et musiques traditionnelles y occupent une place centrale.", "Hassani poetry, songs and traditional music have a central place there.", "للشعر الحساني والأغاني والموسيقى التقليدية مكانة مركزية فيه.") },
      { icon: "home", title: tri("Tentes et chameaux", "Tents and camels", "الخيام والإبل"),
        text: tri("La tente et le chameau symbolisent la mémoire de la vie nomade.", "The tent and the camel symbolise the memory of nomadic life.", "ترمز الخيمة والجمل إلى ذاكرة حياة الترحال.") },
    ],
    crafts: ["tapis", "cuir"],
    craftNote: tri("Tentes tissées et objets en cuir sont liés à la vie nomade célébrée par le moussem.", "Woven tents and leather objects are tied to the nomadic life celebrated by the moussem.", "ترتبط الخيام المنسوجة والأدوات الجلدية بحياة الترحال التي يحتفي بها الموسم."),
  },
];

AA.regionById = (id) => AA.regions.find((r) => r.id === id);
AA.regionIndex = (id) => AA.regions.findIndex((r) => r.id === id);

/* ---------- Illustrated map geometry ----------
   Destinations use REAL latitude/longitude. The same projection draws the coastline and
   places every pin, so relative positions stay geographically correct.
   Only the Atlantic coastline is drawn: NO borders, NO administrative areas, NO country labels.
   The outline is simplified (illustrative, not to scale). */
AA.MAP = { lon0: -17.4, lon1: -8.6, lat0: 22.9, lat1: 30.0, scale: 90, refLat: 26.5 };
AA.MAP.cos = Math.cos((AA.MAP.refLat * Math.PI) / 180);
AA.MAP.w = (AA.MAP.lon1 - AA.MAP.lon0) * AA.MAP.cos * AA.MAP.scale;
AA.MAP.h = (AA.MAP.lat1 - AA.MAP.lat0) * AA.MAP.scale;

/* [lon, lat] → { x, y } in map units, plus percentages of the map box */
AA.mapProject = (lon, lat) => {
  const m = AA.MAP;
  const x = (lon - m.lon0) * m.cos * m.scale;
  const y = (m.lat1 - lat) * m.scale;
  return { x, y, px: (x / m.w) * 100, py: (y / m.h) * 100 };
};

/* Atlantic coastline, south → north (simplified). The land is everything east of it. */
AA.MAP_SHAPES = {
  coast: [[-17.05, 20.77], [-16.95, 21.4], [-16.75, 22.2], [-16.4, 22.95], [-16.12, 23.45], [-16.0, 23.95], [-15.4, 24.5], [-14.9, 25.4], [-14.62, 26.1], [-13.9, 26.6], [-13.45, 27.1], [-13.08, 27.95], [-12.5, 28.15], [-12.0, 28.4], [-11.5, 28.6], [-11.2, 28.8], [-10.7, 29.05], [-10.15, 29.4], [-9.85, 29.85], [-9.8, 30.4]],
};

/* The land as one closed list of [lon, lat] points (coast + the map edges on the land side) */
AA.landRing = () => [...AA.MAP_SHAPES.coast, [-7.5, 30.4], [-7.5, 20.0]];

/* Ray-casting point-in-polygon (used by the tests) */
AA.pointInRing = (lon, lat, ring = AA.landRing()) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
