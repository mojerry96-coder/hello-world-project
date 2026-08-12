# Bring the Campaign Archive sphere onto the outcome page

The orbiting archive sphere is already built and working, but it only appears after clicking "View debrief" and then switching to the "Campaign archive" tab — so on arriving at the outcome screen you never see it. This moves it onto page 15 itself.

## What changes

- The outcome page's right-hand aside becomes the Campaign Archive: the draggable sphere of your run's scenes, sitting in a glass frame with the caption plate underneath, instead of only the two small metric cards.
- The ending metrics stay visible, compacted into a slim row directly under the sphere so nothing is lost.
- The sphere is sized for the aside column (smaller than the debrief version) and reveals with the same staggered entrance as the rest of the page, after the title and lede land.
- Dragging the sphere never triggers page navigation or text selection; the "drag to rotate" hint appears on the frame.
- Reduced motion or no WebGL2 keeps the existing behaviour: the 12-card grid renders in the aside instead of the sphere.
- The debrief overlay keeps its Decisions / Campaign archive tabs unchanged, so the larger archive view is still there.

## Technical notes

- `src/sim/pages/Page15Outcome.tsx`: extract the archive block into a local `ArchiveAside` piece and pass it via `aside`, moving `e.metrics` into a compact `figure-grid` below it. Keep `sphereAvailable`, `archiveItems` and `archive` as-is.
- `src/sim/design/infinite-menu.css`: add a `--infinite-menu-height` variable plus an `.infinite-menu--aside` modifier for the shorter aside frame, smaller caption type, and the entrance animation hooked to the page's `animate` flag.
- `src/sim/components/InfiniteMenu.tsx`: accept an optional `className` (and keep the existing `scale` prop) so the aside variant can be styled without duplicating the WebGL setup.
- Verify with a browser pass on `/outcome` for each of the three endings: sphere canvas present, caption updates on drag, metrics still readable, and the reduced-motion fallback rendering the grid.
