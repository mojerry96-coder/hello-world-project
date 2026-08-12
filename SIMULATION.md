# MPH8430 — Right Message, Right Channel

Interactive branching simulation. TanStack Start + React + TypeScript.

```bash
npm install
npm run dev     # http://localhost:8080
npm test        # 36 tests — spec section 12, LMS reporting, coverage model
npm run build
```

The live app is `src/sim/`. The `app/` directory is a stale standalone copy from
before the port and is safe to delete.

## Source of truth

| File | Role |
|---|---|
| `MPH8430_15_Page_20_Design_Exact_Replication_Prompt.md` | Build spec — layouts, coordinates, exact copy, formulas |
| `MPH8430_Claude_Master_Production_Prompt.md` | Production workflow and QA gates |
| `MPH8430_SDD_S4_01_….pdf` | Original SDD — cross-check reference only |
| `REFERENCE/` | 27 approved page-design PNGs, mapped in `DESIGN_REFERENCE_MAP.md` |

Every hard value was cross-checked against the SDD: coverage (Metro 70 / Zaria 45
/ Ikara 38), ₦180M, the four barrier answers, the Week 6 evidence, and the ending
figures (82% Metro, Ikara 38→61 and 38→44).

## Structure

```
src/sim/
  design/      tokens, nine Afacad/Manrope type roles, 1672×941 coordinates
  state/       SimulationState, persistence, scoring, coverage model + tests
  content/     exact live copy, the Hauwa through-line, act definitions
  components/  Artboard, MediaSlot, StatusRail, ActCard, TextPlate, chrome
  motion/      GSAP layer — SplitText, CountUp, ClickSpark, grain
  pages/       Page01…Page15 plus PageIntro
public/media/  30 assets (7 video, 23 stills) + narration/
public/fonts/  Afacad + Manrope variable woff2
scripts/       fetch-media.sh · build-intro.sh · build-narration.sh
```

Page 7 renders four conditional designs on one route; Page 15 renders three
endings on one route. Both are driven by state, never defaulted.

## Media — complete

All 29 assets generated through the Higgsfield MCP and wired in.

- **6 videos** — Kling 3.0, multi-shot, native sound, 16:9. Normalised to
  1280×720 H.264 / AAC 48 kHz, 24 fps, loudness ≈ −14 LUFS with peaks ≤ −1 dBTP.
- **23 stills** — Nano Banana Pro at 2K/16:9, delivered 2752×1536 as `.webp`.
- **6 poster frames** — extracted from each accepted video's final frame (spec
  6.2) and held over the paused video so Page 1's hold and Page 10's freeze cut
  with no jump.

`MediaSlot`/`VideoSlot` still fall back to a labelled placeholder if a file is
ever missing, so the build never renders a broken image. To regenerate one asset:

```bash
./scripts/fetch-media.sh <result-url> p09-impact-forecast.webp
```

No interface text is baked into any generated asset — every title, percentage,
label and control is code over media, per spec rule 8.

## Deviations from spec, and why

- **Fonts.** Now Afacad (display) + Manrope (text), per the master production
  prompt, self-hosted as variable woff2 in `public/fonts` so there is no CDN
  round-trip and no silent fallback. Sizes were raised across the board: the
  artboard is contain-scaled, so a nominal 14px label was rendering nearer 11px
  on a laptop. Nothing is below 13px now.
- **Artboard centring.** The spec's `display: grid; place-items: center` clamps
  an oversized item to the start edge instead of centring, so the artboard
  overflowed right and down. Replaced with a 50/50 anchor plus
  `translate(-50%, -50%) scale()`. Same intent, correct result.
- **Budget units.** Held in ₦ millions to match the spec's own formulas.
- **Pages 12 and 14 option layout.** Approved renders and the spec's coordinate
  map disagree; the coordinate map wins per section 0 rule 3. See
  `../DESIGN_REFERENCE_MAP.md`.

## Verified

- Page 4 CTA gates on 3/3 hotspots.
- Page 5 scores first attempts only — correcting all four after a 0/4 opening
  still yields Learning Reset, never a fake 4/4.
- Page 8 unlocks only on an exact ₦180M total.
- Page 9 recalculates from real allocation, strategy and diagnosis.
- Page 14 opening question derives from accumulated history.
- 960-combination sweep: every decision path resolves to one of three endings,
  no dead ends.
- State survives refresh and resumes on the correct route.

## Typography

Afacad for display, Manrope for text — the master production prompt's pairing,
self-hosted as variable woff2 in `public/fonts` and preloaded in `__root.tsx`,
so there is no CDN round-trip and no silent fallback to a system face.

Sizes were raised throughout. The artboard is 1672px wide but contain-scales to
whatever the screen allows, so a nominal 14px label was rendering nearer 11px on
a laptop. Nothing sits below 13px now and body copy runs 17-19px.

Copy set over photography sits on a `TextPlate` — a local gradient behind one
block of text, opaque where the words start and fading past them. Page-level
shades help the composition but cannot guarantee contrast behind a specific
line, and the imagery ranges from night clinics to midday streets.

## Voice-over — screen cues still text-only

`src/sim/components/VoiceOver.tsx` carries the exact script for all four cues
(VO-02, VO-03, VO-11, VO-14) and renders mute, captions and replay controls on
Pages 2, 3, 11 and 14. Captions display the full line, so the narration content
is present and accessible as text right now.

The audio files themselves are **not generated**: the spec names Higgsfield for
video and stills but never names a TTS vendor, and picking one spends money on
an account the brief does not mention. Say the word and I'll produce them —
ElevenLabs has suitable Nigerian voices (e.g. *Toluwalope – Rich and Confident*
for the Programme Director). Drop the results at `public/media/vo-02.mp3`,
`vo-03.mp3`, `vo-11.mp3`, `vo-14.mp3` and they play with no code change.

## LMS reporting

`src/sim/state/lms.ts` fires once, only after Page 15 has rendered, through three
channels so a host can pick whichever it uses: SCORM 1.2 (`window.API`),
SCORM 2004 (`window.API_1484_11`), `postMessage` to the parent frame, and a
`mph8430:completed` DOM event. The payload carries the full decision history.
Restarting from the debrief re-arms it. Covered by `src/sim/state/lms.test.ts`.
