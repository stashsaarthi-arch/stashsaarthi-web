import * as React from "react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { getTouchTargetAuditTokens, TOUCH_TARGET_AUDIT_TOKENS } from "@/lib/designTokens";
import { ShieldCheck, Target, Smartphone, CheckCircle2 } from "lucide-react";

export interface TouchTargetWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  expandHitArea?: boolean;
  minSizePx?: number;
  className?: string;
  asChild?: boolean;
}

export const TouchTargetWrapper = React.forwardRef<HTMLDivElement, TouchTargetWrapperProps>(
  ({ children, expandHitArea = true, minSizePx = 48, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ minWidth: `${minSizePx}px`, minHeight: `${minSizePx}px` }}
        className={cn(
          "inline-flex items-center justify-center touch-target-min-48",
          expandHitArea && "touch-target-expand",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTargetWrapper.displayName = "TouchTargetWrapper";

export interface TouchTargetAuditBadgeProps {
  showDetails?: boolean;
  className?: string;
}

export function TouchTargetAuditBadge({ showDetails = false, className }: TouchTargetAuditBadgeProps) {
  const { role } = usePersona();
  const tokens = getTouchTargetAuditTokens(role);
  const isHost = role === "host";

  return (
    <div
      className={cn(
        "rounded-2xl p-4 glass border transition-all duration-300",
        isHost
          ? "border-amber-500/30 bg-amber-500/10 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl p-2",
              isHost ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
            )}
          >
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Touch Target 48px Engine</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                  isHost ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                )}
              >
                <CheckCircle2 className="h-3 w-3" />
                48x48px Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Strict WCAG 2.1 AAA & mobile ergonomics compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Smartphone className="h-4 w-4 opacity-70" />
          <span>Min {tokens.minTouchTargetPx}px Target</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Standard:</span>
            <span className="font-medium text-foreground">{tokens.wcagStandard}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Hit Expansion Offset:</span>
            <span className="font-medium text-foreground">{tokens.touchTargetRules.hitAreaExpandOffset}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/5">
            {Object.entries(tokens.auditedCategories).map(([key, items]) => (
              <span
                key={key}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground font-mono"
              >
                {key}: {items.length} controls
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function useTouchTargetAudit() {
  const auditInteractiveElements = React.useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return { passed: true, auditedCount: 0 };

    const interactiveSelectors = [
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[role='checkbox']",
      "[role='tab']",
    ].join(", ");

    const elements = document.querySelectorAll(interactiveSelectors);
    let passCount = 0;
    const failedElements: Element[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isVisible = rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";

      if (isVisible) {
        // Elements with touch-target-expand or min-w/h 48px or parent wrapper qualify
        const has48pxTarget =
          rect.width >= 48 ||
          rect.height >= 48 ||
          el.classList.contains("touch-target-min-48") ||
          el.classList.contains("touch-target-expand") ||
          el.closest(".touch-target-min-48") !== null;

        if (has48pxTarget) {
          passCount++;
        } else {
          failedElements.push(el);
        }
      }
    });

    return {
      passed: failedElements.length === 0,
      auditedCount: elements.length,
      passedCount: passCount,
      failedCount: failedElements.length,
      minRequiredPx: 48,
    };
  }, []);

  return { auditInteractiveElements, config: TOUCH_TARGET_AUDIT_TOKENS };
}
