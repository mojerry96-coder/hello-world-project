# Remove the glass card on the outcome page

The outcome screen's bottom panel loses its card: no background, no border, no blur, no shadow. Every element inside — the summary copy, the Ikara line, the learning note, the four metric tiles and the "View debrief" button — stays exactly where it is today, sitting directly over the archive sphere.

## Details

- Only the outcome page changes; the other 14 narrative screens keep their glass sheet.
- No extra readability treatment is added (no text shadow, no added gradient) — the existing scene dimming stays as-is.
- Metric tiles keep their own card styling; only the large surrounding panel disappears.
- The panel's entrance animation and its position, padding and internal spacing are unchanged, so nothing shifts.

## Technical notes

- `src/sim/components/NarrativePage.tsx`: add an optional `sheetBare?: boolean` prop that appends a `narrative-sheet--bare` class to the `.narrative-sheet` section.
- `src/sim/design/decision.css`: define `.narrative-sheet--bare` to reset `background`, `border`, `border-radius`, `backdrop-filter` and `box-shadow` (keeping layout, padding, z-index and animation).
- `src/sim/pages/Page15Outcome.tsx`: pass `sheetBare` on the `NarrativePage`.
