"use client";

import { useState, useCallback } from "react";
import type { SuminagashiCanvasHandle } from "./SuminagashiCanvas";
import { Icons } from "./icons";
import { useMode } from "@/context/mode";
import { FloatingButton, FloatingButtonItem } from "./ui/floating-button";
import { DribbbleIcon, FacebookIcon, LinkedinIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SettingsPopover from "./SettingsPopover";

interface DockProps {
  canvasRef: React.RefObject<SuminagashiCanvasHandle | null>;
}

const INKS = [
  { key: "cycle", label: "巡" },
  { key: "sumi", label: "墨" },
  { key: "ai", label: "藍" },
  { key: "shu", label: "朱" },
  { key: "matsuba", label: "松葉" },
] as const;

export default function Dock({ canvasRef }: DockProps) {
  const { mode } = useMode();
  const [activeInk, setActiveInk] = useState<string>("cycle");

  const isGlassy = mode === "glassy";
  const dockBase = isGlassy ? "bg-white/10 backdrop-blur-md border-white/20" : "bg-[#222] border";

  const items = [
    {
      id: "facebook",
      icon: <FacebookIcon />,
      bgColor: "bg-[#1877f2]",
    },
    {
      id: "dribbble",
      icon: <DribbbleIcon />,
      bgColor: "bg-[#ea4c89]",
    },
    {
      id: "linkedin",
      icon: <LinkedinIcon />,
      bgColor: "bg-[#0a66c2]",
    },
  ];

  const handleInkClick = useCallback(
    (ink: string) => {
      setActiveInk(ink);
      canvasRef.current?.setInkMode(ink);
    },
    [canvasRef],
  );

  const handleWash = useCallback(() => {
    canvasRef.current?.triggerWash();
  }, [canvasRef]);

  return (
    <div className="fixed left-1/2 bottom-[26px] -translate-x-1/2 z-50 flex gap-2">
      {/* ink dock */}
      <div className={`flex items-center gap-3.5 px-[22px] py-3 rounded-full ${dockBase} shadow-[inset_0_1px_rgb(255_255_255/0.15)]`} role="toolbar" aria-label="Ink selection">
        {INKS.map(({ key, label }) => (
          <button key={key} className={`ink ink-${key}`} data-ink={key} aria-pressed={activeInk === key} onClick={() => handleInkClick(key)}>
            <span className="lbl">{label}</span>
          </button>
        ))}
      </div>
      {/* wash dock */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${dockBase} shadow-[inset_0_1px_rgb(255_255_255/0.15)]`} role="toolbar">
        <button className="appearance-none border-none bg-transparent cursor-pointer flex items-center justify-center p-0" title="Wash away ink" onClick={handleWash}>
          <Icons.trashh className="w-5 h-5 text-white/70" />
        </button>
      </div>
      {/* settings dock */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${dockBase} shadow-[inset_0_1px_rgb(255_255_255/0.15)]`} role="toolbar">
        <SettingsPopover />
      </div>
    </div>
  );
}
