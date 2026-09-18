"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicUsersAction } from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function SellersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicUsersAction().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="container py-10 space-y-10">
      <ScrollReveal>
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground">
            Our Sellers
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse the registered sellers on Cre8 Market. Tap a seller to view
            everything they have listed.
          </p>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Loading…
        </div>
      ) : users.length === 0 ? (
        <ScrollReveal>
          <div className="neu-card text-center py-12">
            <p className="text-4xl mb-3">🛍️</p>
            <h3 className="font-bold text-foreground mb-1">
              No sellers yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Check back soon — sellers are registering every day.
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((u, i) => (
            <ScrollReveal key={u.id} delay={Math.min(i * 50, 300)}>
              <Link
                href={`/sellers/${u.id}`}
                className="group block neu-card neu-card-hover rounded-2xl p-5 text-center"
              >
                <div className="mx-auto mb-3 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl overflow-hidden shrink-0">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      u.name[0].toUpperCase()
                    )}
                  </div>
                  {u.isVerified && (
                    <span className="mt-1.5 inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                      <svg
                        className="w-3 h-3"
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
                      Verified
                    </span>
                  )}
                </div>
                <p className="font-bold text-foreground text-sm truncate">
                  {u.name}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {u.productCount ?? 0} product
                  {(u.productCount ?? 0) !== 1 && "s"}
                </p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Since{" "}
                  {new Date(u.createdAt).toLocaleDateString("en", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
      </main>
      <Footer />
    </>
  );
}