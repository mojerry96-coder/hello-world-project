/* RevealOverlay — cinematic centred reveal over a blurred stage.
   Built in-house with simulation tokens (no external registry). The scrim
   covers the full 1672x941 artboard and blurs everything behind it; the card
   plays a short sweep-then-stage beat so information arrives, rather than
   simply appearing. */

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { ARTBOARD } from "../design/layout";
import { typeStyle } from "../design/type";

export function RevealOverlay({
  open,
  onClose,
  label,
  width = 640,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  width?: number;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      // Single focusable control: keep focus inside the dialog.
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="reveal-scrim"
      style={{ width: ARTBOARD.width, height: ARTBOARD.height }}
      onClick={onClose}
    >
      <div
        className="reveal-card"
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true" className="reveal-sweep" />
        <button
          ref={closeRef}
          type="button"
          className="focusable reveal-close"
          onClick={onClose}
          aria-label="Close field report"
        >
          <X size={18} weight="thin" color="var(--cream)" />
        </button>
        <div className="reveal-body" style={typeStyle("bodySmall")}>
          {children}
        </div>
      </div>
    </div>
  );
}
