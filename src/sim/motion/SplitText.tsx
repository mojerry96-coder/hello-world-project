/* Word- and character-level text reveal, GSAP-driven.

   ReactBits-style, implemented in-house rather than pulled in as a dependency,
   so the markup stays inside this project's type roles and colour tokens.

   Accessibility: the split is presentational. The full string is exposed once
   to assistive tech and the fragments are hidden from it, so a screen reader
   reads "Then you defend it to the Commissioner." and not thirty-eight letters. */

import { useRef, type CSSProperties, type ElementType } from "react";
import { EASE, gsap, useGsapScope } from "./useMotion";

type Props = {
  text: string;
  as?: ElementType;
  by?: "word" | "char";
  style?: CSSProperties;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Distance the fragments rise from, in px. */
  rise?: number;
  /** Change this to force a re-run (e.g. a new intro beat). */
  runKey?: string | number;
};

export function SplitText({
  text,
  as: Tag = "p",
  by = "word",
  style,
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.62,
  rise = 18,
  runKey,
}: Props) {
  const scope = useRef<HTMLElement>(null);

  useGsapScope(
    scope,
    ({ reduced }) => {
      const parts = gsap.utils.toArray<HTMLElement>("[data-split-part]");
      if (!parts.length) return;

      if (reduced) {
        gsap.set(parts, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        parts,
        { opacity: 0, y: rise, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          delay,
          ease: EASE.out,
          stagger,
        },
      );
    },
    [text, runKey, by, delay, stagger, duration, rise],
  );

  const fragments = by === "word" ? text.split(/(\s+)/) : Array.from(text);

  return (
    <Tag
      ref={scope}
      className={className}
      style={{ ...style, display: "block" }}
      aria-label={text}
    >
      {fragments.map((frag, i) =>
        /^\s+$/.test(frag) ? (
          <span key={i} aria-hidden="true">
            {frag}
          </span>
        ) : (
          <span
            key={i}
            data-split-part
            aria-hidden="true"
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {frag}
          </span>
        ),
      )}
    </Tag>
  );
}
