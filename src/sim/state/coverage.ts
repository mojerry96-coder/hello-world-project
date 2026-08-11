/* Live campaign coverage.

   Until now coverage existed only as three numbers on Page 3 and three more in
   the endings. Nothing joined them, so the learner never saw a decision move a
   number. This module supplies that middle: a coverage figure for any week of
   the campaign, derived from the learner's own decisions.

   Two fixed points are non-negotiable and come straight from the SDD:
     - the baseline (Metro 70 / Zaria 45 / Ikara 38)
     - the Week 6 checkpoint, where Ikara is still stuck at 38-40% no matter how
       well the learner has played. Week 6 is the moment the campaign is
       supposed to look like it is failing in the rural LGAs; flattering it
       would destroy the lesson.

   Everything between and after those points interpolates toward the ending the
   learner is currently heading for. */

import { determineEnding } from "./logic";
import type { Ending, SimulationState } from "./types";

export type Coverage = { metro: number; zaria: number; ikara: number };

/** SDD scenario setup. */
export const BASELINE: Coverage = { metro: 70, zaria: 45, ikara: 38 };

/** SDD Week 6 monitoring dashboard: Metro improving, Ikara still 38-40%. */
export const WEEK6: Coverage = { metro: 76, zaria: 48, ikara: 39 };

/** Week 10 outcomes, matching the figures each ending states verbatim. */
const FINAL: Record<Ending, Coverage> = {
  // "Kaduna Metro coverage reaches 82% · Ikara uptake improves from 38% to 61%"
  "integrated-success": { metro: 82, zaria: 64, ikara: 61 },
  // "Metro improves moderately · Ikara increases from 38% to 44%"
  "high-visibility-limited-change": { metro: 78, zaria: 52, ikara: 44 },
  // "Ikara shows strong improvement · overall coverage grows slowly"
  "strong-trust-limited-scale": { metro: 74, zaria: 56, ikara: 58 },
};

/** Eligible children under five, by LGA. Used to express coverage as people. */
const ELIGIBLE: Coverage = { metro: 46_000, zaria: 28_000, ikara: 16_000 };

export const CAMPAIGN_WEEKS = 10;

/** The target the learner is playing against. */
export const IKARA_TARGET = 50;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function blend(a: Coverage, b: Coverage, t: number): Coverage {
  return {
    metro: Math.round(lerp(a.metro, b.metro, t)),
    zaria: Math.round(lerp(a.zaria, b.zaria, t)),
    ikara: Math.round(lerp(a.ikara, b.ikara, t)),
  };
}

/**
 * Where the campaign stands in a given week.
 *
 * Weeks 0-6 climb from the baseline to the fixed Week 6 checkpoint. Weeks 7-10
 * head for whichever ending the current decisions imply — so an adaptation made
 * on Page 12 visibly changes the trajectory before Page 15 confirms it.
 */
export function coverageAtWeek(state: SimulationState, week: number): Coverage {
  if (week <= 0) return BASELINE;
  if (week <= 6) return blend(BASELINE, WEEK6, week / 6);

  // Before the defence is entered the ending is still provisional; that is the
  // point — the learner should see where they are heading and be able to change it.
  const heading = state.ending ?? determineEnding(state);
  return blend(WEEK6, FINAL[heading], (week - 6) / 4);
}

/** Which campaign week a page represents. Planning pages are week zero. */
export function weekForPage(page: number): number {
  if (page <= 9) return 0; // briefing, diagnosis, strategy, budget, forecast
  if (page === 10) return 5; // the Weeks 1-5 montage ends at week 5
  if (page === 11 || page === 12) return 6; // the crossroads
  return CAMPAIGN_WEEKS; // briefing room and outcome are end-of-campaign
}

/** Naira millions still unspent. The SDD puts this at 40% by Week 6. */
export function budgetRemainingAtWeek(week: number): number {
  if (week <= 0) return 180;
  if (week <= 6) return Math.round(lerp(180, 72, week / 6));
  return Math.round(lerp(72, 0, (week - 6) / 4));
}

/** Additional children reached versus doing nothing, at a given coverage. */
export function childrenReached(c: Coverage): number {
  const gained =
    ELIGIBLE.metro * ((c.metro - BASELINE.metro) / 100) +
    ELIGIBLE.zaria * ((c.zaria - BASELINE.zaria) / 100) +
    ELIGIBLE.ikara * ((c.ikara - BASELINE.ikara) / 100);
  // Round to the nearest hundred: this is a projection, not a count.
  return Math.max(0, Math.round(gained / 100) * 100);
}

/** Projected children reached by the end of the campaign on current decisions. */
export function projectedChildren(state: SimulationState): number {
  return childrenReached(coverageAtWeek(state, CAMPAIGN_WEEKS));
}

export function formatChildren(n: number): string {
  return n.toLocaleString("en-NG");
}
