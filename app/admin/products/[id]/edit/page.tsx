"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchProductByIdAction,
  updateProductAction,
} from "@/lib/actions/products";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import { ProductImagePicker } from "@/components/ProductImagePicker";
import type { CategoryDB } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryDB[]>([]);
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

  function handleImageUpload(index: number, file: File) {
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

  function removeImage(index: number) {
    setImages((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  }

  useEffect(() => {
    fetchCategoriesAction().then((data) => setCategories(data ?? []));
    fetchProductByIdAction(id as string).then((p) => {
      if (!p) {
        router.push("/admin");
        return;
      }
      if (Array.isArray(p.images)) {
        const imgArr = [...p.images];
        while (imgArr.length < 4) imgArr.push("");
        setImages(imgArr);
      }
      setForm({
        title: p.title ?? "",
        price: String(p.price ?? ""),
        categorySlug: p.categorySlug ?? "",
        condition: p.condition ?? "",
        description: p.description ?? "",
        location: p.location ?? "Entebbe",
        featured: p.featured ?? false,
        isDeal: p.isDeal ?? false,
        specs: Array.isArray(p.specs)
          ? p.specs.map((s: { label: string; value: string }) => `${s.label}: ${s.value}`).join("\n")
          : "",
        sellerName: p.seller?.name ?? "",
        sellerPhone: p.seller?.phone ?? "",
        sellerWhatsapp: p.seller?.whatsapp ?? "",
      });
      setLoading(false);
    });
  }, [id, router]);

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
    const imgs = images.filter(Boolean);

    try {
      await updateProductAction(id as string, {
        slug: slugify(form.title),
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
        images: imgs,
        seller: {
          name: form.sellerName || undefined,
          phone: form.sellerPhone || undefined,
          whatsapp: form.sellerWhatsapp || undefined,
        },
      });
      router.push("/admin");
    } catch (err: unknown) {
      alert("Error saving: " + (err instanceof Error ? err.message : "Unknown error"));
      setSaving(false);
    }
  }

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm">Loading…</div>;
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
        Edit Product
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
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Images (up to 4)
          </label>
          <ProductImagePicker images={images} onFile={handleImageUpload} onRemove={removeImage} />
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
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Seller Name
            </label>
            <input
              value={form.sellerName}
              onChange={(e) => update("sellerName", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Seller Phone
            </label>
            <input
              value={form.sellerPhone}
              onChange={(e) => update("sellerPhone", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              WhatsApp
            </label>
            <input
              value={form.sellerWhatsapp}
              onChange={(e) => update("sellerWhatsapp", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
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
            className="w-4 h-4 rounded border-gray-300"
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
            {saving ? "Saving…" : "Update Product"}
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
