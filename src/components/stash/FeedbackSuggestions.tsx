import { useState } from "react";
import { motion } from "motion/react";
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Filter,
  Send,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  const [activeTab, setActiveTab] = useState<"feedback" | "suggestions">("feedback");

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

  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("stash_upvoted_suggestions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [suggestionFilter, setSuggestionFilter] = useState<string>("all");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Student");
  const [formLocality, setFormLocality] = useState("");
  const [formService, setFormService] = useState<"stash" | "spaces" | "kitchen" | "general">("stash");
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");

  const [sugTitle, setSugTitle] = useState("");
  const [sugCategory, setSugCategory] = useState<"app" | "pricing" | "safety" | "expansion" | "kitchen" | "general">(
    "app",
  );
  const [sugDescription, setSugDescription] = useState("");
  const [sugName, setSugName] = useState("");
  const [sugLocality, setSugLocality] = useState("");

  const handleToggleUpvote = (id: string) => {
    const hasVoted = upvotedIds.includes(id);
    let newUpvoted: string[];

    if (hasVoted) {
      newUpvoted = upvotedIds.filter((item) => item !== id);
      setSuggestions((prev) =>
        prev.map((sug) => (sug.id === id ? { ...sug, upvotes: Math.max(0, sug.upvotes - 1) } : sug)),
      );
      toast.info(isHi ? "वोट वापस लिया गया" : "Upvote removed");
    } else {
      newUpvoted = [...upvotedIds, id];
      setSuggestions((prev) =>
        prev.map((sug) => (sug.id === id ? { ...sug, upvotes: sug.upvotes + 1 } : sug)),
      );
      toast.success(isHi ? "वोट दर्ज हुआ! टीम प्राथमिकता देखेगी।" : "Upvote recorded! Team has noted this priority.");
    }

    setUpvotedIds(newUpvoted);
    try {
      localStorage.setItem("stash_upvoted_suggestions", JSON.stringify(newUpvoted));
    } catch {
      // ignore
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      toast.error(isHi ? "कृपया अपना नाम और समीक्षा विवरण भरें" : "Please fill your name and review details");
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      role: formRole,
      campusOrLocality: formLocality.trim() || "Kanpur Node",
      service: formService,
      rating: formRating,
      date: "Just now",
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
      isHi ? "प्रतिक्रिया सफलतापूर्वक दर्ज हुई!" : "Feedback submitted successfully!",
      {
        description: isHi
          ? "आपके अनुभव से पूरे छात्र व होस्ट समुदाय को मदद मिलेगी।"
          : "Your review helps the entire student & senior host community.",
      },
    );

    setReviewModalOpen(false);
    setFormName("");
    setFormLocality("");
    setFormTitle("");
    setFormComment("");
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugTitle.trim() || !sugDescription.trim() || !sugName.trim()) {
      toast.error(isHi ? "कृपया शीर्षक, विवरण और अपना नाम भरें" : "Please fill in title, description, and your name");
      return;
    }

    const newSug: SuggestionItem = {
      id: `sug-${Date.now()}`,
      title: sugTitle.trim(),
      description: sugDescription.trim(),
      category: sugCategory,
      submittedBy: sugName.trim(),
      locality: sugLocality.trim() || "Community Member",
      upvotes: 1,
      status: "under_review",
      createdAt: "Just now",
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
      isHi ? "सुझाव सफलतापूर्वक भेजा गया!" : "Suggestion submitted to Founder & Tech Team!",
      {
        description: isHi
          ? "हम हर हफ्ते कम्युनिटी रोडमैप पर टॉप वोटेड आइडियाज को लाइव करते हैं।"
          : "We review and implement top community-voted ideas every sprint cycle.",
      },
    );

    setSuggestionModalOpen(false);
    setSugTitle("");
    setSugDescription("");
    setSugName("");
    setSugLocality("");
  };

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
      className="relative py-16 sm:py-24 bg-[#0A0D0F] text-foreground overflow-hidden border-t border-white/[0.06]"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/5 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedContent distance={30} direction="vertical">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium backdrop-blur-md mb-4">
              <Sparkles className={`w-3.5 h-3.5 ${accentText}`} />
              <span className="text-zinc-300">
                {isHi ? "ओपन कम्युनिटी हब" : "Radical Community Transparency"}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isStudent ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              {isHi ? (
                <>
                  ग्राहक <span className={accentText}>प्रतिक्रिया</span> एवं सुधार के{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300">
                    सुझाव
                  </span>
                </>
              ) : (
                <>
                  Customer <span className={accentText}>Feedback</span> & Community{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300">
                    Suggestions
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {isHi
                ? "हमारा मानना है कि भारत का सर्वश्रेष्ठ इंटरजेनरेशनल और माइक्रो-स्टोरेज इकोसिस्टम छात्रों व बुजुर्गों के सच्चे फीडबैक और खुले सुझावों से ही बनेगा।"
                : "Real ratings from verified student storers & senior hosts, paired with an open feature suggestion board where top community ideas get built."}
            </p>

            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[#141A1F] border border-white/10 shadow-xl max-w-md w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "feedback"
                    ? `${isStudent ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25" : "bg-amber-500 text-black shadow-lg shadow-amber-500/25"}`
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Star className="w-4 h-4 fill-current" />
                <span>{isHi ? "प्रतिक्रिया व रेटिंग" : "Ratings & Reviews"}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-black/20 font-bold">
                  {reviews.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("suggestions")}
                id="suggestions"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "suggestions"
                    ? `${isStudent ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25" : "bg-amber-500 text-black shadow-lg shadow-amber-500/25"}`
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>{isHi ? "सुधार के सुझाव" : "Feature Suggestions"}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-black/20 font-bold">
                  {suggestions.length}
                </span>
              </button>
            </div>
          </div>
        </AnimatedContent>

        {activeTab === "feedback" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#12171B]/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-2 shrink-0 font-medium">
                  <Filter className="w-3.5 h-3.5" />
                  {isHi ? "फ़िल्टर:" : "Filter:"}
                </span>
                {[
                  { key: "all", label: isHi ? "सभी समीक्षाएं" : "All Reviews" },
                  { key: "stash", label: isHi ? "📦 स्टैश स्टोरेज" : "📦 Storage" },
                  { key: "spaces", label: isHi ? "🏠 सीनियर लिविंग" : "🏠 Senior Living" },
                  { key: "kitchen", label: isHi ? "🍲 सारथी किचन" : "🍲 Kitchen" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setReviewFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      reviewFilter === f.key
                        ? `${accentBg} ${accentText} ${accentBorder} border shadow-sm font-semibold`
                        : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className={`cursor-pointer font-bold shadow-lg ${
                  isStudent
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/20"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/20"
                }`}
              >
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                {isHi ? "अपना अनुभव व रेटिंग लिखें" : "Write a Review / Give Feedback"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#151C22]/90 to-[#0F1418]/90 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-zinc-700 text-zinc-700"
                              }`}
                            />
                          ))}
                          <span className="ml-1.5 text-xs font-bold text-amber-400">
                            {rev.rating}.0
                          </span>
                        </div>

                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-zinc-300">
                          {serviceLabel}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        "{isHi && rev.title_hi ? rev.title_hi : rev.title}"
                      </h4>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                        {isHi && rev.comment_hi ? rev.comment_hi : rev.comment}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
                          {rev.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {isHi && rev.name_hi ? rev.name_hi : rev.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {isHi && rev.role_hi ? rev.role_hi : rev.role} •{" "}
                            {isHi && rev.campusOrLocality_hi
                              ? rev.campusOrLocality_hi
                              : rev.campusOrLocality}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {rev.verified && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{rev.passId || (isHi ? "सत्यापित" : "Verified")}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-zinc-500 mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#12171B]/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-2 shrink-0 font-medium">
                  <Filter className="w-3.5 h-3.5" />
                  {isHi ? "कैटेगरी:" : "Category:"}
                </span>
                {[
                  { key: "all", label: isHi ? "सभी सुझाव" : "All Suggestions" },
                  { key: "app", label: isHi ? "📱 ऐप व यूआई" : "📱 App & UI" },
                  { key: "safety", label: isHi ? "🛡️ सुरक्षा व सेंसर" : "🛡️ Safety" },
                  { key: "pricing", label: isHi ? "💰 मूल्य व बचत" : "💰 Pricing" },
                  { key: "expansion", label: isHi ? "📍 नए शहर/कैंपस" : "📍 Cities" },
                  { key: "kitchen", label: isHi ? "🍲 किचन डाइट" : "🍲 Kitchen" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setSuggestionFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      suggestionFilter === f.key
                        ? `${accentBg} ${accentText} ${accentBorder} border shadow-sm font-semibold`
                        : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => setSuggestionModalOpen(true)}
                className={`cursor-pointer font-bold shadow-lg ${
                  isStudent
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-emerald-500/20"
                    : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-amber-500/20"
                }`}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {isHi ? "नया सुझाव / आइडिया भेजें" : "Submit Improvement Idea"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {filteredSuggestions.map((sug) => {
                const statusMeta = getStatusBadge(sug.status);
                const hasVoted = upvotedIds.includes(sug.id);

                return (
                  <motion.div
                    key={sug.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#151C22]/90 to-[#0F1418]/90 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${statusMeta.color}`}
                        >
                          {statusMeta.label}
                        </span>

                        <span className="text-[11px] font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                          {sug.category.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {isHi && sug.title_hi ? sug.title_hi : sug.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                        {isHi && sug.description_hi ? sug.description_hi : sug.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                      <div className="text-xs">
                        <p className="font-semibold text-zinc-300">
                          {isHi ? "सुझाव प्रेषक:" : "Proposed by:"}{" "}
                          <span className="text-white">{sug.submittedBy}</span>
                        </p>
                        <p className="text-[11px] text-zinc-500">{sug.locality}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleUpvote(sug.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          hasVoted
                            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-105"
                            : "bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
                        }`}
                        title={hasVoted ? "Click to remove vote" : "Click to upvote priority"}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-current" : ""}`} />
                        <span>{sug.upvotes}</span>
                        <span className="text-[10px] opacity-80 hidden sm:inline">
                          {hasVoted ? (isHi ? "वोटेड" : "Voted") : isHi ? "वोट दें" : "Upvote"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#121A20] via-[#162028] to-[#121A20] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {isHi ? "सीधे फाउंडर से बात करना चाहते हैं?" : "Want to share urgent direct feedback?"}
              </h4>
              <p className="text-xs text-zinc-400">
                {isHi
                  ? `व्हाट्सएप पर एडवाइज़र / फाउंडर को सीधा मैसेज भेजें (${FOUNDER_PHONE_DISPLAY})`
                  : `Connect directly with founder Advik Omer on WhatsApp (${FOUNDER_PHONE_DISPLAY})`}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(
              "Hi Advik, I have feedback/suggestions regarding StashSaarthi:",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{isHi ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}</span>
          </a>
        </div>
      </div>

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-lg bg-[#0E1317] border border-white/15 text-white p-6 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{isHi ? "अपना अनुभव व रेटिंग साझा करें" : "Rate Your Experience"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              {isHi
                ? "आपका प्रामाणिक फीडबैक अन्य छात्रों व बुजुर्ग परिवारों को सही निर्णय लेने में मदद करता है।"
                : "Your honest review helps fellow students and senior families find trusted living & storage."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-2">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-xs font-semibold text-zinc-300 mb-2">
                {isHi ? "समग्र अनुभव रेटिंग चुनें:" : "Select Overall Rating:"}
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (formHoverRating || formRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(null)}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          active
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "fill-zinc-700 text-zinc-700"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-amber-400 mt-1.5">
                {formRating === 5 && (isHi ? "⭐⭐⭐⭐⭐ असाधारण / 5-Star!" : "⭐⭐⭐⭐⭐ Exceptional / 5-Star!")}
                {formRating === 4 && (isHi ? "⭐⭐⭐⭐ बहुत अच्छा (Great)" : "⭐⭐⭐⭐ Great Experience")}
                {formRating === 3 && (isHi ? "⭐⭐⭐ अच्छा (Good)" : "⭐⭐⭐ Good / Satisfactory")}
                {formRating === 2 && (isHi ? "⭐⭐ सुधार की आवश्यकता" : "⭐⭐ Needs Improvement")}
                {formRating === 1 && (isHi ? "⭐ असंतोषजनक" : "⭐ Poor / Issues Faced")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "उपयोग की गई सेवा" : "Service Used"}
                </label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value as any)}
                  className="w-full text-xs rounded-xl bg-[#151C22] border border-white/10 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="stash">{isHi ? "📦 स्टैश स्टोरेज" : "📦 Vacation Stash"}</option>
                  <option value="spaces">{isHi ? "🏠 सीनियर लिविंग" : "🏠 Senior Living"}</option>
                  <option value="kitchen">{isHi ? "🍲 सारथी किचन" : "🍲 Home Tiffin"}</option>
                  <option value="general">{isHi ? "✨ सामान्य प्लेटफॉर्म" : "✨ General"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "आपकी भूमिका" : "Your Role"}
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full text-xs rounded-xl bg-[#151C22] border border-white/10 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Student">{isHi ? "छात्र / Student" : "Student"}</option>
                  <option value="Senior Host">{isHi ? "सीनियर होस्ट / Senior Host" : "Senior Host"}</option>
                  <option value="Parent">{isHi ? "अभिभावक / Parent" : "Parent"}</option>
                  <option value="Partner">{isHi ? "नोड पार्टनर / Partner" : "Node Partner"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "आपका नाम *" : "Your Name *"}
                </label>
                <Input
                  required
                  placeholder={isHi ? "जैसे: अमन वर्मा" : "e.g. Aman Verma"}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="bg-[#151C22] border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "कॉलेज / इलाका" : "College / Locality"}
                </label>
                <Input
                  placeholder={isHi ? "जैसे: IIT Kanpur / Kalyanpur" : "e.g. IIT Kanpur / Kakadeo"}
                  value={formLocality}
                  onChange={(e) => setFormLocality(e.target.value)}
                  className="bg-[#151C22] border-white/10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                {isHi ? "समीक्षा का शीर्षक" : "Review Headline"}
              </label>
              <Input
                placeholder={isHi ? "जैसे: समय पर डिलीवरी और बहुत सुरक्षित!" : "e.g. On-time delivery and zero damage!"}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="bg-[#151C22] border-white/10 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                {isHi ? "विस्तृत अनुभव व सुझाव *" : "Your Detailed Experience *"}
              </label>
              <Textarea
                required
                rows={3}
                placeholder={
                  isHi
                    ? "बताएं कि स्टोरेज, रहने या खाने का आपका अनुभव कैसा रहा..."
                    : "Share how the storage, room living, or meals worked for you..."
                }
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="bg-[#151C22] border-white/10 text-xs resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              {isHi ? "समीक्षा सबमिट करें" : "Submit Feedback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={suggestionModalOpen} onOpenChange={setSuggestionModalOpen}>
        <DialogContent className="max-w-lg bg-[#0E1317] border border-white/15 text-white p-6 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span>{isHi ? "नया सुधार / आइडिया सबमिट करें" : "Submit an Improvement Idea"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              {isHi
                ? "क्या आपके पास कोई नया फीचर, सुरक्षा या बचत का आइडिया है? हमारे टेक व ऑपरेशन्स टीम सीधे इसे रोडमैप में शामिल करेगी।"
                : "Have an idea to improve UI, pricing, safety, or new college routes? Our founding team reviews community submissions weekly."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSuggestionSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                {isHi ? "आइडिया की श्रेणी" : "Idea Category"}
              </label>
              <select
                value={sugCategory}
                onChange={(e) => setSugCategory(e.target.value as any)}
                className="w-full text-xs rounded-xl bg-[#151C22] border border-white/10 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="app">{isHi ? "📱 ऐप व वेबसाइट यूआई (App & UI)" : "📱 App & UI"}</option>
                <option value="safety">{isHi ? "🛡️ सुरक्षा, सेंसर व सील (Safety & IoT)" : "🛡️ Safety & Seals"}</option>
                <option value="pricing">{isHi ? "💰 मूल्य, बिलिंग व बचत (Pricing & Billing)" : "💰 Pricing & Discounts"}</option>
                <option value="expansion">{isHi ? "📍 नए शहर व कॉलेज कॉरिडोर (City Expansion)" : "📍 New City / Campus"}</option>
                <option value="kitchen">{isHi ? "🍲 सारथी किचन डाइट व मेनू (Kitchen Menu)" : "🍲 Kitchen & Food"}</option>
                <option value="general">{isHi ? "✨ अन्य सामान्य सुझाव (General)" : "✨ Other Improvement"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                {isHi ? "सुझाव का शीर्षक *" : "Suggestion Title *"}
              </label>
              <Input
                required
                placeholder={isHi ? "जैसे: हॉस्टल से स्टेशन तक सीधा पिकअप वैन" : "e.g. Direct Hostel-to-Station pickup shuttle"}
                value={sugTitle}
                onChange={(e) => setSugTitle(e.target.value)}
                className="bg-[#151C22] border-white/10 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                {isHi ? "आइडिया का विवरण व यह कैसे मदद करेगा? *" : "How does this idea help students or senior hosts? *"}
              </label>
              <Textarea
                required
                rows={3}
                placeholder={
                  isHi
                    ? "बताएं कि इस फीचर से क्या लाभ होगा और इसे कैसे लागू किया जा सकता है..."
                    : "Describe what problem this solves and how it would improve the experience..."
                }
                value={sugDescription}
                onChange={(e) => setSugDescription(e.target.value)}
                className="bg-[#151C22] border-white/10 text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "आपका नाम *" : "Your Name *"}
                </label>
                <Input
                  required
                  placeholder={isHi ? "जैसे: प्रिया शर्मा" : "e.g. Priya Sharma"}
                  value={sugName}
                  onChange={(e) => setSugName(e.target.value)}
                  className="bg-[#151C22] border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {isHi ? "कॉलेज / इलाका" : "College / Locality"}
                </label>
                <Input
                  placeholder={isHi ? "जैसे: HBTU Kanpur" : "e.g. HBTU Kanpur"}
                  value={sugLocality}
                  onChange={(e) => setSugLocality(e.target.value)}
                  className="bg-[#151C22] border-white/10 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              {isHi ? "आइडिया रोडमैप में भेजें" : "Submit to Community Roadmap"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
