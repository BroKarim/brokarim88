"use client";


import { createContext, useContext, useEffect, useState } from "react";

type Mode = "realistic" | "glassy";

const ModeProviderContext = createContext<
  | {
      mode: Mode;
      setMode: (mode: Mode) => void;
      isMounted: boolean; // Tambahkan ini agar komponen lain tahu kapan harus render mode
    }
  | undefined
>(undefined);

export function ModeProvider({ children, defaultMode = "realistic", storageKey = "ui-mode" }: { children: React.ReactNode; defaultMode?: Mode; storageKey?: string }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Ambil data dari localStorage setelah mount
    const saved = localStorage.getItem(storageKey) as Mode;
    if (saved) setMode(saved);

    // 2. Tandai bahwa inisialisasi selesai
    setIsMounted(true);
  }, [storageKey]);

  useEffect(() => {
    // 3. Update class pada root HTML
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
