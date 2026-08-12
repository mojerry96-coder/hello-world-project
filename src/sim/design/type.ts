/* Named type roles. Source: replication spec section 4.1, with the master
   production prompt's typography.

   DISPLAY is Afacad — narrow, high-contrast, and it holds up at the large sizes
   the headings use. TEXT is Manrope, which has a taller x-height than Inter and
   so stays readable at the small sizes this interface leans on.

   Sizes were raised across the board: the artboard is 1672px wide but is
   contain-scaled to whatever the screen allows, so a nominal 14px label was
   rendering nearer 11px on a laptop. Nothing here is smaller than 13px, and the
   body roles sit at 17-19px. */

import type { CSSProperties } from "react";

const DISPLAY = "Afacad";
const TEXT = "Manrope";
const FALLBACK = "system-ui, Helvetica, Arial, sans-serif";

export type TypeRole = {
  family: string;
  fallback?: string;
  weight: number;
  size: number;
  lineHeight: number;
  tracking: string;
  transform?: "uppercase";
  colour: string;
};

export const type = {
  displayXXL: {
    family: DISPLAY,
    fallback: FALLBACK,
    weight: 500,
    size: 78,
    lineHeight: 1.02,
    tracking: "-0.025em",
    colour: "var(--cream)",
  },
  displayXL: {
    family: DISPLAY,
    fallback: FALLBACK,
    weight: 500,
    size: 68,
    lineHeight: 1.04,
    tracking: "-0.02em",
    colour: "var(--cream)",
  },
  displayL: {
    family: DISPLAY,
    fallback: FALLBACK,
    weight: 500,
    size: 52,
    lineHeight: 1.06,
    tracking: "-0.018em",
    colour: "var(--cream)",
  },
  displayM: {
    family: DISPLAY,
    fallback: FALLBACK,
    weight: 500,
    size: 38,
    lineHeight: 1.1,
    tracking: "-0.012em",
    colour: "var(--cream)",
  },
  metric: {
    family: DISPLAY,
    fallback: FALLBACK,
    weight: 500,
    size: 80,
    lineHeight: 0.94,
    tracking: "-0.025em",
    colour: "var(--cream)",
  },
  kicker: {
    family: TEXT,
    fallback: FALLBACK,
    weight: 600,
    size: 13,
    lineHeight: 1.15,
    tracking: "0.14em",
    transform: "uppercase",
    colour: "var(--accent-active)",
  },
  body: {
    family: TEXT,
    fallback: FALLBACK,
    weight: 400,
    size: 19,
    lineHeight: 1.45,
    tracking: "0",
    colour: "var(--cream)",
  },
  bodySmall: {
    family: TEXT,
    fallback: FALLBACK,
    weight: 400,
    size: 16,
    lineHeight: 1.5,
    tracking: "0",
    colour: "rgba(238, 228, 213, 0.78)",
  },
  label: {
    family: TEXT,
    fallback: FALLBACK,
    weight: 600,
    size: 13,
    lineHeight: 1.2,
    tracking: "0.12em",
    transform: "uppercase",
    colour: "var(--accent-active)",
  },
  button: {
    family: TEXT,
    fallback: FALLBACK,
    weight: 600,
    size: 15,
    lineHeight: 1.0,
    tracking: "0.12em",
    transform: "uppercase",
    colour: "var(--white)",
  },
} as const satisfies Record<string, TypeRole>;

export type TypeRoleName = keyof typeof type;

/** Turn a named role into inline styles, with optional per-use overrides. */
export function typeStyle(
  role: TypeRoleName,
  overrides: CSSProperties = {},
): CSSProperties {
  const t = type[role] as TypeRole;
  return {
    fontFamily: t.fallback ? `${t.family}, ${t.fallback}` : t.family,
    fontWeight: t.weight,
    fontSize: t.size,
    lineHeight: t.lineHeight,
    letterSpacing: t.tracking,
    textTransform: t.transform,
    color: t.colour,
    margin: 0,
    ...overrides,
  };
}
