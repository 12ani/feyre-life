/* ============================================================
   THE PACKING ENGINE — reads items.js and draws the checklist.
   You shouldn't need to touch this file: the list itself lives
   in items.js.

   Same pattern as the recipe cards: every change (the number of
   days, a toggle, a tick) updates `state` and calls render(),
   which redraws the list from scratch.

   There's no server: the trip and the ticks are saved on the phone
   itself (localStorage). Each phone with the app keeps its own list,
   and the front door's card reads that same saved copy to show how
   far the packing has got.
   ============================================================ */

const MAX_DAYS = 60;
const STORE = "feyre-packing";
const QUICK_DAYS = [3, 5, 7, 10, 14];
const OPTION_IDS = PACKING.options.map(o => o.id);

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clampDays = n => Math.min(MAX_DAYS, Math.max(1, Math.round(n) || 1));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const plural = n => (n === 1 ? "day" : "days");

/* every item gets a stable id from its name, so a tick survives
   reordering the list or changing the trip length */
PACKING.groups.forEach(g => g.items.forEach(item => { item.id = slug(item.name); }));

/* ============================================================
   STATE
   ============================================================ */
function loadState() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch (e) { /* private browsing or blocked storage — start fresh */ }
  return {
    days: clampDays(saved.days || PACKING.defaultDays),
    options: new Set((saved.options || []).filter(id => OPTION_IDS.includes(id))),
    packed: new Set(saved.packed || [])
  };
}

const state = loadState();

function saveState(summary) {
  try {
    localStorage.setItem(STORE, JSON.stringify({
      days: state.days, options: [...state.options], packed: [...state.packed],
      summary   // { days, done, total } — shown on the front door's card
    }));
  } catch (e) { /* storage blocked — the list still works, it just won't remember */ }
}

/* ============================================================
   THE MATHS
   ============================================================ */
const isCounted = item => Boolean(item.perDay || item.every || item.extra);

function howMany(item) {
  const days = state.options.has("laundry")
    ? Math.min(state.days, PACKING.laundryDays)
    : state.days;
  let n = item.perDay ? Math.ceil(days * item.perDay)
        : item.every  ? Math.ceil(days / item.every)
        : 1;
  n += item.extra || 0;
  if (item.max) n = Math.min(n, item.max);
  return Math.max(1, n);
}

const isShown = item =>
  (!item.when || state.options.has(item.when)) &&
  (!item.minDays || state.days >= item.minDays);

function currentGroups() {
  return PACKING.groups
    .map(g => ({ ...g, items: g.items.filter(isShown) }))
    .filter(g => g.items.length);
}

/* ============================================================
   DRAWING
   ============================================================ */
function renderControls() {
  $("quick").innerHTML = QUICK_DAYS.map(d =>
    `<button type="button" class="chip" data-days="${d}">${d} days</button>`
  ).join("");
  $("opts").innerHTML = PACKING.options.map(o =>
    `<button type="button" class="chip opt" data-opt="${o.id}" aria-pressed="false">${esc(o.label)}</button>`
  ).join("");
}

function itemRow(item) {
  const on = state.packed.has(item.id);
  return `<li class="${on ? "done" : ""}">
    <label>
      <input type="checkbox" data-id="${item.id}"${on ? " checked" : ""}>
      <span class="box" aria-hidden="true"></span>
      <span class="qty">${isCounted(item) ? howMany(item) : ""}</span>
      <span class="what">${esc(item.name)}${item.note ? `<small>${esc(item.note)}</small>` : ""}</span>
    </label>
  </li>`;
}

function render({ keepInput = false } = {}) {
  // the trip controls
  if (!keepInput) $("days").value = state.days;
  $("days").style.width = ($("days").value.length || 1) + 0.4 + "ch";   // hug the number
  $("days-word").textContent = plural(state.days);
  $("minus").disabled = state.days <= 1;
  $("plus").disabled = state.days >= MAX_DAYS;
  document.querySelectorAll("#quick .chip").forEach(b =>
    b.classList.toggle("on", Number(b.dataset.days) === state.days));
  document.querySelectorAll("#opts .opt").forEach(b =>
    b.setAttribute("aria-pressed", String(state.options.has(b.dataset.opt))));

  const long = state.days > PACKING.laundryDays;
  const laundry = state.options.has("laundry");
  $("hint").textContent =
    long && !laundry ? `Longer than ${PACKING.laundryDays} days? Switch on “Laundry on the trip” to pack a week’s clothes and wash once.`
    : long && laundry ? `Clothes are counted for ${PACKING.laundryDays} days — plan a wash midway.`
    : "";
  $("hint").hidden = !$("hint").textContent;

  // the list
  const groups = currentGroups();
  const items = groups.flatMap(g => g.items);
  const done = items.filter(i => state.packed.has(i.id)).length;

  $("list").innerHTML = groups.map(g => {
    const got = g.items.filter(i => state.packed.has(i.id)).length;
    return `<section class="pack-group${got === g.items.length ? " complete" : ""}">
      <h2><span class="emoji" aria-hidden="true">${g.emoji || ""}</span>${esc(g.title)}<span class="tally">${got}/${g.items.length}</span></h2>
      <ul>${g.items.map(itemRow).join("")}</ul>
    </section>`;
  }).join("");

  // the progress bar
  $("done").textContent = done;
  $("total").textContent = items.length;
  $("progress-note").textContent = items.length && done === items.length ? "packed — all done ✦" : "packed";
  $("bar").style.width = (items.length ? (done / items.length) * 100 : 0) + "%";

  saveState({ days: state.days, done, total: items.length });
}

/* ============================================================
   WIRING
   ============================================================ */
renderControls();
render();

$("minus").onclick = () => { state.days = clampDays(state.days - 1); render(); };
$("plus").onclick  = () => { state.days = clampDays(state.days + 1); render(); };

$("days").addEventListener("input", e => {
  const n = Number(e.target.value);
  if (n >= 1) { state.days = clampDays(n); render({ keepInput: true }); }
});
// when the box loses focus, tidy what's in it: empty → last value, 99 → 60
$("days").addEventListener("change", () => render());

$("quick").onclick = e => {
  const chip = e.target.closest("[data-days]");
  if (chip) { state.days = Number(chip.dataset.days); render(); }
};

$("opts").onclick = e => {
  const chip = e.target.closest("[data-opt]");
  if (!chip) return;
  const id = chip.dataset.opt;
  state.options.has(id) ? state.options.delete(id) : state.options.add(id);
  render();
};

$("list").addEventListener("change", e => {
  const id = e.target.dataset.id;
  if (!id) return;
  e.target.checked ? state.packed.add(id) : state.packed.delete(id);
  render();
  // the list was redrawn — put keyboard focus back on the same box
  const box = document.querySelector(`#list input[data-id="${id}"]`);
  if (box) box.focus({ preventScroll: true });
});

$("restart").onclick = () => {
  if (state.packed.size && !confirm("Untick everything and start again?")) return;
  state.packed.clear();
  render();
};
