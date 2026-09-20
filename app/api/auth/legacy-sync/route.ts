import { NextResponse } from "next/server";
import {
  syncLegacyAdminToBetterAuth,
  syncLegacyUserToBetterAuth,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { phone, email } = body as { phone?: string; email?: string };

  if (phone) {
    await syncLegacyUserToBetterAuth(phone);
  }
  if (email) {
    await syncLegacyAdminToBetterAuth(email);
  }

  return NextResponse.json({ success: true });
}
