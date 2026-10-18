import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { image?: unknown; folder?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const image = typeof body.image === "string" ? body.image.trim() : "";
  if (!image) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }
  // Allow data URLs or remote http(s) URLs.
  if (
    !image.startsWith("data:image/") &&
    !image.startsWith("http://") &&
    !image.startsWith("https://")
  ) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }
  if (image.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  const folder =
    typeof body.folder === "string" && body.folder.trim()
      ? body.folder.trim()
      : "cre8market/products";

  try {
    const url = await uploadImage(image, folder);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image.",
      },
      { status: 500 },
    );
  }
}