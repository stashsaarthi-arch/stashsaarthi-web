"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    const updatePosition = () => {
      if (cursorRef.current) {
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
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.closest(".interactive") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isHovering]);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] items-center justify-center transition-all duration-150 ease-out"
      style={{
        width: isHovering ? "40px" : "16px",
        height: isHovering ? "40px" : "16px",
        backgroundColor: isHovering ? "rgba(16, 185, 129, 0)" : "rgba(16, 185, 129, 0.8)",
        border: isHovering ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
        willChange: "transform",
      }}
    />
  );
};
