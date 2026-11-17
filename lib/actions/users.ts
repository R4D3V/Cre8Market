"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  cancelUserSubscriptions,
  checkPhoneExists,
  checkPhoneExistsExcluding,
  createUser,
  deleteUser,
  getPublicUsers,
  getStoreAdminProfile,
  getSubscriptionPlanByName,
  getUserByHandleOrId,
  getUserById,
  getUserPasswordHash,
  getUsers,
  logAudit,
  setUserSubscription,
  updateUserAdminStatus,
  updateUserContact,
  updateUserPassword,
  updateUserPlanFlags,
  updateUserProfile,
  updateUserStatus,
  updateUserVerifiedStatus,
  updateUserVipStatus,
} from "@/lib/db/queries";
import { sellerPath } from "@/lib/seller-handle";
import type { AppUser } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

async function requireUser() {
  const session = await auth();
  if (!session || session.user.role !== "user") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

export async function fetchUsersAction() {
  await requireAdmin();
  return getUsers();
}

// Public: sellers directory (no auth) — active users with listings.
export async function fetchPublicUsersAction() {
  return getPublicUsers();
}

export async function fetchPublicUserAction(id: string) {
  if (id === "store") {
    const storeProfile = await getStoreAdminProfile();
    return {
      id: "store",
      name: "CRE8MARKET",
      phone: "",
      whatsapp: null,
      avatar: storeProfile.avatar,
      banner: storeProfile.banner,
      isActive: true,
      isAdmin: true,
      isVerified: true,
      isVip: true,
      createdAt: new Date().toISOString(),
    } satisfies AppUser;
  }
  return getUserByHandleOrId(id);
}

export async function fetchUserByIdAction(id: string) {
  await requireAdmin();
  return getUserById(id);
}

// Admin directly creates a user account (e.g. onboarding a seller who can't self-register).
export async function createUserByAdminAction(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password: string;
  pin?: string;
  avatar?: string | null;
  banner?: string | null;
}) {
  await requireAdmin();

  if (!data.name || !data.phone || !data.password) {
    throw new Error("Name, phone and password are required");
  }
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (data.pin && !/^\d{4}$/.test(data.pin)) {
    throw new Error("Reset pin must be a 4-digit code");
  }

  const exists = await checkPhoneExists(data.phone);
  if (exists) throw new Error("A user with this phone number already exists");

  const password_hash = await bcrypt.hash(data.password, 12);
  const pin_hash = data.pin ? await bcrypt.hash(data.pin, 12) : null;
  const user = await createUser({
    name: data.name,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    password_hash,
    pin_hash,
    avatar: data.avatar,
    banner: data.banner,
  });

  const session = await auth();
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: session?.user?.role ?? "admin",
    action: "user.create",
    targetType: "user",
    targetId: user.id,
    metadata: { name: data.name, phone: data.phone },
  });

  revalidatePath("/admin/users");
  revalidatePath("/sellers");
  revalidatePath(sellerPath(user));
  return user;
}

export async function setUserActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  const session = await auth();
  const user = await updateUserStatus(id, isActive);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: isActive ? "user.activate" : "user.deactivate",
    targetType: "user",
    targetId: id,
    metadata: { isActive },
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  return user;
}

// Admin edits any user's name/phone/whatsapp.
export async function updateUserByAdminAction(
  id: string,
  data: {
    name: string;
    phone: string;
    whatsapp?: string;
    avatar?: string | null;
    banner?: string | null;
  },
) {
  await requireAdmin();

  if (!data.name || !data.name.trim()) throw new Error("Name is required");
  if (!data.phone || !data.phone.trim()) throw new Error("Phone number is required");

  const phone = data.phone.trim();
  if (await checkPhoneExistsExcluding(phone, id)) {
    throw new Error("Another user already has this phone number");
  }

  const user = await updateUserContact(id, {
    name: data.name.trim(),
    phone,
    whatsapp: data.whatsapp?.trim() || phone,
    avatar: data.avatar,
    banner: data.banner,
  });
  const session = await auth();
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "user.update",
    targetType: "user",
    targetId: id,
    metadata: { name: data.name.trim(), phone },
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  revalidatePath(sellerPath(user));
  revalidatePath("/sellers");
  revalidatePath("/admin");
  return user;
}

// Admin verifies/unverifies a seller (verified sellers show a badge on their listings).
export async function setUserVerifiedAction(id: string, isVerified: boolean) {
  await requireAdmin();
  const session = await auth();
  const user = await updateUserVerifiedStatus(id, isVerified);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: isVerified ? "user.verify" : "user.unverify",
    targetType: "user",
    targetId: id,
    metadata: { isVerified },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/products");
  return user;
}

// Admin promotes/demotes a user to/from VIP (VIP sellers have unlimited listings).
export async function setUserVipAction(id: string, isVip: boolean) {
  await requireAdmin();
  const session = await auth();
  const user = await updateUserVipStatus(id, isVip);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: isVip ? "user.promote_vip" : "user.demote_vip",
    targetType: "user",
    targetId: id,
    metadata: { isVip },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/products");
  return user;
}

// Admin selects Free / Standard / Premium for a seller. This keeps the user's
// plan flags and their subscription record in sync, so the dashboard shows the
// same plan the admin picked.
export async function setUserPlanAction(id: string, plan: "Free" | "Standard" | "Premium") {
  await requireAdmin();
  const session = await auth();

  if (plan === "Free") {
    await cancelUserSubscriptions(id);
  } else {
    const dbPlan = await getSubscriptionPlanByName(plan);
    if (!dbPlan) {
      throw new Error(
        `The ${plan} subscription plan is missing. Create it under Admin → Subscriptions first.`,
      );
    }
    await setUserSubscription(id, dbPlan.id, null, "active");
  }

  const user = await updateUserPlanFlags(id, plan);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "user.plan_change",
    targetType: "user",
    targetId: id,
    metadata: { plan },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/sellers");
  revalidatePath(sellerPath(user));
  revalidatePath("/products");
  return user;
}

// Admin promotes/demotes a user to/from admin role (phone login grants admin access).
export async function setUserAdminAction(id: string, isAdmin: boolean) {
  await requireAdmin();
  const session = await auth();
  const user = await updateUserAdminStatus(id, isAdmin);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: isAdmin ? "user.promote_admin" : "user.demote_admin",
    targetType: "user",
    targetId: id,
    metadata: { isAdmin },
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  revalidatePath("/admin");
  return user;
}

// Backup plan: an admin sets a new password for a user (e.g. if they forgot their reset pin).
export async function resetUserPasswordByAdminAction(id: string, newPassword: string) {
  await requireAdmin();
  const session = await auth();
  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(id, passwordHash);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "user.password_reset",
    targetType: "user",
    targetId: id,
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  return { success: true };
}

// Removes the user account. Any products they added are kept and simply become
// unassigned (their "Added by" reverts to the admin/store).
export async function deleteUserAction(id: string) {
  await requireAdmin();
  const session = await auth();
  const target = await getUserById(id).catch(() => null);
  await deleteUser(id);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "user.delete",
    targetType: "user",
    targetId: id,
    metadata: { name: target?.name, phone: target?.phone },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/products");
}

// ── Logged-in user's own profile ──

export async function fetchMyProfileAction() {
  const userId = await requireUser();
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateMyProfileAction(data: {
  name: string;
  whatsapp?: string;
  avatar?: string | null;
  banner?: string | null;
}) {
  const userId = await requireUser();
  if (!data.name || !data.name.trim()) throw new Error("Name is required");
  const user = await updateUserProfile(userId, {
    name: data.name.trim(),
    whatsapp: data.whatsapp,
    avatar: data.avatar,
    banner: data.banner,
  });
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "profile.update",
    targetType: "user",
    targetId: userId,
    metadata: { name: data.name.trim() },
  });
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath("/sellers");
  revalidatePath(sellerPath(user));
  return user;
}

export async function changeMyPasswordAction(currentPassword: string, newPassword: string) {
  const userId = await requireUser();
  if (!currentPassword) throw new Error("Current password is required");
  if (!newPassword || newPassword.length < 6)
    throw new Error("New password must be at least 6 characters");

  const currentHash = await getUserPasswordHash(userId);
  if (!currentHash) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, currentHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(userId, passwordHash);
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "password.change",
    targetType: "user",
    targetId: userId,
  });
  return { success: true };
}
