"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Menu, X, LogOut } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { fetchMyProfileAction } from "@/lib/actions/users";
import Navbar from "@/components/Navbar";

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") return "My Products";
  if (pathname === "/dashboard/products/new") return "Add Product";
  if (/^\/dashboard\/products\/[^/]+\/edit$/.test(pathname))
    return "Edit Product";
  if (pathname === "/dashboard/profile") return "My Profile";
  return "Dashboard";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user?.role !== "user") {
      // Admins have their own panel — keep the two areas separate.
      router.replace("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "user") return;
    fetchMyProfileAction()
      .then((p) => {
        setUserName(p.name ?? "");
        setUserAvatar(p.avatar ?? "");
      })
      .catch(() => {});
  }, [status, session]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (
    status === "loading" ||
    (status === "authenticated" && session?.user?.role !== "user")
  ) {
    return null;
  }
  if (status === "unauthenticated") return null;

  const name = userName || session?.user?.name || "Seller";
  const contact = session?.user?.phone ?? "";
  const pageTitle = getPageTitle(pathname);
  const handleSignOut = () => signOut().then(() => router.push("/login"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Project navbar */}
      <Navbar />

      {/* Dashboard sub-bar */}
      <header className="sticky top-[3.5rem] z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex h-12 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="truncate font-heading text-sm font-extrabold sm:text-base">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
              {name}
            </span>
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
          <DashboardSidebar
            userName={name}
            userContact={contact}
            userAvatar={userAvatar}
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
                <DashboardSidebar
                  userName={name}
                  userContact={contact}
                  userAvatar={userAvatar}
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
