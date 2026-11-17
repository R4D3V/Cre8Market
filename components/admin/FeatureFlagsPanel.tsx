"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toggleFeatureFlagAction } from "@/lib/actions/admin";
import type { FeatureFlag } from "@/lib/db/queries";
import { AdminSection } from "./AdminSection";

export function FeatureFlagsPanel({ initialFlags }: { initialFlags: FeatureFlag[] }) {
  const [flags, setFlags] = useState(initialFlags);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const enabledCount = flags.filter((flag) => flag.enabled).length;

  async function handleToggle(flag: FeatureFlag) {
    setPendingKey(flag.key);
    setError("");
    try {
      const next = await toggleFeatureFlagAction(flag.key, !flag.enabled);
      setFlags(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the flag.");
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <AdminSection
      title="Feature flags"
      description="Turn marketplace features on or off without a deploy."
      action={
        <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {enabledCount}/{flags.length} on
        </span>
      }
      className="h-full"
    >
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      <ul className="space-y-2">
        {flags.map((flag) => {
          const busy = pendingKey === flag.key;
          return (
            <li
              key={flag.key}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/15 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                  {flag.label}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {flag.key}
                  </span>
                  {flag.custom && (
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                      custom
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{flag.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(flag)}
                disabled={pendingKey !== null}
                role="switch"
                aria-checked={flag.enabled}
                aria-label={`Toggle ${flag.label}`}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
                  flag.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
                    flag.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
                {busy && (
                  <span className="absolute inset-0 grid place-items-center">
                    <Loader2 className="size-3.5 animate-spin text-primary-foreground" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Changes are audit-logged. Environment overrides named{" "}
        <code className="rounded bg-muted px-1 py-0.5">FEATURE_*</code> take priority over these
        switches.
      </p>
    </AdminSection>
  );
}
