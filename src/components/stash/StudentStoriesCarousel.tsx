import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  ShieldCheck,
  Building2,
  UtensilsCrossed,
  Package,
  Home,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import type { OpenBooking } from "./types";

export interface StudentStory {
  id: string;
  name: string;
  role: "student" | "host";
  collegeOrLocality: string;
  yearOrRole: string;
  serviceCategory: "stash" | "rooms" | "kitchen" | "host";
  avatarBg: string;
  rating: number;
  highlightBadge: string;
  savingsOrIncome: string;
  verifiedPassId: string;
  storyEn: string;
  storyHi: string;
  date: string;
}

export const STUDENT_STORIES: StudentStory[] = [
  {
    id: "story-1",
    name: "Rohan Agrawal",
    role: "student",
    collegeOrLocality: "IIT Kanpur (Hall 12)",
    yearOrRole: "B.Tech CSE '26",
    serviceCategory: "stash",
    avatarBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    rating: 5,
    highlightBadge: "Laser Sealed & Moisture Free",
    savingsOrIncome: "Saved ₹8,400 Dead-Rent",
    verifiedPassId: "#SS-IITK-8921",
    storyEn:
      "During summer breaks, paying ₹7,000/month room rent just to keep 3 suitcases was painful. StashSaarthi picked up my luggage directly from Hall 12, applied tamper-evident barcode seals in front of me, and stored it safely for 2 months at just ₹600 total!",
    storyHi:
      "गर्मियों की छुट्टियों में 3 सूटकेस रखने के लिए ₹7,000/महीना किराया देना बहुत भारी पड़ता था। स्टैशसारथी ने हॉल 12 से सामान उठाया, सामने लेजर बारकोड सील लगाया और केवल ₹600 में 2 महीने सुरक्षित रखा!",
    date: "May 2026",
  },
  {
    id: "story-2",
    name: "Aakash Tiwari",
    role: "student",
    collegeOrLocality: "Kakadeo PW Student",
    yearOrRole: "NEET Aspirant",
    serviceCategory: "rooms",
    avatarBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    rating: 5,
    highlightBadge: "Zero Brokerage & Verified PG Owner Host",
    savingsOrIncome: "Saved ₹5,000 Brokerage",
    verifiedPassId: "#SS-KKD-4412",
    storyEn:
      "Local brokers in Kakadeo demanded ₹5,000 upfront brokerage for a tiny room. Found a verified room hosted by a retired professor's family via StashSaarthi. Zero brokerage, peaceful study environment, and aunty treats me like family!",
    storyHi:
      "काकादेव में दलाल ₹5,000 ब्रोकरेज मांग रहे थे। स्टैशसारथी के जरिए एक सेवानिवृत्त प्रोफेसर के घर में सत्यापित कमरा मिला। जीरो ब्रोकरेज, पढ़ाई का शांत माहौल और आंटी अपने घर जैसा ख्याल रखती हैं!",
    date: "June 2026",
  },
  {
    id: "story-3",
    name: "Priya Sharma",
    role: "student",
    collegeOrLocality: "HBTI Kanpur",
    yearOrRole: "B.Tech Chemical '25",
    serviceCategory: "kitchen",
    avatarBg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    rating: 5,
    highlightBadge: "Desi Ghee & Fresh Roti",
    savingsOrIncome: "Saved ₹2,100/mo Food Expense",
    verifiedPassId: "#SS-HBTI-7730",
    storyEn:
      "Mess food was unpalatable and commercial tiffin services served oily food. Saarthi Kitchen delivers authentic home-cooked thalis with hot rotis and pure ghee from a verified grandmom nearby. Pure comfort food during exam stress!",
    storyHi:
      "हॉस्टल मेस का खाना बेहद खराब था। सारथी किचन से पास की आंटी के हाथ का बना शुद्ध देशी घी का गरम खाना मिलने लगा। परीक्षा के दिनों में घर जैसी शांति और सेहत मिली!",
    date: "July 2026",
  },
  {
    id: "story-4",
    name: "Sunita & Ramesh Verma",
    role: "host",
    collegeOrLocality: "Kalyanpur, Kanpur",
    yearOrRole: "Verified PG Owner Citizens (Retd. BSNL)",
    serviceCategory: "host",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    rating: 5,
    highlightBadge: "Zero Intrusion & Verified Students",
    savingsOrIncome: "Earns ₹14,200/mo Passive Income",
    verifiedPassId: "#SS-HOST-0192",
    storyEn:
      "After our children moved to Bengaluru, two rooms on the first floor were empty. StashSaarthi helped us list them for micro-storage and verified IIT/HBTI student housing. We earn tech-enabled passive income with complete safety and zero hassle.",
    storyHi:
      "बच्चों के बाहर चले जाने के बाद हमारे ऊपर के दो कमरे खाली पड़े थे। स्टैशसारथी की मदद से हमने सुरक्षित माइक्रो-स्टोरेज और सत्यापित छात्रों को कमरा दिया। अब बिना किसी परेशानी के सम्मानजनक मासिक आय मिलती है।",
    date: "August 2026",
  },
  {
    id: "story-5",
    name: "Vikramaditya Das",
    role: "student",
    collegeOrLocality: "CSJMU Kanpur",
    yearOrRole: "BCA Final Year",
    serviceCategory: "stash",
    avatarBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    rating: 5,
    highlightBadge: "24/7 CCTV & Ground Elevation",
    savingsOrIncome: "Saved ₹6,800 Rent",
    verifiedPassId: "#SS-CSJM-9011",
    storyEn:
      "I was worried about dampness damaging my desktop PC and books over monsoon. StashSaarthi stored everything on 2.5ft elevated pallets with 24/7 CCTV monitoring. Everything was returned spotless!",
    storyHi:
      "बारिश के मौसम में अपनी डेस्कटॉप पीसी और किताबों के खराब होने की चिंता थी। स्टैशसारथी ने एलिवेटेड पैलेट और 24/7 सीसीटीवी निगरानी में सब सुरक्षित रखा। वापस मिलने पर सामान एकदम नया था!",
    date: "August 2026",
  },
];

export const StudentStoriesCarousel = memo(function StudentStoriesCarousel({
  onBook,
}: {
  onBook: OpenBooking;
}) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHindi = language === "hi";

  const [activeCategory, setActiveCategory] = useState<"all" | "stash" | "rooms" | "kitchen" | "host">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const filteredStories = STUDENT_STORIES.filter((s) => {
    if (activeCategory === "all") return true;
    return s.serviceCategory === activeCategory;
  });

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
  }, [filteredStories.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  }, [filteredStories.length]);

  // Auto slide every 5 seconds unless paused
  useEffect(() => {
    if (isPaused || filteredStories.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, filteredStories.length]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const activeStory: StudentStory = (filteredStories[currentIndex] || STUDENT_STORIES[0])!;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "stash":
        return <Package className="h-3.5 w-3.5 text-emerald-400" />;
      case "rooms":
        return <Building2 className="h-3.5 w-3.5 text-cyan-400" />;
      case "kitchen":
        return <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />;
      case "host":
        return <Home className="h-3.5 w-3.5 text-amber-300" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  return (
    <section
      id="student-stories"
      className="relative overflow-hidden py-8 sm:py-12 bg-slate-950/60 border-y border-white/5"
      role="region"
      aria-label={isHindi ? "छात्र सफलता और होस्ट की कहानियां" : "Student Success & Host Stories"}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <AnimatedContent distance={20} direction="vertical" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isHindi ? "सत्यापित अनुभव और सफलता" : "Verified Student & Host Success Stories"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="text-gradient">
                {isHindi ? "कानपुर छात्रों और होस्ट्स की जबानी" : "Real Stories from IITK, HBTI & Kakadeo"}
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground text-balance">
              {isHindi
                ? "जानिए कैसे छात्रों ने डेड-रेंट बचाए और वरिष्ठ नागरिकों ने सुरक्षित पैसिव इनकम अर्जित की।"
                : "Discover how students saved ₹8,400+ dead-rent and premium hosts unlocked ₹11,500+/mo passive income."}
            </p>
          </div>
        </AnimatedContent>

        {/* Category Filters */}
        <div role="tablist" aria-label="Story categories" className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
          {[
            { id: "all", labelEn: "All Stories", labelHi: "सभी कहानियां", icon: Sparkles },
            { id: "stash", labelEn: "Vacation Stash (₹300/mo)", labelHi: "वैकेशन स्टोरेज", icon: Package },
            { id: "rooms", labelEn: "Co-Living Rooms", labelHi: "जीरो-ब्रोकरेज रूम्स", icon: Building2 },
            { id: "kitchen", labelEn: "Ghar Ka Swaad", labelHi: "घर का खाना", icon: UtensilsCrossed },
            { id: "host", labelEn: "Premium Hosts", labelHi: "सीनियर होस्ट्स", icon: Home },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                aria-label={isHindi ? tab.labelHi : tab.labelEn}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  active
                    ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isHindi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel Slide Area */}
        <div
          className="relative max-w-4xl mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Student Stories Carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStory.id}-${currentIndex}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Story ${currentIndex + 1} of ${filteredStories.length}: ${activeStory.name}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="glass relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
            >
              {/* Background ambient glow */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
                style={{
                  background:
                    activeStory.role === "student"
                      ? "radial-gradient(circle, var(--emerald), transparent)"
                      : "radial-gradient(circle, var(--amber), transparent)",
                }}
              />

              {/* Top Row: User Avatar & Badge info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-base font-bold shadow-md ${activeStory.avatarBg}`}
                  >
                    {activeStory.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{activeStory.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        <BadgeCheck className="h-3 w-3" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeStory.collegeOrLocality} • {activeStory.yearOrRole}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/20">
                    <IndianRupee className="h-3 w-3 text-amber-400" />
                    {activeStory.savingsOrIncome}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-mono text-slate-400 border border-white/10">
                    {activeStory.verifiedPassId}
                  </span>
                </div>
              </div>

              {/* Quote Icon & Content */}
              <div className="relative mb-6">
                <Quote className="absolute -left-2 -top-2 h-8 w-8 text-emerald-500/15 pointer-events-none" />
                <p className="relative z-10 text-sm sm:text-base leading-relaxed text-slate-200 font-normal italic">
                  "{isHindi ? activeStory.storyHi : activeStory.storyEn}"
                </p>
              </div>

              {/* Bottom Details & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(activeStory.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">• {activeStory.highlightBadge}</span>
                </div>

                <Button
                  variant={activeStory.role === "student" ? "hero" : "warm"}
                  size="sm"
                  onClick={() =>
                    onBook({
                      service:
                        activeStory.serviceCategory === "host"
                          ? "spaces"
                          : activeStory.serviceCategory,
                    })
                  }
                  className="w-full sm:w-auto text-xs px-4 py-2"
                >
                  <span>{isHindi ? "इसी तरह बुक करें" : "Book Similar Experience"}</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows & Accessible Hit Targets */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {filteredStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="flex h-12 min-w-[28px] sm:min-w-[32px] items-center justify-center p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      currentIndex === idx
                        ? "w-6 bg-emerald-400"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono text-slate-400 px-1">
                {currentIndex + 1} / {filteredStories.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Next story"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
