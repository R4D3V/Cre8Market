import Navbar from "@/components/Navbar";

// Shown instantly on navigation while the server fetches the product, so
// tapping a card feels immediate instead of frozen.
export default function ProductLoading() {
  return (
    <>
      <Navbar />
      <main className="container py-6 pb-28 sm:pb-8" aria-busy="true" aria-label="Loading product">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="neu-card aspect-square animate-pulse bg-muted" />
          <div className="flex flex-col gap-3">
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </main>
    </>
  );
}
