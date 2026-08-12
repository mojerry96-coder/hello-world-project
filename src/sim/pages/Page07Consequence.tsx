/* PAGE 07 — STRATEGY CONSEQUENCE. One route, four full-page designs.
   Loads only the variant matching state.strategy. No variant is labelled
   correct or wrong: each presents an evidence-based trade-off. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { GitBranch, TrendUp } from "@phosphor-icons/react";
import { NarrativePage, FigureGrid } from "../components/NarrativePage";
import { useSimulation } from "../state/store";
import { useCampaignHud } from "../content/decisionPages";
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

export default function Page07Consequence() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [shown, setShown] = useState(state.reducedMotion);
  const hud = useCampaignHud(7, "Strategy consequence", "What follows from it");

  useEffect(() => {
    if (state.reducedMotion) return;
    const t = window.setTimeout(() => setShown(true), 1200);
    return () => window.clearTimeout(t);
  }, [state.reducedMotion]);

  // The guard prevents this, but never render a default variant.
  if (!state.strategy) return null;
  const v = VARIANTS[state.strategy];

  return (
    <NarrativePage
      scene={{
        image: v.src,
        imageId: v.imgId,
        imageAlt: v.alt,
      }}
      hud={{
        icon: GitBranch,
        ...hud,
        title: v.label,
        onBack: () => {
          update({ currentPage: 6 });
          navigate("/strategy");
        },
      }}
      kicker={v.option}
      title="THE TRADE-OFF"
      lede={
        <span
          style={{
            opacity: shown ? 1 : 0,
            transition: state.reducedMotion ? "none" : "opacity 500ms ease",
          }}
        >
          {v.rationale}
        </span>
      }
      aside={
        <FigureGrid
          animate={!state.reducedMotion}
          columns={3}
          figures={v.consequences.map((text, i) => ({
            label: `Consequence ${i + 1}`,
            value: text.replace(/\s*↑$/, ""),
            note: text.endsWith("↑") ? "Rising" : undefined,
          }))}
        />
      }
      meta={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            opacity: shown ? 1 : 0,
            transition: state.reducedMotion ? "none" : "opacity 500ms ease",
          }}
        >
          <TrendUp size={15} weight="bold" aria-hidden />
          Projected direction of travel for this strategy
        </span>
      }
      primary={{
        label: "Continue to budget",
        onClick: () => {
          update({ currentPage: 8 });
          navigate("/budget");
        },
      }}
    />
  );
}
