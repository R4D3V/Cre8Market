"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";

// Buyer area — profile and chats. Sellers keep /dashboard, admins keep /admin.
export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  useEffect(() => {
    // Defer navigation so it can't interrupt an in-flight RSC stream.
    const timer = setTimeout(() => {
      if (status === "unauthenticated") {
        router.replace("/login");
      } else if (status === "authenticated" && role !== "buyer") {
        router.replace(role === "admin" ? "/admin" : "/dashboard");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [status, role, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && role !== "buyer")
  ) {
    return null;
  }

  return (
    <div className="page-ambient min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
