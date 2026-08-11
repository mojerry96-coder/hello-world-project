/* Text plate.

   Every page sets code-drawn copy over documentary photography, and the
   photography is not uniformly dark — a caption that reads over a night clinic
   disappears over a midday street. Page-level shade gradients help the overall
   composition but cannot guarantee contrast behind a specific block of text.

   A plate is a local gradient that sits directly behind one text block: opaque
   where the words start, fading out past them, so the copy is always legible
   without stamping a hard box onto the image. */

import type { CSSProperties, ReactNode } from "react";
import { box, type Box } from "../design/layout";

type Props = {
  frame: Box;
  children: ReactNode;
  /** Which way the gradient falls away from the text. */
  fade?: "right" | "up" | "none";
  /** Opacity at the text end of the gradient. */
  strength?: number;
  /** Accent rule down the leading edge. Use for instructions and objectives. */
  rule?: boolean;
  padding?: string;
  style?: CSSProperties;
};

export function TextPlate({
  frame,
  children,
  fade = "right",
  strength = 0.78,
  rule = false,
  padding = "10px 18px",
  style,
}: Props) {
  const a = `rgba(10,10,8,${strength})`;
  const b = `rgba(10,10,8,${strength * 0.72})`;

  const background =
    fade === "right"
      ? `linear-gradient(90deg, ${a} 0%, ${b} 62%, transparent 100%)`
      : fade === "up"
        ? `linear-gradient(0deg, ${a} 0%, ${b} 58%, transparent 100%)`
        : a;

  return (
    <div
      style={box(frame, {
        background,
        borderLeft: rule ? "2px solid var(--accent)" : undefined,
        padding,
        ...style,
      })}
    >
      {children}
    </div>
  );
}
