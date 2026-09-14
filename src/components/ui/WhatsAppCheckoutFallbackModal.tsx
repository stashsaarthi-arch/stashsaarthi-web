import React, { useState } from "react";
import { usePersona } from "../../context/PersonaContext";
import { useLanguage } from "../../context/LanguageContext";
import { getWhatsAppCheckoutFallbackTokens } from "../../lib/designTokens";
import { playClick, playPop, playSuccessChime } from "../../lib/audio";
import {
  MessageSquare,
  WifiOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  Phone,
  ArrowRight,
  QrCode,
  Zap,
  CheckCircle2,
} from "lucide-react";

export interface FallbackBookingSummary {
  studentName?: string;
  studentPhone?: string;
  itemsSummary?: string;
  pickupDate?: string;
  pickupSlot?: string;
  totalAmount?: string;
  campusLocation?: string;
  paymentMethod?: string;
}

export interface WhatsAppCheckoutFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSummary?: FallbackBookingSummary;
  onOrderCompleted?: () => void;
  className?: string;
}

/**
 * WhatsAppCheckoutFallbackModal Component (Task 169)
 * Streamlined fallback modal for weak network / 2G connections allowing students
 * and hosts to finalize orders directly via pre-filled WhatsApp link (+91 9369454350).
 */
export const WhatsAppCheckoutFallbackModal: React.FC<WhatsAppCheckoutFallbackModalProps> = ({
  isOpen,
  onClose,
  bookingSummary,
  onOrderCompleted,
  className = "",
}) => {
  const { role } = usePersona();
  const { language } = useLanguage();
  const personaRole = role || "student";
  const currentLang = language === "hi" ? "hi" : "en";
  const tokens = getWhatsAppCheckoutFallbackTokens(personaRole);
  const copyText = tokens.bilingualCopy[currentLang];

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const defaultSummary: FallbackBookingSummary = {
    studentName: bookingSummary?.studentName || "Student Guest",
    studentPhone: bookingSummary?.studentPhone || "+91 9876543210",
    itemsSummary: bookingSummary?.itemsSummary || "2x Standard Micro-Storage Luggage Bags",
    pickupDate: bookingSummary?.pickupDate || "Next Day Pickup",
    pickupSlot: bookingSummary?.pickupSlot || "Morning 8:00 AM - 11:00 AM",
    totalAmount: bookingSummary?.totalAmount || "₹600",
    campusLocation: bookingSummary?.campusLocation || "Kakadeo Campus Hub, Kanpur",
    paymentMethod: bookingSummary?.paymentMethod || "Cash or UPI on Doorstep Pickup",
  };

  const formattedWhatsAppText = `🎒 *StashSaarthi Kanpur Storage Booking Request*
----------------------------------------
👤 *Customer:* ${defaultSummary.studentName}
📞 *Phone:* ${defaultSummary.studentPhone}
📦 *Items:* ${defaultSummary.itemsSummary}
📅 *Pickup Date/Slot:* ${defaultSummary.pickupDate} (${defaultSummary.pickupSlot})
📍 *Campus Location:* ${defaultSummary.campusLocation}
💰 *Total Amount:* ${defaultSummary.totalAmount} (${defaultSummary.paymentMethod})
----------------------------------------
⚡ *Dispatch Request:* Instant 2G WhatsApp Quick Checkout`;

  const whatsappUrl = `https://wa.me/${tokens.whatsappNumberDigits}?text=${encodeURIComponent(
    formattedWhatsAppText
  )}`;

  const handleCopyMessage = () => {
    playPop();
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunchWhatsApp = () => {
    playSuccessChime();
    if (onOrderCompleted) onOrderCompleted();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleModalClose = () => {
    playClick();
    onClose();
  };

  return (
    <div
      className={`fixed inset-[#0] z-50 flex items-center justify-center p-4 whatsapp-fallback-modal-overlay animate-fadeIn ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-fallback-title"
    >
      <div className="whatsapp-fallback-card w-full max-w-lg bg-slate-950/95 text-white border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/60 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="whatsapp-signal-badge">
            <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            {copyText.networkSignalText}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tokens.accent.badgeBg}`}>
            {tokens.speedGuarantee}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 id="whatsapp-fallback-title" className="text-xl font-bold tracking-tight text-white">
              {copyText.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{copyText.subtitle}</p>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-3 gap-2 my-4 py-2 px-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300">
          {tokens.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{badge}</span>
            </div>
          ))}
        </div>

        {/* Message Preview Box */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Pre-filled Dispatch Order
            </span>
            <button
              onClick={handleCopyMessage}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium hover:underline"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> {copyText.prefillCopied}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> {copyText.copyPrefillCta}
                </>
              )}
            </button>
          </div>
          <div className="whatsapp-prefill-preview-box p-3.5 max-h-36 overflow-y-auto border border-slate-800 rounded-xl">
            {formattedWhatsAppText}
          </div>
        </div>

        {/* Desktop QR Scanner Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowQr(!showQr)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            {showQr ? "Hide Mobile QR Code" : copyText.qrScanText}
          </button>
          {showQr && (
            <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
                {/* SVG Vector QR Code Graphic */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  <path d="M0,0 h30 v30 h-30 z M10,10 v10 h10 v-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 v10 h10 v-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 v10 h10 v-10 z" />
                  <rect x="40" y="10" width="10" height="20" />
                  <rect x="50" y="40" width="20" height="10" />
                  <rect x="10" y="40" width="20" height="10" />
                  <rect x="70" y="50" width="20" height="20" />
                  <rect x="40" y="70" width="20" height="20" />
                  <rect x="80" y="80" width="10" height="10" />
                </svg>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Scan with phone camera to open WhatsApp directly
              </p>
            </div>
          )}
        </div>

        {/* Primary WhatsApp Action Button */}
        <div className="space-y-2">
          <button
            onClick={handleLaunchWhatsApp}
            className={`w-full py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${tokens.accent.whatsappBtnBg} whatsapp-pulse-ring-active`}
          >
            <Phone className="w-5 h-5 fill-current" />
            <span>{copyText.launchWhatsAppCta}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={handleModalClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-medium text-center transition-colors"
          >
            {copyText.cancelCta}
          </button>
        </div>

        {/* Footer Support Info */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct WhatsApp Support: {tokens.whatsappNumber}
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3 h-3" /> StashSaarthi Nodal Desk
          </span>
        </div>
      </div>
    </div>
  );
};
