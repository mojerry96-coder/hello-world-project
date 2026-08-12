# Campaign Archive sphere as the outcome page background

Right now the draggable archive sphere sits in the right-hand column of the outcome sheet. This moves it behind everything: the sphere becomes the full-viewport backdrop of the outcome page, with the HUD, title and glass sheet layered over it.

## What changes on screen

- The sphere fills the whole page (edge to edge, behind all content) and stays draggable.
- It is treated as scenery: slightly dimmed and vignetted at the edges so the white title and glass sheet stay readable, with the same left-side darkening the photo scene used.
- The sphere's own caption plate moves out of the way of the sheet — it sits in the upper-left scene area instead of over the panel, and the "Drag to rotate" hint stays with it.
- The right column of the sheet keeps the ending metrics only (no duplicate sphere), so the outcome copy and figures read as before.
- If motion is reduced or WebGL2 is unavailable, the page falls back to the original photographic scene plus the archive card grid in the sheet — unchanged behaviour.
- The debrief overlay keeps its own archive tab as-is.

## Technical notes

- `src/sim/pages/Page15Outcome.tsx`: pass the sphere through `NarrativePage`'s `sceneNode` prop instead of `aside`. Render `<InfiniteMenu>` wrapped in a background container with a new `infinite-menu--scene` class; keep the existing `scene={{...}}` photo path as the fallback when `sphereAvailable` is false. Strip the sphere out of `archive-aside`, leaving the metrics grid (and the grid fallback only in the non-WebGL case).
- `src/sim/design/infinite-menu.css`: add an `.infinite-menu--scene` variant — absolute inset 0, no border/radius/background of the aside card, canvas fills the stage, gradient scrim + vignette overlay via `::after`, and caption/hint repositioned to the top-left with `pointer-events: none` on text so dragging works anywhere.
- Layering: the sphere container sits at the scene z-index (below HUD/hero/sheet). Sheet and HUD already sit above; verify the sheet does not swallow drags over the exposed scene area.
- Motion: keep the staggered entrance (fade/scale in) on the scene container rather than the aside delay.
