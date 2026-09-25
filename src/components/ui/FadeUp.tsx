"use client";

import { motion } from "framer-motion";
import React from "react";

export const FadeUp = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
    className="will-change-transform relative z-10 w-full flex flex-col py-24 md:py-40 max-w-7xl mx-auto px-6 lg:px-12"
  >
    {children}
  </motion.div>
);
