/* ==========================================================
   crafts.js — informational content about the heritage of the Moroccan Sahara
   Used by: index.html, patrimoine.html, savoir-faire.html, region.html
   Load after data.js (it needs the AA object).

   - AA.tri(fr, en, ar) : a text in the three site languages (read with AA.rt(text))
   - AA.crafts   : 5 Saharan crafts (melhfa, jewellery, weaving, leather, bakhour)
   - AA.topics   : 4 cultural articles (tea and hospitality, music and poetry, cuisine, desert and oases)
   - AA.craftArt : one SVG illustration per entry (no photos, so it always loads)

   The texts are general, simplified introductions focused on Hassani and Saharan culture.
   They name no cooperative, artisan, business or contact. Practices vary between families,
   places and workshops. Add an entry = one object here + one drawing in AA.craftArt.
   ========================================================== */

AA.tri = (fr, en, ar) => ({ fr, en, ar });
/* Pick the text in the current language (French if a translation is missing) */
AA.rt = (field) => (field && typeof field === "object" ? field[AA.lang] || field.fr || "" : field || "");
var tri = AA.tri; // shared with regions.js

AA.crafts = [
  {
    id: "melhfa", icon: "thread",
    name: tri("Melhfa et vêtements sahraouis", "Melhfa and Saharan clothing", "الملحفة واللباس الصحراوي"),
    short: tri("La melhfa, voile coloré des femmes hassanies, et la daraâ, ample vêtement des hommes.", "The melhfa, the colourful veil of Hassani women, and the daraa, the men's flowing robe.", "الملحفة، لباس النساء الحسانيات الملوّن، والدراعة، الرداء الواسع للرجال."),
    tech: tri("Tissage du coton, teinture et décors par réserve ; couture et broderie pour la daraâ.", "Cotton weaving, dyeing and resist decoration; sewing and embroidery for the daraa.", "نسج القطن والصباغة والزخرفة بالربط، والخياطة والتطريز بالنسبة للدراعة."),
    meaning: tri("Un vêtement du quotidien et des fêtes, adapté au soleil et au vent du désert.", "Clothing for daily life and celebrations, suited to desert sun and wind.", "لباس للحياة اليومية والمناسبات، يلائم شمس الصحراء ورياحها."),
    intro: tri(
      "Au Sahara, les vêtements répondent au climat : de longues étoffes légères protègent du soleil et du sable. Les femmes portent la melhfa, une grande pièce de tissu drapée autour du corps et de la tête, tandis que les hommes portent souvent la daraâ, une ample tunique, avec un turban.",
      "In the Sahara, clothing answers the climate: long, light fabrics protect from sun and sand. Women wear the melhfa, a large piece of cloth draped around the body and head, while men often wear the daraa, a wide tunic, with a turban.",
      "في الصحراء يستجيب اللباس للمناخ: أقمشة طويلة وخفيفة تقي من الشمس والرمال. وترتدي النساء الملحفة، وهي قطعة قماش كبيرة تُلفّ حول الجسم والرأس، بينما يرتدي الرجال غالبًا الدراعة، وهي رداء واسع، مع العمامة."),
    sections: [
      { icon: "thread", title: tri("Techniques", "Techniques", "التقنيات"),
        text: tri("Le tissu de coton est teint, parfois avec des décors obtenus en nouant ou en réservant certaines zones avant la teinture. Les finitions et les broderies se font à la main.", "The cotton cloth is dyed, sometimes with patterns made by tying or masking areas before dyeing. Finishing and embroidery are done by hand.", "يُصبغ قماش القطن، وأحيانًا تُنجز زخارف بربط بعض المناطق أو حجبها قبل الصباغة. وتتم اللمسات الأخيرة والتطريز يدويًا.") },
      { icon: "gem", title: tri("Couleurs et usages", "Colours and uses", "الألوان والاستعمالات"),
        text: tri("Les couleurs varient beaucoup d'une pièce à l'autre et selon les occasions. La melhfa se porte au quotidien comme lors des fêtes et des mariages.", "Colours vary greatly from piece to piece and by occasion. The melhfa is worn every day as well as at celebrations and weddings.", "تتنوع الألوان كثيرًا من قطعة إلى أخرى وحسب المناسبة. وتُلبس الملحفة في الحياة اليومية كما في الأعراس والمناسبات.") },
      { icon: "star8", title: tri("Une identité vivante", "A living identity", "هوية حية"),
        text: tri("Les tissus et les motifs évoluent avec le temps. La melhfa reste un repère de l'identité hassanie, sans règle unique : chaque famille et chaque atelier a ses habitudes.", "Fabrics and patterns change over time. The melhfa remains a marker of Hassani identity, with no single rule: each family and workshop has its habits.", "تتطور الأقمشة والزخارف مع الزمن. وتبقى الملحفة علامة على الهوية الحسانية دون قاعدة واحدة، فلكل أسرة وورشة عاداتها.") },
    ],
    places: tri("On voit la melhfa dans toutes les villes sahariennes, de Guelmim à Dakhla.", "The melhfa can be seen in all Saharan towns, from Guelmim to Dakhla.", "تُرى الملحفة في كل المدن الصحراوية، من كلميم إلى الداخلة."),
    keypoints: [
      tri("Un vêtement adapté au désert : léger, ample, protecteur.", "Clothing suited to the desert: light, wide, protective.", "لباس ملائم للصحراء: خفيف وواسع وواقٍ."),
      tri("La teinture donne à chaque melhfa sa personnalité.", "Dyeing gives each melhfa its own character.", "تمنح الصباغة كل ملحفة طابعها الخاص."),
      tri("Un symbole vivant de l'identité hassanie.", "A living symbol of Hassani identity.", "رمز حي للهوية الحسانية."),
    ],
  },
  {
    id: "bijoux", icon: "ring",
    name: tri("Bijoux sahraouis", "Saharan jewellery", "المجوهرات الصحراوية"),
    short: tri("Bijoux d'argent, perles et ambre, portés lors des fêtes et transmis en famille.", "Silver, bead and amber jewellery, worn at celebrations and passed down in families.", "مجوهرات من الفضة والخرز والعنبر، تُلبس في المناسبات وتنتقل داخل الأسرة."),
    tech: tri("Fonte, martelage, gravure et assemblage de perles à la main.", "Casting, hammering, engraving and hand-assembling of beads.", "الصب والطرق والنقش وتركيب الخرز يدويًا."),
    meaning: tri("Le bijou orne, marque les grandes occasions et se transmet.", "Jewellery adorns, marks big occasions and is handed down.", "تُزيّن المجوهرات وتميّز المناسبات الكبرى وتُورَّث."),
    intro: tri(
      "Les bijoux traditionnels du Sahara associent l'argent, des perles et des pierres. Colliers, bracelets, bagues et fibules, ces broches qui servent à fixer le voile, accompagnent les fêtes et les mariages.",
      "Traditional Saharan jewellery combines silver, beads and stones. Necklaces, bracelets, rings and fibulae, the brooches used to fasten the veil, accompany celebrations and weddings.",
      "تجمع المجوهرات الصحراوية التقليدية بين الفضة والخرز والأحجار. وترافق القلائد والأساور والخواتم والفبولات، وهي دبابيس تُستعمل لتثبيت الثوب، الأعياد والأعراس."),
    sections: [
      { icon: "chisel", title: tri("Techniques", "Techniques", "التقنيات"),
        text: tri("Le métal est fondu, martelé ou limé, puis gravé de motifs géométriques. Les perles sont enfilées et assemblées à la main.", "The metal is cast, hammered or filed, then engraved with geometric patterns. Beads are threaded and assembled by hand.", "يُصهر المعدن ويُطرق أو يُبرد، ثم تُنقش عليه زخارف هندسية. ويُنظم الخرز ويُركّب يدويًا.") },
      { icon: "gem", title: tri("Matières", "Materials", "المواد"),
        text: tri("L'argent est très courant, associé à des perles de verre, d'ambre ou de pierre. Les choix varient selon les ateliers et les familles.", "Silver is very common, combined with glass, amber or stone beads. Choices vary between workshops and families.", "الفضة شائعة جدًا، وتُقرن بخرز من الزجاج أو العنبر أو الحجر. وتختلف الاختيارات بين الورشات والأسر.") },
      { icon: "star8", title: tri("Signification", "Meaning", "المعنى"),
        text: tri("Un bijou peut marquer un mariage ou une naissance, ou être transmis. La lecture des symboles varie selon les familles : ces explications ne sont que des repères.", "A piece can mark a wedding or a birth, or be handed down. How symbols are read varies between families: these explanations are only guidelines.", "قد تدل القطعة على زواج أو ولادة أو تنتقل بالإرث. وتختلف قراءة الرموز من أسرة إلى أخرى، وهذه الشروح مجرد إشارات.") },
    ],
    places: tri("Des bijoutiers travaillent dans de nombreuses villes du Sahara et du Sud marocain.", "Jewellers work in many towns of the Sahara and the south of Morocco.", "يشتغل صائغون في مدن كثيرة بالصحراء والجنوب المغربي."),
    keypoints: [
      tri("L'argent est la matière la plus répandue.", "Silver is the most widespread material.", "الفضة هي المادة الأكثر انتشارًا."),
      tri("Beaucoup de pièces sont encore faites à la main.", "Many pieces are still handmade.", "ما تزال قطع كثيرة تُصنع يدويًا."),
      tri("Les symboles se lisent différemment selon les familles.", "Symbols are read differently by different families.", "تُقرأ الرموز بطرق مختلفة حسب الأسر."),
    ],
  },
  {
    id: "tapis", icon: "thread",
    name: tri("Tissage, tentes et tapis", "Weaving, tents and rugs", "النسيج والخيام والزرابي"),
    short: tri("Tapis, couvertures et bandes tissées en laine et en poil : la matière de la tente traditionnelle.", "Rugs, blankets and woven strips of wool and hair: the fabric of the traditional tent.", "زرابي وأغطية وأشرطة منسوجة من الصوف والوبر: مادة الخيمة التقليدية."),
    tech: tri("Filage de la laine ou du poil, teinture, tissage sur métier posé au sol.", "Spinning wool or hair, dyeing, weaving on a ground loom.", "غزل الصوف أو الوبر والصباغة والنسج على نول موضوع على الأرض."),
    meaning: tri("Le tissage est lié à la vie nomade : abri, confort et hospitalité.", "Weaving is tied to nomadic life: shelter, comfort and hospitality.", "يرتبط النسيج بحياة الترحال: المأوى والراحة والضيافة."),
    intro: tri(
      "Au Sahara, le tissage accompagne la vie nomade. La khaïma, tente traditionnelle, est faite de bandes tissées en laine et en poil de chèvre ou de chameau, cousues entre elles. Tapis et coussins habillent l'intérieur.",
      "In the Sahara, weaving goes with nomadic life. The khaima, the traditional tent, is made of woven strips of wool and goat or camel hair, sewn together. Rugs and cushions furnish the inside.",
      "في الصحراء يرافق النسيج حياة الترحال. فالخيمة التقليدية مصنوعة من أشرطة منسوجة من الصوف ووبر الماعز أو الإبل، تُخاط معًا. وتؤثث الزرابي والوسائد الداخل."),
    sections: [
      { icon: "thread", title: tri("Techniques", "Techniques", "التقنيات"),
        text: tri("La laine et le poil sont filés à la main, souvent teints, puis tissés sur un métier posé à plat au sol.", "Wool and hair are hand-spun, often dyed, then woven on a loom laid flat on the ground.", "يُغزل الصوف والوبر يدويًا، وغالبًا ما يُصبغان، ثم يُنسجان على نول موضوع أفقيًا على الأرض.") },
      { icon: "bag", title: tri("Matières", "Materials", "المواد"),
        text: tri("Laine de mouton, poil de chèvre et de chameau, parfois coton. Les teintures peuvent être naturelles ou industrielles.", "Sheep wool, goat and camel hair, sometimes cotton. Dyes may be natural or industrial.", "صوف الغنم ووبر الماعز والإبل، وأحيانًا القطن. وقد تكون الأصباغ طبيعية أو صناعية.") },
      { icon: "home", title: tri("Usages", "Uses", "الاستعمالات"),
        text: tri("Abri, tapis de sol, coussins, couvertures : ces pièces servent au quotidien et à l'accueil des invités.", "Shelter, floor rugs, cushions, blankets: these pieces serve daily life and the welcoming of guests.", "مأوى وفرش أرضية ووسائد وأغطية: تخدم هذه القطع الحياة اليومية واستقبال الضيوف.") },
    ],
    places: tri("Le tissage se pratique dans de nombreuses localités sahariennes, en ville comme dans les campements.", "Weaving is practised in many Saharan localities, in towns and in camps.", "يُمارس النسيج في كثير من المناطق الصحراوية، في المدن كما في المخيمات."),
    keypoints: [
      tri("La tente est un tissage cousu en bandes.", "The tent is a weaving sewn from strips.", "الخيمة نسيج مخيط من أشرطة."),
      tri("Laine et poil sont les matières principales.", "Wool and hair are the main materials.", "الصوف والوبر هما المادتان الأساسيتان."),
      tri("Un savoir-faire souvent transmis par les femmes.", "A skill often passed on by women.", "مهارة تنتقل غالبًا عبر النساء."),
    ],
  },
  {
    id: "cuir", icon: "bag",
    name: tri("Cuir et objets nomades", "Leather and nomadic objects", "الجلد والأدوات البدوية"),
    short: tri("Sacs, coussins, outres et selles : le cuir de chèvre et de chameau accompagne la vie nomade.", "Bags, cushions, waterskins and saddles: goat and camel leather goes with nomadic life.", "حقائب ووسائد وقِرَب وسروج: جلد الماعز والإبل يرافق حياة الترحال."),
    tech: tri("Tannage, séchage, découpe, couture à la main et décor gravé.", "Tanning, drying, cutting, hand sewing and engraved decoration.", "الدباغة والتجفيف والقص والخياطة اليدوية والزخرفة بالنقش."),
    meaning: tri("Des objets utiles et solides, pensés pour le voyage, l'eau et le transport.", "Useful, sturdy objects designed for travel, water and carrying.", "أدوات نافعة ومتينة صُممت للسفر والماء والحمل."),
    intro: tri(
      "Dans une vie de déplacements, le cuir sert à transporter et à conserver : sacs, outres à eau, coussins, étuis ou éléments de selle. Les pièces sont cousues à la main et décorées de motifs.",
      "In a life of travel, leather is used to carry and store: bags, water skins, cushions, cases and saddle parts. Pieces are sewn by hand and decorated with patterns.",
      "في حياة التنقل يُستعمل الجلد للحمل والحفظ: حقائب وقِرَب للماء ووسائد وأغماد وأجزاء من السروج. وتُخاط القطع يدويًا وتُزيَّن بالزخارف."),
    sections: [
      { icon: "bag", title: tri("Techniques", "Techniques", "التقنيات"),
        text: tri("Les peaux de chèvre, de mouton ou de chameau sont nettoyées, tannées puis séchées. On découpe, on coud à la main, puis on grave ou on teint les décors.", "Goat, sheep or camel skins are cleaned, tanned and dried. They are cut, hand-sewn, then engraved or dyed for decoration.", "تُنظَّف جلود الماعز أو الغنم أو الإبل وتُدبغ وتُجفف. ثم تُقصّ وتُخاط يدويًا وتُنقش أو تُصبغ زخارفها.") },
      { icon: "thread", title: tri("Matières", "Materials", "المواد"),
        text: tri("Cuir de chèvre, de mouton ou de chameau, fils solides, parfois des pièces en laiton.", "Goat, sheep or camel leather, strong thread, sometimes brass fittings.", "جلد الماعز أو الغنم أو الإبل وخيوط قوية، وأحيانًا قطع من النحاس الأصفر.") },
      { icon: "home", title: tri("Usages", "Uses", "الاستعمالات"),
        text: tri("Transporter, conserver l'eau, s'asseoir : l'objet en cuir est d'abord utile, puis décoré.", "Carrying, keeping water, sitting: the leather object is first useful, then decorated.", "الحمل وحفظ الماء والجلوس: الغرض الجلدي مفيد أولًا ثم مزخرف.") },
    ],
    places: tri("Le travail du cuir se pratique dans plusieurs localités du Sahara.", "Leatherwork is practised in several localities of the Sahara.", "يُمارس العمل في الجلد في عدة مناطق بالصحراء."),
    keypoints: [
      tri("Le cuir accompagne le voyage et le transport de l'eau.", "Leather goes with travel and carrying water.", "يرافق الجلد السفر وحمل الماء."),
      tri("Beaucoup de pièces sont cousues à la main.", "Many pieces are sewn by hand.", "تُخاط قطع كثيرة يدويًا."),
      tri("Les décors gravés sont souvent géométriques.", "Engraved decoration is often geometric.", "غالبًا ما تكون الزخارف المنقوشة هندسية."),
    ],
  },
  {
    id: "bakhour", icon: "incense",
    name: tri("Bakhour et parfums", "Bakhour and perfumes", "البخور والعطور"),
    short: tri("Mélanges de résines, de bois et d'épices brûlés pour parfumer la maison et les étoffes.", "Blends of resins, woods and spices burned to scent the home and fabrics.", "خلطات من الراتنجات والأخشاب والتوابل تُحرق لتعطير البيت والأقمشة."),
    tech: tri("Sélection, broyage et mélange de résines, de bois et d'épices, puis séchage.", "Selecting, grinding and blending resins, woods and spices, then drying.", "انتقاء الراتنجات والأخشاب والتوابل وطحنها وخلطها ثم تجفيفها."),
    meaning: tri("Un parfum d'accueil, présent lors des visites et des fêtes.", "A scent of welcome, present at visits and celebrations.", "عطر للترحيب، حاضر في الزيارات والمناسبات."),
    intro: tri(
      "Le bakhour est un encens composé de résines, de morceaux de bois parfumés et d'épices. On le brûle sur du charbon dans un brûle-encens pour parfumer la maison et les étoffes, surtout lors des visites et des fêtes.",
      "Bakhour is an incense made of resins, scented wood pieces and spices. It is burned on charcoal in an incense burner to scent the home and fabrics, especially at visits and celebrations.",
      "البخور خلطة من الراتنجات وقطع الخشب العطرية والتوابل. يُحرق على الفحم في مبخرة لتعطير البيت والأقمشة، خاصة في الزيارات والمناسبات."),
    sections: [
      { icon: "incense", title: tri("Composition", "Composition", "التركيب"),
        text: tri("Chaque mélange a sa recette, transmise de personne en personne : résines, bois, épices, parfois fleurs séchées.", "Each blend has its own recipe, passed from person to person: resins, woods, spices, sometimes dried flowers.", "لكل خلطة وصفتها التي تنتقل من شخص إلى آخر: راتنجات وأخشاب وتوابل وأحيانًا أزهار مجففة.") },
      { icon: "home", title: tri("Usages", "Uses", "الاستعمالات"),
        text: tri("On le brûle pour accueillir des invités, lors des mariages et des fêtes, et pour parfumer les tissus.", "It is burned to welcome guests, at weddings and celebrations, and to scent fabrics.", "يُحرق لاستقبال الضيوف وفي الأعراس والمناسبات ولتعطير الأقمشة.") },
      { icon: "vase", title: tri("Le brûle-encens", "The incense burner", "المبخرة"),
        text: tri("Posé sur un tapis ou une table, le brûle-encens en métal ou en terre cuite accompagne souvent le thé.", "Placed on a rug or table, the metal or clay incense burner often accompanies tea.", "توضع المبخرة المعدنية أو الفخارية على سجادة أو طاولة، وكثيرًا ما ترافق الشاي.") },
    ],
    places: tri("Des mélanges de bakhour sont préparés dans de nombreuses villes du Sahara et du Sud.", "Bakhour blends are prepared in many towns of the Sahara and the south.", "تُحضَّر خلطات البخور في مدن كثيرة بالصحراء والجنوب."),
    keypoints: [
      tri("Résines, bois et épices composent le mélange.", "Resins, woods and spices make up the blend.", "تتركب الخلطة من الراتنجات والأخشاب والتوابل."),
      tri("Le parfum fait partie de l'accueil.", "Scent is part of hospitality.", "العطر جزء من الضيافة."),
      tri("Chaque recette a son histoire.", "Each recipe has its story.", "لكل وصفة حكايتها."),
    ],
  },
];

AA.topics = [
  {
    id: "the", icon: "users",
    name: tri("Le thé et l'hospitalité", "Tea and hospitality", "الشاي والضيافة"),
    intro: tri(
      "Offrir le thé est le geste central de l'accueil au Sahara. Le thé vert, préparé lentement devant les invités, est servi en plusieurs verres, souvent trois, et partagé en conversation.",
      "Offering tea is the central gesture of welcome in the Sahara. Green tea, prepared slowly in front of guests, is served in several glasses, often three, and shared in conversation.",
      "تقديم الشاي هو الفعل المركزي للترحيب في الصحراء. يُحضَّر الشاي الأخضر ببطء أمام الضيوف، ويُقدَّم على عدة كؤوس، غالبًا ثلاثة، ويُتقاسم مع الحديث."),
    sections: [
      { icon: "users", title: tri("Le service", "The service", "طريقة التقديم"),
        text: tri("Le thé est préparé sur un petit foyer, versé de haut pour former de la mousse, puis servi par tournées.", "The tea is made on a small fire, poured from a height to form foam, then served in rounds.", "يُحضَّر الشاي على موقد صغير، ويُصبّ من علوّ ليُكوّن الرغوة، ثم يُقدَّم على جولات.") },
      { icon: "star8", title: tri("Trois verres", "Three glasses", "ثلاث كؤوس"),
        text: tri("On dit souvent que les trois verres ont des goûts différents, du plus fort au plus doux. Chaque famille raconte cette tradition à sa manière.", "It is often said that the three glasses taste different, from strongest to mildest. Each family tells this tradition in its own way.", "يقال غالبًا إن للكؤوس الثلاث مذاقات مختلفة، من الأقوى إلى الألطف. وتروي كل أسرة هذا التقليد بطريقتها.") },
      { icon: "book", title: tri("Un temps pour parler", "A time to talk", "وقت للحديث"),
        text: tri("Le thé accompagne les visites, les conversations, les récits et les poèmes : on prend le temps.", "Tea goes with visits, conversations, stories and poems: people take their time.", "يرافق الشاي الزيارات والأحاديث والحكايات والقصائد، ويأخذ الناس وقتهم.") },
    ],
    places: tri("On le retrouve partout au Sahara, sous la tente comme dans les maisons.", "It is found everywhere in the Sahara, in tents as well as in houses.", "نجده في كل مكان بالصحراء، تحت الخيمة وفي البيوت."),
    keypoints: [
      tri("Le thé est le geste d'accueil par excellence.", "Tea is the welcome gesture par excellence.", "الشاي هو فعل الترحيب بامتياز."),
      tri("Il se prépare et se boit lentement.", "It is made and drunk slowly.", "يُحضَّر ويُشرب ببطء."),
      tri("Il rassemble autour de la conversation.", "It brings people together around conversation.", "يجمع الناس حول الحديث."),
    ],
  },
  {
    id: "musique-poesie", icon: "book",
    name: tri("Musique, poésie et tradition orale", "Music, poetry and oral tradition", "الموسيقى والشعر والتراث الشفوي"),
    intro: tri(
      "La culture hassanie est d'abord orale : poésie en hassaniya, chants, contes, proverbes et récits transmettent l'histoire et les valeurs. La poésie, souvent appelée « lghna », se chante et se récite lors des veillées.",
      "Hassani culture is first and foremost oral: poetry in Hassaniya, songs, tales, proverbs and stories carry history and values. Poetry, often called “lghna”, is sung and recited at gatherings.",
      "الثقافة الحسانية شفوية أولًا: شعر بالحسانية وأغانٍ وحكايات وأمثال وسرديات تنقل التاريخ والقيم. والشعر، الذي يُسمى غالبًا «لغنا»، يُغنّى ويُنشد في السهرات."),
    sections: [
      { icon: "book", title: tri("La poésie", "Poetry", "الشعر"),
        text: tri("Elle parle d'amour, du désert, d'amitié et d'honneur, et se partage lors des rencontres et des fêtes.", "It speaks of love, the desert, friendship and honour, and is shared at meetings and celebrations.", "يتحدث عن الحب والصحراء والصداقة والشرف، ويُتبادل في اللقاءات والاحتفالات.") },
      { icon: "star8", title: tri("Les instruments", "Instruments", "الآلات"),
        text: tri("Parmi les instruments traditionnels figurent le tidinit, un luth, et l'ardin, une harpe traditionnellement jouée par les femmes.", "Traditional instruments include the tidinit, a lute, and the ardin, a harp traditionally played by women.", "من الآلات التقليدية التيدينيت، وهي عود، والآردين، وهي قيثارة تعزفها النساء تقليديًا.") },
      { icon: "users", title: tri("Les grands rassemblements", "Great gatherings", "التجمعات الكبرى"),
        text: tri("Le moussem de Tan-Tan, inscrit par l'UNESCO au patrimoine culturel immatériel, réunit des tribus nomades autour des tentes, des chameaux, de la poésie et de la musique.", "The Tan-Tan moussem, listed by UNESCO as intangible cultural heritage, brings nomadic tribes together around tents, camels, poetry and music.", "يجمع موسم طانطان، المدرج لدى اليونسكو في التراث الثقافي غير المادي، قبائل رحّل حول الخيام والإبل والشعر والموسيقى.") },
    ],
    places: tri("La poésie et la musique se vivent dans toutes les localités sahariennes, et le moussem de Tan-Tan en est un grand rendez-vous.", "Poetry and music are lived in all Saharan localities, and the Tan-Tan moussem is a major event.", "يُعاش الشعر والموسيقى في كل المناطق الصحراوية، ويُعدّ موسم طانطان موعدًا كبيرًا."),
    keypoints: [
      tri("La culture hassanie se transmet surtout à l'oral.", "Hassani culture is passed on mainly orally.", "تنتقل الثقافة الحسانية أساسًا شفويًا."),
      tri("Poésie et musique rythment les veillées.", "Poetry and music shape the evening gatherings.", "يطبع الشعر والموسيقى السهرات."),
      tri("Le moussem de Tan-Tan est reconnu par l'UNESCO.", "The Tan-Tan moussem is recognised by UNESCO.", "موسم طانطان معترف به من اليونسكو."),
    ],
  },
  {
    id: "cuisine", icon: "vase",
    name: tri("Cuisine et produits du désert", "Cuisine and desert produce", "المطبخ ومنتجات الصحراء"),
    intro: tri(
      "La cuisine du Sahara utilise des produits adaptés au désert et à l'océan : dattes, lait de chamelle, viande, céréales et, sur la côte, poissons et fruits de mer.",
      "Saharan cuisine uses produce suited to the desert and the ocean: dates, camel milk, meat, grains and, on the coast, fish and seafood.",
      "يعتمد المطبخ الصحراوي على منتجات تلائم الصحراء والمحيط: التمور وحليب الناقة واللحم والحبوب، وعلى الساحل الأسماك والمأكولات البحرية."),
    sections: [
      { icon: "gem", title: tri("Dattes et lait", "Dates and milk", "التمر والحليب"),
        text: tri("Les dattes accompagnent le thé et les repas ; le lait de chamelle est une boisson traditionnelle.", "Dates go with tea and meals; camel milk is a traditional drink.", "يرافق التمر الشاي والوجبات، وحليب الناقة مشروب تقليدي.") },
      { icon: "users", title: tri("Plats partagés", "Shared dishes", "الأطباق المشتركة"),
        text: tri("Les repas de fête se partagent souvent autour d'un grand plat commun, avec de la viande grillée ou longuement cuite.", "Festive meals are often shared around a large common dish, with grilled or slow-cooked meat.", "غالبًا ما تُتقاسم وجبات الأعياد حول طبق كبير مشترك من اللحم المشوي أو المطهو ببطء.") },
      { icon: "wave", title: tri("Produits de la côte", "Coastal produce", "منتجات الساحل"),
        text: tri("Dakhla est connue pour ses huîtres et ses poissons, qui font partie de la table locale.", "Dakhla is known for its oysters and fish, part of the local table.", "تُعرف الداخلة بمحارها وأسماكها التي تدخل في المائدة المحلية.") },
    ],
    places: tri("Les produits de la mer se trouvent surtout sur la côte, de Tarfaya à Dakhla.", "Seafood is found mostly on the coast, from Tarfaya to Dakhla.", "توجد المنتجات البحرية خاصة على الساحل، من طرفاية إلى الداخلة."),
    keypoints: [
      tri("Dattes et thé vont ensemble.", "Dates and tea go together.", "التمر والشاي متلازمان."),
      tri("Les repas se partagent.", "Meals are shared.", "الوجبات تُتقاسم."),
      tri("La côte apporte poissons et fruits de mer.", "The coast provides fish and seafood.", "يوفر الساحل الأسماك والمأكولات البحرية."),
    ],
  },
  {
    id: "oasis", icon: "palm",
    name: tri("Désert, oasis et paysages", "Desert, oases and landscapes", "الصحراء والواحات والمناظر"),
    intro: tri(
      "Le Sahara marocain n'est pas seulement un désert de dunes : plaines de pierres, côte atlantique, lagune de Dakhla et oasis dessinent des paysages variés.",
      "The Moroccan Sahara is not only a desert of dunes: stony plains, the Atlantic coast, the Dakhla lagoon and oases form varied landscapes.",
      "الصحراء المغربية ليست كثبانًا رملية فحسب: سهول حجرية وساحل أطلسي وبحيرة الداخلة وواحات ترسم مناظر متنوعة."),
    sections: [
      { icon: "dune", title: tri("Dunes et plaines", "Dunes and plains", "الكثبان والسهول"),
        text: tri("Dunes de sable, vastes plaines de pierres et falaises se succèdent, avec l'océan Atlantique en bordure.", "Sand dunes, vast stony plains and cliffs follow one another, with the Atlantic Ocean on the edge.", "تتعاقب كثبان رملية وسهول حجرية واسعة وجروف، ويحدها المحيط الأطلسي.") },
      { icon: "wave", title: tri("La lagune de Dakhla", "The Dakhla lagoon", "بحيرة الداخلة"),
        text: tri("Une vaste lagune abritée du large, connue pour ses vents réguliers et les sports de glisse.", "A vast lagoon sheltered from the open sea, known for steady winds and board sports.", "بحيرة واسعة محمية من عرض البحر، تُعرف برياحها المنتظمة والرياضات الشراعية.") },
      { icon: "palm", title: tri("Oasis et vie nomade", "Oases and nomadic life", "الواحات وحياة الترحال"),
        text: tri("Des oasis, notamment dans la région de Guelmim, abritent palmeraies et jardins ; la vie nomade a longtemps rythmé les déplacements.", "Oases, notably around Guelmim, hold palm groves and gardens; nomadic life long shaped movement across the land.", "تضم واحات، خاصة في منطقة كلميم، نخيلًا وبساتين، وقد نظّمت حياة الترحال التنقلات طويلًا.") },
    ],
    places: tri("De Guelmim à Dakhla, les paysages passent des oasis aux dunes puis à l'océan.", "From Guelmim to Dakhla, landscapes move from oases to dunes and then to the ocean.", "من كلميم إلى الداخلة، تنتقل المناظر من الواحات إلى الكثبان ثم إلى المحيط."),
    keypoints: [
      tri("Des paysages variés : dunes, pierres, océan, oasis.", "Varied landscapes: dunes, stone, ocean, oases.", "مناظر متنوعة: كثبان وحجارة ومحيط وواحات."),
      tri("La lagune de Dakhla est un site réputé.", "The Dakhla lagoon is a renowned site.", "بحيرة الداخلة موقع مشهور."),
      tri("La vie nomade a façonné la culture.", "Nomadic life has shaped the culture.", "شكّلت حياة الترحال الثقافة."),
    ],
  },
];

AA.getArticle = (id) => AA.crafts.find((c) => c.id === id) || AA.topics.find((t) => t.id === id);

/* ---------- Illustrations (SVG, project colors) ---------- */
/* Points of an n-pointed star (used by the zellige tiling and the emblems) */
AA.starPoints = (cx, cy, ro, ri, n = 8) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pts.join(" ");
};

AA.craftArt = (id) => {
  const gold = "#e9c58a", ivory = "#fbf6ec";
  const S = `fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
  // [background from, background to, drawing]
  const art = {
    bijoux: ["#3b2a1c", "#6b5340",
      `<path d="M95 70Q200 250 305 70" ${S}/>` +
      [[118, 106], [145, 144], [175, 168], [225, 168], [255, 144], [282, 106]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="${gold}"/>`).join("") +
      `<circle cx="200" cy="205" r="38" ${S}/><polygon points="${AA.starPoints(200, 205, 28, 14)}" fill="${gold}"/><circle cx="200" cy="205" r="6" fill="#3b2a1c"/>`],
    tapis: ["#b5532f", "#6e2e1a",
      `<rect x="85" y="80" width="230" height="140" rx="4" fill="${ivory}"/><rect x="97" y="92" width="206" height="116" fill="#96401f"/>` +
      [140, 200, 260].map((x) => `<path d="M${x} 108L${x + 26} 150 ${x} 192 ${x - 26} 150z" fill="none" stroke="${gold}" stroke-width="3"/><circle cx="${x}" cy="150" r="5" fill="${ivory}"/>`).join("") +
      Array.from({ length: 12 }, (_, i) => `<path d="M${97 + i * 18.5} 80v-14M${97 + i * 18.5} 220v14" stroke="${ivory}" stroke-width="2.5" stroke-linecap="round"/>`).join("")],
    cuir: ["#a8693a", "#4a2c17",
      `<path d="M150 120V98a50 50 0 0 1 100 0v22" ${S}/><path d="M112 120h176l14 118H98z" fill="#4a2c17" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M112 120h176l5 44H107z" fill="#6e3f1f" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/><circle cx="200" cy="164" r="8" fill="${gold}"/>` +
      `<path d="M120 212h160" stroke="${gold}" stroke-width="2.5" stroke-dasharray="7 7" stroke-linecap="round"/>`],
    poterie: ["#2f5d8a", "#1b3452",
      `<path d="M165 62h70M172 62v36c0 18-50 32-50 80 0 36 32 60 78 60s78-24 78-60c0-48-50-62-50-80V62" fill="#1b3452" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M125 160h150M121 190h158" ${S} stroke-width="2.5"/>` +
      [165, 200, 235].map((x) => `<path d="M${x} 168l8 10-8 10-8-10z" fill="${gold}"/>`).join("")],
    zellige: ["#1f4a3a", "#153528",
      `<defs><pattern id="zp" width="50" height="50" patternUnits="userSpaceOnUse"><polygon points="${AA.starPoints(25, 25, 22, 12)}" fill="none" stroke="${gold}" stroke-width="1.8"/><rect x="-4" y="-4" width="8" height="8" transform="rotate(45 0 0)" fill="${gold}" opacity=".7"/><rect x="46" y="-4" width="8" height="8" transform="rotate(45 50 0)" fill="${gold}" opacity=".7"/><rect x="-4" y="46" width="8" height="8" transform="rotate(45 0 50)" fill="${gold}" opacity=".7"/><rect x="46" y="46" width="8" height="8" transform="rotate(45 50 50)" fill="${gold}" opacity=".7"/></pattern></defs>` +
      `<rect width="400" height="300" fill="url(#zp)"/><circle cx="200" cy="150" r="70" fill="#1f4a3a"/><polygon points="${AA.starPoints(200, 150, 62, 34)}" fill="#b5532f" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/><circle cx="200" cy="150" r="14" fill="${gold}"/>`],
    bois: ["#6b4226", "#3a2412",
      `<defs><pattern id="wp" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0h22M0 0v22" stroke="${gold}" stroke-width="1.6" opacity=".85"/></pattern><clipPath id="wc"><path d="M130 250V120a70 70 0 0 1 140 0v130z"/></clipPath></defs>` +
      `<g clip-path="url(#wc)"><rect x="120" y="40" width="160" height="220" fill="url(#wp)"/></g><path d="M130 250V120a70 70 0 0 1 140 0v130zM112 250h176" ${S}/>` +
      `<path d="M148 250V122a52 52 0 0 1 104 0v128" ${S} stroke-width="1.8"/><polygon points="${AA.starPoints(200, 118, 16, 8)}" fill="${gold}"/>`],
    parfums: ["#4a3b2a", "#2a1f14",
      `<path d="M120 165h160a80 80 0 0 1-160 0z" fill="#2a1f14" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/><path d="M165 242l-12 22h94l-12-22" ${S}/>` +
      `<path d="M200 140c-24-20-24-38 0-56s24-34 0-52" ${S}/><path d="M160 138c-14-12-14-24 0-34M240 138c14-12 14-24 0-34" ${S} stroke-width="2" opacity=".7"/>` +
      `<path d="M150 190h100" stroke="${gold}" stroke-width="2.5" stroke-dasharray="3 8" stroke-linecap="round"/>`],
    melhfa: ["#2f5d8a", "#1b3452",
      `<path d="M118 62c42 22 122 22 164 0l32 188c-62 24-166 24-228 0z" fill="${gold}" opacity=".92"/>` +
      `<path d="M136 112c40 14 88 14 128 0M142 152c38 14 82 14 116 0M148 192c34 12 74 12 104 0" fill="none" stroke="#1b3452" stroke-width="4" stroke-linecap="round"/>` +
      `<polygon points="${AA.starPoints(200, 82, 14, 7)}" fill="#1b3452"/>`],
    the: ["#3b2a1c", "#6b5340",
      `<path d="M150 192c0-40 20-62 50-62s50 22 50 62z" fill="#3b2a1c" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M250 168c24-8 36-26 40-48M150 164c-30-4-34 30-4 36M185 130h30M200 118v12" ${S}/>` +
      `<path d="M112 252l6-30h28l6 30zM244 252l6-30h28l6 30z" fill="none" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>`],
    oasis: ["#1f4a3a", "#153528",
      `<circle cx="312" cy="72" r="22" fill="${gold}"/><path d="M200 252V132" ${S}/>` +
      `<path d="M200 132c-20-30-50-34-80-24M200 132c20-30 50-34 80-24M200 132c-30-6-54 6-70 30M200 132c30-6 54 6 70 30M200 132c0-24 2-44 4-62" ${S}/>` +
      `<path d="M30 266q60-40 120 0t120 0 100-20" ${S}/>`],
    "traditions-regionales": ["#1f4a3a", "#3b2a1c",
      `<circle cx="200" cy="145" r="80" ${S} stroke-width="1.8" opacity=".6"/><circle cx="200" cy="145" r="58" ${S} stroke-width="1.8" opacity=".6"/><polygon points="${AA.starPoints(200, 145, 52, 26)}" fill="${gold}"/><circle cx="200" cy="145" r="10" fill="#1f4a3a"/>` +
      `<path d="M30 250q50-34 100 0t100 0 100 0 40-10" ${S} stroke-width="2.5"/>`],
    transmission: ["#b5532f", "#3b2a1c",
      `<path d="M140 250V140a60 60 0 0 1 120 0v110z" fill="${ivory}"/><path d="M162 250v-100a38 38 0 0 1 76 0v100z" fill="#b5532f"/><polygon points="${AA.starPoints(200, 70, 24, 12)}" fill="${gold}"/>` +
      `<path d="M60 262c50-24 90-24 140 0s100 24 140 0" ${S}/>`],
  };
  const alias = { bakhour: "parfums", "musique-poesie": "traditions-regionales", cuisine: "poterie" };
  const a = art[id] || art[alias[id]] || art.zellige;
  return `<svg viewBox="0 0 400 300" role="img" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">` +
    `<defs><linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a[0]}"/><stop offset="1" stop-color="${a[1]}"/></linearGradient></defs>` +
    `<rect width="400" height="300" fill="url(#bg-${id})"/>${a[2]}</svg>`;
};
