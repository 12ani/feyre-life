# Food

Recipe cards you can resize. Open a recipe's page in a browser, pick a pan (or a
serving count), and every amount rescales itself.

**[index.html](index.html)** lists every recipe, and each one has its own page:
**[breads/](breads/sourdough-focaccia.html)** → Sourdough Focaccia,
**[cakes/](cakes/castella-cake.html)** → Castella Cake, Banana Ogura Cake and
Orange Upside-Down Cake, and
**[fillings/](fillings/chocolate-ganache.html)** → Chocolate Ganache.

## Folder structure

```
food/
├── README.md            ← you are here
├── index.html           ← the list of recipes, linked from the front door
├── shared/              ← the engine, used by every category
│   ├── card.css             how the cards look
│   ├── art.js               the little drawings, one per recipe
│   └── card.js              the maths
├── breads/              ← one folder per category of food
│   ├── sourdough-focaccia.html  one page per recipe — open this in a browser
│   ├── breads.js            ★ the bread recipes — your file
│   └── sourdough-focaccia.md    the original handwritten notes
├── cakes/
│   ├── castella-cake.html
│   ├── banana-ogura-cake.html
│   ├── orange-upside-down-cake.html
│   ├── cakes.js             ★ the cake recipes
│   ├── castella-cake.md     the original recipe notes
│   ├── banana-ogura-cake.md
│   └── orange-upside-down-cake.md
└── fillings/            ← not a bake of its own: what goes between the layers
    ├── chocolate-ganache.html
    ├── fillings.js          ★ the fillings
    └── chocolate-ganache.md
```

The split that matters: **`shared/` is machinery, category folders are food.**
Adding a recipe should never mean opening a file that does fraction arithmetic.

## The three jobs, one file each

| File | What it is | Do you edit it? |
|---|---|---|
| `breads/sourdough-focaccia.html` | The skeleton — a header, an empty box, three `<script>` tags, and the recipe's `slug` on `<body>` | Once per recipe |
| `shared/card.css` | How it looks — colours, spacing, fonts | When you want a different look |
| `breads/breads.js` | **The food.** All the bread recipes | **Yes, this is your file** |
| `shared/card.js` | The engine — does the maths, draws the card | No |

## Adding a recipe

Three small steps, because a recipe is a page of its own:

1. Open `breads/breads.js`, copy the whole `{ ... }` block for the focaccia, paste
   it after (with a comma between them), and change the values — including `slug`,
   which is the recipe's name in lowercase-with-dashes.
2. Copy a page file next to it, rename it `<slug>.html`, and change two lines: the
   `<title>`, and `data-recipe="<slug>"` on `<body>`. That's what tells the shared
   engine which recipe this page shows.
3. Add a card to `food/index.html` so it appears in the list: copy one
   `<li>`, then change the link, the name, the two facts, the category pill,
   `data-art` (the slug) and the two colours (`--thumb` and `--art`, the
   background and accent of the theme the page wears in `shared/card.css`).
   To show a photo instead of the drawing, put an `<img>` inside `.thumb` and
   drop `data-art`.

Each ingredient looks like this:

```js
{ g: 500, gPerCup: 125, name: "bread flour", sub: "or all-purpose" }
```

`gPerCup` is how many grams fit in one cup of that ingredient. It's what lets the
card show grams *and* cups from a single number, so the two can never disagree.
Common ones: flour 125, sugar 200, water 240, oil 240, salt 240, butter 240,
starter 250. If you don't know one, guess 240 (that's water) or leave it out and
the card just shows grams.

Then choose how the recipe resizes:

```js
scaleBy: "pan"        // you pick a baking pan — for bread and bakes
scaleBy: "servings"   // you pick a number — for curries, soups, dinners
```

Focaccia uses `"pan"` because a pan is what actually decides how much dough you
need. A number of servings would be made up. The ganache goes the other way:
nothing is baked, so no depth has to stay right — you just want enough to go
round the slices, and it sets `baseServings` instead of `basePan` and `pans`.

## Adding a category

Copy the `breads/` folder, rename it (`desserts/`, `curries/`), rename the data
file inside to match, and in each page file point the one `<script src="...">`
line at the new data file. Then add a line for it to `food/index.html` so it
shows up in the list. The `../shared/` paths stay exactly as they are — that's
the whole point of keeping the engine in one place. `fillings/` was made this
way, from `cakes/`.

## Changing the colours

The whole card is one green — soft matcha and pistachio — used at different
strengths, the way hand-drawn recipe cards use one pink. Every colour is defined in the first ten lines of
`shared/card.css`, under `:root`. Change `--moss` and `--sage` and the page
follows — chips, checkmarks, headings, the drawing.

One exception: the scalloped border is a small SVG written directly into the
`.frame` rule, and an SVG in a `url()` can't read a CSS variable. Its green is
spelled out there as `%23A9C47E` (that's `#A9C47E` with the `#` escaped). If you
change the green, change that one too — there's a comment above it saying so.

A recipe can have its own colours without touching the others: the castella page
puts `class="theme-butter"` on its `<body>`, the banana ogura page
`class="theme-caramel"`, the orange cake `class="theme-marmalade"` and the
ganache `class="theme-cocoa"`, while the focaccia keeps the matcha of `:root`.
Each
theme is a small block near the top of `card.css` that redefines the same
variables (plus its own copy of the frame dots). Copy one to make another.

## Why three languages

- **HTML** — structure. What exists on the page.
- **CSS** — presentation. What it looks like.
- **JavaScript** — behaviour. What happens when you click.

These are the only three that run in a browser. HTML and CSS on their own can't
turn 500g into 275g when you tap a different pan, because neither can do
arithmetic — that's the whole reason the third file exists.

## If you want to poke at the code

Start in `shared/card.js` at `render()`. Notice that every click just changes a
value in `state` and calls `render()` again, redrawing the entire card from
scratch. Nothing updates the page piece by piece. That one idea is most of what
React and friends are built on, and it's why nothing can get out of sync.

## Counting eggs, and the extras a recipe can set

Eggs are counted, not weighed, so an ingredient can use `each` (grams per piece)
instead of `gPerCup`. `{ g: 72, each: 18, eachLabel: "large", name: "egg yolks" }`
reads "4 large egg yolks" and rescales to the nearest half egg.

- `mixName: "batter"` — the word the card uses when it rescales ("dough" by default).
- `bakeNote` / `scaleNote` — the end of the line under the picker once you've
  resized: `bakeNote` for a recipe that scales by pan ("the 70 min bake at 145°C
  still holds"), `scaleNote` for one that scales by servings.
- The drawing at the top is chosen by the recipe's `slug` in `shared/art.js`
  (the `ART` list), which the list of recipes uses for its thumbnails too. A
  recipe without a drawing just shows none.
