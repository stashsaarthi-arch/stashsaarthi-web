import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { isLowDataModeEnabled } from "@/context/LowDataContext";
import { usePersona } from "@/context/PersonaContext";
import { CARD_3D_TOKENS } from "@/lib/designTokens";

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  tiltCoefficient?: number;
  maxTilt?: number;
  glareEnable?: boolean;
  glareOpacity?: number;
  disabled?: boolean;
  as?: React.ElementType;
}

export const Card3D = React.memo(function Card3D({
  children,
  className,
  tiltCoefficient = CARD_3D_TOKENS.tiltCoefficient,
  maxTilt = CARD_3D_TOKENS.maxTiltDeg,
  glareEnable = true,
  glareOpacity = CARD_3D_TOKENS.glareMaxOpacity,
  disabled = false,
  as: Component = "div",
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...restProps
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const personaContext = usePersona();
  const role = personaContext?.role || "student";
  const isHost = role === "host";

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLowData, setIsLowData] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  // Detect touch viewports (<768px or touch pointer) & low data mode to preserve locked 60-120 FPS
  useEffect(() => {
    const checkTouchAndData = () => {
      const isTouch =
        window.innerWidth < CARD_3D_TOKENS.touchThresholdPx ||
        (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) ||
        (typeof window !== "undefined" && "ontouchstart" in window);
      setIsTouchDevice(isTouch);
      setIsLowData(isLowDataModeEnabled());
    };

    checkTouchAndData();
    window.addEventListener("resize", checkTouchAndData, { passive: true });
    return () => {
      window.removeEventListener("resize", checkTouchAndData);
    };
  }, []);

  const shouldDisable3D = disabled || isTouchDevice || isLowData;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseMove) onMouseMove(e);
      if (shouldDisable3D || !cardRef.current) return;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Calculate relative coordinates from -0.5 to +0.5
        const mouseX = (clientX - rect.left) / rect.width - 0.5;
        const mouseY = (clientY - rect.top) / rect.height - 0.5;

        // Compute GPU 3D rotation
        const effectiveMaxTilt = maxTilt * tiltCoefficient;
        const rotateX = -mouseY * 2 * effectiveMaxTilt;
        const rotateY = mouseX * 2 * effectiveMaxTilt;

        setTransformStyle(
          `perspective(${CARD_3D_TOKENS.perspectivePx}px) rotateX(${rotateX.toFixed(
            2
          )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
        );

        // Specular glare position percentages (0% to 100%)
        const glareX = ((clientX - rect.left) / rect.width) * 100;
        const glareY = ((clientY - rect.top) / rect.height) * 100;
        const distFromCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const dynamicOpacity = Math.min(glareOpacity, distFromCenter * 1.5 * glareOpacity);

        setGlarePosition({
          x: Math.round(glareX),
          y: Math.round(glareY),
          opacity: dynamicOpacity,
        });
      });
    },
    [onMouseMove, shouldDisable3D, maxTilt, tiltCoefficient, glareOpacity]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseEnter) onMouseEnter(e);
      if (!shouldDisable3D) {
        setIsHovered(true);
      }
    },
    [onMouseEnter, shouldDisable3D]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseLeave) onMouseLeave(e);
      setIsHovered(false);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      if (!shouldDisable3D) {
        setTransformStyle(
          `perspective(${CARD_3D_TOKENS.perspectivePx}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
        );
        setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
      }
    },
    [onMouseLeave, shouldDisable3D]
  );

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const glareGradient = isHost
    ? CARD_3D_TOKENS.glareGradients.host
    : CARD_3D_TOKENS.glareGradients.student;

  return (
    <Component
      ref={cardRef}
      className={cn(
        "relative z-10 w-full card-3d-stage",
        shouldDisable3D
          ? "card-3d-disabled transition-all duration-300 ease-out hover:-translate-y-1"
          : "card-3d-wrapper",
        className
      )}
      style={{
        transform: !shouldDisable3D && transformStyle ? transformStyle : undefined,
        transition: isHovered
          ? "transform 0.08s ease-out"
          : `transform ${CARD_3D_TOKENS.resetDurationMs}ms ${CARD_3D_TOKENS.transitionTiming}`,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...restProps}
    >
      {children}

      {glareEnable && !shouldDisable3D && (
        <div
          className={cn(
            "card-3d-glare",
            isHost ? "card-3d-glare-host" : "",
            isHovered && glarePosition.opacity > 0 ? "card-3d-glare-active" : ""
          )}
          style={{
            opacity: glarePosition.opacity,
            backgroundImage: glareGradient,
            ["--glare-x" as string]: `${glarePosition.x}%`,
            ["--glare-y" as string]: `${glarePosition.y}%`,
          }}
          aria-hidden="true"
        />
      )}
    </Component>
  );
});
