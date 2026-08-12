/* Minimal Ripple — quiet concentric rings spreading outward from a still point.
   Local implementation using simulation design tokens. The rings are decorative
   only: pointer-events are off so the parent hit target keeps all clicks. */

import type { CSSProperties, ReactNode } from "react";

export function MinimalRipple({
  children,
  size = 28,
  rings = 3,
  duration = 3.2,
  color = "var(--accent-active)",
  active = true,
}: {
  children?: ReactNode;
  size?: number;
  rings?: number;
  duration?: number;
  color?: string;
  active?: boolean;
}) {
  return (
    <span className="minimal-ripple" style={{ width: size, height: size }}>
      {active &&
        Array.from({ length: rings }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="minimal-ripple__ring"
            style={
              {
                animationDuration: `${duration}s`,
                animationDelay: `${(duration / rings) * i}s`,
                borderColor: color,
              } as CSSProperties
            }
          />
        ))}
      {children}
    </span>
  );
}
