"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchPublicUserAction } from "@/lib/actions/users";
import { fetchPublicUserProductsAction } from "@/lib/actions/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { AppUser, Product } from "@/lib/types";

export default function SellerPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AppUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchPublicUserAction(id), fetchPublicUserProductsAction(id)])
      .then(([u, p]) => {
        setUser(u);
        setProducts(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const whatsapp = (user?.whatsapp ?? user?.phone ?? "256751621506").replace(/\D/g, "");

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-16 text-center text-muted-foreground text-sm">
          Loading…
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="neu-card text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-bold text-foreground mb-1">Seller not found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              This seller may have been removed or never existed.
            </p>
            <Link
              href="/sellers"
              className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm inline-block"
            >
              ← Back to Sellers
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-10 space-y-10">
      {/* Seller header */}
      <ScrollReveal>
        <div className="neu-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-3xl overflow-hidden shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground flex items-center justify-center md:justify-start gap-2">
              {user.name}
              {user.isVerified && (
                <svg
                  className="w-5 h-5 text-secondary shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Verified"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {products.length} product{products.length !== 1 && "s"} · Member
              since{" "}
              {new Date(user.createdAt).toLocaleDateString("en", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
            {user.phone && (
              <a
                href={`tel:${user.phone.replace(/\D/g, "")}`}
                className="neu-pill bg-background text-foreground text-xs font-bold px-4 py-2.5 transition-all"
              >
                📞 Call
              </a>
            )}
            <a
              href={`https://wa.me/${whatsapp}?text=Hi%20${encodeURIComponent(user.name)}%2C%20I%20found%20you%20on%20Cre8%20Market`}
              target="_blank"
              rel="noreferrer"
              className="neu-pill bg-wa hover:bg-wa-dark text-white text-xs font-bold px-4 py-2.5 transition-all"
            >
              💬 WhatsApp
            </a>
            <Link
              href="/products"
              className="neu-pill bg-background text-primary text-xs font-bold px-4 py-2.5 transition-all"
            >
              Browse All
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {user.name.split(" ")[0]}&apos;s Listings
          </h2>
          <Link
            href="/sellers"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All Sellers
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="neu-card text-center py-12">
            <p className="text-4xl mb-3">📦</p>
            <h3 className="font-bold text-foreground mb-1">
              No products yet
            </h3>
            <p className="text-muted-foreground text-sm">
              {user.name} hasn&apos;t listed anything at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ScrollReveal key={p.id} delay={Math.min(i * 50, 300)}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
      </main>
      <Footer />
    </>
  );
}