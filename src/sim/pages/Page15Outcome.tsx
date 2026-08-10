/* PAGE 15 — CAMPAIGN OUTCOME. One route, three deterministic endings.
   15C uses the approved vertical left-side layout rather than the 15A/15B rail.
   The debrief is an overlay inside this page — there is no Page 16. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { MediaSlot } from "../components/MediaSlot";
import { Shade, Rule } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { historyLabels, defences } from "../content/history";
import { reportCompletion, resetCompletionReporting } from "../state/lms";
import { useSimulation } from "../state/store";
import { SplitText } from "../motion/SplitText";
import type { Ending } from "../state/types";
import { ArrowRight } from "@phosphor-icons/react";


const ENDINGS: Record<
  Ending,
  {
    imgId: string;
    src: string;
    alt: string;
    titleLines: [string, string];
    summary: string;
    metrics: { label: string; value: string }[];
    learning: string;
  }
> = {
  "integrated-success": {
    imgId: "IMG-15A",
    src: "p15-integrated-success.webp",
    alt: "A busy Kaduna immunisation clinic after an effective integrated campaign. Health workers vaccinate children while mothers ask questions and receive clear responses.",
    titleLines: ["INTEGRATED CHANNEL STRATEGY", "CAMPAIGN SUCCEEDS"],
    summary:
      "Channels matched audience needs and were adjusted using field evidence.",
    metrics: [
      { label: "KADUNA METRO", value: "82%" },
      { label: "IKARA", value: "38% → 61%" },
      { label: "ONLINE RUMOURS", value: "SIGNIFICANTLY REDUCED" },
      { label: "CHW WORKLOAD", value: "STABILISED" },
    ],
    learning:
      "Successful public health communication depends on aligning channels with audience needs and adapting continuously based on evidence.",
  },
  "high-visibility-limited-change": {
    imgId: "IMG-15B",
    src: "p15-high-visibility.webp",
    alt: "Urban Kaduna with highly visible campaign billboards and television coverage, while rural families remain uncertain at a clinic edge.",
    titleLines: ["HIGH VISIBILITY", "LIMITED BEHAVIOUR CHANGE"],
    summary: "Awareness increased, but trust-sensitive refusals remained.",
    metrics: [
      { label: "AWARENESS", value: "HIGH" },
      { label: "KADUNA METRO", value: "MODERATE IMPROVEMENT" },
      { label: "IKARA", value: "38% → 44%" },
      { label: "RURAL HESITANCY", value: "PERSISTS" },
    ],
    learning:
      "High visibility improves awareness, but awareness alone does not lead to behaviour change. Without trust and engagement, hesitancy remains.",
  },
  "strong-trust-limited-scale": {
    imgId: "IMG-15C",
    src: "p15-strong-trust.webp",
    alt: "A community immunisation session in rural Ikara. A community health worker and respected leader speak confidently with mothers and elders, but only a small group is present.",
    titleLines: ["STRONG TRUST", "LIMITED SCALE"],
    summary:
      "Trust-sensitive communities improved, but overall expansion remained slow.",
    metrics: [
      { label: "COMMUNITY CONFIDENCE", value: "HIGH" },
      { label: "VACCINE REFUSALS", value: "DECLINING" },
      { label: "OVERALL COVERAGE", value: "SLOW GROWTH" },
      { label: "URBAN EXPANSION", value: "MODERATE" },
    ],
    learning:
      "Trust is essential for behaviour change, but sustainable impact requires scalable communication systems beyond interpersonal engagement.",
  },
};

const RAIL_FRAMES = [
  { x: 54, w: 306 },
  { x: 362, w: 350 },
  { x: 714, w: 522 },
  { x: 1238, w: 380 },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 10,
          lineHeight: "13px",
          color: "var(--cream)",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: 300,
          fontSize: 20,
          lineHeight: "24px",
          color: "var(--cream)",
          margin: "2px 0 0",
        }}
      >
        {value}
      </p>
    </>
  );
}

export default function Page15Outcome() {
  const navigate = useNavigate();
  const { state, reset } = useSimulation();
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [revealed, setRevealed] = useState(state.reducedMotion ? 3 : 0);

  useEffect(() => {
    if (state.reducedMotion) return;
    const timers = [0, 1, 2].map((i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 300 + i * 400),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [state.reducedMotion]);

  // Report completion only once the ending has actually rendered and the
  // debrief button is on screen — never from the Page 14 submission.
  useEffect(() => {
    if (state.ending) reportCompletion(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ending]);

  if (!state.ending) return null;
  const e = ENDINGS[state.ending];
  const isTrustLayout = state.ending === "strong-trust-limited-scale";
  const h = historyLabels(state);

  return (
    <div className="page-enter">
      <MediaSlot
        id={e.imgId}
        src={e.src}
        alt={e.alt}
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />

      {isTrustLayout ? (
        <>
          <Shade
            frame={{ x: 0, y: 0, w: 735, h: 941, z: 2 }}
            background="linear-gradient(90deg, rgba(10,10,8,.94), rgba(10,10,8,.66) 76%, transparent)"
          />
          <Shade
            frame={{ x: 0, y: 810, w: 1672, h: 131, z: 2 }}
            background="rgba(10,10,8,.58)"
          />

          <p
            style={box(
              { x: 63, y: 52, w: 300, h: 28, z: 20 },
              typeStyle("bodySmall", {
                fontSize: 20,
                lineHeight: "24px",
                color: "var(--cream)",
                letterSpacing: "0.1em",
              }),
            )}
          >
            CAMPAIGN OUTCOME
          </p>
          <Rule
            frame={{ x: 63, y: 120, w: 585, h: 2, z: 20 }}
            background="var(--accent)"
          />
          <div style={box({ x: 63, y: 150, w: 590, h: 150, z: 20 })}>
            <SplitText
              as="h1"
              text={e.titleLines[0]}
              by="char"
              stagger={0.02}
              rise={26}
              style={typeStyle("displayXL", { fontSize: 56, lineHeight: 1.14 })}
            />
            <SplitText
              as="h2"
              text={e.titleLines[1]}
              by="char"
              delay={0.22}
              stagger={0.02}
              rise={26}
              style={typeStyle("displayXL", { fontSize: 56, lineHeight: 1.14 })}
            />
          </div>

          {e.metrics.map((m, i) => (
            <div
              key={m.label}
              style={box(
                { x: 64, y: 386 + i * 66, w: 520, h: 44, z: 20 },
                {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: "1px solid var(--line-light)",
                  paddingBottom: 8,
                },
              )}
            >
              <span
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 300,
                  fontSize: 20,
                  lineHeight: "24px",
                  color: "var(--cream)",
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 300,
                  fontSize: 20,
                  lineHeight: "24px",
                  color: "var(--cream)",
                }}
              >
                {m.value}
              </span>
            </div>
          ))}

          <p
            style={box(
              { x: 64, y: 670, w: 520, h: 86, z: 20 },
              typeStyle("body", { fontSize: 20, lineHeight: 1.55 }),
            )}
          >
            {e.learning}
          </p>

          <Rule
            frame={{ x: 0, y: 839, w: 1672, h: 2, z: 20 }}
            background="var(--accent)"
          />
          <button
            type="button"
            className="focusable"
            onClick={() => setDebriefOpen(true)}
            style={box(
              { x: 64, y: 873, w: 270, h: 40, z: 20 },
              {
                ...typeStyle("body", { fontSize: 20, lineHeight: "24px" }),
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: 10,
              },
            )}
          >
            VIEW DEBRIEF
            <ArrowRight size={18} weight="bold" aria-hidden />

          </button>
        </>
      ) : (
        <>
          <Shade
            frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
            background="linear-gradient(90deg, rgba(10,10,8,.86), rgba(10,10,8,.34) 62%, transparent), linear-gradient(0deg, rgba(10,10,8,.90), transparent 48%)"
          />

          <p
            style={box(
              { x: 54, y: 70, w: 340, h: 22, z: 20 },
              typeStyle("bodySmall", { fontSize: 16, lineHeight: "20px" }),
            )}
          >
            CAMPAIGN OUTCOME
          </p>
          <div style={box({ x: 54, y: 104, w: 780, h: 106, z: 20 })}>
            <SplitText
              as="h1"
              text={e.titleLines[0]}
              by="char"
              stagger={0.018}
              rise={22}
              style={typeStyle("displayL", { fontSize: 48, lineHeight: 1.06 })}
            />
            <SplitText
              as="h2"
              text={e.titleLines[1]}
              by="char"
              delay={0.2}
              stagger={0.018}
              rise={22}
              style={typeStyle("displayL", { fontSize: 48, lineHeight: 1.06 })}
            />
          </div>
          <p
            style={box(
              { x: 54, y: 220, w: 720, h: 58, z: 20 },
              {
                ...typeStyle("bodySmall"),
                opacity: revealed > 1 ? 1 : 0,
                transition: "opacity 400ms ease",
              },
            )}
          >
            {e.summary}
          </p>

          <div
            style={box(
              { x: 0, y: 775, w: 1672, h: 78, z: 18 },
              {
                background: "rgba(15,15,12,.70)",
                border: "1px solid var(--line-dark)",
                opacity: revealed > 2 ? 1 : 0,
                transition: "opacity 400ms ease",
              },
            )}
          />
          {e.metrics.map((m, i) => (
            <div
              key={m.label}
              style={box(
                { x: RAIL_FRAMES[i].x, y: 793, w: RAIL_FRAMES[i].w, h: 42, z: 20 },
                {
                  opacity: revealed > 2 ? 1 : 0,
                  transition: "opacity 400ms ease",
                },
              )}
            >
              <Metric label={m.label} value={m.value} />
            </div>
          ))}

          <p
            style={box(
              { x: 54, y: 878, w: 1120, h: 34, z: 20 },
              typeStyle("bodySmall", { fontSize: 16, lineHeight: "22px" }),
            )}
          >
            {e.learning}
          </p>

          <button
            type="button"
            className="focusable"
            onClick={() => setDebriefOpen(true)}
            style={box(
              { x: 1350, y: 856, w: 268, h: 54, z: 20 },
              {
                ...typeStyle("button"),
                background: "rgba(12,12,10,.34)",
                border: "1px solid var(--cream)",
                cursor: "pointer",
              },
            )}
          >
            VIEW DEBRIEF
          </button>
        </>
      )}

      {/* Debrief overlay — stays inside Page 15. */}
      {debriefOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Decision debrief"
          style={box(
            { x: 0, y: 0, w: 1672, h: 941, z: 40 },
            { background: "rgba(10,10,8,.95)", padding: "72px 96px", overflow: "auto" },
          )}
        >
          <p style={typeStyle("label")}>DECISION DEBRIEF</p>
          <h2 style={typeStyle("displayM", { margin: "12px 0 28px" })}>
            What your decisions produced
          </h2>

          <dl style={{ margin: 0, display: "grid", gap: 16, maxWidth: 1200 }}>
            {[
              {
                t: "Diagnosis",
                v: h.diagnosis,
                e: `Scored from your first placement of each report. ${
                  state.diagnosis === "strong"
                    ? "An accurate diagnosis strengthened everything that followed."
                    : "Misdiagnosis reduces the effectiveness of every later choice."
                }`,
              },
              {
                t: "Strategy",
                v: h.strategy,
                e: "Determined which audiences your channels could actually reach.",
              },
              {
                t: "Budget profile",
                v: `${h.budget} — community ₦${state.budget.community}M · radio ₦${state.budget.radio}M · digital ₦${state.budget.digital}M · TV/outdoor ₦${state.budget.tvOutdoor}M`,
                e: "Allocation, not total spend, decided which barriers were addressed.",
              },
              {
                t: "Week 7–10 adaptation",
                v: h.adjustment,
                e: state.adjustmentJustification
                  ? `Your justification: “${state.adjustmentJustification}”`
                  : "No justification recorded.",
              },
              {
                t: "Stakeholder defence",
                v: state.defence ? defences[state.defence].label : "—",
                e: state.defence ? defences[state.defence].feedback : "",
              },
            ].map((row) => (
              <div
                key={row.t}
                style={{
                  borderTop: "1px solid var(--line-dark)",
                  paddingTop: 12,
                }}
              >
                <dt style={typeStyle("label", { color: "var(--cream)" })}>
                  {row.t}
                </dt>
                <dd style={{ margin: "6px 0 0" }}>
                  <p style={typeStyle("body", { fontSize: 17 })}>{row.v}</p>
                  <p style={typeStyle("bodySmall", { marginTop: 4 })}>{row.e}</p>
                </dd>
              </div>
            ))}
          </dl>

          <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
            <button
              type="button"
              className="focusable"
              onClick={() => setDebriefOpen(false)}
              style={{
                ...typeStyle("button"),
                minHeight: 54,
                padding: "0 26px",
                background: "rgba(12,12,10,.44)",
                border: "1px solid var(--cream)",
                cursor: "pointer",
              }}
            >
              CLOSE
            </button>

            {confirmRestart ? (
              <>
                <button
                  type="button"
                  className="focusable"
                  onClick={() => {
                    resetCompletionReporting();
                    reset();
                    navigate("/opening");
                  }}
                  style={{
                    ...typeStyle("button"),
                    minHeight: 54,
                    padding: "0 26px",
                    background: "var(--error)",
                    border: "1px solid var(--error)",
                    cursor: "pointer",
                  }}
                >
                  CONFIRM — ERASE PROGRESS
                </button>
                <button
                  type="button"
                  className="focusable"
                  onClick={() => setConfirmRestart(false)}
                  style={{
                    ...typeStyle("button"),
                    minHeight: 54,
                    padding: "0 26px",
                    background: "transparent",
                    border: "1px solid var(--line-dark)",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
              </>
            ) : (
              <button
                type="button"
                className="focusable"
                onClick={() => setConfirmRestart(true)}
                style={{
                  ...typeStyle("button"),
                  minHeight: 54,
                  padding: "0 26px",
                  background: "transparent",
                  border: "1px solid var(--line-dark)",
                  cursor: "pointer",
                }}
              >
                RESTART SIMULATION
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
