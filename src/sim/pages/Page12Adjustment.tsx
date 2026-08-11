/* PAGE 12 — ADAPT WEEKS 7–10.
   Nothing preselected. Submit requires a selection AND a 40–160 character
   justification; both are stored. Selection alone never navigates. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import type { Adjustment } from "../state/types";

const JUSTIFICATION_MIN = 40;
const JUSTIFICATION_MAX = 160;

const ADJUSTMENTS: {
  id: Adjustment;
  letter: string;
  label: string;
  cue: string;
  feedback: string;
  consequences: string[];
  x: number;
  w: number;
}[] = [
  {
    id: "increase-community",
    letter: "A",
    label: "INCREASE COMMUNITY MOBILISATION",
    cue: "More CHW and leader engagement",
    feedback:
      "Partially effective. Dialogue may improve trust, but scaling CHW activity without support increases workload pressure.",
    consequences: ["Rural dialogue increases", "CHW fatigue worsens", "Teams request support"],
    x: 56,
    w: 372,
  },
  {
    id: "expand-digital",
    letter: "B",
    label: "EXPAND DIGITAL RESPONSE",
    cue: "Faster online misinformation handling",
    feedback:
      "Needs reconsideration. Digital response is already improving while the main remaining challenge is offline hesitancy.",
    consequences: ["Online confidence improves", "Metro approaches 80%", "Ikara remains 38–40%"],
    x: 440,
    w: 372,
  },
  {
    id: "increase-radio-mass",
    letter: "C",
    label: "INCREASE RADIO + MASS",
    cue: "Wider reach, lower field pressure",
    feedback:
      "Partially effective. Reach improves and field pressure reduces, but trust-related barriers remain.",
    consequences: ["Rural awareness improves", "Behaviour change remains slow", "CHW workload stabilises"],
    x: 824,
    w: 372,
  },
  {
    id: "rebalance",
    letter: "D",
    label: "REBALANCE CHANNELS",
    cue: "Adjust the mix to field evidence",
    feedback:
      "Strong choice. The channel mix responds to field evidence instead of over-relying on one approach.",
    consequences: ["Workload becomes sustainable", "Peer mobilisers activate", "Radio reinforces community messages"],
    x: 1208,
    w: 408,
  },
];

export default function Page12Adjustment() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();

  // Restored if the learner came back, but never preselected on a first visit.
  const [selected, setSelected] = useState<Adjustment | null>(state.adjustment);
  const [text, setText] = useState(state.adjustmentJustification);
  const [submitted, setSubmitted] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const trimmed = text.trim();
  const justificationValid =
    trimmed.length >= JUSTIFICATION_MIN && trimmed.length <= JUSTIFICATION_MAX;
  const canSubmit = selected !== null && justificationValid;

  useEffect(() => {
    if (!submitted) return;
    const t = window.setTimeout(() => setCanContinue(true), 1600);
    return () => window.clearTimeout(t);
  }, [submitted]);

  const chosen = ADJUSTMENTS.find((a) => a.id === selected);

  function submit() {
    if (!canSubmit || !selected) return;
    update({
      adjustment: selected,
      adjustmentJustification: trimmed,
      currentPage: 12,
    });
    setSubmitted(true);
  }

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-12"
        src="p12-adjustment-room.webp"
        alt="Kaduna strategy room. A large paper map with Ikara and rural LGAs marked on the left; the Programme Director and three staff discuss field reports on the right."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.55), transparent 42%, rgba(10,10,8,.92) 69%)"
      />

      <p style={box({ x: 56, y: 28, w: 320, h: 18, z: 20 }, typeStyle("kicker"))}>
        DECISION 04 / 05
      </p>
      <h1 style={box({ x: 56, y: 82, w: 710, h: 72, z: 20 }, typeStyle("displayL"))}>
        ADAPT WEEKS 7–10
      </h1>
      <p
        style={box(
          { x: 56, y: 164, w: 780, h: 50, z: 20 },
          typeStyle("bodySmall", { fontSize: 16 }),
        )}
      >
        Select one priority adjustment. Then justify your decision.
      </p>
      <p
        style={box(
          { x: 1208, y: 610, w: 408, h: 20, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 12,
            textAlign: "right",
            color: selected ? "var(--accent-active)" : "rgba(238,228,213,.55)",
          }),
        )}
        aria-live="polite"
      >
        {selected
          ? ADJUSTMENTS.find((a) => a.id === selected)?.label
          : "No adjustment selected"}
      </p>

      <div role="radiogroup" aria-label="Campaign adjustment">
        {ADJUSTMENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={selected === a.id}
            className="option focusable"
            data-selected={selected === a.id}
            onClick={() => setSelected(a.id)}
            style={box({ x: a.x, y: 652, w: a.w, h: 108, z: 20 }, { padding: 16 })}
          >
            <span
              style={{
                fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                fontSize: 11,
                lineHeight: "14px",
                color: "var(--accent-active)",
                display: "block",
              }}
            >
              {a.letter}
            </span>
            <span
              style={{
                fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                fontWeight: 300,
                fontSize: 17,
                lineHeight: "21px",
                color: "var(--cream)",
                display: "block",
                marginTop: 4,
              }}
            >
              {a.label}
            </span>
            <span
              style={{
                fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                fontSize: 11,
                lineHeight: "15px",
                color: "rgba(238,228,213,.72)",
                display: "block",
                marginTop: 6,
              }}
            >
              {a.cue}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback appears beside the choice that caused it. */}
      {submitted && chosen && (
        <div
          role="status"
          style={box(
            { x: 56, y: 470, w: 1138, h: 160, z: 22 },
            {
              background: "rgba(13,13,11,.92)",
              border: "1px solid var(--line-dark)",
              padding: 20,
            },
          )}
        >
          <p style={typeStyle("label")}>{chosen.label}</p>
          <p style={typeStyle("body", { fontSize: 17, margin: "10px 0 12px" })}>
            {chosen.feedback}
          </p>
          <p style={typeStyle("bodySmall")}>
            {chosen.consequences.join(" · ")}
          </p>
        </div>
      )}

      <label
        htmlFor="justification"
        style={box(
          { x: 56, y: 776, w: 400, h: 18, z: 20 },
          typeStyle("label", { color: "var(--cream)" }),
        )}
      >
        YOUR JUSTIFICATION
      </label>
      <textarea
        id="justification"
        className="focusable"
        value={text}
        maxLength={JUSTIFICATION_MAX}
        onChange={(e) => setText(e.target.value)}
        placeholder="Use the Week 6 evidence..."
        aria-describedby="justification-counter"
        style={box(
          { x: 56, y: 800, w: 1138, h: 96, z: 20 },
          {
            background: "rgba(15,15,12,.80)",
            border: `1px solid ${
              trimmed.length > 0 && !justificationValid
                ? "var(--error)"
                : "var(--line-dark)"
            }`,
            borderRadius: 0,
            color: "var(--cream)",
            fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
            fontSize: 15,
            lineHeight: "22px",
            padding: 14,
            resize: "none",
          },
        )}
      />
      <p
        id="justification-counter"
        style={box(
          { x: 1000, y: 904, w: 194, h: 18, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 12,
            textAlign: "right",
            color: justificationValid
              ? "rgba(238,228,213,.6)"
              : "var(--warning)",
          }),
        )}
      >
        {trimmed.length} / {JUSTIFICATION_MAX} · min {JUSTIFICATION_MIN}
      </p>

      <button
        type="button"
        className="focusable"
        disabled={submitted ? !canContinue : !canSubmit}
        aria-disabled={submitted ? !canContinue : !canSubmit}
        onClick={() => {
          if (!submitted) {
            submit();
            return;
          }
          update({ currentPage: 13 });
          navigate("/briefing-arrival");
        }}
        style={box(
          { x: 1328, y: 816, w: 288, h: 64, z: 20 },
          {
            ...typeStyle("button"),
            background:
              (submitted ? canContinue : canSubmit)
                ? "var(--accent)"
                : "rgba(24,26,24,.56)",
            border:
              (submitted ? canContinue : canSubmit)
                ? "1px solid var(--accent-active)"
                : "1px solid rgba(238,228,213,.16)",
            color:
              (submitted ? canContinue : canSubmit)
                ? "var(--white)"
                : "rgba(238,228,213,.40)",
            cursor:
              (submitted ? canContinue : canSubmit) ? "pointer" : "not-allowed",
          },
        )}
      >
        {submitted ? "CONTINUE TO BRIEFING" : "CONFIRM ADJUSTMENT"}
      </button>
    </div>
  );
}
