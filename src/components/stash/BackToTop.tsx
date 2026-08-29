import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";

import { smoothScrollTo } from "./legal";

/**
 * Floating back-to-top button that appears after scrolling 600px.
 * Positioned on the left side to avoid conflicts with WhatsApp FAB on the right.
 * Persona-adaptive accent colors.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { role } = usePersona();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHost = role === "host";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={() => smoothScrollTo("top")(undefined as any)}
          aria-label="Back to top"
          className={`fixed bottom-6 left-5 z-50 grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md shadow-lg transition-colors active:scale-90 ${
            isHost
              ? "border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 shadow-amber-500/20"
              : "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 shadow-emerald-500/20"
          }`}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
