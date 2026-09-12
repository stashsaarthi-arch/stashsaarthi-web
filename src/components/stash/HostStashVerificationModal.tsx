import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Package,
  QrCode,
  Scale,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Printer,
  Copy,
  Plus,
  History,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  User,
  MapPin,
  Check,
  LocateFixed,
  Lock,
  Unlock,
  Navigation,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import {
  validateIntakeChecklist,
  createAndSaveVerification,
  getSavedVerifications,
  MAX_ALLOWED_WEIGHT_KG,
  type HostStashVerification,
  type VerificationChecklistState,
} from "@/lib/hostVerificationEngine";
import {
  verifyGeoFenceLocation,
  getSimulatedDeviceLocation,
  PRESET_CAMPUS_HOST_NODES,
  MAX_GEOFENCE_RADIUS_METERS,
  type GeoFenceResult,
  type Coordinates,
} from "@/lib/geoFenceEngine";

interface HostStashVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  hostName?: string;
  campusNode?: string;
}

export function HostStashVerificationModal({
  isOpen,
  onClose,
  bookingId = "BK-2026-9812",
  hostName = "Sudha Tripathi (Senior Host)",
  campusNode = "Kakadeo PW Hub",
}: HostStashVerificationModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  // Geo-Fence State
  const [geoProximityMode, setGeoProximityMode] = useState<"at_node" | "near_node" | "far_away">("at_node");
  const [overrideGeoFence, setOverrideGeoFence] = useState<boolean>(false);
  const [deviceCoords, setDeviceCoords] = useState<Coordinates>(
    getSimulatedDeviceLocation(campusNode, "at_node")
  );

  // Checklist form state
  const [sealIntact, setSealIntact] = useState<boolean>(true);
  const [barcodeSerial, setBarcodeSerial] = useState<string>(`SS-KNP-BAR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [measuredWeightKg, setMeasuredWeightKg] = useState<number>(18.5);
  const [photoProofUrl, setPhotoProofUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Result state
  const [completedRecord, setCompletedRecord] = useState<HostStashVerification | null>(null);
  const [savedRecords, setSavedRecords] = useState<HostStashVerification[]>([]);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSavedRecords(getSavedVerifications());
    }
  }, [isOpen]);

  useEffect(() => {
    setDeviceCoords(getSimulatedDeviceLocation(campusNode, geoProximityMode));
  }, [geoProximityMode, campusNode]);

  if (!isOpen) return null;

  const defaultNode = PRESET_CAMPUS_HOST_NODES["Kakadeo PW Hub"]!;
  const targetNodeConfig = PRESET_CAMPUS_HOST_NODES[campusNode] ?? defaultNode;
  const geoResult: GeoFenceResult = verifyGeoFenceLocation(
    deviceCoords,
    targetNodeConfig.coords,
    campusNode,
    MAX_GEOFENCE_RADIUS_METERS,
    overrideGeoFence
  );

  // Handle camera photo capture simulation
  const handleSimulateCameraCapture = () => {
    setIsCapturingPhoto(true);
    setTimeout(() => {
      const simulatedPhoto = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230b1329'/%3E%3Crect x='80' y='50' width='240' height='200' rx='16' fill='%231e293b' stroke='%2310b981' stroke-width='3'/%3E%3Cpath d='M80 130h240' stroke='%2310b981' stroke-width='2' stroke-dasharray='6,6'/%3E%3Ccircle cx='200' cy='170' r='30' fill='%230f172a' stroke='%2300f5a0' stroke-width='2'/%3E%3Ctext x='200' y='95' fill='%2300f5a0' font-family='sans-serif' font-size='15' font-weight='bold' text-anchor='middle'%3EINTAKE PHOTO PROOF LOGGED%3C/text%3E%3Ctext x='200' y='225' fill='%2394a3b8' font-family='sans-serif' font-size='12' text-anchor='middle'%3EBARCODE: ${barcodeSerial}%3C/text%3E%3Ctext x='200' y='245' fill='%2338bdf8' font-family='sans-serif' font-size='12' font-weight='bold' text-anchor='middle'%3EWEIGHT: ${measuredWeightKg.toFixed(1)} KG%3C/text%3E%3C/svg%3E`;
      setPhotoProofUrl(simulatedPhoto);
      setIsCapturingPhoto(false);
      toast.success(isHi ? "फोटो सबूत कैप्चर हो गया!" : "Photo proof captured successfully!");
    }, 600);
  };

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoProofUrl(event.target.result as string);
          toast.success(isHi ? "फोटो सबूत अपलोड किया गया!" : "Photo proof uploaded!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submission
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();

    // Geo-fence strict lock assertion
    if (!geoResult.inRange) {
      toast.error(
        isHi
          ? `जिओ-फेंस लॉक: आप नोड से ${geoResult.distanceMeters}m दूर हैं! चेक-इन के लिए 50m दायरे में आएं।`
          : `Geo-Fence Locked! You are ${geoResult.distanceMeters}m from node. Must be within 50m to check in.`
      );
      return;
    }

    // Auto capture fallback if no photo
    let photo = photoProofUrl;
    if (!photo) {
      photo = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Crect x='100' y='60' width='200' height='180' rx='12' fill='%231e293b' stroke='%2310b981' stroke-width='3'/%3E%3Ctext x='200' y='100' fill='%2300f5a0' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EBOX SEAL VERIFIED%3C/text%3E%3Ctext x='200' y='160' fill='%2394a3b8' font-family='sans-serif' font-size='12' text-anchor='middle'%3EBARCODE: ${barcodeSerial}%3C/text%3E%3Ctext x='200' y='190' fill='%2338bdf8' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EWEIGHT: ${measuredWeightKg.toFixed(1)} KG%3C/text%3E%3C/svg%3E`;
    }

    const state: VerificationChecklistState = {
      sealIntact,
      barcodeSerial,
      measuredWeightKg,
      photoProofUrl: photo,
      notes,
      deviceCoords,
      overrideGeoFence,
    };

    const validation = validateIntakeChecklist(state, hostName, campusNode);

    if (!validation.geoFencePassed) {
      toast.error(validation.errors[0] || (isHi ? "जिओ-फेंस सत्यापन विफल।" : "Geo-fence check-in verification locked."));
      return;
    }

    if (!validation.sealPassed || !validation.barcodePassed) {
      toast.error(validation.errors[0] || (isHi ? "सत्यापन में त्रुटि है।" : "Intake verification failed. Check seal and barcode."));
      return;
    }

    if (measuredWeightKg > MAX_ALLOWED_WEIGHT_KG) {
      toast.warning(isHi ? "वजन 25kg से अधिक है! स्टैश फ्लैग किया गया।" : "Weight exceeds 25kg limit! Stash flagged for surcharge.");
    }

    const record = createAndSaveVerification(state, bookingId, hostName, campusNode);
    setCompletedRecord(record);
    setSavedRecords(getSavedVerifications());
    toast.success(isHi ? "50m जिओ-फेंस व 3-पॉइंट इनटेक पूर्ण!" : "50m Geo-Fenced 3-Point Intake Completed!");
  };

  const isOverweight = measuredWeightKg > MAX_ALLOWED_WEIGHT_KG;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0A0D0F] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {isHi ? "होस्ट स्टैश 3-पॉइंट इनटेक चेकलिस्ट" : "Host Stash Intake Verification"}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  3-Point Checklist
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {isHi ? "1. सील जांच • 2. बारकोड स्कैन • 3. वजन (<25kg)" : "1. Seal Intact • 2. Barcode Scanned • 3. Weight (<25kg)"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-6">
          <button
            onClick={() => {
              setActiveTab("new");
              setCompletedRecord(null);
            }}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "new"
                ? "border-amber-500 text-amber-300"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            {isHi ? "नया इनटेक सत्यापन" : "New Intake Check"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "history"
                ? "border-amber-500 text-amber-300"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            {isHi ? "इनटेक लॉग्स" : "Verified Intake Logs"} ({savedRecords.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === "history" ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {savedRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {isHi ? "कोई सहेजा गया इनटेक रिकॉर्ड नहीं मिला।" : "No verified intake records found."}
                </div>
              ) : (
                savedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{rec.certificateId}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            rec.status === "verified"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {rec.status === "verified" ? "Verified" : "Flagged"}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          {rec.barcodeSerial}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-amber-400" />
                          {rec.hostName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400" />
                          {rec.campusNode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="h-3 w-3 text-emerald-400" />
                          {rec.measuredWeightKg.toFixed(1)} kg (Max 25kg)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">{rec.notes}</p>
                    </div>

                    {rec.photoProofUrl && (
                      <img
                        src={rec.photoProofUrl}
                        alt="Photo Proof"
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={64}
                        className="h-16 w-24 object-cover rounded-xl border border-white/20 shrink-0"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          ) : completedRecord ? (
            /* Completed Audit Pass View */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent border border-emerald-500/30 text-center space-y-4">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {isHi ? "3-पॉइंट इनटेक पास स्वीकृत" : "3-Point Intake Pass Approved"}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2">
                    {completedRecord.certificateId}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isHi ? "डिजिटल इनटेक ऑडिट रसीद सफलतापूर्वक जनरेट हो गई।" : "Digital Intake Audit Pass successfully generated and saved."}
                  </p>
                </div>

                {/* Audit Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      1. Laser Seal
                    </div>
                    <p className="text-sm font-bold text-emerald-300">
                      {completedRecord.sealIntact ? "INTACT & SEALED" : "BROKEN"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <QrCode className="h-3.5 w-3.5 text-cyan-400" />
                      2. Barcode
                    </div>
                    <p className="text-sm font-mono font-bold text-cyan-300">
                      {completedRecord.barcodeSerial}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Scale className="h-3.5 w-3.5 text-amber-400" />
                      3. Weight
                    </div>
                    <p className={`text-sm font-bold ${completedRecord.measuredWeightKg <= 25 ? "text-amber-300" : "text-rose-400"}`}>
                      {completedRecord.measuredWeightKg.toFixed(1)} kg {completedRecord.measuredWeightKg <= 25 ? "(≤25kg)" : "(OVERWEIGHT)"}
                    </p>
                  </div>
                </div>

                {/* Photo proof preview */}
                {completedRecord.photoProofUrl && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2 text-left">Verified Photo Proof:</p>
                    <img
                      src={completedRecord.photoProofUrl}
                      alt="Verified Box Proof"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={144}
                      className="h-36 w-full object-cover rounded-xl border border-white/20"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `StashSaarthi Host Intake Certificate: ${completedRecord.certificateId}\nBarcode: ${completedRecord.barcodeSerial}\nWeight: ${completedRecord.measuredWeightKg}kg\nHost: ${completedRecord.hostName}`
                      );
                      toast.success(isHi ? "सत्यापन विवरण कॉपी हो गया!" : "Intake details copied!");
                    }}
                    className="flex-1 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {isHi ? "विवरण कॉपी करें" : "Copy Pass"}
                  </button>
                  <button
                    onClick={() => {
                      setCompletedRecord(null);
                      setBarcodeSerial(`SS-KNP-BAR-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isHi ? "एक और बॉक्स जांचें" : "Verify Another Box"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmitVerification} className="space-y-6">
              
              {/* Mandatory Geo-Fence 50-Meter Radius Lock */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                geoResult.inRange
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/40"
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${
                      geoResult.inRange
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    }`}>
                      {geoResult.inRange ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <LocateFixed className="h-4 w-4 text-cyan-400" />
                          {isHi ? "जिओ-फेंस चेक-इन सत्यापन" : "Geo-Fenced Host Check-in Lock"}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          geoResult.inRange
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        }`}>
                          {geoResult.inRange ? "UNLOCKED (≤ 50M)" : "LOCKED (> 50M)"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isHi
                          ? `नोड: ${campusNode} (दायरा: 50 मीटर strict limit)`
                          : `Campus Node: ${campusNode} (Strict 50-meter radius lock)`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className={`text-sm font-bold ${geoResult.inRange ? "text-emerald-300" : "text-rose-300"}`}>
                      {geoResult.distanceMeters}m {isHi ? "दूरी" : "away"}
                    </span>
                    <span className="text-[10px] block text-muted-foreground">Max 50.0m</span>
                  </div>
                </div>

                {/* Geo-Fence Proximity Simulator Buttons */}
                <div className="pt-1 space-y-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{isHi ? "जीपीएस स्थान सिम्युलेटर (Demo):" : "GPS Location Proximity:"}</span>
                    <button
                      type="button"
                      onClick={() => setOverrideGeoFence(!overrideGeoFence)}
                      className="text-cyan-400 hover:underline text-[11px]"
                    >
                      {overrideGeoFence ? "Disable Override" : "Bypass (Demo Only)"}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGeoProximityMode("at_node")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        geoProximityMode === "at_node" && !overrideGeoFence
                          ? "bg-emerald-500/30 text-emerald-200 border-emerald-500/50"
                          : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                      }`}
                    >
                      🟢 12m (At Node)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeoProximityMode("near_node")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        geoProximityMode === "near_node" && !overrideGeoFence
                          ? "bg-emerald-500/30 text-emerald-200 border-emerald-500/50"
                          : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                      }`}
                    >
                      🟡 35m (In Range)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeoProximityMode("far_away")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        geoProximityMode === "far_away" && !overrideGeoFence
                          ? "bg-rose-500/30 text-rose-200 border-rose-500/50"
                          : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                      }`}
                    >
                      🔴 185m (Locked)
                    </button>
                  </div>
                </div>

                {!geoResult.inRange && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>
                      {isHi
                        ? "चेक-इन लॉक है: नकली ड्रॉप-ऑफ रोकने के लिए आप नोड के 50 मीटर दायरे में होने चाहिए।"
                        : "Check-in Locked: To prevent fake drop-offs, host device must be within 50m of campus node."}
                    </span>
                  </div>
                )}
              </div>

              {/* 3-Point Checklist Cards */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {isHi ? "3-पॉइंट इनटेक चेकलिस्ट फॉर्म" : "Mandatory 3-Point Intake Verification"}
                </p>

                {/* Point 1: Box Seal Intact */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          1. {isHi ? "लेजर बारकोड सील अटूट है?" : "Box Seal Intact (Unbroken)"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {isHi ? "जांचें कि स्टैश बॉक्स की लेजर टैम्पर सील कटी या फटी तो नहीं है।" : "Verify laser tamper seal on box is 100% intact and undamaged."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSealIntact(!sealIntact)}
                      className={`h-8 px-4 rounded-xl text-xs font-bold transition-all border ${
                        sealIntact
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {sealIntact ? "✓ INTACT" : "✕ BROKEN"}
                    </button>
                  </div>
                </div>

                {/* Point 2: Barcode Scanned */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <QrCode className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          2. {isHi ? "बारकोड सीरियल स्कैन" : "Barcode Serial Scanned"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {isHi ? "भौतिक टैम्पर टेप पर लिखा बारकोड सीरियल कोड" : "Pre-printed alphanumeric tag ID on physical box tape."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarcodeSerial(`SS-KNP-BAR-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {isHi ? "स्कैन फिर से" : "Rescan"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={barcodeSerial}
                    onChange={(e) => setBarcodeSerial(e.target.value)}
                    placeholder="e.g. SS-KNP-BAR-8921"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Point 3: Weight Under 25kg */}
                <div className={`p-4 rounded-2xl bg-white/[0.03] border space-y-3 transition-colors ${
                  isOverweight ? "border-rose-500/50 bg-rose-500/5" : "border-white/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${
                        isOverweight
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      }`}>
                        <Scale className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          3. {isHi ? "वजन 25kg के अंदर है?" : "Weight Verification (Max 25.0 kg)"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {isHi ? "डिजिटल वजन मशीन से मापा गया वजन" : "Digital scale reading on box intake."}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold font-mono px-3 py-1 rounded-xl border ${
                      isOverweight
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}>
                      {measuredWeightKg.toFixed(1)} kg
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="0.5"
                      value={measuredWeightKg}
                      onChange={(e) => setMeasuredWeightKg(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>5.0 kg</span>
                      <span className="text-amber-400 font-bold">25.0 kg (MAX LIMIT)</span>
                      <span>35.0 kg</span>
                    </div>
                  </div>

                  {isOverweight && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>
                        {isHi
                          ? "सावधान: 25kg से अधिक वजन पर ₹150 अतिरिक्त ओवरवेट चार्ज लागू होगा।"
                          : "Warning: Stash exceeds 25kg max capacity limit! Requires surcharge flagging."}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Proof Upload Section */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {isHi ? "फोटो सबूत अपलोड (Photo Proof Upload)" : "Mandatory Photo Proof Upload"}
                </p>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-center">
                  {photoProofUrl ? (
                    <div className="space-y-2">
                      <img
                        src={photoProofUrl}
                        alt="Photo Proof Preview"
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={160}
                        className="h-40 w-full object-cover rounded-xl border border-emerald-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoProofUrl("")}
                        className="min-h-[48px] inline-flex items-center justify-center px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                      >
                        {isHi ? "दूसरी फोटो चुनें" : "Remove & re-capture"}
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 space-y-3">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleSimulateCameraCapture}
                          disabled={isCapturingPhoto}
                          className="h-10 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                          {isCapturingPhoto ? (isHi ? "कैप्चर हो रहा है..." : "Capturing...") : (isHi ? "कैमरा स्नैपशॉट लें" : "Take Camera Photo")}
                        </button>
                        <label className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                          <Upload className="h-4 w-4" />
                          {isHi ? "फाइल चुनें" : "Upload File"}
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {isHi ? "बॉक्स सील और वजन स्केल की साफ फोटो अपलोड करें" : "Upload or capture a clear photo showing intact seal and weight scale."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {isHi ? "अतिरिक्त टिप्पणियाँ / नोट्स" : "Intake Notes / Host Remarks"}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHi ? "जैसे: बॉक्स अच्छा स्थिति में है..." : "e.g. Box received in good condition at Kakadeo node."}
                  className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:opacity-95 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="h-5 w-5" />
                {isHi ? "3-पॉइंट इनटेक सत्यापन पूर्ण करें" : "Complete 3-Point Intake Verification"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
