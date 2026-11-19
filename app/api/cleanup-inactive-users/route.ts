import { NextResponse } from "next/server";
import { deleteUser, getInactiveUsers, logAudit } from "@/lib/db/queries";

// Deletes accounts that have not signed in for 4 months.
//
// Buyers are removed from the database; sellers are removed along with every
// listing they created. Legacy admin rows (users.is_admin) are never touched,
// and neither are the separate admin_users accounts.
//
// Point a cron job at it:
//   GET|POST /api/cleanup-inactive-users   Authorization: Bearer $CRON_SECRET
//   GET      /api/cleanup-inactive-users?dryRun=1   lists who would be deleted
//
// Disabled until CRON_SECRET is configured, same as the chat cleanup job.
const CRON_SECRET = process.env.CRON_SECRET;
const INACTIVE_MONTHS = 4;
const BATCH_LIMIT = 500;

function cutoffDate() {
  const cutoff = new Date();
  // Calendar months, so "4 months" stays 4 months across different month lengths.
  cutoff.setMonth(cutoff.getMonth() - INACTIVE_MONTHS);
  return cutoff;
}

async function handle(request: Request) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = cutoffDate();
  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";

  try {
    const candidates = await getInactiveUsers(cutoff, BATCH_LIMIT);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        inactiveMonths: INACTIVE_MONTHS,
        cutoff: cutoff.toISOString(),
        candidates: candidates.length,
        users: candidates,
      });
    }

    let deletedBuyers = 0;
    let deletedSellers = 0;
    const failed: string[] = [];

    for (const user of candidates) {
      try {
        // Sellers take their listings with them; buyer rows shouldn't have any,
        // but if they do they are kept and become store-owned.
        await deleteUser(user.id, { deleteListings: user.accountType === "seller" });
        await logAudit({
          actorId: null,
          actorRole: "system",
          action: "user.auto_delete",
          targetType: "user",
          targetId: user.id,
          metadata: {
            name: user.name,
            phone: user.phone,
            accountType: user.accountType,
            lastLoginAt: user.lastLoginAt,
            inactiveMonths: INACTIVE_MONTHS,
          },
        });
        if (user.accountType === "seller") deletedSellers += 1;
        else deletedBuyers += 1;
      } catch (error) {
        console.error(`cleanup-inactive-users: could not delete ${user.id}`, error);
        failed.push(user.id);
      }
    }

    return NextResponse.json({
      success: true,
      inactiveMonths: INACTIVE_MONTHS,
      cutoff: cutoff.toISOString(),
      deleted: {
        buyers: deletedBuyers,
        sellers: deletedSellers,
        total: deletedBuyers + deletedSellers,
      },
      failed,
      // More candidates may exist; the next scheduled run picks them up.
      hasMore: candidates.length === BATCH_LIMIT,
    });
  } catch (error) {
    console.error("cleanup-inactive-users failed:", error);
    return NextResponse.json({ success: false, error: "Cleanup failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
