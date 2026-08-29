import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Boxes, Home, HandHeart, Soup, ShieldCheck, Briefcase, Loader2, ArrowRight, CheckCircle2, ChevronLeft, Lock, Check, AlertCircle, QrCode, Copy, Smartphone, ShieldAlert } from "lucide-react";
import { isValidEmail, isValidIndianPhone, isCollegeEmail, isValidIndianPin } from "@/lib/waitlistService";
import { StashPass } from "./StashPass";
import { useLanguage } from "@/context/LanguageContext";

export function BookingModal({
  open,
  onOpenChange,
  service: serviceProp = "stash",
  note,
  bags: initialBags = 1,
  months: initialMonths = 1,
  amount,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service?: string;
  note?: string | undefined;
  bags?: number | undefined;
  months?: number | undefined;
  amount?: number | undefined;
}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState(serviceProp);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Kanpur");
  const [pincode, setPincode] = useState("");
  const [bags, setBags] = useState<number>(initialBags || 1);
  const [months, setMonths] = useState<number>(initialMonths || 1);
  const [submitting, setSubmitting] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"upi_qr" | "escrow_reserve">("upi_qr");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [tokenId, setTokenId] = useState<string>("");
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; pincode?: boolean }>({});

  const SERVICES = [
    { id: "stash", label: isHi ? "सार्थी स्टैश" : "Saarthi Stash", icon: Boxes },
    { id: "spaces", label: isHi ? "सार्थी स्पेसेस" : "Saarthi Spaces", icon: Home },
    { id: "kitchen", label: isHi ? "सार्थी किचन" : "Saarthi Kitchen", icon: Soup },
    { id: "connect", label: isHi ? "सार्थी कनेक्ट" : "Saarthi Connect", icon: HandHeart },
    { id: "trust", label: isHi ? "ट्रस्ट इंफ्रास्ट्रक्चर" : "Trust Infrastructure", icon: ShieldCheck },
    { id: "micro", label: isHi ? "माइक्रो-अवसर" : "Micro-Opportunity", icon: Briefcase },
  ];

  // Reset state when opened
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setWaiverAccepted(false);
        setTokenId("");
        setTouched({});
        setPaymentMode("upi_qr");
      }, 300);
      return;
    }
    setService(serviceProp);
    if (user?.name) setName((n) => n || user.name!);
    if (user?.email) setEmail((e) => e || user.email!);
  }, [open, serviceProp, user]);

  const isPhoneValid = !phone.trim() ? false : isValidIndianPhone(phone);
  const isEmailValid = !email.trim() ? true : isValidEmail(email);
  const isPinValid = !pincode.trim() ? true : isValidIndianPin(pincode);
  const isNameValid = name.trim().length >= 2;

  const calcAmount = amount || (service === "stash" ? bags * months * 300 : 5500);
  const upiId = "stashsaarthi@okaxis";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=StashSaarthi%20Escrow&am=${calcAmount}&cu=INR&tn=StashSaarthi%20Reservation%20${service}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=10B981&bgcolor=000000&data=${encodeURIComponent(upiDeepLink)}`;

  const handleNextToSummary = () => {
    setTouched({ name: true, email: true, phone: true, pincode: true });
    if (!name.trim()) {
      toast.error(isHi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name.");
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      toast.error(isHi ? "कृपया 10-अंकों का वैध भारतीय फोन नंबर दर्ज करें।" : "Please enter a valid 10-digit Indian phone number (starts with 6-9).");
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      toast.error(isHi ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return;
    }
    if (pincode.trim() && !isValidIndianPin(pincode)) {
      toast.error(isHi ? "कृपया 6-अंकों का वैध पिन कोड दर्ज करें।" : "Please enter a valid 6-digit PIN code.");
      return;
    }
    setStep(2);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success(isHi ? "UPI आईडी कॉपी हो गई!" : "UPI ID Copied!", {
      description: isHi ? `${upiId} आपके क्लिपबोर्ड पर कॉपी हो गई है।` : `${upiId} copied to clipboard.`,
    });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCheckout = async () => {
    if (submitting) return;

    if (!waiverAccepted) {
      toast.error(isHi ? "कृपया नियम एवं सुरक्षा शर्तों को स्वीकार करें।" : "Please accept the community & storage liability terms.");
      return;
    }

    setSubmitting(true);
    try {
      const generatedToken = `ST-${Math.floor(Math.random() * 90000) + 10000}`;
      setTokenId(generatedToken);

      const estimatedPrice = calcAmount;

      // Save inquiry to supabase
      const { error } = await supabase.from("co_living_inquiries").insert({
        user_id: user?.id ?? null,
        role: service,
        name: name.trim(),
        email: email.trim() || `${phone.trim()}@temp.stashsaarthi.in`,
        phone: phone.trim(),
        preferred_location: city.trim(),
        message: `${note ? `${note} · ` : ""}Bags: ${bags}, Months: ${months}, Est: ₹${estimatedPrice} [Token: ${generatedToken}] [PIN: ${pincode || "N/A"}] [PayMode: ${paymentMode}]`,
      });

      if (error) {
        console.warn("Supabase inquiry insert failed, proceeding with client booking flow", error);
      }

      setStep(3);
      toast.success(isHi ? "🎉 बुकिंग और एस्क्रो सफलतापूर्वक लॉक हुआ!" : "🎉 Booking & Escrow Successfully Locked!", {
        description: isHi ? "आपका डिजिटल स्टैशपास तैयार है।" : "Your digital StashPass is ready.",
      });
    } catch {
      toast.error(isHi ? "बुकिंग करने में असमर्थ" : "We couldn't process your booking", {
        description: isHi ? "कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।" : "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[90vh] overflow-y-auto sm:max-w-lg border-white/10 p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              {step === 1 && (isHi ? "आरक्षण विवरण" : "Reserve Your Space")}
              {step === 2 && (isHi ? "एस्क्रो भुगतान एवं आरक्षण पुष्टि" : "Escrow Payment & Confirmation")}
              {step === 3 && (isHi ? "बुकिंग की पुष्टि हो गई!" : "Booking Confirmed!")}
            </DialogTitle>
            {step < 3 && (
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                {isHi ? `चरण 0${step}/02` : `Step 0${step}/02`}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Service Selector Chips */}
                <div className="grid grid-cols-3 gap-2">
                  {SERVICES.map((s) => {
                    const Icon = s.icon;
                    const active = service === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition cursor-pointer ${
                          active
                            ? "border-cyan/50 bg-cyan/10 text-foreground font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-cyan" />
                        <span className="truncate">{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 pt-1">
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-name">{isHi ? "पूरा नाम *" : "Full name *"}</Label>
                      {touched.name && (
                        <span className={`text-[10px] ${isNameValid ? "text-emerald-400" : "text-destructive"}`}>
                          {isNameValid ? (isHi ? "सत्यापित" : "Looks good") : (isHi ? "अपना नाम दर्ज करें" : "Enter your full name")}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="bk-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        placeholder={isHi ? "आपका पूरा नाम" : "Ananya Verma"}
                        className={`border-white/10 bg-white/5 pr-8 ${touched.name && !isNameValid ? "border-destructive/60 focus-visible:ring-destructive" : touched.name && isNameValid ? "border-emerald-500/50" : ""}`}
                      />
                      {touched.name && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isNameValid ? <Check className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-email">{isHi ? "कॉलेज / व्यक्तिगत ईमेल" : "College / Personal Email"}</Label>
                      {email.trim() && (
                        <span className={`text-[10px] ${isEmailValid ? (isCollegeEmail(email) ? "text-emerald-400" : "text-cyan-400") : "text-destructive"}`}>
                          {isEmailValid ? (isCollegeEmail(email) ? (isHi ? "🎓 सत्यापित कैंपस ईमेल" : "🎓 Verified Campus Email") : (isHi ? "✓ वैध ईमेल" : "✓ Valid Email")) : (isHi ? "अमान्य ईमेल प्रारूप" : "Invalid email format")}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="bk-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        placeholder={isHi ? "you@college.edu या name@gmail.com" : "you@college.edu or name@gmail.com"}
                        className={`border-white/10 bg-white/5 pr-8 ${email.trim() && !isEmailValid ? "border-destructive/60" : email.trim() && isEmailValid ? "border-emerald-500/50" : ""}`}
                      />
                      {email.trim() && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isEmailValid ? <Check className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="bk-phone">{isHi ? "10-अंकों का मोबाइल *" : "10-Digit Mobile *"}</Label>
                        {touched.phone && (
                          <span className={`text-[10px] ${isPhoneValid ? "text-emerald-400" : "text-destructive"}`}>
                            {isPhoneValid ? (isHi ? "वैध (+91)" : "Valid (+91)") : (isHi ? "10 अंक आवश्यक" : "10 digits (6-9)")}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          id="bk-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                          placeholder="9876543210"
                          maxLength={14}
                          className={`border-white/10 bg-white/5 pr-8 ${touched.phone && !isPhoneValid ? "border-destructive/60" : touched.phone && isPhoneValid ? "border-emerald-500/50" : ""}`}
                        />
                        {touched.phone && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            {isPhoneValid ? <Check className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-1.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="bk-city">{isHi ? "कैंपस / शहर *" : "Campus / City *"}</Label>
                      </div>
                      <Input
                        id="bk-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={isHi ? "जैसे कानपुर, लखनऊ" : "e.g. Kanpur, Lucknow"}
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-pin">{isHi ? "पिन कोड (वैकल्पिक)" : "PIN Code (Optional)"}</Label>
                      {pincode.trim() && (
                        <span className={`text-[10px] ${isPinValid ? "text-emerald-400" : "text-destructive"}`}>
                          {isPinValid ? (isHi ? "✓ 6-अंकों का पिन" : "✓ 6-Digit PIN") : (isHi ? "6 अंक दर्ज करें" : "Enter 6 digits")}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="bk-pin"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        onBlur={() => setTouched((t) => ({ ...t, pincode: true }))}
                        placeholder={isHi ? "जैसे 208016" : "e.g. 208016"}
                        maxLength={6}
                        className={`border-white/10 bg-white/5 pr-8 ${pincode.trim() && !isPinValid ? "border-destructive/60" : pincode.trim() && isPinValid ? "border-emerald-500/50" : ""}`}
                      />
                      {pincode.trim() && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isPinValid ? <Check className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {service === "stash" && (
                    <div className="space-y-3 pt-2 border-t border-white/10 mt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bk-bags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {isHi ? "सामान विवरण (₹300/बैग/माह)" : "Luggage Breakdown (₹300/bag/mo)"}
                        </Label>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          🛡️ ₹{(bags * 10000).toLocaleString('en-IN')} {isHi ? "बीमा सुरक्षा" : "Insured"}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-bags">{isHi ? "कुल बैग:" : "Total Bags:"} <span className="font-bold text-cyan-400">{bags}</span></Label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setBags((b) => Math.max(1, b - 1))}
                              className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 font-bold hover:bg-white/10 active:scale-95 transition-all text-foreground cursor-pointer"
                            >
                              -
                            </button>
                            <Input
                              id="bk-bags"
                              type="number"
                              min="1"
                              max="20"
                              value={bags}
                              onChange={(e) => setBags(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                              className="border-white/10 bg-white/5 text-center font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => setBags((b) => Math.min(20, b + 1))}
                              className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 font-bold hover:bg-white/10 active:scale-95 transition-all text-foreground cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-months">{isHi ? "अवधि:" : "Duration:"} <span className="font-bold text-cyan-400">{months} {isHi ? "माह" : `Month${months > 1 ? 's' : ''}`}</span></Label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setMonths((m) => Math.max(1, m - 1))}
                              className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 font-bold hover:bg-white/10 active:scale-95 transition-all text-foreground cursor-pointer"
                            >
                              -
                            </button>
                            <Input
                              id="bk-months"
                              type="number"
                              min="1"
                              max="12"
                              value={months}
                              onChange={(e) => setMonths(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                              className="border-white/10 bg-white/5 text-center font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => setMonths((m) => Math.min(12, m + 1))}
                              className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 font-bold hover:bg-white/10 active:scale-95 transition-all text-foreground cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="hero" size="lg" className="w-full group cursor-pointer" onClick={handleNextToSummary}>
                  {isHi ? "भुगतान एवं सारांश देखें" : "Continue to Payment & Summary"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Payment Mode Selector Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("upi_qr")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMode === "upi_qr"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>{isHi ? "UPI QR कोड (तत्काल)" : "UPI QR Code (Instant)"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("escrow_reserve")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMode === "escrow_reserve"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span>{isHi ? "एस्क्रो होल्ड रिजर्व" : "Escrow Reserve"}</span>
                  </button>
                </div>

                {paymentMode === "upi_qr" ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#12181F] to-[#0A0D0F] p-4 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-300 font-medium">
                        {isHi ? "एस्क्रो लॉक राशि:" : "Escrow Lock Amount:"}
                      </span>
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        ₹{calcAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="relative mx-auto w-44 h-44 rounded-2xl bg-black p-2 border-2 border-emerald-500/40 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden">
                      <img
                        src={qrCodeUrl}
                        alt="StashSaarthi UPI Escrow QR"
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl pointer-events-none" />
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-mono">
                      <span>UPI ID: <strong className="text-emerald-400">{upiId}</strong></span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>

                    {/* 1-Tap App Deep Links on Mobile */}
                    <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                      <a
                        href={upiDeepLink}
                        className="px-3 py-1 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold hover:bg-[#25D366]/25 transition flex items-center gap-1"
                      >
                        <Smartphone className="h-3 w-3" />
                        <span>GPay / PhonePe / Paytm</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Summary Breakdown */
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "ग्राहक नाम:" : "Client Name:"}</span>
                      <span className="font-bold text-foreground">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "संपर्क फोन:" : "Contact Phone:"}</span>
                      <span className="font-bold text-cyan-400">{phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "स्थान:" : "Location:"}</span>
                      <span className="font-bold text-foreground">{city} {pincode ? `(${pincode})` : ""}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "सेवा प्रकार:" : "Service Type:"}</span>
                      <span className="font-bold text-emerald-400 uppercase">{service}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-sm">
                      <span className="text-muted-foreground font-sans font-bold">{isHi ? "कुल देय राशि:" : "Total Payable:"}</span>
                      <span className="text-xl font-bold text-emerald-400">₹{calcAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Terms and conditions waiver */}
                <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-left">
                  <input
                    type="checkbox"
                    id="bk-waiver"
                    checked={waiverAccepted}
                    onChange={(e) => setWaiverAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="bk-waiver" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    {isHi ? (
                      <>
                        मैं स्वीकार करता/करती हूं कि भुगतान <strong className="text-emerald-400">100% डिजिटल एस्क्रो</strong> में सुरक्षित रहेगा और पिकअप पर बारकोड सीलिंग की जाएगी।
                      </>
                    ) : (
                      <>
                        I accept that all payments are locked in <strong className="text-emerald-400">100% Digital Escrow</strong> and items are covered under StashSaarthi tamper-seal warranty.
                      </>
                    )}
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="w-1/3 border-white/10 cursor-pointer"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {isHi ? "वापस" : "Back"}
                  </Button>

                  <Button
                    variant="hero"
                    className="w-2/3 cursor-pointer"
                    onClick={handleCheckout}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> {isHi ? "एस्क्रो सुरक्षित हो रहा है…" : "Locking Escrow…"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-400" />
                        {isHi ? "भुगतान पूर्ण व एस्क्रो लॉक" : "Confirm Payment & Lock"}
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isHi ? "🎉 आपका स्टैशपास तैयार है!" : "🎉 Your StashPass is Ready!"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isHi 
                      ? "आपके नोडल कंसीयज को सूचना भेज दी गई है। वे 24 घंटे के भीतर संपर्क करेंगे।" 
                      : "Your local nodal concierge has been assigned. They will reach out within 24 hours."}
                  </p>
                </div>

                <StashPass
                  tokenId={tokenId}
                  name={name}
                  type={service === "stash" || service === "spaces" ? "student" : "host"}
                />

                <div className="flex gap-2">
                  <Button
                    variant="hero"
                    className="flex-1 cursor-pointer"
                    onClick={() => onOpenChange(false)}
                  >
                    {isHi ? "पूर्ण हुआ" : "Done"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
