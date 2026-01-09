"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "realistic" | "glassy";

type ModeProviderProps = {
  children: React.ReactNode;
  defaultMode?: Mode;
  storageKey?: string;
};

type ModeProviderState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const initialState: ModeProviderState = {
  mode: "realistic",
  setMode: () => null,
};

const ModeProviderContext = createContext<ModeProviderState>(initialState);

export function ModeProvider({ children, defaultMode = "realistic", storageKey = "ui-mode", ...props }: ModeProviderProps) {
  const [mode, setMode] = useState<Mode>(() => (typeof window !== "undefined" && (localStorage.getItem(storageKey) as Mode)) || defaultMode);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("realistic", "glassy");
    root.classList.add(mode);
  }, [mode]);

  const value = {
    mode,
    setMode: (mode: Mode) => {
      localStorage.setItem(storageKey, mode);
      setMode(mode);
    },
  };

  return (
    <ModeProviderContext.Provider {...props} value={value}>
      {children}
    </ModeProviderContext.Provider>
  );
}

export const useMode = () => {
  const context = useContext(ModeProviderContext);

  if (context === undefined) throw new Error("useMode must be used within a ModeProvider");

  return context;
};
