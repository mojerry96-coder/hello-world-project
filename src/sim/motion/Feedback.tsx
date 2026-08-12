/* Tactile feedback layers.

   ClickSpark gives every commitment a physical "landed" beat — the thing that
   separates software that feels inert from software that feels responsive.
   Grain and vignette sit over the whole artboard to bind code-drawn UI and
   photographic media into one image instead of two stacked layers. */

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "./useMotion";

/**
 * Emits a short burst of accent-coloured shards at the pointer on click.
 * Deliberately sparse — 8 shards, 420ms, hairline strokes. Pointer-events are
 * never intercepted, so this can wrap the whole artboard safely.
 */
export function ClickSpark({ children }: { children: ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    function onPointerDown(e: PointerEvent) {
      const host = layer.current;
      if (!host) return;

      // Only respond to real commitments, not stray background clicks.
      const target = e.target as HTMLElement | null;
      if (!target?.closest("button, [role='radio'], [role='tab'], input")) return;

      const rect = host.getBoundingClientRect();
      // The artboard is CSS-scaled; convert viewport px back to artboard px.
      const scale = rect.width / host.offsetWidth || 1;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      const COUNT = 8;
      const shards: HTMLSpanElement[] = [];
      for (let i = 0; i < COUNT; i++) {
        const s = document.createElement("span");
        s.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:2px;height:10px;background:var(--accent-active);transform-origin:center;pointer-events:none;`;
        host.appendChild(s);
        shards.push(s);
      }

      shards.forEach((s, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        gsap.fromTo(
          s,
          { opacity: 0.9, scaleY: 0.4, rotation: (angle * 180) / Math.PI },
          {
            x: Math.cos(angle) * 26,
            y: Math.sin(angle) * 26,
            opacity: 0,
            scaleY: 1,
            duration: 0.42,
            ease: "power3.out",
            onComplete: () => s.remove(),
          },
        );
      });
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <>
      {children}
      <div
        ref={layer}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 60,
          overflow: "hidden",
        }}
      />
    </>
  );
}

/**
 * Film grain and edge vignette. Static SVG noise rather than an animated
 * canvas — the texture is what unifies the image; animating it would only
 * cost frames and pull focus.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 55,
        opacity: 0.055,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

export function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 54,
        background:
          "radial-gradient(ellipse at center, transparent 58%, rgba(8,8,7,.42) 100%)",
      }}
    />
  );
}
