"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
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

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // To center the 16x16 cursor at the mouse point, we subtract 8 from x and y
  return (
    <motion.div
      className={`hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] items-center justify-center transform-gpu`}
      style={{
        backdropFilter: isHovering ? "none" : "blur(4px)",
        willChange: "transform",
      }}
      animate={{
        x: mousePosition.x - (isHovering ? 20 : 8),
        y: mousePosition.y - (isHovering ? 20 : 8),
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? "rgba(16, 185, 129, 0)" : "rgba(16, 185, 129, 0.8)",
        borderColor: isHovering ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0)",
        borderWidth: isHovering ? "1px" : "0px",
        width: isHovering ? "40px" : "16px",
        height: isHovering ? "40px" : "16px",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
};
