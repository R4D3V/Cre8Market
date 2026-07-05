import Link from "next/link";
import { categories } from "@/lib/data";

export default function CategoryBar() {
  return (
    <div className="bg-surface px-3 sm:px-4 -mt-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          <Link
            href="/products"
            className="neu-pill bg-surface text-sm font-semibold text-navy px-4 py-2 whitespace-nowrap"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="neu-pill bg-surface flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy px-4 py-2 whitespace-nowrap"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
