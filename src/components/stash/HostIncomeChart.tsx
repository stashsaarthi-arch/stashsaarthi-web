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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HostIncomeChartProps {
  cornerMonthly: number;
  roomMonthly: number;
  kitchenMonthly: number;
  totalMonthly: number;
  annualIncome: number;
  cornerBags: number;
  dailyTiffins: number;
  hasCorner: boolean;
  hasRoom: boolean;
  hasKitchen: boolean;
}

export function HostIncomeChart({
  cornerMonthly,
  roomMonthly,
  kitchenMonthly,
  totalMonthly,
  annualIncome,
  cornerBags,
  dailyTiffins,
  hasCorner,
  hasRoom,
  hasKitchen,
}: HostIncomeChartProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeView, setActiveView] = useState<"growth" | "breakdown" | "payouts">("growth");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number>(90); // 60% to 100% occupancy rate

  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // Adjusted monthly earnings based on occupancy rate
  const occupancyMultiplier = occupancyRate / 100;
  const adjustedCornerMonthly = cornerMonthly * occupancyMultiplier;
  const adjustedRoomMonthly = roomMonthly * occupancyMultiplier;
  const adjustedKitchenMonthly = kitchenMonthly * occupancyMultiplier;
  const totalMonthlyCalculated =
    (hasCorner ? adjustedCornerMonthly : 0) +
    (hasRoom ? adjustedRoomMonthly : 0) +
    (hasKitchen ? adjustedKitchenMonthly : 0);

  // 12-Month Projections
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesHi = [
    "जन",
    "फर",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अग",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर",
  ];
  const monthNames = isHi ? monthNamesHi : monthNamesEn;

  // Monthly breakdown data with realistic seasonality
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

  // Calculate Cumulative Earnings for SVG Path
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

  // Quarterly Summary Calculations
  const quarterlySummary = useMemo(() => {
    const q1 = monthlyData.slice(0, 3).reduce((acc, m) => acc + m.total, 0);
    const q2 = monthlyData.slice(3, 6).reduce((acc, m) => acc + m.total, 0);
    const q3 = monthlyData.slice(6, 9).reduce((acc, m) => acc + m.total, 0);
    const q4 = monthlyData.slice(9, 12).reduce((acc, m) => acc + m.total, 0);
    return [
      { name: isHi ? "Q1 (जन-मार्च)" : "Q1 (Jan-Mar)", total: q1, tag: isHi ? "सामान्य मांग" : "Standard" },
      { name: isHi ? "Q2 (अप-जून)" : "Q2 (Apr-Jun)", total: q2, tag: isHi ? "पीक स्टोरेज 🚀" : "Peak Stash 🚀" },
      { name: isHi ? "Q3 (जुलाई-सितं)" : "Q3 (Jul-Sep)", total: q3, tag: isHi ? "कमरा दाखिला" : "Room Inflow" },
      { name: isHi ? "Q4 (अक्टू-दिसं)" : "Q4 (Oct-Dec)", total: q4, tag: isHi ? "विंटर ब्रेक ❄️" : "Winter Break ❄️" },
    ];
  }, [monthlyData, isHi]);

  const maxMonthly = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.total), 1);
    return Math.ceil(max / 5000) * 5000;
  }, [monthlyData]);

  const maxCumulative = useMemo(() => {
    const max = cumulativeData[cumulativeData.length - 1]?.cumulative || 1;
    return Math.ceil(max / 20000) * 20000;
  }, [cumulativeData]);

  // Revenue Stream Splits (Percentage)
  const storagePct =
    totalMonthlyCalculated > 0 && hasCorner
      ? Math.round((adjustedCornerMonthly / totalMonthlyCalculated) * 100)
      : 0;
  const roomPct =
    totalMonthlyCalculated > 0 && hasRoom
      ? Math.round((adjustedRoomMonthly / totalMonthlyCalculated) * 100)
      : 0;
  const kitchenPct =
    totalMonthlyCalculated > 0 && hasKitchen
      ? Math.round((adjustedKitchenMonthly / totalMonthlyCalculated) * 100)
      : 0;

  // SVG Area Chart Path Calculation (12 Points)
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

  return (
    <div className="mt-4 rounded-2xl border border-amber-500/25 bg-black/40 p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            {isHi ? "मेज़बान आय विश्लेषिकी व चार्ट" : "Host Income Analytics & Projections"}
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-foreground mt-0.5 flex items-center gap-2">
            <span>{isHi ? "अनुमानित निष्क्रिय आय डैशबोर्ड" : "Projected Passive Income Dashboard"}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <Zap className="h-3 w-3" />
              {isHi ? "94% मांग (कानपुर)" : "94% Kanpur Demand"}
            </span>
          </h4>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto relative">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveView("growth")}
            className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer z-10 ${
              activeView === "growth"
                ? "text-amber-300 font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {activeView === "growth" && (
              <motion.span
                layoutId="activeHostChartView"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-amber-500/20 border border-amber-500/40 shadow-sm -z-10"
              />
            )}
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{isHi ? "12-माह वृद्धि" : "12-Mo Growth"}</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveView("breakdown")}
            className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer z-10 ${
              activeView === "breakdown"
                ? "text-amber-300 font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {activeView === "breakdown" && (
              <motion.span
                layoutId="activeHostChartView"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-amber-500/20 border border-amber-500/40 shadow-sm -z-10"
              />
            )}
            <PieChart className="h-3.5 w-3.5" />
            <span>{isHi ? "आय विभाजन" : "Revenue Split"}</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveView("payouts")}
            className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer z-10 ${
              activeView === "payouts"
                ? "text-amber-300 font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {activeView === "payouts" && (
              <motion.span
                layoutId="activeHostChartView"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-amber-500/20 border border-amber-500/40 shadow-sm -z-10"
              />
            )}
            <Calendar className="h-3.5 w-3.5" />
            <span>{isHi ? "साप्ताहिक भुगतान" : "Weekly Payouts"}</span>
          </motion.button>
        </div>
      </div>

      {/* Occupancy Rate Interactive Slider Control */}
      <div className="my-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Sliders className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{isHi ? "अनुमानित रिक्ति/ऑक्यूपेंसी दर:" : "Projected Space Occupancy Rate:"}</span>
          <span className="font-mono text-sm font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/30">
            {occupancyRate}%
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-64">
          <span className="text-[10px] text-muted-foreground font-mono">60%</span>
          <input
            type="range"
            min={60}
            max={100}
            step={5}
            value={occupancyRate}
            onChange={(e) => setOccupancyRate(Number(e.target.value))}
            className="w-full h-1.5 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[10px] text-emerald-400 font-mono font-bold">100%</span>
        </div>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
          <div className="text-[10px] text-muted-foreground font-medium">
            {isHi ? "औसत मासिक आय" : "Avg. Monthly Income"}
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-400 font-mono mt-0.5">
            {inr(totalMonthlyCalculated)}
            <span className="text-[10px] text-muted-foreground font-sans">/mo</span>
          </div>
          <div className="text-[9.5px] text-emerald-400 font-medium mt-0.5 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" />
            {isHi ? "100% एस्क्रौ सुरक्षा" : "100% Escrow Protected"}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
          <div className="text-[10px] text-muted-foreground font-medium">
            {isHi ? "वार्षिक संचयी लाभ" : "Annual Projected Yield"}
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5">
            {inr(totalMonthlyCalculated * 12)}
            <span className="text-[10px] text-muted-foreground font-sans">/yr</span>
          </div>
          <div className="text-[9.5px] text-emerald-400/90 font-medium mt-0.5">
            ⚡ {isHi ? "शून्य कमीशन कटौती" : "Direct Bank Payouts"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
          <div className="text-[10px] text-muted-foreground font-medium">
            {isHi ? "दैनिक गृह कार्य" : "Daily Effort Level"}
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
            {hasKitchen ? "45 Mins" : hasRoom ? "15 Mins" : "0 Mins"}
          </div>
          <div className="text-[9.5px] text-amber-300 font-medium mt-0.5">
            🛡️ {isHi ? "जीरो घुसपैठ की गारंटी" : "Zero Home Intrusion"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
          <div className="text-[10px] text-muted-foreground font-medium">
            {isHi ? "कानपुर नोड मांग" : "Nodal Occupancy"}
          </div>
          <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5">
            94.8% <span className="text-[10px] text-amber-400 font-bold">High 🔥</span>
          </div>
          <div className="text-[9.5px] text-muted-foreground mt-0.5">
            📍 IITK / Kakadeo / Kalyanpur
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Chart Views */}
      <AnimatePresence mode="wait">
        {activeView === "growth" && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Monthly Bar & Cumulative Trend SVG Chart */}
            <div className="relative rounded-xl border border-white/10 bg-black/60 p-3 sm:p-4 overflow-hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
                  {isHi
                    ? "मासिक आय बनाम संचयी वृद्धि (12 माह)"
                    : "Monthly Income & Cumulative Earnings (12 Months)"}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {isHi ? "शिखर संचयी:" : "Peak Cumulative:"}{" "}
                  {inr(cumulativeData[11]?.cumulative || 0)}
                </span>
              </div>

              {/* SVG Area Line Chart Overlay */}
              <div className="relative h-48 w-full">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#00F5A0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line
                    x1={paddingX}
                    y1={paddingY}
                    x2={chartWidth - paddingX}
                    y2={paddingY}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={paddingX}
                    y1={chartHeight / 2}
                    x2={chartWidth - paddingX}
                    y2={chartHeight / 2}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={paddingX}
                    y1={chartHeight - paddingY}
                    x2={chartWidth - paddingX}
                    y2={chartHeight - paddingY}
                    stroke="rgba(255,255,255,0.1)"
                  />

                  {/* Area fill */}
                  <path d={svgAreaD} fill="url(#amberGradient)" />

                  {/* Trend Curve Line */}
                  <path
                    d={svgPathD}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* SVG Bars aligned pixel-perfectly with data points */}
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
                        {/* Bar Rect */}
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
                                ? "fill-amber-500/70"
                                : "fill-white/20"
                          }`}
                        />
                        {/* Point Circle */}
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
                        {/* Month text label */}
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

                {/* Floating Hover Tooltip overlay */}
                {hoveredMonth !== null && monthlyData[hoveredMonth] && (
                  <div
                    style={{
                      left: `${Math.min(
                        78,
                        Math.max(10, ((hoveredMonth + 0.5) / monthlyData.length) * 100),
                      )}%`,
                    }}
                    className="absolute top-2 z-30 -translate-x-1/2 rounded-xl border border-amber-400/50 bg-black/95 p-3 shadow-2xl backdrop-blur-md text-left w-48 pointer-events-none animate-in fade-in zoom-in-95"
                  >
                    <div className="text-[11px] font-bold text-amber-400 border-b border-white/10 pb-1 mb-1 flex justify-between">
                      <span>
                        {monthlyData[hoveredMonth].month} {isHi ? "मासिक आय" : "Earnings"}
                      </span>
                      <span className="text-white">{inr(monthlyData[hoveredMonth].total)}</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      {hasCorner && (
                        <div className="flex justify-between text-slate-300">
                          <span>🎒 {isHi ? "स्टोरेज कॉर्नर" : "Storage"}:</span>
                          <span className="font-mono text-emerald-400">
                            {inr(monthlyData[hoveredMonth].storage)}
                          </span>
                        </div>
                      )}
                      {hasRoom && (
                        <div className="flex justify-between text-slate-300">
                          <span>🏡 {isHi ? "कमरा किराया" : "Room"}:</span>
                          <span className="font-mono text-amber-400">
                            {inr(monthlyData[hoveredMonth].room)}
                          </span>
                        </div>
                      )}
                      {hasKitchen && (
                        <div className="flex justify-between text-slate-300">
                          <span>🍲 {isHi ? "किचन टिफिन" : "Kitchen"}:</span>
                          <span className="font-mono text-cyan-400">
                            {inr(monthlyData[hoveredMonth].kitchen)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold text-white text-[10.5px]">
                        <span>{isHi ? "संचयी कुल:" : "Cumulative:"}</span>
                        <span className="font-mono text-emerald-300">
                          {inr(cumulativeData[hoveredMonth]?.cumulative ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quarterly Breakdown Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/10 pt-3 mt-2">
                {quarterlySummary.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-white/5 p-2 border border-white/10 text-center"
                  >
                    <div className="text-[10px] text-slate-400 font-medium">{q.name}</div>
                    <div className="text-xs font-bold text-amber-400 font-mono">{inr(q.total)}</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">{q.tag}</div>
                  </div>
                ))}
              </div>

              {/* Milestone Footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>
                    {isHi
                      ? "पीक वेकेशन सीजन (मई-जुलाई, दिसंबर): +25% मांग"
                      : "Peak Vacation Season (May-Jul, Dec): +25% Storage Demand"}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  <span>
                    {isHi ? "₹10,000 सुरक्षा कवर गारंटीबद्ध" : "₹10k Protection Cover Active"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "breakdown" && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Visual Stream Share Breakdown */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-4">
              <div className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                <span>{isHi ? "आय स्रोत विभाजन प्रतिशत" : "Revenue Stream Distribution"}</span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {isHi ? "कुल:" : "Total:"} {inr(totalMonthlyCalculated)}/mo
                </span>
              </div>

              {/* Radial Donut SVG & Stacked Bar Dual Visual */}
              <div className="flex flex-col sm:flex-row items-center gap-4 my-4 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3.5"
                    />
                    {hasCorner && storagePct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#10B981"
                        strokeWidth="3.5"
                        strokeDasharray={`${storagePct} ${100 - storagePct}`}
                        strokeDashoffset="0"
                      />
                    )}
                    {hasRoom && roomPct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        strokeDasharray={`${roomPct} ${100 - roomPct}`}
                        strokeDashoffset={`-${storagePct}`}
                      />
                    )}
                    {hasKitchen && kitchenPct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#06B6D4"
                        strokeWidth="3.5"
                        strokeDasharray={`${kitchenPct} ${100 - kitchenPct}`}
                        strokeDashoffset={`-${storagePct + roomPct}`}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-muted-foreground font-mono">100%</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {inr(totalMonthlyCalculated)}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  {/* Stacked Percentage Bar */}
                  <div className="h-5 w-full rounded-full bg-white/10 p-0.5 flex overflow-hidden border border-white/10">
                    {hasCorner && storagePct > 0 && (
                      <div
                        style={{ width: `${storagePct}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500 relative group"
                        title={`Storage: ${storagePct}%`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black font-mono">
                          {storagePct}%
                        </span>
                      </div>
                    )}
                    {hasRoom && roomPct > 0 && (
                      <div
                        style={{ width: `${roomPct}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 relative group"
                        title={`Room: ${roomPct}%`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black font-mono">
                          {roomPct}%
                        </span>
                      </div>
                    )}
                    {hasKitchen && kitchenPct > 0 && (
                      <div
                        style={{ width: `${kitchenPct}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-r-full transition-all duration-500 relative group"
                        title={`Kitchen: ${kitchenPct}%`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black font-mono">
                          {kitchenPct}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Storage ({storagePct}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Room ({roomPct}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      Kitchen ({kitchenPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Stream Breakdown Grid */}
              <div className="grid gap-2.5 sm:grid-cols-3">
                <div
                  className={`rounded-xl p-3 border ${
                    hasCorner
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-white/5 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                    <span>🎒 {isHi ? "स्टोरेज कॉर्नर" : "Storage Corner"}</span>
                    <span className="font-mono">{hasCorner ? `${storagePct}%` : "Off"}</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono">
                    {inr(hasCorner ? adjustedCornerMonthly : 0)}
                    <span className="text-[10px] text-muted-foreground font-sans">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">
                    {cornerBags} {isHi ? "बैग क्षमता (₹180/बैग)" : "bags capacity (₹180/bag)"}
                  </div>
                </div>

                <div
                  className={`rounded-xl p-3 border ${
                    hasRoom
                      ? "border-amber-500/30 bg-amber-500/10"
                      : "border-white/5 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                    <span>🏡 {isHi ? "स्पेयर बेडरूम" : "Spare Bedroom"}</span>
                    <span className="font-mono">{hasRoom ? `${roomPct}%` : "Off"}</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono">
                    {inr(hasRoom ? adjustedRoomMonthly : 0)}
                    <span className="text-[10px] text-muted-foreground font-sans">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">
                    {isHi ? "100% सत्यापित छात्र मैच" : "Verified student tenant"}
                  </div>
                </div>

                <div
                  className={`rounded-xl p-3 border ${
                    hasKitchen
                      ? "border-cyan-500/30 bg-cyan-500/10"
                      : "border-white/5 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                    <span>🍲 {isHi ? "घर का किचन" : "Home Kitchen"}</span>
                    <span className="font-mono">{hasKitchen ? `${kitchenPct}%` : "Off"}</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono">
                    {inr(hasKitchen ? adjustedKitchenMonthly : 0)}
                    <span className="text-[10px] text-muted-foreground font-sans">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">
                    {dailyTiffins} {isHi ? "दैनिक टिफिन (₹55/भोजन)" : "daily tiffins (₹55/meal)"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "payouts" && (
          <motion.div
            key="payouts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Weekly Payout Schedule Simulator */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  {isHi
                    ? "ऑटोमेटेड साप्ताहिक एस्क्रौ भुगतान चक्र"
                    : "Automated Weekly Escrow Payout Schedule"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {isHi ? "प्रत्येक सोमवार सीधी बैंक क्रेडिट" : "Direct Bank Credit Every Monday"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((wk) => {
                  const weeklyPayout = Math.round(totalMonthlyCalculated / 4);
                  return (
                    <div
                      key={wk}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center transition-all hover:border-amber-400/50"
                    >
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        {isHi ? `सप्ताह #${wk} भुगतान` : `Week #${wk} Payout`}
                      </div>
                      <div className="text-base font-extrabold text-white font-mono mt-1">
                        {inr(weeklyPayout)}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                        <IndianRupee className="h-2.5 w-2.5" />
                        {isHi ? "एस्क्रौ सत्यापित" : "Escrow Verified"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 border border-amber-500/20">
                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                <div className="text-[11px] text-slate-200">
                  <span className="font-bold text-amber-300">
                    {isHi ? "0% लिस्टिंग शुल्क व शून्य कमीशन:" : "0% Listing Fee & Zero Commission:"}
                  </span>{" "}
                  {isHi
                    ? "स्टैशसारथी सीनियर होस्ट्स से कोई ब्रोकरेज या कट-ऑफ नहीं लेता। पूरा ₹180/बैग व ₹55/टिफिन सीधे आपके खाते में जमा होता है।"
                    : "StashSaarthi charges zero commission to senior hosts. Full ₹180/bag & ₹55/meal goes directly to your bank account."}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
