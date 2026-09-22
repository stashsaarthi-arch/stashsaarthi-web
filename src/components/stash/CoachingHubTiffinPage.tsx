import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Utensils,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  ChevronRight,
  HeartHandshake,
  Flame,
  Check,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";
import { BookingModal } from "@/components/stash/BookingModal";
import { FooterSection } from "@/components/stash/FooterSection";
import {
  RoommateMenuShareModal,
  MenuShareDetails,
} from "@/components/stash/RoommateMenuShareModal";
import { showRateLimitToast } from "@/lib/rateLimiter";
import { toast } from "sonner";
import { DeliveryCutoffCountdown } from "@/components/stash/DeliveryCutoffCountdown";

export interface HubConfig {
  slug: string;
  hubName: string;
  coachingName: string;
  tagline: string;
  heroDescription: string;
  distance: string;
  walkingTime: string;
  nearbyLandmarks: string[];
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  chefName: string;
  chefBio: string;
  rating: number;
  totalOrders: string;
  activeStudents: number;
  highlightReview: {
    studentName: string;
    targetExam: string;
    comment: string;
    stars: number;
  };
}

export function CoachingHubTiffinPage({ config }: { config: HubConfig }) {
  const { language, setLanguage } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<"lunch" | "dinner">("lunch");
  const [selectedTier, setSelectedTier] = useState<"standard" | "feast">("standard");
  const [isRoommateShareOpen, setIsRoommateShareOpen] = useState<boolean>(false);
  const [roommateShareDetails, setRoommateShareDetails] = useState<MenuShareDetails | undefined>(
    undefined,
  );

  const isHindi = language === "hi";

  const handleWhatsAppOrder = (tierName: string) => {
    const text = isHindi
      ? `नमस्ते! मैं ${config.coachingName} (काकादेव) का छात्र हूँ। मुझे ${tierName} (थॉली) आर्डर करनी है। कृपया आज की थाली कन्फर्म करें!`
      : `Hello! I am a student near ${config.coachingName} Kakadeo. I would like to order the ${tierName} Tiffin Thali. Please confirm today's menu!`;
    const url = `https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: config.metaTitle,
          text: config.metaDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(isHindi ? "लिंक कॉपी हो गया!" : "Link copied to clipboard!");
    }
  };

  // Structured Data Schema for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: `Saarthi Kitchen - Tiffin Service Near ${config.coachingName} Kakadeo`,
    image: "https://stashsaarthi-web.vercel.app/images/og-student.png",
    "@id": config.canonicalUrl,
    url: config.canonicalUrl,
    telephone: `+${FOUNDER_WHATSAPP}`,
    priceRange: "₹50 - ₹90",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chhapeda Pulia Road, Kakadeo Coaching Hub",
      addressLocality: "Kanpur",
      postalCode: "208025",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.4831,
      longitude: 80.3072,
    },
    servesCuisine: ["North Indian", "Homestyle", "Desi Thali"],
  };

  return (
    <ErrorBoundary sectionName={`Coaching Hub Page - ${config.hubName}`}>
      <script
        type="application/ld+json"
        suppressHydrationWarning={true}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0A0D0F] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased overflow-x-hidden">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0D0F]/90 border-b border-emerald-500/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors border border-slate-700/50"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? "होम पेज" : "Back Home"}</span>
            </Link>
            <BrandLogo />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-700/60 bg-slate-900/60 hover:border-emerald-500/40 text-slate-300 transition-colors"
            >
              {isHindi ? "English" : "हिंदी"}
            </button>
            <Button
              size="sm"
              onClick={() => setIsBookingOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <Utensils className="w-3.5 h-3.5 mr-1.5" />
              {isHindi ? "टिफिन बुक करें" : "Book Tiffin"}
            </Button>
          </div>
        </header>

        {/* Hero Banner Section */}
        <section className="relative pt-8 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">{isHindi ? "काकादेव टिफिन" : "Kakadeo Tiffins"}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-medium">{config.coachingName}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Proximity Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  {config.distance} ({config.walkingTime}) {isHindi ? "काकादेव" : "from"}{" "}
                  {config.coachingName}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {isHindi ? (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      {config.coachingName}
                    </span>{" "}
                    के पास घर जैसा टिफिन सर्विस
                  </>
                ) : (
                  <>
                    Homestyle Tiffin Service Near{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      {config.coachingName}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {config.heroDescription}
              </p>

              {/* Key Value Props */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isHindi ? "100% माँ के हाथ का खाना" : "100% Verified PG Owner Mother Cooked"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isHindi
                        ? "शुद्ध देसी घी रोटी & 0 पाम ऑयल"
                        : "Pure Desi Ghee & Zero Palm Oil"}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isHindi ? "2 मिनट वॉक & हॉट डिलीवरी" : "2-Min Walk Pickup / Hot Delivery"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isHindi ? "लंच 1:00 PM & डिनर 8:00 PM" : "Lunch 1 PM & Dinner 8 PM Slots"}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isHindi ? "कभी भी पॉज़ करें" : "Pause Meal Anytime"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isHindi
                        ? "एग्जाम या घर जाते समय 1-टैप पॉज़"
                        : "1-Tap Pause for Test Series / Home"}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 shadow-xl shadow-emerald-500/20"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  {isHindi ? "₹50 थाली आर्डर करें" : "Order ₹50 Thali Now"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setRoommateShareDetails({
                      menuName: `${config.coachingName} Homestyle Thali`,
                      price: 50,
                      kitchenNode: `${config.hubName} (${config.chefName})`,
                      slot: "Lunch",
                      description: config.heroDescription,
                    });
                    setIsRoommateShareOpen(true);
                  }}
                  className="border-emerald-500/40 bg-[#0A0D0F] hover:bg-slate-800 text-emerald-300 font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-400 fill-emerald-400/20" />
                  {isHindi ? "रूममेट के साथ शेयर करें 📱" : "Share Menu with Roommate 📱"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleWhatsAppOrder("Desi Thali")}
                  className="border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-400" />
                  {isHindi ? "व्हाट्सएप डायरेक्ट ऑर्डर" : "WhatsApp Quick Order"}
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  onClick={handleShare}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                >
                  <Share2 className="w-4 h-4 mr-1.5" />
                  {isHindi ? "शेयर" : "Share"}
                </Button>
              </div>
            </div>

            {/* Live Kitchen Node Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 shadow-2xl backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      🍱
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{config.chefName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>
                          {config.distance} {isHindi ? "काकादेव" : "from"} {config.coachingName}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                      <span>{config.rating}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {config.totalOrders} {isHindi ? "ऑर्डर" : "orders"}
                    </div>
                  </div>
                </div>

                {/* Chef Bio */}
                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  "{config.chefBio}"
                </p>

                {/* Quota Progress Bar */}
                <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      {isHindi ? "आज का लंच टोकन स्टेटस" : "Today's Lunch Tokens"}
                    </span>
                    <span className="text-amber-400 font-bold text-xs">
                      78% {isHindi ? "बुक हुआ (14 बाकी)" : "Sold (14 Left)"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full w-[78%] transition-all duration-500" />
                  </div>
                </div>

                {/* Nearby Landmarks */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isHindi ? "निकटतम कोचिंग लैंडमार्क्स" : "Nearby Coaching Landmarks"}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {config.nearbyLandmarks.map((lm, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        📍 {lm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Offer Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-200">
                      {isHindi
                        ? "कोड TASTE50: 1st थाली पर ₹50 छूट"
                        : "Code TASTE50: Flat ₹50 Off 1st Thali"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu & Pricing Matrix Section */}
        <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          {/* Live Cutoff Countdown Banner (Task 83) */}
          <DeliveryCutoffCountdown
            onBookClick={() => setIsBookingOpen(true)}
            className="mb-10 max-w-4xl mx-auto"
          />

          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isHindi ? (
                <>काकादेव {config.coachingName} स्पेशल डेली मेनू</>
              ) : (
                <>Kakadeo {config.coachingName} Daily Menu & Thalis</>
              )}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              {isHindi
                ? "रोजाना ताजा, 0% प्रिजर्वेटिव, शुद्ध सरसों तेल एवं देसी घी में पका हुआ स्वादिष्ट भोजन।"
                : "Freshly prepared daily with 0% preservatives, pure mustard oil, and desi ghee phulkas."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Thali */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isHindi ? "लोकप्रिय छात्र थाली" : "Student Most Popular"}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹50</span>
                    <span className="text-xs text-slate-400">
                      {" "}
                      / {isHindi ? "पिकअप" : "pickup"}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {isHindi ? "स्टैंडर्ड होमस्टाइल थाली" : "Standard Homestyle Thali"}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi
                    ? "रोजाना की पढ़ाई के लिए संतुलित, हल्का और पौष्टिक भोजन।"
                    : "Balanced, light, and nutritious meal crafted for long study sessions."}
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>4 {isHindi ? "देसी घी की रोटी" : "Phulkas with Desi Ghee"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      1 {isHindi ? "कटोरी अरहर/मूंग दाल तड़का" : "Katori Arhar/Moong Dal Tadka"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      1 {isHindi ? "सीज़नल ताज़ी सब्ज़ी (आलू गोभी/भिंडी)" : "Fresh Seasonal Subzi"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isHindi ? "स्टीम्ड जीरा राइस" : "Steamed Jeera Rice"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isHindi ? "सलाद एवं हरी चटनी" : "Fresh Salad & Mint Chutney"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700"
                >
                  {isHindi ? "₹50 थाली बुक करें" : "Book ₹50 Thali"}
                </Button>
              </div>
            </div>

            {/* Special Feast Thali */}
            <div className="relative rounded-2xl bg-slate-900/90 border-2 border-emerald-500/60 p-6 flex flex-col justify-between shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow">
                {isHindi ? "रविवार & टेस्ट डे स्पेशल" : "Sunday & Test Day Special"}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {isHindi ? "पनीर & खीर स्पेशल" : "Paneer & Kheer Special"}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹90</span>
                    <span className="text-xs text-slate-400"> / {isHindi ? "थाली" : "thali"}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {isHindi ? "सीनियर मदर स्पेशल फीस्ट" : "Verified PG Owner Mother Special Feast"}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi
                    ? "शाही पनीर, बटर रोटी और घर की मटका खीर का ज़ायका।"
                    : "Rich Shahi Paneer, Butter Phulkas, and homemade Matka Kheer."}
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>4 {isHindi ? "बटर फुल्के" : "Butter Phulkas"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      1 {isHindi ? "शाही पनीर / मलाई कोफ़्ता" : "Shahi Paneer / Malai Kofta"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1 {isHindi ? "दाल मखनी / चने की दाल" : "Dal Makhani"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {isHindi ? "मटका खीर या गुलाब जामुन" : "Matka Kheer or Gulab Jamun"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {isHindi ? "पापड़, बूंदी रायता & सलाद" : "Papad, Boondi Raita & Salad"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  {isHindi ? "₹90 फीस्ट थाली बुक करें" : "Book ₹90 Feast Thali"}
                </Button>
              </div>
            </div>

            {/* Monthly Subscription Pass */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {isHindi ? "अधिकतम बचत" : "Maximum Savings"}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹2,400</span>
                    <span className="text-xs text-slate-400"> / {isHindi ? "महीना" : "month"}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {isHindi ? "मंथली टिफिन पास (60 मील)" : "Monthly Tiffin Pass (60 Meals)"}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi
                    ? "केवल ₹40/मील का औसत खर्च। जब चाहें तब 1-टैप से मील पॉज़ करें।"
                    : "Avg ₹40/meal rate. Includes 1-tap pause anytime for test series or breaks."}
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      60 {isHindi ? "मील टोकन (लंच + डिनर)" : "Meal Tokens (Lunch + Dinner)"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{isHindi ? "जीरो डिलीवरी चार्ज" : "Free Doorstep Delivery"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      {isHindi ? "अनलिमिटेड मील पॉज़ & रोलओवर" : "Unlimited Meal Pause & Rollover"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      {isHindi ? "रविवार स्पेशल थॉली फ्री" : "Sunday Special Feast Included"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{isHindi ? "स्वादिष्ट & सुपाच्य" : "100% Guaranteed Digestible"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold border border-slate-700"
                >
                  {isHindi ? "₹2,400 पास खरीदें" : "Buy ₹2,400 Monthly Pass"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Student Testimonials Section */}
        <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 space-y-4 text-center relative overflow-hidden">
            <div className="flex justify-center gap-1">
              {[...Array(config.highlightReview.stars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-slate-200 text-sm sm:text-base italic leading-relaxed">
              "{config.highlightReview.comment}"
            </p>

            <div className="pt-2">
              <div className="font-bold text-white text-sm">
                {config.highlightReview.studentName}
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                {config.highlightReview.targetExam} • {config.coachingName} Kakadeo
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 lg:px-8 max-w-5xl mx-auto border-t border-slate-800/80 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            {isHindi ? "अक्सर पूछे जाने वाले सवाल (FAQs)" : "Frequently Asked Questions"}
          </h2>

          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-200">
                {isHindi
                  ? `1. काकादेव ${config.coachingName} से टिफिन पिकअप पॉइंट कितना दूर है?`
                  : `1. How far is the tiffin node from ${config.coachingName} Kakadeo?`}
              </h4>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? `हमारा किचन नोड ${config.coachingName} से केवल ${config.distance} (${config.walkingTime}) की दूरी पर स्थित है। आप क्लास के बाद सीधे पिकअप कर सकते हैं या हॉस्टल डिलीवरी पा सकते हैं।`
                  : `Our kitchen node is located just ${config.distance} (${config.walkingTime}) from ${config.coachingName}. You can pick up on your way back from class or get it delivered to your room.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-200">
                {isHindi
                  ? "2. अगर मैं टेस्ट सीरीज या छुट्टी पर घर जाता हूँ तो क्या मेरे पैसे डूबेंगे?"
                  : "2. What happens to my balance if I go home for tests or breaks?"}
              </h4>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? "बिल्कुल नहीं! हमारे ऐप या व्हाट्सएप पर 1-टैप करके आप अपना मील टोकन पॉज़ कर सकते हैं। आपका बैलेंस 100% सुरक्षित रहता है और वापस आने पर इस्तेमाल हो सकता है।"
                  : "Not at all! You can pause your meal tokens anytime with a single tap. Unused tokens roll over indefinitely with zero penalty."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-200">
                {isHindi
                  ? "3. खाना कौन पकाता है और हाइजीन का क्या स्तर है?"
                  : "3. Who prepares the food and what hygiene standards are followed?"}
              </h4>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? "हमारा खाना काकादेव की वरिष्ठ माताओं और गृहिणियों द्वारा शुद्ध देशी तरीके से बनाया जाता है। इसमें कम तेल, शुद्ध मसाले और 0% कमर्शियल कलर/प्रिजर्वेटिव होते हैं।"
                  : "All meals are prepared by verified verified PG owner mothers in home kitchens using minimal pure oil, fresh spices, and zero commercial preservatives."}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <FooterSection />

        {/* Booking Modal */}
        <BookingModal open={isBookingOpen} onOpenChange={setIsBookingOpen} service="kitchen" />
      </div>
    </ErrorBoundary>
  );
}
