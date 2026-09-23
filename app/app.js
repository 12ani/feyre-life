/* ============================================================
   Two small jobs:
     1. turn the service worker on  (offline)
     2. tell iPhone users how to install, because iOS won't
   ============================================================ */

/* ---------- 1. offline ----------
   Service workers only run over https:// or on localhost. Opening
   these files straight from Finder (file://) skips this silently —
   the app still works, it just won't work offline. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // the worker sits at the site root, wherever that is
    const root = location.pathname.replace(/\/(?:[^\/]*\.html)?$/, "/")
                 .replace(/\/(trips|food|albums)\/.*$/, "/");
    navigator.serviceWorker.register(root + "sw.js", { scope: root })
      .catch(() => { /* not served over https — fine, carry on */ });
  });
}

/* ---------- 2. the install hint ----------
   Android's Chrome pops up its own "Install app" prompt. iOS Safari
   never has and never will, so the app has to explain the gesture
   itself — otherwise nobody ever finds Share → Add to Home Screen. */
(function () {
  const ua        = navigator.userAgent;
  const isIOS     = /iPhone|iPad|iPod/.test(ua) ||
                    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari  = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome/.test(ua);
  const installed = window.matchMedia("(display-mode: standalone)").matches ||
                    navigator.standalone === true;

  if (!isIOS || !isSafari || installed) return;
  if (localStorage.getItem("a2hs-dismissed")) return;

  // wait a moment — an instant popup reads as an ad
  setTimeout(() => {
    const bar = document.createElement("div");
    bar.className = "a2hs";
    bar.innerHTML =
      '<span>Keep this on your home screen — tap ' +
      '<b>Share</b>, then <b>Add to Home Screen</b>.</span>' +
      '<button class="x" aria-label="Dismiss">&times;</button>';
    bar.querySelector(".x").onclick = () => {
      localStorage.setItem("a2hs-dismissed", "1");
      bar.remove();
    };
    document.body.appendChild(bar);
  }, 2200);
})();

/* ---------- 3. back means back ----------
   The back link keeps a real href, so it still works with no
   JavaScript and when the page is opened cold from a home screen.
   But if you got here from somewhere else in the app, "back" should
   return you there rather than always to the front door. */
(function () {
  const link = document.querySelector(".back");
  if (!link || !document.referrer) return;
  try {
    if (new URL(document.referrer).origin !== location.origin) return;
  } catch (e) { return; }   // a referrer we can't parse — leave the href alone
  link.addEventListener("click", e => { e.preventDefault(); history.back(); });
})();
