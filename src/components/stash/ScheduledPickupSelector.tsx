import { useState, useEffect } from "react";
import { Clock, Calendar, Truck, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface ScheduledPickupSelection {
  day: "today" | "tomorrow" | "day_after";
  dateLabel: string;
  timeSlot: string;
  formattedString: string;
}

export interface ScheduledPickupSelectorProps {
  onPickupSelect?: (selection: ScheduledPickupSelection) => void;
  initialDay?: "today" | "tomorrow" | "day_after";
  initialSlot?: string;
  className?: string;
}

export const PICKUP_SLOTS = [
  { id: "10am-12pm", label: "10:00 AM - 12:00 PM", badge: "Morning Slot" },
  { id: "12pm-2pm", label: "12:00 PM - 02:00 PM", badge: "Afternoon Slot" },
  { id: "2pm-4pm", label: "02:00 PM - 04:00 PM", badge: "Afternoon Slot" },
  { id: "4pm-6pm", label: "04:00 PM - 06:00 PM", badge: "Popular Peak Slot" },
  { id: "6pm-8pm", label: "06:00 PM - 08:00 PM", badge: "Evening Slot" },
];

export function ScheduledPickupSelector({
  onPickupSelect,
  initialDay = "today",
  initialSlot = "04:00 PM - 06:00 PM",
  className = "",
}: ScheduledPickupSelectorProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "day_after">(initialDay);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialSlot);

  // Compute actual calendar dates dynamically
  const getDateObj = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d;
  };

  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString(isHi ? "hi-IN" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const todayObj = getDateObj(0);
  const tomorrowObj = getDateObj(1);
  const dayAfterObj = getDateObj(2);

  const dayOptions = [
    {
      id: "today" as const,
      tag: isHi ? "आज" : "Today",
      dateStr: formatDateLabel(todayObj),
    },
    {
      id: "tomorrow" as const,
      tag: isHi ? "कल" : "Tomorrow",
      dateStr: formatDateLabel(tomorrowObj),
    },
    {
      id: "day_after" as const,
      tag: isHi ? "परसों" : "Day After",
      dateStr: formatDateLabel(dayAfterObj),
    },
  ];

  useEffect(() => {
    const currentDayObj =
      selectedDay === "today" ? todayObj : selectedDay === "tomorrow" ? tomorrowObj : dayAfterObj;

    const currentDayLabel =
      selectedDay === "today"
        ? isHi ? "आज" : "Today"
        : selectedDay === "tomorrow"
        ? isHi ? "कल" : "Tomorrow"
        : isHi ? "परसों" : "Day After";

    const formatted = `${currentDayLabel} (${formatDateLabel(currentDayObj)}): ${selectedSlot}`;

    onPickupSelect?.({
      day: selectedDay,
      dateLabel: formatDateLabel(currentDayObj),
      timeSlot: selectedSlot,
      formattedString: formatted,
    });
  }, [selectedDay, selectedSlot, language]);

  return (
    <div className={`rounded-2xl border border-emerald-500/30 bg-[#0B1015]/90 p-4 space-y-3.5 shadow-lg ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Truck className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{isHi ? "अनुसूचित डोरस्टेप पिकअप विंडो" : "Scheduled Doorstep Pickup Window"}</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                2-Hr SLA
              </span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {isHi ? "कैंपस रनर के आगमन के लिए 2-घंटे का समय स्लॉट चुनें" : "Select a 2-hour pickup arrival window for campus runner"}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Day Selector */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-emerald-400" />
          <span>{isHi ? "पिकअप तिथि चुनें:" : "Select Pickup Day:"}</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {dayOptions.map((d) => {
            const active = selectedDay === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDay(d.id)}
                className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  active
                    ? "bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <span className={`text-xs ${active ? "text-emerald-300" : "text-slate-300"}`}>
                  {d.tag}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                  {d.dateStr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 2-Hour Window Slot Selector */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{isHi ? "2-घंटे का डिलीवरी समय स्लॉट:" : "2-Hour Delivery Pickup Slot:"}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PICKUP_SLOTS.map((slot) => {
            const active = selectedSlot === slot.label;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.label)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? "bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      active ? "border-emerald-400 bg-emerald-500 text-black" : "border-slate-500"
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-mono">{slot.label}</span>
                </div>
                {slot.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      slot.id === "4pm-6pm"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {slot.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Window Confirmation Callout */}
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {isHi ? "पुष्टि की गई पिकअप विंडो:" : "Confirmed Pickup Window:"}
          </span>
        </div>
        <span className="font-mono font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[11px]">
          {selectedDay === "today"
            ? isHi ? "आज" : "Today"
            : selectedDay === "tomorrow"
            ? isHi ? "कल" : "Tomorrow"
            : isHi ? "परसों" : "Day After"}{" "}
          • {selectedSlot}
        </span>
      </div>
    </div>
  );
}
