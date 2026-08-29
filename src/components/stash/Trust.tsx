import { motion } from "motion/react";
import { Fingerprint, ShieldCheck, Building2, BadgeCheck, Zap } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";

export function Trust() {
  const { t } = useLanguage();
  const tiers = t.trustSection.tiers || [];
  const icons = [Fingerprint, ShieldCheck, Building2];

  return (
    <section id="trust" className="relative mx-auto max-w-3xl px-4 py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
          {t.trustSection.heading} <span className="text-gradient">{t.trustSection.headingGradient}</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          {t.trustSection.subtitle}
        </p>
      </div>

      <ol className="relative mt-10 space-y-4 sm:mt-14">
        <span
          className="pointer-events-none absolute bottom-6 left-[22px] top-6 w-px"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--emerald) 60%, transparent), color-mix(in oklab, var(--cyan) 40%, transparent))",
          }}
        />
        {tiers.map((tier, i) => {
          const Icon = icons[i] || ShieldCheck;
          return (
            <AnimatedContent
              key={tier.level}
              distance={40}
              direction="vertical"
              duration={0.6}
              delay={i * 0.15}
            >
              <li className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <span
                  className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald/40 bg-background"
                  style={{ boxShadow: "0 0 24px -6px color-mix(in oklab, var(--emerald) 70%, transparent)" }}
                >
                  <Icon className="h-5 w-5 text-emerald" />
                </span>
                <div className="glass glass-hover min-w-0 rounded-3xl p-5 sm:p-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-emerald sm:text-xs">
                    {tier.level}
                  </span>
                  <h3 className="mt-2 text-base font-bold sm:text-lg">{tier.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {tier.points.map((p) => (
                      <li key={p} className="text-sm text-muted-foreground">
                        • {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5">
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      className="grid place-items-center"
                    >
                      <BadgeCheck className="h-4 w-4 text-emerald" />
                    </motion.span>
                    <span className="text-xs font-bold text-emerald">{t.trustSection.verifiedBadge}</span>
                  </div>
                </div>
              </li>
            </AnimatedContent>
          );
        })}
      </ol>

      <AnimatedContent distance={30} direction="vertical" duration={0.6} delay={0.4}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-black to-red-500/10 p-6 sm:p-8 text-center relative shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0,transparent_60%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <Zap className="h-8 w-8 text-red-500 mb-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <h3 className="text-xl font-bold text-foreground mb-2">{t.trustSection.slaTitle}</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {t.trustSection.slaDescPart1}
              <span className="text-red-400 font-semibold">{t.trustSection.slaDescBold}</span>
              {t.trustSection.slaDescPart2}
            </p>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
