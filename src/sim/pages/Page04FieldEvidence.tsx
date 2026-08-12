/* PAGE 04 — FIELD EVIDENCE MAP.
   Unscored exploration. No hotspot is correct or incorrect. The CTA unlocks
   only at 3/3 and visited hotspots stay revisitable. */

import { useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Check, MapTrifold } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { MinimalRipple } from "../components/MinimalRipple";
import { RevealOverlay } from "../components/RevealOverlay";
import { typeStyle } from "../design/type";
import { fieldEvidence } from "../content/pages";
import { useSimulation } from "../state/store";
import { useCampaignHud } from "../content/decisionPages";
import type { RegionId } from "../state/types";

/* Positions are percentages of the map artwork, measured from the pin heads in
   p04-evidence-map.webp, so they hold at any viewport size. */
const HOTSPOTS: { id: RegionId; left: string; top: string }[] = [
  { id: "metro", left: "48.1%", top: "39.8%" },
  { id: "zaria", left: "50.9%", top: "26.3%" },
  { id: "ikara", left: "59.6%", top: "46.6%" },
];

const ORDER: RegionId[] = ["metro", "zaria", "ikara"];

export default function Page04FieldEvidence() {
  const navigate = useNavigate();
  const { state, apply, update } = useSimulation();
  const [active, setActive] = useState<RegionId | null>(null);
  const hud = useCampaignHud(4, "Field evidence", "Read the three locations");

  const visited = state.visitedRegions;
  const complete = visited.length >= 3;
  const animate = !state.reducedMotion;

  function inspect(id: RegionId) {
    setActive(id);
    // Revisiting is allowed and changes nothing.
    apply((s) =>
      s.visitedRegions.includes(id)
        ? {}
        : { visitedRegions: [...s.visitedRegions, id] },
    );
  }

  return (
    <NarrativePage
      scene={{
        image: "p04-evidence-map.webp",
        imageId: "IMG-04",
        imageAlt:
          "Overhead evidence table in a Kaduna strategy room. A large printed map of Kaduna State with Metro, Zaria and Ikara marked by pins, surrounded by field photographs, monitoring notes and a handheld radio.",
      }}
      hud={{
        icon: MapTrifold,
        ...hud,
        onBack: () => {
          update({ currentPage: 3 });
          navigate("/baseline");
        },
      }}
      overlaySlot={
        <>
          <p className="instruction-chip">
            Select each of the three marked pins on the map to read its field
            report.
          </p>
          <div className="hotspot-layer">
            {HOTSPOTS.map(({ id, left, top }) => {
              const isVisited = visited.includes(id);
              const ev = fieldEvidence[id];
              return (
                <button
                  key={id}
                  type="button"
                  className="hotspot"
                  style={{ left, top }}
                  onClick={() => inspect(id)}
                  aria-pressed={isVisited}
                  aria-label={`${ev.title}, coverage ${ev.coverage}. ${ev.concern} ${ev.channelEvidence}`}
                >
                  <MinimalRipple size={28} active={!isVisited}>
                    <span className="hotspot-dot" aria-hidden="true">
                      {isVisited && <Check size={14} weight="bold" />}
                    </span>
                  </MinimalRipple>
                </button>
              );
            })}
          </div>
      {/* Cinematic centred reveal for the selected location. */}
          <RevealOverlay
            open={active !== null}
            onClose={() => setActive(null)}
            fluid
            label={
              active ? `${fieldEvidence[active].title} field report` : "Field report"
            }
            width={640}
          >
            {active && (
              <>
                <p style={typeStyle("label")}>{fieldEvidence[active].title}</p>
                <p style={typeStyle("metric", { fontSize: 72, margin: "10px 0 20px" })}>
                  {fieldEvidence[active].coverage}
                </p>
                <p style={typeStyle("bodySmall", { marginBottom: 12 })}>
                  {fieldEvidence[active].concern}
                </p>
                <p style={typeStyle("bodySmall")}>
                  {fieldEvidence[active].channelEvidence}
                </p>
              </>
            )}
          </RevealOverlay>
        </>
      }
      lede="Coverage tells you where the gap is. These reports tell you why it exists."
      note={`${visited.length} of 3 locations reviewed.`}
      aside={
        <div className="figure-grid" style={{ ["--figure-columns" as string]: 3 }}>
          {ORDER.map((id, i) => {
            const ev = fieldEvidence[id];
            const isVisited = visited.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => inspect(id)}
                className={`figure-card${isVisited ? "" : " is-dim"}${
                  active === id ? " is-active" : ""
                }`}
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  ...(animate
                    ? { animationDelay: `${420 + i * 90}ms` }
                    : { animation: "none", opacity: isVisited ? 1 : 0.42 }),
                }}
              >
                <span className="figure-label">{ev.title}</span>
                <span className="figure-value">{ev.coverage}</span>
                <span className="figure-note">
                  {isVisited ? ev.summary : "Not yet reviewed"}
                </span>
              </button>
            );
          })}
        </div>
      }
      primary={{
        label: "Review field reports",
        disabled: !complete,
        onClick: () => {
          update({ currentPage: 5 });
          navigate("/barriers");
        },
      }}
    />
  );
}
