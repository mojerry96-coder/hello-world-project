/* PAGE 03 — CAMPAIGN BASELINE. Three full-height regional columns.
   Informative only: no region is selectable and no score changes here.
   Situation detail lives in the accessible description, then surfaces on Page 4. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { PageLabel, PageMarker, Shade, BackNav } from "../components/Chrome";
import { VoiceOver } from "../components/VoiceOver";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";

const REGIONS = [
  {
    id: "IMG-03A",
    src: "p03-kaduna-metro.webp",
    name: "KADUNA METRO",
    coverage: "70%",
    frame: { x: 0, y: 0, w: 544, h: 941, z: 0 } as Box,
    labelFrame: { x: 67, y: 727, w: 260, h: 28, z: 10 } as Box,
    metricFrame: { x: 64, y: 770, w: 340, h: 112, z: 10 } as Box,
    alt: "Kaduna Metro, 70% coverage. Parents outside a primary health care centre review immunisation messages on smartphones. Digital engagement is strong but misinformation is increasing online.",
    delay: 450,
  },
  {
    id: "IMG-03B",
    src: "p03-zaria.webp",
    name: "ZARIA",
    coverage: "45%",
    frame: { x: 544, y: 0, w: 584, h: 941, z: 0 } as Box,
    labelFrame: { x: 581, y: 727, w: 260, h: 28, z: 10 } as Box,
    metricFrame: { x: 578, y: 770, w: 340, h: 112, z: 10 } as Box,
    alt: "Zaria, 45% coverage. A male community health worker speaks with cautious parents and elders seated under tree shade. Moderate uptake; trust-building is required.",
    delay: 650,
  },
  {
    id: "IMG-03C",
    src: "p03-ikara.webp",
    name: "IKARA",
    coverage: "38%",
    frame: { x: 1128, y: 0, w: 544, h: 941, z: 0 } as Box,
    labelFrame: { x: 1166, y: 727, w: 260, h: 28, z: 10 } as Box,
    metricFrame: { x: 1163, y: 770, w: 340, h: 112, z: 10 } as Box,
    alt: "Ikara, 38% coverage. A concerned Hausa mother holds her toddler and looks away at an outreach point. High refusal linked to rumours and misinformation.",
    delay: 850,
  },
];

export default function Page03Baseline() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [revealed, setRevealed] = useState<number>(state.reducedMotion ? 3 : 0);
  const [ctaShown, setCtaShown] = useState(state.reducedMotion);

  useEffect(() => {
    if (state.reducedMotion) return;
    const timers = REGIONS.map((r, i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), r.delay),
    );
    const cta = window.setTimeout(() => setCtaShown(true), 1900);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(cta);
    };
  }, [state.reducedMotion]);

  return (
    <div className="page-enter">
      {REGIONS.map((r) => (
        <MediaSlot key={r.id} id={r.id} src={r.src} alt={r.alt} frame={r.frame} />
      ))}

      {/* 1px cream dividers between the three columns */}
      <div
        aria-hidden="true"
        style={box(
          { x: 543, y: 0, w: 1, h: 941, z: 1 },
          { background: "rgba(238,228,213,.5)" },
        )}
      />
      <div
        aria-hidden="true"
        style={box(
          { x: 1127, y: 0, w: 1, h: 941, z: 1 },
          { background: "rgba(238,228,213,.5)" },
        )}
      />

      <Shade
        frame={{ x: 0, y: 555, w: 1672, h: 386, z: 2 }}
        background="linear-gradient(0deg, rgba(10,10,8,.78), transparent)"
      />

      <PageLabel>Campaign Baseline</PageLabel>
      <PageMarker page={3} />
      <VoiceOver cue="VO-03" delay={800} frame={{ x: 31, y: 620, w: 320, h: 40, z: 24 }} />

      {REGIONS.map((r, i) => {
        const shown = revealed > i;
        const fade = {
          opacity: shown ? 1 : 0,
          transition: "opacity 400ms ease",
        };
        return (
          <div key={`${r.id}-text`}>
            <p
              style={box(r.labelFrame, {
                ...typeStyle("body", {
                  fontSize: 18,
                  lineHeight: "22px",
                  fontWeight: 300,
                }),
                ...fade,
              })}
            >
              {r.name}
            </p>
            <p
              style={box(r.metricFrame, {
                ...typeStyle("metric", { fontSize: 94, lineHeight: 0.96 }),
                ...fade,
              })}
            >
              {r.coverage}
            </p>
          </div>
        );
      })}

      <BackNav
        onClick={() => {
          update({ currentPage: 2 });
          navigate("/mission");
        }}
        frame={{ x: 31, y: 880, w: 180, h: 32 }}
      />

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 4 });
          navigate("/field-evidence");
        }}
        style={box(
          { x: 1508, y: 872, w: 134, h: 38, z: 10 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.30)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
            opacity: ctaShown ? 1 : 0,
            transition: "opacity 400ms ease",
            pointerEvents: ctaShown ? "auto" : "none",
          },
        )}
      >
        EXPLORE
      </button>
    </div>
  );
}
