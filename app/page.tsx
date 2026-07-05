import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import HeroBanner from "@/components/HeroBanner";

import ListingsSection from "@/components/ListingsSection";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ScrollReveal from "@/components/ScrollReveal";
import { featuredProducts, latestProducts } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 sm:pb-8">
        {/* Featured listings */}
        <ScrollReveal>
          <div className="mb-10">
            <ListingsSection
              title="⭐ Featured"
              eyebrow="Hand-picked"
              products={featuredProducts}
              viewAllHref="/products?featured=1"
              viewAllLabel="View All Featured"
            />
          </div>
        </ScrollReveal>

        {/* Latest listings */}
        <ScrollReveal delay={100}>
          <div className="mb-10">
            <ListingsSection
              title="🕐 Latest"
              eyebrow="Fresh on the market"
              products={latestProducts}
              viewAllHref="/products?sort=latest"
              viewAllLabel="View All Latest"
            />
          </div>
        </ScrollReveal>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
