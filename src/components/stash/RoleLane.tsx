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
    <section id="role-lane" className="relative px-4 py-3.5 sm:py-5">
      <div className="mx-auto max-w-6xl">
        <AnimatedContent distance={25} direction="vertical" duration={0.6} ease="power3.out">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${language}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass overflow-hidden rounded-xl p-3.5 sm:p-5"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-cyan">
                {laneContent.eyebrow}
              </span>
              <h2 className="mt-1.5 text-balance text-lg font-extrabold tracking-tight sm:text-2xl">
                {laneContent.title}
              </h2>
              <p className="mt-1 max-w-2xl text-pretty text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                {laneContent.blurb}
              </p>

              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {laneContent.steps.map((s, i) => {
                  const Icon = stepIcons[i] || Boxes;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-[image:var(--gradient-cyan)] text-[10px] font-black text-primary-foreground">
                          {i + 1}
                        </span>
                        <Icon className="h-3 w-3 text-cyan" />
                      </div>
                      <div className="mt-1.5 text-xs font-semibold sm:text-sm">{s.title}</div>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">{s.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-3 grid gap-px overflow-hidden rounded-lg border border-white/10 sm:grid-cols-3">
                {laneContent.metrics.map((m, i) => {
                  const Icon = metricIcons[i] || ShieldCheck;
                  return (
                    <div key={m.label} className="bg-white/5 px-2.5 py-2 text-center">
                      <Icon className="mx-auto mb-0.5 h-3 w-3 text-cyan" />
                      <AnimatedStat
                        value={m.value}
                        className="text-sm font-extrabold tracking-tight sm:text-base"
                      />
                      <div className="mt-0.5 text-[8.5px] uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {role === "host" && (
                <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                    <h3 className="text-xs font-bold text-foreground sm:text-xs">
                      {t.roleLane.host.simulator.title}
                    </h3>
                  </div>

                  <div className="mb-1.5 flex justify-between items-end">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {t.roleLane.host.simulator.selectSpace}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono tracking-tight sm:text-base">
                        {currentEarning.amount}
                      </div>
                      <div className="text-[8px] text-muted-foreground uppercase tracking-widest">
                        {currentEarning.label}
                      </div>
                    </div>
                  </div>

                  <Slider
                    defaultValue={[33]}
                    max={100}
                    step={1}
                    className="py-1.5"
                    onValueChange={(vals) => setHostSpace(vals?.[0] ?? 33)}
                  />

                  <div className="flex justify-between text-[8.5px] font-medium text-muted-foreground mt-0.5">
                    <span>{t.roleLane.host.simulator.corner}</span>
                    <span>{t.roleLane.host.simulator.verandah}</span>
                    <span>{t.roleLane.host.simulator.fullRoom}</span>
                  </div>
                </div>
              )}

              <Button
                variant={role === "student" ? "hero" : "warm"}
                size="default"
                className="group mt-3 w-full sm:w-auto text-xs py-1.5 h-8"
                onClick={() =>
                  onBook({ service: isStudent ? "stash" : "spaces", note: laneContent.eyebrow })
                }
              >
                {laneContent.cta}
                <ArrowRight className="transition-transform group-hover:translate-x-1 ml-1 h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </AnimatePresence>
        </AnimatedContent>
      </div>
    </section>
  );
}
