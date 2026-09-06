import React, { useState, useEffect } from "react";
import { Globe, ShieldCheck, Zap, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { edgeRouter, MultiRegionTelemetry } from "@/lib/multiRegionEdgeRouter";
import { useLanguage } from "@/context/LanguageContext";

export const EdgeRegionMonitorWidget: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [telemetry, setTelemetry] = useState<MultiRegionTelemetry>(() =>
    edgeRouter.getTelemetry()
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleFailover = (e: Event) => {
      const customEvent = e as CustomEvent;
      setTelemetry(edgeRouter.getTelemetry());
      setLogMessages((prev) => [
        `[${new Date().toLocaleTimeString()}] ⚠️ ${customEvent.detail.reason}`,
        ...prev.slice(0, 4),
      ]);
    };

    const handleHealth = (e: Event) => {
      const customEvent = e as CustomEvent;
      setTelemetry(edgeRouter.getTelemetry());
      setLogMessages((prev) => [
        `[${new Date().toLocaleTimeString()}] ✅ ${customEvent.detail.message}`,
        ...prev.slice(0, 4),
      ]);
    };

    window.addEventListener("stashsaarthi:edge-region-failover", handleFailover);
    window.addEventListener("stashsaarthi:edge-region-health", handleHealth);

    return () => {
      window.removeEventListener("stashsaarthi:edge-region-failover", handleFailover);
      window.removeEventListener("stashsaarthi:edge-region-health", handleHealth);
    };
  }, []);

  const togglePrimaryOutage = () => {
    setIsSimulating(true);
    const newOutageState = telemetry.primaryHealthy; // If currently healthy, turn outage ON
    edgeRouter.setSimulatedPrimaryOutage(newOutageState);
    setTelemetry(edgeRouter.getTelemetry());

    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-lg">
                {isHi ? "मल्टी-रीजन एज फंक्शन इंफ्रास्ट्रक्चर" : "Multi-Region Edge Function Telemetry"}
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                0ms Failover SLA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHi
                ? "3 भौगोलिक क्षेत्रों में स्वचालित एज नोड फेलओवर और शून्य डाउनटाइम"
                : "Zero-downtime edge routing deployed across 3 global regions with circuit breaker protection"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={togglePrimaryOutage}
          disabled={isSimulating}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
            telemetry.primaryHealthy
              ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {isSimulating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : telemetry.primaryHealthy ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {isHi ? "प्राइमरी आउटेज टेस्ट सिमुलेट करें" : "Simulate Primary Outage (Failover Test)"}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isHi ? "प्राइमरी नोड पुनर्स्थापित करें" : "Restore Primary Region (Mumbai)"}
            </>
          )}
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-[11px] text-slate-400 font-medium">
            {isHi ? "सक्रिय एज नोड" : "Active Edge Node"}
          </p>
          <p className="text-sm font-bold text-cyan-400 mt-1 flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {telemetry.activeRegionName}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-[11px] text-slate-400 font-medium">
            {isHi ? "प्राइमरी नोड स्थिति" : "Primary Region Health"}
          </p>
          <p
            className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${
              telemetry.primaryHealthy ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {telemetry.primaryHealthy ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Healthy
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Outage Active
              </>
            )}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-[11px] text-slate-400 font-medium">
            {isHi ? "औसत लेटेंसी" : "Average Latency"}
          </p>
          <p className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            {telemetry.averageLatencyMs} ms
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-[11px] text-slate-400 font-medium">
            {isHi ? "कुल स्वचालित फेलओवर" : "Total Failover Events"}
          </p>
          <p className="text-sm font-bold text-amber-400 mt-1">
            {telemetry.totalFailovers} {isHi ? "घटनाएं" : "events"}
          </p>
        </div>
      </div>

      {/* Regional Nodes Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {isHi ? "भौगोलिक एज नोड क्लस्टर" : "Geographical Edge Node Clusters"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {telemetry.regions.map((region) => {
            const isActive = region.id === telemetry.activeRegionId;

            return (
              <div
                key={region.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-cyan-950/30 border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/30"
                    : region.status === "UNREACHABLE"
                    ? "bg-rose-950/20 border-rose-800/50 opacity-80"
                    : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label={region.name}>
                      {region.flag}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-100 text-xs">
                        {region.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {region.location}
                      </p>
                    </div>
                  </div>

                  {region.isPrimary && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      Primary
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        region.status === "HEALTHY"
                          ? "bg-emerald-400 animate-pulse"
                          : region.status === "DEGRADED"
                          ? "bg-amber-400"
                          : "bg-rose-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        region.status === "HEALTHY"
                          ? "text-emerald-400"
                          : region.status === "DEGRADED"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {region.status}
                    </span>
                  </div>

                  <span className="text-slate-400 font-mono text-[11px]">
                    {region.latencyMs}ms latency
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Failover Telemetry Log */}
      {logMessages.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isHi ? "लाइव फेलओवर टेलीमेट्री लॉग" : "Live Edge Failover Log"}
          </p>
          <div className="space-y-1 font-mono text-[11px] text-slate-300">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="truncate">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
