# Minimal Ripple on the field-evidence hotspots

Replace the current double-ping pulse on the three map pins with a quieter, more refined "minimal ripple": slow concentric rings spreading outward from a still centre point, built locally with your existing design tokens (no paid registry, no license key).

## What changes visually

- The pin stays completely still — only the rings move, so it reads as a calm beacon rather than a throb.
- Three concentric rings, evenly staggered, each fading out as it expands (slower and lower-contrast than today's two-ring ping).
- Rings use `--accent-active` / cream line tokens so they match the rest of the simulation.
- Visited pins stop rippling and keep the check mark, exactly as now.
- Fully disabled under `prefers-reduced-motion` (already handled globally).

## Technical notes

- New component `src/sim/components/MinimalRipple.tsx`: renders an absolutely-positioned, `pointer-events-none`, `aria-hidden` ring stack behind its children; props for `size`, `rings`, `duration`, `color`.
- `src/sim/sim.css`: add `ripple-expand` keyframes and `.minimal-ripple` / ring classes; remove the now-unused `.hotspot-pulse` rules and `hotspot-ping` keyframes.
- `src/sim/pages/Page04FieldEvidence.tsx`: wrap the 28px pin span in `MinimalRipple`, shown only while `!isVisited`. Hotspot coordinates, hit targets, and scoring logic untouched.
