import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Medal,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  Gift,
  Heart,
  TrendingUp,
  ShieldCheck,
  X,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export type SeniorTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface KarmaHostProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  location_hi?: string;
  points: number;
  tier: SeniorTier;
  badges: string[];
  badges_hi?: string[];
  recentActivity: string;
  recentActivity_hi?: string;
}

export const LEADERBOARD_HOSTS: KarmaHostProfile[] = [
  {
    id: "h1",
    name: "Sudha Tripathi Ji",
    age: 71,
    location: "Swaroop Nagar, Kanpur",
    location_hi: "स्वरूप नगर, कानपुर",
    points: 1480,
    tier: "Gold",
    badges: ["Community Anchor", "Evening Mentorship", "5★ Host"],
    badges_hi: ["कम्युनिटी एंकर", "शाम का मार्गदर्शन", "5★ होस्ट"],
    recentActivity: "+50 pts: Hosted Sunday Evening Tea & Career Mentorship",
    recentActivity_hi: "+50 अंक: रविवार चाय व करियर मार्गदर्शन आयोजित किया",
  },
  {
    id: "h2",
    name: "Col. R. Bajpai",
    age: 78,
    location: "Gomti Nagar, Lucknow",
    location_hi: "गोमती नगर, लखनऊ",
    points: 1320,
    tier: "Gold",
    badges: ["Ex-Army Veteran", "Interview Coach", "Zero Friction"],
    badges_hi: ["पूर्व सैन्य अधिकारी", "इंटरव्यू कोच", "ज़ीरो फ्रिक्शन"],
    recentActivity: "+40 pts: 100% On-time House Rule Compliance",
    recentActivity_hi: "+40 अंक: 100% समयबद्ध गृह नियमों का पालन",
  },
  {
    id: "h3",
    name: "Vasant Deshpande Ji",
    age: 74,
    location: "Kothrud, Pune",
    location_hi: "कोथरूड, पुणे",
    points: 1150,
    tier: "Silver",
    badges: ["Cultural Mentor", "Home Tiffin Chef", "UPI Trained"],
    badges_hi: ["सांस्कृतिक मार्गदर्शक", "घरेलू टिफिन शेफ", "यूपीआई प्रशिक्षित"],
    recentActivity: "+30 pts: Completed Smartphone Tech Exchange Session",
    recentActivity_hi: "+30 अंक: स्मार्टफोन टेक एक्सचेंज सत्र पूरा किया",
  },
  {
    id: "h4",
    name: "Kamla Arora Ji",
    age: 69,
    location: "Noida Sec 51, Delhi NCR",
    location_hi: "नोएडा सेक्टर 51, दिल्ली एनसीआर",
    points: 980,
    tier: "Silver",
    badges: ["Retired Banker", "Finance Mentor", "Warm Host"],
    badges_hi: ["सेवानिवृत्त बैंकर", "वित्तीय मार्गदर्शक", "स्नेही होस्ट"],
    recentActivity: "+100 pts: 3 Months Continuous Student Co-Living",
    recentActivity_hi: "+100 अंक: 3 महीने निरंतर छात्र सह-आवास",
  },
];

export const TIER_CONFIG: Record<
  SeniorTier,
  {
    name: string;
    name_hi: string;
    minPts: number;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: typeof Award;
    perks: string[];
    perks_hi: string[];
  }
> = {
  Bronze: {
    name: "Bronze Saarthi",
    name_hi: "कांस्य सार्थी",
    minPts: 0,
    color: "text-amber-600",
    bgColor: "bg-amber-950/30",
    borderColor: "border-amber-700/40",
    icon: Award,
    perks: ["Verified Senior Badge", "Standard Student Matching", "24/7 Bedside SOS Access"],
    perks_hi: ["सत्यापित वरिष्ठ बैज", "मानक छात्र मिलान", "24/7 बेडसाइड SOS सुविधा"],
  },
  Silver: {
    name: "Silver Mentor",
    name_hi: "रजत मार्गदर्शक",
    minPts: 500,
    color: "text-slate-300",
    bgColor: "bg-slate-800/40",
    borderColor: "border-slate-500/40",
    icon: Medal,
    perks: [
      "Priority Student Matching (2x Faster)",
      "Free Home Safety & Lock Audit",
      "Monthly Grocery Voucher ₹500",
    ],
    perks_hi: [
      "प्राथमिकता छात्र मिलान (2x तेज)",
      "निःशुल्क गृह सुरक्षा व लॉक ऑडिट",
      "मासिक किराना वाउचर ₹500",
    ],
  },
  Gold: {
    name: "Gold Community Anchor",
    name_hi: "स्वर्ण कम्युनिटी एंकर",
    minPts: 1200,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    icon: Trophy,
    perks: [
      "0% Platform Commission Bonus",
      "Seasonal Festival Gift Hamper (₹1,000)",
      "Featured Badge on Search Radar",
      "Free Plumbing/Electrician Service",
    ],
    perks_hi: [
      "0% प्लेटफॉर्म कमीशन बोनस",
      "त्योहार विशेष उपहार हैम्पर (₹1,000)",
      "खोज रडार पर प्रमुख बैज",
      "निःशुल्क प्लंबिंग/इलेक्ट्रीशियन सेवा",
    ],
  },
  Platinum: {
    name: "Platinum Champion",
    name_hi: "प्लेटिनम चैम्पियन",
    minPts: 2500,
    color: "text-cyan-300",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-400/40",
    icon: Sparkles,
    perks: [
      "Lifetime Zero-Fee Onboarding",
      "Annual Intergenerational Living Award Trophy",
      "Fully Subsidized Health Checkup Package",
      "VIP Direct Founder Hotline",
    ],
    perks_hi: [
      "आजीवन शून्य-शुल्क ऑनबोर्डिंग",
      "वार्षिक सह-आवास सम्मान ट्रॉफी",
      "पूर्णतः रियायती स्वास्थ्य जांच पैकेज",
      "वीआईपी डायरेक्ट फाउंडर हॉटलाइन",
    ],
  },
};

export function KarmaPointsBadge({
  points,
  tier,
  compact = false,
  onClick,
}: {
  points: number;
  tier: SeniorTier;
  compact?: boolean | undefined;
  onClick?: (() => void) | undefined;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition hover:scale-105 cursor-pointer ${config.bgColor} ${config.borderColor} ${config.color}`}
        title="View Saarthi Connect Karma Points & Perks"
      >
        <Icon className="h-3 w-3" />
        <span>{points} Pts</span>
        <span className="opacity-75">· {isHi ? config.name_hi : config.name}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer transition hover:shadow-lg ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-black/40 ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black uppercase tracking-wider ${config.color}`}>
                {isHi ? config.name_hi : config.name}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isHi
                ? "सक्रिय वरिष्ठ भागीदारी पुरस्कार"
                : "Active Senior Host Participation Reward"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-amber-400 font-mono">{points}</span>
          <span className="text-[10px] text-slate-400 block font-sans">
            {isHi ? "कर्म अंक (Karma Pts)" : "Karma Pts"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function KarmaPointsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [selectedHost, setSelectedHost] = useState<KarmaHostProfile>(
    LEADERBOARD_HOSTS[0] || {
      id: "h1",
      name: "Sudha Tripathi Ji",
      age: 71,
      location: "Swaroop Nagar, Kanpur",
      points: 1480,
      tier: "Gold",
      badges: ["Community Anchor"],
      recentActivity: "+50 pts: Hosted Evening Tea",
    }
  );

  const activeConfig = TIER_CONFIG[selectedHost.tier];
  const nextTierPts =
    selectedHost.tier === "Bronze"
      ? 500
      : selectedHost.tier === "Silver"
        ? 1200
        : selectedHost.tier === "Gold"
          ? 2500
          : 5000;

  const currentMin = activeConfig.minPts;
  const progressPercent = Math.min(
    100,
    Math.max(5, Math.round(((selectedHost.points - currentMin) / (nextTierPts - currentMin)) * 100))
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="karma-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-black/95 text-slate-100 p-4 sm:p-6 shadow-2xl shadow-amber-500/10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={isHi ? "मोडल बंद करें" : "Close Karma Rewards Modal"}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-amber-700/20 text-amber-400 shadow-md shadow-amber-500/20">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="karma-modal-title" className="text-base sm:text-lg font-bold text-white">
                    {isHi
                      ? "सार्थी कनेक्ट: वरिष्ठ कर्म अंक एवं सम्मान प्रणाली"
                      : "Saarthi Connect: Senior Karma Rewards System"}
                  </h2>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    Gamified Badging
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHi
                    ? "वरिष्ठ नागरिकों को छात्र संगति, मार्गदर्शन एवं आवास भागीदारी के लिए कर्म अंक व विशेष सुविधाएं मिलती हैं।"
                    : "Rewarding active seniors for student mentorship, warm co-living, and community participation."}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="mt-5 space-y-5">
              {/* Senior Selector Pills */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {isHi ? "वरिष्ठ होस्ट प्रोफ़ाइल चुनें (Inspect Senior Host)" : "Inspect Senior Host Profile"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LEADERBOARD_HOSTS.map((h) => {
                    const isSelected = h.id === selectedHost.id;
                    const hConfig = TIER_CONFIG[h.tier];
                    const HIcon = hConfig.icon;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHost(h)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/15 text-white shadow-md shadow-amber-500/20"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold truncate">
                          <span className="truncate">{h.name}</span>
                          <HIcon className={`h-3.5 w-3.5 shrink-0 ${hConfig.color}`} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className="text-amber-400 font-mono font-bold">{h.points} Pts</span>
                          <span className="text-slate-400 text-[10px]">{h.tier}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Host Badge Detail Card */}
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-black to-slate-900/60 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{selectedHost.name}, {selectedHost.age}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${activeConfig.bgColor} ${activeConfig.borderColor} ${activeConfig.color}`}>
                        {isHi ? activeConfig.name_hi : activeConfig.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📍 {isHi && selectedHost.location_hi ? selectedHost.location_hi : selectedHost.location}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-amber-400 font-mono">{selectedHost.points}</span>
                    <span className="text-xs text-slate-400 block font-sans">
                      {isHi ? "कुल अर्जित कर्म अंक" : "Total Karma Points"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>{isHi ? `स्तर प्रगति (${selectedHost.tier})` : `Tier Progress (${selectedHost.tier})`}</span>
                    <span>
                      {selectedHost.points} / {nextTierPts} XP ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 shadow-sm"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isHi
                      ? `अगले स्तर (${selectedHost.tier === "Gold" ? "Platinum" : "Gold"}) के लिए ${nextTierPts - selectedHost.points} कर्म अंक और चाहिए।`
                      : `Needs ${nextTierPts - selectedHost.points} more Karma Points to reach next tier.`}
                  </p>
                </div>

                {/* Badges & Recent Activity */}
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {isHi ? "अर्जित विशेष बैज" : "Earned Badges"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isHi && selectedHost.badges_hi ? selectedHost.badges_hi : selectedHost.badges).map((b) => (
                        <span key={b} className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400/30" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {isHi ? "हालिया गतिविधि" : "Recent Karma Activity"}
                    </span>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-300 flex items-start gap-1.5">
                      <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{isHi && selectedHost.recentActivity_hi ? selectedHost.recentActivity_hi : selectedHost.recentActivity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Perks & Rewards Charter */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-400" />
                    <span>
                      {isHi
                        ? `${activeConfig.name_hi} के लिए विशेष सुविधाएं एवं पुरस्कार`
                        : `${activeConfig.name} Exclusive Unlocked Perks`}
                    </span>
                  </h3>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {isHi ? "100% ऑनर गारंटी" : "100% Dignity Guarantee"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isHi ? activeConfig.perks_hi : activeConfig.perks).map((perk) => (
                    <div
                      key={perk}
                      className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 p-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How Seniors Earn Karma Points */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2.5">
                  <Info className="h-4 w-4 text-cyan-400" />
                  <span>{isHi ? "अंक कैसे अर्जित करें? (Karma Points Matrix)" : "How Senior Hosts Earn Karma Points"}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-white/10 bg-black/30 p-2.5">
                    <span className="font-bold text-amber-400 block">+100 Pts / Month</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {isHi ? "छात्र को सह-आवास प्रदान करने पर" : "Providing warm room co-living to student"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-2.5">
                    <span className="font-bold text-emerald-400 block">+30 Pts / Session</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {isHi ? "शाम का करियर/जीवन मार्गदर्शन व होम टी" : "Evening mentorship or home tea session"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-2.5">
                    <span className="font-bold text-cyan-400 block">+50 Pts / Review</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {isHi ? "छात्र से 5-स्टार रेटिंग व प्रशंसा प्राप्त होने पर" : "Receiving 5-star rating & review from student"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <Button
                  variant="hero"
                  className="w-full sm:flex-1 cursor-pointer bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-bold"
                  onClick={() => {
                    alert(
                      isHi
                        ? `वरिष्ठ होस्ट ${selectedHost.name} के कर्म अंक रिवॉर्ड की पुष्टि की गई!`
                        : `Karma rewards claim voucher generated for ${selectedHost.name}!`
                    );
                    onOpenChange(false);
                  }}
                >
                  <Gift className="h-4 w-4 mr-1.5" />
                  {isHi ? "होस्ट रिवॉर्ड वाउचर का दावा करें" : "Claim Senior Host Reward Voucher"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto cursor-pointer border-white/10 text-slate-300 hover:bg-white/10"
                  onClick={() => onOpenChange(false)}
                >
                  {isHi ? "बंद करें" : "Close"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
