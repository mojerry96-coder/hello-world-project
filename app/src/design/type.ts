/* Named type roles. Source: replication spec section 4.1.
   A role carries family, weight, size, line height, tracking and default colour.

   Note: the master production prompt names Afacad/Manrope, but the exact-replication
   spec hard-codes Inter across all nine roles and the approved renders match it.
   The replication spec governs geometry and typography, so Inter it is. Swapping is
   a one-line change to FAMILY below. */

import type { CSSProperties } from "react";

const FAMILY = "Inter";
const FALLBACK = "Arial, sans-serif";

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
    family: FAMILY,
    fallback: FALLBACK,
    weight: 300,
    size: 72,
    lineHeight: 1.02,
    tracking: "-0.025em",
    colour: "var(--cream)",
  },
  displayXL: {
    family: FAMILY,
    fallback: FALLBACK,
    weight: 300,
    size: 64,
    lineHeight: 1.04,
    tracking: "-0.02em",
    colour: "var(--cream)",
  },
  displayL: {
    family: FAMILY,
    fallback: FALLBACK,
    weight: 300,
    size: 48,
    lineHeight: 1.06,
    tracking: "-0.018em",
    colour: "var(--cream)",
  },
  displayM: {
    family: FAMILY,
    fallback: FALLBACK,
    weight: 300,
    size: 34,
    lineHeight: 1.08,
    tracking: "-0.012em",
    colour: "var(--cream)",
  },
  metric: {
    family: FAMILY,
    fallback: FALLBACK,
    weight: 300,
    size: 76,
    lineHeight: 0.94,
    tracking: "-0.025em",
    colour: "var(--cream)",
  },
  kicker: {
    family: FAMILY,
    weight: 600,
    size: 14,
    lineHeight: 1.15,
    tracking: "0.14em",
    transform: "uppercase",
    colour: "var(--accent-active)",
  },
  body: {
    family: FAMILY,
    weight: 400,
    size: 18,
    lineHeight: 1.4,
    tracking: "0",
    colour: "var(--cream)",
  },
  bodySmall: {
    family: FAMILY,
    weight: 400,
    size: 14,
    lineHeight: 1.4,
    tracking: "0",
    colour: "rgba(238, 228, 213, 0.78)",
  },
  label: {
    family: FAMILY,
    weight: 600,
    size: 12,
    lineHeight: 1.2,
    tracking: "0.12em",
    transform: "uppercase",
    colour: "var(--accent-active)",
  },
  button: {
    family: FAMILY,
    weight: 600,
    size: 15,
    lineHeight: 1,
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
