/* Persistent campaign status.

   The one thing the simulation was missing: somewhere the learner can watch
   their decisions land. Week, money left, and the three LGA coverage figures
   sit in the top band on every page from the baseline onward, and animate
   whenever a value changes.

   It occupies x 372-1500 of the top band, which is empty on every page — the
   page label sits at x 56 and the page marker at x 1536 — so nothing below has
   to move. */

import { useEffect, useRef } from "react";
import { box } from "../design/layout";
import { typeStyle } from "../design/type";
import {
  BASELINE,
  budgetRemainingAtWeek,
  CAMPAIGN_WEEKS,
  coverageAtWeek,
  IKARA_TARGET,
  weekForPage,
  type Coverage,
} from "../state/coverage";
import { useSimulation } from "../state/store";
import { EASE, gsap, prefersReducedMotion } from "../motion/useMotion";

type CellProps = {
  label: string;
  value: string;
  /** 0-100, renders a track beneath the value. */
  bar?: number;
  tone?: "default" | "risk" | "good";
  /** Difference from baseline, shown as a delta when non-zero. */
  delta?: number;
};

function Cell({ label, value, bar, tone = "default", delta }: CellProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<string>(value);

  // A changed figure gets a brief lift so the eye is drawn to what moved.
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    if (prefersReducedMotion()) return;
    if (valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { y: -6, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.45, ease: EASE.out },
      );
    }
  }, [value]);

  useEffect(() => {
    const el = fillRef.current;
    if (!el || bar === undefined) return;
    if (prefersReducedMotion()) {
      el.style.width = `${bar}%`;
      return;
    }
    gsap.to(el, { width: `${bar}%`, duration: 0.8, ease: EASE.out });
  }, [bar]);

  const colour =
    tone === "risk"
      ? "var(--warning)"
      : tone === "good"
        ? "var(--success)"
        : "var(--cream)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 74 }}>
      <span
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 9,
          lineHeight: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(238,228,213,.48)",
        }}
      >
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          ref={valueRef}
          style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 300,
            fontSize: 17,
            lineHeight: "19px",
            color: colour,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {delta !== undefined && delta !== 0 && (
          <span
            style={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 10,
              lineHeight: "12px",
              color: delta > 0 ? "var(--success)" : "var(--error)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </span>
      {bar !== undefined && (
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 74,
            height: 2,
            background: "rgba(238,228,213,.16)",
          }}
        >
          <span
            ref={fillRef}
            style={{
              display: "block",
              width: 0,
              height: 2,
              background: tone === "risk" ? "var(--warning)" : "var(--accent)",
            }}
          />
        </span>
      )}
    </div>
  );
}

export function StatusRail({ page }: { page: number }) {
  const { state } = useSimulation();

  const week = weekForPage(page);
  const c: Coverage = coverageAtWeek(state, week);
  const budget = budgetRemainingAtWeek(week);

  const label =
    week === 0
      ? "PLANNING"
      : `WEEK ${String(week).padStart(2, "0")} / ${CAMPAIGN_WEEKS}`;

  return (
    <>
      {/* Several pages open on bright exteriors. The rail is chrome and has to
          stay legible over any of them, so it carries its own scrim. */}
      <div
        aria-hidden="true"
        style={box(
          { x: 0, y: 0, w: 1672, h: 104, z: 29 },
          {
            background:
              "linear-gradient(180deg, rgba(10,10,8,.82) 0%, rgba(10,10,8,.55) 55%, transparent 100%)",
          },
        )}
      />
      <div
        style={box(
          { x: 372, y: 12, w: 1128, h: 42, z: 30 },
        {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 18,
          paddingBottom: 2,
        },
        )}
        role="status"
        aria-label={`Campaign status. ${label}. Budget remaining ${budget} million naira. Coverage: Kaduna Metro ${c.metro}%, Zaria ${c.zaria}%, Ikara ${c.ikara}% against a target of ${IKARA_TARGET}%.`}
    >
        <Cell label="Stage" value={label} />
        <Cell label="Budget left" value={`₦${budget}M`} />

        <span
        aria-hidden="true"
        style={{ width: 1, height: 28, background: "var(--line-dark)" }}
        />

        <Cell
        label="Kaduna Metro"
        value={`${c.metro}%`}
        bar={c.metro}
        delta={c.metro - BASELINE.metro}
        />
        <Cell
        label="Zaria"
        value={`${c.zaria}%`}
        bar={c.zaria}
        delta={c.zaria - BASELINE.zaria}
        />
        <Cell
        label={`Ikara · target ${IKARA_TARGET}%`}
        value={`${c.ikara}%`}
        bar={c.ikara}
          tone={c.ikara >= IKARA_TARGET ? "good" : "risk"}
          delta={c.ikara - BASELINE.ikara}
        />
      </div>
    </>
  );
}

/** Goal reminder, sat under the rail where the eye lands after reading it. */
export function GoalLine({ text }: { text: string }) {
  return (
    <p
      style={box(
        { x: 372, y: 58, w: 1128, h: 16, z: 30 },
        typeStyle("bodySmall", {
          fontSize: 11,
          lineHeight: "14px",
          color: "rgba(238,228,213,.52)",
          textAlign: "right",
        }),
      )}
    >
      {text}
    </p>
  );
}
