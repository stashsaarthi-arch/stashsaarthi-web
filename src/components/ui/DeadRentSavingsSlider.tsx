import React, { useState, useEffect, useRef, useId, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ShieldCheck, IndianRupee, Banknote, Calendar, Zap, AlertTriangle } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDeadRentSliderTokens } from "@/lib/designTokens";
import { playCounterIncrement, playPop } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import type { OpenBooking } from "@/components/stash/types";

export interface DeadRentSavingsSliderProps {
  initialDays?: number | undefined;
  bags?: number | undefined;
  onSavingsChange?: ((days: number, savedAmount: number) => void) | undefined;
  onBook?: OpenBooking | undefined;
  className?: string | undefined;
  showCardWrapper?: boolean | undefined;
}



interface NoteParticle {
  id: number;
  x: number;
  rot: number;
  symbol: string;
  gradient: string;
}

export const DeadRentSavingsSlider = memo(function DeadRentSavingsSlider({
  initialDays = 45,
  bags = 2,
  onSavingsChange,
  onBook,
  className = "",
  showCardWrapper = true,
}: DeadRentSavingsSliderProps) {
  const { role, isHost } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const sliderId = useId();


  const tokens = getDeadRentSliderTokens(isHost ? "host" : "student");
  const [days, setDays] = useState<number>(initialDays);
  const [noteParticles, setNoteParticles] = useState<NoteParticle[]>([]);
  const nextParticleId = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Math calculations
  const dailyHostelRent = tokens.dailyHostelRent; // ₹250 / day
  const monthlyStashCostPerBag = tokens.monthlyStashCostPerBag; // ₹300 / bag / mo
  const months = Math.max(1, Math.ceil(days / 30));
  
  const deadRentWastage = days * dailyHostelRent;
  const stashStorageCost = months * bags * monthlyStashCostPerBag;
  const netSaved = Math.max(0, deadRentWastage - stashStorageCost);
  const savingsPercentage = deadRentWastage > 0 ? Math.round((netSaved / deadRentWastage) * 100) : 0;

  // Active milestone index lookup
  const activeMilestoneIndex = tokens.milestones.reduce((acc, milestone, idx) => {
    return days >= milestone.days ? idx : acc;
  }, 0);

  // Trigger sound & spawn floating currency note particles on slider drag
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDays = parseInt(e.target.value, 10);
    if (newDays === days) return;

    setDays(newDays);
    playCounterIncrement(newDays);

    if (onSavingsChange) {
      onSavingsChange(newDays, netSaved);
    }

    // Spawn 2 currency note particles
    const gradients = tokens.animatedNotes.noteGradients;
    const newParticles: NoteParticle[] = Array.from({ length: 2 }).map(() => ({
      id: nextParticleId.current++,
      x: (Math.random() - 0.5) * 140, // -70px to +70px random offset
      rot: (Math.random() - 0.5) * 40, // -20deg to +20deg rotation
      symbol: "₹500",
      gradient: gradients[Math.floor(Math.random() * gradients.length)] || gradients[0],
    }));

    setNoteParticles((prev) => [...prev.slice(-10), ...newParticles]);
  };

  // Clean up floating particles
  useEffect(() => {
    if (noteParticles.length === 0) return;
    const timer = setTimeout(() => {
      setNoteParticles((prev) => prev.slice(2));
    }, 1200);
    return () => clearTimeout(timer);
  }, [noteParticles]);

  const currentMilestone = tokens.milestones[activeMilestoneIndex] || tokens.milestones[0];

  const content = (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden text-left font-sans select-none ${className}`}
      data-testid="dead-rent-savings-slider"
      data-persona={role}
    >

      {/* Floating Currency Note Particles Canvas Stage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
        <AnimatePresence>
          {noteParticles.map((particle) => (
            <span
              key={particle.id}
              className="currency-note-particle inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-black text-white shadow-lg border border-white/30"
              style={{
                left: "50%",
                bottom: "45%",
                background: particle.gradient,
                ["--float-x" as string]: `${particle.x}px`,
                ["--float-rot" as string]: `${particle.rot}deg`,
              }}
            >
              <Banknote className="h-3 w-3" />
              {particle.symbol}
            </span>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider border shadow-sm"
              style={{
                backgroundColor: isHost ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                borderColor: isHost ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)",
                color: isHost ? "#FCD34D" : "#34D399",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isHi ? "इंटरएक्टिव बचत कैलकुलेटर" : "Interactive Dead Rent Slider"}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {isHi ? "लाइव वेकेशन बचत" : "Live Drag Savings"}
            </span>
          </div>
          <h3 className="mt-1.5 text-base sm:text-xl font-bold text-white tracking-tight">
            {isHi ? (
              <>
                वेकेशन अवधि: <span className="text-emerald-400 font-mono font-black">{days} दिन</span>
              </>
            ) : (
              <>
                Vacation Duration: <span className="text-emerald-400 font-mono font-black">{days} Days</span>
              </>
            )}
          </h3>
        </div>

        {/* Milestone Badge Pill */}
        <div
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs font-bold transition-all shadow-md"
          style={{
            backgroundColor: isHost ? "rgba(245, 158, 11, 0.12)" : "rgba(16, 185, 129, 0.12)",
            borderColor: isHost ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)",
            color: isHost ? "#FBBF24" : "#6EE7B7",
          }}
        >
          <span className="text-base">{currentMilestone.icon}</span>
          <span>{isHi ? currentMilestone.labelHi : currentMilestone.labelEn}</span>
        </div>
      </div>

      {/* Main Interactive Slider Track */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            {isHi ? "छुट्टी के दिन घसीटें:" : "Drag Vacation Days:"}
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {days} {isHi ? "दिन" : "Days"} ({months} {isHi ? "माह" : "Month"}{months > 1 ? "s" : ""})
          </span>
        </div>

        {/* Custom Range Input */}
        <div className="relative flex items-center">
          <input
            id={sliderId}
            type="range"
            min={tokens.minDays}
            max={tokens.maxDays}
            step={tokens.step}
            value={days}
            onChange={handleSliderChange}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-emerald-400 bg-slate-900 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            style={{
              background: `linear-gradient(to right, ${tokens.personaSpec.primaryColor} 0%, ${tokens.personaSpec.secondaryColor} ${
                ((days - tokens.minDays) / (tokens.maxDays - tokens.minDays)) * 100
              }%, rgba(15, 23, 42, 0.9) ${
                ((days - tokens.minDays) / (tokens.maxDays - tokens.minDays)) * 100
              }%)`,
            }}
          />
        </div>

        {/* Milestone Dots along Track */}
        <div className="flex justify-between items-center px-1 pt-1">
          {tokens.milestones.map((m, idx) => {
            const isReached = days >= m.days;
            return (
              <button
                key={m.days}
                type="button"
                onClick={() => {
                  playPop();
                  setDays(m.days);
                  if (onSavingsChange) onSavingsChange(m.days, netSaved);
                }}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isReached ? "opacity-100 scale-105" : "opacity-45 hover:opacity-80"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full border transition-all ${
                    isReached
                      ? isHost
                        ? "bg-amber-400 border-white shadow-[0_0_10px_#F59E0B]"
                        : "bg-emerald-400 border-white shadow-[0_0_10px_#10B981]"
                      : "bg-slate-800 border-slate-600"
                  }`}
                />
                <span className="text-[10px] font-mono font-bold text-slate-400 hidden sm:inline">
                  {m.days}d
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Savings Metric Breakdown Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Traditional Dead Rent Wastage */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {isHi ? "पीजी मृत किराया" : "Dead Rent Wastage"}
            </span>
            <span className="text-[10px] font-mono text-rose-300/80 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
              100% {isHi ? "हानि" : "Loss"}
            </span>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-400 tracking-tight">
            ₹{deadRentWastage.toLocaleString("en-IN")}
          </div>
          <div className="mt-0.5 text-[10px] text-rose-300/70 font-mono">
            {days} {isHi ? "दिन" : "days"} × ₹250/{isHi ? "दिन खाली कमरा" : "day empty room"}
          </div>
        </div>

        {/* Metric 2: Saarthi Micro-Storage Cost */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              {isHi ? "सारथी स्टोरेज शुल्क" : "Saarthi Stash Fee"}
            </span>
            <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
              ₹300/{isHi ? "बैग/माह" : "bag/mo"}
            </span>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-cyan-300 tracking-tight">
            ₹{stashStorageCost.toLocaleString("en-IN")}
          </div>
          <div className="mt-0.5 text-[10px] text-cyan-300/70 font-mono">
            {bags} {isHi ? "बैग" : "bag"}{bags > 1 ? "s" : ""} × {months} {isHi ? "माह" : "mo"}
          </div>
        </div>

        {/* Metric 3: Net Currency Saved */}
        <div
          className="rounded-xl p-3.5 backdrop-blur-md border shadow-lg"
          style={{
            backgroundColor: isHost ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
            borderColor: isHost ? "rgba(245, 158, 11, 0.45)" : "rgba(16, 185, 129, 0.45)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              {isHi ? "शुद्ध नगद बचत" : "Net Cash Saved"}
            </span>
            <span className="text-[10px] font-mono font-black text-black bg-emerald-400 px-2 py-0.5 rounded shadow-sm">
              {savingsPercentage}% {isHi ? "बचत" : "Saved"}
            </span>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-300 tracking-tight">
            ₹{netSaved.toLocaleString("en-IN")}
          </div>
          <div className="mt-0.5 text-[10px] text-emerald-300/80 font-mono">
            {isHi ? "डायरेक्ट बैंक खाता बचत" : "Direct Student Bank Savings"}
          </div>
        </div>
      </div>

      {/* Callout Action Footer */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          <span className="font-bold text-white">
            {isHi ? `₹${netSaved.toLocaleString("en-IN")} जेब में बचाएं!` : `Keep ₹${netSaved.toLocaleString("en-IN")} in your pocket!`}
          </span>{" "}
          <span className="text-muted-foreground font-mono">
            ({isHi ? "100% लेजर सील + ₹10,000 सुरक्षा कवर" : "100% Laser Barcode + ₹10,000 Insurance Cover"})
          </span>
        </div>

        <Button
          data-magnetic
          variant={isHost ? "warm" : "heroMint"}
          size="default"
          onClick={() => {
            playPop();
            if (onBook) {
              onBook({
                service: "stash",
                bags,
                months,
                amount: stashStorageCost,
                note: `Dead Rent Slider: ${days} days vacation, ${bags} bags. Saves ₹${netSaved.toLocaleString("en-IN")}`,
              });
            } else {
              const calcEl = document.getElementById("student-calculator");
              if (calcEl) calcEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg cursor-pointer group"
        >
          <span>
            {isHi ? `₹${netSaved.toLocaleString("en-IN")} बचत लॉक करें` : `Lock ₹${netSaved.toLocaleString("en-IN")} Savings`}
          </span>
          <ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );

  if (!showCardWrapper) return content;

  return (
    <div className="relative rounded-2xl border border-emerald-500/30 bg-[#0A0D0F]/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_0_45px_rgba(16,185,129,0.15)]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
      {content}
    </div>
  );
});
