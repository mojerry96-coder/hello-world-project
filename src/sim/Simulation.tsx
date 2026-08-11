/* The simulation shell. Runs entirely client-side (mounted behind <ClientOnly>
   in the route) so localStorage-backed state and Math.random shuffles never run
   during SSR. Responsibilities ported from the standalone app's App.tsx:
   resolve the current route from the URL, enforce the `requires` gate, and
   render the matching page inside the fixed-scale Artboard. */

import { useEffect, useState } from "react";
import { Artboard } from "./components/Artboard";
import { StatusRail } from "./components/StatusRail";
import { ActCard } from "./components/ActCard";
import { actForPage } from "./content/story";
import { useNavigate } from "./lib/navigate";
import { ROUTES, furthestAllowed } from "./routes";
import { useSimulation } from "./state/store";

import Page01Opening from "./pages/Page01Opening";
import Page02Mission from "./pages/Page02Mission";
import Page03Baseline from "./pages/Page03Baseline";
import Page04FieldEvidence from "./pages/Page04FieldEvidence";
import Page05Barriers from "./pages/Page05Barriers";
import Page06Strategy from "./pages/Page06Strategy";
import Page07Consequence from "./pages/Page07Consequence";
import Page08Budget from "./pages/Page08Budget";
import Page09Forecast from "./pages/Page09Forecast";
import Page10CampaignMotion from "./pages/Page10CampaignMotion";
import Page11WeekSix from "./pages/Page11WeekSix";
import Page12Adjustment from "./pages/Page12Adjustment";
import Page13Briefing from "./pages/Page13Briefing";
import Page14Defence from "./pages/Page14Defence";
import Page15Outcome from "./pages/Page15Outcome";
import PageIntro from "./pages/PageIntro";

const PAGES = [
  Page01Opening,
  Page02Mission,
  Page03Baseline,
  Page04FieldEvidence,
  Page05Barriers,
  Page06Strategy,
  Page07Consequence,
  Page08Budget,
  Page09Forecast,
  Page10CampaignMotion,
  Page11WeekSix,
  Page12Adjustment,
  Page13Briefing,
  Page14Defence,
  Page15Outcome,
] as const;

export function Simulation({ page }: { page: string }) {
  const { state } = useSimulation();
  const navigate = useNavigate();

  // The orientation brief sits outside the fifteen scored pages: it carries no
  // route guard, records no state and is replayable from Page 1.
  const isIntro = page === "intro";

  const route = ROUTES.find((r) => r.path === "/" + page);
  const blocked = !isIntro && (!route || (route.requires ? !route.requires(state) : false));

  useEffect(() => {
    if (isIntro) return;
    if (blocked && route) {
      navigate(furthestAllowed(state).path);
    } else if (!route) {
      navigate("/opening");
    }
  }, [isIntro, blocked, route, state, navigate]);

  if (isIntro) {
    return (
      <Artboard>
        <PageIntro />
      </Artboard>
    );
  }

  if (!route || blocked) {
    // Render a neutral stage while the guard redirect resolves; never show
    // locked content.
    return <div className="viewport" />;
  }

  const Page = PAGES[route.page - 1];
  return (
    <Artboard>
      <Page />
      {/* Campaign status sits above every page from the baseline onward. Pages 1
          and 2 are the cold open and the assignment — there is no campaign to
          report yet, and a rail there would undercut the title. */}
      {route.page >= 3 && <StatusRail page={route.page} />}
      <ActBreak page={route.page} />
    </Artboard>
  );
}

/** Shows an act card once per act, per run, before the page behind it. */
function ActBreak({ page }: { page: number }) {
  const { state, apply } = useSimulation();
  const act = actForPage(page);
  const [dismissed, setDismissed] = useState(false);

  if (!act || dismissed || state.actsSeen.includes(act.n)) return null;

  return (
    <ActCard
      act={act}
      onDone={() => {
        setDismissed(true);
        apply((s) =>
          s.actsSeen.includes(act.n)
            ? {}
            : { actsSeen: [...s.actsSeen, act.n] },
        );
      }}
    />
  );
}
