/* Fixed 1672 x 941 stage, scaled to contain (never crop). Spec 4.2.
   Below 1024px wide we still contain; a portrait screen gets a rotate notice
   rather than vertical scrolling. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ARTBOARD } from "../design/layout";
import { typeStyle } from "../design/type";

function useArtboardScale() {
  const [scale, setScale] = useState(1);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    function measure() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(Math.min(w / ARTBOARD.width, h / ARTBOARD.height));
      // Only warn when the screen is too narrow AND taller than it is wide.
      setPortrait(h > w && w < 1024);
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return { scale, portrait };
}

/* Pointer position, normalised to -1..1 across the stage, published as CSS
   custom properties so any .parallax-media image can drift against the text. */
function useParallax() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    function onMove(e: PointerEvent) {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const mx = (e.clientX / window.innerWidth) * 2 - 1;
        const my = (e.clientY / window.innerHeight) * 2 - 1;
        el!.style.setProperty("--mx", mx.toFixed(3));
        el!.style.setProperty("--my", my.toFixed(3));
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

export function Artboard({ children }: { children: ReactNode }) {
  const { scale, portrait } = useArtboardScale();
  const stageRef = useParallax();

  if (portrait) {
    return (
      <div className="viewport">
        <div style={{ maxWidth: 320, padding: 24, textAlign: "center" }}>
          <p style={typeStyle("kicker", { marginBottom: 12 })}>Kaduna State</p>
          <p style={typeStyle("body")}>
            Rotate your device to landscape to continue the simulation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="viewport">
      <div
        ref={stageRef}
        className="artboard"
        style={{ ["--scene-scale" as string]: scale }}
        data-artboard
      >
        {children}
      </div>
    </div>
  );
}
