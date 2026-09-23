/* ============================================================
   The service worker — the thing that makes this work offline.

   It lives at the repo ROOT on purpose. A service worker can only
   control pages at or below its own folder, so one parked in app/
   could never cache the home page. Root = whole site.

   Bump CACHE when you change what's in PRECACHE, otherwise phones
   keep serving the old copy.
   ============================================================ */
const CACHE = "feyre-v8";

/* The shell: the few files that must be there for the app to open
   at all with no signal. Paths are relative so this works both at
   a domain root and in a GitHub Pages subfolder. */
const PRECACHE = [
  "./",
  "./index.html",
  "./app/shell.css",
  "./app/app.js",
  "./app/manifest.webmanifest",
  "./app/icons/icon-192.png",
  "./app/icons/mark.png",
  "./app/icons/apple-touch-icon.png",
  "./trips/index.html",
  "./trips/packing/index.html",
  "./trips/packing/packing.css",
  "./trips/packing/items.js",
  "./trips/packing/packing.js",
  "./food/index.html",
  "./food/breads/sourdough-focaccia.html",
  "./food/breads/breads.js",
  "./food/cakes/castella-cake.html",
  "./food/cakes/banana-ogura-cake.html",
  "./food/cakes/cakes.js",
  "./food/shared/card.css",
  "./food/shared/card.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll is all-or-nothing; one 404 would throw the whole install
      // away, so each file is added on its own and allowed to fail.
      // cache: "reload" skips the browser's HTTP cache, so a new version
      // never precaches the old files it is meant to replace.
      .then(c => Promise.all(PRECACHE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

/* Delete caches from older versions of the app. */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* Google Fonts: cache-first. They never change, and waiting on them
     is what makes an offline page sit blank for two seconds. */
  if (url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com")) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  /* Everything of ours: stale-while-revalidate. Serve the cached copy
     instantly, fetch a fresh one in the background for next time. So
     the app always opens fast, and is at most one visit out of date. */
  e.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => null);

      // Cached copy wins the race; if there is none, wait for the network;
      // if that fails too and it's a page, fall back to the home page.
      return hit || fresh.then(r => r || (req.mode === "navigate"
        ? caches.match("./index.html")
        : Response.error()));
    })
  );
});
