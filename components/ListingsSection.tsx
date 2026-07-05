import Link from 'next/link'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

interface Props {
  title: string
  eyebrow?: string
  products: Product[]
  viewAllHref: string
  viewAllLabel?: string
}

export default function ListingsSection({ title, eyebrow, products, viewAllHref, viewAllLabel = 'View All' }: Props) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="neu-pill bg-surface text-navy text-sm font-semibold px-4 py-2 whitespace-nowrap shrink-0"
        >
          {viewAllLabel} →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
