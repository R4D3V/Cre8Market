"use server";

import {
  getPushSubscriptions,
  upsertPushSubscription,
  deletePushSubscription,
} from "@/lib/db/queries";

export async function fetchPushSubscriptionsAction() {
  return getPushSubscriptions();
}

export async function upsertPushSubscriptionAction(endpoint: string, keys: { p256dh: string; auth: string }) {
  return upsertPushSubscription(endpoint, keys);
}

export async function deletePushSubscriptionAction(endpoint: string) {
  return deletePushSubscription(endpoint);
}
