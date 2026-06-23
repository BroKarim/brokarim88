# CSS — Styles for Suminagashi Overlay Components

All classes below go in your global stylesheet (e.g. `src/app/globals.css`). These are Tailwind v4 compatible but use plain CSS — drop them in any `@layer base` or global scope.

## CSS Custom Properties (Theme Tokens)

```css
:root {
  --paper: #efeae0;
  --sumi: #1a1a1f;
  --ai: #16407a;
  --shu: #c8372d;
  --matsuba: #2e6e52;
  --ink-line: rgba(26, 26, 31, 0.18);
}
```

If using Tailwind v4, also register them in `@theme inline`:

```css
@theme inline {
  --color-paper: var(--paper);
  --color-sumi: var(--sumi);
  --color-ai: var(--ai);
  --color-shu: var(--shu);
  --color-matsuba: var(--matsuba);
  --color-ink-line: var(--ink-line);
}
```

## Body/Canvas Base

```css
html, body {
  height: 100%;
  overflow: hidden;
  background: var(--paper);
}
body {
  font-family: var(--font-shippori-mincho), "Yu Mincho", "Hiragino Mincho ProN", serif;
  color: var(--sumi);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
  cursor: crosshair;
  touch-action: none;
}
```

## Title Overlay

```css
.title {
  position: fixed;
  top: 28px;
  left: 26px;
  z-index: 5;
  pointer-events: none;
  writing-mode: vertical-rl;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.title h1 {
  font-size: clamp(26px, 3.4vw, 40px);
  font-weight: 700;
  letter-spacing: 0.42em;
  color: var(--sumi);
}

.title .sub {
  font-size: 11px;
  letter-spacing: 0.34em;
  color: rgba(26, 26, 31, 0.55);
  padding-top: 6px;
}

.title::after {
  content: "";
  display: block;
  width: 1px;
  align-self: stretch;
  background: linear-gradient(to bottom, var(--ink-line), transparent);
  margin-right: 2px;
}
```

## Hint Overlay

```css
.hint {
  position: fixed;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.46em;
  text-indent: 0.46em;
  color: rgba(26, 26, 31, 0.5);
  transition: opacity 1.6s;
}

.hint.gone {
  opacity: 0;
}
```

## Dock / Toolbar

```css
.dock {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 12px 22px;
  background: rgba(239, 234, 224, 0.62);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
}

.inks {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ink {
  appearance: none;
  border: none;
  cursor: pointer;
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.25) inset,
    0 1px 3px rgba(26, 26, 31, 0.25);
  transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.4);
}

.ink:hover {
  transform: scale(1.18);
}

.ink::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: border-color 0.25s;
}

.ink[aria-pressed="true"]::after {
  border-color: rgba(26, 26, 31, 0.55);
}

.ink .lbl {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(26, 26, 31, 0.6);
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
  font-family: inherit;
}

.ink:hover .lbl,
.ink[aria-pressed="true"] .lbl {
  opacity: 1;
}

/* Ink color buttons — conic gradient + radial gradients */

.ink-cycle {
  background: conic-gradient(var(--sumi), var(--ai), var(--matsuba), var(--shu), var(--sumi));
}

.ink-sumi {
  background: radial-gradient(circle at 35% 30%, #3a3a42, var(--sumi));
}

.ink-ai {
  background: radial-gradient(circle at 35% 30%, #2c62ab, var(--ai));
}

.ink-shu {
  background: radial-gradient(circle at 35% 30%, #e25a4c, var(--shu));
}

.ink-matsuba {
  background: radial-gradient(circle at 35% 30%, #4c9374, var(--matsuba));
}

/* Action buttons (auto-flow toggle, wash) */

.act {
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  letter-spacing: 0.18em;
  color: rgba(26, 26, 31, 0.78);
  padding: 4px 2px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.act::after {
  content: "";
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: -2px;
  height: 1px;
  background: var(--sumi);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s;
}

.act:hover::after {
  transform: scaleX(1);
}

.act[aria-pressed="false"] {
  color: rgba(26, 26, 31, 0.38);
}
```

## Privacy Link

```css
.pp-link {
  position: fixed;
  right: 22px;
  bottom: 24px;
  z-index: 5;
  font-size: 10px;
  letter-spacing: 0.24em;
  color: rgba(26, 26, 31, 0.4);
  text-decoration: none;
  font-family: inherit;
  transition: color 0.25s;
}

.pp-link:hover {
  color: rgba(26, 26, 31, 0.75);
}
```

## Responsive

```css
@media (max-width: 640px) {
  .title {
    top: 20px;
    left: 16px;
  }
  .pp-link {
    display: none;
  }
  .dock {
    gap: 12px;
    padding: 10px 14px;
  }
  .act {
    font-size: 11px;
    letter-spacing: 0.12em;
  }
  .inks {
    gap: 11px;
  }
}
```
