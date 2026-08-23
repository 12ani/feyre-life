/* ============================================================
   BREADS — every bread recipe lives in this one file, and it's
   the only file you need to edit to add another one.
   No logic lives here, just the food. Copy an existing block,
   change the numbers, save, refresh the page.

   Each ingredient needs three things:
     g        how many grams in the ORIGINAL batch
     gPerCup  how many grams fit in one cup of this ingredient
              (flour 125, water 240, oil 240, salt 240, starter 250)
              — this is what lets the card show cups AND grams
     name     what it's called
   Optional: sub  a short "— or all-purpose" style aside

   Two ways to resize a recipe:
     scaleBy: "pan"       you pick a baking pan   (bread, bakes)
     scaleBy: "servings"  you pick a number       (curry, soup)
   ============================================================ */

const RECIPES = [
  {
    slug: "sourdough-focaccia",
    title: "Sourdough Focaccia",
    emoji: "🫓",
    blurb: "Airy, olive-oil-rich sourdough focaccia. Sticky dough, no kneading — just folds, patience, and a good dimpling.",
    tags: ["Sourdough", "No-knead", "Bakes at 400°F"],
    /* Focaccia scales by PAN, not by servings — the pan sets the dough depth,
       and depth is what keeps the 30–35 min bake honest. */
    scaleBy: "pan",
    basePan: { label: "9×13 pan", area: 117 },
    pans: [
      { label: "8×8",        area: 64,  full: "8×8 square" },
      { label: "9×9",        area: 81,  full: "9×9 square" },
      { label: "9×13",       area: 117, full: "9×13 pan" },
      { label: "10×15",      area: 150, full: "10×15 pan" },
      { label: "13×18",      area: 234, full: "13×18 half sheet" }
    ],
    meta: [
      { k: "Hands-on", v: "~30 min" },
      { k: "Total", v: "8–10 hrs" },
      { k: "Oven", v: "400°F / 200°C" }
    ],
    ingredients: [
      { g: 125, gPerCup: 250,   name: "active sourdough starter" },
      { g: 380, gPerCup: 243.2, name: "water" },
      { g: 500, gPerCup: 125,   name: "bread flour", sub: "or all-purpose" },
      { g: 15,  gPerCup: 240,   name: "olive oil", sub: "plus more for the pan and top" },
      { g: 5,   gPerCup: 240,   name: "garlic salt" },
      { g: 5,   gPerCup: 240,   name: "salt" },
      { g: 15,  gPerCup: 240,   name: "butter", sub: "for greasing the pan" }
    ],
    /* {{n}} is a gram amount that rescales with the batch */
    bakeNote: "the 30–35 min bake still holds",
    noteTitle: "Salt swap",
    note: "Use {{10}} regular salt in total instead of splitting it between garlic salt and plain — the amount rescales with the pan either way.",
    steps: [
      { t: "Mix",           d: "Add starter, water, and olive oil to a bowl and mix until fully combined. Add flour and salt, then mix until no dry flour remains. The dough will be sticky." },
      { t: "Rest",          d: "Cover and rest at room temperature for 45 minutes." },
      { t: "Stretch & folds", d: "Do 2 sets of stretch and folds, 30 minutes apart. Cover the bowl between each set." },
      { t: "Coil folds",    d: "Do 2 sets of coil folds, 30 minutes apart. Cover the bowl between each set." },
      { t: "Bulk ferment",  d: "Let the dough finish fermenting at room temperature until it doubles in size." },
      { t: "Pan",           d: "Grease the pan with butter and drizzle with olive oil. Gently dump the dough into the pan. Cover and rest for 1 hour." },
      { t: "Dimple & top",  d: "Drizzle the dough with olive oil, then dimple all over with oiled or wet fingers. Add your desired toppings." },
      { t: "Bake",          d: "Bake at 400°F for 30–35 minutes, until golden." }
    ],
    extra: {
      title: "Optional overnight cold proof",
      items: [
        "After bulk ferment, cover the dough in the bowl and refrigerate overnight.",
        "When ready to bake, let it sit at room temperature for 2 hours.",
        "Transfer to the pan, rest 1 hour, then dimple and bake."
      ]
    }
  }
  /* Add more recipes here — same shape, and the tabs appear automatically. */
];