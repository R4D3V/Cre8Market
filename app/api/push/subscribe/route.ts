import { NextResponse } from "next/server";
import { upsertPushSubscription, deletePushSubscription } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const { endpoint, keys } = await req.json();

    if (
      typeof endpoint !== "string" ||
      endpoint.trim().length === 0 ||
      !keys ||
      typeof keys !== "object"
    ) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    // Normalize keys so a missing/invalid value doesn't break storage.
    const p256dh =
      typeof keys.p256dh === "string" ? keys.p256dh : String(keys.p256dh ?? "");
    const auth = typeof keys.auth === "string" ? keys.auth : String(keys.auth ?? "");
    if (!p256dh || !auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    // Use the normalized values downstream.
    keys.p256dh = p256dh;
    keys.auth = auth;

    await upsertPushSubscription(endpoint, keys);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("push/subscribe POST failed:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    await deletePushSubscription(endpoint);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("push/subscribe DELETE failed:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
