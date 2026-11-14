"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Defer navigation so it can't interrupt an in-flight RSC stream.
    const timer = setTimeout(() => {
      if (status === "unauthenticated") {
        router.replace("/login");
      } else if (status === "authenticated" && session?.user?.role !== "user") {
        // Admins have their own panel — keep the two areas separate.
        router.replace("/admin");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [status, session, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.role !== "user")
  ) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
