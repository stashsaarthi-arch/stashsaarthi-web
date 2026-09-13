import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, ShieldCheck, ArrowRight, Sparkles, IndianRupee, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPop } from "@/lib/audio";
import { useLanguage } from "@/context/LanguageContext";
import type { OpenBooking } from "./types";

interface InteractiveValueSwitcherProps {
  onBook?: OpenBooking;
  compact?: boolean;
}

type ViewMode = "contrast" | "dead_rent" | "saarthi_stash";

const DURATION_PRESETS = [
  { days: 30, months: 1, label: "1 Month Break", labelHi: "1 माह छुट्टी", deadRent: 4000 },
  { days: 60, months: 2, label: "2 Month Vacation", labelHi: "2 माह वेकेशन", deadRent: 8000 },
  { days: 90, months: 3, label: "Summer Break (3 Mo)", labelHi: "समर ब्रेक (3 माह)", deadRent: 12000 },
];

export const InteractiveValueSwitcher = memo(function InteractiveValueSwitcher({
  onBook,
  compact = false,
}: InteractiveValueSwitcherProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activePresetIndex, setActivePresetIndex] = useState<number>(1); // Default: 2 Month Vacation (₹8,000)
  const [bags, setBags] = useState<number>(2);
  const [viewMode, setViewMode] = useState<ViewMode>("contrast");

  const currentPreset = DURATION_PRESETS[activePresetIndex];
  const monthlyStorageRatePerBag = 300;
  const stashTotal = bags * currentPreset.months * monthlyStorageRatePerBag;
  const deadRentTotal = currentPreset.deadRent;
  const netSavings = Math.max(0, deadRentTotal - stashTotal);
  const savingsPercent = deadRentTotal > 0 ? Math.round((netSavings / deadRentTotal) * 100) : 0;

  const handleModeChange = (mode: ViewMode) => {
    playPop();
    setViewMode(mode);
  };

  const handlePresetSelect = (index: number) => {
    playPop();
    setActivePresetIndex(index);
  };

  const handleBagsChange = (newBags: number) => {
    playPop();
    setBags(newBags);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0A0D0F]/90 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

        {/* Header & Mode Switcher Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                <Sparkles className="h-3 w-3" />
                {isHi ? "इंटरएक्टिव वैल्यू स्विच " : "Interactive Value Switcher"}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {isHi ? "तत्काल बचत तुलना" : "Instant Savings Contrast"}
              </span>
            </div>
            <h3 className="mt-1 text-base sm:text-lg font-bold text-white tracking-tight">
              {isHi ? (
                <>
                  <span className="text-rose-400">₹8,000 डेड रेंट बर्बादी</span> बनाम{" "}
                  <span className="text-emerald-400">सारथी स्टैश ₹300/माह</span>
                </>
              ) : (
                <>
                  <span className="text-rose-400">Wasting ₹8,000 Dead Rent</span> vs{" "}
                  <span className="text-emerald-400">Saarthi Stash ₹300/mo</span>
                </>
              )}
            </h3>
          </div>

          {/* View Mode Toggle Pill */}
          <div className="inline-flex rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => handleModeChange("contrast")}
              className={`flex-1 sm:flex-initial rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "contrast"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {isHi ? "⚡ साइड-बाय-साइड तुलना" : "⚡ Contrast View"}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("dead_rent")}
              className={`flex-1 sm:flex-initial rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "dead_rent"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {isHi ? "💸 डेड रेंट" : "💸 Dead Rent"}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("saarthi_stash")}
              className={`flex-1 sm:flex-initial rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "saarthi_stash"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {isHi ? "🛡️ सारथी स्टैश" : "🛡️ Saarthi Stash"}
            </button>
          </div>
        </div>

        {/* Duration Presets & Bag Stepper Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* Duration Presets */}
          <div>
            <span className="block text-[11px] font-mono text-muted-foreground mb-1.5">
              {isHi ? "छुट्टी की अवधि चुनें:" : "Select Vacation Duration:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_PRESETS.map((preset, idx) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(idx)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                    activePresetIndex === idx
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isHi ? preset.labelHi : preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bags Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-medium text-slate-300">
              {isHi ? "सामान बैग संख्या:" : "Luggage Bags:"}
            </span>
            <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/40 p-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleBagsChange(num)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                    bags === num
                      ? "bg-emerald-400 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Comparison Cards */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Card 1: Traditional PG Dead Rent Wastage */}
          {(viewMode === "contrast" || viewMode === "dead_rent") && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col justify-between rounded-xl border border-rose-500/40 bg-gradient-to-b from-rose-950/30 to-black/80 p-4 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isHi ? "पारंपरिक खाली पीजी (डेडेड रेंट)" : "Traditional Empty PG (Dead Rent)"}
                  </span>
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300 border border-rose-500/30">
                    {isHi ? "पैसे की बर्बादी" : "Money Wasted"}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {isHi ? "खाली कमरे का किराया (100% वेस्ट):" : "Empty Room Rent (100% Wasted):"}
                  </div>
                  <div className="text-3xl font-black text-rose-400 font-mono tracking-tight mt-0.5">
                    ₹{deadRentTotal.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-rose-300/80 font-medium mt-1">
                    {isHi
                      ? `खाली कमरे का ₹${(deadRentTotal / currentPreset.months).toLocaleString("en-IN")}/माह बिना किसी उपयोग के भुगतान`
                      : `Paying ₹${(deadRentTotal / currentPreset.months).toLocaleString("en-IN")}/mo for an empty room while at home`}
                  </div>
                </div>

                {/* Drawback Checklist */}
                <ul className="mt-4 space-y-2 border-t border-rose-500/20 pt-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{isHi ? "8,000+ रुपये की सीधी आर्थिक चपत" : "₹8,000+ total cash loss during vacation"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{isHi ? "मकान मालिक का लगातार किराया दबाव" : "Strict rent payment deadlines with zero usage"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{isHi ? "चोरी या सीलन का डर" : "Risk of theft, dampness & pest damage"}</span>
                  </li>
                </ul>
              </div>

              {/* Red Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-mono text-rose-300 mb-1">
                  <span>{isHi ? "लागत अनुपात:" : "Cost Burden:"}</span>
                  <span>100% {isHi ? "बर्बादी" : "Wastage"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Card 2: Saarthi Micro-Storage (StashSaarthi) */}
          {(viewMode === "contrast" || viewMode === "saarthi_stash") && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col justify-between rounded-xl border border-emerald-400/50 bg-gradient-to-b from-emerald-950/40 via-emerald-950/20 to-black/90 p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    {isHi ? "सारथी माइक्रो-स्टोरेज" : "Saarthi Micro-Storage"}
                  </span>
                  <span className="rounded bg-emerald-400 text-black px-2 py-0.5 font-mono text-[10px] font-black shadow-sm">
                    ₹300/{isHi ? "बैग/माह" : "bag/mo"}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {isHi ? "कुल स्टैश लागत:" : "Total Storage Cost:"}
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                      ₹{stashTotal.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      {isHi ? `बचत ₹${netSavings.toLocaleString("en-IN")} (${savingsPercent}%)` : `Saves ₹${netSavings.toLocaleString("en-IN")} (${savingsPercent}%)`}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300/90 font-medium mt-1">
                    {isHi
                      ? `${bags} बैग × ${currentPreset.months} माह @ ₹300/माह`
                      : `${bags} bag${bags > 1 ? "s" : ""} × ${currentPreset.months} mo @ ₹300/bag/mo`}
                  </div>
                </div>

                {/* Advantages Checklist */}
                <ul className="mt-4 space-y-2 border-t border-emerald-500/20 pt-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{isHi ? "100% लेजर बारकोड और टैम्पर-प्रूफ सील" : "100% Laser barcode tamper-proof seal"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{isHi ? "₹10,000 का सुरक्षा बीमा कवर" : "₹10,000 Property & Theft Safety Cover"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{isHi ? "सत्यापित वरिष्ठ नागरिक होस्ट वॉल्ट" : "Verified senior host neighborhood vault"}</span>
                  </li>
                </ul>
              </div>

              {/* Green Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-mono text-emerald-300 mb-1">
                  <span>{isHi ? "लागत तुलना:" : "Cost Ratio:"}</span>
                  <span>{100 - savingsPercent}% {isHi ? "केवल" : "Only"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(10, 100 - savingsPercent)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Savings Callout & Action Bar */}
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-black/80 to-emerald-950/60 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-black font-black text-lg shadow-lg">
              ₹
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {isHi ? (
                  <>
                    शुद्ध बचत: <span className="text-emerald-400 font-mono text-sm sm:text-base">₹{netSavings.toLocaleString("en-IN")}</span> ({savingsPercent}% सीधा फायदा!)
                  </>
                ) : (
                  <>
                    Net Cash Saved: <span className="text-emerald-400 font-mono text-sm sm:text-base">₹{netSavings.toLocaleString("en-IN")}</span> ({savingsPercent}% Instant Savings!)
                  </>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {isHi ? "शून्य ब्रोकरेज • शून्य हिडन चार्ज • 2 मिनट में बुकिंग" : "Zero Deposit • Zero Hidden Charges • 2-Min Booking"}
              </div>
            </div>
          </div>

          <Button
            data-magnetic
            variant="heroMint"
            size="default"
            onClick={() => {
              playPop();
              if (onBook) {
                onBook({
                  service: "stash",
                  bags,
                  months: currentPreset.months,
                  amount: stashTotal,
                  note: `Value Switcher: ${bags} bags for ${currentPreset.months} mo. Saves ₹${netSavings.toLocaleString("en-IN")}`,
                });
              } else {
                const calcEl = document.getElementById("student-calculator");
                if (calcEl) calcEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold shadow-lg group cursor-pointer"
          >
            <span>{isHi ? `₹${netSavings.toLocaleString("en-IN")} बचत लॉक करें` : `Lock ₹${netSavings.toLocaleString("en-IN")} Savings`}</span>
            <ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
});
