
const CACHE_NAME = "cre8market-v3";
const OFFLINE_URL = "/";

const CORE_ASSETS = [
  "/",
  "/brand/logo.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache each core asset independently so one missing asset
      // does not prevent the other assets from being cached.
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (error) {
            console.warn("Could not cache:", url);
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("cre8market-") &&
              key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  // Navigation: try the network first, then use a cached page.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match(request)) ||
            (await cache.match(OFFLINE_URL)) ||
            new Response(
              "You are offline. Reconnect to browse Cre8 Market.",
              {
                status: 503,
                headers: {
                  "Content-Type": "text/plain; charset=utf-8",
                },
              }
            )
          );
        }
      })()
    );

    return;
  }

  // Other same-origin GET requests: cached copy first,
  // while updating the cache when the network is available.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      const networkRequest = fetch(request)
        .then(async (response) => {
          if (response.ok && response.type === "basic") {
            await cache.put(request, response.clone());
          }
          return response;
        });

      if (cached) {
        event.waitUntil(networkRequest.catch(() => {}));
        return cached;
      }

      try {
        return await networkRequest;
      } catch {
        return new Response("Resource unavailable offline.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    })()
  );
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data?.json() ?? {};
  } catch {}

  const title = data.title || "CRE8MARKET ENTEBBE";
  const options = {
    body: data.body || "Check out the latest updates.",
    icon: "/brand/logo.webp",
    badge: "/brand/logo.webp",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options);

      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        client.postMessage({
          type: "push",
          title,
          body: data.body || "",
          url: data.url || "/",
        });
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  );

  if (target.origin !== self.location.origin) return;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      const matching = windows.find((client) => {
        try {
          return new URL(client.url).pathname === target.pathname;
        } catch {
          return false;
        }
      });

      if (matching) {
        await matching.focus();
      } else {
        await self.clients.openWindow(target.href);
      }
    })()
  );
});
