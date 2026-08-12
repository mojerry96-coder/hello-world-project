/* PAGE 13 — FRIDAY BRIEFING ARRIVAL.
   Decision history is read from persisted state, never from hardcoded examples.
   No score changes here. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Buildings } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { useSimulation } from "../state/store";
import { historyLabels } from "../content/history";
import { useCampaignHud } from "../content/decisionPages";

export default function Page13Briefing() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [revealed, setRevealed] = useState(state.reducedMotion ? 4 : 0);
  const hud = useCampaignHud(13, "Friday briefing", "Ministry of Health");

  useEffect(() => {
    if (state.reducedMotion) return;
    const timers = [0, 1, 2, 3].map((i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 800 + i * 300),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [state.reducedMotion]);

  const h = historyLabels(state);
  const items = [
    { label: "Diagnosis", value: h.diagnosis },
    { label: "Strategy", value: h.strategy },
    { label: "Allocation", value: h.budget },
    { label: "Week 7–10 change", value: h.adjustment },
  ];

  return (
    <NarrativePage
      scene={{
        image: "p13-friday-briefing-arrival.webp",
        imageId: "IMG-13",
        imageAlt:
          "Arrival at a formal Kaduna State Ministry of Health briefing room, with stakeholders taking their seats around a long table and printed review folders in place.",
        imagePosition: "70% 46%",
        treatment: "left",
      }}
      hud={{
        icon: Buildings,
        ...hud,
        onBack: () => {
          update({ currentPage: 12 });
          navigate("/adjustment");
        },
      }}
      kicker="Friday briefing"
      title={["KADUNA STATE", "MINISTRY OF HEALTH"]}
      lede="Your decisions are now part of the evidence."
      note="Your campaign history is ready for the room."
      aside={
        <div className="figure-grid" style={{ ["--figure-columns" as string]: 2 }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              className="figure-card"
              style={{
                animation: "none",
                opacity: revealed > i ? 1 : 0,
                transition: state.reducedMotion ? "none" : "opacity 380ms ease",
              }}
            >
              <span className="figure-label">{item.label}</span>
              <span className="figure-value" style={{ fontSize: 17 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      }
      primary={{
        label: "Enter the briefing",
        onClick: () => {
          update({ currentPage: 14 });
          navigate("/defence");
        },
      }}
    />
  );
}
