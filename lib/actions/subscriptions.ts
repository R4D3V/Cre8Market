"use server";

import { auth } from "@/lib/auth";
import {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  upsertSubscriptionPlan,
  deleteSubscriptionPlan,
  getUserSubscription,
  setUserSubscription,
} from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

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

export async function fetchSubscriptionPlanByIdAction(id: string) {
  await requireAdmin();
  return getSubscriptionPlanById(id);
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

export async function assignSubscriptionAction(userId: string, planId: string, expiresAt: string | null) {
  await requireAdmin();
  const sub = await setUserSubscription(userId, planId, expiresAt, "active");
  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  return sub;
}