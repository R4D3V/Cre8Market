import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push";

export async function POST(req: Request) {
  // Only admins may broadcast push notifications.
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
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
