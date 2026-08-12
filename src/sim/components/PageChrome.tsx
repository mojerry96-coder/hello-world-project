/* PAGE CHROME — the scene layer and the glass HUD, shared by every fluid page.

   Both the decision screens and the narrative screens sit on the same
   composition: a full-viewport photographic scene, one graded treatment over it,
   and a rounded glass HUD along the top carrying identity, stage, budget, the
   live coverage marquee and a page-progress pill. Extracted here so the two page
   shells cannot drift apart. */

import type { ReactNode } from "react";
import { ArrowLeft, type Icon } from "@phosphor-icons/react";
import { MediaSlot } from "./MediaSlot";
import { MetricLoop } from "./MetricLoop";
import { type MetricSpec } from "./Metric";
import "../design/decision.css";

export type SceneSpec = {
  /** Filename inside public/media. */
  image: string;
  imageId: string;
  imageAlt: string;
  imagePosition?: string;
  /** Overrides the default gradient treatment class. */
  treatment?: "default" | "left" | "hero";
};

export function PageScene({
  image,
  imageId,
  imageAlt,
  imagePosition,
  treatment = "default",
}: SceneSpec) {
  return (
    <>
      <MediaSlot
        id={imageId}
        src={image}
        alt={imageAlt}
        objectPosition={imagePosition}
        frame={{ x: 0, y: 0, w: 0, h: 0, z: 0 }}
        style={{
          position: "absolute",
          inset: 0,
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className={`scene-treatment${
          treatment === "left"
            ? " scene-treatment-left"
            : treatment === "hero"
              ? " scene-treatment-hero"
              : ""
        }`}
      />
    </>
  );
}

function HudBlock({
  icon: IconGlyph,
  label,
  primary,
  minWidth,
}: {
  icon?: Icon;
  label: string;
  primary: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="hud-identity" style={minWidth ? { minWidth } : undefined}>
      {IconGlyph && (
        <span className="hud-icon-circle">
          <IconGlyph size={20} weight="light" />
        </span>
      )}
      <div>
        <div className="hud-label">{label}</div>
        <div className="hud-primary">{primary}</div>
      </div>
    </div>
  );
}

function ProgressPill({ current, total }: { current: number; total: number }) {
  return (
    <span
      className="progress-pill"
      aria-label={`Page ${current} of ${total}`}
      title={`Page ${current} of ${total}`}
    >
      <span>{String(current).padStart(2, "0")}</span>
      <span className="progress-separator">/</span>
      <span className="progress-total">{String(total).padStart(2, "0")}</span>
    </span>
  );
}

export type PageHudProps = {
  icon?: Icon;
  kicker: string;
  title: string;
  stage?: { label: string; value: string };
  budget?: { label: string; value: string };
  budgetIcon?: Icon;
  metrics?: MetricSpec[];
  progress?: { current: number; total: number };
  reducedMotion?: boolean;
  onBack?: () => void;
  /** Extra controls dropped in before the progress pill (mute, replay). */
  trailing?: ReactNode;
};

export function PageHud({
  icon,
  kicker,
  title,
  stage,
  budget,
  budgetIcon,
  metrics,
  progress,
  reducedMotion = false,
  onBack,
  trailing,
}: PageHudProps) {
  return (
    <header className="decision-hud">
      <HudBlock icon={icon} label={kicker} primary={title} />
      {stage && (
        <>
          <span className="hud-divider" />
          <div className="hud-meta">
            <div>
              <div className="hud-label">{stage.label}</div>
              <div className="hud-value">{stage.value}</div>
            </div>
          </div>
        </>
      )}
      {budget && (
        <>
          <span className="hud-divider" />
          <HudBlock
            icon={budgetIcon}
            label={budget.label}
            primary={<span className="hud-value">{budget.value}</span>}
            minWidth={170}
          />
        </>
      )}
      <span className="hud-spacer" />
      {metrics && metrics.length > 0 && (
        <MetricLoop metrics={metrics} reducedMotion={reducedMotion} />
      )}
      {trailing}
      {onBack && (
        <button
          type="button"
          className="decision-chip"
          onClick={onBack}
          aria-label="Back to the previous screen"
          style={{ display: "grid", placeItems: "center" }}
        >
          <ArrowLeft size={14} weight="bold" />
        </button>
      )}
      {progress && (
        <ProgressPill current={progress.current} total={progress.total} />
      )}
    </header>
  );
}
