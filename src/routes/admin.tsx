import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const ExecutiveAnalyticsDashboard = lazy(() =>
  import("@/components/stash/ExecutiveAnalyticsDashboard").then((m) => ({ default: m.ExecutiveAnalyticsDashboard }))
);
const ApiPenTestModal = lazy(() =>
  import("@/components/stash/ApiPenTestModal").then((m) => ({ default: m.ApiPenTestModal }))
);
const AndroidGoPerfModal = lazy(() =>
  import("@/components/stash/AndroidGoPerfModal").then((m) => ({ default: m.AndroidGoPerfModal }))
);
const EdgeRegionMonitorWidget = lazy(() =>
  import("@/components/stash/EdgeRegionMonitorWidget").then((m) => ({ default: m.EdgeRegionMonitorWidget }))
);
import {
  getBookings,
  getWaitlistEntries,
  getMealOrders,
  getReviews,
  getSuggestions,
  getAdminStats,
  toggleContacted,
  getContactedIds,
  deleteBooking,
  type BookingRecord,
  type WaitlistRecord,
  type MealOrderRecord,
  type ReviewRecord,
  type SuggestionRecord,
  type AdminStats,
} from "@/lib/localSubmissions";
import { fetchVisitorSessions, type VisitorRow } from "@/lib/visitorTracking";
import {
  Lock,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  MessageCircle,
  CheckCircle2,
  Boxes,
  Home,
  Soup,
  HandHeart,
  ShieldAlert,
  Briefcase,
  Users,
  Star,
  Lightbulb,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  TrendingUp,
  ChevronRight,
  Tag,
  Package,
  Clock,
  X,
  Monitor,
  Activity,
  Globe,
  Smartphone,
  Tablet,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "StashSaarthi Admin — Offline Operations Console" },
      {
        name: "description",
        content:
          "Secure offline admin dashboard for StashSaarthi — view all service bookings, waitlist, meal orders, reviews, and suggestions without Supabase.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPageWrapped,
});

function AdminPageWrapped() {
  return (
    <ErrorBoundary sectionName="Admin Portal">
      <AdminPage />
    </ErrorBoundary>
  );
}

// ─── Service config ──────────────────────────────────────────────────────────
const SERVICE_META: Record<
  string,
  { label: string; color: string; icon: React.ElementType; badge: string }
> = {
  stash: { label: "Saarthi Stash", color: "emerald", icon: Boxes, badge: "300/mo" },
  spaces: { label: "Saarthi Spaces", color: "cyan", icon: Home, badge: "Zero Brokerage" },
  kitchen: { label: "Saarthi Kitchen", color: "amber", icon: Soup, badge: "90/meal" },
  connect: { label: "Saarthi Connect", color: "violet", icon: HandHeart, badge: "Mentorship" },
  trust: { label: "Trust & Audit", color: "rose", icon: ShieldAlert, badge: "Safety" },
  micro: { label: "Host Monetize", color: "orange", icon: Briefcase, badge: "Earn 11.5k+" },
  waitlist: { label: "Waitlist", color: "sky", icon: Users, badge: "Lead" },
  meal: { label: "Meal Order", color: "amber", icon: Soup, badge: "Token" },
};

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; badge: string }> =
  {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      text: "text-violet-400",
      badge: "bg-violet-500/20 text-violet-300",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      badge: "bg-rose-500/20 text-rose-300",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      badge: "bg-orange-500/20 text-orange-300",
    },
    sky: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-400",
      badge: "bg-sky-500/20 text-sky-300",
    },
  };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function waLink(phone: string, name: string): string {
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(
    `Hi ${name}, this is your StashSaarthi Concierge — Advik here! How can I help you?`,
  )}`;
}

function exportCSV(data: object[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]!);
  const rows = data.map((row) =>
    headers.map((h) => JSON.stringify((row as Record<string, unknown>)[h] ?? "")).join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  const c = COLOR_CLASSES[color] || COLOR_CLASSES["emerald"]!;
  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-4 flex items-center gap-4 transition-all hover:scale-[1.02]`}
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.bg} border ${c.border} shrink-0`}
      >
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <div className="min-w-0">
        <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        {sub && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Detail Chip ─────────────────────────────────────────────────────────────
function DetailChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-xs font-medium text-foreground truncate">{value}</div>
    </div>
  );
}

// ─── Booking Card ────────────────────────────────────────────────────────────
function BookingCard({
  b,
  contacted,
  onToggleContacted,
  onDelete,
}: {
  b: BookingRecord;
  contacted: boolean;
  onToggleContacted: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = SERVICE_META[b.service] || SERVICE_META["stash"]!;
  const c = COLOR_CLASSES[meta.color] || COLOR_CLASSES["emerald"]!;
  const Icon = meta.icon;

  const isTempEmail = b.email?.includes("@temp.stashsaarthi-web.vercel.app");

  return (
    <div
      className={`rounded-2xl border ${c.border} bg-white/[0.03] hover:bg-white/[0.05] transition-all overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center ${c.bg} border ${c.border} shrink-0`}
        >
          <Icon className={`h-4 w-4 ${c.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{b.name}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}
            >
              {meta.label}
            </span>
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded-full">
              {b.token}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mt-1">
            {b.phone && b.phone !== "N/A" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />{b.phone}
              </span>
            )}
            {b.city && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />{b.city}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />{fmtDate(b.submittedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-emerald-400">
            {b.amount > 0 ? `\u20b9${b.amount}` : "Free"}
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronRight
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {b.bags !== undefined && (
              <DetailChip icon={Package} label="Bags" value={`${b.bags} bags`} />
            )}
            {b.months !== undefined && (
              <DetailChip icon={Calendar} label="Months" value={`${b.months} months`} />
            )}
            {b.roomType && (
              <DetailChip icon={Home} label="Room Type" value={b.roomType} />
            )}
            {b.moveInDate && (
              <DetailChip icon={Calendar} label="Move-in" value={b.moveInDate || "Immediate"} />
            )}
            {b.mealPlan && (
              <DetailChip icon={Soup} label="Meal Plan" value={b.mealPlan} />
            )}
            {b.dietType && (
              <DetailChip icon={Tag} label="Diet" value={b.dietType} />
            )}
            {b.personalizations && b.personalizations.length > 0 && (
              <DetailChip
                icon={Star}
                label="Preferences"
                value={b.personalizations.join(", ")}
              />
            )}
            {b.connectDomain && (
              <DetailChip icon={HandHeart} label="Domain" value={b.connectDomain} />
            )}
            {b.auditType && (
              <DetailChip icon={ShieldCheck} label="Audit Type" value={b.auditType} />
            )}
            {b.monetizeAsset && (
              <DetailChip icon={Briefcase} label="Asset" value={b.monetizeAsset} />
            )}
            {b.pincode && (
              <DetailChip icon={MapPin} label="PIN" value={b.pincode} />
            )}
            {b.paymentMode && (
              <DetailChip icon={IndianRupee} label="Payment" value={b.paymentMode} />
            )}
            {!isTempEmail && b.email && (
              <DetailChip icon={Mail} label="Email" value={b.email} />
            )}
          </div>

          {b.message && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-muted-foreground font-mono break-all leading-relaxed">
              {b.message}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap pt-1">
            {b.phone && b.phone !== "N/A" && (
              <a
                href={waLink(b.phone, b.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-xs font-medium px-3 py-1.5 hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                WhatsApp
              </a>
            )}
            <button
              onClick={onToggleContacted}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                contacted
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                  : "border-white/20 bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {contacted ? "Contacted" : "Mark Contacted"}
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium px-3 py-1.5 hover:bg-red-500/15 transition-colors ml-auto"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-16 flex flex-col items-center justify-center text-center px-4">
      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs">{sub}</p>
    </div>
  );
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = "executive" | "bookings" | "waitlist" | "meals" | "reviews" | "suggestions" | "visitors";

// ─── Main AdminPage ───────────────────────────────────────────────────────────
function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("executive");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>([]);
  const [meals, setMeals] = useState<MealOrderRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [isPenTestOpen, setIsPenTestOpen] = useState(false);
  const [isAndroidGoPerfOpen, setIsAndroidGoPerfOpen] = useState(false);

  const loadData = useCallback(() => {
    setBookings(getBookings());
    setWaitlist(getWaitlistEntries());
    setMeals(getMealOrders());
    setReviews(getReviews());
    setSuggestions(getSuggestions());
    setStats(getAdminStats());
    setContactedIds(getContactedIds());
  }, []);

  const loadVisitors = useCallback(async () => {
    setVisitorsLoading(true);
    const rows = await fetchVisitorSessions(200);
    setVisitors(rows);
    setVisitorsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadVisitors();
    }
  }, [isAuthenticated, loadData, loadVisitors]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "stash2026") {
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid password. Use the operator password.");
    }
  };

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center"
        >
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Lock className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Operator Console</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Offline Admin — Zero Supabase Dependency
          </p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mb-4 bg-white/5 border-white/10 text-center tracking-[0.25em] text-lg"
            autoFocus
          />
          {loginError && (
            <p className="text-xs text-red-400 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl"
          >
            Unlock Dashboard
          </Button>
          <p className="text-[10px] text-muted-foreground/50 mt-4">
            All data is stored locally in this browser. No server calls required.
          </p>
        </form>
      </div>
    );
  }

  // ── Derived filtered lists ──────────────────────────────────────────────
  const q = search.toLowerCase();

  const filteredBookings = bookings.filter((b) => {
    const matchService = serviceFilter === "all" || b.service === serviceFilter;
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.token.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q);
    return matchService && matchSearch;
  });

  const filteredWaitlist = waitlist.filter(
    (w) =>
      !q ||
      (w.full_name || "").toLowerCase().includes(q) ||
      (w.phone_number || "").toLowerCase().includes(q) ||
      (w.email || "").toLowerCase().includes(q) ||
      (w.college_or_locality || "").toLowerCase().includes(q),
  );

  const filteredMeals = meals.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.mealType.toLowerCase().includes(q) ||
      m.kitchenNode.toLowerCase().includes(q),
  );

  const filteredReviews = reviews.filter(
    (r) =>
      !q ||
      (r.name || "").toLowerCase().includes(q) ||
      (r.comment || "").toLowerCase().includes(q) ||
      (r.service || "").toLowerCase().includes(q),
  );

  const filteredSuggestions = suggestions.filter(
    (s) => !q || (s.text || "").toLowerCase().includes(q),
  );

  const TABS: { id: Tab; label: string; count: number; icon: React.ElementType }[] = [
    { id: "executive", label: "Executive Analytics", count: 0, icon: TrendingUp },
    { id: "bookings", label: "Bookings", count: bookings.length, icon: Boxes },
    { id: "waitlist", label: "Waitlist", count: waitlist.length, icon: Users },
    { id: "meals", label: "Meal Orders", count: meals.length, icon: Soup },
    { id: "reviews", label: "Reviews", count: reviews.length, icon: Star },
    { id: "suggestions", label: "Suggestions", count: suggestions.length, icon: Lightbulb },
    { id: "visitors", label: "Visitors", count: visitors.length, icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                StashSaarthi Admin
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium">
                Offline Mode — localStorage only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAndroidGoPerfOpen(true)}
              className="h-8 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
              title="Run Android Go Mobile Performance Audit"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Android Go Audit</span>
            </button>
            <button
              onClick={() => setIsPenTestOpen(true)}
              className="h-8 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors"
              title="Run API Security Pen-Test"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">API Pen-Test</span>
            </button>
            <button
              onClick={loadData}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search all..."
                className="h-8 pl-8 pr-8 w-44 sm:w-56 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Total Bookings" value={stats.totalBookings} color="emerald" icon={Boxes} />
            <StatCard label="Waitlist Leads" value={stats.totalWaitlist} color="sky" icon={Users} />
            <StatCard label="Meal Orders" value={stats.totalMealOrders} color="amber" icon={Soup} />
            <StatCard label="Reviews" value={stats.totalReviews} color="violet" icon={Star} />
            <StatCard
              label="Est. Revenue"
              value={`\u20b9${stats.revenueEstimate.toLocaleString("en-IN")}`}
              sub="from local bookings"
              color="orange"
              icon={TrendingUp}
            />
          </div>
        )}

        {/* Service filter pills */}
        {stats && Object.keys(stats.serviceBreakdown).length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setServiceFilter("all")}
              className={`text-xs px-3 py-1 rounded-full border transition-colors font-medium ${
                serviceFilter === "all"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              All Services
            </button>
            {Object.entries(stats.serviceBreakdown).map(([svc, count]) => {
              const meta = SERVICE_META[svc];
              if (!meta) return null;
              const c = COLOR_CLASSES[meta.color] || COLOR_CLASSES["emerald"]!;
              return (
                <button
                  key={svc}
                  onClick={() => setServiceFilter(serviceFilter === svc ? "all" : svc)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors font-medium flex items-center gap-1.5 ${
                    serviceFilter === svc
                      ? `${c.bg} ${c.border} ${c.text}`
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {meta.label}
                  <span className="font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/8 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Executive Analytics ── */}
        {activeTab === "executive" && (
          <ExecutiveAnalyticsDashboard />
        )}

        {/* ── Bookings ── */}
        {activeTab === "bookings" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
                {search && ` matching "${search}"`}
              </p>
              {bookings.length > 0 && (
                <button
                  onClick={() => exportCSV(bookings, "stashsaarthi-bookings")}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
              )}
            </div>
            {filteredBookings.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="No bookings yet"
                sub={
                  search
                    ? "No bookings match your search."
                    : "Complete a booking via any service to see it here."
                }
              />
            ) : (
              filteredBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  b={b}
                  contacted={contactedIds.has(b.id)}
                  onToggleContacted={() => setContactedIds(toggleContacted(b.id))}
                  onDelete={() => {
                    deleteBooking(b.id);
                    setBookings(getBookings());
                    setStats(getAdminStats());
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* ── Waitlist ── */}
        {activeTab === "waitlist" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredWaitlist.length} lead{filteredWaitlist.length !== 1 ? "s" : ""}
              </p>
              {waitlist.length > 0 && (
                <button
                  onClick={() => exportCSV(waitlist, "stashsaarthi-waitlist")}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
              )}
            </div>
            {filteredWaitlist.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No waitlist entries yet"
                sub="Signups from the waitlist form will appear here."
              />
            ) : (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/[0.04] border-b border-white/10 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name &amp; Contact</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">College / Locality</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredWaitlist.map((w) => (
                      <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-medium text-foreground">{w.full_name || "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {w.phone_number || w.email || "—"}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              w.user_type === "host"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {w.user_type}
                          </span>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{w.source}</div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                          {w.college_or_locality || "—"}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {fmtDate(w.submittedAt)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {w.phone_number ? (
                            <a
                              href={waLink(w.phone_number, w.full_name || "there")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-xl hover:bg-[#25D366]/20 transition-colors font-medium"
                            >
                              <MessageCircle className="h-3 w-3" />
                              WhatsApp
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">No phone</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Meal Orders ── */}
        {activeTab === "meals" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredMeals.length} order{filteredMeals.length !== 1 ? "s" : ""}
              </p>
              {meals.length > 0 && (
                <button
                  onClick={() => exportCSV(meals, "stashsaarthi-meals")}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
              )}
            </div>
            {filteredMeals.length === 0 ? (
              <EmptyState
                icon={Soup}
                title="No meal orders yet"
                sub="Orders placed in the Token Meal Hub will appear here."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredMeals.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-foreground">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.phone}</div>
                      </div>
                      <span className="text-sm font-bold text-amber-400">\u20b9{m.amount}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Meal</div>
                        <div className="text-foreground font-medium truncate">{m.mealType}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Slot</div>
                        <div className="text-foreground font-medium">{m.deliverySlot}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 col-span-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Kitchen Node</div>
                        <div className="text-foreground font-medium truncate">{m.kitchenNode}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{fmtDate(m.submittedAt)}</span>
                      {m.phone && (
                        <a
                          href={waLink(m.phone, m.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] px-3 py-1 rounded-xl hover:bg-[#25D366]/20 transition-colors"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
            </p>
            {filteredReviews.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                sub="Student reviews from the Feedback section will appear here."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredReviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {r.name || "Anonymous"}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < (r.rating || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {r.service && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                        {r.service}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                    <div className="text-[10px] text-muted-foreground/60">{fmtDate(r.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Suggestions ── */}
        {activeTab === "suggestions" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? "s" : ""}
            </p>
            {filteredSuggestions.length === 0 ? (
              <EmptyState
                icon={Lightbulb}
                title="No suggestions yet"
                sub="Student suggestions from the Feedback section will appear here."
              />
            ) : (
              <div className="space-y-2">
                {filteredSuggestions.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-amber-400">#{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">{s.text}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-amber-400 font-medium">
                          {s.upvotes || 0} upvotes
                        </span>
                        <span className="text-[10px] text-muted-foreground">{fmtDate(s.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Visitors Tab ── */}
        {activeTab === "visitors" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {visitors.length} visitor session{visitors.length !== 1 ? "s" : ""} captured
                  <span className="ml-2 text-[10px] text-sky-400 font-medium">
                    ● via Supabase — cross-device
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadVisitors()}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${visitorsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                {visitors.length > 0 && (
                  <button
                    onClick={() => exportCSV(visitors, "stashsaarthi-visitors")}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Export CSV
                  </button>
                )}
              </div>
            </div>

            {/* Device breakdown mini stats */}
            {visitors.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(["mobile", "tablet", "desktop"] as const).map((dt) => {
                  const count = visitors.filter((v) => v.device_type === dt).length;
                  const Icon = dt === "mobile" ? Smartphone : dt === "tablet" ? Tablet : Monitor;
                  const color = dt === "mobile" ? "emerald" : dt === "tablet" ? "cyan" : "sky";
                  const c = COLOR_CLASSES[color] || COLOR_CLASSES["sky"]!;
                  return (
                    <div
                      key={dt}
                      className={`rounded-2xl border ${c.border} ${c.bg} p-3 flex items-center gap-3`}
                    >
                      <Icon className={`h-4 w-4 ${c.text} shrink-0`} />
                      <div>
                        <div className={`text-lg font-bold ${c.text}`}>{count}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{dt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {visitorsLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-12 flex flex-col items-center justify-center gap-3">
                <Activity className="h-6 w-6 text-sky-400 animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading visitor sessions from Supabase…</p>
              </div>
            ) : visitors.length === 0 ? (
              <EmptyState
                icon={Monitor}
                title="No visitors tracked yet"
                sub="Visitor sessions are captured automatically. Run the Supabase migration (supabase/migrations/20260907_visitor_sessions.sql) to enable cross-device tracking."
              />
            ) : (
              <div className="space-y-2">
                {visitors
                  .filter(
                    (v) =>
                      !search ||
                      v.browser.toLowerCase().includes(search.toLowerCase()) ||
                      v.os.toLowerCase().includes(search.toLowerCase()) ||
                      (v.city_hint || "").toLowerCase().includes(search.toLowerCase()) ||
                      v.pages_visited.some((p) => p.toLowerCase().includes(search.toLowerCase())) ||
                      v.services_clicked.some((s) =>
                        s.toLowerCase().includes(search.toLowerCase()),
                      ),
                  )
                  .map((v) => {
                    const DeviceIcon =
                      v.device_type === "mobile"
                        ? Smartphone
                        : v.device_type === "tablet"
                          ? Tablet
                          : Monitor;
                    const isRecent =
                      Date.now() - new Date(v.last_seen_at).getTime() < 5 * 60 * 1000;
                    return (
                      <div
                        key={v.session_id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <DeviceIcon className="h-4 w-4 text-sky-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Top row */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-sm font-semibold text-foreground">
                                {v.browser}
                              </span>
                              <span className="text-xs text-muted-foreground">on {v.os}</span>
                              <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded-full">
                                {v.screen_resolution}
                              </span>
                              {isRecent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                  ● Active now
                                </span>
                              )}
                            </div>

                            {/* Detail grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                                <div className="text-[10px] text-muted-foreground uppercase mb-0.5 flex items-center gap-1">
                                  <Globe className="h-2.5 w-2.5" /> Location
                                </div>
                                <div className="font-medium text-foreground truncate">
                                  {v.city_hint || v.timezone || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                                <div className="text-[10px] text-muted-foreground uppercase mb-0.5 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" /> Time on site
                                </div>
                                <div className="font-medium text-foreground">
                                  {v.time_on_site_seconds < 60
                                    ? `${v.time_on_site_seconds}s`
                                    : `${Math.floor(v.time_on_site_seconds / 60)}m ${v.time_on_site_seconds % 60}s`}
                                </div>
                              </div>
                              <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                                <div className="text-[10px] text-muted-foreground uppercase mb-0.5 flex items-center gap-1">
                                  <ArrowUpRight className="h-2.5 w-2.5" /> Referrer
                                </div>
                                <div className="font-medium text-foreground truncate">
                                  {v.referrer === "" || v.referrer === "direct"
                                    ? "Direct"
                                    : v.referrer.replace(/https?:\/\/(www\.)?/, "")}
                                </div>
                              </div>
                              <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                                <div className="text-[10px] text-muted-foreground uppercase mb-0.5">
                                  Language
                                </div>
                                <div className="font-medium text-foreground">{v.language}</div>
                              </div>
                            </div>

                            {/* Pages visited */}
                            {v.pages_visited.length > 0 && (
                              <div className="mt-2">
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">
                                  Pages Visited
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {v.pages_visited.map((p) => (
                                    <span
                                      key={p}
                                      className="text-[10px] font-mono bg-sky-500/10 border border-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full"
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Services clicked */}
                            {v.services_clicked.length > 0 && (
                              <div className="mt-2">
                                <div className="text-[10px] text-muted-foreground uppercase mb-1">
                                  Services Used
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {v.services_clicked.map((s) => (
                                    <span
                                      key={s}
                                      className="text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* UTM params */}
                            {(v.utm_source || v.utm_medium || v.utm_campaign) && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {v.utm_source && (
                                  <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                                    src: {v.utm_source}
                                  </span>
                                )}
                                {v.utm_medium && (
                                  <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                                    med: {v.utm_medium}
                                  </span>
                                )}
                                {v.utm_campaign && (
                                  <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                                    camp: {v.utm_campaign}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Timestamps */}
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-[10px] text-muted-foreground">
                                First: {fmtDate(v.first_seen_at)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                Last: {fmtDate(v.last_seen_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Edge infra monitor */}
        <div className="pt-4">
          <EdgeRegionMonitorWidget />
        </div>

        <ApiPenTestModal isOpen={isPenTestOpen} onClose={() => setIsPenTestOpen(false)} />
        <AndroidGoPerfModal isOpen={isAndroidGoPerfOpen} onClose={() => setIsAndroidGoPerfOpen(false)} />
      </div>
    </div>
  );
}
