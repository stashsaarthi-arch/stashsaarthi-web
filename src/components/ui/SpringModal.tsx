import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { getSpringModalTokens } from "@/lib/designTokens";
import { playPop, playClick } from "@/lib/audio";

export interface SpringModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode | undefined;
  description?: React.ReactNode | undefined;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | undefined;
  showClose?: boolean | undefined;
  className?: string | undefined;
  overlayClassName?: string | undefined;
  persona?: "student" | "host" | undefined;
}

const MAX_WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-full mx-4",
};

export const SpringModalContent: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  title?: React.ReactNode | undefined;
  description?: React.ReactNode | undefined;
  maxWidth?: keyof typeof MAX_WIDTH_MAP | undefined;
  showClose?: boolean | undefined;
  className?: string | undefined;
  persona?: "student" | "host" | undefined;
}> = ({
  children,
  onClose,
  title,
  description,
  maxWidth = "lg",
  showClose = true,
  className,
  persona: personaProp,
}) => {
  const { role } = usePersona();
  const activeRole = personaProp || role;
  const tokens = getSpringModalTokens(activeRole);
  const isHost = activeRole === "host";

  return (
    <motion.div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0, scale: tokens.transformScale.initial, y: tokens.transformY.initial }}
      animate={{ opacity: 1, scale: tokens.transformScale.animate, y: tokens.transformY.animate }}
      exit={{ opacity: 0, scale: tokens.transformScale.exit, y: tokens.transformY.exit }}
      transition={{
        type: "spring",
        stiffness: tokens.springConfig.stiffness,
        damping: tokens.springConfig.damping,
        mass: tokens.springConfig.mass,
      }}
      className={cn(
        "relative z-50 w-full overflow-hidden rounded-3xl border bg-[#0A0D0F]/95 p-6 backdrop-blur-xl shadow-2xl modal-spring-stage",
        MAX_WIDTH_MAP[maxWidth],
        isHost
          ? "border-amber-500/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(245,158,11,0.25)]"
          : "border-emerald-500/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(16,185,129,0.25)]",
        className
      )}
    >
      {/* Top Radiant Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: tokens.personaGlow.topAccent }}
      />

      {/* Header Area */}
      {(title || description) && (
        <div className="mb-4 pr-6 space-y-1">
          {title && (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Close Button */}
      {showClose && (
        <button
          type="button"
          onClick={() => {
            playClick();
            onClose();
          }}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Main Body */}
      <div className="relative">{children}</div>
    </motion.div>
  );
};

export const SpringModal: React.FC<SpringModalProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  maxWidth = "lg",
  showClose = true,
  className,
  overlayClassName,
  persona,
}) => {
  useEffect(() => {
    if (open) {
      playPop();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              playClick();
              onOpenChange(false);
            }}
            className={cn(
              "fixed inset-0 z-40 bg-black/80 backdrop-blur-md modal-spring-overlay",
              overlayClassName
            )}
          />

          {/* Modal Spring Body */}
          <SpringModalContent
            onClose={() => onOpenChange(false)}
            {...(title !== undefined ? { title } : {})}
            {...(description !== undefined ? { description } : {})}
            maxWidth={maxWidth}
            showClose={showClose}
            {...(className !== undefined ? { className } : {})}
            {...(persona !== undefined ? { persona } : {})}
          >
            {children}
          </SpringModalContent>
        </div>
      )}
    </AnimatePresence>
  );
};
