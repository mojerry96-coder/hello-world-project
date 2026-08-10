/* Voice-over and captions.

   Spec 6.4 keeps voice separate from video so captions, replay and mute all
   work independently. Each cue plays once per page visit and never repeats
   while the learner stays on the page.

   Audio files are not yet produced. The caption text below is the authoritative
   script, so the content is fully present and accessible as text today; dropping
   `public/media/vo-02.mp3` (etc.) in later makes the audio play with no code
   change. */

import { useEffect, useRef, useState } from "react";
import { SpeakerSimpleHigh, SpeakerSimpleX, ArrowCounterClockwise, ClosedCaptioning } from "@phosphor-icons/react";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";

export type CueId = "VO-02" | "VO-03" | "VO-11" | "VO-14";

/** Exact spoken script per cue. Page 14's opening line is supplied dynamically. */
export const VO_SCRIPT: Record<CueId, string> = {
  "VO-02":
    "Before selecting communication channels, understand why communities are hesitant. The strategy must address the barriers affecting vaccine acceptance.",
  "VO-03":
    "One state. Three realities. Kaduna Metro begins at seventy percent, Zaria at forty-five, and Ikara at thirty-eight.",
  "VO-11":
    "We are halfway through. The Commissioner wants a progress briefing. What are we changing for the second half of the campaign?",
  "VO-14":
    "Why should we continue funding multiple communication channels when one channel may reach more people at lower cost?",
};

const FILE: Record<CueId, string> = {
  "VO-02": "vo-02.mp3",
  "VO-03": "vo-03.mp3",
  "VO-11": "vo-11.mp3",
  "VO-14": "vo-14.mp3",
};

type Props = {
  cue: CueId;
  /** Overrides the script, e.g. Page 14's history-driven opening question. */
  text?: string;
  /** Milliseconds after mount before the cue fires. */
  delay?: number;
  frame?: Box;
};

export function VoiceOver({ cue, text, delay = 700, frame }: Props) {
  const { state, update } = useSimulation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [available, setAvailable] = useState(true);

  const line = text ?? VO_SCRIPT[cue];

  useEffect(() => {
    // Fires once per visit; re-entering the page replays, staying does not.
    const t = window.setTimeout(() => {
      setStarted(true);
      const el = audioRef.current;
      if (el && !state.audioMuted) void el.play().catch(() => setAvailable(false));
    }, delay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.muted = state.audioMuted;
  }, [state.audioMuted]);

  function replay() {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => setAvailable(false));
  }

  const controls: Box = frame ?? { x: 56, y: 890, w: 320, h: 40, z: 24 };

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}media/${FILE[cue]}`}
        preload="auto"
        onError={() => setAvailable(false)}
      />

      <div style={box(controls, { display: "flex", gap: 10, alignItems: "center" })}>
        <button
          type="button"
          className="focusable"
          aria-label={state.audioMuted ? "Unmute narration" : "Mute narration"}
          aria-pressed={state.audioMuted}
          onClick={() => update({ audioMuted: !state.audioMuted })}
          style={iconButton}
        >
          {state.audioMuted ? (
            <SpeakerSimpleX size={18} weight="thin" />
          ) : (
            <SpeakerSimpleHigh size={18} weight="thin" />
          )}
        </button>
        <button
          type="button"
          className="focusable"
          aria-label={state.captionsEnabled ? "Hide captions" : "Show captions"}
          aria-pressed={state.captionsEnabled}
          onClick={() => update({ captionsEnabled: !state.captionsEnabled })}
          style={{
            ...iconButton,
            borderColor: state.captionsEnabled
              ? "var(--accent-active)"
              : "var(--line-dark)",
          }}
        >
          <ClosedCaptioning size={18} weight="thin" />
        </button>
        <button
          type="button"
          className="focusable"
          aria-label="Replay narration"
          disabled={!available}
          onClick={replay}
          style={{ ...iconButton, opacity: available ? 1 : 0.4 }}
        >
          <ArrowCounterClockwise size={18} weight="thin" />
        </button>
      </div>

      {/* Captions carry the full line whether or not audio exists. */}
      {state.captionsEnabled && started && (
        <p
          role="status"
          style={box(
            { x: 336, y: 884, w: 900, h: 52, z: 24 },
            {
              ...typeStyle("bodySmall", { color: "var(--cream)" }),
              background: "rgba(10,10,8,.82)",
              border: "1px solid var(--line-dark)",
              padding: "8px 14px",
            },
          )}
        >
          {line}
        </p>
      )}
    </>
  );
}

const iconButton: React.CSSProperties = {
  width: 40,
  height: 40,
  display: "grid",
  placeItems: "center",
  background: "rgba(12,12,10,.5)",
  border: "1px solid var(--line-dark)",
  color: "var(--cream)",
  cursor: "pointer",
};
