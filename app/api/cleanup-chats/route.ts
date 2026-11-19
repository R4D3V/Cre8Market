import { NextResponse } from "next/server";
import { purgeExpiredChatMessages } from "@/lib/db/queries";

// Deletes chat messages whose 3-day self-destruct window has passed.
//
// Reads already purge lazily (see fetchChatsAction), so this endpoint is only
// for keeping the table tidy on a schedule. Point a cron job at it:
//   GET /api/cleanup-chats  with header  Authorization: Bearer $CRON_SECRET
//
// Disabled until CRON_SECRET is configured — there is intentionally no default,
// so a public deployment can't be nudged into running queries by strangers.
const CRON_SECRET = process.env.CRON_SECRET;

async function handle(request: Request) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const purged = await purgeExpiredChatMessages();
    return NextResponse.json({ success: true, purged });
  } catch (error) {
    console.error("cleanup-chats failed:", error);
    return NextResponse.json({ success: false, error: "Cleanup failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
