/* PAGE 01 — OPENING. No decision, no progress metrics, no back nav.

   The cold open: one still, the title, and a single way forward. It renders on
   the same fluid glass shell as every other screen, with the HUD reduced to the
   state identity — there is no campaign to report on yet. */

import { useNavigate } from "../lib/navigate";
import { MapPin } from "@phosphor-icons/react";
import { NarrativePage } from "../components/NarrativePage";
import { useSimulation } from "../state/store";
import { TOTAL_PAGES } from "../content/decisionPages";

export default function Page01Opening() {
  const navigate = useNavigate();
  const { update } = useSimulation();

  return (
    <NarrativePage
      scene={{
        image: "p01-clinic-cold-open-poster.webp",
        imageId: "IMG-01",
        imageAlt:
          "Rural Ikara immunisation outreach room. A hesitant Hausa mother holding her toddler pauses inside the clinic while a community health worker waits beside the vaccination table.",
        treatment: "hero",
      }}
      hud={{
        icon: MapPin,
        kicker: "Kaduna State, Nigeria",
        title: "Routine immunisation campaign",
        stage: { label: "Status", value: "BEFORE WEEK 1" },
        progress: { current: 1, total: TOTAL_PAGES },
      }}
      kicker="A social marketing simulation"
      title={["RIGHT MESSAGE,", "RIGHT CHANNEL"]}
      lede="Three local government areas. One budget. Ten weeks to change what families believe about a vaccine."
      note="You will diagnose the barriers, choose channels, spend ₦180 million, adapt at week six, and defend the result."
      meta={
        <button
          type="button"
          className="text-button"
          onClick={() => navigate("/intro")}
        >
          Watch the briefing again
        </button>
      }
      primary={{
        label: "Begin",
        onClick: () => {
          update({ currentPage: 2 });
          navigate("/mission");
        },
      }}
    />
  );
}
