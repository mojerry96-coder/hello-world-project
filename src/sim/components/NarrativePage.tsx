/* NARRATIVE PAGE — the shared shell every non-decision screen renders through.

   Composition matches the decision screens so the simulation reads as one
   object: full-viewport scene, glass HUD along the top, one glass sheet along
   the bottom. Where a decision screen asks a question, a narrative screen
   states something — so the sheet carries a lede, an optional figure/aside
   column and a single action row instead of an option grid.

   Motion follows the Apple ordering: scene, then HUD, then title, then sheet,
   then the figures inside it. Reduced motion presents the same content at once. */

import type { ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { PageHud, PageScene, type PageHudProps, type SceneSpec } from "./PageChrome";
import { SpecularEdge } from "./SpecularEdge";
import { SplitText } from "../motion/SplitText";
import { useSimulation } from "../state/store";
import "../design/decision.css";

export type NarrativePageProps = {
  scene?: SceneSpec;
  /** Replaces the single photographic scene (e.g. the baseline triptych). */
  sceneNode?: ReactNode;
  /** Omit to render a page with no HUD (the orientation brief). */
  hud?: Omit<PageHudProps, "reducedMotion">;

  /** Title block over the scene. Multiple lines reveal one after another. */
  kicker?: string;
  title?: string | string[];
  /** Hairline under the title. */
  rule?: boolean;

  /** Sheet: the statement this screen is making. */
  lede?: ReactNode;
  note?: ReactNode;
  /** Right column of the sheet — figures, lists, timelines. */
  aside?: ReactNode;
  /** Full-width block above the action row. */
  children?: ReactNode;

  /** Left side of the action row: status text, secondary controls. */
  meta?: ReactNode;
  secondary?: ReactNode;
  primary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    /** Quiet treatment for an optional forward move. */
    ghost?: boolean;
  };

  /** Free layer over the scene, under the sheet (hotspots, media controls). */
  overlaySlot?: ReactNode;
  /** Modal layer above everything. */
  overlay?: ReactNode;

  /** Drops the glass panel behind the sheet; content keeps its position. */
  sheetBare?: boolean;
};

export function NarrativePage({
  scene,
  sceneNode,
  hud,
  kicker,
  title,
  rule = true,
  lede,
  note,
  aside,
  children,
  meta,
  secondary,
  primary,
  overlaySlot,
  overlay,
  sheetBare = false,
}: NarrativePageProps) {
  const { state } = useSimulation();
  const animate = !state.reducedMotion;
  const lines = title == null ? [] : Array.isArray(title) ? title : [title];

  return (
    <div className="decision-page narrative-page">
      {sceneNode ?? (scene && <PageScene {...scene} />)}

      {hud && <PageHud {...hud} reducedMotion={state.reducedMotion} />}

      {(kicker || lines.length > 0) && (
        <div className="narrative-hero">
          {kicker && <p className="narrative-kicker">{kicker}</p>}
          {lines.map((line, i) =>
            animate ? (
              <SplitText
                key={line}
                as={i === 0 ? "h1" : "h2"}
                text={line}
                by="char"
                delay={0.18 + i * 0.2}
                stagger={0.018}
                rise={22}
                className="narrative-title"
              />
            ) : i === 0 ? (
              <h1 key={line} className="narrative-title">
                {line}
              </h1>
            ) : (
              <h2 key={line} className="narrative-title">
                {line}
              </h2>
            ),
          )}
          {rule && lines.length > 0 && (
            <div className="narrative-rule" aria-hidden="true" />
          )}
        </div>
      )}

      {overlaySlot}

      {(lede || aside || children || primary || meta || secondary) && (
        <section
          className={`narrative-sheet${sheetBare ? " narrative-sheet--bare" : ""}`}
        >
          {(lede || aside) && (
            <div className="narrative-body">
              {(lede || note) && (
                <div className="narrative-lede">
                  {lede && <p>{lede}</p>}
                  {note && <p className="narrative-note">{note}</p>}
                </div>
              )}
              {aside && <div className="narrative-aside">{aside}</div>}
            </div>
          )}

          {children}

          {(primary || meta || secondary) && (
            <div className="narrative-actions">
              <div className="narrative-actions-left">{meta}</div>
              <div className="narrative-actions-right">
                {secondary}
                {primary && (
                  <button
                    type="button"
                    className={primary.ghost ? "ghost-button" : "place-report"}
                    disabled={primary.disabled}
                    aria-disabled={primary.disabled}
                    onClick={primary.onClick}
                  >
                    {!primary.ghost && (
                      <SpecularEdge radius={13} inactive={primary.disabled} />
                    )}
                    <span>{primary.label}</span>
                    <ArrowRight size={15} weight="bold" />
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {overlay && <div className="decision-overlay">{overlay}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- figures */

export type FigureSpec = {
  label: string;
  value: string;
  note?: string;
  /** 0–1 track fill. Omit to hide the track. */
  fill?: number;
  warning?: boolean;
};

export function FigureGrid({
  figures,
  columns,
  animate = true,
}: {
  figures: FigureSpec[];
  columns?: number;
  animate?: boolean;
}) {
  return (
    <div
      className="figure-grid"
      style={{ ["--figure-columns" as string]: columns ?? figures.length }}
    >
      {figures.map((f, i) => (
        <div
          key={f.label}
          className="figure-card"
          style={
            animate
              ? { animationDelay: `${420 + i * 90}ms` }
              : { animation: "none", opacity: 1 }
          }
        >
          <span className="figure-label">{f.label}</span>
          <span className={`figure-value${f.warning ? " is-warning" : ""}`}>
            {f.value}
          </span>
          {f.fill !== undefined && (
            <span className="figure-track">
              <span
                className={`figure-fill${f.warning ? " is-warning" : ""}`}
                style={{ width: `${Math.max(0, Math.min(1, f.fill)) * 100}%` }}
              />
            </span>
          )}
          {f.note && <span className="figure-note">{f.note}</span>}
        </div>
      ))}
    </div>
  );
}
