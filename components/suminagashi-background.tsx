"use client";

import { useRef } from "react";
import SuminagashiCanvas from "./SuminagashiCanvas";
import type { SuminagashiCanvasHandle } from "./SuminagashiCanvas";
import Dock from "./Dock";

export default function SuminagashiBackground() {
  const canvasRef = useRef<SuminagashiCanvasHandle>(null);

  return (
    <>
      <SuminagashiCanvas ref={canvasRef} />
      <Dock canvasRef={canvasRef} />
    </>
  );
}
