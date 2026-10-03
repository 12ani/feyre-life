/* ============================================================
   FILLINGS — everything that goes between the layers rather
   than being a bake of its own. Same shape as the other
   category files: no logic here, just the food. Copy a block,
   change the numbers, save, refresh the page.

   Each ingredient needs three things:
     g        how many grams in the ORIGINAL batch
     gPerCup  how many grams fit in one cup of this ingredient
              (cream 240, butter 240, chopped chocolate 170,
              corn syrup 328) — this is what lets the card show
              cups AND grams
     name     what it's called
   Optional: sub  a short "— softened" style aside
   ============================================================ */

const RECIPES = [
  {
    slug: "chocolate-ganache",
    title: "Chocolate Ganache Filling",
    emoji: "🍫",
    blurb: "A rich, thick ganache that holds its shape between cake layers instead of running out of them. Hot cream over chopped chocolate, and no oven at all. Enough for an 8- or 9-inch cake with 2–3 layers.",
    tags: ["No bake", "Make ahead", "Fills 2–3 layers"],
    /* Ganache scales by SERVINGS, not by pan: nothing is baked, so no
       depth has to stay right — you just want enough to go round the
       number of slices you're filling. */
    scaleBy: "servings",
    baseServings: 7,
    mixName: "ganache",
    meta: [
      { k: "Hands-on", v: "~15 min" },
      { k: "Thickens", v: "1–2 hrs" },
      { k: "Chill", v: "30 min" }
    ],
    ingredients: [
      { g: 174,  gPerCup: 170, name: "dark chocolate", sub: "60–70%, finely chopped" },
      { g: 120,  gPerCup: 240, name: "heavy cream" },
      { g: 18,   gPerCup: 240, name: "unsalted butter", sub: "softened" },
      { g: 13,   gPerCup: 328, name: "light corn syrup", sub: "or honey — optional, for shine" },
      { g: 0.75, gPerCup: 288, name: "salt", sub: "fine" },
      { g: 3.75, gPerCup: 288, name: "vanilla extract" }
    ],
    /* {{n}} is a gram amount that rescales with the batch */
    scaleNote: "the chocolate-to-cream ratio holds, so it sets just as firm",
    noteTitle: "Milk chocolate?",
    note: "It sets softer, so take it to about 2½ parts chocolate to one of cream: {{300}} chocolate against the same {{120}} cream.",
    steps: [
      { t: "Chop",     d: "Chop the chocolate finely and tip it into a heatproof bowl. Small, even pieces melt smoothly — big ones leave you stirring a cooling bowl." },
      { t: "Warm",     d: "Warm the cream with the corn syrup in a small pan over medium heat, just until it begins to simmer around the edges. Don't let it boil hard." },
      { t: "Wait",     d: "Pour the hot cream over the chocolate and leave it completely alone for a minute or two, so the heat softens it all the way through." },
      { t: "Stir",     d: "Stir gently from the centre outward until it's smooth and glossy, then add the butter, salt and vanilla and stir until fully combined." },
      { t: "Thicken",  d: "Leave it at room temperature, stirring now and then, until it's thick like peanut butter. In a hurry, chill it instead and stir every 10 minutes." },
      { t: "Fill",     d: "Spread an even layer, about ½ cm, over each cooled cake layer. Stack them and chill the cake for 30 minutes to firm up before frosting or serving." }
    ],
    extra: {
      title: "If it splits, or you want it lighter",
      items: [
        "Whip the cooled — but not yet set — ganache for 2–3 minutes and it turns fluffy, paler and lighter to eat.",
        "Split or looking greasy? Whisk in a tablespoon or two of warm cream until it comes back together.",
        "Fill only completely cool layers. On a cake that's still warm the ganache thins and slides straight out."
      ]
    }
  }
  /* Add more fillings here — curds, buttercreams, anything spreadable. */
];
