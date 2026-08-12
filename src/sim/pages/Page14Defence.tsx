/* PAGE 14 — DEFEND THE STRATEGY.
   The opening question is chosen from accumulated history. All four arguments
   are shown, none preselected. The ending is computed from the whole run at
   submit time — never from this page's answer alone. */

import { useEffect, useState } from "react";
import {
  Eye,
  Gauge,
  Handshake,
  ChartLineUp,
  type Icon,
} from "@phosphor-icons/react";
import { useNavigate } from "../lib/navigate";
import { DecisionPage } from "../components/DecisionPage";
import { VoiceOver } from "../components/VoiceOver";
import { useDecisionHud } from "../content/decisionPages";
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

const DEFENCE_ICONS: Record<Defence, Icon> = {
  "evidence-integrated": ChartLineUp,
  visibility: Eye,
  efficiency: Gauge,
  trust: Handshake,
};

export default function Page14Defence() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const hud = useDecisionHud(14);

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
    <DecisionPage
      {...hud}
      statement={`“${opening}”`}
      question={`“${UNIVERSAL_QUESTION}”`}
      aside={
        <div>
          <label htmlFor="defence-justification" className="report-label">
            Your justification
          </label>
          <textarea
            id="defence-justification"
            className={`decision-field${
              trimmed.length > 0 && !valid ? " is-invalid" : ""
            }`}
            value={text}
            maxLength={JUSTIFICATION_MAX}
            onChange={(e) => setText(e.target.value)}
            placeholder="Connect your response to the campaign evidence..."
            aria-describedby="defence-counter"
            rows={3}
          />
          <p
            id="defence-counter"
            className="decision-footnote"
            style={{
              margin: "6px 0 0",
              textAlign: "right",
              fontSize: 11.5,
              color: valid ? "var(--text-tertiary)" : "var(--accent)",
            }}
          >
            {trimmed.length} / {JUSTIFICATION_MAX} · min {JUSTIFICATION_MIN}
          </p>
          {/* Opening question first, universal question after (spec timing). */}
          <div style={{ marginTop: 12 }}>
          <VoiceOver
            cue="VO-14"
            text={`${opening} ${UNIVERSAL_QUESTION}`}
            delay={600}
            inline
          />
          </div>
        </div>
      }
      footnote={
        submitted && selected ? (
          <span role="status" style={{ color: "var(--accent-soft)" }}>
            {defences[selected].feedback}
          </span>
        ) : null
      }
      options={(Object.keys(defences) as Defence[]).map((id) => ({
        id,
        icon: DEFENCE_ICONS[id],
        title: defences[id].heading,
        subtitle: defences[id].argument,
      }))}
      columns={4}
      optionsLabel="Defence position"
      selected={selected}
      onSelect={(id) => setSelected(id as Defence)}
      submitLabel={submitted ? "Recording…" : "Submit defence"}
      submitDisabled={!canSubmit || submitted}
      onSubmit={() => setSubmitted(true)}
    />
  );
}
