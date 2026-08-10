/* Decision-history display labels and the Page 14 content tables.
   Values come from persisted state — never from hardcoded examples. */

import type { Adjustment, Defence, SimulationState, Strategy } from "../state/types";

export const strategyLabels: Record<Strategy, string> = {
  "digital-first": "DIGITAL-FIRST",
  "community-trust": "COMMUNITY TRUST",
  "high-visibility": "HIGH VISIBILITY",
  "integrated-adaptive": "INTEGRATED ADAPTIVE",
};

export const adjustmentLabels: Record<Adjustment, string> = {
  "increase-community": "INCREASE COMMUNITY MOBILISATION",
  "expand-digital": "EXPAND DIGITAL MISINFORMATION RESPONSE",
  "increase-radio-mass": "INCREASE RADIO & MASS COMMUNICATION",
  rebalance: "REBALANCE COMMUNICATION CHANNELS",
};

export function historyLabels(state: SimulationState) {
  const diagnosis =
    state.diagnosis === "strong"
      ? `STRONG — ${state.diagnosisCorrect}/4 FIRST ATTEMPTS`
      : state.diagnosis === "partial"
        ? `PARTIAL — ${state.diagnosisCorrect}/4 FIRST ATTEMPTS`
        : "LEARNING RESET — 0/4 FIRST ATTEMPTS";

  return {
    diagnosis,
    strategy: state.strategy ? strategyLabels[state.strategy] : "—",
    budget: String(state.budgetProfile).replaceAll("-", " ").toUpperCase(),
    adjustment: state.adjustment ? adjustmentLabels[state.adjustment] : "—",
  };
}

/** Chosen from accumulated history, not from the final answer. */
export function dynamicOpeningQuestion(state: SimulationState): string {
  if (state.adjustment === "increase-community" || state.budget.community >= 70) {
    return "Is this campaign sustainable with the current pressure on community teams?";
  }
  if (state.strategy === "digital-first" || state.budget.digital >= 65) {
    return "Urban results are improving, but why are some rural communities still behind?";
  }
  if (
    state.strategy === "high-visibility" ||
    state.budget.tvOutdoor >= 60 ||
    state.adjustment === "increase-radio-mass"
  ) {
    return "Messages have reached many people. Why are refusals still occurring?";
  }
  return "Your approach is complex. Was using multiple channels worth the effort?";
}

export const UNIVERSAL_QUESTION =
  "Why should we continue funding multiple communication channels when one channel may reach more people at lower cost?";

export const defences: Record<
  Defence,
  { letter: string; heading: string; label: string; argument: string; feedback: string }
> = {
  "evidence-integrated": {
    letter: "A",
    heading: "EVIDENCE + INTEGRATION",
    label: "EVIDENCE-BASED INTEGRATED ARGUMENT",
    argument:
      "Different communities require different communication approaches. Digital channels enable rapid dissemination, while community-based channels address trust and misinformation. A multi-channel strategy ensures no key population group is excluded.",
    feedback: "Strongest response. Stakeholders approve continued integrated funding.",
  },
  visibility: {
    letter: "B",
    heading: "VISIBILITY",
    label: "VISIBILITY-FOCUSED ARGUMENT",
    argument:
      "Visibility increases awareness and demonstrates government action, but awareness alone does not address behavioural drivers of vaccine uptake.",
    feedback:
      "Limited effectiveness. Stakeholders request stronger evidence of behavioural impact.",
  },
  efficiency: {
    letter: "C",
    heading: "EFFICIENCY",
    label: "EFFICIENCY-FOCUSED ARGUMENT",
    argument:
      "While cost efficiency is important, the lowest-cost approach may not achieve desired behaviour change across diverse populations.",
    feedback:
      "Moderate effectiveness. Stakeholders request clearer evidence of impact across LGAs.",
  },
  trust: {
    letter: "D",
    heading: "TRUST",
    label: "TRUST-FOCUSED ARGUMENT",
    argument:
      "Trust-building is essential for vaccine acceptance, particularly in hesitant communities. However, trust strategies are most effective when combined with wider communication channels that ensure reach and reinforcement.",
    feedback:
      "Strong but incomplete. Stakeholders support community engagement but question scalability.",
  },
};
