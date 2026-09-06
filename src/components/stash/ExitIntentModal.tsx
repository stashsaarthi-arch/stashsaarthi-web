import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Gift,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Tag,
  HeartHandshake,
  Percent,
  Zap,
} from "lucide-react";
import { usePersona } from "../../context/PersonaContext";
import { useLanguage } from "../../context/LanguageContext";
import { toast } from "../../context/ToastContext";

interface ExitIntentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClaimDiscount?: (code: string, service: string) => void;
}

export function ExitIntentModal({
  open: externalOpen,
  onOpenChange,
  onClaimDiscount,
}: ExitIntentModalProps) {
  const { role } = usePersona();
  const persona = role;
  const { language } = useLanguage();

  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(299); // 4m 59s
  const [hasDismissed, setHasDismissed] = useState(false);

  const isControlled = typeof externalOpen === "boolean";
  const isOpen = isControlled ? externalOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value);
      }
      if (!isControlled) {
        setInternalOpen(value);
      }
      if (!value) {
        try {
          sessionStorage.setItem("ss_exit_intent_dismissed", "true");
        } catch {
          // ignore
        }
        setHasDismissed(true);
      }
    },
    [isControlled, onOpenChange]
  );

  // Exit intent detection algorithm
  useEffect(() => {
    // Check if previously dismissed or claimed in this session
    try {
      const dismissed = sessionStorage.getItem("ss_exit_intent_dismissed");
      if (dismissed === "true") {
        setHasDismissed(true);
        return;
      }
    } catch {
      // ignore
    }

    let timeoutId: NodeJS.Timeout;

    // 1. Desktop mouse exit intent (mouse leaving viewport towards top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 12 && !hasDismissed && !isOpen) {
        setOpen(true);
      }
    };

    // 2. Custom window event trigger
    const handleCustomTrigger = () => {
      if (!isOpen) {
        setOpen(true);
      }
    };

    // 3. Mobile fallback: Trigger after 45s of active engagement if not interacted
    const handleMobileIdle = () => {
      if (window.innerWidth < 768 && !hasDismissed && !isOpen) {
        setOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("stashsaarthi:trigger-exit-intent", handleCustomTrigger);
    timeoutId = setTimeout(handleMobileIdle, 45000);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("stashsaarthi:trigger-exit-intent", handleCustomTrigger);
      clearTimeout(timeoutId);
    };
  }, [hasDismissed, isOpen, setOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isHindi = language === "hi";
  const promoCode = persona === "student" ? "STASH50" : "HOSTVIP";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast?.success(
      isHindi
        ? `प्रमो कोड ${promoCode} कॉपी हो गया!`
        : `Promo code ${promoCode} copied to clipboard!`
    );
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClaim = () => {
    handleCopyCode();
    setOpen(false);
    if (onClaimDiscount) {
      onClaimDiscount(promoCode, persona === "student" ? "stash" : "host");
    } else {
      // Trigger booking modal open event
      window.dispatchEvent(
        new CustomEvent("stashsaarthi:open-booking", {
          detail: { service: persona === "student" ? "stash" : "host", promoCode },
        })
      );
    }
  };

  const handleWhatsAppSupport = () => {
    const message =
      persona === "student"
        ? isHindi
          ? `नमस्ते Advik सर! मुझे StashSaarthi के लिए ₹50 डिस्काउंट (STASH50) ऑफर क्लेम करना है। कृपया मेरी बुकिंग में सहायता करें।`
          : `Hi Advik! I want to claim the ₹50 discount (STASH50) for StashSaarthi storage/rooms. Please assist with my booking.`
        : isHindi
        ? `नमस्ते Advik सर! मैं सीनियर होस्ट के रूप में 0% फीस ऑनबोर्डिंग (HOSTVIP) ऑफर के साथ जुड़ना चाहता/चाहती हूं।`
        : `Hi Advik! I would like to enroll as a Senior Host with the 0% platform fee priority onboarding (HOSTVIP).`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919369454350?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 ${
              persona === "student"
                ? "bg-slate-950/95 border-emerald-500/40 shadow-emerald-500/10 text-slate-100"
                : "bg-slate-950/95 border-amber-500/40 shadow-amber-500/10 text-slate-100"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
          >
            {/* Top Accent Gradient Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                persona === "student"
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                  : "bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500"
              }`}
            />

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={isHindi ? "बंद करें" : "Close dialog"}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Urgency Countdown */}
            <div className="flex items-center justify-between gap-3 mb-5 pr-8">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  persona === "student"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {persona === "student"
                  ? isHindi
                    ? "विशेष छात्र ऑफर"
                    : "Exclusive Student Offer"
                  : isHindi
                  ? "वीआईपी होस्ट ऑफर"
                  : "VIP Host Offer"}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Student Persona Content */}
            {persona === "student" ? (
              <>
                <h3
                  id="exit-intent-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-tight"
                >
                  {isHindi
                    ? "रुकीये! डेड-रेंट पर अपने पैसे व्यर्थ मत कीजिए 🎒"
                    : "Wait! Don't Leave Without Saving ₹50 on Your Vacation Stash 🎒"}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {isHindi
                    ? "छट्टियों के दौरान खाली कमरे का 100% किराया देने के बजाय केवल ₹250 में अपना सामान सुरक्षित रखें।"
                    : "Why pay thousands in dead-rent for an empty PG room during breaks? Lock in micro-storage or zero-brokerage rooms today with an instant discount."}
                </p>

                {/* Promo Code Highlight Box */}
                <div className="relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        {isHindi ? "विशेष डिस्काउंट कोड" : "Instant Coupon Code"}
                      </div>
                      <div className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                        {promoCode}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {isHindi ? "कॉपी हुआ" : "Copied!"}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {isHindi ? "कोड कॉपी" : "Copy Code"}
                      </>
                    )}
                  </button>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "₹50 फ्लैट छूट आपके पहले महीने की बुकिंग पर लागू"
                        : "Flat ₹50 OFF applied instantly on your first booking"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "मुफ्त ₹10,000 माइक्रो-इंश्योरेंस और बारकोड सील शामिल"
                        : "Free ₹10,000 Micro-Insurance & Laser Tamper Seal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "24 घंटे में मुफ्त पिकअप एवं डोरस्टेप डिलीवरी Guarantee"
                        : "Zero Cancellation Fee & 100% Refund SLA Warranty"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleClaim}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    <Gift className="w-4 h-4" />
                    <span>
                      {isHindi
                        ? "₹50 छूट क्लेम करें और अभी बुक करें"
                        : "Claim ₹50 Discount & Book Now"}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    onClick={handleWhatsAppSupport}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isHindi
                        ? "संस्थापक अद्विक से सीधे WhatsApp पर बात करें"
                        : "Ask Founder Advik via Direct WhatsApp (+91 9369454350)"}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              /* Host Persona Content */
              <>
                <h3
                  id="exit-intent-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-tight"
                >
                  {isHindi
                    ? "जाने से पहले... अपने खाली स्पेस से ₹11,500/माह कमाएं 🏡"
                    : "Before You Go... Turn Unused Space into ₹11,500/Mo Income 🏡"}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {isHindi
                    ? "बिना किसी व्यवधान के अपने अतिरिक्त कमरे या जगह का उपयोग करके गरिमापूर्ण निष्क्रिय आय अर्जित करें।"
                    : "Dignified, 0-intrusion passive income for senior citizens in Kanpur. Keep 100% control over house rules while serving verified local students."}
                </p>

                {/* Promo Code Highlight Box */}
                <div className="relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        {isHindi ? "वीआईपी ऑनबोर्डिंग कोड" : "VIP Onboarding Pass"}
                      </div>
                      <div className="text-lg font-mono font-bold text-amber-400 tracking-wider">
                        {promoCode}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        {isHindi ? "कॉपी हुआ" : "Copied!"}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {isHindi ? "कोड कॉपी" : "Copy Pass"}
                      </>
                    )}
                  </button>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "6 महीने के लिए 0% प्लेटफॉर्म फीस लिस्टिंग गारंटी"
                        : "0% Platform Listing Fee Guarantee for 6 Months"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "आधार एवं पुलिस सत्यापन के साथ 100% सुरक्षित छात्र"
                        : "100% Verified Students with Aadhaar Biometrics & Emergency SOS"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {isHindi
                        ? "2 घंटे के भीतर प्राथमिकता संस्थापक ऑनबोर्डिंग कॉल"
                        : "Priority 1-on-1 Founder Audit & Onboarding Call"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleClaim}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    <Gift className="w-4 h-4" />
                    <span>
                      {isHindi
                        ? "0% फीस ऑनबोर्डिंग ऑफर पाएं"
                        : "Get Priority 0% Fee Host Onboarding"}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    onClick={handleWhatsAppSupport}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>
                      {isHindi
                        ? "संस्थापक अद्विक से WhatsApp पर पूछें"
                        : "Direct WhatsApp with Founder (+91 9369454350)"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Bottom Dismiss Link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-4 transition-colors"
              >
                {isHindi
                  ? "नहीं धन्यवाद, मैं बिना डिस्काउंट के आगे बढ़ूंगा"
                  : "No thanks, I'll pay full price later"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
