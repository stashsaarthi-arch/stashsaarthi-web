/**
 * StashSaarthi — Booking Live Status Badge & Lifecycle Stepper (Task 111)
 * Real-time Supabase status badge showing:
 * Item Received ➔ In Secure Locker ➔ Ready for Retrieval
 */

import React from "react";
import {
  useBookingRealtimeStatus,
  dispatchBookingStatusUpdate,
  LIFECYCLE_STEPS,
  type BookingLifecycleState,
} from "@/hooks/useBookingRealtimeStatus";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Radio, ChevronRight } from "lucide-react";

interface BookingLiveStatusBadgeProps {
  bookingId: string;
  submittedAt: string;
  currentStatus?: string | undefined;
  showStepper?: boolean | undefined;
}

const NEXT_STATE: Record<BookingLifecycleState, BookingLifecycleState> = {
  item_received: "in_secure_locker",
  in_secure_locker: "ready_for_retrieval",
  ready_for_retrieval: "completed",
  completed: "item_received",
};

export function BookingLiveStatusBadge({
  bookingId,
  submittedAt,
  currentStatus,
  showStepper = false,
}: BookingLiveStatusBadgeProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const { lifecycleState, stepInfo, isRealtimeActive } = useBookingRealtimeStatus(
    bookingId,
    submittedAt,
    currentStatus,
  );

  const handleAdvanceState = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = NEXT_STATE[lifecycleState];
    dispatchBookingStatusUpdate(bookingId, next);
  };

  return (
    <div className="space-y-2">
      {/* 1. Live Badge Pill */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAdvanceState}
          title={isHi ? "स्थिति बदलने के लिए क्लिक करें (Realtime Demo)" : "Click to simulate realtime status update"}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-all shadow-sm group cursor-pointer ${stepInfo.badgeStyle}`}
        >
          <span className="text-xs">{stepInfo.icon}</span>
          <span>{isHi ? stepInfo.labelHi : stepInfo.labelEn}</span>
          <Radio className="h-3 w-3 animate-pulse text-emerald-400 shrink-0" />
        </button>

        <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          {isRealtimeActive ? "Supabase Channel" : "Realtime Channel"}
        </span>
      </div>

      {/* 2. Optional Stepper Progress Bar */}
      {showStepper && (
        <div className="bg-black/50 border border-white/10 rounded-xl p-3 space-y-2 mt-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              {isHi ? "लाइव कस्टडी ट्रैकिंग" : "Live Custody Lifecycle"}
            </span>
            <button
              type="button"
              onClick={handleAdvanceState}
              className="text-[9px] text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-0.5"
            >
              <span>{isHi ? "अगला चरण रिमोट सिंक" : "Simulate Next Step"}</span>
              <ChevronRight className="h-2.5 w-2.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {/* Step 1: Item Received */}
            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                lifecycleState === "item_received"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-200 font-bold shadow-md shadow-amber-500/10"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-80"
              }`}
            >
              <div className="text-xs">📦</div>
              <p className="text-[10px] leading-tight mt-0.5">
                {isHi ? "आइटम प्राप्त" : "Item Received"}
              </p>
            </div>

            {/* Step 2: In Secure Locker */}
            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                lifecycleState === "in_secure_locker"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-200 font-bold shadow-md shadow-cyan-500/10"
                  : lifecycleState === "ready_for_retrieval" || lifecycleState === "completed"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-80"
                  : "bg-black/40 border-white/5 text-slate-500"
              }`}
            >
              <div className="text-xs">🔒</div>
              <p className="text-[10px] leading-tight mt-0.5">
                {isHi ? "सुरक्षित लॉकर" : "Secure Locker"}
              </p>
            </div>

            {/* Step 3: Ready for Retrieval */}
            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                lifecycleState === "ready_for_retrieval"
                  ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-md shadow-emerald-500/20 animate-pulse"
                  : lifecycleState === "completed"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-black/40 border-white/5 text-slate-500"
              }`}
            >
              <div className="text-xs">⚡</div>
              <p className="text-[10px] leading-tight mt-0.5">
                {isHi ? "पिकअप हेतु तैयार" : "Ready Pick-up"}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-300 pt-1 italic">
            {stepInfo[isHi ? "descriptionHi" : "descriptionEn"]}
          </p>
        </div>
      )}
    </div>
  );
}
