import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Heart,
  Sparkles,
  Trophy,
  ArrowLeftRight,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Award,
} from "lucide-react";
import { playPop, playHeroCtaClick } from "@/lib/audio";
import { getSaarthiConnectCardTokens } from "@/lib/designTokens";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import type { SeniorTier } from "@/components/stash/KarmaPointsModal";

export interface SeniorHobbySpec {
  id: string;
  nameEn: string;
  nameHi: string;
  icon?: string;
}

export interface StudentSkillSpec {
  id: string;
  nameEn: string;
  nameHi: string;
  icon?: string;
}

export interface MentorshipMatchPair {
  city: string;
  score: number;
  student: {
    name: string;
    detail: string;
    detail_hi?: string;
    gives: string[];
    gives_hi?: string[];
    skills?: StudentSkillSpec[];
  };
  senior: {
    name: string;
    detail: string;
    detail_hi?: string;
    offers: string[];
    offers_hi?: string[];
    karmaPoints?: number;
    karmaTier?: SeniorTier;
    hobbies?: SeniorHobbySpec[];
  };
}

export interface SaarthiConnectCard2Props {
  match: MentorshipMatchPair;
  onRequestMatch?: (match: MentorshipMatchPair) => void;
  onKarmaClick?: () => void;
  className?: string;
}

const DEFAULT_SENIOR_HOBBIES: SeniorHobbySpec[] = [
  { id: "gardening", nameEn: "Organic Gardening 🌿", nameHi: "जैविक बागवानी 🌿", icon: "🌿" },
  { id: "literature", nameEn: "Hindi Literature & Poetry 📖", nameHi: "हिंदी काव्य 📖", icon: "📖" },
  { id: "finance", nameEn: "Financial Wisdom 💼", nameHi: "वित्तीय मार्गदर्शन 💼", icon: "💼" },
  { id: "chess", nameEn: "Chess & Strategy ♟️", nameHi: "शतरंज ♟️", icon: "♟️" },
];

const DEFAULT_STUDENT_SKILLS: StudentSkillSpec[] = [
  { id: "smartphone", nameEn: "Smartphone & UPI Setup 📱", nameHi: "स्मार्टफोन व यूपीआई 📱", icon: "📱" },
  { id: "videocall", nameEn: "Family Video Calls 📹", nameHi: "वीडियो-कॉल सेट-अप 📹", icon: "📹" },
  { id: "errands", nameEn: "Medicine Pickups 🛒", nameHi: "दवाइयां लाना 🛒", icon: "🛒" },
  { id: "techhelp", nameEn: "Laptop Help 💻", nameHi: "लैपटॉप सहायता 💻", icon: "💻" },
];

export const SaarthiConnectCard2: React.FC<SaarthiConnectCard2Props> = ({
  match,
  onRequestMatch,
  onKarmaClick,
  className = "",
}) => {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const tokens = getSaarthiConnectCardTokens(role);

  const seniorHobbies = match.senior.hobbies || DEFAULT_SENIOR_HOBBIES;
  const studentSkills = match.student.skills || DEFAULT_STUDENT_SKILLS;
  const karmaPoints = match.senior.karmaPoints ?? tokens.karmaPointsCounter.defaultPoints;
  const karmaTier = match.senior.karmaTier || tokens.karmaPointsCounter.defaultTier;

  const handleCardClick = () => {
    playPop();
  };

  const handleRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHeroCtaClick();
    onRequestMatch?.(match);
  };

  const handleKarmaBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    onKarmaClick?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 overflow-hidden bg-slate-950/90 border-white/15 hover:border-amber-500/40 hover:bg-slate-900/90 ${className}`}
    >
      {/* Top Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Header Bar: City Location & Match Compatibility Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            {match.city} • Intergenerational Mentorship Node
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> TPA Sec 105 Vetted
          </span>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {match.score}% {isHindi ? "अनुकूलता" : "Match"}
        </span>
      </div>

      {/* Dual Profiles Grid (Student & Senior Host) */}
      <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr] mb-4">
        {/* Student Mentee Card */}
        <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-3.5 text-left">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
            <h4 className="text-sm font-bold text-white truncate">{match.student.name}</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            {isHindi && match.student.detail_hi ? match.student.detail_hi : match.student.detail}
          </p>

          <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-1.5">
            {isHindi ? "छात्र योगदान व सेवाएं:" : "Student Offers & Support:"}
          </div>
          <ul className="space-y-1 mb-3">
            {(isHindi && match.student.gives_hi ? match.student.gives_hi : match.student.gives).map((item) => (
              <li key={item} className="text-xs text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Student Skill-Exchange Chips */}
          <div className="pt-2 border-t border-cyan-500/20">
            <span className="text-[10px] font-bold text-cyan-300 block mb-1.5">
              {tokens.studentSkillExchangeChips.labelEn}:
            </span>
            <div className="flex flex-wrap gap-1">
              {studentSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="student-skill-chip px-2 py-0.5 rounded-md text-[10px] font-semibold"
                >
                  {isHindi ? skill.nameHi : skill.nameEn}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Exchange Arrow Divider */}
        <div className="flex items-center justify-center">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-slate-900 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <ArrowLeftRight className="w-4 h-4" />
          </span>
        </div>

        {/* Senior Mentor Host Card */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-left">
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-2 truncate">
              <Heart className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-sm font-bold text-white truncate">{match.senior.name}</h4>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            {isHindi && match.senior.detail_hi ? match.senior.detail_hi : match.senior.detail}
          </p>

          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1.5">
            {isHindi ? "होस्ट सुविधाएं व मार्गदर्शन:" : "Senior Offers & Mentorship:"}
          </div>
          <ul className="space-y-1 mb-3">
            {(isHindi && match.senior.offers_hi ? match.senior.offers_hi : match.senior.offers).map((item) => (
              <li key={item} className="text-xs text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Senior Hobby Tags */}
          <div className="pt-2 border-t border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-300 block mb-1.5">
              {tokens.seniorHobbyTags.labelEn}:
            </span>
            <div className="flex flex-wrap gap-1">
              {seniorHobbies.map((hobby) => (
                <span
                  key={hobby.id}
                  className="senior-hobby-chip px-2 py-0.5 rounded-md text-[10px] font-semibold"
                >
                  {isHindi ? hobby.nameHi : hobby.nameEn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar: Karma Points Earned Counter & 1-Click CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
        {/* Karma Points Counter Badge */}
        <button
          type="button"
          onClick={handleKarmaBadgeClick}
          className="karma-points-counter-glow w-full sm:w-auto px-3.5 py-1.5 rounded-xl flex items-center justify-between sm:justify-start gap-2.5 cursor-pointer text-left"
        >
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-amber-300 font-mono">
                {karmaPoints.toLocaleString()} {isHindi ? "कर्म अंक" : "Karma Points"}
              </span>
              <span className="text-[10px] text-slate-300 block font-medium">
                {karmaTier} Mentorship Badge • {isHindi ? "शीर्ष 5% होस्ट" : "Top 5% Host"}
              </span>
            </div>
          </div>
          <span className="text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
            {isHindi ? "चार्टर देखें" : "View Perks"}
          </span>
        </button>

        {/* 1-Click Request Match CTA */}
        <button
          type="button"
          onClick={handleRequestClick}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>{isHindi ? tokens.ctaHi : tokens.ctaEn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
