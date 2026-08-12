# Specular shine on the major buttons

Add the React Bits SpecularButton effect — a light streak that rides the button's edge and steers toward the cursor as it gets close — to the simulation's primary calls to action.

## Where it applies

- The decision-screen commit button (`Continue`, `Place report`, `Submit defence`, etc.) rendered by the shared decision shell.
- The intro screen's primary CTA.
- The act-break / chrome primary CTA.

Secondary controls (Back chip, option cards, sliders) stay untouched.

## How it behaves

- Idle: no shine, button looks exactly as it does today (amber gradient, uppercase label).
- Cursor within ~250px: the specular streak fades in and points toward the pointer.
- Cursor over the button: the light settles on the diagonal and sways slightly with pointer position, on top of the existing lift-and-brighten hover.
- Disabled: no shine at all, current dimmed state preserved.
- Reduced motion: shine is not rendered; buttons behave as they do now.

Colours are tuned to the project's warm palette instead of the demo's grey/white — a warm cream highlight over a soft amber base stroke — so it reads as polished glass on the existing gradient rather than a foreign grey pill.

## Technical notes

- Install `ogl`.
- New `src/sim/components/SpecularButton.tsx` — a TypeScript port of the supplied component: OGL renderer, rounded-rect SDF shader, ResizeObserver sizing, pointer-proximity steering, cleanup on unmount. Adjusted from the original in three ways:
  1. It renders only the WebGL overlay layer and accepts arbitrary children/classes, so existing button styling (`.place-report`, `.primary-cta`) drives padding, colour and typography — no `--sb-*` size presets replacing the current look.
  2. Skips creating the GL context when `state.reducedMotion` is set or WebGL is unavailable, so it degrades to the plain button.
  3. Standard `backdrop-filter` only (no hand-written `-webkit-` twin, which the production CSS build would drop).
- New `src/sim/design/specular.css` for the overlay layer: absolutely positioned inset canvas wrapper, `pointer-events: none`, label lifted above it. Existing button rules keep ownership of colour and geometry; the wrapper adds `position: relative` and `isolation` only where needed.
- `src/sim/components/DecisionPage.tsx`: wrap the submit button's contents with the specular overlay, keeping ref, `disabled`, `aria-disabled` and click handler intact.
- `src/sim/pages/PageIntro.tsx` and `src/sim/components/Chrome.tsx`: same treatment on their primary CTA.
- One shared pointer listener per button instance, removed on unmount; RAF loop stops when unmounted.

## Verification

Drive the preview with a headless browser: hover the decision CTA, confirm a canvas appears inside the button, the shine intensity rises with proximity, the button remains clickable and advances the page, and that a reduced-motion run renders no canvas.
