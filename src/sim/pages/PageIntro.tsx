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
import { MediaSlot } from "../components/MediaSlot";
import { NarrativePage } from "../components/NarrativePage";
import {
  INTRO_BEATS,
  INTRO_DURATION,
  INTRO_TITLE,
  INTRO_TRANSCRIPT,
} from "../content/intro";
import { useSimulation } from "../state/store";

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
      <NarrativePage
        scene={{
          image: INTRO_TITLE.image,
          imageId: "INTRO-STATIC",
          imageAlt: INTRO_TITLE.alt,
          treatment: "left",
        }}
        kicker="A social marketing simulation"
        title="RIGHT MESSAGE, RIGHT CHANNEL"
        lede="A ten-week immunisation campaign in Kaduna State. You choose what to say, where to say it and who to trust."
        aside={
          <div className="figure-grid" style={{ ["--figure-columns" as string]: 2 }}>
            {INTRO_BEATS.map((b) => (
              <div
                key={b.line}
                className="figure-card"
                style={{ animation: "none", opacity: 1 }}
              >
                <span className="figure-label">{b.kicker}</span>
                <span className="figure-value" style={{ fontSize: 17 }}>
                  {b.line}
                </span>
                {b.detail && <span className="figure-note">{b.detail}</span>}
              </div>
            ))}
          </div>
        }
        primary={{ label: "Begin", onClick: enter }}
      />
    );
  }

  return (
    <NarrativePage
      sceneNode={
        <>
          {SEQUENCE.map((f, i) => (
            <MediaSlot
              key={f.image}
              id={`INTRO-${i + 1}`}
              src={f.image}
              alt={
                i === 0
                  ? `Introduction to the simulation. ${INTRO_TRANSCRIPT}`
                  : f.alt
              }
              frame={{ x: 0, y: 0, w: 0, h: 0, z: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: frameIndex === i ? 1 : 0,
                transition: "opacity 900ms ease",
              }}
            />
          ))}
          <div className="scene-treatment scene-treatment-left" />
        </>
      }
      kicker={titleShown ? INTRO_TITLE.kicker : active?.kicker}
      title={
        titleShown
          ? INTRO_TITLE.line.split("\n")
          : active
            ? active.line
            : undefined
      }
      lede={!titleShown && active?.detail ? active.detail : undefined}
      overlaySlot={
        <div className="intro-progress" aria-hidden="true">
          <span
            style={{ width: `${Math.min(100, (t / INTRO_DURATION) * 100)}%` }}
          />
        </div>
      }
      primary={{ label: titleShown ? "Begin" : "Skip", onClick: enter }}
    />
  );
}
