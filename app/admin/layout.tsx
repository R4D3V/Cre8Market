"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/reset-password")
      return;
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // A signed-in regular user shouldn't be able to reach the admin panel.
      router.replace("/dashboard");
    }
  }, [status, session, router, pathname]);

  if (pathname === "/admin/login" || pathname === "/admin/reset-password")
    return <>{children}</>;

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.role !== "admin")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        {pathname !== "/admin" && (
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        )}
        {children}
      </main>
    </div>
  );
}
