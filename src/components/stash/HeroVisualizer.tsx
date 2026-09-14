import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Boxes,
  Home,
  ShieldCheck,
  Building2,
  QrCode,
  Truck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { playPop } from "@/lib/audio";
import type { Role } from "./types";

export interface HeroVisualizerProps {
  role?: Role;
  onExploreVault?: () => void;
}

export interface TransitionStage {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  icon: typeof Boxes;
  badge: string;
  details: string[];
  metrics: { label: string; value: string };
  sealId: string;
}

const STAGES: TransitionStage[] = [
  {
    id: 0,
    title: "1. Hostel Room Packing",
    subtitle: "Items tagged with laser barcode & anti-tamper QR seal",
    location: "Hostel Room • Kakadeo / IITK",
    icon: Building2,
    badge: "Step 1 • Digital Tagging",
    details: [
      "Barcode & tamper-proof seal applied",
      "Itemized digital inventory created",
      "Zero dead rent commitment"
    ],
    metrics: { label: "Dead Rent Saved", value: "₹8,000" },
    sealId: "QR-SEAL-8839"
  },
  {
    id: 1,
    title: "2. Doorstep Saarthi Transit",
    subtitle: "Verified Saarthi Captain handles doorstep pickup & scan",
    location: "In-Transit • Campus Doorstep",
    icon: Truck,
    badge: "Step 2 • Zero-CapEx Pickup",
    details: [
      "GPS tracked captain assignment",
      "Live barcode scan confirmation",
      "100% Escrow insurance active"
    ],
    metrics: { label: "Transit Time", value: "< 15 Mins" },
    sealId: "QR-SEAL-8839"
  },
  {
    id: 2,
    title: "3. Secured Senior Host Vault",
    subtitle: "Safely stored in verified host home with 24/7 security",
    location: "Host Vault • Swaroop Nagar",
    icon: Home,
    badge: "Step 3 • Vault Secured",
    details: [
      "₹10,000 property protection cover",
      "Dignified passive income for host",
      "1-Click doorstep retrieval anytime"
    ],
    metrics: { label: "Monthly Storage", value: "₹300/mo" },
    sealId: "QR-SEAL-8839"
  }
];

export const HeroVisualizer = memo(function HeroVisualizer({
  role = "student",
  onExploreVault
}: HeroVisualizerProps) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<string>("suitcase");
  const isStudent = role === "student";

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStageSelect = (index: number) => {
    playPop();
    setActiveStage(index);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    playPop();
    setIsPlaying(!isPlaying);
  };

  const stage = (STAGES[activeStage] || STAGES[0]) as TransitionStage;
  const { id: stageId, title, subtitle, badge, metrics, details, sealId } = stage;

  return (
    <div
      data-testid="hero-visualizer"
      className="relative my-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-6 backdrop-blur-2xl shadow-floating text-left"
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[90px] opacity-25"
        style={{
          background: isStudent ? "var(--emerald)" : "var(--amber)"
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[90px] opacity-20"
        style={{
          background: isStudent ? "var(--cyan)" : "var(--gold)"
        }}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isStudent ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Interactive Item Transition Visualizer</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${isStudent ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30" : "bg-amber-400/10 text-amber-300 border border-amber-400/30"}`}>
                LIVE SIMULATION
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {isStudent
                ? "See how your luggage transitions seamlessly from hostel room to verified host vault"
                : "See how spare host rooms become dignified micro-storage vaults for verified students"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            aria-label={isPlaying ? "Pause visualizer auto-play" : "Play visualizer auto-play"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Auto Play</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleStageSelect(0)}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-muted-foreground hover:text-white transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stage progress timeline navigation */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === activeStage;
          const isPassed = idx < activeStage;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleStageSelect(idx)}
              className={`group relative flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? isStudent
                    ? "border-emerald-400/60 bg-emerald-950/40 shadow-glow"
                    : "border-amber-400/60 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : isPassed
                  ? "border-white/20 bg-white/5 text-muted-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground/60 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${isActive ? (isStudent ? "text-emerald-300" : "text-amber-300") : "text-muted-foreground"}`}>
                  STAGE 0{idx + 1}
                </span>
                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStudent ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isStudent ? "bg-emerald-400" : "bg-amber-400"}`} />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? (isStudent ? "text-emerald-400" : "text-amber-400") : "text-muted-foreground"}`} />
                <span className="text-xs font-bold text-white line-clamp-1">
                  {s.title.split(". ")[1]}
                </span>
              </div>
              {/* Progress track bar */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 mt-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    isActive
                      ? isStudent
                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400 w-full"
                        : "bg-gradient-to-r from-amber-400 to-yellow-400 w-full"
                      : isPassed
                      ? "bg-white/40 w-full"
                      : "w-0"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main interactive visualizer canvas area */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left canvas: Interactive vector node animation */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-4 lg:col-span-7 min-h-[220px]">
          {/* Node path vector visualizer */}
          <div className="relative flex items-center justify-between px-4 py-6 my-auto">
            {/* Vector path line */}
            <div className="absolute left-10 right-10 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-amber-500/30" />

            {/* Moving transit particle/suitcase icon */}
            <motion.div
              animate={{
                left: activeStage === 0 ? "10%" : activeStage === 1 ? "50%" : "90%",
              }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-2xl backdrop-blur-md transition-all ${
                isStudent
                  ? "bg-emerald-400 text-black shadow-emerald-500/50 ring-4 ring-emerald-500/30"
                  : "bg-amber-400 text-black shadow-amber-500/50 ring-4 ring-amber-500/30"
              }`}>
                <Boxes className="h-6 w-6 animate-bounce" />
              </div>
            </motion.div>

            {/* Node 1: Hostel */}
            <div className={`relative z-10 flex flex-col items-center gap-1.5 transition-all ${activeStage === 0 ? "scale-110 opacity-100" : "opacity-60"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${activeStage === 0 ? "border-emerald-400 bg-emerald-950/80 text-emerald-300" : "border-white/10 bg-slate-800 text-muted-foreground"}`}>
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-white">Hostel Room</span>
              <span className="text-[9.5px] font-mono text-emerald-400/90">Kakadeo Hub</span>
            </div>

            {/* Node 2: Saarthi Transit */}
            <div className={`relative z-10 flex flex-col items-center gap-1.5 transition-all ${activeStage === 1 ? "scale-110 opacity-100" : "opacity-60"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${activeStage === 1 ? "border-cyan-400 bg-cyan-950/80 text-cyan-300" : "border-white/10 bg-slate-800 text-muted-foreground"}`}>
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-white">Saarthi Transit</span>
              <span className="text-[9.5px] font-mono text-cyan-400/90">Verified Captain</span>
            </div>

            {/* Node 3: Senior Host Vault */}
            <div className={`relative z-10 flex flex-col items-center gap-1.5 transition-all ${activeStage === 2 ? "scale-110 opacity-100" : "opacity-60"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${activeStage === 2 ? "border-amber-400 bg-amber-950/80 text-amber-300" : "border-white/10 bg-slate-800 text-muted-foreground"}`}>
                <Home className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-white">Senior Host Vault</span>
              <span className="text-[9.5px] font-mono text-amber-400/90">Swaroop Nagar</span>
            </div>
          </div>

          {/* Bottom live stats pill */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-[11px] text-muted-foreground">
                Tamper Seal: <strong className="text-white">{sealId}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Lock className="h-3.5 w-3.5" />
              <span>100% Escrow Protected</span>
            </div>
          </div>
        </div>

        {/* Right drawer: Active stage details & item inspection */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/60 p-4 lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${isStudent ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" : "bg-amber-400/20 text-amber-300 border border-amber-400/30"}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {badge}
                </span>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">{metrics.label}</div>
                  <div className="text-sm font-black text-white">{metrics.value}</div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-white">{title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              </div>

              {/* Stage Checklist */}
              <div className="space-y-1.5 pt-1">
                {details.map((detail: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isStudent ? "text-emerald-400" : "text-amber-400"}`} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action button */}
          <div className="pt-4 border-t border-white/10 mt-3">
            <button
              type="button"
              onClick={onExploreVault}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold text-black transition-all cursor-pointer ${
                isStudent
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-emerald-500/20"
                  : "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-amber-500/20"
              }`}
            >
              <span>{isStudent ? "Reserve Micro-Storage @ ₹300/mo" : "List Spare Room @ ₹11,500/mo"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
