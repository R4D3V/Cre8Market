"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { useInstall } from "@/hooks/useInstall";
import { haptic } from "@/lib/haptics";

// One-tap install for the /install page, wherever the browser allows it.
export default function InstallAppButton() {
  const { canInstall, installed, promptInstall } = useInstall();
  const [declined, setDeclined] = useState(false);

  if (installed) {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <Check className="size-4" aria-hidden="true" /> App installed
      </p>
    );
  }
  if (!canInstall) return null;

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          haptic(10);
          setDeclined((await promptInstall()) === "dismissed");
        }}
        className="press inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"
      >
        <Download className="size-4" aria-hidden="true" />
        Install app
      </button>
      {declined && (
        <p className="mt-2 text-xs text-muted-foreground">
          No problem — you can still follow the steps below any time.
        </p>
      )}
    </div>
  );
}
