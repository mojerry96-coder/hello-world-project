/* Exact live copy and data tables, transcribed from the replication spec and
   cross-checked against the SDD. Nothing here is paraphrased. */

import type { Barrier, ReportId, RegionId, Strategy } from "../state/types";

/* ---------- Page 04 ---------- */

export const fieldEvidence: Record<
  RegionId,
  {
    title: string;
    coverage: string;
    concern: string;
    channelEvidence: string;
    /** Condensed form used in the bottom summary rail. */
    summary: string;
  }
> = {
  metro: {
    title: "KADUNA METRO",
    coverage: "70%",
    concern: "Online misinformation is increasing.",
    channelEvidence: "Strong smartphone and digital engagement.",
    summary: "Online misinformation · Digital",
  },
  zaria: {
    title: "ZARIA",
    coverage: "45%",
    concern: "Moderate uptake; trust needs reinforcement.",
    channelEvidence: "Community discussions and trusted messengers matter.",
    summary: "Trust-building · Leaders + radio",
  },
  ikara: {
    title: "IKARA",
    coverage: "38%",
    concern: "Refusal is linked to rumours and misinformation.",
    channelEvidence: "Radio and face-to-face discussion dominate access.",
    summary: "Refusal rumours · Radio + community",
  },
};

/* ---------- Page 05 ---------- */

export const reports: Record<
  ReportId,
  { text: string; correct: Barrier; image: string; src: string; alt: string }
> = {
  A: {
    text: "Parents are asking questions online, but programme responses are inconsistent.",
    correct: "digital-communication",
    image: "IMG-05A",
    src: "p05-report-a-digital.webp",
    alt: "Kaduna campaign office. Communications staff monitor parent questions on phones and laptops while two team members give inconsistent replies.",
  },
  B: {
    text: "Some households are refusing MCV2 due to infertility rumours.",
    correct: "misinformation-trust",
    image: "IMG-05B",
    src: "p05-report-b-rumour.webp",
    alt: "Ikara PHC. A hesitant Hausa mother holding a toddler speaks quietly with a female community health worker outside a modest clinic.",
  },
  C: {
    text: "Many rural households rely on radio and community discussions rather than online platforms.",
    correct: "channel-access",
    image: "IMG-05C",
    src: "p05-report-c-radio.webp",
    alt: "Rural Kaduna household courtyard. Families gather around a small battery radio while a community discussion continues under tree shade.",
  },
  D: {
    text: "Community leaders want clarification about vaccine safety before encouraging families.",
    correct: "trusted-messenger",
    image: "IMG-05D",
    src: "p05-report-d-leader.webp",
    alt: "A female community health worker briefs a respected traditional and religious leader beside a community meeting area in Kaduna.",
  },
};


/* Drop zones, in the fixed left-to-right order of the spec layout.

   `short` is what the learner reads and reasons with — plain cause language,
   because "Channel Access" and "Digital" are indistinguishable to anyone who
   has not already read the course notes. `full` keeps the SDD's assessment
   terminology, shown underneath in small caps and used for the accessible
   label, so the marking vocabulary is still taught and still examinable. */
export const barrierZones: {
  id: Barrier;
  short: string;
  full: string;
  x: number;
  w: number;
}[] = [
  {
    id: "digital-communication",
    short: "WE'RE TOO SLOW ONLINE",
    full: "Digital communication barrier",
    x: 70,
    w: 218,
  },
  {
    id: "misinformation-trust",
    short: "THEY BELIEVE IT WILL HARM THEM",
    full: "Misinformation / trust barrier",
    x: 300,
    w: 288,
  },
  {
    id: "channel-access",
    short: "OUR MESSAGE NEVER REACHES THEM",
    full: "Channel access barrier",
    x: 600,
    w: 288,
  },
  {
    id: "trusted-messenger",
    short: "THEY'LL LISTEN — BUT NOT TO US",
    full: "Trusted messenger barrier",
    x: 900,
    w: 268,
  },
  {
    id: "not-primary",
    short: "NOT A COMMUNICATION PROBLEM",
    full: "Not a primary communication barrier",
    x: 1180,
    w: 258,
  },
];

export const correctFeedback: Record<ReportId, string> = {
  A: "Correct. Online engagement requires timely and consistent responses. Weak coordination allows misinformation to spread.",
  B: "Correct. The refusal is driven by false beliefs affecting confidence in vaccination.",
  C: "Correct. Communication channels must match how communities actually receive information.",
  D: "Correct. Community leaders are key influencers in vaccine acceptance and must be actively engaged.",
};

export const INCORRECT_FEEDBACK =
  "Incorrect classification. The selected barrier does not accurately reflect the underlying communication issue in the field report. Review how different types of communication barriers influence vaccine uptake.";

export const diagnosisOutcomeCopy = {
  strong:
    "Your diagnosis identifies the major communication barriers. Strategy selection is now unlocked.",
  partial:
    "Some barriers were misdiagnosed. You may proceed, but the next stage begins with reduced effectiveness.",
  reset:
    "Re-evaluate the reports before proceeding. Your first diagnosis has been recorded.",
} as const;

/* ---------- Page 06 ---------- */

/* `plain` leads — it is what the learner reasons with. `name` is the SDD's
   strategy term, kept underneath so the assessment vocabulary is still taught. */
export const strategies: {
  id: Strategy;
  plain: string;
  name: string;
  channels: string;
}[] = [
  {
    id: "digital-first",
    plain: "Answer them fast, online",
    name: "Digital-first",
    channels: "WhatsApp · SMS · social",
  },
  {
    id: "community-trust",
    plain: "Send people they already trust",
    name: "Community trust",
    channels: "Health workers · religious and traditional leaders",
  },
  {
    id: "high-visibility",
    plain: "Make the campaign impossible to miss",
    name: "High visibility",
    channels: "TV · outdoor · public awareness",
  },
  {
    id: "integrated-adaptive",
    plain: "Different message for different places",
    name: "Integrated adaptive",
    channels: "Rural trust · urban digital · statewide radio",
  },
];
