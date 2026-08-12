/* PAGE 08 — ALLOCATE THE ₦180M BUDGET.
   Sliders and numeric inputs stay synchronised. Nothing auto-redistributes.
   Review Forecast unlocks only on an exact ₦180M total — over or under both stay
   disabled, and overspend is shown in the danger colour. */

import { useState } from "react";
import { Info } from "@phosphor-icons/react";
import { useNavigate } from "../lib/navigate";
import { DecisionPage } from "../components/DecisionPage";
import { useDecisionHud } from "../content/decisionPages";
import {
  allocated,
  budgetProfile,
  calculateForecast,
  isBudgetValid,
} from "../state/logic";
import { useSimulation } from "../state/store";
import {
  BUDGET_STEP,
  BUDGET_TOTAL,
  CHANNEL_MAX,
  type BudgetAllocation,
} from "../state/types";

const CHANNELS: {
  key: keyof BudgetAllocation;
  name: string;
  impact: string;
  risk: string;
}[] = [
  {
    key: "community",
    name: "Community mobilisation",
    impact:
      "Strong trust-building through CHWs, leaders and household discussion",
    risk: "High workforce demand and fatigue",
  },
  {
    key: "radio",
    name: "Local radio",
    impact: "Wide rural reach and local-language access",
    risk: "Limited personalisation",
  },
  {
    key: "digital",
    name: "Digital media",
    impact: "Fast misinformation monitoring and response",
    risk: "Limited rural penetration",
  },
  {
    key: "tvOutdoor",
    name: "TV & outdoor advertising",
    impact: "High visibility and awareness",
    risk: "Weak influence on entrenched hesitancy",
  },
];

/* A defensible opening position: inside the spec's "balanced" band on every
   channel and totalling exactly ₦180M. Offered, never applied automatically. */
const SUGGESTED: BudgetAllocation = {
  community: 55,
  radio: 45,
  digital: 45,
  tvOutdoor: 35,
};

export default function Page08Budget() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const hud = useDecisionHud(8);
  const [budget, setBudget] = useState<BudgetAllocation>(state.budget);
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const total = allocated(budget);
  const remaining = BUDGET_TOTAL - total;
  const valid = isBudgetValid(budget);

  function set(key: keyof BudgetAllocation, raw: number) {
    const clamped = Math.max(
      0,
      Math.min(CHANNEL_MAX, Math.round(raw / BUDGET_STEP) * BUDGET_STEP),
    );
    setBudget((b) => ({ ...b, [key]: clamped }));
  }

  function reviewForecast() {
    if (!valid) return;
    // Allocation and profile are saved only on Review Forecast, per spec.
    const next = { ...state, budget, budgetProfile: budgetProfile(budget) };
    update({
      budget,
      budgetProfile: budgetProfile(budget),
      forecast: calculateForecast(next),
      currentPage: 9,
    });
    navigate("/forecast");
  }

  return (
    <DecisionPage
      {...hud}
      budget={{ label: "Budget fixed at", value: `₦${BUDGET_TOTAL}M` }}
      statement="“A measles cluster has been reported next door. The Commissioner wants a visible response — the budget does not move.”"
      question="Split ₦180M across all four channels. Every naira must be assigned, and no single channel may exceed ₦100M."
      aside={
        <div aria-live="polite">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span className="metric-label">Allocated</span>
            <span className="metric-value" style={{ fontSize: 26 }}>
              ₦{total}M
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 12,
            }}
          >
            <span className="metric-label">
              {remaining < 0 ? "Overspend" : "Remaining"}
            </span>
            <span
              className="metric-value"
              style={{
                fontSize: 26,
                color: remaining === 0 ? "var(--accent-soft)" : undefined,
              }}
            >
              {remaining < 0 ? (
                <span style={{ color: "var(--danger)" }}>
                  ₦{Math.abs(remaining)}M
                </span>
              ) : (
                `₦${remaining}M`
              )}
            </span>
          </div>
          <button
            type="button"
            className="decision-chip"
            style={{ marginTop: 16, width: "100%", height: 34 }}
            onClick={() => setBudget(SUGGESTED)}
          >
            Start from a balanced split
          </button>
        </div>
      }
      controls={
        <div style={{ display: "grid", gap: 8 }}>
          {CHANNELS.map((c) => {
            const value = budget[c.key];
            return (
              <div
                key={c.key}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <span
                  style={{
                    width: "clamp(150px, 15vw, 226px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                  }}
                >
                  {c.name}
                  <button
                    type="button"
                    aria-label={`${c.name} impact and risk`}
                    aria-expanded={openGuide === c.key}
                    onClick={() =>
                      setOpenGuide(openGuide === c.key ? null : c.key)
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "var(--accent)",
                      display: "inline-flex",
                    }}
                  >
                    <Info size={16} weight="thin" />
                  </button>
                </span>

                <input
                  type="range"
                  min={0}
                  max={CHANNEL_MAX}
                  step={BUDGET_STEP}
                  value={value}
                  onChange={(e) => set(c.key, Number(e.target.value))}
                  onKeyDown={(e) => {
                    // PageUp/PageDown move by ₦20M; arrows use the ₦5M step.
                    if (e.key === "PageUp") {
                      e.preventDefault();
                      set(c.key, value + 20);
                    } else if (e.key === "PageDown") {
                      e.preventDefault();
                      set(c.key, value - 20);
                    }
                  }}
                  aria-label={`${c.name} allocation in naira millions`}
                  aria-valuetext={`₦${value} million`}
                  className="budget-range"
                  style={{ flex: 1, minWidth: 0 }}
                />

                <input
                  type="number"
                  min={0}
                  max={CHANNEL_MAX}
                  step={BUDGET_STEP}
                  value={value}
                  onChange={(e) => set(c.key, Number(e.target.value))}
                  aria-label={`${c.name} allocation, naira millions`}
                  className="decision-field"
                  style={{
                    width: 88,
                    padding: "7px 10px",
                    textAlign: "right",
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--accent)" }}>₦M</span>

                {openGuide === c.key && (
                  <div
                    role="status"
                    style={{
                      position: "absolute",
                      left: 30,
                      bottom: 96,
                      width: "min(520px, 44vw)",
                      padding: 14,
                      borderRadius: "var(--radius-card)",
                      background: "rgba(18,17,16,.96)",
                      border: "1px solid var(--border-medium)",
                      zIndex: 30,
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--white-soft)" }}>
                        Impact:
                      </strong>{" "}
                      {c.impact}
                    </p>
                    <p style={{ margin: "6px 0 0" }}>
                      <strong style={{ color: "var(--accent)" }}>Risk:</strong>{" "}
                      {c.risk}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
      submitLabel="Review forecast"
      submitDisabled={!valid}
      onSubmit={reviewForecast}
      onBack={() => {
        update({ currentPage: 7 });
        navigate("/strategy-consequence");
      }}
    />
  );
}
