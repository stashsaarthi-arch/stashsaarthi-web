import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, Loader2, X, RotateCcw, Eye } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { getToastNotificationTokens, TOAST_NOTIFICATION_TOKENS } from "@/lib/designTokens";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastActionSpec {
  label: string;
  onClick: () => void;
}

export interface ToastUndoSpec {
  label?: string;
  onUndo: () => void;
}

export interface ToastViewSpec {
  label?: string;
  onView: () => void;
}

export interface ToastNotificationProps {
  id: string;
  title: React.ReactNode;
  type?: ToastType | undefined;
  description?: React.ReactNode | undefined;
  duration?: number | undefined;
  action?: ToastActionSpec | undefined;
  undo?: ToastUndoSpec | undefined;
  view?: ToastViewSpec | undefined;
  cancel?: { label: string; onClick?: (() => void) | undefined } | undefined;
  icon?: React.ReactNode | undefined;
  onDismiss: (id: string) => void;
}

export const ToastNotificationCard: React.FC<ToastNotificationProps> = ({
  id,
  title,
  type = "info",
  description,
  duration = 4000,
  action,
  undo,
  view,
  cancel,
  icon,
  onDismiss,
}) => {
  const { role } = usePersona();
  const tokens = getToastNotificationTokens(role);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = TOAST_NOTIFICATION_TOKENS.types[type] || TOAST_NOTIFICATION_TOKENS.types.info;

  useEffect(() => {
    if (type === "loading" || !duration || duration <= 0) return;

    const interval = 40;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            onDismiss(id);
            return 0;
          }
          return prev - step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, type, isHovered, id, onDismiss]);

  const renderIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />;
      case "warning":
        return <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />;
      case "loading":
        return <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative overflow-hidden flex flex-col toast-glassmorphism-card text-slate-100 ${typeConfig.border} ${typeConfig.glowShadow} rounded-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="pt-0.5">{renderIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white leading-snug">{title}</div>
          {description && <div className="text-xs text-slate-300 mt-0.5 leading-normal">{description}</div>}

          {/* Actionable Buttons */}
          <div className="mt-2.5 flex items-center flex-wrap gap-2">
            {undo && (
              <button
                type="button"
                onClick={() => {
                  undo.onUndo();
                  onDismiss(id);
                }}
                className="toast-action-undo-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{undo.label || (role === "host" ? tokens.actions.undoLabelHi : tokens.actions.undoLabelEn)}</span>
              </button>
            )}

            {view && (
              <button
                type="button"
                onClick={() => {
                  view.onView();
                  onDismiss(id);
                }}
                className="toast-action-view-btn"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{view.label || (role === "host" ? tokens.actions.viewLabelHi : tokens.actions.viewLabelEn)}</span>
              </button>
            )}

            {action && (
              <button
                type="button"
                onClick={() => {
                  action.onClick();
                  onDismiss(id);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border ${tokens.accent.btnClass}`}
              >
                {action.label}
              </button>
            )}

            {cancel && (
              <button
                type="button"
                onClick={() => {
                  cancel.onClick?.();
                  onDismiss(id);
                }}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {cancel.label}
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Close notification"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown Progress Bar */}
      {type !== "loading" && duration && duration > 0 ? (
        <div className="h-1 w-full bg-white/5 overflow-hidden">
          <div
            className={`h-full ${typeConfig.progressBg} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
};
