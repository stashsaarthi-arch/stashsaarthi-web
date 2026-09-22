import { useState, useEffect } from "react";
import {
  X,
  QrCode,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  Sun,
  Moon,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  STRESS_PROFILES,
  runBarcodeScanStressTest,
  decodeBarcodeWithHtml5Qrcode,
  applyScannerPreprocessing,
  type StressTestSummary,
  type ScanResult,
} from "@/lib/barcodeScanStressEngine";

interface BarcodeScanStressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BarcodeScanStressModal({ isOpen, onClose }: BarcodeScanStressModalProps) {
  const [activeTab, setActiveTab] = useState<"suite" | "simulator" | "charter">("suite");
  const [testSummary, setTestSummary] = useState<StressTestSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("dim_and_crumpled_extreme");
  const [sampleBarcode, setSampleBarcode] = useState("SS-SEAL-8921");
  const [liveScanResult, setLiveScanResult] = useState<ScanResult | null>(null);
  const [torchGain, setTorchGain] = useState(true);

  useEffect(() => {
    if (isOpen && !testSummary) {
      const summary = runBarcodeScanStressTest(100);
      setTestSummary(summary);
    }
  }, [isOpen, testSummary]);

  if (!isOpen) return null;

  const handleRunStressSuite = () => {
    setIsRunning(true);
    toast.info("Running 100-Sample Scan Stress Suite...", {
      description:
        "Testing html5-qrcode decode rate across dim lighting (<30 lx) and crumpled tape.",
    });

    setTimeout(() => {
      const summary = runBarcodeScanStressTest(100);
      setTestSummary(summary);
      setIsRunning(false);

      if (summary.passTarget95Percent) {
        toast.success(`Decode Test Passed: ${summary.decodeRatePercent}% Success!`, {
          description: `Exceeds 95.0% SLA target (${summary.successfulDecodes}/${summary.totalScans} decoded).`,
        });
      } else {
        toast.error(`Decode Rate Below SLA: ${summary.decodeRatePercent}%`, {
          description: "Required >= 95.0% decode accuracy under stress.",
        });
      }
    }, 800);
  };

  const handleSimulateLiveScan = () => {
    const profile = STRESS_PROFILES.find((p) => p.id === selectedProfileId) || STRESS_PROFILES[0]!;
    const res = decodeBarcodeWithHtml5Qrcode(sampleBarcode, profile);
    setLiveScanResult(res);

    if (res.success) {
      toast.success("Barcode Decoded Successfully", {
        description: `Confidence: ${res.confidenceScore}% in ${res.scanTimeMs}ms`,
      });
    } else {
      toast.error("Decode Failed", {
        description: "Increase lighting or activate torch gain.",
      });
    }
  };

  const activeProfile =
    STRESS_PROFILES.find((p) => p.id === selectedProfileId) || STRESS_PROFILES[0]!;
  const preprocessedStats = applyScannerPreprocessing(
    activeProfile.contrastRatio,
    activeProfile.lightingLux,
    activeProfile.crumpleDistortionLevel,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-500/30 bg-[#0A0D0F] text-foreground shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-emerald-950/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Barcode Scan Stress Test (html5-qrcode)
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  🎯 95%+ SLA Target
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Dim Lighting (&lt;30 lx) & Crumpled Tape Decode Assurance Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-white/[0.02] p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("suite")}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "suite"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            100-Sample Test Suite
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "simulator"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Live Preprocessing Simulator
          </button>
          <button
            onClick={() => setActiveTab("charter")}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "charter"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            QA Decode Charter
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: 100-SAMPLE STRESS SUITE */}
          {activeTab === "suite" && testSummary && (
            <div className="space-y-4">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Decode Pass Rate
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-emerald-400">
                      {testSummary.decodeRatePercent}%
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Decoded / Total
                  </span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {testSummary.successfulDecodes} / {testSummary.totalScans}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Avg Decode Speed
                  </span>
                  <span className="text-2xl font-bold text-amber-400">
                    {testSummary.avgScanTimeMs} ms
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    SLA Audit Result
                  </span>
                  <span className="text-xs font-extrabold uppercase text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-md inline-block">
                    {testSummary.passTarget95Percent ? "PASSED (>= 95%)" : "FAILED"}
                  </span>
                </div>
              </div>

              {/* Stress Profile Breakdown */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <span className="text-xs font-semibold text-foreground block">
                  📊 Decode Accuracy per Lighting & Crumple Profile (100 Samples):
                </span>
                <div className="space-y-2.5">
                  {STRESS_PROFILES.map((p) => {
                    const stats = testSummary.profileBreakdown[p.id];
                    const rate = stats ? stats.rate : 0;
                    return (
                      <div key={p.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{p.name}</span>
                          <span className="font-mono text-emerald-400 font-bold">{rate}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleRunStressSuite}
                disabled={isRunning}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl shadow-lg"
              >
                {isRunning ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Re-Run 100-Sample Stress Benchmark Suite
              </Button>
            </div>
          )}

          {/* TAB 2: LIVE PREPROCESSING SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">
                    Select Lighting & Surface Stress Profile:
                  </label>
                  <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:border-emerald-500"
                  >
                    {STRESS_PROFILES.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0A0D0F] text-foreground">
                        {p.name} ({p.lightingLux} lx)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">
                    Sample Barcode / Serial Tag:
                  </label>
                  <input
                    type="text"
                    value={sampleBarcode}
                    onChange={(e) => setSampleBarcode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Preprocessing Telemetry Matrix */}
              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  html5-qrcode Signal Preprocessing Engine Metrics:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Contrast Boost
                    </span>
                    <span className="text-foreground font-bold">
                      {preprocessedStats.enhancedContrast}x
                    </span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Normalized Gain
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {preprocessedStats.normalizedBrightness} lx
                    </span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Noise Filtering
                    </span>
                    <span className="text-amber-400 font-bold">
                      {preprocessedStats.noiseReduction}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSimulateLiveScan}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs rounded-xl shadow-lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Simulate Camera Scan Decode
              </Button>

              {liveScanResult && (
                <div
                  className={`p-4 rounded-2xl border ${
                    liveScanResult.success
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-rose-500/40 bg-rose-950/20"
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      Decode Output: {liveScanResult.barcode}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Score: {liveScanResult.confidenceScore}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preprocessed: Yes • Error Correction Applied:{" "}
                    {liveScanResult.errorCorrectionApplied ? "Yes (Reed-Solomon)" : "No"} • Decode
                    Time: {liveScanResult.scanTimeMs}ms
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QA CHARTER */}
          {activeTab === "charter" && (
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-sm text-foreground">
                  html5-qrcode Low-Light & Crease Decode Charter
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                <li>
                  <strong className="text-foreground">Adaptive Contrast Enhancement:</strong> In
                  low-light (&lt;30 lx), the camera frame triggers dynamic binarization to separate
                  barcode bars from dark packaging backgrounds.
                </li>
                <li>
                  <strong className="text-foreground">Reed-Solomon Parity Recovery:</strong>{" "}
                  Wrinkles and creases up to 30% distortion are reconstructed via parity check
                  matrices.
                </li>
                <li>
                  <strong className="text-foreground">Flashlight Exposure Compensation:</strong>{" "}
                  Auto-boosts camera torch gain when ambient lux falls below 25.
                </li>
                <li>
                  <strong className="text-foreground">SLA Requirement:</strong> Minimum 95.0% pass
                  rate guaranteed across all doorstep fleet scans.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
