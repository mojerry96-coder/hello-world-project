/* Versioned, persisted simulation state. Written after every meaningful action
   so refresh and resume preserve progress (spec section 5). */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createInitialState,
  STORAGE_KEY,
  type SimulationState,
} from "./types";

function load(): SimulationState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<SimulationState>;
    // A schema bump invalidates the old save rather than half-migrating it.
    if (parsed.schemaVersion !== 1) return createInitialState();
    return { ...createInitialState(), ...parsed } as SimulationState;
  } catch {
    return createInitialState();
  }
}

type Ctx = {
  state: SimulationState;
  update: (patch: Partial<SimulationState>) => void;
  apply: (fn: (s: SimulationState) => Partial<SimulationState>) => void;
  reset: () => void;
};

const SimulationContext = createContext<Ctx | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(load);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode, quota). The run still works in memory.
    }
  }, [state]);

  const update = useCallback((patch: Partial<SimulationState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const apply = useCallback(
    (fn: (s: SimulationState) => Partial<SimulationState>) => {
      setState((s) => ({ ...s, ...fn(s) }));
    },
    [],
  );

  const reset = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  const value = useMemo(
    () => ({ state, update, apply, reset }),
    [state, update, apply, reset],
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): Ctx {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
}
