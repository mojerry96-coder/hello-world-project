# Design reference map

Replaces spec section 2, whose `generated_images/exec-<uuid>.png` paths do not
exist in this checkout. Built by inspecting all 27 PNGs in `REFERENCE/`.

Files are listed in capture order. The `REFERENCE/` directory was renamed from
`REFERENCE ` (it had a trailing space, which broke ordinary path lookups).

| # | File (suffix) | Design | Status |
|---:|---|---|---|
| 1 | `02_16_55 PM (1)` | Page 01 — Opening | approved |
| 2 | `02_16_55 PM (2)` | Page 02 — Mission Briefing | approved |
| 3 | `02_16_55 PM (3)` | Page 03 — Campaign Baseline | approved |
| 4 | `02_16_57 PM (4)` | Page 04 — Field Evidence Map | approved |
| 5 | `02_16_57 PM (5)` | Page 05 — Classify Barriers | approved |
| 6 | `02_16_57 PM (6)` | Page 06 — Select Strategy | superseded by #11 |
| 7 | `02_16_57 PM (7)` | Page 07A — Digital-First | approved |
| 8 | `02_16_57 PM (8)` | Page 07B — Community Trust | approved |
| 9 | `02_16_57 PM (9)` | Page 07C — High Visibility | approved |
| 10 | `02_16_57 PM (10)` | Page 07D — Integrated Adaptive | approved |
| 11 | `02_16_57 PM (11)` | Page 06 — Select Strategy, corrected unselected state | **approved** |
| 12 | `02_17_39 PM (1)` | Page 08 — Allocate the ₦180M Budget | approved |
| 13 | `02_17_39 PM (2)` | Page 09 — Conditional Impact Forecast | approved |
| 14 | `02_17_40 PM (3)` | Page 10 — Campaign in Motion, Weeks 1–5 | approved |
| 15 | `02_17_40 PM (4)` | Page 11 — Week 6 Field Update | approved |
| 16 | `02_17_40 PM (5)` | Page 12 — Adapt Weeks 7–10 | approved |
| 17 | `02_17_40 PM (6)` | Page 13 — Friday Briefing Arrival | approved |
| 18 | `02_17_40 PM (7)` | Page 14 — Defend the Strategy | iteration |
| 19 | `02_17_40 PM (8)` | Page 15A — Integrated Success | approved |
| 20 | `02_17_40 PM (9)` | Page 15B — High Visibility, Limited Change | approved |
| 21 | `02_17_40 PM (10)` | Page 15C — Strong Trust, horizontal rail | superseded by #27 |
| 22 | `02_17_40 PM (11)` | Page 14 — Defend the Strategy | final clean render |
| 23 | `02_17_40 PM (12)` | Page 15C — Strong Trust, horizontal rail | superseded by #27 |
| 24 | `02_17_40 PM (13)` | Page 14 — Defend the Strategy | final clean render |
| 25 | `02_17_40 PM (14)` | Page 15C — Strong Trust, horizontal rail | superseded by #27 |
| 26 | `02_17_40 PM (15)` | Page 14 — alternate right-side list layout | rejected |
| 27 | `02_17_40 PM (16)` | Page 15C — Strong Trust, vertical left layout | **approved** |

**27 files = 20 designs + 7 iterations.** The surplus is entirely Page 14
(#18, #22, #24, #26) and Page 15C (#21, #23, #25), which were re-rendered
several times. The spec explicitly names #27's vertical left-side layout as the
approved 15C treatment, overriding the 15A/15B horizontal rail — that is what
the build implements.

## Where the build follows the spec over the renders

Section 2 states the renders are composition references only, and section 0
rule 3 makes this file's coordinate maps authoritative for interaction. Two
places where they disagree, and the build follows the coordinates:

- **Page 12 options.** Renders show a thin horizontal radio row; the coordinate
  map specifies four 372×108 cards at y 652. Built as cards.
- **Page 14 options.** Renders show one horizontal row of four across the
  bottom; the coordinate map specifies a 2×2 grid at x 680/1136, y 438/578.
  Built as the grid.

## Small details taken from the renders

- Page 09 carries a `Page 9 of 15` marker and labels its rationale with the
  budget profile (e.g. `BALANCED INVESTMENT`) above the sentence.
- Page 11 renders `CHW FATIGUE — 3 TEAMS` and `OFFLINE RUMOURS — ACTIVE` in the
  warning colour rather than plain cream.
- Page 12 shows a `No adjustment selected` status line while nothing is chosen,
  reinforcing that the page opens unselected.
