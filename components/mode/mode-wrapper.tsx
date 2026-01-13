"use client";

import { useMode } from "@/context/mode";
import { GlassEffect } from "@/components/glass-effect";
import { cn } from "@/lib/utils";

export function ModeWrapper({ children }: { children: React.ReactNode }) {
  const { mode, isMounted } = useMode();
  const baseClass = "w-full max-w-225 z-50 relative p-4 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[70vh] md:aspect-[1.6/1] md:h-auto";
  
  if (!isMounted) {
    return <div className={cn(baseClass, "bg-[#222] border shadow-[inset_0_1px_rgb(255_255_255/0.15)]")}>{children}</div>;
  }
  
  if (mode === "glassy") {
    return <GlassEffect className={baseClass}>{children}</GlassEffect>;
  }
  
  return <div className={cn(baseClass, "bg-[#222] border shadow-[inset_0_1px_rgb(255_255_255/0.15)]")}>{children}</div>;
}