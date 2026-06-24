"use client";

import { createContext, useEffect, useState, use, useSyncExternalStore } from "react";

type Mode = "realistic" | "glassy";

function applyModeToDOM(mode: Mode) {
  const root = document.documentElement;
  root.classList.remove("realistic", "glassy");
  root.classList.add(mode);
}

const ModeProviderContext = createContext<
  | {
      mode: Mode;
      setMode: (mode: Mode) => void;
      isMounted: boolean;
    }
  | undefined
>(undefined);

export function ModeProvider({ children, defaultMode = "realistic", storageKey = "ui-mode" }: { children: React.ReactNode; defaultMode?: Mode; storageKey?: string }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as Mode | null;
    if (saved && saved !== defaultMode) {
      setMode(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyModeToDOM(mode);
  }, [mode]);

  const value = {
    mode,
    setMode: (newMode: Mode) => {
      localStorage.setItem(storageKey, newMode);
      applyModeToDOM(newMode);
      setMode(newMode);
    },
    isMounted,
  };

  return <ModeProviderContext.Provider value={value}>{children}</ModeProviderContext.Provider>;
}

export const useMode = () => {
  const context = use(ModeProviderContext);
  if (!context) throw new Error("useMode must be used within a ModeProvider");
  return context;
};
