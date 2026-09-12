import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logSupabaseError } from "@/lib/supabaseLogger";
import { checkAndRecordRateLimit, showRateLimitToast } from "@/lib/rateLimiter";
import { saveBooking } from "@/lib/localSubmissions";
import { enqueueOfflineSubmission } from "@/lib/offlineSubmissionQueue";
import { scheduleRazorpayRoutePayout } from "@/lib/razorpayRouteEngine";
import { triggerHostPushNotification } from "@/lib/hostPushNotifications";
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
  ArrowRight,
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
  Plus,
  Trash2,
  Tag,
  Package,
  Luggage,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import {
  isValidEmail,
  isValidPhone,
  isCollegeEmail,
  isValidIndianPin,
} from "@/lib/waitlistService";
import { StashPass } from "./StashPass";
import { LuggageItemizerModal, type LuggageStorageItem } from "./LuggageItemizerModal";
import { useLanguage } from "@/context/LanguageContext";
import { MealPersonalizationSelector } from "./MealPersonalizationSelector";
import {
  getStashWallet,
  applyTrialTokenToCheckout,
  consumeTrialTokenOnBooking,
} from "@/lib/stashWallet";
import {
  calculateExtendedBreakDiscount,
  getExtendedBreakUpsellMessage,
} from "@/lib/extendedBreakUpsell";
import { ScheduledPickupSelector, type ScheduledPickupSelection } from "./ScheduledPickupSelector";
import { FreePickupNudgeBanner } from "./FreePickupNudgeBanner";
import { calculateFreePickupStatus } from "@/lib/freePickupThreshold";

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
  const [scheduledPickupWindow, setScheduledPickupWindow] = useState<string>("Today: 04:00 PM - 06:00 PM");

  const handlePickupSelect = (selection: ScheduledPickupSelection) => {
    setScheduledPickupWindow(selection.formattedString);
  };

  // 1. Stash specific fields & Itemization
  const [bags, setBags] = useState<number>(initialBags || 1);
  const [months, setMonths] = useState<number>(initialMonths || 1);
  const [itemType, setItemType] = useState("Suitcase & Luggage");
  const [showItemizerModal, setShowItemizerModal] = useState(false);

  const [luggageItems, setLuggageItems] = useState<
    { id: string; category: string; customLabel: string; barcode: string }[]
  >(() => {
    const count = initialBags || 1;
    const presets = [
      { category: "Suitcase", customLabel: "Suitcase: Winter Clothes & Jackets" },
      { category: "Carton Box", customLabel: "Carton #1: Books & Semester Notes" },
      { category: "Carton Box", customLabel: "Box #2: Bedding & Linens" },
      { category: "Duffle Bag", customLabel: "Duffle: Sports & Daily Wear" },
      { category: "Electronics", customLabel: "Electronics Box: Kettle & Charger" },
    ];
    return Array.from({ length: count }).map((_, i) => ({
      id: `item-${i + 1}-${Date.now()}`,
      category: presets[i % presets.length]?.category || "Suitcase",
      customLabel: presets[i % presets.length]?.customLabel || `Luggage Item #${i + 1}`,
      barcode: `#SS-BAG-${String(i + 1).padStart(2, "0")}`,
    }));
  });

  // Sync luggage items array with bags count
  useEffect(() => {
    setLuggageItems((prev) => {
      if (prev.length === bags) return prev;
      if (prev.length < bags) {
        const addedCount = bags - prev.length;
        const presets = [
          { category: "Carton Box", customLabel: "Carton #1: Books & Semester Notes" },
          { category: "Suitcase", customLabel: "Suitcase: Winter Clothes & Jackets" },
          { category: "Carton Box", customLabel: "Box #2: Bedding & Linens" },
          { category: "Duffle Bag", customLabel: "Duffle: Sports & Daily Wear" },
        ];
        const newItems = Array.from({ length: addedCount }).map((_, idx) => {
          const i = prev.length + idx;
          const preset = presets[i % presets.length];
          return {
            id: `item-${i + 1}-${Date.now()}`,
            category: preset?.category || "Carton Box",
            customLabel: preset?.customLabel || `Storage Item #${i + 1}`,
            barcode: `#SS-BAG-${String(i + 1).padStart(2, "0")}`,
          };
        });
        return [...prev, ...newItems];
      } else {
        return prev.slice(0, bags);
      }
    });
  }, [bags]);

  const updateLuggageItem = (
    index: number,
    field: "category" | "customLabel",
    val: string
  ) => {
    setLuggageItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const addLuggageItemWithPreset = (presetCategory: string, presetLabel: string) => {
    setLuggageItems((prev) => {
      const nextIdx = prev.length + 1;
      const newItem = {
        id: `item-${nextIdx}-${Date.now()}`,
        category: presetCategory,
        customLabel: presetLabel,
        barcode: `#SS-BAG-${String(nextIdx).padStart(2, "0")}`,
      };
      const updated = [...prev, newItem];
      setBags(updated.length);
      return updated;
    });
  };

  const removeLuggageItem = (index: number) => {
    if (luggageItems.length <= 1) return;
    setLuggageItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== index).map((item, idx) => ({
        ...item,
        barcode: `#SS-BAG-${String(idx + 1).padStart(2, "0")}`,
      }));
      setBags(updated.length);
      return updated;
    });
  };

  // 2. Spaces specific fields
  const [roomType, setRoomType] = useState<"single" | "shared" | "floor">("single");
  const [moveInDate, setMoveInDate] = useState("");
  const [foodPreference, setFoodPreference] = useState("with_food");

  // 3. Kitchen specific fields
  const [mealPlan, setMealPlan] = useState<"trial" | "smart" | "freedom" | "semester">("smart");
  const [dietType, setDietType] = useState("Pure Vegetarian");
  const [selectedPersonalizations, setSelectedPersonalizations] = useState<string[]>([]);
  const [personalizationDelta, setPersonalizationDelta] = useState<number>(0);

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
  const [paymentMode, setPaymentMode] = useState<"upi_qr" | "partial_cash" | "escrow_reserve">("upi_qr");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [tokenId, setTokenId] = useState<string>("");
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    pincode?: boolean;
  }>({});

  const SERVICES = [
    {
      id: "stash",
      label: isHi ? "सार्थी स्टैश (स्टोरेज)" : "Saarthi Stash",
      tag: "₹300/mo",
      icon: Boxes,
    },
    {
      id: "spaces",
      label: isHi ? "सार्थी स्पेसेस (कमरे)" : "Saarthi Spaces",
      tag: "Zero-Brokerage",
      icon: Home,
    },
    {
      id: "kitchen",
      label: isHi ? "सार्थी किचन (टिफिन)" : "Saarthi Kitchen",
      tag: "₹90/meal",
      icon: Soup,
    },
    {
      id: "connect",
      label: isHi ? "सार्थी कनेक्ट (साथी)" : "Saarthi Connect",
      tag: "Mentorship",
      icon: HandHeart,
    },
    {
      id: "trust",
      label: isHi ? "ट्रस्ट व नोड ऑडिट" : "Trust & Audit",
      tag: "100% Escrow",
      icon: ShieldCheck,
    },
    {
      id: "micro",
      label: isHi ? "होस्ट माइक्रो-अवसर" : "Host Monetize",
      tag: "Earn ₹11.5k+",
      icon: Briefcase,
    },
  ];

  const hasDiscount = Boolean(
    note && (note.includes("STASH50") || note.includes("₹50") || note.includes("Discount"))
  );
  const discountAmount = hasDiscount ? 50 : 0;

  const [useTrialToken, setUseTrialToken] = useState(true);
  const stashWallet = getStashWallet();
  const hasActiveTrialToken = Boolean(
    stashWallet.trialToken && !stashWallet.trialToken.isUsed && stashWallet.balance > 0
  );
  const trialDeduction = hasActiveTrialToken && useTrialToken ? Math.min(60, stashWallet.balance) : 0;

  // Dynamic Amount Calculation across all 6 services
  const calcAmount = (() => {
    let base = 0;
    if (initialAmount) {
      base = initialAmount;
    } else {
      switch (service) {
        case "stash": {
          const breakQuote = calculateExtendedBreakDiscount(bags, months, 300);
          base = breakQuote.finalStashCost;
          break;
        }
        case "spaces":
          base = roomType === "single" ? 6000 : roomType === "shared" ? 4500 : 11000;
          break;
        case "kitchen":
          base =
            (mealPlan === "trial"
              ? 300
              : mealPlan === "smart"
              ? 599
              : mealPlan === "freedom"
              ? 1449
              : 2799) + personalizationDelta;
          break;
        case "connect":
          base = 0;
          break;
        case "trust":
          base = 499;
          break;
        case "micro":
          base = 0;
          break;
        default:
          base = 300;
          break;
      }
    }
    const gross = Math.max(0, base - discountAmount);
    return Math.max(0, gross - trialDeduction);
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

  const isPhoneValid = !phone.trim() ? true : isValidPhone(phone);
  const isEmailValid = !email.trim() ? true : isValidEmail(email);
  const isPinValid = !pincode.trim() ? true : isValidIndianPin(pincode);
  const isNameValid = !name.trim() || name.trim().length >= 2;

  const partialUpfrontAmount = Math.ceil(calcAmount / 2);
  const partialRemainingCash = Math.floor(calcAmount / 2);
  const currentPayAmount = paymentMode === "partial_cash" ? partialUpfrontAmount : calcAmount;

  const upiId = "advikomer@okhdfcbank";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=StashSaarthi%20Escrow&am=${currentPayAmount}&cu=INR&tn=StashSaarthi%20${service.toUpperCase()}%20Booking`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=${paymentMode === "partial_cash" ? "F59E0B" : "10B981"}&bgcolor=000000&data=${encodeURIComponent(upiDeepLink)}`;

  const handleNextToSummary = () => {
    setTouched({ name: true, email: true, phone: true, pincode: true });

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    // At least 1 contact method required (Phone OR Email)
    if (!cleanPhone && !cleanEmail) {
      toast.error(
        isHi
          ? "कृपया संपर्क के लिए व्हाट्सएप नंबर या ईमेल दर्ज करें।"
          : "Please enter either a phone number or email address.",
      );
      return;
    }
    if (cleanPhone && !isValidPhone(cleanPhone)) {
      toast.error(
        isHi
          ? "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें।"
          : "Please enter a valid 10-digit phone number.",
      );
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      toast.error(
        isHi ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.",
      );
      return;
    }
    if (pincode.trim() && !isValidIndianPin(pincode)) {
      toast.error(
        isHi ? "कृपया 6-अंकों का वैध पिन कोड दर्ज करें।" : "Please enter a valid 6-digit PIN code.",
      );
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
          : "Please accept the community escrow & safety charter.",
      );
      return;
    }

    const rateCheck = checkAndRecordRateLimit("booking_modal");
    if (!rateCheck.allowed) {
      showRateLimitToast(rateCheck.remainingSeconds, rateCheck.message);
      return;
    }

    setSubmitting(true);
    try {
      const generatedToken = `ST-${Math.floor(Math.random() * 90000) + 10000}`;
      setTokenId(generatedToken);

      // Build structured message payload depending on the selected service
      let serviceMeta = "";
      if (service === "stash") {
        const itemizationStr = luggageItems
          .map((it, idx) => `${it.barcode}: [${it.category}] ${it.customLabel || "Unlabeled"}`)
          .join(" | ");
        serviceMeta = `[Stash] Bags: ${bags}, Months: ${months}, Pickup Window: ${scheduledPickupWindow}, Itemization: {${itemizationStr}}, Pickup: ${addressDetail || "Hostel/Campus Gate"}`;
      } else if (service === "spaces") {
        serviceMeta = `[Spaces] Room: ${roomType}, MoveIn: ${moveInDate || "Immediate"}, Pickup Window: ${scheduledPickupWindow}, Food: ${foodPreference}, Address: ${addressDetail || city}`;
      } else if (service === "kitchen") {
        serviceMeta = `[Kitchen] Plan: ${mealPlan}, Diet: ${dietType}, Pickup/Delivery Window: ${scheduledPickupWindow}, Delivery Address: ${addressDetail || city}`;
      } else if (service === "connect") {
        serviceMeta = `[Connect] Domain: ${connectDomain}, Hours: ${hoursPerWeek}, Locality: ${addressDetail || city}`;
      } else if (service === "trust") {
        serviceMeta = `[Trust Audit] AuditType: ${auditType}, PreferredSlot: ${preferredSlot}, Location: ${addressDetail || city}`;
      } else if (service === "micro") {
        serviceMeta = `[Micro Monetize] Asset: ${monetizeAsset}, ExpectedRent: ₹${expectedRent}/mo, Address: ${addressDetail || city}`;
      }

      const payModeTag =
        paymentMode === "partial_cash"
          ? `Partial (50% Upfront UPI: ₹${partialUpfrontAmount}, 50% Pickup Cash: ₹${partialRemainingCash})`
          : paymentMode === "upi_qr"
          ? `100% Instant UPI (₹${calcAmount})`
          : `Escrow Reserve Hold (₹${calcAmount})`;

      const fullMessage = `${note ? `${note} · ` : ""}${serviceMeta} · EstAmount: ₹${calcAmount} · Token: ${generatedToken} · PIN: ${pincode || "N/A"} · PayMode: ${payModeTag}`;

      const cleanName = name.trim() || (service === "micro" ? "Host Partner" : "Campus Student");
      const cleanPhone = phone.trim();
      const cleanEmail = email.trim() || `${cleanPhone || "guest"}@temp.stashsaarthi-web.vercel.app`;

      const payload = {
        user_id: user?.id ?? null,
        role: service,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || "N/A",
        preferred_location: city.trim(),
        message: fullMessage,
      };

      // Persist to localStorage for offline admin dashboard (no Supabase dependency)
      saveBooking({
        id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        service: service as import("@/lib/localSubmissions").ServiceType,
        name: cleanName,
        phone: cleanPhone || "N/A",
        email: cleanEmail,
        city: city.trim(),
        token: generatedToken,
        amount: calcAmount,
        paymentMode,
        message: fullMessage,
        submittedAt: new Date().toISOString(),
        // Conditional spreads — exactOptionalPropertyTypes safe
        ...(pincode ? { pincode } : {}),
        ...(scheduledPickupWindow ? { pickupWindow: scheduledPickupWindow } : {}),
        ...(service === "stash" ? { bags, months } : {}),
        ...(service === "spaces" ? { roomType, ...(moveInDate ? { moveInDate } : {}) } : {}),
        ...(service === "kitchen" ? { mealPlan, dietType, personalizations: selectedPersonalizations } : {}),
        ...(service === "connect" ? { connectDomain } : {}),
        ...(service === "trust" ? { auditType } : {}),
        ...(service === "micro" ? { monetizeAsset } : {}),
      });

      if (trialDeduction > 0) {
        consumeTrialTokenOnBooking(generatedToken, trialDeduction);
      }

      // Schedule 24-Hour Razorpay Route Host Split Payout
      const payoutService = (["stash", "kitchen", "spaces", "connect"].includes(service)
        ? service
        : "stash") as "stash" | "kitchen" | "spaces" | "connect";

      scheduleRazorpayRoutePayout({
        bookingId: generatedToken,
        serviceType: payoutService,
        totalAmount: calcAmount,
        upiVpa: "host@upi",
      });

      // Trigger Host Web Push & Persistent Audio Alert Siren
      triggerHostPushNotification({
        id: generatedToken,
        bookingType: payoutService === "connect" ? "stash" : payoutService,
        studentName: cleanName,
        studentPhone: cleanPhone || "N/A",
        nodeName: "Kakadeo PW Hub",
        details: fullMessage || `${bags || 1}x Item Stash`,
        amount: calcAmount,
        timestamp: new Date().toISOString(),
      }).catch(() => null);


      // Save inquiry to supabase with zero data drop
      let syncError = false;
      try {
        const { error } = await supabase.from("co_living_inquiries").insert(payload);
        if (error) {
          syncError = true;
          logSupabaseError({
            table: "co_living_inquiries",
            operation: "insert",
            payload,
            error,
            context: "booking_modal_insert",
          });
          enqueueOfflineSubmission("booking", payload);
        }
      } catch (networkErr) {
        syncError = true;
        enqueueOfflineSubmission("booking", payload);
      }

      setStep(3);
      if (syncError) {
        toast.info(
          isHi ? "📡 ऑफ़लाइन मोड: बुकिंग सुरक्षित व कतारबद्ध!" : "📡 Offline Mode: Booking Saved & Queued!",
          {
            description: isHi
              ? "कनेक्शन पुनः जुड़ते ही आपका आरक्षण स्वतः सिंक हो जाएगा।"
              : "Your reservation is saved locally and will auto-sync when back online.",
          },
        );
      } else {
        toast.success(
          isHi ? "🎉 सेवा आरक्षण व एस्क्रो लॉक सफल!" : "🎉 Service Reservation & Escrow Locked!",
          {
            description: isHi
              ? "आपका आधिकारिक डिजिटल स्टैशपास तैयार है।"
              : "Your digital StashPass is ready.",
          },
        );
      }
    } catch (err: unknown) {
      logSupabaseError({
        table: "co_living_inquiries",
        operation: "insert",
        payload: { name, phone, service, city },
        error: err,
        context: "booking_modal_catch",
      });
      // Ensure offline queue is captured
      const fallbackPayload = {
        user_id: user?.id ?? null,
        role: service,
        name: name.trim() || "Campus Student",
        email: email.trim() || "student@stashsaarthi.com",
        phone: phone.trim() || "N/A",
        preferred_location: city.trim(),
        message: `Offline Fallback: ${service} booking for ${name}`,
      };
      enqueueOfflineSubmission("booking", fallbackPayload);
      setStep(3);
      toast.info(
        isHi ? "📡 ऑफ़लाइन पास तैयार!" : "📡 Offline StashPass Generated!",
        {
          description: isHi
            ? "विवरण स्थानीय रूप से सुरक्षित कर लिया गया है।"
            : "Your StashPass is active and queued for background sync.",
        },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[92vh] overflow-y-auto sm:max-w-xl border-white/10 p-5 sm:p-7">
        <DialogHeader className="space-y-3 pb-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {step === 1 && (isHi ? "सेवा आरक्षण व विवरण" : "Select Service & Fill Details")}
              {step === 2 &&
                (isHi ? "एस्क्रो भुगतान व आरक्षण पुष्टि" : "Escrow Lock & Confirmation")}
              {step === 3 && (isHi ? "बुकिंग की पुष्टि हो गई!" : "Booking Confirmed!")}
            </DialogTitle>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {step === 1 ? (isHi ? "चरण 01/03" : "Step 01/03") : step === 2 ? (isHi ? "चरण 02/03" : "Step 02/03") : (isHi ? "चरण 03/03" : "Step 03/03")}
            </span>
          </div>

          {/* Multi-Step Visual Progress Bar */}
          <div className="w-full space-y-2 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {step === 1 && (isHi ? "चरण 1: सेवा व संपर्क विवरण" : "Step 1: Details & Customization")}
                {step === 2 && (isHi ? "चरण 2: एस्क्रो सुरक्षा व समीक्षा" : "Step 2: Escrow Lock & Review")}
                {step === 3 && (isHi ? "चरण 3: डिजिटल स्टैशपास जारी" : "Step 3: StashPass Issued")}
              </span>
              <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {step === 1 ? "33%" : step === 2 ? "66%" : "100%"} {isHi ? "पूर्ण" : "Complete"}
              </span>
            </div>

            {/* Animated Progress Bar Track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                initial={{ width: "33%" }}
                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Step Nodes Row */}
            <div className="grid grid-cols-3 pt-1 text-center">
              <button
                type="button"
                onClick={() => step > 1 && setStep(1)}
                disabled={step === 3}
                className={`flex items-center justify-start gap-1.5 text-[11px] font-medium transition ${
                  step >= 1 ? "text-emerald-400" : "text-muted-foreground"
                } ${step === 3 ? "cursor-default opacity-80" : "cursor-pointer hover:underline"}`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold font-mono transition-all ${
                  step > 1
                    ? "bg-emerald-500 text-black"
                    : step === 1
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    : "bg-white/10 text-slate-400"
                }`}>
                  {step > 1 ? <Check className="h-3 w-3 stroke-[3]" /> : "1"}
                </div>
                <span className="truncate hidden sm:inline">{isHi ? "विवरण व चयन" : "Config & Contact"}</span>
                <span className="sm:hidden">{isHi ? "विवरण" : "Details"}</span>
              </button>

              <div
                className={`flex items-center justify-center gap-1.5 text-[11px] font-medium transition ${
                  step >= 2 ? "text-emerald-400" : "text-muted-foreground"
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold font-mono transition-all ${
                  step > 2
                    ? "bg-emerald-500 text-black"
                    : step === 2
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    : "bg-white/10 text-slate-400"
                }`}>
                  {step > 2 ? <Check className="h-3 w-3 stroke-[3]" /> : "2"}
                </div>
                <span className="truncate hidden sm:inline">{isHi ? "एस्क्रो समीक्षा" : "Escrow & Review"}</span>
                <span className="sm:hidden">{isHi ? "एस्क्रो" : "Escrow"}</span>
              </div>

              <div className={`flex items-center justify-end gap-1.5 text-[11px] font-medium transition ${
                step === 3 ? "text-emerald-400" : "text-muted-foreground"
              }`}>
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold font-mono transition-all ${
                  step === 3
                    ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-white/10 text-slate-400"
                }`}>
                  {step === 3 ? <Check className="h-3 w-3 stroke-[3]" /> : "3"}
                </div>
                <span className="truncate hidden sm:inline">{isHi ? "स्टैशपास" : "StashPass"}</span>
                <span className="sm:hidden">{isHi ? "पास" : "Pass"}</span>
              </div>
            </div>
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
                {/* Applied Promo Code Offer Banner */}
                {note && (
                  <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-emerald-400" />
                      <span>{note}</span>
                    </div>
                    {hasDiscount && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] shrink-0">
                        -₹50 OFF
                      </span>
                    )}
                  </div>
                )}

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
                            <Icon
                              className={`h-4 w-4 ${active ? "text-emerald-400" : "text-slate-400"}`}
                            />
                            <span className="text-[9px] font-mono text-emerald-400/90">
                              {s.tag}
                            </span>
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
                      {service === "stash" &&
                        (isHi ? "स्टैश स्टोरेज कस्टमाइज़ेशन" : "Stash Storage Configuration")}
                      {service === "spaces" &&
                        (isHi ? "कमरा व आवास आवश्यकताएं" : "Stay & Room Requirements")}
                      {service === "kitchen" &&
                        (isHi ? "घर का टिफिन व भोजन प्लान" : "Homemade Meal Plan Details")}
                      {service === "connect" &&
                        (isHi ? "इंटरजेनरेशनल साथी व मेंटरशिप" : "Intergenerational Engagement")}
                      {service === "trust" &&
                        (isHi ? "सुरक्षा सत्यापन व ऑन-साइट ऑडिट" : "Trust & Property Verification")}
                      {service === "micro" &&
                        (isHi ? "होस्ट स्पेस मोनेटाइजेशन" : "Host Space Monetization")}
                    </span>
                  </div>

                  {/* 2.1 Stash Inputs */}
                  {service === "stash" && (
                    <div className="space-y-3.5 pt-1 text-left">
                      {/* Upper controls: Quantity and Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="bk-bags" className="text-xs font-semibold cursor-pointer text-slate-200">
                            {isHi ? "कुल स्टैश बैग संख्या:" : "Total Stash Bags Count:"}
                          </Label>
                          <select
                            id="bk-bags"
                            aria-label={isHi ? "बैगों की संख्या चुनें" : "Select number of bags"}
                            value={bags}
                            onChange={(e) => setBags(Number(e.target.value))}
                            className="w-full mt-1.5 rounded-xl border border-emerald-500/30 bg-black/70 px-3 py-2 text-xs font-semibold text-emerald-400 cursor-pointer shadow-inner"
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 10].map((b) => (
                              <option key={b} value={b} className="bg-[#0A0D0F]">
                                {b} {isHi ? "बैग / बॉक्स" : b === 1 ? "Bag / Box" : "Bags / Boxes"} (₹{b * 300}/mo)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="bk-months" className="text-xs font-semibold cursor-pointer text-slate-200">
                            {isHi ? "स्टोरेज अवधि (महीने):" : "Storage Duration (Months):"}
                          </Label>
                          <select
                            id="bk-months"
                            aria-label={isHi ? "स्टोरेज अवधि चुनें" : "Select duration in months"}
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6].map((m) => (
                              <option key={m} value={m} className="bg-[#0A0D0F]">
                                {m} {isHi ? "महीने" : m === 1 ? "Month" : "Months"} {m >= 3 ? (isHi ? " (15% छूट)" : " (15% OFF)") : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Extended Break Upsell Banner (Task 82) */}
                      {(() => {
                        const breakQuote = calculateExtendedBreakDiscount(bags, months, 300);
                        const potentialQuote = calculateExtendedBreakDiscount(bags, 3, 300);
                        const msg = getExtendedBreakUpsellMessage(language);

                        if (months < 3) {
                          return (
                            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-950/20 to-emerald-950/20 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition shadow-sm">
                              <div className="space-y-0.5 text-left">
                                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                                  <span>{msg.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-tight">
                                  {isHi
                                    ? `3+ महीनों (सेमेस्टर/गर्मी की छुट्टियों) के लिए 15% छूट! ₹${potentialQuote.discountAmount} की सीधी बचत पाएं।`
                                    : `Commit to 3+ months (semester/summer break) for 15% OFF! Save ₹${potentialQuote.discountAmount} instantly.`}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setMonths(3);
                                  toast.success(
                                    isHi ? "🎉 15% एक्सटेंडेड ब्रेक डिस्काउंट लागू हुआ!" : "🎉 15% Extended Break Discount Applied!",
                                    {
                                      description: isHi
                                        ? `आपने ₹${potentialQuote.discountAmount} की बचत की!`
                                        : `You saved ₹${potentialQuote.discountAmount} on your 3-month stash!`,
                                    }
                                  );
                                }}
                                className="w-full sm:w-auto shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-sans transition cursor-pointer shadow-md flex items-center justify-center gap-1 active:scale-95"
                              >
                                <Tag className="w-3.5 h-3.5" />
                                {msg.upgradeCta}
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-2.5 flex items-center justify-between gap-2 text-xs font-medium text-emerald-300">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{msg.activeBadge}</span>
                              </div>
                              <span className="font-mono text-[11px] font-bold text-emerald-200 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                                -₹{breakQuote.discountAmount} {isHi ? "छूट" : "OFF"}
                              </span>
                            </div>
                          );
                        }
                      })()}

                      {/* Free Campus Doorstep Pickup Threshold Nudge Banner (Task 127) */}
                      <FreePickupNudgeBanner
                        boxCount={bags}
                        onAddBox={() => {
                          setBags((prev) => prev + 1);
                          toast.success(
                            isHi ? "🎉 1 और बॉक्स जोड़ा गया!" : "🎉 1 Box Added to Cart!",
                            {
                              description: isHi
                                ? "100% मुफ़्त कैंपस डोरस्टेप पिकअप अनलॉक हो गया!"
                                : "100% Free Campus Doorstep Pickup unlocked!",
                            }
                          );
                        }}
                      />

                      {/* Quick Presets Bar & Full Itemizer Trigger */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-cyan-400" />
                            {isHi ? "आईटमाइजेशन व कस्टम लेबलिंग:" : "Storage Itemization & Labels:"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowItemizerModal(true)}
                            className="text-[10px] text-cyan-300 hover:text-white font-mono bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1"
                          >
                            <Luggage className="w-3 h-3 text-cyan-400" />
                            {isHi ? "पूर्ण आईटमाइज़र व बारकोड टैग खोलें →" : "Full Itemizer & Print Tags →"}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => addLuggageItemWithPreset("Carton Box", "Carton #1: Books & Semester Notes")}
                            className="px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + {isHi ? "किताबें बॉक्स" : "Books Box"}
                          </button>
                          <button
                            type="button"
                            onClick={() => addLuggageItemWithPreset("Suitcase", "Suitcase: Winter Clothes & Jackets")}
                            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + {isHi ? "सूटकेस (सर्दियों के कपड़े)" : "Winter Suitcase"}
                          </button>
                          <button
                            type="button"
                            onClick={() => addLuggageItemWithPreset("Carton Box", "Box #2: Bedding & Linens")}
                            className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + {isHi ? "बिस्तर बॉक्स" : "Bedding Box"}
                          </button>
                          <button
                            type="button"
                            onClick={() => addLuggageItemWithPreset("Electronics", "Electronics Box: Kettle & Chargers")}
                            className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + {isHi ? "इलेक्ट्रॉनिक्स" : "Electronics"}
                          </button>
                        </div>
                      </div>

                      {/* Itemization Cards List */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {luggageItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-2 transition hover:border-emerald-500/40 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {item.barcode}
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                  {isHi ? `सामान #${idx + 1}` : `Item #${idx + 1}`}
                                </span>
                              </div>

                              {luggageItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLuggageItem(idx)}
                                  className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 transition cursor-pointer"
                                  title={isHi ? "सामान हटाएं" : "Remove Item"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <Label className="text-[10px] text-muted-foreground">
                                  {isHi ? "सामान श्रेणी:" : "Item Category:"}
                                </Label>
                                <select
                                  value={item.category}
                                  onChange={(e) => updateLuggageItem(idx, "category", e.target.value)}
                                  className="w-full mt-1 rounded-lg border border-white/10 bg-black/80 px-2.5 py-1.5 text-xs text-white cursor-pointer"
                                >
                                  <option value="Carton Box">{isHi ? "कार्टन बॉक्स 📦" : "Carton Box 📦"}</option>
                                  <option value="Suitcase">{isHi ? "सूटकेस / ट्रॉली 🧳" : "Luggage / Suitcase 🧳"}</option>
                                  <option value="Duffle Bag">{isHi ? "डफ़ल / बैकपैक 🎒" : "Duffle / Backpack 🎒"}</option>
                                  <option value="Books & Notes">{isHi ? "किताबें व नोट्स 📚" : "Books & Semester Notes 📚"}</option>
                                  <option value="Bicycle/Cooler">{isHi ? "साइकिल / कूलर 🚲" : "Bicycle / Cooler 🚲"}</option>
                                  <option value="Electronics">{isHi ? "इलेक्ट्रॉनिक्स 🔌" : "Electronics & Appliances 🔌"}</option>
                                  <option value="Other">{isHi ? "अन्य सामान 🏷️" : "Other Miscellaneous 🏷️"}</option>
                                </select>
                              </div>

                              <div>
                                <Label className="text-[10px] text-muted-foreground">
                                  {isHi ? "कस्टम लेबल / विवरण:" : "Custom Item Label:"}
                                </Label>
                                <Input
                                  type="text"
                                  value={item.customLabel}
                                  onChange={(e) => updateLuggageItem(idx, "customLabel", e.target.value)}
                                  placeholder={isHi ? "उदा. कार्टन #1: पुस्तकें" : "e.g., Carton #1: Books"}
                                  className="mt-1 border-white/10 bg-black/80 text-xs text-white py-1 px-2.5 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Labeled Inventory Summary Bar */}
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-300 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium truncate">
                            {isHi ? "आईटमाइज्ड सूची:" : "Itemized Inventory:"}{" "}
                            <strong className="text-white font-mono">
                              {luggageItems.map((it) => it.customLabel || it.category).join(" · ")}
                            </strong>
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 shrink-0">
                          ₹{bags * months * 300}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2.2 Spaces Inputs */}
                  {service === "spaces" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <Label htmlFor="bk-room-type" className="text-xs cursor-pointer">
                          {isHi ? "कमरे का प्रकार:" : "Room Preference:"}
                        </Label>
                        <select
                          id="bk-room-type"
                          aria-label={isHi ? "कमरे का प्रकार चुनें" : "Select room preference"}
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value as any)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="single">Single Room (₹6,000/mo)</option>
                          <option value="shared">Shared Twin (₹4,500/mo)</option>
                          <option value="floor">Independent Floor (₹11,000/mo)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bk-move-in" className="text-xs cursor-pointer">
                          {isHi ? "शिफ्टिंग तिथि:" : "Move-in Date:"}
                        </Label>
                        <Input
                          id="bk-move-in"
                          type="date"
                          aria-label={isHi ? "शिफ्टिंग तिथि" : "Move-in date"}
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          className="mt-1.5 border-white/10 bg-black/60 text-xs text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bk-food-pref" className="text-xs cursor-pointer">
                          {isHi ? "भोजन सुविधा:" : "Tiffin Option:"}
                        </Label>
                        <select
                          id="bk-food-pref"
                          aria-label={isHi ? "भोजन सुविधा चुनें" : "Select tiffin option"}
                          value={foodPreference}
                          onChange={(e) => setFoodPreference(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="with_food">With Token Meal Wallet</option>
                          <option value="without_food">Room Only (Self-Cook)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.3 Kitchen Inputs */}
                  {service === "kitchen" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label htmlFor="bk-meal-plan" className="text-xs cursor-pointer">
                          {isHi ? "मील प्लान:" : "Meal Subscription Plan:"}
                        </Label>
                        <select
                          id="bk-meal-plan"
                          aria-label={isHi ? "मील प्लान चुनें" : "Select meal plan"}
                          value={mealPlan}
                          onChange={(e) => setMealPlan(e.target.value as any)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="trial">Starter Trial (300 Tokens · ₹300)</option>
                          <option value="smart">Smart Hopper (625 Tokens · ₹599)</option>
                          <option value="freedom">Monthly Freedom (1550 Tokens · ₹1,449)</option>
                          <option value="semester">Semester Pro (3050 Tokens · ₹2,799)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bk-diet-type" className="text-xs cursor-pointer">
                          {isHi ? "आहार प्राथमिकता:" : "Dietary Preference:"}
                        </Label>
                        <select
                          id="bk-diet-type"
                          aria-label={isHi ? "आहार प्राथमिकता चुनें" : "Select dietary preference"}
                          value={dietType}
                          onChange={(e) => setDietType(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
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
                        <Label htmlFor="bk-connect-domain" className="text-xs cursor-pointer">
                          {isHi ? "सहयोग क्षेत्र:" : "Engagement Focus:"}
                        </Label>
                        <select
                          id="bk-connect-domain"
                          aria-label={isHi ? "सहयोग क्षेत्र चुनें" : "Select engagement focus"}
                          value={connectDomain}
                          onChange={(e) => setConnectDomain(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="tech_assistance">
                            Smartphone & Tech Assistance for Seniors
                          </option>
                          <option value="evening_walks">
                            Evening Walks & Social Companionship
                          </option>
                          <option value="tutoring">Academic Tutoring for Host Family</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bk-hours-week" className="text-xs cursor-pointer">
                          {isHi ? "साप्ताहिक समय:" : "Weekly Commitment:"}
                        </Label>
                        <select
                          id="bk-hours-week"
                          aria-label={isHi ? "साप्ताहिक समय चुनें" : "Select weekly commitment"}
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
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
                        <Label htmlFor="bk-audit-type" className="text-xs cursor-pointer">
                          {isHi ? "ऑडिट प्रकार:" : "Verification Scope:"}
                        </Label>
                        <select
                          id="bk-audit-type"
                          aria-label={isHi ? "ऑडिट प्रकार चुनें" : "Select verification scope"}
                          value={auditType}
                          onChange={(e) => setAuditType(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="host_safety_audit">
                            4-Tier Senior Host Safety & CCTV Audit
                          </option>
                          <option value="student_clearance">
                            Student Police & College ID Verification
                          </option>
                          <option value="tamper_seal">
                            Physical Barcode Sealing & Vault Custody
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bk-preferred-slot" className="text-xs cursor-pointer">
                          {isHi ? "सुविधाजनक स्लॉट:" : "Preferred Slot:"}
                        </Label>
                        <select
                          id="bk-preferred-slot"
                          aria-label={isHi ? "सुविधाजनक स्लॉट चुनें" : "Select preferred slot"}
                          value={preferredSlot}
                          onChange={(e) => setPreferredSlot(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="Morning (10 AM - 1 PM)">
                            Morning (10:00 AM – 1:00 PM)
                          </option>
                          <option value="Afternoon (2 PM - 5 PM)">
                            Afternoon (2:00 PM – 5:00 PM)
                          </option>
                          <option value="Evening (5 PM - 8 PM)">Evening (5:00 PM – 8:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2.6 Micro Inputs */}
                  {service === "micro" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label htmlFor="bk-monetize-asset" className="text-xs cursor-pointer">
                          {isHi ? "मोनेटाइज करने योग्य संपत्ति:" : "Space to Monetize:"}
                        </Label>
                        <select
                          id="bk-monetize-asset"
                          aria-label={
                            isHi ? "मोनेटाइज करने योग्य संपत्ति चुनें" : "Select space to monetize"
                          }
                          value={monetizeAsset}
                          onChange={(e) => setMonetizeAsset(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
                        >
                          <option value="spare_room">Spare Bedroom (Earn ₹6,000–₹12,000/mo)</option>
                          <option value="storage_closet">
                            Dry Storage Closet/Garage (Earn ₹3,000–₹6,000/mo)
                          </option>
                          <option value="kitchen_tiffin">
                            Home Kitchen Tiffins (Earn ₹5,000–₹15,000/mo)
                          </option>
                          <option value="campus_captain">
                            Campus Student Ambassador / Node Captain
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bk-expected-rent" className="text-xs cursor-pointer">
                          {isHi ? "अपेक्षित मासिक आय (₹):" : "Expected Monthly Rent (₹):"}
                        </Label>
                        <Input
                          id="bk-expected-rent"
                          type="number"
                          aria-label={
                            isHi ? "अपेक्षित मासिक आय" : "Expected monthly rent in rupees"
                          }
                          value={expectedRent}
                          onChange={(e) => setExpectedRent(e.target.value)}
                          placeholder="8000"
                          className="mt-1.5 border-white/10 bg-black/60 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2.7 2-Hour Doorstep Pickup Window Selector (Task 124) */}
                {(service === "stash" || service === "spaces" || service === "kitchen") && (
                  <ScheduledPickupSelector
                    onPickupSelect={handlePickupSelect}
                    initialDay="today"
                    initialSlot="04:00 PM - 06:00 PM"
                  />
                )}

                {/* 3. Common User Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bk-name" className="text-xs">
                        {isHi ? "पूरा नाम *" : "Full Name *"}
                      </Label>
                      {touched.name && (
                        <span
                          className={`text-[10px] ${isNameValid ? "text-emerald-400" : "text-destructive"}`}
                        >
                          {isNameValid
                            ? isHi
                              ? "सत्यापित"
                              : "Looks good"
                            : isHi
                              ? "नाम अनिवार्य है"
                              : "Name required"}
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
                        <span
                          className={`text-[10px] ${isPhoneValid ? "text-emerald-400" : "text-destructive"}`}
                        >
                          {isPhoneValid
                            ? isHi
                              ? "सत्यापित नंबर"
                              : "Valid Phone"
                            : isHi
                              ? "वैध नंबर आवश्यक"
                              : "Valid number required"}
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
                              ? isHi
                                ? "🎓 सत्यापित कैंपस ईमेल"
                                : "🎓 Verified Campus"
                              : isHi
                                ? "✓ वैध ईमेल"
                                : "✓ Valid Email"
                            : isHi
                              ? "अमान्य ईमेल"
                              : "Invalid email"}
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
                      <Label htmlFor="bk-city" className="text-xs cursor-pointer">
                        {isHi ? "शहर" : "City"}
                      </Label>
                      <select
                        id="bk-city"
                        aria-label={isHi ? "शहर चुनें" : "Select city"}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white cursor-pointer"
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

                {/* Stash Wallet Zero-Fee Trial Token Banner */}
                {hasActiveTrialToken && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-300">
                          {isHi ? "⚡ ₹60 जीरो-फी ट्रायल टोकन लागू" : "⚡ ₹60 Zero-Fee Trial Token Active"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isHi ? "स्टैश वॉलेट क्रेडिट: 1st ऑर्डर पर ₹60 की छूट" : "Stash Wallet Credit: ₹60 discount applied"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseTrialToken(!useTrialToken)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        useTrialToken
                          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {useTrialToken
                        ? isHi ? "लागू है ✓" : "Applied ✓"
                        : isHi ? "टोकन लागू करें" : "Apply Token"}
                    </button>
                  </div>
                )}

                {/* Price Bar & Next Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      {isHi ? "अनुमानित एस्क्रो मूल्य:" : "Estimated Escrow Amount:"}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        {calcAmount === 0
                          ? isHi
                            ? "₹0 (निःशुल्क)"
                            : "₹0 (Zero CapEx)"
                          : `₹${calcAmount.toLocaleString("en-IN")}`}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        ⚡ {isHi ? "0% रद्दीकरण शुल्क" : "Zero Cancellation Fee"}
                      </span>
                    </div>
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
                {/* Payment Mode Selector Tabs (3 Options) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("upi_qr")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center ${
                      paymentMode === "upi_qr"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <QrCode className="h-3.5 w-3.5" />
                      <span>{isHi ? "100% UPI एस्क्रो" : "100% Instant UPI"}</span>
                    </div>
                    <span className="text-[9px] font-mono font-normal opacity-80">
                      {isHi ? "पूर्ण डिजिटल एस्क्रो" : "Full Digital Escrow"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("partial_cash")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center ${
                      paymentMode === "partial_cash"
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-black"
                        : "text-amber-400 hover:text-amber-300 border border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>{isHi ? "50% UPI + 50% कैश" : "50% Pay + 50% Cash"}</span>
                    </div>
                    <span className="text-[9px] font-mono font-semibold opacity-90">
                      {isHi ? "⚡ न्यूनतम अग्रिम" : "⚡ Low Friction"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("escrow_reserve")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center ${
                      paymentMode === "escrow_reserve"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isHi ? "एस्क्रो होल्ड" : "Escrow Reserve"}</span>
                    </div>
                    <span className="text-[9px] font-mono font-normal opacity-80">
                      {isHi ? "पिकअप पर भुगतान" : "Pay at Doorstep"}
                    </span>
                  </button>
                </div>

                {/* 1. Partial UPI Payment Mode (50% Upfront + 50% Pickup Cash) */}
                {paymentMode === "partial_cash" && calcAmount > 0 ? (
                  <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#1E170C] to-[#0A0D0F] p-4 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs px-1 border-b border-amber-500/20 pb-2.5">
                      <div className="text-left">
                        <span className="text-amber-300 font-medium block">
                          {isHi ? "50% अग्रिम UPI भुगतान:" : "50% Upfront Pay Now (UPI):"}
                        </span>
                        <span className="text-slate-400 text-[10px] block">
                          {isHi
                            ? `शेष ₹${partialRemainingCash} पिकअप पर नकद/UPI दें`
                            : `Remaining ₹${partialRemainingCash} due at doorstep pickup`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-mono font-bold text-amber-400">
                          ₹{partialUpfrontAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground block">
                          ({isHi ? "कुल मूल्य:" : "Total:"} ₹{calcAmount.toLocaleString("en-IN")})
                        </span>
                      </div>
                    </div>

                    {/* Dynamic QR Code Container for Partial Amount */}
                    <div className="relative mx-auto w-36 h-36 rounded-2xl bg-black p-2 border-2 border-amber-500/50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] flex items-center justify-center overflow-hidden">
                      <img
                        src={qrCodeUrl}
                        alt="StashSaarthi Partial UPI QR"
                        loading="lazy"
                        decoding="async"
                        width={144}
                        height={144}
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 border border-amber-400/20 rounded-2xl pointer-events-none" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 font-mono">
                      <span>
                        UPI ID: <strong className="text-amber-400">{upiId}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy UPI ID"
                        aria-label="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <Check className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Zero Friction Cash-at-Pickup Guarantee Banner */}
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-left text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{isHi ? "50% पिकअप कैश सुरक्षा" : "50% Cash at Doorstep Pickup"}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {isHi
                          ? `अभी केवल ₹${partialUpfrontAmount} UPI से जमा करें। शेष ₹${partialRemainingCash} हमारा एजेंट जब आपके कमरे पर आए तब नकद दें।`
                          : `Pay just ₹${partialUpfrontAmount} upfront via UPI. Hand over the remaining ₹${partialRemainingCash} in cash/UPI when our pickup agent collects your baggage.`}
                      </p>
                    </div>

                    {/* Mobile Deep Link Button */}
                    <a
                      href={upiDeepLink}
                      className="mt-2 md:hidden flex items-center justify-center gap-2 w-full min-h-[48px] py-3 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
                    >
                      {isHi ? `₹${partialUpfrontAmount} UPI ऐप से दें` : `Pay ₹${partialUpfrontAmount} via UPI App`}
                    </a>
                  </div>
                ) : paymentMode === "upi_qr" && calcAmount > 0 ? (
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
                        loading="lazy"
                        decoding="async"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl pointer-events-none" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 font-mono">
                      <span>
                        UPI ID: <strong className="text-emerald-400">{upiId}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy UPI ID"
                        aria-label="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-muted-foreground hidden md:block">
                      {isHi
                        ? "Google Pay, PhonePe, Paytm या किसी भी UPI ऐप से स्कैन करके एस्क्रो सुरक्षित करें।"
                        : "Scan with GPay, PhonePe, Paytm or BHIM to lock your digital escrow."}
                    </p>

                    {/* Mobile Deep Link Button */}
                    <a
                      href={upiDeepLink}
                      className="mt-2 md:hidden flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
                    >
                      {isHi ? "UPI ऐप से भुगतान करें" : "Pay with UPI App"}
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-2.5">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">
                        {isHi ? "ग्राहक नाम:" : "Client Name:"}
                      </span>
                      <span className="font-bold text-foreground">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">
                        {isHi ? "संपर्क फोन:" : "Contact Phone:"}
                      </span>
                      <span className="font-bold text-cyan-400">{phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">
                        {isHi ? "स्थान / शहर:" : "Location / City:"}
                      </span>
                      <span className="font-bold text-foreground">
                        {city} {pincode ? `(${pincode})` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-muted-foreground">
                        {isHi ? "सेवा प्रकार:" : "Service Type:"}
                      </span>
                      <span className="font-bold text-emerald-400 uppercase">{service}</span>
                    </div>
                    {(service === "stash" || service === "spaces" || service === "kitchen") && (
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-muted-foreground">
                          {isHi ? "पिकअप समय विंडो:" : "Pickup Window:"}
                        </span>
                        <span className="font-bold font-mono text-emerald-300">{scheduledPickupWindow}</span>
                      </div>
                    )}
                    {service === "stash" && (
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-muted-foreground">
                          {isHi ? "कैंपस डोरस्टेप पिकअप शुल्क:" : "Campus Doorstep Pickup Fee:"}
                        </span>
                        <span className={`font-bold ${bags >= 2 ? "text-emerald-400" : "text-amber-400"}`}>
                          {bags >= 2
                            ? isHi ? "100% मुफ़्त (₹99 की बचत)" : "100% FREE (Saved ₹99)"
                            : "₹99 (2+ बॉक्स पर मुफ़्त)"}
                        </span>
                      </div>
                    )}
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
                  <label
                    htmlFor="bk-waiver"
                    className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    {isHi ? (
                      <>
                        मैं स्वीकार करता/करती हूं कि सभी विवरण सही हैं, भुगतान{" "}
                        <strong className="text-emerald-400">100% डिजिटल एस्क्रो</strong> में
                        सुरक्षित रहेगा और कंसीयज द्वारा सत्यापित किया जाएगा।
                      </>
                    ) : (
                      <>
                        I accept that all details are accurate, bookings are secured under{" "}
                        <strong className="text-emerald-400">100% Digital Escrow</strong>, and
                        operations will coordinate via StashSaarthi concierge.
                      </>
                    )}
                  </label>
                </div>

                {/* Radical Transparency Trust Block */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex gap-3 items-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                      {isHi
                        ? "100% रेडिकल ट्रांसपेरेंसी गारंटी"
                        : "100% Radical Transparency Guarantee"}
                    </h4>
                    <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                      {isHi
                        ? "आपकी धनराशि शून्य जोखिम एस्क्रो में सुरक्षित है। जब तक सेवा पूर्ण रूप से सत्यापित नहीं हो जाती, तब तक मेजबान को भुगतान नहीं किया जाता है। कोई छिपी हुई फीस नहीं।"
                        : "Your funds are secured in a Zero-Risk Escrow. Host payouts are withheld until full service verification. Zero hidden fees. Zero brokerage."}
                    </p>
                  </div>
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
                  items={service === "stash" ? luggageItems : undefined}
                  paymentMode={paymentMode}
                />

                {/* Dynamic Pre-filled WhatsApp Action Link */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/919369454350?text=${encodeURIComponent(
                      `Hello StashSaarthi Concierge, my Order ID is ${tokenId} for service ${service.toUpperCase()}. Booked at ${new Date().toLocaleString("en-IN")}. Please confirm my service slot.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-sm shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] transition-all cursor-pointer min-h-[44px]"
                  >
                    <MessageCircle className="h-4 w-4 fill-slate-950" />
                    <span>
                      {isHi
                        ? `कंसीयज से व्हाट्सएप पर संपर्क करें (${tokenId})`
                        : `Chat with Concierge on WhatsApp (${tokenId})`}
                    </span>
                  </a>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5 cursor-pointer min-h-[44px]"
                  onClick={() => onOpenChange(false)}
                >
                  {isHi ? "पूर्ण (बंद करें)" : "Done (Close Window)"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>

      <LuggageItemizerModal
        open={showItemizerModal}
        onOpenChange={setShowItemizerModal}
        items={luggageItems.map((it) => ({
          id: it.id,
          category: (it.category || "Carton Box") as any,
          customLabel: it.customLabel || "",
          barcode: it.barcode || "#SS-BAG-01",
          isFragile: false,
          weightEstKg: 12,
        }))}
        onSaveItems={(newItems) => {
          setLuggageItems(
            newItems.map((ni) => ({
              id: ni.id,
              category: ni.category,
              customLabel: ni.customLabel,
              barcode: ni.barcode,
            }))
          );
          setBags(newItems.length);
        }}
      />
    </Dialog>
  );
}
