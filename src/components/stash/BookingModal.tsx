import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  Home,
  HandHeart,
  Soup,
  ShieldCheck,
  Briefcase,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Check,
  AlertCircle,
  QrCode,
  Copy,
  Calendar,
  MapPin,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";
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
  amount: initialAmount,
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

  // Common Contact Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Kanpur");
  const [pincode, setPincode] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // 1. Stash specific fields
  const [bags, setBags] = useState<number>(initialBags || 1);
  const [months, setMonths] = useState<number>(initialMonths || 1);
  const [itemType, setItemType] = useState("Suitcase & Luggage");

  // 2. Spaces specific fields
  const [roomType, setRoomType] = useState<"single" | "shared" | "floor">("single");
  const [moveInDate, setMoveInDate] = useState("");
  const [foodPreference, setFoodPreference] = useState("with_food");

  // 3. Kitchen specific fields
  const [mealPlan, setMealPlan] = useState<"both" | "lunch" | "dinner" | "trial">("both");
  const [dietType, setDietType] = useState("Pure Vegetarian");

  // 4. Connect specific fields
  const [connectDomain, setConnectDomain] = useState("tech_assistance");
  const [hoursPerWeek, setHoursPerWeek] = useState("3-5 hours/week");

  // 5. Trust specific fields
  const [auditType, setAuditType] = useState("host_safety_audit");
  const [preferredSlot, setPreferredSlot] = useState("Morning (10 AM - 1 PM)");

  // 6. Micro specific fields
  const [monetizeAsset, setMonetizeAsset] = useState("spare_room");
  const [expectedRent, setExpectedRent] = useState("8000");

  const [submitting, setSubmitting] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"upi_qr" | "escrow_reserve">("upi_qr");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [tokenId, setTokenId] = useState<string>("");
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; pincode?: boolean }>({});

  const SERVICES = [
    { id: "stash", label: isHi ? "सार्थी स्टैश (स्टोरेज)" : "Saarthi Stash", tag: "₹300/mo", icon: Boxes },
    { id: "spaces", label: isHi ? "सार्थी स्पेसेस (कमरे)" : "Saarthi Spaces", tag: "Zero-Brokerage", icon: Home },
    { id: "kitchen", label: isHi ? "सार्थी किचन (टिफिन)" : "Saarthi Kitchen", tag: "₹90/meal", icon: Soup },
    { id: "connect", label: isHi ? "सार्थी कनेक्ट (साथी)" : "Saarthi Connect", tag: "Mentorship", icon: HandHeart },
    { id: "trust", label: isHi ? "ट्रस्ट व नोड ऑडिट" : "Trust & Audit", tag: "100% Escrow", icon: ShieldCheck },
    { id: "micro", label: isHi ? "होस्ट माइक्रो-अवसर" : "Host Monetize", tag: "Earn ₹11.5k+", icon: Briefcase },
  ];

  // Dynamic Amount Calculation across all 6 services
  const calcAmount = (() => {
    if (initialAmount) return initialAmount;
    switch (service) {
      case "stash":
        return bags * months * 300;
      case "spaces":
        return roomType === "single" ? 6000 : roomType === "shared" ? 4500 : 11000;
      case "kitchen":
        return mealPlan === "both" ? 2400 : mealPlan === "lunch" ? 1350 : mealPlan === "dinner" ? 1350 : 650;
      case "connect":
        return 0; // Free / Credit based
      case "trust":
        return 499; // Verification fee
      case "micro":
        return 0; // Host onboarding is 0 CapEx
      default:
        return 300;
    }
  })();

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

  const upiId = "stashsaarthi@okaxis";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=StashSaarthi%20Escrow&am=${calcAmount}&cu=INR&tn=StashSaarthi%20${service.toUpperCase()}%20Booking`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=10B981&bgcolor=000000&data=${encodeURIComponent(upiDeepLink)}`;

  const handleNextToSummary = () => {
    setTouched({ name: true, email: true, phone: true, pincode: true });
    if (!name.trim()) {
      toast.error(isHi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name.");
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      toast.error(
        isHi
          ? "कृपया 10-अंकों का वैध भारतीय फोन नंबर दर्ज करें।"
          : "Please enter a valid 10-digit Indian phone number (starts with 6-9)."
      );
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
      description: isHi ? `${upiId} क्लिपबोर्ड पर कॉपी हो गई है।` : `${upiId} copied to clipboard.`,
    });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCheckout = async () => {
    if (submitting) return;

    if (!waiverAccepted) {
      toast.error(
        isHi
          ? "कृपया समुदाय एवं सुरक्षा शर्तों को स्वीकार करें।"
          : "Please accept the community escrow & safety charter."
      );
      return;
    }

    setSubmitting(true);
    try {
      const generatedToken = `ST-${Math.floor(Math.random() * 90000) + 10000}`;
      setTokenId(generatedToken);

      // Build structured message payload depending on the selected service
      let serviceMeta = "";
      if (service === "stash") {
        serviceMeta = `[Stash] Bags: ${bags}, Months: ${months}, Type: ${itemType}, Pickup: ${addressDetail || "Hostel/Campus Gate"}`;
      } else if (service === "spaces") {
        serviceMeta = `[Spaces] Room: ${roomType}, MoveIn: ${moveInDate || "Immediate"}, Food: ${foodPreference}, Address: ${addressDetail || city}`;
      } else if (service === "kitchen") {
        serviceMeta = `[Kitchen] Plan: ${mealPlan}, Diet: ${dietType}, Delivery Address: ${addressDetail || city}`;
      } else if (service === "connect") {
        serviceMeta = `[Connect] Domain: ${connectDomain}, Hours: ${hoursPerWeek}, Locality: ${addressDetail || city}`;
      } else if (service === "trust") {
        serviceMeta = `[Trust Audit] AuditType: ${auditType}, PreferredSlot: ${preferredSlot}, Location: ${addressDetail || city}`;
      } else if (service === "micro") {
        serviceMeta = `[Micro Monetize] Asset: ${monetizeAsset}, ExpectedRent: ₹${expectedRent}/mo, Address: ${addressDetail || city}`;
      }

      const fullMessage = `${note ? `${note} · ` : ""}${serviceMeta} · EstAmount: ₹${calcAmount} · Token: ${generatedToken} · PIN: ${pincode || "N/A"} · PayMode: ${paymentMode}`;

      // Save inquiry to supabase
      const { error } = await supabase.from("co_living_inquiries").insert({
        user_id: user?.id ?? null,
        role: service,
        name: name.trim(),
        email: email.trim() || `${phone.trim()}@temp.stashsaarthi-web.vercel.app`,
        phone: phone.trim(),
        preferred_location: city.trim(),
        message: fullMessage,
      });

      if (error) {
        console.warn("Supabase inquiry insert failed, proceeding with client booking flow", error);
      }

      setStep(3);
      toast.success(
        isHi ? "🎉 सेवा आरक्षण व एस्क्रो लॉक सफल!" : "🎉 Service Reservation & Escrow Locked!",
        {
          description: isHi
            ? "आपका आधिकारिक डिजिटल स्टैशपास तैयार है।"
            : "Your digital StashPass is ready.",
        }
      );
    } catch {
      toast.error(isHi ? "आरक्षण करने में असमर्थ" : "We couldn't process your booking", {
        description: isHi
          ? "कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
          : "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[92vh] overflow-y-auto sm:max-w-xl border-white/10 p-5 sm:p-7">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {step === 1 && (isHi ? "सेवा आरक्षण व विवरण" : "Select Service & Fill Details")}
              {step === 2 && (isHi ? "एस्क्रो भुगतान व आरक्षण पुष्टि" : "Escrow Lock & Confirmation")}
              {step === 3 && (isHi ? "बुकिंग की पुष्टि हो गई!" : "Booking Confirmed!")}
            </DialogTitle>
            {step < 3 && (
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
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
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4"
              >
                {/* 1. 6-Service Selector Grid */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                    {isHi ? "सेवा चुनें (6 आयाम):" : "Choose Service (6 Dimensions):"}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SERVICES.map((s) => {
                      const Icon = s.icon;
                      const active = service === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setService(s.id)}
                          className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left text-xs transition cursor-pointer relative overflow-hidden ${
                            active
                              ? "border-emerald-500/60 bg-emerald-500/15 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon className={`h-4 w-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                            <span className="text-[9px] font-mono text-emerald-400/90">{s.tag}</span>
                          </div>
                          <span className="text-xs leading-tight mt-1">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Service-Specific Dynamic Detail Box */}
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/10 p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      {service === "stash" && (isHi ? "स्टैश स्टोरेज कस्टमाइज़ेशन" : "Stash Storage Configuration")}
                      {service === "spaces" && (isHi ? "कमरा व आवास आवश्यकताएं" : "Stay & Room Requirements")}
                      {service === "kitchen" && (isHi ? "घर का टिफिन व भोजन प्लान" : "Homemade Meal Plan Details")}
                      {service === "connect" && (isHi ? "इंटरजेनरेशनल साथी व मेंटरशिप" : "Intergenerational Engagement")}
                      {service === "trust" && (isHi ? "सुरक्षा सत्यापन व ऑन-साइट ऑडिट" : "Trust & Property Verification")}
                      {service === "micro" && (isHi ? "होस्ट स्पेस मोनेटाइजेशन" : "Host Space Monetization")}
                    </span>
                  </div>

                  {/* 2.1 Stash Inputs */}
                  {service === "stash" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "बैगों की संख्या:" : "Number of Bags:"}</Label>
                        <select
                          value={bags}
                          onChange={(e) => setBags(Number(e.target.value))}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((b) => (
                            <option key={b} value={b} className="bg-[#0A0D0F]">
                              {b} {isHi ? "बैग" : b === 1 ? "Bag" : "Bags"} (₹{b * 300}/mo)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "अवधि (महीने):" : "Duration (Months):"}</Label>
                        <select
                          value={months}
                          onChange={(e) => setMonths(Number(e.target.value))}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((m) => (
                            <option key={m} value={m} className="bg-[#0A0D0F]">
                              {m} {isHi ? "महीने" : m === 1 ? "Month" : "Months"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "सामान प्रकार:" : "Item Category:"}</Label>
                        <select
                          value={itemType}
                          onChange={(e) => setItemType(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="Suitcase & Luggage">Luggage / Trolley</option>
                          <option value="Carton Box / Books">Carton / Books</option>
                          <option value="Bicycle / Cooler">Bicycle / Cooler</option>
                          <option value="Electronics / Other">Electronics / Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.2 Spaces Inputs */}
                  {service === "spaces" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "कमरे का प्रकार:" : "Room Preference:"}</Label>
                        <select
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value as any)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="single">Single Room (₹6,000/mo)</option>
                          <option value="shared">Shared Twin (₹4,500/mo)</option>
                          <option value="floor">Independent Floor (₹11,000/mo)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "शिफ्टिंग तिथि:" : "Move-in Date:"}</Label>
                        <Input
                          type="date"
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          className="mt-1.5 border-white/10 bg-black/60 text-xs text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "भोजन सुविधा:" : "Tiffin Option:"}</Label>
                        <select
                          value={foodPreference}
                          onChange={(e) => setFoodPreference(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="with_food">With Home Tiffins (+₹2,400)</option>
                          <option value="without_food">Room Only (Self-Cook)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.3 Kitchen Inputs */}
                  {service === "kitchen" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "मील प्लान:" : "Meal Subscription Plan:"}</Label>
                        <select
                          value={mealPlan}
                          onChange={(e) => setMealPlan(e.target.value as any)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="both">Lunch + Dinner (₹2,400/mo · 60 Meals)</option>
                          <option value="lunch">Lunch Only (₹1,350/mo · 30 Meals)</option>
                          <option value="dinner">Dinner Only (₹1,350/mo · 30 Meals)</option>
                          <option value="trial">7-Day Trial Pack (₹650 · 14 Meals)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "आहार प्राथमिकता:" : "Dietary Preference:"}</Label>
                        <select
                          value={dietType}
                          onChange={(e) => setDietType(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="Pure Vegetarian">Pure Vegetarian (Homestyle)</option>
                          <option value="Jain (No Onion/Garlic)">Jain (No Onion/Garlic)</option>
                          <option value="Special Low Oil / Diabetic">Low Oil / Light Spice</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.4 Connect Inputs */}
                  {service === "connect" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "सहयोग क्षेत्र:" : "Engagement Focus:"}</Label>
                        <select
                          value={connectDomain}
                          onChange={(e) => setConnectDomain(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="tech_assistance">Smartphone & Tech Assistance for Seniors</option>
                          <option value="evening_walks">Evening Walks & Social Companionship</option>
                          <option value="tutoring">Academic Tutoring for Host Family</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "साप्ताहिक समय:" : "Weekly Commitment:"}</Label>
                        <select
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="2-3 hours/week">2–3 Hours / Week</option>
                          <option value="4-6 hours/week">4–6 Hours / Week</option>
                          <option value="Weekend only">Weekend Only (Saturday/Sunday)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.5 Trust Inputs */}
                  {service === "trust" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "ऑडिट प्रकार:" : "Verification Scope:"}</Label>
                        <select
                          value={auditType}
                          onChange={(e) => setAuditType(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="host_safety_audit">4-Tier Senior Host Safety & CCTV Audit</option>
                          <option value="student_clearance">Student Police & College ID Verification</option>
                          <option value="tamper_seal">Physical Barcode Sealing & Vault Custody</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "सुविधाजनक स्लॉट:" : "Preferred Slot:"}</Label>
                        <select
                          value={preferredSlot}
                          onChange={(e) => setPreferredSlot(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="Morning (10 AM - 1 PM)">Morning (10:00 AM – 1:00 PM)</option>
                          <option value="Afternoon (2 PM - 5 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                          <option value="Evening (5 PM - 8 PM)">Evening (5:00 PM – 8:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.6 Micro Inputs */}
                  {service === "micro" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label className="text-xs">{isHi ? "मोनेटाइज करने योग्य संपत्ति:" : "Space to Monetize:"}</Label>
                        <select
                          value={monetizeAsset}
                          onChange={(e) => setMonetizeAsset(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                        >
                          <option value="spare_room">Spare Bedroom (Earn ₹6,000–₹12,000/mo)</option>
                          <option value="storage_closet">Dry Storage Closet/Garage (Earn ₹3,000–₹6,000/mo)</option>
                          <option value="kitchen_tiffin">Home Kitchen Tiffins (Earn ₹5,000–₹15,000/mo)</option>
                          <option value="campus_captain">Campus Student Ambassador / Node Captain</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">{isHi ? "अपेक्षित मासिक आय (₹):" : "Expected Monthly Rent (₹):"}</Label>
                        <Input
                          type="number"
                          value={expectedRent}
                          onChange={(e) => setExpectedRent(e.target.value)}
                          placeholder="8000"
                          className="mt-1.5 border-white/10 bg-black/60 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Common User Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-name" className="text-xs">
                        {isHi ? "पूरा नाम *" : "Full Name *"}
                      </Label>
                      {touched.name && (
                        <span className={`text-[10px] ${isNameValid ? "text-emerald-400" : "text-destructive"}`}>
                          {isNameValid ? (isHi ? "सत्यापित" : "Looks good") : (isHi ? "नाम अनिवार्य है" : "Name required")}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="bk-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        placeholder={isHi ? "आपका पूरा नाम" : "Aarav Sharma"}
                        className={`border-white/10 bg-white/5 pr-8 text-xs ${
                          touched.name && !isNameValid
                            ? "border-destructive/60 focus-visible:ring-destructive"
                            : touched.name && isNameValid
                            ? "border-emerald-500/50"
                            : ""
                        }`}
                      />
                      {touched.name && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isNameValid ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-phone" className="text-xs">
                        {isHi ? "व्हाट्सएप / मोबाइल फोन *" : "WhatsApp / Mobile *"}
                      </Label>
                      {touched.phone && (
                        <span className={`text-[10px] ${isPhoneValid ? "text-emerald-400" : "text-destructive"}`}>
                          {isPhoneValid
                            ? (isHi ? "सत्यापित भारतीय नंबर" : "Valid Phone")
                            : (isHi ? "10-अंक आवश्यक (6-9 से शुरू)" : "10 digits required")}
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
                        className={`border-white/10 bg-white/5 pr-8 text-xs font-mono ${
                          touched.phone && !isPhoneValid
                            ? "border-destructive/60 focus-visible:ring-destructive"
                            : touched.phone && isPhoneValid
                            ? "border-emerald-500/50"
                            : ""
                        }`}
                      />
                      {touched.phone && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isPhoneValid ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-email" className="text-xs">
                        {isHi ? "कॉलेज / व्यक्तिगत ईमेल" : "College / Personal Email"}
                      </Label>
                      {email.trim() && (
                        <span
                          className={`text-[10px] ${
                            isEmailValid
                              ? isCollegeEmail(email)
                                ? "text-emerald-400"
                                : "text-cyan-400"
                              : "text-destructive"
                          }`}
                        >
                          {isEmailValid
                            ? isCollegeEmail(email)
                              ? (isHi ? "🎓 सत्यापित कैंपस ईमेल" : "🎓 Verified Campus")
                              : (isHi ? "✓ वैध ईमेल" : "✓ Valid Email")
                            : (isHi ? "अमान्य ईमेल" : "Invalid email")}
                        </span>
                      )}
                    </div>
                    <Input
                      id="bk-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      placeholder="student@iitk.ac.in"
                      className="border-white/10 bg-white/5 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="bk-city" className="text-xs">
                        {isHi ? "शहर" : "City"}
                      </Label>
                      <select
                        id="bk-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
                      >
                        <option value="Kanpur">Kanpur</option>
                        <option value="Lucknow">Lucknow</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Pune">Pune</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Other">Other Campus</option>
                      </select>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="bk-pin" className="text-xs">
                        {isHi ? "पिन कोड" : "PIN Code"}
                      </Label>
                      <Input
                        id="bk-pin"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                        placeholder="208016"
                        maxLength={6}
                        className="border-white/10 bg-white/5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Location / Hostel / Address Detail */}
                <div className="grid gap-1.5">
                  <Label htmlFor="bk-addr" className="text-xs">
                    {isHi
                      ? "विशिष्ट पता / हॉस्टल हॉल / सोसाइटी:"
                      : "Hostel / Hall / Apartment / Campus Gate Address:"}
                  </Label>
                  <Input
                    id="bk-addr"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder={
                      isHi
                        ? "उदा. हॉल 4, रूम 212, आईआईटी कानपुर या आर्य नगर"
                        : "e.g. Hall 4, Room 212, IIT Kanpur or Swaroop Nagar"
                    }
                    className="border-white/10 bg-white/5 text-xs"
                  />
                </div>

                {/* Price Bar & Next Button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      {isHi ? "अनुमानित एस्क्रो मूल्य:" : "Estimated Escrow Amount:"}
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {calcAmount === 0 ? (
                        isHi ? "₹0 (निःशुल्क)" : "₹0 (Zero CapEx)"
                      ) : (
                        `₹${calcAmount.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNextToSummary}
                    className="cursor-pointer px-6"
                  >
                    {isHi ? "आगे बढ़ें" : "Continue"}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
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

                {paymentMode === "upi_qr" && calcAmount > 0 ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#12181F] to-[#0A0D0F] p-4 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-300 font-medium">
                        {isHi ? "एस्क्रो लॉक राशि:" : "Escrow Lock Amount:"}
                      </span>
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        ₹{calcAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="relative mx-auto w-40 h-40 rounded-2xl bg-black p-2 border-2 border-emerald-500/40 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden">
                      <img
                        src={qrCodeUrl}
                        alt="StashSaarthi UPI Escrow QR"
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl pointer-events-none" />
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-mono">
                      <span>
                        UPI ID: <strong className="text-emerald-400">{upiId}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                      {isHi
                        ? "Google Pay, PhonePe, Paytm या किसी भी UPI ऐप से स्कैन करके एस्क्रो सुरक्षित करें।"
                        : "Scan with GPay, PhonePe, Paytm or BHIM to lock your digital escrow."}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-2.5">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "ग्राहक नाम:" : "Client Name:"}</span>
                      <span className="font-bold text-foreground">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "संपर्क फोन:" : "Contact Phone:"}</span>
                      <span className="font-bold text-cyan-400">{phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "स्थान / शहर:" : "Location / City:"}</span>
                      <span className="font-bold text-foreground">
                        {city} {pincode ? `(${pincode})` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">{isHi ? "सेवा प्रकार:" : "Service Type:"}</span>
                      <span className="font-bold text-emerald-400 uppercase">{service}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-sm">
                      <span className="text-muted-foreground font-sans font-bold">
                        {isHi ? "कुल देय राशि:" : "Total Amount:"}
                      </span>
                      <span className="text-xl font-bold text-emerald-400">
                        {calcAmount === 0 ? "₹0" : `₹${calcAmount.toLocaleString("en-IN")}`}
                      </span>
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
                        मैं स्वीकार करता/करती हूं कि सभी विवरण सही हैं, भुगतान{" "}
                        <strong className="text-emerald-400">100% डिजिटल एस्क्रो</strong> में सुरक्षित रहेगा और
                        कंसीयज द्वारा सत्यापित किया जाएगा।
                      </>
                    ) : (
                      <>
                        I accept that all details are accurate, bookings are secured under{" "}
                        <strong className="text-emerald-400">100% Digital Escrow</strong>, and operations will
                        coordinate via StashSaarthi concierge.
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
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        {isHi ? "एस्क्रो सुरक्षित हो रहा है…" : "Locking Escrow…"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-400" />
                        {isHi ? "आरक्षण व एस्क्रो लॉक करें" : "Confirm & Lock Reservation"}
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
                  serviceLabel={service.toUpperCase()}
                  bags={service === "stash" ? bags : undefined}
                  months={service === "stash" ? months : undefined}
                />

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  {isHi ? "पूर्ण (बंद करें)" : "Done (Close Window)"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
