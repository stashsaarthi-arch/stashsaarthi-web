import { memo } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Banknote, FileCheck, UserCheck, Lock, Award, HeartHandshake } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";
import { HostLegibilityBadge } from "@/components/ui/SeniorHostLegibility";

interface HostTrustSealItem {
  id: string;
  icon: typeof ShieldCheck;
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
}

const HOST_TRUST_SEALS: HostTrustSealItem[] = [
  {
    id: "seal-safety",
    icon: ShieldCheck,
    title: "₹10,000 Property Cover",
    subtitle: "Instant Zero-Damage Platform Guarantee",
    badge: "100% Insured",
    tagline: "ICICI TPA Backed Safety Net",
  },
  {
    id: "seal-tpa",
    icon: FileCheck,
    title: "TPA Sec 105 Protection",
    subtitle: "Legal Protection Against Squatter Claims",
    badge: "Landlord Protection",
    tagline: "Zero Intrusion & 100% Control",
  },
  {
    id: "seal-verification",
    icon: UserCheck,
    title: "Verified Student Guests",
    subtitle: "Aadhaar + College ID + Police Background Audit",
    badge: "3-Tier Vetted",
    tagline: "IITK, HBTI & CSJMU Students",
  },
  {
    id: "seal-payouts",
    icon: Banknote,
    title: "Weekly Tuesday Payouts",
    subtitle: "Direct Bank Transfer Every Single Week",
    badge: "Automated Payout",
    tagline: "Zero Delay Guarantee",
  },
];

export const HostHeroSeals = memo(function HostHeroSeals() {
  return (
    <div className="relative mb-6 text-left">
      {/* Warm Sunset Gold Background Illumination Halo */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-64 w-[min(900px,100%)] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-600/20 opacity-60 blur-3xl" />

      {/* Senior Host Legibility Mode Active Badge & Passive Income Header */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <HostLegibilityBadge />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative inline-flex items-center gap-3 rounded-full border border-amber-500/40 bg-amber-950/70 px-5 py-2.5 backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all cursor-pointer"
        >

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
            ₹
          </span>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-100">
              <span>Dignified Passive Income</span>
              <span className="rounded-md bg-gradient-to-r from-amber-400 to-yellow-400 text-black px-2 py-0.5 text-xs font-black shadow-sm">
                ₹11,500+/mo
              </span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-mono font-medium mt-0.5">
              Zero Intrusion • 100% Control Over House Norms • Direct Bank Deposit
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid of Host Trust Seals */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {HOST_TRUST_SEALS.map((seal, idx) => {
          const Icon = seal.icon;
          return (
            <motion.div
              key={seal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * idx }}
            >
              <Card3D maxTilt={8} className="h-full">
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl host-warm-hearth-card host-warm-hearth-depth host-hearth-amber-brass-edge p-3.5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]">
                  {/* Sunset Gold Specular Light Beam */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-400/10 blur-xl group-hover:bg-amber-400/25 transition-all" />


                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-105 transition-transform">
                        <Icon className="h-4 w-4 text-amber-300" />
                      </div>
                      <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {seal.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xs font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {seal.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-snug text-amber-200/70 line-clamp-2">
                      {seal.subtitle}
                    </p>
                  </div>

                  {/* Footer Tagline */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400/80">
                    <span>{seal.tagline}</span>
                    <Lock className="h-3 w-3 text-amber-400/60" />
                  </div>
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </div>

      {/* Senior Host Security Assurance Strip */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-amber-300/80">
        <span className="inline-flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>Verified Kanpur Senior Host Charter</span>
        </span>
        <span className="hidden sm:inline opacity-40">•</span>
        <span className="inline-flex items-center gap-1">
          <HeartHandshake className="h-3.5 w-3.5 text-yellow-400" />
          <span>Dignified Intergenerational Living</span>
        </span>
      </div>
    </div>
  );
});
