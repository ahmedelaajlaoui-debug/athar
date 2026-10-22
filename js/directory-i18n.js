/* ==========================================================
   directory-i18n.js — texts of the cooperative directory, the cooperative profiles, the Explorer
   city panel and the "Saviez-vous ?" cards (FR / EN / AR).
   Same mechanism as pages-i18n.js: "key": [french, english, arabic], merged into AA.translations.
   Load after translations.js (and after coop-data.js, which defines AA.coop).
   ========================================================== */
(() => {
  const T = {
    /* ----- Shared labels ----- */
    "dir.badge.demo": ["Fiche de démonstration", "Demo listing", "بطاقة تجريبية"],
    "dir.badge.registered": ["Coopérative inscrite (démo)", "Registered cooperative (demo)", "تعاونية مسجلة (تجريبي)"],
    "dir.notverified": ["Non vérifiée", "Not verified", "غير موثقة"],
    "dir.view": ["Voir la fiche", "View profile", "عرض الملف"],
    "dir.view.aria": ["Ouvrir la fiche de {name}", "Open the profile of {name}", "فتح ملف {name}"],
    "dir.count.one": ["{n} coopérative", "{n} cooperative", "تعاونية واحدة"],
    "dir.count.other": ["{n} coopératives", "{n} cooperatives", "{n} تعاونيات"],
    "dir.count.two": ["{n} coopératives", "{n} cooperatives", "تعاونيتان"],
    "dir.count.many": ["{n} coopératives", "{n} cooperatives", "{n} تعاونية"],
    "dir.count.none": ["Aucune coopérative", "No cooperative", "لا توجد تعاونية"],
    "dir.demo.desc": [
      "Fiche illustrative d'une structure artisanale de démonstration à {city}, autour de : {craft}. Elle ne correspond pas à une coopérative réelle vérifiée.",
      "Illustrative listing of a demo craft organisation in {city}, around: {craft}. It does not correspond to a verified real-world cooperative.",
      "بطاقة توضيحية لهيكل حرفي تجريبي في {city}، حول: {craft}. لا تمثل تعاونية حقيقية موثقة."],
    "dir.other": ["Autre activité", "Other activity", "نشاط آخر"],

    /* ----- Explorer: city panel ----- */
    "dir.exp.about": ["À propos de la ville", "About the city", "عن المدينة"],
    "dir.exp.coops": ["Coopératives à {name}", "Cooperatives in {name}", "التعاونيات في {name}"],
    "dir.exp.coops.empty.t": ["Aucune coopérative enregistrée ici", "No cooperative registered here", "لا توجد تعاونية مسجلة هنا"],
    "dir.exp.coops.empty.x": ["Aucune coopérative n'est associée à {name} pour le moment. Rien n'est inventé : la liste se complétera quand des coopératives s'inscriront.", "No cooperative is linked to {name} yet. Nothing is made up: the list will grow as cooperatives register.", "لا توجد حاليًا تعاونية مرتبطة بـ {name}. لم يُختلق شيء: ستكتمل القائمة عند تسجيل تعاونيات."],
    "dir.exp.artisans": ["Artisans associés", "Associated artisans", "الحرفيون المرتبطون"],
    "dir.exp.artisans.empty": ["Aucun artisan n'est associé à cette ville dans les données actuelles.", "No artisan is linked to this city in the current data.", "لا يوجد حرفي مرتبط بهذه المدينة في البيانات الحالية."],
    "dir.exp.demo": ["Les coopératives et artisans affichés sont des exemples de démonstration, pas des structures ni des personnes réelles vérifiées.", "The cooperatives and artisans shown are demonstration examples, not verified real organisations or people.", "التعاونيات والحرفيون المعروضون أمثلة تجريبية، وليسوا جهات أو أشخاصًا حقيقيين موثقين."],
    "dir.exp.more": ["Page complète de la ville", "Full city page", "الصفحة الكاملة للمدينة"],
    "dir.exp.card.aria": ["{name} : afficher les détails sur la carte", "{name}: show details on the map", "{name}: عرض التفاصيل على الخريطة"],
    "dir.exp.list.note": ["Cliquez sur une ville pour voir sa description, ses coopératives et ses artisans. Contenu de démonstration, sans coordonnées réelles.", "Click a city to see its description, cooperatives and artisans. Demonstration content, with no real contact details.", "انقر على مدينة لعرض وصفها وتعاونياتها وحرفييها. محتوى تجريبي دون بيانات اتصال حقيقية."],
    "dir.map.zoomIn": ["Zoom avant", "Zoom in", "تكبير"],
    "dir.map.zoomOut": ["Zoom arrière", "Zoom out", "تصغير"],
    "dir.map.reset": ["Vue d'ensemble", "Reset view", "عرض شامل"],
    "dir.map.hint": ["Carte illustrée : le zoom agrandit simplement le dessin (aucun service de carte en ligne). Cliquez un repère pour zoomer sur la ville ; faites glisser pour déplacer la vue.", "Illustrated map: zooming simply enlarges the drawing (no online map service). Click a marker to zoom on the city; drag to move the view.", "خريطة مرسومة: التكبير يكبّر الرسم فقط (دون خدمة خرائط عبر الإنترنت). انقر على علامة للتقريب من المدينة، واسحب لتحريك العرض."],

    /* ----- Patrimoine: hero and directory ----- */
    "dir.hero.eyebrow": ["Coopératives et artisans", "Cooperatives and artisans", "التعاونيات والحرفيون"],
    "dir.hero.h1": ["Le patrimoine vivant du Sahara marocain", "The living heritage of the Moroccan Sahara", "التراث الحي للصحراء المغربية"],
    "dir.hero.lead": ["Trouvez les coopératives et les artisans du Sahara marocain, découvrez leur savoir-faire et leurs créations.", "Find the cooperatives and artisans of the Moroccan Sahara and discover their skills and creations.", "اكتشف تعاونيات وحرفيي الصحراء المغربية ومهاراتهم وإبداعاتهم."],
    "dir.hero.cta1": ["Voir l'annuaire", "Browse the directory", "تصفح الدليل"],
    "dir.hero.cta2": ["Explorer la carte", "Explore the map", "استكشف الخريطة"],
    "dir.notice": ["Toutes les fiches de cette page sont des exemples de démonstration ou des coopératives inscrites dans ce navigateur. Aucune n'est une coopérative réelle vérifiée, et aucune coordonnée réelle n'est affichée.", "Every listing on this page is a demonstration example or a cooperative registered in this browser. None is a verified real-world cooperative, and no real contact details are shown.", "كل البطاقات في هذه الصفحة أمثلة تجريبية أو تعاونيات مسجلة في هذا المتصفح. لا توجد أي تعاونية حقيقية موثقة، ولا تُعرض أي بيانات اتصال حقيقية."],
    "dir.list.eyebrow": ["Annuaire", "Directory", "الدليل"],
    "dir.list.title": ["Les coopératives du Sahara", "Cooperatives of the Sahara", "تعاونيات الصحراء"],
    "dir.f.search": ["Rechercher", "Search", "بحث"],
    "dir.f.search.ph": ["Nom ou mot-clé", "Name or keyword", "الاسم أو كلمة مفتاحية"],
    "dir.f.region": ["Ville ou région", "City or region", "المدينة أو الجهة"],
    "dir.f.craft": ["Savoir-faire", "Craft", "الحرفة"],
    "dir.f.all": ["Toutes", "All", "الكل"],
    "dir.f.reset": ["Réinitialiser", "Reset", "إعادة التعيين"],
    "dir.results.one": ["{n} coopérative affichée", "{n} cooperative shown", "تعاونية واحدة معروضة"],
    "dir.results.other": ["{n} coopératives affichées", "{n} cooperatives shown", "{n} تعاونيات معروضة"],
    "dir.results.two": ["{n} coopératives affichées", "{n} cooperatives shown", "تعاونيتان معروضتان"],
    "dir.results.many": ["{n} coopératives affichées", "{n} cooperatives shown", "{n} تعاونية معروضة"],
    "dir.results.none": ["Aucun résultat", "No results", "لا توجد نتائج"],
    "dir.empty.t": ["Aucune coopérative ne correspond", "No cooperative matches", "لا توجد تعاونية مطابقة"],
    "dir.empty.x": ["Modifiez la recherche ou les filtres pour voir d'autres fiches.", "Change the search or filters to see other listings.", "غيّر البحث أو المرشحات لعرض بطاقات أخرى."],

    /* ----- Cooperative profile ----- */
    "dir.p.back": ["Retour à l'annuaire", "Back to the directory", "العودة إلى الدليل"],
    "dir.p.about": ["Présentation", "About", "نبذة"],
    "dir.p.location": ["Ville ou région", "City or region", "المدينة أو الجهة"],
    "dir.p.craft": ["Savoir-faire", "Craft", "الحرفة"],
    "dir.p.onmap": ["Voir sur la carte", "View on the map", "عرض على الخريطة"],
    "dir.p.team": ["Artisans et équipe", "Artisans and team", "الحرفيون والفريق"],
    "dir.p.team.empty": ["Aucune information sur l'équipe n'a été renseignée pour cette coopérative.", "No team information has been provided for this cooperative.", "لم تُقدَّم معلومات عن فريق هذه التعاونية."],
    "dir.p.team.demo": ["Profil fictif de démonstration", "Fictional demo profile", "ملف وهمي للعرض"],
    "dir.p.products": ["Produits de cette coopérative", "Products of this cooperative", "منتجات هذه التعاونية"],
    "dir.p.products.empty": ["Cette coopérative n'a pas encore de produit dans la boutique.", "This cooperative has no product in the shop yet.", "لا توجد بعد منتجات لهذه التعاونية في المتجر."],
    "dir.p.shop": ["Voir dans la boutique", "View in the shop", "عرض في المتجر"],
    "dir.p.contact": ["Contact", "Contact", "التواصل"],
    "dir.p.contact.note": ["Coordonnées renseignées par la coopérative (démonstration, stockées dans ce navigateur).", "Contact details provided by the cooperative (demo, stored in this browser).", "بيانات تواصل قدّمتها التعاونية (تجريبي، محفوظة في هذا المتصفح)."],
    "dir.p.email": ["E-mail", "Email", "البريد الإلكتروني"],
    "dir.p.whatsapp": ["WhatsApp", "WhatsApp", "واتساب"],
    "dir.p.demo.note": ["Fiche de démonstration : les informations ci-dessus sont illustratives. Aucune adresse, aucun téléphone ni aucun e-mail réel n'est indiqué.", "Demo listing: the information above is illustrative. No real address, phone number or email is given.", "بطاقة تجريبية: المعلومات أعلاه توضيحية. لا يُذكر أي عنوان أو هاتف أو بريد حقيقي."],
    "dir.p.reg.note": ["Cette fiche vient du profil d'une coopérative inscrite dans ce navigateur (démonstration). Toute modification faite dans l'espace coopérative s'affiche ici et dans l'Explorer.", "This listing comes from the profile of a cooperative registered in this browser (demo). Any edit made in the cooperative dashboard shows here and in the Explorer.", "هذه البطاقة مأخوذة من ملف تعاونية مسجلة في هذا المتصفح (تجريبي). أي تعديل في فضاء التعاونية يظهر هنا وفي الاستكشاف."],
    "dir.p.notfound.t": ["Fiche introuvable", "Listing not found", "البطاقة غير موجودة"],
    "dir.p.notfound.x": ["Cette coopérative n'existe pas (ou n'est enregistrée que dans un autre navigateur). Retournez à l'annuaire.", "This cooperative does not exist (or is registered only in another browser). Go back to the directory.", "هذه التعاونية غير موجودة (أو مسجلة في متصفح آخر فقط). عُد إلى الدليل."],
    "dir.pub.contact": ["Afficher mon e-mail et mon WhatsApp sur ma fiche publique du Patrimoine", "Show my email and WhatsApp on my public Heritage listing", "إظهار بريدي وواتساب في بطاقتي العامة بصفحة التراث"],
    "dir.pub.hint": ["Désactivé par défaut. Les coordonnées restent dans ce navigateur (démonstration).", "Off by default. Contact details stay in this browser (demo).", "غير مفعّل افتراضيًا. تبقى بيانات التواصل في هذا المتصفح (تجريبي)."],
    "dir.pub.link": ["Voir ma fiche publique", "View my public listing", "عرض بطاقتي العامة"],

    /* ----- Patrimoine: crafts and products ----- */

    /* ----- "Saviez-vous ?" ----- */
    "dyk.eyebrow": ["Saviez-vous ?", "Did you know?", "هل تعلم؟"],
    "dyk.title": ["Quelques repères sur le Sahara marocain", "A few facts about the Moroccan Sahara", "معلومات عن الصحراء المغربية"],
    "dyk.note": ["Repères généraux et simplifiés ; les usages varient selon les familles et les lieux.", "General, simplified facts; practices vary by family and place.", "معلومات عامة ومبسطة؛ وتختلف الممارسات حسب العائلات والأماكن."],
    "dyk.tag.culture": ["Culture hassanie", "Hassani culture", "الثقافة الحسانية"],
    "dyk.tag.craft": ["Savoir-faire", "Craft", "حرفة"],
    "dyk.tag.env": ["Environnement", "Environment", "البيئة"],
    "dyk.1": ["La melhfa est une longue étoffe que de nombreuses femmes hassanies drapent autour du corps ; ses couleurs et ses tissus varient beaucoup.", "The melhfa is a long cloth that many Hassani women drape around the body; its colours and fabrics vary widely.", "الملحفة قطعة قماش طويلة تلفّها كثير من النساء الحسانيات حول الجسد، وتتنوع ألوانها وأقمشتها كثيرًا."],
    "dyk.2": ["Le hassaniya est le parler arabe de la culture hassanie. Il porte une riche tradition orale, notamment en poésie.", "Hassaniya is the Arabic dialect of Hassani culture. It carries a rich oral tradition, especially in poetry.", "الحسانية لهجة عربية للثقافة الحسانية، وتحمل تراثًا شفويًا غنيًا، خاصة في الشعر."],
    "dyk.3": ["Le thé est au cœur de l'hospitalité : il est souvent servi en plusieurs verres, successivement, et partagé sans se presser.", "Tea is at the heart of hospitality: it is often served in several glasses, one after another, and shared without hurry.", "الشاي في صلب الضيافة: يُقدَّم غالبًا على عدة كؤوس متتالية ويُتقاسم دون استعجال."],
    "dyk.4": ["La tente traditionnelle, la khaïma, est faite de bandes tissées, souvent en laine ou en poil d'animal, cousues ensemble.", "The traditional tent, the khaima, is made of woven strips, often of wool or animal hair, sewn together.", "الخيمة التقليدية مصنوعة من أشرطة منسوجة، غالبًا من الصوف أو وبر الحيوانات، تُخاط معًا."],
    "dyk.5": ["Le bakhour est un mélange de résines et d'épices que l'on brûle pour parfumer la maison, souvent à l'arrivée d'invités.", "Bakhour is a blend of resins and spices burned to scent the home, often when guests arrive.", "البخور خليط من الراتنجات والتوابل يُحرق لتعطير البيت، غالبًا عند قدوم الضيوف."],
    "dyk.6": ["La région borde l'océan Atlantique : à Dakhla, le désert rejoint la mer et une vaste lagune.", "The region borders the Atlantic Ocean: at Dakhla, the desert meets the sea and a vast lagoon.", "تطل المنطقة على المحيط الأطلسي: في الداخلة تلتقي الصحراء بالبحر وببحيرة واسعة."],

    /* ----- Homepage teaser ----- */
    "dir.home.eyebrow": ["Coopératives et artisans", "Cooperatives and artisans", "التعاونيات والحرفيون"],
    "dir.home.title": ["Des coopératives à découvrir", "Cooperatives to discover", "تعاونيات للاكتشاف"],
    "dir.home.all": ["Voir l'annuaire", "Browse the directory", "تصفح الدليل"],
    "hm.c1.x": ["Annuaire des coopératives et artisans du Sahara, et repères sur la culture hassanie.", "Directory of the Sahara's cooperatives and artisans, with notes on Hassani culture.", "دليل تعاونيات وحرفيي الصحراء مع معلومات عن الثقافة الحسانية."],
    "dir.home.note": ["Fiches de démonstration, sans coordonnées réelles.", "Demo listings, with no real contact details.", "بطاقات تجريبية دون بيانات اتصال حقيقية."],
  };
  Object.keys(T).forEach((key) => {
    ["fr", "en", "ar"].forEach((lang, i) => { AA.translations[lang][key] = T[key][i]; });
  });
})();
