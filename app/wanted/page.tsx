import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { wantedPosts, formatPrice } from '@/lib/data'

export default function WantedPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Wanted Board</h1>
            <p className="text-gray-500 text-sm mt-0.5">Buyers looking for specific items — contact them if you have what they need</p>
          </div>
          <Link
            href="/wanted/post"
            className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-4 py-2.5 text-sm transition-all shrink-0 self-start sm:self-auto"
          >
            + Post Request
          </Link>
        </div>

        {/* Info banner */}
        <div className="neu-inset p-4 mb-6 flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-bold text-amber-800 mb-0.5">Got what they need?</p>
            <p className="text-sm text-amber-700">
              Contact buyers directly if you have items matching their requests. No listing required.
            </p>
          </div>
        </div>

        {/* Wanted posts */}
        <div className="space-y-3">
          {wantedPosts.map((post) => (
            <div
              key={post.id}
              className="neu-card p-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">
                  Wanted
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm break-words">{post.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{post.timeAgo}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-extrabold text-navy">
                  {post.priceMin && post.priceMax
                    ? `${formatPrice(post.priceMin)} – ${formatPrice(post.priceMax)}`
                    : post.priceMax
                    ? `Up to ${formatPrice(post.priceMax)}`
                    : post.exactPrice
                    ? formatPrice(post.exactPrice)
                    : 'Negotiable'}
                </p>
                {post.contact && (
                  <a
                    href={`https://wa.me/${post.contact}?text=${encodeURIComponent(`Hi, I have a ${post.title} for sale. Are you still looking?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-pill inline-flex items-center gap-1 mt-2 bg-wa text-white text-[10px] font-bold px-2.5 py-1 hover:bg-wa-dark transition-all"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    I have this!
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Post CTA */}
        <div className="mt-8 neu-dark-card p-7 text-white text-center">
          <h3 className="text-lg font-extrabold mb-1">Looking for something specific?</h3>
          <p className="text-white/60 text-sm mb-5">Post a wanted request and sellers will reach out to you directly.</p>
          <Link
            href="/wanted/post"
            className="neu-pill inline-block bg-accent hover:bg-accent-dark text-navy font-bold px-6 py-2.5 text-sm transition-all"
          >
            Post a Request — Free
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
