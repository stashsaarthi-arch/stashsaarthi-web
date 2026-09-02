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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { APP_BASE_URL } from "@/lib/constants";

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

  // Pre-crafted high-converting referral messages
  const messages: Record<
    "student" | "host" | "food",
    { en: string; hi: string; titleEn: string; titleHi: string; icon: any }
  > = {
    student: {
      icon: GraduationCap,
      titleEn: "Share with College & Hostel Friends",
      titleHi: "कॉलेज व हॉस्टल मित्रों के साथ शेयर करें",
      en: `🎒 *StashSaarthi — Campus Vacation Luggage Storage & Living*\n\nHey! Check this out before vacation starts — instead of burning ₹6,000–₹8,000 in dead rent for empty PG rooms, you can store your luggage securely for just *₹300/bag/mo* with laser tamper seals & ₹10k insurance near campus.\n\nAlso get verified 0% brokerage rooms & homemade tiffins!\n\n👉 *Check it out here:* ${APP_BASE_URL}`,
      hi: `🎒 *स्टैशसारथी — कैंपस वैकेशन लगेज स्टोरेज व आवास*\n\nअरे! छुट्टियों से पहले इसे देखें — खाली पीजी रूम के ₹6,000–₹8,000 डेड-रेंट में फूंकने के बजाय, अपना सामान कैंपस के पास मात्र *₹300/बैग/माह* में लेजर सील और ₹10k बीमा के साथ सुरक्षित रखें।\n\nसाथ ही शून्य ब्रोकरेज वाले कमरे और घर का शुद्ध भोजन भी उपलब्ध है!\n\n👉 *यहाँ देखें:* ${APP_BASE_URL}`,
    },
    host: {
      icon: Home,
      titleEn: "Share with Senior Hosts & Neighborhood",
      titleHi: "सीनियर होस्ट्स व पड़ोसियों के साथ शेयर करें",
      en: `🏡 *StashSaarthi — Senior Host Dignified Earnings*\n\nNamaste! If you or someone in your family has a spare corner or room in Kanpur, you can earn *₹11,500+/month* by hosting verified university students with 100% control over house norms, zero intrusion, and ₹10k damage cover.\n\n👉 *Explore hosting details here:* ${APP_BASE_URL}`,
      hi: `🏡 *स्टैशसारथी — सीनियर होस्ट सम्मानजनक आय*\n\nनमस्ते! यदि आपके पास कानपुर में कोई खाली कोना या कमरा है, तो आप सत्यापित छात्रों को होस्ट करके *₹11,500+/माह* तक की गरिमापूर्ण आय अर्जित कर सकते हैं। पूर्ण सुरक्षा व ₹10k कवर के साथ।\n\n👉 *विस्तार से यहाँ देखें:* ${APP_BASE_URL}`,
    },
    food: {
      icon: Utensils,
      titleEn: "Share Ghar Ka Swaad (Home Tiffins)",
      titleHi: "घर का स्वाद (होम टिफिन) शेयर करें",
      en: `🍲 *Ghar Ka Swaad by StashSaarthi*\n\nMiss home food in Kanpur? Get pure, hygienic homemade tiffins cooked by verified neighborhood grandmothers starting at just *50 Tokens/meal* (1 Token = ₹1) with zero preservatives.\n\n👉 *View daily menu & plans:* ${APP_BASE_URL}`,
      hi: `🍲 *घर का स्वाद — शुद्ध होम टिफिन*\n\nकानपुर में घर के खाने की याद आ रही है? मोहल्ले की बुजुर्ग माताओं द्वारा तैयार शुद्ध, स्वच्छ घर का खाना मात्र *50 टोकन/भोजन* से शुरू।\n\n👉 *मेन्यू व प्लान यहाँ देखें:* ${APP_BASE_URL}`,
    },
  };

  const currentMessage = messages[shareType][isHi ? "hi" : "en"];

  const handleSendWhatsApp = async () => {
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
