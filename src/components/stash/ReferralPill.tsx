import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Copy, Check, Sparkles, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function ReferralPill({ userType = "student" }: { userType?: "student" | "host" }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [copied, setCopied] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const referralCode = `STASH-${user?.name ? user.name.slice(0, 4).toUpperCase() : "CAMPUS"}2026`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setShowSparkles(true);
    toast.success(isHi ? "रेफरल कोड कॉपी हो गया!" : "Referral Code Copied!", {
      description: isHi
        ? `₹300 स्टैशक्रेडिट अनलॉक करने के लिए दोस्तों के साथ कोड ${referralCode} साझा करें।`
        : `Share code ${referralCode} with friends to unlock ₹300 StashCredit.`,
      duration: 3500,
    });
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShowSparkles(false), 1500);
  };

  const handleWhatsAppShare = async () => {
    const isHost = userType === "host";
    const shareText = isHost
      ? isHi
        ? `नमस्ते! मैं StashSaarthi के साथ सत्यापित छात्रों को होस्ट करके ₹11,500+/माह कमा रहा/रही हूं। मेरे इनवाइट कोड ${referralCode} के साथ देखें: https://stashsaarthi-web.vercel.app`
        : `Namaste! I'm earning ₹11,500+/mo hosting verified students with StashSaarthi. Check it out using my invite code ${referralCode}: https://stashsaarthi-web.vercel.app`
      : isHi
        ? `अरे! StashSaarthi हमारे सेमेस्टर लगेज को कैंपस के पास मात्र ₹300/माह में सुरक्षित रख रहा है ताकि हमारा ₹8k खाली कमरे का किराया न जले! ₹300 फ्री स्टोरेज क्रेडिट के लिए मेरा इनवाइट कोड ${referralCode} उपयोग करें: https://stashsaarthi-web.vercel.app`
        : `Hey! StashSaarthi is storing our semester luggage for just ₹300/mo near campus so we don't burn ₹8k on empty room dead-rent! Use my invite code ${referralCode} for ₹300 free storage credit: https://stashsaarthi-web.vercel.app`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: isHi ? "स्टैशसारथी आमंत्रण" : "StashSaarthi Campus Invite",
          text: shareText,
          url: "https://stashsaarthi-web.vercel.app",
        });
        toast.success(isHi ? "आमंत्रण सफलतापूर्वक साझा किया गया!" : "Invite Shared Successfully!");
        return;
      } catch {
        // User dismissed sheet
      }
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`w-full rounded-2xl border ${userType === "host" ? "border-amber-500/30 bg-amber-950/20" : "border-emerald-500/30 bg-emerald-950/20"} p-4 backdrop-blur-md transition-all mt-4`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${userType === "host" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}
          >
            <Gift className="h-5 w-5" />
            <AnimatePresence>
              {showSparkles && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.2, y: -20 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute"
                >
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h4
              className={`text-sm font-semibold ${userType === "host" ? "text-amber-300" : "text-emerald-300"}`}
            >
              {userType === "host"
                ? isHi
                  ? "साथी होस्ट को रेफर करें"
                  : "Refer a Fellow Host"
                : isHi
                  ? "रेफर करें और 1 महीना मुफ्त पाएं"
                  : "Refer & Earn 1 Month FREE"}
            </h4>
            <p className="text-xs text-slate-400">
              {userType === "host"
                ? isHi
                  ? "पहले कमरे के ऑनबोर्ड होने पर ₹500 रेफरल बोनस पाएं।"
                  : "Earn ₹500 referral bonus on first room onboarded."
                : isHi
                  ? "₹300 स्टैशक्रेडिट पाने के लिए दोस्तों के साथ साझा करें।"
                  : "Share with hostel friends to unlock ₹300 StashCredit."}
            </p>
          </div>
        </div>

        {/* Right Side: Code, Copy & WhatsApp Share Buttons */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 bg-[#0A0D0F]/80 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-200">
              {referralCode}
            </span>
            <button
              type="button"
              onClick={copyToClipboard}
              className={`transition-colors p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${copied ? "text-emerald-400" : `text-slate-400 ${userType === "host" ? "hover:text-amber-400" : "hover:text-emerald-400"}`}`}
              title={isHi ? "कोड कॉपी करें" : "Copy Code"}
              aria-label={isHi ? "रेफरल कोड कॉपी करें" : "Copy referral code"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-3.5 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            title={isHi ? "व्हाट्सएप पर शेयर करें" : "Share via WhatsApp"}
            aria-label={
              isHi ? "व्हाट्सएप पर आमंत्रण शेयर करें" : "Share referral invite on WhatsApp"
            }
          >
            <Share2 className="h-4 w-4" />
            <span>{isHi ? "शेयर" : "Share"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
