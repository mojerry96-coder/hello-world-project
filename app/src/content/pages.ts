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

/** Short drop-zone labels, in the fixed left-to-right order of the spec layout. */
export const barrierZones: {
  id: Barrier;
  short: string;
  full: string;
  x: number;
  w: number;
}[] = [
  { id: "digital-communication", short: "DIGITAL", full: "DIGITAL COMMUNICATION BARRIER", x: 70, w: 142 },
  { id: "misinformation-trust", short: "MISINFORMATION / TRUST", full: "MISINFORMATION / TRUST BARRIER", x: 252, w: 286 },
  { id: "channel-access", short: "CHANNEL ACCESS", full: "CHANNEL ACCESS BARRIER", x: 608, w: 210 },
  { id: "trusted-messenger", short: "TRUSTED MESSENGER", full: "TRUSTED MESSENGER BARRIER", x: 897, w: 247 },
  { id: "not-primary", short: "NOT PRIMARY", full: "NOT A PRIMARY COMMUNICATION BARRIER", x: 1210, w: 150 },
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

export const strategies: {
  id: Strategy;
  name: string;
  channels: string;
}[] = [
  { id: "digital-first", name: "DIGITAL-FIRST", channels: "WHATSAPP · SMS · SOCIAL" },
  {
    id: "community-trust",
    name: "COMMUNITY TRUST",
    channels: "CHWs · RELIGIOUS · TRADITIONAL LEADERS",
  },
  { id: "high-visibility", name: "VISIBILITY", channels: "TV · OUTDOOR · PUBLIC AWARENESS" },
  {
    id: "integrated-adaptive",
    name: "INTEGRATED ADAPTIVE",
    channels: "RURAL TRUST · URBAN DIGITAL · RADIO",
  },
];
