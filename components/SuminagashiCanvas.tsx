"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

const CONFIG = {
  SIM_RES: 256,
  DYE_RES: 1280,
  PRESSURE_ITER: 28,
  VEL_DISSIPATION: 0.16,
  DYE_DISSIPATION: 0.07,
  CURL: 14,
  SPLAT_RADIUS: 0.0026,
  SPLAT_FORCE: 5200,
} as const;

const INKS: Record<string, THREE.Color> = {
  sumi: new THREE.Color("#1a1a1f"),
  ai: new THREE.Color("#16407a"),
  shu: new THREE.Color("#c8372d"),
  matsuba: new THREE.Color("#2e6e52"),
};

const INK_KEYS = Object.keys(INKS);
const PAPER = new THREE.Color("#5c5c5c");

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function inkAbsorption(c: THREE.Color, strength: number): THREE.Vector3 {
  const e = 0.012;
  return new THREE.Vector3(
    -Math.log(Math.max(c.r, e)) * strength,
    -Math.log(Math.max(c.g, e)) * strength,
    -Math.log(Math.max(c.b, e)) * strength
  );
}

interface DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  texel: THREE.Vector2;
  swap(): void;
  resize(w: number, h: number): void;
}

function makeRT(renderer: THREE.WebGLRenderer, w: number, h: number): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    depthBuffer: false,
  });
}

function doubleFBO(renderer: THREE.WebGLRenderer, w: number, h: number): DoubleFBO {
  return {
    read: makeRT(renderer, w, h),
    write: makeRT(renderer, w, h),
    texel: new THREE.Vector2(1 / w, 1 / h),
    swap() {
      const tmp = this.read;
      this.read = this.write;
      this.write = tmp;
    },
    resize(nw: number, nh: number) {
      this.read.setSize(nw, nh);
      this.write.setSize(nw, nh);
      this.texel.set(1 / nw, 1 / nh);
    },
  };
}

function blit(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  quad: THREE.Mesh,
  mat: THREE.ShaderMaterial,
  target: THREE.WebGLRenderTarget | null
) {
  quad.material = mat;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
}

function shaderMaterial(
  frag: string,
  uniforms: Record<string, THREE.IUniform>
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: frag,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
}

export interface SuminagashiCanvasHandle {
  setInkMode(mode: string): void;
  toggleAutoFlow(): boolean;
  triggerWash(): void;
}

const SuminagashiCanvas = forwardRef<SuminagashiCanvasHandle>(function SuminagashiCanvas(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    inkMode: "cycle" as string,
    inkCycleIdx: 0,
    autoFlow: true,
    washing: 0,
    lastInteraction: 0,
    hintHidden: false,
    pointer: {
      down: false,
      moved: false,
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      color: INKS.sumi,
    },
    lastT: 0,
    nextDrop: 1200,
    nextStir: 2600,
    animFrameId: 0,
  });

  useImperativeHandle(ref, () => ({
    setInkMode(mode: string) {
      stateRef.current.inkMode = mode;
    },
    toggleAutoFlow() {
      stateRef.current.autoFlow = !stateRef.current.autoFlow;
      return stateRef.current.autoFlow;
    },
    triggerWash() {
      stateRef.current.washing = 1.6;
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    scene.add(quad);

    function simSizes() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const simW = w > h ? CONFIG.SIM_RES : Math.round((CONFIG.SIM_RES * w) / h);
      const simH = w > h ? Math.round((CONFIG.SIM_RES * h) / w) : CONFIG.SIM_RES;
      const dyeW = w > h ? CONFIG.DYE_RES : Math.round((CONFIG.DYE_RES * w) / h);
      const dyeH = w > h ? Math.round((CONFIG.DYE_RES * h) / w) : CONFIG.DYE_RES;
      return { sw: simW, sh: simH, dw: dyeW, dh: dyeH };
    }

    let S = simSizes();
    const velocity = doubleFBO(renderer, S.sw, S.sh);
    const pressure = doubleFBO(renderer, S.sw, S.sh);
    const dye = doubleFBO(renderer, S.dw, S.dh);
    const curlRT = makeRT(renderer, S.sw, S.sh);
    const divergeRT = makeRT(renderer, S.sw, S.sh);

    const advectMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity, uSource; uniform vec2 uTexel; uniform float uDt, uDissipation; void main() { vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexel; vec4 result = texture2D(uSource, coord); gl_FragColor = result / (1.0 + uDissipation * uDt); }`,
      { uVelocity: { value: null }, uSource: { value: null }, uTexel: { value: new THREE.Vector2() }, uDt: { value: 0 }, uDissipation: { value: 0 } }
    );

    const splatMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float uAspect, uRadius; uniform vec2 uPoint; uniform vec3 uColor; void main() { vec2 p = vUv - uPoint; p.x *= uAspect; vec3 splat = exp(-dot(p, p) / uRadius) * uColor; gl_FragColor = vec4(texture2D(uTarget, vUv).rgb + splat, 1.0); }`,
      { uTarget: { value: null }, uAspect: { value: 1 }, uRadius: { value: 0.001 }, uPoint: { value: new THREE.Vector2() }, uColor: { value: new THREE.Vector3() } }
    );

    const curlMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 uTexel; void main() { float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).y; float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).y; float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).x; float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).x; gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0); }`,
      { uVelocity: { value: null }, uTexel: { value: new THREE.Vector2() } }
    );

    const vorticityMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity, uCurl; uniform vec2 uTexel; uniform float uCurlStrength, uDt; void main() { float L = texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x; float R = texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x; float B = texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x; float T = texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x; float C = texture2D(uCurl, vUv).x; vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); force /= length(force) + 0.0001; force *= uCurlStrength * C; force.y *= -1.0; vec2 vel = texture2D(uVelocity, vUv).xy + force * uDt; gl_FragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0); }`,
      { uVelocity: { value: null }, uCurl: { value: null }, uTexel: { value: new THREE.Vector2() }, uCurlStrength: { value: 0 }, uDt: { value: 0 } }
    );

    const divergeMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 uTexel; void main() { float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x; float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x; float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y; float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y; vec2 C = texture2D(uVelocity, vUv).xy; if (vUv.x - uTexel.x < 0.0) L = -C.x; if (vUv.x + uTexel.x > 1.0) R = -C.x; if (vUv.y - uTexel.y < 0.0) B = -C.y; if (vUv.y + uTexel.y > 1.0) T = -C.y; gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }`,
      { uVelocity: { value: null }, uTexel: { value: new THREE.Vector2() } }
    );

    const pressureMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uPressure, uDivergence; uniform vec2 uTexel; void main() { float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x; float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x; float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x; float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x; float div = texture2D(uDivergence, vUv).x; gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0); }`,
      { uPressure: { value: null }, uDivergence: { value: null }, uTexel: { value: new THREE.Vector2() } }
    );

    const gradientMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uPressure, uVelocity; uniform vec2 uTexel; void main() { float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x; float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x; float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x; float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x; vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B); gl_FragColor = vec4(vel, 0.0, 1.0); }`,
      { uPressure: { value: null }, uVelocity: { value: null }, uTexel: { value: new THREE.Vector2() } }
    );

    const clearMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; uniform float uValue; void main() { gl_FragColor = uValue * texture2D(uTexture, vUv); }`,
      { uTexture: { value: null }, uValue: { value: 0.8 } }
    );

    const displayMat = shaderMaterial(
      `precision highp float; varying vec2 vUv; uniform sampler2D uDye; uniform vec2 uTexel; uniform vec3 uPaper; uniform float uTime;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
      void main() { float fiber = noise(vUv * 420.0) * 0.028 + noise(vUv * 180.0) * 0.022 + noise(vUv * 60.0) * 0.018; vec3 A = texture2D(uDye, vUv).rgb; vec3 col = uPaper * exp(-A) + fiber; vec2 uv2 = vUv * (1.0 - vUv.yx); float vign = pow(uv2.x * uv2.y * 15.0, 0.18); col *= 0.92 + 0.08 * vign; gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0); }`,
      { uDye: { value: null }, uTexel: { value: new THREE.Vector2() }, uPaper: { value: new THREE.Vector3(PAPER.r, PAPER.g, PAPER.b) }, uTime: { value: 0 } }
    );

    function splatVelocity(x: number, y: number, fx: number, fy: number, radiusMul: number) {
      splatMat.uniforms.uTarget.value = velocity.read.texture;
      splatMat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
      splatMat.uniforms.uPoint.value.set(x, y);
      splatMat.uniforms.uRadius.value = CONFIG.SPLAT_RADIUS * radiusMul;
      splatMat.uniforms.uColor.value.set(fx, fy, 0);
      blit(renderer, scene, camera, quad, splatMat, velocity.write);
      velocity.swap();
    }

    function splatDye(x: number, y: number, absorption: THREE.Vector3, radiusMul: number) {
      splatMat.uniforms.uTarget.value = dye.read.texture;
      splatMat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
      splatMat.uniforms.uPoint.value.set(x, y);
      splatMat.uniforms.uRadius.value = CONFIG.SPLAT_RADIUS * radiusMul;
      splatMat.uniforms.uColor.value.copy(absorption);
      blit(renderer, scene, camera, quad, splatMat, dye.write);
      dye.swap();
    }

    function dropInk(x: number, y: number, color: THREE.Color, strength: number) {
      const abs = inkAbsorption(color, strength * 0.22);
      splatDye(x, y, abs, 1.0);
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 80;
      splatVelocity(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 1.2);
    }

    function currentInkColor(advance: boolean): THREE.Color {
      if (s.inkMode === "cycle") {
        const c = INKS[INK_KEYS[s.inkCycleIdx % INK_KEYS.length]];
        if (advance) s.inkCycleIdx++;
        return c;
      }
      return INKS[s.inkMode] || INKS.sumi;
    }

    function toUV(e: PointerEvent) {
      const r = renderer.domElement.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    }

    function hideHint() {
      if (s.hintHidden) return;
      s.hintHidden = true;
      const hintEl = document.getElementById("hint");
      if (hintEl) hintEl.classList.add("gone");
    }

    const canvas = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      const p = toUV(e);
      s.pointer.down = true;
      s.pointer.x = s.pointer.px = p.x;
      s.pointer.y = s.pointer.py = p.y;
      s.pointer.color = currentInkColor(true);
      dropInk(p.x, p.y, s.pointer.color, 0.6 + Math.random() * 0.3);
      s.lastInteraction = performance.now();
      hideHint();
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = toUV(e);
      s.pointer.px = s.pointer.x;
      s.pointer.py = s.pointer.y;
      s.pointer.x = p.x;
      s.pointer.y = p.y;
      s.pointer.moved = true;
      s.lastInteraction = performance.now();
    };

    const onPointerUp = () => { s.pointer.down = false; };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    function applyPointer() {
      if (!s.pointer.moved) return;
      s.pointer.moved = false;
      const dx = s.pointer.x - s.pointer.px;
      const dy = s.pointer.y - s.pointer.py;
      if (Math.abs(dx) + Math.abs(dy) < 1e-6) return;
      const fx = dx * CONFIG.SPLAT_FORCE;
      const fy = dy * CONFIG.SPLAT_FORCE;
      splatVelocity(s.pointer.x, s.pointer.y, fx, fy, s.pointer.down ? 2.0 : 1.4);
      if (s.pointer.down) {
        const speed = Math.min(Math.hypot(dx, dy) * 30, 1);
        splatDye(s.pointer.x, s.pointer.y, inkAbsorption(s.pointer.color, 0.06 + speed * 0.12), 0.9);
      }
    }

    function autoUpdate(now: number, dt: number) {
      if (!s.autoFlow) return;
      const idle = now - s.lastInteraction > 3000;

      s.nextDrop -= dt * 1000;
      if (idle && s.nextDrop <= 0) {
        const x = 0.14 + Math.random() * 0.72;
        const y = 0.16 + Math.random() * 0.68;
        const c = INKS[INK_KEYS[Math.floor(Math.random() * INK_KEYS.length)]];
        dropInk(x, y, c, 0.8 + Math.random() * 0.7);

        if (Math.random() < 0.3) {
          const c2 = INKS[INK_KEYS[Math.floor(Math.random() * INK_KEYS.length)]];
          const x2 = Math.min(Math.max(x + (Math.random() - 0.5) * 0.16, 0.08), 0.92);
          const y2 = Math.min(Math.max(y + (Math.random() - 0.5) * 0.16, 0.08), 0.92);
          setTimeout(() => dropInk(x2, y2, c2, 0.5 + Math.random() * 0.4), 220 + Math.random() * 300);
        }
        s.nextDrop = (reducedMotion ? 6500 : 2600) + Math.random() * 2600;
      }

      s.nextStir -= dt * 1000;
      if (!reducedMotion && s.nextStir <= 0) {
        const t = now * 0.00012;
        const cx = 0.5 + Math.sin(t * 1.7) * 0.3;
        const cy = 0.5 + Math.cos(t * 1.1) * 0.3;
        const a = t * 6.0 + Math.random() * 1.5;
        splatVelocity(cx, cy, Math.cos(a) * 130, Math.sin(a) * 130, 14);
        s.nextStir = 700 + Math.random() * 900;
      }
    }

    function step(dt: number) {
      curlMat.uniforms.uVelocity.value = velocity.read.texture;
      curlMat.uniforms.uTexel.value.copy(velocity.texel);
      blit(renderer, scene, camera, quad, curlMat, curlRT);

      vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMat.uniforms.uCurl.value = curlRT.texture;
      vorticityMat.uniforms.uTexel.value.copy(velocity.texel);
      vorticityMat.uniforms.uCurlStrength.value = CONFIG.CURL;
      vorticityMat.uniforms.uDt.value = dt;
      blit(renderer, scene, camera, quad, vorticityMat, velocity.write);
      velocity.swap();

      divergeMat.uniforms.uVelocity.value = velocity.read.texture;
      divergeMat.uniforms.uTexel.value.copy(velocity.texel);
      blit(renderer, scene, camera, quad, divergeMat, divergeRT);

      clearMat.uniforms.uTexture.value = pressure.read.texture;
      clearMat.uniforms.uValue.value = 0.8;
      blit(renderer, scene, camera, quad, clearMat, pressure.write);
      pressure.swap();

      pressureMat.uniforms.uDivergence.value = divergeRT.texture;
      pressureMat.uniforms.uTexel.value.copy(velocity.texel);
      for (let i = 0; i < CONFIG.PRESSURE_ITER; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        blit(renderer, scene, camera, quad, pressureMat, pressure.write);
        pressure.swap();
      }

      gradientMat.uniforms.uPressure.value = pressure.read.texture;
      gradientMat.uniforms.uVelocity.value = velocity.read.texture;
      gradientMat.uniforms.uTexel.value.copy(velocity.texel);
      blit(renderer, scene, camera, quad, gradientMat, velocity.write);
      velocity.swap();

      advectMat.uniforms.uVelocity.value = velocity.read.texture;
      advectMat.uniforms.uSource.value = velocity.read.texture;
      advectMat.uniforms.uTexel.value.copy(velocity.texel);
      advectMat.uniforms.uDt.value = dt;
      advectMat.uniforms.uDissipation.value = CONFIG.VEL_DISSIPATION;
      blit(renderer, scene, camera, quad, advectMat, velocity.write);
      velocity.swap();

      const dyeDis = CONFIG.DYE_DISSIPATION + (s.washing > 0 ? 2.4 : 0);
      advectMat.uniforms.uVelocity.value = velocity.read.texture;
      advectMat.uniforms.uSource.value = dye.read.texture;
      advectMat.uniforms.uTexel.value.copy(dye.texel);
      advectMat.uniforms.uDissipation.value = dyeDis;
      blit(renderer, scene, camera, quad, advectMat, dye.write);
      dye.swap();

      if (s.washing > 0) s.washing -= dt;
    }

    function frame(now: number) {
      s.animFrameId = requestAnimationFrame(frame);
      let dt = (now - s.lastT) / 1000;
      s.lastT = now;
      dt = Math.min(dt, 1 / 30);
      if (dt <= 0) return;

      applyPointer();
      autoUpdate(now, dt);
      step(dt);

      displayMat.uniforms.uDye.value = dye.read.texture;
      displayMat.uniforms.uTexel.value.copy(dye.texel);
      displayMat.uniforms.uTime.value = now * 0.001;
      blit(renderer, scene, camera, quad, displayMat, null);
    }

    function seed() {
      dropInk(0.38, 0.58, INKS.sumi, 0.75);
      setTimeout(() => dropInk(0.62, 0.42, INKS.ai, 0.6), 450);
      setTimeout(() => dropInk(0.5, 0.62, INKS.shu, 0.5), 950);
    }

    const hintTimer = setTimeout(hideHint, 9000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        dropInk(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, currentInkColor(true), 0.8 + Math.random() * 0.6);
        hideHint();
      }
      if (e.key === "x" || e.key === "X") s.washing = 1.6;
    };
    window.addEventListener("keydown", onKeyDown);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      S = simSizes();
      velocity.resize(S.sw, S.sh);
      pressure.resize(S.sw, S.sh);
      curlRT.setSize(S.sw, S.sh);
      divergeRT.setSize(S.sw, S.sh);
      dye.resize(S.dw, S.dh);
    };
    window.addEventListener("resize", onResize);

    s.lastT = performance.now();
    seed();
    s.animFrameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.animFrameId);
      clearTimeout(hintTimer);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0" />;
});

export default SuminagashiCanvas;
