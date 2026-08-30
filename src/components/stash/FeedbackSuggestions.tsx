import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Filter,
  Send,
  User,
  Building,
  Heart,
  Share2,
  TrendingUp,
  Award,
  ArrowRight,
  MessageCircle,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";
import AnimatedContent from "@/components/ui/AnimatedContent";

export type ReviewItem = {
  id: string;
  name: string;
  name_hi?: string;
  role: string;
  role_hi?: string;
  campusOrLocality: string;
  campusOrLocality_hi?: string;
  service: "stash" | "spaces" | "kitchen" | "general";
  rating: number;
  date: string;
  title: string;
  title_hi?: string;
  comment: string;
  comment_hi?: string;
  verified: boolean;
  passId?: string;
};

export type SuggestionItem = {
  id: string;
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  category: "app" | "pricing" | "safety" | "expansion" | "kitchen" | "general";
  submittedBy: string;
  locality: string;
  upvotes: number;
  status: "under_review" | "planned" | "in_progress" | "implemented";
  createdAt: string;
};

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rohan Agrawal",
    name_hi: "रोहन अग्रवाल",
    role: "B.Tech CSE, 3rd Year",
    role_hi: "बी.टेक कंप्यूटर साइंस, तृतीय वर्ष",
    campusOrLocality: "IIT Kanpur Belt, Kalyanpur",
    campusOrLocality_hi: "आईआईटी कानपुर बेल्ट, कल्याणपुर",
    service: "stash",
    rating: 5,
    date: "Verified Summer 2026",
    title: "Saved ₹14,000 dead rent with zero hassle!",
    title_hi: "बिना किसी परेशानी के ₹14,000 डेड-रेंट बचाए!",
    comment:
      "I was paying ₹4,500/mo just to keep my 3 luggage bags in my flat during the 3-month summer break. StashSaarthi stored them safely with laser barcode seals for just ₹900 total. Delivered back in perfect condition on day one of the new semester.",
    comment_hi:
      "मैं 3 महीने की गर्मियों की छुट्टियों में अपने फ्लैट में सिर्फ 3 बैग रखने के लिए ₹4,500/माह दे रहा था। स्टैशसारथी ने लेज़र बारकोड सील के साथ केवल ₹900 में इन्हें सुरक्षित रखा। नए सेमेस्टर के पहले ही दिन मुझे सुरक्षित वापस मिल गए।",
    verified: true,
    passId: "#SS-REV-84920",
  },
  {
    id: "rev-2",
    name: "Smt. Manju & Prof. S. N. Verma",
    name_hi: "श्रीमती मंजू एवं प्रो. एस. एन. वर्मा",
    role: "Senior Hosts, 69 & 74 yrs",
    role_hi: "वरिष्ठ होस्ट, 69 एवं 74 वर्ष",
    campusOrLocality: "Swaroop Nagar, Kanpur",
    campusOrLocality_hi: "स्वरूप नगर, कानपुर",
    service: "spaces",
    rating: 5,
    date: "Active Host (5 Months)",
    title: "Dignified monthly income & wonderful young company",
    title_hi: "सम्मानजनक मासिक आय और युवा साथियों का आत्मीय साथ",
    comment:
      "Our first-floor rooms had been lying locked since our children moved abroad. StashSaarthi verified two sincere medical students for us. We earn ₹12,000 every month directly in our bank account, and the students even help us with grocery apps and evening walks.",
    comment_hi:
      "बच्चों के विदेश जाने के बाद हमारे ऊपर के कमरे ताले में बंद पड़े थे। स्टैशसारथी ने पूरी पुलिस व कॉलेज जांच के बाद दो मेडिकल छात्रों को हमारे यहाँ रखा। हमें हर महीने ₹12,000 की निश्चित आय मिलती है और बच्चे घर में मदद भी करते हैं।",
    verified: true,
    passId: "#SS-HOST-41029",
  },
  {
    id: "rev-3",
    name: "Ananya Dixit",
    name_hi: "अनन्या दीक्षित",
    role: "MBA Student, CSJMU",
    role_hi: "एमबीए छात्रा, सीएसजेएमयू",
    campusOrLocality: "Kakadeo Corridor",
    campusOrLocality_hi: "काकादेव कॉरिडोर",
    service: "kitchen",
    rating: 5,
    date: "Subscriber (3 Months)",
    title: "Finally pure home-cooked tiffins with zero hostel oil",
    title_hi: "हॉस्टल के तेल-मसाले से मुक्ति, असली घर का सात्विक खाना",
    comment:
      "Hostel mess food was causing severe acidity. Through Saarthi Kitchen, I receive fresh, piping-hot home cooked meals prepared by Auntieji nearby for just ₹90/meal. Tastes exactly like home food from mom.",
    comment_hi:
      "हॉस्टल के खाने से लगातार पेट खराब रहता था। सारथी किचन से पास की एक आंटी के घर से सिर्फ ₹90 में शुद्ध, गरमा-गरम घर जैसा खाना मिलता है। बिल्कुल घर के स्वाद जैसा।",
    verified: true,
    passId: "#SS-MEAL-19402",
  },
  {
    id: "rev-4",
    name: "Devendra Shukla",
    name_hi: "देवेंद्र शुक्ला",
    role: "Micro-Hub Storage Partner",
    role_hi: "माइक्रो-हब स्टोरेज पार्टनर",
    campusOrLocality: "Rawatpur, Kanpur",
    campusOrLocality_hi: "रावतपुर, कानपुर",
    service: "stash",
    rating: 5,
    date: "Verified Node Partner",
    title: "Monetized 100 sq.ft empty storage room easily",
    title_hi: "खाली 100 वर्ग फुट कमरे से आसान अतिरिक्त कमाई",
    comment:
      "I had a dry, clean spare room on ground floor. StashSaarthi audited the moisture, provided standard pallets, and now I manage 45 student bags earning ₹8,100/mo completely passive.",
    comment_hi:
      "मेरे पास नीचे का एक सूखा और साफ कमरा खाली था। टीम ने नमी की जांच की, पैलेट्स दिए और अब मैं 45 छात्रों के बैग्स रखकर बिना किसी परेशानी के हर महीने ₹8,100 कमा रहा हूँ।",
    verified: true,
    passId: "#SS-NODE-59301",
  },
];

const INITIAL_SUGGESTIONS: SuggestionItem[] = [
  {
    id: "sug-1",
    title: "Live GPS & Humidity Tracking for High-Value Tech Items",
    title_hi: "महंगे लैपटॉप/गैजेट्स के लिए लाइव जीपीएस व नमी ट्रैकिंग",
    description:
      "Provide an optional IoT tamper-sensor add-on for students leaving expensive gaming PCs, monitors, or musical instruments during long 4-month semester breaks.",
    description_hi:
      "लंबे 4 महीने के ब्रेक के दौरान महंगे गेमिंग पीसी, मॉनिटर या वाद्य यंत्र छोड़ने वाले छात्रों के लिए एक वैकल्पिक IoT सेंसर सुविधा जोड़ी जाए।",
    category: "safety",
    submittedBy: "Vikramaditya S.",
    locality: "IIT Kanpur (Hall 12)",
    upvotes: 42,
    status: "in_progress",
    createdAt: "Aug 2026",
  },
  {
    id: "sug-2",
    title: "Inter-Campus Luggage Shuttle (Kanpur ⇄ Lucknow Corridor)",
    title_hi: "इंटर-कैंपस लगेज शटल (कानपुर ⇄ लखनऊ कॉरिडोर)",
    description:
      "Add a scheduled door-to-door shuttle service at semester end to transfer luggage directly between Kanpur and Lucknow hostels with shared mini-van rates.",
    description_hi:
      "सेमेस्टर समाप्ति पर कानपुर और लखनऊ हॉस्टलों के बीच सीधे सामान ट्रांसफर करने के लिए शेड्यूल्ड वैन शटल सेवा शुरू करें।",
    category: "expansion",
    submittedBy: "Pooja Trivedi",
    locality: "IIM Lucknow & CSJMU",
    upvotes: 38,
    status: "planned",
    createdAt: "Aug 2026",
  },
  {
    id: "sug-3",
    title: "Split-Bill Feature for Roommates Stashing Together",
    title_hi: "एक साथ बैग रखने वाले रूममेट्स के लिए स्प्लिट-बिल (बिल विभाजन)",
    description:
      "Allow 3-4 flatmates sharing a corner to enter their individual UPI IDs and split the luggage storage monthly escrow automatically in one checkout.",
    description_hi:
      "एक साथ 3-4 रूममेट्स को अपने व्यक्तिगत यूपीआई से एक ही बुकिंग में सामान का किराया विभाजित (Split) करने की सुविधा दें।",
    category: "pricing",
    submittedBy: "Adarsh & Utkarsh",
    locality: "Kakadeo Coaching Hub",
    upvotes: 29,
    status: "under_review",
    createdAt: "Aug 2026",
  },
  {
    id: "sug-4",
    title: "Custom Diet & Calorie Preference Filter in Saarthi Kitchen",
    title_hi: "सारथी किचन में डाइट व कैलोरी के अनुसार भोजन फ़िल्टर",
    description:
      "Allow students preparing for exams or gym training to select low-oil, high-protein, or pure Jain thali options prepared by senior home chefs.",
    description_hi:
      "जिम जाने वाले या प्रतियोगी परीक्षा की तैयारी करने वाले छात्रों के लिए कम तेल, हाई-प्रोटीन या शुद्ध जैन थाली का विकल्प दिया जाए।",
    category: "kitchen",
    submittedBy: "Megha Singhal",
    locality: "GSVM Medical College",
    upvotes: 24,
    status: "planned",
    createdAt: "Aug 2026",
  },
  {
    id: "sug-5",
    title: "Senior Host Tech Assistance Micro-Credit Rewards",
    title_hi: "वरिष्ठ होस्ट की तकनीकी मदद पर छात्रों को रेंट क्रेडिट रिवॉर्ड",
    description:
      "When student tenants spend 15 minutes helping their elderly host file digital life certificates or book train tickets, award a ₹200 rental discount token.",
    description_hi:
      "जब छात्र अपने बुजुर्ग होस्ट को डिजिटल लाइफ सर्टिफिकेट या ऑनलाइन टिकट में मदद करें, तो उन्हें किराए में ₹200 का डिस्काउंट क्रेडिट मिले।",
    category: "app",
    submittedBy: "Dr. K. L. Mehrotra",
    locality: "Civil Lines, Kanpur",
    upvotes: 31,
    status: "implemented",
    createdAt: "Jul 2026",
  },
];

export function FeedbackSuggestions() {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";

  // Active Tab: 'feedback' | 'suggestions'
  const [activeTab, setActiveTab] = useState<"feedback" | "suggestions">("feedback");

  // Show inline quick form toggle
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  // Storage & State for Reviews
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem("stash_user_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_REVIEWS];
      }
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  // Storage & State for Suggestions
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(() => {
    try {
      const saved = localStorage.getItem("stash_user_suggestions");
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_SUGGESTIONS];
      }
    } catch {
      // fallback
    }
    return INITIAL_SUGGESTIONS;
  });

  // Track user upvoted suggestions in localStorage
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("stash_upvoted_suggestions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [suggestionFilter, setSuggestionFilter] = useState<string>("all");

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Student");
  const [formLocality, setFormLocality] = useState("");
  const [formService, setFormService] = useState<"stash" | "spaces" | "kitchen" | "general">(
    "stash",
  );
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");

  // Suggestion Form State
  const [sugTitle, setSugTitle] = useState("");
  const [sugCategory, setSugCategory] = useState<
    "app" | "pricing" | "safety" | "expansion" | "kitchen" | "general"
  >("app");
  const [sugDescription, setSugDescription] = useState("");
  const [sugName, setSugName] = useState("");
  const [sugLocality, setSugLocality] = useState("");

  // Handle Upvoting
  const handleToggleUpvote = (id: string) => {
    const hasVoted = upvotedIds.includes(id);
    let newUpvoted: string[];

    if (hasVoted) {
      newUpvoted = upvotedIds.filter((item) => item !== id);
      setSuggestions((prev) =>
        prev.map((sug) =>
          sug.id === id ? { ...sug, upvotes: Math.max(0, sug.upvotes - 1) } : sug,
        ),
      );
      toast.info(isHi ? "वोट वापस लिया गया" : "Upvote removed");
    } else {
      newUpvoted = [...upvotedIds, id];
      setSuggestions((prev) =>
        prev.map((sug) => (sug.id === id ? { ...sug, upvotes: sug.upvotes + 1 } : sug)),
      );
      toast.success(
        isHi
          ? "वोट दर्ज हुआ! टीम प्राथमिकता देखेगी।"
          : "Upvote recorded! Team has noted this priority.",
      );
    }

    setUpvotedIds(newUpvoted);
    try {
      localStorage.setItem("stash_upvoted_suggestions", JSON.stringify(newUpvoted));
    } catch {
      // ignore
    }
  };

  // Submit Review Form
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      toast.error(
        isHi ? "कृपया अपना नाम और समीक्षा विवरण भरें" : "Please fill your name and review details",
      );
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      role: formRole,
      campusOrLocality: formLocality.trim() || (isHi ? "कानपुर" : "Kanpur Node"),
      service: formService,
      rating: formRating,
      date: isHi ? "अभी-अभी" : "Just now",
      title: formTitle.trim() || (isHi ? "उत्कृष्ट अनुभव" : "Great Experience"),
      comment: formComment.trim(),
      verified: true,
      passId: `#SS-REV-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const existing = JSON.parse(localStorage.getItem("stash_user_reviews") || "[]");
      localStorage.setItem("stash_user_reviews", JSON.stringify([newRev, ...existing]));
    } catch {
      // ignore
    }

    toast.success(
      isHi ? "🎉 समीक्षा सफलतापूर्वक दर्ज हुई!" : "🎉 Feedback submitted successfully!",
      {
        description: isHi
          ? "आपकी समीक्षा तुरंत लाइव कर दी गई है। धन्यवाद!"
          : "Your review is now live on the platform. Thank you!",
      },
    );

    setFormName("");
    setFormLocality("");
    setFormTitle("");
    setFormComment("");
    setShowReviewForm(false);
  };

  // Submit Suggestion Form
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugTitle.trim() || !sugDescription.trim() || !sugName.trim()) {
      toast.error(
        isHi
          ? "कृपया सुझाव का शीर्षक, विवरण और अपना नाम भरें"
          : "Please fill in title, description, and your name",
      );
      return;
    }

    const newSug: SuggestionItem = {
      id: `sug-${Date.now()}`,
      title: sugTitle.trim(),
      description: sugDescription.trim(),
      category: sugCategory,
      submittedBy: sugName.trim(),
      locality: sugLocality.trim() || (isHi ? "कम्युनिटी सदस्य" : "Community Member"),
      upvotes: 1,
      status: "under_review",
      createdAt: isHi ? "अभी-अभी" : "Just now",
    };

    const updated = [newSug, ...suggestions];
    setSuggestions(updated);
    setUpvotedIds((prev) => [...prev, newSug.id]);

    try {
      const existing = JSON.parse(localStorage.getItem("stash_user_suggestions") || "[]");
      localStorage.setItem("stash_user_suggestions", JSON.stringify([newSug, ...existing]));
      const upvoted = JSON.parse(localStorage.getItem("stash_upvoted_suggestions") || "[]");
      localStorage.setItem("stash_upvoted_suggestions", JSON.stringify([...upvoted, newSug.id]));
    } catch {
      // ignore
    }

    toast.success(
      isHi
        ? "🚀 सुझाव सीधे फाउंडर व टेक टीम को भेजा गया!"
        : "🚀 Suggestion submitted to Founder & Tech Team!",
      {
        description: isHi
          ? "आपका सुझाव लाइव रोडमैप में जुड़ गया है। अन्य छात्र इसे अपवोट कर सकते हैं।"
          : "Your suggestion is live on the community board for upvotes!",
      },
    );

    setSugTitle("");
    setSugDescription("");
    setSugName("");
    setSugLocality("");
    setShowSuggestionForm(false);
  };

  // Filtered lists
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    return r.service === reviewFilter;
  });

  const filteredSuggestions = suggestions.filter((s) => {
    if (suggestionFilter === "all") return true;
    return s.category === suggestionFilter;
  });

  const isStudent = role === "student";
  const accentBorder = isStudent ? "border-emerald-500/30" : "border-amber-500/30";
  const accentBg = isStudent ? "bg-emerald-500/10" : "bg-amber-500/10";
  const accentText = isStudent ? "text-emerald-400" : "text-amber-400";
  const glowBorder = isStudent
    ? "border-emerald-500/40 shadow-emerald-500/15"
    : "border-amber-500/40 shadow-amber-500/15";

  const getStatusBadge = (status: SuggestionItem["status"]) => {
    switch (status) {
      case "implemented":
        return {
          label: isHi ? "लागू किया गया (Live)" : "Implemented (Live)",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        };
      case "in_progress":
        return {
          label: isHi ? "कार्य प्रगति पर" : "In Progress",
          color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        };
      case "planned":
        return {
          label: isHi ? "रोडमैप में शामिल" : "Planned in Roadmap",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        };
      case "under_review":
      default:
        return {
          label: isHi ? "समीक्षाधीन" : "Under Review",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        };
    }
  };

  return (
    <section
      id="feedback"
      className="relative py-4 sm:py-6 bg-[#0A0D0F] text-foreground overflow-hidden border-t border-white/[0.08]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Badge & Title */}
        <AnimatedContent distance={20} direction="vertical">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/12 text-[9.5px] sm:text-[11px] font-semibold backdrop-blur-md mb-2 shadow-md">
              <Sparkles className={`w-3 h-3 ${accentText}`} />
              <span className="text-zinc-200">
                {isHi
                  ? "ओपन कम्युनिटी रिव्यू व सुधार हब"
                  : "Open Community Feedback & Improvement Hub"}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${isStudent ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`}
              />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              {isHi ? (
                <>
                  ग्राहक <span className={accentText}>समीक्षाएं</span> एवं सुधार के{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300">
                    खुले सुझाव
                  </span>
                </>
              ) : (
                <>
                  Customer <span className={accentText}>Reviews</span> & Platform{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300">
                    Improvement Ideas
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {isHi
                ? "यहाँ आप अपना अनुभव व रेटिंग (1-5 स्टार) साझा कर सकते हैं, साथ ही बता सकते हैं कि हमें प्लेटफॉर्म में क्या नया सुधार या फीचर जोड़ना चाहिए।"
                : "Share your experience with star ratings & written reviews, or tell us directly what improvements, features, or city corridors we should build next."}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 inline-flex p-1 rounded-xl bg-[#141A1F] border border-white/15 shadow-xl max-w-md w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "feedback"
                    ? `${isStudent ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30" : "bg-amber-500 text-black shadow-md shadow-amber-500/30"} scale-100`
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{isHi ? "1. समीक्षा व रेटिंग" : "1. Rate & Review"}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/25 font-black">
                  {reviews.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("suggestions")}
                id="suggestions"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "suggestions"
                    ? `${isStudent ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30" : "bg-amber-500 text-black shadow-md shadow-amber-500/30"} scale-100`
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{isHi ? "2. सुधार के सुझाव" : "2. Suggest Ideas"}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/25 font-black">
                  {suggestions.length}
                </span>
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: CUSTOMER REVIEWS & FEEDBACK FORM
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {/* Filter Pills & Write Review Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12171B] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1 shrink-0 font-bold">
                  <Filter className="w-3 h-3" />
                  {isHi ? "फ़िल्टर:" : "Filter:"}
                </span>
                {[
                  { key: "all", label: isHi ? "सभी समीक्षाएं" : "All Reviews" },
                  { key: "stash", label: isHi ? "📦 वेकेशन स्टोरेज" : "📦 Storage" },
                  { key: "spaces", label: isHi ? "🏠 सीनियर लिविंग" : "🏠 Living" },
                  { key: "kitchen", label: isHi ? "🍲 सारथी किचन" : "🍲 Kitchen" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setReviewFilter(f.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      reviewFilter === f.key
                        ? `${accentBg} ${accentText} ${accentBorder} border shadow-sm`
                        : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <span className="text-[11px] text-zinc-400 font-semibold">
                  {isHi ? `${filteredReviews.length} समीक्षाएं` : `${filteredReviews.length} Reviews`}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className={`text-xs px-3.5 py-1.5 h-8 font-bold cursor-pointer transition-all ${
                    showReviewForm
                      ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                  <span>
                    {showReviewForm
                      ? isHi
                        ? "✕ फ़ॉर्म छुपाएं"
                        : "✕ Close Form"
                      : isHi
                        ? "✍️ समीक्षा लिखें"
                        : "✍️ Write Review"}
                  </span>
                </Button>
              </div>
            </div>

            {/* EXPANDABLE INLINE SUBMISSION FORM */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#13191F] via-[#101519] to-[#0D1115] border ${glowBorder} shadow-xl relative`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <Star className="w-4 h-4 fill-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {isHi ? "अपना अनुभव व रेटिंग दर्ज करें" : "Write Your Review & Rating"}
                          </h3>
                          <p className="text-[11px] text-zinc-400">
                            {isHi
                              ? "लगेज स्टोरेज, रूम या टिफिन का अपना सच्चा अनुभव साझा करें।"
                              : "Share your honest review for storage, room stay, or meals."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-white/10 self-start sm:self-auto">
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {isHi ? "रेटिंग:" : "Rating:"}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const active = (formHoverRating || formRating) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setFormHoverRating(star)}
                                onMouseLeave={() => setFormHoverRating(null)}
                                onClick={() => setFormRating(star)}
                                className="p-0.5 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    active
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-zinc-700 text-zinc-700"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-black text-amber-400 ml-1">{formRating}.0</span>
                      </div>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "आपका नाम *" : "Your Full Name *"}
                          </label>
                          <Input
                            required
                            placeholder={isHi ? "जैसे: अमन वर्मा" : "e.g. Aman Verma"}
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "आपकी भूमिका" : "Your Role"}
                          </label>
                          <select
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value)}
                            className="w-full text-xs rounded-lg bg-[#172027] border border-white/15 p-2 text-white h-9 focus:outline-none focus:border-emerald-400"
                          >
                            <option value="Student">{isHi ? "🎓 छात्र / Student" : "🎓 Student"}</option>
                            <option value="Senior Host">
                              {isHi ? "🏠 सीनियर होस्ट / Host" : "🏠 Senior Host"}
                            </option>
                            <option value="Parent">{isHi ? "👨‍👩‍👦 अभिभावक / Parent" : "👨‍👩‍👦 Parent"}</option>
                            <option value="Partner">
                              {isHi ? "📦 नोड पार्टनर / Partner" : "📦 Storage Partner"}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "उपयोग की गई सेवा" : "Service Used"}
                          </label>
                          <select
                            value={formService}
                            onChange={(e) => setFormService(e.target.value as any)}
                            className="w-full text-xs rounded-lg bg-[#172027] border border-white/15 p-2 text-white h-9 focus:outline-none focus:border-emerald-400"
                          >
                            <option value="stash">
                              {isHi ? "📦 वेकेशन स्टोरेज (₹300/mo)" : "📦 Vacation Storage"}
                            </option>
                            <option value="spaces">
                              {isHi ? "🏠 सीनियर लिविंग रूम" : "🏠 Senior Living Room"}
                            </option>
                            <option value="kitchen">
                              {isHi ? "🍲 सारथी होम टिफिन" : "🍲 Saarthi Home Tiffins"}
                            </option>
                            <option value="general">
                              {isHi ? "✨ सामान्य प्लेटफॉर्म" : "✨ General Ecosystem"}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "कॉलेज / इलाका" : "College / Locality"}
                          </label>
                          <Input
                            placeholder={
                              isHi ? "जैसे: IIT Kanpur / Kalyanpur" : "e.g. IIT Kanpur / Kakadeo"
                            }
                            value={formLocality}
                            onChange={(e) => setFormLocality(e.target.value)}
                            className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                          {isHi ? "समीक्षा शीर्षक (Headline)" : "Review Headline"}
                        </label>
                        <Input
                          placeholder={
                            isHi
                              ? "जैसे: समय पर पिकअप, लेज़र सील और सुरक्षित सामान!"
                              : "e.g. Safe laser seals and on-time vacation pickup!"
                          }
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                          {isHi ? "आपका विस्तृत अनुभव व रिव्यू *" : "Your Detailed Review / Feedback *"}
                        </label>
                        <Textarea
                          required
                          rows={2}
                          placeholder={
                            isHi
                              ? "बताएं कि स्टोरेज, रहने या खाने का आपका अनुभव कैसा रहा... (यह तुरंत नीचे लाइव समीक्षाओं में दिखाई देगा)"
                              : "Describe your experience with storage safety, room stays, or meals... (It will appear instantly on the live review board below)"
                          }
                          value={formComment}
                          onChange={(e) => setFormComment(e.target.value)}
                          className="bg-[#172027] border-white/15 text-xs text-white rounded-lg resize-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isHi
                              ? "100% प्रामाणिक व सत्यापित समीक्षा"
                              : "Verified Customer Submission — Zero Fake Reviews"}
                          </span>
                        </div>

                        <Button
                          type="submit"
                          size="sm"
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold px-6 py-2 rounded-lg shadow-md shadow-emerald-500/20 cursor-pointer text-xs h-8"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          {isHi ? "समीक्षा सबमिट करें" : "Publish Review Now"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reviews Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredReviews.map((rev) => {
                const serviceLabel =
                  rev.service === "stash"
                    ? isHi
                      ? "📦 वेकेशन स्टैश"
                      : "📦 Vacation Stash"
                    : rev.service === "spaces"
                      ? isHi
                        ? "🏠 सीनियर होम लिविंग"
                        : "🏠 Senior Living"
                      : rev.service === "kitchen"
                        ? isHi
                          ? "🍲 सारथी किचन टिफिन"
                          : "🍲 Saarthi Kitchen"
                        : isHi
                          ? "✨ सामान्य इकोसिस्टम"
                          : "✨ Platform";

                return (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[#141A1F] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div>
                      {/* Rating & Service */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-zinc-700 text-zinc-700"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs font-black text-amber-400">
                            {rev.rating}.0
                          </span>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-zinc-300">
                          {serviceLabel}
                        </span>
                      </div>

                      {/* Headline */}
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                        "{isHi && rev.title_hi ? rev.title_hi : rev.title}"
                      </h4>

                      {/* Review Comment */}
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {isHi && rev.comment_hi ? rev.comment_hi : rev.comment}
                      </p>
                    </div>

                    {/* Author & Verification */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-extrabold text-[11px] shrink-0 shadow-inner">
                          {rev.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-xs">
                            {isHi && rev.name_hi ? rev.name_hi : rev.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {isHi && rev.role_hi ? rev.role_hi : rev.role} •{" "}
                            {isHi && rev.campusOrLocality_hi
                              ? rev.campusOrLocality_hi
                              : rev.campusOrLocality}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {rev.verified && (
                          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{rev.passId || (isHi ? "सत्यापित" : "Verified")}</span>
                          </div>
                        )}
                        <p className="text-[9px] text-zinc-500 mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: COMMUNITY IMPROVEMENT SUGGESTIONS & ROADMAP
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "suggestions" && (
          <div className="space-y-4">
            {/* Filter Pills & Suggest Idea Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12171B] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1 shrink-0 font-bold">
                  <Filter className="w-3 h-3" />
                  {isHi ? "श्रेणी:" : "Category:"}
                </span>
                {[
                  { key: "all", label: isHi ? "सभी सुझाव" : "All" },
                  { key: "app", label: isHi ? "📱 ऐप व यूआई" : "📱 App" },
                  { key: "safety", label: isHi ? "🛡️ सुरक्षा" : "🛡️ Safety" },
                  { key: "pricing", label: isHi ? "💰 मूल्य" : "💰 Pricing" },
                  { key: "expansion", label: isHi ? "📍 विस्तार" : "📍 Expansion" },
                  { key: "kitchen", label: isHi ? "🍲 किचन" : "🍲 Kitchen" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setSuggestionFilter(f.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      suggestionFilter === f.key
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <span className="text-[11px] text-zinc-400 font-semibold">
                  {isHi ? `${filteredSuggestions.length} सुझाव` : `${filteredSuggestions.length} Ideas`}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowSuggestionForm((prev) => !prev)}
                  className={`text-xs px-3.5 py-1.5 h-8 font-bold cursor-pointer transition-all ${
                    showSuggestionForm
                      ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
                      : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 mr-1" />
                  <span>
                    {showSuggestionForm
                      ? isHi
                        ? "✕ फ़ॉर्म छुपाएं"
                        : "✕ Close Form"
                      : isHi
                        ? "💡 सुझाव दें"
                        : "💡 Propose Idea"}
                  </span>
                </Button>
              </div>
            </div>

            {/* EXPANDABLE INLINE SUGGESTIONS FORM */}
            <AnimatePresence>
              {showSuggestionForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121A22] via-[#10171D] to-[#0C1217] border border-cyan-500/40 shadow-xl relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                          <Lightbulb className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {isHi
                              ? "हम क्या सुधार कर सकते हैं? अपना सुझाव दें"
                              : "Tell Us: What Should We Improve Next?"}
                          </h3>
                          <p className="text-[11px] text-zinc-400">
                            {isHi
                              ? "नया फीचर, रूट या सुरक्षा आइडिया सीधे टीम को बताएं।"
                              : "Suggest new features, routes, IoT safety sensors, or pricing improvements."}
                          </p>
                        </div>
                      </div>

                      <div className="self-start sm:self-auto bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold text-cyan-300">
                        ⚡ {isHi ? "साप्ताहिक समीक्षा" : "Weekly Team Review"}
                      </div>
                    </div>

                    <form onSubmit={handleSuggestionSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "आइडिया की श्रेणी" : "Category"}
                          </label>
                          <select
                            value={sugCategory}
                            onChange={(e) => setSugCategory(e.target.value as any)}
                            className="w-full text-xs rounded-lg bg-[#172027] border border-white/15 p-2 text-white h-9 focus:outline-none focus:border-cyan-400"
                          >
                            <option value="app">
                              {isHi ? "📱 ऐप व यूआई" : "📱 App & UI Design"}
                            </option>
                            <option value="safety">
                              {isHi ? "🛡️ सुरक्षा व सेंसर" : "🛡️ Safety & Sensors"}
                            </option>
                            <option value="pricing">
                              {isHi ? "💰 मूल्य व बचत" : "💰 Pricing & Discounts"}
                            </option>
                            <option value="expansion">
                              {isHi ? "📍 नए शहर व कॉरिडोर" : "📍 City & Expansion"}
                            </option>
                            <option value="kitchen">
                              {isHi ? "🍲 किचन मेनू" : "🍲 Kitchen & Food"}
                            </option>
                            <option value="general">
                              {isHi ? "✨ अन्य सुधार" : "✨ Other Feature"}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "आपका नाम *" : "Your Name *"}
                          </label>
                          <Input
                            required
                            placeholder={isHi ? "जैसे: प्रिया शर्मा" : "e.g. Priya Sharma"}
                            value={sugName}
                            onChange={(e) => setSugName(e.target.value)}
                            className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                            {isHi ? "कॉलेज / इलाका" : "College / City"}
                          </label>
                          <Input
                            placeholder={
                              isHi ? "जैसे: HBTU Kanpur / Kakadeo" : "e.g. HBTU / Lucknow"
                            }
                            value={sugLocality}
                            onChange={(e) => setSugLocality(e.target.value)}
                            className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                          {isHi ? "सुझाव का शीर्षक (Title) *" : "Suggestion Title *"}
                        </label>
                        <Input
                          required
                          placeholder={
                            isHi
                              ? "जैसे: हॉस्टल से स्टेशन तक सीधा पिकअप वैन"
                              : "e.g. Direct Hostel-to-Station pickup shuttle during semester end"
                          }
                          value={sugTitle}
                          onChange={(e) => setSugTitle(e.target.value)}
                          className="bg-[#172027] border-white/15 text-xs text-white h-9 rounded-lg focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                          {isHi
                            ? "यह सुधार कैसे मदद करेगा? *"
                            : "How does this idea improve student or host experience? *"}
                        </label>
                        <Textarea
                          required
                          rows={2}
                          placeholder={
                            isHi
                              ? "बताएं कि इस सुधार से क्या लाभ होगा... (यह नीचे रोडमैप पर लाइव जुड़ जाएगा)"
                              : "Describe the problem and how this feature would solve it... (It will appear on the roadmap below)"
                          }
                          value={sugDescription}
                          onChange={(e) => setSugDescription(e.target.value)}
                          className="bg-[#172027] border-white/15 text-xs text-white rounded-lg resize-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
                          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isHi
                              ? "टॉप अपवोटेड सुझावों को अगले स्प्रिंट में शामिल किया जाता है"
                              : "Top voted community ideas are prioritized in sprint cycles"}
                          </span>
                        </div>

                        <Button
                          type="submit"
                          size="sm"
                          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold px-6 py-2 rounded-lg shadow-md shadow-cyan-500/20 cursor-pointer text-xs h-8"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          {isHi ? "सुझाव सबमिट करें" : "Submit Idea to Roadmap"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredSuggestions.map((sug) => {
                const statusMeta = getStatusBadge(sug.status);
                const hasVoted = upvotedIds.includes(sug.id);

                return (
                  <motion.div
                    key={sug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[#141A1F] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-cyan-500/5"
                  >
                    <div>
                      {/* Top Status & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusMeta.color}`}
                        >
                          {statusMeta.label}
                        </span>

                        <span className="text-[10px] font-bold text-zinc-400 bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
                          {sug.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                        {isHi && sug.title_hi ? sug.title_hi : sug.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {isHi && sug.description_hi ? sug.description_hi : sug.description}
                      </p>
                    </div>

                    {/* Author & Interactive Upvote Button */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="text-xs min-w-0">
                        <p className="font-bold text-zinc-300 truncate text-xs">
                          {isHi ? "प्रेषक:" : "By:"}{" "}
                          <span className="text-white">{sug.submittedBy}</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">{sug.locality}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleUpvote(sug.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer ${
                          hasVoted
                            ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30 scale-105"
                            : "bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
                        }`}
                        title={hasVoted ? "Click to remove vote" : "Click to upvote priority"}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-current" : ""}`} />
                        <span>{sug.upvotes}</span>
                        <span className="text-[9px] opacity-80 hidden sm:inline">
                          {hasVoted ? (isHi ? "वोटेड" : "Voted") : isHi ? "अपवोट" : "Upvote"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Founder Direct Escalation Banner */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121A20] via-[#162028] to-[#121A20] border border-white/12 flex flex-col md:flex-row items-center justify-between gap-3.5 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {isHi
                  ? "फाउंडर से सीधे व्हाट्सएप पर बात करना चाहते हैं?"
                  : "Want to share urgent suggestions directly with the founder?"}
              </h4>
              <p className="text-xs text-zinc-400">
                {isHi
                  ? `फाउंडर अद्विक ओमर को सीधे व्हाट्सएप मैसेज भेजें (${FOUNDER_PHONE_DISPLAY})`
                  : `Connect directly with founder Advik Omer on WhatsApp (${FOUNDER_PHONE_DISPLAY})`}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(
              isHi
                ? "नमस्ते अद्विक, मेरे पास StashSaarthi के लिए फीडबैक/सुधार का सुझाव है:"
                : "Hi Advik, I have feedback/improvement suggestions regarding StashSaarthi:",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-md shadow-emerald-500/25 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>{isHi ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
