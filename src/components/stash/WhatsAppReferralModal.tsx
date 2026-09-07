import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  MessageCircle,
  Copy,
  Check,
  X,
  Sparkles,
  GraduationCap,
  Home,
  Utensils,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { APP_BASE_URL } from "@/lib/constants";
import { checkAndRecordTokenRateLimit } from "@/lib/tokenRateLimiter";

export interface WhatsAppReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppReferralModal({ open, onOpenChange }: WhatsAppReferralModalProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";

  const [shareType, setShareType] = useState<"student" | "host" | "food">(
    role === "host" ? "host" : "student",
  );
  const [copied, setCopied] = useState(false);

  // Pre-crafted high-converting referral messages optimized for maximum CTR
  const messages: Record<
    "student" | "host" | "food",
    { en: string; hi: string; titleEn: string; titleHi: string; icon: LucideIcon }
  > = {
    student: {
      icon: GraduationCap,
      titleEn: "Share with College & Hostel Friends",
      titleHi: "कॉलेज व हॉस्टल मित्रों के साथ शेयर करें",
      en: `🚨 *DON'T BURN ₹8,000 DEAD-RENT THIS VACATION!* 🚨\n\nHey! Check this out before leaving campus for holidays — instead of paying full PG rent for an empty room, store your luggage near campus for just *₹300/bag/month*!\n\n🔒 *What you get:*\n• Laser Tamper Barcode Seals (#SS-8921)\n• ₹10,000 Micro-Insurance Protection\n• Verified 0% Brokerage Rooms & Home Tiffins (₹50/meal)\n\n🎁 *Claim ₹300 Free Storage Credit with Code STASH2026:*\n👉 ${APP_BASE_URL}?ref=STASH2026`,
      hi: `🚨 *छुट्टियों में खाली रूम का ₹8,000 डेड-रेंट मत फूंको!* 🚨\n\nअरे दोस्त! घर जाने से पहले इसे देखो — खाली पीजी कमरे का पूरा किराया देने के बजाय, अपना सामान कैंपस के पास मात्र *₹300/बैग/माह* में स्टोर करो!\n\n🔒 *आपको क्या मिलेगा:*\n• लेजर बारकोड टेम्पर सील (#SS-8921)\n• ₹10,000 सुरक्षा माइक्रो-बीमा कवर\n• शून्य ब्रोकरेज वाले कमरे व होम टिफिन (₹50/भोजन)\n\n🎁 *कोड STASH2026 के साथ ₹300 फ्री स्टोरेज क्रेडिट पाएं:*\n👉 ${APP_BASE_URL}?ref=STASH2026`,
    },
    host: {
      icon: Home,
      titleEn: "Share with Senior Hosts & Neighborhood",
      titleHi: "सीनियर होस्ट्स व पड़ोसियों के साथ शेयर करें",
      en: `🏡 *EARN ₹11,500+/MONTH FROM YOUR SPARE SPACE IN KANPUR!* 🌟\n\nNamaste! If you or someone in your family has a spare room or clean corner, turn it into dignified passive income by hosting verified university students (IITK, HBTI, CSJMU).\n\n🛡️ *Host Protections:*\n• 100% Control over House Norms & Timings\n• Zero Intrusion & 100% Escrow Direct Bank Payouts\n• ₹10,000 Property Damage Safety Cover\n\n🎁 *Claim 0% Onboarding Fee & Calculate Income:*\n👉 ${APP_BASE_URL}?role=host&ref=HOST2026`,
      hi: `🏡 *कानपुर में अपने खाली कमरे से हर महीने ₹11,500+ कमाएं!* 🌟\n\nनमस्ते! यदि आपके घर में कोई खाली कमरा या कोना है, तो सत्यापित विश्वविद्यालय छात्रों (IITK, HBTI, CSJMU) को होस्ट करके सम्मानजनक आय अर्जित करें।\n\n🛡️ *होस्ट सुरक्षा गारंटियां:*\n• घर के नियमों व समय पर 100% आपका नियंत्रण\n• 0% लिस्टिंग शुल्क व 100% एस्क्रौ डायरेक्ट बैंक ट्रांसफर\n• ₹10,000 प्रॉपर्टी सुरक्षा कवर\n\n🎁 *0% ऑनबोर्डिंग शुल्क के साथ संभावित आय देखें:*\n👉 ${APP_BASE_URL}?role=host&ref=HOST2026`,
    },
    food: {
      icon: Utensils,
      titleEn: "Share Ghar Ka Swaad (Home Tiffins)",
      titleHi: "घर का स्वाद (होम टिफिन) शेयर करें",
      en: `🍲 *MISS HOMEMADE GHAR KA SWAAD IN KANPUR?* 😋\n\nStop eating oily mess food! Enjoy pure, hygienic tiffins cooked by neighborhood grandmothers (Nani Tiffins) starting at just *50 Tokens/meal* (₹50) with 0 preservatives.\n\n✨ *Highlights:*\n• 100% Pure Desi Ghee & Fresh Vegetables\n• Flexible Meal Subscription & Doorstep Delivery\n• Instant 1-Tap Pausing when going home\n\n🎁 *Get 1 FREE Trial Meal Token with Code TASTE50:*\n👉 ${APP_BASE_URL}?service=kitchen&ref=TASTE50`,
      hi: `🍲 *कानपुर में घर के बने शुद्ध खाने की याद आ रही है?* 😋\n\nमेस के तेलीय खाने से छुट्टी पाओ! मोहल्ले की बुजुर्ग माताओं (नानी टिफिन) द्वारा निर्मित शुद्ध घर का टिफिन पाएं मात्र *50 टोकन/भोजन* (₹50) से शुरू, शून्य प्रिजर्वेटिव्स।\n\n✨ *मुख्य विशेषताएं:*\n• 100% शुद्ध देसी घी व ताजी सब्ज़ियां\n• घर जाने पर 1-क्लिक भोजन पॉज़ की सुविधा\n• हॉस्टल/कमरे तक 0-वेट डिलीवरी\n\n🎁 *कोड TASTE50 से 1 फ्री ट्रायल मील टोकन पाएं:*\n👉 ${APP_BASE_URL}?service=kitchen&ref=TASTE50`,
    },
  };

  const currentMessage = messages[shareType][isHi ? "hi" : "en"];

  const handleSendWhatsApp = async () => {
    // Task 90 Compliance Token Rate Limit Check
    const rateCheck = checkAndRecordTokenRateLimit(`wa_referral_${shareType}`, "referral_token");
    if (!rateCheck.allowed) return;

    const encodedText = encodeURIComponent(currentMessage);
    const waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    // Try Web Share API if available on mobile
    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      /mobile|android|iphone/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({
          title: "StashSaarthi | Intergenerational Living & Micro-Storage",
          text: currentMessage,
          url: APP_BASE_URL,
        });
        toast.success(isHi ? "व्हाट्सएप पर शेयर हो गया!" : "Shared successfully!");
        return;
      } catch {
        // Fallback to WhatsApp URL
      }
    }

    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast.success(isHi ? "व्हाट्सएप खुल रहा है..." : "Opening WhatsApp...");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    toast.success(isHi ? "मैसेज व लिंक कॉपी हो गया!" : "Referral message & link copied!", {
      description: isHi
        ? "अब इसे किसी भी व्हाट्सएप चैट या ग्रुप में पेस्ट कर सकते हैं।"
        : "You can now paste it into any WhatsApp chat or group.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-[#0A0D0F] p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#25D366]/10 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-neutral-800 bg-neutral-900 text-muted-foreground hover:text-white transition-colors cursor-pointer"
            aria-label="Close referral modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="mb-5">
            <Badge
              variant="outline"
              className="border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] font-mono text-[10px] uppercase tracking-wider"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {isHi ? "⚡ सीधा व्हाट्सएप शेयर" : "⚡ DIRECT WHATSAPP REFERRAL"}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-2">
              {isHi ? "व्हाट्सएप पर डायरेक्ट रेफर करें" : "Refer & Share via WhatsApp"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {isHi
                ? "एक क्लिक में वेबसाइट का लिंक और तैयार मैसेज अपने व्हाट्सएप दोस्तों या हॉस्टल ग्रुप में भेजें।"
                : "Select a topic below to send a pre-composed message with the live website link directly to WhatsApp contacts or groups."}
            </p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-neutral-950 border border-neutral-800 mb-4">
            {(
              [
                {
                  id: "student",
                  label: isHi ? "छात्र स्टोरेज" : "Student Stash",
                  icon: GraduationCap,
                },
                { id: "host", label: isHi ? "सीनियर होस्ट" : "Senior Host", icon: Home },
                { id: "food", label: isHi ? "घर का खाना" : "Home Tiffin", icon: Utensils },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = shareType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShareType(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] sm:text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Preview Box */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-slate-300">
                {isHi ? "मैसेज पूर्वावलोकन (व्हाट्सएप पर जाएगा):" : "WhatsApp Message Preview:"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-[#25D366] hover:underline cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>
                  {copied
                    ? isHi
                      ? "कॉपी हुआ!"
                      : "Copied!"
                    : isHi
                      ? "टेक्स्ट कॉपी करें"
                      : "Copy Text"}
                </span>
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-xs font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line border-l-4 border-l-[#25D366]">
              {currentMessage}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <Button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm rounded-xl shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>{isHi ? "व्हाट्सएप पर डायरेक्ट भेजें" : "Send Directly on WhatsApp"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>
                {copied
                  ? isHi
                    ? "लिंक व मैसेज कॉपी हो गया!"
                    : "Link & Message Copied!"
                  : isHi
                    ? "लिंक व मैसेज कॉपी करें"
                    : "Copy Message & Link to Clipboard"}
              </span>
            </button>
          </div>

          {/* Footer Guarantee */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {isHi ? "100% फ्री एवं डायरेक्ट लिंक" : "Direct deep-link • No spam"}
            </span>
            <span className="font-mono text-[10px] text-neutral-500">{APP_BASE_URL}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
