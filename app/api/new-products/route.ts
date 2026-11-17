import { NextResponse } from "next/server";
import { getRecentProductEvents } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

// Never toast more than this window of history — a tab that slept overnight
// should not dump hours of listings when it wakes up.
const MAX_WINDOW_MS = 10 * 60 * 1000;

// Public endpoint polled by the in-app toast so every open browser learns
// about new listings without requiring web-push permission. The `after`
// cursor is a product `created_at` ISO timestamp; products are compared
// server-side, so client clock skew is harmless.
export async function GET(req: Request) {
  const afterParam = new URL(req.url).searchParams.get("after");
  const parsed = afterParam ? new Date(afterParam) : null;
  const cursor = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

  // No valid cursor: first visit. Initialize it so historical products never
  // toast, and return nothing.
  if (!cursor) {
    return NextResponse.json({ products: [], cursor: new Date().toISOString() });
  }

  try {
    const after = new Date(Math.max(cursor.getTime(), Date.now() - MAX_WINDOW_MS));
    const products = await getRecentProductEvents(after);
    const nextCursor = products.length
      ? products[products.length - 1].createdAt.toISOString()
      : cursor.toISOString();
    return NextResponse.json({ products, cursor: nextCursor });
  } catch (err) {
    console.error("new-products feed failed:", err);
    return NextResponse.json({ products: [], cursor: cursor.toISOString() });
  }
}
