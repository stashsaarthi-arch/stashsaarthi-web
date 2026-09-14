import React, { useState, useEffect } from "react";
import { usePersona } from "../../context/PersonaContext";
import { getLuggageItemizerTokens, LUGGAGE_ITEMIZER_TOKENS } from "../../lib/designTokens";
import { playCounterIncrement, playCounterDecrement, playPop } from "../../lib/audio";

export interface LuggageItemSelection {
  [categoryId: string]: number;
}

export interface LuggageItemizerVisualizerProps {
  initialSelection?: LuggageItemSelection;
  onSelectionChange?: (selection: LuggageItemSelection, totalMonthlyPrice: number, totalVolumeLiters: number) => void;
  className?: string;
  showPresets?: boolean;
  showVaultMeter?: boolean;
  showDeadRentSavings?: boolean;
  language?: "en" | "hi";
}

export function LuggageItemizerVisualizer({
  initialSelection = { suitcase: 1, carton: 1 },
  onSelectionChange,
  className = "",
  showPresets = true,
  showVaultMeter = true,
  showDeadRentSavings = true,
  language = "en",
}: LuggageItemizerVisualizerProps) {
  const { role } = usePersona();
  const tokens = getLuggageItemizerTokens(role);
  const isHi = language === "hi";


  const [selection, setSelection] = useState<LuggageItemSelection>(initialSelection);

  // Compute metrics
  const totalItemCount = Object.values(selection).reduce((acc, count) => acc + count, 0);

  const rawMonthlyPrice = tokens.categories.reduce((acc, cat) => {
    const count = selection[cat.id] || 0;
    return acc + cat.monthlyRate * count;
  }, 0);

  const applyDiscount = totalItemCount >= 3;
  const discountAmount = applyDiscount
    ? Math.round((rawMonthlyPrice * tokens.spaceCalculation.multiItemBundleDiscountPercentage) / 100)
    : 0;
  const finalMonthlyPrice = Math.max(0, rawMonthlyPrice - discountAmount);

  const totalVolumeLiters = tokens.categories.reduce((acc, cat) => {
    const count = selection[cat.id] || 0;
    return acc + cat.volumeLiters * count;
  }, 0);

  const vaultCapacityPercentage = Math.min(
    100,
    Math.round((totalVolumeLiters / tokens.spaceCalculation.baseVaultCapacityLiters) * 100)
  );

  const pgDeadRentAvg = tokens.spaceCalculation.deadRentPgMonthlyAvg;
  const estimatedSavings = Math.max(0, pgDeadRentAvg - finalMonthlyPrice);

  // Notify parent on state update
  useEffect(() => {
    onSelectionChange?.(selection, finalMonthlyPrice, totalVolumeLiters);
  }, [selection, finalMonthlyPrice, totalVolumeLiters, onSelectionChange]);

  const updateItemCount = (id: string, delta: number) => {
    setSelection((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (delta > 0) {
        playCounterIncrement(updated);
      } else {
        playCounterDecrement(updated);
      }
      return { ...prev, [id]: updated };
    });
  };

  const applyPreset = (presetItems: Record<string, number>) => {
    playPop();
    setSelection({ ...presetItems });
  };

  const resetSelection = () => {
    playPop();
    setSelection({});
  };

  return (
    <div className={`luggage-itemizer-container ${className}`} data-persona={role}>

      {/* Preset Fast Selection Chips */}
      {showPresets && (
        <div className="flex flex-col gap-2 mb-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-white/60">
              {isHi ? "त्वरित बंडल चयन" : "Quick Bundle Presets"}
            </span>
            {totalItemCount > 0 && (
              <button
                type="button"
                onClick={resetSelection}
                className="text-xs text-white/40 hover:text-red-400 transition-colors cursor-pointer"
              >
                {isHi ? "रीसेट करें" : "Clear All"}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.presets.map((preset) => {
              const isMatch = Object.entries(preset.items).every(
                ([k, v]) => selection[k] === v
              ) && Object.keys(preset.items).length === Object.values(selection).filter((c) => c > 0).length;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.items)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isMatch
                      ? isHi
                        ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        : "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{isHi ? preset.nameHi : preset.nameEn}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-white/70">
                    {isHi ? preset.badgeHi : preset.badgeEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Luggage Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tokens.categories.map((cat) => {
          const count = selection[cat.id] || 0;
          const isActive = count > 0;

          return (
            <div
              key={cat.id}
              className={`luggage-item-card ${isActive ? "luggage-item-card-active" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* 3D Icon Stage with Badge */}
                <div className="luggage-3d-icon-stage">
                  <span>{cat.icon}</span>
                  {isActive && <div className="luggage-count-badge">{count}</div>}
                </div>

                {/* Item Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {isHi ? cat.titleHi : cat.titleEn}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 leading-tight">
                    {isHi ? cat.subtitleHi : cat.subtitleEn}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-mono font-bold ${tokens.accent.text}`}>
                      ₹{cat.monthlyRate}/mo
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {cat.volumeLiters}L • {cat.dimensions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => updateItemCount(cat.id, -1)}
                  disabled={count === 0}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                    count > 0
                      ? "bg-white/10 text-white hover:bg-white/20 active:scale-95 cursor-pointer"
                      : "text-white/20 cursor-not-allowed"
                  }`}
                  aria-label={`Decrease ${cat.titleEn}`}
                >
                  -
                </button>
                <span className="w-5 text-center font-mono font-extrabold text-sm text-white">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => updateItemCount(cat.id, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20 active:scale-95 cursor-pointer transition-all"
                  aria-label={`Increase ${cat.titleEn}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vault Meter & Live Summary */}
      {showVaultMeter && (
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70 font-medium flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{isHi ? "वॉल्ट स्टोरेज क्षमता प्रयोग" : "Host Vault Capacity Usage"}</span>
            </span>
            <span className="font-mono font-bold text-white">
              {totalVolumeLiters}L / {tokens.spaceCalculation.baseVaultCapacityLiters}L ({vaultCapacityPercentage}%)
            </span>
          </div>

          <div className="luggage-vault-meter">
            <div
              className="luggage-vault-meter-fill"
              style={{ width: `${vaultCapacityPercentage}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white/60">
                {isHi ? "कुल सामान:" : "Total Items:"}{" "}
                <strong className="text-white">{totalItemCount}</strong>
              </span>
              {applyDiscount && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                  🎁 {tokens.spaceCalculation.multiItemBundleDiscountPercentage}% {isHi ? "बंडल छूट लागू" : "Bundle Saver Applied"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-white/60">{isHi ? "मासिक किराया:" : "Monthly Stash Fee:"}</span>
              <span className={`text-base font-extrabold font-mono ${tokens.accent.text}`}>
                ₹{finalMonthlyPrice}/mo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dead Rent Savings Comparison Banner */}
      {showDeadRentSavings && totalItemCount > 0 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-lg text-emerald-400">
              💡
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-300">
                {isHi ? "खाली पीजी किराया बचत:" : "Dead PG Rent Savings"}
              </span>
              <span className="text-[11px] text-emerald-100/70">
                {isHi
                  ? `आप बिना वजह PG किराया (₹${pgDeadRentAvg}/माह) देने से बच रहे हैं!`
                  : `Avoiding ₹${pgDeadRentAvg}/mo dead PG rent during break`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-white/50">{isHi ? "शुद्ध बचत" : "Net Saved"}</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              ₹{estimatedSavings}/mo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
