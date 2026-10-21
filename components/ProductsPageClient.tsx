"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { ChevronUp } from "lucide-react";
import {
  fetchProductsPageAction,
  fetchSellersAction,
} from "@/lib/actions/products";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import type { Product } from "@/lib/types";
import type { CategoryDB } from "@/lib/types";

const ITEMS_PER_PAGE = 16;

function ProductCardSkeleton() {
  return (
    <div className="neu-card overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] rounded-t-3xl bg-muted animate-pulse" />
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="h-2.5 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse" />
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="h-3.5 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-2.5 w-12 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
      <div className="px-3.5 pb-3.5">
        <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export default function ProductsPageClient(props: {
  initialProducts?: Product[];
  initialTotal?: number;
  initialCategories?: CategoryDB[];
  initialSellers?: { id: string; name: string; productCount: number }[];
} = {}) {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent {...props} />
    </Suspense>
  );
}

function ProductsPageContent({
  initialProducts,
  initialTotal,
  initialCategories,
  initialSellers,
}: {
  initialProducts?: Product[];
  initialTotal?: number;
  initialCategories?: CategoryDB[];
  initialSellers?: { id: string; name: string; productCount: number }[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const featuredParam = searchParams.get("featured") ?? "";
  const sortParam = searchParams.get("sort") ?? "";
  const sellerParam = searchParams.get("seller") ?? "";
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const pageParam = searchParams.get("page") ?? "";

  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [total, setTotal] = useState(initialTotal ?? 0);
  const [categories, setCategories] = useState<CategoryDB[]>(
    initialCategories ?? [],
  );
  const [sellers, setSellers] = useState<
    { id: string; name: string; productCount: number }[]
  >(initialSellers ?? []);
  const [loading, setLoading] = useState(initialProducts ? false : true);

  const [search, setSearch] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSeller, setSelectedSeller] = useState(sellerParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const skipInitialProductsRef = useRef(!!initialProducts);
  const skipInitialMetaRef = useRef(
    !!(initialCategories || initialSellers),
  );

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setPage(1);
  }, [categoryParam]);

  useEffect(() => {
    setSearch(qParam);
    setPage(1);
  }, [qParam]);

  useEffect(() => {
    if (skipInitialMetaRef.current) return;
    fetchCategoriesAction().then((data) => {
      setCategories(data ?? []);
    });
    fetchSellersAction().then((data) => {
      setSellers(data ?? []);
    });
  }, []);

  // Debounce the search box so we don't hit the DB on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch one page of products, letting Postgres handle filtering and sorting.
  useEffect(() => {
    if (skipInitialProductsRef.current) {
      skipInitialProductsRef.current = false;
      return;
    }
    let active = true;
    setLoading(true);
    fetchProductsPageAction({
      search: debouncedSearch,
      categorySlug: selectedCategory,
      sellerId: selectedSeller,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      featured: featuredParam === "1",
      sort: sortParam,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    }).then(({ products: pageProducts, total: pageTotal }) => {
      if (!active) return;
      setProducts(pageProducts);
      setTotal(pageTotal);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [
    debouncedSearch,
    selectedCategory,
    selectedSeller,
    minPrice,
    maxPrice,
    featuredParam,
    sortParam,
    page,
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  function resetFilters() {
    setSearch("");
    setSelectedCategory("");
    setSelectedSeller("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  return (
    <>
      <Navbar />
      <main className="container py-6 pb-24 sm:pb-8">
        <ScrollReveal className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <div className="neu-card p-4 lg:sticky lg:top-24">
              <div
                className={`flex items-center justify-between ${filtersOpen ? "mb-4" : "mb-0 lg:mb-4"}`}
              >
                <h2 className="font-heading font-bold text-foreground">
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((o) => !o)}
                    aria-expanded={filtersOpen}
                    className="lg:hidden flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    {filtersOpen ? "Hide filters" : "Show filters"}
                    <ChevronUp
                      className={`size-4 transition-transform duration-300 ${filtersOpen ? "" : "rotate-180"}`}
                    />
                  </button>
                </div>
              </div>

              <div className={filtersOpen ? "block" : "hidden lg:block"}>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
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
                    className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(1);
                    }}
                    className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Seller
                  </label>
                  <select
                    value={selectedSeller}
                    onChange={(e) => {
                      setSelectedSeller(e.target.value);
                      setPage(1);
                    }}
                    className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  >
                    <option value="">All Sellers</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.productCount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
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
                      className="neu-inset w-full px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Max"
                      className="neu-inset w-full px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading text-xl font-extrabold text-foreground">
                  {featuredParam === "1"
                    ? "⭐ Featured Listings"
                    : sortParam === "latest"
                      ? "🕐 Latest Listings"
                      : "All Listings"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {total} {total === 1 ? "result" : "results"}
                  {selectedCategory &&
                    ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
                </p>
              </div>
              <select
                value={sortParam || "latest"}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("sort", e.target.value);
                  setPage(1);
                  router.replace(`/products?${params.toString()}`);
                }}
                className="neu-inset px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              >
                <option value="latest">Latest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Featured first</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((p) => (
                  <ProductCard key={`${p.id}-${p.slug}`} product={p} />
                ))}
              </div>
            ) : (
              <div className="neu-card text-center py-20">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  No listings found
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2 text-sm hover:bg-primary/90 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === 1}
                  className="border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground disabled:opacity-40 transition-all"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setPage(n);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        page === n
                          ? "bg-primary text-primary-foreground neu-dark-pill"
                          : "border border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === totalPages}
                  className="border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground disabled:opacity-40 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </>
  );
}
