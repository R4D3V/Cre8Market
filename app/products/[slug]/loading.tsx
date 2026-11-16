import Navbar from "@/components/Navbar";

// Shown instantly on navigation while the server fetches the product, so
// tapping a card feels immediate instead of frozen.
export default function ProductLoading() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden border-b border-border/40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-8%] h-[460px] w-[460px] rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute -left-32 top-16 h-[340px] w-[340px] rounded-full bg-secondary/15 blur-[110px]" />
        </div>
        <div className="container relative py-10">
          <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mt-6 h-9 w-2/3 max-w-xl animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-1/2 max-w-md animate-pulse rounded-full bg-muted" />
        </div>
      </section>

      <main
        className="page-ambient container py-8 pb-28 sm:pb-16"
        aria-busy="true"
        aria-label="Loading product"
      >
        <div className="grid items-start gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <div className="aspect-[4/3] w-full animate-pulse rounded-3xl border border-border/70 bg-muted/60 sm:aspect-[16/11]" />
            <div className="h-40 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
            <div className="h-36 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
          </div>
        </div>
      </main>
    </>
  );
}
