import React from "react";
import { ADMIN_DASHBOARD_TOKENS } from "@/lib/designTokens";
import { Activity, ShieldCheck, Database, HardDrive } from "lucide-react";

export interface AdminStatusBadgeProps {
  label: string;
  statusType?: "online" | "synced" | "operational";
  customColor?: "emerald" | "cyan" | "amber" | "violet" | "sky" | "rose";
  pulse?: boolean;
  count?: number | string;
  className?: string;
}

const STATUS_ICONS = {
  online: ShieldCheck,
  synced: Database,
  operational: HardDrive,
};

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  label,
  statusType = "online",
  customColor,
  pulse = true,
  count,
  className = "",
}) => {
  const tokenSpec = ADMIN_DASHBOARD_TOKENS.statusBadges[statusType] || ADMIN_DASHBOARD_TOKENS.statusBadges.online;
  const IconComponent = STATUS_ICONS[statusType] || Activity;

  const activeColor = customColor || tokenSpec.color;

  const colorStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/25",
      dot: "bg-cyan-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/25",
      dot: "bg-amber-400",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/25",
      dot: "bg-violet-400",
    },
    sky: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/25",
      dot: "bg-sky-400",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/25",
      dot: "bg-rose-400",
    },
  };

  const scheme = colorStyles[activeColor] || colorStyles["emerald"]!;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${scheme.border} ${scheme.bg} backdrop-blur-md transition-all ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${scheme.dot} opacity-75 animate-ping`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${scheme.dot}`} />
      </span>
      <IconComponent className={`h-3.5 w-3.5 ${scheme.text}`} />
      <span className={`text-xs font-semibold uppercase tracking-wide ${scheme.text}`}>
        {label}
      </span>
      {count !== undefined && (
        <span
          className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${scheme.bg} border ${scheme.border} ${scheme.text}`}
        >
          {count}
        </span>
      )}
    </div>
  );
};
