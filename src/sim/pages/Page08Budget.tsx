/* PAGE 08 — ALLOCATE THE ₦180M BUDGET.
   Sliders and numeric inputs stay synchronised. Nothing auto-redistributes.
   Review Forecast unlocks only on an exact ₦180M total — over or under both stay
   disabled, and overspend is shown in the error colour. */

import { useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Info } from "@phosphor-icons/react";
import { MediaSlot } from "../components/MediaSlot";
import { BackNav, DecisionLabel, Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { allocated, budgetProfile, calculateForecast, isBudgetValid } from "../state/logic";
import { useSimulation } from "../state/store";
import { BUDGET_STEP, BUDGET_TOTAL, CHANNEL_MAX, type BudgetAllocation } from "../state/types";

const CHANNELS: {
  key: keyof BudgetAllocation;
  name: string;
  impact: string;
  risk: string;
  y: number;
}[] = [
  {
    key: "community",
    name: "COMMUNITY MOBILISATION",
    impact: "Strong trust-building through CHWs, leaders and household discussion",
    risk: "High workforce demand and fatigue",
    y: 724,
  },
  {
    key: "radio",
    name: "LOCAL RADIO",
    impact: "Wide rural reach and local-language access",
    risk: "Limited personalisation",
    y: 775,
  },
  {
    key: "digital",
    name: "DIGITAL MEDIA",
    impact: "Fast misinformation monitoring and response",
    risk: "Limited rural penetration",
    y: 826,
  },
  {
    key: "tvOutdoor",
    name: "TV & OUTDOOR ADVERTISING",
    impact: "High visibility and awareness",
    risk: "Weak influence on entrenched hesitancy",
    y: 877,
  },
];

/* A defensible opening position: inside the spec's "balanced" band on every
   channel and totalling exactly ₦180M. Offered, never applied automatically —
   the allocation has to remain the learner's decision. */
const SUGGESTED: BudgetAllocation = {
  community: 55,
  radio: 45,
  digital: 45,
  tvOutdoor: 35,
};

export default function Page08Budget() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
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
    <div className="page-enter">
      <MediaSlot
        id="IMG-08"
        src="p08-budget-room.webp"
        alt="Kaduna SPHCDA financial and communication strategy room, with printed budget papers, a state coverage map and campaign material across the table."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.48), transparent 40%, rgba(10,10,8,.50) 68%)"
      />

      <DecisionLabel decision="Decision 03 / 05" title="" />
      <h1
        style={box(
          { x: 36, y: 74, w: 670, h: 54, z: 20 },
          typeStyle("displayL", { fontSize: 42, lineHeight: 1.06 }),
        )}
      >
        ALLOCATE THE ₦180M BUDGET
      </h1>
      <p
        style={box(
          { x: 36, y: 145, w: 520, h: 24, z: 20 },
          typeStyle("bodySmall", { fontSize: 16, lineHeight: "20px" }),
        )}
      >
        MEASLES CLUSTER REPORTED · BUDGET FIXED
      </p>
      <p className="sr-only" style={{ position: "absolute", left: -9999 }}>
        A suspected measles cluster has been reported in a neighbouring LGA. The
        Commissioner has requested a visible and effective response, but the
        campaign budget remains fixed at ₦180 million.
      </p>

      {/* Page 8 previously offered four sliders, a hidden per-channel cap and a
          hard total, with no guidance at all. Say what the constraint is, and
          offer a defensible opening position the learner can take apart. */}
      <p
        style={box(
          { x: 36, y: 618, w: 900, h: 30, z: 20 },
          {
            ...typeStyle("bodySmall", { fontSize: 15, color: "var(--cream)" }),
            background: "rgba(10,10,8,.72)",
            borderLeft: "2px solid var(--accent)",
            padding: "5px 14px",
          },
        )}
      >
        Split ₦180 million across four channels. Every naira must be assigned —
        no channel may exceed ₦100M. There is no single right answer.
      </p>

      <button
        type="button"
        className="focusable"
        onClick={() => setBudget(SUGGESTED)}
        style={box(
          { x: 36, y: 660, w: 300, h: 34, z: 20 },
          {
            ...typeStyle("bodySmall", { fontSize: 13, color: "var(--cream)" }),
            background: "rgba(12,12,10,.6)",
            border: "1px solid var(--line-dark)",
            cursor: "pointer",
            textAlign: "left",
            padding: "0 12px",
          },
        )}
      >
        Start from a balanced split, then adjust →
      </button>

      <Shade
        frame={{ x: 0, y: 711, w: 1060, h: 230, z: 18 }}
        background="rgba(15,15,12,.88)"
      />

      {CHANNELS.map((c) => {
        const value = budget[c.key];
        return (
          <div
            key={c.key}
            style={box({ x: 35, y: c.y, w: 990, h: 45, z: 20 }, {
              display: "flex",
              alignItems: "center",
            })}
          >
            <span
              style={{
                width: 240,
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 13,
                lineHeight: "16px",
                fontWeight: 600,
                color: "var(--cream)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {c.name}
              <button
                type="button"
                className="focusable"
                aria-label={`${c.name} impact and risk`}
                aria-expanded={openGuide === c.key}
                onClick={() => setOpenGuide(openGuide === c.key ? null : c.key)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "var(--accent-active)",
                  display: "inline-flex",
                }}
              >
                <Info size={18} weight="thin" />
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
                // PageUp/PageDown move by ₦20M; arrows use the native ₦5M step.
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
              className="budget-range focusable"
              style={{ width: 650, marginLeft: 10 }}
            />

            <input
              type="number"
              min={0}
              max={CHANNEL_MAX}
              step={BUDGET_STEP}
              value={value}
              onChange={(e) => set(c.key, Number(e.target.value))}
              aria-label={`${c.name} allocation, naira millions`}
              className="focusable"
              style={{
                width: 112,
                height: 38,
                marginLeft: 20,
                textAlign: "right",
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 16,
                lineHeight: "18px",
                color: "var(--cream)",
                background: "rgba(12,12,10,.5)",
                border: "1px solid var(--line-dark)",
                borderRadius: 0,
                padding: "0 8px",
              }}
            />
            <span
              style={{
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 12,
                lineHeight: "14px",
                color: "var(--accent-active)",
                marginLeft: 6,
              }}
            >
              ₦M
            </span>

            {openGuide === c.key && (
              <div
                role="status"
                style={{
                  position: "absolute",
                  left: 250,
                  bottom: 46,
                  width: 520,
                  padding: 14,
                  background: "rgba(13,13,11,.95)",
                  border: "1px solid var(--line-dark)",
                  zIndex: 30,
                }}
              >
                <p style={typeStyle("bodySmall")}>
                  <strong style={{ color: "var(--cream)" }}>Impact:</strong>{" "}
                  {c.impact}
                </p>
                <p style={typeStyle("bodySmall", { marginTop: 6 })}>
                  <strong style={{ color: "var(--warning)" }}>Risk:</strong>{" "}
                  {c.risk}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <div
        style={box(
          { x: 1060, y: 711, w: 612, h: 230, z: 18 },
          {
            background: "rgba(15,15,12,.91)",
            border: "1px solid var(--line-dark)",
          },
        )}
      />

      <div style={box({ x: 1115, y: 745, w: 500, h: 80, z: 20 })}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={typeStyle("label", { color: "var(--cream)" })}>
            ALLOCATED
          </span>
          <span
            style={typeStyle("displayM", { fontSize: 27, lineHeight: 1.1 })}
            aria-live="polite"
          >
            ₦{total}M
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <span style={typeStyle("label", { color: "var(--cream)" })}>
            {remaining < 0 ? "OVERSPEND" : "REMAINING"}
          </span>
          <span
            style={typeStyle("displayM", {
              fontSize: 27,
              lineHeight: 1.1,
              color: remaining < 0 ? "var(--error)" : "var(--cream)",
            })}
            aria-live="polite"
          >
            ₦{Math.abs(remaining)}M
          </span>
        </div>
      </div>

      <BackNav
        onClick={() => {
          update({ currentPage: 7 });
          navigate("/strategy-consequence");
        }}
        frame={{ x: 36, y: 660, w: 180, h: 28 }}
      />

      <button
        type="button"
        className="focusable"
        disabled={!valid}
        aria-disabled={!valid}
        onClick={reviewForecast}
        style={box(
          { x: 1225, y: 840, w: 287, h: 52, z: 20 },
          {
            ...typeStyle("button"),
            background: valid ? "rgba(12,12,10,.34)" : "rgba(24,26,24,.56)",
            border: valid
              ? "1px solid var(--cream)"
              : "1px solid rgba(238,228,213,.16)",
            color: valid ? "var(--white)" : "rgba(238,228,213,.40)",
            cursor: valid ? "pointer" : "not-allowed",
          },
        )}
      >
        REVIEW FORECAST
      </button>
    </div>
  );
}
