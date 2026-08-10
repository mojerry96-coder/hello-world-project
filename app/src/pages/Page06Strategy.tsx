/* PAGE 06 — SELECT COMMUNICATION STRATEGY.
   Loads with nothing selected and a disabled Continue. Hover/focus previews but
   never commits. No option is marked correct here — that belongs on Page 7. */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaSlot } from "../components/MediaSlot";
import { DecisionLabel, Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { strategies } from "../content/pages";
import { useSimulation } from "../state/store";
import type { Strategy } from "../state/types";

const OPTION_FRAMES = [
  { x: 70, w: 292 },
  { x: 363, w: 368 },
  { x: 732, w: 360 },
  { x: 1093, w: 359 },
];

const LETTERS = ["A", "B", "C", "D"];

export default function Page06Strategy() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  // Never seeded from state on entry — the page must open unselected.
  const [selected, setSelected] = useState<Strategy | null>(null);

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-06"
        src="p06-strategy-room.webp"
        alt="Kaduna SPHCDA campaign planning session. Four public-health staff lean over a large printed state map, comparing field photographs, radio notes and smartphones."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.36), transparent 48%, rgba(10,10,8,.78) 78%)"
      />

      <DecisionLabel
        decision="Decision 02"
        title="Select Communication Strategy"
      />

      <p
        style={box(
          { x: 1390, y: 38, w: 242, h: 22, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 16,
            lineHeight: "20px",
            textAlign: "right",
          }),
        )}
        aria-live="polite"
      >
        {selected
          ? strategies.find((s) => s.id === selected)?.name
          : "NO STRATEGY SELECTED"}
      </p>

      <p
        style={box(
          { x: 70, y: 690, w: 900, h: 60, z: 20 },
          typeStyle("body", { fontSize: 19, lineHeight: 1.35 }),
        )}
      >
        “We cannot use every communication channel equally. Based on the evidence,
        what strategy should guide the next phase of the campaign?”
      </p>

      <Shade
        frame={{ x: 0, y: 781, w: 1672, h: 160, z: 18 }}
        background="rgba(13,13,11,.82)"
      />

      <div role="radiogroup" aria-label="Communication strategy">
        {strategies.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={selected === s.id}
            className="option focusable"
            data-selected={selected === s.id}
            onClick={() => setSelected(s.id)}
            style={box(
              { x: OPTION_FRAMES[i].x, y: 804, w: OPTION_FRAMES[i].w, h: 80, z: 20 },
              { padding: "12px 16px" },
            )}
          >
            <span
              style={{
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 11,
                lineHeight: "14px",
                color: "var(--accent-active)",
                display: "block",
              }}
            >
              {LETTERS[i]}
            </span>
            <span
              style={{
                fontFamily: "Inter, Arial, sans-serif",
                fontWeight: 300,
                fontSize: 18,
                lineHeight: "22px",
                color: "var(--cream)",
                display: "block",
                marginTop: 2,
              }}
            >
              {s.name}
            </span>
            <span
              style={{
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 12,
                lineHeight: "17px",
                color: "rgba(238,228,213,.76)",
                display: "block",
              }}
            >
              {s.channels}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="focusable"
        disabled={selected === null}
        aria-disabled={selected === null}
        onClick={() => {
          if (!selected) return;
          update({ strategy: selected, currentPage: 7 });
          navigate("/strategy-consequence");
        }}
        style={box(
          { x: 1491, y: 866, w: 141, h: 43, z: 20 },
          {
            ...typeStyle("button"),
            background: selected ? "rgba(12,12,10,.34)" : "rgba(24,26,24,.56)",
            border: selected
              ? "1px solid var(--cream)"
              : "1px solid rgba(238,228,213,.16)",
            color: selected ? "var(--white)" : "rgba(238,228,213,.40)",
            cursor: selected ? "pointer" : "not-allowed",
          },
        )}
      >
        CONTINUE
      </button>

      <span hidden>{state.diagnosis}</span>
    </div>
  );
}
