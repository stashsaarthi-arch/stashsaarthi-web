import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { getModalBackdropTokens } from "@/lib/designTokens";
import { playClick } from "@/lib/audio";
import { useScrollLock } from "@/lib/useScrollLock";

export interface ModalBackdropProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
  persona?: "student" | "host";
  zIndex?: number;
  children?: React.ReactNode;
}

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  open = true,
  onClose,
  className,
  persona: personaProp,
  zIndex = 50,
  children,
}) => {
  const { role } = usePersona();
  const activeRole = personaProp || role;
  const tokens = getModalBackdropTokens(activeRole);
  const isHost = activeRole === "host";

  useScrollLock(open);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: tokens.transitionDurationMs / 1000, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        if (onClose) {
          playClick();
          onClose();
        }
      }}
      style={{ zIndex }}
      className={cn(
        "fixed inset-0 backdrop-blur-md bg-black/60 modal-backdrop-overlay",
        isHost ? "modal-backdrop-host" : "modal-backdrop-student",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
