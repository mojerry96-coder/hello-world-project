/* PAGE 11 — WEEK 6 FIELD UPDATE. Evidence only, no decision.
   These six values are the SDD checkpoint and are deliberately fixed — they must
   not be replaced by a forecast that flatters the learner's choices. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { VoiceOver } from "../components/VoiceOver";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { strategies } from "../content/pages";
import { useSimulation } from "../state/store";

/* `tone: "warn"` marks the two indicators the approved render shows in the
   warning colour — the campaign's live problems, not neutral status. */
const METRICS: {
  label: string;
  status: string;
  finding: string;
  tone?: "warn";
}[] = [
  { label: "KADUNA METRO", status: "IMPROVING", finding: "Digital engagement is up." },
  { label: "IKARA & RURAL LGAS", status: "UNEVEN", finding: "Uptake remains 38–40%." },
  { label: "ONLINE RUMOURS", status: "REDUCED", finding: "Response is faster." },
  {
    label: "OFFLINE RUMOURS",
    status: "ACTIVE",
    finding: "Hesitancy still spreads.",
    tone: "warn",
  },
  {
    label: "CHW FIELD REPORTS",
    status: "CONCERNING",
    finding: "Three teams report fatigue.",
    tone: "warn",
  },
  { label: "BUDGET REMAINING", status: "40%", finding: "Must cover Weeks 7–10." },
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
    <div className="page-enter">
      <MediaSlot
        id="IMG-11"
        src="p11-week-six-room.webp"
        alt="Week 6 monitoring review in a Kaduna strategy room. Staff study printed coverage comparisons and field reports across urban and rural LGAs."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.55), transparent 46%, rgba(10,10,8,.90) 75%)"
      />

      <p style={box({ x: 56, y: 28, w: 340, h: 18, z: 20 }, typeStyle("kicker"))}>
        WEEK 6 FIELD UPDATE
      </p>
      <h1 style={box({ x: 56, y: 82, w: 820, h: 76, z: 20 }, typeStyle("displayL"))}>
        CAMPAIGN AT A CROSSROADS
      </h1>
      <p
        style={box(
          { x: 56, y: 176, w: 810, h: 66, z: 20 },
          typeStyle("bodySmall", { fontSize: 16 }),
        )}
      >
        “We are halfway through. The Commissioner wants a progress briefing. What
        are we changing for the second half of the campaign?”
      </p>
      <VoiceOver cue="VO-11" delay={700} frame={{ x: 56, y: 268, w: 320, h: 40, z: 24 }} />

      <div
        style={box(
          { x: 40, y: 706, w: 1576, h: 124, z: 18 },
          {
            background: "rgba(15,15,12,.84)",
            border: "1px solid var(--line-dark)",
          },
        )}
      />

      {METRICS.map((m, i) => (
        <div
          key={m.label}
          style={box(
            { x: 56 + i * 256, y: 732, w: 242, h: 76, z: 20 },
            {
              borderRight: i < METRICS.length - 1 ? "1px solid var(--line-dark)" : undefined,
              paddingRight: 14,
              opacity: revealed > i ? 1 : 0,
              transition: "opacity 350ms ease",
            },
          )}
        >
          <p
            style={{
              fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
              fontSize: 10,
              lineHeight: "13px",
              color: "var(--cream)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {m.label}
          </p>
          <p
            style={{
              fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
              fontWeight: 300,
              fontSize: 23,
              lineHeight: "27px",
              color: m.tone === "warn" ? "var(--warning)" : "var(--cream)",
              margin: "4px 0",
            }}
          >
            {m.status}
          </p>
          <p
            style={{
              fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
              fontSize: 11,
              lineHeight: "15px",
              color: "rgba(238,228,213,.72)",
              margin: 0,
            }}
          >
            {m.finding}
          </p>
        </div>
      ))}

      <p
        style={box(
          { x: 56, y: 858, w: 950, h: 22, z: 20 },
          typeStyle("bodySmall"),
        )}
      >
        Current approach: {strategyName} · Allocation profile:{" "}
        {PROFILE_LABEL[state.budgetProfile] ?? state.budgetProfile}
      </p>

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 12 });
          navigate("/adjustment");
        }}
        style={box(
          { x: 1328, y: 844, w: 288, h: 64, z: 20 },
          {
            ...typeStyle("button"),
            background: "var(--accent)",
            border: "1px solid var(--accent-active)",
            cursor: "pointer",
          },
        )}
      >
        ADAPT THE CAMPAIGN
      </button>
    </div>
  );
}
