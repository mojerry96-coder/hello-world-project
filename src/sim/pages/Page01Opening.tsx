/* PAGE 01 — OPENING. No decision, no progress marker, no back nav.

   Still, not video. The film held the title card hostage for seven seconds
   before a single word appeared, which read as a broken page rather than a
   deliberate hold. The reveals now begin immediately and finish inside 1.5s. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import { SplitText } from "../motion/SplitText";

const REVEALS = [
  { key: "kicker", at: 250 },
  { key: "title", at: 500 },
  { key: "titleRule", at: 1050 },
  { key: "cta", at: 1350 },
] as const;

export default function Page01Opening() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [shown, setShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reduced motion skips the staged choreography and shows everything at once.
    if (state.reducedMotion) {
      setShown(new Set(REVEALS.map((r) => r.key)));
      return;
    }
    const timers = REVEALS.map((r) =>
      window.setTimeout(
        () => setShown((prev) => new Set(prev).add(r.key)),
        r.at,
      ),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [state.reducedMotion]);

  const visible = (key: string): React.CSSProperties => ({
    opacity: shown.has(key) ? 1 : 0,
    transition: "opacity 400ms ease",
  });

  function begin() {
    update({ currentPage: 2 });
    navigate("/mission");
  }

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-01"
        src="p01-clinic-cold-open-poster.webp"
        alt="Rural Ikara immunisation outreach room. A hesitant Hausa mother holding her toddler pauses inside the clinic while a community health worker waits beside the vaccination table."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />

      <Shade
        frame={{ x: 0, y: 0, w: 720, h: 941, z: 2 }}
        background="linear-gradient(90deg, rgba(13,14,12,.70), rgba(13,14,12,.20) 78%, transparent)"
      />
      <Shade
        frame={{ x: 0, y: 610, w: 1672, h: 331, z: 2 }}
        background="linear-gradient(0deg, rgba(13,14,12,.72), transparent)"
      />

      <p
        style={box(
          { x: 56, y: 59, w: 210, h: 24, z: 10 },
          {
            ...typeStyle("bodySmall", {
              fontSize: 21,
              lineHeight: "24px",
              color: "var(--cream)",
              letterSpacing: "0.14em",
            }),
            ...visible("kicker"),
          },
        )}
      >
        KADUNA STATE
      </p>
      <div
        aria-hidden="true"
        style={box(
          { x: 56, y: 89, w: 105, h: 1, z: 10 },
          { background: "var(--accent)", ...visible("kicker") },
        )}
      />

      <div
        style={box(
          { x: 56, y: 686, w: 520, h: 106, z: 10 },
          visible("title"),
        )}
      >
        {shown.has("title") && (
          <>
            <SplitText
              as="h1"
              text="RIGHT MESSAGE,"
              by="char"
              stagger={0.024}
              rise={24}
              style={typeStyle("displayL", { fontSize: 52, lineHeight: 1.05 })}
            />
            <SplitText
              as="h2"
              text="RIGHT CHANNEL"
              by="char"
              delay={0.26}
              stagger={0.024}
              rise={24}
              style={typeStyle("displayL", { fontSize: 52, lineHeight: 1.05 })}
            />
          </>
        )}
      </div>
      <div
        aria-hidden="true"
        style={box(
          { x: 56, y: 809, w: 482, h: 2, z: 10 },
          { background: "var(--accent)", ...visible("titleRule") },
        )}
      />

      {/* Lets a learner who skipped or forgot the brief watch it again. */}
      <button
        type="button"
        className="focusable"
        onClick={() => navigate("/intro")}
        style={box(
          { x: 56, y: 843, w: 190, h: 24, z: 10 },
          {
            ...typeStyle("bodySmall", {
              fontSize: 13,
              color: "rgba(238,228,213,.62)",
            }),
            background: "transparent",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            ...visible("cta"),
            pointerEvents: shown.has("cta") ? "auto" : "none",
          },
        )}
      >
        Watch the briefing again
      </button>

      <button
        type="button"
        className="focusable"
        onClick={begin}
        style={box(
          { x: 1476, y: 835, w: 128, h: 38, z: 10 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.36)",
            border: "1px solid var(--accent)",
            cursor: "pointer",
            ...visible("cta"),
            pointerEvents: shown.has("cta") ? "auto" : "none",
          },
        )}
      >
        BEGIN
      </button>
    </div>
  );
}
