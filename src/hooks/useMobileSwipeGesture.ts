import { useState, useRef, useCallback } from "react";
import { playClick, playPop } from "@/lib/audio";
import { MOBILE_SWIPE_GESTURE_TOKENS } from "@/lib/designTokens";

export type SwipeDirection = "left" | "right" | "up" | "down";

export interface UseMobileSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThresholdPx?: number;
  maxSwipeTimeMs?: number;
  velocityThreshold?: number;
  enableHaptics?: boolean;
  enableMouseDrag?: boolean;
}

export interface UseMobileSwipeGestureReturn {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  touchProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseMove?: (e: React.MouseEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
  };
  containerProps: {
    className: string;
    style: React.CSSProperties;
  };
}

/**
 * Custom React hook for handling touch swipe gestures and mouse drag on mobile galleries & carousels
 * with smooth inertia snapping and haptic audio feedback.
 */
export function useMobileSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThresholdPx = MOBILE_SWIPE_GESTURE_TOKENS.swipeThresholdPx,
  maxSwipeTimeMs = MOBILE_SWIPE_GESTURE_TOKENS.maxSwipeTimeMs,
  velocityThreshold = MOBILE_SWIPE_GESTURE_TOKENS.velocityThreshold,
  enableHaptics = true,
  enableMouseDrag = true,
}: UseMobileSwipeGestureOptions = {}): UseMobileSwipeGestureReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDown = useRef(false);

  const triggerHaptic = useCallback(
    (direction: SwipeDirection) => {
      if (!enableHaptics) return;
      try {
        if (direction === "left") {
          playClick();
        } else if (direction === "right") {
          playPop();
        }
      } catch {
        // Safe fallback if Web Audio API is muted or unavailable
      }
    },
    [enableHaptics]
  );

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPos.current = { x: clientX, y: clientY, time: Date.now() };
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!startPos.current) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleEnd = useCallback(() => {
    if (!startPos.current) return;

    const { x: startX, y: startY, time: startTime } = startPos.current;
    const currentX = startX + dragOffset.x;
    const currentY = startY + dragOffset.y;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const duration = Math.max(1, Date.now() - startTime);

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const velocityX = absX / duration;
    const velocityY = absY / duration;

    let swiped = false;

    // Determine primary axis of swipe (horizontal vs vertical)
    if (absX > absY) {
      if (
        (absX >= swipeThresholdPx || velocityX >= velocityThreshold) &&
        duration <= maxSwipeTimeMs
      ) {
        if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic("left");
          onSwipeLeft();
          swiped = true;
        } else if (deltaX > 0 && onSwipeRight) {
          triggerHaptic("right");
          onSwipeRight();
          swiped = true;
        }
      }
    } else {
      if (
        (absY >= swipeThresholdPx || velocityY >= velocityThreshold) &&
        duration <= maxSwipeTimeMs
      ) {
        if (deltaY < 0 && onSwipeUp) {
          triggerHaptic("up");
          onSwipeUp();
          swiped = true;
        } else if (deltaY > 0 && onSwipeDown) {
          triggerHaptic("down");
          onSwipeDown();
          swiped = true;
        }
      }
    }

    startPos.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    return swiped;
  }, [
    dragOffset,
    swipeThresholdPx,
    maxSwipeTimeMs,
    velocityThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    triggerHaptic,
  ]);

  // Touch Handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleStart(touch.clientX, touch.clientY);
      }
    },
    [handleStart]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onTouchCancel = useCallback(() => {
    startPos.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Mouse Handlers (Desktop drag simulation)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enableMouseDrag) return;
      isMouseDown.current = true;
      handleStart(e.clientX, e.clientY);
    },
    [enableMouseDrag, handleStart]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enableMouseDrag || !isMouseDown.current) return;
      handleMove(e.clientX, e.clientY);
    },
    [enableMouseDrag, handleMove]
  );

  const onMouseUp = useCallback(() => {
    if (!enableMouseDrag || !isMouseDown.current) return;
    isMouseDown.current = false;
    handleEnd();
  }, [enableMouseDrag, handleEnd]);

  const onMouseLeave = useCallback(() => {
    if (!enableMouseDrag || !isMouseDown.current) return;
    isMouseDown.current = false;
    startPos.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, [enableMouseDrag]);

  return {
    isDragging,
    dragOffset,
    touchProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      ...(enableMouseDrag
        ? {
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave,
          }
        : {}),
    },
    containerProps: {
      className: `mobile-swipe-gesture-container ${
        isDragging ? "mobile-swipe-active-drag" : ""
      }`,
      style: {
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
      },
    },
  };
}
