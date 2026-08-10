/* Animated numeric readout.

   Used wherever a figure carries weight — baseline coverage, forecast metrics.
   Watching 0 climb to 38 while a neighbouring column reaches 70 makes the
   coverage gap legible in a way two static numbers never manage. */

import { useRef, type CSSProperties, type ElementType } from "react";
import { useCountUp } from "./useMotion";

type Props = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  /** Hold at zero until the column is revealed. */
  enabled?: boolean;
  as?: ElementType;
  style?: CSSProperties;
};

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.1,
  delay = 0,
  enabled = true,
  as: Tag = "p",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useCountUp(ref, to, { duration, delay, suffix, prefix, enabled });

  // GSAP owns this element's text content, so React must not re-render children
  // into it — otherwise every parent update overwrites the tween mid-flight.
  // `suppressHydrationWarning` plus a stable empty child keeps React out.
  return (
    <Tag
      ref={ref}
      style={style}
      aria-label={`${prefix}${to}${suffix}`}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `${prefix}${to}${suffix}` }}
    />
  );
}
