// components/mode-switcher.tsx
"use client";

import { useMode } from "@/context/mode";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Layers } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MODES = [
  {
    id: "realistic",
    label: "Realistic",
    image: "https://res.cloudinary.com/dctl5pihh/image/upload/f_auto,q_auto,w_400/v1768100397/default_l46w8l.png",
    placeholder: "https://res.cloudinary.com/dctl5pihh/image/upload/w_20,q_30,e_blur:200/v1768100397/default_l46w8l.png",
  },
  {
    id: "glassy",
    label: "Glassy",
    image: "https://res.cloudinary.com/dctl5pihh/image/upload/f_auto,q_auto,w_400/v1768100397/glassy_p2e0za.png",
    placeholder: "https://res.cloudinary.com/dctl5pihh/image/upload/w_20,q_30,e_blur:200/v1768100397/glassy_p2e0za.png",
  },
] as const;

export function ModeSwitcher() {
  const { mode, setMode } = useMode();
  const isGlassy = mode === "glassy";

  return (
    <div className="fixed top-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              isGlassy
                ? "border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
                : "border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/30"
            )}
          >
            <Layers className="h-5 w-5" />
            <span className="sr-only">Switch mode</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-80 p-3",
            isGlassy && "bg-white/10 backdrop-blur-md border-white/20"
          )}
          align="end"
        >
          <div className="space-y-2">
            <p className={cn("text-sm font-medium", isGlassy && "text-white")}>
              Display Mode
            </p>

            <div className="grid grid-cols-2 gap-3">
              {MODES.map((modeOption) => {
                const isActive = mode === modeOption.id;

                return (
                  <button
                    key={modeOption.id}
                    onClick={() => setMode(modeOption.id as typeof mode)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border-2 transition-all",
                      isActive
                        ? "border-primary ring-2 ring-primary/20"
                        : isGlassy
                        ? "border-white/20 hover:border-white/40"
                        : "border-transparent hover:border-muted-foreground/20"
                    )}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={modeOption.image}
                        alt={`${modeOption.label} mode`}
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={modeOption.placeholder}
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className={cn("text-xs font-medium", isGlassy && "text-white")}>
                        {modeOption.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}