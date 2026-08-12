/* PAGE 03 — CAMPAIGN BASELINE. Three full-height regional columns.
   Informative only: no region is selectable and no score changes here.
   Situation detail lives in the accessible description, then surfaces on Page 4. */

import { useNavigate } from "../lib/navigate";
import { ChartBar } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { VoiceOver } from "../components/VoiceOver";
import { useSimulation } from "../state/store";
import { CountUp } from "../motion/CountUp";
import { useCampaignHud } from "../content/decisionPages";

const REGIONS = [
  {
    id: "IMG-03A",
    src: "p03-kaduna-metro.webp",
    name: "Kaduna Metro",
    coverage: 70,
    alt: "Kaduna Metro, 70% coverage. Parents outside a primary health care centre review immunisation messages on smartphones. Digital engagement is strong but misinformation is increasing online.",
  },
  {
    id: "IMG-03B",
    src: "p03-zaria.webp",
    name: "Zaria",
    coverage: 45,
    alt: "Zaria, 45% coverage. A male community health worker speaks with cautious parents and elders seated under tree shade. Moderate uptake; trust-building is required.",
  },
  {
    id: "IMG-03C",
    src: "p03-ikara.webp",
    name: "Ikara",
    coverage: 38,
    alt: "Ikara, 38% coverage. A concerned Hausa mother holds her toddler and looks away at an outreach point. High refusal linked to rumours and misinformation.",
  },
];

export default function Page03Baseline() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const animate = !state.reducedMotion;
  const hud = useCampaignHud(3, "Campaign baseline", "One state, three realities");

  return (
    <NarrativePage
      sceneNode={
        <div className="triptych">
          {REGIONS.map((r, i) => (
            <div className="triptych-panel" key={r.id}>
              <img
                src={`${import.meta.env.BASE_URL}media/${r.src}`}
                alt={r.alt}
              />
              <span className="triptych-veil" aria-hidden="true" />
              <div
                className="triptych-caption"
                style={
                  animate
                    ? { animationDelay: `${420 + i * 160}ms` }
                    : { animation: "none", opacity: 1 }
                }
              >
                <p className="triptych-name">{r.name}</p>
                <CountUp
                  to={r.coverage}
                  suffix="%"
                  enabled
                  duration={1.15}
                  className="triptych-value"
                />
              </div>
            </div>
          ))}
        </div>
      }
      hud={{
        icon: ChartBar,
        ...hud,
        onBack: () => {
          update({ currentPage: 2 });
          navigate("/mission");
        },
      }}
      lede="Kaduna Metro begins at 70%. Zaria at 45%. Ikara at 38% — and its refusals are driven by rumour, not distance."
      note="Coverage alone will not tell you why. The next screen puts you in the field."
      meta={<VoiceOver cue="VO-03" delay={800} inline />}
      primary={{
        label: "Explore the field",
        onClick: () => {
          update({ currentPage: 4 });
          navigate("/field-evidence");
        },
      }}
    />
  );
}
