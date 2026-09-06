import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Share2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Gift,
  Users,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { AnimatedContent } from "@/components/ui/AnimatedContent";
import { toast } from "sonner";
import { APP_BASE_URL } from "@/lib/constants";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  college: string;
  invites: number;
  rewardsEarned: number;
  badge: string;
  badgeType: "gold" | "silver" | "bronze" | "mint" | "amber";
  persona: "student" | "host";
}

const LEADERBOARD_THIS_MONTH: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Aarav Sharma",
    avatar: "AS",
    college: "IIT Kanpur (Hall 2)",
    invites: 32,
    rewardsEarned: 9600,
    badge: "Campus Legend 👑",
    badgeType: "gold",
    persona: "student",
  },
  {
    rank: 2,
    name: "Riya Verma",
    avatar: "RV",
    college: "HBTI Kanpur (CSE)",
    invites: 24,
    rewardsEarned: 7200,
    badge: "Stash Pioneer 🚀",
    badgeType: "silver",
    persona: "student",
  },
  {
    rank: 3,
    name: "Anil Kumar Agrawal",
    avatar: "AA",
    college: "Kakadeo Host Node #14",
    invites: 19,
    rewardsEarned: 9500,
    badge: "Super Host 🏡",
    badgeType: "amber",
    persona: "host",
  },
  {
    rank: 4,
    name: "Devansh Tripathy",
    avatar: "DT",
    college: "CSJMU Kanpur",
    invites: 15,
    rewardsEarned: 4500,
    badge: "Vacation Master 🧳",
    badgeType: "mint",
    persona: "student",
  },
  {
    rank: 5,
    name: "Sneha Gupta",
    avatar: "SG",
    college: "IIT Kanpur (Hall 6)",
    invites: 13,
    rewardsEarned: 3900,
    badge: "Dead-Rent Slayer ⚡",
    badgeType: "mint",
    persona: "student",
  },
  {
    rank: 6,
    name: "Sunita Shukla",
    avatar: "SS",
    college: "Swaroop Nagar Host Node",
    invites: 11,
    rewardsEarned: 5500,
    badge: "Dignified Host 🌟",
    badgeType: "amber",
    persona: "host",
  },
  {
    rank: 7,
    name: "Karan Johar",
    avatar: "KJ",
    college: "Allen Kakadeo Batch '26",
    invites: 9,
    rewardsEarned: 2700,
    badge: "Co-Living Catalyst 🤝",
    badgeType: "mint",
    persona: "student",
  },
  {
    rank: 8,
    name: "Vikram Saxena",
    avatar: "VS",
    college: "PSIT Kanpur",
    invites: 8,
    rewardsEarned: 2400,
    badge: "Campus Captain 🏆",
    badgeType: "mint",
    persona: "student",
  },
];

const LEADERBOARD_ALL_TIME: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Aarav Sharma",
    avatar: "AS",
    college: "IIT Kanpur",
    invites: 87,
    rewardsEarned: 26100,
    badge: "All-Time GOAT 🐐",
    badgeType: "gold",
    persona: "student",
  },
  {
    rank: 2,
    name: "Suresh Chandra Gupta",
    avatar: "SG",
    college: "Kakadeo Master Host Node",
    invites: 64,
    rewardsEarned: 32000,
    badge: "Community Anchor ⚓",
    badgeType: "amber",
    persona: "host",
  },
  {
    rank: 3,
    name: "Riya Verma",
    avatar: "RV",
    college: "HBTI Kanpur",
    invites: 58,
    rewardsEarned: 17400,
    badge: "Stash Queen 👸",
    badgeType: "silver",
    persona: "student",
  },
  {
    rank: 4,
    name: "Prashant Pandey",
    avatar: "PP",
    college: "PhysicsWallah Kakadeo Hub",
    invites: 41,
    rewardsEarned: 12300,
    badge: "Growth Engine ⚡",
    badgeType: "mint",
    persona: "student",
  },
];

export function ReferralLeaderboard({ onRefer }: { onRefer?: () => void }) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isHost = role === "host";

  const [timeframe, setTimeframe] = useState<"month" | "alltime">("month");
  const [copied, setCopied] = useState(false);

  const entries = timeframe === "month" ? LEADERBOARD_THIS_MONTH : LEADERBOARD_ALL_TIME;
  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];
  const remainingRanks = entries.slice(3);

  const mockUserCode = isHost ? "HOST-SUR2026" : "STASH-KNP2026";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(mockUserCode);
    setCopied(true);
    toast.success(isHi ? "रेफरल कोड कॉपी हो गया!" : "Referral Code Copied!", {
      description: isHi
        ? `₹300 स्टैशक्रेडिट अनलॉक करने के लिए दोस्तों के साथ कोड ${mockUserCode} शेयर करें।`
        : `Share code ${mockUserCode} with friends to earn ₹300 StashCredit!`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (onRefer) {
      onRefer();
      return;
    }
    const text = isHost
      ? isHi
        ? `🏡 *कानपुर में अपने खाली कमरे से हर महीने ₹11,500+ कमाएं!* 🌟\n\nनमस्ते! मैं StashSaarthi के साथ ₹11,500+/माह गरिमापूर्ण आय कमा रहा हूं। 100% एस्क्रौ भुगतान, नियमों पर नियंत्रण व ₹10k बीमा।\n\n🎁 इनवाइट कोड *${mockUserCode}* के साथ 0% ऑनबोर्डिंग शुल्क पाएं:\n👉 ${APP_BASE_URL}?role=host&ref=${mockUserCode}`
        : `🏡 *EARN ₹11,500+/MONTH FROM YOUR SPARE SPACE IN KANPUR!* 🌟\n\nNamaste! I'm earning ₹11,500+/mo passive income hosting verified students with StashSaarthi.\n\n🛡️ 100% Escrow payouts & ₹10k safety cover.\n\n🎁 Claim 0% onboarding fee with invite code *${mockUserCode}*:\n👉 ${APP_BASE_URL}?role=host&ref=${mockUserCode}`
      : isHi
        ? `🚨 *छुट्टियों में खाली रूम का ₹8,000 डेड-रेंट मत फूंको!* 🚨\n\nअरे! StashSaarthi हमारे सेमेस्टर लगेज को कैंपस के पास मात्र *₹300/माह* में सुरक्षित रख रहा है! लेजर सील + ₹10k बीमा।\n\n🎁 ₹300 फ्री क्रेडिट के लिए मेरा इनवाइट कोड *${mockUserCode}* उपयोग करें:\n👉 ${APP_BASE_URL}?ref=${mockUserCode}`
        : `🚨 *DON'T BURN ₹8,000 DEAD-RENT THIS VACATION!* 🚨\n\nHey! StashSaarthi stores vacation luggage for *₹300/mo* near campus with laser seals & ₹10k insurance!\n\n🎁 Use invite code *${mockUserCode}* for ₹300 free credit:\n👉 ${APP_BASE_URL}?ref=${mockUserCode}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="leaderboard" className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedContent distance={30} threshold={0.1}>
          {/* Header Title & Badges */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isHi ? "कैंपस रेफरल चैलेंज '26" : "Viral Campus Referral Leaderboard"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              {isHi ? (
                <>
                  रेफर करें, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">कैंपस रैंक बढ़ाएं</span> &amp; नकद इनाम पाएं
                </>
              ) : (
                <>
                  Refer Friends, Climb <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Campus Rankings</span> &amp; Earn Cash
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300">
              {isHi
                ? "IIT कानपुर, HBTI, CSJMU और काकादेव के छात्रों और वरिष्ठ होस्ट्स के साथ प्रतिस्पर्धा करें। टॉप रेफरर्स को ₹5,000 नकद + मुफ्त स्टोरेज मिलता है!"
                : "Compete with students & hosts across IIT Kanpur, HBTI, CSJMU & Kakadeo hubs. Top referrers win ₹5,000 cash bonus + 6 months free storage!"}
            </p>

            {/* Timeframe Switcher Tabs */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setTimeframe("month")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === "month"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-950/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "इस महीने (मार्च 2026)" : "This Month (March 2026)"}
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("alltime")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === "alltime"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-950/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "सर्वश्रेष्ठ (All-Time)" : "All-Time Legends"}
                </button>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* 🏆 TOP 3 PODIUM SECTION */}
        <AnimatedContent distance={40} delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end mb-10 max-w-4xl mx-auto">
            {/* 🥈 #2 SILVER RANK (LEFT) */}
            {top2 && (
              <div className="order-2 md:order-1 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 text-center relative backdrop-blur-xl hover:border-slate-400/50 transition-all group">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-sm border-2 border-slate-100 shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 p-0.5 mx-auto mb-3 mt-2 shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-slate-200 font-bold text-lg">
                    {top2.avatar}
                  </div>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold mb-1">
                  {top2.badge}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-slate-200">{top2.name}</h3>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                  <span>{top2.college}</span>
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between px-2">
                  <span className="text-xs text-slate-400">{isHi ? "रेफरल:" : "Invites:"}</span>
                  <span className="text-sm font-extrabold text-white">{top2.invites} {isHi ? "छात्र" : "friends"}</span>
                </div>
                <div className="mt-1 flex items-center justify-between px-2">
                  <span className="text-xs text-slate-400">{isHi ? "कमाई:" : "Earned:"}</span>
                  <span className="text-sm font-extrabold text-emerald-400">₹{top2.rewardsEarned.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            {/* 🥇 #1 GOLD CHAMPION RANK (CENTER - ELEVATED) */}
            {top1 && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-900/90 border-2 border-amber-500/60 rounded-2xl p-6 text-center relative backdrop-blur-xl shadow-2xl shadow-amber-500/10 hover:border-amber-400 transition-all group scale-105 z-10">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xl border-2 border-yellow-200">
                  <Crown className="w-6 h-6 text-slate-950 fill-amber-300" />
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-1 mx-auto mb-3 mt-4 shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-extrabold text-xl">
                    {top1.avatar}
                  </div>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-1">
                  {top1.badge}
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-200">{top1.name}</h3>
                <p className="text-xs text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{top1.college}</span>
                </p>
                <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-between px-3">
                  <span className="text-xs text-slate-300 font-medium">{isHi ? "कुल रेफरल:" : "Total Invites:"}</span>
                  <span className="text-base font-black text-amber-300">{top1.invites} {isHi ? "सफल" : "invites"}</span>
                </div>
                <div className="mt-1 flex items-center justify-between px-3">
                  <span className="text-xs text-slate-300 font-medium">{isHi ? "कुल पुरस्कार:" : "Cash & Rewards:"}</span>
                  <span className="text-base font-black text-emerald-400">₹{top1.rewardsEarned.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            {/* 🥉 #3 BRONZE RANK (RIGHT) */}
            {top3 && (
              <div className="order-3 bg-slate-900/60 border border-amber-800/40 rounded-2xl p-5 text-center relative backdrop-blur-xl hover:border-amber-700/60 transition-all group">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black text-sm border-2 border-amber-600 shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 p-0.5 mx-auto mb-3 mt-2 shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-200 font-bold text-lg">
                    {top3.avatar}
                  </div>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[10px] font-semibold mb-1">
                  {top3.badge}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-slate-200">{top3.name}</h3>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-amber-400" />
                  <span>{top3.college}</span>
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between px-2">
                  <span className="text-xs text-slate-400">{isHi ? "रेफरल:" : "Invites:"}</span>
                  <span className="text-sm font-extrabold text-white">{top3.invites} {isHi ? "रेफरल" : "invites"}</span>
                </div>
                <div className="mt-1 flex items-center justify-between px-2">
                  <span className="text-xs text-slate-400">{isHi ? "कमाई:" : "Earned:"}</span>
                  <span className="text-sm font-extrabold text-emerald-400">₹{top3.rewardsEarned.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>
        </AnimatedContent>

        {/* 📊 RANKS 4 TO 8 LIST & YOUR LIVE STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Left 2 Cols: Leaderboard Ranks List */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? "शीर्ष 8 कैंपस लीडरबोर्ड सदस्य" : "Top Campus Champion Rankings"}</span>
            </h3>

            {remainingRanks.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 transition-all backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">#{entry.rank}</span>
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                    {entry.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{entry.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                        {entry.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{entry.college}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white">{entry.invites} {isHi ? "रेफरल" : "Invites"}</div>
                  <div className="text-xs font-semibold text-emerald-400">₹{entry.rewardsEarned.toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Col: Your Current Standing & Action Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900/90 border border-emerald-500/30 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{isHi ? "आपकी वर्तमान रैंक" : "Your Standing"}</h4>
                    <p className="text-xs text-slate-400">{isHi ? "कैंपस पास ID: #SS-8921" : "Pass ID: #SS-8921"}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs">
                  #12 {isHi ? "रैंक" : "Rank"}
                </span>
              </div>

              {/* Progress Bar to Top 10 */}
              <div className="space-y-1.5 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{isHi ? "टॉप 10 माइलस्टोन" : "Top 10 Milestone"}</span>
                  <span className="font-bold text-emerald-400">4 / 5 {isHi ? "रेफरल" : "Invites"}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-4/5" />
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  {isHi
                    ? "💡 1 और सफल रेफरल पर ₹1,000 का अतिरिक्त बोनस unlocks होगा!"
                    : "💡 1 more referral unlocks ₹1,000 extra bonus credit!"}
                </p>
              </div>

              {/* Your Invite Code Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {isHi ? "आपका आमंत्रण कोड" : "Your Invite Code"}
                  </span>
                  <span className="font-mono text-sm font-black tracking-wider text-emerald-300">
                    {mockUserCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  title={isHi ? "कोड कॉपी करें" : "Copy Code"}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Share CTA Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <Share2 className="w-4 h-4 fill-slate-950" />
                <span>{isHi ? "व्हाट्सएप पर रेफरल भेजें" : "Share Referral on WhatsApp"}</span>
              </button>
            </div>

            {/* Reward Tiers Info Box */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-2.5">
              <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? "रेफरल रिवॉर्ड संरचना" : "Referral Reward Tiers"}</span>
              </h5>
              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>• 1 Refer:</span>
                  <span className="text-emerald-400 font-semibold">₹300 StashCredit</span>
                </div>
                <div className="flex justify-between">
                  <span>• 3 Refers:</span>
                  <span className="text-emerald-400 font-semibold">1 Month Free Storage</span>
                </div>
                <div className="flex justify-between">
                  <span>• 5 Refers:</span>
                  <span className="text-amber-300 font-bold">₹1,500 Cash Payout</span>
                </div>
                <div className="flex justify-between">
                  <span>• 10+ Refers:</span>
                  <span className="text-amber-400 font-bold">Campus Captain Badge 🏆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
