import { useState, useEffect } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StashCalculator } from "./Calculator";
import { HostSimulator } from "./HostSimulator";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import type { OpenBooking } from "./types";

export function CalculatorHub({ onBook }: { onBook: OpenBooking }) {
  const { role } = usePersona();
  const [activeTab, setActiveTab] = useState<"student" | "host">(role);
  const { language } = useLanguage();
  const isHi = language === "hi";
  const isStudent = activeTab === "student";

  // Sync with global role changes
  useEffect(() => {
    setActiveTab(role);
  }, [role]);

  // Listen for specific deep navigation events
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "student" || detail === "host") {
        setActiveTab(detail);
      }
    };
    window.addEventListener("stashsaarthi-calculator-tab", handleTabChange);
    return () => window.removeEventListener("stashsaarthi-calculator-tab", handleTabChange);
  }, []);

  return (
    <section id="calculator" className="relative mx-auto max-w-6xl px-4 py-3.5 sm:py-5 scroll-mt-20">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-[9.5px] sm:text-[11px] text-muted-foreground">
          {isHi ? "इंटरएक्टिव बचत व कमाई सिम्युलेटर" : "Interactive Savings & Earnings Engine"}
        </Badge>
        <h2 className="mt-1.5 text-balance text-lg font-extrabold tracking-tight sm:text-2xl">
          {isHi ? (
            <>
              अपनी <span className="text-gradient">बचत और कमाई</span> का तुरंत हिसाब लगाएँ
            </>
          ) : (
            <>
              Calculate Your <span className="text-gradient">Savings & Passive Income</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
          {isHi
            ? "छात्र ₹8,000 तक की बचत कर सकते हैं, और वरिष्ठ मेज़बान ₹11,500+/माह तक कमा सकते हैं।"
            : "Zero guesswork. 100% transparent unit economics for students & senior hosts in Kanpur."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mt-3 flex items-center justify-center">
        <div className="glass flex w-full max-w-xl items-center justify-between rounded-full border border-white/10 p-1 shadow-lg">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "student"
                ? "border border-emerald/40 bg-emerald/15 text-emerald shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5 shrink-0" />
            <span>
              {isHi ? "🎓 छात्र बचत" : "🎓 Student Savings"}
              <span className="hidden sm:inline"> (₹8k Saved)</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("host")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "host"
                ? "border border-amber/40 bg-amber/15 text-amber shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0" />
            <span>
              {isHi ? "🏡 मेज़बान कमाई" : "🏡 Host Earnings"}
              <span className="hidden sm:inline"> (₹11.5k+/mo)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Simulator View */}
      <div className="mt-2.5">
        {activeTab === "student" ? (
          <StashCalculator onBook={onBook} />
        ) : (
          <HostSimulator onBook={onBook} />
        )}
      </div>
    </section>
  );
}
