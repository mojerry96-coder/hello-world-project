/* DECISION PAGE CONTENT + HUD DERIVATION.

   One place that answers, for any decision screen: what does the HUD say, and
   what are the live campaign numbers behind it. The numbers come from the same
   coverage model StatusRail used, so the fluid pages report exactly what the
   scaled pages did. */

import {
  BASELINE,
  budgetRemainingAtWeek,
  CAMPAIGN_WEEKS,
  coverageAtWeek,
  IKARA_TARGET,
  weekForPage,
} from "../state/coverage";
import { useSimulation } from "../state/store";
import type { MetricSpec } from "../components/DecisionPage";

export const TOTAL_PAGES = 15;

export type DecisionMeta = {
  page: number;
  kicker: string;
  title: string;
  image: string;
  imageId: string;
  imageAlt: string;
  imagePosition?: string;
  reportLabel: string;
};

export const decisionPages: Record<number, DecisionMeta> = {
  5: {
    page: 5,
    kicker: "DECISION 01 / 05",
    title: "Classify communication barriers",
    image: "p05-barriers-room.webp",
    imageId: "IMG-05",
    imageAlt:
      "Kaduna field coordination room. Printed community reports spread across a table beside a state map.",
    reportLabel: "FIELD REPORT",
  },
  6: {
    page: 6,
    kicker: "DECISION 02 / 05",
    title: "Select communication strategy",
    image: "p06-strategy-room.webp",
    imageId: "IMG-06",
    imageAlt:
      "Kaduna SPHCDA campaign planning session. Four public-health staff lean over a large printed state map, comparing field photographs, radio notes and smartphones.",
    reportLabel: "PROGRAMME DIRECTOR",
  },
  8: {
    page: 8,
    kicker: "DECISION 03 / 05",
    title: "Allocate the ₦180M budget",
    image: "p08-budget-room.webp",
    imageId: "IMG-08",
    imageAlt:
      "Kaduna SPHCDA financial and communication strategy room, with printed budget papers, a state coverage map and campaign material across the table.",
    reportLabel: "FINANCE BRIEF",
  },
  12: {
    page: 12,
    kicker: "DECISION 04 / 05",
    title: "Adapt weeks 7–10",
    image: "p12-adjustment-room.webp",
    imageId: "IMG-12",
    imageAlt:
      "Kaduna strategy room. A large paper map with Ikara and rural LGAs marked on the left; the Programme Director and three staff discuss field reports on the right.",
    reportLabel: "WEEK 6 REVIEW",
  },
  14: {
    page: 14,
    kicker: "DECISION 05 / 05",
    title: "Defend the strategy",
    image: "p14-strategy-defence.webp",
    imageId: "IMG-14",
    imageAlt:
      "Formal Kaduna State Ministry of Health briefing room seen from behind the Health Communication Officer. Four stakeholders face the learner with attentive, challenging expressions.",
    imagePosition: "50% 28%",
    reportLabel: "STAKEHOLDER QUESTION",
  },
};

/** HUD identity, stage, budget, metrics and progress for a decision page. */
export function useDecisionHud(page: number) {
  const { state } = useSimulation();
  const meta = decisionPages[page];
  const week = weekForPage(page);
  const coverage = coverageAtWeek(state, week);

  const metrics: MetricSpec[] = [
    {
      label: "Metro",
      display: `${Math.round(coverage.metro)}%`,
      fill: coverage.metro / 100,
    },
    {
      label: "Zaria",
      display: `${Math.round(coverage.zaria)}%`,
      fill: coverage.zaria / 100,
    },
    {
      label: "Ikara",
      display: `${Math.round(coverage.ikara)}%`,
      fill: coverage.ikara / 100,
      warning: coverage.ikara < IKARA_TARGET,
    },
  ];

  return {
    image: meta.image,
    imageId: meta.imageId,
    imageAlt: meta.imageAlt,
    imagePosition: meta.imagePosition,
    kicker: meta.kicker,
    title: meta.title,
    reportLabel: meta.reportLabel,
    stage: {
      label: "Campaign week",
      value: week === 0 ? "PLANNING" : `WK ${week} / ${CAMPAIGN_WEEKS}`,
    },
    budget: {
      label: "Budget remaining",
      value: `₦${budgetRemainingAtWeek(week)}M`,
    },
    metrics,
    progress: { current: page, total: TOTAL_PAGES },
    baseline: BASELINE,
  };
}
