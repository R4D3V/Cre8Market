"use server";

import { pool } from "@/lib/db/pool";
import bcrypt from "bcrypt";
import { checkPhoneExists, createUser } from "@/lib/db/queries";

// Public self-registration for regular marketplace users (buyers/sellers).
// Does not sign the user in — the client calls next-auth's signIn("user-credentials", ...)
// right after this succeeds, same pattern as the admin login page.
export async function registerUserAction(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password: string;
}) {
  if (!data.name || !data.phone || !data.password) {
    throw new Error("Name, phone and password are required");
  }
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const exists = await checkPhoneExists(data.phone);
  if (exists) throw new Error("An account with this phone number already exists");

  const password_hash = await bcrypt.hash(data.password, 12);
  const user = await createUser({
    name: data.name,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    password_hash,
  });

  return user;
}

export async function resetAdminPasswordAction(email: string, newPassword: string) {
  if (!email || !newPassword) throw new Error("Email and password are required");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const { rowCount } = await pool.query(
    "UPDATE admin_users SET password_hash = $1 WHERE email = $2",
    [passwordHash, email],
  );

  if (rowCount === 0) throw new Error("No admin user found with that email");
  return { success: true };
}

export async function resetUserPasswordAction(phone: string, newPassword: string) {
  if (!phone || !newPassword) throw new Error("Phone number and password are required");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE phone = $2",
    [passwordHash, phone],
  );

  if (rowCount === 0) throw new Error("No account found with that phone number");
  return { success: true };
}
