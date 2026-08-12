/* PAGE 15 — CAMPAIGN OUTCOME. One route, three deterministic endings.
   The debrief is an overlay inside this page — there is no Page 16. */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "../lib/navigate";
import InfiniteMenu, { isWebGL2Available } from "../components/InfiniteMenu";
import { archiveMenuItems, buildArchive } from "../content/archive";

import { Flag } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { typeStyle } from "../design/type";
import { historyLabels, defences } from "../content/history";
import { hauwaEnding } from "../content/story";
import { CAMPAIGN_WEEKS, coverageAtWeek } from "../state/coverage";
import { reportCompletion, resetCompletionReporting } from "../state/lms";
import { useSimulation } from "../state/store";
import { useCampaignHud } from "../content/decisionPages";
import type { Ending } from "../state/types";

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
      { label: "Kaduna Metro", value: "82%" },
      { label: "Ikara", value: "38% → 61%" },
      { label: "Online rumours", value: "Significantly reduced" },
      { label: "CHW workload", value: "Stabilised" },
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
      { label: "Awareness", value: "High" },
      { label: "Kaduna Metro", value: "Moderate improvement" },
      { label: "Ikara", value: "38% → 44%" },
      { label: "Rural hesitancy", value: "Persists" },
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
      { label: "Community confidence", value: "High" },
      { label: "Vaccine refusals", value: "Declining" },
      { label: "Overall coverage", value: "Slow growth" },
      { label: "Urban expansion", value: "Moderate" },
    ],
    learning:
      "Trust is essential for behaviour change, but sustainable impact requires scalable communication systems beyond interpersonal engagement.",
  },
};

export default function Page15Outcome() {
  const navigate = useNavigate();
  const { state, reset } = useSimulation();
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [debriefTab, setDebriefTab] = useState<"decisions" | "archive">("decisions");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const hud = useCampaignHud(15, "Campaign outcome", "Week 10 result");
  const animate = !state.reducedMotion;

  // The archive falls back to cards when motion is reduced or WebGL2 is absent,
  // so nothing in it is reachable only by dragging.
  const archive = useMemo(() => buildArchive(state), [state]);
  const archiveItems = useMemo(() => archiveMenuItems(state), [state]);
  const sphereAvailable = !state.reducedMotion && isWebGL2Available();


  // Report completion only once the ending has actually rendered and the
  // debrief button is on screen — never from the Page 14 submission.
  useEffect(() => {
    if (state.ending) reportCompletion(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ending]);

  if (!state.ending) return null;
  const e = ENDINGS[state.ending];
  const finalCoverage = coverageAtWeek(state, CAMPAIGN_WEEKS);
  const h = historyLabels(state);

  const debriefRows = [
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
  ];

  return (
    <NarrativePage
      {...(sphereAvailable
        ? {
            /* The archive sphere IS the background of this page. */
            sceneNode: (
              <InfiniteMenu
                items={archiveItems}
                scale={1.35}
                className={`infinite-menu--scene${animate ? "" : " is-static"}`}
                ariaLabel="Campaign archive. Drag to rotate through the scenes of your run."
                hint="Drag to rotate"
              />
            ),
          }
        : {
            scene: {
              image: e.src,
              imageId: e.imgId,
              imageAlt: e.alt,
              imagePosition: "68% 46%",
              treatment: "left" as const,
            },
          })}
      sheetBare
      hud={{ icon: Flag, ...hud }}
      kicker="Campaign outcome"
      title={e.titleLines}
      lede={
        <>
          {e.summary}
          <span className="outcome-hauwa">
            <span className="figure-label">In Ikara</span>
            {hauwaEnding(finalCoverage)}
          </span>
        </>
      }
      note={e.learning}
      aside={
        <div className="archive-aside">
          {!sphereAvailable && (
            <div
              className="figure-grid"
              style={{ ["--figure-columns" as string]: 2 }}
            >
              {archive.map((entry) => (
                <div
                  key={entry.id}
                  className="figure-card"
                  style={{ animation: "none", opacity: 1 }}
                >
                  <span className="figure-label">{entry.title}</span>
                  <span className="figure-note">{entry.description}</span>
                </div>
              ))}
            </div>
          )}
          <div className="figure-grid" style={{ ["--figure-columns" as string]: 2 }}>
            {e.metrics.map((m, i) => (
              <div
                key={m.label}
                className="figure-card"
                style={
                  animate
                    ? { animationDelay: `${640 + i * 90}ms` }
                    : { animation: "none", opacity: 1 }
                }
              >
                <span className="figure-label">{m.label}</span>
                <span className="figure-value" style={{ fontSize: 19 }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      }
      primary={{
        label: "View debrief",
        onClick: () => setDebriefOpen(true),
      }}
      overlay={
        debriefOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Decision debrief"
            className="debrief-panel"
          >
            <p style={typeStyle("label")}>DECISION DEBRIEF</p>
            <h2 style={typeStyle("displayM", { margin: "12px 0 24px" })}>
              What your decisions produced
            </h2>

            <div className="debrief-tabs" role="tablist" aria-label="Debrief views">
              {(
                [
                  ["decisions", "Decisions"],
                  ["archive", "Campaign archive"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  className="debrief-tab"
                  aria-selected={debriefTab === id}
                  onClick={() => setDebriefTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {debriefTab === "decisions" ? (
              <dl className="debrief-rows">
                {debriefRows.map((row) => (
                  <div key={row.t} className="debrief-row">
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
            ) : sphereAvailable ? (
              <InfiniteMenu
                items={archiveItems}
                scale={1.5}
                ariaLabel="Campaign archive. Drag to rotate through the scenes of your run."
              />
            ) : (
              <div
                className="figure-grid"
                style={{ ["--figure-columns" as string]: 3 }}
              >
                {archive.map((entry) => (
                  <div
                    key={entry.id}
                    className="figure-card"
                    style={{ animation: "none", opacity: 1 }}
                  >
                    <span className="figure-label">{entry.title}</span>
                    <span className="figure-note">{entry.description}</span>
                  </div>
                ))}
              </div>
            )}


            <div className="debrief-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setDebriefOpen(false)}
              >
                Close
              </button>
              {confirmRestart ? (
                <>
                  <button
                    type="button"
                    className="ghost-button is-danger"
                    onClick={() => {
                      resetCompletionReporting();
                      reset();
                      navigate("/opening");
                    }}
                  >
                    Confirm — erase progress
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setConfirmRestart(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setConfirmRestart(true)}
                >
                  Restart simulation
                </button>
              )}
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
