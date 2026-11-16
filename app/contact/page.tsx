"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

const CONTACT_METHODS = [
  {
    icon: MapPin,
    label: "Visit us",
    value: "Kitoro, Entebbe, Uganda",
    href: undefined,
  },
  {
    icon: Mail,
    label: "Email us",
    value: "raymonjohns@gmail.com",
    href: "mailto:raymonjohns@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+256 767 155 113",
    href: "https://wa.me/256767155113",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const msg = encodeURIComponent(
      `Hi CRE8MARKET ENTEBBE! I have a question:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    );
    window.open(`https://wa.me/256767155113?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        backHref="/"
        backLabel="Back to home"
        eyebrow="Get in touch"
        eyebrowIcon={Sparkles}
        align="center"
        size="large"
        title={
          <>
            Let&apos;s talk about{" "}
            <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              your next deal.
            </span>
          </>
        }
        description="Have a question, feedback, or need a hand? Send us a message and our Entebbe team will get back to you on WhatsApp."
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/50 sm:grid-cols-3">
          {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[13px] font-semibold leading-snug text-foreground sm:text-sm">
                    {value}
                  </span>
                </span>
              </>
            );

            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-3 bg-card/70 p-4 backdrop-blur-sm transition hover:bg-card sm:p-5"
              >
                {content}
              </a>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 bg-card/70 p-4 backdrop-blur-sm transition hover:bg-card sm:p-5"
              >
                {content}
              </div>
            );
          })}
        </div>
      </PageHero>

      <main className="page-ambient container py-10 pb-28 sm:py-14 sm:pb-14">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          {/* Sidebar */}
          <ScrollReveal className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                Contact details
              </p>
              <h2 className="mt-2 font-heading text-xl font-extrabold tracking-tight text-foreground">
                Reach us directly
              </h2>

              <ul className="mt-6 space-y-4">
                {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noreferrer" : undefined}
                          className="mt-0.5 block break-words text-sm font-semibold text-foreground transition hover:text-primary"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </span>
                <h2 className="font-heading text-base font-extrabold tracking-tight text-foreground">
                  Opening hours
                </h2>
              </div>
              <ul className="mt-4 divide-y divide-border/50 text-sm">
                {[
                  ["Mon – Fri", "8:00 AM – 6:00 PM"],
                  ["Saturday", "9:00 AM – 4:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <li key={day} className="flex items-center justify-between py-2.5">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="font-semibold text-foreground">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>

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
                  Prefer to chat?
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Skip the form and message our team directly on WhatsApp. We
                  usually reply within a few hours.
                </p>
                <a
                  href="https://wa.me/256767155113"
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

          {/* Form */}
          <ScrollReveal delay={100} className="lg:col-span-3">
            {submitted ? (
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
                    Message sent
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                    Thanks for reaching out!
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    We&apos;ll get back to you on WhatsApp shortly. For anything
                    urgent, message us directly and we&apos;ll jump on it.
                  </p>

                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Send another message
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
            ) : (
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
                      <MessageSquare className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">
                        Send us a message
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Fields marked * are required
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Your name *
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            id="contact-name"
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
                          htmlFor="contact-email"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            id="contact-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className={FIELD_CLASS}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        Subject *
                      </label>
                      <div className="relative">
                        <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="contact-subject"
                          required
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="What is this about?"
                          className={FIELD_CLASS}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <textarea
                          id="contact-message"
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us more about your enquiry…"
                          className={`${FIELD_CLASS} resize-none`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-wa py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(37,211,102,0.9)] transition hover:bg-wa-dark disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      {loading ? "Sending…" : "Send via WhatsApp"}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      We usually reply within a few hours during opening times.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
