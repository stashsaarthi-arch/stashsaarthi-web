import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Heart, Merge, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tilt3D } from "./Tilt3D";
import AnimatedContent from "@/components/ui/AnimatedContent";

const STUDENT = [
  "The Broker Trap: Paying 1 month brokerage for a dingy room with fake photos.",
  "The Dead-Rent Tax: \u20b98,000 burned during holidays just so your luggage doesn\u2019t get stolen.",
  "The Mess Nightmare: Watery daal, unhygienic oil, and homesickness.",
];
const SENIOR = [
  "Zero Brokerage: Direct connection to audited family and senior-hosted homes.",
  "Flat \u20b9300/mo Stash: Barcode-sealed, \u20b910,000 insured vacation luggage storage.",
  "Ghar Ka Khana: Fresh micro-batch meals cooked by neighbourhood dadi/nani.",
];
const FUSION = [
  "Empty senior rooms become verified, brokerage-free student homes",
  "One hour a day of tech help & errands earns up to 60% rent subsidy",
  "Vacation luggage stays safe in a neighbourhood stash node at \u20b9300/mo",
  "Home-cooked meals replace mess food \u2014 cooked by the same community",
];
import { useLanguage } from "@/context/LanguageContext";

export function DualCrisis() {
  const [merged, setMerged] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="crisis" className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 scroll-mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
          {t.crisis.titlePart1}
          <span className="text-gradient">{t.crisis.titlePart2}</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">{t.crisis.subtitle}</p>
      </div>

      <div className="mt-10 sm:mt-14">
        <AnimatePresence mode="wait" initial={false}>
          {!merged ? (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="grid gap-4 md:grid-cols-2"
            >
              <AnimatedContent distance={80} direction="horizontal" reverse={false} duration={0.8}>
                <CrisisCard
                  title={t.crisis.studentTitle}
                  icon={GraduationCap}
                  accent="var(--destructive)"
                  items={t.crisis.studentPoints}
                />
              </AnimatedContent>
              <AnimatedContent distance={80} direction="horizontal" reverse={true} duration={0.8}>
                <CrisisCard
                  title={t.crisis.hostTitle}
                  icon={Heart}
                  accent="var(--emerald)"
                  items={t.crisis.hostPoints}
                />
              </AnimatedContent>
            </motion.div>
          ) : (
            <motion.div
              key="fused"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <AnimatedContent scale={0.95} duration={0.6} ease="back.out(1.7)">
                <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
                    style={{ background: "var(--cyan)" }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
                    style={{ background: "var(--amber)" }}
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald">
                      <Sparkles className="h-3 w-3" /> {t.crisis.fusionComplete}
                    </span>
                    <h3 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-4xl">
                      <span className="text-gradient">{t.crisis.fusionTitle}</span>
                    </h3>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {t.crisis.fusionPoints.map((f, i) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-muted-foreground"
                        >
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          data-magnetic
          variant={merged ? "frost" : "hero"}
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => setMerged((m) => !m)}
        >
          {merged ? (
            <>
              <RotateCcw /> {t.crisis.resetSplit}
            </>
          ) : (
            <>
              <Merge /> {t.crisis.mergeSolution}
            </>
          )}
        </Button>
      </div>
    </section>
  );
}

function CrisisCard({
  title,
  icon: Icon,
  accent,
  items,
}: {
  title: string;
  icon: typeof Heart;
  accent: string;
  items: string[];
}) {
  return (
    <Tilt3D max={8} lift={14} className="rounded-3xl">
      <div
        className="glass glass-hover relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, ${accent} 12%, transparent), transparent 70%)`,
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10"
            style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </span>
          <h3 className="truncate text-lg font-bold sm:text-xl">{title}</h3>
        </div>
        <ul className="mt-6 space-y-3">
          {items.map((t) => (
            <li
              key={t}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground transition-transform duration-300 hover:translate-x-1"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Tilt3D>
  );
}
