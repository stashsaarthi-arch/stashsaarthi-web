import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  runAndroidGoPerformanceAudit,
  measureAndroidGoFpsBenchmark,
  type AndroidGoPerformanceAuditReport,
} from "@/lib/androidGoPerformanceAudit";
import { diagnoseAndroidGo } from "@/lib/androidGoGuard";
import {
  Smartphone,
  Cpu,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

interface AndroidGoPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AndroidGoPerformanceModal({
  open,
  onOpenChange,
}: AndroidGoPerformanceModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [report, setReport] = useState<AndroidGoPerformanceAuditReport | null>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [fpsResult, setFpsResult] = useState<{
    avgFps: number;
    minFps: number;
    frameTimeJitterMs: number;
  } | null>(null);
  const [isGoModeActive, setIsGoModeActive] = useState(false);

  useEffect(() => {
    if (open) {
      const audit = runAndroidGoPerformanceAudit();
      setReport(audit);

      if (typeof document !== "undefined") {
        const root = document.documentElement;
        setIsGoModeActive(
          root.classList.contains("android-go-mode") ||
            root.getAttribute("data-android-go") === "true"
        );
      }
    }
  }, [open]);

  const handleRunBenchmark = async () => {
    setBenchmarking(true);
    toast.info(isHi ? "एफपीएस बेंचमार्क चल रहा है..." : "Running 1s FPS benchmark test...");
    const res = await measureAndroidGoFpsBenchmark(1000);
    setFpsResult(res);
    setBenchmarking(false);

    toast.success(
      isHi
        ? `बेंचमार्क पूर्ण! औसतन: ${res.avgFps} FPS (न्यूनतम: ${res.minFps} FPS)`
        : `Benchmark complete! Avg: ${res.avgFps} FPS (Min: ${res.minFps} FPS)`
    );
  };

  const handleToggleGoMode = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const newGoState = !isGoModeActive;

    if (newGoState) {
      root.classList.add("android-go-mode");
      root.setAttribute("data-android-go", "true");
    } else {
      root.classList.remove("android-go-mode");
      root.setAttribute("data-android-go", "false");
    }

    setIsGoModeActive(newGoState);
    const updatedAudit = runAndroidGoPerformanceAudit();
    setReport(updatedAudit);

    toast.success(
      newGoState
        ? isHi
          ? "⚡ एंड्रॉइड गो लो-मेमोरी मोड सक्रिय!"
          : "⚡ Android Go Ultra-Low-Memory Mode Enabled!"
        : isHi
          ? "स्टैंडर्ड प्रदर्शन मोड पुनर्स्थापित।"
          : "Standard performance mode restored."
    );
  };

  const diag = diagnoseAndroidGo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0A0D0F]/95 backdrop-blur-xl border border-white/10 text-white p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold">
                {isHi
                  ? "📱 एंड्रॉइड गो डिवाइस परफॉर्मेंस व क्रैश-सेफ्टी ऑडिट"
                  : "📱 Android Go & Low-Spec Device Performance Guard"}
              </DialogTitle>
            </div>
            {report && (
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-0.5 border ${
                  report.overallScore >= 90
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/50 bg-amber-500/10 text-amber-400"
                }`}
              >
                Score: {report.overallScore}/100
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {isHi
              ? "कानपुर के छात्रों के लिए कम बजट वाले एंड्रॉइड गो स्मार्टफोन्स (जैसे JioPhone Next, Redmi A1, Samsung A01) पर 100% क्रैश-मुक्त प्रदर्शन की पुष्टि।"
              : "Verifies zero-crash memory safety, GPU WebGL fallbacks, and 60 FPS physics stability for entry-level Android Go smartphones common in Kanpur."}
          </DialogDescription>
        </DialogHeader>

        {report && (
          <div className="space-y-4 mt-3">
            {/* Device Hardware Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                  {isHi ? "डिवाइस वर्ग" : "Device Class"}
                </p>
                <p className="text-xs font-bold text-emerald-400 mt-1 truncate">
                  {report.deviceClassification}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                  {isHi ? "रैम बजट" : "RAM Memory"}
                </p>
                <p className="text-xs font-bold text-cyan-400 mt-1">
                  {diag.deviceMemoryGb ? `${diag.deviceMemoryGb} GB` : "Standard API"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                  {isHi ? "सीपीयू कोर" : "CPU Cores"}
                </p>
                <p className="text-xs font-bold text-amber-400 mt-1">
                  {diag.hardwareConcurrency ? `${diag.hardwareConcurrency} Cores` : "Multi-core"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                  {isHi ? "सुरक्षा गार्ड" : "Safety Guard"}
                </p>
                <p className="text-xs font-bold text-emerald-300 mt-1">
                  {isGoModeActive
                    ? isHi
                      ? "⚡ सक्रिय (Active)"
                      : "⚡ Active (Go Mode)"
                    : isHi
                      ? "✓ सुरक्षित (Standard)"
                      : "✓ Standard (Safe)"}
                </p>
              </div>
            </div>

            {/* 5-Point Performance Assertions Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {isHi ? "5-बिंदु परफॉर्मेंस व क्रैश-सुरक्षा मैट्रिक्स" : "5-Point Crash-Safety Audit Matrix"}
              </h4>
              <div className="space-y-2">
                {report.assertions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {item.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-white/10 text-muted-foreground px-1.5 py-0"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground pl-6">{item.details}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {item.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FPS Benchmark & Mode Controls */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    {isHi ? "लाइव एफपीएस (FPS) बेंचमार्क परीक्षण" : "Live Real-Time FPS Benchmark"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {fpsResult
                      ? isHi
                        ? `औसत: ${fpsResult.avgFps} FPS | न्यूनतम: ${fpsResult.minFps} FPS | फ्रेम टाइम जिटर: ${fpsResult.frameTimeJitterMs}ms`
                        : `Avg: ${fpsResult.avgFps} FPS | Min: ${fpsResult.minFps} FPS | Jitter: ${fpsResult.frameTimeJitterMs}ms`
                      : isHi
                        ? "कम बजट वाले डिवाइस पर फ्रेम स्थिरता की जांच करें।"
                        : "Test animation frame stability over a 1000ms window."}
                  </p>
                </div>

                <Button
                  onClick={handleRunBenchmark}
                  disabled={benchmarking}
                  size="sm"
                  className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {benchmarking ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      {isHi ? "माप रहा है..." : "Measuring..."}
                    </>
                  ) : (
                    <>
                      <Gauge className="h-3.5 w-3.5 mr-1.5" />
                      {isHi ? "बेंचमार्क चलाएं" : "Run FPS Test"}
                    </>
                  )}
                </Button>
              </div>

              {fpsResult && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center">
                  <div className="p-2 rounded-lg bg-black/40">
                    <p className="text-[10px] text-muted-foreground">Avg FPS</p>
                    <p className="text-sm font-extrabold text-emerald-400">{fpsResult.avgFps}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40">
                    <p className="text-[10px] text-muted-foreground">Min FPS</p>
                    <p className="text-sm font-extrabold text-amber-400">{fpsResult.minFps}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40">
                    <p className="text-[10px] text-muted-foreground">Frame Jitter</p>
                    <p className="text-sm font-extrabold text-cyan-400">
                      {fpsResult.frameTimeJitterMs}ms
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Android Go Safe Mode Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleToggleGoMode}
                className={`w-full sm:w-auto text-xs font-bold border transition cursor-pointer ${
                  isGoModeActive
                    ? "border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                {isGoModeActive
                  ? isHi
                    ? "✓ एंड्रॉइड गो लो-मेमोरी मोड (सक्रिय)"
                    : "✓ Android Go Ultra-Low Mode (Active)"
                  : isHi
                    ? "⚡ एंड्रॉइड गो सुरक्षित मोड लागू करें"
                    : "⚡ Force Android Go Low-Memory Mode"}
              </Button>

              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-bold cursor-pointer"
              >
                {isHi ? "बंद करें (Close)" : "Close Audit Window"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
