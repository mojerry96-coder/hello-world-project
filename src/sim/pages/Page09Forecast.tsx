/* PAGE 09 — CONDITIONAL IMPACT FORECAST.
   Explanatory, not a decision. Values are calculated from persisted state only,
   so two learners with different allocations never see the same result.
   Workforce pressure is a warning line, not a fifth "gain" bar. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { PageLabel, PageMarker, Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { calculateForecast } from "../state/logic";
import { useSimulation } from "../state/store";
import { CountUp } from "../motion/CountUp";
import { projectedChildren } from "../state/coverage";
import type { Forecast, SimulationState } from "../state/types";

const BARS: { key: keyof Forecast; label: string; y: number }[] = [
  { key: "trust", label: "TRUST", y: 405 },
  { key: "reach", label: "RURAL REACH", y: 475 },
  { key: "misinformationControl", label: "MISINFORMATION CONTROL", y: 545 },
  { key: "visibility", label: "CAMPAIGN VISIBILITY", y: 615 },
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

  useEffect(() => {
    if (state.reducedMotion) return;
    const t = window.setTimeout(() => setAnimated(true), 60);
    return () => window.clearTimeout(t);
  }, [state.reducedMotion]);

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-09"
        src="p09-impact-forecast.webp"
        alt="Kaduna campaign analysis room. A communication officer stands at the right of a table with colleagues, studying a printed Kaduna map, a laptop and field photographs."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 840, h: 941, z: 2 }}
        background="linear-gradient(90deg, rgba(10,10,8,.94), rgba(10,10,8,.66) 72%, transparent)"
      />
      <Shade
        frame={{ x: 0, y: 790, w: 1672, h: 151, z: 2 }}
        background="rgba(10,10,8,.78)"
      />

      <PageLabel>Impact Forecast</PageLabel>
      <PageMarker page={9} />

      <h1
        style={box(
          { x: 46, y: 103, w: 670, h: 122, z: 20 },
          typeStyle("displayL", { fontSize: 48, lineHeight: 1.12 }),
        )}
      >
        WHAT YOUR ALLOCATION
        <br />
        IS LIKELY TO CHANGE
      </h1>

      <p
        style={box(
          { x: 46, y: 240, w: 620, h: 24, z: 20 },
          typeStyle("bodySmall"),
        )}
      >
        Forecast based on your diagnosis, selected strategy and ₦180M allocation.
      </p>

      {/* Lead with the outcome, not the indices. Nobody finishes a campaign
          thinking "I moved Visibility to 66" — they think about children. */}
      <div style={box({ x: 46, y: 276, w: 640, h: 54, z: 20 })}>
        <CountUp
          as="span"
          to={children}
          duration={1.4}
          style={{
            fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
            fontWeight: 300,
            fontSize: 44,
            lineHeight: "46px",
            color: "var(--cream)",
            fontVariantNumeric: "tabular-nums",
          }}
        />
        <span
          style={{
            ...typeStyle("body", { fontSize: 17 }),
            marginLeft: 12,
            color: "var(--accent-active)",
          }}
        >
          more children reached by week 10
        </span>
      </div>

      <p
        style={box(
          { x: 46, y: 348, w: 760, h: 24, z: 20 },
          typeStyle("bodySmall", { color: "var(--cream)" }),
        )}
      >
        COMMUNITY ₦{state.budget.community}M · RADIO ₦{state.budget.radio}M ·
        DIGITAL ₦{state.budget.digital}M · TV/OUTDOOR ₦{state.budget.tvOutdoor}M
      </p>

      {BARS.map((bar) => {
        const value = forecast[bar.key];
        return (
          <div key={bar.key} style={box({ x: 48, y: bar.y, w: 548, h: 48, z: 20 })}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                  fontSize: 12,
                  lineHeight: "15px",
                  fontWeight: 500,
                  color: "var(--cream)",
                }}
              >
                {bar.label}
              </span>
              <CountUp
                as="span"
                to={value}
                suffix="%"
                duration={0.9}
                delay={0.08 * BARS.indexOf(bar)}
                style={{
                  fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                  fontWeight: 300,
                  fontSize: 28,
                  lineHeight: "30px",
                  color: "var(--cream)",
                }}
              />
            </div>
            <div
              style={{
                height: 3,
                background: "var(--line-dark)",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  height: 3,
                  width: `${animated ? value : 0}%`,
                  background: "var(--accent)",
                  transition: state.reducedMotion
                    ? "none"
                    : "width 700ms ease-out",
                }}
              />
            </div>
          </div>
        );
      })}

      <div style={box({ x: 46, y: 700, w: 700, h: 82, z: 20 })}>
        <p style={typeStyle("label", { marginBottom: 6 })}>
          {state.budgetProfile.replaceAll("-", " ").toUpperCase()} INVESTMENT
        </p>
        <p style={typeStyle("bodySmall")}>{rationale(state, forecast)}</p>
        {forecast.workforcePressure > 70 && (
          <p style={typeStyle("bodySmall", { color: "var(--warning)", marginTop: 8 })}>
            Workforce pressure is projected at {forecast.workforcePressure}% —
            field teams are likely to be overstretched.
          </p>
        )}
      </div>

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 8 });
          navigate("/budget");
        }}
        style={box(
          { x: 930, y: 846, w: 304, h: 54, z: 20 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.34)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
          },
        )}
      >
        EDIT BUDGET
      </button>

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ forecast, currentPage: 10 });
          navigate("/campaign-motion");
        }}
        style={box(
          { x: 1265, y: 846, w: 337, h: 54, z: 20 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.34)",
            border: "1px solid var(--accent)",
            cursor: "pointer",
          },
        )}
      >
        COMMIT BUDGET
      </button>
    </div>
  );
}
