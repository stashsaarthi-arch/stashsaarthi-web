import React, { useState } from "react";
import { 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Home, 
  Lock, 
  Wallet, 
  Utensils, 
  Sparkles, 
  Building2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "./types";

interface PgComparisonTableProps {
  onBook?: (prefill?: BookingPrefill) => void;
}

type CategoryFilter = "all" | "storage" | "rooms" | "kitchen" | "safety";

interface ComparisonRow {
  id: string;
  category: CategoryFilter;
  icon: React.ElementType;
  feature: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  traditionalPg: {
    en: string;
    hi: string;
    negativePoint: string;
  };
  stashSaarthi: {
    en: string;
    hi: string;
    highlight: string;
  };
  benefitBadge: {
    en: string;
    hi: string;
  };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: "vacation-rent",
    category: "storage",
    icon: Wallet,
    feature: {
      en: "Vacation Dead-Rent Waste",
      hi: "छुट्टियों में मृत-किराया (Dead-Rent) बर्बादी",
    },
    description: {
      en: "What happens to rent when you go home for 2-3 months summer/winter break",
      hi: "2-3 महीने के समर/विंटर ब्रेक पर घर जाने पर आपके कमरे के किराए का क्या होता है",
    },
    traditionalPg: {
      en: "Must pay 100% full rent (₹12,000–₹18,000) just to keep luggage in room",
      hi: "सामान रखने के लिए 100% पूरा किराया (₹12,000–₹18,000) देना अनिवार्य",
      negativePoint: "₹15,000 Average Waste",
    },
    stashSaarthi: {
      en: "Vacation Micro-Storage at ₹300/bag/mo in verified neighborhood host homes",
      hi: "सत्यापित सीनियर होस्ट के घर में मात्र ₹300/बैग/माह में माइक्रो-स्टोरेज",
      highlight: "Save Up to 90% Dead-Rent",
    },
    benefitBadge: {
      en: "Saves ~₹6,400 / Break",
      hi: "प्रति ब्रेक ~₹6,400 की सीधी बचत",
    },
  },
  {
    id: "brokerage-fees",
    category: "rooms",
    icon: Building2,
    feature: {
      en: "Brokerage & Deposit Demands",
      hi: "ब्रोकरेज और एडवांस डिपॉजिट मांग",
    },
    description: {
      en: "Upfront fees charged before moving into a room or PG",
      hi: "कमरे में शिफ्ट होने से पहले ली जाने वाली अग्रिम फीस",
    },
    traditionalPg: {
      en: "1 month heavy brokerage (₹5,000+) + 2-3 months non-refundable lock-in deposit",
      hi: "1 महीने का भारी ब्रोकरेज (₹5,000+) + 2-3 महीने का नॉन-रिफंडेबल डिपॉजिट",
      negativePoint: "Heavy Broker Extortion",
    },
    stashSaarthi: {
      en: "Zero Brokerage. Direct connection to verified verified PG owner host family homes",
      hi: "0% ब्रोकरेज। सत्यापित वरिष्ठ नागरिक परिवारों से सीधा कनेक्शन",
      highlight: "100% Broker-Free",
    },
    benefitBadge: {
      en: "Zero Brokerage Fee",
      hi: "शून्य ब्रोकरेज शुल्क",
    },
  },
  {
    id: "luggage-security",
    category: "storage",
    icon: Lock,
    feature: {
      en: "Luggage Safety & Insurance",
      hi: "सामान की सुरक्षा और बीमा गारंटी",
    },
    description: {
      en: "Protection for stored bags, laptops, and valuables during breaks",
      hi: "छुट्टियों के दौरान जमा बैग, लैपटॉप और कीमती सामान की सुरक्षा",
    },
    traditionalPg: {
      en: "Zero liability for missing items, dampness, pest damage or break-ins",
      hi: "चोरी, नमी, कीड़े या ताला टूटने पर मकान मालिक की शून्य जिम्मेदारी",
      negativePoint: "Zero Protection Contract",
    },
    stashSaarthi: {
      en: "Laser Tamper Barcode Seals + IoT Climate Sensors + ₹10,000 Micro-Insurance",
      hi: "लेजर टैम्पर बारकोड सील + IoT नमी सेंसर + ₹10,000 का माइक्रो-इंश्योरेंस",
      highlight: "₹10k Insured Security",
    },
    benefitBadge: {
      en: "Laser Barcode Sealed",
      hi: "लेजर बारकोड सीलबंद",
    },
  },
  {
    id: "food-hygiene",
    category: "kitchen",
    icon: Utensils,
    feature: {
      en: "Food Hygiene & Meal Quality",
      hi: "भोजन की स्वच्छता और गुणवत्ता",
    },
    description: {
      en: "Daily mess and meal preparation standards",
      hi: "दैनिक मेस और भोजन पकाने के मानक",
    },
    traditionalPg: {
      en: "Mass commercial canteen cooking, reused palm oil, fixed watery menu",
      hi: "कमर्शियल कैंटीन का बासी खाना, दोबारा गर्म किया गया पाम ऑयल, घटिया मेस",
      negativePoint: "Unhealthy Commercial Oil",
    },
    stashSaarthi: {
      en: "Saarthi Kitchen: Fresh 'Ghar Ka Swaad' cooked by local dadi/nani @ ₹90/meal",
      hi: "सार्थी किचन: पड़ोस की दादी-नानी के हाथ का बना 100% शुद्ध घर का खाना (₹90/मील)",
      highlight: "Zero Palm Oil Promise",
    },
    benefitBadge: {
      en: "100% Homestyle Hygiene",
      hi: "100% घरेलू स्वच्छता",
    },
  },
  {
    id: "living-atmosphere",
    category: "rooms",
    icon: Home,
    feature: {
      en: "Living Atmosphere & Quiet",
      hi: "रहने का माहौल और पढ़ाई का वातावरण",
    },
    description: {
      en: "Daily environment for quiet studying and mental well-being",
      hi: "शांत पढ़ाई और मानसिक सुकून के लिए दैनिक वातावरण",
    },
    traditionalPg: {
      en: "Crowded noisy dorms, commercial warden friction, restrictive curfews",
      hi: "भीड़भाड़ वाले शोरगुल कमरे, कमर्शियल वार्डन की बहस, सख्त प्रतिबंध",
      negativePoint: "Noisy & Cramped",
    },
    stashSaarthi: {
      en: "Warm family environment, quiet study hours, tech-enabled verified PG owner zero-brokerage ecosystem",
      hi: "पारिवारिक माहौल, शांत अध्ययन समय, सम्मानित वरिष्ठ नागरिकों का साथ",
      highlight: "Tech-Enabled Family Vibe",
    },
    benefitBadge: {
      en: "Quiet Study Hub",
      hi: "शांत पढ़ाई का माहौल",
    },
  },
  {
    id: "verification-safety",
    category: "safety",
    icon: ShieldCheck,
    feature: {
      en: "Host & Tenant Safety Audits",
      hi: "होस्ट और किरायेदार सुरक्षा ऑडिट",
    },
    description: {
      en: "Identity and safety checks performed before housing match",
      hi: "आवास मैचिंग से पहले की जाने वाली पहचान और सुरक्षा जांच",
    },
    traditionalPg: {
      en: "Unverified landlords, no police checks, zero formal emergency response",
      hi: "असत्यापित मकान मालिक, कोई पुलिस जांच नहीं, आपातकालीन सहायता शून्य",
      negativePoint: "Unchecked Landlords",
    },
    stashSaarthi: {
      en: "3-Tier Audit (Aadhaar Biometric + Police Check + 24/7 Bedside Emergency SOS)",
      hi: "3-टियर ऑडिट (आधार बायोमेट्रिक + पुलिस वेरिफिकेशन + 24/7 बेडसाइड SOS)",
      highlight: "3-Tier Police Verified",
    },
    benefitBadge: {
      en: "24/7 Bedside SOS",
      hi: "24/7 बेडसाइड आपातकालीन SOS",
    },
  },
  {
    id: "contract-flexibility",
    category: "rooms",
    icon: Clock,
    feature: {
      en: "Contract Flexibility & Lock-in",
      hi: "अनुबंध में लचीलापन और लॉक-इन नियम",
    },
    description: {
      en: "Lease duration terms and early exit flexibility",
      hi: "लीज़ अवधि की शर्तें और समय से पहले बाहर निकलने की सुविधा",
    },
    traditionalPg: {
      en: "Mandatory 11-month rigid contract with forfeit of full security deposit on exit",
      hi: "11 महीने का सख्त लॉक-इन अनुबंध; बीच में छोड़ने पर सिक्योरिटी जमा ज़ब्त",
      negativePoint: "Rigid 11-Month Lock",
    },
    stashSaarthi: {
      en: "Flexible month-to-month stays with 24-hour zero-penalty relocation SLA",
      hi: "फ्लेक्सिबल महीना-दर-महीना स्टे; 24-घंटे शून्य पेनल्टी रीलोकेशन गारंटी",
      highlight: "Zero Lock-In Friction",
    },
    benefitBadge: {
      en: "Month-to-Month Flexible",
      hi: "महीना-दर-महीना लचीला",
    },
  },
];

export const PgComparisonTable: React.FC<PgComparisonTableProps> = ({ onBook }) => {
  const { language } = useLanguage();
  const { role } = usePersona();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const isHindi = language === "hi";

  const filteredRows = activeCategory === "all" 
    ? COMPARISON_ROWS 
    : COMPARISON_ROWS.filter(r => r.category === activeCategory);

  const categories: { id: CategoryFilter; labelEn: string; labelHi: string }[] = [
    { id: "all", labelEn: "All Comparisons", labelHi: "सभी तुलनाएं" },
    { id: "storage", labelEn: "📦 Micro-Storage", labelHi: "📦 माइक्रो-स्टोरेज" },
    { id: "rooms", labelEn: "🏠 Co-Living Rooms", labelHi: "🏠 को-लिविंग रूम" },
    { id: "kitchen", labelEn: "🍲 Fresh Tiffins", labelHi: "🍲 ताजा टिफिन" },
    { id: "safety", labelEn: "🛡️ Safety & Audit", labelHi: "🛡️ सुरक्षा और ऑडिट" },
  ];

  return (
    <section id="comparison" className="relative py-8 sm:py-12 bg-background border-t border-b border-border/40 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? "पारदर्शी तुलनात्मक विश्लेषण" : "Radical Transparency Matrix"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {isHindi ? (
              <>
                पारंपरिक PGs <span className="text-rose-500 line-through decoration-2">vs.</span>{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  स्टैशसारथी का अंतर
                </span>
              </>
            ) : (
              <>
                Why StashSaarthi vs.{" "}
                <span className="text-muted-foreground/80 line-through decoration-rose-500/60">
                  Traditional PGs
                </span>
              </>
            )}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {isHindi
              ? "जानिए क्यों कानपुर के 1,200+ छात्र और वरिष्ठ नागरिक शोषक ब्रोकर फीस और खाली कमरे के मृत-किराए की जगह स्टैशसारथी चुनते हैं।"
              : "See why 1,200+ students and premium hosts in Kanpur choose StashSaarthi over predatory PG lock-ins & empty room dead-rent."}
          </p>
        </div>

        {/* Highlight Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {isHindi ? "औसत डेड-रेंट बचत" : "Avg Dead-Rent Saved"}
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5">
              ₹6,400 <span className="text-xs font-normal text-muted-foreground">/ break</span>
            </span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {isHindi ? "ब्रोकरेज फीस" : "Brokerage Fee"}
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5">
              ₹0 <span className="text-xs font-normal text-muted-foreground">(Direct Host)</span>
            </span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-card border border-emerald-500/40 bg-emerald-500/5 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1">
              ⚡ {isHindi ? "रद्दीकरण नीति" : "Cancellation Fee"}
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5">
              ₹0 <span className="text-xs font-normal text-emerald-300/80">(Zero Fee Guarantee)</span>
            </span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {isHindi ? "लॉक-इन पेनल्टी" : "Lock-in Penalty"}
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5">
              0 Days <span className="text-xs font-normal text-muted-foreground">(Month-to-Month)</span>
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shrink-0 ${
                activeCategory === cat.id
                  ? "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20"
                  : "bg-card hover:bg-muted text-muted-foreground border-border/80"
              }`}
            >
              {isHindi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Comparison Table Component for Desktop & Tablet */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-4 px-6 w-1/3">{isHindi ? "फ़ीचर और विवरण" : "Feature & Evaluation"}</th>
                <th className="py-4 px-6 w-1/3 bg-rose-950/40 border border-white/10 text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-500" />
                    <span>{isHindi ? "पारंपरिक PGs / कमर्शियल हॉस्टल" : "Traditional PGs / Hostels"}</span>
                  </div>
                </th>
                <th className="py-4 px-6 w-1/3 bg-emerald-950/40 border border-white/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                    <span>{isHindi ? "स्टैशसारथी नेटवर्क (StashSaarthi)" : "StashSaarthi Network"}</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                      {isHindi ? "विजेता" : "WINNER"}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {filteredRows.map((row) => {
                const IconComponent = row.icon;
                return (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    {/* Feature Description */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">
                            {isHindi ? row.feature.hi : row.feature.en}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {isHindi ? row.description.hi : row.description.en}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <TrendingUp className="w-3 h-3" />
                            {isHindi ? row.benefitBadge.hi : row.benefitBadge.en}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Traditional PG Cell */}
                    <td className="py-4 px-6 align-top bg-rose-950/40 border border-white/10 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                            {isHindi ? row.traditionalPg.hi : row.traditionalPg.en}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            ❌ {row.traditionalPg.negativePoint}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* StashSaarthi Winner Cell */}
                    <td className="py-4 px-6 align-top bg-emerald-950/40 border border-white/10 text-foreground font-medium relative">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                        <div>
                          <p className="text-xs text-foreground font-semibold leading-relaxed">
                            {isHindi ? row.stashSaarthi.hi : row.stashSaarthi.en}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                            <Award className="w-3 h-3 text-emerald-400" />
                            {row.stashSaarthi.highlight}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card-Based Comparison View */}
        <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar pb-4">
          {filteredRows.map((row) => {
            const IconComponent = row.icon;
            return (
              <div
                key={row.id}
                className="w-80 min-w-[85vw] snap-center shrink-0 rounded-xl border border-border/80 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Feature Title */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">
                        {isHindi ? row.feature.hi : row.feature.en}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {isHindi ? row.benefitBadge.hi : row.benefitBadge.en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Traditional PG */}
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                      <X className="w-3.5 h-3.5" />
                      <span>{isHindi ? "पारंपरिक PGs" : "Traditional PG"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {isHindi ? row.traditionalPg.hi : row.traditionalPg.en}
                    </p>
                  </div>

                  {/* StashSaarthi */}
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mb-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isHindi ? "स्टैशसारथी नेटवर्क" : "StashSaarthi"}</span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                        WINNER
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold leading-snug">
                      {isHindi ? row.stashSaarthi.hi : row.stashSaarthi.en}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner / CTA */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span>
                {isHindi
                  ? "छुट्टियों में मृत-किराया (Dead-Rent) बर्बाद करना आज ही बंद करें!"
                  : "Stop Paying Dead-Rent for Empty PG Rooms Today!"}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isHindi
                ? "मात्र ₹300/बैग में अपना सामान जमा करें और लौटने पर 100% ब्रोकर-फ्री कमरा पाएं।"
                : "Store luggage at ₹300/bag/mo & return to verified broker-free rooms."}
            </p>
          </div>

          <button
            onClick={() => onBook?.({ service: "stash" })}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>{isHindi ? "₹300 में सामान रखें" : "Book Storage @ ₹300/mo"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
