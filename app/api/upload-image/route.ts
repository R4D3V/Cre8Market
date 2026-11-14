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
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const isImage =
    image.startsWith("data:image/") ||
    image.startsWith("http://") ||
    image.startsWith("https://");
  const isVideo = image.startsWith("data:video/");
  // Allow image data URLs, remote http(s) URLs, or video data URLs.
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  // Videos can be up to ~5MB (base64 inflates by ~33%).
  const limit = isVideo ? 7 * 1024 * 1024 : 10 * 1024 * 1024;
  if (image.length > limit) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
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