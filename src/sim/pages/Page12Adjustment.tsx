/* PAGE 12 — ADAPT WEEKS 7–10.
   Nothing preselected. Submit requires a selection AND a 40–160 character
   justification; both are stored. Selection alone never navigates. */

import { useEffect, useState } from "react";
import {
  ArrowsClockwise,
  Broadcast,
  DeviceMobile,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import { useNavigate } from "../lib/navigate";
import { DecisionPage } from "../components/DecisionPage";
import { useDecisionHud } from "../content/decisionPages";
import { useSimulation } from "../state/store";
import type { Adjustment } from "../state/types";

const JUSTIFICATION_MIN = 40;
const JUSTIFICATION_MAX = 160;

const ADJUSTMENTS: {
  id: Adjustment;
  icon: Icon;
  label: string;
  cue: string;
  feedback: string;
  consequences: string[];
}[] = [
  {
    id: "increase-community",
    icon: UsersThree,
    label: "Increase community mobilisation",
    cue: "More CHW and leader engagement",
    feedback:
      "Partially effective. Dialogue may improve trust, but scaling CHW activity without support increases workload pressure.",
    consequences: [
      "Rural dialogue increases",
      "CHW fatigue worsens",
      "Teams request support",
    ],
  },
  {
    id: "expand-digital",
    icon: DeviceMobile,
    label: "Expand digital response",
    cue: "Faster online misinformation handling",
    feedback:
      "Needs reconsideration. Digital response is already improving while the main remaining challenge is offline hesitancy.",
    consequences: [
      "Online confidence improves",
      "Metro approaches 80%",
      "Ikara remains 38–40%",
    ],
  },
  {
    id: "increase-radio-mass",
    icon: Broadcast,
    label: "Increase radio + mass",
    cue: "Wider reach, lower field pressure",
    feedback:
      "Partially effective. Reach improves and field pressure reduces, but trust-related barriers remain.",
    consequences: [
      "Rural awareness improves",
      "Behaviour change remains slow",
      "CHW workload stabilises",
    ],
  },
  {
    id: "rebalance",
    icon: ArrowsClockwise,
    label: "Rebalance channels",
    cue: "Adjust the mix to field evidence",
    feedback:
      "Strong choice. The channel mix responds to field evidence instead of over-relying on one approach.",
    consequences: [
      "Workload becomes sustainable",
      "Peer mobilisers activate",
      "Radio reinforces community messages",
    ],
  },
];

export default function Page12Adjustment() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const hud = useDecisionHud(12);

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
    <DecisionPage
      {...hud}
      statement="“Week 6 tells us the campaign is working in the city and stalling in the villages. What do we change for the next four weeks?”"
      question="Select one priority adjustment, then justify your decision."
      aside={
        <div>
          <label htmlFor="justification" className="report-label">
            Your justification
          </label>
          <textarea
            id="justification"
            className={`decision-field${
              trimmed.length > 0 && !justificationValid ? " is-invalid" : ""
            }`}
            value={text}
            maxLength={JUSTIFICATION_MAX}
            onChange={(e) => setText(e.target.value)}
            placeholder="Use the Week 6 evidence..."
            aria-describedby="justification-counter"
            rows={3}
          />
          <p
            id="justification-counter"
            className="decision-footnote"
            style={{
              margin: "6px 0 0",
              textAlign: "right",
              fontSize: 11.5,
              color: justificationValid
                ? "var(--text-tertiary)"
                : "var(--accent)",
            }}
          >
            {trimmed.length} / {JUSTIFICATION_MAX} · min {JUSTIFICATION_MIN}
          </p>
        </div>
      }
      footnote={
        submitted && chosen ? (
          <span role="status">
            <strong style={{ color: "var(--white-soft)" }}>
              {chosen.label}.
            </strong>{" "}
            {chosen.feedback} · {chosen.consequences.join(" · ")}
          </span>
        ) : null
      }
      options={ADJUSTMENTS.map((a) => ({
        id: a.id,
        icon: a.icon,
        title: a.label,
        subtitle: a.cue,
      }))}
      columns={4}
      optionsLabel="Campaign adjustment"
      selected={selected}
      onSelect={(id) => setSelected(id as Adjustment)}
      submitLabel={submitted ? "Continue to briefing" : "Confirm adjustment"}
      submitDisabled={submitted ? !canContinue : !canSubmit}
      onSubmit={() => {
        if (!submitted) {
          submit();
          return;
        }
        update({ currentPage: 13 });
        navigate("/briefing-arrival");
      }}
    />
  );
}
