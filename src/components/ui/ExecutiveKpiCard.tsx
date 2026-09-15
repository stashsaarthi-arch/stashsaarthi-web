import React, { useId } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getExecutiveKpiCardTokens, EXECUTIVE_KPI_CARDS_TOKENS } from "@/lib/designTokens";

export interface SparklineChartProps {
  data: number[];
  dates?: readonly string[] | string[] | undefined;
  width?: number | string | undefined;
  height?: number | undefined;
  color?: string | undefined;
  id?: string | undefined;
  showBeacon?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Lightweight GPU-accelerated SVG Sparkline Chart primitive
 */
export function SparklineChart({
  data,
  dates,
  width = "100%",
  height = 42,
  color = "#10B981",
  id,
  showBeacon = true,
  className = "",
}: SparklineChartProps) {
  const generatedId = useId();
  const gradientId = id || `sparkline-grad-${generatedId.replace(/:/g, "")}`;

  if (!data || data.length < 2) {
    return <div className="h-10 w-full bg-white/5 rounded-lg opacity-30" />;
  }

  const svgWidth = 200;
  const svgHeight = height;
  const paddingY = 6;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * svgWidth;
    const normalizedY = (val - minVal) / range;
    const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
    return { x, y, val, date: dates?.[idx] };
  });

  // Construct SVG path command
  const linePathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = points[idx - 1]!;
    // Smooth cubic bezier interpolation
    const cp1x = (prev.x + (pt.x - prev.x) * 0.5).toFixed(1);
    const cp1y = prev.y.toFixed(1);
    const cp2x = (prev.x + (pt.x - prev.x) * 0.5).toFixed(1);
    const cp2y = pt.y.toFixed(1);
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, "");

  const lastPt = points[points.length - 1]!;
  const areaPathD = `${linePathD} L ${lastPt.x.toFixed(1)} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full executive-sparkline-svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="70%" stopColor={color} stopOpacity={0.08} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient fill underneath curve */}
        <path d={areaPathD} fill={`url(#${gradientId})`} />

        {/* Main trend line */}
        <path
          d={linePathD}
          fill="none"
          stroke={color}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sparkline-path"
        />

        {/* Pulsing Beacon at latest data point */}
        {showBeacon && (
          <g transform={`translate(${lastPt.x.toFixed(1)}, ${lastPt.y.toFixed(1)})`}>
            <circle
              r="6"
              fill={color}
              opacity={0.3}
              className="sparkline-beacon-pulse"
            />
            <circle r="3.5" fill={color} stroke="#0A0D0F" strokeWidth={1.5} />
          </g>
        )}
      </svg>
    </div>
  );
}

export interface ExecutiveKpiCardProps {
  title: string;
  value: string | number;
  subValue?: string | undefined;
  subtitle?: string | undefined;
  growthPercent: number;
  isPositiveGrowth?: boolean | undefined;
  growthLabel?: string | undefined;
  color?: "emerald" | "cyan" | "amber" | "rose" | "violet" | "sky" | string | undefined;
  icon?: React.ElementType | undefined;
  trendPoints: number[];
  trendDates?: readonly string[] | string[] | undefined;
  badgeText?: string | undefined;
  className?: string | undefined;
  metricKey?: keyof typeof EXECUTIVE_KPI_CARDS_TOKENS.metrics | undefined;
}

const COLOR_MAP: Record<
  string,
  { bg: string; border: string; text: string; hex: string; badge: string; glow: string }
> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    hex: "#10B981",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    glow: "0 0 25px rgba(16, 185, 129, 0.2)",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    hex: "#06B6D4",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    glow: "0 0 25px rgba(6, 182, 212, 0.2)",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    hex: "#F59E0B",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    glow: "0 0 25px rgba(245, 158, 11, 0.2)",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    hex: "#F43F5E",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    glow: "0 0 25px rgba(244, 63, 94, 0.2)",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    hex: "#8B5CF6",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    glow: "0 0 25px rgba(139, 92, 246, 0.2)",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    hex: "#0EA5E9",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    glow: "0 0 25px rgba(14, 165, 233, 0.2)",
  },
};

/**
 * Executive KPI Metric Card component featuring sparkline trend charts & growth indicators
 */
export function ExecutiveKpiCard({
  title,
  value,
  subValue,
  subtitle,
  growthPercent,
  isPositiveGrowth = growthPercent >= 0,
  growthLabel,
  color = "emerald",
  icon: Icon,
  trendPoints,
  trendDates,
  badgeText,
  className = "",
  metricKey,
}: ExecutiveKpiCardProps) {
  const tokenSpec = metricKey ? getExecutiveKpiCardTokens(metricKey).metricSpec : null;
  const activeColorKey = color || tokenSpec?.badgeColor || "emerald";
  const palette = COLOR_MAP[activeColorKey] || COLOR_MAP["emerald"]!;

  const displayTitle = title || tokenSpec?.titleEn;
  const displayValue = value ?? tokenSpec?.valueFormatted;
  const displaySubtitle = subtitle || tokenSpec?.subtitleEn;
  const displayGrowthPercent = growthPercent ?? tokenSpec?.growthPercent;
  const displayGrowthLabel = growthLabel || tokenSpec?.growthLabelEn;
  const displayTrendPoints = trendPoints || tokenSpec?.trendPoints || [10, 20, 15, 30, 25, 40];
  const displayTrendDates = trendDates || tokenSpec?.trendDates;

  const isUp = isPositiveGrowth;
  const formattedGrowth = `${displayGrowthPercent > 0 ? "+" : ""}${displayGrowthPercent}%`;

  return (
    <div
      className={`executive-kpi-card p-4.5 flex flex-col justify-between gap-3 ${className}`}
      style={{ boxShadow: palette.glow }}
    >
      {/* Top row: Icon, Badge & Growth Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${palette.bg} border ${palette.border} shrink-0`}>
              <Icon className={`h-4.5 w-4.5 ${palette.text}`} />
            </div>
          )}
          {badgeText && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${palette.badge}`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Percentage growth indicator badge */}
        <div
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
            isUp
              ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400"
              : "bg-rose-500/15 border-rose-500/35 text-rose-400"
          }`}
        >
          {isUp ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          <span>{formattedGrowth}</span>
        </div>
      </div>

      {/* Main KPI Value & Labels */}
      <div className="space-y-1 min-w-0">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-2">
          <span>{displayValue}</span>
          {subValue && <span className="text-xs font-normal text-muted-foreground">{subValue}</span>}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>{displayTitle}</span>
          {displayGrowthLabel && (
            <span className="text-[10px] font-mono text-muted-foreground/70">{displayGrowthLabel}</span>
          )}
        </div>
        {displaySubtitle && (
          <div className="text-[11px] text-muted-foreground/70 line-clamp-1">{displaySubtitle}</div>
        )}
      </div>

      {/* Embedded Sparkline Chart */}
      <div className="pt-2 border-t border-white/5">
        <SparklineChart
          data={displayTrendPoints}
          dates={displayTrendDates}
          color={palette.hex}
          height={38}
        />
      </div>
    </div>
  );
}
