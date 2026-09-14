import React, { useState, useEffect, useCallback } from "react";
import { playPop, playClick } from "@/lib/audio";
import { Sparkles, Check, RefreshCw } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { PEACOCK_FEATHER_TOKENS, getPeacockFeatherTokens } from "@/lib/designTokens";

export interface PeacockFeatherMatkiDustingProps {
  isAutoTriggered?: boolean;
  onDustComplete?: () => void;
  className?: string;
  compact?: boolean;
}

interface SparkleParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  icon: string;
}

export const PeacockFeatherMatkiDusting: React.FC<PeacockFeatherMatkiDustingProps> = ({
  isAutoTriggered = false,
  onDustComplete,
  className = "",
  compact = false,
}) => {
  const { role } = usePersona();
  const tokens = getPeacockFeatherTokens(role);
  const [isDusting, setIsDusting] = useState<boolean>(false);
  const [dustCount, setDustCount] = useState<number>(1);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  const generateSparkles = useCallback(() => {
    const icons = ["✨", "🧈", "💛", "🪶", "💫", "✨", "🧈", "💛"];
    const colors = PEACOCK_FEATHER_TOKENS.sparkleBurst.colors;
    const newParticles: SparkleParticle[] = [];

    for (let i = 0; i < PEACOCK_FEATHER_TOKENS.sparkleBurst.particleCount; i++) {
      const angle = (i * 360) / PEACOCK_FEATHER_TOKENS.sparkleBurst.particleCount + Math.random() * 15;
      const distance = 25 + Math.random() * 30;
      newParticles.push({
        id: i,
        angle,
        distance,
        size: 10 + Math.random() * 8,
        color: colors[i % colors.length] || "#FBBF24",
        icon: icons[i % icons.length] || "✨",
      });
    }
    setParticles(newParticles);
  }, []);

  const triggerDusting = useCallback(() => {
    if (isDusting) return;
    setIsDusting(true);
    setShowSparkles(true);
    generateSparkles();
    playPop();
    playClick();

    // Reset animation state after spring sweep completes
    const sweepTimer = setTimeout(() => {
      setIsDusting(false);
      setDustCount((prev) => prev + 1);
      if (onDustComplete) onDustComplete();
    }, PEACOCK_FEATHER_TOKENS.sweepPhysics.durationMs);

    const sparkleTimer = setTimeout(() => {
      setShowSparkles(false);
    }, PEACOCK_FEATHER_TOKENS.sparkleBurst.fadeDurationMs);

    return () => {
      clearTimeout(sweepTimer);
      clearTimeout(sparkleTimer);
    };
  }, [isDusting, generateSparkles, onDustComplete]);

  useEffect(() => {
    if (isAutoTriggered) {
      triggerDusting();
    }
  }, [isAutoTriggered, triggerDusting]);

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          triggerDusting();
        }}
        className={`relative z-10 group cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-md ${className}`}
        title="Click to dust fresh white butter on thali (Mor-Pankh Micro-Interaction)"
      >
        {/* Animated Peacock Feather Icon */}
        <div
          className={`relative transition-transform duration-500 pointer-events-none ${
            isDusting ? "peacock-spring-active" : "group-hover:scale-110 group-hover:rotate-6"
          }`}
        >
          <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 17 6 17 11C17 14 15 16 12 22C9 16 7 14 7 11C7 6 12 2 12 2Z"
              fill="url(#peacockGradientCompact)"
              stroke={tokens.personaSpec.featherBorder}
              strokeWidth="1.2"
            />
            {/* Iridescent Eye */}
            <ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill="#1E3A8A" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="12" cy="10" r="1.2" fill="#F59E0B" />
            <path d="M12 16V22" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
            <defs>
              <linearGradient id="peacockGradientCompact" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="0.4" stopColor="#0D9488" />
                <stop offset="0.8" stopColor="#1E3A8A" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <span className="text-xs font-bold text-emerald-300 pointer-events-none flex items-center gap-1">
          {isDusting ? "🪶 Dusting Makhan..." : "🪶 Fresh Makhan Dusted"}
        </span>

        {/* Dynamic Compact Sparkles */}
        {showSparkles && (
          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950/25 to-slate-950 border border-amber-500/30 p-4 shadow-xl transition-all ${className}`}
    >
      {/* Ambient Ghee Glow */}
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Matki & Peacock Feather Visual Stage */}
        <div className="flex items-center gap-4">
          <div className="relative w-18 h-18 flex items-center justify-center bg-slate-900/90 rounded-2xl border border-amber-500/40 p-2.5 shadow-inner matki-ghee-glow">
            {/* Matki Clay Pot SVG */}
            <svg className="w-13 h-13 text-amber-600 transition-transform duration-300" viewBox="0 0 64 64" fill="none">
              {/* Pot Body */}
              <path
                d="M16 28C16 18 20 14 32 14C44 14 48 18 48 28C48 42 44 54 32 54C20 54 16 42 16 28Z"
                fill="url(#matkiClayGradient)"
                stroke="#B45309"
                strokeWidth="2"
              />
              {/* Rim */}
              <ellipse cx="32" cy="16" rx="14" ry="4" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
              {/* Desi Makhan White Mound */}
              <path
                d="M20 16C20 12 24 10 32 10C40 10 44 12 44 16C44 18 38 21 32 21C26 21 20 18 20 16Z"
                fill="#FFFBEB"
                stroke="#FEF3C7"
                strokeWidth="1.2"
                className={`transition-transform duration-500 origin-bottom ${isDusting ? "scale-125" : "scale-100"}`}
              />
              <circle cx="28" cy="14" r="2" fill="#FEF08A" />
              <circle cx="34" cy="13" r="1.5" fill="#FEF08A" />

              <defs>
                <linearGradient id="matkiClayGradient" x1="32" y1="14" x2="32" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B" />
                  <stop offset="0.6" stopColor="#B45309" />
                  <stop offset="1" stopColor="#78350F" />
                </linearGradient>
              </defs>
            </svg>

            {/* Peacock Feather Spring Overlay */}
            <div
              className={`absolute top-[-4px] right-[-4px] transform origin-bottom-left pointer-events-none transition-all duration-300 ${
                isDusting ? "peacock-spring-active z-30" : "rotate-[-8deg] hover:rotate-[6deg] hover:scale-110"
              }`}
            >
              <svg className="w-11 h-11 drop-shadow-[0_0_10px_rgba(16,185,129,0.75)]" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 2C16 2 24 8 24 16C24 21 21 24 16 30C11 24 8 21 8 16C8 8 16 2 16 2Z"
                  fill="url(#featherIridescence)"
                  stroke={tokens.personaSpec.featherBorder}
                  strokeWidth="1.2"
                />
                {/* Peacock Eye Pattern */}
                <ellipse cx="16" cy="14" rx="4.5" ry="5.5" fill="#1E3A8A" stroke="#06B6D4" strokeWidth="1" />
                <circle cx="16" cy="14" r="2.2" fill="#F59E0B" />
                <circle cx="16" cy="14" r="1" fill="#FEF08A" />
                <path d="M16 22V30" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
                <defs>
                  <linearGradient id="featherIridescence" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="0.4" stopColor="#06B6D4" />
                    <stop offset="0.8" stopColor="#1E3A8A" />
                    <stop offset="1" stopColor="#FBBF24" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Dynamic Particle Sparkles Burst */}
            {showSparkles &&
              particles.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const px = Math.cos(rad) * p.distance;
                const py = Math.sin(rad) * p.distance;
                return (
                  <span
                    key={p.id}
                    className="makhan-particle-sparkle"
                    style={
                      {
                        left: "50%",
                        top: "50%",
                        color: p.color,
                        fontSize: `${p.size}px`,
                        "--px": `${px}px`,
                        "--py": `${py}px`,
                      } as React.CSSProperties
                    }
                  >
                    {p.icon}
                  </span>
                );
              })}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Mor-Pankh Micro-Interaction
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/30">
                Fresh Makhan #{dustCount}
              </span>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5 flex items-center gap-1.5">
              Peacock Feather <span className="text-amber-300">Desi Makhan Dusting</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Selecting <strong className="text-emerald-400">Standard Thali</strong> triggers our signature Mor-Pankh dusting, topping your phulke with authentic home-crafted white butter.
            </p>
          </div>
        </div>

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerDusting();
          }}
          disabled={isDusting}
          className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
            isDusting
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 hover:scale-105"
          }`}
        >
          {isDusting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dusting Makhan...</span>
            </>
          ) : (
            <>
              <span>🪶 Re-dust Fresh Butter</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
