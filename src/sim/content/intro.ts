/* 30-second orientation intro.

   The learner arrives knowing nothing. These beats answer, in order: where am I,
   who am I, what do I actually do, does it matter, and how does it end.

   Timings are cut points in the edited film (see scripts/build-intro.sh):
     shot 1  0.0 – 5.9   the problem      clinic doorway, hesitant mother
     shot 2  5.6 – 11.5  the role         SPHCDA office, assignment handed over
     shot 3 11.2 – 16.6  the work         map, radio booth, phone
     shot 4 16.2 – 22.0  the consequence  fatigue, dusk, circled Ikara
     shot 5 21.7 – 27.6  the stakes       ministry briefing room
     hold   27.6 – 30.0  title card

   Beats are deliberately offset ~0.7s after each cut so the image lands first
   and the words follow it. */

export type IntroBeat = {
  at: number;
  until: number;
  kicker?: string;
  line: string;
  /** Second line, set smaller — the concrete detail under the claim. */
  detail?: string;
};

export const INTRO_BEATS: IntroBeat[] = [
  {
    at: 0.8,
    until: 5.6,
    kicker: "Kaduna State, Nigeria",
    line: "The vaccines are already here.",
    detail: "Uptake is not. Metro 70%. Zaria 45%. Ikara 38%.",
  },
  {
    at: 6.3,
    until: 11.2,
    kicker: "Your role",
    line: "You are the Health Communication Officer.",
    detail: "Ten weeks. ₦180 million. One immunisation campaign.",
  },
  {
    at: 11.9,
    until: 16.2,
    kicker: "What you decide",
    line: "Diagnose the real barrier, then choose your channels.",
    detail: "Community mobilisation · Radio · Digital · TV and outdoor",
  },
  {
    at: 16.9,
    until: 21.7,
    kicker: "What it costs",
    line: "Every choice compounds, and the field answers back.",
    detail: "Trust, reach and workforce pressure all move with your money.",
  },
  {
    at: 22.4,
    until: 27.4,
    kicker: "The reckoning",
    line: "Then you defend it to the Commissioner.",
    detail: "Five scored decisions. Three endings. Yours is earned, not given.",
  },
];

/** Shown over the held final frame. */
export const INTRO_TITLE = {
  at: 27.8,
  kicker: "A social marketing simulation",
  line: "RIGHT MESSAGE,\nRIGHT CHANNEL",
};

export const INTRO_DURATION = 30;

/** Flat transcript for the captions track and the accessible description. */
export const INTRO_TRANSCRIPT = INTRO_BEATS.map(
  (b) => `${b.kicker}. ${b.line} ${b.detail ?? ""}`.trim(),
).join(" ");
