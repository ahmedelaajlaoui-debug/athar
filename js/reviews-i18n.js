/* ==========================================================
   reviews-i18n.js — texts of the Reviews page (avis.html) in FR / EN / AR
   Same mechanism as pages-i18n.js: "key": [french, english, arabic], merged into AA.translations.
   (Shared keys used by the header/footer — nav.reviews.menu, footer.reviews, title.avis — live in coop-data.js.)
   Load after translations.js, before i18n.js.
   ========================================================== */
(() => {
  const T = {
    "rv.eyebrow": ["Avis des visiteurs", "Visitor reviews", "آراء الزوار"],
    "rv.h1": ["Votre expérience ATHAR", "Your ATHAR experience", "تجربتك مع ATHAR"],
    "rv.lead": ["Parcourez des avis d'exemple sur la plateforme, les coopératives, les artisans, les produits et les expériences culturelles, ou écrivez le vôtre pour tester le formulaire.", "Browse sample reviews about the platform, cooperatives, artisans, products and cultural experiences, or write your own to try the form.", "تصفح آراء توضيحية حول المنصة والتعاونيات والحرفيين والمنتجات والتجارب الثقافية، أو اكتب رأيك لتجربة النموذج."],
    "rv.demo.title": ["Page de démonstration.", "Demonstration page.", "صفحة تجريبية."],
    "rv.demo.text": ["Les avis marqués « Exemple illustratif » sont des textes fictifs écrits pour le design : ils ne viennent pas de vrais clients. Les avis que vous ajoutez restent enregistrés uniquement dans ce navigateur : ils ne sont pas publiés sur un serveur partagé et personne d'autre ne les voit.", "Reviews marked “Illustrative example” are fictional texts written for the design: they do not come from real customers. Reviews you add are saved only in this browser: they are not published to a shared server and nobody else can see them.", "الآراء الموسومة «مثال توضيحي» نصوص خيالية كُتبت لأغراض التصميم، وليست من زبائن حقيقيين. أما الآراء التي تضيفها فتُحفظ في هذا المتصفح فقط، ولا تُنشر على خادم مشترك ولا يراها أي شخص آخر."],

    /* categories */
    "rv.cat.all": ["Tous", "All", "الكل"],
    "rv.cat.platform": ["Expérience ATHAR", "ATHAR experience", "تجربة ATHAR"],
    "rv.cat.coop": ["Coopératives", "Cooperatives", "التعاونيات"],
    "rv.cat.artisan": ["Artisans", "Artisans", "الحرفيون"],
    "rv.cat.product": ["Produits", "Products", "المنتجات"],
    "rv.cat.experience": ["Expériences culturelles", "Cultural experiences", "التجارب الثقافية"],
    "rv.cat.mine": ["Mes avis (démo)", "My reviews (demo)", "آرائي (تجريبية)"],

    /* list toolbar */
    "rv.filter.aria": ["Filtrer les avis par catégorie", "Filter reviews by category", "تصفية الآراء حسب الفئة"],
    "rv.sort.label": ["Trier par", "Sort by", "ترتيب حسب"],
    "rv.sort.recent": ["Les plus récents", "Most recent", "الأحدث"],
    "rv.sort.high": ["Meilleures notes", "Highest rated", "الأعلى تقييمًا"],
    "rv.sort.low": ["Notes les plus basses", "Lowest rated", "الأقل تقييمًا"],
    "rv.count.one": ["{n} avis affiché", "{n} review shown", "يُعرض رأي واحد"],
    "rv.count.other": ["{n} avis affichés", "{n} reviews shown", "تُعرض {n} آراء"],
    "rv.count.zero": ["Aucun avis affiché", "No reviews shown", "لا توجد آراء معروضة"],
    "rv.empty.title": ["Aucun avis dans cette catégorie", "No reviews in this category", "لا توجد آراء في هذه الفئة"],
    "rv.empty.text": ["Soyez le premier à écrire un avis de démonstration avec le formulaire.", "Be the first to write a demo review using the form.", "كن أول من يكتب رأيًا تجريبيًا عبر النموذج."],
    "rv.empty.mine": ["Vous n'avez pas encore écrit d'avis de démonstration sur cet appareil.", "You have not written any demo review on this device yet.", "لم تكتب بعد أي رأي تجريبي على هذا الجهاز."],

    /* cards */
    "rv.tag.sample": ["Exemple illustratif", "Illustrative example", "مثال توضيحي"],
    "rv.tag.mine": ["Votre avis (démo)", "Your review (demo)", "رأيك (تجريبي)"],
    "rv.author.sample": ["Texte fictif, pas un vrai client", "Fictional text, not a real customer", "نص خيالي وليس زبونًا حقيقيًا"],
    "rv.author.mine": ["Enregistré sur cet appareil uniquement", "Saved on this device only", "محفوظ على هذا الجهاز فقط"],
    "rv.about": ["À propos de :", "About:", "بخصوص:"],
    "rv.stars.aria": ["Note : {n} sur 5", "Rating: {n} out of 5", "التقييم: {n} من 5"],
    "rv.delete": ["Supprimer", "Delete", "حذف"],
    "rv.delete.aria": ["Supprimer l'avis : {title}", "Delete review: {title}", "حذف الرأي: {title}"],
    "rv.deleted": ["Avis de démonstration supprimé.", "Demo review deleted.", "تم حذف الرأي التجريبي."],

    /* form */
    "rv.form.title": ["Écrire un avis de démonstration", "Write a demo review", "اكتب رأيًا تجريبيًا"],
    "rv.form.intro": ["Aucun nom, e-mail ni mot de passe n'est demandé. Ne saisissez pas d'informations personnelles.", "No name, email or password is requested. Please do not enter personal information.", "لا يُطلب أي اسم أو بريد إلكتروني أو كلمة مرور. من فضلك لا تُدخل معلومات شخصية."],
    "rv.f.rating": ["Votre note *", "Your rating *", "تقييمك *"],
    "rv.f.rating.group": ["Note de 1 à 5 étoiles", "Rating from 1 to 5 stars", "تقييم من 1 إلى 5 نجوم"],
    "rv.f.star": ["{n} sur 5", "{n} out of 5", "{n} من 5"],
    "rv.f.rating.none": ["Aucune note choisie", "No rating chosen", "لم يتم اختيار تقييم"],
    "rv.f.rating.val": ["{n} sur 5 sélectionné", "{n} out of 5 selected", "تم اختيار {n} من 5"],
    "rv.f.cat": ["Catégorie *", "Category *", "الفئة *"],
    "rv.f.cat.ph": ["Choisir une catégorie", "Choose a category", "اختر فئة"],
    "rv.f.subject": ["À propos de (facultatif)", "About (optional)", "بخصوص (اختياري)"],
    "rv.f.subject.ph": ["Avis général", "General review", "رأي عام"],
    "rv.f.title": ["Titre de l'avis *", "Review title *", "عنوان الرأي *"],
    "rv.f.title.ph": ["En quelques mots", "In a few words", "في بضع كلمات"],
    "rv.f.comment": ["Votre commentaire *", "Your comment *", "تعليقك *"],
    "rv.f.comment.ph": ["Décrivez votre expérience (10 caractères minimum).", "Describe your experience (10 characters minimum).", "صف تجربتك (10 أحرف على الأقل)."],
    "rv.f.counter": ["{n} / {max} caractères", "{n} / {max} characters", "{n} / {max} حرفًا"],
    "rv.f.submit": ["Envoyer mon avis (démo)", "Submit my review (demo)", "إرسال رأيي (تجريبي)"],
    "rv.f.reset": ["Effacer le formulaire", "Clear the form", "مسح النموذج"],
    "rv.f.note": ["Cet avis sera enregistré uniquement dans ce navigateur (localStorage), à titre de démonstration.", "This review will be saved only in this browser (localStorage), for demonstration purposes.", "سيُحفظ هذا الرأي في هذا المتصفح فقط (localStorage) لأغراض العرض."],

    /* validation */
    "rv.err.rating": ["Choisissez une note de 1 à 5 étoiles.", "Please choose a rating from 1 to 5 stars.", "اختر تقييمًا من 1 إلى 5 نجوم."],
    "rv.err.cat": ["Choisissez une catégorie.", "Please choose a category.", "اختر فئة."],
    "rv.err.title.req": ["Le titre est obligatoire.", "The title is required.", "العنوان مطلوب."],
    "rv.err.title.min": ["Le titre doit contenir au moins 3 caractères.", "The title must contain at least 3 characters.", "يجب أن يحتوي العنوان على 3 أحرف على الأقل."],
    "rv.err.comment.req": ["Le commentaire est obligatoire.", "The comment is required.", "التعليق مطلوب."],
    "rv.err.comment.min": ["Le commentaire doit contenir au moins 10 caractères.", "The comment must contain at least 10 characters.", "يجب أن يحتوي التعليق على 10 أحرف على الأقل."],
    "rv.err.fix": ["Merci de corriger les champs en rouge.", "Please correct the fields in red.", "يرجى تصحيح الحقول المظللة بالأحمر."],

    /* confirmation */
    "rv.ok.title": ["Merci, votre avis de démonstration est enregistré.", "Thank you, your demo review has been saved.", "شكرًا، تم حفظ رأيك التجريبي."],
    "rv.ok.text": ["Il apparaît dans la liste, sous « Mes avis (démo) ». Il est stocké uniquement dans ce navigateur : il n'est pas publié sur un serveur partagé et les autres visiteurs ne le voient pas.", "It appears in the list, under “My reviews (demo)”. It is stored only in this browser: it is not published to a shared server and other visitors cannot see it.", "يظهر في القائمة ضمن «آرائي (تجريبية)». وهو مخزّن في هذا المتصفح فقط، ولا يُنشر على خادم مشترك ولا يراه الزوار الآخرون."],
    "rv.ok.nosave": ["Le stockage du navigateur est indisponible : votre avis est affiché pour cette session seulement.", "Browser storage is unavailable: your review is shown for this session only.", "تخزين المتصفح غير متاح: يظهر رأيك في هذه الجلسة فقط."],
    "rv.ok.toast": ["Avis de démonstration enregistré.", "Demo review saved.", "تم حفظ الرأي التجريبي."],
    "rv.ok.view": ["Voir mes avis", "View my reviews", "عرض آرائي"],

    /* local data management */
    "rv.clear": ["Supprimer tous mes avis de démo", "Delete all my demo reviews", "حذف كل آرائي التجريبية"],
    "rv.clear.confirm": ["Supprimer tous vos avis de démonstration enregistrés sur cet appareil ?", "Delete all your demo reviews saved on this device?", "هل تريد حذف كل آرائك التجريبية المحفوظة على هذا الجهاز؟"],
    "rv.cleared": ["Vos avis de démonstration ont été supprimés.", "Your demo reviews have been deleted.", "تم حذف آرائك التجريبية."],

    /* illustrative sample reviews */
    "rv.s1.t": ["Un site clair à parcourir", "A clear site to browse", "موقع واضح وسهل التصفح"],
    "rv.s1.x": ["La navigation est simple et les trois langues facilitent la découverte. Exemple de texte pour illustrer la mise en page.", "Navigation is simple and the three languages make discovery easier. Sample text to illustrate the layout.", "التنقل بسيط واللغات الثلاث تسهّل الاكتشاف. نص تجريبي لتوضيح التصميم."],
    "rv.s2.t": ["Des photos plus nombreuses seraient utiles", "More photos would help", "المزيد من الصور سيكون مفيدًا"],
    "rv.s2.x": ["J'aimerais voir davantage d'images pour chaque page. Exemple de texte pour illustrer un avis plus nuancé.", "I would like to see more images on each page. Sample text to illustrate a more balanced review.", "أتمنى رؤية صور أكثر في كل صفحة. نص تجريبي لتوضيح رأي أكثر توازنًا."],
    "rv.s3.t": ["Une présentation claire de la coopérative", "A clear presentation of the cooperative", "تقديم واضح للتعاونية"],
    "rv.s3.x": ["La fiche explique le rôle de la coopérative et les savoir-faire présentés. Exemple de texte fictif.", "The page explains the cooperative's role and the crafts presented. Fictional sample text.", "توضح الصفحة دور التعاونية والحرف المعروضة. نص تجريبي خيالي."],
    "rv.s4.t": ["Un portrait qui donne envie d'en savoir plus", "A portrait that makes you want to learn more", "بورتريه يدفعك لمعرفة المزيد"],
    "rv.s4.x": ["Le profil présente le métier et les techniques de façon accessible. Exemple de texte fictif.", "The profile presents the craft and techniques in an accessible way. Fictional sample text.", "يعرض الملف الحرفة والتقنيات بأسلوب مبسط. نص تجريبي خيالي."],
    "rv.s5.t": ["Une fiche produit détaillée", "A detailed product page", "صفحة منتج مفصلة"],
    "rv.s5.x": ["Matières, techniques et origine sont bien expliquées. Exemple de texte fictif, aucun achat réel.", "Materials, techniques and origin are well explained. Fictional sample text, no real purchase.", "المواد والتقنيات والأصل موضحة جيدًا. نص تجريبي خيالي دون أي شراء حقيقي."],
    "rv.s6.t": ["Un atelier bien décrit", "A well-described workshop", "ورشة موصوفة جيدًا"],
    "rv.s6.x": ["La description donne une idée claire du déroulement. Exemple de texte fictif, aucune réservation réelle.", "The description gives a clear idea of how it runs. Fictional sample text, no real booking.", "يعطي الوصف فكرة واضحة عن سير النشاط. نص تجريبي خيالي دون أي حجز حقيقي."],
  };
  const langs = ["fr", "en", "ar"];
  Object.keys(T).forEach((key) => langs.forEach((lang, i) => { AA.translations[lang][key] = T[key][i]; }));
})();
