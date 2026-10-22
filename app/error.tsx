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
    <main className="container py-16 text-center">
      <h1 className="font-heading text-2xl font-extrabold text-foreground mb-2">
        Something went wrong
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm"
      >
        Try again
      </button>
    </main>
  );
}