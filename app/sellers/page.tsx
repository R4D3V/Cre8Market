import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import SellersDirectory from "@/components/sellers/SellersDirectory";
import { getPublicUsers } from "@/lib/db/queries";
import type { AppUser } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Sellers | CRE8MARKET",
  description:
    "Browse registered sellers on Cre8 Market in Entebbe and view everything they have listed.",
  alternates: {
    canonical: "/sellers",
  },
};

export const revalidate = 60;

function SellerCardSkeleton() {
  return (
    <div className="neu-card rounded-2xl p-5 text-center animate-pulse">
      <div className="mx-auto mb-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-muted" />
      </div>
      <div className="h-4 w-24 mx-auto rounded-full bg-muted mb-2" />
      <div className="h-3 w-16 mx-auto rounded-full bg-muted mb-1" />
      <div className="h-3 w-20 mx-auto rounded-full bg-muted" />
    </div>
  );
}

function SellersSkeleton() {
  return (
    <div className="container py-10" aria-busy="true">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SellerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

async function SellersContent() {
  let users: AppUser[] = [];
  try {
    users = await getPublicUsers();
  } catch (err) {
    console.error("DB unavailable on sellers page load:", (err as Error).message);
  }

  return <SellersDirectory users={users} />;
}

export default function SellersPage() {
  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Trusted community"
        title="Our Sellers"
        description="Browse the registered sellers on Cre8 Market. Tap a seller to view everything they have listed."
      />
      <Suspense fallback={<SellersSkeleton />}>
        <SellersContent />
      </Suspense>
      <Footer />
    </>
  );
}
