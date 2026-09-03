import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeftRight,
  GraduationCap,
  Heart,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchDrawer } from "./MatchDrawer";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import type { OpenBooking } from "./types";
import { useLanguage } from "@/context/LanguageContext";

const CITIES = ["Kanpur", "Lucknow", "Delhi NCR", "Pune"] as const;
type City = (typeof CITIES)[number];

const CITIES_HI: Record<City, string> = {
  Kanpur: "कानपुर",
  Lucknow: "लखनऊ",
  "Delhi NCR": "दिल्ली एनसीआर",
  Pune: "पुणे",
};

type Match = {
  city: City;
  student: {
    name: string;
    detail: string;
    detail_hi?: string;
    gives: string[];
    gives_hi?: string[];
  };
  senior: {
    name: string;
    detail: string;
    detail_hi?: string;
    offers: string[];
    offers_hi?: string[];
  };
  score: number;
};

const MATCHES: Match[] = [
  {
    city: "Kanpur",
    student: {
      name: "Aarav Mishra",
      detail: "B.Tech, 2nd year · IIT Kanpur belt",
      detail_hi: "बी.टेक, द्वितीय वर्ष · आईआईटी कानपुर बेल्ट",
      gives: ["1 hr/day tech help", "Weekly grocery errands"],
      gives_hi: ["1 घंटा/दिन तकनीकी सहायता", "साप्ताहिक राशन व सामान लाना"],
    },
    senior: {
      name: "Sudha Tripathi, 71",
      detail: "Retired school principal · Swaroop Nagar",
      detail_hi: "सेवानिवृत्त प्रधानाचार्य · स्वरूप नगर",
      offers: ["Private room at ₹3,200", "Evening mentorship & home food"],
      offers_hi: ["₹3,200 में निजी कमरा", "शाम का मार्गदर्शन व घर का खाना"],
    },
    score: 96,
  },
  {
    city: "Lucknow",
    student: {
      name: "Ishita Rawat",
      detail: "MBA, 1st year · Gomti Nagar",
      detail_hi: "एमबीए, प्रथम वर्ष · गोमती नगर",
      gives: ["Video-call setup with family", "Medicine pickups"],
      gives_hi: ["परिवार संग वीडियो-कॉल सेटअप", "दवाइयां लाना"],
    },
    senior: {
      name: "Col. R. Bajpai, 78",
      detail: "Ex-Army · Gomti Nagar",
      detail_hi: "पूर्व सैन्य अधिकारी · गोमती नगर",
      offers: ["Furnished room at ₹2,800", "Interview prep & home food"],
      offers_hi: ["₹2,800 में सुसज्जित कमरा", "इंटरव्यू तैयारी व घर का खाना"],
    },
    score: 93,
  },
  {
    city: "Delhi NCR",
    student: {
      name: "Rohan Sethi",
      detail: "Design student · Noida Sec 62",
      detail_hi: "डिज़ाइन छात्र · नोएडा सेक्टर 62",
      gives: ["Smartphone & UPI training", "Sunday market runs"],
      gives_hi: ["स्मार्टफोन व यूपीआई प्रशिक्षण", "रविवार बाजार खरीदारी"],
    },
    senior: {
      name: "Kamla Arora, 69",
      detail: "Retired banker · Noida Sec 51",
      detail_hi: "सेवानिवृत्त बैंकर · नोएडा सेक्टर 51",
      offers: ["Room + kitchen access ₹4,500", "Finance mentorship"],
      offers_hi: ["कमरा + रसोई सुविधा ₹4,500", "वित्तीय मार्गदर्शन"],
    },
    score: 91,
  },
  {
    city: "Pune",
    student: {
      name: "Meghna Kulkarni",
      detail: "CS student · Kothrud",
      detail_hi: "कंप्यूटर साइंस छात्रा · कोथरूड",
      gives: ["Bill payments & paperwork", "Evening walks companionship"],
      gives_hi: ["बिल भुगतान व कागजी काम", "शाम की सैर में साथ"],
    },
    senior: {
      name: "Vasant Deshpande, 74",
      detail: "Retired engineer · Kothrud",
      detail_hi: "सेवानिवृत्त इंजीनियर · कोथरूड",
      offers: ["Balcony room ₹3,900", "Marathi cooking & home food"],
      offers_hi: ["बालकनी वाला कमरा ₹3,900", "मराठी व घरेलू भोजन"],
    },
    score: 95,
  },
];

export function Connect(_props: { onBook: OpenBooking }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [city, setCity] = useState<City>("Kanpur");
  const [drawer, setDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<"pairs" | "quiz">("pairs");

  // Compatibility Quiz state
  const [diet, setDiet] = useState<"veg" | "egg" | "any">("veg");
  const [schedule, setSchedule] = useState<"early" | "night">("early");
  const [helpHours, setHelpHours] = useState<"30m" | "1h" | "2h">("1h");

  const quizScore =
    90 + (diet === "veg" ? 4 : 2) + (schedule === "early" ? 3 : 1) + (helpHours === "1h" ? 2 : 1);

  const match = MATCHES.find((m) => m.city === city) ?? MATCHES[0]!;

  return (
    <div id="connect" className="relative mx-auto max-w-4xl px-2 py-2 scroll-mt-20">
      <div className="text-center">
        {/* Tab Switcher: Live Pairs vs Interactive Quiz */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("pairs")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
              activeTab === "pairs"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isHi ? "सत्यापित जोड़ियां देखें" : "Verified Host Pairs"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "quiz"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>{isHi ? "अनुकूलता क्विज़ (Match Quiz)" : "Compatibility Match Quiz"}</span>
          </button>
        </div>
      </div>

      {activeTab === "pairs" ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:justify-center">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`min-w-0 truncate rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  city === c
                    ? "border-amber/50 bg-amber/15 text-foreground shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25"
                }`}
              >
                {isHi ? CITIES_HI[c] : c}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${city}-${language}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="glass mt-4 rounded-2xl p-4 sm:p-5"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {isHi
                      ? `${CITIES_HI[match.city]} ${t.connectSection.liveSimulation}`
                      : `${match.city} Live Simulation`}
                  </span>
                  <PrototypeBadge variant="text" />
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-0.5 text-xs font-bold text-emerald">
                  <Sparkles className="h-3 w-3" /> {match.score}% {t.connectSection.compatibility}
                </span>
              </div>

              <div className="mt-3.5 grid items-stretch gap-2.5 sm:grid-cols-[1fr_auto_1fr]">
                <ProfileCard
                  icon={<GraduationCap className="h-4 w-4 text-cyan" />}
                  accent="var(--cyan)"
                  name={match.student.name}
                  detail={
                    isHi && match.student.detail_hi ? match.student.detail_hi : match.student.detail
                  }
                  label={t.connectSection.gives}
                  items={
                    isHi && match.student.gives_hi ? match.student.gives_hi : match.student.gives
                  }
                />

                <div className="flex items-center justify-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground">
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <ProfileCard
                  icon={<Heart className="h-4 w-4 text-amber" />}
                  accent="var(--amber)"
                  name={match.senior.name}
                  detail={
                    isHi && match.senior.detail_hi ? match.senior.detail_hi : match.senior.detail
                  }
                  label={t.connectSection.offers}
                  items={
                    isHi && match.senior.offers_hi ? match.senior.offers_hi : match.senior.offers
                  }
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="mt-6 w-full cursor-pointer"
                onClick={() => setDrawer(true)}
              >
                {t.connectSection.requestMatch}
              </Button>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-4 rounded-2xl p-4 sm:p-5 text-left"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                {isHi ? "इंटरएक्टिव अनुकूलता कैलकुलेटर" : "Interactive Compatibility Calibrator"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isHi
                  ? "अपनी आदतें चुनें और तुरंत देखें कि आपको कितना रेंट डिस्काउंट मिल सकता है।"
                  : "Choose your habits to compute match compatibility & monthly rental subsidy."}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Match Score</span>
              <div className="text-lg font-black text-emerald-400 font-mono">{quizScore}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Question 1 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                1. {isHi ? "खान-पान प्राथमिकता (Diet)" : "Dietary Preference"}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "veg", label: isHi ? "शुद्ध शाकाहारी (Pure Veg)" : "Pure Veg" },
                  { id: "egg", label: isHi ? "अंडे स्वीकार्य (Eggitarian)" : "Eggitarian" },
                  { id: "any", label: isHi ? "कोई भी (Flexible)" : "Flexible" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDiet(opt.id as any)}
                    className={`rounded-lg border p-1.5 text-xs text-left transition cursor-pointer w-full flex items-center justify-between ${
                      diet === opt.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white font-bold"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {diet === opt.id && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                2. {isHi ? "दिनचर्या व अध्ययन समय" : "Daily Study Routine"}
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: "early",
                    label: isHi ? "सुबह जल्दी उठने वाले (Early Bird)" : "Early Riser",
                  },
                  {
                    id: "night",
                    label: isHi ? "देर रात पढ़ाई (Quiet Night Owl)" : "Quiet Night Owl",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSchedule(opt.id as any)}
                    className={`rounded-lg border p-1.5 text-xs text-left transition cursor-pointer w-full flex items-center justify-between ${
                      schedule === opt.id
                        ? "border-amber-500/50 bg-amber-500/10 text-white font-bold"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {schedule === opt.id && <CheckCircle2 className="h-3 w-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                3. {isHi ? "होस्ट को दैनिक सहायता" : "Daily Host Assistance"}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "30m", label: isHi ? "30 मिनट / दिन" : "30 mins / day" },
                  {
                    id: "1h",
                    label: isHi ? "1 घंटा / दिन (60% सब्सिडी)" : "1 hr / day (60% subsidy)",
                  },
                  { id: "2h", label: isHi ? "2 घंटे / दिन" : "2 hrs / day" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHelpHours(opt.id as any)}
                    className={`rounded-lg border p-1.5 text-xs text-left transition cursor-pointer w-full flex items-center justify-between ${
                      helpHours === opt.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-white font-bold"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {helpHours === opt.id && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {isHi
                    ? "सत्यापित होस्ट मैच मिला: सुधा त्रिपाठी जी (स्वरूप नगर)"
                    : "Top Match Found: Sudha Tripathi Ji (Swaroop Nagar)"}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {isHi
                    ? "किराया: ₹3,200/माह · घर का शुद्ध भोजन · 100% शून्य ब्रोकरेज"
                    : "Rent: ₹3,200/mo · Homestyle food · 0% Brokerage"}
                </p>
              </div>
            </div>

            <Button
              variant="hero"
              size="sm"
              onClick={() => setDrawer(true)}
              className="w-full sm:w-auto shrink-0 cursor-pointer text-xs py-1.5"
            >
              {isHi ? "इस मैच से जुड़ें" : "Connect with this Match"}
            </Button>
          </div>
        </motion.div>
      )}

      <MatchDrawer open={drawer} onOpenChange={setDrawer} city={isHi ? CITIES_HI[city] : city} />
    </div>
  );
}

function ProfileCard({
  icon,
  accent,
  name,
  detail,
  label,
  items,
}: {
  icon: React.ReactNode;
  accent: string;
  name: string;
  detail: string;
  label: string;
  items: string[];
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border border-white/10 p-4 text-left"
      style={{ background: `color-mix(in oklab, ${accent} 8%, transparent)` }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-sm font-bold">{name}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      <p className="mt-3 text-[10px] uppercase tracking-widest font-bold" style={{ color: accent }}>
        {label}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="text-xs text-muted-foreground">
            • {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
