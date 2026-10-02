"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    const updatePosition = () => {
      if (cursorRef.current) {
        const isHovering = isHoveringRef.current;
        cursorRef.current.style.transform = `translate3d(${mouseX - (isHovering ? 20 : 8)}px, ${mouseY - (isHovering ? 20 : 8)}px, 0)`;
      }
      ticking = false;
    };

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const shouldHover = !!(
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.closest(".interactive") ||
        target.classList.contains("interactive")
      );

      if (shouldHover !== isHoveringRef.current) {
        isHoveringRef.current = shouldHover;
        if (cursorRef.current) {
          if (shouldHover) {
            cursorRef.current.style.width = "40px";
            cursorRef.current.style.height = "40px";
            cursorRef.current.style.backgroundColor = "rgba(16, 185, 129, 0)";
            cursorRef.current.style.border = "1px solid rgba(16, 185, 129, 0.5)";
          } else {
            cursorRef.current.style.width = "16px";
            cursorRef.current.style.height = "16px";
            cursorRef.current.style.backgroundColor = "rgba(16, 185, 129, 0.8)";
            cursorRef.current.style.border = "none";
          }
          // Request position update immediately to adjust the center offset
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(updatePosition);
          }
        }
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] items-center justify-center transition-all duration-150 ease-out"
      style={{
        width: "16px",
        height: "16px",
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        border: "none",
        willChange: "transform",
      }}
    />
  );
};
