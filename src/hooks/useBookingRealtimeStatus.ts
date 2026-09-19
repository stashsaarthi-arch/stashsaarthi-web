/**
 * StashSaarthi — Live Booking Realtime Status Hook (Task 111)
 * Listens to Supabase Realtime channels & local state events for dynamic lifecycle state updates:
 * Item Received ➔ In Secure Locker ➔ Ready for Retrieval ➔ Completed
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type BookingLifecycleState =
  | "item_received"
  | "in_secure_locker"
  | "ready_for_retrieval"
  | "completed";

export interface LifecycleStepInfo {
  state: BookingLifecycleState;
  labelEn: string;
  labelHi: string;
  badgeStyle: string;
  icon: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const LIFECYCLE_STEPS: Record<BookingLifecycleState, LifecycleStepInfo> = {
  item_received: {
    state: "item_received",
    labelEn: "Item Received",
    labelHi: "आइटम प्राप्त हुआ",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10",
    icon: "📦",
    descriptionEn: "Item verified & handed over to Verified PG Owner Host at Hub Node",
    descriptionHi: "हब नोड पर सीनियर होस्ट द्वारा आइटम प्राप्त व सत्यापित",
  },
  in_secure_locker: {
    state: "in_secure_locker",
    labelEn: "In Secure Locker",
    labelHi: "सुरक्षित लॉकर में सील",
    badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10",
    icon: "🔒",
    descriptionEn: "Sealed inside climate-controlled laser lock vault",
    descriptionHi: "लेजर सील लॉक युक्त सुरक्षित स्टोरेज में रखा गया",
  },
  ready_for_retrieval: {
    state: "ready_for_retrieval",
    labelEn: "Ready for Retrieval",
    labelHi: "पिकअप हेतु तैयार",
    badgeStyle: "bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20 animate-pulse",
    icon: "⚡",
    descriptionEn: "Prepped at exit bay — Present QR pass for instant pickup",
    descriptionHi: "पिकअप बे पर तैयार — त्वरित पिकअप हेतु QR पास दिखाएं",
  },
  completed: {
    state: "completed",
    labelEn: "Handed Over",
    labelHi: "सफलतापूर्वक प्राप्त",
    badgeStyle: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    icon: "✅",
    descriptionEn: "Handed over safely to verified student owner",
    descriptionHi: "सत्यापित छात्र को सुरक्षित सौंप दिया गया",
  },
};

export function getInitialLifecycleState(submittedAt: string, status?: string): BookingLifecycleState {
  if (status === "completed") return "completed";
  const diffMs = Date.now() - new Date(submittedAt).getTime();
  const mins = diffMs / (1000 * 60);

  if (mins < 15) return "item_received";
  if (mins < 60) return "in_secure_locker";
  return "ready_for_retrieval";
}

export function useBookingRealtimeStatus(bookingId: string, initialSubmittedAt: string, currentStatus?: string) {
  const [lifecycleState, setLifecycleState] = useState<BookingLifecycleState>(() =>
    getInitialLifecycleState(initialSubmittedAt, currentStatus)
  );
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);

  useEffect(() => {
    if (!bookingId) return;

    // 1. Subscribe to Supabase Realtime channel
    const channel = supabase
      .channel(`booking-lifecycle-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.new && payload.new["lifecycle_state"]) {
            setLifecycleState(payload.new["lifecycle_state"] as BookingLifecycleState);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsRealtimeActive(true);
        }
      });

    // 2. Listen to custom window status update events (local & offline fallback)
    const handleCustomStatusUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<{ bookingId: string; state: BookingLifecycleState }>;
      if (customEvt.detail && customEvt.detail.bookingId === bookingId) {
        setLifecycleState(customEvt.detail.state);
      }
    };

    window.addEventListener("stashsaarthi:status-update", handleCustomStatusUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("stashsaarthi:status-update", handleCustomStatusUpdate);
    };
  }, [bookingId]);

  return {
    lifecycleState,
    setLifecycleState,
    stepInfo: LIFECYCLE_STEPS[lifecycleState] || LIFECYCLE_STEPS["item_received"],
    isRealtimeActive,
  };
}

/**
 * Utility to trigger status transition for testing or admin node actions.
 */
export function dispatchBookingStatusUpdate(bookingId: string, state: BookingLifecycleState) {
  window.dispatchEvent(
    new CustomEvent("stashsaarthi:status-update", {
      detail: { bookingId, state },
    })
  );
}
