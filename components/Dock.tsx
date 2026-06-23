"use client";

import { useState, useCallback } from "react";
import type { SuminagashiCanvasHandle } from "./SuminagashiCanvas";

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
  const [activeInk, setActiveInk] = useState<string>("cycle");
  const [autoFlow, setAutoFlow] = useState(true);

  const handleInkClick = useCallback(
    (ink: string) => {
      setActiveInk(ink);
      canvasRef.current?.setInkMode(ink);
    },
    [canvasRef]
  );

  const handleAutoToggle = useCallback(() => {
    const next = canvasRef.current?.toggleAutoFlow();
    if (next !== undefined) setAutoFlow(next);
  }, [canvasRef]);

  const handleWash = useCallback(() => {
    canvasRef.current?.triggerWash();
  }, [canvasRef]);

  return (
    <div className="dock" role="toolbar" aria-label="墨の操作">
      <div className="inks">
        {INKS.map(({ key, label }) => (
          <button
            key={key}
            className={`ink ink-${key}`}
            data-ink={key}
            aria-pressed={activeInk === key}
            onClick={() => handleInkClick(key)}
          >
            <span className="lbl">{label}</span>
          </button>
        ))}
      </div>
      <button
        id="autoBtn"
        className="act"
        aria-pressed={autoFlow}
        title="放置中の自動滴下と水流のオン/オフ"
        onClick={handleAutoToggle}
      >
        自動演出
      </button>
      <button
        id="washBtn"
        className="act"
        title="インクを徐々に洗い流す"
        onClick={handleWash}
      >
        洗い流す
      </button>
    </div>
  );
}
