# Feyre Life

A personal diary you can install. Recipes, trips, and — later — photo albums
and collected things, all in one place instead of scattered across your phone.

It's a **PWA**: a website that installs to a home screen with its own icon,
opens full-screen with no browser bar, and works with no signal. One codebase
covers iPhone, MacBook, Android and anything else with a browser. Sharing it
with someone is sending them a link.

## What's here

```
feyre-life/
├── index.html          ← the front door: one card per section
├── sw.js                  makes it work offline  (must stay at the root)
├── app/                ← the shell, shared by every page
│   ├── shell.css           how the shell looks
│   ├── app.js              turns on offline + the iPhone install hint
│   ├── manifest.webmanifest  name, colours and icons of the installed app
│   └── icons/              the home-screen icon, in every size iOS/Android want
├── food/               ← recipes  (has its own README)
│   ├── shared/             the scaling engine
│   └── breads/             sourdough focaccia
└── trips/              ← trips
    ├── index.html          the list of trips
    └── japan/              guide · original notes
```

## The one design rule

**The shell is quiet. Each section keeps its own voice.**

The recipe cards are moss green with handwriting. The Japan guide is washi paper
and sumi ink. They look nothing alike, and that's on purpose — the shell is a
scrapbook binding, not a uniform. It borrows each section's colour for that
section's card on the home page and otherwise stays out of the way.

So when you add a new section, give it whatever look the thing deserves. The
only thing it owes the app is a link back to `index.html`.

## Looking at it while you work

Open `index.html` in a browser and everything works — except offline, because
service workers refuse to run on `file://`. To get the real thing:

```bash
python3 -m http.server 8099
```

Then visit **http://localhost:8099**. That's the whole build step. There isn't one.

## Adding a trip

1. Make a folder under `trips/` — `trips/portugal/`
2. Put whatever you like in it. A single HTML page is plenty
3. Add a line to the list in `trips/index.html`
4. Add a `← trips` link at the bottom of your page so people can get back out

## Adding a section

Copy the pattern of `trips/`: a folder, an `index.html` that loads
`../app/shell.css`, and one more `<a class="card">` on the home page. Give it a
colour in the `:root` block at the top of `app/shell.css`.

## Changing the icon

`app/icons/` is generated, not drawn by hand. The flower is a few circles
rasterised by a short Python script — rerun it if you want different colours.
All five sizes matter: iOS uses `apple-touch-icon.png`, Android uses the
`maskable` one so its launcher can crop the shape it likes.

## After a change, phones may look stale

The service worker serves the cached copy first and fetches a fresh one behind
it, so a change shows up on the **second** visit. If you change which files are
listed in `sw.js`, bump `CACHE = "feyre-v1"` to `v2` — otherwise phones keep
serving the old list forever.

## Why there's no framework

Nothing here has dependencies, so nothing rots. The reason `food/` still runs
untouched is that there's nothing to update. A React version of this would need
`npm` updates a few times a year or it would stop building — and this is meant
to still open in 2036.

The content is plain files: HTML, markdown, and eventually JPEGs, in git, on
your laptop. Hosting is a layer on top that could be swapped in an afternoon
without touching a single recipe.

## Not built yet

- **Albums** — photographs, shared only with chosen email addresses
- **Keepsakes** — books, records, small collected favourites
