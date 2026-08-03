"use client";

export function ProductImagePicker({
  images,
  onFile,
  onRemove,
}: {
  images: string[];
  onFile: (index: number, file: File) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-square">
          {src ? (
            <div className="relative w-full h-full neu-inset overflow-hidden">
              <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <label className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] font-semibold text-center py-1.5 cursor-pointer hover:bg-black/60">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(i, f);
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`Remove image ${i + 1}`}
                title="Remove image"
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-navy text-white text-sm leading-none font-bold flex items-center justify-center shadow"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="neu-inset w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden">
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <span className="text-xl">📷</span>
                <span className="text-[10px] font-semibold">Image {i + 1}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(i, f);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}
