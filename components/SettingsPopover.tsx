"use client";

import { useState, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CONFIG } from "./suminagashi-config";
import { Icons } from "./icons";
import { IntensitySlider } from "./ui/intensity-slider";

interface Setting {
  key: keyof typeof CONFIG;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const SETTINGS: Setting[] = [
  { key: "SPLAT_RADIUS", label: "Drop Size", min: 0.003, max: 0.05, step: 0.001, format: (v) => v.toFixed(3) },
  { key: "SPLAT_FORCE", label: "Spread Force", min: 500, max: 15000, step: 100, format: (v) => String(v) },
  { key: "DYE_DISSIPATION", label: "Fade Speed", min: 0.01, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
  { key: "CURL", label: "Swirl", min: 1, max: 50, step: 1, format: (v) => String(v) },
];

export default function SettingsPopover() {
  const [vals, setVals] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.key, CONFIG[s.key]])) as Record<keyof typeof CONFIG, number>);

  const handleChange = useCallback((key: keyof typeof CONFIG, value: number) => {
    CONFIG[key] = value as never;
    setVals((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="appearance-none border-none bg-transparent cursor-pointer flex items-center justify-center p-0" title="Settings">
          <Icons.settings className="w-5 h-5 text-white/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" sideOffset={16} align="center" className="bg-[#222] border shadow-[inset_0_1px_rgb(255_255_255/0.15)]">
        <div className="space-y-5">
          <h3 className="text-sm font-medium text-foreground">Settings</h3>
          {SETTINGS.map(({ key, label, min, max, step }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-white">{label}</label>
                {/* <span className="text-xs tabular-nums text-foreground font-medium">{format(vals[key])}</span> */}
              </div>
              <IntensitySlider value={vals[key]} min={min} max={max} step={step} onValueChange={(v) => handleChange(key, v)} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
