/* ==========================================================
   emploi.js — job offers page (FRONTEND DEMO ONLY)
   Lists the illustrative demo seeds + the job ads created from a cooperative dashboard in THIS browser
   (AA.coop.jobs(), see coop-data.js). Nothing here is a real vacancy.
   Account Phase 3: search + filters, optional "matches my profile" filter (job-seeker role),
   a detail view (emploi.html?job=ID) and contact links shown ONLY when a valid contact detail exists.
   Account fix: job-seeker role can apply (demo form -> aa_applications in localStorage, one per job per applicant).
   Applications are NEVER delivered to a cooperative or any real employer; no password is stored.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const A = AA.coop;
  const ACC = AA.account;
  const $ = (id) => document.getElementById(id);
  const q = $("jb-q"), regionSel = $("jb-f-region"), catSel = $("jb-f-cat"), grid = $("job-grid"), count = $("jb-count");
  const matchRow = $("jb-match-row"), matchBox = $("jb-match");
  const listView = $("job-list-view"), detail = $("job-detail");
  const role = ACC.role();
  // "my ads" and the manage links only exist for the cooperative demo role (display rule, not security)
  const mine = role === "coop" ? A.currentId() : null;
  const seeker = role === "job"; // the apply button / form exist only for the job-seeker demo role (display rule, not security)
  const locale = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" }[AA.lang] || "fr-FR";
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(locale); } catch (error) { return ""; } };
  const applyHref = (j) => `emploi.html?job=${encodeURIComponent(j.id)}&apply=1#apply`;
  const myApp = (j) => ACC.myApplications().find((x) => x.jobId === j.id);

  /* ---------- valid contact links (never invented) ---------- */
  const emailLink = (value) => {
    const e = String(value || "").trim();
    return e && AA.isEmail(e) ? { text: e, href: `mailto:${e}` } : null;
  };
  /* WhatsApp: only an international number (+ and 8-15 digits) or a valid Moroccan number (06…, 07…, 05…) gives a link */
  const whatsappLink = (value) => {
    const raw = String(value || "").replace(/[\s.\-()]/g, "");
    let digits = "";
    if (/^\+\d{8,15}$/.test(raw)) digits = raw.slice(1);
    else if (/^00\d{8,15}$/.test(raw)) digits = raw.slice(2);
    else if (AA.isPhone(raw)) digits = "212" + raw.replace(/^0/, "");
    return digits ? { text: String(value).trim(), href: `https://wa.me/${digits}` } : null;
  };
  const contactOf = (j) => ({
    mail: j.contact ? emailLink(j.contact.email) : null,
    wa: j.contact ? whatsappLink(j.contact.whatsapp) : null,
  });

  regionSel.innerHTML = `<option value="">${AA.esc(AA.t("jb.all.regions"))}</option>` + A.REGION_IDS.map((id) => `<option value="${id}">${AA.esc(A.regionLabel(id))}</option>`).join("");
  catSel.innerHTML = `<option value="">${AA.esc(AA.t("jb.all.cats"))}</option>` + A.JOB_CATS.map((k) => `<option value="${k}">${AA.esc(A.jobCatLabel(k))}</option>`).join("");

  const tags = (j, own) => `
    <div class="tags">
      <span class="tag tag--green">${AA.esc(A.jobCatLabel(j.cat))}</span>
      <span class="tag">${AA.icon("pin")}${AA.esc(A.regionLabel(j.region))}</span>
      <span class="tag tag--terra">${AA.esc(AA.t(j.seed ? "jb.tag.demo" : "jb.tag.coop"))}</span>
      ${own ? `<span class="tag">${AA.esc(AA.t("jb.mine"))}</span>` : ""}
    </div>`;
  const isOwn = (j) => !j.seed && mine && j.ownerId === mine;
  const detailHref = (j) => `emploi.html?job=${encodeURIComponent(j.id)}`;

  const card = (j) => {
    const own = isOwn(j);
    const c = contactOf(j);
    return `
    <article class="card job-card">
      <div class="card__body">
        ${tags(j, own)}
        <h3><a href="${detailHref(j)}">${AA.esc(A.tx(j.title))}</a></h3>
        <p class="card__meta">${AA.esc(AA.t("jb.by"))} : ${AA.esc(j.coopName)}${j.coopRegion ? ` · ${AA.esc(A.regionLabel(j.coopRegion))}` : ""}</p>
        <p>${AA.esc(A.tx(j.desc))}</p>
        ${c.mail || c.wa ? `<p class="card__meta job-has-contact">${AA.icon("checkCircle")}${AA.esc(AA.t("ac.jb.hascontact"))}</p>` : ""}
        <div class="card__actions">
          <a class="btn ${seeker ? "btn--outline" : "btn--primary"} btn--sm" href="${detailHref(j)}">${AA.esc(AA.t("ac.jb.detail"))}${AA.icon("arrowRight")}</a>
          ${seeker && !own ? (myApp(j)
            ? `<a class="btn btn--outline btn--sm" href="profil.html#apps">${AA.icon("checkCircle")}${AA.esc(AA.t("ac.ap.applied"))}</a>`
            : `<a class="btn btn--primary btn--sm" href="${applyHref(j)}">${AA.icon("briefcase")}${AA.esc(AA.t("ac.ap.btn"))}</a>`) : ""}
          ${own ? `<a class="btn btn--outline btn--sm" href="cooperative.html#jobs">${AA.icon("edit")}${AA.esc(AA.t("jb.manage"))}</a>` : ""}
        </div>
      </div>
    </article>`;
  };

  /* ---------- demo application (job-seeker role) ---------- */
  const row = (id, label, inner, extra = "") => `<div class="form-row"><label for="${id}">${AA.esc(label)}</label>${inner}${extra}<div class="field-error"></div></div>`;
  const appliedBox = (app) => `
    <div class="notice apply-done" role="status">${AA.icon("checkCircle")}<span>${AA.esc(AA.t("ac.ap.dup", { date: fmtDate(app.date) }))}</span>
      <a class="btn btn--outline btn--sm" href="profil.html#apps">${AA.esc(AA.t("ac.tab.apps"))}</a></div>`;

  function applySection(j) {
    if (!seeker || isOwn(j)) return "";
    const app = myApp(j);
    const acc = ACC.account();
    const profile = AA.store.get("aa_profile", {});
    const jp = ACC.jobProfile();
    const accName = acc && acc.type === "job" ? acc.name : "";
    const accEmail = acc && acc.type === "job" ? acc.email : "";
    const exp = `<option value="">${AA.esc(AA.t("ins.f.select"))}</option>` + [0, 1, 2, 3].map((i) => `<option value="${i}"${jp.exp === String(i) ? " selected" : ""}>${AA.esc(AA.t(`ins.exp.${i}`))}</option>`).join("");
    return `
      <section class="apply-box" id="apply" aria-labelledby="apply-h">
        <h3 id="apply-h">${AA.esc(AA.t("ac.ap.h"))}</h3>
        <p class="notice">${AA.esc(AA.t("ac.ap.demo"))}</p>
        <div id="apply-state">${app ? appliedBox(app) : `<button class="btn btn--primary" type="button" id="apply-open">${AA.icon("briefcase")}${AA.esc(AA.t("ac.ap.btn"))}</button>`}</div>
        ${app ? "" : `
        <form class="form-card apply-form" id="apply-form" novalidate hidden>
          ${row("ap-name", AA.t("ac.ap.f.name"), `<input id="ap-name" type="text" maxlength="80" autocomplete="name" value="${AA.esc(profile.name || accName || "")}">`)}
          ${row("ap-email", AA.t("ac.ap.f.email"), `<input id="ap-email" type="email" maxlength="120" autocomplete="email" value="${AA.esc(accEmail || profile.email || "")}">`)}
          ${row("ap-phone", AA.t("ac.ap.f.phone"), `<input id="ap-phone" type="tel" maxlength="24" autocomplete="tel">`)}
          ${row("ap-skills", AA.t("ac.ap.f.skills"), `<input id="ap-skills" type="text" maxlength="200" placeholder="${AA.esc(AA.t("ac.ap.f.skills.ph"))}" value="${AA.esc(jp.skills.join(", "))}">`)}
          ${row("ap-exp", AA.t("ac.ap.f.exp"), `<select id="ap-exp">${exp}</select>`)}
          ${row("ap-expdetail", AA.t("ac.ap.f.expdetail"), `<textarea id="ap-expdetail" rows="3" maxlength="600" placeholder="${AA.esc(AA.t("ac.ap.f.expdetail.ph"))}">${AA.esc(jp.expDetail)}</textarea>`)}
          ${row("ap-msg", AA.t("ac.ap.f.msg"), `<textarea id="ap-msg" rows="5" maxlength="1000" placeholder="${AA.esc(AA.t("ac.ap.f.msg.ph"))}"></textarea>`, `<div class="muted form-hint" id="ap-msg-count" dir="ltr">0 / 1000</div>`)}
          <div class="form-row"><label class="check"><input id="ap-consent" type="checkbox"><span>${AA.esc(AA.t("ac.ap.f.consent"))}</span></label><div class="field-error"></div></div>
          <div class="card__actions">
            <button class="btn btn--primary" type="submit">${AA.esc(AA.t("ac.ap.submit"))}</button>
            <button class="btn btn--outline" type="button" id="apply-cancel">${AA.esc(AA.t("ac.ap.cancel"))}</button>
          </div>
        </form>`}
      </section>`;
  }

  function bindApply(j) {
    const form = $("apply-form");
    if (!form) return;
    const open = $("apply-open"), msg = $("ap-msg"), count = $("ap-msg-count");
    const show = () => {
      form.hidden = false;
      if (open) open.hidden = true;
      $("apply").scrollIntoView({ behavior: "smooth", block: "start" });
      $("ap-name").focus({ preventScroll: true });
    };
    if (open) open.addEventListener("click", show);
    $("apply-cancel").addEventListener("click", () => { form.hidden = true; if (open) { open.hidden = false; open.focus(); } });
    msg.addEventListener("input", () => { count.textContent = `${msg.value.length} / 1000`; });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const v = (id) => $(id).value.trim();
      const phoneRaw = v("ap-phone").replace(/[\s.\-()]/g, "");
      const consent = $("ap-consent");
      const ok = [
        AA.fieldError($("ap-name"), v("ap-name").length >= 2 ? "" : AA.t("ac.ap.err.name")),
        AA.fieldError($("ap-email"), AA.isEmail(v("ap-email")) ? "" : AA.t("ac.ap.err.email")),
        AA.fieldError($("ap-phone"), !phoneRaw || /^\+?\d{8,15}$/.test(phoneRaw) ? "" : AA.t("ac.ap.err.phone")),
        AA.fieldError($("ap-skills"), v("ap-skills").length >= 2 ? "" : AA.t("ac.ap.err.skills")),
        AA.fieldError($("ap-expdetail"), v("ap-expdetail").length >= 10 ? "" : AA.t("ac.ap.err.expdetail")),
        AA.fieldError(msg, v("ap-msg").length >= 30 ? "" : AA.t("ac.ap.err.msg")),
        AA.fieldError(consent, consent.checked ? "" : AA.t("ac.ap.err.consent")),
      ];
      if (!ok.every(Boolean)) { const bad = form.querySelector(".is-invalid"); if (bad) bad.focus(); return; }
      const saved = ACC.addApplication({
        jobId: j.id,
        jobTitle: j.title,
        coopName: String(j.coopName || ""),
        name: v("ap-name").slice(0, 80),
        email: v("ap-email").slice(0, 120),
        phone: phoneRaw.slice(0, 24),
        skills: v("ap-skills").slice(0, 200),
        exp: $("ap-exp").value,
        expDetail: v("ap-expdetail").slice(0, 600),
        message: v("ap-msg").slice(0, 1000),
      });
      if (saved === null) { // already applied (for example in another tab): never create a duplicate
        $("apply-state").innerHTML = appliedBox(myApp(j));
        form.remove();
        AA.hydrateIcons();
        return;
      }
      if (!saved) { AA.toast(AA.t("ac.ap.fail"), true); return; }
      form.remove();
      $("apply-state").innerHTML = `
        <div class="confirmation apply-success" role="status">
          <div class="check-big">${AA.icon("check")}</div>
          <h3>${AA.esc(AA.t("ac.ap.ok.t"))}</h3>
          <p>${AA.esc(AA.t("ac.ap.ok.x", { job: A.tx(j.title), coop: j.coopName || "" }))}</p>
          <div class="confirmation__actions">
            <a class="btn btn--primary" href="profil.html#apps">${AA.esc(AA.t("ac.tab.apps"))}</a>
            <a class="btn btn--outline" href="emploi.html">${AA.esc(AA.t("ac.jb.back"))}</a>
          </div>
        </div>`;
      AA.hydrateIcons();
      AA.toast(AA.t("ac.ap.ok.t"));
      $("apply").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (AA.getParam("apply") === "1") show();
  }

  /* ---------- detail view ---------- */
  function showDetail(id) {
    listView.hidden = true;
    detail.hidden = false;
    const j = A.jobs().find((x) => x.id === id);
    const back = `<a class="btn btn--outline btn--sm" href="emploi.html">${AA.icon("arrowLeft")}${AA.esc(AA.t("ac.jb.back"))}</a>`;
    if (!j) {
      detail.innerHTML = `${back}${AA.emptyState({ icon: "search_empty", title: AA.esc(AA.t("ac.jb.notfound.t")), text: AA.esc(AA.t("ac.jb.notfound.x")) })}`;
      return;
    }
    const c = contactOf(j);
    const buttons = [
      c.mail ? `<a class="btn btn--primary" href="${AA.esc(c.mail.href)}">${AA.icon("user")}${AA.esc(AA.t("ac.jb.mail"))}</a><span class="muted job-contact-value">${AA.esc(c.mail.text)}</span>` : "",
      c.wa ? `<a class="btn btn--primary" href="${AA.esc(c.wa.href)}" target="_blank" rel="noopener noreferrer">${AA.icon("whatsapp")}${AA.esc(AA.t("ac.jb.wa"))}</a><span class="muted job-contact-value">${AA.esc(c.wa.text)}</span>` : "",
    ].filter(Boolean);
    const contactBlock = buttons.length
      ? `<div class="job-contact-actions">${buttons.map((b) => `<div class="job-contact-line">${b}</div>`).join("")}</div>`
      : `<p class="notice">${AA.esc(AA.t(j.seed ? "ac.jb.nocontact.seed" : "ac.jb.nocontact.coop"))}</p>`;
    detail.innerHTML = `
      <p>${back}</p>
      <article class="form-card job-detail">
        ${tags(j, isOwn(j))}
        <h2>${AA.esc(A.tx(j.title))}</h2>
        <p class="card__meta">${AA.esc(AA.t("jb.by"))} : ${AA.esc(j.coopName)}${j.coopRegion ? ` · ${AA.esc(A.regionLabel(j.coopRegion))}` : ""}</p>
        <dl class="job-facts">
          <div><dt>${AA.esc(AA.t("ac.jb.field"))}</dt><dd>${AA.esc(A.jobCatLabel(j.cat))}</dd></div>
          <div><dt>${AA.esc(AA.t("ac.jb.region"))}</dt><dd>${AA.esc(A.regionLabel(j.region))}</dd></div>
        </dl>
        <h3>${AA.esc(AA.t("ac.jb.about"))}</h3>
        <p class="job-detail__desc">${AA.esc(A.tx(j.desc))}</p>
        ${applySection(j)}
        <h3>${AA.esc(AA.t("ac.jb.contact.t"))}</h3>
        ${contactBlock}
        ${seeker ? "" : `<p class="muted job-detail__note">${AA.esc(AA.t("ac.jb.noapply"))}</p>`}
        ${isOwn(j) ? `<p><a class="btn btn--outline btn--sm" href="cooperative.html#jobs">${AA.icon("edit")}${AA.esc(AA.t("jb.manage"))}</a></p>` : ""}
      </article>`;
    document.title = `${A.tx(j.title)} — ${AA.t("brand.name")}`;
    AA.hydrateIcons();
    bindApply(j);
  }

  /* ---------- list view ---------- */
  function render() {
    const query = q.value.trim().toLowerCase();
    const jp = ACC.jobProfile();
    const useMatch = matchBox.checked;
    const list = A.jobs().filter((j) => {
      const text = `${A.tx(j.title)} ${A.tx(j.desc)} ${j.coopName} ${A.regionLabel(j.region)} ${A.jobCatLabel(j.cat)}`.toLowerCase();
      return (!query || text.includes(query)) && (!regionSel.value || j.region === regionSel.value) && (!catSel.value || j.cat === catSel.value)
        && (!useMatch || ACC.jobMatches(j, jp));
    });
    count.textContent = AA.plural("jb.count", list.length);
    grid.innerHTML = list.length ? list.map(card).join("")
      : AA.emptyState({ icon: "search_empty", title: AA.esc(AA.t("jb.empty.t")), text: AA.esc(AA.t("jb.empty.x")) });
    AA.hydrateIcons();
  }

  // cooperative call-to-action: not relevant for a customer or a job seeker
  const cta = $("job-cta");
  if (cta && (role === "client" || role === "job")) cta.remove();
  matchRow.hidden = role !== "job";

  [q, regionSel, catSel, matchBox].forEach((c) => c.addEventListener("input", render));
  // the query string can pre-filter: emploi.html?region=dakhla&match=1
  const pre = AA.getParam("region");
  if (pre && A.REGION_IDS.includes(pre)) regionSel.value = pre;
  if (role === "job" && AA.getParam("match") === "1") matchBox.checked = true;

  const jobId = AA.getParam("job");
  if (jobId) showDetail(jobId);
  else render();
});
