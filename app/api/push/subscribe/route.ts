import { NextResponse } from "next/server";
import { upsertPushSubscription, deletePushSubscription } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const { endpoint, keys } = await req.json();

    if (!endpoint || !keys) {
      return NextResponse.json({ error: "Missing endpoint or keys" }, { status: 400 });
    }

    await upsertPushSubscription(endpoint, keys);

    return NextResponse.json({ success: true });
  } catch {
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
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
