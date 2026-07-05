import Link from 'next/link'
import { wantedPosts, formatPrice } from '@/lib/data'

export default function WantedBoard() {
  return (
    <section className="neu-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="eyebrow">Buyer Requests</p>
          <h2 className="text-xl font-extrabold text-gray-900">Wanted Board</h2>
        </div>
        <Link
          href="/wanted/post"
          className="neu-dark-pill bg-navy hover:bg-navy-hover text-white text-sm font-bold px-4 py-2 transition-all"
        >
          + Post a Request
        </Link>
      </div>

      <div className="space-y-2">
        {wantedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/wanted/${post.slug}`}
            className="neu-inset flex items-center justify-between py-3 px-3.5 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                Wanted
              </span>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-navy transition-colors line-clamp-1 min-w-0">
                {post.title}
              </span>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-xs font-bold text-navy">
                {post.priceMin && post.priceMax
                  ? `${formatPrice(post.priceMin)} – ${formatPrice(post.priceMax)}`
                  : post.priceMax
                  ? `Up to ${formatPrice(post.priceMax)}`
                  : post.exactPrice
                  ? formatPrice(post.exactPrice)
                  : 'Negotiable'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{post.timeAgo}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <Link
          href="/wanted"
          className="text-navy text-sm font-semibold hover:underline"
        >
          View all wanted posts →
        </Link>
      </div>
    </section>
  )
}
