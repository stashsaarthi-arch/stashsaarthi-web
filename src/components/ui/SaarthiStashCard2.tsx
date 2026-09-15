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
import { Button } from "@/components/ui/button";

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

      {/* Card Header matching BentoCard */}
      <div className="relative z-10 p-5 pb-3 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 shadow-inner"
            style={{
              background: isHost
                ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.15))"
                : "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.15))",
            }}
          >
            <Boxes
              className="h-5 w-5"
              style={{ color: tokens.primaryAccent }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{isHi ? "सारथी स्टैश 2.0" : "Saarthi Stash 2.0"}</span>
              <span
                className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider border shrink-0"
                style={{
                  backgroundColor: isHost ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                  borderColor: isHost ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)",
                  color: tokens.primaryAccent,
                }}
              >
                <Sparkles className="h-2.5 w-2.5" />
                {isHi ? "माइक्रो-वॉल्ट" : "MICRO-VAULT"}
              </span>
            </div>
            <div
              className="truncate text-xs font-medium mt-0.5 flex items-center gap-1.5 flex-wrap"
              style={{ color: tokens.primaryAccent }}
            >
              <span>{SAARTHI_STASH_CARD_TOKENS.pricePill.amount} {isHi ? SAARTHI_STASH_CARD_TOKENS.pricePill.unitHi : SAARTHI_STASH_CARD_TOKENS.pricePill.unitEn}</span>
              <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                ⚡ {isHi ? "80% बचत" : "Save 80% Dead-Rent"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content & Features */}
      <div className="relative z-10 p-5 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {isHi
              ? "कमरा खाली रखे बिना सामान सुरक्षित रखें • काकादेव व कैंपस नोड्स"
              : "Insured micro-storage in verified campus host homes."}
          </p>

          {/* Pricing Comparison Banner */}
          <div
            data-testid="stash-pricing-pill"
            onClick={toggleDepth}
            className="mt-3 rounded-xl border border-white/10 p-3 text-xs flex items-center justify-between cursor-pointer hover:border-white/25 transition-colors"
            style={{
              background: `color-mix(in oklab, ${tokens.primaryAccent} 10%, transparent)`,
            }}
          >
            <div>
              <span className="font-semibold text-white">₹300/bag/mo</span>: {isHi ? "कमरा किराया बचाने का स्मार्ट तरीका" : "Save ₹3,700 vs paying dead room rent"}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-2">
              ⚡ {isHi ? "80% बचत" : "80% Saved"}
            </span>
          </div>

          {/* Compact 3D Depth & Laser Seal Dual Feature Box */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* 3D Bag Depth Preview Box */}
            <div
              data-testid="3d-bag-depth-preview"
              onClick={toggleDepth}
              className="stash-card-3d-stage rounded-xl border border-white/10 bg-slate-950/70 p-2.5 flex flex-col justify-between cursor-pointer hover:border-cyan-400/40 transition-colors min-h-[92px]"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span>3D Layers</span>
                </span>
                <span className="text-[9px] font-mono text-cyan-300">
                  {activeTabDepth === "compact" ? "3 Bags" : "Layers"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="grid place-items-center h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] transition-transform hover:scale-110">
                  <Luggage className="h-3.5 w-3.5" />
                </span>
                <span className="grid place-items-center h-6 w-6 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] transition-transform hover:scale-110">
                  <Package className="h-3.5 w-3.5" />
                </span>
                <span className="grid place-items-center h-6 w-6 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] transition-transform hover:scale-110">
                  <Boxes className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="text-[9px] text-center text-muted-foreground font-mono">
                {activeTabDepth === "compact" ? "500L Volume • Insured" : "Inspection Ready"}
              </div>
            </div>

            {/* Tamper-Proof Laser Seal Scanner Indicator */}
            <div
              data-testid="tamper-proof-seal-indicator"
              className="laser-seal-scanner rounded-xl border border-white/10 bg-slate-950/70 p-2.5 flex flex-col justify-between overflow-hidden min-h-[92px]"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-white mb-0.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Laser Seal</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-300">INTACT</span>
              </div>
              <div className="py-0.5 w-full">
                <LaserSealBarcode
                  serialCode={SAARTHI_STASH_CARD_TOKENS.tamperProofSeal.code}
                  verifiedTimestamp="2026-ACTIVE-SEAL"
                  size="sm"
                  showSecurityBadge={false}
                  showScanButton={false}
                  interactive={true}
                  className="border-0 bg-transparent p-0 min-h-0 shadow-none"
                />
              </div>
              <div className="text-[9px] text-center text-emerald-400/90 font-mono">
                100% Insured • ₹10k
              </div>
            </div>
          </div>

          {/* Bullet points matching other cards */}
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2 text-xs sm:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <span className="text-muted-foreground">{isHi ? "₹180/माह होस्ट हिस्सा • ₹80 मार्जिन" : "₹180/mo Host Payout • ₹80 Platform Margin"}</span>
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <span className="text-muted-foreground">{isHi ? "₹10,000 मुफ़्त माइक्रो-बीमा सुरक्षा कवच" : "₹10,000 Complimentary Insurance Shield"}</span>
            </li>
          </ul>
        </div>

        {/* 1-Click Booking CTA matching BentoCard */}
        <Button
          data-testid="stash-booking-cta"
          onClick={handleBookClick}
          className="mt-4 w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
          style={{
            backgroundColor: tokens.primaryAccent,
            color: "black",
            boxShadow: `0 4px 14px 0 color-mix(in oklab, ${tokens.primaryAccent} 40%, transparent)`,
          }}
        >
          {isHi ? "सारथी स्टैश 2.0 बुक करें" : "Book Saarthi Stash 2.0"}
        </Button>
      </div>
    </div>
  );
}
