"use server";

import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";
import {
  getAdminUserById,
  getAdminUserByEmail,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  updateAdminProfile,
  getAdminUserPasswordHash,
  updateAdminUserPassword,
} from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

export async function fetchAdminUsersAction() {
  await requireAdmin();
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
  await requireAdmin();

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

  revalidatePath("/admin/admins");
  revalidatePath("/admin");
  return admin;
}

export async function deleteAdminUserAction(id: string) {
  const currentAdminId = await requireAdmin();
  if (id === currentAdminId) {
    throw new Error("You cannot delete your own admin account");
  }
  await deleteAdminUser(id);
  revalidatePath("/admin/admins");
  revalidatePath("/admin");
  return { success: true };
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
}) {
  const adminId = await requireAdmin();
  const admin = await updateAdminProfile(adminId, data);
  revalidatePath("/admin/profile");
  return admin;
}

export async function changeMyAdminPasswordAction(currentPassword: string, newPassword: string) {
  const adminId = await requireAdmin();
  if (!currentPassword) throw new Error("Current password is required");
  if (!newPassword || newPassword.length < 6) throw new Error("New password must be at least 6 characters");

  const currentHash = await getAdminUserPasswordHash(adminId);
  if (!currentHash) throw new Error("Admin not found");
  const valid = await bcrypt.compare(currentPassword, currentHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateAdminUserPassword(adminId, passwordHash);
  return { success: true };
}
