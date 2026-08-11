/* 30-second orientation intro.

   Plays before Page 1 so the learner understands the scenario, their role and
   the shape of the decisions before anything is asked of them.

   Text is drawn in code over the film, never baked into it — same rule as every
   other page, so the copy stays editable, translatable and screen-readable.
   Skippable at any time, and only shown once unless replayed from Page 1. */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { ArrowRight, SpeakerSimpleHigh, SpeakerSimpleX } from "@phosphor-icons/react";
import { VideoSlot } from "../components/MediaSlot";
import { Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import {
  INTRO_BEATS,
  INTRO_DURATION,
  INTRO_TITLE,
  INTRO_TRANSCRIPT,
} from "../content/intro";
import { useSimulation } from "../state/store";
import { SplitText } from "../motion/SplitText";

export const INTRO_SEEN_KEY = "mph8430-intro-seen-v1";

export default function PageIntro() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [t, setT] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const raf = useRef<number | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  // Reduced motion: skip the film, present the same content as a static brief.
  const staticMode = state.reducedMotion;

  // Always start the brief at zero. A cached media resource keeps its previous
  // position and, being already loaded, never re-fires `loadedmetadata` — so
  // handle the ready case directly and only wait for the event when it is not.
  useEffect(() => {
    if (staticMode) return;
    const el = video.current;
    if (!el) return;
    // load() is the only reliable reset: setting currentTime alone races the
    // browser restoring its own position for an already-cached resource.
    el.load();
    const rewind = () => {
      el.currentTime = 0;
      setT(0);
      void el.play().catch(() => setBlocked(true));
    };
    el.addEventListener("loadedmetadata", rewind, { once: true });
    return () => el.removeEventListener("loadedmetadata", rewind);
  }, [staticMode]);

  // Beats are driven by the film's own clock, not wall-clock, so a stall or a
  // late start can never desync the words from the picture.
  useEffect(() => {
    if (staticMode) return;
    const tick = () => {
      const el = video.current;
      if (el) setT(el.currentTime);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [staticMode]);

  function enter() {
    try {
      window.localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Non-fatal: the intro simply shows again next visit.
    }
    update({ currentPage: 1 });
    navigate("/opening");
  }

  // The film's own `ended` event advances the page; no wall-clock fallback is
  // needed and none should race it.

  const active = INTRO_BEATS.find((b) => t >= b.at && t < b.until);
  const titleShown = t >= INTRO_TITLE.at;

  if (staticMode) {
    return (
      <div className="page-enter">
        <Shade
          frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
          background="var(--ink)"
        />
        <div style={box({ x: 96, y: 96, w: 1100, h: 760, z: 10 })}>
          <p style={typeStyle("kicker")}>A social marketing simulation</p>
          <h1 style={typeStyle("displayL", { margin: "18px 0 40px" })}>
            RIGHT MESSAGE, RIGHT CHANNEL
          </h1>
          {INTRO_BEATS.map((b) => (
            <div key={b.line} style={{ marginBottom: 26 }}>
              <p style={typeStyle("label", { color: "var(--cream)" })}>{b.kicker}</p>
              <p style={typeStyle("body", { marginTop: 4 })}>{b.line}</p>
              {b.detail && (
                <p style={typeStyle("bodySmall", { marginTop: 2 })}>{b.detail}</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="primary-cta focusable"
          onClick={enter}
          style={box({ x: 1290, y: 820, w: 300, h: 64, z: 20 }, typeStyle("button"))}
        >
          <span>BEGIN</span>
          <ArrowRight size={24} weight="thin" />
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <VideoSlot
        id="INTRO"
        /* The #t= media fragment pins the start point. Without it the browser
           resumes a cached resource wherever it stopped — which, at the end of
           the film, fires `ended` instantly and skips the brief entirely. */
        src="intro-simulation.mp4#t=0.001"
        alt={`Thirty-second introduction to the simulation. ${INTRO_TRANSCRIPT}`}
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
        muted={state.audioMuted}
        poster="intro-simulation-poster.webp"
        videoRef={video}
        restart
        onBlocked={() => setBlocked(true)}
        /* Guard against a stale resumed position firing `ended` on arrival. */
        onEnded={() => {
          const el = video.current;
          if (el && el.currentTime < INTRO_DURATION - 1) {
            el.currentTime = 0;
            void el.play().catch(() => setBlocked(true));
            return;
          }
          enter();
        }}
      />

      {/* Left column for the beats, floor for the controls. */}
      <Shade
        frame={{ x: 0, y: 0, w: 900, h: 941, z: 2 }}
        background="linear-gradient(90deg, rgba(10,10,8,.82), rgba(10,10,8,.30) 70%, transparent)"
      />
      <Shade
        frame={{ x: 0, y: 700, w: 1672, h: 241, z: 2 }}
        background="linear-gradient(0deg, rgba(10,10,8,.86), transparent)"
      />

      {/* Beat text. Keyed so each beat cross-fades in on its own. */}
      {active && (
        <div
          key={active.line}
          style={box(
            { x: 64, y: 292, w: 820, h: 280, z: 20 },
            {
              animation: "page-fade 520ms ease both",
              background:
                "linear-gradient(90deg, rgba(10,10,8,.84) 0%, rgba(10,10,8,.55) 68%, transparent 100%)",
              borderLeft: "2px solid var(--accent)",
              padding: "22px 26px",
            },
          )}
        >
          {active.kicker && (
            <p style={typeStyle("kicker", { marginBottom: 14 })}>{active.kicker}</p>
          )}
          <SplitText
            text={active.line}
            runKey={active.line}
            by="word"
            stagger={0.05}
            rise={22}
            style={typeStyle("displayM", { fontSize: 46, lineHeight: 1.12 })}
          />
          {active.detail && (
            <SplitText
              text={active.detail}
              runKey={active.line}
              by="word"
              delay={0.28}
              stagger={0.018}
              duration={0.5}
              rise={10}
              style={typeStyle("bodySmall", {
                fontSize: 20,
                marginTop: 18,
                maxWidth: 700,
              })}
            />
          )}
        </div>
      )}

      {/* Title card over the held final frame. */}
      {titleShown && (
        <div
          style={box(
            { x: 64, y: 312, w: 880, h: 280, z: 22 },
            {
              animation: "page-fade 600ms ease both",
              background:
                "linear-gradient(90deg, rgba(10,10,8,.86) 0%, rgba(10,10,8,.55) 70%, transparent 100%)",
              padding: "22px 26px",
            },
          )}
        >
          <p style={typeStyle("kicker", { marginBottom: 16 })}>
            {INTRO_TITLE.kicker}
          </p>
          <h1
            style={typeStyle("displayL", {
              fontSize: 56,
              lineHeight: 1.06,
              whiteSpace: "pre-line",
            })}
          >
            {INTRO_TITLE.line}
          </h1>
          <div
            aria-hidden="true"
            style={{ width: 420, height: 2, background: "var(--accent)", marginTop: 22 }}
          />
        </div>
      )}

      {/* Progress hairline — burnt orange, the one place it reads as progress. */}
      <div
        aria-hidden="true"
        style={box(
          { x: 0, y: 939, w: 1672, h: 2, z: 24 },
          { background: "rgba(238,228,213,.14)" },
        )}
      >
        <div
          style={{
            width: `${Math.min(100, (t / INTRO_DURATION) * 100)}%`,
            height: 2,
            background: "var(--accent)",
          }}
        />
      </div>

      {/* Autoplay with sound is refused by default in most browsers. Rather than
          stall on a frozen poster, offer the one gesture that unblocks it. */}
      {blocked && (
        <button
          type="button"
          className="primary-cta focusable"
          onClick={() => {
            setBlocked(false);
            void video.current?.play();
          }}
          style={box(
            { x: 636, y: 438, w: 400, h: 72, z: 30 },
            { ...typeStyle("button"), justifyContent: "center" },
          )}
        >
          <span>PLAY THE 30-SECOND BRIEF</span>
        </button>
      )}

      <button
        type="button"
        className="focusable"
        aria-label={state.audioMuted ? "Unmute" : "Mute"}
        onClick={() => update({ audioMuted: !state.audioMuted })}
        style={box(
          { x: 72, y: 852, w: 40, h: 40, z: 24 },
          {
            display: "grid",
            placeItems: "center",
            background: "rgba(12,12,10,.5)",
            border: "1px solid var(--line-dark)",
            color: "var(--cream)",
            cursor: "pointer",
          },
        )}
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
        onClick={enter}
        style={box(
          { x: 1400, y: 846, w: 200, h: 52, z: 24 },
          {
            ...typeStyle("button"),
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "rgba(12,12,10,.44)",
            border: `1px solid ${titleShown ? "var(--accent)" : "var(--cream)"}`,
            cursor: "pointer",
          },
        )}
      >
        <span>{titleShown ? "BEGIN" : "SKIP"}</span>
        <ArrowRight size={20} weight="thin" />
      </button>
    </div>
  );
}
