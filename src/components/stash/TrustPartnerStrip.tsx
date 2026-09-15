import { memo, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, GraduationCap, Building2, HeartPulse, CheckCircle2, Award } from "lucide-react";
import { playPop } from "@/lib/audio";
import type { Role } from "./types";

export interface PartnerItem {
  id: string;
  shortName: string;
  fullName: string;
  tagline: string;
  category: string;
  icon: typeof ShieldCheck;
  colorClass: string;
  borderHoverClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  glowColor: string;
}

export const INSTITUTIONAL_PARTNERS: PartnerItem[] = [
  {
    id: "iitk",
    shortName: "IIT Kanpur",
    fullName: "Indian Institute of Technology Kanpur",
    tagline: "Verified IITK Student & Campus Stash Network",
    category: "Campus Node",
    icon: GraduationCap,
    colorClass: "from-cyan-400 to-blue-500",
    borderHoverClass: "hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]",
    badgeBgClass: "bg-cyan-500/15 border-cyan-400/30",
    badgeTextClass: "text-cyan-300",
    glowColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: "hbtu",
    shortName: "HBTI / HBTU",
    fullName: "Harcourt Butler Technical University",
    tagline: "Nawabganj Engineering Corridor Partner Node",
    category: "Engineering Node",
    icon: Building2,
    colorClass: "from-emerald-400 to-teal-500",
    borderHoverClass: "hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    badgeBgClass: "bg-emerald-500/15 border-emerald-400/30",
    badgeTextClass: "text-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "csjmu",
    shortName: "CSJM University",
    fullName: "Chhatrapati Shahu Ji Maharaj University",
    tagline: "Kalyanpur Campus Storage & Co-Living Hub",
    category: "University Hub",
    icon: GraduationCap,
    colorClass: "from-mint to-emerald-400",
    borderHoverClass: "hover:border-mint/80 hover:shadow-[0_0_20px_rgba(0,245,160,0.35)]",
    badgeBgClass: "bg-emerald-400/15 border-emerald-400/30",
    badgeTextClass: "text-emerald-300",
    glowColor: "rgba(0, 245, 160, 0.25)",
  },
  {
    id: "regency",
    shortName: "Regency Health",
    fullName: "Regency Hospital Kanpur",
    tagline: "24/7 Priority Emergency Care & Health Cover",
    category: "Medical Partner",
    icon: HeartPulse,
    colorClass: "from-rose-400 to-pink-500",
    borderHoverClass: "hover:border-rose-400/80 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]",
    badgeBgClass: "bg-rose-500/15 border-rose-400/30",
    badgeTextClass: "text-rose-300",
    glowColor: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "uppolice",
    shortName: "UP Police Vetted",
    fullName: "Uttar Pradesh Police Verification",
    tagline: "Aadhaar + Local Thana Security & TPA Sec 105",
    category: "Trust & Safety",
    icon: ShieldCheck,
    colorClass: "from-amber-400 to-yellow-500",
    borderHoverClass: "hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    badgeBgClass: "bg-amber-500/15 border-amber-400/30",
    badgeTextClass: "text-amber-300",
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
];

export const TrustPartnerStrip = memo(function TrustPartnerStrip({
  role = "student",
}: {
  role?: Role;
}) {
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const student = role === "student";
  const activePartnerItem = INSTITUTIONAL_PARTNERS.find((p) => p.id === activePartner);

  const handleMouseEnter = (id: string) => {
    setActivePartner(id);
    playPop();
  };

  return (
    <div className="relative my-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 backdrop-blur-xl">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden opacity-40 transition-opacity duration-500"
        style={{
          background: student
            ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(16, 185, 129, 0.08), transparent 80%)"
            : "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245, 158, 11, 0.08), transparent 80%)",
        }}
      />

      {/* Header Badge */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <Award className={`h-4 w-4 ${student ? "text-emerald-400" : "text-amber-400"}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Institutional Trust & Verification Ecosystem
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>100% Vetted Campus Nodes</span>
        </div>
      </div>

      {/* Partner Logos Strip with Monochrome-to-Color Hover Effect */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
        {INSTITUTIONAL_PARTNERS.map((partner) => {
          const Icon = partner.icon;
          const isActive = activePartner === partner.id;

          return (
            <div
              key={partner.id}
              onMouseEnter={() => handleMouseEnter(partner.id)}
              onMouseLeave={() => setActivePartner(null)}
              className={`group relative flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center transition-all duration-300 cursor-pointer ${partner.borderHoverClass} ${
                isActive ? "scale-105 bg-white/[0.07]" : ""
              }`}
            >
              {/* Subtle Monochrome to Color Icon Wrapper */}
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${partner.colorClass} border-transparent text-black shadow-lg grayscale-0 scale-110`
                    : "bg-white/5 border-white/10 text-muted-foreground grayscale group-hover:grayscale-0 group-hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Short Title with Monochrome-to-Color Text Effect */}
              <div className="text-xs font-bold tracking-tight text-slate-300 transition-colors duration-300 group-hover:text-white">
                {partner.shortName}
              </div>

              {/* Tag / Category Badge */}
              <span
                className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-semibold transition-all duration-300 ${
                  isActive
                    ? `${partner.badgeBgClass} ${partner.badgeTextClass}`
                    : "border-white/10 bg-white/5 text-muted-foreground/80 group-hover:border-white/20 group-hover:text-slate-200"
                }`}
              >
                {partner.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Active Partner Guarantee Bar */}
      <div className="mt-3 flex items-center justify-center min-h-[30px] px-2 text-center">
        {activePartnerItem ? (
          <motion.div
            key={activePartnerItem.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs shadow-lg ${
              student
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
                : "bg-amber-950/60 border-amber-500/40 text-amber-200 shadow-amber-950/40"
            }`}
          >
            <span className="font-bold text-white">{activePartnerItem.fullName}:</span>
            <span className={student ? "text-emerald-300 font-medium" : "text-amber-300 font-medium"}>
              {activePartnerItem.tagline}
            </span>
          </motion.div>
        ) : (
          <div className="text-[11px] font-mono text-muted-foreground/70">
            Hover over any partner node to inspect institutional verification & emergency coverage
          </div>
        )}
      </div>
    </div>
  );
});
