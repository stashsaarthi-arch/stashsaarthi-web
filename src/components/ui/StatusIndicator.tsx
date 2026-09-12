import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { STATUS_TOKENS, StatusType } from "../../lib/designTokens";

export interface StatusIndicatorProps {
  status: StatusType;
  variant?: "badge" | "card" | "dot" | "banner";
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const DEFAULT_ICONS: Record<StatusType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  error: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
};

const VARIANT_CLASSES: Record<StatusType, Record<"badge" | "card" | "banner", string>> = {
  success: {
    badge: "status-badge-success inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
    card: "status-card-success p-4 rounded-xl backdrop-blur-md transition-all duration-300",
    banner: "bg-emerald-950/40 border-y border-emerald-500/30 px-4 py-3 text-emerald-200 text-sm font-medium flex items-center gap-3",
  },
  warning: {
    badge: "status-badge-warning inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
    card: "status-card-warning p-4 rounded-xl backdrop-blur-md transition-all duration-300",
    banner: "bg-amber-950/40 border-y border-amber-500/30 px-4 py-3 text-amber-200 text-sm font-medium flex items-center gap-3",
  },
  error: {
    badge: "status-badge-error inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
    card: "status-card-error p-4 rounded-xl backdrop-blur-md transition-all duration-300",
    banner: "bg-rose-950/40 border-y border-rose-500/30 px-4 py-3 text-rose-200 text-sm font-medium flex items-center gap-3",
  },
  info: {
    badge: "status-badge-info inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
    card: "status-card-info p-4 rounded-xl backdrop-blur-md transition-all duration-300",
    banner: "bg-cyan-950/40 border-y border-cyan-500/30 px-4 py-3 text-cyan-200 text-sm font-medium flex items-center gap-3",
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  variant = "badge",
  title,
  description,
  children,
  icon,
  pulse = false,
  className = "",
}) => {
  const statusIcon = icon ?? DEFAULT_ICONS[status];
  const tokenSpec = STATUS_TOKENS[status];

  if (variant === "dot") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="relative flex h-2.5 w-2.5">
          {pulse && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: tokenSpec.raw }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ backgroundColor: tokenSpec.raw }}
          />
        </span>
        {title && <span className="text-xs font-medium text-slate-200">{title}</span>}
      </span>
    );
  }

  const containerClass = `${VARIANT_CLASSES[status][variant]} ${className}`.trim();

  return (
    <div className={containerClass}>
      <div className="flex items-start gap-2.5">
        {statusIcon}
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-sm leading-tight text-white">{title}</div>}
          {description && <div className="text-xs text-slate-300 mt-0.5 leading-normal">{description}</div>}
          {children}
        </div>
      </div>
    </div>
  );
};
