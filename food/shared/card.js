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
          ? `${mix[0].toUpperCase() + mix.slice(1)} <b>${scale < 1 ? "scaled down" : "scaled up"} ×${Math.round(scale * 100) / 100}</b> ${byPan
              ? `to fill <b>${withArticle(pan.full)}</b> at the same depth as the original — so <b>${r.bakeNote || "the bake time holds"}</b>`
              : `to make <b>${state.size} servings</b>${r.scaleNote ? ` — <b>${r.scaleNote}</b>` : ""}`}.<span class="scaled-flag">adjusted</span>`
          : `The original batch, ${byPan
              ? `sized for <b>${withArticle(pan.full)}</b>`
              : `written for <b>${r.baseServings} servings</b>`}.`}
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