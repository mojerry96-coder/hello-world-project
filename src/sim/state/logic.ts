/* Scoring, budget, forecast and ending logic.
   Source: replication spec sections on Pages 05, 08, 09 and the ending engine.
   Every formula here is reproduced from the spec verbatim. */

import {
  BARRIER_ANSWER_KEY,
  BUDGET_TOTAL,
  type Barrier,
  type BudgetAllocation,
  type BudgetProfile,
  type Ending,
  type Forecast,
  type ReportId,
  type SimulationState,
  type Strategy,
} from "./types";

/* ---------- Page 05: diagnosis ---------- */

/** Scored from the FIRST attempt at each report, never the corrected placement. */
export function countCorrect(
  attempts: Partial<Record<ReportId, Barrier>>,
): number {
  return (Object.keys(BARRIER_ANSWER_KEY) as ReportId[]).filter(
    (id) => attempts[id] === BARRIER_ANSWER_KEY[id],
  ).length;
}

export function diagnosisFromCorrect(
  correct: number,
): SimulationState["diagnosis"] {
  if (correct >= 3) return "strong";
  if (correct >= 1) return "partial";
  return "reset";
}

/* ---------- Page 08: budget ---------- */

export function allocated(budget: BudgetAllocation): number {
  return budget.community + budget.radio + budget.digital + budget.tvOutdoor;
}

export function isBudgetValid(budget: BudgetAllocation): boolean {
  return allocated(budget) === BUDGET_TOTAL;
}

export function budgetProfile(b: BudgetAllocation): BudgetProfile {
  const totalIsValid = allocated(b) === BUDGET_TOTAL;
  if (!totalIsValid) return "unallocated";

  const balanced =
    b.community >= 45 &&
    b.community <= 65 &&
    b.radio >= 35 &&
    b.radio <= 55 &&
    b.digital >= 30 &&
    b.digital <= 50 &&
    b.tvOutdoor >= 20 &&
    b.tvOutdoor <= 40;

  if (balanced) return "balanced";
  if (b.community >= 70) return "community-heavy";
  if (b.radio >= 65) return "radio-heavy";
  if (b.digital >= 65) return "digital-heavy";
  if (b.tvOutdoor >= 60) return "visibility-heavy";
  return "mixed";
}

/** ₦45M / ₦180M — millions, no decimals. */
export function formatNaira(millions: number): string {
  return `₦${millions}M`;
}

/* ---------- Page 09: forecast ---------- */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function strategyModifier(strategy: Strategy | null) {
  if (strategy === "digital-first") {
    return { trust: -4, reach: 8, misinformation: 16, visibility: 5, workforce: -5 };
  }
  if (strategy === "community-trust") {
    return { trust: 16, reach: -5, misinformation: -4, visibility: -4, workforce: 16 };
  }
  if (strategy === "high-visibility") {
    return { trust: -8, reach: 11, misinformation: -6, visibility: 18, workforce: -4 };
  }
  return { trust: 10, reach: 10, misinformation: 10, visibility: 8, workforce: 6 };
}

export function calculateForecast(state: SimulationState): Forecast {
  const b = state.budget;
  const s = strategyModifier(state.strategy);
  const diagnosis =
    state.diagnosis === "strong" ? 8 : state.diagnosis === "partial" ? 2 : -6;

  return {
    trust: clamp(24 + b.community * 0.72 + b.radio * 0.12 + s.trust + diagnosis, 0, 100),
    reach: clamp(
      20 + b.radio * 0.48 + b.digital * 0.3 + b.tvOutdoor * 0.42 + s.reach,
      0,
      100,
    ),
    misinformationControl: clamp(
      18 + b.digital * 0.78 + b.radio * 0.12 + s.misinformation + diagnosis,
      0,
      100,
    ),
    visibility: clamp(16 + b.tvOutdoor * 0.9 + b.digital * 0.18 + s.visibility, 0, 100),
    workforcePressure: clamp(18 + b.community * 0.88 + s.workforce, 0, 100),
  };
}

/* ---------- Page 15: ending engine ---------- */

export function endingScores(state: SimulationState) {
  let integrated = 0;
  let visibility = 0;
  let trust = 0;

  if (state.diagnosis === "strong") integrated += 1;
  if (state.strategy === "integrated-adaptive") integrated += 2;
  if (state.budgetProfile === "balanced") integrated += 2;
  if (state.adjustment === "rebalance") integrated += 2;
  if (state.defence === "evidence-integrated") integrated += 2;

  if (state.strategy === "high-visibility") visibility += 2;
  if (state.strategy === "digital-first") visibility += 1;
  if (state.budget.tvOutdoor >= 60) visibility += 2;
  else if (state.budget.tvOutdoor >= 50) visibility += 1;
  if (state.budget.community <= 30) visibility += 1;
  if (
    state.adjustment === "increase-radio-mass" ||
    state.adjustment === "expand-digital"
  ) {
    visibility += 1;
  }
  if (state.defence === "visibility" || state.defence === "efficiency") visibility += 1;

  if (state.strategy === "community-trust") trust += 2;
  if (state.strategy === "integrated-adaptive") trust += 1;
  if (state.budget.community >= 70) trust += 2;
  else if (state.budget.community >= 55) trust += 1;
  if (state.budget.digital + state.budget.tvOutdoor <= 50) trust += 1;
  if (state.adjustment === "increase-community") trust += 1;
  if (state.defence === "trust") trust += 1;

  return { integrated, visibility, trust };
}

/** Always resolves. No decision combination can dead-end. */
export function determineEnding(state: SimulationState): Ending {
  const score = endingScores(state);

  if (score.integrated >= 7) return "integrated-success";
  if (score.visibility > score.trust) return "high-visibility-limited-change";
  if (score.trust > score.visibility) return "strong-trust-limited-scale";

  const scalableSpend = state.budget.digital + state.budget.radio + state.budget.tvOutdoor;
  return state.budget.community > scalableSpend * 0.55
    ? "strong-trust-limited-scale"
    : "high-visibility-limited-change";
}
