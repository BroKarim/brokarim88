"use client";

import { useMode } from "@/context/mode";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Layers } from "lucide-react";
import Image from "next/image";

export function ModeSwitcher() {
  const { mode, setMode } = useMode();

  return (
    <div className="fixed top-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/30">
            <Layers className="h-5 w-5" />
            <span className="sr-only">Switch mode</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="end">
          <div className="space-y-2">
            <p className="text-sm font-medium">Display Mode</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Realistic Mode */}
              <button
                onClick={() => setMode("realistic")}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all ${mode === "realistic" ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"}`}
              >
                <div className="aspect-video relative">
                  <Image src="https://res.cloudinary.com/dctl5pihh/image/upload/v1768100397/default_l46w8l.png" alt="Realistic mode" fill className="object-cover" />
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium">Realistic</p>
                </div>
              </button>

              {/* Glassy Mode */}
              <button
                onClick={() => setMode("glassy")}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all ${mode === "glassy" ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"}`}
              >
                <div className="aspect-video relative">
                  <Image src="https://res.cloudinary.com/dctl5pihh/image/upload/v1768100397/glassy_p2e0za.png" alt="Glassy mode" fill className="object-cover" />
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium">Glassy</p>
                </div>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
