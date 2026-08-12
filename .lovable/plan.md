# Cinematic hotspot reveal on Field Evidence

Selecting a map pin should dim and blur the scene behind, then reveal the location's detail card in the centre of the artboard with a short "preloader"-style reveal animation.

Note: React Bits Pro needs a paid `REACTBITS_LICENSE_KEY`, which isn't stored in this project. As with the ripple, I'll build the reveal in-house with the simulation's own tokens (Afacad/Manrope, accent `#b45d2b`, square edges) so it matches the rest of the deck.

## Interaction

1. Click a pin → scene image, shading, summary rail and CTA go behind a blurred scrim.
2. A brief reveal beat plays: a thin accent line sweeps across the card, then the card's text stages in (title, coverage number, concern, channel evidence).
3. Card sits centred on the 1672x941 artboard, with a close control; Esc and clicking the scrim also close it.
4. Closing returns the scene to normal; the pin is already marked reviewed and stays revisitable.
5. Progress counter, 3/3 gate and the "REVIEW FIELD REPORTS" CTA behave exactly as they do today.

## Motion detail

- Scrim: backdrop blur plus dark wash, fading in over ~260ms.
- Card: scales up slightly from ~0.96 with a soft rise, ~420ms, easing out.
- Reveal beat: accent sweep line across the card top, then staged text with small delays — the "loading then reveal" feel of the preloader component.
- Under `prefers-reduced-motion`, everything cross-fades instantly with no blur transition or sweep.

## Technical notes

- New `src/sim/components/RevealOverlay.tsx`: centred modal-style container with scrim, focus trap on the close control, Esc handling, `role="dialog"` + `aria-modal`, plus the sweep/stage animation wrapper.
- New CSS in `src/sim/sim.css`: `.reveal-scrim` (uses standard `backdrop-filter` only), `.reveal-card`, sweep and stage keyframes, and reduced-motion overrides.
- `src/sim/pages/Page04FieldEvidence.tsx`: replace the fixed top-right detail panel with the centred overlay; keep `active` state, `inspect()`, hotspot frames, ripples and summary rail unchanged.
- Blur applies to the artboard content behind the scrim only (the scrim covers the full 1672x941 stage), so the parallax layer stays intact.
- Overlay is reusable, so the same reveal can be applied to other pages later.
