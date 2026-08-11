/* The coverage model backs the status rail, so it has to stay honest: the SDD's
   fixed points must survive, and the numbers the endings state must be the
   numbers the rail lands on. */

import { describe, expect, it } from "vitest";
import {
  BASELINE,
  CAMPAIGN_WEEKS,
  WEEK6,
  budgetRemainingAtWeek,
  childrenReached,
  coverageAtWeek,
  projectedChildren,
  weekForPage,
} from "./coverage";
import { createInitialState, type SimulationState } from "./types";

function run(patch: Partial<SimulationState>): SimulationState {
  return { ...createInitialState(), ...patch };
}

const balanced = { community: 55, radio: 45, digital: 45, tvOutdoor: 35 };

const strongRun = run({
  diagnosis: "strong",
  diagnosisCorrect: 4,
  strategy: "integrated-adaptive",
  budget: balanced,
  budgetProfile: "balanced",
  adjustment: "rebalance",
  defence: "evidence-integrated",
  ending: "integrated-success",
});

describe("campaign coverage", () => {
  it("starts every run at the SDD baseline", () => {
    expect(coverageAtWeek(run({}), 0)).toEqual(BASELINE);
    expect(BASELINE).toEqual({ metro: 70, zaria: 45, ikara: 38 });
  });

  it("holds the Week 6 checkpoint regardless of how well the learner played", () => {
    // The SDD is explicit that Ikara is still 38-40% at Week 6. A strong run
    // must not be allowed to flatter that number away.
    const best = coverageAtWeek(strongRun, 6);
    const worst = coverageAtWeek(
      run({ diagnosis: "reset", strategy: "high-visibility", ending: "high-visibility-limited-change" }),
      6,
    );
    expect(best).toEqual(WEEK6);
    expect(worst).toEqual(WEEK6);
    expect(WEEK6.ikara).toBeGreaterThanOrEqual(38);
    expect(WEEK6.ikara).toBeLessThanOrEqual(40);
  });

  it("lands on the figures each ending states", () => {
    expect(coverageAtWeek(strongRun, CAMPAIGN_WEEKS)).toMatchObject({
      metro: 82,
      ikara: 61,
    });
    expect(
      coverageAtWeek(run({ ending: "high-visibility-limited-change" }), CAMPAIGN_WEEKS),
    ).toMatchObject({ ikara: 44 });
  });

  it("never moves backwards through the campaign", () => {
    let previous = coverageAtWeek(strongRun, 0);
    for (let w = 1; w <= CAMPAIGN_WEEKS; w++) {
      const now = coverageAtWeek(strongRun, w);
      expect(now.ikara).toBeGreaterThanOrEqual(previous.ikara);
      expect(now.metro).toBeGreaterThanOrEqual(previous.metro);
      previous = now;
    }
  });

  it("shows a different trajectory for different decisions after week 6", () => {
    const integrated = coverageAtWeek(strongRun, 9);
    const visibility = coverageAtWeek(
      run({ ...strongRun, ending: "high-visibility-limited-change" }),
      9,
    );
    expect(integrated.ikara).not.toBe(visibility.ikara);
  });

  it("keeps planning pages at week zero and the outcome at week ten", () => {
    for (const p of [1, 3, 5, 8, 9]) expect(weekForPage(p)).toBe(0);
    expect(weekForPage(10)).toBe(5);
    expect(weekForPage(11)).toBe(6);
    expect(weekForPage(12)).toBe(6);
    expect(weekForPage(15)).toBe(CAMPAIGN_WEEKS);
  });

  it("draws the budget down to the SDD's 40% at week six", () => {
    expect(budgetRemainingAtWeek(0)).toBe(180);
    expect(budgetRemainingAtWeek(6)).toBe(72); // 40% of 180
    expect(budgetRemainingAtWeek(CAMPAIGN_WEEKS)).toBe(0);
  });

  it("reports zero children reached at the baseline, and more for a better run", () => {
    expect(childrenReached(BASELINE)).toBe(0);
    const strong = projectedChildren(strongRun);
    const weak = projectedChildren(
      run({ ...strongRun, ending: "high-visibility-limited-change" }),
    );
    expect(strong).toBeGreaterThan(weak);
    expect(weak).toBeGreaterThan(0);
  });
});
