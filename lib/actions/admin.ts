"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { auth, syncLegacyAdminToBetterAuth } from "@/lib/auth";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUserByEmail,
  getAdminUserById,
  getAdminUserPasswordHash,
  getAdminUsers,
  getFeatureFlags,
  logAudit,
  setFeatureFlag,
  updateAdminProfile,
  updateAdminUser,
  updateAdminUserPassword,
} from "@/lib/db/queries";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

export async function fetchAdminUsersAction() {
  await requireMainAdmin();
  return getAdminUsers();
}

export async function createAdminUserAction(data: {
  email: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
  avatar?: string | null;
  password: string;
}) {
  const actorId = await requireMainAdmin();

  if (!data.email || !data.email.trim() || !data.password) {
    throw new Error("Email and password are required");
  }
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const email = data.email.trim().toLowerCase();
  if (await getAdminUserByEmail(email)) {
    throw new Error("An admin with this email already exists");
  }

  const password_hash = await bcrypt.hash(data.password, 12);
  const admin = await createAdminUser({
    email,
    name: data.name?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    whatsapp: data.whatsapp?.trim() || undefined,
    avatar: data.avatar || null,
    password_hash,
  });

  await logAudit({
    actorId,
    actorRole: "admin",
    action: "admin.create",
    targetType: "admin",
    targetId: admin.id,
    metadata: { email: admin.email, name: admin.name },
  });

  revalidatePath("/admin/admins");
  revalidatePath("/admin");
  return admin;
}

export async function deleteAdminUserAction(id: string) {
  const currentAdminId = await requireMainAdmin();
  if (id === currentAdminId) {
    throw new Error("You cannot delete your own admin account");
  }
  const target = await getAdminUserById(id).catch(() => null);
  await deleteAdminUser(id);
  await logAudit({
    actorId: currentAdminId,
    actorRole: "admin",
    action: "admin.delete",
    targetType: "admin",
    targetId: id,
    metadata: { email: target?.email, name: target?.name },
  });
  revalidatePath("/admin/admins");
  revalidatePath("/admin");
  return { success: true };
}

// The main admin can edit the profile of any other admin. The email is the
// login ID and stays fixed; an optional new password can be set here so a
// locked-out admin can be recovered without touching the database.
export async function updateAdminUserByMainAdminAction(
  id: string,
  data: {
    name: string;
    phone?: string | null;
    whatsapp?: string | null;
    avatar?: string | null;
    banner?: string | null;
    password?: string;
  },
) {
  const actorId = await requireMainAdmin();

  const target = await getAdminUserById(id);
  if (!target) throw new Error("Admin not found");
  if (!data.name || !data.name.trim()) throw new Error("Name is required");

  const newPassword = data.password?.trim();
  if (newPassword && newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const admin = await updateAdminUser(id, {
    name: data.name.trim(),
    phone: data.phone?.trim() || null,
    whatsapp: data.whatsapp?.trim() || null,
    avatar: data.avatar ?? null,
    // Banners are only edited from the admin's own profile page; preserve the
    // existing one when this form doesn't touch it.
    banner: data.banner ?? target.banner ?? null,
  });
  if (!admin) throw new Error("Admin not found");

  if (newPassword) {
    await updateAdminUserPassword(id, await bcrypt.hash(newPassword, 12));
    await logAudit({
      actorId,
      actorRole: "admin",
      action: "admin.password_reset",
      targetType: "admin",
      targetId: id,
      metadata: { email: target.email, by: "main_admin" },
    });
  }

  // Keep the better-auth mirror (name/avatar/password) in step with the row.
  await syncLegacyAdminToBetterAuth(target.email);

  await logAudit({
    actorId,
    actorRole: "admin",
    action: "admin.update",
    targetType: "admin",
    targetId: id,
    metadata: { email: target.email, name: admin.name },
  });

  revalidatePath("/admin/admins");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  revalidatePath("/sellers");
  revalidatePath("/sellers/store");
  return admin;
}

export async function fetchMyAdminProfileAction() {
  const adminId = await requireAdmin();
  const admin = await getAdminUserById(adminId);
  if (!admin) throw new Error("Admin not found");
  return admin;
}

export async function updateMyAdminProfileAction(data: {
  name?: string;
  phone?: string;
  whatsapp?: string;
  avatar?: string | null;
  banner?: string | null;
}) {
  const adminId = await requireAdmin();
  const admin = await updateAdminProfile(adminId, data);
  await logAudit({
    actorId: adminId,
    actorRole: "admin",
    action: "admin.profile_update",
    targetType: "admin",
    targetId: adminId,
    metadata: { name: admin?.name, phone: admin?.phone },
  });
  revalidatePath("/admin/profile");
  revalidatePath("/sellers");
  revalidatePath("/sellers/store");
  return admin;
}

export async function changeMyAdminPasswordAction(currentPassword: string, newPassword: string) {
  const adminId = await requireAdmin();
  if (!currentPassword) throw new Error("Current password is required");
  if (!newPassword || newPassword.length < 6)
    throw new Error("New password must be at least 6 characters");

  const currentHash = await getAdminUserPasswordHash(adminId);
  if (!currentHash) throw new Error("Admin not found");
  const valid = await bcrypt.compare(currentPassword, currentHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateAdminUserPassword(adminId, passwordHash);
  await logAudit({
    actorId: adminId,
    actorRole: "admin",
    action: "admin.password_change",
    targetType: "admin",
    targetId: adminId,
  });
  return { success: true };
}

// ── Feature flags ──

export async function toggleFeatureFlagAction(key: string, enabled: boolean) {
  const adminId = await requireMainAdmin();
  const cleanKey = key.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]{1,48}$/.test(cleanKey)) {
    throw new Error("Flag keys use lowercase letters, numbers and dashes");
  }

  await setFeatureFlag(cleanKey, enabled);
  await logAudit({
    actorId: adminId,
    actorRole: "admin",
    action: "feature_flag.update",
    targetType: "feature_flag",
    targetId: cleanKey,
    metadata: { enabled },
  });

  revalidatePath("/admin");
  revalidatePath("/deals");
  revalidatePath("/install");
  return getFeatureFlags();
}

// Main admin = the earliest created admin (the original). Only this account
// may manage other admins.
export async function isMainAdminAction(): Promise<boolean> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return false;
  const currentId = session.user.id;
  const admins = await getAdminUsers();
  if (admins.length === 0) return false;
  return admins[0].id === currentId;
}

async function requireMainAdmin() {
  const adminId = await requireAdmin();
  const admins = await getAdminUsers();
  if (admins.length === 0 || admins[0].id !== adminId) {
    throw new Error("Only the main admin can manage admin accounts");
  }
  return adminId;
}
