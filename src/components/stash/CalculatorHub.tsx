import { useState, useEffect, memo } from "react";
import { Calculator, TrendingUp, Sparkles, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StashCalculator } from "./Calculator";
import { HostSimulator } from "./HostSimulator";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { playPop, playTab } from "@/lib/audio";
import type { OpenBooking } from "./types";

export const CalculatorHub = memo(function CalculatorHub({ onBook }: { onBook: OpenBooking }) {
  const { role } = usePersona();
  const [activeTab, setActiveTab] = useState<"student" | "host">(role);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const renderCalculatorContent = () => (
    <>
      {/* Mode Switcher */}
      <div className="mt-3 flex items-center justify-center">
        <div
          role="tablist"
          aria-label={isHi ? "कैलकुलेटर मोड चुनें" : "Calculator Mode Selector"}
          className="glass flex w-full max-w-xl items-center justify-between rounded-full border border-white/10 p-1 shadow-lg"
        >
          <button
            id="calc-tab-student"
            role="tab"
            aria-selected={activeTab === "student"}
            aria-controls="calc-panel-student"
            tabIndex={activeTab === "student" ? 0 : -1}
            onClick={() => {
              playTab();
              setActiveTab("student");
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                setActiveTab("host");
                document.getElementById("calc-tab-host")?.focus();
              }
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              activeTab === "student"
                ? "border border-emerald/40 bg-emerald/15 text-emerald shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {isHi ? "🎓 छात्र बचत" : "🎓 Student Savings"}
              <span className="hidden sm:inline"> (₹8k Saved)</span>
            </span>
          </button>
          <button
            id="calc-tab-host"
            role="tab"
            aria-selected={activeTab === "host"}
            aria-controls="calc-panel-host"
            tabIndex={activeTab === "host" ? 0 : -1}
            onClick={() => {
              playTab();
              setActiveTab("host");
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                setActiveTab("student");
                document.getElementById("calc-tab-student")?.focus();
              }
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === "host"
                ? "border border-amber/40 bg-amber/15 text-amber shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {isHi ? "🏡 मेज़बान कमाई" : "🏡 Host Earnings"}
              <span className="hidden sm:inline"> (₹11.5k+/mo)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Simulator View */}
      <div
        role="tabpanel"
        id={`calc-panel-${activeTab}`}
        aria-labelledby={`calc-tab-${activeTab}`}
        tabIndex={0}
        className="mt-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-2xl"
      >
        {activeTab === "student" ? (
          <StashCalculator onBook={(p) => {
            setIsDrawerOpen(false);
            onBook(p);
          }} />
        ) : (
          <HostSimulator onBook={(p) => {
            setIsDrawerOpen(false);
            onBook(p);
          }} />
        )}
      </div>
    </>
  );

  return (
    <section
      id="calculator"
      className="relative mx-auto max-w-6xl px-4 py-2 sm:py-5 scroll-mt-20"
    >
      {/* ── Mobile Compact Teaser Micro-Card (< md) — Eliminates 1,200px of scroll ── */}
      <div className="block md:hidden">
        <div className="glass relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/[0.08] via-teal-500/[0.04] to-transparent p-3.5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                  <Sparkles className="h-2.5 w-2.5" />
                  {isHi ? "100% सटीक बचत कैलकुलेटर" : "Instant Savings Engine"}
                </span>
              </div>
              <h3 className="mt-1 text-sm font-extrabold text-white truncate">
                {isHi ? "बचत और कमाई का त्वरित हिसाब" : "Savings & Passive Income Simulator"}
              </h3>
              <p className="text-[10.5px] text-muted-foreground mt-0.5 truncate">
                {isHi
                  ? "छात्र ₹8,400 बचाएँ · मेज़बान ₹11,500+/माह कमाएँ"
                  : "Students save ~₹8,400 · Hosts earn ₹11.5k+/mo"}
              </p>
            </div>
            <Button
              type="button"
              variant={isStudent ? "hero" : "warm"}
              size="sm"
              onClick={() => {
                playPop();
                setIsDrawerOpen(true);
              }}
              className="shrink-0 h-10 px-3.5 text-xs font-black shadow-lg cursor-pointer"
            >
              <span>{isHi ? "हिसाब लगाएँ ⚡" : "Calculate ⚡"}</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Slide-Up Bottom Drawer on Mobile */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-white/15 bg-[#0A0D0F]/98 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl focus:outline-none"
          >
            <SheetHeader className="text-left pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base font-extrabold text-white flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-400" />
                  <span>{isHi ? "इंटरएक्टिव बचत व कमाई सिम्युलेटर" : "Savings & Earnings Engine"}</span>
                </SheetTitle>
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                {isHi
                  ? "आईआईटी कानपुर और सीएसजेएमयू कॉरिडोर के लिए वास्तविक गणित।"
                  : "Real Kanpur unit economics for campus students and verified senior hosts."}
              </SheetDescription>
            </SheetHeader>
            <div className="py-3">
              {renderCalculatorContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Desktop Inline Full Display (>= md) ── */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-white/15 bg-white/5 text-[9.5px] sm:text-[11px] text-muted-foreground"
          >
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

        {renderCalculatorContent()}
      </div>
    </section>
  );
});
