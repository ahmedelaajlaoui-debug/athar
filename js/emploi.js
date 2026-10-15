/* ==========================================================
   emploi.js — job offers page (FRONTEND DEMO ONLY)
   Lists the illustrative demo seeds + the job ads created from a cooperative dashboard in THIS browser
   (AA.coop.jobs(), see coop-data.js). Nothing here is a real vacancy.
   Account Phase 3: search + filters, optional "matches my profile" filter (job-seeker role),
   a detail view (emploi.html?job=ID) and contact links shown ONLY when a valid contact detail exists.
   There is no application form: ATHAR does not send or store any application.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const A = AA.coop;
  const ACC = AA.account;
  const $ = (id) => document.getElementById(id);
  const q = $("jb-q"), regionSel = $("jb-f-region"), catSel = $("jb-f-cat"), grid = $("job-grid"), count = $("jb-count");
  const matchRow = $("jb-match-row"), matchBox = $("jb-match");
  const listView = $("job-list-view"), detail = $("job-detail");
  const mine = A.currentId();
  const role = ACC.role();

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
          <a class="btn btn--primary btn--sm" href="${detailHref(j)}">${AA.esc(AA.t("ac.jb.detail"))}${AA.icon("arrowRight")}</a>
          ${own ? `<a class="btn btn--outline btn--sm" href="cooperative.html#jobs">${AA.icon("edit")}${AA.esc(AA.t("jb.manage"))}</a>` : ""}
        </div>
      </div>
    </article>`;
  };

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
        <h3>${AA.esc(AA.t("ac.jb.contact.t"))}</h3>
        ${contactBlock}
        <p class="muted job-detail__note">${AA.esc(AA.t("ac.jb.noapply"))}</p>
        ${isOwn(j) ? `<p><a class="btn btn--outline btn--sm" href="cooperative.html#jobs">${AA.icon("edit")}${AA.esc(AA.t("jb.manage"))}</a></p>` : ""}
      </article>`;
    document.title = `${A.tx(j.title)} — ${AA.t("brand.name")}`;
    AA.hydrateIcons();
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
  if (cta && (role === "client" || role === "job")) cta.hidden = true;
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
