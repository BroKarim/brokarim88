---
name: suminigashi
description: Portable suminagashi (墨流し) ink-marbling WebGL effect — a fullscreen Three.js fluid simulation with interactive pointer drops, auto-flow, and a Dock toolbar for ink selection.
disable-model-invocation: true
---

# Suminagashi

Portable **suminagashi** (墨流し) — a fullscreen ink-marbling fluid simulation. Drop ink with your pointer, watch it swirl. Built on a Three.js GPU fluid solver with paper-texture compositing.

## Dependencies

```json
{
  "dependencies": {
    "three": "^0.184.0",
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/three": "^0.184.1",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=24"
  }
}
```

**Only hard requirement:** `three` at `^0.184` and its types. Next.js and React are already implied by the target project. Tailwind v4 is used for the Dock styling — swap to whatever CSS approach the target project uses.

## Architecture

Three layers compose the effect:

1. **GPU fluid solver** — a quad-ping-pong FBO pipeline running on the GPU via shaders. Solves Navier-Stokes incompressible flow at two resolutions: velocity field (`SIM_RES`) and dye field (`DYE_RES`). Every frame: apply vorticity confinement, compute divergence, solve pressure (Jacobi iteration), subtract pressure gradient, advect both velocity and dye.
2. **Paper texture compositor** — the final display shader. It reads the dye buffer, applies Beer-Lambert absorption (`exp(-dye)`), multiplies by paper color, adds multi-octave hash noise for paper fiber texture, and multiplies by a vignette.
3. **React shell** — `SuminagashiCanvas` owns the renderer, animation loop, pointer/keyboard event handlers, and exposes an imperative handle. `Dock` is a separate toolbar component that calls methods on that handle.

## Files to Copy

Copy these three files verbatim into the target project, then adapt imports/paths:

### 1. `src/components/SuminagashiCanvas.tsx` (485 lines)

The full component. See [suminagashi-canvas.md](suminagashi-canvas.md) — contains the complete source.

### 2. `src/components/Dock.tsx` (73 lines)

The toolbar. See [dock.md](dock.md) — contains the complete source.

### 3. CSS sections (from `src/app/globals.css`)

The Dock, Hint, Title, and PrivacyLink CSS classes. See [css.md](css.md) — contains the relevant CSS blocks.

## Integration

### Page wiring (`src/app/page.tsx`)

```tsx
"use client";

import { useRef } from "react";
import SuminagashiCanvas from "@/components/SuminagashiCanvas";
import type { SuminagashiCanvasHandle } from "@/components/SuminagashiCanvas";
import Dock from "@/components/Dock";

export default function Home() {
  const canvasRef = useRef<SuminagashiCanvasHandle>(null);

  return (
    <>
      <SuminagashiCanvas ref={canvasRef} />
      <Dock canvasRef={canvasRef} />
    </>
  );
}
```

The canvas must be the first child — it renders a `position: fixed; inset: 0` div.

### Layout (`src/app/layout.tsx`)

The body needs `overflow: hidden` and the paper background:

```css
html, body {
  height: 100%;
  overflow: hidden;
  background: var(--paper); /* #efeae0 */
}
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
  cursor: crosshair;
  touch-action: none;
}
```

### Font

The original uses `Shippori Mincho` (Google Fonts). Configure in `layout.tsx`:

```tsx
import { Shippori_Mincho } from "next/font/google";

const shippori = Shippori_Mincho({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-shippori-mincho",
});
```

Then `font-family: var(--font-shippori-mincho), "Yu Mincho", "Hiragino Mincho ProN", serif;` on `body`. You can swap this for any serif font.

## Simulation Parameters

All in `CONFIG` at the top of `SuminagashiCanvas.tsx`:

| Param | Default | Effect |
|-------|---------|--------|
| `SIM_RES` | 256 | Velocity grid base size (longer edge). Higher = finer flow, more GPU cost. |
| `DYE_RES` | 1280 | Dye grid base size. Higher = sharper ink edges. |
| `PRESSURE_ITER` | 28 | Jacobi iterations for pressure solve. More = more incompressible, more GPU cost. |
| `VEL_DISSIPATION` | 0.16 | How fast velocity decays. Lower = ink swirls longer. |
| `DYE_DISSIPATION` | 0.07 | How fast dye fades. Lower = ink stays visible longer. |
| `CURL` | 14 | Vorticity confinement strength. Higher = more turbulent swirls. |
| `SPLAT_RADIUS` | 0.0026 | Base radius of ink/velocity splats. |
| `SPLAT_FORCE` | 5200 | Velocity force multiplier on pointer drag. |

## Imperative Handle (`SuminagashiCanvasHandle`)

The canvas exposes three methods via `useImperativeHandle`:

```ts
interface SuminagashiCanvasHandle {
  setInkMode(mode: string): void;    // "cycle" | "sumi" | "ai" | "shu" | "matsuba"
  toggleAutoFlow(): boolean;         // returns new state
  triggerWash(): void;               // accelerates dye dissipation
}
```

The Dock calls these when the user clicks ink buttons, the auto-flow toggle, or the wash button.

## Interaction Model

- **Pointer down** — drops ink at cursor, draws while dragging, picks next ink color (cycle mode)
- **Pointer move** — applies velocity to the fluid in the drag direction
- **Spacebar** — drops random ink
- **X key** — triggers wash (accelerated dye dissipation)
- **Auto-flow** — after 3s of idle, automatically drops random ink every ~2.6-6.5s and creates stirring vortices every ~0.7-1.6s. Togglable via Dock.
- **Reduced motion** — when `(prefers-reduced-motion: reduce)` matches, auto-stir is disabled and auto-drop intervals are longer (~6.5s)

## Ink Colors

Defined as `THREE.Color` values:

```ts
const INKS = {
  sumi:    new THREE.Color("#1a1a1f"),  // 墨 — ink black
  ai:      new THREE.Color("#16407a"),  // 藍 — indigo
  shu:     new THREE.Color("#c8372d"),  // 朱 — vermilion
  matsuba: new THREE.Color("#2e6e52"),  // 松葉 — pine green
};
const PAPER = new THREE.Color("#efeae0");  // washi paper
```

## GPU Pipeline (per frame)

The simulation loop in `step(dt)` runs these passes in order:

1. **Curl** — compute velocity curl → `curlRT`
2. **Vorticity** — apply vorticity confinement force → velocity
3. **Divergence** — compute velocity divergence → `divergeRT`
4. **Clear pressure** — partial clear at 0.8
5. **Pressure solve** — Jacobi iteration × `PRESSURE_ITER`
6. **Gradient subtract** — subtract pressure gradient from velocity
7. **Advect velocity** — semi-Lagrangian advection with dissipation
8. **Advect dye** — same, with wash-boosted dissipation

The display pass (after step) applies Beer-Lambert absorption, paper texture noise, and vignette.

## Adapters

### Project without Next.js

The components are framework-agnostic aside from:
- `"use client"` directive — remove if not using React Server Components
- `forwardRef` / `useImperativeHandle` — standard React, works anywhere
- `@/components/` imports — fix to your project's path aliases

### Project without Tailwind

Replace the Dock/Hint/Title CSS classes with your own styling approach. The simulation code has zero CSS dependency.

### Without TypeScript

Strip types. The shader code and Three.js API calls are plain JS.

## Known Limitations

- **Single canvas** — the `fixed inset-0` div and `window.innerWidth/Height` sizing assume the canvas occupies the full viewport. For an embedded version, replace with container-relative sizing.
- **No WebGL context loss handling** — add a `webglcontextlost` / `webglcontextrestored` listener for robustness in production.
- **Pixel ratio capped at 2** — `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Adjust for 3× displays.
- **No touch multi-pointer** — only tracks the first pointer. Pinch/multi-finger gestures are ignored.
