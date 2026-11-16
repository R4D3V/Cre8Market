import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalPageProps {
  eyebrow?: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LegalPage({
  eyebrow = "Legal",
  title,
  description,
  updated,
  sections,
}: LegalPageProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        backHref="/"
        backLabel="Back to home"
        eyebrow={eyebrow}
        title={title}
        description={description}
        size="large"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Last updated {updated}
        </span>
      </PageHero>

      <main className="page-ambient container py-10 pb-28 sm:py-14 sm:pb-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Content */}
          <article className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/8 blur-[90px]"
            />
            <div className="relative space-y-8">
              {sections.map((section) => (
                <section
                  key={section.title}
                  id={slugify(section.title)}
                  className="scroll-mt-28"
                >
                  <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
                On this page
              </p>
              <nav className="mt-3 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${slugify(section.title)}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-[60px]"
              />
              <div className="relative">
                <p className="text-sm font-bold text-foreground">Questions?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Reach our team and we&apos;ll help you out.
                </p>
                <div className="mt-4 space-y-2">
                  <a
                    href="mailto:raymonjohns@gmail.com"
                    className="flex items-center gap-2 text-xs font-semibold text-foreground transition hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    raymonjohns@gmail.com
                  </a>
                  <a
                    href="https://wa.me/256767155113"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-foreground transition hover:text-wa"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
