/**
 * StashSaarthi — Campus Empty State Delight (Task 110)
 * Customized campus-specific graphic, instant ₹50 welcome discount voucher,
 * and 1-tap booking trigger for zero-booking students.
 */

import React, { useState } from "react";
import {
  Sparkles,
  Ticket,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  PackageCheck,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function CampusEmptyStateDelight() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === "hi";
  const [copiedCode, setCopiedCode] = useState(false);

  const campusName =
    user?.college_or_locality || (isHi ? "आईआईटी कानपुर / काकादेव हब" : "IIT Kanpur / Kakadeo Hub");

  const promoCode = "WELCOME50";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(true);
    toast.success(
      isHi
        ? "कूपन कोड 'WELCOME50' कॉपी किया गया! (₹50 छूट)"
        : "Coupon code 'WELCOME50' copied! (₹50 OFF)",
    );
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClaimAndBook = (service: "stash" | "kitchen" | "spaces" = "stash") => {
    handleCopyCode();
    // Dispatch custom event to open main booking modal with promo code pre-applied
    window.dispatchEvent(
      new CustomEvent("stashsaarthi:open-booking", {
        detail: {
          service,
          promoCode,
          discountAmount: 50,
          userEmail: user?.email,
          userName: user?.name,
        },
      }),
    );
  };

  return (
    <div className="my-4 p-5 sm:p-6 bg-gradient-to-b from-[#0D1317] via-black/80 to-[#0A0E12] border border-emerald-500/30 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-5">
      {/* Decorative Background Glows */}
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Campus-Specific Header Badge & Graphic */}
      <div className="space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Building2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>{campusName}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Campus Graphic Icon Cluster */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 animate-pulse" />
          <div className="relative text-3xl">🎒</div>
          <div className="absolute -bottom-1 -right-1 text-base bg-emerald-500 text-black rounded-full p-1 shadow">
            🎓
          </div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          {isHi ? "अभी तक कोई सक्रिय बुकिंग नहीं है!" : "No Active Bookings Yet!"}
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          {isHi
            ? `${campusName} के छात्रों के लिए विशेष शून्य-दलाली लगेज स्टोरेज, पीजी रूम और शुद्ध होमस्टाइल टिफिन सेवा उपलब्ध है।`
            : `Welcome to StashSaarthi at ${campusName}! Unlock zero-brokerage luggage storage, room stay, and homestyle meals with student safety cover.`}
        </p>
      </div>

      {/* 2. Instant ₹50 Welcome Discount Card */}
      <div className="relative z-10 bg-gradient-to-r from-emerald-950/60 via-black/80 to-cyan-950/60 border border-emerald-400/40 rounded-xl p-4 text-left shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {isHi ? "₹50 वेलकम डिस्काउंट कार्ड" : "₹50 Campus Welcome Discount"}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {isHi ? "तत्काल लागू" : "Instant Active"}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {isHi
                  ? "पहली बुकिंग पर पाएँ FLAT ₹50 की छूट! (कोड: WELCOME50)"
                  : "Get FLAT ₹50 OFF on your first storage or meal booking!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:border-emerald-500/40 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>WELCOME50</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Tap Claim & Book Button */}
        <Button
          type="button"
          onClick={() => handleClaimAndBook("stash")}
          className="w-full mt-3 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs"
        >
          <Zap className="h-4 w-4 fill-black" />
          <span>
            {isHi
              ? "₹50 छूट के साथ तुरंत बुक करें (मात्र ₹250/माह)"
              : "Claim Discount & Book Luggage Stash for ₹250/mo"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 3. Quick Vertical Explore Options */}
      <div className="grid grid-cols-3 gap-2 relative z-10 text-left pt-1">
        <button
          type="button"
          onClick={() => handleClaimAndBook("stash")}
          className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all group"
        >
          <div className="text-base mb-1">🎒</div>
          <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors">
            {isHi ? "स्टैश स्टोरेज" : "Luggage Stash"}
          </p>
          <p className="text-[9px] text-slate-400">{isHi ? "₹250/माह से" : "From ₹250/mo"}</p>
        </button>

        <button
          type="button"
          onClick={() => handleClaimAndBook("kitchen")}
          className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all group"
        >
          <div className="text-base mb-1">🍲</div>
          <p className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors">
            {isHi ? "किचन टिफिन" : "Kitchen Meal"}
          </p>
          <p className="text-[9px] text-slate-400">{isHi ? "₹90/थॉली" : "From ₹90/meal"}</p>
        </button>

        <button
          type="button"
          onClick={() => handleClaimAndBook("spaces")}
          className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all group"
        >
          <div className="text-base mb-1">🏠</div>
          <p className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">
            {isHi ? "स्पेस रूम" : "Room Stay"}
          </p>
          <p className="text-[9px] text-slate-400">{isHi ? "शून्य ब्रोकरेज" : "Zero Brokerage"}</p>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>
          {isHi
            ? "100% सत्यापित सीनियर होस्ट एवं ₹10,000 सुरक्षा कवर गारंटीड"
            : "100% Verified Premium Hosts & ₹10,000 Safety Cover Guarantee"}
        </span>
      </div>
    </div>
  );
}
