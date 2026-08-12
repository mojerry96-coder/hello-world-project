# Fluid glass across the whole simulation

Extend the glass template that Decisions 01-05 already use to every remaining
screen, and tighten the layout, motion and controls to Apple-style rules
(clear hierarchy, one primary action, generous rhythm, motion that explains
rather than decorates).

## What you'll see

- Every screen fills the browser window. No more letterboxed stage with black
  bars, and no jump in look when moving from a narrative page to a decision.
- The same glass HUD along the top of every page: act/page identity on the left,
  stage and budget in the middle, the looping campaign metrics, back control and
  the 01 / 15 progress pill. It replaces the old status rail.
- A glass sheet along the bottom carrying the narrative copy, then the single
  primary action. Where a page has extra reading (baseline figures, forecast
  table, week-6 update, briefing summary), it sits in a second glass panel that
  shares the same corner radius, blur and border as the decision sheet.
- Elements arrive in sequence instead of all at once: scene fades and settles,
  HUD slides down, sheet rises, headline splits in, body copy and figures
  stagger 60-90 ms apart, primary button last. Interactive things (map pins,
  forecast rows, timeline weeks) reveal on approach and lift on hover.
- One primary button per screen, warm accent, with the specular shine already on
  the decision CTAs; secondary actions (Back, Replay narration, Skip) are quiet
  glass chips.
- Apple-style typography rhythm: one display size per screen, a single body
  size, tabular figures for all numbers so they stop shifting, 4/8 px spacing
  scale, and line length capped for readability on wide monitors.
- Recomposes at 1450 / 1180 / 900 px rather than shrinking: HUD drops icon
  circles, then metrics collapse to the marquee only, then the sheet stacks.
- Reduced motion shows everything immediately, with no typing, stagger or
  parallax. Keyboard focus rings stay visible on every control.

## Screens converted

Intro brief, 01 Opening, 02 Mission, 03 Baseline, 04 Field Evidence,
07 Consequence, 09 Forecast, 10 Campaign in Motion, 11 Week Six,
13 Briefing, 15 Outcome.

All narrative copy, media, scoring, gating and endings stay exactly as they are
— this is layout, motion and control styling only. Page 04 keeps its ripple
hotspots and the cinematic blurred reveal; Page 10 keeps its week-by-week
playback; Page 15 keeps all three endings and the LMS result payload.

## Technical notes

New files
- `src/sim/components/NarrativePage.tsx` — sibling shell to `DecisionPage`,
  sharing its HUD, scene treatment and sheet. Props: `image/imageId/imageAlt/
  imagePosition`, `kicker`, `title`, `stage`, `budget`, `metrics`, `progress`,
  `eyebrow`, `headline`, `body`, `panel` (secondary glass panel content),
  `children` (free scene layer for hotspots/timeline), `primary`
  (`{label,onClick,disabled}`), `secondary`, `overlay`. Extracts the HUD from
  `DecisionPage.tsx` into a shared `DecisionHud` so both shells stay identical.
- `src/sim/content/narrativePages.ts` — per-page kicker, title, media, eyebrow,
  headline and body, sourced from the existing `pages.ts`/`story.ts` content so
  copy stays single-sourced. Reuses `useCampaignMetrics`/`weekForPage` from
  `decisionPages.ts` for the HUD numbers.

Changed files
- `src/sim/design/decision.css` — add the shared narrative classes
  (`.narrative-panel`, `.narrative-body`, `.figure-grid`, `.stack-*`,
  `.reveal-item` with `--reveal-index`, `.glass-chip`, `.data-row`), the 900 px
  breakpoint, a tabular-numerals utility and the Apple easing/duration tokens
  used by the new keyframes. Glass uses the standard `backdrop-filter` only.
- `src/sim/design/type.ts` — add the fluid `clamp()` roles the new shells use
  (display, headline, body, caption) alongside the existing artboard roles;
  existing roles untouched.
- The eleven page files listed above — same state, handlers and content, new
  composition through `NarrativePage`. Page 03 figures, Page 09 forecast rows,
  Page 11 update and Page 13 briefing summary move into the secondary panel;
  Page 04 pins and Page 10 timeline render in the scene layer with staggered
  reveals; Page 15 endings render as a full-bleed glass result card.
- `src/sim/Simulation.tsx` — drop `FLUID_PAGES` and the `Artboard`/`StatusRail`
  wrapping for pages; every page is fluid. `ActCard` keeps its own `Artboard`.
- `src/sim/components/StatusRail.tsx` — no longer rendered; removed once the HUD
  covers pages 3+.
- `src/sim/components/VoiceOver.tsx` — inline mode becomes a glass chip row so
  narration controls match the new secondary style.

Verification: typecheck, production build, unit tests, then a Playwright pass at
1672x941, 1366x768, 1180x720 and 900x700 over all sixteen screens checking the
entrance sequence, hover/focus states, disabled CTAs and recomposition, plus one
reduced-motion run and one full playthrough that scores the barriers, holds the
budget at ₦180M and reaches an ending.
