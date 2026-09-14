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
  Warehouse,
  Truck,
  MapPin,
  Clock, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { COMPARISON_MATRIX_TOKENS, getComparisonMatrixTokens } from "@/lib/designTokens";
import { playPop, playHeroCtaClick, playClick } from "@/lib/audio";


export type CategoryFilter = "all" | "storage" | "pricing" | "logistics" | "safety" | "lifestyle";

export interface ComparisonMatrixRow {
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
  commercialWarehouse: {
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

import type { BookingPrefill } from "@/components/stash/types";

export interface ComparisonMatrixTableProps {
  onBook?: ((prefill?: BookingPrefill) => void) | undefined;
  className?: string | undefined;
}


export const COMPARISON_MATRIX_ROWS: ComparisonMatrixRow[] = [
  {
    id: "vacation-rent",
    category: "storage",
    icon: Wallet,
    feature: {
      en: "Vacation Storage & Dead-Rent",
      hi: "छुट्टियों में स्टोरेज व मृत-किराया (Dead-Rent)",
    },
    description: {
      en: "Rent paid to hold bags during 2-3 months summer/winter break",
      hi: "2-3 महीने के ब्रेक पर घर जाने पर सामान रखने का खर्च",
    },
    traditionalPg: {
      en: "Must pay 100% full room rent (₹12,000–₹18,000) just to keep luggage inside empty room",
      hi: "खाली कमरे में सामान रखने हेतु 100% पूरा किराया (₹12,000–₹18,000) देना अनिवार्य",
      negativePoint: "₹15,000 Dead-Rent Waste",
    },
    commercialWarehouse: {
      en: "High minimum volume commitments (₹3,000–₹5,000/mo min charge) designed for commercial pallets",
      hi: "व्यापारिक पैलेट हेतु भारी न्यूनतम मासिक शुल्क (₹3,000–₹5,000/माह) देना पड़ता है",
      negativePoint: "Heavy Min Volume Fee",
    },
    stashSaarthi: {
      en: "Micro-storage at ₹300/bag/mo in verified neighborhood senior host home vaults",
      hi: "सत्यापित सीनियर होस्ट के घर में मात्र ₹300/बैग/माह में माइक्रो-स्टोरेज",
      highlight: "Save 90% Dead-Rent",
    },
    benefitBadge: {
      en: "Saves ~₹6,400 / Break",
      hi: "प्रति ब्रेक ~₹6,400 की सीधी बचत",
    },
  },
  {
    id: "brokerage-fees",
    category: "pricing",
    icon: Building2,
    feature: {
      en: "Brokerage & Contract Lock-In",
      hi: "ब्रोकरेज व अनुबंध लॉक-इन",
    },
    description: {
      en: "Upfront fees and mandatory minimum lease durations",
      hi: "अग्रिम ब्रोकरेज फीस और अनिवार्य न्यूनतम लीज़ अवधि",
    },
    traditionalPg: {
      en: "1 month heavy brokerage fee (₹5,000+) + rigid 11-month non-refundable lock-in contract",
      hi: "1 महीने की भारी ब्रोकरेज फीस (₹5,000+) + 11 महीने का सख्त लॉक-इन अनुबंध",
      negativePoint: "11-Mo Rigid Lock-In",
    },
    commercialWarehouse: {
      en: "Mandatory 3 to 6-month minimum rental contract + security deposit + paperwork fee",
      hi: "3 से 6 महीने का अनिवार्य लीज़ अनुबंध + सिक्योरिटी जमा + कागजी शुल्क",
      negativePoint: "Multi-Month Lock Lease",
    },
    stashSaarthi: {
      en: "0% Brokerage. Direct connection to verified host families with flexible month-to-month stay",
      hi: "0% ब्रोकरेज। वरिष्ठ नागरिक परिवारों से सीधा संपर्क व महीना-दर-महीना लचीलापन",
      highlight: "100% Broker-Free & Flexible",
    },
    benefitBadge: {
      en: "Zero Brokerage & Zero Lock-in",
      hi: "शून्य ब्रोकरेज व शून्य लॉक-इन",
    },
  },
  {
    id: "logistics-pickup",
    category: "logistics",
    icon: Truck,
    feature: {
      en: "Doorstep Logistics & Transport",
      hi: "घर से पिकअप व परिवहन",
    },
    description: {
      en: "Ease of moving luggage from hostel room to storage location",
      hi: "हॉस्टल कमरे से स्टोरेज स्थान तक सामान ले जाने की सुविधा",
    },
    traditionalPg: {
      en: "Self-carry heavy bags down multi-floor stairs; landlord provides zero pickup assistance",
      hi: "खुद सीढ़ियों से भारी बैग उतारें; मकान मालिक की तरफ से शून्य मदद",
      negativePoint: "Manual Heavy Lifting",
    },
    commercialWarehouse: {
      en: "Must arrange and pay private tempo/truck hire (₹1,500+ transport cost) to distant warehouse",
      hi: "दूर वेयरहाउस तक निजी टेम्पो/ट्रक (₹1,500+ खर्च) खुद बुक और पे करना पड़ता है",
      negativePoint: "₹1,500+ Cargo Transport",
    },
    stashSaarthi: {
      en: "Free 1-tap student doorstep pickup & return dispatch by verified Campus Captains",
      hi: "सत्यापित कैंपस कैप्टन द्वारा 1-टैप में मुफ़्त डोरस्टेप पिकअप व डिलीवरी",
      highlight: "Free Doorstep Pickup",
    },
    benefitBadge: {
      en: "10-Min Doorstep Pickup",
      hi: "10-मिनट पिकअप सुविधा",
    },
  },
  {
    id: "campus-proximity",
    category: "logistics",
    icon: MapPin,
    feature: {
      en: "Location & Campus Proximity",
      hi: "लोकेशन व कैंपस दूरी",
    },
    description: {
      en: "Distance from student coaching hubs & host campuses",
      hi: "कोचिंग हब व कॉलेज कैंपस से दूरी",
    },
    traditionalPg: {
      en: "Corridor-dependent; often located in noisy, congested coaching alleys",
      hi: "कोचिंग गलियों में शोरगुल और भीड़भाड़ वाली जगह",
      negativePoint: "Congested Coaching Alleys",
    },
    commercialWarehouse: {
      en: "Far outskirts / industrial suburbs (15–25 km away from Kakadeo and IIT Kanpur)",
      hi: "काकादेव व आईआईटी कानपुर से 15-25 किमी दूर औद्योगिक उपनगरों में स्थित",
      negativePoint: "15-25 km Suburban Distance",
    },
    stashSaarthi: {
      en: "Hyperlocal neighborhood host vaults <500m from IIT Kanpur Gate 1, Kakadeo PW & CSJMU",
      hi: "आईआईटी कानपुर गेट 1, काकादेव पीडब्लू व सीएसजेएमयू से 500मी से कम दूरी",
      highlight: "< 500m Campus Proximity",
    },
    benefitBadge: {
      en: "< 500m Walking Distance",
      hi: "< 500मी पैदल दूरी",
    },
  },
  {
    id: "luggage-security",
    category: "safety",
    icon: Lock,
    feature: {
      en: "Luggage Security & Micro-Insurance",
      hi: "सामान सुरक्षा व माइक्रो-बीमा",
    },
    description: {
      en: "Anti-tamper protection and damage guarantee for stored belongings",
      hi: "सामान की सीलबंद सुरक्षा और क्षति क्षतिपूर्ति गारंटी",
    },
    traditionalPg: {
      en: "Zero landlord liability for stolen items, moisture, pest damage or break-ins during break",
      hi: "छुट्टियों में चोरी, नमी, दीमक या सामान गुम होने पर मकान मालिक की शून्य जिम्मेदारी",
      negativePoint: "Zero Protection Guarantee",
    },
    commercialWarehouse: {
      en: "Basic perimeter building lock; tamper seals & contents insurance cost extra premium",
      hi: "केवल बुनियादी बिल्डिंग ताला; बारकोड सील व सामान बीमा हेतु अतिरिक्त प्रीमियम",
      negativePoint: "Paid Insurance Add-On",
    },
    stashSaarthi: {
      en: "Laser QR Tamper-Proof Barcode Seals + IoT Climate Monitoring + ₹10,000 Micro-Insurance Cover",
      hi: "लेजर टैम्पर-प्रूफ बारकोड सील + IoT नमी निगरानी + ₹10,000 का मुफ़्त माइक्रो-बीमा",
      highlight: "Laser Sealed + ₹10k Insured",
    },
    benefitBadge: {
      en: "₹10,000 Insured Security",
      hi: "₹10,000 बीमा सुरक्षा कवर्ड",
    },
  },
  {
    id: "food-hygiene",
    category: "lifestyle",
    icon: Utensils,
    feature: {
      en: "Food Hygiene & Meal Quality",
      hi: "भोजन की स्वच्छता व गुणवत्ता",
    },
    description: {
      en: "Daily mess and meal preparation standards",
      hi: "दैनिक मेस और भोजन पकाने के मानक",
    },
    traditionalPg: {
      en: "Mass commercial canteen cooking, reused palm oil, watery dal & fixed unhygienic menu",
      hi: "कमर्शियल कैंटीन का खाना, बार-बार गर्म किया गया पाम ऑयल, घटिया मेस",
      negativePoint: "Unhygienic Canteen Mess",
    },
    commercialWarehouse: {
      en: "N/A (Pure industrial storage unit with zero residential or kitchen facilities)",
      hi: "अनुपलब्ध (शुद्ध औद्योगिक गोदाम; रहने या भोजन की शून्य सुविधा)",
      negativePoint: "No Food / Living Option",
    },
    stashSaarthi: {
      en: "Saarthi Kitchen: Fresh 'Ghar Ka Swaad' cooked by local dadi/nani @ ₹90/meal (Zero Palm Oil)",
      hi: "सार्थी किचन: पड़ोस की दादी-नानी के हाथ का बना 100% शुद्ध घर का खाना (₹90/मील)",
      highlight: "100% Homestyle Hygiene",
    },
    benefitBadge: {
      en: "Ghar Ka Swaad @ ₹90",
      hi: "घर का स्वाद @ ₹90",
    },
  },
  {
    id: "host-safety-governance",
    category: "safety",
    icon: ShieldCheck,
    feature: {
      en: "Host Vetting & Safety Governance",
      hi: "होस्ट सत्यापन व सुरक्षा प्रशासन",
    },
    description: {
      en: "Background checks and emergency support framework",
      hi: "पहचान व पुलिस जांच और 24/7 आपातकालीन सहायता",
    },
    traditionalPg: {
      en: "Unverified commercial landlords, zero police background checks, no formal emergency SLA",
      hi: "अनाधिकृत मकान मालिक, कोई पुलिस जांच नहीं, आपातकालीन सहायता शून्य",
      negativePoint: "Unverified Landlords",
    },
    commercialWarehouse: {
      en: "Automated warehouse staff; no residential community or personal host contact",
      hi: "स्वचालित वेयरहाउस स्टाफ; कोई व्यक्तिगत होस्ट या सामुदायिक संपर्क नहीं",
      negativePoint: "Anonymous Industrial Staff",
    },
    stashSaarthi: {
      en: "3-Tier Vetting (Aadhaar Biometric + Police Verification + TPA Sec 105 Protection + 24/7 SOS)",
      hi: "3-टियर ऑडिट (आधार बायोमेट्रिक + पुलिस वेरिफिकेशन + TPA धारा 105 + 24/7 SOS)",
      highlight: "3-Tier Police Vetted",
    },
    benefitBadge: {
      en: "24/7 Bedside SOS",
      hi: "24/7 आपातकालीन सहायता",
    },
  },
];

export const ComparisonMatrixTable: React.FC<ComparisonMatrixTableProps> = ({
  onBook,
  className = "",
}) => {
  const { language } = useLanguage();
  const { role } = usePersona();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const isHindi = language === "hi";
  const isHost = role === "host";
  const tokens = getComparisonMatrixTokens(role);

  const filteredRows = activeCategory === "all"
    ? COMPARISON_MATRIX_ROWS
    : COMPARISON_MATRIX_ROWS.filter(r => r.category === activeCategory);

  const handleCategorySelect = (catId: CategoryFilter) => {
    setActiveCategory(catId);
    playPop();
  };

  const handleCtaClick = () => {
    playHeroCtaClick();
    onBook?.({ service: "stash" });
  };

  return (
    <section 
      id="comparison" 
      className={`section-isolated layout-isolated relative py-12 sm:py-16 pb-28 bg-background border-t border-b border-border/50 overflow-hidden ${className}`}
      data-persona={role}
    >
      {/* Background Ambient Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl pointer-events-none transition-all duration-300 opacity-20"
        style={{
          background: isHost 
            ? "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border transition-colors"
            style={{
              borderColor: tokens.primaryAccent + "40",
              backgroundColor: tokens.primaryAccent + "15",
              color: tokens.primaryAccent,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? "3-पक्षीय पारदर्शी तुलनात्मक विश्लेषण" : "3-Way Transparency Comparison Matrix"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {isHindi ? (
              <>
                पारंपरिक PGs <span className="text-rose-500 line-through decoration-2">व गोदाम</span>{" "}
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{
                    backgroundImage: isHost
                      ? "linear-gradient(to right, #F59E0B, #FBBF24, #F59E0B)"
                      : "linear-gradient(to right, #10B981, #06B6D4, #00F5A0)"
                  }}
                >
                  vs. स्टैशसारथी का अंतर
                </span>
              </>
            ) : (
              <>
                Why StashSaarthi vs.{" "}
                <span className="text-muted-foreground/70 line-through decoration-rose-500/60">
                  PGs & Warehouses
                </span>
              </>
            )}
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isHindi
              ? "जानिए क्यों कानपुर के 1,200+ छात्र और वरिष्ठ नागरिक शोषक PG ब्रोकरेज व दूर औद्योगिक वेयरहाउस की जगह स्टैशसारथी चुनते हैं।"
              : "Compare StashSaarthi directly against costly PG dead-rent & distant industrial self-storage warehouses."}
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              {isHindi ? "औसत डेड-रेंट बचत" : "Avg Dead-Rent Saved"}
            </span>
            <span 
              className="text-lg sm:text-2xl font-black mt-0.5"
              style={{ color: tokens.primaryAccent }}
            >
              ₹6,400 <span className="text-xs font-normal text-muted-foreground">/ break</span>
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              {isHindi ? "ब्रोकरेज फीस" : "Brokerage Fee"}
            </span>
            <span 
              className="text-lg sm:text-2xl font-black mt-0.5"
              style={{ color: tokens.primaryAccent }}
            >
              ₹0 <span className="text-xs font-normal text-muted-foreground">(Direct Host)</span>
            </span>
          </div>

          <div 
            className="p-3.5 sm:p-4 rounded-xl bg-card shadow-sm flex flex-col justify-center items-center text-center border"
            style={{
              borderColor: tokens.primaryAccent + "50",
              backgroundColor: tokens.primaryAccent + "10",
            }}
          >
            <span 
              className="text-[11px] font-bold uppercase flex items-center gap-1"
              style={{ color: tokens.primaryAccent }}
            >
              ⚡ {isHindi ? "माइक्रो-स्टोरेज दर" : "Micro-Storage Rate"}
            </span>
            <span 
              className="text-lg sm:text-2xl font-black mt-0.5"
              style={{ color: tokens.primaryAccent }}
            >
              ₹300 <span className="text-xs font-normal opacity-90">/ bag / mo</span>
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              {isHindi ? "लॉक-इन पेनल्टी" : "Lock-In Penalty"}
            </span>
            <span 
              className="text-lg sm:text-2xl font-black mt-0.5"
              style={{ color: tokens.primaryAccent }}
            >
              0 Days <span className="text-xs font-normal text-muted-foreground">(Month-to-Month)</span>
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {tokens.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id as CategoryFilter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "text-slate-950 shadow-md font-bold"
                    : "bg-card hover:bg-muted text-muted-foreground border-border/80"
                }`}
                style={{
                  backgroundColor: isActive ? tokens.primaryAccent : undefined,
                  borderColor: isActive ? tokens.primaryAccent : undefined,
                }}
              >
                <span>{cat.icon}</span>
                <span>{isHindi ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop 4-Column Matrix Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-4 px-5 w-1/4">{isHindi ? "मूल्यांकन मानक" : "Feature & Metric"}</th>
                
                {/* Traditional PGs Header */}
                <th className="py-4 px-5 w-[23%] bg-rose-500/5 text-rose-400 border-l border-r border-border/40">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <span className="font-bold text-rose-400 block">{isHindi ? "पारंपरिक PGs" : "Traditional PGs"}</span>
                      <span className="text-[10px] text-rose-400/70 lowercase font-normal block">{isHindi ? "सख्त 11-माह लीज़" : "rigid 11-mo lock"}</span>
                    </div>
                  </div>
                </th>

                {/* Commercial Warehouse Header */}
                <th className="py-4 px-5 w-[23%] bg-amber-500/5 text-amber-400 border-r border-border/40">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-400 block">{isHindi ? "कमर्शियल वेयरहाउस" : "Commercial Warehouses"}</span>
                      <span className="text-[10px] text-amber-400/70 lowercase font-normal block">{isHindi ? "दूर औद्योगिक इकाइयां" : "industrial suburbs"}</span>
                    </div>
                  </div>
                </th>

                {/* StashSaarthi WINNER Header */}
                <th 
                  className="py-4 px-5 w-[29%] border-l font-bold relative"
                  style={{
                    backgroundColor: tokens.primaryAccent + "12",
                    borderColor: tokens.primaryAccent + "40",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: tokens.primaryAccent }} />
                    <div>
                      <span className="font-extrabold text-foreground block text-sm">{isHindi ? "स्टैशसारथी नेटवर्क" : "StashSaarthi Network"}</span>
                      <span className="text-[10px] font-semibold block" style={{ color: tokens.primaryAccent }}>
                        {isHindi ? "सत्यापित लोकल नेबरहुड होस्ट" : "Hyperlocal Verified Neighborhood Vaults"}
                      </span>
                    </div>
                    <span 
                      className="ml-auto text-[10px] px-2 py-0.5 rounded text-slate-950 font-black tracking-wider uppercase shadow-sm"
                      style={{ backgroundColor: tokens.primaryAccent }}
                    >
                      {isHindi ? "सर्वश्रेष्ठ" : "WINNER"}
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
                    <td className="py-4 px-5 align-top">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg shrink-0 mt-0.5 border"
                          style={{
                            backgroundColor: tokens.primaryAccent + "15",
                            borderColor: tokens.primaryAccent + "30",
                            color: tokens.primaryAccent,
                          }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">
                            {isHindi ? row.feature.hi : row.feature.en}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {isHindi ? row.description.hi : row.description.en}
                          </p>
                          <span 
                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: tokens.primaryAccent + "12",
                              borderColor: tokens.primaryAccent + "30",
                              color: tokens.primaryAccent,
                            }}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {isHindi ? row.benefitBadge.hi : row.benefitBadge.en}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Traditional PG Cell */}
                    <td className="py-4 px-5 align-top bg-rose-500/5 dark:bg-rose-950/10 border-l border-r border-border/40 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                            {isHindi ? row.traditionalPg.hi : row.traditionalPg.en}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            ❌ {row.traditionalPg.negativePoint}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Commercial Warehouse Cell */}
                    <td className="py-4 px-5 align-top bg-amber-500/5 dark:bg-amber-950/10 border-r border-border/40 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                            {isHindi ? row.commercialWarehouse.hi : row.commercialWarehouse.en}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            ⚠️ {row.commercialWarehouse.negativePoint}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* StashSaarthi Winner Cell */}
                    <td 
                      className="py-4 px-5 align-top font-medium relative"
                      style={{ backgroundColor: tokens.primaryAccent + "08" }}
                    >
                      <div className="flex items-start gap-2">
                        <Check 
                          className="w-4 h-4 shrink-0 mt-0.5 stroke-[3]" 
                          style={{ color: tokens.primaryAccent }} 
                        />
                        <div>
                          <p className="text-xs text-foreground font-semibold leading-relaxed">
                            {isHindi ? row.stashSaarthi.hi : row.stashSaarthi.en}
                          </p>
                          <span 
                            className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-md border shadow-sm"
                            style={{
                              backgroundColor: tokens.primaryAccent + "20",
                              borderColor: tokens.primaryAccent + "40",
                              color: tokens.primaryAccent,
                            }}
                          >
                            <Award className="w-3 h-3" />
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

        {/* Mobile & Tablet Card-Based 3-Way Comparison View */}
        <div className="block lg:hidden space-y-4">
          {filteredRows.map((row) => {
            const IconComponent = row.icon;
            return (
              <div
                key={row.id}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Feature Title */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="p-2 rounded-lg shrink-0 border"
                      style={{
                        backgroundColor: tokens.primaryAccent + "15",
                        borderColor: tokens.primaryAccent + "30",
                        color: tokens.primaryAccent,
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">
                        {isHindi ? row.feature.hi : row.feature.en}
                      </h3>
                      <span 
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
                        style={{
                          backgroundColor: tokens.primaryAccent + "15",
                          color: tokens.primaryAccent,
                        }}
                      >
                        {isHindi ? row.benefitBadge.hi : row.benefitBadge.en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-Column Mobile Comparison Stack */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Traditional PG */}
                  <div className="p-3 rounded-lg bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                      <X className="w-3.5 h-3.5" />
                      <span>{isHindi ? "1. पारंपरिक PGs / हॉस्टल" : "1. Traditional PGs"}</span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                        ❌ {row.traditionalPg.negativePoint}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {isHindi ? row.traditionalPg.hi : row.traditionalPg.en}
                    </p>
                  </div>

                  {/* Commercial Warehouse */}
                  <div className="p-3 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                      <Warehouse className="w-3.5 h-3.5" />
                      <span>{isHindi ? "2. कमर्शियल वेयरहाउस" : "2. Commercial Warehouses"}</span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        ⚠️ {row.commercialWarehouse.negativePoint}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {isHindi ? row.commercialWarehouse.hi : row.commercialWarehouse.en}
                    </p>
                  </div>

                  {/* StashSaarthi Winner */}
                  <div 
                    className="p-3 rounded-lg border shadow-sm"
                    style={{
                      backgroundColor: tokens.primaryAccent + "12",
                      borderColor: tokens.primaryAccent + "40",
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: tokens.primaryAccent }}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isHindi ? "3. स्टैशसारथी नेटवर्क" : "3. StashSaarthi Network"}</span>
                      <span 
                        className="ml-auto text-[9px] px-1.5 py-0.2 rounded text-slate-950 font-black uppercase"
                        style={{ backgroundColor: tokens.primaryAccent }}
                      >
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

        {/* Action Callout Banner */}
        <div 
          className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl border text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl relative overflow-hidden"
          style={{
            backgroundImage: isHost
              ? "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #451A03 100%)"
              : "linear-gradient(135deg, #0F172A 0%, #022C22 50%, #064E3B 100%)",
            borderColor: tokens.primaryAccent + "40",
          }}
        >
          <div className="text-center sm:text-left relative z-10">
            <h4 className="text-base sm:text-lg font-extrabold flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-5 h-5 fill-current" style={{ color: tokens.primaryAccent }} />
              <span>
                {isHindi
                  ? "छुट्टियों में मृत-किराया (Dead-Rent) बर्बाद करना आज ही बंद करें!"
                  : "Stop Paying Dead-Rent for Empty PG Rooms Today!"}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isHindi
                ? "मात्र ₹300/बैग में अपना सामान जमा करें और लौटने पर 100% ब्रोकर-फ्री कमरा पाएं।"
                : "Store luggage at ₹300/bag/mo & return to verified 0% broker-free rooms."}
            </p>
          </div>

          <button
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 group relative z-10 active:scale-95"
            style={{
              backgroundColor: tokens.primaryAccent,
              boxShadow: `0 0 25px ${tokens.primaryAccent}40`,
            }}
          >
            <span>{isHindi ? "₹300 में सामान रखें" : "Book Storage @ ₹300/mo"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
