"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-ambient container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="max-w-md rounded-3xl border border-border/70 bg-card/80 px-8 py-10 backdrop-blur-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
          Unexpected error
        </p>
        <h1 className="mb-2 mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}