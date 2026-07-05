"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProductCard from "@/components/ProductCard";
import { allProducts, categories, formatPrice } from "@/lib/data";

const ITEMS_PER_PAGE = 16;

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const featuredParam = searchParams.get("featured") ?? "";
  const sortParam = searchParams.get("sort") ?? "";

  const [search, setSearch] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setPage(1);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (featuredParam === "1") list = list.filter((p) => p.featured);
    if (sortParam === "latest")
      list = list.sort((a, b) => a.daysAgo - b.daysAgo);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory) {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));

    return list;
  }, [search, selectedCategory, minPrice, maxPrice, featuredParam, sortParam]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  function resetFilters() {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  return (
    <>
      <Navbar />
      <CategoryBar />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="neu-card p-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-xs text-navy font-semibold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search listings…"
                  className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Price (UGX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Min"
                    className="neu-inset w-full px-2 py-2 text-sm focus:outline-none"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Max"
                    className="neu-inset w-full px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  {featuredParam === "1"
                    ? "⭐ Featured Listings"
                    : sortParam === "latest"
                      ? "🕐 Latest Listings"
                      : "All Listings"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "result" : "results"}
                  {selectedCategory &&
                    ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
                </p>
              </div>
              <select className="neu-inset px-3 py-2 text-sm focus:outline-none">
                <option value="latest">Latest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Featured first</option>
              </select>
            </div>

            {/* Grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginated.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="neu-card text-center py-20">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="neu-pill bg-navy text-white font-bold px-5 py-2 text-sm hover:bg-navy-hover transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="neu-pill bg-surface px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40 transition-all"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        page === n
                          ? "bg-navy text-white neu-dark-pill"
                          : "neu-pill bg-surface text-gray-600"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="neu-pill bg-surface px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
