import { NextResponse } from "next/server";
import { getPushSubscriptions, deletePushSubscription } from "@/lib/db/queries";

const webpush = require("web-push");

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  (() => {
    const keys = webpush.generateVAPIDKeys();
    process.env.VAPID_PUBLIC_KEY = keys.publicKey;
    process.env.VAPID_PRIVATE_KEY = keys.privateKey;
    return keys.publicKey;
  })();

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "";

if (!process.env.VAPID_PRIVATE_KEY) {
  const keys = webpush.generateVAPIDKeys();
  process.env.VAPID_PUBLIC_KEY = keys.publicKey;
  process.env.VAPID_PRIVATE_KEY = keys.privateKey;
}

webpush.setVapidDetails(
  "mailto:raymonjohns@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const subscriptions = await getPushSubscriptions();

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No subscribers", sent: 0 });
    }

    const payload = JSON.stringify({
      title,
      body: body || "",
      url: url || "/",
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush
          .sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload,
          )
          .catch(async (err: { statusCode: number }) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await deletePushSubscription(sub.endpoint);
            }
          }),
      ),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({ success: true, sent, total: subscriptions.length });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY!,
  });
}
