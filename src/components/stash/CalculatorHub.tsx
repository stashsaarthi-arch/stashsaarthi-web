import { useState } from "react";
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

  return (
    <section id="calculator" className="relative mx-auto max-w-6xl px-4 py-8 sm:py-12 scroll-mt-20">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-muted-foreground">
          {isHi ? "इंटरएक्टिव बचत व कमाई सिम्युलेटर" : "Interactive Savings & Earnings Engine"}
        </Badge>
        <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
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
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {isHi
            ? "छात्र ₹8,000 तक की बचत कर सकते हैं, और वरिष्ठ मेज़बान ₹11,500+/माह तक कमा सकते हैं।"
            : "Zero guesswork. 100% transparent unit economics for students & senior hosts in Kanpur."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mt-6 flex items-center justify-center">
        <div className="glass flex w-full max-w-md items-center justify-between rounded-full border border-white/10 p-1.5 shadow-xl">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all duration-200 cursor-pointer sm:text-sm ${
              activeTab === "student"
                ? "border border-emerald/40 bg-emerald/15 text-emerald shadow-lg"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>{isHi ? "🎓 छात्र बचत कैलकुलेटर" : "🎓 Student Savings (₹8k Saved)"}</span>
          </button>
          <button
            onClick={() => setActiveTab("host")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all duration-200 cursor-pointer sm:text-sm ${
              activeTab === "host"
                ? "border border-amber/40 bg-amber/15 text-amber shadow-lg"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>{isHi ? "🏡 मेज़बान कमाई सिम्युलेटर" : "🏡 Host Earnings (₹11.5k+/mo)"}</span>
          </button>
        </div>
      </div>

      {/* Simulator View */}
      <div className="mt-4">
        {activeTab === "student" ? (
          <StashCalculator onBook={onBook} />
        ) : (
          <HostSimulator onBook={onBook} />
        )}
      </div>
    </section>
  );
}
