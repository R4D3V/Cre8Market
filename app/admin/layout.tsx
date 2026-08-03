"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/reset-password") return;
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // A signed-in regular user shouldn't be able to reach the admin panel.
      router.replace("/dashboard");
    }
  }, [status, session, router, pathname]);

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") return <>{children}</>;

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-extrabold text-sm tracking-wide">
              ⚙ CRE8MARKET Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className={`transition-colors ${
                  pathname === "/admin"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className={`transition-colors ${
                  pathname === "/admin/products"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                All Products
              </Link>
              <Link
                href="/admin/products/new"
                className={`transition-colors ${
                  pathname === "/admin/products/new"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Add Product
              </Link>
              <Link
                href="/admin/categories"
                className={`transition-colors ${
                  pathname === "/admin/categories"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Categories
              </Link>
              <Link
                href="/admin/users"
                className={`transition-colors ${
                  pathname === "/admin/users"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Users
              </Link>
              <Link
                href="/admin/profile"
                className={`transition-colors ${
                  pathname === "/admin/profile"
                    ? "text-accent font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                My Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-white/50 hover:text-white text-xs transition-colors"
            >
              View Site →
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-white/50 hover:text-white text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden px-4 pb-3 flex gap-4 text-sm overflow-x-auto">
          <Link
            href="/admin"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin/products"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            All Products
          </Link>
          <Link
            href="/admin/products/new"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin/products/new"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            Add Product
          </Link>
          <Link
            href="/admin/categories"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin/categories"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            Categories
          </Link>
          <Link
            href="/admin/users"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin/users"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            Users
          </Link>
          <Link
            href="/admin/profile"
            className={`whitespace-nowrap transition-colors ${
              pathname === "/admin/profile"
                ? "text-accent font-semibold"
                : "text-white/70"
            }`}
          >
            My Profile
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        {children}
      </main>
    </div>
  );
}
