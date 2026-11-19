// Direct, signed upload to Cloudinary from the browser. The image bytes never
// pass through our Next.js API route — only a short-lived signature does.
export async function signedCloudinaryUpload(
  file: Blob,
  folder = "cre8market/uploads",
): Promise<string> {
  const sigRes = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!sigRes.ok) {
    const data = await sigRes.json().catch(() => ({}));
    throw new Error(data?.error || "Could not get upload signature");
  }
  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } =
    (await sigRes.json()) as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
    };

  const formData = new FormData();
  formData.append("file", file, "image.jpg");
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", signedFolder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  if (!uploadRes.ok) {
    const data = await uploadRes.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  const data = (await uploadRes.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("No URL returned from Cloudinary");
  return data.secure_url;
}