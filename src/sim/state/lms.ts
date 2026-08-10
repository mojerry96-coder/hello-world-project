/* LMS completion reporting.

   Spec: report completion only after Page 15 has rendered and the debrief is
   available — never earlier, and never from the Page 14 answer.

   No specific LMS was named, so this reports through the three channels a host
   can pick up without further integration work:
     1. SCORM 1.2 / 2004, if a `window.API` or `window.API_1484_11` is present.
     2. postMessage to the parent frame, for xAPI/LTI wrappers.
     3. A DOM CustomEvent, for anything embedding the app directly.

   Fires at most once per run. */

import type { SimulationState } from "./types";

export type CompletionPayload = {
  completed: true;
  ending: SimulationState["ending"];
  diagnosis: SimulationState["diagnosis"];
  diagnosisCorrect: number;
  strategy: SimulationState["strategy"];
  budgetProfile: SimulationState["budgetProfile"];
  adjustment: SimulationState["adjustment"];
  defence: SimulationState["defence"];
};

type ScormApi = {
  LMSInitialize?: (s: string) => string;
  LMSSetValue?: (k: string, v: string) => string;
  LMSCommit?: (s: string) => string;
  Initialize?: (s: string) => string;
  SetValue?: (k: string, v: string) => string;
  Commit?: (s: string) => string;
};

let reported = false;

export function reportCompletion(state: SimulationState): CompletionPayload | null {
  if (reported || !state.ending) return null;
  reported = true;

  const payload: CompletionPayload = {
    completed: true,
    ending: state.ending,
    diagnosis: state.diagnosis,
    diagnosisCorrect: state.diagnosisCorrect,
    strategy: state.strategy,
    budgetProfile: state.budgetProfile,
    adjustment: state.adjustment,
    defence: state.defence,
  };

  try {
    const w = window as unknown as {
      API?: ScormApi;
      API_1484_11?: ScormApi;
    };

    const scorm2004 = w.API_1484_11;
    const scorm12 = w.API;

    if (scorm2004?.SetValue) {
      scorm2004.Initialize?.("");
      scorm2004.SetValue("cmi.completion_status", "completed");
      scorm2004.SetValue("cmi.success_status", "passed");
      scorm2004.SetValue("cmi.suspend_data", JSON.stringify(payload));
      scorm2004.Commit?.("");
    } else if (scorm12?.LMSSetValue) {
      scorm12.LMSInitialize?.("");
      scorm12.LMSSetValue("cmi.core.lesson_status", "completed");
      scorm12.LMSSetValue("cmi.suspend_data", JSON.stringify(payload));
      scorm12.LMSCommit?.("");
    }

    if (window.parent !== window) {
      window.parent.postMessage({ type: "mph8430:completed", payload }, "*");
    }

    window.dispatchEvent(
      new CustomEvent("mph8430:completed", { detail: payload }),
    );
  } catch {
    // Reporting must never break the learner's view of the outcome.
  }

  return payload;
}

/** Test seam — lets a fresh run report again after a restart. */
export function resetCompletionReporting() {
  reported = false;
}
