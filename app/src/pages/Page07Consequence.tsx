/* PAGE 07 — STRATEGY CONSEQUENCE. One route, four full-page designs.
   Loads only the variant matching state.strategy. No variant is labelled
   correct or wrong: each presents an evidence-based trade-off. */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaSlot } from "../components/MediaSlot";
import { BackNav, PageLabel, Shade } from "../components/Chrome";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import type { Strategy } from "../state/types";

const VARIANTS: Record<
  Strategy,
  {
    label: string;
    option: string;
    src: string;
    imgId: string;
    alt: string;
    consequences: string[];
    rationale: string;
  }
> = {
  "digital-first": {
    label: "DIGITAL-FIRST",
    option: "OPTION A",
    src: "p07-digital-first.webp",
    imgId: "IMG-07A",
    alt: "Outside an urban Kaduna primary health centre, campaign officers show parents coordinated WhatsApp and SMS information while a rural outreach photograph and paper map sit unattended at the edge.",
    consequences: [
      "METRO ENGAGEMENT ↑",
      "ONLINE RESPONSE FASTER",
      "RURAL HESITANCY PERSISTS",
    ],
    rationale:
      "Strong for urban communication and rapid misinformation response, but limited digital access and deeper trust barriers remain. Digital tools improve speed but cannot replace offline trust-building mechanisms.",
  },
  "community-trust": {
    label: "COMMUNITY TRUST",
    option: "OPTION B",
    src: "p07-community-trust.webp",
    imgId: "IMG-07B",
    alt: "A community meeting under a shade tree in rural Ikara. A female community health worker and a respected community leader discuss vaccine safety with families while several more wait.",
    consequences: [
      "IKARA ACCEPTANCE ↑",
      "COMMUNITY TRUST STRONGER",
      "CHW WORKLOAD ↑",
    ],
    rationale:
      "Highly effective for addressing hesitancy in rural communities, but limited in scale and demanding on field teams. Trust-based communication is powerful but requires system capacity and scalability.",
  },
  "high-visibility": {
    label: "HIGH VISIBILITY",
    option: "OPTION C",
    src: "p07-high-visibility.webp",
    imgId: "IMG-07C",
    alt: "An urban Kaduna campaign event with a television crew and roadside billboard, while a hesitant mother in the foreground walks past without engaging.",
    consequences: [
      "PUBLIC AWARENESS ↑",
      "GOVERNMENT VISIBILITY STRONG",
      "VACCINE HESITANCY PERSISTS",
    ],
    rationale:
      "Campaign awareness increases, but visibility does not directly resolve misinformation, trust barriers or behavioural drivers. Awareness alone does not lead to behaviour change.",
  },
  "integrated-adaptive": {
    label: "INTEGRATED ADAPTIVE",
    option: "OPTION D",
    src: "p07-integrated-adaptive.webp",
    imgId: "IMG-07D",
    alt: "Coordinated Kaduna campaign activity: a community leader speaking with families, a health worker listening, a radio presenter through an open booth window and an officer reviewing phone responses.",
    consequences: [
      "TRUST ACROSS LGAS ↑",
      "MESSAGE COORDINATION ↑",
      "MONITORING COMPLEXITY ↑",
    ],
    rationale:
      "The channel mix matches audience needs across rural and urban settings while increasing coordination and monitoring complexity. Effective public health communication requires adaptive, audience-specific strategies.",
  },
};

const CELL_FRAMES = [
  { x: 61, w: 282 },
  { x: 407, w: 305 },
  { x: 767, w: 310 },
];

export default function Page07Consequence() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [shown, setShown] = useState(state.reducedMotion);

  useEffect(() => {
    if (state.reducedMotion) return;
    const t = window.setTimeout(() => setShown(true), 1200);
    return () => window.clearTimeout(t);
  }, [state.reducedMotion]);

  // The guard prevents this, but never render a default variant.
  if (!state.strategy) return null;
  const v = VARIANTS[state.strategy];

  return (
    <div className="page-enter">
      <MediaSlot
        id={v.imgId}
        src={v.src}
        alt={v.alt}
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
      />
      <Shade
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 2 }}
        background="linear-gradient(180deg, rgba(10,10,8,.32), transparent 40%, rgba(10,10,8,.76) 84%)"
      />

      <PageLabel>Strategy Consequence</PageLabel>
      <p
        style={box(
          { x: 40, y: 70, w: 420, h: 30, z: 20 },
          typeStyle("body", { fontSize: 21, lineHeight: "24px" }),
        )}
      >
        {v.label}
      </p>
      <p
        style={box(
          { x: 1515, y: 43, w: 118, h: 22, z: 20 },
          typeStyle("bodySmall", {
            fontSize: 16,
            lineHeight: "20px",
            textAlign: "right",
          }),
        )}
      >
        {v.option}
      </p>

      <p
        style={box(
          { x: 40, y: 700, w: 900, h: 90, z: 20 },
          {
            ...typeStyle("bodySmall", { fontSize: 16 }),
            opacity: shown ? 1 : 0,
            transition: "opacity 400ms ease",
          },
        )}
      >
        {v.rationale}
      </p>

      <Shade
        frame={{ x: 0, y: 837, w: 1672, h: 104, z: 18 }}
        background="rgba(13,13,11,.78)"
      />

      {v.consequences.map((text, i) => (
        <div
          key={text}
          style={box(
            { x: CELL_FRAMES[i].x, y: 855, w: CELL_FRAMES[i].w, h: 55, z: 20 },
            {
              borderLeft: i > 0 ? "1px solid var(--line-dark)" : undefined,
              paddingLeft: i > 0 ? 20 : 0,
              opacity: shown ? 1 : 0,
              transition: `opacity 400ms ease ${i * 120}ms`,
            },
          )}
        >
          <span
            style={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 11,
              lineHeight: "14px",
              color: "var(--accent-active)",
              display: "block",
            }}
          >
            CONSEQUENCE {i + 1}
          </span>
          <span
            style={{
              fontFamily: "Inter, Arial, sans-serif",
              fontWeight: 300,
              fontSize: 18,
              lineHeight: "22px",
              color: "var(--cream)",
              display: "block",
              marginTop: 4,
            }}
          >
            {text}
          </span>
        </div>
      ))}

      <BackNav
        onClick={() => {
          update({ currentPage: 6 });
          navigate("/strategy");
        }}
        frame={{ x: 61, y: 795, w: 180, h: 28 }}
      />

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 8 });
          navigate("/budget");
        }}
        style={box(
          { x: 1338, y: 852, w: 270, h: 47, z: 20 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.34)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
          },
        )}
      >
        CONTINUE TO BUDGET
      </button>
    </div>
  );
}
