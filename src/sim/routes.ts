/* The 15 numbered routes. Page 7 has four conditional designs but remains one
   route; Page 15 has three endings but remains one route. Spec section 1. */

export type RouteDef = {
  path: string;
  page: number;
  title: string;
  /** Learner may not reach this route until this predicate passes. */
  requires?: (s: import("./state/types").SimulationState) => boolean;
};

export const ROUTES: RouteDef[] = [
  { path: "/opening", page: 1, title: "Opening" },
  { path: "/mission", page: 2, title: "Mission Briefing" },
  { path: "/baseline", page: 3, title: "Campaign Baseline" },
  { path: "/field-evidence", page: 4, title: "Field Evidence Map" },
  {
    path: "/barriers",
    page: 5,
    title: "Classify Communication Barriers",
    requires: (s) => s.visitedRegions.length >= 3,
  },
  {
    path: "/strategy",
    page: 6,
    title: "Select Communication Strategy",
    requires: (s) => s.diagnosis !== "unscored",
  },
  {
    path: "/strategy-consequence",
    page: 7,
    title: "Strategy Consequence",
    requires: (s) => s.strategy !== null,
  },
  {
    path: "/budget",
    page: 8,
    title: "Allocate the ₦180M Budget",
    requires: (s) => s.strategy !== null,
  },
  {
    path: "/forecast",
    page: 9,
    title: "Conditional Impact Forecast",
    requires: (s) => s.budgetProfile !== "unallocated",
  },
  {
    path: "/campaign-motion",
    page: 10,
    title: "Campaign in Motion: Weeks 1–5",
    requires: (s) => s.forecast !== null,
  },
  {
    path: "/week-six",
    page: 11,
    title: "Week 6 Field Update",
    requires: (s) => s.forecast !== null,
  },
  {
    path: "/adjustment",
    page: 12,
    title: "Adapt Weeks 7–10",
    requires: (s) => s.forecast !== null,
  },
  {
    path: "/briefing-arrival",
    page: 13,
    title: "Friday Briefing Arrival",
    requires: (s) => s.adjustment !== null,
  },
  {
    path: "/defence",
    page: 14,
    title: "Defend the Strategy",
    requires: (s) => s.adjustment !== null,
  },
  {
    path: "/outcome",
    page: 15,
    title: "Campaign Outcome",
    requires: (s) => s.defence !== null,
  },
];

export const ROUTE_BY_PAGE = new Map(ROUTES.map((r) => [r.page, r]));

export function pathForPage(page: number): string {
  return ROUTE_BY_PAGE.get(page)?.path ?? "/opening";
}

/** Furthest route the learner is currently entitled to reach. */
export function furthestAllowed(
  s: import("./state/types").SimulationState,
): RouteDef {
  let last = ROUTES[0];
  for (const r of ROUTES) {
    if (r.requires && !r.requires(s)) break;
    last = r;
  }
  return last;
}
