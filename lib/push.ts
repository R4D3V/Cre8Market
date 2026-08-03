import { getPushSubscriptions, deletePushSubscription } from "@/lib/db/queries";

const webpush = require("web-push");

// VAPID keys must come from the environment. Auto-generating them at runtime is
// dangerous in serverless deployments (each instance would get a different pair,
// breaking the keys subscribers were registered with), so we never do that here.
const configured =
  !!process.env.VAPID_PUBLIC_KEY && !!process.env.VAPID_PRIVATE_KEY;

if (configured) {
  webpush.setVapidDetails(
    "mailto:raymonjohns@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export async function sendPushNotification(opts: {
  title: string;
  body?: string;
  url?: string;
}): Promise<{ sent: number; total: number }> {
  if (!configured) {
    console.warn(
      "Push notification skipped: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not configured.",
    );
    return { sent: 0, total: 0 };
  }

  const subscriptions = await getPushSubscriptions();
  if (!subscriptions || subscriptions.length === 0) {
    return { sent: 0, total: 0 };
  }

  const payload = JSON.stringify({
    title: opts.title,
    body: opts.body || "",
    url: opts.url || "/",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload,
      ),
    ),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;

  // Remove subscriptions that are no longer valid (410 Gone / 404 Not Found).
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const code = r.status === "rejected" ? (r.reason as { statusCode?: number })?.statusCode : undefined;
    if (code === 410 || code === 404) {
      await deletePushSubscription(subscriptions[i].endpoint);
    }
  }

  return { sent, total: subscriptions.length };
}
