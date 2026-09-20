"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function ProductDetailPageClient({
  initialProduct,
  initialRelated,
}: {
  initialProduct: Product;
  initialRelated: Product[];
}) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [related, setRelated] = useState<Product[]>(initialRelated);
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setProduct(initialProduct);
    setRelated(initialRelated);
  }, [initialProduct, initialRelated]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const icon = product.categoryIcon ?? "📦";
  const color = product.categoryColor ?? "#64748b";
  const bg = product.categoryBg ?? "#f8fafc";
  const sellerName = product.ownerName ?? product.seller?.name;
  const isVerified = product.user_id ? !!product.ownerVerified : true;
  const sellerWhatsapp =
    product.ownerWhatsapp ?? product.seller?.whatsapp ?? "256751621506";
  const waContactUrl = `https://wa.me/${sellerWhatsapp}?text=${encodeURIComponent(`Hey, I would like to purchase this product.\n\n${shareUrl}`)}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendOffer(e: React.FormEvent) {
    e.preventDefault();
    const url = shareUrl || window.location.href;
    const text = encodeURIComponent(
      `Hi, I'd like to make an offer of UGX ${Number(offerAmount).toLocaleString()} for: ${product.title}.${offerMessage ? ` ${offerMessage}` : ""}\n\n${url}`,
    );
    window.open(`https://wa.me/${sellerWhatsapp}?text=${text}`, "_blank");
    setOfferSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="container py-6 pb-28 sm:pb-8">
        <ScrollReveal>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold mb-5 hover:underline"
          >
            ← Back to Listings
          </Link>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-3">
              <div
                className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: bg, minHeight: 320 }}
              >
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-contain max-h-96"
                  />
                ) : (
                  <span className="text-9xl opacity-50">{icon}</span>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        i === selectedImage
                          ? "border-primary opacity-100"
                          : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span
                className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                {product.category}
              </span>
            </div>

            <div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground leading-tight mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.condition && (
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.condition}
                  </span>
                )}
                <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2 py-1 rounded-full">
                  Available
                </span>
              </div>
            </div>

            {product.description && (
              <div className="neu-card p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div className="neu-card p-4">
                <p className="eyebrow mb-4">SPECS</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {product.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {s.label}
                      </dt>
                      <dd className="text-base font-semibold text-foreground mt-0.5">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="neu-card p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Listed", value: product.timeAgo },
                  { label: "Category", value: product.category },
                  {
                    label: "Seller",
                    value: sellerName ?? "Private Seller",
                  },
                  { label: "Location", value: product.location ?? "Entebbe" },
                  ...(product.condition
                    ? [{ label: "Condition", value: product.condition }]
                    : []),
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      {m.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="neu-card p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
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
                  className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  {copied ? "✅ Copied!" : "🔗 Copy Link"}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
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
                className="neu-pill w-full border-2 border-primary text-primary font-bold py-3 text-sm hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Make an Offer
              </button>

              {offerOpen && !offerSent && (
                <form onSubmit={handleSendOffer} className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Your offer (UGX)
                    </label>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={`e.g. ${Math.round(product.price * 0.85).toLocaleString()}`}
                      className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Any details about your offer…"
                      rows={2}
                      className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="neu-pill w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 text-sm transition-all"
                  >
                    📤 Send Offer via WhatsApp
                  </button>
                </form>
              )}
              {offerSent && (
                <p className="mt-3 text-center text-sm text-primary font-semibold">
                  ✅ Offer sent on WhatsApp!
                </p>
              )}
            </div>

            <div className="neu-card p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                About the Seller
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 overflow-hidden">
                  {product.ownerAvatar ? (
                    <img
                      src={product.ownerAvatar}
                      alt={sellerName ?? "Seller"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (sellerName ?? "S")[0].toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm flex items-center gap-1">
                    {sellerName ?? "Private Seller"}
                    {isVerified && (
                      <svg
                        className="w-4 h-4 text-secondary shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Verified"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </p>
                  {isVerified && (
                    <span className="inline-block bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                      ✓ Verified Seller
                    </span>
                  )}
                  {product.user_id && !isVerified && (
                    <span className="inline-block bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                      ○ Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-secondary/10 border border-secondary/40 rounded-2xl p-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-2">
                🛡️ Safety Tips
              </p>
              <ul className="text-xs text-secondary space-y-1">
                <li>• Meet seller in a safe, public location</li>
                <li>• Inspect the item before paying</li>
                <li>• Never send money in advance</li>
                <li>• Report suspicious listings</li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {related.length > 0 && (
          <ScrollReveal className="mt-10">
            <h2 className="font-heading text-xl font-extrabold text-foreground mb-4">
              Similar Listings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={`${p.id}-${p.slug}`} product={p} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </main>
      <Footer />
    </>
  );
}
