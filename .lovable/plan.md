# Option cards become paper folders

Every option card in the decision screens stops being a dark glass rectangle and becomes one of the four textured folder tabs you uploaded — sage green, cream, pale blue, terracotta — with the tab notch sitting in a different spot from card to card so a row reads like files pulled from a drawer.

## Look and behaviour

- Each card renders one folder image scaled to fill its own box, keeping the rounded corners and the tab silhouette intact (no stretching that distorts the texture).
- Colour and tab position are assigned per option so a row never repeats the same folder twice in a row, and the assignment is stable — the same option always shows the same folder, so it doesn't reshuffle on re-render or re-entry.
- Text switches to dark ink on the light folders (cream, pale blue) and near-white on the darker ones (green, terracotta), including the small marker/icon, title and subtitle, so every card stays readable. Selected-state check badge inverts the same way.
- Selection keeps a clear signal: an amber ring plus a slight lift in brightness on the folder, rather than the current dark amber gradient.
- Hover keeps the existing specular light streak and no movement.
- Reduced motion unchanged.

## Where it applies

All five decision screens that use the shared card grid: Barriers, Strategy, Budget (where cards are used), Week 7–10 adjustment, and Defence. They all render through the one shared component, so this is a single change applied everywhere.

## Technical notes

- The four uploaded images arrive on a solid white background. Convert each to a transparent PNG (background removal) and upload via `lovable-assets`, writing `.asset.json` pointers under `src/assets/folders/`.
- `src/sim/components/DecisionPage.tsx`: `DecisionOption` gains a folder variant, derived from a stable hash of `option.id` mixed with `index` so neighbours differ; the variant is set as `data-folder="1..4"` plus a `--folder-image` custom property on the button.
- `src/sim/design/decision.css`: `.decision-option` drops the dark `background`/border, gains `background-image: var(--folder-image)` with `background-size: 100% 100%` and no border; padding shifts down slightly so text clears the tab notch. `[data-folder]` blocks set an `--ink` token; `.option-title`, `.option-subtitle`, `.option-top` and `.option-check` read from `--ink`. `.is-selected` becomes an amber `box-shadow` ring plus `filter: brightness(1.04)`.
- Card min-height stays as-is; the folder art is 3:2, so `background-size: 100% 100%` on the current card box keeps the notch proportional without visible distortion. If a wide grid (4–5 columns) squashes the notch, the fallback is `background-size: cover` with the notch cropped — verified visually before finishing.
- Specular overlay canvas keeps `radius={14}`; it sits above the folder art via the existing z-index pattern in `specular.css`.

## Verification

Drive the preview headless across Barriers, Strategy, Adjustment and Defence: screenshot each option row to confirm four distinct folders per row with legible text, no repeated neighbours, correct ink contrast on both light and dark folders, and a visible selected ring after a click.
