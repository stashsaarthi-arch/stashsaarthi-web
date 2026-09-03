import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Lock,
  Banknote,
  Clock,
  Phone,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/Card3D";
import { CampusNodeChecker } from "./CampusNodeChecker";
import AnimatedContent from "@/components/ui/AnimatedContent";
import type { OpenBooking, Role } from "./types";
import { FOUNDER_WHATSAPP } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { AnimatedStat } from "./AnimatedStat";
import { LiveChangelogBadge } from "./ChangelogModal";
import { smoothScrollTo } from "./legal";

export function Hero({
  role,
  onBook,
  onRefer,
}: {
  role: Role;
  onBook: OpenBooking;
  onRefer?: () => void;
}) {
  const { t } = useLanguage();
  const student = role === "student";
  const STATS = (student ? t.hero?.student?.stats : t.hero?.host?.stats) || [];
  const ICONS = student
    ? [IndianRupee, ShieldCheck, MapPin, Boxes]
    : [ShieldCheck, Lock, Banknote, Clock];

  return (
    <section id="top" className="relative overflow-hidden pb-4 pt-16 sm:pb-6 md:pt-20">
      {/* 2D Clean Background (Phone-view parity across all screens) */}
      <div className="absolute inset-0 grid-noise opacity-50 pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${
            student ? "rgba(16, 185, 129, 0.18)" : "rgba(245, 158, 11, 0.16)"
          }, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 120%, ${
            student ? "rgba(6, 182, 212, 0.12)" : "rgba(251, 191, 36, 0.1)"
          }, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full opacity-40 blur-[80px]"
        style={{
          background: student
            ? "radial-gradient(circle, var(--cyan), transparent 65%)"
            : "radial-gradient(circle, var(--amber), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          delay={0.05}
        >
          <div className="mb-2 flex items-center justify-center gap-2 flex-wrap">
            <LiveChangelogBadge />
            <span
              className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold leading-tight sm:px-3.5"
              style={{ color: student ? "var(--destructive)" : "var(--muted-foreground)" }}
            >
              {student ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              ) : (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald" />
              )}
              <span className="text-balance">
                {student ? t.hero.student.badge : t.hero.host.badge}
              </span>
            </span>
          </div>

          <h1
            key={`h-${role}`}
            className="mx-auto mt-2 max-w-4xl text-balance text-2xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
          >
            <span className="block text-xs font-bold tracking-wider text-emerald mb-1.5">
              StashSaarthi Living & Storage
            </span>
            <span className="text-gradient">
              {student ? t.hero.student.title : t.hero.host.title}
            </span>
          </h1>

          <p
            key={`p-${role}`}
            className="mx-auto mt-2 max-w-2xl text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm"
          >
            {student ? t.hero.student.subtitle : t.hero.host.subtitle}
          </p>

          {/* Dynamic Live Proof Badge */}
          <div className="mt-3 flex justify-center">
            {student ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>⚡ 48+ Bags Stored Near IITK & HBTI • 100% Tamper-Proof QR Seal</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                <span>🛡️ ₹10,000 Safety Cover Active • 12+ Verified Senior Hosts in Kanpur</span>
              </div>
            )}
          </div>

          <div className="mt-3.5 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <Button
              data-magnetic
              variant={student ? "hero" : "warm"}
              size="default"
              onClick={() => onBook({ service: student ? "stash" : "spaces" })}
              className="group w-full sm:w-auto text-xs sm:text-sm px-5 py-4"
            >
              <span className="truncate">{student ? t.hero.student.cta : t.hero.host.cta}</span>
              <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1 ml-1.5 h-3.5 w-3.5" />
            </Button>
            {student ? (
              <Button
                data-magnetic
                variant="ghost"
                size="default"
                asChild
                className="w-full sm:w-auto px-5 py-4 text-xs sm:text-sm bg-white/5 hover:bg-white/10"
              >
                <a href="#ecosystem" onClick={smoothScrollTo("ecosystem")}>
                  {t.hero.student.secondaryCta}
                </a>
              </Button>
            ) : (
              <Button
                data-magnetic
                variant="ghost"
                size="default"
                asChild
                className="w-full sm:w-auto px-5 py-4 text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
              >
                <a
                  href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent("Namaste StashSaarthi, I want to list my spare space as a Host.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  {t.hero.host.secondaryCta}
                </a>
              </Button>
            )}
            {onRefer && (
              <Button
                data-magnetic
                variant="ghost"
                size="default"
                onClick={onRefer}
                className="w-full sm:w-auto px-4 py-4 text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white active:scale-95 transition-all cursor-pointer font-semibold"
              >
                <Share2 className="mr-1.5 h-3.5 w-3.5" />
                <span>{role === "student" ? "Refer & Share" : "Share on WhatsApp"}</span>
              </Button>
            )}
          </div>
        </AnimatedContent>

        <Card3D maxTilt={5} className="mx-auto mt-4 max-w-4xl rounded-xl">
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-xl md:grid-cols-4">
            {STATS.map((s, i) => {
              const Icon = ICONS[i] || ShieldCheck;
              return (
                <AnimatedContent
                  key={s.label}
                  distance={15}
                  direction="vertical"
                  duration={0.5}
                  delay={0.06 * i}
                  className="min-w-0 px-2.5 py-2.5 text-center sm:px-3 sm:py-3"
                >
                  <Icon
                    className={`mx-auto mb-1 h-3 w-3 ${student ? "text-cyan" : "text-amber-400"}`}
                  />
                  <AnimatedStat
                    value={s.value}
                    className="text-base font-extrabold tracking-tight sm:text-lg"
                    style={{ transform: "translateZ(15px)", color: student ? "" : "#FDE68A" }}
                  />
                  <div
                    className="mt-0.5 text-[8.5px] uppercase tracking-wider text-muted-foreground sm:text-[9.5px] leading-tight"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {s.label}
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </Card3D>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 mx-auto max-w-2xl px-2"
        >
          <div
            className={`relative rounded-lg border ${student ? "border-cyan-500/20 bg-cyan-950/10" : "border-amber-500/20 bg-amber-950/10"} px-3 py-1.5 backdrop-blur-md overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_3s_infinite]" />
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${student ? "from-cyan-500/0 via-cyan-500/10 to-cyan-500/0" : "from-amber-500/0 via-amber-500/10 to-amber-500/0"} opacity-50 blur-xl animate-pulse`}
            />

            <p className="relative z-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-xs font-semibold text-muted-foreground">
              <span
                className={`flex items-center ${student ? "text-amber-400" : "text-amber-300"}`}
              >
                <span className="mr-1 text-xs">⚡</span> Validated at IIT Bombay NEC 2026
              </span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span className="flex items-center text-emerald-400">
                {student ? "100% Escrow Protected" : "₹10,000 Safety Cover"}
              </span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span className={`flex items-center ${student ? "text-cyan-400" : "text-amber-400"}`}>
                {student ? "Zero-Brokerage Charter" : "Weekly Tuesday Payouts"}
              </span>
            </p>
          </div>
        </motion.div>

        {student && <CampusNodeChecker onBook={onBook} />}

        {/* ── Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 flex flex-col items-center justify-center gap-1 text-center"
        >
          <a
            href="#role-lane"
            onClick={smoothScrollTo("role-lane")}
            className="group flex flex-col items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white transition-all"
            aria-label="Scroll down to explore features"
          >
            <span className="text-xs font-mono transition-colors group-hover:text-emerald-400">
              {t.nav?.explore || "Explore Our Services"}
            </span>
            <div className="relative h-6 w-3.5 rounded-full border border-white/20 p-0.5 group-hover:border-emerald-400/60 transition-colors backdrop-blur-md bg-black/40">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
                className={`h-1.5 w-1 rounded-full mx-auto shadow-lg ${student ? "bg-emerald-400 shadow-emerald-500/50" : "bg-amber-400 shadow-amber-500/50"}`}
              />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
