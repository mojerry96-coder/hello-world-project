/* PAGE 01 — OPENING. No decision, no progress marker, no back nav.
   Timeline per spec: video to 7.0s, then staged reveals to 8.65s, then hold. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { VideoSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";

const REVEALS = [
  { key: "kicker", at: 7150 },
  { key: "title", at: 7350 },
  { key: "titleRule", at: 7900 },
  { key: "cta", at: 8250 },
] as const;

export default function Page01Opening() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [videoDone, setVideoDone] = useState(false);

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
      <VideoSlot
        id="VID-01"
        src="p01-clinic-cold-open.mp4"
        alt="Rural Ikara immunisation outreach room. A hesitant Hausa mother holding her toddler pauses inside the clinic while a community health worker waits beside the vaccination table."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
        muted={state.audioMuted}
        poster="p01-clinic-cold-open-poster.webp"
        onEnded={() => setVideoDone(true)}
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

      <h1
        style={box(
          { x: 56, y: 686, w: 520, h: 106, z: 10 },
          {
            ...typeStyle("displayL", { fontSize: 52, lineHeight: 1.05 }),
            ...visible("title"),
          },
        )}
      >
        RIGHT MESSAGE,
        <br />
        RIGHT CHANNEL
      </h1>
      <div
        aria-hidden="true"
        style={box(
          { x: 56, y: 809, w: 482, h: 2, z: 10 },
          { background: "var(--accent)", ...visible("titleRule") },
        )}
      />

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

      <span hidden data-video-ended={videoDone} />
    </div>
  );
}
