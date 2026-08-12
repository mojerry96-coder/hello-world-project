# Fix text placement on the folder cards

Right now each option card stretches the folder artwork to the card's exact box (`background: ... 100% 100%`) and the text is laid out against the card padding, not against the folder itself. The result: distorted folders and copy that sits off-centre, sometimes drifting under the tab.

## What changes

1. **Folder becomes the card.** The folder artwork keeps its natural aspect ratio and is the visible object; the surrounding button box is invisible and only sizes the folder. No stretching or squashing, so all four folders read as the same physical object at different colours.

2. **Text lives inside the folder body.** All copy (marker/icon row, title, subtitle, selected check) moves into a dedicated inner "label area" that maps to the flat paper region of the folder — below the tab, inset from the folder edges. Text is centred within that region as the focal point of the card, so it reads as writing on the folder rather than a caption in a rectangle.

3. **Tab-aware insets.** Each of the four artworks has its tab in a different place (top-left, top-right, centre, top-left). The label area gets a per-artwork top inset so the text never collides with the tab, while all four still have their text at the same visual height.

4. **Selection and hover follow the folder shape.** The amber selection ring and hover/focus states move onto the folder element so the glow traces the folder, not the invisible card box. The specular hover streak stays, matched to the folder's bounds.

5. **Typography tuned for the paper.** Slightly larger title, tighter subtitle, centred alignment, and the existing dark-ink / light-ink switch retained so cream and pale-blue folders take dark ink while green and terracotta take light ink.

## Technical notes

- `src/sim/components/DecisionPage.tsx`: `DecisionOption` gains a nested structure — button > folder layer (`<img>`-style aspect box carrying `--folder-image`) > `.option-label` wrapper containing the top row, title and subtitle. `data-folder` continues to drive per-artwork insets.
- `src/sim/design/decision.css`: replace `100% 100%` with `contain` sizing on a fixed-aspect folder layer; add `.option-label` with percentage-based insets (`inset: <tab-clearance>% x% y% x%`) plus `data-folder` overrides for tab position; move `box-shadow` selection/focus rules from `.decision-option` to the folder layer; keep `drop-shadow` filters and enter animation.
- `.option-grid` row height adjusts to the folder aspect so cards no longer force a mismatched `min-height`.
- Verify on `/barriers`, `/strategy`, `/adjustment` and `/defence` with a browser pass at the current viewport plus a narrower one, checking text stays inside the paper area and clear of the tab in all four colours.
