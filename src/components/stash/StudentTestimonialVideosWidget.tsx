import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Video,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Star,
  CheckCircle2,
  ChevronRight,
  FileText,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { playClick, playPop } from "@/lib/audio";

export interface TestimonialVideo {
  id: string;
  category: "spaces" | "stash";
  studentName: string;
  examOrCollege: string;
  location: string;
  hostOrRoomName: string;
  thumbnailGradient: string;
  duration: string;
  views: string;
  likes: number;
  rating: number;
  highlightQuoteHi: string;
  highlightQuoteEn: string;
  scriptHi: {
    hook: string;
    body: string;
    broll: string;
    cta: string;
  };
  scriptEn: {
    hook: string;
    body: string;
    broll: string;
    cta: string;
  };
}

const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  {
    id: "v1-spaces",
    category: "spaces",
    studentName: "Ananya Sharma",
    examOrCollege: "NEET Aspirant (Allen Kakadeo)",
    location: "Kakadeo Coaching Belt, Kanpur",
    hostOrRoomName: "Zero-Brokerage Single Room near PW Kakadeo",
    thumbnailGradient: "from-emerald-600 via-teal-700 to-slate-900",
    duration: "0:45",
    views: "14.2k",
    likes: 1240,
    rating: 5,
    highlightQuoteHi:
      "काकादेव में ब्रोकर ने ₹6,000 ब्रोकरेज मांगा, स्टैशसारथी से ₹0 ब्रोकरेज में सीधा कमरा मिला!",
    highlightQuoteEn:
      "Brokers in Kakadeo demanded ₹6,000 brokerage! StashSaarthi got me a room with ₹0 broker fee.",
    scriptHi: {
      hook: "क्या आप भी कानपुर काकादेव आकर ब्रोकर को ₹6,000 फालतू देने वाले थे?",
      body: "मैंने एलन के पास कमरा ढूंढने के लिए 3 दिन चक्कर काटे। ब्रोकर 1 महीने का किराया मांग रहे थे। फिर मुझे स्टैशसारथी मिला। 100% डायरेक्ट ओनर कमरा, 0% ब्रोकरेज और 5,500 में फर्निश्ड कमरा!",
      broll:
        "[दृश्य: काकादेव छपेड़ा पुलिया सड़क का क्लिप -> फोन पर स्टैशसारथी ऐप में रूम देखना -> कमरे की चाबी मिलना]",
      cta: "अभी bio लिंक पर क्लिक करें और बिना ब्रोकर के अपना छात्र कमरा बुक करें!",
    },
    scriptEn: {
      hook: "Were you about to pay a broker ₹6,000 extra in Kakadeo Kanpur?",
      body: "I spent 3 days hunting for rooms near Allen. Every broker wanted 1 month rent as fee. Then I found StashSaarthi. 100% verified direct host rooms with zero brokerage at ₹5,500/mo!",
      broll: "[Visual: Kakadeo Chhapeda Pulia street -> App browsing -> Room key handover]",
      cta: "Tap link in bio to book your zero-brokerage room today!",
    },
  },
  {
    id: "v2-stash",
    category: "stash",
    studentName: "Aarav Mishra",
    examOrCollege: "IIT Kanpur B.Tech 2nd Year",
    location: "Swaroop Nagar, Kanpur",
    hostOrRoomName: "Stored with Sudha Tripathi Ji (Verified Host Node)",
    thumbnailGradient: "from-emerald-600 via-teal-700 to-slate-900",
    duration: "0:58",
    views: "18.9k",
    likes: 1890,
    rating: 5,
    highlightQuoteHi:
      "महीने का केवल ₹300/बैग में सारा सामान सुरक्षित स्टोर हो गया, डेड रेंट की पूरी बचत!",
    highlightQuoteEn:
      "Stored all luggage at just ₹300/bag/mo with 100% security, saved 80% on dead rent!",
    scriptHi: {
      hook: "छुट्टियों में कमरे का पूरा किराया भरने से परेशान? देखिए सारथी स्टैश!",
      body: "मैं स्वरूप नगर में सुधा जी के सत्यापित होस्ट नोड पर अपना सामान रख कर गया। 2 महीने की छुट्टियों में कमरे का किराया देने की जगह केवल ₹600 में 2 बैग्स सुरक्षित रहे!",
      broll:
        "[दृश्य: बैग्स पर बारकोड लगाना -> सत्यापित होस्ट नोड में सुरक्षित स्टोरेज -> डिजिटल रसीद मिलना]",
      cta: "सारथी स्टैश पर अपना सामान आज ही सुरक्षित स्टोर करें!",
    },
    scriptEn: {
      hook: "Tired of paying dead room rent during vacations? Check out Saarthi Stash!",
      body: "I stashed my bags at Sudha Ji's verified host node in Swaroop Nagar. Instead of paying 2 months of empty room rent, I kept 2 bags safe for just ₹600!",
      broll: "[Visual: Luggage barcoding -> Safe storage room -> Digital receipt on app]",
      cta: "Book your verified campus micro-storage on Saarthi Stash!",
    },
  },
  {
    id: "v3-spaces",
    category: "spaces",
    studentName: "Rohan Verma",
    examOrCollege: "JEE Mains (Physics Wallah Kakadeo)",
    location: "Nankari Belt / CSJMU Gate #2",
    hostOrRoomName: "Dead-Rent Zero Micro-Storage",
    thumbnailGradient: "from-cyan-600 via-blue-700 to-slate-900",
    duration: "0:50",
    views: "11.5k",
    likes: 980,
    rating: 5,
    highlightQuoteHi:
      "2 महीने की गर्मी की छुट्टियों में ₹12,000 कमरे का किराया देने की जगह केवल ₹600 में सामान स्टोर किया!",
    highlightQuoteEn:
      "Instead of paying ₹12,000 dead rent during 2-month summer break, I stashed luggage for just ₹600!",
    scriptHi: {
      hook: "छुट्टियों में खाली कमरे का किराया (Dead-Rent) बचाना चाहते हैं?",
      body: "हर साल मई-जून में सब बच्चे घर जाते समय 2 महीने का पूरा किराया भरते थे। स्टैशसारथी नोड पर मैंने अपना ट्रंक और बैग ₹300/माह में सील कराया और ₹11,400 सीधे बचाए!",
      broll:
        "[दृश्य: बैग पर लेज़र बारकोड सील लगाना -> सीलबंद कस्टडी रसीद -> घर जाते हुए छात्र का स्माइल]",
      cta: "अपने हॉस्टल/कमरे का डेड-रेंट आज ही जीरो करें!",
    },
    scriptEn: {
      hook: "Want to eliminate dead vacation rent during summer break?",
      body: "Every year students wasted 2 full months rent while home for break. With StashSaarthi, I stashed my bags at ₹300/mo with tamper-proof seals and saved ₹11,400 cash!",
      broll:
        "[Visual: Barcode seal application -> Digital custody pass -> Happy student traveling home]",
      cta: "Zero your dead rent with StashSaarthi micro-storage!",
    },
  },
];

export const StudentTestimonialVideosWidget: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState<TestimonialVideo | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    playPop();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(isHi ? "प्रतिक्रिया दर्ज की गई! ❤️" : "Liked testimonial video! ❤️");
  };

  const openPlayer = (video: TestimonialVideo) => {
    playClick();
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" id="student-testimonials">
      {/* Header */}
      <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
        <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs font-bold py-1 px-3 uppercase tracking-widest inline-flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5" />
          {isHi ? "सत्यापित छात्र वीडियो अनुभव" : "Verified Student Video Reels"}
        </Badge>

        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          {isHi ? (
            <>
              सारथी स्पेस एवं कनेक्ट{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                छात्र टेस्टिमोनियल
              </span>
            </>
          ) : (
            <>
              Real Student Stories:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Saarthi Spaces & Connect
              </span>
            </>
          )}
        </h2>

        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          {isHi
            ? "कानपुर (काकादेव, IITK, CSJMU) के असली छात्रों द्वारा शूट की गई शॉर्ट-फॉर्म वीडियो रील्स। जानें कि उन्होंने ब्रोकरेज और डेड-रेंट कैसे बचाया।"
            : "Short-form video reels shot by real Kanpur students sharing zero-brokerage stays, dead-rent savings, and intergenerational host living."}
        </p>
      </div>

      {/* Video Cards Grid (9:16 Aspect Reel Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIAL_VIDEOS.map((video) => {
          const isLiked = !!likedIds[video.id];
          return (
            <div
              key={video.id}
              className="relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-2xl overflow-hidden group"
            >
              {/* Thumbnail Simulated Video Frame */}
              <div
                className={`relative aspect-[9/14] rounded-2xl bg-gradient-to-br ${video.thumbnailGradient} p-4 flex flex-col justify-between overflow-hidden shadow-inner cursor-pointer filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out`}
                onClick={() => openPlayer(video)}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 uppercase tracking-wider">
                    {video.category === "spaces" ? "🏠 Saarthi Spaces" : "🧳 Saarthi Stash"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                    VERIFIED
                  </span>
                </div>

                {/* Big Play Button overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 pl-0.5">
                    <Play className="w-6 h-6 fill-slate-950" />
                  </div>
                </div>

                {/* Bottom Quote Overlay */}
                <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                    <span>{video.studentName}</span>
                    <span>👁️ {video.views} views</span>
                  </div>
                  <p className="text-xs text-white font-semibold line-clamp-2 italic">
                    "{isHi ? video.highlightQuoteHi : video.highlightQuoteEn}"
                  </p>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{video.examOrCollege}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLike(video.id)}
                    className={`text-xs border-slate-700 font-semibold ${
                      isLiked
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 mr-1 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`}
                    />
                    {video.likes + (isLiked ? 1 : 0)}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playClick();
                      setShowScriptModal(video);
                    }}
                    className="text-xs border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-semibold hover:bg-emerald-900/40"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    {isHi ? "स्क्रिप्ट देखें 📜" : "View Script 📜"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Interactive Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative rounded-3xl bg-slate-900 border border-slate-700 max-w-sm w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">Student Video Reel Player</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Display */}
            <div
              className={`relative aspect-[9/16] bg-gradient-to-br ${activeVideo.thumbnailGradient} p-4 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between z-10">
                <Badge className="bg-black/60 text-white text-[10px]">
                  {activeVideo.studentName} • {activeVideo.location}
                </Badge>
                <Badge className="bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
                  VERIFIED REEL
                </Badge>
              </div>

              {/* Center Play/Pause controls */}
              <div className="flex items-center justify-center z-10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-2xl"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-slate-950" />
                  ) : (
                    <Play className="w-7 h-7 fill-slate-950 pl-1" />
                  )}
                </button>
              </div>

              {/* Bottom Script Overlay */}
              <div className="bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2 z-10">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Script Transcript:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{isHi ? activeVideo.scriptHi.body : activeVideo.scriptEn.body}"
                </p>
                <div className="pt-2">
                  <motion.button
                    onClick={() => {
                      setActiveVideo(null);
                      toast.success(
                        isHi
                          ? "स्टैशसारथी रूम्स पेज पर निर्देशित!"
                          : "Navigating to zero-brokerage rooms!",
                      );
                      const el = document.getElementById("solutions");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full relative overflow-hidden bg-emerald-600 text-white font-bold border border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-shadow duration-300 rounded-xl py-2 text-xs"
                  >
                    {isHi ? "ज़ीरो-ब्रोकरेज कमरा बुक करें" : "Book Zero Brokerage Room"}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Script Detail Modal for Content Coordinators */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                {isHi ? "छात्र टेस्टिमोनियल वीडियो स्क्रिप्ट" : "Student Reel Script Charter"}
              </h3>
              <button
                onClick={() => setShowScriptModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">
                  1. Video Hook (0:00 - 0:05)
                </span>
                <p className="text-white italic">
                  "{isHi ? showScriptModal.scriptHi.hook : showScriptModal.scriptEn.hook}"
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">
                  2. Core Body & Value Prop (0:05 - 0:30)
                </span>
                <p className="text-white">
                  "{isHi ? showScriptModal.scriptHi.body : showScriptModal.scriptEn.body}"
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">3. B-Roll Camera Cues</span>
                <p className="text-amber-200">
                  {isHi ? showScriptModal.scriptHi.broll : showScriptModal.scriptEn.broll}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">4. Call to Action (CTA)</span>
                <p className="text-emerald-200 font-bold">
                  {isHi ? showScriptModal.scriptHi.cta : showScriptModal.scriptEn.cta}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `HOOK: ${showScriptModal.scriptHi.hook}\nBODY: ${showScriptModal.scriptHi.body}\nCTA: ${showScriptModal.scriptHi.cta}`,
                  );
                  toast.success(
                    isHi ? "स्क्रिप्ट टेक्स्ट कॉपी हो गया!" : "Script copied to clipboard!",
                  );
                }}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs"
              >
                {isHi ? "स्क्रिप्ट कॉपी करें" : "Copy Script Text"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
