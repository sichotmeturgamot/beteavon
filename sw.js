// גרסה — להעלות מספר בכל עדכון של האפליקציה
// חשוב: כל האפליקציות באותו חשבון גיטהב חולקות מטמון, לכן מוחקים רק מטמון שמתחיל ב-"beteavon-"
const CACHE = "beteavon-v6";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("beteavon-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // קודם רשת (כדי לקבל עדכונים), ואם אין אינטרנט — מהזיכרון
  e.respondWith(
    fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return r;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});
