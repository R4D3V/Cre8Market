import { NextResponse } from "next/server";
import { pool } from "@/lib/db/pool";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pool.query("SELECT 1");
    return NextResponse.json({ status: "ok", db: "ok", ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { status: "error", db: "error", message: String(err) },
      { status: 503 },
    );
  }
}