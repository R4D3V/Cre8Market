"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  allProducts,
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
  getCategoryIcon,
  getCategoryColor,
  getCategoryBg,
} from "@/lib/data";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) return notFound();

  const related = getRelatedProducts(product, 4);
  const icon = getCategoryIcon(product.categorySlug);
  const color = getCategoryColor(product.categorySlug);
  const bg = getCategoryBg(product.categorySlug);
  const waContactUrl = `https://wa.me/${product.seller?.whatsapp ?? "256751621506"}?text=${encodeURIComponent(`I want to BUY: ${product.title}. – ${formatPrice(product.price)}.`)}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    const text = encodeURIComponent(
      `Hi, I'd like to make an offer of UGX ${Number(offerAmount).toLocaleString()} for: ${product.title}. ${offerMessage}`,
    );
    window.open(
      `https://wa.me/${product.seller?.whatsapp ?? "256751621506"}?text=${text}`,
      "_blank",
    );
    setOfferSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28 sm:pb-8">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-navy font-semibold mb-5 hover:underline"
        >
          ← Back to Listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left - Image + Info */}
          <div className="md:col-span-3 space-y-4">
            {/* Image */}
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: bg, minHeight: 280 }}
            >
              <span className="text-9xl opacity-50">{icon}</span>
            </div>

            {/* Category badge */}
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                {product.category}
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-extrabold text-navy">
                  {formatPrice(product.price)}
                </span>
                {product.condition && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.condition}
                  </span>
                )}
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  Available
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="neu-card p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* specs */}
            <div className="neu-card p-4">
              <div className="grid grid-cols-2 gap-3">
                {" "}
                {product.specs && product.specs.length > 0 && (
                  <div className="neu-inset p-5">
                    <p className="eyebrow mb-4">SPECS</p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {product.specs.map((s) => (
                        <div key={s.label}>
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                            {s.label}
                          </dt>
                          <dd className="mt-0.5 text-sm text-ink">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="neu-card p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Listed", value: product.timeAgo },
                  { label: "Category", value: product.category },
                  {
                    label: "Seller",
                    value: product.seller?.name ?? "Private Seller",
                  },
                  { label: "Location", value: product.location ?? "Uganda" },
                  ...(product.condition
                    ? [{ label: "Condition", value: product.condition }]
                    : []),
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {m.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="neu-card p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Share this listing
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out: ${product.title} - ${formatPrice(product.price)} on CRE8MARKET ENTEBBE ${shareUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="neu-pill flex items-center gap-1.5 bg-wa text-white text-xs font-bold px-3 py-1.5 hover:bg-wa-dark transition-all"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? "✅ Copied!" : "🔗 Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="md:col-span-2 space-y-4">
            {/* Contact Seller */}
            <div className="neu-card p-5">
              <a
                href={waContactUrl}
                target="_blank"
                rel="noreferrer"
                className="neu-pill w-full flex items-center justify-center gap-2 bg-wa hover:bg-wa-dark text-white font-bold py-3.5 text-base transition-all mb-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact Seller
              </a>
              <button
                onClick={() => setOfferOpen(!offerOpen)}
                className="neu-pill w-full border-2 border-navy text-navy font-bold py-3 text-sm hover:bg-navy hover:text-white transition-all"
              >
                Make an Offer
              </button>

              {/* Offer form */}
              {offerOpen && !offerSent && (
                <form onSubmit={handleSendOffer} className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Your offer (UGX)
                    </label>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={`e.g. ${Math.round(product.price * 0.85).toLocaleString()}`}
                      className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Any details about your offer…"
                      rows={2}
                      className="neu-inset w-full px-3 py-2 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="neu-pill w-full bg-accent hover:bg-accent-dark text-navy font-bold py-2.5 text-sm transition-all"
                  >
                    📤 Send Offer via WhatsApp
                  </button>
                </form>
              )}
              {offerSent && (
                <p className="mt-3 text-center text-sm text-green-600 font-semibold">
                  ✅ Offer sent on WhatsApp!
                </p>
              )}
            </div>

            {/* Seller info */}
            <div className="neu-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                About the Seller
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {(product.seller?.name ?? "S")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {product.seller?.name ?? "Private Seller"}
                  </p>
                  {product.seller?.memberSince && (
                    <p className="text-gray-400 text-xs">
                      Member since {product.seller.memberSince}
                    </p>
                  )}
                  {product.seller?.verified && (
                    <span className="inline-block bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                      ✓ Verified Seller
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                🛡️ Safety Tips
              </p>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• Meet seller in a safe, public location</li>
                <li>• Inspect the item before paying</li>
                <li>• Never send money in advance</li>
                <li>• Report suspicious listings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              Similar Listings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
