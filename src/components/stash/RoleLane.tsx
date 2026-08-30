import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Boxes,
  CalendarClock,
  HandHeart,
  Home,
  IndianRupee,
  ShieldCheck,
  Soup,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AnimatedContent from "@/components/ui/AnimatedContent";
import type { OpenBooking, Role } from "./types";
import { AnimatedStat } from "./AnimatedStat";
import { useLanguage } from "@/context/LanguageContext";

export function RoleLane({ role, onBook }: { role: Role; onBook: OpenBooking }) {
  const { language, t } = useLanguage();
  const [hostSpace, setHostSpace] = useState<number>(33); // 0-100%

  const isStudent = role === "student";
  const laneContent = isStudent ? t.roleLane.student : t.roleLane.host;
  const isHi = language === "hi";

  const getHostEarnings = (val: number) => {
    const v = typeof val === "number" && !isNaN(val) ? val : 33;
    if (v < 30) {
      return {
        label: t.roleLane.host.simulator.cornerLabel,
        amount: isHi ? "₹1,800 - ₹3,000/माह" : "₹1,800 - ₹3,000/mo",
      };
    }
    if (v < 70) {
      return {
        label: t.roleLane.host.simulator.verandahLabel,
        amount: isHi ? "₹4,000 - ₹7,000/माह" : "₹4,000 - ₹7,000/mo",
      };
    }
    return {
      label: t.roleLane.host.simulator.roomLabel,
      amount: isHi ? "₹8,000 - ₹12,000/माह" : "₹8,000 - ₹12,000/mo",
    };
  };

  const currentEarning = getHostEarnings(hostSpace);

  const stepIcons = isStudent ? [Boxes, Home, Soup] : [Home, ShieldCheck, HandHeart];

  const metricIcons = isStudent
    ? [Wallet, CalendarClock, ShieldCheck]
    : [IndianRupee, Users, ShieldCheck];

  return (
    <section id="lane" className="relative px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <AnimatedContent distance={50} direction="vertical" duration={0.8} ease="power3.out">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${language}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="glass overflow-hidden rounded-3xl p-5 sm:p-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
                {laneContent.eyebrow}
              </span>
              <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
                {laneContent.title}
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {laneContent.blurb}
              </p>

              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {laneContent.steps.map((s, i) => {
                  const Icon = stepIcons[i] || Boxes;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-cyan)] text-xs font-black text-primary-foreground">
                          {i + 1}
                        </span>
                        <Icon className="h-4 w-4 text-cyan" />
                      </div>
                      <div className="mt-3 text-sm font-semibold">{s.title}</div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-3">
                {laneContent.metrics.map((m, i) => {
                  const Icon = metricIcons[i] || ShieldCheck;
                  return (
                    <div key={m.label} className="bg-white/5 px-4 py-4 text-center">
                      <Icon className="mx-auto mb-1.5 h-4 w-4 text-cyan" />
                      <AnimatedStat
                        value={m.value}
                        className="text-lg font-extrabold tracking-tight"
                      />
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {role === "host" && (
                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      {t.roleLane.host.simulator.title}
                    </h3>
                  </div>

                  <div className="mb-2 flex justify-between items-end">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t.roleLane.host.simulator.selectSpace}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400 font-mono tracking-tight">
                        {currentEarning.amount}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {currentEarning.label}
                      </div>
                    </div>
                  </div>

                  <Slider
                    defaultValue={[33]}
                    max={100}
                    step={1}
                    className="py-4"
                    onValueChange={(vals) => setHostSpace(vals?.[0] ?? 33)}
                  />

                  <div className="flex justify-between text-[10px] font-medium text-muted-foreground mt-1">
                    <span>{t.roleLane.host.simulator.corner}</span>
                    <span>{t.roleLane.host.simulator.verandah}</span>
                    <span>{t.roleLane.host.simulator.fullRoom}</span>
                  </div>
                </div>
              )}

              <Button
                variant={role === "student" ? "hero" : "warm"}
                size="lg"
                className="group mt-6 w-full sm:w-auto"
                onClick={() =>
                  onBook({ service: isStudent ? "stash" : "spaces", note: laneContent.eyebrow })
                }
              >
                {laneContent.cta}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </AnimatePresence>
        </AnimatedContent>
      </div>
    </section>
  );
}
