/* PAGE 15 CAMPAIGN ARCHIVE.
   The discs and captions are derived from the learner's own run, reusing the
   same label sources as the debrief rows so nothing can drift. */

import { historyLabels, adjustmentLabels } from "./history";
import { fieldEvidence, reports, strategies } from "./pages";
import type { Ending, SimulationState } from "../state/types";

export const endingScenes: Record<
  Ending,
  { imgId: string; src: string; alt: string; titleLines: [string, string] }
> = {
  "integrated-success": {
    imgId: "IMG-15A",
    src: "p15-integrated-success.webp",
    alt: "A busy Kaduna immunisation clinic after an effective integrated campaign. Health workers vaccinate children while mothers ask questions and receive clear responses.",
    titleLines: ["INTEGRATED CHANNEL STRATEGY", "CAMPAIGN SUCCEEDS"],
  },
  "high-visibility-limited-change": {
    imgId: "IMG-15B",
    src: "p15-high-visibility.webp",
    alt: "Urban Kaduna with highly visible campaign billboards and television coverage, while rural families remain uncertain at a clinic edge.",
    titleLines: ["HIGH VISIBILITY", "LIMITED BEHAVIOUR CHANGE"],
  },
  "strong-trust-limited-scale": {
    imgId: "IMG-15C",
    src: "p15-strong-trust.webp",
    alt: "A community immunisation session in rural Ikara. A community health worker and respected leader speak confidently with mothers and elders, but only a small group is present.",
    titleLines: ["STRONG TRUST", "LIMITED SCALE"],
  },
};

const STRATEGY_SCENE: Record<string, string> = {
  "digital-first": "p07-digital-first.webp",
  "community-trust": "p07-community-trust.webp",
  "high-visibility": "p07-high-visibility.webp",
  "integrated-adaptive": "p07-integrated-adaptive.webp",
};

export type ArchiveEntry = {
  id: string;
  /** Media filename inside public/media. */
  src: string;
  title: string;
  description: string;
};

function mediaUrl(src: string) {
  return `${import.meta.env.BASE_URL}media/${src}`;
}

export function archiveImageUrl(entry: ArchiveEntry) {
  return mediaUrl(entry.src);
}

export function buildArchive(state: SimulationState): ArchiveEntry[] {
  const h = historyLabels(state);
  const strategy = state.strategy
    ? strategies.find((s) => s.id === state.strategy)
    : undefined;
  const ending = state.ending ? endingScenes[state.ending] : undefined;

  const entries: ArchiveEntry[] = [
    {
      id: "opening",
      src: "p01-clinic-cold-open-poster.webp",
      title: "Opening",
      description: "The morning the coverage gap stopped being a number.",
    },
    {
      id: "mission",
      src: "p02-mission-room.webp",
      title: "Mission briefing",
      description: "Raise MCV2 coverage across Kaduna State in ten weeks.",
    },
    {
      id: "baseline",
      src: "p03-kaduna-metro.webp",
      title: "Campaign baseline",
      description: "Metro 70% · Zaria 45% · Ikara 38% before you acted.",
    },
    {
      id: "evidence",
      src: "p04-evidence-map.webp",
      title: "Field evidence",
      description: `${state.visitedRegions.length} of 3 locations reviewed on the evidence map.`,
    },
  ];

  // One disc per region the learner actually opened, using that region's report image.
  const regionReport: Record<string, keyof typeof reports> = {
    metro: "A",
    ikara: "B",
    zaria: "D",
  };
  state.visitedRegions.forEach((region) => {
    const reportId = regionReport[region];
    const report = reportId ? reports[reportId] : undefined;
    if (!report) return;
    entries.push({
      id: `region-${region}`,
      src: report.src,
      title: fieldEvidence[region].title,
      description: `${fieldEvidence[region].summary} · Diagnosis ${h.diagnosis}`,
    });
  });

  entries.push(
    {
      id: "strategy",
      src: state.strategy ? STRATEGY_SCENE[state.strategy] : "p06-strategy-room.webp",
      title: "Strategy",
      description: strategy
        ? `${h.strategy} — ${strategy.channels}`
        : "No strategy recorded.",
    },
    {
      id: "budget",
      src: "p08-budget-room.webp",
      title: "Allocation",
      description: `${h.budget} — community ₦${state.budget.community}M · radio ₦${state.budget.radio}M · digital ₦${state.budget.digital}M · TV/outdoor ₦${state.budget.tvOutdoor}M`,
    },
    {
      id: "forecast",
      src: "p09-impact-forecast.webp",
      title: "Impact forecast",
      description: state.forecast
        ? `Trust ${state.forecast.trust}% · Reach ${state.forecast.reach}% · Misinformation control ${state.forecast.misinformationControl}%`
        : "No forecast recorded.",
    },
    {
      id: "week-six",
      src: "p11-week-six-room.webp",
      title: "Week 6 update",
      description: state.adjustment
        ? adjustmentLabels[state.adjustment]
        : "No adaptation recorded.",
    },
  );

  if (ending) {
    entries.push({
      id: "outcome",
      src: ending.src,
      title: "Outcome",
      description: `${ending.titleLines[0]} — ${ending.titleLines[1]}`,
    });
  }

  return entries;
}

/** Items in the shape the sphere expects, with resolved image URLs. */
export function archiveMenuItems(state: SimulationState) {
  return buildArchive(state).map((entry) => ({
    image: mediaUrl(entry.src),
    title: entry.title,
    description: entry.description,
  }));
}
