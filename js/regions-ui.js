/* ==========================================================
   regions-ui.js — helpers shared by explorer.html and region.html (Phase 3)
   Load after main.js (needs AA.icon, AA.t) and before explorer.js / region.js.

   - AA.regionUrl(id)     → "region.html?city=<id>"           (city page)
   - AA.regionMapUrl(id)  → "explorer.html?city=<id>#carte"   (back to the map, city highlighted)
   - AA.findRegion(param) → region from a URL parameter (also accepts common spellings)
   - AA.regionArt(region) → illustration used on cards and headers (SVG, always loads)
   - AA.regionMapSvg(opts)→ illustrated map of the Moroccan Sahara (SVG), same projection as the pins
   ========================================================== */

AA.regionUrl = (id) => `region.html?city=${encodeURIComponent(id)}`;
AA.regionMapUrl = (id) => `explorer.html?city=${encodeURIComponent(id)}#carte`;

/* Extra spellings accepted in the URL (the canonical ids are the ones in regions.js) */
AA.REGION_ALIASES = { laayoun: "laayoune", "el-aaiun": "laayoune", semara: "smara", "es-semara": "smara", essemara: "smara", bojador: "boujdour", "tan-tan": "tantan", guelmin: "guelmim", "cap-juby": "tarfaya" };
AA.findRegion = (param) => {
  if (!param) return null;
  const id = String(param).trim().toLowerCase();
  return AA.regionById(AA.REGION_ALIASES[id] || id) || null;
};

/* Colour pair per theme (project palette: green, teal, terracotta) */
AA.REGION_THEMES = {
  oasis: ["#1f4a3a", "#153528"],
  coast: ["#25525e", "#173642"],
  desert: ["#b5532f", "#6e2e1a"],
};

/* Card / header illustration: gradient + faint star lattice + the city's line icon */
AA.regionArt = (region, uid = "a") => {
  const [c1, c2] = AA.REGION_THEMES[region.theme] || AA.REGION_THEMES.desert;
  const gold = "#e9c58a";
  const gid = `rg-${region.id}-${uid}`;
  const pid = `rp-${region.id}-${uid}`;
  const iconBody = AA.ICON_PATHS[region.icon] || AA.ICON_PATHS.star8;
  return `<svg viewBox="0 0 400 300" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <pattern id="${pid}" width="60" height="60" patternUnits="userSpaceOnUse"><polygon points="${AA.starPoints(30, 30, 24, 13)}" fill="none" stroke="${gold}" stroke-width="1.4" opacity=".28"/></pattern>
    </defs>
    <rect width="400" height="300" fill="url(#${gid})"/>
    <rect width="400" height="300" fill="url(#${pid})"/>
    <circle cx="200" cy="140" r="78" fill="${c2}" opacity=".55"/>
    <circle cx="200" cy="140" r="78" fill="none" stroke="${gold}" stroke-width="2" opacity=".7"/>
    <g transform="translate(152 92) scale(4)" fill="none" stroke="${gold}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${iconBody}</g>
    <path d="M0 262q50-26 100 0t100 0 100 0 100 0v38H0z" fill="${c2}" opacity=".55"/>
  </svg>`;
};

/* Illustrated map of the Moroccan Sahara: Atlantic coastline + desert land, nothing else.
   No borders, no administrative areas, no country labels (places are only named and located).
   opts.mini : small locator without decoration */
AA.regionMapSvg = ({ mini = false } = {}) => {
  const m = AA.MAP, s = AA.MAP_SHAPES;
  const P = (lon, lat) => AA.mapProject(lon, lat);
  const pts = (list) => list.map(([lo, la]) => { const p = P(lo, la); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");
  const land = AA.landRing();

  let decor = "";
  if (!mini) {
    // Dune lines (clipped to the land) and a few small dune crests
    const d = (lon, lat, n) => { const p = P(lon, lat); return `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)}q10-7 20 0${"t20 0".repeat(n)}"/>`; };
    decor += `<g clip-path="url(#landclip)" fill="none" stroke="#d3b982" stroke-width="1.4" opacity=".95">${d(-13.6, 25.2, 3)}${d(-12.2, 24.4, 3)}${d(-10.4, 26.1, 3)}${d(-9.6, 27.5, 2)}${d(-11.8, 27.5, 2)}${d(-14.6, 24.2, 2)}${d(-9.4, 24.6, 3)}${d(-11, 23.6, 3)}${d(-12.6, 22.9, 3)}</g>`;
  }

  return `<svg viewBox="0 0 ${m.w.toFixed(0)} ${m.h.toFixed(0)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs><clipPath id="landclip"><polygon points="${pts(land)}"/></clipPath></defs>
    <rect width="${m.w.toFixed(0)}" height="${m.h.toFixed(0)}" fill="#cfe3e6"/>
    <polygon points="${pts(land)}" fill="#ecd9b0"/>
    <polyline points="${pts(s.coast)}" fill="none" stroke="#b5532f" stroke-width="${mini ? 5 : 2.4}" stroke-linejoin="round" stroke-linecap="round"/>
    ${decor}
  </svg>`;
};
