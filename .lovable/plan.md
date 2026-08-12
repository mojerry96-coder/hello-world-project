# Reusable Decision Page template (fluid glass HUD + bottom sheet)

Build the shared decision-screen design system exactly as specified, then convert all
five decision screens onto it: Decision 01 barriers, Decision 02 strategy,
Decision 03 budget, Decision 04 adjustment and Decision 05 defence. Narrative and
result pages keep their current fixed-stage look.

## What you'll see

- Every decision screen fills the whole browser window instead of a letterboxed stage.
- A rounded glass HUD across the top: decision number + title, stage, budget, the
  three LGA coverage metrics with thin bars, and a progress pill (01 / 05 style).
- A rounded glass panel across the bottom: report label, the statement that
  types itself on in ~24 ms per character with a blinking cursor, the follow-up
  question fading in when typing finishes, then the answer cards entering one
  after another, and a warm CTA that stays disabled until a card is selected.
- Hover lifts a card 2px and brightens it; selecting gives it a warm accent border
  plus a small check top-right; changing selection is free, with no modal.
- Recomposes (not shrinks) at 1450px and 1180px: shorter HUD, tighter metric gaps,
  smaller cards, and HUD icon circles dropped before type gets smaller.
- Reduced-motion users get the content immediately with no typing or stagger.
- The five screens are visually identical in structure — only media, copy, options
  and state differ.

## Scope

- New shared template + tokens + CSS + data config.
- Converted: Page 05 barriers, Page 06 strategy, Page 08 budget, Page 12 adjustment,
  Page 14 defence.
- All existing logic and scoring is preserved exactly: barriers still score only the
  first placement per report with a forced correction pass on 0/4; strategy still
  opens unselected with a disabled Continue and commits nothing on hover; budget
  still enforces the ₦180M total with its sliders and profile classification;
  adjustment still records the week-six change; defence still requires a
  50-220 character justification and resolves the ending from the whole run.
- Screens that need more than five cards keep the same card grid with the column
  count adapted; budget and defence keep their extra controls (sliders, the
  justification textarea, live counter) inside the glass sheet, styled with the
  same tokens.
- Not in scope: the narrative/result pages (opening, mission, baseline, field
  evidence, consequence, forecast, campaign motion, week six, briefing, outcome),
  and drag-and-drop on the barrier zones (replaced by the click-to-select card grid
  the spec describes).


## Technical notes

Reference canvas stays 1672 x 941 as proportions only; the layout is expressed in
`clamp()` and percentages, never hard pixels.

New files
- `src/sim/design/decision.css` — the tokens from the brief (typography, colours,
  radii, spacing, glass, motion easings) scoped under a `.decision-page` root so
  they cannot collide with the existing `sim.css` tokens, plus every class in the
  brief: page, background, scene treatment, HUD, metrics, progress pill, sheet,
  report, controls, option, CTA, keyframes (`hudEnter`, `sheetEnter`,
  `optionEnter`, `cursorBlink`) and both media queries. Imported from `sim.css`.
  Glass uses the standard `backdrop-filter` only — no hand-written `-webkit-`
  twin, which the production CSS build would otherwise strip.
- `src/sim/components/DecisionPage.tsx` — the shell component taking
  `backgroundImage, decision, stage, budget, progress, metrics, report, options,
  selected, onSelect, onSubmit, submitLabel, submitDisabled, footer, children`.
  Contains `HudIdentity`, `HudMeta`, `HudDivider`, `Metric`, `ProgressPill`,
  `DecisionOption` and `TypewriterText` as in the brief, with icons from
  `lucide-react` (already installed) via the `iconMap`. Option stagger uses
  `animationDelay: index * 70 + 100ms`.
- `src/sim/content/decisionPages.ts` — the data config (`decisionPages` array)
  holding background image, decision number/title, stage, budget, progress,
  metrics, report label/statement/question and the five options for Decision 01,
  driven per-report from the existing `reports` and `barrierZones` content so
  copy stays in one place.

Changed files
- `src/sim/pages/Page05Barriers.tsx` — keeps all state logic and scoring, drops
  the absolute `box()` layout, and renders through `<DecisionPage>`: metrics fed
  from `coverageAtWeek`/`BASELINE` (the same source the status rail uses), report
  statement from the current report, options from `barrierZones`, feedback and the
  report selector in the sheet footer, and the existing outcome panel overlaid.
- `src/sim/Simulation.tsx` — pages may opt out of the fixed `Artboard`; the
  barriers page renders full-viewport while every other page is unchanged.
- `src/sim/sim.css` — import the new stylesheet (import placed at the top of the
  file, before any rules).

Verification: typecheck, production build, and a Playwright pass at 1672x941,
1366x768 and 1180x720 to confirm the entrance sequence, selection states,
disabled CTA and the responsive recomposition, plus one run under
`prefers-reduced-motion` and one scoring run through all four reports.
