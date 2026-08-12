/* Fixed 1672 x 941 stage, scaled to contain (never crop). Spec 4.2.
   Below 1024px wide we still contain; a portrait screen gets a rotate notice
   rather than vertical scrolling. */

import { useEffect, useState, type ReactNode } from "react";
import { ARTBOARD } from "../design/layout";
import { typeStyle } from "../design/type";
import { ClickSpark, Grain, Vignette } from "../motion/Feedback";

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

export function Artboard({ children }: { children: ReactNode }) {
  const { scale, portrait } = useArtboardScale();

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
        className="artboard"
        style={{ ["--scene-scale" as string]: scale }}
        data-artboard
      >
        <ClickSpark>{children}</ClickSpark>
        <Vignette />
        <Grain />
      </div>
    </div>
  );
}
