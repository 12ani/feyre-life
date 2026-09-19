/* ============================================================
   THE ENGINE — shared by every category folder (breads/, and any
   others you add later). You shouldn't need to touch this file.

   It does three jobs:
     1. turns grams into readable cups/spoons  (fmtVolume)
     2. works out the scale factor from the pan you picked
     3. redraws the whole card whenever you click anything

   The pattern to notice: there is ONE render() function, and
   every click just changes a value in `state` and calls it
   again. Nothing updates the page piece by piece — it redraws
   from scratch each time. That's how modern UI frameworks work
   too, and it's why there are no "forgot to update that bit"
   bugs.
   ============================================================ */

/* ============================================================
   NUMBER FORMATTING
   ============================================================ */
const FRACTIONS = [
  [0, ""], [0.125, "⅛"], [0.25, "¼"], [1/3, "⅓"], [0.375, "⅜"], [0.5, "½"],
  [0.625, "⅝"], [2/3, "⅔"], [0.75, "¾"], [0.875, "⅞"], [1, "carry"]
];

function fmtFrac(n) {
  let whole = Math.floor(n + 1e-9);
  const frac = n - whole;
  let best = FRACTIONS[0], bestDiff = Infinity;
  for (const f of FRACTIONS) {
    const d = Math.abs(frac - f[0]);
    if (d < bestDiff) { bestDiff = d; best = f; }
  }
  let glyph = best[1];
  if (glyph === "carry") { whole += 1; glyph = ""; }
  if (whole === 0 && !glyph) return "0";
  if (whole === 0) return glyph;
  return whole + glyph;
}

function fmtGrams(g) {
  if (g >= 100) return Math.round(g / 5) * 5 + "g";
  if (g >= 20)  return Math.round(g) + "g";
  return (Math.round(g * 2) / 2) + "g";
}

/* grams -> "1½ cups + 1 Tbsp" style volume */
function fmtVolume(grams, gPerCup) {
  if (!gPerCup) return "";
  let tsp = grams / gPerCup * 48;
  if (tsp < 0.2) return "a pinch";   // under ~⅕ tsp, rounding up to ¼ would overstate it
  tsp = tsp >= 12 ? Math.round(tsp * 2) / 2 : Math.round(tsp * 4) / 4;
  if (tsp < 0.25) return "a pinch";

  const parts = [];
  const cups = Math.floor(tsp / 48 + 1e-9);
  let rem = tsp - cups * 48;

  let cupFrac = "";
  /* only reach for a cup fraction at ¼ cup or more — below that, Tbsp reads better */
  for (const [t, glyph] of [[36,"¾"],[32,"⅔"],[24,"½"],[16,"⅓"],[12,"¼"]]) {
    if (rem >= t - 1e-9) { cupFrac = glyph; rem -= t; break; }
  }
  if (cups > 0 || cupFrac) {
    const plural = (cups > 1 || (cups === 1 && cupFrac)) ? "cups" : "cup";
    parts.push((cups > 0 ? cups : "") + cupFrac + " " + plural);
  }

  rem = Math.round(rem * 4) / 4;
  const tbsp = Math.floor(rem / 3 + 1e-9);
  if (tbsp > 0) { parts.push(fmtFrac(tbsp) + " Tbsp"); rem -= tbsp * 3; }

  rem = Math.round(rem * 4) / 4;
  if (rem >= 0.25) parts.push(fmtFrac(rem) + " tsp");

  return parts.join(" + ");
}

/* grams -> "4 large" for things you count rather than weigh (eggs),
   rounded to the nearest half so it stays something you can crack */
function fmtCount(grams, each, label) {
  const n = Math.max(0.5, Math.round(grams / each * 2) / 2);
  return fmtFrac(n) + (label ? " " + label : "");
}

/* rescale any {{grams}} written inside a note */
function scaleNote(text, scale) {
  return text.replace(/\{\{([\d.]+)\}\}/g, (_, n) => fmtGrams(parseFloat(n) * scale));
}

/* "an 8×8 square" vs "a 9×13 pan" */
function withArticle(label) {
  return (/^(8|11|18|[aeiou])/i.test(label) ? "an " : "a ") + label;
}

/* ============================================================
   STATE + RENDER
   ============================================================ */
/* which recipe this page shows: every recipe page names its own slug
   on <body data-recipe="...">, so a page is one recipe and nothing else */
const recipe = RECIPES.find(r => r.slug === document.body.dataset.recipe) || RECIPES[0];

/* pick returns the starting size for a recipe: a pan index, or a serving count */
function startSize(r) {
  return r.scaleBy === "pan"
    ? r.pans.findIndex(p => p.area === r.basePan.area)
    : r.baseServings;
}

const state = {
  size: startSize(recipe),   // pan index in "pan" mode, servings count otherwise
  unit: "g",                 // "g" or "cup"
  doneIng: new Set(),
  doneStep: new Set()
};

const $card = document.getElementById("card");

/* the link at the top goes back the way you came — to the list, the
   front door, wherever. Opened cold (a bookmark, a shared link), there
   is nothing to go back to, so its href takes you to the recipes. */
const $back = document.getElementById("back");
if ($back && document.referrer && new URL(document.referrer).origin === location.origin) {
  $back.onclick = e => { e.preventDefault(); history.back(); };
}

/* little line drawings, one per recipe (matched by slug), drawn in
   whatever colour the page is using. A recipe without one just
   shows no picture. */
const FOCACCIA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the slab, drawn a little wobbly on purpose -->
  <path d="M24 46c30-8 162-8 192 0 10 3 14 10 14 20v68c0 12-6 19-18 21-46 7-138 7-184 0-12-2-18-9-18-21V66c0-10 4-17 14-20z"/>
  <!-- crust line -->
  <path d="M36 60c26-6 142-6 168 0 6 2 9 6 9 12v52c0 8-5 13-13 14-40 5-120 5-160 0-8-1-13-6-13-14V72c0-6 3-10 9-12z" stroke-width="1.8"/>
  <!-- dimples -->
  <g stroke-width="1.9">
    <ellipse cx="60" cy="80" rx="5.4" ry="4.2"/><ellipse cx="96" cy="72" rx="4.8" ry="3.8"/>
    <ellipse cx="132" cy="80" rx="5.4" ry="4.2"/><ellipse cx="168" cy="72" rx="4.8" ry="3.8"/>
    <ellipse cx="198" cy="84" rx="5" ry="4"/><ellipse cx="78" cy="106" rx="5" ry="4"/>
    <ellipse cx="114" cy="98" rx="4.6" ry="3.6"/><ellipse cx="190" cy="110" rx="5" ry="4"/>
  </g>
  <!-- a sprig of rosemary: both leaves sweep BACK from each node,
       otherwise the pairs read as a fishbone -->
  <g stroke-width="1.7">
    <path d="M54 129c22-6 45-10 69-12"/>
    <path d="M70 126l-7-3.5M70 126l-7 3.5M86 123l-7-3.5M86 123l-7 3.5M101 121l-7-3.5M101 121l-7 3.5M115 119l-7-3.5M115 119l-7 3.5"/>
  </g>
  <!-- olives -->
  <g stroke-width="1.8">
    <circle cx="150" cy="122" r="6"/><circle cx="150" cy="122" r="2"/>
    <circle cx="172" cy="114" r="5"/><circle cx="172" cy="114" r="1.7"/>
  </g>
</svg>`;

/* a tall castella block with a slice cut off, wobbling */
const CASTELLA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the block: top, front, side -->
  <path d="M40 78c10-7 20-14 32-20 36-1 72-1 108 0-10 7-20 14-31 20-36 1-73 1-109 0z"/>
  <path d="M40 78c-1 30-1 58 1 86 36 2 72 2 108 0 2-28 2-56 0-86"/>
  <path d="M149 78c11-6 21-13 31-20 1 28 1 56-1 84-10 8-20 15-30 22"/>
  <!-- the brown top crust -->
  <path d="M41 92c36 2 72 2 108 0M149 92c10-6 20-13 30-20" stroke-width="1.8"/>
  <!-- the slice, leaning off to the right -->
  <path d="M170 116c4-4 9-8 14-11 12-1 24-2 36-2-4 4-9 8-14 11-12 1-24 1-36 2z"/>
  <path d="M170 116c0 18 1 36 3 54 12 0 23-1 35-2-2-18-3-36-2-54"/>
  <path d="M206 114c5-3 9-7 14-11 1 18 2 36 3 54-5 4-10 7-15 11"/>
  <path d="M171 126c12-1 24-1 35-2" stroke-width="1.8"/>
  <!-- airy crumb -->
  <g stroke-width="1.6">
    <circle cx="62" cy="116" r="2.2"/><circle cx="90" cy="130" r="1.8"/><circle cx="118" cy="112" r="2"/>
    <circle cx="74" cy="148" r="1.8"/><circle cx="128" cy="146" r="2.2"/><circle cx="104" cy="156" r="1.6"/>
    <circle cx="184" cy="142" r="1.8"/><circle cx="196" cy="156" r="1.6"/>
  </g>
  <!-- the jiggle -->
  <g stroke-width="1.8">
    <path d="M26 100c-6 10-6 24 0 34M16 108c-4 7-4 15 0 20"/>
    <path d="M94 44c4-3 8-3 12 0s8 3 12 0"/>
  </g>
</svg>`;

/* a round ogura with a wedge set aside, and the banana it came from */
const BANANA_OGURA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the round tin's worth of cake -->
  <path d="M40 66c0-11 25-20 56-20s56 9 56 20-25 20-56 20-56-9-56-20z"/>
  <path d="M40 66v32c0 11 25 20 56 20s56-9 56-20V66"/>
  <!-- the browned top, just inside the rim -->
  <path d="M47 70c7 7 26 12 49 12s42-5 49-12" stroke-width="1.8"/>
  <!-- one wedge, cut and set aside -->
  <path d="M168 126l48-16c6 7 10 18 10 30l-58-14z"/>
  <path d="M168 126v18l58 14v-18"/>
  <path d="M168 133l58 14" stroke-width="1.8"/>
  <!-- airy crumb -->
  <g stroke-width="1.6">
    <circle cx="60" cy="98" r="2"/><circle cx="82" cy="108" r="1.7"/>
    <circle cx="98" cy="96" r="1.6"/><circle cx="118" cy="105" r="1.9"/>
    <circle cx="138" cy="98" r="1.5"/>
    <circle cx="188" cy="139" r="1.7"/><circle cx="207" cy="147" r="1.5"/>
  </g>
  <!-- the banana it came from: blunt at the stem, both ends turned up -->
  <path d="M40 146c10 40 70 46 94 6l-8-11c-14 25-64 19-86 5z"/>
  <path d="M130 146l8-9M40 146l-4-3"/>
  <path d="M54 156c24 16 52 12 68-6" stroke-width="1.7"/>
</svg>`;

const ART = {
  "sourdough-focaccia": FOCACCIA_ART,
  "castella-cake": CASTELLA_ART,
  "banana-ogura-cake": BANANA_OGURA_ART
};

function render() {
  const r = recipe;
  const byPan = r.scaleBy === "pan";
  const pan = byPan ? r.pans[state.size] : null;
  const scale = byPan ? pan.area / r.basePan.area : state.size / r.baseServings;
  const scaled = Math.abs(scale - 1) > 0.005;
  const mix = r.mixName || "dough";   // "dough" for bread, "batter" for cake

  const ings = r.ingredients.map((ing, i) => {
    const g = ing.g * scale;
    const gTxt = fmtGrams(g);
    const vTxt = ing.each ? fmtCount(g, ing.each, ing.eachLabel) : fmtVolume(g, ing.gPerCup);
    const primary = state.unit === "g" ? gTxt : vTxt;
    const secondary = state.unit === "g" ? vTxt : gTxt;
    return `<li class="${state.doneIng.has(i) ? "done" : ""}" data-i="${i}">
      <span class="box"></span>
      <span class="amt">${primary}</span>
      <span class="name">${ing.name}${ing.sub ? ` <span class="sub">— ${ing.sub}</span>` : ""}
        ${secondary ? `<span class="alt">${secondary}</span>` : ""}
      </span>
    </li>`;
  }).join("");

  const steps = r.steps.map((s, i) =>
    `<li class="${state.doneStep.has(i) ? "done" : ""}" data-i="${i}">
      <span class="txt"><strong>${s.t}</strong>${s.d}</span>
    </li>`
  ).join("");

  const pct = Math.round(state.doneStep.size / r.steps.length * 100);

  const chips = byPan
    ? r.pans.map((p, i) =>
        `<button class="chip pan ${state.size === i ? "on" : ""}" data-s="${i}">${p.label}${p.area === r.basePan.area ? '<em>original</em>' : ''}</button>`
      ).join("")
    : [Math.round(r.baseServings / 2), r.baseServings, r.baseServings * 2]
        .filter((v, i, a) => v >= 1 && a.indexOf(v) === i)
        .map(v => `<button class="chip ${state.size === v ? "on" : ""}" data-s="${v}">${v}</button>`)
        .join("");

  $card.innerHTML = `
    <div class="hero">
      <div class="hero-text">
        <h1 class="script">${r.title}</h1>
        <p class="blurb">${r.blurb}</p>
      </div>
      <div class="hero-art">${ART[r.slug] || ""}</div>
    </div>

    <div class="facts">
      ${r.meta.map(m => `<div><div class="k">${m.k}</div><div class="v">${m.v}</div></div>`).join("")}
      <div><div class="k">Makes</div><div class="v">${byPan ? "one " + pan.full : state.size + " servings"}</div></div>
    </div>

    <div class="picker">
      <div class="picker-head">
        <span class="label">${byPan ? "Pick your pan" : "How many servings?"}</span>
        <span class="batch">${mix} ×${Math.round(scale * 100) / 100}</span>
      </div>
      <div class="controls">
        ${byPan ? "" : `<div class="stepper">
          <button id="minus" ${state.size <= 1 ? "disabled" : ""} aria-label="Fewer servings">−</button>
          <div class="count">${state.size}<small>servings</small></div>
          <button id="plus" ${state.size >= 48 ? "disabled" : ""} aria-label="More servings">+</button>
        </div>`}
        <div class="chips">${chips}</div>
        <div class="unit-toggle">
          <button data-u="g" class="${state.unit === "g" ? "on" : ""}">grams</button>
          <button data-u="cup" class="${state.unit === "cup" ? "on" : ""}">cups</button>
        </div>
      </div>
      <p class="pan-hint">
        ${scaled
          ? `${mix[0].toUpperCase() + mix.slice(1)} <b>${scale < 1 ? "scaled down" : "scaled up"} ×${Math.round(scale * 100) / 100}</b> to fill <b>${pan ? withArticle(pan.full) : ""}</b> at the same depth as the original — so <b>${r.bakeNote || "the bake time holds"}</b>.<span class="scaled-flag">adjusted</span>`
          : `The original batch, sized for <b>${pan ? withArticle(pan.full) : ""}</b>.`}
      </p>
    </div>

    <div class="cols">
      <div>
        <h2 class="script">Ingredients</h2>
        <ul class="ing">${ings}</ul>
        ${r.note ? `<div class="blob"><b>${r.noteTitle || "Good to know"}</b>${scaleNote(r.note, scale)}</div>` : ""}
      </div>

      <div>
        <h2 class="script">Instructions</h2>
        <ol class="steps">${steps}</ol>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <div class="progress-lbl">
          <span>${state.doneStep.size} of ${r.steps.length} steps done</span>
          <button class="reset" id="reset">reset</button>
        </div>
        ${r.extra ? `<div class="extra">
          <h3>${r.extra.title}</h3>
          <ul>${r.extra.items.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>` : ""}
      </div>
    </div>

    <footer>
      Amounts scale by pan area and round to what a kitchen scale can actually read.<br>
      <button class="print" onclick="window.print()">Print this card</button>
    </footer>
  `;

  // --- wiring ---
  const minus = document.getElementById("minus");
  if (minus) minus.onclick = () => { state.size = Math.max(1, state.size - 1); render(); };
  const plus = document.getElementById("plus");
  if (plus) plus.onclick = () => { state.size = Math.min(48, state.size + 1); render(); };
  $card.querySelectorAll(".chip").forEach(c => c.onclick = () => { state.size = +c.dataset.s; render(); });
  $card.querySelectorAll(".unit-toggle button").forEach(b => b.onclick = () => { state.unit = b.dataset.u; render(); });
  $card.querySelectorAll("ul.ing li").forEach(li => li.onclick = () => {
    const i = +li.dataset.i;
    state.doneIng.has(i) ? state.doneIng.delete(i) : state.doneIng.add(i);
    render();
  });
  $card.querySelectorAll("ol.steps li").forEach(li => li.onclick = () => {
    const i = +li.dataset.i;
    state.doneStep.has(i) ? state.doneStep.delete(i) : state.doneStep.add(i);
    render();
  });
  document.getElementById("reset").onclick = () => { state.doneStep.clear(); state.doneIng.clear(); render(); };
}

render();