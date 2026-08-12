/* PAGE 04 — FIELD EVIDENCE MAP.
   Unscored exploration. No hotspot is correct or incorrect. The CTA unlocks
   only at 3/3 and visited hotspots stay revisitable. */

import { useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Check } from "@phosphor-icons/react";
import { MediaSlot } from "../components/MediaSlot";
import { BackNav, PageLabel, Shade } from "../components/Chrome";
import { MinimalRipple } from "../components/MinimalRipple";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";
import { fieldEvidence } from "../content/pages";
import { useSimulation } from "../state/store";
import type { RegionId } from "../state/types";

/* Measured against the generated map image, not the layout spec. The spec's
   coordinates were written before the artwork existed, so the pins sat in empty
   country while the printed city labels — which are part of the photograph and
   not clickable — sat elsewhere. Learners clicked the labels and got nothing.
   These centres land on the three pin heads in p04-evidence-map.webp. */
const HOTSPOTS: { id: RegionId; frame: Box }[] = [
  { id: "metro", frame: { x: 773, y: 343, w: 64, h: 64, z: 24 } },
  { id: "zaria", frame: { x: 820, y: 216, w: 64, h: 64, z: 24 } },
  { id: "ikara", frame: { x: 965, y: 408, w: 64, h: 64, z: 24 } },
];

const SUMMARY_FRAMES: Record<RegionId, Box> = {
  metro: { x: 43, y: 845, w: 356, h: 64, z: 20 },
  zaria: { x: 442, y: 845, w: 388, h: 64, z: 20 },
  ikara: { x: 880, y: 845, w: 438, h: 64, z: 20 },
};

export default function Page04FieldEvidence() {
  const navigate = useNavigate();
  const { state, apply, update } = useSimulation();
  const [active, setActive] = useState<RegionId | null>(null);

  const visited = state.visitedRegions;
  const complete = visited.length >= 3;

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
    <div className="page-enter">
      <MediaSlot
        id="IMG-04"
        src="p04-evidence-map.webp"
        alt="Overhead evidence table in a Kaduna strategy room. A large printed map of Kaduna State with Metro, Zaria and Ikara marked by pins, surrounded by field photographs, monitoring notes and a handheld radio."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(12,12,10,.36), transparent 28%, rgba(12,12,10,.76) 84%)"
      />

      <PageLabel>Field Evidence</PageLabel>
      <p
        style={box(
          { x: 44, y: 128, w: 700, h: 42, z: 22 },
          {
            ...typeStyle("bodySmall", { fontSize: 17, color: "var(--cream)" }),
            background:
              "linear-gradient(90deg, rgba(10,10,8,.86) 0%, rgba(10,10,8,.6) 72%, transparent 100%)",
            borderLeft: "2px solid var(--accent)",
            padding: "5px 14px",
          },
        )}
      >
        Select each of the three marked pins on the map to read its field report.
      </p>
      <p
        style={box(
          { x: 1476, y: 43, w: 156, h: 22, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 16,
            lineHeight: "20px",
            textAlign: "right",
          }),
        )}
        aria-live="polite"
      >
        {visited.length} / 3 LOCATIONS REVIEWED
      </p>

      {/* Hotspots: 28px visible pin inside a 64px hit target. */}
      {HOTSPOTS.map(({ id, frame }) => {
        const isVisited = visited.includes(id);
        const ev = fieldEvidence[id];
        return (
          <button
            key={id}
            type="button"
            className="focusable"
            onClick={() => inspect(id)}
            aria-pressed={isVisited}
            aria-label={`${ev.title}, coverage ${ev.coverage}. ${ev.concern} ${ev.channelEvidence}`}
            style={box(frame, {
              display: "grid",
              placeItems: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            })}
          >
            <MinimalRipple size={28} active={!isVisited}>
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: `1px solid ${
                    isVisited ? "var(--accent-active)" : "rgba(238,228,213,.55)"
                  }`,
                  background: isVisited
                    ? "rgba(180,93,43,.28)"
                    : "rgba(12,12,10,.32)",
                  transition: "border-color 180ms ease, background 180ms ease",
                }}
              >
                {isVisited && (
                  <Check size={14} weight="thin" color="var(--accent-active)" />
                )}
              </span>
            </MinimalRipple>
          </button>
        );
      })}

      {/* Cinematic centred reveal for the selected location. */}
      <RevealOverlay
        open={active !== null}
        onClose={() => setActive(null)}
        label={active ? `${fieldEvidence[active].title} field report` : "Field report"}
        width={640}
      >
        {active && (
          <>
            <p style={typeStyle("label")}>{fieldEvidence[active].title}</p>
            <p
              style={typeStyle("metric", { fontSize: 72, margin: "10px 0 20px" })}
            >
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

      <Shade
        frame={{ x: 0, y: 818, w: 1672, h: 123, z: 18 }}
        background="rgba(13,13,11,.80)"
      />

      {(Object.keys(SUMMARY_FRAMES) as RegionId[]).map((id) => {
        const ev = fieldEvidence[id];
        const isVisited = visited.includes(id);
        const isActive = active === id;
        return (
          <div
            key={id}
            style={box(SUMMARY_FRAMES[id], {
              opacity: isVisited ? 1 : 0.34,
              borderLeft: `1px solid ${
                isActive ? "var(--accent-active)" : "transparent"
              }`,
              paddingLeft: 12,
              transition: "opacity 180ms ease, border-color 180ms ease",
            })}
          >
            <p style={typeStyle("label", { color: "var(--cream)" })}>
              {ev.title} — {ev.coverage}
            </p>
            <p style={typeStyle("bodySmall", { marginTop: 6 })}>{ev.summary}</p>
          </div>
        );
      })}

      <BackNav
        onClick={() => {
          update({ currentPage: 3 });
          navigate("/baseline");
        }}
        frame={{ x: 43, y: 786, w: 180, h: 28 }}
      />

      <button
        type="button"
        className="focusable"
        disabled={!complete}
        aria-disabled={!complete}
        onClick={() => {
          update({ currentPage: 5 });
          navigate("/barriers");
        }}
        style={box(
          { x: 1372, y: 850, w: 260, h: 52, z: 20 },
          {
            ...typeStyle("button"),
            background: complete ? "rgba(12,12,10,.34)" : "rgba(24,26,24,.56)",
            border: complete
              ? "1px solid var(--cream)"
              : "1px solid rgba(238,228,213,.16)",
            color: complete ? "var(--white)" : "rgba(238,228,213,.40)",
            cursor: complete ? "pointer" : "not-allowed",
          },
        )}
      >
        REVIEW FIELD REPORTS
      </button>
    </div>
  );
}
