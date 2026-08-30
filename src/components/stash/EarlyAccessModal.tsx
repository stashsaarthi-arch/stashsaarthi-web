import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Home,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  isValidEmail,
  isValidIndianPhone,
  insertWaitlistUser,
  showNetworkRetryToast,
} from "@/lib/waitlistService";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY, getWhatsAppUrl } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export function EarlyAccessModal({
  open,
  onOpenChange,
  initialRole = "student",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRole?: "student" | "host";
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [role, setRole] = useState<"student" | "host">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [campus, setCampus] = useState("");
  const [servicePref, setServicePref] = useState<string>("storage");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error(isHi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error(isHi ? "कृपया एक मान्य ईमेल दर्ज करें।" : "Please enter a valid email address.");
      return;
    }
    if (phone.trim() && !isValidIndianPhone(phone)) {
      toast.error(
        isHi
          ? "कृपया 10-अंकों का वैध भारतीय फोन नंबर दर्ज करें।"
          : "Please enter a valid 10-digit Indian phone number.",
      );
      return;
    }

    setSubmitting(true);
    const res = await insertWaitlistUser({
      full_name: fullName.trim(),
      email: email.trim(),
      phone_number: phone.trim() || null,
      user_type: role,
      college_or_locality: campus.trim() || `${servicePref.toUpperCase()} inquiry`,
    });

    if (res.success) {
      const generated = `SS-${role === "student" ? "STU" : "HST"}-${Math.floor(Math.random() * 90000) + 10000}`;
      setToken(generated);
      setSubmitted(true);
      toast.success(
        isHi
          ? "🎉 प्राथमिकता अर्ली एक्सेस सुरक्षित हो गया है!"
          : "🎉 Priority Early Access Reserved!",
        {
          description: isHi
            ? "हमारी कानपुर ऑन-ग्राउंड टीम 24 घंटे में संपर्क करेगी।"
            : "Our Kanpur ground crew will reach out within 24 hours.",
        },
      );
    } else if (res.duplicate) {
      const existingToken = `SS-${role === "student" ? "STU" : "HST"}-CONFIRMED`;
      setToken(existingToken);
      setSubmitted(true);
      toast.info(
        isHi
          ? "आप पहले से ही प्राथमिकता सूची में हैं!"
          : "You're already on the priority reservation list!",
      );
    } else if (res.error === "network") {
      showNetworkRetryToast(() => handleSubmit(e));
    } else {
      toast.error(
        isHi ? "जानकारी सहेजने में असमर्थ" : "Could not reserve access. Please try again.",
      );
    }
    setSubmitting(false);
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success(isHi ? "टोकन कॉपी हो गया!" : "Access token copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-[#0A0D0F] p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-neutral-800 bg-neutral-900 text-muted-foreground hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {!submitted ? (
            <div>
              <div className="mb-4">
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wider"
                >
                  {isHi ? "⚡ प्राथमिकता अर्ली एक्सेस" : "⚡ PRIORITY EARLY ACCESS • KANPUR V1.0"}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-2">
                  {isHi ? "अर्ली एक्सेस व लाइव डेमो बुक करें" : "Reserve Priority Access / Demo"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {isHi
                    ? "शून्य अग्रिम शुल्क। कानपुर के नोड्स में अपना स्थान सुरक्षित करें और ₹300 स्टोरेज या सत्यापित कमरों की जानकारी पाएं।"
                    : "Zero upfront commitment. Secure priority slots in Kanpur nodes and get direct founder onboarding."}
                </p>
              </div>

              {/* Role Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    role === "student"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{isHi ? "छात्र (स्टोरेज / कमरा)" : "Student Access"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("host")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    role === "host"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>{isHi ? "सीनियर होस्ट (जगह सूची)" : "Host a Space"}</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      role === "student"
                        ? isHi
                          ? "आपका पूरा नाम"
                          : "Full Name (e.g. Rahul Sharma)"
                        : isHi
                          ? "होस्ट का पूरा नाम"
                          : "Host Name (e.g. Smt. Sunita Verma)"
                    }
                    className="pl-10 h-11 rounded-xl border-neutral-800 bg-neutral-950 text-sm focus-visible:ring-emerald-500/50"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      isHi ? "ईमेल पता (उदा. name@iitk.ac.in)" : "Email (e.g. name@iitk.ac.in)"
                    }
                    className="pl-10 h-11 rounded-xl border-neutral-800 bg-neutral-950 text-sm focus-visible:ring-emerald-500/50"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={
                      isHi
                        ? "व्हाट्सएप / फोन नंबर (10 अंक)"
                        : "WhatsApp / Phone (10-digit Indian number)"
                    }
                    className="pl-10 h-11 rounded-xl border-neutral-800 bg-neutral-950 text-sm focus-visible:ring-emerald-500/50"
                  />
                </div>

                {/* Campus / Locality */}
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder={
                      role === "student"
                        ? isHi
                          ? "कैंपस / हॉस्टल (उदा. IIT Kanpur, CSJMU, Kakadeo)"
                          : "Campus / Area (e.g. IIT Kanpur Hall 13, Kakadeo)"
                        : isHi
                          ? "इलाका / कॉलोनी (उदा. कल्याणपुर, स्वरूप नगर)"
                          : "Locality / Colony (e.g. Kalyanpur, Swaroop Nagar)"
                    }
                    className="pl-10 h-11 rounded-xl border-neutral-800 bg-neutral-950 text-sm focus-visible:ring-emerald-500/50"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  variant={role === "host" ? "warm" : "hero"}
                  className="w-full h-11 mt-2 text-sm font-bold cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isHi ? "सुरक्षित हो रहा है…" : "Reserving Priority Slot…"}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>
                        {isHi ? "प्राथमिकता एक्सेस सुरक्षित करें" : "Claim Priority Access"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {/* Micro privacy guarantee */}
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  🔒{" "}
                  {isHi
                    ? "शून्य स्पैम। डेटा केवल ऑन-साइट सत्यापन के लिए उपयोग होता है।"
                    : "Zero spam guarantee. Encrypted data strictly for node verification."}
                </p>
              </form>
            </div>
          ) : (
            /* Confirmation Screen (Zero Screen Reload) */
            <div className="text-center py-2 space-y-4 font-mono">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground font-sans">
                  {isHi ? "🎉 अर्ली एक्सेस स्लॉट सुरक्षित!" : "🎉 Priority Access Reserved!"}
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-1 max-w-xs mx-auto">
                  {isHi
                    ? "आपका प्राथमिकता टोकन जनरेट हो गया है। हमारी कानपुर टीम 24 घंटे में संपर्क करेगी।"
                    : "Your serial priority pass has been minted in our active Kanpur registry."}
                </p>
              </div>

              {/* Priority Token Display */}
              <div className="rounded-2xl border border-emerald-500/30 bg-black/60 p-4 relative">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  SERIAL ACCESS PASS ID
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-wider">
                  {token}
                </div>
                <button
                  type="button"
                  onClick={copyToken}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copied ? "Copied!" : "Copy Pass ID"}</span>
                </button>
              </div>

              {/* Fast-Track WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={getWhatsAppUrl(
                    isHi
                      ? `नमस्ते Shivesh, मेरा अर्ली एक्सेस टोकन है: ${token}। कृपया मेरा स्लॉट सक्रिय करें।`
                      : `Hi Shivesh, my priority access token is ${token}. Please confirm my Kanpur slot.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer font-sans"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>
                    {isHi
                      ? "फाउंडर व्हाट्सएप पर तुरंत सक्रिय करें"
                      : "Fast-Track on WhatsApp with Founder"}
                  </span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer font-sans"
              >
                {isHi ? "बंद करें एवं पेज पर लौटें" : "Close and Return to Page"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
