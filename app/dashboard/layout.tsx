"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user?.role !== "user") {
      // Admins have their own panel — keep the two areas separate.
      router.replace("/admin");
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "user")) {
    return null;
  }
  if (status === "unauthenticated") return null;

  const linkClass = (active: boolean) =>
    `transition-colors ${
      active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background/80 backdrop-blur border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-extrabold text-sm tracking-wide text-foreground">
              🧑‍💼 My Dashboard
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                href="/dashboard"
                className={linkClass(pathname === "/dashboard")}
              >
                My Products
              </Link>
              <Link
                href="/dashboard/products/new"
                className={linkClass(pathname === "/dashboard/products/new")}
              >
                Add Product
              </Link>
              <Link
                href="/dashboard/profile"
                className={linkClass(pathname === "/dashboard/profile")}
              >
                My Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-muted-foreground text-xs">
              {session?.user?.name}
            </span>
            <Link href="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              View Site →
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden px-4 pb-3 flex gap-4 text-sm overflow-x-auto">
          <Link
            href="/dashboard"
            className={`whitespace-nowrap transition-colors ${linkClass(pathname === "/dashboard")}`}
          >
            My Products
          </Link>
          <Link
            href="/dashboard/products/new"
            className={`whitespace-nowrap transition-colors ${linkClass(pathname === "/dashboard/products/new")}`}
          >
            Add Product
          </Link>
          <Link
            href="/dashboard/profile"
            className={`whitespace-nowrap transition-colors ${linkClass(pathname === "/dashboard/profile")}`}
          >
            My Profile
          </Link>
        </div>
      </header>
      <main className="container py-6 pb-24 sm:pb-8">{children}</main>
    </div>
  );
}