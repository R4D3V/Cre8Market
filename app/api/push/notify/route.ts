import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendPushNotification, getVapidPublicKey } from "@/lib/push";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const res = NextResponse.json({
    vapidPublicKey: getVapidPublicKey(),
  });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return res;
}
