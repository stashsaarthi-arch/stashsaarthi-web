import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Star, Sparkles, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { playPop } from "@/lib/audio";

export interface AvatarMember {
  id: string;
  name: string;
  role: "student" | "host";
  initials: string;
  collegeOrLoc: string;
  actionText: string;
  joinedTime: string;
  badge: string;
  avatarBg: string;
  borderColor: string;
  rating?: number;
}

const MEMBERS: AvatarMember[] = [
  {
    id: "m1",
    name: "Rahul Sharma",
    role: "student",
    initials: "RS",
    collegeOrLoc: "IIT Kanpur (Hall 13)",
    actionText: "Locked 3 winter bags @ ₹300/mo",
    joinedTime: "12m ago from Kakadeo",
    badge: "IITK Student",
    avatarBg: "bg-emerald-500/20 text-emerald-300",
    borderColor: "border-emerald-400/80",
    rating: 5.0,
  },
  {
    id: "m2",
    name: "Asha Devi",
    role: "host",
    initials: "AD",
    collegeOrLoc: "Kakadeo Coaching Hub",
    actionText: "Earning ₹12,400/mo dignified income",
    joinedTime: "45m ago from Swaroop Nagar",
    badge: "Verified Host",
    avatarBg: "bg-amber-500/20 text-amber-300",
    borderColor: "border-amber-400/80",
    rating: 4.9,
  },
  {
    id: "m3",
    name: "Priya Mishra",
    role: "student",
    initials: "PM",
    collegeOrLoc: "HBTI Nawabganj",
    actionText: "Saved ₹8,000 dead rent on vacation",
    joinedTime: "1h ago from Kakadeo",
    badge: "HBTI Student",
    avatarBg: "bg-cyan-500/20 text-cyan-300",
    borderColor: "border-cyan-400/80",
    rating: 5.0,
  },
  {
    id: "m4",
    name: "Col. Vikram Singh",
    role: "host",
    initials: "VS",
    collegeOrLoc: "Kalyanpur (Near CSJMU)",
    actionText: "Activated ₹10,000 safety cover node",
    joinedTime: "2h ago from CSJMU Campus",
    badge: "Senior Host",
    avatarBg: "bg-yellow-500/20 text-yellow-300",
    borderColor: "border-yellow-400/80",
    rating: 4.95,
  },
  {
    id: "m5",
    name: "Aman Kumar",
    role: "student",
    initials: "AK",
    collegeOrLoc: "PW Vidyapeeth Kakadeo",
    actionText: "Reserved zero-brokerage PG room",
    joinedTime: "3h ago from Allen Hub",
    badge: "Coaching Student",
    avatarBg: "bg-teal-500/20 text-teal-300",
    borderColor: "border-teal-400/80",
    rating: 5.0,
  },
];

interface SocialProofAvatarsProps {
  role?: "student" | "host";
  className?: string;
  onExploreClick?: () => void;
}

export const SocialProofAvatars = memo(function SocialProofAvatars({
  role = "student",
  className = "",
  onExploreClick,
}: SocialProofAvatarsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredAvatar, setHoveredAvatar] = useState<AvatarMember | null>(null);

  // Auto-rotate ticker message every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MEMBERS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const isStudent = role === "student";
  const currentMember = (MEMBERS[activeIndex] ?? MEMBERS[0])!;

  const handleAvatarHover = (member: AvatarMember) => {
    setHoveredAvatar(member);
    playPop();
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-4 ${className}`}
      aria-label="Verified Community Social Proof"
    >
      {/* ── Avatar Stack & Member Quick Inspection ── */}
      <div className="relative flex items-center">
        <div className="flex -space-x-3 overflow-hidden p-1">
          {MEMBERS.map((member, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={member.id}
                type="button"
                whileHover={{ scale: 1.18, zIndex: 30 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => handleAvatarHover(member)}
                onMouseLeave={() => setHoveredAvatar(null)}
                onClick={() => {
                  setActiveIndex(index);
                  playPop();
                }}
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-slate-950 text-xs font-black shadow-lg transition-all duration-200 cursor-pointer ${member.borderColor} ${member.avatarBg} ${
                  isActive ? "ring-2 ring-emerald-400/80 scale-105" : "hover:brightness-125"
                }`}
                title={`${member.name} (${member.badge})`}
              >
                <span>{member.initials}</span>

                {/* Verified Shield Dot Badge */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 border border-black text-emerald-400">
                  <CheckCircle2 className="h-2.5 w-2.5 fill-emerald-500/20 text-emerald-400" />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Member Count Overlay Pill */}
        <div className="ml-1.5 flex flex-col text-left">
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-white leading-none">
            <span className="flex items-center text-amber-400">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
              4.9/5
            </span>
            <span className="text-slate-500">•</span>
            <span className={isStudent ? "text-emerald-400 font-mono" : "text-amber-300 font-mono"}>
              480+ Members
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 leading-tight">
            Verified Kanpur Community
          </span>
        </div>
      </div>

      {/* ── Dynamic Ticker Indicator Capsule ── */}
      <div className="relative">
        <div
          className={`group flex items-center gap-2.5 rounded-full border ${
            isStudent
              ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
              : "border-amber-500/30 bg-amber-950/40 text-amber-200"
          } px-3.5 py-1.5 backdrop-blur-xl shadow-md transition-all hover:border-emerald-400/50 cursor-pointer`}
          onClick={onExploreClick}
        >
          {/* Pulsing Live Beacon */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isStudent ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isStudent ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>

          {/* Animated Message Fade */}
          <div className="min-w-0 max-w-[280px] sm:max-w-[340px] overflow-hidden text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMember.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 truncate text-[11px] sm:text-xs font-medium"
              >
                <span className="font-extrabold text-white truncate">
                  {currentMember.name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="truncate text-slate-300">
                  {currentMember.actionText}
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-emerald-400/90 shrink-0">
                  ({currentMember.joinedTime})
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
        </div>

        {/* ── Hovered Member Details Floating Card ── */}
        <AnimatePresence>
          {hoveredAvatar && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 min-w-[240px] rounded-xl border border-emerald-500/40 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-2xl text-left pointer-events-none"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black ${hoveredAvatar.borderColor} ${hoveredAvatar.avatarBg}`}
                >
                  {hoveredAvatar.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                    <span>{hoveredAvatar.name}</span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                      {hoveredAvatar.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="h-2.5 w-2.5 text-emerald-400" />
                    <span>{hoveredAvatar.collegeOrLoc}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white/5 p-2 text-[11px] text-slate-200">
                <div className="flex items-center gap-1 font-semibold text-emerald-300 mb-0.5">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>Activity Status:</span>
                </div>
                <p className="text-slate-300 leading-snug">{hoveredAvatar.actionText}</p>
                <div className="mt-1 text-[9.5px] font-mono text-slate-400">
                  Verified Node • {hoveredAvatar.joinedTime}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
