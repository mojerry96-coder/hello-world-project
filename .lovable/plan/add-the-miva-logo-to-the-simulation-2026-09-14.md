# Add the MIVA logo to the simulation

## Placement
- Add the supplied white MIVA Open University logo as a small, persistent brand mark in the upper-left corner.
- Render it once from the simulation shell so it appears consistently across the intro and all 15 screens.
- Keep it above page imagery but clear of titles, controls, and the glass status bar, with responsive sizing for smaller screens.
- Make the logo decorative/non-interactive so it cannot capture clicks or disrupt the simulation.

## Asset handling
- Store the display logo through the project’s managed asset delivery and reference that asset in the simulation.
- Create a separate padded square favicon from the same mark and connect it to the app’s page metadata.

## Verification
- Check the opening screen, intro, a decision screen, and the outcome screen at desktop and mobile widths.
- Confirm the logo remains legible, does not overlap interactive elements, and does not alter page layout.

## Technical details
- Add a small reusable brand-mark element with semantic styling in the simulation shell.
- Use responsive CSS constraints and a high visual layer without changing document flow.
- Respect safe-area insets and disable pointer events on the mark.
