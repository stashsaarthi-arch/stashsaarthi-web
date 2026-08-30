import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  isValidEmail,
  isValidIndianPhone,
  insertWaitlistUser,
  upsertGoogleUser,
  showNetworkRetryToast,
} from "@/lib/waitlistService";
import {
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Loader2,
  User,
  Phone,
  GraduationCap,
  ShieldCheck,
  Download,
  MessageCircle,
  Check,
  AlertCircle,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./AuthButton";
import { LegalDialog } from "./LegalDialog";
import { smoothScrollTo, handleDownloadInvestorMemo } from "./legal";
import { ReferralPill } from "./ReferralPill";
import { StashPass } from "./StashPass";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { InvestorModal } from "./InvestorModal";
import { CampusCaptainModal } from "./CampusCaptainModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

const CITIES = [
  "Kanpur",
  "Lucknow",
  "Delhi NCR",
  "Pune",
  "Varanasi",
  "Indore",
  "Jaipur",
  "Bhopal",
  "Nagpur",
];

const CITIES_HI = [
  "कानपुर",
  "लखनऊ",
  "दिल्ली एनसीआर",
  "पुणे",
  "वाराणसी",
  "इंदौर",
  "जयपुर",
  "भोपाल",
  "नागपुर",
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Twitter, label: "X (Twitter)" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export function FooterSection() {
  const { user, loginWithProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"student" | "host">("student");
  const [college, setCollege] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [doc, setDoc] = useState<string | null>(null);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});

  const isPhoneValid = phone.trim() ? isValidIndianPhone(phone) : false;
  const isEmailValid = email.trim() ? isValidEmail(email) : false;
  const isNameValid = fullName.trim().length >= 2;

  const ECOSYSTEM = [
    { label: isHi ? "सार्थी स्पेसेस (कमरे)" : "Saarthi Spaces", target: "ecosystem" },
    { label: isHi ? "सार्थी किचन (भोजन)" : "Saarthi Kitchen", target: "ecosystem" },
    { label: isHi ? "सार्थी स्टैश (स्टोरेज)" : "Saarthi Stash", target: "calculator" },
    { label: isHi ? "सार्थी कनेक्ट (मैचिंग)" : "Saarthi Connect", target: "connect" },
  ];

  const COMPANY = [
    { label: isHi ? "हमारे बारे में" : "About us", doc: "about" },
    { label: isHi ? "माइक्रो-अवसर" : "Micro-Opportunity", doc: "micro" },
    { label: isHi ? "हमारे साथ साझेदारी" : "Partner with us", doc: "partner" },
    { label: isHi ? "करियर" : "Careers", doc: "careers" },
  ];

  const LEGAL = [
    { label: isHi ? "सेवा की शर्तें" : "Terms of service", doc: "terms" },
    { label: isHi ? "गोपनीयता नीति (सरल भाषा)" : "Privacy policy (Plain English)", doc: "privacy" },
    { label: isHi ? "रद्दीकरण व उचित उपयोग नीति" : "Cancellation & Fair usage", doc: "refund" },
    {
      label: isHi ? "स्टोरेज सुरक्षा व ₹10k बीमा" : "Storage liability & ₹10k cover",
      doc: "liability",
    },
    { label: isHi ? "शिकायत व नोडल अधिकारी" : "Grievance & Nodal officer", doc: "grievance" },
  ];

  const handleGoogleWaitlist = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const data = await res.json();

        if (data.email) {
          setEmail(data.email);
          if (data.name && !fullName) {
            setFullName(data.name);
          }
          upsertGoogleUser({
            email: data.email,
            name: data.name || data.email.split("@")[0] || "User",
            picture: data.picture,
          });

          loginWithProfile({
            id: data.sub || data.email || "saarthi",
            name: data.name || data.email?.split("@")[0] || "Saarthi",
            email: data.email || "",
            avatar: data.picture || "",
            role: userType || "student",
            verified: !!data.email_verified,
          });
        }
      } catch (err) {
        toast.error(isHi ? "वेटलिस्ट प्रविष्टि विफल" : "Waitlist entry failed", {
          description: isHi ? "कृपया पुनः प्रयास करें।" : "Please try again.",
        });
      }
    },
    onError: (err) => {
      console.error("Google Auth Error:", err);
      toast.error(isHi ? "गूगल साइन-इन विफल रहा" : "Google sign-in failed");
    },
  });

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, phone: true });
    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error(isHi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name.");
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
    const result = await insertWaitlistUser({
      full_name: fullName.trim(),
      email: email.trim(),
      phone_number: phone.trim() || null,
      user_type: userType,
      college_or_locality: college.trim() || null,
    });

    if (result.success) {
      const generatedToken = `ST-${Math.floor(Math.random() * 90000) + 10000}`;
      setTokenId(generatedToken);
      setSubmitted(true);
      toast.success(
        isHi
          ? "🎉 आप प्राथमिकता सूची में शामिल हो गए हैं! हमने आपके स्टैशक्रेडिट सुरक्षित कर लिए हैं।"
          : "🎉 You're on the priority list! We've reserved your StashCredits.",
        {
          description: isHi
            ? "हमारी टीम 24 घंटे के भीतर संपर्क करेगी।"
            : "Our team will reach out within 24 hours.",
          duration: 6000,
        },
      );
    } else if (result.duplicate) {
      toast.error(isHi ? "यह ईमेल पहले से पंजीकृत है।" : "This email is already registered.", {
        description: isHi
          ? "आप पहले से ही वेटलिस्ट में हैं — हम जल्द ही संपर्क करेंगे!"
          : "You're already on the waitlist — we'll reach out soon!",
      });
    } else if (result.error === "network") {
      showNetworkRetryToast(handleSubmit);
    } else {
      toast.error(isHi ? "जानकारी सहेजने में असमर्थ" : "We couldn't save your details", {
        description: isHi
          ? "कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
          : "Please check your connection and try again in a moment.",
      });
    }

    setSubmitting(false);
  };

  return (
    <footer id="waitlist-form" className="relative mt-10 border-t border-white/10 scroll-mt-20">
      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-gradient">{t.footer.title}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t.footer.subtitle}</p>

        {submitted ? (
          <div className="mt-8 mb-6">
            <p className="text-lg font-bold text-emerald-400 mb-2">
              {isHi
                ? "🎉 आप प्राथमिकता सूची में शामिल हो गए हैं!"
                : "🎉 You're on the priority list!"}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {isHi
                ? "हमने आपके स्टैशक्रेडिट सुरक्षित कर लिए हैं। हमारी टीम 24 घंटे में संपर्क करेगी।"
                : "We've reserved your StashCredits. Our team will reach out within 24 hours."}
            </p>
            <StashPass tokenId={tokenId} name={fullName} type={userType} />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            className="glass mx-auto mt-9 max-w-md rounded-2xl p-5"
          >
            {/* User Type Toggle */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  userType === "student"
                    ? "border-cyan/50 bg-cyan/15 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25"
                }`}
              >
                🎓 {t.footer.student}
              </button>
              <button
                type="button"
                onClick={() => setUserType("host")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  userType === "host"
                    ? "border-amber/50 bg-amber/15 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25"
                }`}
              >
                🏠 {t.footer.host}
              </button>
            </div>

            <div className="space-y-3">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  disabled={submitting}
                  placeholder={t.footer.name}
                  className={`h-11 border-white/10 bg-white/5 pl-9 pr-8 focus-visible:ring-1 disabled:opacity-60 ${touched.name && !isNameValid ? "border-destructive/60" : touched.name && isNameValid ? "border-emerald-500/50" : ""}`}
                />
                {touched.name && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isNameValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  disabled={submitting}
                  placeholder={t.footer.email}
                  type="email"
                  className={`h-11 border-white/10 bg-white/5 pl-9 pr-8 focus-visible:ring-1 disabled:opacity-60 ${touched.email && !isEmailValid ? "border-destructive/60" : touched.email && isEmailValid ? "border-emerald-500/50" : ""}`}
                />
                {touched.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isEmailValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  disabled={submitting}
                  placeholder={t.footer.phone}
                  type="tel"
                  className={`h-11 border-white/10 bg-white/5 pl-9 pr-8 focus-visible:ring-1 disabled:opacity-60 ${touched.phone && !isPhoneValid && phone.trim() ? "border-destructive/60" : touched.phone && isPhoneValid ? "border-emerald-500/50" : ""}`}
                />
                {touched.phone && phone.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isPhoneValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>

              {/* College / Locality */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  disabled={submitting}
                  placeholder={
                    userType === "student"
                      ? isHi
                        ? "कॉलेज / परिसर (वैकल्पिक)"
                        : "College / Campus (Optional)"
                      : isHi
                        ? "इलाका / शहर (वैकल्पिक)"
                        : "Locality / City (Optional)"
                  }
                  className="h-11 border-white/10 bg-white/5 pl-9 focus-visible:ring-1 disabled:opacity-60"
                />
              </div>

              {/* TPA Waiver Checkbox for Hosts */}
              {userType === "host" && (
                <div className="flex items-start gap-2 text-left pt-1">
                  <input
                    type="checkbox"
                    id="waiver"
                    checked={waiverAccepted}
                    onChange={(e) => setWaiverAccepted(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="waiver"
                    className="text-[11px] text-muted-foreground leading-tight cursor-pointer"
                  >
                    {isHi ? (
                      <>
                        मैं स्वीकार करता/करती हूं कि यह संपत्ति अधिनियम (TPA 1882) की धारा 105 के
                        तहत वैध लाइसेंस समझौता है।
                      </>
                    ) : (
                      <>
                        I acknowledge the standard legal protection under Sec 105 Transfer of
                        Property Act 1882 for verified hosts.
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Referral Pill */}
            <div className="mt-3">
              <ReferralPill />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={userType === "host" ? "warm" : "hero"}
              size="lg"
              className="mt-4 w-full"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                  {isHi ? "सहेज रहा है…" : "Submitting…"}
                </span>
              ) : (
                t.footer.submit
              )}
            </Button>

            {/* Google Sign-in Alternative */}
            {!user && (
              <div className="mt-3">
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {isHi ? "या 1-क्लिक गूगल साइन-इन" : "or 1-click Google"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoogleWaitlist()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-foreground transition hover:bg-white/10 active:scale-[0.98] cursor-pointer"
                >
                  <GoogleGlyph />
                  <span>{isHi ? "गूगल से तुरंत जुड़ें" : "Quick join with Google"}</span>
                </button>
              </div>
            )}

            {/* Micro-Trust Note */}
            <p className="mt-3 text-[11px] text-muted-foreground">
              🔒{" "}
              {isHi
                ? "शून्य स्पैम। केवल आपके शहर में नोड्स लाइव होने पर अलर्ट।"
                : "Zero spam. Only alerts when nodes go live in your campus area."}
            </p>
          </form>
        )}
      </div>

      <div className="overflow-hidden border-y border-white/10 py-4">
        <div className="flex gap-10 whitespace-nowrap text-sm uppercase tracking-[0.24em] text-muted-foreground">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 animate-[marquee_28s_linear_infinite] gap-10">
              {(isHi ? CITIES_HI : CITIES).map((c) => (
                <span key={c} className="flex items-center gap-10">
                  {c} <span className="text-cyan">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <button
            type="button"
            className="flex items-center gap-2 shrink-0 cursor-pointer mb-4 group bg-transparent border-0 p-0 transition-transform active:scale-95 focus:outline-none rounded-lg"
            onClick={() => smoothScrollTo("top")(undefined as any)}
            aria-label="Scroll to top of page"
            title="StashSaarthi - Back to top"
          >
            <BrandLogo height={42} className="h-9 sm:h-10" />
          </button>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {isHi
              ? "भारत का हाइपर-लोकल लिविंग इकोसिस्टम — छात्र गतिशीलता को अंतर-पीढ़ी सामुदायिक समर्थन से जोड़ता है।"
              : "India's hyper-local living ecosystem — bridging student mobility with intergenerational community support."}
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://www.instagram.com/stashsaarthi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow StashSaarthi on Instagram"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all duration-300 group cursor-pointer"
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>

            <a
              href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(isHi ? "नमस्ते StashSaarthi टीम" : "Hi StashSaarthi Team")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with StashSaarthi on WhatsApp"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300 group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>

            {SOCIALS.filter((s) => s.label !== "Instagram").map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() =>
                  toast.info(
                    isHi ? "सोशल चैनल जल्द ही शुरू हो रहे हैं!" : "Social channels launching soon!",
                    {
                      description: isHi
                        ? `${label} पेज अगले शहर बैच के साथ लाइव होगा।`
                        : `Our ${label} page goes live with the next city batch.`,
                    },
                  )
                }
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>

          <div className="mt-4">
            <a
              href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(isHi ? "नमस्ते StashSaarthi टीम" : "Hi StashSaarthi Team")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {isHi
                ? `डायरेक्ट फाउंडर लाइन: ${FOUNDER_PHONE_DISPLAY}`
                : `Direct Founder Line: ${FOUNDER_PHONE_DISPLAY}`}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowInvestorModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-amber-500/40 hover:text-amber-400 cursor-pointer active:scale-95"
            >
              <Download className="h-3.5 w-3.5" /> {t.footer.investorCTA}
            </button>

            <button
              type="button"
              onClick={() => setShowCaptainModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/20 cursor-pointer active:scale-95"
            >
              <Award className="h-3.5 w-3.5" />{" "}
              {isHi ? "कैंपस कैप्टन (₹5,000+ कमाएं)" : "Campus Captain (Earn ₹5k+)"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold">{isHi ? "इकोसिस्टम" : "Ecosystem"}</h3>
          <ul className="mt-4 space-y-2.5">
            {ECOSYSTEM.map((l) => (
              <li key={l.label}>
                <a
                  href={`#${l.target}`}
                  onClick={smoothScrollTo(l.target)}
                  className="text-sm text-muted-foreground transition hover:text-cyan"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#rooms"
                onClick={smoothScrollTo("rooms")}
                className="text-sm text-muted-foreground transition hover:text-cyan"
              >
                {isHi ? "सत्यापित कमरे" : "Verified Rooms"}
              </a>
            </li>
          </ul>
        </div>

        <DocCol title={isHi ? "कंपनी" : "Company"} links={COMPANY} onOpen={setDoc} />
        <DocCol title={isHi ? "कानूनी" : "Legal"} links={LEGAL} onOpen={setDoc} />
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-muted-foreground space-y-1.5">
        <p>
          {isHi
            ? "© 2026 StashSaarthi Technologies. 100% प्रामाणिक पारदर्शिता के साथ कानपुर, उत्तर प्रदेश में निर्मित।"
            : "© 2026 StashSaarthi Technologies. Built with radical honesty & physical accountability in Kanpur, Uttar Pradesh, India."}
        </p>
        <p className="text-[11px] text-muted-foreground/80 font-mono">
          {isHi
            ? "नोडल परिचालन कार्यालय: 117/के-ब्लॉक, कल्याणपुर, कानपुर — 208016 | शिकायत निवारण: grievance@stashsaarthi.in"
            : "Operational Hub: 117/K-Block, Kalyanpur, Kanpur — 208016 | Grievance Officer: grievance@stashsaarthi.in"}
        </p>
      </div>

      <LegalDialog docKey={doc} onOpenChange={(v) => !v && setDoc(null)} />
      <InvestorModal open={showInvestorModal} onOpenChange={setShowInvestorModal} />
      <CampusCaptainModal open={showCaptainModal} onOpenChange={setShowCaptainModal} />
    </footer>
  );
}

function DocCol({
  title,
  links,
  onOpen,
}: {
  title: string;
  links: { label: string; doc: string }[];
  onOpen: (d: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <button
              type="button"
              onClick={() => onOpen(l.doc)}
              className="text-left text-sm text-muted-foreground transition hover:text-cyan cursor-pointer"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
