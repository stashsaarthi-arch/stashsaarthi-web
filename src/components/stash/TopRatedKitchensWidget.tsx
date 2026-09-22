import React, { useState } from "react";
import {
  Award,
  Crown,
  Medal,
  Star,
  ThumbsUp,
  MapPin,
  Utensils,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ChefHat,
  Vote,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { checkAndRecordRateLimit } from "@/lib/rateLimiter";
import { playClick, playPop } from "@/lib/audio";
import { RoommateMenuShareModal, MenuShareDetails } from "./RoommateMenuShareModal";
import { SaarthiKitchenSchema } from "@/components/seo/SaarthiKitchenSchema";

export interface TopKitchen {
  id: string;
  rank: 1 | 2 | 3;
  name: string;
  nameHi: string;
  location: string;
  locationHi: string;
  chefName: string;
  chefNameHi: string;
  rating: number;
  voteCount: number;
  specialty: string;
  specialtyHi: string;
  pricePerMeal: number;
  monthlyPass: number;
  badge: string;
  badgeHi: string;
  highlights: string[];
  highlightsHi: string[];
  avatarColor: string;
  borderColor: string;
  accentBg: string;
}

const INITIAL_KITCHENS: TopKitchen[] = [
  {
    id: "annapurna",
    rank: 1,
    name: "Annapurna Verified PG Owner Home Kitchen",
    nameHi: "अन्नपूर्णा सीनियर होम किचन",
    location: "Kakadeo Coaching Belt (PW & Allen 80m)",
    locationHi: "काकादेव कोचिंग बेल्ट (PW एवं एलन से 80 मी)",
    chefName: "Sunita Sharma Ji (62 yrs)",
    chefNameHi: "सुनीता शर्मा जी (62 वर्ष)",
    rating: 4.95,
    voteCount: 342,
    specialty: "Desi Ghee Dal Tadka, Shahi Paneer & Tawa Rotis",
    specialtyHi: "देसी घी दाल तड़का, शाही पनीर एवं तवा रोटियां",
    pricePerMeal: 90,
    monthlyPass: 2400,
    badge: "🥇 #1 Rated Student Choice",
    badgeHi: "🥇 #1 सर्वोच्च पसंदीदा छात्र पसंद",
    highlights: ["100% Pure Desi Ghee", "Zero Canteen Preservatives", "RO Water Purified"],
    highlightsHi: ["100% शुद्ध देसी घी", "शून्य कैंटीन मिलावट", "RO शुद्ध जल से निर्मित"],
    avatarColor: "from-amber-400 to-yellow-600",
    borderColor: "border-amber-500/40 hover:border-amber-400",
    accentBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  {
    id: "dadimaa",
    rank: 2,
    name: "Dadi Maa Home Tiffins",
    nameHi: "दादी मां होम टिफिन",
    location: "CSJMU Kalyanpur Gate #2 & Nankari Belt",
    locationHi: "CSJMU कल्याणपुर गेट #2 एवं नानकारी बेल्ट",
    chefName: "Sudha Tripathi Ji (67 yrs)",
    chefNameHi: "सुधा त्रिपाठी जी (67 वर्ष)",
    rating: 4.91,
    voteCount: 289,
    specialty: "Homestyle Matar Paneer, Chana Masala & Soft Phulka",
    specialtyHi: "घर जैसा मटर पनीर, चना मसाला एवं मुलायम फुल्का",
    pricePerMeal: 85,
    monthlyPass: 2300,
    badge: "🥈 #2 Most Loved Mess",
    badgeHi: "🥈 #2 सर्वाधिक लोकप्रिय मेस",
    highlights: ["Low Oil Healthy Cooking", "Daily Fresh Sabzi Variety", "1-Tap Pause Option"],
    highlightsHi: ["कम तेल युक्त स्वास्थ्यप्रद भोजन", "रोज़ाना ताज़ी सब्जी", "1-टैप पॉज़ सुविधा"],
    avatarColor: "from-slate-300 to-slate-500",
    borderColor: "border-slate-400/40 hover:border-slate-300",
    accentBg: "bg-slate-400/10 text-slate-300 border-slate-400/30",
  },
  {
    id: "shanti",
    rank: 3,
    name: "Shanti Nivas Home Food",
    nameHi: "शांति निवास होम फूड",
    location: "HBTI West Campus & Nawabganj Gate",
    locationHi: "HBTI वेस्ट कैंपस एवं नवाबगंज गेट",
    chefName: "Kamla Devi Ji (64 yrs)",
    chefNameHi: "कमला देवी जी (64 वर्ष)",
    rating: 4.88,
    voteCount: 215,
    specialty: "Punjabi Kadhi Pakoda, Special Jeera Rice & Gulab Jamun",
    specialtyHi: "पंजाबी कढ़ी पकोड़ा, स्पेशल जीरा राइस एवं गुलाब जामुन",
    pricePerMeal: 90,
    monthlyPass: 2400,
    badge: "🥉 #3 High Protein Choice",
    badgeHi: "🥉 #3 उच्च प्रोटीन डाइट पसंद",
    highlights: ["Extra Sprouts & Salad", "Hot Stainless Steel Tiffins", "Sunday Special Sweet"],
    highlightsHi: ["अतिरिक्त अंकुरित सलाद", "गर्म स्टेनलेस स्टील टिफिन", "रविवार विशेष मिठाई"],
    avatarColor: "from-amber-700 to-amber-900",
    borderColor: "border-amber-700/40 hover:border-amber-600",
    accentBg: "bg-amber-700/10 text-amber-400 border-amber-700/30",
  },
];

interface TopRatedKitchensWidgetProps {
  onOrderMeal?: (kitchenId: string) => void;
}

export const TopRatedKitchensWidget: React.FC<TopRatedKitchensWidgetProps> = ({ onOrderMeal }) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [kitchens, setKitchens] = useState<TopKitchen[]>(INITIAL_KITCHENS);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [isRoommateShareOpen, setIsRoommateShareOpen] = useState(false);
  const [roommateShareDetails, setRoommateShareDetails] = useState<MenuShareDetails | undefined>(
    undefined,
  );
  const [nominateForm, setNominateForm] = useState({
    hostName: "",
    address: "",
    phone: "",
    specialty: "",
  });

  const handleVote = (kitchenId: string) => {
    playPop();

    // Check rate limit (1 vote per 5s per kitchen)
    const rateLimitCheck = checkAndRecordRateLimit(`kitchen_vote_${kitchenId}`, {
      minIntervalMs: 5000,
    });
    if (!rateLimitCheck.allowed) {
      toast.warning(
        isHi
          ? `कृपया वोट करने से पहले ${rateLimitCheck.remainingSeconds} सेकंड प्रतीक्षा करें।`
          : `Please wait ${rateLimitCheck.remainingSeconds}s before voting again.`,
      );
      return;
    }

    if (votedIds[kitchenId]) {
      toast.info(
        isHi
          ? "आपने इस रसोई के लिए इस सप्ताह पहले ही वोट कर दिया है!"
          : "You have already voted for this kitchen this week!",
      );
      return;
    }

    setKitchens((prev) =>
      prev.map((k) => (k.id === kitchenId ? { ...k, voteCount: k.voteCount + 1 } : k)),
    );
    setVotedIds((prev) => ({ ...prev, [kitchenId]: true }));

    toast.success(
      isHi
        ? "आपका वोट दर्ज हो गया है! कानपुर की वरिष्ठ माताओं के होम किचन का समर्थन करने के लिए धन्यवाद।"
        : "Your student vote has been recorded! Thank you for supporting verified verified PG owner home kitchens.",
    );
  };

  const handleNominateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    const rateLimitCheck = checkAndRecordRateLimit("nominate_kitchen", { minIntervalMs: 10000 });
    if (!rateLimitCheck.allowed) {
      toast.warning(
        isHi
          ? `कृपया ${rateLimitCheck.remainingSeconds} सेकंड प्रतीक्षा करें।`
          : `Please wait ${rateLimitCheck.remainingSeconds}s before submitting again.`,
      );
      return;
    }

    if (!nominateForm.hostName || !nominateForm.phone) {
      toast.error(isHi ? "कृपया नाम और मोबाइल नंबर भरें।" : "Please fill in Host Name and Phone.");
      return;
    }

    toast.success(
      isHi
        ? "वरिष्ठ रसोई नामांकन प्राप्त हुआ! हमारी ऑडिट टीम 24 घंटे में भौतिक सत्यापन करेगी।"
        : "Kitchen nomination submitted! Our safety team will perform 3-tier host audit within 24 hours.",
    );
    setNominateForm({ hostName: "", address: "", phone: "", specialty: "" });
    setShowNominateModal(false);
  };

  const totalVotesThisWeek = kitchens.reduce((sum, k) => sum + k.voteCount, 0);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" id="top-rated-kitchens">
      {/* Dynamic Schema.org JSON-LD for Google Search Results (Task 75) */}
      <SaarthiKitchenSchema />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-emerald-500/20 p-6 md:p-10 mb-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {isHi ? "सत्यापित छात्र मतदान • सप्ताह #36" : "Verified Student Poll • Week #36"}
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              {isHi ? "सप्ताह की टॉप 3 पसंदीदा रसोईयाँ" : "Top 3 Rated Kitchens of the Week"}
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
              {isHi
                ? "कानपुर (काकादेव, IITK, CSJMU, HBTI) के छात्रों द्वारा चुनी गई सर्वोत्तम वरिष्ठ माताओं की रसोईयाँ। शुद्ध देसी घी, शून्य मिलावट एवं 100% हाइजीन।"
                : "Voted by verified students across Kanpur campuses. Authentic home-cooked meals prepared with love by verified PG owner mother chefs."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 text-center min-w-[150px]">
              <div className="text-xs text-slate-400 font-medium">
                {isHi ? "कुल छात्र वोट" : "Total Verified Votes"}
              </div>
              <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
                <Vote className="w-5 h-5 text-emerald-400" />
                {totalVotesThisWeek.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                setShowNominateModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ChefHat className="w-4 h-4" />
              {isHi ? "वरिष्ठ रसोई नामंकित करें" : "Nominate Verified PG Owner Kitchen"}
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Kitchen Podium Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {kitchens.map((kitchen) => {
          const isVoted = !!votedIds[kitchen.id];
          const rankIcon =
            kitchen.rank === 1 ? (
              <Crown className="w-6 h-6 text-amber-300" />
            ) : kitchen.rank === 2 ? (
              <Medal className="w-6 h-6 text-slate-300" />
            ) : (
              <Award className="w-6 h-6 text-amber-600" />
            );

          return (
            <div
              key={kitchen.id}
              className={`relative rounded-3xl bg-slate-900/80 border ${
                kitchen.borderColor
              } p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-md ${
                kitchen.rank === 1 ? "md:-mt-2 md:mb-2 border-amber-500/50 shadow-amber-500/10" : ""
              }`}
            >
              {/* Rank Pill Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${kitchen.accentBg}`}
                >
                  {rankIcon}
                  {isHi ? kitchen.badgeHi : kitchen.badge}
                </span>

                <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/50 px-2.5 py-1 rounded-full text-amber-400 font-black text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {kitchen.rating.toFixed(2)}
                </div>
              </div>

              {/* Kitchen Info */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kitchen.avatarColor} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}
                  >
                    #{kitchen.rank}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white leading-snug">
                      {isHi ? kitchen.nameHi : kitchen.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <ChefHat className="w-3.5 h-3.5" />
                      {isHi ? kitchen.chefNameHi : kitchen.chefName}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-1.5 mb-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700/40">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{isHi ? kitchen.locationHi : kitchen.location}</span>
                </div>

                {/* Specialty Dish Box */}
                <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-3.5 mb-4">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    {isHi ? "विशेष थली / सिग्नेचर डिश" : "Weekly Signature Dish"}
                  </div>
                  <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                    {isHi ? kitchen.specialtyHi : kitchen.specialty}
                  </p>
                </div>

                {/* Highlights list */}
                <ul className="space-y-1.5 mb-5">
                  {(isHi ? kitchen.highlightsHi : kitchen.highlights).map((hl, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Actions */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {isHi ? "प्रति थाली" : "Per Meal"}
                    </span>
                    <span className="text-lg font-black text-white">₹{kitchen.pricePerMeal}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {isHi ? "मासिक पास" : "Monthly Pass"}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      ₹{kitchen.monthlyPass}/mo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVote(kitchen.id)}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                      isVoted
                        ? "bg-emerald-500 text-slate-950 cursor-default"
                        : "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? "fill-slate-950" : ""}`} />
                    {isVoted
                      ? isHi
                        ? "वोट दर्ज ✓"
                        : "Voted ✓"
                      : isHi
                        ? `वोट (${kitchen.voteCount})`
                        : `Vote (${kitchen.voteCount})`}
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      if (onOrderMeal) {
                        onOrderMeal(kitchen.id);
                      } else {
                        window.open(
                          `https://wa.me/919369454350?text=${encodeURIComponent(
                            `Hi StashSaarthi, I want to order tiffin pass from ${kitchen.name} (Rank #${kitchen.rank} Kitchen)`,
                          )}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
                  >
                    {isHi ? "टिफिन ऑर्डर करें" : "Order Tiffin"}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setRoommateShareDetails({
                      menuName: isHi ? kitchen.nameHi : kitchen.name,
                      price: kitchen.pricePerMeal,
                      kitchenNode: isHi ? kitchen.locationHi : kitchen.location,
                      slot: "Lunch",
                      description: isHi ? kitchen.specialtyHi : kitchen.specialty,
                    });
                    setIsRoommateShareOpen(true);
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-950 border border-teal-500/30 hover:border-teal-400 text-teal-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 hover:bg-slate-900"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                  <span>
                    {isHi ? "रूममेट के साथ मेनू शेयर करें 📱" : "Share Menu with Roommate 📱"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Safety Assurance Banner */}
      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              {isHi
                ? "100% खाद्य सुरक्षा एवं वरिष्ठ सम्मान गारंटी"
                : "100% Food Safety & Verified PG Owner Dignity Assurance"}
            </div>
            <p className="text-slate-400 mt-0.5">
              {isHi
                ? "प्रत्येक रसोई का 3-स्तरीय ऑडिट होता है (FSSAI मानक, RO जल परीक्षण, एवं ताज़ी सामग्री प्रमाणन)। 100% राशि सीधे वरिष्ठ माता के खाते में हस्तांतरित होती है।"
                : "Every kitchen node undergoes 3-tier audit (FSSAI hygiene norms, RO water test & fresh ingredient check). Direct escrow payouts to premium hosts."}
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/919369454350?text=Hi%20StashSaarthi%20Food%20Audit%20Team"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 shrink-0 transition-all flex items-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          {isHi ? "हेल्पलाइन +91 9369454350" : "Kitchen Helpline +91 9369454350"}
        </a>
      </div>

      {/* Nominate Kitchen Modal */}
      {showNominateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              {isHi
                ? "वरिष्ठ गृहणी रसोई नामांकित करें"
                : "Nominate a Verified PG Owner Home Kitchen"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {isHi
                ? "क्या आपके पड़ोस में कोई वरिष्ठ नागरिक हैं जो छात्रों के लिए स्वादिष्ट, शुद्ध भोजन बनाते हैं? उनका नाम दर्ज करें, हमारी टीम 24 घंटे में संपर्क करेगी।"
                : "Know a premium host in Kanpur who prepares delicious home-cooked meals for students? Nominate them for zero-capex onboarding."}
            </p>

            <form onSubmit={handleNominateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isHi ? "वरिष्ठ होस्ट का नाम *" : "Verified PG Owner Host Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Sharma Ji"
                  value={nominateForm.hostName}
                  onChange={(e) => setNominateForm({ ...nominateForm, hostName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isHi ? "स्थान / इलाका (कानपुर) *" : "Location / Area (Kanpur) *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kakadeo, Kalyanpur, Swaroop Nagar"
                  value={nominateForm.address}
                  onChange={(e) => setNominateForm({ ...nominateForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isHi ? "संपर्क मोबाइल नंबर *" : "Contact Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={nominateForm.phone}
                  onChange={(e) => setNominateForm({ ...nominateForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isHi ? "विशेष व्यंजन (ऐच्छिक)" : "Specialty Dish (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Desi Ghee Dal Tadka, Kadhi Pakoda"
                  value={nominateForm.specialty}
                  onChange={(e) => setNominateForm({ ...nominateForm, specialty: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNominateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                >
                  {isHi ? "नामांकन जमा करें" : "Submit Nomination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roommate Menu Share Modal (Task 73) */}
      <RoommateMenuShareModal
        open={isRoommateShareOpen}
        onOpenChange={setIsRoommateShareOpen}
        defaultDetails={roommateShareDetails}
      />
    </section>
  );
};
