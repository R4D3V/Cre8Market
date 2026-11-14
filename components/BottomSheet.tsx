"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { haptic } from "@/lib/haptics";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Pinned below the scrolling content (e.g. primary action buttons). */
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Mobile-style bottom sheet: slides up, dims the page, closes on backdrop tap,
 * Escape, or by dragging the handle down. Respects the home-indicator inset.
 */
export default function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; dy: number; active: boolean }>({ startY: 0, dy: 0, active: false });

  useEffect(() => {
    if (!open) return;
    haptic(8);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      // Keep keyboard focus inside the sheet while it is open.
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = { startY: e.clientY, dy: 0, active: true };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !sheetRef.current) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.dy = dy;
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  }

  function onPointerUp() {
    if (!drag.current.active || !sheetRef.current) return;
    drag.current.active = false;
    const el = sheetRef.current;
    if (drag.current.dy > 110) {
      onClose();
      return;
    }
    el.style.transition = "transform 0.2s ease-out";
    el.style.transform = "translateY(0)";
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[120] bg-black/55 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-[130] flex max-h-[85dvh] flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl outline-none animate-sheet-up"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Drag handle + title */}
        <div
          className="shrink-0 cursor-grab touch-none select-none px-5 pb-2 pt-3 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-extrabold text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Close"
              className="press -mr-2 grid size-11 place-items-center text-xl leading-none text-muted-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>

        {footer && <div className="shrink-0 border-t border-border px-5 py-3">{footer}</div>}
      </div>
    </>,
    document.body,
  );
}
