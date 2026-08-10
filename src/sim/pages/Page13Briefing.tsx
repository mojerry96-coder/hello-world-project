/* PAGE 13 — FRIDAY BRIEFING ARRIVAL.
   Decision history is read from persisted state, never from hardcoded examples.
   No score changes here. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade, Rule } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import { historyLabels } from "../content/history";

export default function Page13Briefing() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [revealed, setRevealed] = useState(state.reducedMotion ? 4 : 0);

  useEffect(() => {
    if (state.reducedMotion) return;
    const timers = [0, 1, 2, 3].map((i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 800 + i * 300),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [state.reducedMotion]);

  const h = historyLabels(state);
  const items = [
    `DIAGNOSIS ${h.diagnosis}`,
    h.strategy,
    `${h.budget} ALLOCATION`,
    h.adjustment,
  ];

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-13"
        src="p13-friday-briefing-arrival.webp"
        alt="Arrival at a formal Kaduna State Ministry of Health briefing room, with stakeholders taking their seats around a long table and printed review folders in place."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 900, h: 941, z: 2 }}
        background="linear-gradient(90deg, rgba(10,10,8,.88), rgba(10,10,8,.38) 74%, transparent)"
      />

      <p style={box({ x: 56, y: 28, w: 320, h: 18, z: 20 }, typeStyle("kicker"))}>
        FRIDAY BRIEFING
      </p>
      <h1
        style={box({ x: 56, y: 94, w: 660, h: 132, z: 20 }, typeStyle("displayXL"))}
      >
        KADUNA STATE MINISTRY OF HEALTH
      </h1>
      <p style={box({ x: 56, y: 250, w: 600, h: 48, z: 20 }, typeStyle("body"))}>
        Your decisions are now part of the evidence.
      </p>

      <Rule
        frame={{ x: 52, y: 839, w: 1285, h: 2, z: 20 }}
        background="var(--accent)"
      />

      <p
        style={box(
          { x: 54, y: 863, w: 1230, h: 28, z: 20 },
          typeStyle("bodySmall", { fontSize: 16, lineHeight: "20px" }),
        )}
      >
        YOUR CAMPAIGN HISTORY IS READY
        {items.map((item, i) => (
          <span
            key={item}
            style={{
              opacity: revealed > i ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          >
            {" · "}
            {item}
          </span>
        ))}
      </p>

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 14 });
          navigate("/defence");
        }}
        style={box(
          { x: 1351, y: 835, w: 258, h: 51, z: 20 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.34)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
          },
        )}
      >
        ENTER THE BRIEFING
      </button>
    </div>
  );
}
