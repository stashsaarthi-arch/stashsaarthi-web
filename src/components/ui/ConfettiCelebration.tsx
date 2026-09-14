import { useEffect, useRef, useCallback } from "react";
import {
  getConfettiCelebrationTokens,
  ConfettiTriggerType,
  CONFETTI_CELEBRATION_TOKENS,
} from "@/lib/designTokens";
import { usePersona } from "@/context/PersonaContext";
import { isLowDataModeEnabled } from "@/context/LowDataContext";
import {
  playPaymentConfirmation,
  playSuccessChime,
  playCounterIncrement,
} from "@/lib/audio";

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: "square" | "circle" | "ribbon" | "star";
  opacity: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;
}

export interface ConfettiCelebrationOptions {
  triggerType?: ConfettiTriggerType;
  particleCount?: number;
  role?: "student" | "host";
  originX?: number; // 0 to 1 ratio
  originY?: number; // 0 to 1 ratio
  playSound?: boolean;
}

/**
  Imperative helper to launch confetti burst anywhere in the app
 */
let globalConfettiTriggerHandler: ((options?: ConfettiCelebrationOptions) => void) | null = null;

export function fireConfettiCannon(options?: ConfettiCelebrationOptions) {
  if (globalConfettiTriggerHandler) {
    globalConfettiTriggerHandler(options);
  }
}

export interface ConfettiCelebrationProps {
  isActive?: boolean;
  triggerType?: ConfettiTriggerType;
  particleCount?: number;
  role?: "student" | "host";
  onComplete?: () => void;
  className?: string;
  playSound?: boolean;
}

export function ConfettiCelebration({
  isActive = false,
  triggerType = "booking_confirmation",
  particleCount,
  role: roleProp,
  onComplete,
  className = "",
  playSound = true,
}: ConfettiCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const { role: contextRole } = usePersona();
  const activeRole = roleProp || contextRole;

  const launchParticles = useCallback(
    (opts?: ConfettiCelebrationOptions) => {
      if (isLowDataModeEnabled()) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const effectiveRole = opts?.role || activeRole;
      const tokens = getConfettiCelebrationTokens(effectiveRole);
      const effectiveTriggerType = opts?.triggerType || triggerType;
      const typeSpec = tokens.triggerTypes[effectiveTriggerType] || tokens.triggerTypes.booking_confirmation;

      const count =
        opts?.particleCount || particleCount || typeSpec?.count || tokens.particleCount.standard;
      const palette = tokens.palette;

      const width = canvas.width;
      const height = canvas.height;

      const originX = (opts?.originX ?? 0.5) * width;
      const originY = (opts?.originY ?? 0.4) * height;

      // Sound feedback
      if (opts?.playSound ?? playSound) {
        try {
          if (effectiveTriggerType === "booking_confirmation") {
            playPaymentConfirmation();
          } else if (effectiveTriggerType === "host_agreement_signing") {
            playSuccessChime();
          } else {
            playCounterIncrement(5);
          }
        } catch {
          // Audio synthesis fallback
        }
      }

      const shapes: Array<"square" | "circle" | "ribbon" | "star"> = [
        "square",
        "circle",
        "ribbon",
        "star",
      ];

      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.PI * 1.5 + (Math.random() - 0.5) * Math.PI * 0.95; // Upwards cone burst
        const speed = 12 + Math.random() * 22;

        newParticles.push({
          x: originX + (Math.random() - 0.5) * 40,
          y: originY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.28,
          color: palette[Math.floor(Math.random() * palette.length)] || "#10B981",
          shape: shapes[Math.floor(Math.random() * shapes.length)] || "square",
          opacity: 1,
          decay: 0.008 + Math.random() * 0.008,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.08 + Math.random() * 0.1,
        });
      }

      particlesRef.current = newParticles;
    },
    [activeRole, particleCount, playSound, triggerType]
  );

  // Register global handler
  useEffect(() => {
    globalConfettiTriggerHandler = launchParticles;
    return () => {
      globalConfettiTriggerHandler = null;
    };
  }, [launchParticles]);

  // Handle active prop trigger
  useEffect(() => {
    if (isActive) {
      launchParticles();
    }
  }, [isActive, launchParticles]);

  // Canvas size sync & animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const ctx = canvas.getContext("2d");
      if (ctx && particlesRef.current.length > 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const remainingParticles: ConfettiParticle[] = [];

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          if (!p) continue;

          p.x += p.vx;
          p.y += p.vy;
          p.vy += CONFETTI_CELEBRATION_TOKENS.gravity;
          p.vx *= CONFETTI_CELEBRATION_TOKENS.drag;
          p.vy *= CONFETTI_CELEBRATION_TOKENS.drag;
          p.rotation += p.rotationSpeed;
          p.wobble += p.wobbleSpeed;
          p.opacity -= p.decay;

          if (p.opacity > 0 && p.y < window.innerHeight + 50) {
            remainingParticles.push(p);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;

            const wobbleX = Math.sin(p.wobble) * (p.size * 0.4);

            if (p.shape === "square") {
              ctx.fillRect(-p.size / 2 + wobbleX, -p.size / 2, p.size, p.size);
            } else if (p.shape === "circle") {
              ctx.beginPath();
              ctx.arc(wobbleX, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === "ribbon") {
              ctx.fillRect(-p.size / 3 + wobbleX, -p.size * 1.2, p.size / 1.5, p.size * 2.2);
            } else if (p.shape === "star") {
              ctx.beginPath();
              for (let s = 0; s < 5; s++) {
                ctx.lineTo(
                  Math.cos(((18 + s * 72) * Math.PI) / 180) * (p.size * 0.6) + wobbleX,
                  Math.sin(((18 + s * 72) * Math.PI) / 180) * (p.size * 0.6)
                );
                ctx.lineTo(
                  Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.25) + wobbleX,
                  Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.25)
                );
              }
              ctx.closePath();
              ctx.fill();
            }

            ctx.restore();
          }
        }

        particlesRef.current = remainingParticles;

        if (remainingParticles.length === 0 && onComplete) {
          onComplete();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div
      className={`confetti-canvas-container ${className}`}
      data-persona={activeRole}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="confetti-canvas" />
    </div>
  );
}
