/* PAGE 02 — MISSION BRIEFING.
   The CTA commits navigation only; it changes no score, budget or strategy. */

import { useNavigate } from "../lib/navigate";
import { Briefcase } from "@phosphor-icons/react";
import { NarrativePage, FigureGrid } from "../components/NarrativePage";
import { VoiceOver } from "../components/VoiceOver";
import { useSimulation } from "../state/store";
import { GOAL_LINE } from "../content/story";
import { TOTAL_PAGES } from "../content/decisionPages";

const DIRECTOR_MESSAGE =
  "Before selecting communication channels, understand why communities are hesitant. The strategy must address the barriers affecting vaccine acceptance.";

export default function Page02Mission() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();

  return (
    <NarrativePage
      scene={{
        image: "p02-mission-room.webp",
        imageId: "IMG-02",
        imageAlt:
          "Kaduna SPHCDA strategy room. The Programme Director stands beside a paper wall map of Kaduna State pointing toward Metro, Zaria and Ikara while two staff work at a table of printed immunisation reports.",
        imagePosition: "62% 48%",
        treatment: "left",
      }}
      hud={{
        icon: Briefcase,
        kicker: "Your mission",
        title: "Health Communication Officer",
        stage: { label: "Campaign week", value: "PLANNING" },
        budget: { label: "Budget", value: "₦180M" },
        progress: { current: 2, total: TOTAL_PAGES },
        onBack: () => {
          update({ currentPage: 1 });
          navigate("/opening");
        },
      }}
      kicker="Programme Director"
      title="THE BRIEF"
      lede={DIRECTOR_MESSAGE}
      note={
        <>
          <strong style={{ fontWeight: 600 }}>Your objective — </strong>
          {GOAL_LINE}
        </>
      }
      aside={
        <FigureGrid
          animate={!state.reducedMotion}
          columns={3}
          figures={[
            { label: "Role", value: "HCO", note: "Health Communication Officer" },
            { label: "Timeline", value: "10", note: "Campaign weeks" },
            { label: "Budget", value: "₦180M", note: "Single allocation" },
          ]}
        />
      }
      meta={<VoiceOver cue="VO-02" delay={650} inline />}
      primary={{
        label: "Accept assignment",
        onClick: () => {
          update({ currentPage: 3 });
          navigate("/baseline");
        },
      }}
    />
  );
}
