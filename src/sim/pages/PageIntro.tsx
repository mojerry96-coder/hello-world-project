/* Orientation intro.

   Plays before Page 1 so the learner understands the scenario, their role and
   the shape of the decisions before anything is asked of them.

   Stills, not video: motion behind the copy competed with reading it, and the
   film forced a seven-second wait before the first word appeared. Each beat now
   holds one frame and cross-fades to the next, so the pace is set by how long
   the text takes to read.

   Text is drawn in code over the film, never baked into it — same rule as every
   other page, so the copy stays editable, translatable and screen-readable.
   Skippable at any time, and only shown once unless replayed from Page 1. */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { ArrowRight, SpeakerSimpleHigh, SpeakerSimpleX } from "@phosphor-icons/react";
import { MediaSlot } from "../components/MediaSlot";
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

/* Every still in play order: one per beat, then the title card's frame. */
const SEQUENCE = [
  ...INTRO_BEATS.map((b) => ({ image: b.image, alt: b.alt })),
  { image: INTRO_TITLE.image, alt: INTRO_TITLE.alt },
];


export default function PageIntro() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [t, setT] = useState(0);
  const raf = useRef<number | null>(null);

  // Reduced motion: skip the film, present the same content as a static brief.
  const staticMode = state.reducedMotion;

  // With stills there is no media clock, so the sequence runs on its own timer.
  // rAF rather than setInterval so a backgrounded tab pauses instead of racing
  // ahead and dumping the learner into Page 1 unseen.
  useEffect(() => {
    if (staticMode) return;
    const started = performance.now();
    const tick = () => {
      setT((performance.now() - started) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [staticMode]);

  // End of the sequence hands over to Page 1.
  useEffect(() => {
    if (staticMode || t < INTRO_DURATION) return;
    enter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t >= INTRO_DURATION, staticMode]);

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

  // Which still is on screen. The last beat's frame holds through any gap
  // before the title card, so the picture never cuts to black between beats.
  const frameIndex = titleShown
    ? SEQUENCE.length - 1
    : Math.max(
        0,
        INTRO_BEATS.reduce((acc, b, i) => (t >= b.at ? i : acc), 0),
      );

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
      {/* One still per beat, cross-fading. Both frames stay mounted so the
          outgoing image fades under the incoming one rather than flashing. */}
      {SEQUENCE.map((f, i) => (
        <MediaSlot
          key={f.image}
          id={`INTRO-${i + 1}`}
          src={f.image}
          alt={i === 0 ? `Introduction to the simulation. ${INTRO_TRANSCRIPT}` : f.alt}
          frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
          style={{
            opacity: frameIndex === i ? 1 : 0,
            transition: staticMode ? undefined : "opacity 900ms ease",
          }}
        />
      ))}

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
