"use client";

import ImageUploader from "@/components/ImageUploader";

export function ProductImagePicker({
  images,
  onChange,
  max,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}) {
  const limit = max ?? images.length;
  const slots = Array.from({ length: limit }, (_, i) => images[i] ?? "");

  function setSlot(index: number, url: string) {
    const next = [...images];
    while (next.length <= index) next.push("");
    next[index] = url;
    onChange(next);
  }

  function removeSlot(index: number) {
    const next = [...images];
    while (next.length <= index) next.push("");
    next[index] = "";
    onChange(next);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {slots.map((src, i) => (
        <div key={i} className="relative">
          <ImageUploader
            width={800}
            height={600}
            value={src || null}
            folder="cre8market/products"
            label={`Image ${i + 1}`}
            onUploadComplete={(url) => setSlot(i, url)}
          />
          {src && (
            <button
              type="button"
              onClick={() => removeSlot(i)}
              aria-label={`Remove image ${i + 1}`}
              title="Remove image"
              className="absolute top-1 right-1 z-10 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}