import { useState, useRef, useCallback } from "react";
import {
  Boxes,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Sparkles,
  Luggage,
  Package,
  Layers,
  Zap,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { playPop, playHeroCtaClick } from "@/lib/audio";
import {
  SAARTHI_STASH_CARD_TOKENS,
  getSaarthiStashCardTokens,
  getDevanagariHostTypographyClasses,
} from "@/lib/designTokens";

import { LaserSealBarcode } from "./LaserSealBarcode";

export interface SaarthiStashCard2Props {
  onBook?: (details: { service: "stash"; note: string }) => void;
  className?: string;
  isCompact?: boolean;
}

export function SaarthiStashCard2({
  onBook,
  className = "",
  isCompact = false,
}: SaarthiStashCard2Props) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { role } = usePersona();
  const isHost = role === "host";


  const [activeTabDepth, setActiveTabDepth] = useState<"compact" | "exploded">("compact");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const tokens = getSaarthiStashCardTokens(role);

  const handleBookClick = useCallback(() => {
    try {
      playHeroCtaClick();
    } catch {
      // Audio fallback safety
    }
    if (onBook) {
      onBook({
        service: "stash",
        note: isHi
          ? "सारथी स्टैश 2.0 - 3D माइक्रो-स्टोरेज वॉल्ट"
          : "Saarthi Stash 2.0 - 3D Vault Micro-Storage @ ₹300",
      });
    }
  }, [onBook, isHi]);

  const toggleDepth = useCallback(() => {
    try {
      playPop();
    } catch {
      // Audio fallback safety
    }
    setActiveTabDepth((prev) => (prev === "compact" ? "exploded" : "compact"));
  }, []);

  return (
    <div
      ref={cardRef}
      data-testid="saarthi-stash-card-2"
      data-persona={role}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isHost
          ? "border-amber-500/35 bg-slate-900/90 shadow-[0_0_30px_-4px_rgba(245,158,11,0.25)] hover:border-amber-400/60"
          : "border-emerald-500/35 bg-slate-900/90 shadow-[0_0_30px_-4px_rgba(16,185,129,0.25)] hover:border-emerald-400/60"
      } ${className}`}
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity duration-300"
        style={{
          background: isHost
            ? "radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,245,160,0.5) 0%, rgba(6,182,212,0.3) 50%, transparent 70%)",
        }}
      />

      {/* Top Header & Prominent Pricing Pill */}
      <div className="relative z-10 p-4 sm:p-6 pb-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/15 shadow-inner"
            style={{
              background: isHost
                ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.15))"
                : "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.15))",
            }}
          >
            <Boxes
              className="h-6 w-6"
              style={{ color: tokens.primaryAccent }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight text-white ${getDevanagariHostTypographyClasses(isHi, isHost, true)}`}>
                {isHi ? "सारथी स्टैश 2.0" : "Saarthi Stash 2.0"}
              </h3>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: isHost ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                  borderColor: isHost ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)",
                  color: tokens.primaryAccent,
                }}
              >
                <Sparkles className="h-3 w-3" />
                {isHi ? "माइक्रो-वॉल्ट" : "MICRO-VAULT"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHi
                ? "कमरा खाली रखे बिना सामान सुरक्षित रखें • काकादेव व कैंपस नोड्स"
                : "Zero-Brokerage Intergenerational Vault • Kanpur Campus Nodes"}
            </p>
          </div>
        </div>

        {/* ₹300/mo Prominent Pricing Pill */}
        <div
          data-testid="stash-pricing-pill"
          className="stash-price-pill-glow relative flex items-center gap-2 rounded-xl px-3.5 py-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          onClick={toggleDepth}
          title={isHi ? SAARTHI_STASH_CARD_TOKENS.pricePill.breakdownHi : SAARTHI_STASH_CARD_TOKENS.pricePill.breakdownEn}
        >
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {SAARTHI_STASH_CARD_TOKENS.pricePill.amount}
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                {isHi ? SAARTHI_STASH_CARD_TOKENS.pricePill.unitHi : SAARTHI_STASH_CARD_TOKENS.pricePill.unitEn}
              </span>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
              <Zap className="h-2.5 w-2.5 fill-emerald-400" />
              {isHi ? SAARTHI_STASH_CARD_TOKENS.pricePill.savingsHi : SAARTHI_STASH_CARD_TOKENS.pricePill.savingsEn}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Content Grid: 3D Bag Depth Preview & Tamper-Proof Laser Seal */}
      <div className="relative z-10 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 3D Bag Depth Preview Stage */}
        <div
          data-testid="3d-bag-depth-preview"
          className="stash-card-3d-stage relative rounded-xl border border-white/10 bg-slate-950/70 p-4 flex flex-col justify-between overflow-hidden"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Layers className="h-4 w-4 text-cyan-400" />
              {isHi ? "3D बैग डेप्थ पूर्वावलोकन" : "3D Bag Depth Preview"}
            </span>
            <button
              onClick={toggleDepth}
              className="text-[11px] font-semibold text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {activeTabDepth === "compact"
                ? isHi
                  ? "वॉल्ट लेयर्स देखें"
                  : "View Vault Layers"
                : isHi
                ? "सील्ड व्यू"
                : "Sealed View"}
            </button>
          </div>

          {/* Layered Bag Stack Visual */}
          <div className="my-4 relative min-h-[110px] flex items-center justify-center">
            {activeTabDepth === "compact" ? (
              <div
                className={`stash-card-3d-layer flex items-center justify-center gap-3 transition-transform duration-500 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
              >
                <div
                  className="grid place-items-center h-16 w-16 rounded-xl border border-emerald-500/40 bg-emerald-500/10 shadow-lg text-emerald-300"
                  style={{ transform: isHovered ? "translateZ(30px) rotate(-4deg)" : "none" }}
                >
                  <Luggage className="h-8 w-8" />
                  <span className="text-[9px] font-bold mt-0.5">TROLLEY</span>
                </div>
                <div
                  className="grid place-items-center h-14 w-14 rounded-xl border border-cyan-400/40 bg-cyan-400/10 shadow-lg text-cyan-300"
                  style={{ transform: isHovered ? "translateZ(20px) rotate(3deg)" : "none" }}
                >
                  <Package className="h-7 w-7" />
                  <span className="text-[9px] font-bold mt-0.5">CARTON</span>
                </div>
                <div
                  className="grid place-items-center h-12 w-12 rounded-xl border border-amber-400/40 bg-amber-400/10 shadow-lg text-amber-300"
                  style={{ transform: isHovered ? "translateZ(10px) rotate(-2deg)" : "none" }}
                >
                  <Boxes className="h-6 w-6" />
                  <span className="text-[9px] font-bold mt-0.5">BOOKS</span>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-1.5 text-xs">
                {SAARTHI_STASH_CARD_TOKENS.depthPreview.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                  >
                    <span className="flex items-center gap-2 font-medium text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {isHi ? item.nameHi : item.nameEn}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      Layer {idx + 1} ({item.depthZ})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">
              {isHi
                ? SAARTHI_STASH_CARD_TOKENS.depthPreview.capacityHi
                : SAARTHI_STASH_CARD_TOKENS.depthPreview.capacityEn}
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 100% Insured
            </span>
          </div>
        </div>

        {/* Tamper-Proof Laser Seal Scanner Indicator */}
        <div
          data-testid="tamper-proof-seal-indicator"
          className="relative rounded-xl h-full max-h-[360px] overflow-hidden mt-3"
        >
          <LaserSealBarcode
            serialCode={SAARTHI_STASH_CARD_TOKENS.tamperProofSeal.code}
            verifiedTimestamp="2026-ACTIVE-SEAL"
            size="sm"
            showSecurityBadge={true}
            showScanButton={true}
            interactive={true}
          />
        </div>

      </div>

      {/* Bottom Breakdown & 1-Click Booking CTA */}
      <div className="relative z-10 p-4 sm:p-6 pt-2 bg-slate-950/40 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <li className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isHi ? "₹180/माह होस्ट हिस्सा" : "₹180/mo Host Payout"}</span>
          </li>
          <li className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-cyan-400" />
            <span>{isHi ? "₹80 प्लेटफॉर्म मार्जिन" : "₹80 Net Platform Margin"}</span>
          </li>
          <li className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-amber-400" />
            <span>{isHi ? "मुफ़्त डोरस्टेप पिकअप" : "Doorstep Saarthi Pick"}</span>
          </li>
        </ul>

        {/* 1-Click Booking CTA */}
        <button
          data-testid="stash-booking-cta"
          onClick={handleBookClick}
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
            isHost
              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/25"
              : "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-emerald-500/25"
          }`}
        >
          <span>{isHi ? SAARTHI_STASH_CARD_TOKENS.ctaHi : SAARTHI_STASH_CARD_TOKENS.ctaEn}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
