import React from "react";
import { usePersona } from "@/context/PersonaContext";
import { useMobileKeyboardCollision } from "@/lib/useMobileKeyboardCollision";
import { getMobileKeyboardCollisionTokens } from "@/lib/designTokens";
import { Keyboard, ShieldCheck, CheckCircle2 } from "lucide-react";

export interface MobileKeyboardCollisionContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showAuditBadge?: boolean | undefined;
  roleOverride?: "student" | "host" | undefined;
}

/**
 * MobileKeyboardCollisionContainer Primitive
 * Ensures input fields automatically scroll into view with comfortable headroom (100px)
 * when virtual keyboard expands on mobile browsers.
 */
export const MobileKeyboardCollisionContainer: React.FC<MobileKeyboardCollisionContainerProps> = ({
  children,
  showAuditBadge = false,
  roleOverride,
  className = "",
  ...props
}) => {
  const { role: activePersona } = usePersona();
  const currentRole = roleOverride || activePersona;
  const { isKeyboardOpen, keyboardHeight, activeElement } = useMobileKeyboardCollision();
  const tokens = getMobileKeyboardCollisionTokens(currentRole);

  return (
    <div
      className={`mobile-keyboard-collision-container prevent-keyboard-collision ${className}`}
      data-keyboard-open={isKeyboardOpen ? "true" : "false"}
      data-keyboard-height={keyboardHeight}
      {...props}
    >
      {children}
      {showAuditBadge && (
        <KeyboardCollisionAuditBadge
          roleOverride={currentRole}
          isKeyboardOpen={isKeyboardOpen}
          keyboardHeight={keyboardHeight}
          activeTagName={activeElement?.tagName?.toLowerCase()}
        />
      )}
    </div>
  );
};

export interface KeyboardCollisionAuditBadgeProps {
  roleOverride?: "student" | "host" | undefined;
  isKeyboardOpen?: boolean | undefined;
  keyboardHeight?: number | undefined;
  activeTagName?: string | undefined;
}

export const KeyboardCollisionAuditBadge: React.FC<KeyboardCollisionAuditBadgeProps> = ({
  roleOverride,
  isKeyboardOpen = false,
  keyboardHeight = 0,
  activeTagName,
}) => {
  const { role: activePersona } = usePersona();
  const currentRole = roleOverride || activePersona;
  const tokens = getMobileKeyboardCollisionTokens(currentRole);

  return (
    <div
      className={`fixed bottom-16 right-4 z-50 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md shadow-lg transition-all ${tokens.persona.badgeBg}`}
      role="status"
      aria-label="Mobile Keyboard Collision Status"
    >
      <Keyboard className="h-4 w-4 text-emerald-400" />
      <span>{isKeyboardOpen ? `Keyboard Active (+${keyboardHeight}px)` : "Keyboard Protection Active"}</span>
      {activeTagName && <span className="font-mono text-[10px] opacity-80">&lt;{activeTagName}&gt;</span>}
      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 opacity-80" />
    </div>
  );
};

export const MobileKeyboardCollision = MobileKeyboardCollisionContainer;
