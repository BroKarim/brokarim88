"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "realistic" | "glassy";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as Mode;
    if (saved) setMode(saved);

    setIsMounted(true);
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("realistic", "glassy");
    root.classList.add(mode);
  }, [mode]);

  const value = {
    mode,
    setMode: (newMode: Mode) => {
      localStorage.setItem(storageKey, newMode);
      setMode(newMode);
    },
    isMounted,
  };

  return <ModeProviderContext.Provider value={value}>{children}</ModeProviderContext.Provider>;
}

export const useMode = () => {
  const context = useContext(ModeProviderContext);
  if (!context) throw new Error("useMode must be used within a ModeProvider");
  return context;
};
