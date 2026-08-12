/* PAGE 10 — CAMPAIGN IN MOTION: WEEKS 1–5.
   The five clips are fixed, but emphasis, duration and captions are derived from
   the learner's own budget, strategy and diagnosis. An underfunded channel plays
   a truncated 2.5s and says so. CTA unlocks only after all five are viewed. */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Check, Pause, Play, SpeakerSimpleX, SpeakerSimpleHigh } from "@phosphor-icons/react";
import { VideoSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import { strategies } from "../content/pages";
import type { SimulationState } from "../state/types";

type Channel = "launch" | "radio" | "community" | "digital" | "visibility";

const CLIPS: {
  id: string;
  src: string;
  week: string;
  label: string;
  channel: Channel;
  alt: string;
}[] = [
  {
    id: "VID-10-W1",
    src: "p10-week1-launch.mp4",
    week: "W1",
    label: "LAUNCH",
    channel: "launch",
    alt: "Kaduna SPHCDA office. Campaign staff distribute printed plans, mark a Kaduna map and prepare radio scripts and outreach packs.",
  },
  {
    id: "VID-10-W2",
    src: "p10-week2-radio.mp4",
    week: "W2",
    label: "RADIO",
    channel: "radio",
    alt: "A modest Kaduna community radio studio. A Hausa-speaking presenter adjusts a microphone while a health worker reviews a script.",
  },
  {
    id: "VID-10-W3",
    src: "p10-week3-community.mp4",
    week: "W3",
    label: "OUTREACH",
    channel: "community",
    alt: "Rural Ikara. A community health worker and community leader speak with families under tree shade.",
  },
  {
    id: "VID-10-W4",
    src: "p10-week4-digital.mp4",
    week: "W4",
    label: "DIGITAL RESPONSE",
    channel: "digital",
    alt: "Kaduna Metro campaign office. Two communication officers monitor vaccine questions and agree a response.",
  },
  {
    id: "VID-10-W5",
    src: "p10-week5-visibility-review.mp4",
    week: "W5",
    label: "FIELD CHECK",
    channel: "visibility",
    alt: "Urban Kaduna and the campaign office. Staff compare field reports and mark Week 5 results on a paper map.",
  },
];

function clipEmphasis(
  state: SimulationState,
  channel: Channel,
): "normal" | "dominant" | "underfunded" {
  if (channel === "launch") return "normal";
  const amount =
    channel === "radio"
      ? state.budget.radio
      : channel === "community"
        ? state.budget.community
        : channel === "digital"
          ? state.budget.digital
          : state.budget.tvOutdoor;
  return amount >= 60 ? "dominant" : amount <= 15 ? "underfunded" : "normal";
}

function caption(
  state: SimulationState,
  channel: Channel,
  emphasis: ReturnType<typeof clipEmphasis>,
): string {
  let base: string;
  if (emphasis === "underfunded") {
    base = `${channel === "radio" ? "Radio" : channel === "community" ? "Community outreach" : channel === "digital" ? "Digital response" : "Visibility work"} received limited activity this week.`;
  } else if (emphasis === "dominant") {
    base =
      channel === "community"
        ? "Household engagement expands; field-team pressure rises."
        : channel === "radio"
          ? "Local-language messages extend rural reach."
          : channel === "digital"
            ? "Online response accelerates; rural access remains uneven."
            : channel === "visibility"
              ? "Campaign awareness rises; trust-sensitive refusals remain."
              : "The campaign moves into delivery.";
  } else {
    base =
      channel === "launch"
        ? "Teams, scripts and outreach packs are prepared."
        : "Channels reinforce one another across rural and urban audiences.";
  }

  if (state.diagnosis === "partial" || state.diagnosis === "reset") {
    base += " Some activity is aimed at the wrong barrier.";
  }
  return base;
}

export default function Page10CampaignMotion() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();

  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(true);
  const truncateTimer = useRef<number | null>(null);

  const clip = CLIPS[index];
  const emphasis = clipEmphasis(state, clip.channel);
  const allViewed = viewed.size === CLIPS.length;

  const markViewedAndAdvance = useCallback(() => {
    setViewed((v) => new Set(v).add(index));
    setIndex((i) => (i < CLIPS.length - 1 ? i + 1 : i));
  }, [index]);

  // An underfunded channel is cut short at 2.5s rather than playing in full.
  useEffect(() => {
    if (truncateTimer.current) window.clearTimeout(truncateTimer.current);
    if (emphasis === "underfunded" && playing) {
      truncateTimer.current = window.setTimeout(markViewedAndAdvance, 2500);
    }
    return () => {
      if (truncateTimer.current) window.clearTimeout(truncateTimer.current);
    };
  }, [emphasis, playing, markViewedAndAdvance]);

  // Mark the final clip viewed when it ends so the CTA can unlock.
  useEffect(() => {
    if (index === CLIPS.length - 1) {
      const t = window.setTimeout(
        () => setViewed((v) => new Set(v).add(index)),
        6000,
      );
      return () => window.clearTimeout(t);
    }
  }, [index]);

  const strategyName =
    strategies.find((s) => s.id === state.strategy)?.name ?? "STRATEGY";

  return (
    <div className="page-enter">
      <VideoSlot
        key={clip.id}
        id={clip.id}
        src={clip.src}
        alt={clip.alt}
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
        muted={state.audioMuted}
        autoPlay={playing}
        poster={clip.src.replace(".mp4", "-poster.webp")}
        onEnded={markViewedAndAdvance}
      />

      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 180, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.76), transparent)"
      />
      <Shade
        frame={{ x: 0, y: 706, w: 1672, h: 235, z: 2 }}
        background="linear-gradient(0deg, rgba(10,10,8,.94), rgba(10,10,8,.44), transparent)"
      />

      <p style={box({ x: 56, y: 28, w: 320, h: 18, z: 20 }, typeStyle("kicker"))}>
        WEEKS 1–5
      </p>
      <h1
        style={box({ x: 56, y: 80, w: 740, h: 72, z: 20 }, typeStyle("displayL"))}
      >
        CAMPAIGN IN MOTION
      </h1>
      <p
        style={box(
          { x: 1228, y: 30, w: 388, h: 18, z: 20 },
          typeStyle("label", { textAlign: "right" }),
        )}
      >
        {strategyName} · ₦180M COMMITTED
      </p>

      <p
        style={box(
          { x: 56, y: 690, w: 840, h: 54, z: 20 },
          typeStyle("body", { lineHeight: "25px" }),
        )}
        aria-live="polite"
      >
        CURRENT SCENE · {caption(state, clip.channel, emphasis)}
      </p>

      {/* Timeline: 228x64 segments, 20px gaps. Completed segments are replayable. */}
      <div
        style={box({ x: 56, y: 786, w: 1220, h: 90, z: 20 }, {
          display: "flex",
          gap: 20,
        })}
        role="tablist"
        aria-label="Campaign weeks"
      >
        {CLIPS.map((c, i) => {
          const isActive = i === index;
          const isDone = viewed.has(i);
          const reachable = isDone || i <= index;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={!reachable}
              onClick={() => {
                setIndex(i);
                setPlaying(true);
              }}
              className="focusable"
              style={{
                width: 228,
                height: 64,
                textAlign: "left",
                padding: "10px 12px",
                cursor: reachable ? "pointer" : "not-allowed",
                background: isActive
                  ? "rgba(180,93,43,.19)"
                  : "rgba(18,18,15,.62)",
                border: "1px solid var(--line-dark)",
                borderTop: isActive
                  ? "2px solid var(--accent-active)"
                  : "1px solid var(--line-dark)",
                opacity: reachable ? 1 : 0.4,
                color: "var(--cream)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
                  fontSize: 11,
                  lineHeight: "14px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {c.week} {c.label}
                {isDone && <Check size={16} weight="thin" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Media controls: always keyboard reachable. */}
      <div
        style={box({ x: 56, y: 890, w: 200, h: 40, z: 22 }, {
          display: "flex",
          gap: 10,
        })}
      >
        <button
          type="button"
          className="focusable"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((p) => !p)}
          style={{
            width: 40,
            height: 40,
            background: "rgba(12,12,10,.5)",
            border: "1px solid var(--line-dark)",
            color: "var(--cream)",
            cursor: "pointer",
          }}
        >
          {playing ? <Pause size={18} weight="thin" /> : <Play size={18} weight="thin" />}
        </button>
        <button
          type="button"
          className="focusable"
          aria-label={state.audioMuted ? "Unmute" : "Mute"}
          onClick={() => update({ audioMuted: !state.audioMuted })}
          style={{
            width: 40,
            height: 40,
            background: "rgba(12,12,10,.5)",
            border: "1px solid var(--line-dark)",
            color: "var(--cream)",
            cursor: "pointer",
          }}
        >
          {state.audioMuted ? (
            <SpeakerSimpleX size={18} weight="thin" />
          ) : (
            <SpeakerSimpleHigh size={18} weight="thin" />
          )}
        </button>
      </div>

      <button
        type="button"
        className="focusable"
        disabled={!allViewed}
        aria-disabled={!allViewed}
        onClick={() => {
          update({ currentPage: 11 });
          navigate("/week-six");
        }}
        style={box(
          { x: 1328, y: 812, w: 288, h: 64, z: 20 },
          {
            ...typeStyle("button"),
            background: allViewed ? "var(--accent)" : "rgba(24,26,24,.56)",
            border: allViewed
              ? "1px solid var(--accent-active)"
              : "1px solid rgba(238,228,213,.16)",
            color: allViewed ? "var(--white)" : "rgba(238,228,213,.40)",
            cursor: allViewed ? "pointer" : "not-allowed",
          },
        )}
      >
        CONTINUE TO WEEK 6
      </button>
    </div>
  );
}
