"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/data";
import { fetchProductsWithOwnersAction, deleteProductsAction, setProductsFeaturedAction } from "@/lib/actions/products";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import type { ProductWithOwner } from "@/lib/types";
import type { CategoryDB } from "@/lib/types";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProductsPageInner />
    </Suspense>
  );
}

function AdminProductsPageInner() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<ProductWithOwner[]>([]);
  const [categories, setCategories] = useState<CategoryDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchProductsWithOwnersAction().then((data) => {
      setProducts(data);
      setLoading(false);
    });
    fetchCategoriesAction().then((data) => setCategories(data ?? []));
  }, []);

  // Distinct users who have added products, for the "sort by user" dropdown.
  const owners = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.ownerType === "user" && p.user_id && p.ownerName) {
        map.set(p.user_id, p.ownerName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter) {
      list = list.filter((p) => p.categorySlug === categoryFilter);
    }
    if (ownerFilter === "user" && selectedUserId) {
      list = list.filter((p) => p.user_id === selectedUserId);
    } else if (ownerFilter === "admin") {
      list = list.filter((p) => p.ownerType === "admin");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q) ||
          (p.ownerName ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, categoryFilter, ownerFilter, selectedUserId, search]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProductsAction([id]);
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === filteredProducts.length && filteredProducts.length > 0) {
        return new Set();
      }
      return new Set(filteredProducts.map((p) => p.id));
    });
  }

  const selectedIds = Array.from(selected);

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} product${selectedIds.length !== 1 ? "s" : ""}?`)) return;
    setBusy(true);
    await deleteProductsAction(selectedIds);
    setProducts((p) => p.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
    setBusy(false);
  }

  async function handleBulkFeatured(featured: boolean) {
    if (selectedIds.length === 0) return;
    setBusy(true);
    await setProductsFeaturedAction(selectedIds, featured);
    setProducts((p) =>
      p.map((x) => (selected.has(x.id) ? { ...x, featured } : x)),
    );
    setSelected(new Set());
    setBusy(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {filteredProducts.length} product{filteredProducts.length !== 1 && "s"}
            {filteredProducts.length !== products.length && ` of ${products.length} total`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-5 py-2.5 text-sm transition-all"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, category, owner…"
          className="neu-inset px-3 py-2 text-sm focus:outline-none w-full sm:w-64"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="neu-inset px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        <select
          value={ownerFilter}
          onChange={(e) => {
            setOwnerFilter(e.target.value);
            if (e.target.value !== "user") setSelectedUserId("");
          }}
          className="neu-inset px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Owners</option>
          <option value="admin">Added by Store (Admin)</option>
          <option value="user">Added by a User…</option>
        </select>
        {ownerFilter === "user" && (
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="neu-inset px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">Select user…</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="neu-card p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-gray-900">
            {selectedIds.length} selected
          </span>
          <button
            onClick={() => handleBulkFeatured(true)}
            disabled={busy}
            className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
          >
            ★ Mark Featured
          </button>
          <button
            onClick={() => handleBulkFeatured(false)}
            disabled={busy}
            className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
          >
            Unmark Featured
          </button>
          <button
            onClick={() => handleBulkDelete()}
            disabled={busy}
            className="neu-pill bg-surface text-red-500 text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="neu-card text-center py-12">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {products.length === 0
              ? "Add your first product to get started."
              : "Try a different filter or search."}
          </p>
          <Link
            href="/admin/products/new"
            className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm inline-block"
          >
            + Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-semibold">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="pb-3 pr-4 font-semibold">Product</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Price</th>
                <th className="pb-3 pr-4 font-semibold">Added By</th>
                <th className="pb-3 pr-4 font-semibold">Featured</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={`${p.id}-${p.slug}`}
                  className={`border-t border-gray-100 ${selected.has(p.id) ? "bg-navy/5" : ""}`}
                >
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-gray-900 truncate max-w-[200px]">{p.title}</p>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                  <td className="py-3 pr-4 text-navy font-bold">{formatPrice(p.price)}</td>
                  <td className="py-3 pr-4">
                    {p.ownerType === "user" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {(p.ownerName ?? "U")[0].toUpperCase()}
                        </span>
                        <span className="text-gray-700 text-xs font-semibold">{p.ownerName}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs font-semibold">Store (Admin)</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {p.featured ? (
                      <span className="text-featured text-xs font-bold">★ Featured</span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5 transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="neu-pill bg-surface text-red-500 text-xs font-semibold px-3 py-1.5 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
