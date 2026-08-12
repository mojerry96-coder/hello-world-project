/* Reusable chrome: page label, decision label, page marker, top rule,
   primary CTA, back navigation, shades and rules. Spec 4.3. */

import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { box, CHROME, type Box } from "../design/layout";
import { typeStyle } from "../design/type";

export function Shade({
  frame,
  background,
}: {
  frame: Box;
  background: string;
}) {
  return <div aria-hidden="true" style={box(frame, { background })} />;
}

export function Rule({
  frame,
  background = "var(--line-dark)",
}: {
  frame: Box;
  background?: string;
}) {
  return <div aria-hidden="true" style={box(frame, { background })} />;
}

export function PageLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={box(CHROME.pageLabel, {
        ...typeStyle("kicker", { color: "rgba(238,228,213,.72)" }),
        zIndex: 20,
      })}
    >
      {children}
    </p>
  );
}

export function DecisionLabel({
  decision,
  title,
}: {
  decision: string;
  title: string;
}) {
  return (
    <div style={box(CHROME.decisionLabel, { zIndex: 20 })}>
      <p style={typeStyle("kicker", { color: "var(--cream)" })}>{decision}</p>
      <p style={typeStyle("kicker", { color: "var(--cream)", marginTop: 4 })}>
        {title}
      </p>
    </div>
  );
}

export function PageMarker({ page }: { page: number }) {
  return (
    <p
      style={box(CHROME.pageMarker, {
        fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
        fontSize: 12,
        lineHeight: "14px",
        textAlign: "right",
        color: "rgba(238,228,213,.65)",
        zIndex: 20,
      })}
    >
      {String(page).padStart(2, "0")} / 15
    </p>
  );
}

export function TopRule() {
  return <Rule frame={{ ...CHROME.topRule, z: 20 }} />;
}

export function PrimaryCTA({
  frame,
  label,
  onClick,
  disabled = false,
  showArrow = true,
  style,
}: {
  frame: Box;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className="primary-cta focusable"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
      style={box(frame, {
        ...typeStyle("button"),
        ...style,
      })}
    >
      <span>{label}</span>
      {showArrow && <ArrowRight size={24} weight="thin" />}
    </button>
  );
}

/** Never rendered on Page 1. */
export function BackNav({
  onClick,
  label = "Back",
  frame = { x: 56, y: 872, w: 180, h: 32 },
}: {
  onClick: () => void;
  label?: string;
  frame?: Box;
}) {
  return (
    <button
      type="button"
      className="focusable"
      onClick={onClick}
      style={box(frame, {
        ...typeStyle("bodySmall", { color: "rgba(238,228,213,.72)" }),
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        zIndex: 20,
      })}
    >
      <ArrowLeft size={20} weight="thin" />
      <span>{label}</span>
    </button>
  );
}
