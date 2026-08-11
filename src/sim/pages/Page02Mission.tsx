/* PAGE 02 — MISSION BRIEFING.
   The CTA commits navigation only; it changes no score, budget or strategy. */

import { useEffect, useState } from "react";
import { useNavigate } from "../lib/navigate";
import { Clock, User, Wallet } from "@phosphor-icons/react";
import { MediaSlot } from "../components/MediaSlot";
import { PageLabel, PageMarker, Shade, Rule } from "../components/Chrome";
import { VoiceOver } from "../components/VoiceOver";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";
import { useSimulation } from "../state/store";
import { GOAL_LINE } from "../content/story";

const DIRECTOR_MESSAGE =
  "Before selecting communication channels, understand why communities are hesitant. The strategy must address the barriers affecting vaccine acceptance.";

function Fact({
  frame,
  icon,
  label,
  value,
  shown,
}: {
  frame: Box;
  icon: React.ReactNode;
  label: string;
  value: string;
  shown: boolean;
}) {
  return (
    <div
      style={box(frame, {
        opacity: shown ? 1 : 0,
        transition: "opacity 400ms ease",
      })}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        <span
          style={typeStyle("label", {
            fontSize: 12,
            lineHeight: "14px",
          })}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "Manrope, system-ui, Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: 26,
          lineHeight: "32px",
          color: "var(--cream)",
          margin: "2px 0 0",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function Page02Mission() {
  const navigate = useNavigate();
  const { state, update } = useSimulation();
  const [factsShown, setFactsShown] = useState(state.reducedMotion);
  const [ctaShown, setCtaShown] = useState(state.reducedMotion);

  useEffect(() => {
    if (state.reducedMotion) return;
    const t1 = window.setTimeout(() => setFactsShown(true), 1200);
    const t2 = window.setTimeout(() => setCtaShown(true), 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [state.reducedMotion]);

  return (
    <div className="page-enter">
      <MediaSlot
        id="IMG-02"
        src="p02-mission-room.webp"
        alt="Kaduna SPHCDA strategy room. The Programme Director stands beside a paper wall map of Kaduna State pointing toward Metro, Zaria and Ikara while two staff work at a table of printed immunisation reports."
        frame={{ x: 0, y: 0, w: 1672, h: 941, z: 0 }}
        objectPosition="62% 48%"
      />

      <Shade
        frame={{ x: 0, y: 0, w: 720, h: 941, z: 2 }}
        background="linear-gradient(90deg, rgba(13,14,12,.52), transparent)"
      />
      <Shade
        frame={{ x: 0, y: 700, w: 1672, h: 241, z: 2 }}
        background="linear-gradient(0deg, rgba(13,14,12,.80), transparent)"
      />

      <PageLabel>Your Mission</PageLabel>
      <PageMarker page={2} />
      <VoiceOver cue="VO-02" delay={650} frame={{ x: 64, y: 640, w: 320, h: 40, z: 24 }} />

      <p
        style={box(
          { x: 64, y: 766, w: 900, h: 52, z: 10 },
          typeStyle("body", { fontSize: 18, lineHeight: 1.35 }),
        )}
      >
        {DIRECTOR_MESSAGE}
      </p>

      {/* The objective, stated once in words a player can act on. The
          Director's briefing above says why; this says what winning is. */}
      <div
        style={box(
          { x: 64, y: 676, w: 960, h: 68, z: 10 },
          {
            background:
              "linear-gradient(90deg, rgba(10,10,8,.86) 0%, rgba(10,10,8,.58) 74%, transparent 100%)",
            borderLeft: "2px solid var(--accent)",
            padding: "10px 18px",
          },
        )}
      >
        <p style={typeStyle("label", { color: "var(--cream)", marginBottom: 4 })}>
          Your objective
        </p>
        <p style={typeStyle("body", { fontSize: 17, color: "var(--accent-active)" })}>
          {GOAL_LINE}
        </p>
      </div>

      <Rule frame={{ x: 64, y: 839, w: 1300, h: 1, z: 10 }} />

      <Fact
        frame={{ x: 66, y: 856, w: 500, h: 42, z: 10 }}
        icon={<User size={24} weight="thin" color="var(--accent-active)" />}
        label="Role"
        value="HEALTH COMMUNICATION OFFICER"
        shown={factsShown}
      />
      <Fact
        frame={{ x: 594, y: 856, w: 350, h: 42, z: 10 }}
        icon={<Clock size={24} weight="thin" color="var(--accent-active)" />}
        label="Timeline"
        value="10 WEEKS"
        shown={factsShown}
      />
      <Fact
        frame={{ x: 970, y: 856, w: 390, h: 42, z: 10 }}
        icon={<Wallet size={24} weight="thin" color="var(--accent-active)" />}
        label="Budget"
        value="₦180 MILLION"
        shown={factsShown}
      />

      <button
        type="button"
        className="focusable"
        onClick={() => {
          update({ currentPage: 3 });
          navigate("/baseline");
        }}
        style={box(
          { x: 1396, y: 834, w: 220, h: 60, z: 10 },
          {
            ...typeStyle("button"),
            background: "rgba(12,12,10,.44)",
            border: "1px solid var(--cream)",
            cursor: "pointer",
            opacity: ctaShown ? 1 : 0,
            transition: "opacity 400ms ease",
            pointerEvents: ctaShown ? "auto" : "none",
          },
        )}
      >
        ACCEPT ASSIGNMENT
      </button>
    </div>
  );
}
