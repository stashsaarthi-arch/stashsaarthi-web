import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Coins,
  Users,
  ShieldCheck,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  PieChart,
  Layers,
  Award,
  CheckCircle2,
  Sparkles,
  Calculator,
  Percent,
  Clock,
  ArrowUpRight,
  Boxes,
  Home,
  Soup,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateExecutiveMetrics,
  exportExecutiveAnalyticsJson,
  type ExecutiveAnalyticsData,
} from "@/lib/ceoAnalytics";
import { useLanguage } from "@/context/LanguageContext";
import { handleDownloadInvestorMemo } from "./legal";

export function ExecutiveAnalyticsDashboard() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [metrics, setMetrics] = useState<ExecutiveAnalyticsData>(() => calculateExecutiveMetrics());
  const [activeTab, setActiveTab] = useState<"cac_ltv" | "tokens" | "sprints">("cac_ltv");

  // Interactive CAC/LTV Simulator state
  const [targetCac, setTargetCac] = useState<number>(metrics.blendedCac);
  const [retentionMonths, setRetentionMonths] = useState<number>(4.5);

  const simulatedLtvNet = useMemo(() => {
    // Average net monthly contribution per active user across storage/spaces/kitchen
    const monthlyNetContribution = 850;
    return Math.round(monthlyNetContribution * retentionMonths);
  }, [retentionMonths]);

  const simulatedLtvCacRatio = useMemo(() => {
    return Number((simulatedLtvNet / (targetCac || 1)).toFixed(1));
  }, [simulatedLtvNet, targetCac]);

  const simulatedPaybackDays = useMemo(() => {
    const dailyNet = (simulatedLtvNet / retentionMonths) / 30;
    return Math.round(targetCac / (dailyNet || 1));
  }, [targetCac, simulatedLtvNet, retentionMonths]);

  const handleRefresh = () => {
    setMetrics(calculateExecutiveMetrics());
  };

  return (
    <div className="section-isolated layout-isolated w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isHi ? "कार्यकारी विश्लेषिकी एवं यूनिट इकोनॉमिक्स" : "Executive Analytics & Core Unit Economics"}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sprint 10
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHi
                ? "CAC, LTV, टोकन सर्कुलेशन और स्प्रिंट निष्पादन टेलीमेट्री (Kanpur Platform)"
                : "Real-time CAC, LTV, Token Circulation & Sprint Execution Metrics (Kanpur Platform)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            {isHi ? "रिफ्रेश" : "Refresh"}
          </Button>
          <Button
            onClick={exportExecutiveAnalyticsJson}
            variant="outline"
            size="sm"
            className="bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            {isHi ? "JSON एक्सपोर्ट" : "Export JSON"}
          </Button>
          <Button
            onClick={() => handleDownloadInvestorMemo(language)}
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {isHi ? "इन्वेस्टर मेमो" : "Executive Brief"}
          </Button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Blended CAC */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? "मिश्रित ग्राहक अधिग्रहण लागत (CAC)" : "Blended CAC"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">₹{metrics.blendedCac}</div>
          <p className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
            {isHi ? "-14% पारंपरिक चैनलों से बेहतर" : "-14% vs traditional channels"}
          </p>
        </div>

        {/* Blended LTV */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? "छात्र जीवनकाल मूल्य (Net LTV)" : "Student Lifetime Value (LTV)"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">₹{metrics.blendedLtvNet.toLocaleString("en-IN")}</div>
          <p className="text-[11px] text-cyan-300/80 mt-1">
            ₹{metrics.blendedLtvGross.toLocaleString("en-IN")} {isHi ? "सकल GMV" : "Gross GMV"}
          </p>
        </div>

        {/* LTV / CAC Ratio */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? "LTV / CAC अनुपात" : "LTV / CAC Ratio"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{metrics.ltvCacRatio}x</div>
          <p className="text-[11px] text-amber-300/80 mt-1">
            {isHi ? "उच्च दक्षता (>3.0x मानक)" : "High Efficiency (>3.0x benchmark)"}
          </p>
        </div>

        {/* Active Token Circulation */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-violet-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? "सक्रिय टोकन सर्कुलेशन" : "Active Token Circulation"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Coins className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-violet-400">{metrics.tokens.activeTokensInCirculation}</div>
          <p className="text-[11px] text-violet-300/80 mt-1">
            ₹{metrics.tokens.totalLiabilityInr.toLocaleString("en-IN")} {isHi ? "सक्रिय देयता" : "Active Wallet Liability"}
          </p>
        </div>

        {/* Platform Net Margin */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-rose-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? "प्लेटफॉर्म शुद्ध मार्जिन" : "Platform Net Margin"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400">{metrics.platformNetMarginPercent}%</div>
          <p className="text-[11px] text-rose-300/80 mt-1">
            {isHi ? "शून्य-CapEx नेटवर्क मॉडल" : "Zero-CapEx Network Margin"}
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("cac_ltv")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "cac_ltv"
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <PieChart className="h-3.5 w-3.5" />
          {isHi ? "CAC एवं LTV यूनिट इकोनॉमिक्स" : "CAC & LTV Unit Economics"}
        </button>
        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "tokens"
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          {isHi ? "टोकन लेजर एवं सर्कुलेशन" : "Active Token Ledger"}
        </button>
        <button
          onClick={() => setActiveTab("sprints")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "sprints"
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          {isHi ? "स्प्रिंट रोडमैप प्रगति" : "Sprint Execution Roadmap"}
        </button>
      </div>

      {/* TAB 1: CAC & LTV Unit Economics */}
      {activeTab === "cac_ltv" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CAC Channel Breakdown */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  {isHi ? "चैनल-वार ग्राहक अधिग्रहण लागत (CAC)" : "Channel Customer Acquisition Cost (CAC)"}
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {isHi ? "औसत" : "Blended"}: ₹{metrics.blendedCac}
                </span>
              </div>

              <div className="space-y-3">
                {metrics.channelCacBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.channel}</span>
                      <span className="font-mono font-bold text-emerald-400">₹{item.cac} / lead</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{isHi ? "चैनल शेयर" : "Channel Share"}: {item.share}%</span>
                      <span>{isHi ? "अनुमानित लीड" : "Volume"}: {item.volume} {isHi ? "लीड्स" : "leads"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service LTV Matrix */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  {isHi ? "सेवा-वार जीवनकाल मूल्य (LTV Matrix)" : "Service Line Lifetime Value (LTV)"}
                </h3>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  {isHi ? "लाइफटाइम Net LTV" : "Net LTV"}: ₹{metrics.blendedLtvNet.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-3">
                {metrics.serviceLtvBreakdown.map((svc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {svc.service === "stash" && <Boxes className="h-3.5 w-3.5 text-emerald-400" />}
                        {svc.service === "spaces" && <Home className="h-3.5 w-3.5 text-cyan-400" />}
                        {svc.service === "kitchen" && <Soup className="h-3.5 w-3.5 text-amber-400" />}
                        {svc.name}
                      </span>
                      <span className="font-mono font-bold text-cyan-300">₹{svc.totalLtvNet} net</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-black/40 p-2 rounded-lg">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{isHi ? "औसत अवधि" : "Avg Stay"}</span>
                        <span className="text-slate-200 font-bold">{svc.avgDurationMonths} {isHi ? "महीने" : "mo"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{isHi ? "मासिक राजस्व" : "Monthly Rev"}</span>
                        <span className="text-slate-200 font-bold">₹{svc.monthlyRevenue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{isHi ? "मासिक नेट मार्जिन" : "Monthly Margin"}</span>
                        <span className="text-emerald-400 font-bold">₹{svc.monthlyNetMargin}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive CAC & LTV Simulator */}
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-amber-400" />
                {isHi ? "इंटरएक्टिव CAC / LTV और पेबैक सिम्युलेटर" : "Interactive CAC / LTV & Payback Simulator"}
              </h3>
              <span className="text-[11px] text-amber-400 font-mono">
                {isHi ? "पेबैक अवधि" : "Payback Period"}: ~{simulatedPaybackDays} {isHi ? "दिन" : "days"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isHi ? "लक्ष्य अधिग्रहण लागत (Target CAC)" : "Target CAC Threshold"}</span>
                  <span className="font-mono font-bold text-amber-400">₹{targetCac}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="5"
                  value={targetCac}
                  onChange={(e) => setTargetCac(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isHi ? "औसत ग्राहक प्रतिधारण अवधि (Months)" : "Avg Customer Retention Period"}</span>
                  <span className="font-mono font-bold text-cyan-400">{retentionMonths} {isHi ? "महीने" : "mo"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={retentionMonths}
                  onChange={(e) => setRetentionMonths(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {isHi ? "अनुमानित लाइफटाइम शुद्ध लाभ (Simulated Net LTV)" : "Simulated Net LTV per Student"}
                </span>
                <span className="text-xl font-bold text-emerald-400">₹{simulatedLtvNet.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {isHi ? "अनुमानित LTV / CAC अनुपात" : "Simulated LTV / CAC Ratio"}
                </span>
                <span className="text-xl font-bold text-amber-400">{simulatedLtvCacRatio}x</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {isHi ? "1000 छात्रों पर वार्षिक शुद्ध लाभ" : "Projected Annual Net Margin (1k active)"}
                </span>
                <span className="text-xl font-bold text-cyan-400">₹{((simulatedLtvNet * 1000) / 100000).toFixed(2)} Lakhs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Active Token Ledger */}
      {activeTab === "tokens" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-violet-500/30">
              <span className="text-xs text-slate-400 block">{isHi ? "कुल जारी टोकन" : "Total Tokens Issued"}</span>
              <span className="text-2xl font-bold text-violet-400">{metrics.tokens.totalTokensIssued}</span>
              <p className="text-[11px] text-slate-400 mt-1">
                {isHi ? "ट्रायल, मील पास एवं रेफरल टोकन" : "Trial, Meal Pass & Referral Tokens"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30">
              <span className="text-xs text-slate-400 block">{isHi ? "भुनाए गए टोकन" : "Redeemed Tokens"}</span>
              <span className="text-2xl font-bold text-emerald-400">{metrics.tokens.totalTokensRedeemed}</span>
              <p className="text-[11px] text-emerald-300/80 mt-1">
                {metrics.tokens.redemptionRatePercent}% {isHi ? "रिडेम्पशन दर" : "Redemption Rate"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30">
              <span className="text-xs text-slate-400 block">{isHi ? "सक्रिय वॉलेट देयता" : "Active Wallet Liability"}</span>
              <span className="text-2xl font-bold text-amber-400">₹{metrics.tokens.totalLiabilityInr.toLocaleString("en-IN")}</span>
              <p className="text-[11px] text-amber-300/80 mt-1">
                {metrics.tokens.activeTokensInCirculation} {isHi ? "सक्रिय टोकन (₹60 दर पर)" : "active tokens @ ₹60/token"}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="h-4 w-4 text-violet-400" />
              {isHi ? "टोकन परिसंचरण प्रकार विश्लेषण" : "Active Token Breakdown by Category"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{isHi ? "ज़ीरो-फी ट्रायल टोकन" : "Zero-Fee Trial Tokens"}</span>
                  <span className="font-mono text-emerald-400 font-bold">{metrics.tokens.trialTokensClaimed - metrics.tokens.trialTokensRedeemed} active</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>{isHi ? "दावा किया:" : "Claimed:"} {metrics.tokens.trialTokensClaimed}</span> |{" "}
                  <span>{isHi ? "भुनाया:" : "Redeemed:"} {metrics.tokens.trialTokensRedeemed}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{isHi ? "सार्थी टिफिन मील पास" : "Tiffin Meal Passes"}</span>
                  <span className="font-mono text-amber-400 font-bold">{metrics.tokens.mealPassTokensActive} active</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>{isHi ? "दैनिक टोकन पास कोटा" : "Daily Meal Pass Tokens"}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{isHi ? "रेफरल वॉलेट क्रेडिट" : "Referral Credits"}</span>
                  <span className="font-mono text-cyan-400 font-bold">{metrics.tokens.referralCreditsActive} active</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>{isHi ? "व्हाट्सएप रेफरल बोनस" : "WhatsApp Referral Bonus"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Sprint Execution Roadmap */}
      {activeTab === "sprints" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-400" />
                {isHi ? "स्प्रिंट रोडमैप प्रगति एवं सत्यापन (Sprints 0-10)" : "Sprint Execution Roadmap (Sprints 0-10)"}
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400">
                98 / 101 {isHi ? "कार्य पूर्ण" : "Tasks Verified"} (97%)
              </span>
            </div>

            <div className="space-y-3">
              {metrics.sprints.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">{s.sprintId}</span>
                      <span className="text-sm font-bold text-white">{s.sprintName}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        s.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {s.status === "completed" ? (isHi ? "पूर्ण" : "Completed") : (isHi ? "सक्रिय" : "Active")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{s.keyHighlight}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>
                      {isHi ? "निष्पादित कार्य:" : "Tasks:"} {s.completedTasks} / {s.totalTasks}
                    </span>
                    <span className="font-mono text-emerald-400">
                      {Math.round((s.completedTasks / s.totalTasks) * 100)}% {isHi ? "पूर्ण" : "complete"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
