import { useState } from "react";
import {
  Check,
  ShieldAlert,
  Clock,
  Ban,
  Moon,
  Lock,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Card3D } from "@/components/ui/Card3D";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = [Clock, Ban, Moon, Lock, UtensilsCrossed];

export function HostRules() {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [activeRules, setActiveRules] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const rules = t.hostRulesSection.rules || [];

  const toggleRule = (idx: number) => {
    setActiveRules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const activeCount = Object.values(activeRules).filter(Boolean).length;

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-4 sm:py-6">
      <AnimatedContent distance={20} direction="vertical" duration={0.5}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] sm:text-xs font-semibold text-amber-400 mb-2 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hostRulesSection.badge}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight sm:text-3xl mb-1.5">
            {t.hostRulesSection.title}{" "}
            <span className="text-gradient">{t.hostRulesSection.titleGradient}</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto">
            {t.hostRulesSection.subtitle}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-6 items-center">
          <div className="flex flex-col gap-3">
            {rules.map((rule, idx) => {
              const isActive = activeRules[idx];
              const Icon = ICONS[idx] || ShieldCheck;
              return (
                <button
                  key={rule.title}
                  onClick={() => toggleRule(idx)}
                  className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-amber-400/60 bg-amber-400/10 shadow-[0_0_20px_-5px_rgba(245,158,11,0.25)]"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isActive
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`}
                      />
                      <span
                        className={`text-sm font-bold ${isActive ? "text-white" : "text-muted-foreground"}`}
                      >
                        {rule.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <Card3D maxTilt={5}>
            <div className="glass rounded-2xl p-5 sm:p-6 border border-red-500/30 bg-black/50 text-center relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
              <ShieldAlert
                className="h-10 w-10 text-red-500 mx-auto mb-3 opacity-90"
                style={{ transform: "translateZ(20px)" }}
              />

              <div
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 mb-2"
                style={{ transform: "translateZ(15px)" }}
              >
                <Check className="h-3 w-3" /> {activeCount} {t.hostRulesSection.activeCounter}
              </div>

              <h3
                className="text-base sm:text-lg font-bold mb-1.5 text-white"
                style={{ transform: "translateZ(25px)" }}
              >
                {t.hostRulesSection.guaranteeTitle}
              </h3>
              <p
                className="text-xs text-slate-300 leading-relaxed"
                style={{ transform: "translateZ(15px)" }}
              >
                {t.hostRulesSection.guaranteeDesc}
              </p>

              <div className="mt-4 border-t border-white/10 pt-3 text-left font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>{t.hostRulesSection.legalProtection}</span>
                <span className="text-emerald-400 font-bold">
                  {t.hostRulesSection.hostProtected}
                </span>
              </div>

              <div className="mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>StashSaarthi — ${isHi ? "वरिष्ठ होस्ट गृह नियम समझौता" : "Senior Host House Norms Agreement"}</title>
                            <style>
                              body { font-family: sans-serif; padding: 40px; color: #111; }
                              h1 { color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
                              .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
                              .rule-box { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 12px; border-radius: 4px; }
                              .guarantee { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin-top: 25px; }
                              .footer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
                            </style>
                          </head>
                          <body>
                            <h1>${isHi ? "स्टैशसारथी गृह नियम एवं सुरक्षा चार्टर" : "StashSaarthi House Norms & Safety Charter"}</h1>
                            <div class="badge">${isHi ? "आधिकारिक होस्ट समझौता · सत्यापित छात्र प्रति" : "Official Host Agreement · Verified Tenant Copy"}</div>
                            <p><strong>${isHi ? "सीनियर होस्ट प्रॉपर्टी कोड:" : "Senior Host Property Code:"}</strong> KNP-HOST-NODE-2026</p>
                            <p>${isHi ? `किराएदार निम्नलिखित ${activeCount} सक्रिय गृह नियमों को बिना शर्त स्वीकार करता है:` : `The tenant acknowledges and unconditionally agrees to the following ${activeCount} active house rules:`}</p>
                            ${rules
                              .filter((_, idx) => activeRules[idx])
                              .map(
                                (r) => `
                              <div class="rule-box">
                                <strong>${r.title}</strong>
                                <p style="margin: 4px 0 0; font-size: 13px; color: #475569;">${r.desc}</p>
                              </div>
                            `,
                              )
                              .join("")}
                            <div class="guarantee">
                              <strong>${isHi ? "24-घंटे रीलोकेशन गारंटी (SLA):" : "24-Hour Relocation SLA Guarantee:"}</strong>
                              <p style="margin: 4px 0 0; font-size: 12px; color: #065f46;">${isHi ? "किसी भी नियम उल्लंघन पर सार्थी ऑपरेशंस द्वारा 24 घंटे के भीतर छात्र का तत्काल रीलोकेशन, जिससे सीनियर होस्ट के किराए का शून्य नुकसान होता है।" : "Violations trigger immediate 24h student relocation by StashSaarthi operations with zero loss of rent to the senior host."}</p>
                            </div>
                            <div class="footer">
                              ${isHi ? "स्टैशसारथी अंतर-पीढ़ी लिविंग प्लेटफॉर्म · 24×7 ऑपरेशंस डेस्क: +91 9369454350 · info@stashsaarthi.in" : "StashSaarthi Intergenerational Living Platform · 24×7 Operations Desk: +91 9369454350 · info@stashsaarthi.in"}
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  className="w-full rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 py-2.5 px-3 text-xs font-bold text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>{t.hostRulesSection.printBtn}</span>
                </button>
              </div>
            </div>
          </Card3D>
        </div>
      </AnimatedContent>
    </section>
  );
}
