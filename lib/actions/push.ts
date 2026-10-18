"use server";

import {
  getPushSubscriptions,
  upsertPushSubscription,
  deletePushSubscription,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

export async function fetchPushSubscriptionsAction() {
  await requireAdmin();
  return getPushSubscriptions();
}

export async function upsertPushSubscriptionAction(endpoint: string, keys: { p256dh: string; auth: string }) {
  return upsertPushSubscription(endpoint, keys);
}

export async function deletePushSubscriptionAction(endpoint: string) {
  return deletePushSubscription(endpoint);
}
