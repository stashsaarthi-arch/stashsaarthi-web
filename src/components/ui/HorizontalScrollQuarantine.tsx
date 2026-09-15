import React from "react";
import { usePersona } from "@/context/PersonaContext";
import { useHorizontalScrollQuarantine } from "@/lib/useHorizontalScrollQuarantine";
import { getHorizontalScrollQuarantineTokens } from "@/lib/designTokens";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export interface ViewportQuarantineContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showAuditBadge?: boolean;
  roleOverride?: "student" | "host";
}

/**
 * ViewportQuarantineContainer primitive
 * Enforces strict viewport containment (`overflow-x: hidden`) across all root layouts to permanently eliminate horizontal micro-wobbles.
 */
export const ViewportQuarantineContainer: React.FC<ViewportQuarantineContainerProps> = ({
  children,
  showAuditBadge = false,
  roleOverride,
  className = "",
  ...props
}) => {
  const { role: activePersona } = usePersona();
  const currentRole = roleOverride || activePersona;
  const { scrollX, isQuarantined } = useHorizontalScrollQuarantine();
  const tokens = getHorizontalScrollQuarantineTokens(currentRole);

  return (
    <div
      className={`root-viewport-quarantine quarantine-safe-wrapper overflow-x-quarantine prevent-horizontal-wobble ${className}`}
      style={{
        maxWidth: tokens.quarantineRules.maxWidth,
        width: tokens.quarantineRules.width,
        overflowX: "hidden",
        position: "relative",
      }}
      data-viewport-quarantined={isQuarantined ? "true" : "false"}
      data-scroll-x={scrollX}
      {...props}
    >
      {children}
      {showAuditBadge && (
        <HorizontalScrollAuditBadge roleOverride={currentRole} scrollX={scrollX} />
      )}
    </div>
  );
};

export interface HorizontalScrollAuditBadgeProps {
  roleOverride?: "student" | "host";
  scrollX?: number;
}

export const HorizontalScrollAuditBadge: React.FC<HorizontalScrollAuditBadgeProps> = ({
  roleOverride,
  scrollX = 0,
}) => {
  const { role: activePersona } = usePersona();
  const currentRole = roleOverride || activePersona;
  const tokens = getHorizontalScrollQuarantineTokens(currentRole);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md shadow-lg transition-all ${tokens.persona.badgeBg}`}
      role="status"
      aria-label="Horizontal Scroll Quarantine Status"
    >
      <ShieldCheck className="h-4 w-4 text-emerald-400" />
      <span>Viewport 100vw Locked</span>
      <CheckCircle2 className="h-3.5 w-3.5 opacity-80" />
      <span className="font-mono text-[10px] opacity-75">({scrollX}px Wobble)</span>
    </div>
  );
};

export const HorizontalScrollQuarantine = ViewportQuarantineContainer;
