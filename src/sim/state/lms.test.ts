/* LMS completion reporting. Spec: report only after Page 15 renders, once. */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { reportCompletion, resetCompletionReporting } from "./lms";
import { createInitialState, type SimulationState } from "./types";

function finishedState(): SimulationState {
  return {
    ...createInitialState(),
    diagnosis: "strong",
    diagnosisCorrect: 4,
    strategy: "integrated-adaptive",
    budget: { community: 55, radio: 45, digital: 45, tvOutdoor: 35 },
    budgetProfile: "balanced",
    adjustment: "rebalance",
    defence: "evidence-integrated",
    ending: "integrated-success",
  };
}

describe("LMS completion reporting", () => {
  beforeEach(() => {
    resetCompletionReporting();
    delete (window as unknown as Record<string, unknown>).API;
    delete (window as unknown as Record<string, unknown>).API_1484_11;
  });

  it("does not report before an ending exists", () => {
    expect(reportCompletion(createInitialState())).toBeNull();
  });

  it("reports once and only once per run", () => {
    const s = finishedState();
    expect(reportCompletion(s)).not.toBeNull();
    expect(reportCompletion(s)).toBeNull();
  });

  it("reports again after a restart", () => {
    const s = finishedState();
    expect(reportCompletion(s)).not.toBeNull();
    resetCompletionReporting();
    expect(reportCompletion(s)).not.toBeNull();
  });

  it("emits a DOM event carrying the full decision history", () => {
    const handler = vi.fn();
    window.addEventListener("mph8430:completed", handler);
    reportCompletion(finishedState());
    window.removeEventListener("mph8430:completed", handler);

    expect(handler).toHaveBeenCalledTimes(1);
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toMatchObject({
      completed: true,
      ending: "integrated-success",
      diagnosis: "strong",
      diagnosisCorrect: 4,
      strategy: "integrated-adaptive",
      budgetProfile: "balanced",
      adjustment: "rebalance",
      defence: "evidence-integrated",
    });
  });

  it("drives a SCORM 1.2 API when the host provides one", () => {
    const calls: [string, string][] = [];
    (window as unknown as Record<string, unknown>).API = {
      LMSInitialize: () => "true",
      LMSSetValue: (k: string, v: string) => {
        calls.push([k, v]);
        return "true";
      },
      LMSCommit: () => "true",
    };

    reportCompletion(finishedState());
    const map = Object.fromEntries(calls);
    expect(map["cmi.core.lesson_status"]).toBe("completed");
    expect(JSON.parse(map["cmi.suspend_data"]).ending).toBe("integrated-success");
  });

  it("drives a SCORM 2004 API when the host provides one", () => {
    const calls: [string, string][] = [];
    (window as unknown as Record<string, unknown>).API_1484_11 = {
      Initialize: () => "true",
      SetValue: (k: string, v: string) => {
        calls.push([k, v]);
        return "true";
      },
      Commit: () => "true",
    };

    reportCompletion(finishedState());
    const map = Object.fromEntries(calls);
    expect(map["cmi.completion_status"]).toBe("completed");
    expect(map["cmi.success_status"]).toBe("passed");
  });

  it("never throws when the host API misbehaves", () => {
    (window as unknown as Record<string, unknown>).API = {
      LMSSetValue: () => {
        throw new Error("LMS exploded");
      },
    };
    expect(() => reportCompletion(finishedState())).not.toThrow();
  });
});
