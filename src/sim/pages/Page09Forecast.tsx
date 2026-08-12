/* PAGE 09 — CONDITIONAL IMPACT FORECAST.
   Explanatory, not a decision. Values are calculated from persisted state only,
   so two learners with different allocations never see the same result.
   Workforce pressure is a warning line, not a fifth "gain" bar. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { ChartLineUp } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { calculateForecast } from "../state/logic";
import { useSimulation } from "../state/store";
import { CountUp } from "../motion/CountUp";
import { projectedChildren } from "../state/coverage";
import { useCampaignHud } from "../content/decisionPages";
import type { Forecast, SimulationState } from "../state/types";

const BARS: { key: keyof Forecast; label: string }[] = [
  { key: "trust", label: "Trust" },
  { key: "reach", label: "Rural reach" },
  { key: "misinformationControl", label: "Misinformation control" },
  { key: "visibility", label: "Campaign visibility" },
];

function rationale(state: SimulationState, f: Forecast): string {
  switch (state.budgetProfile) {
    case "community-heavy":
      return "Trust is likely to improve, but workforce pressure is high.";
    case "radio-heavy":
      return "Rural reach improves, while deeply rooted misconceptions may need interpersonal support.";
    case "digital-heavy":
      return "Online response improves quickly, but low-digital communities remain at risk.";
    case "visibility-heavy":
      return "Awareness rises strongly, but trust and behaviour change may remain limited.";
    case "balanced":
      return "Resources are aligned with diverse communication needs across populations.";
    default: {
      // Mixed: name the strongest and weakest calculated metrics.
      const entries = BARS.map((b) => ({ label: b.label, value: f[b.key] }));
      const sorted = [...entries].sort((a, b) => b.value - a.value);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      return `${best.label.toLowerCase()} is your strongest projected gain at ${best.value}%, while ${worst.label.toLowerCase()} lags at ${worst.value}%.`;
    }
  }
}

export default function Page09Forecast() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const forecast = state.forecast ?? calculateForecast(state);
  const children = projectedChildren(state);
  const [animated, setAnimated] = useState(state.reducedMotion);
  const hud = useCampaignHud(9, "Impact forecast", "What your money buys");
  const animate = !state.reducedMotion;

  useEffect(() => {
    if (state.reducedMotion) return;
    const t = window.setTimeout(() => setAnimated(true), 60);
    return () => window.clearTimeout(t);
  }, [state.reducedMotion]);

  return (
    <NarrativePage
      scene={{
        image: "p09-impact-forecast.webp",
        imageId: "IMG-09",
        imageAlt:
          "Kaduna campaign analysis room. A communication officer stands at the right of a table with colleagues, studying a printed Kaduna map, a laptop and field photographs.",
        imagePosition: "70% 46%",
        treatment: "left",
      }}
      hud={{ icon: ChartLineUp, ...hud }}
      kicker="Conditional forecast"
      title={["WHAT YOUR ALLOCATION", "IS LIKELY TO CHANGE"]}
      lede={
        <>
          <span className="forecast-headline">
            <CountUp
              as="span"
              to={children}
              duration={1.4}
              className="forecast-figure"
            />
            <span className="forecast-figure-note">
              more children reached by week 10
            </span>
          </span>
          <span className="forecast-lede-note">{rationale(state, forecast)}</span>
        </>
      }
      note={
        <>
          Community ₦{state.budget.community}M · Radio ₦{state.budget.radio}M ·
          Digital ₦{state.budget.digital}M · TV/Outdoor ₦
          {state.budget.tvOutdoor}M
          {forecast.workforcePressure > 70 && (
            <span className="forecast-warning">
              Workforce pressure is projected at {forecast.workforcePressure}% —
              field teams are likely to be overstretched.
            </span>
          )}
        </>
      }
      aside={
        <div className="forecast-bars">
          {BARS.map((bar, i) => {
            const value = forecast[bar.key];
            return (
              <div
                key={bar.key}
                className="forecast-bar"
                style={
                  animate
                    ? { animationDelay: `${420 + i * 90}ms` }
                    : { animation: "none", opacity: 1 }
                }
              >
                <span className="forecast-bar-label">{bar.label}</span>
                <CountUp
                  as="span"
                  to={value}
                  suffix="%"
                  duration={0.9}
                  delay={0.08 * i}
                  className="forecast-bar-value"
                />
                <span className="figure-track">
                  <span
                    className="figure-fill"
                    style={{
                      width: `${animated ? value : 0}%`,
                      transition: state.reducedMotion
                        ? "none"
                        : "width 700ms ease-out",
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      }
      meta={
        <span>
          {state.budgetProfile.replaceAll("-", " ")} investment profile
        </span>
      }
      secondary={
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            update({ currentPage: 8 });
            navigate("/budget");
          }}
        >
          Edit budget
        </button>
      }
      primary={{
        label: "Commit budget",
        onClick: () => {
          update({ forecast, currentPage: 10 });
          navigate("/campaign-motion");
        },
      }}
    />
  );
}
