import { useState, useEffect, useCallback } from "react";
import {
  X,
  QrCode,
  Camera,
  Flashlight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  MessageCircle,
  Package,
  Weight,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  Search,
  Navigation,
  ChevronRight,
  Sparkles,
  SignalLow,
  Send,
  Smartphone,
  ShieldAlert,
  Copy,
  Radio,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getRunnerTasks,
  processDoorstepScan,
  confirmDeliveryToHost,
  getRunnerStats,
  type RunnerTask,
} from "@/lib/deliveryFleetEngine";
import {
  generateRunnerOtp,
  generateEncryptedSmsPayload,
  parseAndVerifySmsPayload,
  verifyRunnerOtpSms,
  getNativeSmsUri,
} from "@/lib/smsFallbackGateway";

interface DeliveryFleetScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryFleetScannerModal({ isOpen, onClose }: DeliveryFleetScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"scanner" | "queue" | "stats" | "sms">("scanner");
  const [tasks, setTasks] = useState<RunnerTask[]>([]);
  const [scannedInput, setScannedInput] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [activeScanTask, setActiveScanTask] = useState<RunnerTask | null>(null);
  const [intakeWeight, setIntakeWeight] = useState<number>(18.5);
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState(getRunnerStats());

  // SMS Fallback Gateway State (Task 129)
  const [isCellularDataOff, setIsCellularDataOff] = useState(false);
  const [smsOtpInput, setSmsOtpInput] = useState("");
  const [smsRawPacketInput, setSmsRawPacketInput] = useState("");
  const [selectedTaskForSms, setSelectedTaskForSms] = useState<RunnerTask | null>(null);
  const [copiedSms, setCopiedSms] = useState(false);

  const refreshTasks = useCallback(() => {
    const loaded = getRunnerTasks();
    setTasks(loaded);
    setStats(getRunnerStats());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    refreshTasks();
    const handleUpdate = () => refreshTasks();
    window.addEventListener("stashsaarthi:runner-task-updated", handleUpdate);
    return () => {
      window.removeEventListener("stashsaarthi:runner-task-updated", handleUpdate);
    };
  }, [isOpen, refreshTasks]);

  if (!isOpen) return null;

  const triggerVibration = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // ignore if not supported
      }
    }
  };

  const handleScanBarcode = (barcodeToScan: string) => {
    setIsScanning(true);
    triggerVibration();

    setTimeout(() => {
      setIsScanning(false);
      const res = processDoorstepScan(barcodeToScan, intakeWeight);
      if (res.success && res.task) {
        setActiveScanTask(res.task);
        toast.success(res.message, {
          description: `Tamper Seal ${res.task.tamperSealBarcode} verified.`,
        });
        refreshTasks();
      } else {
        toast.error("Barcode Not Found", { description: res.message });
      }
    }, 600);
  };

  const handleConfirmHostHandover = (taskId: string) => {
    const res = confirmDeliveryToHost(taskId);
    if (res.success) {
      toast.success("Handover Confirmed!", { description: res.message });
      setActiveScanTask(null);
      refreshTasks();
    } else {
      toast.error("Error", { description: res.message });
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "assigned" || t.status === "en_route");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-[#0A0D0F] text-foreground shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top PWA Runner Header */}
        <div className="p-4 border-b border-white/10 bg-emerald-950/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Delivery Fleet Mini-PWA</span>
                <button
                  onClick={() => {
                    const nextState = !isCellularDataOff;
                    setIsCellularDataOff(nextState);
                    if (nextState) {
                      setActiveTab("sms");
                      toast.warning("Cellular Data Offline", {
                        description: "Switched to encrypted SMS OTP fallback mode.",
                      });
                    } else {
                      toast.success("Cellular Data Restored", {
                        description: "Connected back to 5G / High-speed internet.",
                      });
                    }
                  }}
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                    isCellularDataOff
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                      : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  }`}
                  title="Click to toggle cellular data simulation mode"
                >
                  {isCellularDataOff ? (
                    <>
                      <SignalLow className="h-3 w-3 text-amber-400" />
                      <span>SMS Fallback Mode</span>
                    </>
                  ) : (
                    <>
                      <span>⚡ 5G Online</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Runner: <span className="text-emerald-400 font-medium">{stats.runnerName}</span> •
                SLA: <span className="text-amber-400 font-mono font-bold">14m Avg</span>
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

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-white/[0.02] p-1.5 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "scanner"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            Scanner
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "queue"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            Queue ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "stats"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab("sms")}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "sms"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-md"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <SignalLow className="h-3.5 w-3.5 text-amber-400" />
            SMS Gateway
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: BARCODE SCANNER */}
          {activeTab === "scanner" && (
            <div className="space-y-4">
              {/* Simulated Viewfinder */}
              <div className="relative aspect-[4/3] max-h-60 sm:max-h-72 w-full rounded-2xl border-2 border-dashed border-emerald-500/40 bg-black/80 overflow-hidden flex flex-col items-center justify-center p-4 group">
                <div
                  className={`absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none transition-opacity ${
                    isScanning ? "opacity-100" : "opacity-30"
                  }`}
                />

                {/* Laser scan bar animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-pulse top-1/2 -translate-y-1/2" />

                {/* Camera Viewfinder Reticle */}
                <div className="relative w-48 h-32 border-2 border-emerald-400 rounded-xl flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />
                  <span className="text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ALIGN BARCODE TAG HERE
                  </span>
                </div>

                {/* Flashlight toggle */}
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className={`absolute top-3 right-3 h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
                    torchOn
                      ? "bg-amber-400/20 border-amber-400 text-amber-300"
                      : "bg-white/10 border-white/20 text-muted-foreground hover:bg-white/20"
                  }`}
                  title="Toggle Torch Light"
                >
                  <Flashlight className="h-4 w-4" />
                </button>

                <div className="absolute bottom-3 text-center">
                  <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 animate-bounce" />
                    Point Camera at Luggage Barcode or Tap Quick Scan below
                  </p>
                </div>
              </div>

              {/* Quick Scan Simulation Buttons */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  ⚡ Instant Scan Presets (Doorstep Pickups):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      setScannedInput("SS-SEAL-8921");
                      handleScanBarcode("SS-SEAL-8921");
                    }}
                    variant="outline"
                    className="h-11 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 justify-start text-xs font-mono font-bold"
                  >
                    <QrCode className="h-4 w-4 mr-2 text-emerald-400" />
                    Scan SS-SEAL-8921 (PW Kakadeo)
                  </Button>
                  <Button
                    onClick={() => {
                      setScannedInput("SS-SEAL-4412");
                      handleScanBarcode("SS-SEAL-4412");
                    }}
                    variant="outline"
                    className="h-11 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 justify-start text-xs font-mono font-bold"
                  >
                    <QrCode className="h-4 w-4 mr-2 text-emerald-400" />
                    Scan SS-SEAL-4412 (IIT Kanpur)
                  </Button>
                </div>
              </div>

              {/* Manual Barcode Input Fallback */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-emerald-400" />
                  Manual Barcode / Booking ID Input:
                </span>
                <div className="flex gap-2">
                  <Input
                    value={scannedInput}
                    onChange={(e) => setScannedInput(e.target.value)}
                    placeholder="Enter seal code (e.g. SS-SEAL-8921)..."
                    className="bg-white/5 border-white/10 text-xs font-mono text-foreground uppercase"
                  />
                  <Button
                    onClick={() => handleScanBarcode(scannedInput)}
                    disabled={!scannedInput.trim()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shrink-0"
                  >
                    Process Scan
                  </Button>
                </div>
              </div>

              {/* Active Scanned Intake Task Details Drawer */}
              {activeScanTask && (
                <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-3 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="font-bold text-sm text-emerald-300">
                        Intake Scanned: {activeScanTask.studentName}
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                      {activeScanTask.tamperSealBarcode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Hostel Address
                      </span>
                      <span className="font-medium text-foreground">{activeScanTask.address}</span>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Locker Node
                      </span>
                      <span className="font-medium text-emerald-400">
                        {activeScanTask.campusNode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                        Handover Weight Check (kg):
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        value={intakeWeight}
                        onChange={(e) => setIntakeWeight(parseFloat(e.target.value) || 0)}
                        className="bg-black/50 border-emerald-500/30 text-xs text-foreground font-mono"
                      />
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-400 pt-4">
                      <ShieldCheck className="h-4 w-4" />
                      Seal Intact Verified
                    </div>
                  </div>

                  <Button
                    onClick={() => handleConfirmHostHandover(activeScanTask.id)}
                    className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs rounded-xl shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Doorstep Intake & Transfer to Host Locker
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOORSTEP QUEUE */}
          {activeTab === "queue" && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No active runner tasks assigned.
                </div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      t.status === "delivered_to_host"
                        ? "border-white/10 bg-white/[0.02] opacity-75"
                        : t.status === "scanned_intake"
                          ? "border-emerald-500/40 bg-emerald-950/20"
                          : "border-amber-500/30 bg-amber-950/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{t.studentName}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-muted-foreground">
                          {t.id}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          t.status === "delivered_to_host"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : t.status === "scanned_intake"
                              ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      {t.address} ({t.distanceMeters}m away)
                    </p>

                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs text-muted-foreground font-mono mb-3">
                      💡 {t.instructions}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${t.studentPhone}`}
                          className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground font-medium flex items-center gap-1.5 hover:bg-white/10"
                        >
                          <Phone className="h-3.5 w-3.5 text-emerald-400" />
                          Call Student
                        </a>
                        <a
                          href={`https://wa.me/${t.studentPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-xs text-[#25D366] font-medium flex items-center gap-1.5 hover:bg-[#25D366]/20"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          WhatsApp
                        </a>
                      </div>

                      {t.status === "assigned" && (
                        <Button
                          onClick={() => {
                            setActiveTab("scanner");
                            setScannedInput(t.tamperSealBarcode);
                            handleScanBarcode(t.tamperSealBarcode);
                          }}
                          className="h-8 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs"
                        >
                          Scan Barcode →
                        </Button>
                      )}
                      {t.status === "scanned_intake" && (
                        <Button
                          onClick={() => handleConfirmHostHandover(t.id)}
                          className="h-8 bg-teal-500 hover:bg-teal-600 text-black font-bold text-xs"
                        >
                          Transfer to Host →
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SLA TELEMETRY */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Completed Pickups
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {stats.completedDelivered}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Pending Doorstep SLA
                  </span>
                  <span className="text-2xl font-bold text-amber-400">{stats.pendingPickups}</span>
                </div>
                <div className="p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase block mb-1">
                    Average SLA Time
                  </span>
                  <span className="text-2xl font-bold text-cyan-400">{stats.avgSlaMins} mins</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-sm text-foreground">
                    Doorstep Tamper-Proof Audit Charter
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                  <li>
                    Har physical box par unique alphanumeric laser tamper seal ID match hona
                    mandatory hai.
                  </li>
                  <li>Max box weight limit: 25.0 kg per standard luggage box.</li>
                  <li>Doorstep photo proof upload automated server hash log me store hoti hai.</li>
                  <li>
                    Verified PG Owner host handover complete hone par instant WhatsApp audit receipt
                    push hota hai.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
