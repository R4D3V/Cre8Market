"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Flame,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { startChatAction } from "@/lib/actions/chats";
import { fetchProductBySlugAction, fetchRelatedProductsAction } from "@/lib/actions/products";
import { useSession } from "@/lib/auth-client";
import { sellerHandle } from "@/lib/seller-handle";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return `UGX ${price.toLocaleString("en-UG")}`;
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </p>
        <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function ProductDetailPageClient({
  initialProduct,
  initialRelated,
  slug,
  backHref = "/products",
  backLabel = "Back to Listings",
}: {
  initialProduct?: Product | null;
  initialRelated?: Product[];
  slug?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null);
  const [related, setRelated] = useState<Product[]>(initialRelated ?? []);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  // In-app inquiry: any signed-in party (buyer, seller or admin) can message
  // the listing owner from here.
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgBody, setMsgBody] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgError, setMsgError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const myRole = session?.user?.role;

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setRelated(initialRelated ?? []);
      setLoading(false);
      return;
    }
    if (!slug) return;
    let active = true;
    setLoading(true);
    fetchProductBySlugAction(slug)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setLoading(false);
        if (p) {
          fetchRelatedProductsAction(p).then((r) => {
            if (active) setRelated(r ?? []);
          });
        }
      })
      .catch(() => {
        if (active) {
          setProduct(null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [initialProduct, initialRelated, slug]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="container relative py-10">
            <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
            <div className="mt-6 h-9 w-2/3 max-w-xl animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-4 w-1/2 max-w-md animate-pulse rounded-full bg-muted" />
          </div>
        </section>
        <main
          className="page-ambient container py-8 pb-28 sm:pb-16"
          aria-busy="true"
          aria-label="Loading listing"
        >
          <div className="grid items-start gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <div className="aspect-[4/3] w-full animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
              <div className="h-40 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div className="h-64 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
              <div className="h-36 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="page-ambient container py-16 pb-28 sm:pb-16">
          <div className="mx-auto max-w-md rounded-3xl border border-border/70 bg-card/80 p-8 text-center backdrop-blur-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Listing not found
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This listing may have been sold or removed. Browse the marketplace for something
              similar.
            </p>
            <Link
              href={backHref}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const bg = product.categoryBg ?? "#0a2238";
  const sellerName = product.ownerName ?? product.seller?.name;
  const sellerHref = product.user_id
    ? `/sellers/${product.ownerHandle ?? (sellerName ? sellerHandle(sellerName) : product.user_id)}`
    : null;
  const SellerWrapper = (sellerHref ? Link : "div") as React.ElementType;
  const isVerified = product.user_id ? !!product.ownerVerified : true;
  const sellerWhatsapp = product.ownerWhatsapp ?? product.seller?.whatsapp ?? "256751621506";
  const sellerPhone = product.ownerPhone ?? product.seller?.phone ?? sellerWhatsapp;
  const waContactUrl = `https://wa.me/${sellerWhatsapp}?text=${encodeURIComponent(
    `Hey, I would like to purchase this product.\n\n${shareUrl}`,
  )}`;
  const images = product.images ?? [];

  function handleCopyLink() {
    const url = shareUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    const url = shareUrl || window.location.href;
    const text = encodeURIComponent(
      `Hi, I'd like to make an offer of UGX ${Number(offerAmount).toLocaleString()} for: ${product.title}.${offerMessage ? ` ${offerMessage}` : ""}\n\n${url}`,
    );
    window.open(`https://wa.me/${sellerWhatsapp}?text=${text}`, "_blank");
    setOfferSent(true);
  }

  const productSlug = product.slug ?? slug;
  // Nobody can message themselves: a seller on their own listing, or an admin
  // on an admin-owned store listing, has no counterparty.
  const isOwnListing =
    !!session?.user?.id && !!product.user_id && product.user_id === session.user.id;
  const isStoreListingOwnedByAdmin = !product.user_id && myRole === "admin";
  const canMessageSeller = !isOwnListing && !isStoreListingOwnedByAdmin;

  function handleMessageSellerClick() {
    if (sessionStatus === "loading") return;
    if (!session?.user) {
      router.push(`/login?next=/products/${productSlug}`);
      return;
    }
    if (!canMessageSeller) return;
    setMsgOpen((open) => !open);
    setMsgError("");
  }

  async function handleStartChat(e: React.FormEvent) {
    e.preventDefault();
    const body = msgBody.trim();
    if (!product || !body || msgSending) return;
    setMsgSending(true);
    setMsgError("");
    try {
      const { conversationId } = await startChatAction({ productId: product.id, message: body });
      setMsgBody("");
      const inbox =
        myRole === "admin"
          ? "/admin/chats"
          : myRole === "buyer"
            ? "/buyer/chats"
            : "/dashboard/chats";
      router.push(`${inbox}?c=${conversationId}`);
    } catch (err: unknown) {
      setMsgError(err instanceof Error ? err.message : "Could not start that conversation");
    } finally {
      setMsgSending(false);
    }
  }

  return (
    <>
      <Navbar />

      {/* Product hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-8%] h-[460px] w-[460px] rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute -left-32 top-16 h-[340px] w-[340px] rounded-full bg-secondary/15 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative py-8 sm:py-10">
          <ScrollReveal>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  {product.isDeal && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                      <Flame className="h-3 w-3" />
                      Hot deal
                    </span>
                  )}
                </div>

                <h1 className="mt-4 font-heading text-2xl font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
                  {product.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {product.location ?? "Entebbe"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {product.timeAgo ?? "Recently listed"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    Available now
                  </span>
                </div>
              </div>

              <div className="shrink-0 lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Asking price
                </p>
                <p className="mt-1 bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text font-heading text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {formatPrice(product.price)}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5 lg:justify-end">
                  {product.condition && (
                    <span className="rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                      {product.condition}
                    </span>
                  )}
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main className="page-ambient container py-8 pb-28 sm:py-10 sm:pb-16">
        <div className="grid items-start gap-6 lg:grid-cols-5">
          {/* Left column — media & details */}
          <div className="min-w-0 space-y-4 lg:col-span-3">
            <ScrollReveal>
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm">
                <div
                  className="relative aspect-[4/3] w-full"
                  style={{ backgroundColor: bg }}
                >
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : product.categoryIcon ? (
                    <span className="grid h-full w-full place-items-center text-8xl opacity-60">
                      {product.categoryIcon}
                    </span>
                  ) : (
                    <span className="grid h-full w-full place-items-center text-primary/50">
                      <Package className="h-24 w-24" aria-hidden="true" />
                    </span>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() =>
                          setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1))
                        }
                        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() =>
                          setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1))
                        }
                        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                        {selectedImage + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-border/60 bg-card/60 p-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(i)}
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === selectedImage}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          i === selectedImage
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {product.video && (
              <ScrollReveal delay={60}>
                <div className="overflow-hidden rounded-3xl border border-border/70 bg-black">
                  <video
                    src={product.video}
                    controls
                    playsInline
                    className="max-h-[26rem] w-full"
                  />
                </div>
              </ScrollReveal>
            )}

            {product.description && (
              <ScrollReveal delay={80}>
                <section className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
                  <SectionHeading icon={FileText} eyebrow="Overview" title="About this listing" />
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </section>
              </ScrollReveal>
            )}

            {product.specs && product.specs.length > 0 && (
              <ScrollReveal delay={100}>
                <section className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
                  <SectionHeading icon={Sparkles} eyebrow="Details" title="Specifications" />
                  <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {product.specs.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                      >
                        <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-foreground">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </ScrollReveal>
            )}

            <ScrollReveal delay={120}>
              <section className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
                <SectionHeading icon={Tag} eyebrow="At a glance" title="Listing details" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Listed",
                      value: product.createdAt
                        ? new Date(product.createdAt).toLocaleString("en", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : product.timeAgo,
                    },
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
                    <div
                      key={m.label}
                      className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {m.label === "Seller" && sellerHref ? (
                          <Link
                            href={sellerHref}
                            className="text-primary transition hover:underline"
                          >
                            {m.value}
                          </Link>
                        ) : (
                          m.value
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <section className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
                <SectionHeading icon={Share2} eyebrow="Share" title="Spread the word" />
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Check out: ${product.title} - ${formatPrice(product.price)} on CRE8MARKET ENTEBBE ${shareUrl}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-xs font-bold text-white transition hover:bg-wa-dark"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Link copied!" : "Copy link"}
                  </button>
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* Right column — actions, seller, safety */}
          <div className="space-y-4 lg:col-span-2 lg:sticky lg:top-24">
            <ScrollReveal delay={60}>
              <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/12 via-card/80 to-card/80 p-5 backdrop-blur-sm sm:p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-[80px]"
                />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                    Interested?
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-extrabold tracking-tight text-foreground">
                    Contact the seller
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Deal directly on WhatsApp — no middleman, no commission.
                  </p>

                  <a
                    href={waContactUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wa py-3.5 text-sm font-bold text-white transition hover:bg-wa-dark"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp seller
                  </a>

                  {canMessageSeller ? (
                    <button
                      type="button"
                      onClick={handleMessageSellerClick}
                      className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                      Message Seller
                    </button>
                  ) : (
                    <p className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-muted/30 py-3.5 text-sm font-bold text-muted-foreground">
                      <Package className="h-4 w-4" />
                      {isOwnListing ? "This is your listing" : "CRE8MARKET store listing"}
                    </p>
                  )}
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    {isOwnListing
                      ? "Buyers and other sellers can message you about this listing from here."
                      : myRole === "buyer"
                        ? "Chat in the app — messages clear themselves after 3 days."
                        : session?.user
                          ? "Message this seller directly. Replies land in your Chats inbox."
                          : "Sign in to chat with this seller in the app."}
                  </p>

                  {msgOpen && canMessageSeller && (
                    <form onSubmit={handleStartChat} className="mt-3 space-y-2.5">
                      <textarea
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                        rows={4}
                        maxLength={2000}
                        required
                        placeholder="Hi, is this still available? I'd like to know more…"
                        aria-label="Message to the seller"
                        className="w-full resize-none rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                      />
                      {msgError && (
                        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                          {msgError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMsgOpen(false)}
                          className="flex-1 rounded-full border border-border/70 bg-card/60 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={msgSending || !msgBody.trim()}
                          className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                        >
                          {msgSending ? "Sending…" : "Send message"}
                        </button>
                      </div>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={() => setOfferOpen(!offerOpen)}
                    className="mt-2.5 w-full rounded-full border border-primary/40 bg-primary/10 py-3 text-sm font-bold text-primary transition hover:bg-primary/15"
                  >
                    Make an offer
                  </button>

                  {sellerPhone && (
                    <a
                      href={`tel:${sellerPhone.replace(/\D/g, "")}`}
                      className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-card/60 py-3 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      Call seller
                    </a>
                  )}

                  {offerOpen && !offerSent && (
                    <form onSubmit={handleSendOffer} className="mt-5 space-y-3">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Your offer (UGX)
                        </label>
                        <input
                          type="number"
                          required
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          placeholder={`e.g. ${Math.round(product.price * 0.85).toLocaleString()}`}
                          className="w-full rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Message (optional)
                        </label>
                        <textarea
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          placeholder="Any details about your offer…"
                          rows={2}
                          className="w-full resize-none rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Send offer via WhatsApp
                      </button>
                    </form>
                  )}

                  {offerSent && (
                    <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-primary/10 px-3 py-2.5 text-center text-xs font-semibold text-primary">
                      <Check className="h-4 w-4" />
                      Offer sent on WhatsApp!
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <SellerWrapper
                href={sellerHref ?? undefined}
                data-testid="seller-link"
                className={`block rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm transition ${
                  sellerHref ? "group hover:border-primary/40" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                    About the seller
                  </p>
                  {sellerHref && (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {product.ownerAvatar ? (
                      <img
                        src={product.ownerAvatar}
                        alt={sellerName ?? "Seller"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (sellerName ?? "S")[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <span className="truncate">{sellerName ?? "Private Seller"}</span>
                      {isVerified && (
                        <BadgeCheck
                          className="h-4 w-4 shrink-0 text-secondary"
                          aria-label="Verified"
                        />
                      )}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {product.ownerVip && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          <Star className="h-3 w-3 fill-current" />
                          VIP seller
                        </span>
                      )}
                      {isVerified ? (
                        <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                          Verified seller
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          Not verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {sellerHref && (
                  <p className="mt-4 text-xs font-semibold text-primary transition group-hover:underline">
                    View all listings from this seller
                  </p>
                )}
              </SellerWrapper>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="rounded-3xl border border-secondary/35 bg-secondary/5 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/90">
                      Stay safe
                    </p>
                    <h2 className="font-heading text-base font-extrabold tracking-tight text-foreground">
                      Safety tips
                    </h2>
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Meet the seller in a safe, public location",
                    "Inspect the item before paying",
                    "Never send money in advance",
                    "Report suspicious listings",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {related.length > 0 && (
          <ScrollReveal className="mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                  Keep exploring
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Similar listings
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-primary"
              >
                Browse all listings
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
