/* PAGE 11 — WEEK 6 FIELD UPDATE. Evidence only, no decision.
   These six values are the SDD checkpoint and are deliberately fixed — they must
   not be replaced by a forecast that flatters the learner's choices. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Pulse } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { VoiceOver } from "../components/VoiceOver";
import { strategies } from "../content/pages";
import { useSimulation } from "../state/store";
import { useCampaignHud } from "../content/decisionPages";

/* `tone: "warn"` marks the two indicators the approved render shows in the
   warning colour — the campaign's live problems, not neutral status. */
const METRICS: {
  label: string;
  status: string;
  finding: string;
  tone?: "warn";
}[] = [
  { label: "Kaduna Metro", status: "IMPROVING", finding: "Digital engagement is up." },
  { label: "Ikara & rural LGAs", status: "UNEVEN", finding: "Uptake remains 38–40%." },
  { label: "Online rumours", status: "REDUCED", finding: "Response is faster." },
  {
    label: "Offline rumours",
    status: "ACTIVE",
    finding: "Hesitancy still spreads.",
    tone: "warn",
  },
  {
    label: "CHW field reports",
    status: "CONCERNING",
    finding: "Three teams report fatigue.",
    tone: "warn",
  },
  { label: "Budget remaining", status: "40%", finding: "Must cover weeks 7–10." },
];

const PROFILE_LABEL: Record<string, string> = {
  balanced: "Balanced",
  "community-heavy": "Community-heavy",
  "radio-heavy": "Radio-heavy",
  "digital-heavy": "Digital-heavy",
  "visibility-heavy": "Visibility-heavy",
  mixed: "Mixed",
  unallocated: "Unallocated",
};

export default function Page11WeekSix() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [revealed, setRevealed] = useState(state.reducedMotion ? 6 : 0);
  const hud = useCampaignHud(11, "Week 6 field update", "Halfway position");

  useEffect(() => {
    if (state.reducedMotion) return;
    const timers = METRICS.map((_, i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 1100 + i * 170),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [state.reducedMotion]);

  const strategyName =
    strategies.find((s) => s.id === state.strategy)?.name ?? "—";

  return (
    <NarrativePage
      scene={{
        image: "p11-week-six-room.webp",
        imageId: "IMG-11",
        imageAlt:
          "Week 6 monitoring review in a Kaduna strategy room. Staff study printed coverage comparisons and field reports across urban and rural LGAs.",
      }}
      hud={{ icon: Pulse, ...hud }}
      kicker="Week 6 field update"
      title="CAMPAIGN AT A CROSSROADS"
      lede="“We are halfway through. The Commissioner wants a progress briefing. What are we changing for the second half of the campaign?”"
      note={
        <>
          Current approach: {strategyName} · Allocation profile:{" "}
          {PROFILE_LABEL[state.budgetProfile] ?? state.budgetProfile}
        </>
      }
      aside={
        <div className="figure-grid" style={{ ["--figure-columns" as string]: 3 }}>
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="figure-card"
              style={{
                animation: "none",
                opacity: revealed > i ? 1 : 0,
                transition: state.reducedMotion ? "none" : "opacity 380ms ease",
              }}
            >
              <span className="figure-label">{m.label}</span>
              <span
                className={`figure-value${m.tone === "warn" ? " is-warning" : ""}`}
              >
                {m.status}
              </span>
              <span className="figure-note">{m.finding}</span>
            </div>
          ))}
        </div>
      }
      meta={<VoiceOver cue="VO-11" delay={700} inline />}
      primary={{
        label: "Adapt the campaign",
        onClick: () => {
          update({ currentPage: 12 });
          navigate("/adjustment");
        },
      }}
    />
  );
}
