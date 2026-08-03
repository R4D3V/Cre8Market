"use server";

import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";
import {
  getAdminUserById,
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
