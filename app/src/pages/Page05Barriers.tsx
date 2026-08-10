/* PAGE 05 — CLASSIFY COMMUNICATION BARRIERS.

   The scoring rule that matters: only the FIRST placement of each report counts.
   Corrections update currentBarrierPlacements and are encouraged for learning,
   but they can never turn a 2/4 first diagnosis into a 4/4 score. */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaSlot } from "../components/MediaSlot";
import { DecisionLabel, Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
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

export default function Page05Barriers() {
  const navigate = useNavigate();
  const { state, apply, update } = useSimulation();

  const order = state.reportOrder;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Barrier | null>(null);
  const [dragOver, setDragOver] = useState<Barrier | null>(null);
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

    // Move to the next report that has not been attempted yet.
    const nextUnplaced = order.findIndex(
      (id) => id !== report && !state.firstBarrierAttempts[id],
    );
    if (nextUnplaced !== -1) {
      window.setTimeout(() => setIdx(nextUnplaced), 900);
    }
  }

  function confirmDiagnosis() {
    update({
      diagnosisCorrect: correctCount,
      diagnosis,
      currentPage: 5,
    });
    setConfirmed(true);
  }

  function proceed() {
    update({ currentPage: 6 });
    navigate("/strategy");
  }

  const feedback = placedThis
    ? placedThis === reports[current].correct
      ? correctFeedback[current]
      : INCORRECT_FEEDBACK
    : "";

  return (
    <div className="page-enter">
      <MediaSlot
        id={reports[current].image}
        src={reports[current].src}
        alt={reports[current].alt}
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.34), transparent 44%, rgba(10,10,8,.78) 82%)"
      />

      <DecisionLabel decision="Decision 01" title="What is blocking uptake?" />

      <p
        style={box(
          { x: 1510, y: 32, w: 128, h: 22, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 16,
            lineHeight: "20px",
            textAlign: "right",
          }),
        )}
      >
        REPORT {idx + 1} / 4
      </p>

      {/* Report selector so corrections are reachable by mouse and keyboard. */}
      <div style={box({ x: 1470, y: 60, w: 168, h: 32, z: 20 }, { display: "flex", gap: 6, justifyContent: "flex-end" })}>
        {order.map((id, i) => (
          <button
            key={id}
            type="button"
            className="focusable"
            onClick={() => setIdx(i)}
            aria-label={`Go to report ${i + 1}${firstAttempts[id] ? ", placed" : ""}`}
            aria-current={i === idx}
            style={{
              width: 26,
              height: 26,
              cursor: "pointer",
              background: i === idx ? "rgba(180,93,43,.28)" : "rgba(12,12,10,.42)",
              border: `1px solid ${
                firstAttempts[id] ? "var(--accent-active)" : "var(--line-dark)"
              }`,
              color: "var(--cream)",
              fontSize: 12,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p
        style={box(
          { x: 70, y: 704, w: 920, h: 32, z: 20 },
          typeStyle("bodySmall", {
            color:
              placedThis === undefined
                ? "rgba(238,228,213,.78)"
                : placedThis === reports[current].correct
                  ? "var(--success)"
                  : "var(--error)",
          }),
        )}
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>

      {/* The report sentence is the draggable object. */}
      <p
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", current)}
        style={box(
          { x: 70, y: 748, w: 930, h: 38, z: 20 },
          {
            ...typeStyle("body", { fontSize: 19, lineHeight: 1.35 }),
            cursor: "grab",
          },
        )}
      >
        “{reports[current].text}”
      </p>

      <Shade
        frame={{ x: 0, y: 822, w: 1672, h: 82, z: 18 }}
        background="rgba(13,13,11,.82)"
      />

      {barrierZones.map((zone) => {
        const isSelected = selected === zone.id;
        const isFirstAttemptHere = firstAttempts[current] === zone.id;
        return (
          <button
            key={zone.id}
            type="button"
            className="option focusable"
            data-selected={isSelected}
            aria-label={zone.full}
            onClick={() => (placedThis ? place(zone.id) : setSelected(zone.id))}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(zone.id);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              place(zone.id);
            }}
            style={box(
              { x: zone.x, y: 840, w: zone.w, h: 48, z: 20 },
              {
                ...typeStyle("bodySmall", {
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 400,
                  color: "var(--cream)",
                  textTransform: "uppercase",
                }),
                textAlign: "center",
                borderColor:
                  dragOver === zone.id
                    ? "var(--focus)"
                    : isFirstAttemptHere
                      ? "var(--accent-active)"
                      : undefined,
              },
            )}
          >
            {zone.short}
          </button>
        );
      })}

      <button
        type="button"
        className="focusable"
        disabled={
          allFirstAttemptsMade ? !resetSatisfied : selected === null
        }
        onClick={() => {
          if (allFirstAttemptsMade) confirmDiagnosis();
          else if (selected) place(selected);
        }}
        style={box(
          { x: 1446, y: 845, w: 192, h: 43, z: 20 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.34)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
          },
        )}
      >
        {allFirstAttemptsMade ? "CONFIRM DIAGNOSIS" : "PLACE REPORT"}
      </button>

      {/* Outcome panel. Shows the learner's real first-attempt score. */}
      {confirmed && (
        <div
          style={box(
            { x: 0, y: 0, w: 1672, h: 941, z: 40 },
            {
              background: "rgba(10,10,8,.90)",
              display: "grid",
              placeItems: "center",
              padding: 120,
            },
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Diagnosis outcome"
        >
          <div style={{ maxWidth: 860 }}>
            <p style={typeStyle("label")}>
              {diagnosis === "strong"
                ? "Strong Diagnosis"
                : diagnosis === "partial"
                  ? "Partial Diagnosis"
                  : "Learning Reset"}
            </p>
            <p style={typeStyle("displayM", { margin: "16px 0 24px" })}>
              {correctCount} / 4 correctly classified
            </p>
            <p style={typeStyle("body", { marginBottom: 40 })}>
              {diagnosisOutcomeCopy[diagnosis === "unscored" ? "partial" : diagnosis]}
            </p>
            {diagnosis === "reset" && !allCurrentCorrect ? (
              <button
                type="button"
                className="focusable"
                onClick={() => setConfirmed(false)}
                style={{
                  ...typeStyle("button"),
                  minHeight: 56,
                  padding: "0 28px",
                  background: "rgba(12,12,10,.44)",
                  border: "1px solid var(--cream)",
                  cursor: "pointer",
                }}
              >
                RE-EVALUATE THE REPORTS
              </button>
            ) : (
              <button
                type="button"
                className="primary-cta focusable"
                onClick={proceed}
                style={typeStyle("button")}
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
