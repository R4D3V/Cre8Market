"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="press inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      aria-label="Copy to clipboard"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}