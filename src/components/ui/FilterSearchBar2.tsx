import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  RotateCcw,
  Navigation,
  ArrowUpDown,
  Check,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { getFilterSearchBarTokens } from "@/lib/designTokens";
import { playPop, playClick } from "@/lib/audio";

export interface FilterSearchBar2Props {
  query: string;
  onQueryChange: (q: string) => void;
  maxDistanceKm: number;
  onMaxDistanceKmChange: (dist: number) => void;
  activeFilterTag: string;
  onFilterTagChange: (tagId: string) => void;
  sortOption: string;
  onSortOptionChange: (sortId: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function FilterSearchBar2({
  query,
  onQueryChange,
  maxDistanceKm,
  onMaxDistanceKmChange,
  activeFilterTag,
  onFilterTagChange,
  sortOption,
  onSortOptionChange,
  onResetFilters,
  className = "",
}: FilterSearchBar2Props) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isHost = role === "host";
  const inputRef = useRef<HTMLInputElement>(null);

  const tokens = getFilterSearchBarTokens(role);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut listener ('/' or 'Ctrl+K' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasActiveFilters =
    query.trim() !== "" ||
    maxDistanceKm < tokens.distanceSlider.maxKm ||
    activeFilterTag !== "all" ||
    sortOption !== "distance";

  const handleChipSelect = (chipQuery: string) => {
    playPop();
    onQueryChange(chipQuery);
  };

  const handleTagClick = (tagId: string) => {
    playClick();
    onFilterTagChange(tagId);
  };

  const handleReset = () => {
    playPop();
    onQueryChange("");
    onMaxDistanceKmChange(tokens.distanceSlider.maxKm);
    onFilterTagChange("all");
    onSortOptionChange("distance");
    if (onResetFilters) onResetFilters();
  };

  return (
    <div className={`w-full filter-search-bar-stage p-3 sm:p-4 border ${className}`}>
      {/* Primary Search Input Row */}
      <div className="relative flex items-center gap-2">
        <div
          className={`relative flex flex-1 items-center rounded-xl bg-white/5 px-3.5 py-2.5 sm:px-4 sm:py-3 border transition-all duration-200 ${
            isFocused
              ? isHost
                ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                : "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <Search
            className={`h-5 w-5 shrink-0 transition-colors ${
              isHost ? "text-amber-400" : "text-emerald-400"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              isHi
                ? "कैंपस नोड, पिनकोड या लैंडमार्क खोजें (जैसे 208016, आईआईटी, काकादेव)..."
                : "Search campus node, pincode, or landmark (e.g., 208016, IIT, Kakadeo)..."
            }
            className="w-full bg-transparent px-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none border-none focus:ring-0"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                playPop();
                onQueryChange("");
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isHi ? "खोज साफ़ करें" : "Clear search"}
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              <span className="text-xs">/</span>
            </kbd>
          )}
        </div>

        {/* Toggle Filters Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            setShowAdvancedFilters(!showAdvancedFilters);
          }}
          className={`flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            showAdvancedFilters || maxDistanceKm < tokens.distanceSlider.maxKm
              ? isHost
                ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                : "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden xs:inline">{isHi ? "फ़िल्टर" : "Filters"}</span>
          {maxDistanceKm < tokens.distanceSlider.maxKm && (
            <span
              className={`h-2 w-2 rounded-full ${isHost ? "bg-amber-400" : "bg-emerald-400"}`}
            />
          )}
        </button>
      </div>

      {/* Auto-Suggest Chips Strip */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          {isHi ? "त्वरित सुझाव:" : "Quick Auto-Suggest:"}
        </span>
        {tokens.autoSuggestChips.map((chip) => {
          const isActive = query.includes(chip.query);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleChipSelect(chip.query)}
              className={`auto-suggest-chip-pill inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? isHost
                    ? "bg-amber-500/25 border-amber-500/50 text-amber-200"
                    : "bg-emerald-500/25 border-emerald-500/50 text-emerald-200"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>{isHi ? chip.labelHi : chip.labelEn}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                {chip.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expandable Distance Slider & Advanced Controls Drawer */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mt-4 pt-3 border-t border-white/10 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Distance Slider */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                    {isHi ? "कैंपस दायरा (Distance Slider)" : "Campus Distance Radius"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold ${
                      isHost
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    ≤ {maxDistanceKm.toFixed(1)} km
                  </span>
                </div>
                <input
                  type="range"
                  min={tokens.distanceSlider.minKm}
                  max={tokens.distanceSlider.maxKm}
                  step={tokens.distanceSlider.stepKm}
                  value={maxDistanceKm}
                  onChange={(e) => onMaxDistanceKmChange(parseFloat(e.target.value))}
                  className="w-full distance-slider-range h-1.5 rounded-lg bg-slate-700 outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.1 km ({isHi ? "निकटतम" : "Closest"})</span>
                  <span>2.5 km ({isHi ? "औसत" : "Avg"})</span>
                  <span>5.0 km ({isHi ? "अधिकतम" : "Max"})</span>
                </div>
              </div>

              {/* Sort Selector */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-emerald-400" />
                  {isHi ? "क्रमबद्ध करें (Sort By)" : "Sort Nodes By"}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {tokens.sortOptions.map((opt) => {
                    const isSelected = sortOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          playClick();
                          onSortOptionChange(opt.id);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                          isSelected
                            ? isHost
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold"
                              : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                            : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{isHi ? opt.labelHi : opt.labelEn}</span>
                        {isSelected && <Check className="h-3 w-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Filter Category Tags */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                {isHi ? "लाइव फ़िल्टर टैग:" : "Live Instant Filters:"}
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tokens.liveFilterTags.map((tag) => {
                  const isActive = activeFilterTag === tag.id;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagClick(tag.id)}
                      className={`live-filter-tag-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? isHost
                            ? "bg-amber-500/25 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                            : "bg-emerald-500/25 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                          : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{tag.icon}</span>
                      <span>{isHi ? tag.labelHi : tag.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Actions Footer */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isHi ? "सभी फ़िल्टर रीसेट करें" : "Reset All Filters"}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
