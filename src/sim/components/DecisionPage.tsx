/* DECISION PAGE — the shared shell every decision screen renders through.

   Layout is fluid: a full-viewport background scene, a glass HUD along the top
   carrying identity + live campaign metrics, and a glass sheet along the bottom
   holding the field report, the option grid and the commit button. Pages supply
   content and own their scoring logic; this file owns composition and motion. */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CurrencyNgn,
  Users,
  type Icon,
} from "@phosphor-icons/react";
import { MediaSlot } from "./MediaSlot";
import { SpecularEdge } from "./SpecularEdge";
import { MetricLoop } from "./MetricLoop";
import { useSimulation } from "../state/store";
import "../design/decision.css";

/* ---------------------------------------------------------------- metrics */

export type MetricSpec = {
  label: string;
  /** Rendered text, e.g. "62%" or "₦180M". */
  display: string;
  /** 0–1 track fill. Omit to hide the track. */
  fill?: number;
  warning?: boolean;
};

export function Metric({ label, display, fill, warning }: MetricSpec) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className={`metric-value${warning ? " metric-warning" : ""}`}>
        {display}
      </span>
      {fill !== undefined && (
        <span className="metric-track">
          <span
            className={`metric-fill${warning ? " metric-fill-warning" : ""}`}
            style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
          />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- HUD */

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

/* ------------------------------------------------------------ typewriter */

function useTypewriter(text: string, enabled: boolean, speed = 22) {
  const [shown, setShown] = useState(enabled ? "" : text);
  const done = shown.length >= text.length;

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, enabled, speed]);

  return { shown, done };
}

/* ---------------------------------------------------------------- option */

export type OptionSpec = {
  id: string;
  icon?: Icon;
  /** Small marker shown when no icon is supplied, e.g. "A". */
  marker?: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
};

function DecisionOption({
  option,
  index,
  selected,
  onSelect,
  role,
  animate,
}: {
  option: OptionSpec;
  index: number;
  selected: boolean;
  onSelect: () => void;
  role: "radio" | "checkbox";
  animate: boolean;
}) {
  const IconGlyph = option.icon;
  const style: CSSProperties = animate
    ? { animationDelay: `${420 + index * 90}ms` }
    : { animation: "none", opacity: 1 };

  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={option.disabled}
      onClick={onSelect}
      className={`decision-option${selected ? " is-selected" : ""}`}
      style={style}
    >
      <span className="option-top">
        {IconGlyph ? (
          <IconGlyph size={26} weight="light" />
        ) : (
          <span style={{ fontSize: 12, letterSpacing: "0.1em" }}>
            {option.marker ?? String(index + 1).padStart(2, "0")}
          </span>
        )}
        {selected && (
          <span className="option-check" aria-hidden="true">
            <Check size={13} weight="bold" />
          </span>
        )}
      </span>
      <span className="option-title">{option.title}</span>
      {option.subtitle && (
        <span className="option-subtitle">{option.subtitle}</span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ page */

export type DecisionPageProps = {
  /** Filename inside public/media. */
  image: string;
  imageId: string;
  imageAlt: string;
  imagePosition?: string;

  kicker: string;
  title: string;
  stage: { label: string; value: string };
  budget?: { label: string; value: string };
  metrics?: MetricSpec[];
  progress: { current: number; total: number };

  reportLabel: string;
  statement: string;
  question?: string;
  /** Right-hand column of the report row (running totals, counters, feedback). */
  aside?: ReactNode;
  /** Full-width row between the report and the controls. */
  footnote?: ReactNode;

  options?: OptionSpec[];
  columns?: number;
  selectionMode?: "single" | "multiple";
  selected?: string | string[] | null;
  onSelect?: (id: string) => void;
  optionsLabel?: string;
  /** Replaces the option grid entirely (budget sliders, justification field). */
  controls?: ReactNode;

  submitLabel: string;
  submitDisabled?: boolean;
  onSubmit: () => void;
  onBack?: () => void;
  /** Modal layer rendered above everything (outcome / consequence reveals). */
  overlay?: ReactNode;
};

export function DecisionPage({
  image,
  imageId,
  imageAlt,
  imagePosition,
  kicker,
  title,
  stage,
  budget,
  metrics,
  progress,
  reportLabel,
  statement,
  question,
  aside,
  footnote,
  options,
  columns,
  selectionMode = "single",
  selected,
  onSelect,
  optionsLabel,
  controls,
  submitLabel,
  submitDisabled,
  onSubmit,
  onBack,
  overlay,
}: DecisionPageProps) {
  const { state } = useSimulation();
  const animate = !state.reducedMotion;
  const { shown, done } = useTypewriter(statement, animate);

  const selectedIds = useMemo(
    () =>
      selected == null
        ? []
        : Array.isArray(selected)
          ? selected
          : [selected],
    [selected],
  );

  const gridColumns = columns ?? options?.length ?? 5;
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="decision-page">
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
      <div className="scene-treatment" />

      <header className="decision-hud">
        <HudBlock icon={Users} label={kicker} primary={title} />
        <span className="hud-divider" />
        <div className="hud-meta">
          <div>
            <div className="hud-label">{stage.label}</div>
            <div className="hud-value">{stage.value}</div>
          </div>
        </div>
        {budget && (
          <>
            <span className="hud-divider" />
            <HudBlock
              icon={CurrencyNgn}
              label={budget.label}
              primary={<span className="hud-value">{budget.value}</span>}
              minWidth={170}
            />
          </>
        )}
        <span className="hud-spacer" />
        {metrics && metrics.length > 0 && (
          <MetricLoop metrics={metrics} reducedMotion={state.reducedMotion} />
        )}
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
        <ProgressPill current={progress.current} total={progress.total} />
      </header>

      <section className="decision-sheet">
        <div className="report-row">
          <div className="report-content">
            <p className="report-label">{reportLabel}</p>
            <p className="report-statement" aria-live="polite">
              {shown}
              {animate && !done && <span className="typing-cursor" />}
            </p>
            {question && (
              <p className={`report-question${done ? " is-visible" : ""}`}>
                {question}
              </p>
            )}
          </div>
          {aside && <div className="report-aside">{aside}</div>}
        </div>

        {footnote && <div className="decision-footnote">{footnote}</div>}

        <div className="decision-controls">
          {controls ? (
            <div style={{ flex: 1, minWidth: 0 }}>{controls}</div>
          ) : (
            <div
              className="option-grid"
              role={selectionMode === "single" ? "radiogroup" : "group"}
              aria-label={optionsLabel ?? "Options"}
              style={{ ["--option-columns" as string]: gridColumns }}
            >
              {options?.map((option, index) => (
                <DecisionOption
                  key={option.id}
                  option={option}
                  index={index}
                  animate={animate}
                  role={selectionMode === "single" ? "radio" : "checkbox"}
                  selected={selectedIds.includes(option.id)}
                  onSelect={() => onSelect?.(option.id)}
                />
              ))}
            </div>
          )}
          <span className="cta-divider" />
          <button
            ref={submitRef}
            type="button"
            className="place-report"
            disabled={submitDisabled}
            aria-disabled={submitDisabled}
            onClick={onSubmit}
          >
            <SpecularEdge inactive={submitDisabled} />
            <span>{submitLabel}</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </section>

      {overlay && <div className="decision-overlay">{overlay}</div>}
    </div>
  );
}
