/* PAGE 06 — SELECT COMMUNICATION STRATEGY.
   Opens with nothing selected and a disabled Continue. No option is marked
   correct here — that belongs on Page 7. */

import { useState } from "react";
import {
  Broadcast,
  DeviceMobile,
  Megaphone,
  PuzzlePiece,
  type Icon,
} from "@phosphor-icons/react";
import { useNavigate } from "../lib/navigate";
import { DecisionPage } from "../components/DecisionPage";
import { useDecisionHud } from "../content/decisionPages";
import { strategies } from "../content/pages";
import { useSimulation } from "../state/store";
import type { Strategy } from "../state/types";

const STRATEGY_ICONS: Record<Strategy, Icon> = {
  "digital-first": DeviceMobile,
  "community-trust": Broadcast,
  "high-visibility": Megaphone,
  "integrated-adaptive": PuzzlePiece,
};

export default function Page06Strategy() {
  const navigate = useNavigate();
  const { update } = useSimulation();
  const hud = useDecisionHud(6);
  // Never seeded from state on entry — the page must open unselected.
  const [selected, setSelected] = useState<Strategy | null>(null);

  const chosen = strategies.find((s) => s.id === selected);

  return (
    <DecisionPage
      {...hud}
      statement="“We cannot use every communication channel equally. Based on the evidence, what strategy should guide the next phase of the campaign?”"
      question="Choose the single strategy that will direct the campaign from here."
      aside={
        <div aria-live="polite">
          <p className="report-label">Selected strategy</p>
          <p
            className="decision-footnote"
            style={{
              margin: 0,
              color: chosen ? "var(--accent-soft)" : "var(--text-tertiary)",
            }}
          >
            {chosen ? chosen.plain : "No strategy selected"}
          </p>
          {chosen && (
            <p className="decision-footnote" style={{ margin: "8px 0 0" }}>
              {chosen.name} — {chosen.channels}
            </p>
          )}
        </div>
      }
      options={strategies.map((s) => ({
        id: s.id,
        icon: STRATEGY_ICONS[s.id],
        title: s.plain,
        subtitle: `${s.name} — ${s.channels}`,
      }))}
      columns={4}
      optionsLabel="Communication strategy"
      selected={selected}
      onSelect={(id) => setSelected(id as Strategy)}
      submitLabel="Continue"
      submitDisabled={selected === null}
      onSubmit={() => {
        if (!selected) return;
        update({ strategy: selected, currentPage: 7 });
        navigate("/strategy-consequence");
      }}
    />
  );
}
