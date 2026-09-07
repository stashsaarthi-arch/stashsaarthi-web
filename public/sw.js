// StashSaarthi Service Worker — Offline-first with aggressive static asset caching
// Cache version: bump to force full cache refresh on deploy
const CACHE_VERSION = "ss-v1";
const STATIC_CACHE = `ss-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `ss-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `ss-images-${CACHE_VERSION}`;

// Pre-cache shell (lightweight — only the truly critical assets)
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/favicon.png",
  "/app-icon.png",
  "/stashsaarthi-logo.png",
];

// ─── Install ──────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate — purge old caches ──────────────────────────────
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !currentCaches.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch Strategies ─────────────────────────────────────────

/**
 * Route-based caching strategy:
 *
 * 1. CACHE-FIRST for static assets (hashed Vite bundles, images, fonts)
 *    — These are immutable once deployed; cache indefinitely.
 *
 * 2. STALE-WHILE-REVALIDATE for Google Fonts CSS / font files
 *    — Serve cached immediately, refresh in background.
 *
 * 3. NETWORK-FIRST for navigation (HTML) & API calls
 *    — Always try network; fall back to cached shell when offline.
 */

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // Skip Supabase / external API calls — never cache auth or data mutations
  if (url.hostname.includes("supabase")) return;
  if (url.hostname.includes("clarity.ms")) return;
  if (url.hostname.includes("googleapis.com") && !url.hostname.includes("fonts")) return;

  // Strategy 1: Cache-first for hashed Vite assets (/assets/*)
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy 1b: Cache-first for images with SVG fallback & 2G timeout protection
  if (
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(cacheFirstImage(request, IMAGE_CACHE));
    return;
  }

  // Strategy 2: Stale-while-revalidate for Google Fonts
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // Strategy 3: Network-first for navigation (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Default: stale-while-revalidate for everything else (CSS, misc JS)
  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

// ─── Strategy Implementations ─────────────────────────────────

// In-flight request deduplication map for 2G network burst handling
const pendingImageRequests = new Map();

async function cacheFirstImage(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const url = request.url;
  // Deduplicate concurrent fetch attempts for identical image URL on 2G bursts
  if (pendingImageRequests.has(url)) {
    try {
      const response = await pendingImageRequests.get(url);
      return response.clone();
    } catch {
      return imageFallback();
    }
  }

  const fetchPromise = (async () => {
    const controller = new AbortController();
    // 6-second timeout guard on slow 2G connections
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const networkResponse = await fetch(request, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (err) {
      clearTimeout(timeoutId);
      return imageFallback();
    } finally {
      pendingImageRequests.delete(url);
    }
  })();

  pendingImageRequests.set(url, fetchPromise);
  return fetchPromise;
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return offlineFallback();
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always revalidate in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cached);

  // Return cached immediately if available, else wait for network
  return cached || fetchPromise;
}

function imageFallback() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0A0D0F"/><rect x="10" y="10" width="380" height="280" rx="12" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="6,6"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#10B981" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">🍲 Saarthi Kitchen Node</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Cached Offline (2G Mode Active)</text></svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function offlineFallback() {
  return caches.match("/").then(
    (cached) =>
      cached ||
      new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>StashSaarthi — Offline</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#0A0D0F;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
    .card{text-align:center;max-width:380px}
    .icon{font-size:3.5rem;margin-bottom:1rem}
    h1{font-size:1.5rem;font-weight:700;margin-bottom:.5rem}
    p{font-size:.9rem;color:#94a3b8;line-height:1.5;margin-bottom:1.5rem}
    button{background:#10B981;color:#fff;border:none;padding:.75rem 2rem;border-radius:12px;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s}
    button:hover{background:#059669}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📦</div>
    <h1>You're offline</h1>
    <p>StashSaarthi needs an internet connection to load. Please check your Wi-Fi or mobile data and try again.</p>
    <button onclick="location.reload()">Retry</button>
  </div>
</body>
</html>`,
        { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
      ),
  );
}

// ─── Cache size management ────────────────────────────────────
// Limit the IMAGE_CACHE to ~80 entries to prevent storage bloat
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return trimCache(cacheName, maxItems);
  }
}

// Trim periodically after fetches
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIM_CACHES") {
    trimCache(IMAGE_CACHE, 80);
    trimCache(RUNTIME_CACHE, 120);
  }
});
