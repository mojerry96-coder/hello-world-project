/* Act break.

   Fifteen numbered screens read as a long form. The same fifteen grouped into
   three acts read as a story with a shape. Each card does three jobs at once:
   says where you are, restates the goal, and reports where Hauwa stands — so
   the learner is reminded what they are playing for at exactly the moment they
   are about to make the next big decision.

   Shown once per act per run. Dismisses on click, Enter, Escape, or after a
   beat; never traps the learner. */

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { SplitText } from "../motion/SplitText";
import { coverageAtWeek, weekForPage } from "../state/coverage";
import { GOAL_LINE, hauwaStatus, type Act } from "../content/story";
import { useSimulation } from "../state/store";
import { EASE, gsap, prefersReducedMotion } from "../motion/useMotion";

const DWELL_MS = 5200;

export function ActCard({ act, onDone }: { act: Act; onDone: () => void }) {
  const { state } = useSimulation();
  const root = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  const coverage = coverageAtWeek(state, weekForPage(act.atPage));

  function dismiss() {
    if (closing) return;
    setClosing(true);
    if (prefersReducedMotion() || !root.current) {
      onDone();
      return;
    }
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.4,
      ease: EASE.inOut,
      onComplete: onDone,
    });
  }

  useEffect(() => {
    const t = window.setTimeout(dismiss, DWELL_MS);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        window.clearTimeout(t);
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      role="dialog"
      aria-label={`${act.numeral}: ${act.title}`}
      onClick={dismiss}
      style={box(
        { x: 0, y: 0, w: 1672, h: 941, z: 70 },
        {
          background: "var(--ink)",
          cursor: "pointer",
          animation: prefersReducedMotion() ? undefined : "page-fade 500ms ease both",
        },
      )}
    >
      {/* A single accent rule anchors the composition, matching the endings. */}
      <div
        aria-hidden="true"
        style={box(
          { x: 152, y: 300, w: 560, h: 2, z: 2 },
          { background: "var(--accent)" },
        )}
      />

      <p style={box({ x: 152, y: 258, w: 400, h: 20, z: 2 }, typeStyle("kicker"))}>
        {act.numeral}
      </p>

      <div style={box({ x: 152, y: 332, w: 900, h: 120, z: 2 })}>
        <SplitText
          as="h1"
          text={act.title}
          by="char"
          stagger={0.026}
          rise={28}
          style={typeStyle("displayXL", { fontSize: 66, lineHeight: 1.04 })}
        />
      </div>

      <p
        style={box(
          { x: 152, y: 470, w: 720, h: 76, z: 2 },
          typeStyle("body", { fontSize: 19, lineHeight: 1.5 }),
        )}
      >
        {act.premise}
      </p>

      {/* The goal, restated at every act break. */}
      <div style={box({ x: 152, y: 580, w: 720, h: 56, z: 2 })}>
        <p style={typeStyle("label", { color: "var(--cream)", marginBottom: 6 })}>
          Your objective
        </p>
        <p style={typeStyle("body", { fontSize: 17, color: "var(--accent-active)" })}>
          {GOAL_LINE}
        </p>
      </div>

      {/* Hauwa: the campaign measured as one household. */}
      <div
        style={box(
          { x: 152, y: 682, w: 720, h: 72, z: 2 },
          { borderLeft: "1px solid var(--line-light)", paddingLeft: 18 },
        )}
      >
        <p style={typeStyle("label", { color: "rgba(238,228,213,.55)", marginBottom: 6 })}>
          In Ikara
        </p>
        <p style={typeStyle("bodySmall", { fontSize: 16, color: "var(--cream)" })}>
          {hauwaStatus(coverage)}
        </p>
      </div>

      <button
        type="button"
        className="focusable"
        onClick={dismiss}
        style={box(
          { x: 152, y: 806, w: 240, h: 52, z: 3 },
          {
            ...typeStyle("button"),
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "transparent",
            border: "1px solid var(--cream)",
            cursor: "pointer",
          },
        )}
      >
        <span>CONTINUE</span>
        <ArrowRight size={20} weight="thin" />
      </button>
    </div>
  );
}
