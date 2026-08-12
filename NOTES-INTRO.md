# Intro and Page 1 — stills, not video

Both now render stills. The video files remain in `public/media/` (unused by the
app) so the film can be restored, and `scripts/build-intro.sh` still rebuilds it.

**Why:**
- On Page 1 the film held the title card for seven seconds before a single word
  appeared. That reads as a broken page, not a deliberate hold. Reveals now
  finish inside 1.5s.
- On the intro, motion behind the copy competed with reading it. Each beat holds
  one frame and cross-fades, so pace is set by reading time.

**Assets:** `intro-beat-1.webp` … `intro-beat-6.webp`, one per beat, extracted
mid-shot from the cut so the framing still matches the original edit.
`p01-clinic-cold-open-poster.webp` carries Page 1.

**Still unused, still on disk:** `intro-simulation.mp4` (9.2MB),
`p01-clinic-cold-open.mp4` (3MB). Page 10's five week-clips are untouched and
still play.

**Narration:** not recorded. The rewritten script is awaiting approval; the
current on-screen beat copy is unchanged.
