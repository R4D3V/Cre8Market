"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  FolderTree,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import type { CategoryDB } from "@/lib/types";

const BENEFITS = [
  {
    icon: Zap,
    title: "Offer within 24hrs",
    description: "Fast evaluation from our Entebbe buying team.",
  },
  {
    icon: Wallet,
    title: "Instant cash payment",
    description: "Get paid on the spot once you accept.",
  },
  {
    icon: ShieldCheck,
    title: "No obligation",
    description: "Free evaluation with zero listing fees.",
  },
];

const STEPS = [
  {
    title: "Submit your item details",
    description:
      "Fill in the form with your item info, condition, and a short description.",
  },
  {
    title: "We review & respond",
    description:
      "Our team evaluates your item and sends a cash offer on WhatsApp within 24 hours.",
  },
  {
    title: "Get paid",
    description:
      "Accept the offer, bring your item to Kitoro, Entebbe, and receive instant cash.",
  },
];

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

export default function SellToUsPage() {
  const [name, setName] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<CategoryDB[]>([]);

  useEffect(() => {
    fetchCategoriesAction().then((data) => setCategories(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    const msg = encodeURIComponent(
      `Hi CRE8MARKET ENTEBBE! I'd like to sell:\n\n📦 Item: ${itemTitle}\n📂 Category: ${category}\n🏷️ Condition: ${condition}\n📝 Details: ${description}\n\nName: ${name}`,
    );
    window.open(`https://wa.me/256767155113?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setName("");
    setItemTitle("");
    setCategory("");
    setCondition("");
    setDescription("");
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        backHref="/"
        backLabel="Back to home"
        eyebrow="We buy & sell"
        eyebrowIcon={Sparkles}
        align="center"
        size="large"
        title={
          <>
            Got something to sell?{" "}
            <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              We&apos;ll turn it into cash.
            </span>
          </>
        }
        description="Send us your phone, TV, laptop, appliance, or anything else. We'll review it and send a cash offer on WhatsApp — usually within a day."
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/50 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3 bg-card/70 p-4 text-left backdrop-blur-sm transition hover:bg-card sm:p-5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-bold text-foreground">
                  {title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </PageHero>

      <main className="page-ambient container py-10 pb-28 sm:py-14 sm:pb-14">
        {submitted ? (
          <ScrollReveal className="mx-auto max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/80 p-8 text-center backdrop-blur-sm sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-[90px]"
              />
              <div className="relative">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                  Request received
                </p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  We&apos;re on it!
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your item details were sent to our team on WhatsApp. Expect a
                  cash offer within 24 hours. Have photos ready for a faster
                  quote.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Submit another item
                  </button>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    Browse the market
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                  Start your quote
                </p>
                <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Tell us about your item
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Takes about a minute. No account needed.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
              {/* Form */}
              <ScrollReveal delay={100} className="lg:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-[80px]"
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Item details
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Fields marked * are required
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="seller-name"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Your name *
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            id="seller-name"
                            required
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className={FIELD_CLASS}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="item-name"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Item name *
                        </label>
                        <div className="relative">
                          <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            id="item-name"
                            required
                            type="text"
                            value={itemTitle}
                            onChange={(e) => setItemTitle(e.target.value)}
                            placeholder="e.g. Samsung Galaxy S22, LG 43 inch TV"
                            className={FIELD_CLASS}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="item-category"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            Category
                          </label>
                          <div className="relative">
                            <FolderTree className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <select
                              id="item-category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className={`${FIELD_CLASS} appearance-none pr-9`}
                            >
                              <option value="">Select…</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.icon} {c.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="item-condition"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            Condition
                          </label>
                          <div className="relative">
                            <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <select
                              id="item-condition"
                              value={condition}
                              onChange={(e) => setCondition(e.target.value)}
                              className={`${FIELD_CLASS} appearance-none pr-9`}
                            >
                              <option value="">Select…</option>
                              {["New", "Used", "Refurbished"].map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="item-description"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Description / specs
                        </label>
                        <div className="relative">
                          <MessageCircle className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                          <textarea
                            id="item-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Storage, RAM, model number, accessories included, any defects…"
                            className={`${FIELD_CLASS} resize-none`}
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
                        <Camera className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        <p className="text-xs leading-relaxed text-secondary">
                          <strong className="font-bold">Tip:</strong> After
                          submitting, send clear photos of your item on WhatsApp
                          for a faster and more accurate offer.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-wa py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(37,211,102,0.9)] transition hover:bg-wa-dark disabled:opacity-60"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {loading ? "Sending…" : "Get a cash offer via WhatsApp"}
                      </button>

                      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3 w-3" />
                        Free evaluation · No obligation to sell
                      </p>
                    </div>
                  </div>
                </form>
              </ScrollReveal>

              {/* Sidebar */}
              <div className="space-y-5 lg:col-span-2">
                <ScrollReveal delay={150}>
                  <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                      Simple process
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-extrabold tracking-tight text-foreground">
                      How it works
                    </h3>

                    <ol className="mt-6 space-y-5">
                      {STEPS.map((step, index) => (
                        <li key={step.title} className="relative flex gap-4">
                          {index < STEPS.length - 1 && (
                            <span
                              aria-hidden="true"
                              className="absolute left-[15px] top-9 h-[calc(100%+0.5rem)] w-px bg-gradient-to-b from-primary/40 to-border/40"
                            />
                          )}
                          <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                          <div className="pt-0.5">
                            <p className="text-sm font-bold text-foreground">
                              {step.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-6 flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Average response time:{" "}
                        <span className="font-semibold text-foreground">
                          under 24 hours
                        </span>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="relative overflow-hidden rounded-3xl border border-wa/25 bg-wa/5 p-6">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-wa/15 blur-[60px]"
                    />
                    <div className="relative">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-wa/30 bg-wa/10 text-wa">
                        <MessageCircle className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-heading text-lg font-extrabold tracking-tight text-foreground">
                        Prefer to chat first?
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        Message our buying team directly and we&apos;ll walk you
                        through the offer.
                      </p>
                      <a
                        href="https://wa.me/256767155113?text=Hi%20CRE8MARKET%2C%20I%27d%20like%20to%20sell%20an%20item"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-white transition hover:bg-wa-dark"
                      >
                        Chat on WhatsApp
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={250}>
                  <div className="rounded-3xl border border-border/70 bg-card/80 p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <Banknote className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-bold text-foreground">
                        What we buy
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        "Phones",
                        "Laptops",
                        "TVs",
                        "Gaming",
                        "Appliances",
                        "Audio",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
