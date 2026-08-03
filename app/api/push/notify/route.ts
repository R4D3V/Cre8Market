import { NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/push";

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const result = await sendPushNotification({ title, body, url });
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? null,
  });
}
