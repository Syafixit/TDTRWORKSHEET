/* Service worker — app boleh dibuka tanpa internet selepas lawatan pertama.
   Strategi: network-first untuk semua fail app (sentiasa versi terbaru bila online),
   jatuh ke cache bila offline. /api/* tidak pernah di-cache. Naikkan VERSI bila ubah senarai fail. */
const VERSI = "tdtr-ws-v13";
const TERAS = [
  "./", "index.html", "styles.css?v=13", "app.js?v=6", "manifest.webmanifest",
  "worksheets/rumah.js?v=2", "worksheets/tenang.js?v=1", "worksheets/rekod.js",
  "worksheets/bab1.js", "worksheets/bab2.js?v=3", "worksheets/bab3.js", "worksheets/bab4.js",
  "worksheets/bab5.js", "worksheets/bab6.js", "worksheets/bab7.js", "worksheets/bab8.js",
  "worksheets/bab9.js", "worksheets/bab10.js", "icons/icon-192.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(TERAS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return;
  const sameOrigin = url.origin === self.location.origin;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !font) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSI).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: req.mode === "navigate" })
          .then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : undefined))
      )
  );
});
