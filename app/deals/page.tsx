import Navbar from '@/components/Navbar'
import CategoryBar from '@/components/CategoryBar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { allProducts } from '@/lib/data'

export default function DealsPage() {
  // Show all products as "deals" - in a real app these would be flagged
  const deals = allProducts.slice(0, 20)

  return (
    <>
      <Navbar />
      <CategoryBar />

      {/* Banner */}
      <div className="bg-surface px-3 sm:px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="neu-dark-card text-white py-10 px-6 text-center">
            <p className="eyebrow text-accent">Updated Daily</p>
            <h1 className="text-3xl font-extrabold mb-2">🔥 Hot Deals</h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              The best prices on electronics, phones, laptops and more in Uganda — refreshed every day.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Today's Deals</h2>
            <p className="text-sm text-gray-500 mt-0.5">{deals.length} deals available</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-featured animate-pulse" />
            <span className="text-xs font-semibold text-featured">Live · Updates daily</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-10 neu-card p-7 text-center">
          <p className="text-2xl mb-2">📲</p>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">Never miss a deal</h3>
          <p className="text-gray-500 text-sm mb-5">Get instant alerts for deals matching your interests</p>
          <a
            href="https://wa.me/256700511678?text=Hi+I+want+to+subscribe+for+deal+alerts"
            target="_blank"
            rel="noreferrer"
            className="neu-pill inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-bold px-6 py-3 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Get Deals on WhatsApp
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
