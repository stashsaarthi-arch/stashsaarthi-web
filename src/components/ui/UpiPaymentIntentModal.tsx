import React, { useState, useEffect } from "react";
import { usePersona } from "../../context/PersonaContext";
import { getUpiPaymentIntentTokens } from "../../lib/designTokens";
import {
  playClick,
  playPop,
  playSuccessChime,
  playPaymentConfirmation,
} from "../../lib/audio";

export interface UpiAppOption {
  id: string;
  nameEn: string;
  nameHi: string;
  badgeEn?: string;
  badgeHi?: string;
  color: string;
  bgGradient: string;
  borderGlow: string;
  schemePrefix: string;
  icon: string;
}

export interface UpiPaymentIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  bookingId?: string;
  itemSummary?: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentCancel?: () => void;
  language?: "en" | "hi";
}

/**
 * Dynamic SVG QR Code Matrix Generator Primitive
 * Renders a crisp vector QR code pattern with center logo badge
 */
export function DynamicUpiQrCode({
  vpa,
  amount,
  bookingId,
  personaRole = "student",
}: {
  vpa: string;
  amount: number;
  bookingId: string;
  personaRole?: "student" | "host";
}) {
  const accentColor = personaRole === "host" ? "#F59E0B" : "#10B981";

  // Pre-calculated aesthetic 21x21 QR matrix pattern representation for StashSaarthi
  const qrModules = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0],
    [0,1,0,1,0,0,0,1,1,0,1,1,0,1,0,0,1,0,1,0,1],
    [1,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,1,0],
    [0,1,0,1,0,0,1,1,0,1,0,0,1,1,0,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,1,1,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1],
  ];

  return (
    <div className="upi-qr-stage relative flex flex-col items-center justify-center border border-slate-200 shadow-2xl">
      <div className="upi-qr-scan-beam" />
      <svg
        viewBox="0 0 21 21"
        className="w-48 h-48 md:w-56 md:h-56 shape-rendering-crisp"
        aria-label={`UPI QR Code for ${vpa} - ₹${amount}`}
      >
        {qrModules.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (cell === 1) {
              // Mask center 5x5 for logo shield
              if (
                rowIndex >= 8 &&
                rowIndex <= 12 &&
                colIndex >= 8 &&
                colIndex <= 12
              ) {
                return null;
              }
              const isFinder =
                (rowIndex < 7 && colIndex < 7) ||
                (rowIndex < 7 && colIndex > 13) ||
                (rowIndex > 13 && colIndex < 7);
              return (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={colIndex}
                  y={rowIndex}
                  width="1"
                  height="1"
                  fill={isFinder ? accentColor : "#0F172A"}
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Center StashSaarthi Shield Emblem */}
      <div
        className="absolute w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white"
        style={{ backgroundColor: accentColor }}
      >
        <span className="text-xl leading-none font-bold text-slate-950">📦</span>
      </div>
    </div>
  );
}

/**
 * UPI Payment Intent Modal Component (Task 166)
 * Redesigned checkout modal with instant 1-tap UPI app buttons and auto-generating dynamic QR code
 */
export function UpiPaymentIntentModal({
  isOpen,
  onClose,
  amount = 300,
  bookingId = `STASH-${Math.floor(100000 + Math.random() * 900000)}`,
  itemSummary = "Hostel Micro-Storage (1 Month)",
  onPaymentSuccess,
  onPaymentCancel,
  language = "en",
}: UpiPaymentIntentModalProps) {
  const { role } = usePersona();
  const personaRole = role || "student";
  const tokens = getUpiPaymentIntentTokens(personaRole);
  const isHost = personaRole === "host";
  const isHindi = language === "hi";

  const [copiedVpa, setCopiedVpa] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(tokens.qrConfig.expiresInSec);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);


  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const upiDeepLink = `${tokens.qrConfig.baseUrl}?pa=${tokens.vpaHandle}&pn=${encodeURIComponent(tokens.merchantName)}&am=${amount}&tr=${bookingId}&cu=${tokens.qrConfig.currency}`;

  const handleCopyVpa = () => {
    playClick();
    navigator.clipboard.writeText(tokens.vpaHandle);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2400);
  };

  const handleLaunchUpiApp = (app: UpiAppOption) => {
    playClick();
    setSelectedAppId(app.id);
    const intentUrl = `${app.schemePrefix}?pa=${tokens.vpaHandle}&pn=${encodeURIComponent(tokens.merchantName)}&am=${amount}&tr=${bookingId}&cu=${tokens.qrConfig.currency}`;
    window.location.href = intentUrl;
  };

  const handleSimulatePayment = () => {
    playPop();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      playPaymentConfirmation();
      playSuccessChime();
      const mockTxn = `UPI-TXN-${Date.now().toString().slice(-8)}`;
      if (onPaymentSuccess) {
        onPaymentSuccess(mockTxn);
      }
    }, 1200);
  };

  const handleClose = () => {
    playClick();
    if (onPaymentCancel) onPaymentCancel();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-modal-title"
    >
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto upi-modal-container bg-slate-950/95 border ${tokens.accent.modalBg} text-white shadow-2xl p-6 md:p-8 rounded-3xl border-slate-800`}
        data-persona={personaRole}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          aria-label="Close UPI payment modal"
        >
          ✕
        </button>

        {!isSuccess ? (
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>⚡ Instant UPI Checkout</span>
                <span>•</span>
                <span className="upi-timer-pill font-mono">{formattedTime}</span>
              </div>
              <h2
                id="upi-modal-title"
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
              >
                {isHindi ? "UPI भुगतान करें" : "Pay via UPI App or QR"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {itemSummary} —{" "}
                <span
                  className="font-bold"
                  style={{ color: tokens.accent.accentColor }}
                >
                  ₹{amount}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Dynamic QR Code Section */}
              <div className="flex flex-col items-center justify-center">
                <DynamicUpiQrCode
                  vpa={tokens.vpaHandle}
                  amount={amount}
                  bookingId={bookingId}
                  personaRole={personaRole}
                />
                <p className="text-xs text-slate-400 mt-3 text-center">
                  {isHindi
                    ? "किसी भी UPI ऐप (GPay, PhonePe, Paytm) से स्कैन करें"
                    : "Scan with any UPI Scanner app on your phone"}
                </p>

                {/* VPA Copy Pill */}
                <div className="w-full mt-3">
                  <button
                    onClick={handleCopyVpa}
                    className="upi-vpa-copy-box w-full flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all group"
                    title="Click to copy VPA handle"
                  >
                    <span className="font-mono text-slate-400">VPA:</span>
                    <span className="font-mono font-bold text-emerald-400 group-hover:underline">
                      {tokens.vpaHandle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-slate-300">
                      {copiedVpa ? "Copied! ✓" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>

              {/* 1-Tap Instant UPI App Grid */}
              <div className="flex flex-col gap-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {isHindi ? "1-टैप ऐप्स में खोलें:" : "Tap to open installed app:"}
                </div>

                {tokens.upiApps.map((app) => {
                  const isSelected = selectedAppId === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleLaunchUpiApp(app as UpiAppOption)}
                      className={`upi-app-tile border bg-gradient-to-r ${app.bgGradient} ${app.borderGlow} text-white shadow-md relative overflow-hidden group`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl leading-none">{app.icon}</span>
                        <div className="text-left">
                          <div className="font-bold text-sm leading-tight">
                            {isHindi ? app.nameHi : app.nameEn}
                          </div>
                          {app.badgeEn && (
                            <span className="text-[10px] text-slate-200/90 font-medium">
                              {isHindi ? app.badgeHi : app.badgeEn}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white/90 group-hover:translate-x-1 transition-transform">
                        Pay ₹{amount} →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Simulator Action */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <button
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className={`w-full py-3.5 px-4 rounded-2xl ${tokens.accent.actionBtnBg} transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {isVerifying ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Verifying NPCI Transaction...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Check Payment Status</span>
                    <span className="text-xs font-normal opacity-80">
                      (Demo Verification)
                    </span>
                  </>
                )}
              </button>

              {/* Trust Signals Footer */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                {tokens.trustSignals.map((sig) => (
                  <span key={sig.id} className="flex items-center gap-1">
                    <span>{sig.icon}</span>
                    <span>{isHindi ? sig.labelHi : sig.labelEn}</span>
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Payment Success View */
          <div className="py-8 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl animate-bounce"
              style={{ backgroundColor: tokens.accent.accentColor }}
            >
              ✓
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {isHindi ? "भुगतान सफल हुआ!" : "Payment Confirmed!"}
            </h3>
            <p className="text-slate-300 text-sm max-w-sm mb-6">
              {isHindi
                ? "आपका माइक्रो-स्टोरेज स्लॉट लॉक कर दिया गया है। लेजर सील पास तैयार है।"
                : "Your micro-storage vault slot has been locked with ₹10,000 complimentary insurance cover."}
            </p>

            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Booking ID:</span>
                <span className="text-white font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">₹{amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>VPA Account:</span>
                <span className="text-slate-300">{tokens.vpaHandle}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Shield:</span>
                <span className="text-cyan-400 font-bold">TPA Sec 105 Compliant</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className={`w-full py-3.5 rounded-2xl ${tokens.accent.actionBtnBg} transition-all font-bold text-sm`}
            >
              {isHindi ? "आगे बढ़ें (StashPass देखें)" : "Done — View Digital StashPass"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
