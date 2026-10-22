import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { upsertPushSubscription, deletePushSubscription } from "@/lib/db/queries";
import { pushSubscribeSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`push:subscribe:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = await req.json();
    const parsed = pushSubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join("; ") },
        { status: 400 },
      );
    }
    const { endpoint, keys } = parsed.data;
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
