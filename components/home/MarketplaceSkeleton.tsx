export default function MarketplaceSkeleton() {
  return (
    <div aria-busy="true" className="container pt-4 sm:pt-6">
      <div className="grid gap-3 lg:grid-cols-[236px_minmax(0,1fr)_236px] xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        <div className="hidden h-[360px] animate-pulse rounded-3xl border border-border/60 bg-card/50 lg:block" />
        <div className="h-[260px] animate-pulse rounded-3xl border border-border/60 bg-card/50 sm:h-[320px] lg:h-[360px]" />
        <div className="hidden grid-rows-2 gap-3 lg:grid">
          <div className="animate-pulse rounded-2xl border border-border/60 bg-card/50" />
          <div className="animate-pulse rounded-2xl border border-border/60 bg-card/50" />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-hidden lg:hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`chip-${index}`}
            className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-card/60"
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`benefit-${index}`} className="h-24 animate-pulse bg-card/70" />
        ))}
      </div>

      <div className="mt-8 h-[220px] animate-pulse rounded-3xl border border-border/60 bg-card/50" />

      <div className="mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={`category-${index}`}
            className="h-28 animate-pulse rounded-2xl border border-border/50 bg-card/40"
          />
        ))}
      </div>
    </div>
  );
}
