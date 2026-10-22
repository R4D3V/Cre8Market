"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 32, textAlign: "center", fontFamily: "system-ui" }}>
          <h1>Something went wrong</h1>
          <p style={{ color: "#64748b" }}>A critical error occurred.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "8px 16px" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}