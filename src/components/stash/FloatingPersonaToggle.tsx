import { useState, useEffect, memo } from "react";
import { usePersona } from "@/context/PersonaContext";
import { motion, AnimatePresence } from "motion/react";
import { PersonaSwitcher } from "@/components/ui/PersonaSwitcher";

export const FloatingPersonaToggle = memo(function FloatingPersonaToggle() {
  const { role, setRole } = usePersona();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show when scrolled past the Hero section (350px) to keep search input uncluttered
      setVisible(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex pointer-events-auto"
        >
          <PersonaSwitcher
            id="floating-persona-toggle-switcher"
            role={role}
            onRoleChange={setRole}
            variant="standard"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
