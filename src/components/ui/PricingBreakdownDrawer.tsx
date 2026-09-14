import React, { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getPricingBreakdownDrawerTokens } from "@/lib/designTokens";
import { playPop, playClick } from "@/lib/audio";

export interface PricingBreakdownItem {
  labelEn: string;
  labelHi: string;
  amount: number; // in INR
  isDiscount?: boolean;
  isIncluded?: boolean;
  tooltipEn?: string;
  tooltipHi?: string;
}

export interface PricingBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  numberOfBags?: number;
  months?: number;
  customBaseRatePerBagMonthly?: number;
  platformFeePercentage?: number;
  onProceedToPayment?: () => void;
  className?: string;
}

export const PricingBreakdownDrawer: React.FC<PricingBreakdownDrawerProps> = ({
  isOpen,
  onClose,
  numberOfBags = 2,
  months = 2,
  customBaseRatePerBagMonthly = 300,
  platformFeePercentage = 10,
  onProceedToPayment,
  className = "",
}) => {
  const { role } = usePersona();
  const { language } = useLanguage();
  const tokens = getPricingBreakdownDrawerTokens(role);
  const isHi = language === "hi";

  const [expandedDetails, setExpandedDetails] = useState<boolean>(true);

  if (!isOpen) return null;

  // Math calculations based on verified Kanpur unit economics
  const subtotalBase = numberOfBags * months * customBaseRatePerBagMonthly;
  const platformFee = Math.round((subtotalBase * platformFeePercentage) / 100);
  const totalPayable = subtotalBase + platformFee;

  // Savings calculation relative to dead rent for room
  const estimatedRoomDeadRent = months * 4000;
  const netSavings = Math.max(0, estimatedRoomDeadRent - totalPayable);

  const breakdownItems: PricingBreakdownItem[] = [
    {
      labelEn: `Base Micro-Storage (${numberOfBags} Bag${numberOfBags > 1 ? "s" : ""} × ${months} Mo @ ₹${customBaseRatePerBagMonthly})`,
      labelHi: `मूल माइक्रो-स्टोरेज (${numberOfBags} बैग × ${months} माह @ ₹${customBaseRatePerBagMonthly})`,
      amount: subtotalBase,
      tooltipEn: "Verified Kanpur Host Stash rate: ₹180 to host, ₹80 net margin, ₹40 operational.",
      tooltipHi: "सत्यापित कानपुर होस्ट दर: ₹180 होस्ट को, ₹80 शुद्ध मार्जिन।",
    },
    {
      labelEn: "Zero Brokerage Savings (Direct Peer-to-Peer)",
      labelHi: "शून्य ब्रोकरेज बचत (सीधा होस्ट जुड़ाव)",
      amount: -4000,
      isDiscount: true,
      tooltipEn: "No middleman brokerage or PG agent commissions charged.",
      tooltipHi: "कोई बिचौलिया ब्रोकरेज या एजेंट कमीशन नहीं।",
    },
    {
      labelEn: "₹10,000 Safety Cover Insurance",
      labelHi: "₹10,000 सुरक्षा कवर बीमा",
      amount: 0,
      isIncluded: true,
      tooltipEn: "Comprehensive damage & theft cover included free.",
      tooltipHi: "निःशुल्क क्षति व चोरी सुरक्षा शामिल।",
    },
    {
      labelEn: "Doorstep Pickup & Laser QR Tamper Seal",
      labelHi: "डोरस्टेप पिकअप व लेजर QR सील",
      amount: 0,
      isIncluded: true,
      tooltipEn: "Instant QR barcode seals applied on-site by Saarthi captain.",
      tooltipHi: "सारथी कप्तान द्वारा मौके पर लेजर QR सील लागू।",
    },
    {
      labelEn: `Platform Transparent Service Fee (${platformFeePercentage}%)`,
      labelHi: `प्लेटफ़ॉर्म पारदर्शी सेवा शुल्क (${platformFeePercentage}%)`,
      amount: platformFee,
      tooltipEn: "Covers 24/7 customer support and digital escrow protection.",
      tooltipHi: "24/7 सहायता व डिजिटल एस्क्रो सुरक्षा शुल्क।",
    },
  ];

  const handleToggleExpand = () => {
    playPop();
    setExpandedDetails((prev) => !prev);
  };

  const handleProceed = () => {
    playClick();
    if (onProceedToPayment) {
      onProceedToPayment();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-drawer-title"
    >
      <div
        className={`w-full max-w-lg pricing-drawer-container bg-slate-950/95 border-t border-x border-slate-800 p-6 shadow-2xl text-slate-100 animate-in slide-in-from-bottom duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
        data-persona={role}
      >
        {/* Handle Bar */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700/60" />

        {/* Drawer Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📊</span>
              <h3 id="pricing-drawer-title" className="text-lg font-bold text-slate-100">
                {isHi ? "100% पारदर्शी मूल्य विवरण" : "100% Transparent Price Summary"}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {isHi
                ? "कानपुर सत्यापित यूनिट इकोनॉमिक्स • कोई छिपा हुआ शुल्क नहीं"
                : "Verified Kanpur Unit Economics • Zero Hidden Charges"}
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="rounded-full bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Dead Rent Savings Alert Banner */}
        <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-emerald-300 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {isHi ? "मृत-किराया बचत अलर्ट" : "Dead-Rent Savings Shield"}
              </p>
              <p className="text-xs text-slate-300">
                {isHi
                  ? `खाली कमरे के ₹${estimatedRoomDeadRent.toLocaleString("en-IN")} किराए की जगह केवल ₹${totalPayable.toLocaleString("en-IN")} खर्च करें!`
                  : `Instead of paying ₹${estimatedRoomDeadRent.toLocaleString("en-IN")} vacant room rent, pay just ₹${totalPayable.toLocaleString("en-IN")}!`}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
            {isHi ? `₹${netSavings.toLocaleString("en-IN")} बचत` : `Save ₹${netSavings.toLocaleString("en-IN")}`}
          </span>
        </div>

        {/* Toggle Detailed Breakdown Button */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isHi ? "शुल्क विवरण लाइन आइटम" : "Fee Breakdown Line Items"}
          </span>
          <button
            onClick={handleToggleExpand}
            className="text-xs font-medium text-emerald-400 hover:underline focus:outline-none"
          >
            {expandedDetails
              ? isHi
                ? "संक्षिप्त करें ▲"
                : "Hide Details ▲"
              : isHi
                ? "विस्तार देखें ▼"
                : "Show Details ▼"}
          </button>
        </div>

        {/* Line Items List */}
        {expandedDetails && (
          <div className="mb-5 space-y-2 text-sm">
            {breakdownItems.map((item, idx) => (
              <div key={idx} className="pricing-breakdown-row text-slate-300">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200">
                    {isHi ? item.labelHi : item.labelEn}
                  </span>
                  {(item.tooltipEn || item.tooltipHi) && (
                    <span className="text-[11px] text-slate-400">
                      {isHi ? item.tooltipHi : item.tooltipEn}
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm font-semibold">
                  {item.isIncluded ? (
                    <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-xs text-cyan-300 border border-cyan-500/40">
                      {isHi ? "निःशुल्क शामिल" : "FREE INCLUDED"}
                    </span>
                  ) : item.isDiscount ? (
                    <span className="text-emerald-400">
                      -₹{Math.abs(item.amount).toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span>₹{item.amount.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transparency Seals Grid */}
        <div className="mb-5 grid grid-cols-3 gap-2 text-center text-[11px]">
          {tokens.transparencyPills.map((pill) => (
            <div
              key={pill.id}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 flex flex-col items-center justify-center"
            >
              <span className="text-lg mb-1">{pill.icon}</span>
              <span className="font-bold text-slate-200 line-clamp-1">
                {isHi ? pill.titleHi : pill.titleEn}
              </span>
            </div>
          ))}
        </div>

        {/* Payable Total Card */}
        <div className={`mb-6 rounded-xl border p-4 text-slate-100 ${tokens.accent.totalHighlightBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {isHi ? "कुल भुगतान योग्य राशि" : "Total Net Payable"}
              </p>
              <p className="text-2xl font-black text-white font-mono">
                ₹{totalPayable.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${tokens.accent.badgeBg}`}>
                {isHi ? "सुरक्षित एस्क्रो लॉक" : "100% Escrow Protected"}
              </span>
              <p className="mt-1 text-[11px] text-slate-400">
                {isHi ? "होस्ट को वितरण पिकअप के बाद" : "Payout released post-pickup"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onProceedToPayment && (
          <button
            onClick={handleProceed}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 font-bold text-slate-950 shadow-lg hover:from-emerald-400 hover:to-teal-300 active:scale-[0.99] transition-all"
          >
            {isHi ? "भुगतान हेतु आगे बढ़ें 💳" : "Proceed to Secure Payment 💳"}
          </button>
        )}
      </div>
    </div>
  );
};
