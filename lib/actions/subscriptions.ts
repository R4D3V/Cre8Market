"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  cancelUserSubscriptions,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  getSubscriptionPlans,
  getUserSubscription,
  logAudit,
  setUserSubscription,
  updateUserPlanFlags,
  upsertSubscriptionPlan,
} from "@/lib/db/queries";
import { planTierFromName } from "@/lib/plans";
import { sellerPath } from "@/lib/seller-handle";
import type { UserSubscription } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

async function requireUser() {
  const session = await auth();
  if (!session?.user || session.user.role !== "user") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

export async function fetchSubscriptionPlansAction(activeOnly = true) {
  return getSubscriptionPlans(activeOnly);
}

export async function fetchAllSubscriptionPlansAction() {
  await requireAdmin();
  return getSubscriptionPlans(false);
}

export async function upsertSubscriptionPlanAction(data: {
  id?: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlight?: boolean;
  icon?: string;
  sortOrder?: number;
  active?: boolean;
}) {
  await requireAdmin();
  const plan = await upsertSubscriptionPlan(data);
  revalidatePath("/subscription");
  revalidatePath("/admin/subscriptions");
  revalidatePath("/dashboard");
  return plan;
}

export async function deleteSubscriptionPlanAction(id: string) {
  await requireAdmin();
  await deleteSubscriptionPlan(id);
  revalidatePath("/subscription");
  revalidatePath("/admin/subscriptions");
}

export async function fetchMySubscriptionAction() {
  const userId = await requireUser();
  return getUserSubscription(userId);
}

export async function fetchUserSubscriptionAction(userId: string) {
  await requireAdmin();
  return getUserSubscription(userId);
}

export async function assignSubscriptionAction(
  userId: string,
  planId: string,
  expiresAt: string | null,
) {
  const adminId = await requireAdmin();
  const plan = await getSubscriptionPlanById(planId);
  if (!plan) throw new Error("Subscription plan not found");

  const tier = planTierFromName(plan.name);

  let sub: UserSubscription | null = null;
  if (tier === "Free") {
    await cancelUserSubscriptions(userId);
  } else {
    sub = await setUserSubscription(userId, planId, expiresAt, "active");
  }

  // Keep the admin's Standard/Premium switches in sync with the assigned plan.
  const updatedUser = tier ? await updateUserPlanFlags(userId, tier) : null;

  await logAudit({
    actorId: adminId,
    actorRole: "admin",
    action: "user.subscription_assign",
    targetType: "user",
    targetId: userId,
    metadata: { plan: plan.name, expiresAt },
  });

  revalidatePath("/admin/sellers");
  revalidatePath("/admin/buyers");
  revalidatePath(`/admin/users/${userId}/edit`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/sellers");
  if (updatedUser) revalidatePath(sellerPath(updatedUser));
  return sub;
}
