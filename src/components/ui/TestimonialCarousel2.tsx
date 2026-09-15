import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Building2,
  UtensilsCrossed,
  Package,
  Home,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { useMobileSwipeGesture } from "@/hooks/useMobileSwipeGesture";
import { playPop, playClick } from "@/lib/audio";
import {
  TESTIMONIAL_CAROUSEL_TOKENS,
  getTestimonialCarouselTokens,
} from "@/lib/designTokens";

export interface TestimonialStoryItem {
  id: string;
  name: string;
  role: "student" | "host";
  collegeOrLocality: string;
  collegeBadgeKey: "IIT Kanpur" | "HBTI Kanpur" | "CSJM University" | "PW Vidyapeeth Kakadeo" | "Senior Host Vault";
  yearOrRole: string;
  serviceCategory: "stash" | "rooms" | "kitchen" | "host";
  avatarBg: string;
  rating: number;
  highlightBadge: string;
  savingsOrIncome: string;
  verifiedPassId: string;
  storyEn: string;
  storyHi: string;
  audioClipDurationText: string;
  audioQuoteSnippetEn: string;
  audioQuoteSnippetHi: string;
  date: string;
}

export const TESTIMONIAL_STORIES: TestimonialStoryItem[] = [
  {
    id: "story-1",
    name: "Rohan Agrawal",
    role: "student",
    collegeOrLocality: "IIT Kanpur (Hall 12)",
    collegeBadgeKey: "IIT Kanpur",
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
    audioClipDurationText: "0:38",
    audioQuoteSnippetEn: "Listen to Rohan describe Hall 12 luggage pickup...",
    audioQuoteSnippetHi: "रहन द्वारा हॉल 12 पिकअप अनुभव की ऑडियो क्लिप सुनें...",
    date: "May 2026",
  },
  {
    id: "story-2",
    name: "Aakash Tiwari",
    role: "student",
    collegeOrLocality: "Kakadeo PW Student",
    collegeBadgeKey: "PW Vidyapeeth Kakadeo",
    yearOrRole: "NEET Aspirant",
    serviceCategory: "rooms",
    avatarBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    rating: 5,
    highlightBadge: "Zero Brokerage & Senior Host",
    savingsOrIncome: "Saved ₹5,000 Brokerage",
    verifiedPassId: "#SS-KKD-4412",
    storyEn:
      "Local brokers in Kakadeo demanded ₹5,000 upfront brokerage for a tiny room. Found a verified room hosted by a retired professor's family via StashSaarthi. Zero brokerage, peaceful study environment, and aunty treats me like family!",
    storyHi:
      "काकादेव में दलाल ₹5,000 ब्रोकरेज मांग रहे थे। स्टैशसारथी के जरिए एक सेवानिवृत्त प्रोफेसर के घर में सत्यापित कमरा मिला। जीरो ब्रोकरेज, पढ़ाई का शांत माहौल और आंटी अपने घर जैसा ख्याल रखती हैं!",
    audioClipDurationText: "0:45",
    audioQuoteSnippetEn: "Aakash explains finding zero-brokerage housing in Kakadeo...",
    audioQuoteSnippetHi: "आकाश से सुनें कि काकादेव में जीरो-ब्रोकरेज कमरा कैसे मिला...",
    date: "June 2026",
  },
  {
    id: "story-3",
    name: "Priya Sharma",
    role: "student",
    collegeOrLocality: "HBTI Kanpur",
    collegeBadgeKey: "HBTI Kanpur",
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
    audioClipDurationText: "0:42",
    audioQuoteSnippetEn: "Priya reviews homestyle Satvik Thali near HBTI...",
    audioQuoteSnippetHi: "प्रिया का एचबीटीआई के पास घर जैसे भोजन पर रिव्यू क्लिप...",
    date: "July 2026",
  },
  {
    id: "story-4",
    name: "Sunita & Ramesh Verma",
    role: "host",
    collegeOrLocality: "Kalyanpur, Kanpur",
    collegeBadgeKey: "Senior Host Vault",
    yearOrRole: "Senior Citizens (Retd. BSNL)",
    serviceCategory: "host",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    rating: 5,
    highlightBadge: "Zero Intrusion & Verified Students",
    savingsOrIncome: "Earns ₹14,200/mo Passive Income",
    verifiedPassId: "#SS-HOST-0192",
    storyEn:
      "After our children moved to Bengaluru, two rooms on the first floor were empty. StashSaarthi helped us list them for micro-storage and verified IIT/HBTI student housing. We earn dignified passive income with complete safety and zero hassle.",
    storyHi:
      "बच्चों के बाहर चले जाने के बाद हमारे ऊपर के दो कमरे खाली पड़े थे। स्टैशसारथी की मदद से हमने सुरक्षित माइक्रो-स्टोरेज और सत्यापित छात्रों को कमरा दिया। अब बिना किसी परेशानी के सम्मानजनक मासिक आय मिलती है।",
    audioClipDurationText: "0:52",
    audioQuoteSnippetEn: "Mrs. Verma talks about dignified host income & safety...",
    audioQuoteSnippetHi: "श्रीमती वर्मा से सुनें सम्मानजनक होस्ट आय और सुरक्षा का अनुभव...",
    date: "August 2026",
  },
  {
    id: "story-5",
    name: "Vikramaditya Das",
    role: "student",
    collegeOrLocality: "CSJMU Kanpur",
    collegeBadgeKey: "CSJM University",
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
    audioClipDurationText: "0:35",
    audioQuoteSnippetEn: "Vikramaditya shares desktop computer monsoon vaulting experience...",
    audioQuoteSnippetHi: "विक्रमादित्य द्वारा डेस्कटॉप पीसी सुरक्षा पर ऑडियो क्लिप...",
    date: "August 2026",
  },
];

export interface TestimonialCarousel2Props {
  stories?: TestimonialStoryItem[];
  onBook?: (params: { service: string }) => void;
  className?: string;
}

export const TestimonialCarousel2 = memo(function TestimonialCarousel2({
  stories = TESTIMONIAL_STORIES,
  onBook,
  className = "",
}: TestimonialCarousel2Props) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHindi = language === "hi";
  const isHost = role === "host";

  const tokens = getTestimonialCarouselTokens(role);

  const [activeCategory, setActiveCategory] = useState<"all" | "stash" | "rooms" | "kitchen" | "host">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackTime, setAudioPlaybackTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const filteredStories = stories.filter((s) => {
    if (activeCategory === "all") return true;
    return s.serviceCategory === activeCategory;
  });

  const activeStory: TestimonialStoryItem =
    filteredStories[currentIndex] ?? TESTIMONIAL_STORIES[0]!;




  const nextSlide = useCallback((withSound = false) => {
    if (withSound) {
      try {
        playClick();
      } catch {
        // Audio safety
      }
    }
    setIsPlayingAudio(false);
    setAudioPlaybackTime(0);
    setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
  }, [filteredStories.length]);

  const prevSlide = useCallback((withSound = false) => {
    if (withSound) {
      try {
        playClick();
      } catch {
        // Audio safety
      }
    }
    setIsPlayingAudio(false);
    setAudioPlaybackTime(0);
    setCurrentIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  }, [filteredStories.length]);

  // Audio Equalizer simulation interval when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioPlaybackTime((prev) => {
          if (prev >= 42) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAudio]);

  // Auto slide every 6 seconds unless paused or playing audio (silent auto-transition)
  useEffect(() => {
    if (isPaused || isPlayingAudio || filteredStories.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, isPlayingAudio, filteredStories.length]);

  // Reset index on category change
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlayingAudio(false);
    setAudioPlaybackTime(0);
  }, [activeCategory]);

  const toggleAudioPlayback = () => {
    playPop();
    setIsPlayingAudio((prev) => !prev);
  };

  const handleSwipeLeft = useCallback(() => nextSlide(true), [nextSlide]);
  const handleSwipeRight = useCallback(() => prevSlide(true), [prevSlide]);

  const { touchProps, containerProps } = useMobileSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    enableHaptics: true,
    enableMouseDrag: true,
  });

  const collegeBadgeSpec =
    TESTIMONIAL_CAROUSEL_TOKENS.collegeBadges[activeStory.collegeBadgeKey] ||
    TESTIMONIAL_CAROUSEL_TOKENS.collegeBadges["IIT Kanpur"];

  const formatAudioTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    return `${mins}:${remainderSecs < 10 ? "0" : ""}${remainderSecs}`;
  };

  return (
    <section
      id="testimonial-carousel-2"
      className={`section-isolated layout-isolated relative overflow-hidden py-10 sm:py-16 bg-slate-950/70 border-y border-white/10 ${className}`}
      role="region"
      aria-label={isHindi ? "संपादकीय छात्र और होस्ट समीक्षाएं" : "Editorial Testimonials & Audio Quotes"}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <AnimatedContent distance={20} direction="vertical" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-3"
              style={{
                borderColor: isHost ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)",
                backgroundColor: isHost ? "rgba(245, 158, 11, 0.12)" : "rgba(16, 185, 129, 0.12)",
                color: tokens.primaryAccent,
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isHindi
                  ? "सत्यापित ऑडियो क्लिप्स और रेटिंग्स"
                  : "Verified Student Audio Clips & College Reviews"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              <span className="text-gradient">
                {isHindi
                  ? "आईआईटी, एचबीटीआई व काकादेव से वास्तविक अनुभव"
                  : "Editorial Voice Notes from Campus & Host Vaults"}
              </span>
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 text-balance leading-relaxed">
              {isHindi
                ? "छात्रों के ओरिजिनल ऑडियो नोट्स सुनें, कॉलेज बैज देखें और सीधे सत्यापित बुकिंग्स का अनुभव लें।"
                : "Listen to original student audio clip notes, inspect verified college badges, and explore real dead-rent savings."}
            </p>
          </div>
        </AnimatedContent>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Story Categories"
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {[
            { id: "all", labelEn: "All Reviews", labelHi: "सभी समीक्षाएं", icon: Sparkles },
            { id: "stash", labelEn: "Stash Vault (₹300/mo)", labelHi: "वैकेशन स्टोरेज", icon: Package },
            { id: "rooms", labelEn: "Co-Living Rooms", labelHi: "जीरो-ब्रोकरेज कमरा", icon: Building2 },
            { id: "kitchen", labelEn: "Ghar Ka Swaad", labelHi: "घर का खाना", icon: UtensilsCrossed },
            { id: "host", labelEn: "Senior Hosts", labelHi: "सीनियर होस्ट्स", icon: Home },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  playPop();
                  setActiveCategory(tab.id as any);
                }}
                className={`accordion-category-pill flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  active
                    ? isHost
                      ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/25"
                      : "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/25"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{isHindi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Main Editorial Card Stage with Touch Swipe Gestures */}
        <div
          {...containerProps}
          {...touchProps}
          className={`relative max-w-4xl mx-auto ${containerProps.className}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStory.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="testimonial-editorial-stage relative overflow-hidden rounded-3xl border border-white/15 p-6 sm:p-10 bg-slate-900/90 shadow-2xl backdrop-blur-2xl"
              style={{
                boxShadow: tokens.cardGlow,
              }}
            >
              {/* Background ambient lighting */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
                style={{
                  background:
                    activeStory.role === "student"
                      ? "radial-gradient(circle, #10B981, transparent)"
                      : "radial-gradient(circle, #F59E0B, transparent)",
                }}
              />

              {/* Card Header: Avatar, Name, College Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-lg font-extrabold shadow-md ${activeStory.avatarBg}`}
                  >
                    {activeStory.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white">
                        {activeStory.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {activeStory.collegeOrLocality} • {activeStory.yearOrRole}
                    </p>
                  </div>
                </div>

                {/* College Badge & Savings Pill */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="college-badge-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border shadow-sm"
                    style={{
                      backgroundColor: collegeBadgeSpec.bg,
                      borderColor: collegeBadgeSpec.borderColor,
                      color: collegeBadgeSpec.color,
                    }}
                  >
                    <span>{collegeBadgeSpec.icon}</span>
                    <span>{isHindi ? collegeBadgeSpec.badgeTextHi : collegeBadgeSpec.badgeTextEn}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-extrabold text-amber-300 border border-amber-500/30 shadow-sm">
                    <IndianRupee className="h-3.5 w-3.5 text-amber-400" />
                    {activeStory.savingsOrIncome}
                  </span>
                </div>
              </div>

              {/* Audio Quote Clip Player Widget */}
              <div
                className={`mb-6 rounded-2xl border p-4 sm:p-5 transition-all ${
                  isPlayingAudio
                    ? "border-emerald-500/50 bg-emerald-950/30 shadow-lg shadow-emerald-500/10 audio-quote-playing-pulse"
                    : "border-white/10 bg-slate-950/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={toggleAudioPlayback}
                      aria-label={isPlayingAudio ? "Pause Audio Quote" : "Play Audio Quote"}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 ${
                        isPlayingAudio
                          ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                          : "bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950"
                      }`}
                    >
                      {isPlayingAudio ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold tracking-wide uppercase text-emerald-400">
                          {isPlayingAudio
                            ? isHindi
                              ? "ऑडियो क्लिप चल रही है..."
                              : "Playing Audio Note..."
                            : isHindi
                            ? "ऑडियो रिव्यू सुनें"
                            : "Listen to Voice Note"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatAudioTime(audioPlaybackTime)} / {activeStory.audioClipDurationText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium italic mt-0.5">
                        "{isHindi ? activeStory.audioQuoteSnippetHi : activeStory.audioQuoteSnippetEn}"
                      </p>
                    </div>
                  </div>

                  {/* Equalizer Frequency Spectrum Waveform */}
                  <div className="flex items-center gap-1 h-8 px-2 py-1 bg-slate-900/80 rounded-lg border border-white/10">
                    {TESTIMONIAL_CAROUSEL_TOKENS.audioClipQuotes.audioWaveformHeights.map(
                      (baseHeight, i) => {
                        const isHigh = isPlayingAudio && (i + audioPlaybackTime) % 3 === 0;
                        const barHeight = isPlayingAudio
                          ? Math.min(100, Math.max(20, (baseHeight * (i % 2 === 0 ? 1.2 : 0.8))))
                          : 25;
                        return (
                          <div
                            key={i}
                            className="audio-waveform-bar w-1 rounded-full"
                            style={{
                              height: `${barHeight}%`,
                              backgroundColor: isPlayingAudio
                                ? i % 2 === 0
                                  ? tokens.primaryAccent
                                  : tokens.secondaryAccent
                                : "rgba(255, 255, 255, 0.25)",
                            }}
                          />
                        );
                      }
                    )}
                    <button
                      onClick={() => setIsMuted((prev) => !prev)}
                      className="ml-2 text-slate-400 hover:text-white"
                      aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Editorial Quote Body Text */}
              <div className="relative mb-6">
                <Quote className="absolute -left-3 -top-3 h-10 w-10 text-emerald-500/15 pointer-events-none" />
                <p className="relative z-10 text-sm sm:text-base leading-relaxed text-slate-100 font-normal italic">
                  "{isHindi ? activeStory.storyHi : activeStory.storyEn}"
                </p>
              </div>

              {/* Footer Details: 5-Star Rating & Booking CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="star-rating-glow flex items-center text-amber-400">
                    {[...Array(activeStory.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    • {activeStory.highlightBadge}
                  </span>
                </div>

                <Button
                  variant={activeStory.role === "student" ? "hero" : "warm"}
                  size="sm"
                  onClick={() => {
                    playPop();
                    if (onBook) {
                      onBook({
                        service:
                          activeStory.serviceCategory === "host"
                            ? "spaces"
                            : activeStory.serviceCategory,
                      });
                    }
                  }}
                  className="w-full sm:w-auto text-xs px-5 py-2.5 font-bold shadow-lg"
                >
                  <span>{isHindi ? "इसी तरह बुक करें" : "Book Similar Experience"}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Bar */}
          <div className="mt-6 flex items-center justify-between px-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {filteredStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClick();
                    setIsPlayingAudio(false);
                    setAudioPlaybackTime(0);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? isHost
                        ? "w-8 bg-amber-400"
                        : "w-8 bg-emerald-400"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => prevSlide(true)}
                className="h-9 w-9 rounded-full border border-white/15 bg-slate-900/80 hover:bg-white/10 text-white shadow-md"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-xs font-mono font-bold text-slate-400">
                {currentIndex + 1} / {filteredStories.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => nextSlide(true)}
                className="h-9 w-9 rounded-full border border-white/15 bg-slate-900/80 hover:bg-white/10 text-white shadow-md"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
