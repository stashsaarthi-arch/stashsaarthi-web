import React from "react";
import {
  MEAL_PERSONALIZATION_OPTIONS,
  calculatePersonalizationTotal,
  MealPersonalization,
} from "@/lib/mealPersonalization";
import { useLanguage } from "@/context/LanguageContext";
import { playPop, playClick } from "@/lib/audio";
import { Check, Sparkles, SlidersHorizontal, Info } from "lucide-react";

interface MealPersonalizationSelectorProps {
  selectedIds: string[];
  onChange: (selectedIds: string[], totalDelta: number) => void;
  compact?: boolean;
}

export const MealPersonalizationSelector: React.FC<MealPersonalizationSelectorProps> = ({
  selectedIds,
  onChange,
  compact = false,
}) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const toggleOption = (id: string) => {
    playPop();
    const isAlreadySelected = selectedIds.includes(id);
    const updated = isAlreadySelected
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    const newTotalDelta = calculatePersonalizationTotal(updated);
    onChange(updated, newTotalDelta);
  };

  const totalDelta = calculatePersonalizationTotal(selectedIds);

  return (
    <div className="space-y-3 rounded-2xl bg-slate-900/80 p-4 border border-white/10 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              {isHi ? "मील पर्सनललाइजेशन (कस्टमाइज़ करें)" : "Meal Personalization Options"}
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                <Sparkles className="h-3 w-3" />
                {isHi ? "अनुकूलित" : "Custom"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isHi
                ? "अपनी पसंद के अनुसार रोटी, चावल, घी और अन्य विकल्प चुनें"
                : "Customize rotis, rice, desi ghee & sides to match your appetite"}
            </p>
          </div>
        </div>

        {totalDelta > 0 && (
          <div className="text-right">
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              +{totalDelta} {isHi ? "रु / टोकन" : "₹ / Tokens"}
            </span>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className={compact ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 sm:grid-cols-2 gap-2.5"}>
        {MEAL_PERSONALIZATION_OPTIONS.map((opt: MealPersonalization) => {
          const isSelected = selectedIds.includes(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={`group relative flex cursor-pointer items-start gap-3 rounded-xl p-3 border transition-all duration-200 ${
                isSelected
                  ? "bg-slate-800/90 border-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]"
                  : "bg-slate-950/60 border-white/10 hover:border-emerald-500/40 hover:bg-slate-900/60"
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isSelected
                    ? "bg-emerald-500 border-emerald-400 text-slate-950"
                    : "border-slate-600 bg-slate-900 text-transparent group-hover:border-emerald-500/50"
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                    {isHi ? opt.nameHi : opt.name}
                  </span>

                  {/* Price Delta Badge */}
                  <span
                    className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      opt.priceDelta === 0
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : isSelected
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 border-white/10"
                    }`}
                  >
                    {opt.priceDelta === 0
                      ? isHi
                        ? "मुफ्त"
                        : "FREE"
                      : `+₹${opt.priceDelta}`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  {isHi ? opt.descriptionHi : opt.description}
                </p>

                {opt.badge && (
                  <span className="mt-1 inline-block text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 uppercase tracking-wide">
                    {isHi ? opt.badgeHi || opt.badge : opt.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3 text-emerald-400" />
          {isHi
            ? "उदाहरण: 'चावल न लें, +2 अतिरिक्त रोटी' केवल ₹5 अतिरिक्त में"
            : "e.g., 'Skip Rice, Extra Roti' for just ₹5 more"}
        </span>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              onChange([], 0);
            }}
            className="text-slate-400 hover:text-emerald-400 underline transition-colors"
          >
            {isHi ? "रीसेट करें" : "Clear Personalizations"}
          </button>
        )}
      </div>
    </div>
  );
};
