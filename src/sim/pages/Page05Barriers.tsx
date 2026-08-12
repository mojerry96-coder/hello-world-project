/* PAGE 05 — CLASSIFY COMMUNICATION BARRIERS.

   Rendered through the fluid DecisionPage template. The scoring rule is
   unchanged: only the FIRST placement of each report counts. Corrections update
   currentBarrierPlacements and are encouraged for learning, but they can never
   turn a 2/4 first diagnosis into a 4/4 score. */

import { useEffect, useMemo, useState } from "react";
import {
  ChatCircleDots,
  Question,
  RadioButton,
  UsersThree,
  Prohibit,
  type Icon,
} from "@phosphor-icons/react";
import { useNavigate } from "../lib/navigate";
import { DecisionPage } from "../components/DecisionPage";
import { useDecisionHud } from "../content/decisionPages";
import {
  barrierZones,
  correctFeedback,
  diagnosisOutcomeCopy,
  INCORRECT_FEEDBACK,
  reports,
} from "../content/pages";
import { countCorrect, diagnosisFromCorrect } from "../state/logic";
import { useSimulation } from "../state/store";
import { BARRIER_ANSWER_KEY, type Barrier } from "../state/types";

const ZONE_ICONS: Record<Barrier, Icon> = {
  "digital-communication": ChatCircleDots,
  "misinformation-trust": Question,
  "channel-access": RadioButton,
  "trusted-messenger": UsersThree,
  "not-primary": Prohibit,
};

export default function Page05Barriers() {
  const navigate = useNavigate();
  const { state, apply, update } = useSimulation();
  const hud = useDecisionHud(5);

  const order = state.reportOrder;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Barrier | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const current = order[idx];
  const firstAttempts = state.firstBarrierAttempts;
  const placements = state.currentBarrierPlacements;

  const allFirstAttemptsMade = order.every((id) => firstAttempts[id]);
  const placedThis = placements[current];

  // Scored from first attempts only — never from the corrected placements.
  const correctCount = useMemo(() => countCorrect(firstAttempts), [firstAttempts]);
  const diagnosis = diagnosisFromCorrect(correctCount);

  // A 0/4 first diagnosis triggers a learning reset: every current placement
  // must be corrected before the learner may continue. The 0 score still stands.
  const allCurrentCorrect = order.every(
    (id) => placements[id] === BARRIER_ANSWER_KEY[id],
  );
  const resetSatisfied = diagnosis !== "reset" || allCurrentCorrect;

  useEffect(() => {
    setSelected(placements[current] ?? null);
  }, [current, placements]);

  function place(barrier: Barrier) {
    const report = current;
    apply((s) => ({
      firstBarrierAttempts: s.firstBarrierAttempts[report]
        ? s.firstBarrierAttempts
        : { ...s.firstBarrierAttempts, [report]: barrier },
      currentBarrierPlacements: {
        ...s.currentBarrierPlacements,
        [report]: barrier,
      },
    }));
    setSelected(barrier);

    const nextUnplaced = order.findIndex(
      (id) => id !== report && !state.firstBarrierAttempts[id],
    );
    if (nextUnplaced !== -1) {
      window.setTimeout(() => setIdx(nextUnplaced), 900);
    }
  }

  function confirmDiagnosis() {
    update({ diagnosisCorrect: correctCount, diagnosis, currentPage: 5 });
    setConfirmed(true);
  }

  const feedback = placedThis
    ? placedThis === reports[current].correct
      ? correctFeedback[current]
      : INCORRECT_FEEDBACK
    : "";

  return (
    <DecisionPage
      {...hud}
      image={reports[current].src}
      imageId={reports[current].image}
      imageAlt={reports[current].alt}
      statement={`“${reports[current].text}”`}
      question={
        allFirstAttemptsMade
          ? "Every report is classified. Review any of them, then confirm your diagnosis."
          : idx === 0
            ? "Which of the five explanations below fits this report best? Pick one, then place the report."
            : `Report ${idx + 1} of 4 — pick the explanation that fits, then place the report.`
      }
      aside={
        <div>
          <p className="report-label">Reports</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {order.map((id, i) => (
              <button
                key={id}
                type="button"
                className="decision-chip"
                onClick={() => setIdx(i)}
                aria-current={i === idx}
                data-placed={Boolean(firstAttempts[id])}
                aria-label={`Go to report ${i + 1}${firstAttempts[id] ? ", placed" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p
            className="decision-footnote"
            style={{ margin: "14px 0 0" }}
            aria-live="polite"
          >
            {allFirstAttemptsMade
              ? `${order.filter((id) => firstAttempts[id]).length} of 4 classified`
              : `Report ${idx + 1} of 4`}
          </p>
        </div>
      }
      footnote={
        feedback ? (
          <span
            role="status"
            style={{
              color:
                placedThis === reports[current].correct
                  ? "var(--white-soft)"
                  : "var(--danger)",
            }}
          >
            {feedback}
          </span>
        ) : null
      }
      options={barrierZones.map((zone) => ({
        id: zone.id,
        icon: ZONE_ICONS[zone.id],
        title: zone.short,
        subtitle: zone.full,
      }))}
      columns={5}
      optionsLabel="Communication barrier"
      selected={selected}
      onSelect={(id) =>
        placedThis ? place(id as Barrier) : setSelected(id as Barrier)
      }
      submitLabel={allFirstAttemptsMade ? "Confirm diagnosis" : "Place report"}
      submitDisabled={
        allFirstAttemptsMade ? !resetSatisfied : selected === null
      }
      onSubmit={() => {
        if (allFirstAttemptsMade) confirmDiagnosis();
        else if (selected) place(selected);
      }}
      overlay={
        confirmed ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Diagnosis outcome"
            style={{ maxWidth: 860 }}
          >
            <p className="report-label">
              {diagnosis === "strong"
                ? "Strong diagnosis"
                : diagnosis === "partial"
                  ? "Partial diagnosis"
                  : "Learning reset"}
            </p>
            <p
              className="report-statement"
              style={{ fontSize: 42, minHeight: 0, margin: "12px 0 20px" }}
            >
              {correctCount} / 4 correctly classified
            </p>
            <p
              className="decision-footnote"
              style={{ margin: "0 0 32px", fontSize: 15, maxWidth: 720 }}
            >
              {diagnosisOutcomeCopy[
                diagnosis === "unscored" ? "partial" : diagnosis
              ]}
            </p>
            {diagnosis === "reset" && !allCurrentCorrect ? (
              <button
                type="button"
                className="place-report"
                onClick={() => setConfirmed(false)}
              >
                Re-evaluate the reports
              </button>
            ) : (
              <button
                type="button"
                className="place-report"
                onClick={() => {
                  update({ currentPage: 6 });
                  navigate("/strategy");
                }}
              >
                Continue
              </button>
            )}
          </div>
        ) : null
      }
    />
  );
}
