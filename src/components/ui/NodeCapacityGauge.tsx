import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Boxes,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Lock,
  Thermometer,
  Layers,
  ChevronRight,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { NODE_CAPACITY_GAUGE_TOKENS, getNodeCapacityTokens } from "@/lib/designTokens";
import { useLanguage } from "@/context/LanguageContext";

export interface NodeCapacityData {
  id: string;
  nameEn: string;
  nameHi: string;
  campusEn: string;
  campusHi: string;
  totalLockers: number;
  usedLockers: number;
  reservedBuffer: number;
  breakdown: {
    smallBox: { total: number; used: number };
    mediumTrunk: { total: number; used: number };
    largeAppliance: { total: number; used: number };
    climateControl: { total: number; used: number };
  };
}

export interface CircularGaugeProps {
  percent: number;
  size?: number | undefined;
  strokeWidth?: number | undefined;
  colorHex?: string | undefined;
  showCenterText?: boolean | undefined;
  className?: string | undefined;
}

/**
 * SVG Circular Capacity Gauge Primitive with smooth stroke-dashoffset animation
 */
export function CircularGauge({
  percent,
  size = 110,
  strokeWidth = 9,
  colorHex = "#10B981",
  showCenterText = true,
  className = "",
}: CircularGaugeProps) {
  const generatedId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const dashOffset = circumference - (clampedPercent / 100) * circumference;
  const gradientId = `node-gauge-grad-${generatedId.replace(/:/g, "")}`;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} stopOpacity={1} />
            <stop offset="100%" stopColor={colorHex} stopOpacity={0.65} />
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Dynamic Capacity Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Center Percent Counter */}
      {showCenterText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono tracking-tight text-foreground">
            {clampedPercent}%
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
            Occupied
          </span>
        </div>
      )}
    </div>
  );
}

export interface NodeCapacityGaugeProps {
  initialNodeId?: string | undefined;
  className?: string | undefined;
  onReserveBufferClick?: ((nodeId: string) => void) | undefined;
}

/**
 * Interactive Real-Time Node Capacity Gauges Component (Task 173)
 * Renders live locker utilization gauges across Kakadeo, Kalyanpur, Nawabganj, and Gurudev hubs.
 */
export function NodeCapacityGauge({
  initialNodeId = "kakadeo-central",
  className = "",
  onReserveBufferClick,
}: NodeCapacityGaugeProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId);
  const [activeNodes, setActiveNodes] = useState<NodeCapacityData[]>(
    () => NODE_CAPACITY_GAUGE_TOKENS.nodes as unknown as NodeCapacityData[]
  );

  const selectedNode =
    activeNodes.find((n) => n.id === selectedNodeId) || activeNodes[0]!;

  const calculatePercent = (used: number, total: number) =>
    Math.round((used / total) * 100);

  const overallUsed = activeNodes.reduce((acc, n) => acc + n.usedLockers, 0);
  const overallTotal = activeNodes.reduce((acc, n) => acc + n.totalLockers, 0);
  const overallPercent = calculatePercent(overallUsed, overallTotal);

  // Status threshold styling calculator
  const getStatusMeta = (percent: number) => {
    if (percent > 85) {
      return {
        labelEn: "Critical • High Demand",
        labelHi: "गम्भीर • अत्यधिक मांग",
        badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/35",
        hex: "#F43F5E",
        bgGlow: "rgba(244, 63, 94, 0.15)",
        icon: AlertTriangle,
      };
    }
    if (percent > 65) {
      return {
        labelEn: "Optimal • Active",
        labelHi: "इष्टतम • सक्रिय",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/35",
        hex: "#F59E0B",
        bgGlow: "rgba(245, 158, 11, 0.15)",
        icon: Zap,
      };
    }
    return {
      labelEn: "Normal • Space Available",
      labelHi: "सामान्य • स्थान उपलब्ध",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/35",
      hex: "#10B981",
      bgGlow: "rgba(16, 185, 129, 0.15)",
      icon: ShieldCheck,
    };
  };

  const handleSimulateLock = (nodeId: string) => {
    setActiveNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId && n.usedLockers < n.totalLockers) {
          const newUsed = n.usedLockers + 1;
          return {
            ...n,
            usedLockers: newUsed,
            breakdown: {
              ...n.breakdown,
              mediumTrunk: {
                ...n.breakdown.mediumTrunk,
                used: Math.min(n.breakdown.mediumTrunk.total, n.breakdown.mediumTrunk.used + 1),
              },
            },
          };
        }
        return n;
      })
    );
  };

  const activeMeta = getStatusMeta(calculatePercent(selectedNode.usedLockers, selectedNode.totalLockers));
  const ActiveIcon = activeMeta.icon;

  return (
    <div className={`space-y-5 rounded-2xl bg-white/[0.03] border border-white/10 p-5 backdrop-blur-xl ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="h-5 w-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {isHi ? "रियल-टाइम नोड क्षमता एवं लॉकर उपयोगिता" : "Real-Time Node Capacity & Locker Utilization"}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isHi
                ? "काकादेव, कल्याणपुर, नवाबगंज और गुरुदेव पैलेस वॉल्ट का सीधा लाइव डेटा"
                : "Live telemetry stream across Kanpur's core coaching & university hubs"}
            </p>
          </div>
        </div>

        {/* Network-wide quick aggregate summary pill */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase text-muted-foreground block font-mono">Network Total</span>
            <span className="font-bold text-foreground font-mono">
              {overallUsed} / {overallTotal} <span className="text-cyan-400">({overallPercent}%)</span>
            </span>
          </div>
          <CircularGauge percent={overallPercent} size={42} strokeWidth={5} showCenterText={false} colorHex="#06B6D4" />
        </div>
      </div>

      {/* Node Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {activeNodes.map((node) => {
          const p = calculatePercent(node.usedLockers, node.totalLockers);
          const meta = getStatusMeta(p);
          const isSelected = node.id === selectedNodeId;

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? "bg-white/10 text-foreground border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                  : "bg-white/[0.02] text-muted-foreground border-white/5 hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <div
                className="h-2 w-2 rounded-full shrink-0 animate-ping"
                style={{ backgroundColor: meta.hex }}
              />
              <span>{isHi ? node.nameHi : node.nameEn}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/40 text-muted-foreground border border-white/5">
                {p}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Detailed Breakdown Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 rounded-xl bg-black/40 border border-white/10"
        >
          {/* Main Node Gauge & Meta */}
          <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <CircularGauge
              percent={calculatePercent(selectedNode.usedLockers, selectedNode.totalLockers)}
              size={135}
              strokeWidth={10}
              colorHex={activeMeta.hex}
            />

            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">
                {isHi ? selectedNode.nameHi : selectedNode.nameEn}
              </h4>
              <p className="text-xs text-muted-foreground font-medium">
                {isHi ? selectedNode.campusHi : selectedNode.campusEn}
              </p>
            </div>

            <div className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${activeMeta.badgeClass}`}>
              <ActiveIcon className="h-3.5 w-3.5" />
              <span>{isHi ? activeMeta.labelHi : activeMeta.labelEn}</span>
            </div>

            <div className="text-xs text-muted-foreground pt-1 font-mono">
              {selectedNode.usedLockers} / {selectedNode.totalLockers} {isHi ? "लॉकर व्यवहृत" : "lockers occupied"}
            </div>
          </div>

          {/* Detailed Locker Category Grid */}
          <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Boxes className="h-4 w-4 text-cyan-400" />
                {isHi ? "लॉकर श्रेणी-वार उपयोगिता" : "Locker Type Breakdown & Availability"}
              </h5>
              <span className="text-[11px] font-mono text-cyan-400">
                {selectedNode.totalLockers - selectedNode.usedLockers} {isHi ? "लॉकर खाली" : "lockers available"}
              </span>
            </div>

            {/* 4 Locker Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Small Box */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    {isHi ? "छोटा सूटकेस व बॉक्स" : "Small Box / Carry-on"}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedNode.breakdown.smallBox.used} / {selectedNode.breakdown.smallBox.total}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculatePercent(
                        selectedNode.breakdown.smallBox.used,
                        selectedNode.breakdown.smallBox.total
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium Trunk */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-cyan-400" />
                    {isHi ? "मध्यम ट्रंक व बैग" : "Medium Storage Trunk"}
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {selectedNode.breakdown.mediumTrunk.used} / {selectedNode.breakdown.mediumTrunk.total}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculatePercent(
                        selectedNode.breakdown.mediumTrunk.used,
                        selectedNode.breakdown.mediumTrunk.total
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Large Appliance */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-amber-400" />
                    {isHi ? "बड़ा कूलर व उपकरण" : "Large Cooler / Appliance"}
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {selectedNode.breakdown.largeAppliance.used} / {selectedNode.breakdown.largeAppliance.total}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculatePercent(
                        selectedNode.breakdown.largeAppliance.used,
                        selectedNode.breakdown.largeAppliance.total
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Climate Control */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-rose-400" />
                    {isHi ? "क्लाइमेट-नियंत्रित वॉल्ट" : "Climate-Controlled Vault"}
                  </span>
                  <span className="font-mono font-bold text-rose-400">
                    {selectedNode.breakdown.climateControl.used} / {selectedNode.breakdown.climateControl.total}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculatePercent(
                        selectedNode.breakdown.climateControl.used,
                        selectedNode.breakdown.climateControl.total
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isHi ? "आरक्षित बफर कोटा" : "Emergency Reserve Buffer"}:{" "}
                  <strong className="text-foreground">{selectedNode.reservedBuffer} {isHi ? "लॉकर" : "lockers"}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateLock(selectedNode.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Lock className="h-3 w-3" />
                  <span>{isHi ? "सिम्युलेट लॉकिंग" : "Simulate Booking"}</span>
                </button>

                {onReserveBufferClick && (
                  <button
                    onClick={() => onReserveBufferClick(selectedNode.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <ChevronRight className="h-3 w-3" />
                    <span>{isHi ? "बफर जारी करें" : "Release Buffer"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
