import { memo } from "react";
import { motion } from "motion/react";
import {
  IndianRupee,
  ShieldCheck,
  Building2,
  Boxes,
  Lock,
  Banknote,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
} from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";
import { AnimatedStat } from "./AnimatedStat";
import { useLanguage } from "@/context/LanguageContext";
import { playPop } from "@/lib/audio";
import type { Role } from "./types";

interface HeroMicroStatsProps {
  role: Role;
  className?: string;
}

export const HeroMicroStats = memo(function HeroMicroStats({
  role,
  className = "",
}: HeroMicroStatsProps) {
  const { language } = useLanguage();
  const isStudent = role === "student";
  const isHindi = language === "hi";

  const studentStats = [
    {
      id: "dead-rent",
      value: "₹42,00,000+",
      label: isHindi ? "बचत की गई डेड-रेंट" : "Dead Rent Saved",
      subtext: isHindi ? "कानपुर छात्रों द्वारा" : "By Kanpur Students",
      badge: "🔥 Live Audit",
      icon: IndianRupee,
    },
    {
      id: "hosts",
      value: "450+",
      label: isHindi ? "सत्यापित सीनियर होस्ट्स" : "Verified Senior Hosts",
      subtext: isHindi ? "IITK व CSJMU क्षेत्र" : "IITK & CSJMU Belt",
      badge: "🛡️ 3-Tier Vetted",
      icon: Users,
    },
    {
      id: "bags",
      value: "1,280+",
      label: isHindi ? "सुरक्षित स्टैश बैग्स" : "Luggage Bags Vaulted",
      subtext: isHindi ? "लेजर बारकोड सील" : "Laser Seal Insured",
      badge: "📦 100% Safe",
      icon: Boxes,
    },
    {
      id: "brokerage",
      value: "100%",
      label: isHindi ? "शून्य ब्रोकरेज कमरे" : "Zero Brokerage Rooms",
      subtext: isHindi ? "सीधा मकान मालिक संपर्क" : "Direct Host Access",
      badge: "⚡ Zero Fees",
      icon: ShieldCheck,
    },
  ];

  const hostStats = [
    {
      id: "income",
      value: "₹11,500/mo",
      label: isHindi ? "औसत पैसिव इनकम" : "Avg Passive Income",
      subtext: isHindi ? "खाली कमरे व कोने से" : "From Spare Space",
      badge: "📈 Weekly Deposit",
      icon: Banknote,
    },
    {
      id: "cover",
      value: "₹10,000",
      label: isHindi ? "प्रॉपर्टी सुरक्षा कवर" : "Property Cover Shield",
      subtext: isHindi ? "100% एस्क्रो गारंटी" : "Zero Damage Risk",
      badge: "🛡️ Escrow Protected",
      icon: Lock,
    },
    {
      id: "students",
      value: "100%",
      label: isHindi ? "सत्यापित छात्र निवासी" : "Police-Vetted Guests",
      subtext: isHindi ? "आधार व पुलिस चेक" : "Aadhaar & Campus Verified",
      badge: "✅ 3-Tier ID Check",
      icon: Building2,
    },
    {
      id: "support",
      value: "24×7",
      label: isHindi ? "सार्थी नोडल सहायता" : "Dedicated Support",
      subtext: isHindi ? "स्थानीय आपातकाल रिस्पॉन्स" : "Local Emergency Ops",
      badge: "⚡ 1-Tap SOS",
      icon: Clock,
    },
  ];

  const stats = isStudent ? studentStats : hostStats;

  return (
    <div className={`mx-auto max-w-4xl w-full ${className}`}>
      <Card3D maxTilt={4} className="rounded-2xl">
        <div
          className={`glass relative overflow-hidden rounded-2xl border backdrop-blur-xl p-3 sm:p-4 transition-colors ${
            isStudent
              ? "border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_35px_rgba(16,185,129,0.12)]"
              : "border-amber-500/30 bg-amber-950/20 shadow-[0_0_35px_rgba(245,158,11,0.12)]"
          }`}
        >
          {/* Subtle Ambient Background Mesh */}
          <div
            className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${
              isStudent ? "bg-emerald-500/15" : "bg-amber-500/15"
            }`}
          />
          <div
            className={`pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full blur-3xl ${
              isStudent ? "bg-cyan-500/15" : "bg-yellow-500/15"
            }`}
          />

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 relative z-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  onMouseEnter={() => playPop()}
                  className={`group relative flex flex-col justify-between rounded-xl border p-2.5 sm:p-3.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    isStudent
                      ? "border-emerald-500/20 bg-emerald-950/40 hover:border-emerald-400/50 hover:bg-emerald-900/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "border-amber-500/20 bg-amber-950/40 hover:border-amber-400/50 hover:bg-amber-900/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  }`}
                >
                  {/* Top Badge & Icon Row */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-tight border ${
                        isStudent
                          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                          : "border-amber-400/40 bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      <Sparkles className="h-2.5 w-2.5 shrink-0" />
                      {stat.badge}
                    </span>
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isStudent ? "text-emerald-400" : "text-amber-400"
                      }`}
                    />
                  </div>

                  {/* Animated Count-up Value */}
                  <div className="my-0.5">
                    <AnimatedStat
                      value={stat.value}
                      className={`text-lg sm:text-2xl font-black tracking-tight leading-none ${
                        isStudent
                          ? "text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                      }`}
                    />
                  </div>

                  {/* Label & Subtext */}
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold text-slate-100 group-hover:text-white transition-colors leading-tight truncate">
                      {stat.label}
                    </div>
                    <div className="text-[9.5px] sm:text-[10.5px] font-mono text-muted-foreground/80 mt-0.5 truncate">
                      {stat.subtext}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card3D>
    </div>
  );
});
