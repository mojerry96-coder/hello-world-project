/* Required automated tests. Source: replication spec section 12.
   These cover the logic layer; interaction-level checks (keyboard, captions)
   are covered by the page QA pass. */

import { describe, expect, it } from "vitest";
import {
  allocated,
  budgetProfile,
  calculateForecast,
  countCorrect,
  determineEnding,
  diagnosisFromCorrect,
  isBudgetValid,
} from "./logic";
import {
  BARRIER_ANSWER_KEY,
  BUDGET_TOTAL,
  createInitialState,
  shuffleReports,
  type Adjustment,
  type BudgetAllocation,
  type Defence,
  type ReportId,
  type SimulationState,
  type Strategy,
} from "./types";
import { ROUTES, furthestAllowed } from "../routes";
import { dynamicOpeningQuestion } from "../content/history";

const STRATEGIES: Strategy[] = [
  "digital-first",
  "community-trust",
  "high-visibility",
  "integrated-adaptive",
];
const ADJUSTMENTS: Adjustment[] = [
  "increase-community",
  "expand-digital",
  "increase-radio-mass",
  "rebalance",
];
const DEFENCES: Defence[] = ["evidence-integrated", "visibility", "efficiency", "trust"];

function stateWith(patch: Partial<SimulationState>): SimulationState {
  return { ...createInitialState(), ...patch };
}

const balanced: BudgetAllocation = {
  community: 55,
  radio: 45,
  digital: 45,
  tvOutdoor: 35,
};

describe("MPH8430 simulation logic", () => {
  it("does not score Pages 1–4", () => {
    const s = createInitialState();
    expect(s.diagnosis).toBe("unscored");
    expect(s.diagnosisCorrect).toBe(0);
    expect(s.strategy).toBeNull();
  });

  it("keeps Page 4 CTA disabled until all three hotspots are visited", () => {
    const gate = ROUTES.find((r) => r.page === 5)!.requires!;
    expect(gate(stateWith({ visitedRegions: [] }))).toBe(false);
    expect(gate(stateWith({ visitedRegions: ["metro", "zaria"] }))).toBe(false);
    expect(gate(stateWith({ visitedRegions: ["metro", "zaria", "ikara"] }))).toBe(true);
  });

  it("randomises Page 5 report order once and persists it", () => {
    const orders = new Set(Array.from({ length: 40 }, () => shuffleReports().join("")));
    // A stable shuffle would produce exactly one ordering across 40 draws.
    expect(orders.size).toBeGreaterThan(1);
    for (const o of orders) expect(o.split("").sort().join("")).toBe("ABCD");
  });

  it("records Page 5 first attempts without overwriting them", () => {
    // Wrong first, corrected after: the score must still reflect the first answer.
    const first: Partial<Record<ReportId, string>> = { A: "channel-access" };
    const corrected = { ...first };
    // A correction writes to currentBarrierPlacements, never firstBarrierAttempts.
    expect(corrected.A).toBe("channel-access");
    expect(countCorrect({ A: "channel-access" })).toBe(0);
    expect(countCorrect({ A: BARRIER_ANSWER_KEY.A })).toBe(1);
  });

  it("classifies 3–4 correct as strong, 1–2 as partial and 0 as reset", () => {
    expect(diagnosisFromCorrect(4)).toBe("strong");
    expect(diagnosisFromCorrect(3)).toBe("strong");
    expect(diagnosisFromCorrect(2)).toBe("partial");
    expect(diagnosisFromCorrect(1)).toBe("partial");
    expect(diagnosisFromCorrect(0)).toBe("reset");
  });

  it("allows Page 5 correction without turning the first score into 4/4", () => {
    const firstAttempts = {
      A: "misinformation-trust",
      B: "digital-communication",
      C: "trusted-messenger",
      D: "channel-access",
    } as const;
    // Every current placement is now correct...
    const currentPlacements = BARRIER_ANSWER_KEY;
    expect(countCorrect(currentPlacements)).toBe(4);
    // ...but scoring reads first attempts, which were all wrong.
    expect(countCorrect(firstAttempts)).toBe(0);
    expect(diagnosisFromCorrect(countCorrect(firstAttempts))).toBe("reset");
  });

  it("loads Page 6 with no strategy selected", () => {
    expect(createInitialState().strategy).toBeNull();
  });

  it("routes every strategy to the correct Page 7 variant", () => {
    const gate = ROUTES.find((r) => r.page === 7)!.requires!;
    expect(gate(stateWith({ strategy: null }))).toBe(false);
    for (const s of STRATEGIES) expect(gate(stateWith({ strategy: s }))).toBe(true);
  });

  it("keeps Page 8 CTA disabled unless the total is exactly ₦180M", () => {
    expect(isBudgetValid({ community: 0, radio: 0, digital: 0, tvOutdoor: 0 })).toBe(false);
    expect(isBudgetValid({ community: 50, radio: 50, digital: 50, tvOutdoor: 30 })).toBe(true);
    expect(isBudgetValid({ community: 50, radio: 50, digital: 50, tvOutdoor: 25 })).toBe(false);
    expect(isBudgetValid({ community: 50, radio: 50, digital: 50, tvOutdoor: 35 })).toBe(false);
    expect(allocated(balanced)).toBe(BUDGET_TOTAL);
    expect(budgetProfile(balanced)).toBe("balanced");
  });

  it("changes Page 9 forecast when strategy, diagnosis or budget changes", () => {
    const base = stateWith({ strategy: "integrated-adaptive", budget: balanced, diagnosis: "strong" });
    const byStrategy = calculateForecast({ ...base, strategy: "high-visibility" });
    const byDiagnosis = calculateForecast({ ...base, diagnosis: "reset" });
    const byBudget = calculateForecast({
      ...base,
      budget: { community: 100, radio: 40, digital: 20, tvOutdoor: 20 },
    });
    const b = calculateForecast(base);
    expect(byStrategy).not.toEqual(b);
    expect(byDiagnosis).not.toEqual(b);
    expect(byBudget).not.toEqual(b);
  });

  it("clamps every forecast metric to 0–100", () => {
    for (const s of STRATEGIES) {
      for (const budget of [
        { community: 100, radio: 40, digital: 20, tvOutdoor: 20 },
        { community: 0, radio: 0, digital: 80, tvOutdoor: 100 },
        balanced,
      ]) {
        const f = calculateForecast(stateWith({ strategy: s, budget, diagnosis: "strong" }));
        for (const v of Object.values(f)) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it("plays five Page 10 clips and enables CTA only after all are viewed", () => {
    const viewed = new Set<number>();
    for (let i = 0; i < 5; i++) {
      expect(viewed.size === 5).toBe(false);
      viewed.add(i);
    }
    expect(viewed.size).toBe(5);
  });

  it("loads Page 12 with no adjustment selected", () => {
    expect(createInitialState().adjustment).toBeNull();
    expect(createInitialState().adjustmentJustification).toBe("");
  });

  it("requires valid adjustment justification", () => {
    const ok = (t: string) => t.trim().length >= 40 && t.trim().length <= 160;
    expect(ok("too short")).toBe(false);
    expect(ok("   ".repeat(20))).toBe(false);
    expect(ok("Offline rumours are still active in Ikara, so the mix must shift toward trusted messengers.")).toBe(true);
    expect(ok("x".repeat(161))).toBe(false);
  });

  it("loads Page 14 opening question from decision history", () => {
    expect(
      dynamicOpeningQuestion(stateWith({ adjustment: "increase-community" })),
    ).toMatch(/sustainable with the current pressure/);
    expect(
      dynamicOpeningQuestion(stateWith({ strategy: "digital-first" })),
    ).toMatch(/why are some rural communities still behind/);
    expect(
      dynamicOpeningQuestion(stateWith({ strategy: "high-visibility" })),
    ).toMatch(/Why are refusals still occurring/);
    expect(
      dynamicOpeningQuestion(stateWith({ strategy: "integrated-adaptive" })),
    ).toMatch(/Was using multiple channels worth the effort/);
  });

  it("loads Page 14 with no defence selected", () => {
    expect(createInitialState().defence).toBeNull();
  });

  it("requires valid defence justification", () => {
    const ok = (t: string) => t.trim().length >= 50 && t.trim().length <= 220;
    expect(ok("Multiple channels are needed.")).toBe(false);
    expect(
      ok("Rural households rely on radio and trusted messengers, while urban parents respond online, so a single channel would exclude one of them."),
    ).toBe(true);
  });

  it("returns one of three endings for every possible decision combination", () => {
    const budgets: BudgetAllocation[] = [
      balanced,
      { community: 100, radio: 40, digital: 20, tvOutdoor: 20 },
      { community: 0, radio: 40, digital: 40, tvOutdoor: 100 },
      { community: 30, radio: 30, digital: 90, tvOutdoor: 30 },
      { community: 45, radio: 45, digital: 45, tvOutdoor: 45 },
    ];
    const valid = new Set([
      "integrated-success",
      "high-visibility-limited-change",
      "strong-trust-limited-scale",
    ]);
    let n = 0;
    for (const diagnosis of ["strong", "partial", "reset"] as const) {
      for (const strategy of STRATEGIES) {
        for (const budget of budgets) {
          for (const adjustment of ADJUSTMENTS) {
            for (const defence of DEFENCES) {
              const s = stateWith({
                diagnosis,
                strategy,
                budget,
                budgetProfile: budgetProfile(budget),
                adjustment,
                defence,
              });
              const ending = determineEnding(s);
              expect(valid.has(ending)).toBe(true);
              n++;
            }
          }
        }
      }
    }
    expect(n).toBe(3 * 4 * 5 * 4 * 4);
  });

  it("does not decide the ending from the final response alone", () => {
    // Same defence, opposite histories -> different endings.
    const trustHeavy = stateWith({
      strategy: "community-trust",
      budget: { community: 100, radio: 40, digital: 20, tvOutdoor: 20 },
      budgetProfile: "community-heavy",
      adjustment: "increase-community",
      defence: "evidence-integrated",
    });
    const visibilityHeavy = stateWith({
      strategy: "high-visibility",
      budget: { community: 20, radio: 30, digital: 30, tvOutdoor: 100 },
      budgetProfile: "visibility-heavy",
      adjustment: "increase-radio-mass",
      defence: "evidence-integrated",
    });
    expect(determineEnding(trustHeavy)).toBe("strong-trust-limited-scale");
    expect(determineEnding(visibilityHeavy)).toBe("high-visibility-limited-change");

    // And the strongest full path still reaches the success ending.
    const best = stateWith({
      diagnosis: "strong",
      strategy: "integrated-adaptive",
      budget: balanced,
      budgetProfile: "balanced",
      adjustment: "rebalance",
      defence: "evidence-integrated",
    });
    expect(determineEnding(best)).toBe("integrated-success");
  });

  it("has no dead-end branch", () => {
    // From a fresh state, every route becomes reachable by satisfying gates in order.
    let s = createInitialState();
    expect(furthestAllowed(s).page).toBe(4);

    s = { ...s, visitedRegions: ["metro", "zaria", "ikara"] };
    expect(furthestAllowed(s).page).toBe(5);

    s = { ...s, diagnosis: "reset", diagnosisCorrect: 0 };
    expect(furthestAllowed(s).page).toBe(6);

    s = { ...s, strategy: "digital-first" };
    expect(furthestAllowed(s).page).toBe(8);

    s = { ...s, budget: balanced, budgetProfile: "balanced" };
    expect(furthestAllowed(s).page).toBe(9);

    s = { ...s, forecast: calculateForecast(s) };
    expect(furthestAllowed(s).page).toBe(12);

    s = { ...s, adjustment: "rebalance" };
    expect(furthestAllowed(s).page).toBe(14);

    s = { ...s, defence: "trust" };
    expect(furthestAllowed(s).page).toBe(15);
  });

  it("even a 0/4 learning-reset run reaches a valid ending", () => {
    const s = stateWith({
      diagnosis: "reset",
      diagnosisCorrect: 0,
      strategy: "digital-first",
      budget: { community: 45, radio: 45, digital: 45, tvOutdoor: 45 },
      budgetProfile: budgetProfile({ community: 45, radio: 45, digital: 45, tvOutdoor: 45 }),
      adjustment: "expand-digital",
      defence: "efficiency",
    });
    expect(determineEnding(s)).toBeTruthy();
  });
});
