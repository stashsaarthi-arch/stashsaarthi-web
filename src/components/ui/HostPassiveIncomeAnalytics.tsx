import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  PieChart,
  Zap,
  Sliders,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Receipt,
  FileCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import {
  HOST_PASSIVE_INCOME_TOKENS,
  getHostPassiveIncomeTokens,
} from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";

export interface HostPassiveIncomeAnalyticsProps {
  cornerMonthly?: number;
  roomMonthly?: number;
  kitchenMonthly?: number;
  cornerBags?: number;
  dailyTiffins?: number;
  hasCorner?: boolean;
  hasRoom?: boolean;
  hasKitchen?: boolean;
  className?: string;
}

export function HostPassiveIncomeAnalytics({
  cornerMonthly = 5400,
  roomMonthly = 6500,
  kitchenMonthly = 3300,
  cornerBags = 30,
  dailyTiffins = 2,
  hasCorner = true,
  hasRoom = true,
  hasKitchen = true,
  className = "",
}: HostPassiveIncomeAnalyticsProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"growth" | "transfers" | "tax" | "upcoming">("growth");
  const [occupancyRate, setOccupancyRate] = useState<number>(90);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [payoutTriggered, setPayoutTriggered] = useState<boolean>(false);
  const [seniorLegibility, setSeniorLegibility] = useState<boolean>(false);
  const [transferFilter, setTransferFilter] = useState<"all" | "Completed" | "In Escrow">("all");

  const tokens = getHostPassiveIncomeTokens(role);

  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const occupancyMultiplier = occupancyRate / 100;
  const adjustedCornerMonthly = cornerMonthly * occupancyMultiplier;
  const adjustedRoomMonthly = roomMonthly * occupancyMultiplier;
  const adjustedKitchenMonthly = kitchenMonthly * occupancyMultiplier;
  const totalMonthlyCalculated =
    (hasCorner ? adjustedCornerMonthly : 0) +
    (hasRoom ? adjustedRoomMonthly : 0) +
    (hasKitchen ? adjustedKitchenMonthly : 0);

  const monthNamesEn = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthNamesHi = [
    "जन", "फर", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अग", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
  ];
  const monthNames = isHi ? monthNamesHi : monthNamesEn;

  const monthlyData = useMemo(() => {
    return monthNames.map((month, idx) => {
      const isVacationSeason = idx === 4 || idx === 5 || idx === 6 || idx === 11;
      const seasonalStorage = hasCorner ? adjustedCornerMonthly * (isVacationSeason ? 1.25 : 1.0) : 0;
      const roomVal = hasRoom ? adjustedRoomMonthly : 0;
      const kitchenVal = hasKitchen ? adjustedKitchenMonthly * (isVacationSeason ? 0.85 : 1.1) : 0;
      const monthTotal = Math.round(seasonalStorage + roomVal + kitchenVal);

      return {
        month,
        monthIndex: idx + 1,
        storage: Math.round(seasonalStorage),
        room: Math.round(roomVal),
        kitchen: Math.round(kitchenVal),
        total: monthTotal,
        isVacationSeason,
      };
    });
  }, [
    monthNames,
    hasCorner,
    hasRoom,
    hasKitchen,
    adjustedCornerMonthly,
    adjustedRoomMonthly,
    adjustedKitchenMonthly,
  ]);

  const cumulativeData = useMemo(() => {
    let running = 0;
    return monthlyData.map((d) => {
      running += d.total;
      return {
        ...d,
        cumulative: running,
      };
    });
  }, [monthlyData]);

  const maxCumulative = useMemo(() => {
    const max = cumulativeData[cumulativeData.length - 1]?.cumulative || 1;
    return Math.ceil(max / 20000) * 20000;
  }, [cumulativeData]);

  const maxMonthly = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.total), 1);
    return Math.ceil(max / 5000) * 5000;
  }, [monthlyData]);

  const chartWidth = 600;
  const chartHeight = 160;
  const paddingX = 24;
  const paddingY = 24;

  const points = useMemo(() => {
    return cumulativeData.map((d, i) => {
      const x = paddingX + (i / (cumulativeData.length - 1)) * (chartWidth - paddingX * 2);
      const y =
        chartHeight - paddingY - (d.cumulative / maxCumulative) * (chartHeight - paddingY * 2);
      return { x, y, data: d };
    });
  }, [cumulativeData, maxCumulative]);

  const svgPathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      if (!prev) return acc;
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
    }, "");
  }, [points]);

  const svgAreaD = useMemo(() => {
    if (!svgPathD || points.length === 0) return "";
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    if (!lastPt || !firstPt) return "";
    return `${svgPathD} L ${lastPt.x} ${chartHeight - paddingY} L ${firstPt.x} ${chartHeight - paddingY} Z`;
  }, [svgPathD, points]);

  const filteredTransfers = useMemo(() => {
    if (transferFilter === "all") return HOST_PASSIVE_INCOME_TOKENS.bankTransferHistory;
    return HOST_PASSIVE_INCOME_TOKENS.bankTransferHistory.filter((t) => t.status === transferFilter);
  }, [transferFilter]);

  const handleCopyUtr = (utr: string) => {
    playClick();
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleSimulatePayout = () => {
    playSuccessChime();
    setPayoutTriggered(true);
    setTimeout(() => setPayoutTriggered(false), 4000);
  };

  const toggleTab = (tab: "growth" | "transfers" | "tax" | "upcoming") => {
    playPop();
    setActiveTab(tab);
  };

  return (
    <div
      className={`host-income-analytics-container p-4 sm:p-6 text-foreground ${
        seniorLegibility ? "text-base font-semibold" : "text-sm"
      } ${className}`}
    >
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>{isHi ? tokens.consoleTitleHi : tokens.consoleTitleEn}</span>
          </div>
          <h3 className={`font-extrabold text-white mt-1 flex items-center gap-2 ${seniorLegibility ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>
            <span>{isHi ? "निष्क्रिय आय व बैंक भुगतान प्रबंधन" : "Passive Income & Bank Settlement Hub"}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isHi ? "100% वैध व एस्क्रौ सुरक्षित" : "100% Escrow Protected"}
            </span>
          </h3>
        </div>

        {/* Tab & Legibility Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Senior Legibility Toggle */}
          <button
            type="button"
            onClick={() => {
              playClick();
              setSeniorLegibility(!seniorLegibility);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
              seniorLegibility
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                : "bg-white/5 text-amber-300 border-amber-500/30 hover:bg-white/10"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{isHi ? "बुजुर्ग मोड (बड़ा फ़ॉन्ट)" : "Senior Citizen Mode"}</span>
          </button>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => toggleTab("growth")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "growth"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{isHi ? "मासिक वृद्धि" : "12-Mo Yield"}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleTab("transfers")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "transfers"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{isHi ? "बैंक ट्रांसफर (" + HOST_PASSIVE_INCOME_TOKENS.bankTransferHistory.length + ")" : "Bank Transfers"}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleTab("tax")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "tax"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>{isHi ? "टैक्स छूट (0% TDS)" : "Tax Exemptions"}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleTab("upcoming")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{isHi ? "अगला भुगतान" : "Next Payout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 shadow-md">
          <div className="text-xs text-amber-300 font-semibold">
            {isHi ? "औसत मासिक आय" : "Est. Monthly Income"}
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono mt-1">
            {inr(totalMonthlyCalculated)}
            <span className="text-xs text-muted-foreground font-sans">/mo</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {isHi ? "0% लिस्टिंग शुल्क" : "0% Platform Fee"}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 shadow-md">
          <div className="text-xs text-emerald-300 font-semibold">
            {isHi ? "वार्षिक संचयी लाभ" : "Annual Projected Yield"}
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono mt-1">
            {inr(totalMonthlyCalculated * 12)}
            <span className="text-xs text-muted-foreground font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-medium mt-1">
            ⚡ {isHi ? "सीधा बैंक ट्रांसफर" : "Direct NEFT / UPI"}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 shadow-md">
          <div className="text-xs text-cyan-300 font-semibold">
            {isHi ? "एस्क्रौ सुरक्षित बैलेंस" : "Pending Escrow Balance"}
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono mt-1">
            {inr(HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.pendingEscrowAmount)}
          </div>
          <div className="text-[11px] text-cyan-300 font-medium mt-1 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {isHi ? "सोमवार ऑटो-निपटान" : "Auto Payout Monday"}
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 shadow-md">
          <div className="text-xs text-purple-300 font-semibold">
            {isHi ? "कर छूट स्थिति" : "TDS & Tax Status"}
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-purple-300 font-mono mt-1">
            {isHi ? "0% टीडीएस कटौती" : "0% TDS Exempt"}
          </div>
          <div className="text-[11px] text-purple-400 font-medium mt-1">
            🛡️ {isHi ? "धारा 80TTB व 194-IB" : "Sec 80TTB & 194-IB Shield"}
          </div>
        </div>
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === "growth" && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Occupancy Rate Interactive Slider */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Sliders className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{isHi ? "अनुमानित रिक्ति / ऑक्यूपेंसी दर:" : "Projected Occupancy Rate:"}</span>
                <span className="font-mono text-sm font-bold text-amber-400 bg-black/70 px-2.5 py-0.5 rounded-md border border-amber-500/40">
                  {occupancyRate}%
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-xs text-muted-foreground font-mono">60%</span>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={5}
                  value={occupancyRate}
                  onChange={(e) => setOccupancyRate(Number(e.target.value))}
                  className="w-full h-2 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="text-xs text-emerald-400 font-mono font-bold">100%</span>
              </div>
            </div>

            {/* SVG Monthly Bar & Cumulative Path Chart */}
            <div className="relative rounded-xl border border-white/10 bg-black/70 p-4 overflow-hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-amber-400" />
                  {isHi
                    ? "12-माह निष्क्रिय आय वृद्धि (मासिक व संचयी)"
                    : "12-Month Passive Yield & Cumulative Curve"}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {isHi ? "कुल वर्ष 1:" : "Year 1 Total:"}{" "}
                  {inr(cumulativeData[11]?.cumulative || 0)}
                </span>
              </div>

              <div className="relative h-48 w-full">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="hostAmberArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="hostLineGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#00F5A0" />
                    </linearGradient>
                  </defs>

                  <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.15)" />

                  <path d={svgAreaD} fill="url(#hostAmberArea)" />
                  <path d={svgPathD} fill="none" stroke="url(#hostLineGlow)" strokeWidth="3.5" strokeLinecap="round" />

                  {points.map((pt, idx) => {
                    const d = monthlyData[idx];
                    if (!d) return null;
                    const barHeightPct = Math.max(
                      12,
                      Math.min(85, (d.total / (maxMonthly || 1)) * (chartHeight - paddingY * 2)),
                    );
                    const isHovered = hoveredMonth === idx;

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredMonth(idx)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      >
                        <rect
                          x={pt.x - 7}
                          y={chartHeight - paddingY - barHeightPct}
                          width={14}
                          height={barHeightPct}
                          rx={3}
                          className={`transition-all duration-200 ${
                            isHovered
                              ? "fill-amber-400 stroke-white stroke-1"
                              : d.isVacationSeason
                                ? "fill-amber-500/80"
                                : "fill-white/25"
                          }`}
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 3.5}
                          className={`transition-all duration-200 ${
                            isHovered
                              ? "fill-white stroke-amber-400 stroke-[3]"
                              : "fill-amber-400 stroke-black stroke-2"
                          }`}
                        />
                        <text
                          x={pt.x}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className={`text-[9px] font-mono fill-current ${
                            isHovered ? "fill-amber-400 font-bold" : "fill-slate-400"
                          }`}
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {hoveredMonth !== null && monthlyData[hoveredMonth] && (
                  <div
                    style={{
                      left: `${Math.min(
                        78,
                        Math.max(10, ((hoveredMonth + 0.5) / monthlyData.length) * 100),
                      )}%`,
                    }}
                    className="absolute top-2 z-30 -translate-x-1/2 rounded-xl border border-amber-400/60 bg-black/95 p-3 shadow-2xl backdrop-blur-md text-left w-52 pointer-events-none animate-in fade-in zoom-in-95"
                  >
                    <div className="text-xs font-bold text-amber-400 border-b border-white/10 pb-1 mb-1 flex justify-between">
                      <span>{monthlyData[hoveredMonth].month} {isHi ? "मासिक आय" : "Earnings"}</span>
                      <span className="text-white">{inr(monthlyData[hoveredMonth].total)}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {hasCorner && (
                        <div className="flex justify-between text-slate-300">
                          <span>🎒 {isHi ? "स्टोरेज कॉर्नर" : "Storage"}:</span>
                          <span className="font-mono text-emerald-400 font-bold">{inr(monthlyData[hoveredMonth].storage)}</span>
                        </div>
                      )}
                      {hasRoom && (
                        <div className="flex justify-between text-slate-300">
                          <span>🏡 {isHi ? "कमरा किराया" : "Room"}:</span>
                          <span className="font-mono text-amber-400 font-bold">{inr(monthlyData[hoveredMonth].room)}</span>
                        </div>
                      )}
                      {hasKitchen && (
                        <div className="flex justify-between text-slate-300">
                          <span>🍲 {isHi ? "होम टिफिन" : "Kitchen"}:</span>
                          <span className="font-mono text-cyan-400 font-bold">{inr(monthlyData[hoveredMonth].kitchen)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold text-white text-xs">
                        <span>{isHi ? "संचयी कुल:" : "Cumulative:"}</span>
                        <span className="font-mono text-emerald-300">{inr(cumulativeData[hoveredMonth]?.cumulative ?? 0)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "transfers" && (
          <motion.div
            key="transfers"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Filter Pills Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>{isHi ? "हाल के बैंक ट्रांसफर (NEFT / RTGS / UPI)" : "Recent Bank Transfers & Settlements"}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setTransferFilter("all")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    transferFilter === "all" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "सभी (" + HOST_PASSIVE_INCOME_TOKENS.bankTransferHistory.length + ")" : "All (" + HOST_PASSIVE_INCOME_TOKENS.bankTransferHistory.length + ")"}
                </button>
                <button
                  type="button"
                  onClick={() => setTransferFilter("Completed")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    transferFilter === "Completed" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "जमा हुए" : "Completed"}
                </button>
                <button
                  type="button"
                  onClick={() => setTransferFilter("In Escrow")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    transferFilter === "In Escrow" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "एस्क्रौ लॉक" : "In Escrow"}
                </button>
              </div>
            </div>

            {/* Transfer List */}
            <div className="space-y-2">
              {filteredTransfers.map((tx) => (
                <div key={tx.id} className="host-transfer-row">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      tx.status === "Completed"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                    }`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {isHi ? tx.bankNameHi : tx.bankNameEn}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground bg-black/60 px-2 py-0.5 rounded border border-white/10">
                          {tx.accountMask}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{isHi ? tx.typeHi : tx.typeEn}</span>
                      </div>
                      <div className="text-[11px] font-mono text-amber-300 mt-0.5 flex items-center gap-1.5">
                        <span>{tx.utr}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyUtr(tx.utr)}
                          className="hover:text-white transition-colors cursor-pointer"
                          title="Copy UTR Reference"
                        >
                          {copiedUtr === tx.utr ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {inr(tx.amount)}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold border mt-1 ${
                      tx.status === "Completed"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                    }`}>
                      {tx.status === "Completed" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3 animate-spin" />
                      )}
                      {isHi ? tx.statusBadgeHi : tx.statusBadgeEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "tax" && (
          <motion.div
            key="tax"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
              <Receipt className="h-4 w-4 text-amber-400" />
              <span>{isHi ? "वरिष्ठ नागरिक कर सुरक्षा व धारा 194-IB / 80TTB प्रमाणन" : "Senior Citizen Tax Shields & Zero TDS Compliance"}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* Sec 80TTB Card */}
              <div className="host-tax-shield-card">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                  <span>{HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.section}</span>
                  <span className="font-mono text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    {HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.limitFormatted}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.titleHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.titleEn}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.descriptionHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec80TTB.descriptionEn}
                </p>
              </div>

              {/* Sec 194-IB Card */}
              <div className="host-tax-shield-card">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span>{HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.section}</span>
                  <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.limitFormatted}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.titleHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.titleEn}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.descriptionHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec194IB.descriptionEn}
                </p>
              </div>

              {/* GST Sec 23 Card */}
              <div className="host-tax-shield-card">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                  <span>{HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.section}</span>
                  <span className="font-mono text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    {HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.limitFormatted}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.titleHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.titleEn}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.descriptionHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.sec23GST.descriptionEn}
                </p>
              </div>
            </div>

            {/* Net Tax Free Banner */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.netTaxFreeYield.titleHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.netTaxFreeYield.titleEn}
                  </div>
                  <div className="text-xs text-emerald-300 font-medium">
                    {isHi ? HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.netTaxFreeYield.valueFormattedHi : HOST_PASSIVE_INCOME_TOKENS.taxBreakdowns.netTaxFreeYield.valueFormatted}
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{isHi ? "प्रमाणित वैध रिफंड आवश्यकता नहीं" : "No Tax Withheld"}</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-amber-500/30 bg-black/80 p-4 sm:p-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{isHi ? "आगामी सोमवार ऑटो-निपटान चक्र" : "Automated Weekly Settlement Cycle"}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {isHi ? HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.nextPayoutDateHi : HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.nextPayoutDateEn}
                  </h4>
                </div>

                <div className="text-right self-start sm:self-auto">
                  <div className="text-xs text-muted-foreground">{isHi ? "बाकी दिन:" : "Days Remaining:"}</div>
                  <div className="text-lg font-extrabold text-amber-400 font-mono">
                    {HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.daysRemaining} {isHi ? "दिन" : "Days"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-muted-foreground">{isHi ? "एस्क्रौ लॉक राशि:" : "Escrow Locked Amount:"}</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {inr(HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.pendingEscrowAmount)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-muted-foreground">{isHi ? "सक्रिय बैकअप बैग:" : "Active Stashes Hosted:"}</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.lockedBagsCount} {isHi ? "बैग" : "Bags"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-xs text-muted-foreground">{isHi ? "खाता:" : "Target Account:"}</div>
                  <div className="text-xs font-bold text-amber-300 font-mono mt-1">
                    {HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.bankAccountMask}
                  </div>
                </div>
              </div>

              {/* Simulate Payout Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-300 font-mono">
                  REF: {HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.neftReference}
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayout}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    payoutTriggered
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-500/25 host-payout-pulse-active"
                  }`}
                >
                  {payoutTriggered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isHi ? "NEFT बैंक ट्रांसफर प्रारंभ हो गया! ✅" : "NEFT Payout Initiated! ✅"}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>{isHi ? HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.triggerBtnHi : HOST_PASSIVE_INCOME_TOKENS.upcomingPayoutSchedule.triggerBtnEn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Disclaimer Strip */}
      <div className="mt-4 border-t border-white/10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            {isHi
              ? "0% ब्रोकरेज गारंटी: पूरा ₹180/बैग व ₹55/टिफिन सीधे बुजुर्ग मेज़बान के बैंक खाते में जमा किया जाता है।"
              : "0% Brokerage Guarantee: 100% of host earnings credited directly to senior bank accounts."}
          </span>
        </div>
        <div className="flex items-center gap-1 font-bold text-emerald-400 shrink-0">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{isHi ? "टीपीए धारा 105 सुरक्षा" : "TPA Sec 105 Compliant"}</span>
        </div>
      </div>
    </div>
  );
}
