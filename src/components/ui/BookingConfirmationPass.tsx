import React, { useState } from "react";
import { usePersona } from "../../context/PersonaContext";
import { useLanguage } from "../../context/LanguageContext";
import { getBookingConfirmationPassTokens } from "../../lib/designTokens";
import { playClick, playPop, playSuccessChime } from "../../lib/audio";
import {
  Printer,
  Navigation,
  Share2,
  ShieldCheck,
  MapPin,
  Clock,
  User,
  Package,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from "lucide-react";

export interface BookingDetails {
  passId?: string;
  studentName?: string;
  hostName?: string;
  hostAddress?: string;
  distanceTag?: string;
  storageItem?: string;
  pickupSlot?: string;
  vaultSealCode?: string;
  totalPaid?: string;
  mapsQuery?: string;
  supportWhatsapp?: string;
}

export interface BookingConfirmationPassProps {
  bookingDetails?: BookingDetails;
  onPrint?: () => void;
  onShare?: () => void;
  onDirections?: () => void;
  className?: string;
}

/**
 * BookingConfirmationPass Component (Task 168)
 * Apple Wallet-style digital boarding pass for confirmed bookings featuring:
 * - Curved card container with ticket notch cutouts
 * - Dual-persona accent top header banner & status pill ("CONFIRMED")
 * - Printable vector QR seal matrix & tamper-proof vault code
 * - Verified host address, distance tag, and 1-tap Google Maps directions button
 * - 1-tap PDF Print Pass and WhatsApp sharing triggers
 * - Web Audio sound haptics & bilingual (en/hi) support
 */
export const BookingConfirmationPass: React.FC<BookingConfirmationPassProps> = ({
  bookingDetails,
  onPrint,
  onShare,
  onDirections,
  className = "",
}) => {
  const { role } = usePersona();
  const personaRole = role || "student";
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const passTokens = getBookingConfirmationPassTokens(personaRole);

  const defaultData = passTokens.defaultBooking;

  const [copied, setCopied] = useState(false);

  const data = {
    passId: bookingDetails?.passId || defaultData.passId,
    studentName: bookingDetails?.studentName || defaultData.studentName,
    hostName: bookingDetails?.hostName || defaultData.hostName,
    hostAddress:
      bookingDetails?.hostAddress ||
      (isHindi ? defaultData.hostAddressHi : defaultData.hostAddressEn),
    distanceTag:
      bookingDetails?.distanceTag ||
      (isHindi ? defaultData.distanceTagHi : defaultData.distanceTagEn),
    storageItem:
      bookingDetails?.storageItem ||
      (isHindi ? defaultData.storageItemHi : defaultData.storageItemEn),
    pickupSlot:
      bookingDetails?.pickupSlot ||
      (isHindi ? defaultData.pickupSlotHi : defaultData.pickupSlotEn),
    vaultSealCode: bookingDetails?.vaultSealCode || defaultData.vaultSealCode,
    totalPaid: bookingDetails?.totalPaid || defaultData.totalPaid,
    mapsQuery: bookingDetails?.mapsQuery || defaultData.mapsQuery,
    supportWhatsapp:
      bookingDetails?.supportWhatsapp || defaultData.supportWhatsapp,
  };

  const handlePrintPass = () => {
    playSuccessChime();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDirections = () => {
    playClick();
    if (onDirections) {
      onDirections();
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        data.mapsQuery
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = () => {
    playPop();
    if (onShare) {
      onShare();
    } else {
      const shareText = `🎟️ My StashSaarthi Digital StashPass is ready!\nPass ID: ${data.passId}\nVault Seal: ${data.vaultSealCode}\nHost: ${data.hostName}\nAddress: ${data.hostAddress}\n\nBook micro-storage @ ₹300/bag/mo: https://stashsaarthi.in`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyPassId = () => {
    playClick();
    navigator.clipboard.writeText(data.passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Apple Wallet Boarding Pass Card */}
      <div
        className={`printable-stash-pass booking-pass-card bg-gradient-to-b ${passTokens.accent.bgGradient} border ${passTokens.accent.borderGlow} text-slate-100 p-0 relative`}
      >
        {/* Ticket Notch Cutouts */}
        <div className="pass-notch-cutout-left no-print" />
        <div className="pass-notch-cutout-right no-print" />

        {/* Top Header Banner */}
        <div
          className={`bg-gradient-to-r ${passTokens.accent.topBannerGradient} p-4 sm:p-5 text-slate-950 flex items-center justify-between font-extrabold relative overflow-hidden`}
        >
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest opacity-90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {isHindi
                ? passTokens.header.passTypeHi
                : passTokens.header.passTypeEn}
            </div>
            <div className="text-base sm:text-lg tracking-tight font-black mt-0.5">
              {passTokens.header.issuer}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-950/90 text-emerald-400 font-bold border border-emerald-400/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHindi ? "सत्यापित" : "CONFIRMED"}
          </span>
        </div>

        {/* Pass Details Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Pass ID & Barcode Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                {isHindi ? "पास आईडी" : "PASS IDENTIFIER"}
              </span>
              <button
                onClick={handleCopyPassId}
                className="text-lg font-mono font-bold tracking-wider text-emerald-400 hover:underline flex items-center gap-1.5"
                title="Click to copy Pass ID"
              >
                {data.passId}
                {copied && (
                  <span className="text-xs text-emerald-300">
                    ({isHindi ? "कॉपी हुआ" : "Copied!"})
                  </span>
                )}
              </button>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                {isHindi ? "बीमा कवर" : "INSURANCE COVER"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                {isHindi
                  ? passTokens.header.sealBadgeHi
                  : passTokens.header.sealBadgeEn}
              </span>
            </div>
          </div>

          {/* Student & Host Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {isHindi ? "छात्र का नाम" : "STUDENT NAME"}
              </span>
              <div className="font-bold text-sm sm:text-base mt-0.5">
                {data.studentName}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {isHindi ? "वरिष्ठ होस्ट" : "SENIOR HOST"}
              </span>
              <div className="font-bold text-sm sm:text-base mt-0.5 text-amber-300">
                {data.hostName}
              </div>
            </div>
          </div>

          {/* Storage Item & Pickup Slot */}
          <div className="grid grid-cols-2 gap-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                {isHindi ? "स्टोरेज आइटम" : "STORAGE ITEM"}
              </span>
              <div className="font-semibold text-xs sm:text-sm mt-0.5">
                {data.storageItem}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isHindi ? "पिकअप स्लॉट" : "PICKUP SLOT"}
              </span>
              <div className="font-semibold text-xs sm:text-sm mt-0.5">
                {data.pickupSlot}
              </div>
            </div>
          </div>

          {/* Host Address & Distance Tag */}
          <div className="space-y-1.5 bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/30">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                  {isHindi ? "होस्ट वॉल्ट पता" : "HOST VAULT ADDRESS"}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">
                  {data.hostAddress}
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {data.distanceTag}
                </span>
              </div>
            </div>
          </div>

          {/* Printable QR Seal Section */}
          <div className="pass-divider-line" />
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-white/10">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                {isHindi ? "लेजर सील कोड" : "DIGITAL VAULT SEAL"}
              </span>
              <div className="font-mono text-sm font-bold text-cyan-300">
                {data.vaultSealCode}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {isHindi
                  ? "पिकअप के समय होस्ट को दिखाएं"
                  : "Show QR to Nodal Host on pickup"}
              </span>
            </div>

            {/* Micro Vector QR Matrix */}
            <div className={`p-2 bg-white rounded-lg ${passTokens.accent.qrGlow}`}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14"
              >
                <rect x="0" y="0" width="7" height="7" fill="#000000" />
                <rect x="1" y="1" width="5" height="5" fill="#ffffff" />
                <rect x="2" y="2" width="3" height="3" fill="#000000" />

                <rect x="14" y="0" width="7" height="7" fill="#000000" />
                <rect x="15" y="1" width="5" height="5" fill="#ffffff" />
                <rect x="16" y="2" width="3" height="3" fill="#000000" />

                <rect x="0" y="14" width="7" height="7" fill="#000000" />
                <rect x="1" y="15" width="5" height="5" fill="#ffffff" />
                <rect x="2" y="16" width="3" height="3" fill="#000000" />

                <rect x="9" y="1" width="3" height="3" fill="#000000" />
                <rect x="8" y="5" width="2" height="3" fill="#000000" />
                <rect x="11" y="8" width="4" height="2" fill="#000000" />
                <rect x="8" y="11" width="3" height="3" fill="#000000" />
                <rect x="14" y="11" width="3" height="2" fill="#000000" />
                <rect x="9" y="15" width="3" height="5" fill="#000000" />
                <rect x="14" y="15" width="5" height="5" fill="#000000" />
                <rect x="16" y="17" width="2" height="2" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="no-print p-5 pt-0 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDirections}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-all border border-slate-700 active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              {isHindi
                ? passTokens.actions.directionsHi
                : passTokens.actions.directionsEn}
            </button>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-all border border-slate-700 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              {isHindi
                ? passTokens.actions.shareHi
                : passTokens.actions.shareEn}
            </button>
          </div>

          <button
            onClick={handlePrintPass}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${passTokens.accent.actionBtnBg} text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95`}
          >
            <Printer className="w-4 h-4" />
            {isHindi
              ? passTokens.actions.printHi
              : passTokens.actions.printEn}
          </button>
        </div>
      </div>
    </div>
  );
};
