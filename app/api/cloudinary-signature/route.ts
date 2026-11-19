import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const ALLOWED_FOLDER = /^cre8market\/[a-z0-9/_-]{1,80}$/i;

function normalizeFolder(input: unknown): string {
  const raw = typeof input === "string" ? input.trim() : "";
  if (raw && ALLOWED_FOLDER.test(raw) && !raw.includes("..")) return raw;
  return "cre8market/uploads";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary is not configured on the server." }, { status: 503 });
  }

  let body: { folder?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const folder = normalizeFolder(body.folder);
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  });
}