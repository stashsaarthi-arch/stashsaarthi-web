import { useState, useMemo } from "react";
import { motion } from "motion/react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import type { OpenBooking } from "./types";
import { useLanguage } from "@/context/LanguageContext";
import { PackingChecklistModal } from "./PackingChecklistModal";
import { Package, FileText, Printer, ShieldCheck, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function StashCalculator({ onBook }: { onBook?: OpenBooking }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  // 1. Reactive State with Safe Defaults
  const [bags, setBags] = useState<number>(2);
  const [vacationDays, setVacationDays] = useState<number>(45);
  const [monthlyRent, setMonthlyRent] = useState<number>(6000);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const safeBags = Math.max(1, bags || 1);
  const safeDays = Math.max(15, vacationDays || 15);
  const safeRent = Math.max(1000, monthlyRent || 6000);

  // 2. Kanpur Real-World Math Engine (Memoized for 60fps interaction)
  const { vacationMonths, deadRentCost, stashCost, netSavings, savingsPercent } = useMemo(() => {
    // Months fraction (e.g., 45 days = 1.5 months)
    const vMonths = Math.max(0.5, Number((safeDays / 30).toFixed(1)) || 0.5);
    // Traditional Dead Rent burned by student during vacation
    const dCost = Math.round(safeRent * vMonths) || 0;
    // StashSaarthi Cost: ₹300 per bag per month
    const sCost = Math.round(safeBags * 300 * vMonths) || 0;
    // Net In-Pocket Savings
    const nSavings = Math.max(0, dCost - sCost);
    const sPercent = dCost > 0 ? Math.round((nSavings / dCost) * 100) : 0;

    return {
      vacationMonths: vMonths,
      deadRentCost: dCost,
      stashCost: sCost,
      netSavings: nSavings,
      savingsPercent: sPercent,
    };
  }, [safeBags, safeDays, safeRent]);

  return (
    <div id="student-calculator" className="relative mx-auto max-w-5xl px-2 py-2 scroll-mt-20">
      <AnimatedContent distance={30} scale={0.98} duration={0.5} ease="power2.out">
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#0F1318] border border-slate-800 p-4 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            {/* Left Controls Column */}
            <div className="space-y-4">
              {/* Control 1: Bags Count */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="calc-bags-slider"
                    className="text-xs font-medium text-slate-300 cursor-pointer"
                  >
                    {t.calculator.bagsLabel}
                  </label>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {bags} {bags === 1 ? t.calculator.bagUnit : t.calculator.bagsUnit}
                  </span>
                </div>
                <input
                  id="calc-bags-slider"
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={bags}
                  onChange={(e) => setBags(Math.max(1, Number(e.target.value) || 1))}
                  aria-label={
                    isHi ? "स्टोर करने के लिए बैगों की संख्या" : "Number of luggage bags to store"
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>1 {t.calculator.bagUnit}</span>
                  <span>3 {t.calculator.bagsUnit}</span>
                  <span>6 {t.calculator.bagsUnit}</span>
                </div>
              </div>

              {/* Control 2: Vacation Duration */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="calc-days-slider"
                    className="text-xs font-medium text-slate-300 cursor-pointer"
                  >
                    {t.calculator.vacationLabel}
                  </label>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {vacationDays} {t.calculator.daysUnit} ({vacationMonths}{" "}
                    {t.calculator.monthUnit})
                  </span>
                </div>
                <input
                  id="calc-days-slider"
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={vacationDays}
                  onChange={(e) => setVacationDays(Math.max(15, Number(e.target.value) || 15))}
                  aria-label={isHi ? "छुट्टियों की अवधि (दिन)" : "Vacation duration in days"}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>15 {t.calculator.daysUnit}</span>
                  <span>45 {t.calculator.daysUnit}</span>
                  <span>90 {t.calculator.daysUnit}</span>
                </div>
              </div>

              {/* Control 3: Current Monthly PG/Room Rent */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="calc-rent-slider"
                    className="text-xs font-medium text-slate-300 cursor-pointer"
                  >
                    {t.calculator.rentLabel}
                  </label>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    ₹{monthlyRent.toLocaleString("en-IN")}/{t.calculator.monthUnit}
                  </span>
                </div>
                <input
                  id="calc-rent-slider"
                  type="range"
                  min="3000"
                  max="12000"
                  step="500"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(1000, Number(e.target.value) || 3000))}
                  aria-label={
                    isHi ? "वर्तमान मासिक कमरा किराया" : "Current monthly PG or room rent in rupees"
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>₹3,000</span>
                  <span>₹7,500</span>
                  <span>₹12,000</span>
                </div>
              </div>
            </div>

            {/* Right Results & Savings Card */}
            <div className="rounded-xl bg-gradient-to-b from-[#161D24] to-[#0D1115] border border-emerald-500/30 p-4 sm:p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                  {t.calculator.estimatedSavings}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-mono">
                  ₹{netSavings.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-emerald-500/80 font-medium mt-0.5">
                  🎉 {t.calculator.saveCompare.replace("{percent}", String(savingsPercent))}
                </div>

                {/* Visual comparative bar breakdown */}
                <div className="mt-3.5 space-y-2.5 rounded-lg border border-white/10 bg-black/40 p-3">
                  {/* Empty room bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{t.calculator.emptyRentBar}</span>
                      <span className="font-mono font-bold text-rose-400">
                        ₹{deadRentCost.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full"
                        style={{ width: "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* StashSaarthi bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">
                        {t.calculator.stashCostBar.replace("{bags}", String(safeBags))}
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{stashCost.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        animate={{
                          width: `${Math.max(8, deadRentCost > 0 ? (stashCost / deadRentCost) * 100 : 10)}%`,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onBook) {
                      onBook({
                        service: "stash",
                        note: `${safeBags} ${isHi ? "बैग" : "bag"}${safeBags > 1 && !isHi ? "s" : ""} · ${safeDays} ${isHi ? "दिन" : "days"} (${vacationMonths} ${isHi ? "माह" : "mo"}) · saves ₹${netSavings.toLocaleString("en-IN")}`,
                        bags: safeBags,
                        months: vacationMonths,
                        amount: stashCost,
                      });
                    } else {
                      const el =
                        document.getElementById("waitlist-form") ||
                        document.querySelector("footer");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="sm:flex-[2] h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs whitespace-nowrap transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 group cursor-pointer active:scale-95"
                >
                  <span>{t.calculator.lockSavings}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="sm:flex-1 h-10 px-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title={isHi ? "बचत प्रमाणपत्र देखें" : "View Official Savings Certificate"}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span>{isHi ? "बचत रसीद" : "Savings Proof"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPackingModal(true)}
                  className="sm:flex-1 h-10 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{t.calculator.packingGuide}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Official Savings Certificate Dialog */}
        <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
          <DialogContent className="glass max-w-md border-emerald-500/30 p-6 text-center text-foreground">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>
                    {isHi ? "आधिकारिक डेड-रेंट बचत प्रमाणपत्र" : "Official Dead-Rent Savings Audit"}
                  </span>
                </DialogTitle>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
            </DialogHeader>

            <div className="my-4 rounded-2xl border border-white/10 bg-black/60 p-5 text-left font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">
                  {isHi ? "प्रमाणपत्र आईडी:" : "Audit Certificate ID:"}
                </span>
                <span className="font-bold text-emerald-400">
                  #SAV-KANPUR-{Math.floor(Math.random() * 90000) + 10000}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">
                  {isHi ? "अवधि (वेकेशन):" : "Vacation Duration:"}
                </span>
                <span className="text-white">
                  {safeDays} {isHi ? "दिन" : "Days"} ({vacationMonths} {isHi ? "माह" : "mo"})
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">
                  {isHi ? "पारंपरिक खाली कमरा किराया:" : "Empty Room Rent Waste:"}
                </span>
                <span className="font-bold text-rose-400">
                  ₹{deadRentCost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">
                  {isHi ? "सार्थी स्टैश लागत (₹300/बैग):" : "StashSaarthi Escrow Fee:"}
                </span>
                <span className="font-bold text-cyan-400">
                  ₹{stashCost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm">
                <span className="font-sans font-bold text-emerald-300">
                  {isHi ? "सीधी छात्र जेब बचत:" : "Total In-Pocket Savings:"}
                </span>
                <span className="text-xl font-bold text-emerald-400">
                  ₹{netSavings.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/10 cursor-pointer"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-1.5" />
                <span>{isHi ? "प्रिंट / PDF" : "Print / PDF"}</span>
              </Button>
              <Button
                variant="hero"
                className="flex-1 cursor-pointer"
                onClick={() => {
                  setShowCertificateModal(false);
                  if (onBook) {
                    onBook({
                      service: "stash",
                      note: `Savings Audit: ${safeBags} bags · ${safeDays} days · Saved ₹${netSavings.toLocaleString("en-IN")}`,
                      bags: safeBags,
                      months: vacationMonths,
                      amount: stashCost,
                    });
                  }
                }}
              >
                {isHi ? "यह बचत सुरक्षित करें" : "Lock This Savings"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <PackingChecklistModal
          open={showPackingModal}
          onOpenChange={setShowPackingModal}
          onProceedToBooking={() => {
            if (onBook) {
              onBook({
                service: "stash",
                note: `${safeBags} ${isHi ? "बैग" : "bag"}${safeBags > 1 && !isHi ? "s" : ""} · ${safeDays} ${isHi ? "दिन" : "days"} (${vacationMonths} ${isHi ? "माह" : "mo"}) · saves ₹${netSavings.toLocaleString("en-IN")}`,
                bags: safeBags,
                months: vacationMonths,
                amount: stashCost,
              });
            }
          }}
        />
      </AnimatedContent>
    </div>
  );
}
