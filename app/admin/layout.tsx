"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { fetchMyAdminProfileAction } from "@/lib/actions/admin";

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/products") return "All Products";
  if (pathname === "/admin/products/new") return "Add Product";
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (pathname === "/admin/categories") return "Categories";
  if (pathname === "/admin/users") return "Users";
  if (pathname === "/admin/admins") return "Admins";
  if (pathname === "/admin/profile") return "My Profile";
  return "Admin";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [adminName, setAdminName] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/reset-password") return;
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // A signed-in regular user shouldn't be able to reach the admin panel.
      router.replace("/dashboard");
    }
  }, [status, session, router, pathname]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;
    fetchMyAdminProfileAction()
      .then((p) => {
        if (p) {
          setAdminName(p.name ?? "");
          setAdminAvatar(p.avatar ?? "");
        }
      })
      .catch(() => {});
  }, [status, session]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") return <>{children}</>;

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return null;
  }

  const name = adminName || session?.user?.name || "Admin";
  const email = session?.user?.email ?? "";
  const initial = (name || email || "A")[0]?.toUpperCase() ?? "A";
  const pageTitle = getPageTitle(pathname);
  const handleSignOut = () => signOut({ callbackUrl: "/admin/login" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <Link
              href="/admin"
              className="hidden items-center gap-2 font-heading text-sm font-extrabold tracking-wide sm:flex"
            >
              <Image
                src="/brand/logo.webp"
                alt="Cre8 Market"
                width={1080}
                height={1080}
                className="size-7 shrink-0 rounded-lg object-contain"
              />
              CRE8<span className="text-primary">MARKET</span>
            </Link>

            <span className="hidden h-5 w-px bg-border sm:block" />

            <h1 className="truncate font-heading text-sm font-extrabold sm:text-base">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              View site →
            </Link>

            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
              </span>
              <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
                {name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-4 p-4">
        {/* Desktop sidebar */}
        <div className="sticky top-[4.5rem] hidden h-[calc(100vh-5.5rem)] lg:block">
          <AdminSidebar
            backHref="/"
            userName={name}
            userEmail={email}
            userAvatar={adminAvatar}
            onSignOut={handleSignOut}
          />
        </div>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-background p-2 shadow-2xl">
              <div className="flex justify-end p-1">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="h-[calc(100%-3.25rem)]">
                <AdminSidebar
                  backHref="/"
                  userName={name}
                  userEmail={email}
                  userAvatar={adminAvatar}
                  onSignOut={handleSignOut}
                />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}