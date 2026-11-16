"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    // Defer navigation so it can't interrupt an in-flight RSC stream.
    const timer = setTimeout(() => {
      if (status === "unauthenticated") {
        router.replace("/admin/login");
      } else if (status === "authenticated" && session?.user?.role !== "admin") {
        // A signed-in regular user shouldn't be able to reach the admin panel.
        router.replace("/dashboard");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [status, session, router, pathname]);

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return (
      <div className="page-ambient min-h-dvh bg-background text-foreground">
        <Navbar />
        {children}
        <Footer />
      </div>
    );
  }

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.role !== "admin")
  ) {
    return null;
  }

  return (
    <div className="page-ambient min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {pathname !== "/admin" && (
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-sm transition hover:border-primary/40 hover:text-foreground"
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
