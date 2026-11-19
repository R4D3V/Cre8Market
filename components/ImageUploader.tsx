"use client";

import "react-easy-crop/react-easy-crop.css";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Camera, Loader2, Upload, X, ZoomIn } from "lucide-react";
import { signedCloudinaryUpload } from "@/lib/signedUpload";

type ImageUploaderProps = {
  width: number;
  height: number;
  value?: string | null;
  onUploadComplete: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: Error) => void;
  disabled?: boolean;
  folder?: string;
  maxSizeMB?: number;
  label?: string;
};

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the selected image"));
    img.src = src;
  });
}

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  width: number,
  height: number,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the cropped image"))),
      "image/jpeg",
      0.92,
    );
  });
}

export default function ImageUploader({
  width,
  height,
  value,
  onUploadComplete,
  onUploadStart,
  onUploadError,
  disabled = false,
  folder = "cre8market/uploads",
  maxSizeMB = 10,
  label = "Upload image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const aspect = width / height;

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (JPEG, PNG or WebP).");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image must be smaller than ${maxSizeMB}MB.`);
        return;
      }
      setError("");
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setModalOpen(true);
    },
    [fileUrl, maxSizeMB],
  );

  const handleConfirm = useCallback(async () => {
    if (!fileUrl || !croppedAreaPixels || uploading) return;
    setUploading(true);
    setError("");
    onUploadStart?.();
    try {
      const blob = await getCroppedBlob(fileUrl, croppedAreaPixels, width, height);
      const url = await signedCloudinaryUpload(blob, folder);
      onUploadComplete(url);
      setModalOpen(false);
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      onUploadError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setUploading(false);
    }
  }, [fileUrl, croppedAreaPixels, uploading, width, height, folder, onUploadComplete, onUploadStart, onUploadError]);

  const handleCancel = useCallback(() => {
    if (uploading) return;
    setModalOpen(false);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    setError("");
  }, [uploading, fileUrl]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Current image" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Camera className="size-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="neu-pill inline-flex items-center gap-1.5 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-primary/10 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {value ? "Replace" : label}
          </button>
          <p className="text-[10px] text-muted-foreground">
            {width} × {height}px · JPEG
          </p>
        </div>
      </div>

      {error && !modalOpen && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {modalOpen && fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">Crop your image</h2>
                <p className="text-xs text-muted-foreground">
                  Output: {width} × {height}px
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative h-72 w-full bg-black/90 sm:h-80">
              <Cropper
                image={fileUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className="space-y-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Zoom"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="neu-pill bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={uploading || !croppedAreaPixels}
                  className="neu-pill inline-flex items-center gap-1.5 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {uploading && <Loader2 className="size-3.5 animate-spin" />}
                  {uploading ? "Uploading…" : "Crop & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}