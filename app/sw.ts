/// <reference lib="webworker" />
// Service worker source. Bundled by the route handler in app/serwist/[path]/route.ts
// and served at /serwist/sw.js (scope "/"). Type-checked via tsconfig.sw.json.
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const OFFLINE_URL = "/offline.html";

// Never cache anything behind a login. Otherwise a shared phone could show a
// previous user's dashboard from cache after they sign out.
const PRIVATE_PATHS = /^\/(admin|dashboard|login|register|reset-password)(\/|$)/;

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ sameOrigin, url }) =>
      sameOrigin && (PRIVATE_PATHS.test(url.pathname) || url.pathname.startsWith("/api/push/")),
    handler: new NetworkOnly(),
  },
  {
    // Product photos are served through next/image. Keep more of them, longer,
    // so listings you've already seen still have pictures offline.
    matcher: ({ sameOrigin, url }) => sameOrigin && url.pathname === "/_next/image",
    handler: new StaleWhileRevalidate({
      cacheName: "product-images",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // Same behaviour as the old hand-written worker: new versions activate
  // immediately instead of waiting for every tab to close.
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: OFFLINE_URL,
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();

// The previous hand-written worker used caches named "cre8market-*".
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith("cre8market-")).map((key) => caches.delete(key)),
      );
    })(),
  );
});

// ---------------------------------------------------------------------------
// Push notifications
// ---------------------------------------------------------------------------

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
}

// Only ever navigate to a path on our own origin.
function resolveTarget(raw: string | undefined): URL {
  try {
    const target = new URL(raw || "/", self.location.origin);
    if (target.origin === self.location.origin) return target;
  } catch {
    // fall through
  }
  return new URL("/", self.location.origin);
}

self.addEventListener("push", (event) => {
  let data: PushPayload = {};
  try {
    data = (event.data?.json() as PushPayload | undefined) ?? {};
  } catch {
    // Non-JSON payload: fall back to defaults below.
  }

  const title = data.title || "CRE8MARKET ENTEBBE";
  const body = data.body || "Check out the latest updates.";
  const target = resolveTarget(data.url);

  event.waitUntil(
    (async () => {
      // Browsers (iOS especially) require a visible notification for every push.
      await self.registration.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-96.png",
        tag: data.tag,
        data: { url: target.href },
      });

      // Dot on the installed app's icon where supported; cleared when the app opens.
      try {
        await (self.navigator as unknown as { setAppBadge?: () => Promise<void> }).setAppBadge?.();
      } catch {
        // Badging is optional.
      }

      // Let open, visible windows show an in-app toast too.
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if (client.visibilityState === "visible") {
          client.postMessage({ type: "push", title, body, url: target.pathname + target.search });
        }
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = resolveTarget((event.notification.data as { url?: string } | undefined)?.url);

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);

      if (existing) {
        await existing.focus();
        // Reuse the open app window instead of stacking a new one.
        if (new URL(existing.url).href !== target.href) {
          try {
            await existing.navigate(target.href);
          } catch {
            await self.clients.openWindow(target.href);
          }
        }
      } else {
        await self.clients.openWindow(target.href);
      }
    })(),
  );
});

// Browsers occasionally rotate or expire a subscription. Re-subscribe with the
// same key and tell the server, so notifications keep arriving.
interface SubscriptionChangeEvent extends ExtendableEvent {
  oldSubscription?: PushSubscription | null;
}

self.addEventListener("pushsubscriptionchange", ((event: SubscriptionChangeEvent) => {
  event.waitUntil(
    (async () => {
      const applicationServerKey = event.oldSubscription?.options.applicationServerKey;
      if (!applicationServerKey) return;
      const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
    })().catch(() => {}),
  );
}) as EventListener);
