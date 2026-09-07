/**
 * StashSaarthi — My Bookings Dashboard
 * Shows logged-in user's booking history, meal orders, and waitlist submissions.
 * Reads from localStorage via localSubmissions.ts, filtered by user email.
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import {
  getBookings,
  getMealOrders,
  getWaitlistEntries,
  type BookingRecord,
  type MealOrderRecord,
  type WaitlistRecord,
} from "@/lib/localSubmissions";

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

export function MyBookingsDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === "hi";
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter records by current user's email
  const userBookings = useMemo(() => {
    if (!user?.email) return [];
    return getBookings().filter(
      (b) => b.email.toLowerCase() === user.email.toLowerCase(),
    );
  }, [user?.email]);

  const userMeals = useMemo(() => {
    if (!user?.email) return [];
    // Meal orders may not have email; show all if user is logged in
    return getMealOrders();
  }, [user?.email]);

  const userWaitlist = useMemo(() => {
    if (!user?.email) return [];
    return getWaitlistEntries().filter(
      (w) => w.email.toLowerCase() === user.email.toLowerCase(),
    );
  }, [user?.email]);

  const tabs: { key: Tab; labelEn: string; labelHi: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "bookings",
      labelEn: "Bookings",
      labelHi: "बुकिंग",
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
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ─── Renderers ───────────────────────────────────────────────────────

  const renderBookingCard = (b: BookingRecord) => {
    const svc = SERVICE_LABELS[b.service] || SERVICE_LABELS["stash"]!;
    const isExpanded = expandedId === b.id;

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
              <p className="text-sm font-semibold text-white truncate">
                {isHi ? svc.hi : svc.en}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(b.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <IndianRupee className="h-3 w-3" />
              {b.amount}
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
                <span>{b.bags} {isHi ? "बैग" : "bags"} × {b.months || 1} {isHi ? "महीने" : "months"}</span>
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
          <span className="text-lg shrink-0">
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

  // ─── Empty state ─────────────────────────────────────────────────────

  const renderEmpty = () => (
    <div className="text-center py-10 px-4">
      <div className="text-4xl mb-3">📭</div>
      <p className="text-sm font-semibold text-slate-300">
        {isHi ? "अभी तक कोई रिकॉर्ड नहीं" : "No records yet"}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {activeTab === "bookings"
          ? isHi
            ? "जब आप स्टैश, रूम या किचन बुक करेंगे तो यहाँ दिखेगा।"
            : "Your bookings will appear here once you book a stash, room, or meal."
          : activeTab === "meals"
            ? isHi
              ? "जब आप भोजन ऑर्डर करेंगे तो यहाँ दिखेगा।"
              : "Your meal orders will appear here."
            : isHi
              ? "आपकी प्रतीक्षा सूची यहाँ दिखेगी।"
              : "Your waitlist submissions will appear here."}
      </p>
    </div>
  );

  // ─── Main Render ─────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
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

      {/* Content */}
      <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10">
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
