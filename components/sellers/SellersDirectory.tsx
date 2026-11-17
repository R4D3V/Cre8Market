"use client";

import { Search, SearchX, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { sellerPath } from "@/lib/seller-handle";
import type { AppUser } from "@/lib/types";

export default function SellersDirectory({ users }: { users: AppUser[] }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const filtered = useMemo(
    () => (term ? users.filter((u) => u.name.toLowerCase().includes(term)) : users),
    [users, term],
  );

  return (
    <main className="page-ambient container py-10 space-y-8">
      <ScrollReveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
              Directory
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} seller{filtered.length === 1 ? "" : "s"}
              {term ? " matching your search" : " on Cre8 Market"}
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sellers by name…"
              aria-label="Search sellers by name"
              className="w-full rounded-xl border border-border/70 bg-card/80 py-3 pl-10 pr-10 text-sm text-foreground outline-none backdrop-blur-sm transition placeholder:text-muted-foreground focus:border-primary/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {users.length === 0 ? (
        <ScrollReveal>
          <div className="rounded-3xl border border-border/70 bg-card/80 py-12 text-center">
            <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-foreground mb-1">No sellers yet</h3>
            <p className="text-muted-foreground text-sm">
              Check back soon — sellers are registering every day.
            </p>
          </div>
        </ScrollReveal>
      ) : filtered.length === 0 ? (
        <ScrollReveal>
          <div className="rounded-3xl border border-border/70 bg-card/80 py-12 text-center">
            <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <SearchX className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-foreground mb-1">No sellers found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              No seller matches “{query.trim()}”. Try another name.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full border border-border/70 bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Clear search
            </button>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((u, i) => (
            <ScrollReveal key={u.id} delay={Math.min(i * 50, 300)}>
              <Link
                href={sellerPath(u)}
                className="group block rounded-2xl border border-border/70 bg-card p-5 text-center transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)]"
              >
                <div className="mx-auto mb-3 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl overflow-hidden shrink-0">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
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
                <p className="font-bold text-foreground text-sm truncate">{u.name}</p>
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
  );
}
