/* Kesug Slots Remastered — offline-first service worker. */
const VERSION = 'kesug-remastered-route-flash-fix-2';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const SCOPE_URL = self.registration.scope;
const CORE_FILES = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'
];
const APP_URL = new URL('./index.html', SCOPE_URL).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.all(CORE_FILES.map(async path => {
      const url = new URL(path, SCOPE_URL).href;
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response && response.ok) await cache.put(url, response.clone());
      } catch (_) { /* A missing optional path must not abort SW installation. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('kesug-remastered-') && ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function updateCachedRequest(request, cacheName) {
  const cache = await caches.open(cacheName);
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) {
    try { await cache.put(request, response.clone()); } catch (_) {}
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    // Start revalidation immediately, but return the saved shell without waiting when available.
    const refreshPromise = (async () => {
      const shell = await caches.open(SHELL_CACHE);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(request, { signal: controller.signal, cache: 'no-cache' });
        if (response && response.ok) {
          await shell.put(APP_URL, response.clone());
          return response;
        }
        throw new Error('Navigation response was not successful');
      } finally { clearTimeout(timeout); }
    })();
    event.waitUntil(refreshPromise.catch(() => {}));
    event.respondWith((async () => {
      const shell = await caches.open(SHELL_CACHE);
      const cached = await caches.match(request, { ignoreSearch: true })
        || await shell.match(APP_URL)
        || await shell.match(new URL('./', SCOPE_URL).href);
      if (cached) return cached;
      try { return await refreshPromise; }
      catch (_) {
        return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kesug Slots</title><main style="font:16px system-ui;padding:10vh 8vw;color:#eee;background:#111116;min-height:80vh"><h1>Kesug Slots</h1><p>Открой игру один раз с подключением к интернету, чтобы сохранить её для офлайн-запуска.</p></main>', { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 });
      }
    })());
    return;
  }

  // Cache local app files and external fonts/icons/artwork on first successful request.
  if (request.destination || url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request) || await cache.match(url.href) || await caches.match(request);
      if (cached) {
        if (url.origin === self.location.origin) event.waitUntil(updateCachedRequest(request, RUNTIME_CACHE).catch(() => {}));
        return cached;
      }
      try { return await updateCachedRequest(request, RUNTIME_CACHE); }
      catch (_) { return new Response('', { status: 504, statusText: 'Offline asset unavailable' }); }
    })());
  }
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type !== 'KESUG_PREPARE_OFFLINE') return;
  const port = event.ports && event.ports[0];
  event.waitUntil((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const urls = Array.isArray(data.urls) ? [...new Set(data.urls)].filter(value => /^https?:/i.test(value)).slice(0, 160) : [];
    let completed = 0, failed = 0, cursor = 0;
    const worker = async () => {
      while (cursor < urls.length) {
        const value = urls[cursor++];
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
          const url = new URL(value);
          const response = await fetch(url.href, { mode: url.origin === self.location.origin ? 'same-origin' : 'no-cors', credentials: 'omit', signal: controller.signal });
          if (response && (response.ok || response.type === 'opaque')) await cache.put(url.href, response.clone());
          else failed++;
        } catch (_) { failed++; }
        finally { clearTimeout(timeout); }
        completed++;
        if (port) port.postMessage({ type: 'progress', completed, total: urls.length, failed });
      }
    };
    await Promise.all(Array.from({ length: Math.min(2, urls.length) }, () => worker()));
    if (port) port.postMessage({ type: 'complete', completed, total: urls.length, failed });
  })());
});
