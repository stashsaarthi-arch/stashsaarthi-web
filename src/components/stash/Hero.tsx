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
import { NodeCanvas } from "./NodeCanvas";
import { HeroParallax } from "./HeroParallax";
import { Card3D } from "@/components/ui/Card3D";
import { CampusNodeChecker } from "./CampusNodeChecker";
import AnimatedContent from "@/components/ui/AnimatedContent";
import Ferrofluid from "@/components/ui/Ferrofluid";
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
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pb-24 md:pt-44">
      <div className="absolute inset-0 grid-noise opacity-60" />
      <div className="absolute inset-0">
        <NodeCanvas />
      </div>
      <HeroParallax />
      <div className="absolute inset-0 -z-10 h-[650px] w-full overflow-hidden opacity-65 pointer-events-auto">
        <Ferrofluid
          colors={
            student
              ? ["#10B981", "#00F5A0", "#06B6D4", "#1E3A8A"]
              : ["#F59E0B", "#FBBF24", "#D97706", "#78350F"]
          }
          glow={student ? 2.2 : 2.0}
          shimmer={student ? 1.4 : 1.2}
          mouseStrength={student ? 1.2 : 1.0}
          fluidity={0.12}
          mixBlendMode="screen"
          mouseDampening={0.12}
          mouseInteraction={true}
          mouseRadius={0.32}
          rimWidth={0.22}
          scale={1.4}
          sharpness={2.8}
          speed={0.35}
          turbulence={0.8}
        />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background: student
            ? "radial-gradient(circle, var(--cyan), transparent 65%)"
            : "radial-gradient(circle, var(--amber), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          delay={0.1}
        >
          <div className="mb-4 flex justify-center">
            <LiveChangelogBadge />
          </div>

          <span
            className="glass mx-auto inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
            style={{ color: student ? "var(--destructive)" : "var(--muted-foreground)" }}
          >
            {student ? (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
            ) : (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald" />
            )}
            <span className="text-balance">
              {student ? t.hero.student.badge : t.hero.host.badge}
            </span>
          </span>

          <h1
            key={`h-${role}`}
            className="mx-auto mt-6 max-w-4xl text-balance text-[2rem] font-extrabold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="text-gradient">
              {student ? t.hero.student.title : t.hero.host.title}
            </span>
          </h1>

          <p
            key={`p-${role}`}
            className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-lg"
          >
            {student ? t.hero.student.subtitle : t.hero.host.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button
              data-magnetic
              variant={student ? "hero" : "warm"}
              size="xl"
              onClick={() => onBook({ service: student ? "stash" : "spaces" })}
              className="group w-full sm:w-auto text-sm sm:text-base px-6 py-6"
            >
              <span className="truncate">{student ? t.hero.student.cta : t.hero.host.cta}</span>
              <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1 ml-2" />
            </Button>
            {student ? (
              <Button
                data-magnetic
                variant="frost"
                size="xl"
                asChild
                className="w-full sm:w-auto px-6 py-6"
              >
                <a href="#ecosystem" onClick={smoothScrollTo("ecosystem")}>
                  {t.hero.student.secondaryCta}
                </a>
              </Button>
            ) : (
              <Button
                data-magnetic
                variant="outline"
                size="xl"
                asChild
                className="w-full sm:w-auto px-6 py-6 border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366]"
              >
                <a
                  href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent("Namaste StashSaarthi, I want to list my spare space as a Host.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {t.hero.host.secondaryCta}
                </a>
              </Button>
            )}
            {onRefer && (
              <Button
                data-magnetic
                variant="outline"
                size="xl"
                onClick={onRefer}
                className="w-full sm:w-auto px-5 py-6 border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] active:scale-95 transition-all cursor-pointer font-semibold"
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span>{role === "student" ? "Refer & Share" : "Share on WhatsApp"}</span>
              </Button>
            )}
          </div>
        </AnimatedContent>

        <Card3D maxTilt={6} className="mx-auto mt-12 max-w-4xl rounded-3xl">
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4">
            {STATS.map((s, i) => {
              const Icon = ICONS[i] || ShieldCheck;
              return (
                <AnimatedContent
                  key={s.label}
                  distance={30}
                  direction="vertical"
                  duration={0.7}
                  delay={0.15 * i}
                  className="min-w-0 px-3 py-5 text-center sm:px-5 sm:py-6"
                >
                  <Icon
                    className={`mx-auto mb-2 h-4 w-4 ${student ? "text-cyan" : "text-amber-400"}`}
                  />
                  <AnimatedStat
                    value={s.value}
                    className="text-xl font-extrabold tracking-tight sm:text-2xl"
                    style={{ transform: "translateZ(20px)", color: student ? "" : "#FDE68A" }}
                  />
                  <div
                    className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-[11px] leading-tight"
                    style={{ transform: "translateZ(30px)" }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 mx-auto max-w-2xl px-4"
        >
          <div
            className={`relative rounded-2xl border ${student ? "border-cyan-500/20 bg-cyan-950/10" : "border-amber-500/20 bg-amber-950/10"} px-4 py-3 backdrop-blur-md overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_3s_infinite]" />
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${student ? "from-cyan-500/0 via-cyan-500/10 to-cyan-500/0" : "from-amber-500/0 via-amber-500/10 to-amber-500/0"} opacity-50 blur-xl animate-pulse`}
            />

            <p className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <span
                className={`flex items-center ${student ? "text-amber-400" : "text-amber-300"}`}
              >
                <span className="mr-1 text-sm">⚡</span> Validated at IIT Bombay NEC 2026
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

        {/* ── Pravara-Style Luxury Mountain-Grade Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-14 flex flex-col items-center justify-center gap-2 text-center"
        >
          <a
            href="#role-lane"
            onClick={smoothScrollTo("role-lane")}
            className="group flex flex-col items-center gap-2.5 cursor-pointer select-none text-muted-foreground/60 hover:text-white transition-all"
            aria-label="Scroll down to explore features"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] transition-colors group-hover:text-emerald-400">
              {t.nav?.explore || "SCROLL TO EXPLORE"}
            </span>
            <div className="relative h-10 w-5 rounded-full border border-white/20 p-1 group-hover:border-emerald-400/60 transition-colors backdrop-blur-md bg-black/40">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
                className={`h-2.5 w-1.5 rounded-full mx-auto shadow-lg ${student ? "bg-emerald-400 shadow-emerald-500/50" : "bg-amber-400 shadow-amber-500/50"}`}
              />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
