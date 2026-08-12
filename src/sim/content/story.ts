/* The through-line.

   The simulation already carries a recurring woman: she is in the opening film,
   in Field Report B, and in all three endings. She was never named, so learners
   read her as stock imagery rather than as the person their decisions affect.

   Naming her costs no new media and turns a coverage percentage into someone a
   student remembers. Her state is derived from Ikara's coverage, so she is a
   readout of the learner's actual performance, never decoration. */

import { BASELINE, IKARA_TARGET, type Coverage } from "../state/coverage";

export const HAUWA = {
  name: "Hauwa",
  child: "Musa",
  place: "Ikara",
} as const;

/** The one-sentence goal. Stated on the brief and restated at every act break. */
export const GOAL_LINE =
  `Lift Ikara above ${IKARA_TARGET}% in ten weeks — without burning out your health workers.`;

export const GOAL_SHORT = `Get Ikara above ${IKARA_TARGET}%`;

/**
 * Where Hauwa stands, read from Ikara's coverage.
 * Deliberately never triumphant: she is one household, and the campaign is
 * measured in whether households like hers change their minds.
 */
export function hauwaStatus(coverage: Coverage): string {
  const c = coverage.ikara;
  if (c <= BASELINE.ikara + 1) {
    return `${HAUWA.name} has walked to the clinic in ${HAUWA.place} three times. She still has not gone in.`;
  }
  if (c < 45) {
    return `${HAUWA.name} stopped at the clinic door this week and asked one question, then left.`;
  }
  if (c < IKARA_TARGET) {
    return `${HAUWA.name} has started asking her neighbours what they did. She has not decided.`;
  }
  if (c < 58) {
    return `${HAUWA.name} brought ${HAUWA.child} to the outreach point and waited her turn.`;
  }
  return `${HAUWA.name} brought ${HAUWA.child} in — and came back the following week with her sister.`;
}

/** The closing line, written to land before any statistic on Page 15. */
export function hauwaEnding(coverage: Coverage): string {
  const c = coverage.ikara;
  if (c >= 58) {
    return `${HAUWA.name} had ${HAUWA.child} vaccinated in week eight. She has since walked two other mothers to the same table.`;
  }
  if (c >= IKARA_TARGET) {
    return `${HAUWA.name} had ${HAUWA.child} vaccinated before the campaign closed. It took until week nine, and a neighbour she trusted.`;
  }
  if (c >= 44) {
    return `${HAUWA.name} came to the clinic in the final week and asked her question out loud. ${HAUWA.child} was not vaccinated before the campaign ended.`;
  }
  return `${HAUWA.name} never came in. ${HAUWA.child} was not vaccinated. She heard the campaign — it reached her radio, her market, her phone — and it did not answer the thing she was afraid of.`;
}

/* ---------- Acts ---------- */

export type Act = {
  n: number;
  numeral: string;
  title: string;
  premise: string;
  /** Page the card appears in front of. */
  atPage: number;
};

export const ACTS: Act[] = [
  {
    n: 1,
    numeral: "Act one",
    title: "Find out why",
    premise:
      "Nobody refuses for one reason. Work out which reason belongs to which community before you spend a naira.",
    atPage: 3,
  },
  {
    n: 2,
    numeral: "Act two",
    title: "Commit the money",
    premise:
      "₦180 million, four channels, ten weeks. Spend it, then watch the first five weeks play out.",
    atPage: 8,
  },
  {
    n: 3,
    numeral: "Act three",
    title: "Adapt, then answer for it",
    premise:
      "The field disagrees with your plan. Change course — then defend the whole campaign to the Commissioner.",
    atPage: 11,
  },
];

export function actForPage(page: number): Act | undefined {
  return ACTS.find((a) => a.atPage === page);
}
