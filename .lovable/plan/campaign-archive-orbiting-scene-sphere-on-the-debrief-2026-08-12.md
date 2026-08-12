# Campaign Archive — orbiting scene sphere on the debrief

## Where it goes and why

The debrief on Page 15 is the only screen in the simulation where free exploration carries no assessment risk: the ending is already decided, nothing is scored, and the learner's job is to look back over the run. That makes it the right home for a draggable sphere of images.

It is added as a second view inside the existing debrief overlay:

```text
DECISION DEBRIEF
[ Decisions ]  [ Campaign archive ]     <- two tabs
-----------------------------------------------
Decisions tab   = the existing five debrief rows, unchanged
Archive tab     = orbiting sphere of every scene from the run,
                  captioned with what the learner decided there
-----------------------------------------------
Close      Restart simulation           <- unchanged
```

Rejected placements, for the record: the evidence map (a sphere destroys the geography), the five assessed decision screens (choices must stay legible and comparable), and Weeks 1-5 (a gated, timed sequence should not become free orbit).

## What the archive shows

Ten discs, built from the run's own state rather than a fixed list:

| Disc | Image | Caption |
| --- | --- | --- |
| Opening | p01 clinic poster | The morning the gap appeared |
| Mission | p02 mission room | Your brief |
| Baseline | p03 Kaduna metro | Coverage before you acted |
| Field evidence | p04 evidence map | Locations reviewed |
| Barriers | the report image for each region visited | Learner's diagnosis label |
| Strategy | p07 image for the chosen strategy | Chosen strategy label |
| Budget | p08 budget room | Allocation profile |
| Forecast | p09 impact forecast | Forecast the learner accepted |
| Week 6 | p11 week six room | The adaptation chosen |
| Outcome | the ending image | The ending reached |

Selecting the front disc shows its title and caption beside the sphere; there are no outbound links, so the component's link/arrow button becomes a caption plate instead.

## Accessibility and fallback

The existing `figure-grid` of cards is the fallback, rendered instead of the sphere when:

- reduced motion is on (`state.reducedMotion`)
- WebGL2 is unavailable

Both views carry the same titles and captions, so nothing is only reachable by dragging. Tabs are real buttons, keyboard reachable, and the debrief overlay keeps its current dialog semantics.

## Technical notes

- Install `gl-matrix`.
- New `src/sim/components/InfiniteMenu.tsx` — the React Bits component ported to TypeScript, with the WebGL2 context creation guarded so a null context returns the fallback instead of throwing, and `requestAnimationFrame` cancelled on unmount (the upstream source leaks a rAF loop, which matters here because the overlay mounts and unmounts).
- New `src/sim/design/infinite-menu.css` — canvas and caption styles rewritten onto the project's glass tokens (cream/accent, Manrope, existing radii) rather than the purple/black sample CSS. Imported from the component.
- New `src/sim/content/archive.ts` — derives the disc list from `SimulationState`, reusing `historyLabels`, `fieldEvidence`, `strategies` and the endings map so captions never drift from the debrief rows.
- `src/sim/pages/Page15Outcome.tsx` — add tab state to the debrief overlay, render `InfiniteMenu` or the card grid, and lift the endings image map into the archive module so both can read it.
- Sphere images come from `public/media`, same-origin, so the texture atlas needs no CORS work; discs are square-cropped by the shader already.
- Verify in the real preview with Playwright: reach the debrief, switch to the archive tab, confirm a canvas is created and drag changes the active caption; then confirm reduced motion renders the grid instead.
