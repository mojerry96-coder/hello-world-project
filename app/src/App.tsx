import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Artboard } from "./components/Artboard";
import { useSimulation } from "./state/store";
import { furthestAllowed, ROUTES } from "./routes";

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

const IMPLEMENTED: Record<number, React.ComponentType> = {
  1: Page01Opening,
  2: Page02Mission,
  3: Page03Baseline,
  4: Page04FieldEvidence,
  5: Page05Barriers,
  6: Page06Strategy,
  7: Page07Consequence,
  8: Page08Budget,
  9: Page09Forecast,
  10: Page10CampaignMotion,
  11: Page11WeekSix,
  12: Page12Adjustment,
  13: Page13Briefing,
  14: Page14Defence,
  15: Page15Outcome,
};

/** Blocks deep links past the learner's earned progress; never dead-ends. */
function Guard({ page, children }: { page: number; children: React.ReactNode }) {
  const { state } = useSimulation();
  const route = ROUTES.find((r) => r.page === page);
  if (route?.requires && !route.requires(state)) {
    return <Navigate to={furthestAllowed(state).path} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <Artboard>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/opening" replace />} />
        {ROUTES.map((r) => {
          const Impl = IMPLEMENTED[r.page];
          return (
            <Route
              key={r.path}
              path={r.path}
              element={
                <Guard page={r.page}>
                  <Impl />
                </Guard>
              }
            />
          );
        })}
        <Route path="*" element={<Navigate to="/opening" replace />} />
      </Routes>
    </Artboard>
  );
}
