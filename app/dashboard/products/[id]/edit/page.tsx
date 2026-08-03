"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { fetchMyProductsAction, updateMyProductAction, deleteMyProductAction } from "@/lib/actions/products";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import { compressImage } from "@/lib/imageCompress";
import { ProductImagePicker } from "@/components/ProductImagePicker";
import type { CategoryDB } from "@/lib/types";

export default function EditMyProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFoundOrNotOwned, setNotFoundOrNotOwned] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    categorySlug: "",
    condition: "",
    description: "",
    location: "Entebbe",
    specs: "",
    isDeal: false,
  });
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [categories, setCategories] = useState<CategoryDB[]>([]);

  async function handleImageUpload(index: number, file: File) {
    try {
      const dataUrl = await compressImage(file);
      setImages((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    } catch {
      setError("Could not read that image. Please try a different file.");
    }
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
    // fetchMyProductsAction only returns products owned by the current session's user,
    // so looking the id up in that list doubles as an ownership check.
    fetchMyProductsAction().then((products) => {
      const p = products.find((x) => x.id === id);
      if (!p) {
        setNotFoundOrNotOwned(true);
        setLoading(false);
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
        specs: Array.isArray(p.specs)
          ? p.specs.map((s) => `${s.label}: ${s.value}`).join("\n")
          : "",
        isDeal: p.isDeal ?? false,
      });
      setLoading(false);
    });
  }, [id]);

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
    setError("");

    const cat = categories.find((c) => c.slug === form.categorySlug);
    const slug = slugify(form.title);
    const imgs = images.filter(Boolean);

    try {
      await updateMyProductAction(id as string, {
        slug,
        title: form.title,
        price: Number(form.price),
        category: cat?.name ?? form.categorySlug,
        categorySlug: form.categorySlug,
        condition: form.condition || null,
        description: form.description || null,
        location: form.location,
        featured: false,
        isDeal: form.isDeal,
        specs: form.specs
          ? form.specs
              .split("\n")
              .filter(Boolean)
              .map((line) => {
                const [label, value] = line.split(":").map((s) => s.trim());
                return { label: label || "", value: value || "" };
              })
          : [],
        seller: {
          name: session?.user?.name ?? "",
          phone: session?.user?.phone ?? "",
          whatsapp: session?.user?.whatsapp ?? session?.user?.phone ?? "",
        },
        images: imgs,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await deleteMyProductAction(id as string);
    router.push("/dashboard");
  }

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm">Loading…</div>;
  }

  if (notFoundOrNotOwned) {
    return (
      <div className="neu-card text-center py-12">
        <p className="text-4xl mb-3">🚫</p>
        <h3 className="font-bold text-gray-900 mb-1">Product not found</h3>
        <p className="text-gray-500 text-sm mb-4">
          This listing doesn't exist or wasn't added by your account.
        </p>
        <Link href="/dashboard" className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm inline-block">
          ← Back to My Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-navy font-semibold hover:underline mb-4 inline-block">
        ← Back to My Products
      </Link>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="neu-card p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Images (up to 4)
          </label>
          <ProductImagePicker images={images} onFile={handleImageUpload} onRemove={removeImage} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (UGX) *</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="">Select…</option>
              {["New", "Like New", "Used - Good", "Used - Fair", "Refurbished"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
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

        <div className="neu-inset p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            Buyers will contact you at
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {session?.user?.name} · WhatsApp {session?.user?.whatsapp ?? session?.user?.phone}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-6 py-2.5 text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 transition-colors font-semibold"
          >
            Delete Product
          </button>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
