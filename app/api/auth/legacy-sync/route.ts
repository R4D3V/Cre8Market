import { NextResponse } from "next/server";
import {
  syncLegacyAdminToBetterAuth,
  syncLegacyUserToBetterAuth,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, email } = body as { phone?: string; email?: string };

    if (phone) {
      await syncLegacyUserToBetterAuth(phone);
    }
    if (email) {
      await syncLegacyAdminToBetterAuth(email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("legacy-sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Could not prepare your account for sign-in.",
      },
      { status: 500 },
    );
  }
}
