"use client";

import { motion } from "framer-motion";
import React from "react";

export const FadeUp = ({ children, stagger = 0.15 }: { children: React.ReactNode, stagger?: number }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
          delayChildren: 0.1,
        }
      }
    }}
    className="will-change-transform relative z-10 w-full flex flex-col py-24 md:py-40 max-w-7xl mx-auto px-6 lg:px-12"
  >
    {React.Children.map(children, (child) => {
      // Don't wrap if it's not a valid element to avoid messing up text nodes, though usually FadeUp wraps sections.
      if (!React.isValidElement(child)) return child;
      return (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50, scale: 0.98 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                duration: 0.8, 
                ease: [0.175, 0.885, 0.32, 1.275] // Premium SkillUI easing
              } 
            }
          }}
        >
          {child}
        </motion.div>
      );
    })}
  </motion.div>
);
