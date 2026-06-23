"use client";

import { useState, useCallback } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CONFIG } from "./SuminagashiCanvas";
import { Icons } from "./icons";

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
  const [vals, setVals] = useState(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.key, CONFIG[s.key]])) as Record<keyof typeof CONFIG, number>,
  );

  const handleChange = useCallback((key: keyof typeof CONFIG, value: number) => {
    CONFIG[key] = value as never;
    setVals((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="appearance-none border-none bg-transparent cursor-pointer flex items-center justify-center p-0"
          title="Settings"
        >
          <Icons.settings className="w-5 h-5 text-white/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" sideOffset={16} align="center" className="w-72 p-5">
        <div className="space-y-5">
          <h3 className="text-sm font-medium text-foreground">Settings</h3>
          {SETTINGS.map(({ key, label, min, max, step, format }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-muted-foreground">{label}</label>
                <span className="text-xs tabular-nums text-foreground font-medium">{format(vals[key])}</span>
              </div>
              <SliderPrimitive.Root
                value={[vals[key]]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]: number[]) => handleChange(key, v)}
                className="relative flex w-full touch-none items-center h-9 rounded-md border border-input bg-background px-3 cursor-pointer"
              >
                <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full bg-muted h-2">
                  <SliderPrimitive.Range className="absolute h-full bg-primary" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </SliderPrimitive.Root>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
