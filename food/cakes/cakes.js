/* ============================================================
   CAKES — every cake recipe lives in this one file, and it's
   the only file you need to edit to add another one.
   No logic lives here, just the food. Copy an existing block,
   change the numbers, save, refresh the page.

   Each ingredient needs three things:
     g        how many grams in the ORIGINAL batch
     gPerCup  how many grams fit in one cup of this ingredient
              (butter 240, milk 240, cake flour 130, sugar 195)
              — this is what lets the card show cups AND grams
     name     what it's called
   Optional: sub  a short "— sifted" style aside

   Things you count instead of weigh (eggs) use `each` in place
   of gPerCup: grams per piece, plus a word to show after the
   number — { g: 72, each: 18, eachLabel: "large", name: "egg yolks" }
   shows as "4 large egg yolks" and rescales with the pan.
   ============================================================ */

const RECIPES = [
  {
    slug: "castella-cake",
    title: "Castella Cake",
    emoji: "🍰",
    blurb: "A tall, bouncy Taiwanese-style castella — barely sweet, cloud-soft, and famous for its jiggle. Five pantry staples and a gently folded meringue. Based on Emojoie Cuisine's recipe.",
    tags: ["Taiwanese-style", "Meringue", "Bakes at 300°F"],
    /* Castella scales by PAN: the batter depth is what keeps the long,
       low bake right, so a bigger pan gets more batter at the same depth. */
    scaleBy: "pan",
    mixName: "batter",
    basePan: { label: "6×6 pan", area: 36 },
    pans: [
      { label: "6×6",  area: 36, full: "6×6 square" },
      { label: "7×7",  area: 49, full: "7×7 square" },
      { label: "9×5",  area: 45, full: "9×5 loaf pan" },
      { label: "8×8",  area: 64, full: "8×8 square" },
      { label: "9×9",  area: 81, full: "9×9 square" }
    ],
    meta: [
      { k: "Hands-on", v: "~30 min" },
      { k: "Bake", v: "50–60 min" },
      { k: "Oven", v: "300°F / 150°C" }
    ],
    ingredients: [
      { g: 60,  gPerCup: 240, name: "unsalted butter" },
      { g: 60,  gPerCup: 240, name: "milk" },
      { g: 65,  gPerCup: 130, name: "cake flour", sub: "sifted" },
      { g: 72,  each: 18, eachLabel: "large", name: "egg yolks" },
      { g: 3,   gPerCup: 288, name: "vanilla extract", sub: "optional" },
      { g: 1,   gPerCup: 288, name: "salt", sub: "fine" },
      { g: 128, each: 32, eachLabel: "large", name: "egg whites", sub: "for the meringue" },
      { g: 65,  gPerCup: 195, name: "sugar", sub: "whipped into the whites" }
    ],
    /* {{n}} is a gram amount that rescales with the batch */
    bakeNote: "the 50–60 min bake at 150°C still holds",
    noteTitle: "No cake flour?",
    note: "Sift {{55}} plain flour with {{10}} cornstarch and use that instead.",
    steps: [
      { t: "Prep",     d: "Line the pan with parchment, leaving the paper standing a little taller than the sides. Heat the oven to 150°C / 300°F." },
      { t: "Warm",     d: "Melt the butter with the milk in a small pan over low heat, just until it steams. Don't let it boil." },
      { t: "Paste",    d: "Pour the hot butter and milk over the sifted cake flour and whisk until smooth and glossy." },
      { t: "Yolks",    d: "Whisk in the egg yolks, vanilla and salt until the batter is completely smooth." },
      { t: "Meringue", d: "Whip the egg whites, adding the sugar in three goes, to soft–medium peaks: the tip should bend over, not stand straight. Stiff meringue makes the top crack." },
      { t: "Fold",     d: "Whisk a third of the meringue into the yolk batter to loosen it, then gently fold in the rest in two batches until no streaks remain." },
      { t: "Pan",      d: "Pour into the pan and tap it on the counter a few times to pop any large bubbles." },
      { t: "Bake",     d: "Bake at 150°C / 300°F for 50–60 minutes, until the top is brown and springs back when pressed." },
      { t: "Cool",     d: "Lift the cake out by the paper, peel the sides away, and let it cool. It sinks a little as it cools — that's normal." }
    ],
    extra: {
      title: "For the jiggliest cake",
      items: [
        "Bake it in a water bath — set the pan in a larger tray with about 2 cm of hot water. The gentle steam keeps the crumb moist and the top from cracking.",
        "Fold slowly and stop as soon as it's streak-free; every extra stir knocks out air, and the air is the rise.",
        "Eat it warm for the most wobble, or chill it for firmer, cleaner slices."
      ]
    }
  },
  {
    slug: "banana-ogura-cake",
    title: "Banana Ogura Cake",
    emoji: "🍌",
    blurb: "Cotton-soft banana ogura — somewhere between a chiffon and a custard, and better than banana bread. Blended banana, no butter, and a long slow bake in a water bath. Based on Bake with Paws' recipe.",
    tags: ["Meringue", "Water bath", "Bakes at 290°F"],
    /* Ogura scales by PAN as well: it's poured shallow and baked slowly in
       a water bath, so a wider tin needs more batter to keep that depth. */
    scaleBy: "pan",
    mixName: "batter",
    /* round tins go in as area — π×r² — so they scale against the squares */
    basePan: { label: "8in round", area: 50 },
    pans: [
      { label: "6in", area: 28, full: "6-inch round tin" },
      { label: "7in", area: 38, full: "7-inch round tin" },
      { label: "9×5", area: 45, full: "9×5 loaf pan" },
      { label: "8in", area: 50, full: "8-inch round tin" },
      { label: "9in", area: 64, full: "9-inch round tin" }
    ],
    meta: [
      { k: "Hands-on", v: "~25 min" },
      { k: "Bake", v: "70 min" },
      { k: "Oven", v: "290°F / 145°C" }
    ],
    ingredients: [
      { g: 90,  each: 18, eachLabel: "large", name: "egg yolks" },
      { g: 50,  each: 50, eachLabel: "large", name: "whole egg", sub: "whisked in with the yolks" },
      { g: 160, gPerCup: 240, name: "ripe banana", sub: "blended smooth" },
      { g: 50,  gPerCup: 240, name: "neutral oil" },
      { g: 1.5, gPerCup: 288, name: "salt", sub: "fine" },
      { g: 80,  gPerCup: 125, name: "plain flour", sub: "sifted" },
      { g: 160, each: 32, eachLabel: "large", name: "egg whites", sub: "for the meringue" },
      { g: 1,   gPerCup: 154, name: "cream of tartar" },
      { g: 65,  gPerCup: 195, name: "caster sugar", sub: "whipped into the whites" }
    ],
    /* {{n}} is a gram amount that rescales with the batch */
    bakeNote: "the 70 min bake at 145°C still holds",
    noteTitle: "How ripe?",
    note: "Heavily freckled, almost black bananas blend sweeter and smoother. Weigh the purée rather than counting fruit: one medium banana gives about 80g, and you want {{160}}.",
    steps: [
      { t: "Prep",     d: "Heat the oven to 145°C / 290°F with top and bottom heat. Line the tin with parchment, and if it has a loose base, wrap the outside in foil so the water bath can't seep in." },
      { t: "Banana",   d: "Blend the bananas to a smooth purée rather than mashing them — lumps of fruit sink and leave holes in a crumb this fine." },
      { t: "Yolks",    d: "Separate the eggs. Add the whole egg to the yolks and whisk them together." },
      { t: "Batter",   d: "Whisk the oil, blended banana and salt into the yolks until combined, then add the sifted flour and mix until smooth." },
      { t: "Meringue", d: "Whisk the egg whites with the cream of tartar until foamy, then add the sugar a little at a time and whisk to firm peaks — holding their shape, still glossy." },
      { t: "Fold",     d: "Fold a third of the meringue into the banana batter to lighten it, pour that back over the remaining meringue, and fold gently until no white streaks remain." },
      { t: "Pan",      d: "Pour into the tin, tap it lightly on the counter, and run a skewer through the batter to break up any large bubbles." },
      { t: "Bath",     d: "Set the tin in a larger tray and pour in hot water to about 1.5 cm deep." },
      { t: "Bake",     d: "Bake for 70 minutes, until the top is set and springs back when pressed." },
      { t: "Invert",   d: "Lift the tin out of the water, tap it gently on the counter, then turn it upside down for 5–10 minutes. The cake sets hanging and shrinks far less." },
      { t: "Cool",     d: "Let it cool before slicing. Chilled overnight it slices cleanly — and tastes better cold the next day." }
    ],
    extra: {
      title: "For the softest crumb",
      items: [
        "Blend, don't mash. A smooth purée is what keeps the crumb even and the cake light.",
        "Firm peaks, not stiff ones. Stiff meringue tears as you fold it and cracks the top.",
        "Top the water bath up with hot water, never boiling — the gentle steam is the point of the long, low bake.",
        "It keeps beautifully: wrapped and chilled, it's softer and more banana-ish on day two."
      ]
    }
  }
  /* Add more cakes here — same shape, and the tabs appear automatically. */
];
