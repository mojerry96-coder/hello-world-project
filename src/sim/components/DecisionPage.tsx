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
} from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CurrencyNgn,
  Users,
  type Icon,
} from "@phosphor-icons/react";
import { SpecularEdge } from "./SpecularEdge";
import folder1 from "../../assets/folders/folder-1.png.asset.json";
import folder2 from "../../assets/folders/folder-2.png.asset.json";
import folder3 from "../../assets/folders/folder-3.png.asset.json";
import folder4 from "../../assets/folders/folder-4.png.asset.json";
import { PageHud, PageScene } from "./PageChrome";
import { useSimulation } from "../state/store";
import "../design/decision.css";

export { Metric } from "./Metric";
export type { MetricSpec } from "./Metric";
import type { MetricSpec } from "./Metric";




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

/* Folder art. Assignment is deterministic (stable across renders) and stepped
   by index so two neighbouring cards never share the same folder. */
const FOLDERS = [folder1.url, folder2.url, folder3.url, folder4.url];
/* 1 and 4 are the dark folders (green, terracotta); 2 and 3 are light. */
const FOLDER_INK = ["dark", "light", "light", "dark"] as const;

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function DecisionOption({
  option,
  index,
  folder,
  selected,
  onSelect,
  role,
  animate,
}: {
  option: OptionSpec;
  index: number;
  folder: number;
  selected: boolean;
  onSelect: () => void;
  role: "radio" | "checkbox";
  animate: boolean;
}) {
  const IconGlyph = option.icon;
  const style: CSSProperties = {
    ...(animate
      ? { animationDelay: `${420 + index * 90}ms` }
      : { animation: "none", opacity: 1 }),
    ["--folder-image" as string]: `url("${FOLDERS[folder]}")`,
  };

  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={option.disabled}
      onClick={onSelect}
      className={`decision-option${selected ? " is-selected" : ""}`}
      data-folder={folder + 1}
      data-ink={FOLDER_INK[folder]}
      style={style}
    >
      <SpecularEdge
        radius={14}
        inactive={option.disabled}
        intensity={0.8}
        proximity={170}
      />


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
  // Per-page offset keeps the folder colours varied between screens while the
  // +index step guarantees neighbouring cards never match.
  const folderOffset = hashString(options?.[0]?.id ?? title);


  return (
    <div className="decision-page">
      <PageScene
        image={image}
        imageId={imageId}
        imageAlt={imageAlt}
        imagePosition={imagePosition}
      />

      <PageHud
        icon={Users}
        kicker={kicker}
        title={title}
        stage={stage}
        budget={budget}
        budgetIcon={CurrencyNgn}
        metrics={metrics}
        progress={progress}
        reducedMotion={state.reducedMotion}
        onBack={onBack}
      />


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
                  folder={(folderOffset + index) % FOLDERS.length}

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
            <SpecularEdge radius={13} inactive={submitDisabled} />
            <span>{submitLabel}</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </section>

      {overlay && <div className="decision-overlay">{overlay}</div>}
    </div>
  );
}
