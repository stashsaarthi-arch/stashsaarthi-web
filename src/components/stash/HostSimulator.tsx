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
    <div
      id="host-earnings-calculator"
      className="relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20"
    >
      <AnimatedContent distance={40} scale={0.98} duration={0.6} ease="power2.out">
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((opt) => {
            const isSelected = selectedOptions[opt.id];
            return (
              <Card3D key={opt.id} maxTilt={5} className="h-full">
                <div
                  onClick={() => toggleOption(opt.id)}
                  className={`glass glass-hover relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 ${
                    isSelected ? "border-amber-400/50 bg-amber-400/5" : "border-white/10"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3 text-amber-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className="mb-1 text-[9px] font-bold uppercase tracking-wider text-amber-400"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {opt.tag}
                  </div>
                  <h3
                    className="mb-0.5 text-base font-bold text-foreground"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {opt.title}
                  </h3>
                  <div className="text-[11px] text-muted-foreground mb-3">
                    {t.hostSimulator.space} {opt.space}
                  </div>

                  <div className="mt-auto space-y-2" style={{ transform: "translateZ(15px)" }}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t.hostSimulator.effort}</span>
                      <span className="font-semibold text-foreground">{opt.effort}</span>
                    </div>
                    <div className="flex justify-between text-xs">
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
                        className="mt-2 rounded-xl bg-black/50 p-2.5 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-300 text-[11px]">
                            {isHi ? "बैग क्षमता समायोजन:" : "Adjust Bags Space:"}
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/70 rounded-lg px-2 py-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.max(4, b - 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white font-bold">{cornerBags}</span>
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.min(30, b + 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {opt.payoutNote || (isHi ? "⚡ ₹180 प्रति बैग/माह" : "⚡ ₹180 net / bag / mo")}
                        </div>
                      </div>
                    )}

                    {opt.id === "kitchen" && isSelected && (
                      <div
                        className="mt-2 rounded-xl bg-black/50 p-2.5 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-300 text-[11px]">
                            {isHi ? "दैनिक भोजन क्षमता:" : "Daily Meal Target:"}
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/70 rounded-lg px-2 py-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setDailyTiffins((d) => Math.max(2, d - 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white font-bold">{dailyTiffins}</span>
                            <button
                              type="button"
                              onClick={() => setDailyTiffins((d) => Math.min(25, d + 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {opt.payoutNote ||
                            (isHi
                              ? "⚡ ₹55 प्रति भोजन होस्ट भुगतान (24 दिन/माह)"
                              : "⚡ ₹55 host payout / meal (24 days/mo)")}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 border-t border-white/10 pt-3 text-center">
                      <div className="text-xs text-muted-foreground mb-0.5">
                        {t.hostSimulator.expectedIncome}
                      </div>
                      <div className="text-lg font-bold text-amber-400 font-mono">
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
          className="mt-4 mx-auto max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center sm:p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-50 blur-xl animate-[shimmer_3s_infinite]" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1.5">
              <Coins className="h-3.5 w-3.5" />
              {t.hostSimulator.annualTitle}
            </div>
            <div className="text-2xl font-extrabold tracking-tight sm:text-4xl text-foreground flex items-center justify-center gap-1.5">
              <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
              {inr(annualIncome)}{" "}
              <span className="text-lg sm:text-2xl text-muted-foreground">
                {t.hostSimulator.perYear}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                data-magnetic
                variant="warm"
                size="default"
                className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm cursor-pointer"
                onClick={onBook}
              >
                {t.hostSimulator.cta} ➔
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowPayoutModal(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                {t.hostSimulator.viewPayoutCharter}
              </Button>
            </div>
          </div>
        </motion.div>

        <HostPayoutCharterModal open={showPayoutModal} onOpenChange={setShowPayoutModal} />
      </AnimatedContent>
    </div>
  );
}
