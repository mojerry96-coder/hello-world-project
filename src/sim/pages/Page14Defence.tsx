/* PAGE 14 — DEFEND THE STRATEGY.
   The opening question is chosen from accumulated history. All four full
   arguments are shown, none preselected. The ending is computed from the whole
   run at submit time — never from this page's answer alone. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { VoiceOver } from "../components/VoiceOver";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";
import {
  defences,
  dynamicOpeningQuestion,
  UNIVERSAL_QUESTION,
} from "../content/history";
import { determineEnding } from "../state/logic";
import { useSimulation } from "../state/store";
import type { Defence } from "../state/types";

const JUSTIFICATION_MIN = 50;
const JUSTIFICATION_MAX = 220;

const OPTION_FRAMES: Record<Defence, Box> = {
  "evidence-integrated": { x: 680, y: 438, w: 440, h: 126, z: 20 },
  visibility: { x: 1136, y: 438, w: 480, h: 126, z: 20 },
  efficiency: { x: 680, y: 578, w: 440, h: 126, z: 20 },
  trust: { x: 1136, y: 578, w: 480, h: 126, z: 20 },
};

export default function Page14Defence() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();

  const [selected, setSelected] = useState<Defence | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const trimmed = text.trim();
  const valid =
    trimmed.length >= JUSTIFICATION_MIN && trimmed.length <= JUSTIFICATION_MAX;
  const canSubmit = selected !== null && valid;

  // After showing feedback for 1.8s, resolve the ending from the whole run.
  useEffect(() => {
    if (!submitted || !selected) return;
    const t = window.setTimeout(() => {
      const next = {
        ...state,
        defence: selected,
        defenceJustification: trimmed,
      };
      update({
        defence: selected,
        defenceJustification: trimmed,
        ending: determineEnding(next),
        currentPage: 15,
      });
      navigate("/outcome");
    }, 1800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const opening = dynamicOpeningQuestion(state);

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-14"
        src="p14-strategy-defence.webp"
        alt="Formal Kaduna State Ministry of Health briefing room seen from behind the Health Communication Officer. Four stakeholders face the learner with attentive, challenging expressions."
        frame={{ x: 0, y: 0, w: 1672, h: 420, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 420, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.40), rgba(10,10,8,.72))"
      />
      <Shade
        frame={{ x: 0, y: 400, w: 1672, h: 541, z: 5 }}
        background="var(--ink)"
      />

      <p style={box({ x: 56, y: 28, w: 320, h: 18, z: 20 }, typeStyle("kicker"))}>
        DECISION 05 / 05
      </p>
      <h1 style={box({ x: 56, y: 438, w: 560, h: 70, z: 20 }, typeStyle("displayL"))}>
        DEFEND THE STRATEGY
      </h1>

      <p
        style={box(
          { x: 56, y: 524, w: 560, h: 70, z: 20 },
          typeStyle("body"),
        )}
      >
        “{opening}”
      </p>
      <p
        style={box(
          { x: 56, y: 610, w: 560, h: 92, z: 20 },
          typeStyle("bodySmall"),
        )}
      >
        “{UNIVERSAL_QUESTION}”
      </p>
      {/* Opening question first, universal question 450ms later (spec timing). */}
      <VoiceOver
        cue="VO-14"
        text={`${opening} ${UNIVERSAL_QUESTION}`}
        delay={600}
        frame={{ x: 56, y: 706, w: 320, h: 40, z: 24 }}
      />

      <div role="radiogroup" aria-label="Defence position">
        {(Object.keys(defences) as Defence[]).map((id) => {
          const d = defences[id];
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected === id}
              className="option focusable"
              data-selected={selected === id}
              onClick={() => setSelected(id)}
              style={box(OPTION_FRAMES[id], { padding: 14, overflow: "hidden" })}
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
                {d.letter}
              </span>
              <span
                style={{
                  fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                  fontWeight: 300,
                  fontSize: 17,
                  lineHeight: "21px",
                  color: "var(--cream)",
                  display: "block",
                  marginTop: 2,
                }}
              >
                {d.heading}
              </span>
              <span
                style={{
                  fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                  fontSize: 12,
                  lineHeight: "17px",
                  color: "rgba(238,228,213,.78)",
                  display: "block",
                  marginTop: 6,
                }}
              >
                {d.argument}
              </span>
            </button>
          );
        })}
      </div>

      {submitted && selected && (
        <div
          role="status"
          style={box(
            { x: 680, y: 730, w: 936, h: 54, z: 22 },
            {
              background: "rgba(180,93,43,.14)",
              border: "1px solid var(--accent-active)",
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
            },
          )}
        >
          <p style={typeStyle("bodySmall", { color: "var(--cream)" })}>
            {defences[selected].feedback}
          </p>
        </div>
      )}

      <label
        htmlFor="defence-justification"
        style={box(
          { x: 56, y: 742, w: 400, h: 18, z: 20 },
          typeStyle("label", { color: "var(--cream)" }),
        )}
      >
        YOUR JUSTIFICATION
      </label>
      <textarea
        id="defence-justification"
        className="focusable"
        value={text}
        maxLength={JUSTIFICATION_MAX}
        onChange={(e) => setText(e.target.value)}
        placeholder="Connect your response to the campaign evidence..."
        aria-describedby="defence-counter"
        style={box(
          { x: 56, y: 766, w: 1138, h: 104, z: 20 },
          {
            background: "var(--ink-2)",
            border: `1px solid ${
              trimmed.length > 0 && !valid ? "var(--error)" : "var(--line-dark)"
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
        id="defence-counter"
        style={box(
          { x: 1000, y: 878, w: 194, h: 18, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 12,
            textAlign: "right",
            color: valid ? "rgba(238,228,213,.6)" : "var(--warning)",
          }),
        )}
      >
        {trimmed.length} / {JUSTIFICATION_MAX} · min {JUSTIFICATION_MIN}
      </p>

      <button
        type="button"
        className="focusable"
        disabled={!canSubmit || submitted}
        aria-disabled={!canSubmit || submitted}
        onClick={() => setSubmitted(true)}
        style={box(
          { x: 1328, y: 792, w: 288, h: 64, z: 20 },
          {
            ...typeStyle("button"),
            background: canSubmit ? "var(--accent)" : "rgba(24,26,24,.56)",
            border: canSubmit
              ? "1px solid var(--accent-active)"
              : "1px solid rgba(238,228,213,.16)",
            color: canSubmit ? "var(--white)" : "rgba(238,228,213,.40)",
            cursor: canSubmit && !submitted ? "pointer" : "not-allowed",
          },
        )}
      >
        {submitted ? "RECORDING…" : "SUBMIT DEFENCE"}
      </button>
    </div>
  );
}
