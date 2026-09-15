import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ToastNotificationCard, ToastType } from "@/components/ui/ToastNotification";
import { isAudioMuted, isExplicitClickActive } from "@/lib/audio";

export type { ToastType };

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
  undo?:
    | {
        label?: string;
        onUndo: () => void;
      }
    | undefined;
  view?:
    | {
        label?: string;
        onView: () => void;
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
      undo: options?.undo,
      view: options?.view,
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

    return id;
  },
  success: (title: ReactNode, options?: ToastOptions) => toast.show(title, "success", options),
  error: (title: ReactNode, options?: ToastOptions) => toast.show(title, "error", options),
  info: (title: ReactNode, options?: ToastOptions) => toast.show(title, "info", options),
  warning: (title: ReactNode, options?: ToastOptions) => toast.show(title, "warning", options),
  loading: (title: ReactNode, options?: ToastOptions) => toast.show(title, "loading", options),
  undo: (title: ReactNode, undo: { label?: string; onUndo: () => void }, options?: Omit<ToastOptions, "undo">) =>
    toast.show(title, "warning", { ...options, undo }),
  view: (title: ReactNode, view: { label?: string; onView: () => void }, options?: Omit<ToastOptions, "view">) =>
    toast.show(title, "info", { ...options, view }),
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
        <ToastNotificationCard
          key={t.id}
          id={t.id}
          title={t.title}
          type={t.type}
          description={t.description}
          duration={t.duration}
          action={t.action}
          undo={t.undo}
          view={t.view}
          cancel={t.cancel}
          icon={t.icon}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

