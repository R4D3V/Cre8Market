"use server";

import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";
import {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUserProfile,
  updateUserContact,
  updateUserAdminStatus,
  getUserPasswordHash,
  updateUserPassword,
  deleteUser,
  checkPhoneExists,
  checkPhoneExistsExcluding,
} from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

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

// Admin directly creates a user account (e.g. onboarding a seller who can't self-register).
export async function createUserByAdminAction(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password: string;
  pin?: string;
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
  });

  revalidatePath("/admin/users");
  return user;
}

export async function setUserActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  const user = await updateUserStatus(id, isActive);
  revalidatePath("/admin/users");
  return user;
}

// Admin edits any user's name/phone/whatsapp.
export async function updateUserByAdminAction(
  id: string,
  data: { name: string; phone: string; whatsapp?: string; avatar?: string | null },
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
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return user;
}

// Admin promotes/demotes a user to/from admin role (phone login grants admin access).
export async function setUserAdminAction(id: string, isAdmin: boolean) {
  await requireAdmin();
  const user = await updateUserAdminStatus(id, isAdmin);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return user;
}

// Backup plan: an admin sets a new password for a user (e.g. if they forgot their reset pin).
export async function resetUserPasswordByAdminAction(id: string, newPassword: string) {
  await requireAdmin();
  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(id, passwordHash);
  revalidatePath("/admin/users");
  return { success: true };
}

// Removes the user account. Any products they added are kept and simply become
// unassigned (their "Added by" reverts to the admin/store).
export async function deleteUserAction(id: string) {
  await requireAdmin();
  await deleteUser(id);
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
}) {
  const userId = await requireUser();
  if (!data.name || !data.name.trim()) throw new Error("Name is required");
  const user = await updateUserProfile(userId, {
    name: data.name.trim(),
    whatsapp: data.whatsapp,
    avatar: data.avatar,
  });
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return user;
}

export async function changeMyPasswordAction(currentPassword: string, newPassword: string) {
  const userId = await requireUser();
  if (!currentPassword) throw new Error("Current password is required");
  if (!newPassword || newPassword.length < 6) throw new Error("New password must be at least 6 characters");

  const currentHash = await getUserPasswordHash(userId);
  if (!currentHash) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, currentHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(userId, passwordHash);
  return { success: true };
}
