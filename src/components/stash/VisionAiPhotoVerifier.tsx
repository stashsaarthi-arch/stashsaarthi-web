import { useState, memo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ShieldCheck,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Scan,
  BadgeCheck,
  Eye,
  Info,
  Sliders,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import {
  verifyHostPropertyPhoto,
  SAMPLE_PROPERTY_PHOTOS,
  HostPhotoVerificationResult,
  SamplePhotoPreset,
} from "@/lib/visionAiHostVetting";

export const VisionAiPhotoVerifier = memo(function VisionAiPhotoVerifier() {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isHost = role === "host";

  const [selectedSample, setSelectedSample] = useState<SamplePhotoPreset>(SAMPLE_PROPERTY_PHOTOS[0]!);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<HostPhotoVerificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePhotoUrl = customPhotoUrl || selectedSample.imageUrl;

  const handleScanPhoto = async () => {
    setIsScanning(true);
    setResult(null);

    // Simulate scanning latency for visual AI inspection effect
    await new Promise((res) => setTimeout(res, 900));

    const res = await verifyHostPropertyPhoto({
      imageUrl: activePhotoUrl,
    });

    setResult(res);
    setIsScanning(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhotoUrl(event.target.result as string);
          setResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-xl p-5 sm:p-7 relative overflow-hidden my-6 shadow-2xl">
      {/* Background Accent Glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/15 text-amber-400 text-[10px] font-mono uppercase tracking-widest"
            >
              <Sparkles className="h-3 w-3 mr-1 text-amber-400 animate-pulse" />
              {isHi ? "विजन AI स्वचालित फ़ोटो सत्यापन" : "Vision AI Auto-Verification"}
            </Badge>
            <Badge
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono hidden sm:inline-flex"
            >
              Google Cloud Vision API
            </Badge>
          </div>
          <h4 className="text-lg sm:text-2xl font-extrabold text-foreground tracking-tight">
            {isHi ? (
              <>
                होस्ट संपत्ति फ़ोटो <span className="text-gradient">AI ऑटो-ऑडिट</span>
              </>
            ) : (
              <>
                Host Property Photo <span className="text-gradient">Auto-Vetting Radar</span>
              </>
            )}
          </h4>
        </div>

        <span className="text-xs text-muted-foreground font-mono self-start sm:self-auto">
          {isHi ? "100% सुरक्षित • 'घर जैसा' आराम जांच" : "100% Automated • 'Ghar Jaisa' Aesthetic Audit"}
        </span>
      </div>

      {/* Main Grid: Left Photo Scanner / Right Results */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Column: Photo Preview & Controls (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Photo Display Card with Scanner Overlay */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/80 aspect-video sm:aspect-4/3 group shadow-inner">
            <img
              src={activePhotoUrl}
              alt="Property Inspection Preview"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isScanning ? "scale-105 filter brightness-90" : ""
              }`}
            />

            {/* AI Scanning Beam Overlay */}
            {isScanning && (
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-cyan-400 shadow-[0_0_15px_#10B981] z-20 pointer-events-none"
              />
            )}

            {/* Grid Overlay Graphic */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

            {/* Scanning Radar Spinner Badge */}
            {isScanning && (
              <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-xs z-10">
                <div className="flex flex-col items-center gap-2">
                  <Scan className="h-10 w-10 text-amber-400 animate-spin" />
                  <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                    {isHi ? "AI विजन विश्लेषण जारी..." : "Analyzing Vision Features..."}
                  </span>
                </div>
              </div>
            )}

            {/* Top Left Status Tag */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20 flex items-center gap-1.5">
                <Eye className="h-3 w-3 text-cyan-400" />
                {customPhotoUrl
                  ? isHi ? "कस्टम फ़ोटो" : "Custom Upload"
                  : isHi ? selectedSample.titleHi : selectedSample.titleEn}
              </span>
            </div>
          </div>

          {/* Sample Photo Preset Selector Tabs */}
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block mb-2 font-mono">
              {isHi ? "नमूना संपत्ति फ़ोटो चुनें:" : "Select Sample Inspection Scenario:"}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PROPERTY_PHOTOS.map((sample) => {
                const isSelected = !customPhotoUrl && selectedSample.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setCustomPhotoUrl(null);
                      setSelectedSample(sample);
                      setResult(null);
                    }}
                    className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/20 text-amber-300 font-bold"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <span className="line-clamp-1">{isHi ? sample.titleHi : sample.titleEn}</span>
                    <span
                      className={`text-[9px] font-mono block mt-0.5 ${
                        sample.expectedPass ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {sample.expectedPass ? (isHi ? "पास सिमुलेशन" : "Pass Sample") : (isHi ? "विफल सिमुलेशन" : "Fail Sample")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Scan & Upload Custom */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleScanPhoto}
              disabled={isScanning}
              className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-bold text-xs py-2.5 rounded-xl shadow-lg cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                  {isHi ? "स्कैन हो रहा है..." : "Scanning..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  {isHi ? "फ़ोटो ऑटो-ऑडिट करें" : "Auto-Verify Photo"}
                </>
              )}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs px-3 py-2.5 rounded-xl cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-1" />
              {isHi ? "अपलोड" : "Upload"}
            </Button>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Breakdown (7 Cols) */}
        <div className="md:col-span-7">
          {!result && !isScanning && (
            <div className="h-full min-h-[240px] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 flex flex-col items-center justify-center text-center">
              <Camera className="h-10 w-10 text-amber-400/60 mb-3" />
              <h5 className="text-sm font-bold text-foreground mb-1">
                {isHi ? "गूगल क्लाउड विजन AI फ़ोटो निरीक्षण" : "Ready for Vision AI Photo Audit"}
              </h5>
              <p className="text-xs text-muted-foreground max-w-sm">
                {isHi
                  ? "'फ़ोटो ऑटो-ऑडिट करें' बटन पर क्लिक करके कमरे की सुरक्षा, रोशनी और 'घर जैसा' आराम स्कोर तुरंत जांचें।"
                  : "Click 'Auto-Verify Photo' to evaluate safety compliance, lighting quality, and 'Ghar Jaisa' homestyle comfort score."}
              </p>
            </div>
          )}

          {isScanning && (
            <div className="h-full min-h-[240px] rounded-2xl border border-white/10 bg-black/40 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <Sparkles className="h-6 w-6 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold">
                {isHi ? "सुरक्षा ऑडिट और एस्थेटिक स्कोर निकाला जा रहा है..." : "Extracting Safety Audit & Aesthetic Scores..."}
              </span>
            </div>
          )}

          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Verdict Header Badge */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  result.isApproved
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/15 text-rose-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.isApproved ? (
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/30 text-rose-400">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-extrabold text-foreground">
                        {result.isApproved
                          ? isHi
                            ? "सत्यापित सीनियर होस्ट नोड पास"
                            : "Approved: Verified Senior Host Node"
                          : isHi
                          ? "कार्रवाई आवश्यक: सुधार की आवश्यकता"
                          : "Action Required: Adjust Property Photo"}
                      </h5>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {isHi ? "ऑडिट बैज आईडी:" : "Audit Serial:"}{" "}
                      <span className="text-foreground font-bold">{result.badgeId}</span> • {result.engine}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-mono tracking-tight text-foreground">
                    {result.overallScore}
                    <span className="text-xs text-muted-foreground">/100</span>
                  </span>
                  <span className="text-[10px] font-mono block text-muted-foreground">
                    {isHi ? "कुल स्कोर" : "Overall Score"}
                  </span>
                </div>
              </div>

              {/* 3 Metric Gauges */}
              <div className="grid grid-cols-3 gap-2">
                {/* Metric 1: Safety Audit */}
                <div className="glass rounded-xl p-3 border border-white/10 bg-black/40 text-center">
                  <span className="text-xs font-mono text-muted-foreground block mb-1">
                    {isHi ? "सुरक्षा ऑडिट" : "Safety Audit"}
                  </span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    {result.safetyScore}%
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">
                    {result.safetyAudit.adult === "VERY_UNLIKELY" ? (isHi ? "100% सुरक्षित" : "100% Clear") : "Flagged"}
                  </span>
                </div>

                {/* Metric 2: Quality */}
                <div className="glass rounded-xl p-3 border border-white/10 bg-black/40 text-center">
                  <span className="text-xs font-mono text-muted-foreground block mb-1">
                    {isHi ? "फ़ोटो गुणवत्ता" : "Image Quality"}
                  </span>
                  <span className="text-base font-extrabold font-mono text-cyan-400">
                    {result.qualityScore}%
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground block mt-0.5">
                    {result.qualityScore >= 75 ? (isHi ? "उत्कृष्ट रोशनी" : "Optimal Light") : (isHi ? "कम रोशनी" : "Low Light")}
                  </span>
                </div>

                {/* Metric 3: Ghar Jaisa Aesthetics */}
                <div className="glass rounded-xl p-3 border border-white/10 bg-black/40 text-center">
                  <span className="text-xs font-mono text-muted-foreground block mb-1">
                    {isHi ? "घर जैसा माहौल" : "Ghar Jaisa Score"}
                  </span>
                  <span className="text-base font-extrabold font-mono text-amber-400">
                    {result.homestyleAestheticScore}%
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 block mt-0.5">
                    {result.homestyleAestheticScore >= 70 ? (isHi ? "घरेलू आराम" : "Homestyle Cozy") : (isHi ? "अव्यवस्थित" : "Cluttered")}
                  </span>
                </div>
              </div>

              {/* Detected Vision AI Labels */}
              <div>
                <span className="text-[11px] font-mono font-semibold text-muted-foreground block mb-1.5">
                  {isHi ? "AI द्वारा पहचाने गए फीचर्स:" : "Detected AI Vision Features:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.detectedLabels.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-[10px] font-mono text-foreground/90"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  {isHi ? "AI विश्लेषण सिफारिशें:" : "AI Inspection Recommendations:"}
                </span>
                <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});
