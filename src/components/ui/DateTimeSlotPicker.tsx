import React, { useState, useEffect } from "react";
import { Calendar, Clock, Sparkles, Check, ChevronRight, Zap } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDateTimeSlotPickerTokens } from "@/lib/designTokens";
import { playPop, playClick } from "@/lib/audio";

export interface DateTimeSlotSelection {
  startDate: string;
  endDate: string;
  totalDays: number;
  monthsApprox: number;
  timeSlotId: string;
  presetId?: string;
}

export interface DateTimeSlotPickerProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialTimeSlot?: string;
  onSelectionChange?: (selection: DateTimeSlotSelection) => void;
  className?: string;
}

export function DateTimeSlotPicker({
  initialStartDate,
  initialEndDate,
  initialTimeSlot = "slot_morning",
  onSelectionChange,
  className = "",
}: DateTimeSlotPickerProps) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const tokens = getDateTimeSlotPickerTokens(role);
  const isHost = role === "host";

  // Helper to format date to YYYY-MM-DD
  const formatDateString = (d: Date): string => {
    return d.toISOString().split("T")[0] || "";
  };

  // Helper to add days to a date
  const addDays = (d: Date, days: number): Date => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
  };

  const today = new Date();
  const defaultStart = initialStartDate || formatDateString(addDays(today, 1));
  const defaultEnd = initialEndDate || formatDateString(addDays(today, 72));

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialTimeSlot);
  const [activePreset, setActivePreset] = useState<string | null>("summer_break");

  // Calculate total days between start & end
  const calcTotalDays = (startStr: string, endStr: string): number => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diffTime = e.getTime() - s.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const totalDays = calcTotalDays(startDate, endDate);
  const monthsApprox = +(totalDays / 30).toFixed(1);
  const estimatedDeadRentSavings = Math.round((totalDays / 30) * 8000);

  // Notify parent component on selection changes
  useEffect(() => {
    onSelectionChange?.({
      startDate,
      endDate,
      totalDays,
      monthsApprox,
      timeSlotId: selectedSlot,
      ...(activePreset ? { presetId: activePreset } : {}),
    });
  }, [startDate, endDate, selectedSlot, activePreset, totalDays, monthsApprox, onSelectionChange]);

  const handleSelectPreset = (preset: typeof tokens.holidayPresets[number]) => {
    playPop();
    const newStart = addDays(today, preset.startOffsetDays);
    const newEnd = addDays(newStart, preset.durationDays);
    const startStr = formatDateString(newStart);
    const endStr = formatDateString(newEnd);

    setStartDate(startStr);
    setEndDate(endStr);
    setActivePreset(preset.id);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartDate(val);
    setActivePreset(null);
    if (new Date(val) >= new Date(endDate)) {
      const autoEnd = formatDateString(addDays(new Date(val), 7));
      setEndDate(autoEnd);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEndDate(val);
    setActivePreset(null);
  };

  const handleSlotSelect = (slotId: string) => {
    playClick();
    setSelectedSlot(slotId);
  };

  return (
    <div
      className={`date-time-picker-stage space-y-5 text-foreground ${className}`}
      data-persona={role}
    >
      {/* Header section with icon & title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              isHost
                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold tracking-tight">
              {isHi ? "तारीख एवं पिकअप समय चयन" : "Select Storage Dates & Pickup Slot"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isHi
                ? "कैंपस छुट्टियों के टिप्स का उपयोग करें या अपनी तारीखें दर्ज करें"
                : "Touch campus holiday chips or pick custom date range"}
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
            isHost
              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          }`}
        >
          {totalDays} {isHi ? "दिन" : "Days"} (~{monthsApprox} {isHi ? "माह" : "Mo"})
        </span>
      </div>

      {/* Campus Holiday Presets Chips Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className={`h-3.5 w-3.5 ${isHost ? "text-amber-400" : "text-emerald-400"}`} />
            {isHi ? "कैंपस अवकाश प्रीसेट (त्वरित चयन)" : "Campus Holiday Presets (1-Tap)"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {isHi ? "ऑटो-फिल तारीखें" : "Auto-fills date range"}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tokens.holidayPresets.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`preset-holiday-chip ${
                  isActive ? "preset-holiday-chip-active" : ""
                }`}
                title={isHi ? preset.subHi : preset.subEn}
              >
                <span>{preset.icon}</span>
                <div className="flex flex-col text-left">
                  <span>{isHi ? preset.nameHi : preset.nameEn}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    {isHi ? preset.badgeHi : preset.badgeEn} • {preset.durationDays}d
                  </span>
                </div>
                {isActive && <Check className="h-3.5 w-3.5 stroke-[3] ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Touch-Optimized Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {isHi ? "स्टोरेज प्रारंभ तारीख (पिकअप)" : "Storage Start Date (Pickup)"}
          </label>
          <input
            type="date"
            min={formatDateString(today)}
            value={startDate}
            onChange={handleStartChange}
            className={`w-full min-h-[48px] px-3 py-2 rounded-xl bg-white/5 border text-sm font-mono text-foreground focus:outline-none transition ${
              isHost
                ? "border-amber-500/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                : "border-emerald-500/30 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            }`}
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {isHi ? "स्टोरेज समाप्ति तारीख (वापसी)" : "Storage End Date (Return)"}
          </label>
          <input
            type="date"
            min={startDate || formatDateString(today)}
            value={endDate}
            onChange={handleEndChange}
            className={`w-full min-h-[48px] px-3 py-2 rounded-xl bg-white/5 border text-sm font-mono text-foreground focus:outline-none transition ${
              isHost
                ? "border-amber-500/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                : "border-emerald-500/30 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            }`}
          />
        </div>
      </div>

      {/* Time Slot Selection Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className={`h-3.5 w-3.5 ${isHost ? "text-amber-400" : "text-emerald-400"}`} />
            {isHi ? "पिकअप समय स्लॉट चयन" : "Doorstep Pickup Time Slot"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {isHi ? "फ्री होम डिलीवरी" : "Free Doorstep Pickup"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {tokens.timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <div
                key={slot.id}
                onClick={() => handleSlotSelect(slot.id)}
                className={`time-slot-card ${isSelected ? "time-slot-card-active" : ""}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleSlotSelect(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{slot.icon}</span>
                    <div>
                      <div className="text-xs font-bold font-mono">
                        {isHi ? slot.labelHi : slot.labelEn}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {isHi ? slot.badgeHi : slot.badgeEn} • {isHi ? slot.trafficHi : slot.trafficEn}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center border transition ${
                      isSelected
                        ? isHost
                          ? "bg-amber-500 text-black border-amber-400"
                          : "bg-emerald-500 text-black border-emerald-400"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Callout Banner */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
          isHost
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        }`}
      >
        <div className="space-y-0.5">
          <div className="font-bold flex items-center gap-1.5">
            <Zap className="h-4 w-4 shrink-0 fill-current" />
            <span>
              {isHi
                ? `कुल अवधि: ${totalDays} दिन (${monthsApprox} महीना)`
                : `Total Duration: ${totalDays} Days (~${monthsApprox} Months)`}
            </span>
          </div>
          <p className="text-[11px] opacity-80">
            {isHi
              ? `कमरा खाली करके ₹${estimatedDeadRentSavings.toLocaleString()} डेड-रेंट की बचत संभव!`
              : `Vacating PG saves ~₹${estimatedDeadRentSavings.toLocaleString()} in wasted dead rent!`}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold font-mono underline shrink-0">
          <span>{isHi ? "लॉक रेट ₹300/माह" : "Locked Rate ₹300/mo"}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
