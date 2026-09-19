// Service worker for AestheticEssence Skin & Hair Clinic
// Strategy:
//   - Static assets (JS, CSS, images, fonts, 3D models): cache-first
//   - HTML pages: network-first, fallback to cached index.html (SPA navigation)
//   - Non-page requests offline: plain 503 (NEVER html - html poisoned the 3D loader)
//   - Version hash changes on every build → old caches auto-purged
// Bumped to v3: the hero HDR is now self-hosted (/hdri/potsdamer_platz_1k.hdr)
// and cached cache-first like the other 3D assets; v2 caches (from before the
// security-headers deploy) are purged for returning visitors.
const CACHE_VERSION = "ae-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;

const MAX_ITEMS = 60;

// Install: pre-cache critical assets only (the rest cache on first use)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(["/", "/index.html", "/offline.html"]))
      .then(() => self.skipWaiting()),
  );
});

// Activate: purge old caches from previous versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all
          ? Promise.all(
              keys
                .filter(
                  (k) => k.startsWith("ae-") && !k.startsWith(CACHE_VERSION),
                )
                .map((k) => caches.delete(k)),
            )
          : [],
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: route by request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip non-http(s) requests (chrome-extension, etc.)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Skip analytics and external scripts we don't control
  if (
    url.hostname.includes("google-analytics") ||
    url.hostname.includes("googletagmanager")
  ) {
    return;
  }

  // Fonts: cache-first (rarely change)
  if (
    url.hostname.includes("fonts.googleapis") ||
    url.hostname.includes("fonts.gstatic")
  ) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Images: cache-first with LRU cap
  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // JS/CSS assets (hashed filenames): cache-first
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 3D models / HDR environment maps / wasm binaries: cache-first so the hero
  // survives offline
  if (
    url.pathname.endsWith(".glb") ||
    url.pathname.endsWith(".gltf") ||
    url.pathname.endsWith(".hdr") ||
    url.pathname.endsWith(".wasm")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML navigation: network-first, fallback to cached shell / offline page
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Everything else: network-first, but NEVER answer with html when offline
  event.respondWith(networkFirstAsset(request));
});

// ── Strategies ───────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      trimCache(cache, MAX_ITEMS);
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

// Pages: offline → cached page → app shell → friendly offline page → 503
async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const shell = await caches.match("/index.html");
    if (shell) return shell;
    const offline = await caches.match("/offline.html");
    if (offline) return offline;
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Non-page assets: offline → cached copy → honest 503 (never html!)
async function networkFirstAsset(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

// LRU trim: keep cache under MAX_ITEMS entries
async function trimCache(cache, max) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  for (let i = 0; i < keys.length - max; i++) {
    await cache.delete(keys[i]);
  }
}
