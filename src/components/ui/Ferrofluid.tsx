import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Ferrofluid.css";

export interface FerrofluidProps {
  colors?: string[];
  backgroundColor?: string;
  glow?: number;
  shimmer?: number;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mouseInteraction?: boolean;
  fluidity?: number;
  scale?: number;
  sharpness?: number;
  speed?: number;
  turbulence?: number;
  rimWidth?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uFluidity;
uniform float uScale;
uniform float uSharpness;
uniform float uSpeed;
uniform float uTurbulence;
uniform float uRimWidth;
uniform float uGlow;
uniform float uShimmer;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
  float f = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 3; i++) {
    f += amp * snoise(p * freq);
    p += vec3(0.35, 0.42, 0.17);
    amp *= 0.5;
    freq *= 2.0;
  }
  return f;
}

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect * uScale;
  vec2 mouse = (uMouse - 0.5) * aspect * uScale;

  float t = uTime * uSpeed;

  vec2 toMouse = uv - mouse;
  float mouseDist = length(toMouse);
  float mouseInfluence = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;
  vec2 magneticPull = normalize(toMouse + vec2(0.0001)) * mouseInfluence * (0.5 + 0.5 * sin(t * 2.0));

  vec2 warpedUv = uv + magneticPull * uFluidity;

  float n1 = fbm(vec3(warpedUv * uTurbulence, t * 0.4));
  float n2 = fbm(vec3((warpedUv + vec2(n1, -n1) * 0.5) * uTurbulence * 1.5, t * 0.6 + 1.2));
  
  float angle = atan(warpedUv.y, warpedUv.x);
  float spikes = sin(angle * 8.0 + t) * sin(angle * 14.0 - t * 0.5) * 0.15;
  float fluidField = length(warpedUv + vec2(n2, n1) * 0.4) - 0.45 + spikes + n1 * 0.35 - mouseInfluence * 0.4;

  float sharp = clamp(uSharpness, 0.5, 10.0);
  float mask = smoothstep(0.1, -0.1 * sharp, fluidField);
  
  float rim = smoothstep(uRimWidth, 0.0, abs(fluidField)) * mask;
  float core = smoothstep(0.2, -0.4, fluidField);

  vec3 col = mix(uColor1, uColor2, clamp(n1 * 1.2 + 0.3, 0.0, 1.0));
  col = mix(col, uColor3, clamp(n2 * 1.5 + rim * 0.6, 0.0, 1.0));
  col = mix(col, uColor4, clamp(core * 0.8, 0.0, 1.0));

  float specular = pow(clamp(1.0 - fluidField * 1.8 + n2 * 0.4, 0.0, 1.0), 4.0) * mask;
  float shimmer = sin(uv.x * 20.0 + uv.y * 20.0 + t * 3.0) * 0.5 + 0.5;
  
  col += vec3(specular) * uShimmer * (0.6 + 0.4 * shimmer);
  col += col * rim * uGlow * 1.5;

  float alpha = mask * (0.8 + 0.2 * rim);
  
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0.06, 0.72, 0.51];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export function Ferrofluid({
  colors = ["#10B981", "#00F5A0", "#06B6D4", "#1E3A8A"],
  glow = 2.2,
  shimmer = 1.4,
  mouseStrength = 1.2,
  mouseRadius = 0.32,
  mouseDampening = 0.12,
  mouseInteraction = true,
  fluidity = 0.12,
  scale = 1.4,
  sharpness = 2.8,
  speed = 0.35,
  turbulence = 0.8,
  rimWidth = 0.22,
  mixBlendMode = "screen",
  className = "",
  style = {},
}: FerrofluidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<Program | null>(null);

  const mouseRef = useRef<{ current: [number, number]; target: [number, number] }>({
    current: [0.5, 0.5],
    target: [0.5, 0.5],
  });

  // Keep colors updated
  useEffect(() => {
    if (!programRef.current) return;
    const uniforms = programRef.current.uniforms as Record<string, { value: number | number[] | Float32Array }>;
    const c1 = hexToRgb(colors[0] || "#10B981");
    const c2 = hexToRgb(colors[1] || "#00F5A0");
    const c3 = hexToRgb(colors[2] || "#06B6D4");
    const c4 = hexToRgb(colors[3] || "#1E3A8A");

    if (uniforms["uColor1"]) uniforms["uColor1"].value = c1;
    if (uniforms["uColor2"]) uniforms["uColor2"].value = c2;
    if (uniforms["uColor3"]) uniforms["uColor3"].value = c3;
    if (uniforms["uColor4"]) uniforms["uColor4"].value = c4;
    if (uniforms["uGlow"]) uniforms["uGlow"].value = glow;
    if (uniforms["uShimmer"]) uniforms["uShimmer"].value = shimmer;
    if (uniforms["uMouseStrength"])
      uniforms["uMouseStrength"].value = mouseInteraction ? mouseStrength : 0;
    if (uniforms["uMouseRadius"]) uniforms["uMouseRadius"].value = mouseRadius;
    if (uniforms["uFluidity"]) uniforms["uFluidity"].value = fluidity;
    if (uniforms["uScale"]) uniforms["uScale"].value = scale;
    if (uniforms["uSharpness"]) uniforms["uSharpness"].value = sharpness;
    if (uniforms["uSpeed"]) uniforms["uSpeed"].value = speed;
    if (uniforms["uTurbulence"]) uniforms["uTurbulence"].value = turbulence;
    if (uniforms["uRimWidth"]) uniforms["uRimWidth"].value = rimWidth;
  }, [
    colors,
    glow,
    shimmer,
    mouseStrength,
    mouseRadius,
    mouseInteraction,
    fluidity,
    scale,
    sharpness,
    speed,
    turbulence,
    rimWidth,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: Renderer | null = null;
    let animationId: number;

    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        dpr: 1,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);

    const c1 = hexToRgb(colors[0] || "#10B981");
    const c2 = hexToRgb(colors[1] || "#00F5A0");
    const c3 = hexToRgb(colors[2] || "#06B6D4");
    const c4 = hexToRgb(colors[3] || "#1E3A8A");

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uMouse: { value: [0.5, 0.5] },
        uMouseStrength: { value: mouseInteraction ? mouseStrength : 0 },
        uMouseRadius: { value: mouseRadius },
        uFluidity: { value: fluidity },
        uScale: { value: scale },
        uSharpness: { value: sharpness },
        uSpeed: { value: speed },
        uTurbulence: { value: turbulence },
        uRimWidth: { value: rimWidth },
        uGlow: { value: glow },
        uShimmer: { value: shimmer },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
        uColor4: { value: c4 },
      },
    });

    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!container || !renderer) return;
      const width = Math.min(container.clientWidth || 300, 1400);
      const height = Math.min(container.clientHeight || 300, 700);
      renderer.setSize(width, height);
      const uniforms = program.uniforms as Record<string, { value: number | number[] | Float32Array }>;
      if (uniforms["uResolution"]) {
        uniforms["uResolution"].value = [width, height];
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !mouseInteraction || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        mouseRef.current.target = [x, y];
        ticking = false;
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!container || !mouseInteraction || !e.touches[0] || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!container || !e.touches[0]) return;
        const rect = container.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) / rect.width;
        const y = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
        mouseRef.current.target = [x, y];
        ticking = false;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let lastTime = performance.now();

    const update = (now: number) => {
      animationId = requestAnimationFrame(update);
      if (!isVisible || document.hidden) return; // Skip rendering if offscreen or hidden tab

      const delta = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      const uniforms = program.uniforms as Record<string, { value: number | number[] | Float32Array }>;
      if (uniforms["uTime"]) {
        uniforms["uTime"].value += delta;
      }

      // Smooth mouse lerp
      const damp = Math.min(1.0, mouseDampening * 60 * delta);
      mouseRef.current.current[0] +=
        (mouseRef.current.target[0] - mouseRef.current.current[0]) * damp;
      mouseRef.current.current[1] +=
        (mouseRef.current.target[1] - mouseRef.current.current[1]) * damp;
      if (uniforms["uMouse"]) {
        uniforms["uMouse"].value = mouseRef.current.current;
      }

      renderer?.render({ scene: mesh });
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPower = typeof navigator !== "undefined" && (
      (navigator as any).hardwareConcurrency < 4 || 
      (navigator as any).connection?.saveData === true
    );

    if (prefersReducedMotion || isLowPower) {
      // Just render once and skip the animation loop to save battery
      renderer?.render({ scene: mesh });
    } else {
      animationId = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      programRef.current = null;
      if (gl) {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ferrofluid-container ${className}`}
      style={{
        mixBlendMode,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="ferrofluid-canvas" />
    </div>
  );
}

export default Ferrofluid;
