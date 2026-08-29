import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Coins, CheckCircle2, IndianRupee, ShieldCheck, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/Card3D";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { HostPayoutCharterModal } from "./HostPayoutCharterModal";

export function HostSimulator({ onBook }: { onBook: () => void }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({
    bedroom: true,
  });

  const [cornerBags, setCornerBags] = useState<number>(10);
  const [dailyTiffins, setDailyTiffins] = useState<number>(8);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const cornerMonthly = useMemo(() => {
    // ₹180 net host payout per bag per month
    return cornerBags * 180;
  }, [cornerBags]);

  const kitchenMonthly = useMemo(() => {
    // ₹55 host payout per meal * 24 delivery days/month
    return dailyTiffins * 55 * 24;
  }, [dailyTiffins]);

  const { totalMonthly, annualIncome } = useMemo(() => {
    let monthly = 0;
    if (selectedOptions["corner"]) monthly += cornerMonthly;
    if (selectedOptions["bedroom"]) monthly += 5225;
    if (selectedOptions["kitchen"]) monthly += kitchenMonthly;
    
    return {
      totalMonthly: monthly,
      annualIncome: monthly * 12,
    };
  }, [selectedOptions, cornerMonthly, kitchenMonthly]);

  const options = t.hostSimulator.options || [];

  return (
    <section id="host-earnings-calculator" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
          {t.hostSimulator.titlePart1}{" "}
          <span className="text-gradient">{t.hostSimulator.titlePart2}</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          {t.hostSimulator.subtitle}
        </p>
      </div>

      <AnimatedContent distance={70} scale={0.98} duration={0.8} ease="power2.out">
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {options.map((opt) => {
            const isSelected = selectedOptions[opt.id];
            return (
              <Card3D key={opt.id} maxTilt={6} className="h-full">
                <div
                  onClick={() => toggleOption(opt.id)}
                  className={`glass glass-hover relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border-2 p-6 transition-all duration-300 ${
                    isSelected ? "border-amber-400/50 bg-amber-400/5" : "border-white/10"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-4 top-4 text-amber-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400" style={{ transform: "translateZ(30px)" }}>
                    {opt.tag}
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-foreground" style={{ transform: "translateZ(40px)" }}>{opt.title}</h3>
                  <div className="text-xs text-muted-foreground mb-4">{t.hostSimulator.space} {opt.space}</div>
                  
                  <div className="mt-auto space-y-3" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.hostSimulator.effort}</span>
                      <span className="font-semibold text-foreground">{opt.effort}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.hostSimulator.capacity}</span>
                      <span className="font-semibold text-foreground text-right">
                        {opt.id === "corner" && isSelected
                          ? `${cornerBags} ${isHi ? "बैग क्षमता" : "Bags Capacity"}`
                          : opt.id === "kitchen" && isSelected 
                          ? `${dailyTiffins} ${isHi ? "दैनिक टिफिन" : "Daily Tiffins"}` 
                          : opt.capacity}
                      </span>
                    </div>

                    {opt.id === "corner" && isSelected && (
                      <div
                        className="mt-3 rounded-xl bg-black/50 p-3 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold mb-2">
                          <span className="text-slate-300">
                            {isHi ? "बैग क्षमता समायोजन:" : "Adjust Bags Space:"}
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/70 rounded-lg px-2 py-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.max(4, b - 2))}
                              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {cornerBags} {isHi ? "बैग" : "Bags"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.min(20, b + 2))}
                              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive 2D Visual Floorplan Grid */}
                        <div className="grid grid-cols-5 gap-1.5 p-2 rounded-lg bg-black/60 border border-white/5 max-h-[85px] overflow-y-auto">
                          {Array.from({ length: cornerBags }).map((_, idx) => (
                            <div
                              key={idx}
                              className="h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-mono text-amber-300 font-bold"
                              title={isHi ? `बैग #${idx + 1}` : `Bag #${idx + 1}`}
                            >
                              🧳
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{isHi ? `स्थान: ${(cornerBags * 1.5).toFixed(0)} वर्ग फुट` : `Area: ${(cornerBags * 1.5).toFixed(0)} sq.ft`}</span>
                          <span className="text-amber-400 font-bold">{isHi ? "₹180/बैग होस्ट शुद्ध आय" : "₹180/bag host net"}</span>
                        </div>
                      </div>
                    )}

                    {opt.id === "kitchen" && isSelected && (
                      <div
                        className="mt-3 rounded-xl bg-black/50 p-3 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-300">
                            {opt.tiffinCountTitle || (isHi ? "दैनिक टिफिन संख्या:" : "Daily Tiffin Count:")}
                          </span>
                          <span className="font-mono font-bold text-amber-400">
                            {dailyTiffins} {opt.tiffinMealsDay || (isHi ? "भोजन/दिन" : "meals/day")}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={15}
                          step={1}
                          value={dailyTiffins}
                          onChange={(e) => setDailyTiffins(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                          <span>2 {isHi ? "भोजन" : "meals"}</span>
                          <span>8 {isHi ? "भोजन" : "meals"}</span>
                          <span>15 {isHi ? "भोजन" : "meals"}</span>
                        </div>
                        <div className="mt-2 text-[10px] text-emerald-400 font-medium">
                          {opt.payoutNote || (isHi ? "⚡ ₹55 प्रति भोजन होस्ट भुगतान (24 दिन/माह)" : "⚡ ₹55 host payout / meal (24 days/mo)")}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 border-t border-white/10 pt-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">
                        {t.hostSimulator.expectedIncome}
                      </div>
                      <div className="text-xl font-bold text-amber-400 font-mono">
                        {opt.id === "corner" && isSelected
                          ? `${inr(cornerMonthly)}${isHi ? "/माह" : "/mo"}`
                          : opt.id === "kitchen" && isSelected 
                          ? `${inr(kitchenMonthly)}${isHi ? "/माह" : "/mo"}` 
                          : opt.incomeRange}
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        <motion.div
          key={annualIncome}
          initial={{ scale: 0.96, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mt-10 mx-auto max-w-2xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-center sm:p-10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)] relative overflow-hidden"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-50 blur-xl animate-[shimmer_3s_infinite]" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-amber-400 sm:text-xs font-bold mb-3">
              <Coins className="h-4 w-4" />
              {t.hostSimulator.annualTitle}
            </div>
            <div className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground flex items-center justify-center gap-2">
              <IndianRupee className="h-8 w-8 sm:h-12 sm:w-12 text-amber-400" />
              {inr(annualIncome)} <span className="text-2xl sm:text-4xl text-muted-foreground">{t.hostSimulator.perYear}</span>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                data-magnetic
                variant="warm"
                size="xl"
                className="w-full sm:w-auto px-8 py-6 text-base cursor-pointer"
                onClick={onBook}
              >
                {t.hostSimulator.cta} ➔
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => setShowPayoutModal(true)}
                className="w-full sm:w-auto px-6 py-6 text-xs sm:text-sm border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-amber-400" />
                {t.hostSimulator.viewPayoutCharter}
              </Button>
            </div>
          </div>
        </motion.div>

        <HostPayoutCharterModal open={showPayoutModal} onOpenChange={setShowPayoutModal} />
      </AnimatedContent>
    </section>
  );
}
