/* SimulationState. Source: replication spec section 5, reproduced exactly. */

export type RegionId = "metro" | "zaria" | "ikara";
export type ReportId = "A" | "B" | "C" | "D";

export type Barrier =
  | "misinformation-trust"
  | "trusted-messenger"
  | "digital-communication"
  | "channel-access"
  | "not-primary";

export type Strategy =
  | "digital-first"
  | "community-trust"
  | "high-visibility"
  | "integrated-adaptive";

export type Adjustment =
  | "increase-community"
  | "expand-digital"
  | "increase-radio-mass"
  | "rebalance";

export type Defence = "evidence-integrated" | "visibility" | "efficiency" | "trust";

export type Ending =
  | "integrated-success"
  | "high-visibility-limited-change"
  | "strong-trust-limited-scale";

export interface BudgetAllocation {
  community: number;
  radio: number;
  digital: number;
  tvOutdoor: number;
}

export type BudgetProfile =
  | "unallocated"
  | "balanced"
  | "community-heavy"
  | "radio-heavy"
  | "digital-heavy"
  | "visibility-heavy"
  | "mixed";

export interface Forecast {
  trust: number;
  reach: number;
  misinformationControl: number;
  visibility: number;
  workforcePressure: number;
}

export interface SimulationState {
  schemaVersion: 1;
  currentPage: number;
  visitedRegions: RegionId[];
  reportOrder: ReportId[];
  /* First attempt is written once per report and never overwritten. Correction
     updates currentBarrierPlacements only, so a corrected 4/4 cannot rewrite
     the diagnosis the learner actually arrived at first. */
  firstBarrierAttempts: Partial<Record<ReportId, Barrier>>;
  currentBarrierPlacements: Partial<Record<ReportId, Barrier>>;
  diagnosisCorrect: number;
  diagnosis: "unscored" | "strong" | "partial" | "reset";
  strategy: Strategy | null;
  budget: BudgetAllocation;
  budgetProfile: BudgetProfile;
  forecast: Forecast | null;
  adjustment: Adjustment | null;
  adjustmentJustification: string;
  defence: Defence | null;
  defenceJustification: string;
  ending: Ending | null;
  audioMuted: boolean;
  captionsEnabled: boolean;
  reducedMotion: boolean;
}

export const STORAGE_KEY = "mph8430-right-message-right-channel-v1";

/* Budget is held in ₦ millions throughout, matching the spec's allocation
   formulas. Format for display with formatNaira(). */
export const BUDGET_TOTAL = 180;
export const BUDGET_STEP = 5;
export const CHANNEL_MAX = 100;

/** Answer key. Source: SDD page 5, confirmed against replication spec. */
export const BARRIER_ANSWER_KEY: Record<ReportId, Barrier> = {
  A: "digital-communication",
  B: "misinformation-trust",
  C: "channel-access",
  D: "trusted-messenger",
};

export function createInitialState(): SimulationState {
  return {
    schemaVersion: 1,
    currentPage: 1,
    visitedRegions: [],
    reportOrder: shuffleReports(),
    firstBarrierAttempts: {},
    currentBarrierPlacements: {},
    diagnosisCorrect: 0,
    diagnosis: "unscored",
    strategy: null,
    budget: { community: 0, radio: 0, digital: 0, tvOutdoor: 0 },
    budgetProfile: "unallocated",
    forecast: null,
    adjustment: null,
    adjustmentJustification: "",
    defence: null,
    defenceJustification: "",
    ending: null,
    audioMuted: false,
    captionsEnabled: false,
    reducedMotion:
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  };
}

/** Randomised once at first run, then persisted so the order is stable on resume. */
export function shuffleReports(): ReportId[] {
  const ids: ReportId[] = ["A", "B", "C", "D"];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}
