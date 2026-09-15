import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, Loader2, X } from "lucide-react";
import { isAudioMuted, isExplicitClickActive } from "@/lib/audio";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastOptions {
  id?: string | undefined;
  description?: ReactNode | undefined;
  duration?: number | undefined;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined;
  cancel?:
    | {
        label: string;
        onClick?: (() => void) | undefined;
      }
    | undefined;
  icon?: ReactNode | undefined;
}

export interface ToastItem extends ToastOptions {
  id: string;
  title: ReactNode;
  type: ToastType;
  createdAt: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let toastsStore: ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toastsStore]));
};

// Web Audio API Micro-Haptics Sound Synthesizer
const playToastChime = (type: ToastType) => {
  if (typeof window === "undefined") return;
  // Strictly gate audio: do NOT play on load or background interval loops, only on explicit user click
  if (isAudioMuted() || !isExplicitClickActive()) return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "success") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Ignore audio context errors if blocked by browser policy
  }
};

export const toast = {
  show: (title: ReactNode, type: ToastType = "info", options?: ToastOptions): string => {
    const id = options?.id || `ss-toast-${Math.random().toString(36).substring(2, 9)}`;
    const duration = options?.duration ?? (type === "error" || type === "loading" ? 6000 : 4000);

    const existingIndex = toastsStore.findIndex((t) => t.id === id);
    const newToast: ToastItem = {
      id,
      title,
      type,
      duration,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
      icon: options?.icon,
      createdAt: Date.now(),
    };

    if (existingIndex > -1) {
      toastsStore[existingIndex] = newToast;
    } else {
      toastsStore = [newToast, ...toastsStore].slice(0, 5); // Keep max 5 visible toasts
    }

    notifyListeners();
    playToastChime(type);

    if (type !== "loading" && duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }

    return id;
  },
  success: (title: ReactNode, options?: ToastOptions) => toast.show(title, "success", options),
  error: (title: ReactNode, options?: ToastOptions) => toast.show(title, "error", options),
  info: (title: ReactNode, options?: ToastOptions) => toast.show(title, "info", options),
  warning: (title: ReactNode, options?: ToastOptions) => toast.show(title, "warning", options),
  loading: (title: ReactNode, options?: ToastOptions) => toast.show(title, "loading", options),
  dismiss: (id?: string) => {
    if (id) {
      toastsStore = toastsStore.filter((t) => t.id !== id);
    } else {
      toastsStore = [];
    }
    notifyListeners();
  },
  promise: async <T,>(
    promise: Promise<T>,
    msgs: { loading: ReactNode; success: ReactNode | ((data: T) => ReactNode); error: ReactNode | ((err: unknown) => ReactNode) }
  ): Promise<T> => {
    const id = toast.loading(msgs.loading);
    try {
      const data = await promise;
      const successMsg = typeof msgs.success === "function" ? msgs.success(data) : msgs.success;
      toast.success(successMsg, { id });
      return data;
    } catch (err) {
      const errorMsg = typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
      toast.error(errorMsg, { id });
      throw err;
    }
  },
};

interface ToastContextType {
  toasts: ToastItem[];
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  dismiss: toast.dismiss,
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>(toastsStore);

  useEffect(() => {
    const listener: ToastListener = (updatedToasts) => {
      setToasts(updatedToasts);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const handleDismiss = useCallback((id?: string) => {
    toast.dismiss(id);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, dismiss: handleDismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={handleDismiss} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[92vw] sm:max-w-md w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast: t, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (t.type === "loading" || !t.duration || t.duration <= 0) return;

    const interval = 50;
    const step = (interval / t.duration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [t.duration, t.type, isHovered]);

  const renderIcon = () => {
    if (t.icon) return t.icon;
    switch (t.type) {
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

  const getBorderColor = () => {
    switch (t.type) {
      case "success":
        return "border-emerald-500/40 shadow-emerald-500/10";
      case "error":
        return "border-rose-500/40 shadow-rose-500/10";
      case "warning":
        return "border-amber-500/40 shadow-amber-500/10";
      case "loading":
        return "border-emerald-500/30 shadow-emerald-500/10";
      case "info":
      default:
        return "border-cyan-500/40 shadow-cyan-500/10";
    }
  };

  const getProgressColor = () => {
    switch (t.type) {
      case "success":
        return "bg-emerald-400";
      case "error":
        return "bg-rose-400";
      case "warning":
        return "bg-amber-400";
      case "loading":
        return "bg-emerald-400";
      case "info":
      default:
        return "bg-cyan-400";
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative overflow-hidden flex flex-col bg-slate-950/95 dark:bg-slate-950/95 text-slate-100 backdrop-blur-xl border ${getBorderColor()} shadow-2xl rounded-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="pt-0.5">{renderIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white leading-snug">{t.title}</div>
          {t.description && <div className="text-xs text-slate-300 mt-0.5 leading-normal">{t.description}</div>}

          {t.action && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  onDismiss();
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors cursor-pointer"
              >
                {t.action.label}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close notification"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {t.type !== "loading" && t.duration && t.duration > 0 ? (
        <div className="h-1 w-full bg-white/5 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
};
