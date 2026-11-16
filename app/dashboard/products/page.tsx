"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, SearchX } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/data";
import {
  fetchMyProductsAction,
  deleteMyProductsAction,
  duplicateMyProductsAction,
} from "@/lib/actions/products";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import type { Product } from "@/lib/types";

// Re-export the existing products management UI. This page is the moved home
// of what used to live at /dashboard so /dashboard can act as a hub.
export default function MyProductsListPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProductsAction().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const previous = products;
    setError("");
    setProducts((p) => p.filter((x) => x.id !== id));
    try {
      await deleteMyProductsAction([id]);
    } catch (e) {
      setProducts(previous);
      setError(e instanceof Error ? e.message : "Couldn't delete that product. It has been restored.");
    }
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const dashboardCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  ).sort();

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query)
    );
  });

  function toggleAll() {
    setSelected((prev) => {
      const visibleIds = filteredProducts.map((p) => p.id);
      if (prev.size === visibleIds.length && visibleIds.length > 0) {
        return new Set();
      }
      return new Set(visibleIds);
    });
  }

  const selectedIds = Array.from(selected);

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} product${selectedIds.length !== 1 ? "s" : ""}?`)) return;
    setBusy(true);
    setError("");
    const previous = products;
    const previousSelected = selected;
    setProducts((p) => p.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
    try {
      await deleteMyProductsAction(selectedIds);
    } catch (e) {
      setProducts(previous);
      setSelected(previousSelected);
      setError(e instanceof Error ? e.message : "Couldn't delete those products. They have been restored.");
    } finally {
      setBusy(false);
    }
  }

  async function refreshProducts() {
    const data = await fetchMyProductsAction();
    setProducts(data);
  }

  async function handleDuplicate(id: string) {
    setBusy(true);
    setError("");
    try {
      await duplicateMyProductsAction([id]);
      await refreshProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to duplicate product");
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkDuplicate() {
    if (selectedIds.length === 0) return;
    setBusy(true);
    setError("");
    try {
      await duplicateMyProductsAction(selectedIds);
      await refreshProducts();
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to duplicate products");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardPanel
      title="My Products"
      description={`${products.length} product${products.length !== 1 && "s"} listed`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary/40"
          >
            ← Dashboard
          </Link>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            + Add Product
          </Link>
        </div>
      }
    >
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/60 to-card/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/15 text-lg font-bold text-primary">
            {(session?.user?.name ?? "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">
              Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}!
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm font-semibold rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {selectedIds.length > 0 && (
        <div className="border border-border/70 bg-card/80 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-foreground">
            {selectedIds.length} selected
          </span>
          <button
            onClick={() => handleBulkDuplicate()}
            disabled={busy}
            className="neu-pill bg-background text-primary text-xs font-semibold px-3 py-1.5 transition-all disabled:opacity-60"
          >
            Duplicate Selected
          </button>
          <button
            onClick={() => handleBulkDelete()}
            disabled={busy}
            className="neu-pill bg-background text-destructive text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your products..."
            className="w-full rounded-xl border border-border/70 bg-muted/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-border/70 bg-muted/30 px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
        >
          <option value="">All Categories</option>
          {dashboardCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Loading…
        </div>
      ) : products.length === 0 ? (
        <div className="border border-border/70 bg-card/80 rounded-xl text-center py-12">
          <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Package className="h-6 w-6" />
          </span>
          <h3 className="font-bold text-foreground mb-1">
            You haven&apos;t added any products yet
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            List your first item to start selling.
          </p>
          <Link
            href="/dashboard/products/new"
            className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm inline-block"
          >
            + Add Product
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-border/70 bg-card/80 rounded-xl text-center py-12">
          <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <SearchX className="h-6 w-6" />
          </span>
          <h3 className="font-bold text-foreground mb-1">
            No matching products
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Try another keyword or clear the search.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
            }}
            className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground lg:hidden">
            <input
              type="checkbox"
              checked={
                filteredProducts.length > 0 &&
                filteredProducts.every((product) => selected.has(product.id))
              }
              onChange={toggleAll}
              className="h-4 w-4 cursor-pointer rounded border-border bg-card text-primary"
            />
            Select all
          </div>

          <div className="space-y-3 lg:hidden">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border border-border/70 bg-muted/30 p-4 ${
                  selected.has(p.id) ? "border-primary/40 bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelected(p.id)}
                    aria-label={`Select ${p.title}`}
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-border bg-card text-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="font-semibold text-foreground hover:text-primary hover:underline"
                      >
                        {p.title}
                      </Link>
                      <span className="shrink-0 text-sm font-bold text-primary">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.category}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Listed {p.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Link
                    href={`/dashboard/products/${p.id}/edit`}
                    className="neu-pill bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(p.id)}
                    disabled={busy}
                    className="neu-pill bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-all disabled:opacity-60"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="neu-pill bg-background px-3 py-1.5 text-xs font-semibold text-destructive transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="pb-3 pr-4 font-semibold">
                    <input
                      type="checkbox"
                      checked={
                        filteredProducts.length > 0 &&
                        filteredProducts.every((product) =>
                          selected.has(product.id),
                        )
                      }
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-border bg-card text-primary cursor-pointer"
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
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t border-border ${selected.has(p.id) ? "bg-primary/5" : ""}`}
                  >
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelected(p.id)}
                        className="w-4 h-4 rounded border-border bg-card text-primary cursor-pointer"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="font-semibold text-foreground hover:text-primary hover:underline truncate max-w-[220px] block"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {p.category}
                    </td>
                    <td className="py-3 pr-4 text-primary font-bold">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {p.timeAgo}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/products/${p.id}/edit`}
                          className="neu-pill bg-background text-primary text-xs font-semibold px-3 py-1.5 transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p.id)}
                          disabled={busy}
                          className="neu-pill bg-background text-primary text-xs font-semibold px-3 py-1.5 transition-all disabled:opacity-60"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="neu-pill bg-background text-destructive text-xs font-semibold px-3 py-1.5 transition-all"
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
        </>
      )}
    </DashboardPanel>
  );
}