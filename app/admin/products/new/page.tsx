"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProductAction,
  checkSlugAction,
} from "@/lib/actions/products";
import { fetchMyAdminProfileAction } from "@/lib/actions/admin";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import type { CategoryDB } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    categorySlug: "",
    condition: "",
    description: "",
    location: "Entebbe",
    featured: false,
    isDeal: false,
    specs: "",
    sellerName: "",
    sellerPhone: "",
    sellerWhatsapp: "",
  });
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryDB[]>([]);

  useEffect(() => {
    fetchCategoriesAction().then((data) => setCategories(data ?? []));
    // Seller info defaults to the admin's own profile.
    fetchMyAdminProfileAction()
      .then((admin) => {
        if (!admin) return;
        setForm((f) => ({
          ...f,
          sellerName: admin.name ?? "",
          sellerPhone: admin.phone ?? "",
          sellerWhatsapp: admin.whatsapp ?? "",
        }));
      })
      .catch(() => {});
  }, []);

  function handleImageUpload(index: number, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => {
        const next = [...prev];
        next[index] = reader.result as string;
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const cat = categories.find((c) => c.slug === form.categorySlug);
    let slug = slugify(form.title);

    const exists = await checkSlugAction(slug);
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const imgs = images.filter(Boolean);

    try {
      await createProductAction({
        slug,
        title: form.title,
        price: Number(form.price),
        category: cat?.name ?? form.categorySlug,
        categorySlug: form.categorySlug,
        condition: form.condition || null,
        description: form.description || null,
        location: form.location,
        featured: form.featured,
        isDeal: form.isDeal,
        specs: form.specs
          ? form.specs.split("\n").filter(Boolean).map((line) => {
              const [label, value] = line.split(":").map((s) => s.trim());
              return { label: label || "", value: value || "" };
            })
          : [],
        seller: {
          name: form.sellerName || undefined,
          phone: form.sellerPhone || undefined,
          whatsapp: form.sellerWhatsapp || undefined,
        },
        images: imgs,
        daysAgo: 0,
        timeAgo: "Just now",
      });

      // Send push notification about new product
      await fetch("/api/push/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Product Added!",
          body: `${form.title} — UGX ${Number(form.price).toLocaleString()}`,
          url: `/products/${slug}`,
        }),
      }).catch(() => {});

      router.push("/admin");
    } catch (err: unknown) {
      alert("Error saving: " + (err instanceof Error ? err.message : "Unknown error"));
      setSaving(false);
    }
  }

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-navy font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="neu-card p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Title *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Samsung Galaxy S24 Ultra"
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Images (up to 4)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <label
                key={i}
                className="neu-inset aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
              >
                {images[i] ? (
                  <img
                    src={images[i]}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="text-xl">📷</span>
                    <span className="text-[10px] font-semibold">Image {i + 1}</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(i, e.target.files?.[0] ?? null)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price (UGX) *
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="e.g. 1200000"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category *
            </label>
            <select
              required
              value={form.categorySlug}
              onChange={(e) => update("categorySlug", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Condition
            </label>
            <select
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="">Select…</option>
              {["New", "Like New", "Used - Good", "Used - Fair", "Refurbished"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Kitoro, Entebbe"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the product, its condition, what's included…"
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Specs (one per line — Label: Value)
          </label>
          <textarea
            rows={3}
            value={form.specs}
            onChange={(e) => update("specs", e.target.value)}
            placeholder={"Storage: 256GB\nRAM: 8GB\nColor: Phantom Black"}
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none font-mono"
          />
        </div>

        <div className="neu-inset p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            Seller (from your profile)
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {form.sellerName || "—"} · Phone {form.sellerPhone || "—"} · WhatsApp{" "}
            {form.sellerWhatsapp || "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This is taken from your admin profile. Update it in{" "}
            <Link href="/admin/profile" className="text-navy hover:underline">
              My Profile
            </Link>{" "}
            if it changes.
          </p>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
          />
          <span className="text-sm font-semibold text-gray-700">
            Mark as Featured
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDeal}
            onChange={(e) => update("isDeal", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
          />
          <span className="text-sm font-semibold text-gray-700">
            🔥 Mark as a Deal (shows on the Deals page)
          </span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-6 py-2.5 text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
