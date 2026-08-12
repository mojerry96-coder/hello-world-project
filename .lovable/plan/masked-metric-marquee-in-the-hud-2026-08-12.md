# Masked metric marquee in the HUD

The campaign metrics on the right of the HUD bar (Metro, Zaria, Ikara...) become a continuous horizontal loop that lives entirely inside the glass card: clipped to its rounded edge, softly faded at both ends, and paused when hovered so values stay readable.

## Behaviour

- Metrics scroll leftwards at a slow, steady pace and repeat seamlessly.
- The track is masked by the metric region, so no chip ever appears outside the HUD card.
- Fades on the left and right edges of the metric region make chips dissolve rather than cut off.
- Hovering the metric strip stops the motion; leaving it resumes smoothly.
- If a page has few enough metrics to fit the available space, they render static — no pointless scrolling.
- Reduced-motion users get the static, clipped layout.
- Identity, campaign week, budget, back button and progress pill are untouched.

## Technical notes

- New `src/sim/components/MetricLoop.tsx`: an in-house LogoLoop-style marquee (no React Bits dependency, no `react-icons`). It measures one metric sequence with a `ResizeObserver`, duplicates it enough times to cover the viewport, and drives `translate3d` on a requestAnimationFrame loop with eased velocity so hover pause/resume is smooth rather than a jump. Falls back to a static single sequence when the sequence fits the container.
- `src/sim/components/DecisionPage.tsx`: the existing `metric-group` block becomes `<MetricLoop metrics={metrics} />`, rendering the same `<Metric />` children. No change to `MetricSpec` or to how pages pass metrics.
- `src/sim/design/decision.css`: add `.metric-loop` (relative, `overflow: hidden`, flex-shrinking so it yields to the fixed HUD blocks), `.metric-loop__track`, `.metric-loop__seq`, and `::before`/`::after` edge fades tinted to the HUD glass gradient. Add `overflow: hidden` to `.decision-hud` so content clips to `--radius-hud`. Existing `.metric-group` styles are reused for the sequence spacing. Reduced-motion rule pins the track transform.
- Responsive rules for `.metric-group` at the existing breakpoints keep working; the loop simply disables itself when metrics fit.
