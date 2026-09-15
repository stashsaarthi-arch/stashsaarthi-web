/**
 * StashSaarthi — Student My-Bookings Hub (Task 174)
 * Shows logged-in user's booking history with real-time status timelines
 * (Booked -> Picked Up -> In Vault -> Retrieved), status filters, and GST tax invoice download triggers.
 */

import { useState, useMemo } from "react";
import {
  Boxes,
  Soup,
  Users,
  Calendar,
  IndianRupee,
  Package,
  Clock,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Hash,
  Download,
  CheckCircle2,
  Truck,
  ShieldCheck,
  PackageCheck,
  FileText,
  Filter,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { usePersona } from "@/context/PersonaContext";
import { PersonaEmptyState } from "@/components/ui/PersonaEmptyState";
import { getStudentMyBookingsTokens } from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";
import { toast } from "sonner";

import {
  getBookings,
  getMealOrders,
  getWaitlistEntries,
  type BookingRecord,
  type MealOrderRecord,
  type WaitlistRecord,
} from "@/lib/localSubmissions";

type Tab = "bookings" | "meals" | "waitlist";
type StatusFilter = "all" | "active" | "booked" | "retrieved";

export interface BookingTimelineStage {
  id: "booked" | "picked_up" | "in_vault" | "retrieved";
  step: number;
  labelEn: string;
  labelHi: string;
  badgeTextEn: string;
  badgeTextHi: string;
  descriptionEn: string;
  descriptionHi: string;
}

const SERVICE_LABELS: Record<string, { en: string; hi: string; icon: string }> = {
  stash: { en: "Micro-Storage", hi: "लगेज स्टोरेज", icon: "🎒" },
  spaces: { en: "Room / Stay", hi: "कमरा / आवास", icon: "🏠" },
  kitchen: { en: "Tiffin / Meal", hi: "टिफिन / भोजन", icon: "🍲" },
  connect: { en: "Saarthi Connect", hi: "सारथी कनेक्ट", icon: "🤝" },
  trust: { en: "Trust Audit", hi: "ट्रस्ट ऑडिट", icon: "🛡️" },
  micro: { en: "Micro-Storage", hi: "माइक्रो स्टोरेज", icon: "📦" },
  waitlist: { en: "Waitlist", hi: "प्रतीक्षा सूची", icon: "⏳" },
  meal: { en: "Meal Order", hi: "भोजन ऑर्डर", icon: "🍛" },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * Renders the 4-step status timeline for a booking record
 */
export function StudentBookingTimeline({
  currentStatus = "in_vault",
  isHi = false,
}: {
  currentStatus?: "booked" | "picked_up" | "in_vault" | "retrieved" | string;
  isHi?: boolean;
}) {
  const { role: persona } = usePersona();
  const tokens = getStudentMyBookingsTokens(persona);
  const stages = tokens.timelineStages;

  // Determine current active step index (1..4)
  const activeStep = useMemo(() => {
    switch (currentStatus) {
      case "booked":
        return 1;
      case "picked_up":
        return 2;
      case "in_vault":
        return 3;
      case "retrieved":
        return 4;
      default:
        return 3; // Default active status for demo is In Vault
    }
  }, [currentStatus]);

  const progressPercentage = useMemo(() => {
    return ((activeStep - 1) / (stages.length - 1)) * 100;
  }, [activeStep, stages.length]);

  const getStepIcon = (stepId: string, isCompleted: boolean, isCurrent: boolean) => {
    const iconClass = `h-4 w-4 ${
      isCurrent
        ? persona === "host"
          ? "text-amber-300"
          : "text-emerald-300"
        : isCompleted
        ? "text-cyan-400"
        : "text-slate-500"
    }`;

    switch (stepId) {
      case "booked":
        return <CheckCircle2 className={iconClass} />;
      case "picked_up":
        return <Truck className={iconClass} />;
      case "in_vault":
        return <ShieldCheck className={iconClass} />;
      case "retrieved":
        return <PackageCheck className={iconClass} />;
      default:
        return <CheckCircle2 className={iconClass} />;
    }
  };

  return (
    <div className="my-bookings-timeline-bar my-3 px-1">
      {/* Background Track Line */}
      <div className="timeline-track-line" />
      {/* Active Progress Bar */}
      <div
        className={`timeline-track-progress ${
          persona === "host"
            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
            : "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
        }`}
        style={{ width: `${progressPercentage}%` }}
      />

      {/* Timeline Step Dots */}
      <div className="relative z-10 w-full flex items-center justify-between">
        {stages.map((stage) => {
          const isCompleted = stage.step < activeStep;
          const isCurrent = stage.step === activeStep;

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center group relative cursor-pointer"
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isCurrent
                    ? persona === "host"
                      ? "bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-110"
                      : "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110 timeline-step-pulse-emerald"
                    : isCompleted
                    ? "bg-cyan-500/10 border-cyan-500/50"
                    : "bg-black/60 border-white/10"
                }`}
              >
                {getStepIcon(stage.id, isCompleted, isCurrent)}
              </div>

              {/* Step Label */}
              <span
                className={`text-[10px] mt-1.5 font-bold tracking-tight text-center whitespace-nowrap ${
                  isCurrent
                    ? persona === "host"
                      ? "text-amber-300 font-extrabold"
                      : "text-emerald-300 font-extrabold"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-500"
                }`}
              >
                {isHi ? stage.labelHi : stage.labelEn}
              </span>

              {/* Hover Tooltip / Status hint */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-11 bg-slate-900/95 border border-white/15 px-2.5 py-1 rounded-lg shadow-xl text-[10px] text-slate-200 pointer-events-none whitespace-nowrap z-30">
                <p className="font-bold text-cyan-300">
                  {isHi ? stage.badgeTextHi : stage.badgeTextEn}
                </p>
                <p className="text-slate-400 text-[9px]">
                  {isHi ? stage.descriptionHi : stage.descriptionEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MyBookingsDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { role: persona } = usePersona();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tokens = getStudentMyBookingsTokens(persona);

  // Filter records by current user's email
  const userBookings = useMemo(() => {
    if (!user?.email) return [];
    const all = getBookings().filter(
      (b) => b.email.toLowerCase() === user.email.toLowerCase()
    );

    if (statusFilter === "all") return all;
    if (statusFilter === "active") {
      return all.filter(
        (b) => !b.status || b.status === "in_vault" || b.status === "picked_up"
      );
    }
    if (statusFilter === "booked") {
      return all.filter((b) => b.status === "booked");
    }
    if (statusFilter === "retrieved") {
      return all.filter((b) => b.status === "retrieved");
    }
    return all;
  }, [user?.email, statusFilter]);

  const userMeals = useMemo(() => {
    if (!user?.email) return [];
    return getMealOrders();
  }, [user?.email]);

  const userWaitlist = useMemo(() => {
    if (!user?.email) return [];
    return getWaitlistEntries().filter(
      (w) => w.email.toLowerCase() === user.email.toLowerCase()
    );
  }, [user?.email]);

  const tabs: { key: Tab; labelEn: string; labelHi: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "bookings",
      labelEn: "Bookings & Vault",
      labelHi: "बुकिंग व वॉल्ट",
      icon: <Boxes className="h-3.5 w-3.5" />,
      count: userBookings.length,
    },
    {
      key: "meals",
      labelEn: "Meal Orders",
      labelHi: "भोजन ऑर्डर",
      icon: <Soup className="h-3.5 w-3.5" />,
      count: userMeals.length,
    },
    {
      key: "waitlist",
      labelEn: "Waitlist",
      labelHi: "प्रतीक्षा सूची",
      icon: <Users className="h-3.5 w-3.5" />,
      count: userWaitlist.length,
    },
  ];

  const toggleExpand = (id: string) => {
    playPop();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /**
   * Generates and downloads the GST Tax Invoice / Receipt for a booking
   */
  const handleDownloadInvoice = (b: BookingRecord) => {
    playSuccessChime();

    const invoiceContent = `
================================================================
          STASHSAARTHI TECHNOLOGIES PRIVATE LIMITED
               OFFICIAL GST TAX INVOICE / RECEIPT
================================================================
GSTIN: 09AAACS8839X1Z5   | HSN Code: 997712 (Safe Custody Services)
Date: ${formatDate(b.submittedAt)}
Invoice No: INV-${b.token || "STASH-8839"}

CUSTOMER DETAILS:
----------------------------------------------------------------
Name: ${b.name || user?.name || "Student"}
Email: ${b.email}
City / Campus: ${b.city || "Kakadeo, Kanpur"}

BOOKING BREAKDOWN:
----------------------------------------------------------------
Service Type: ${b.service.toUpperCase()} (Micro-Storage)
Storage Bags: ${b.bags || 1} Bag(s)
Duration: ${b.months || 1} Month(s)
Laser Barcode Seal: QR-SEAL-8839-X

PAYMENT SUMMARY:
----------------------------------------------------------------
Base Storage Rate: ₹${b.amount}
Platform Fee (0% Brokerage): ₹0.00
TPA Sec 105 Legal Custody Shield: INCLUDED (Complimentary)
₹10,000 Micro-Insurance Shield: INCLUDED (Complimentary)
Total Paid: ₹${b.amount} (${b.paymentMode || "UPI Instant"})

LEGAL NOTICE & LEGAL PROTECTION:
This booking is protected under Third-Party Bailee Sec 105 Rules.
Items sealed in senior host vaults remain 100% insured & monitored.
Support Hotline: +91 9369454350 | support@stashsaarthi.in
================================================================
`.trim();

    try {
      const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StashSaarthi_Invoice_${b.token || "Receipt"}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        isHi ? "जीएसटी चालान डाउनलोड हो गया!" : "Tax Invoice Downloaded!",
        {
          description: isHi
            ? "आपकी डिजिटल रसीद सफलतापूर्वक सहेज ली गई है।"
            : "Official GST receipt downloaded successfully.",
        }
      );
    } catch {
      toast.info(isHi ? "चालान जनरेट हो गया" : "Invoice Generated", {
        description: `Token: ${b.token} • Paid: ₹${b.amount}`,
      });
    }
  };

  // ─── Renderers ───────────────────────────────────────────────────────

  const renderBookingCard = (b: BookingRecord) => {
    const svc = SERVICE_LABELS[b.service] || SERVICE_LABELS["stash"]!;
    const isExpanded = expandedId === b.id;
    const currentStatus = b.status || "in_vault";

    return (
      <div
        key={b.id}
        className={`bg-black/50 border rounded-xl p-3.5 transition-all duration-300 ${
          isExpanded
            ? persona === "host"
              ? "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
              : "border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
            : "border-white/10 hover:border-cyan-500/30"
        }`}
      >
        <button
          onClick={() => toggleExpand(b.id)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{svc.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate">
                  {isHi ? svc.hi : svc.en}
                </p>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  {b.token}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-2.5 w-2.5 text-slate-400" />
                {formatDate(b.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
              <IndianRupee className="h-3 w-3" />
              {b.amount}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-cyan-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </button>

        {/* ─── Task 174: Interactive Status Timeline ─────────────── */}
        <StudentBookingTimeline currentStatus={currentStatus} isHi={isHi} />

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
              <div className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-400">{isHi ? "टोकन:" : "Token:"}</span>
                <span className="font-mono text-cyan-300 font-bold">{b.token}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-400">{isHi ? "भुगतान:" : "Payment:"}</span>
                <span className="text-white font-medium">{b.paymentMode || "UPI"}</span>
              </div>
              {b.bags && (
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>
                    {b.bags} {isHi ? "बैग" : "bags"} × {b.months || 1} {isHi ? "माह" : "mo"}
                  </span>
                </div>
              )}
              {b.city && (
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{b.city}</span>
                </div>
              )}
            </div>

            {b.message && (
              <div className="flex items-start gap-1.5 bg-black/40 p-2 rounded-lg text-slate-400 text-[11px] italic border border-white/5">
                <MessageCircle className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{b.message}</span>
              </div>
            )}

            {/* Legal Shield & Insurance Badge */}
            <div className="flex items-center justify-between gap-2 text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1.5 rounded-lg">
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-cyan-400" />
                {tokens.invoiceConfig.legalShield}
              </span>
              <span className="font-semibold text-emerald-400">
                {tokens.invoiceConfig.insuranceCover}
              </span>
            </div>

            {/* ─── Task 174: Download Tax Invoice Trigger Button ──────── */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadInvoice(b);
                }}
                className={`invoice-download-btn ${tokens.currentTheme.invoiceBtn}`}
              >
                <Download className="h-3.5 w-3.5" />
                <span>
                  {isHi
                    ? tokens.invoiceConfig.downloadBtnHi
                    : tokens.invoiceConfig.downloadBtnEn}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMealCard = (m: MealOrderRecord) => {
    const isExpanded = expandedId === m.id;

    return (
      <div
        key={m.id}
        className="bg-black/40 border border-white/8 rounded-xl p-3.5 hover:border-amber-500/20 transition-colors"
      >
        <button
          onClick={() => toggleExpand(m.id)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">🍲</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {m.mealType || (isHi ? "भोजन ऑर्डर" : "Meal Order")}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(m.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-amber-400 flex items-center">
              <IndianRupee className="h-3 w-3" />
              {m.amount}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
            {m.kitchenNode && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{isHi ? "किचन:" : "Kitchen:"}</span>
                <span className="text-amber-300 font-semibold">{m.kitchenNode}</span>
              </div>
            )}
            {m.deliverySlot && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{m.deliverySlot}</span>
              </div>
            )}
            {m.address && (
              <div className="flex items-start gap-1.5">
                <span className="text-slate-400">{isHi ? "पता:" : "Address:"}</span>
                <span>{m.address}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWaitlistCard = (w: WaitlistRecord) => (
    <div
      key={w.id}
      className="bg-black/40 border border-white/8 rounded-xl p-3.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">
            {w.user_type === "host" ? "🏠" : "🎓"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{w.full_name}</p>
            <p className="text-[10px] text-slate-400">
              {w.college_or_locality || w.source || (isHi ? "प्रतीक्षा सूची" : "Waitlist")}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 shrink-0">
          {formatDate(w.submittedAt)}
        </p>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="py-2">
      <PersonaEmptyState
        title={isHi ? "अभी तक कोई बुकिंग नहीं पाई गई" : "No Matching Bookings Found"}
        titleHi="अभी तक कोई बुकिंग नहीं पाई गई"
        description={
          activeTab === "bookings"
            ? isHi
              ? "जब आप स्टैश या रूम बुक करेंगे तो आपकी डिजिटल रसीदें यहाँ दिखाई देंगी।"
              : "Your active micro-storage bookings and vault status will appear here automatically."
            : activeTab === "meals"
            ? isHi
              ? "जब आप भोजन ऑर्डर करेंगे तो आपके टिफिन ऑर्डर टोकन यहाँ दिखाई देंगे।"
              : "Your homestyle meal delivery orders will appear here."
            : isHi
            ? "आपकी प्रतीक्षा सूची आवेदन यहाँ दिखाई देंगे।"
            : "Your campus waitlist inquiries will appear here."
        }
        descriptionHi={
          activeTab === "bookings"
            ? "जब आप स्टैश या रूम बुक करेंगे तो आपकी डिजिटल रसीदें यहाँ दिखाई देंगी।"
            : activeTab === "meals"
            ? "जब आप भोजन ऑर्डर करेंगे तो आपके टिफिन ऑर्डर टोकन यहाँ दिखाई देंगे।"
            : "आपकी प्रतीक्षा सूची आवेदन यहाँ दिखाई देंगे।"
        }
      />
    </div>
  );

  return (
    <div className="student-bookings-hub-container p-3 space-y-3">
      {/* Console Header Banner */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
            {isHi ? tokens.consoleTitleHi : tokens.consoleTitleEn}
          </h3>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
          LIVE TELEMETRY
        </span>
      </div>

      {/* Main Category Tabs */}
      <div className="flex bg-black/50 border border-white/10 rounded-lg p-1 gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playClick();
              setActiveTab(tab.key);
            }}
            className={`flex-1 py-2 px-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? persona === "host"
                  ? "bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30"
                  : "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                : "text-slate-400 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span>{isHi ? tab.labelHi : tab.labelEn}</span>
            {tab.count > 0 && (
              <span
                className={`ml-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-cyan-500/30 text-cyan-200"
                    : "bg-white/10 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Status Filter Bar for Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
          {tokens.filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                playClick();
                setStatusFilter(opt.id as StatusFilter);
              }}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                statusFilter === opt.id
                  ? persona === "host"
                    ? "bg-amber-500 text-black shadow-md font-bold"
                    : "bg-cyan-400 text-black shadow-md font-bold"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
              }`}
            >
              {isHi ? opt.labelHi : opt.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Booking Cards Content */}
      <div className="max-h-[45vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === "bookings" &&
          (userBookings.length > 0
            ? userBookings.map(renderBookingCard)
            : renderEmpty())}

        {activeTab === "meals" &&
          (userMeals.length > 0
            ? userMeals.map(renderMealCard)
            : renderEmpty())}

        {activeTab === "waitlist" &&
          (userWaitlist.length > 0
            ? userWaitlist.map(renderWaitlistCard)
            : renderEmpty())}
      </div>
    </div>
  );
}
