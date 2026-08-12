/* PAGE 10 — CAMPAIGN IN MOTION: WEEKS 1–5.
   The five clips are fixed, but emphasis, duration and captions are derived from
   the learner's own budget, strategy and diagnosis. An underfunded channel plays
   a truncated 2.5s and says so. CTA unlocks only after all five are viewed. */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "../lib/navigate";
import {
  Check,
  FilmSlate,
  Pause,
  Play,
  SpeakerSimpleX,
  SpeakerSimpleHigh,
} from "@phosphor-icons/react";
import { VideoSlot } from "../components/MediaSlot";
import { NarrativePage } from "../components/NarrativePage";
import { useSimulation } from "../state/store";
import { strategies } from "../content/pages";
import { useCampaignHud } from "../content/decisionPages";
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
  const hud = useCampaignHud(10, "Campaign in motion", "Weeks 1–5");

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
    <NarrativePage
      sceneNode={
        <>
          <VideoSlot
            key={clip.id}
            id={clip.id}
            src={clip.src}
            alt={clip.alt}
            frame={{ x: 0, y: 0, w: 0, h: 0, z: 0 }}
            muted={state.audioMuted}
            autoPlay={playing}
            poster={clip.src.replace(".mp4", "-poster.webp")}
            onEnded={markViewedAndAdvance}
            style={{
              position: "absolute",
              inset: 0,
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div className="scene-treatment" />
        </>
      }
      hud={{
        icon: FilmSlate,
        ...hud,
        trailing: (
          <>
            <button
              type="button"
              className="decision-chip"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((p) => !p)}
              style={{ display: "grid", placeItems: "center" }}
            >
              {playing ? (
                <Pause size={14} weight="bold" />
              ) : (
                <Play size={14} weight="bold" />
              )}
            </button>
            <button
              type="button"
              className="decision-chip"
              aria-label={state.audioMuted ? "Unmute" : "Mute"}
              onClick={() => update({ audioMuted: !state.audioMuted })}
              style={{ display: "grid", placeItems: "center" }}
            >
              {state.audioMuted ? (
                <SpeakerSimpleX size={14} weight="bold" />
              ) : (
                <SpeakerSimpleHigh size={14} weight="bold" />
              )}
            </button>
          </>
        ),
      }}
      kicker="Weeks 1–5"
      title="CAMPAIGN IN MOTION"
      lede={<span aria-live="polite">{caption(state, clip.channel, emphasis)}</span>}
      note={`${strategyName} · ₦180M committed`}
      aside={
        <div className="clip-timeline" role="tablist" aria-label="Campaign weeks">
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
                className={`clip-chip${isActive ? " is-active" : ""}`}
              >
                <span className="clip-week">{c.week}</span>
                <span className="clip-label">{c.label}</span>
                {isDone && <Check size={13} weight="bold" aria-hidden />}
              </button>
            );
          })}
        </div>
      }
      primary={{
        label: "Continue to week 6",
        disabled: !allViewed,
        onClick: () => {
          update({ currentPage: 11 });
          navigate("/week-six");
        },
      }}
    />
  );
}
