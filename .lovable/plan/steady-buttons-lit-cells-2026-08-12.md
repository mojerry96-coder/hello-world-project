# Steady buttons, lit cells

Two changes to hover behaviour across the simulation.

## 1. Buttons stop moving on hover

The commit button (`Place report` / `Continue` / `Submit defence`) and the older primary CTA currently lift 2px on hover and shrink slightly on press. That motion is removed — the buttons stay exactly where they sit. What stays:

- The specular light streak that fades in as the cursor approaches.
- The subtle brightening on hover.
- The dimmed disabled state.

Press feedback is kept but becomes non-positional (a small brightness drop instead of a scale-down), so a click still feels acknowledged without the button shifting under the pointer.

## 2. Specular edge on the cells

Each option cell in the decision grid gets the same specular edge treatment as the buttons, so the cell your cursor is on is unmistakable: a warm light streak traces its rounded border and steers toward the pointer, brightest on the cell under the cursor and dimmer on neighbours as the cursor nears them.

- Selected cells keep their amber border and gradient; the streak sits on top.
- Disabled cells get no streak.
- Reduced motion: no streak at all, current appearance unchanged.
- Cells also lose their 2px hover lift and press scale, matching the buttons — the light does the signalling instead of movement.

## Technical notes

- `src/sim/design/decision.css`: drop `transform: translateY(-2px)` from `.decision-option:hover` and `.place-report:hover`, drop `transform: scale(...)` from both `:active` rules, and remove `transform` from their transition lists. Replace press feedback with a `filter` change.
- `src/sim/sim.css`: `.primary-cta` has no hover transform, so nothing to remove there.
- `src/sim/components/DecisionPage.tsx`: render `<SpecularEdge radius={14} inactive={option.disabled} />` inside `DecisionOption`, matching `--radius-card`. Option content already sits in spans, so the existing `z-index` lifting pattern in `specular.css` applies.
- `src/sim/design/specular.css`: add `.decision-option` to the host list (`position: relative`, children above the canvas). Tune the cell instance slightly quieter than the CTA (lower intensity, smaller proximity radius) so a grid of five cells doesn't read as noise.
- Each cell mounts its own WebGL overlay; with five cells plus the CTA that is six small contexts on a decision screen. If that proves heavy in verification, the fallback is one shared canvas per grid — noted, not implemented up front.

## Verification

Drive the preview headless: hover across the option grid and confirm the streak follows from cell to cell with no vertical movement, click the commit button and confirm it neither lifts nor scales while still advancing the page, and confirm a reduced-motion run renders no canvases.
