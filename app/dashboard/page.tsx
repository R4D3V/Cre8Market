"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/data";
import { fetchMyProductsAction, deleteMyProductsAction } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

export default function MyProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchMyProductsAction().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteMyProductsAction([id]);
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
      if (prev.size === products.length && products.length > 0) {
        return new Set();
      }
      return new Set(products.map((p) => p.id));
    });
  }

  const selectedIds = Array.from(selected);

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} product${selectedIds.length !== 1 ? "s" : ""}?`)) return;
    setBusy(true);
    await deleteMyProductsAction(selectedIds);
    setProducts((p) => p.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
    setBusy(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} product{products.length !== 1 && "s"} listed
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-5 py-2.5 text-sm transition-all"
        >
          + Add Product
        </Link>
      </div>

      <div className="mb-6 neu-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg shrink-0">
            {(session?.user?.name ?? "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}!
            </p>
            <p className="text-gray-400 text-xs">Manage your profile and listings</p>
          </div>
        </div>
        <Link
          href="/dashboard/profile"
          className="neu-pill bg-surface text-navy text-sm font-semibold px-4 py-2 transition-all"
        >
          Edit Profile
        </Link>
      </div>

      {/* Bulk delete */}
      {selectedIds.length > 0 && (
        <div className="neu-card p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-gray-900">
            {selectedIds.length} selected
          </span>
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

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading…</div>
      ) : products.length === 0 ? (
        <div className="neu-card text-center py-12">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="font-bold text-gray-900 mb-1">You haven't added any products yet</h3>
          <p className="text-gray-500 text-sm mb-4">List your first item to start selling.</p>
          <Link
            href="/dashboard/products/new"
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
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="pb-3 pr-4 font-semibold">Product</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Price</th>
                <th className="pb-3 pr-4 font-semibold">Listed</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
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
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="font-semibold text-gray-900 hover:text-navy hover:underline truncate max-w-[220px] block"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                  <td className="py-3 pr-4 text-navy font-bold">{formatPrice(p.price)}</td>
                  <td className="py-3 pr-4 text-gray-500">{p.timeAgo}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
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
