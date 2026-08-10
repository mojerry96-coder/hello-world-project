/* Coordinate and layer contract. Source: replication spec section 4.2.
   All page coordinates are pixels on a 1672 x 941 artboard, origin top-left. */

import type { CSSProperties } from "react";
import type { TypeRoleName } from "./type";

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
};

export type UIElement = Box & {
  id: string;
  kind:
    | "media"
    | "shade"
    | "text"
    | "rule"
    | "button"
    | "option"
    | "hotspot"
    | "slider"
    | "input"
    | "metric"
    | "timeline";
  typeRole?: TypeRoleName;
  colour?: string;
  background?: string;
  border?: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  lineHeight?: number;
};

export const ARTBOARD = { width: 1672, height: 941 };
export const SAFE = { left: 56, right: 56, top: 32, bottom: 32 };
export const TOP_RAIL: Box = { x: 0, y: 0, w: 1672, h: 64, z: 20 };
export const PAGE_FADE_MS = 450;

/** Absolute-position a box on the artboard. */
export function box(b: Box, extra: CSSProperties = {}): CSSProperties {
  return {
    position: "absolute",
    left: b.x,
    top: b.y,
    width: b.w,
    height: b.h,
    zIndex: b.z,
    ...extra,
  };
}

/* Reusable chrome geometry (spec 4.3). */
export const CHROME = {
  pageLabel: { x: 56, y: 25, w: 240, h: 18 } as Box,
  decisionLabel: { x: 56, y: 25, w: 420, h: 18 } as Box,
  pageMarker: { x: 1536, y: 25, w: 80, h: 18 } as Box,
  topRule: { x: 56, y: 58, w: 1560, h: 1 } as Box,
};
