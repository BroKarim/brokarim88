"use client";

import { useMode } from "@/context/mode";
import { GlassEffect } from "@/components/glass-effect";
import { cn } from "@/lib/utils";

export function ModeWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();
  const baseClass = "w-full max-w-225 z-50 aspect-[1.6/1] relative p-4 rounded-2xl overflow-hidden flex";

  if (mode === "glassy") {
    return <GlassEffect className="w-full max-w-225 z-50 aspect-[1.6/1] relative p-4 rounded-2xl overflow-hidden flex">{children}</GlassEffect>;
  }

  return <div className={cn(baseClass, "bg-[#222] border shadow-[inset_0_1px_rgb(255_255_255/0.15)]")}>{children}</div>;
}
