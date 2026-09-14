import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { isLowDataModeEnabled } from "@/context/LowDataContext";
import { MAGNETIC_BUTTON_TOKENS } from "@/lib/designTokens";
import { playHeroCtaClick, playPop } from "@/lib/audio";

export interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxDisplacement?: number;
  magneticRadius?: number;
  disabled?: boolean;
  showGlow?: boolean;
  soundEffect?: boolean;
  as?: React.ElementType;
  onPullStateChange?: (isPulled: boolean) => void;
}

export const MagneticButton = React.memo(function MagneticButton({
  children,
  className,
  strength = MAGNETIC_BUTTON_TOKENS.magneticStrength,
  maxDisplacement = MAGNETIC_BUTTON_TOKENS.maxDisplacementPx,
  magneticRadius = MAGNETIC_BUTTON_TOKENS.magneticRadiusPx,
  disabled = false,
  showGlow = true,
  soundEffect = true,
  as: Component = "div",
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onPullStateChange,
  ...restProps
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const personaContext = usePersona();
  const role = personaContext?.role || "student";
  const isHost = role === "host";

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLowData, setIsLowData] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPulled, setIsPulled] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>("");

  // Detect touch devices (<768px, hover:none) and low-data mode for locked 60-120 FPS
  useEffect(() => {
    const checkTouchAndData = () => {
      const isTouch =
        (typeof window !== "undefined" && window.innerWidth < MAGNETIC_BUTTON_TOKENS.touchThresholdPx) ||
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

  const shouldDisableMagnetic = disabled || isTouchDevice || isLowData;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseMove) onMouseMove(e);
      if (shouldDisableMagnetic || !containerRef.current) return;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance <= magneticRadius) {
          // Calculate displacement with magnetic pull strength & clamp limits
          let pullX = distanceX * strength;
          let pullY = distanceY * strength;

          pullX = Math.max(-maxDisplacement, Math.min(maxDisplacement, pullX));
          pullY = Math.max(-maxDisplacement, Math.min(maxDisplacement, pullY));

          setTransformStyle(`translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0) scale3d(1.03, 1.03, 1.03)`);

          if (!isPulled) {
            setIsPulled(true);
            if (onPullStateChange) onPullStateChange(true);
          }
        } else if (isPulled) {
          setTransformStyle("translate3d(0px, 0px, 0) scale3d(1, 1, 1)");
          setIsPulled(false);
          if (onPullStateChange) onPullStateChange(false);
        }
      });
    },
    [onMouseMove, shouldDisableMagnetic, strength, maxDisplacement, magneticRadius, isPulled, onPullStateChange]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseEnter) onMouseEnter(e);
      if (!shouldDisableMagnetic) {
        setIsHovered(true);
      }
    },
    [onMouseEnter, shouldDisableMagnetic]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseLeave) onMouseLeave(e);
      setIsHovered(false);
      setIsPulled(false);
      if (onPullStateChange) onPullStateChange(false);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      if (!shouldDisableMagnetic) {
        setTransformStyle("translate3d(0px, 0px, 0) scale3d(1, 1, 1)");
      }
    },
    [onMouseLeave, shouldDisableMagnetic, onPullStateChange]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (soundEffect) {
        playHeroCtaClick();
      }
      if (onClick) onClick(e);
    },
    [onClick, soundEffect]
  );

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const glowClass = isHost
    ? "magnetic-button-glow-host shadow-[0_0_25px_rgba(245,158,11,0.45)]"
    : "magnetic-button-glow-student shadow-[0_0_25px_rgba(16,185,129,0.45)]";

  return (
    <Component
      ref={containerRef}
      className={cn(
        "magnetic-button-wrapper relative inline-block cursor-pointer",
        shouldDisableMagnetic ? "magnetic-button-disabled" : "",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...restProps}
    >
      <div
        className={cn(
          "magnetic-button-stage relative inline-flex items-center justify-center rounded-xl",
          isPulled ? "magnetic-button-pulled" : "",
          showGlow && isPulled ? glowClass : ""
        )}
        style={{
          transform: !shouldDisableMagnetic && transformStyle ? transformStyle : undefined,
          transition: isHovered
            ? MAGNETIC_BUTTON_TOKENS.pullTransitionCss
            : MAGNETIC_BUTTON_TOKENS.resetTransitionCss,
          ...style,
        }}
      >
        {children}
      </div>
    </Component>
  );
});

MagneticButton.displayName = "MagneticButton";
