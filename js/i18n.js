/* ==========================================================
   i18n.js — language engine shared by every page
   - current language is saved in localStorage ("aa_lang")
   - sets <html lang> and <html dir> (Arabic = right-to-left)
   - AA.t(key, vars)         translate a key
   - AA.plural(key, n)       translate with plural forms (.one/.two/.few/.many/.other)
   - data-i18n="key"         translate the text of an element
   - data-i18n-attr="placeholder:key; aria-label:key"   translate attributes
   Load order: data.js → icons.js → translations.js → i18n.js → main.js → page script
   ========================================================== */
AA.LANGS = [
  { code: "fr", label: "Français", short: "FR", dir: "ltr", locale: "fr-FR" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl", locale: "ar-MA-u-nu-latn" }, // Latin digits keep prices readable
  { code: "en", label: "English", short: "EN", dir: "ltr", locale: "en-GB" },
];
AA.LANG_KEY = "aa_lang";
AA.DEFAULT_LANG = "fr";

AA.getLangInfo = (code) => AA.LANGS.find((l) => l.code === code) || AA.LANGS[0];

AA.lang = (() => {
  try {
    const saved = localStorage.getItem(AA.LANG_KEY);
    if (AA.LANGS.some((l) => l.code === saved)) return saved;
  } catch (error) { /* storage blocked: fall back to the default language */ }
  return AA.DEFAULT_LANG;
})();

/* Apply language + direction to <html> right away (before the page is drawn) */
AA.applyDocumentLang = () => {
  const info = AA.getLangInfo(AA.lang);
  const root = document.documentElement;
  root.lang = info.code;
  root.dir = info.dir;
  root.dataset.lang = info.code;
};
AA.applyDocumentLang();

AA.has = (key) => Boolean(AA.translations[AA.lang] && AA.translations[AA.lang][key]) || Boolean(AA.translations.fr[key]);

AA.t = (key, vars = {}) => {
  const dict = AA.translations[AA.lang] || {};
  let text = dict[key] ?? AA.translations.fr[key] ?? key;
  Object.keys(vars).forEach((name) => { text = text.split(`{${name}}`).join(vars[name]); });
  return text;
};

AA.plural = (key, n) => {
  const rule = new Intl.PluralRules(AA.getLangInfo(AA.lang).code).select(n);
  const dict = AA.translations[AA.lang] || {};
  const form = dict[`${key}.${rule}`] ? rule : "other";
  return AA.t(`${key}.${form}`, { n });
};

/* Labels coming from the sample data (categories and cities) */
AA.catLabel = (cat) => (AA.translations.fr[`cat.${cat}`] ? AA.t(`cat.${cat}`) : cat);
AA.cityLabel = (city) => (AA.translations.fr[`city.${city}`] ? AA.t(`city.${city}`) : city);

/* Translate everything marked with data-i18n inside a root element */
AA.applyStatic = (root = document) => {
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = AA.t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, AA.t(key));
    });
  });
};

/* <title>: "<page> — ATHAR" (the home page has its own full title) */
AA.applyTitle = () => {
  const page = document.body.dataset.page;
  if (!page || !AA.translations.fr[`title.${page}`]) return;
  const name = AA.t(`title.${page}`);
  document.title = page === "index" ? name : `${name} — ${AA.t("brand.name")}`;
};
AA.pageTitle = (detail) => `${detail} — ${AA.t("brand.name")}`;

/* Change language. Pages with data-lang-mode="soft" (forms in progress) update in place;
   the others reload so every generated card, filter and message is rebuilt in the new language. */
AA.setLang = (code) => {
  if (!AA.LANGS.some((l) => l.code === code) || code === AA.lang) return;
  try { localStorage.setItem(AA.LANG_KEY, code); } catch (error) { /* ignore */ }
  AA.lang = code;
  AA.applyDocumentLang();
  if (document.body.dataset.langMode === "soft") {
    AA.renderHeader();
    AA.renderFooter();
    AA.updateBadges();
    AA.applyStatic();
    AA.applyTitle();
    document.dispatchEvent(new CustomEvent("aa:lang", { detail: { lang: code } }));
  } else {
    window.location.reload();
  }
};
