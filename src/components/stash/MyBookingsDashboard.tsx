/**
 * StashSaarthi — My Bookings Dashboard
 * Shows logged-in user's booking history, meal orders, and waitlist submissions.
 * Reads from localStorage via localSubmissions.ts, filtered by user email.
 */

import { useState, useMemo, useEffect } from "react";
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
  Receipt,
  Eye,
  QrCode,
  WifiOff,
  RefreshCw,
  RotateCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { downloadInvoicePdf } from "@/lib/pdfInvoiceEngine";
import {
  getBookings,
  getMealOrders,
  getWaitlistEntries,
  type BookingRecord,
  type MealOrderRecord,
  type WaitlistRecord,
} from "@/lib/localSubmissions";
import { BookingDetailDrawer } from "./BookingDetailDrawer";
import { CampusEmptyStateDelight } from "./CampusEmptyStateDelight";
import { BookingLiveStatusBadge } from "./BookingLiveStatusBadge";

type Tab = "bookings" | "meals" | "waitlist";

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

type StatusFilter = "all" | "active" | "completed" | "cancelled";
type VerticalFilter = "all" | "stash" | "kitchen" | "spaces" | "connect";

const VERTICAL_FILTERS: { key: VerticalFilter; labelEn: string; labelHi: string; icon: string }[] =
  [
    { key: "all", labelEn: "All Services", labelHi: "सभी सेवाएं", icon: "✨" },
    { key: "stash", labelEn: "Luggage Stash", labelHi: "लगेज स्टैश", icon: "🎒" },
    { key: "kitchen", labelEn: "Kitchen Subscriptions", labelHi: "किचन सब्सक्रिप्शन", icon: "🍲" },
    { key: "spaces", labelEn: "Spaces Lease", labelHi: "स्पेस लीज", icon: "🏠" },
    { key: "connect", labelEn: "Connect Sessions", labelHi: "कनेक्ट सेशंस", icon: "🤝" },
  ];

export function MyBookingsDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === "hi";
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [verticalFilter, setVerticalFilter] = useState<VerticalFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper to resolve status for booking
  const getBookingStatus = (b: BookingRecord): "active" | "completed" | "cancelled" => {
    if (b.status) return b.status;
    const date = new Date(b.submittedAt).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return date > thirtyDaysAgo ? "active" : "completed";
  };

  // Filter records by current user's email
  const rawUserBookings = useMemo(() => {
    if (!isMounted) return [];
    if (!user?.email) return [];
    return getBookings().filter((b) => b.email.toLowerCase() === user.email.toLowerCase());
  }, [user?.email, isMounted]);

  const verticalCounts = useMemo(() => {
    const counts: Record<VerticalFilter, number> = {
      all: rawUserBookings.length,
      stash: 0,
      kitchen: 0,
      spaces: 0,
      connect: 0,
    };
    rawUserBookings.forEach((b) => {
      if (b.service === "stash" || b.service === "micro") counts.stash++;
      else if (b.service === "kitchen" || b.service === "meal") counts.kitchen++;
      else if (b.service === "spaces") counts.spaces++;
      else if (b.service === "connect") counts.connect++;
    });
    return counts;
  }, [rawUserBookings]);

  const userBookings = useMemo(() => {
    let list = rawUserBookings;
    if (statusFilter !== "all") {
      list = list.filter((b) => getBookingStatus(b) === statusFilter);
    }
    if (verticalFilter !== "all") {
      if (verticalFilter === "stash") {
        list = list.filter((b) => b.service === "stash" || b.service === "micro");
      } else if (verticalFilter === "kitchen") {
        list = list.filter((b) => b.service === "kitchen" || b.service === "meal");
      } else if (verticalFilter === "spaces") {
        list = list.filter((b) => b.service === "spaces");
      } else if (verticalFilter === "connect") {
        list = list.filter((b) => b.service === "connect");
      }
    }
    return list;
  }, [rawUserBookings, statusFilter, verticalFilter]);

  const userMeals = useMemo(() => {
    if (!isMounted) return [];
    if (!user?.email) return [];
    // Meal orders may not have email; show all if user is logged in
    return getMealOrders();
  }, [user?.email, isMounted]);

  const userWaitlist = useMemo(() => {
    if (!isMounted) return [];
    if (!user?.email) return [];
    return getWaitlistEntries().filter((w) => w.email.toLowerCase() === user.email.toLowerCase());
  }, [user?.email, isMounted]);

  const tabs: {
    key: Tab;
    labelEn: string;
    labelHi: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: "bookings",
      labelEn: "Bookings",
      labelHi: "बुकिंग",
      icon: <Boxes className="h-3.5 w-3.5" />,
      count: rawUserBookings.length,
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
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ─── One-Click Rebook & Renewal Handlers (Task 107) ─────────────────

  const handleRebook = (b: BookingRecord) => {
    const serviceName = b.service === "micro" ? "stash" : b.service;
    const eventNote = `Renewing/Rebooking Token ${b.token} (${b.name || serviceName})`;

    window.dispatchEvent(
      new CustomEvent("stashsaarthi:open-booking", {
        detail: {
          service: serviceName,
          note: eventNote,
        },
      }),
    );

    toast.success(
      isHi ? `नवीनीकरण फॉर्म खोला गया: ${b.token}` : `Opening renewal booking for ${b.token}...`,
      {
        description: isHi
          ? "विवरण स्वचालित रूप से लोड हो गए हैं।"
          : "Previous booking specs loaded into 1-tap checkout.",
      },
    );
  };

  const handleReorderMeal = (m: MealOrderRecord) => {
    window.dispatchEvent(
      new CustomEvent("stashsaarthi:open-booking", {
        detail: {
          service: "kitchen",
          note: `Reordering meal pack: ${m.mealType || "Standard Thali"} at ${m.kitchenNode || "Kakadeo Hub"}`,
        },
      }),
    );

    toast.success(
      isHi ? `भोजन पुनः ऑर्डर फॉर्म खोला गया...` : `Opening meal pack reorder form...`,
      {
        description: isHi
          ? "आपका पसंदीदा किचन और विवरण लोड किया गया।"
          : "Your preferred kitchen node has been pre-selected.",
      },
    );
  };

  // ─── Renderers ───────────────────────────────────────────────────────

  const renderBookingCard = (b: BookingRecord) => {
    const svc = SERVICE_LABELS[b.service] || SERVICE_LABELS["stash"]!;
    const isExpanded = expandedId === b.id;
    const status = getBookingStatus(b);
    const statusConfig = {
      active: {
        labelEn: "Active",
        labelHi: "सक्रिय",
        style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      },
      completed: {
        labelEn: "Completed",
        labelHi: "पूर्ण",
        style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      },
      cancelled: {
        labelEn: "Cancelled",
        labelHi: "रद्द",
        style: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      },
    }[status];

    return (
      <div
        key={b.id}
        className="bg-black/40 border border-white/8 rounded-xl p-3.5 hover:border-cyan-500/20 transition-colors"
      >
        <button
          onClick={() => toggleExpand(b.id)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">{svc.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate">
                  {isHi ? svc.hi : svc.en}
                </p>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${statusConfig.style}`}
                >
                  {isHi ? statusConfig.labelHi : statusConfig.labelEn}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(b.submittedAt)}
              </p>
              <div className="mt-1">
                <BookingLiveStatusBadge
                  bookingId={b.id}
                  submittedAt={b.submittedAt}
                  currentStatus={b.status}
                  showStepper={isExpanded}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <IndianRupee className="h-3 w-3" />
              {b.amount}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRebook(b);
              }}
              title={isHi ? "स्लॉट नवीनीकृत / पुनः बुक करें" : "One-Click Renew / Rebook"}
              className="p-1 px-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <RotateCw className="h-3 w-3 text-emerald-400" />
              <span>{isHi ? "नवीनीकृत" : "Renew"}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooking(b);
              }}
              title={isHi ? "ऑफ़लाइन QR कोड देखें" : "View Offline QR Pass"}
              className="p-1 px-2 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <QrCode className="h-3 w-3" />
              <span>QR Pass</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooking(b);
              }}
              title={isHi ? "रसीद व विवरण देखें" : "View Receipt & Details"}
              className="p-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
            >
              <Receipt className="h-3.5 w-3.5" />
            </button>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Hash className="h-3 w-3 text-cyan-400" />
              <span className="text-slate-400">{isHi ? "टोकन:" : "Token:"}</span>
              <span className="font-mono text-cyan-300">{b.token}</span>
            </div>
            {b.name && (
              <div className="flex items-center gap-1.5">
                <Package className="h-3 w-3 text-slate-400" />
                <span>{b.name}</span>
              </div>
            )}
            {b.city && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{isHi ? "शहर:" : "City:"}</span>
                <span>{b.city}</span>
              </div>
            )}
            {b.bags && (
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3 text-slate-400" />
                <span>
                  {b.bags} {isHi ? "बैग" : "bags"} × {b.months || 1} {isHi ? "महीने" : "months"}
                </span>
              </div>
            )}
            {b.message && (
              <div className="flex items-start gap-1.5">
                <MessageCircle className="h-3 w-3 text-slate-400 mt-0.5" />
                <span className="text-slate-400 italic">{b.message}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">{isHi ? "भुगतान:" : "Payment:"}</span>
              <span>{b.paymentMode}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setSelectedBooking(b)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg py-1.5 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isHi ? "ऑफ़लाइन QR पास" : "Offline QR Pass"}</span>
              </button>

              <button
                onClick={() => setSelectedBooking(b)}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg py-1.5 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Receipt className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isHi ? "रसीद व विवरण" : "View Receipt"}</span>
              </button>

              <button
                onClick={async () => {
                  try {
                    await downloadInvoicePdf(b);
                    toast.success(
                      isHi ? "GST चालान PDF डाउनलोड हुआ!" : "GST Invoice PDF downloaded!",
                    );
                  } catch (e) {
                    toast.error(isHi ? "PDF जनरेट नहीं हो सका" : "Failed to generate PDF invoice");
                  }
                }}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg py-1.5 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title={isHi ? "GST टैक्स चालान PDF डाउनलोड करें" : "Download GST Tax Invoice PDF"}
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isHi ? "GST चालान PDF" : "PDF Invoice"}</span>
              </button>
            </div>

            <button
              onClick={() => handleRebook(b)}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <RefreshCw className="h-3.5 w-3.5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>
                {b.service === "stash" || b.service === "micro"
                  ? isHi
                    ? "स्लॉट नवीनीकृत करें (Renew Storage Slot)"
                    : "Renew Storage Slot"
                  : b.service === "kitchen" || b.service === "meal"
                    ? isHi
                      ? "टिफिन कूपन पुनः ऑर्डर करें (Reorder Meal Pack)"
                      : "Reorder Meal Pack"
                    : b.service === "spaces"
                      ? isHi
                        ? "स्टे नवीनीकृत करें (Renew Room Stay)"
                        : "Renew Room Stay"
                      : isHi
                        ? "सेक्शन पुनः बुक करें (Rebook Session)"
                        : "Rebook Session"}
              </span>
            </button>
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
            <span className="text-lg shrink-0">🍲</span>
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReorderMeal(m);
              }}
              title={isHi ? "भोजन पुनः ऑर्डर करें" : "One-Click Reorder"}
              className="p-1 px-2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <RotateCw className="h-3 w-3 text-amber-400" />
              <span>{isHi ? "पुनः ऑर्डर" : "Reorder"}</span>
            </button>
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
                <span>{m.kitchenNode}</span>
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

            <button
              onClick={() => handleReorderMeal(m)}
              className="w-full mt-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <RotateCw className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>{isHi ? "थॉली / टिफिन पैक पुनः ऑर्डर करें" : "Reorder This Meal Pack"}</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderWaitlistCard = (w: WaitlistRecord) => (
    <div key={w.id} className="bg-black/40 border border-white/8 rounded-xl p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0">{w.user_type === "host" ? "🏠" : "🎓"}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{w.full_name}</p>
            <p className="text-[10px] text-slate-400">
              {w.college_or_locality || w.source || (isHi ? "प्रतीक्षा सूची" : "Waitlist")}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 shrink-0">{formatDate(w.submittedAt)}</p>
      </div>
    </div>
  );

  // ─── Empty state ─────────────────────────────────────────────────────

  const renderEmpty = () => {
    if (activeTab === "bookings") {
      return <CampusEmptyStateDelight />;
    }

    return (
      <div className="text-center py-10 px-4">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm font-semibold text-slate-300">
          {isHi ? "अभी तक कोई रिकॉर्ड नहीं" : "No records yet"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === "meals"
            ? isHi
              ? "जब आप भोजन ऑर्डर करेंगे तो यहाँ दिखेगा।"
              : "Your meal orders will appear here."
            : isHi
              ? "आपकी प्रतीक्षा सूची यहाँ दिखेगी।"
              : "Your waitlist submissions will appear here."}
        </p>
      </div>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────────

  return (
    <div className="space-y-3" suppressHydrationWarning={true}>
      {/* Active User Live Profile Banner (Task 108) */}
      {user && (
        <div className="bg-gradient-to-r from-cyan-950/40 via-black/60 to-emerald-950/30 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Saarthi"}
                alt={user.name}
                loading="lazy"
                decoding="async"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-cyan-400 bg-black/80 object-cover shadow"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black"
                title="Verified Session"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                  {user.role === "host" ? (isHi ? "होस्ट" : "Host") : isHi ? "छात्र" : "Student"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg shrink-0">
            {isHi ? "लाइव सिंक ⚡" : "Live Cached ⚡"}
          </span>
        </div>
      )}

      {/* Tab Pills */}
      <div className="flex bg-black/50 border border-white/10 rounded-lg p-1 gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-2 text-[11px] font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
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

      {/* Vertical-Wise Service Filters */}
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-0.5">
          {isHi ? "वर्टिकल फ़िल्टर:" : "Vertical Filter:"}
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {VERTICAL_FILTERS.map((vf) => {
            const count = verticalCounts[vf.key];
            const isActive = verticalFilter === vf.key;
            return (
              <button
                key={vf.key}
                onClick={() => {
                  setVerticalFilter(vf.key);
                  if (
                    activeTab !== "bookings" &&
                    (vf.key === "stash" || vf.key === "spaces" || vf.key === "connect")
                  ) {
                    setActiveTab("bookings");
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shrink-0 transition-all font-medium ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm font-semibold"
                    : "bg-black/40 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <span>{vf.icon}</span>
                <span>{isHi ? vf.labelHi : vf.labelEn}</span>
                {count > 0 && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-cyan-500/30 text-cyan-200" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Pills for Bookings */}
      {activeTab === "bookings" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          {(
            [
              { key: "all", labelEn: "All", labelHi: "सभी" },
              { key: "active", labelEn: "Active", labelHi: "सक्रिय" },
              { key: "completed", labelEn: "Completed", labelHi: "पूर्ण" },
              { key: "cancelled", labelEn: "Cancelled", labelHi: "रद्द" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-2.5 py-1 rounded-full border transition-all ${
                statusFilter === f.key
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold"
                  : "bg-black/30 text-slate-400 border-white/5 hover:border-white/20"
              }`}
            >
              {isHi ? f.labelHi : f.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === "bookings" &&
          (userBookings.length > 0 ? userBookings.map(renderBookingCard) : renderEmpty())}

        {activeTab === "meals" &&
          (userMeals.length > 0 ? userMeals.map(renderMealCard) : renderEmpty())}

        {activeTab === "waitlist" &&
          (userWaitlist.length > 0 ? userWaitlist.map(renderWaitlistCard) : renderEmpty())}
      </div>

      <BookingDetailDrawer
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
