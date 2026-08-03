"use server";

import { pool } from "@/lib/db/pool";
import bcrypt from "bcrypt";
import { checkPhoneExists, createUser, getUserByPhone } from "@/lib/db/queries";

// Public self-registration for regular marketplace users (buyers/sellers).
// Does not sign the user in — the client calls next-auth's signIn("user-credentials", ...)
// right after this succeeds, same pattern as the admin login page.
export async function registerUserAction(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password: string;
  pin: string;
}) {
  if (!data.name || !data.phone || !data.password) {
    throw new Error("Name, phone and password are required");
  }
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (!/^\d{4}$/.test(data.pin)) {
    throw new Error("Reset pin must be a 4-digit code");
  }

  const exists = await checkPhoneExists(data.phone);
  if (exists) throw new Error("An account with this phone number already exists");

  const password_hash = await bcrypt.hash(data.password, 12);
  const pin_hash = await bcrypt.hash(data.pin, 12);
  const user = await createUser({
    name: data.name,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    password_hash,
    pin_hash,
  });

  return user;
}

// Backup pin required before an admin password can be reset.
const ADMIN_RESET_PIN = process.env.ADMIN_RESET_PIN || "1285";

export async function resetAdminPasswordAction(
  email: string,
  newPassword: string,
  pin: string,
) {
  if (!email || !newPassword) throw new Error("Email and password are required");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
  if (pin !== ADMIN_RESET_PIN) {
    throw new Error("Incorrect backup pin. Please enter the correct backup pin before resetting the admin password.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const { rowCount } = await pool.query(
    "UPDATE admin_users SET password_hash = $1 WHERE email = $2",
    [passwordHash, email],
  );

  if (rowCount === 0) throw new Error("No admin user found with that email");
  return { success: true };
}

export async function resetUserPasswordAction(phone: string, newPassword: string, pin: string) {
  if (!phone || !newPassword) throw new Error("Phone number and password are required");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");

  const user = await getUserByPhone(phone);
  if (!user) throw new Error("No account found with that phone number");

  // Legacy accounts created before the reset pin existed have no pin_hash.
  // They reset as before. Accounts with a pin require it (2-step verification).
  if (user.pin_hash) {
    if (!/^\d{4}$/.test(pin)) throw new Error("Enter the 4-digit reset pin you set when registering");
    const valid = await bcrypt.compare(pin, user.pin_hash);
    if (!valid) throw new Error("Incorrect reset pin. Please enter the 4-digit pin you set when registering.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE phone = $2",
    [passwordHash, phone],
  );

  if (rowCount === 0) throw new Error("No account found with that phone number");
  return { success: true };
}
