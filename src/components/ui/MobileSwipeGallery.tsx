import { useState, useEffect, useCallback, ReactNode, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMobileSwipeGesture } from "@/hooks/useMobileSwipeGesture";
import { getMobileSwipeGestureTokens } from "@/lib/designTokens";
import { playClick, playPop } from "@/lib/audio";
import { Button } from "./button";

export interface MobileSwipeGalleryProps {
  children: ReactNode[];
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlayIntervalMs?: number;
  enableAutoPlay?: boolean;
  showIndicators?: boolean;
  showNavigationButtons?: boolean;
  showSwipeHint?: boolean;
  className?: string;
  stageClassName?: string;
}

/**
 * MobileSwipeGallery Primitive Component (Task 186)
 * Native touch swipe gestures, inertia snapping physics, drag feedback, and slide indicators for mobile image galleries & carousels.
 */
export const MobileSwipeGallery = memo(function MobileSwipeGallery({
  children,
  activeIndex: externalIndex,
  onIndexChange,
  autoPlayIntervalMs = 5000,
  enableAutoPlay = false,
  showIndicators = true,
  showNavigationButtons = true,
  showSwipeHint = true,
  className = "",
  stageClassName = "",
}: MobileSwipeGalleryProps) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const tokens = getMobileSwipeGestureTokens(role);
  const itemCount = children.length;

  const [internalIndex, setInternalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = externalIndex ?? internalIndex;

  const setIndex = useCallback(
    (newIndex: number) => {
      const clamped = (newIndex + itemCount) % itemCount;
      setInternalIndex(clamped);
      if (onIndexChange) {
        onIndexChange(clamped);
      }
    },
    [itemCount, onIndexChange]
  );

  const nextSlide = useCallback(() => {
    try {
      playClick();
    } catch {
      // Audio safety
    }
    setIndex(currentIndex + 1);
  }, [currentIndex, setIndex]);

  const prevSlide = useCallback(() => {
    try {
      playPop();
    } catch {
      // Audio safety
    }
    setIndex(currentIndex - 1);
  }, [currentIndex, setIndex]);

  // Touch Swipe Gesture Hook
  const { isDragging, dragOffset, touchProps, containerProps } =
    useMobileSwipeGesture({
      onSwipeLeft: nextSlide,
      onSwipeRight: prevSlide,
      enableHaptics: true,
      enableMouseDrag: true,
    });

  // Auto-play interval
  useEffect(() => {
    if (!enableAutoPlay || isPaused || isDragging || itemCount <= 1) return;
    const timer = setInterval(() => {
      setIndex(currentIndex + 1);
    }, autoPlayIntervalMs);
    return () => clearInterval(timer);
  }, [enableAutoPlay, isPaused, isDragging, itemCount, currentIndex, autoPlayIntervalMs, setIndex]);

  if (itemCount === 0) return null;

  return (
    <div
      className={`mobile-swipe-gallery-wrapper relative flex flex-col w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gallery Stage Container */}
      <div
        {...containerProps}
        {...touchProps}
        className={`relative overflow-hidden w-full ${containerProps.className} ${stageClassName}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: dragOffset.x > 0 ? -40 : 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dragOffset.x > 0 ? 40 : -40, scale: 0.98 }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Drag Hint Overlay */}
        {showSwipeHint && itemCount > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300 backdrop-blur-md sm:hidden">
            <Hand className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>{isHi ? "स्वाइप करें" : "Swipe Left/Right"}</span>
          </div>
        )}

        {/* Navigation Buttons (Desktop & Touch) */}
        {showNavigationButtons && itemCount > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous Slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/70 border border-white/15 text-white hover:bg-slate-900 shadow-md cursor-pointer z-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next Slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/70 border border-white/15 text-white hover:bg-slate-900 shadow-md cursor-pointer z-20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Slide Indicator Dots */}
      {showIndicators && itemCount > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {children.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playPop();
                setIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? tokens.persona.activeDotBg
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});
