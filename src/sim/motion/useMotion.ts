/* Shared motion primitives.

   House rules for this project's game-feel layer:
   - Motion serves comprehension. It directs the eye to what changed; it never
     decorates for its own sake.
   - Everything routes through `prefersReducedMotion`. In reduced-motion mode
     each effect lands on its FINAL state instantly — never a degraded or
     half-played version, and never nothing at all.
   - Durations stay short (120–700ms). This is a professional briefing tool
     wearing game feel, not a title sequence. */

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/** Project easing. `out` for arrivals, `inOut` for moves, `back` for snap. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  snap: "back.out(1.7)",
} as const;

/**
 * Runs a GSAP setup inside a scoped context and reverts it on unmount, so no
 * tween outlives the page that created it.
 */
export function useGsapScope(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { reduced: boolean }) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (!scope.current) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => setup({ reduced }), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Counts a number up to its target. Used for coverage figures and forecast
 * percentages, where watching the value climb communicates magnitude far
 * better than the number simply appearing.
 */
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: number,
  {
    duration = 1.1,
    delay = 0,
    suffix = "",
    prefix = "",
    enabled = true,
  }: {
    duration?: number;
    delay?: number;
    suffix?: string;
    prefix?: string;
    enabled?: boolean;
  } = {},
) {
  // The tween owns the element's text for its lifetime. It is keyed only on
  // (target, enabled) — a re-render for any other reason must never restart it,
  // or the value creeps upward a few points at a time and never arrives.
  const playedFor = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const key = `${target}|${enabled}`;
    if (playedFor.current === key) return;
    playedFor.current = key;

    const write = (v: number) => {
      // Group thousands: a bare "14520" reads as a code, "14,520" reads as children.
      const n = Math.round(v);
      const shown = n >= 1000 ? n.toLocaleString("en-NG") : String(n);
      el.textContent = `${prefix}${shown}${suffix}`;
    };

    if (prefersReducedMotion()) {
      write(target);
      return;
    }

    const obj = { v: 0 };
    write(0);
    const tween = gsap.to(obj, {
      v: target,
      duration,
      delay,
      ease: EASE.out,
      onUpdate: () => write(obj.v),
      onComplete: () => write(target),
    });
    return () => {
      tween.kill();
    };
  }, [ref, target, duration, delay, suffix, prefix, enabled]);
}

/** Short attention shake — wrong answers, invalid submissions. */
export function shake(el: Element | null) {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { x: -6 },
    { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)", clearProps: "x" },
  );
}

/** Confirming pulse — correct placements, committed decisions. */
export function pulse(el: Element | null) {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { scale: 1 },
    {
      scale: 1.03,
      duration: 0.14,
      ease: EASE.out,
      yoyo: true,
      repeat: 1,
      clearProps: "scale",
    },
  );
}

export { gsap };
