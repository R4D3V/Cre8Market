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
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user?.role !== "user") {
      // Admins have their own panel — keep the two areas separate.
      router.replace("/admin");
    }
  }, [status, session, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.role !== "user")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
