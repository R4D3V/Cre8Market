import { SearchX } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-ambient flex min-h-[70vh] items-center justify-center px-4 py-16 pb-28 sm:pb-16">
        <ScrollReveal className="text-center max-w-sm">
          <div className="rounded-2xl border border-border/70 bg-card/80 text-foreground inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 mx-auto">
            <SearchX className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold font-heading text-foreground mb-2 sm:text-5xl">
            404
          </h1>
          <p className="text-muted-foreground mb-2">Page not found</p>
          <p className="text-muted-foreground text-sm mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="rounded-full border border-border/70 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 text-sm transition-all inline-block"
          >
            Back to Home
          </Link>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
