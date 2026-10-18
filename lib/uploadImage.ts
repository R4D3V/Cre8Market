import { compressImage } from "./imageCompress";

// Compress a file client-side, upload it to Cloudinary via the server route,
// and return the hosted URL. Falls back to the compressed data URL if the
// upload endpoint is unavailable so the form still works offline.
export async function uploadProductImage(
  file: File,
  folder = "cre8market/products",
): Promise<string> {
  const dataUrl = await compressImage(file);

  try {
    const res = await fetch("/api/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl, folder }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || "Upload failed");
    }

    const data = await res.json();
    if (typeof data?.url === "string" && data.url) {
      return data.url;
    }
    throw new Error("No URL returned");
  } catch (err) {
    // Graceful fallback: keep the compressed data URL so saving still works
    // when Cloudinary isn't configured yet.
    console.warn("Cloudinary upload failed, falling back to data URL:", err);
    return dataUrl;
  }
}