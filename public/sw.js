const CACHE = "cre8market-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request) || new Response("", { status: 503, statusText: "Service Unavailable" })),
  );
});

self.addEventListener("push", (e) => {
  let data;
  try {
    data = e.data?.json() ?? {};
  } catch {
    data = {};
  }

  const title = data.title || "CRE8MARKET ENTEBBE";
  const options = {
    body: data.body || "Check out the latest updates.",
    icon: "/brand/logo.webp",
    badge: "/brand/logo.webp",
    data: { url: data.url || "/" },
  };

  e.waitUntil(
    (async () => {
      try {
        await self.registration.showNotification(title, options);
      } catch (err) {
        console.error("showNotification failed:", err);
      }
      // Notify any open website tabs so they can show an in-app toast.
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of allClients) {
        client.postMessage({ type: "push", title, body: data.body || "", url: data.url || "/" });
      }
    })(),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      const matching = clientsList.find((c) => {
        try {
          return new URL(c.url).pathname === new URL(url).pathname;
        } catch {
          return false;
        }
      });
      if (matching) {
        matching.focus();
      } else {
        clients.openWindow(url);
      }
    }),
  );
});
