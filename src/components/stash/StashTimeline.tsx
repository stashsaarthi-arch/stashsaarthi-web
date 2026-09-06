import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  ShieldCheck,
  Lock,
  MapPin,
  Layers,
  Eye,
  RotateCcw,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  Clock,
  Sparkles,
  PackagePlus,
  FileCheck2,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  QrCode,
  BadgeCheck,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";

interface StashTimelineProps {
  onBook?: () => void;
}

export const StashTimeline = memo(function StashTimeline({ onBook }: StashTimelineProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const TIMELINE_STEPS = [
    {
      step: 1,
      titleEn: "Doorstep Pickup & Weight Check",
      titleHi: "डोरस्टेप पिकअप और वजन जांच",
      subtitleEn: "15-min arrival window at your hostel door",
      subtitleHi: "आपके हॉस्टल कमरे पर 15 मिनट पिकअप विंडो",
      icon: PackagePlus,
      accent: "#10B981",
      locationEn: "Hostel Room Doorstep (e.g. Hall 13, IITK)",
      locationHi: "हॉस्टल कमरा (उदा. हॉल 13, IITK)",
      slaEn: "Within 15 Mins",
      slaHi: "15 मिनट के भीतर",
      detailsEn: [
        "Verified StashSaarthi captain arrives with digital weighing scales and heavy-duty bags.",
        "Weight & item count recorded with photo log in your digital custody pass.",
        "Student ID / Hall registration fast-checked for zero-friction dispatch.",
      ],
      detailsHi: [
        "सत्यापित सार्थी कैप्टन डिजिटल वेइंग मशीन व हेवी-ड्यूटी बैग के साथ आता है।",
        "डिजिटल कस्टडी पास में वजन व सामान की संख्या फोटो लॉग के साथ दर्ज होती है।",
        "तेज डिस्पैच के लिए छात्र आईडी / हॉल पंजीकरण का तुरंत मिलान।",
      ],
      badgeEn: "PICKUP COMPLETE",
      badgeHi: "पिकअप संपन्न",
      sensorStatus: isHi ? "कैप्टन पहुंचा" : "Captain On-Site",
      tempReading: "31°C",
      humidityReading: "48%",
      escrowStateEn: "Initiated (₹300/mo)",
      escrowStateHi: "प्रारंभिक (₹300/माह)",
      sealStatusEn: "Ready for Sealing",
      sealStatusHi: "सीलिंग हेतु तैयार",
    },
    {
      step: 2,
      titleEn: "Laser Barcode Tamper Sealing",
      titleHi: "लेजर बारकोड व टैम्पर-प्रूफ सीलिंग",
      subtitleEn: "Unique serial #SS-KNP-8921 stamped & locked",
      subtitleHi: "अनूठा लेज़र कोड #SS-KNP-8921 लॉक एवं पंजीकृत",
      icon: Lock,
      accent: "#00F5A0",
      locationEn: "Check-in Point (Hostel Gate)",
      locationHi: "चेक-इन पॉइंट (हॉस्टल गेट)",
      slaEn: "Instant (< 2 Mins)",
      slaHi: "तुरंत (< 2 मिनट)",
      detailsEn: [
        "High-tensile, non-tearable zip-ties with laser-engraved serial barcodes applied.",
        "Dual timestamped photos uploaded to Supabase cloud pass for unbroken chain of custody.",
        "Embedded ₹10,000 zero-deductible insurance activated instantly upon sealing.",
      ],
      detailsHi: [
        "लेजर उत्कीर्ण बारकोड सील (#SS-KNP-XXXXX) से 100% टैम्पर-प्रूफ लॉकिंग।",
        "अखंड सुरक्षा श्रृंखला हेतु डिजिटल क्लाउड पास में टाइमस्टैम्प फोटो अपलोड।",
        "सीलिंग के साथ ही प्रति बैग ₹10,000 का माइक्रो-बीमा कवर तुरंत सक्रिय।",
      ],
      badgeEn: "TAMPER SEAL ACTIVE",
      badgeHi: "सुरक्षा सील सक्रिय",
      sensorStatus: isHi ? "सील नंबर #SS-8921" : "Seal #SS-8921 Locked",
      tempReading: "30°C",
      humidityReading: "46%",
      escrowStateEn: "Bank Escrow Locked",
      escrowStateHi: "एस्क्रो बैंक लॉक",
      sealStatusEn: "INTACT (#SS-KNP-8921)",
      sealStatusHi: "अक्षुण्ण (#SS-KNP-8921)",
    },
    {
      step: 3,
      titleEn: "Climate-Safe Transit (<1.2 km)",
      titleHi: "सुरक्षित माइक्रो-ट्रांजिट (<1.2 किमी)",
      subtitleEn: "Protected vehicle transit to neighborhood senior host",
      subtitleHi: "समीपस्थ बुजुर्ग होस्ट के घर सुरक्षित वाहन परिवहन",
      icon: Truck,
      accent: "#38BDF8",
      locationEn: "En Route to Host Node (Kakadeo / Kalyanpur)",
      locationHi: "होस्ट नोड के रास्ते में (काकादेव / कल्याणपुर)",
      slaEn: "10 Mins Transit",
      slaHi: "10 मिनट परिवहन",
      detailsEn: [
        "Weatherproof covered transit vehicle with padded interior prevents dust & moisture.",
        "GPS location sync updates progress live to your dashboard ticker.",
        "Neighborhood proximity guarantee: total transit distance kept strictly under 1.2 km.",
      ],
      detailsHi: [
        "धूल व नमी से बचाने हेतु कवर किए गए वेदरप्रूफ वाहन द्वारा सुरक्षित परिवहन।",
        "जीपीएस लोकेशन सिंक आपके डैशबोर्ड पर लाइव स्थिति दिखाता है।",
        "समीपस्थ होस्ट गारंटी: कुल दूरी 1.2 किमी से कम रखी जाती है।",
      ],
      badgeEn: "IN TRANSIT",
      badgeHi: "मार्ग में",
      sensorStatus: isHi ? "जीपीएस ट्रैक सक्रिय" : "GPS Route Active",
      tempReading: "29°C",
      humidityReading: "45%",
      escrowStateEn: "Bank Escrow Locked",
      escrowStateHi: "एस्क्रो बैंक लॉक",
      sealStatusEn: "INTACT & MONITORED",
      sealStatusHi: "अक्षुण्ण व निगरानी में",
    },
    {
      step: 4,
      titleEn: "Pallet Placement at Senior Host Node",
      titleHi: "वरिष्ठ नागरिक होस्ट के घर पैलेटPlacement",
      subtitleEn: "Elevated wooden pallets in climate-stable, audited room",
      subtitleHi: "ऑडिट किए गए कमरे में ऊंचे लकड़ी के पैलेट्स पर सुरक्षित",
      icon: Layers,
      accent: "#F59E0B",
      locationEn: "Senior Host Home Node (Secured Room)",
      locationHi: "सीनियर होस्ट नोड (सुरक्षित कमरा)",
      slaEn: "Checked In",
      slaHi: "चेक-इन संपन्न",
      detailsEn: [
        "Luggage placed on 6-inch raised wooden pallets to prevent floor dampness or pest contact.",
        "Audited residential premises managed by verified senior citizens with zero industrial clutter.",
        "Senior host scans receipt QR to acknowledge custody transfer and confirm pallet placement.",
      ],
      detailsHi: [
        "सीलन और कीटों से बचाने हेतु 6 इंच ऊंचे लकड़ी के पैलेट्स पर स्थान।",
        "सत्यापित बुजुर्गों के घर — बिना किसी धूल-धब्बे या गोदाम जैसी लावारिस स्थिति के।",
        "होस्ट द्वारा क्यूआर स्कैन कर कस्टडी हस्तांतरण व पैलेट प्लेसमेंट की पुष्टि।",
      ],
      badgeEn: "SAFELY PALLETIZED",
      badgeHi: "सुरक्षित पैलेट पर रखा गया",
      sensorStatus: isHi ? "पैलेट प्लेसमेंट OK" : "Elevated Pallet OK",
      tempReading: "24°C",
      humidityReading: "42%",
      escrowStateEn: "Host Escrow Reserved",
      escrowStateHi: "होस्ट एस्क्रो सुरक्षित",
      sealStatusEn: "INTACT (Pallet #4)",
      sealStatusHi: "अक्षुण्ण (पैलेट #4)",
    },
    {
      step: 5,
      titleEn: "24/7 IoT Sensor & Escrow Protection",
      titleHi: "24/7 एस्क्रो व पर्यावरण निगरानी",
      subtitleEn: "Continuous temperature/humidity surveillance + ₹10k cover",
      subtitleHi: "24 घंटे तापमान/नमी निगरानी एवं ₹10,000 सुरक्षा कवर",
      icon: Eye,
      accent: "#A855F7",
      locationEn: "Vacation Vault (Resting Period)",
      locationHi: "वेकेशन वॉल्ट (संरक्षित अवधि)",
      slaEn: "Active 24/7",
      slaHi: "24/7 सक्रिय",
      detailsEn: [
        "Real-time sensor node monitors room climate (24°C avg / 42% RH) throughout summer/monsoon.",
        "Host compensation held safely in automated digital bank escrow until vacation ends.",
        "Zero-deductible insurance guarantees peace of mind with 100% damage/loss coverage.",
      ],
      detailsHi: [
        "गर्मी व मानसून के दौरान कमरे की स्थिति (औसत 24°C / 42% RH) का लगातार रिकॉर्ड।",
        "छुट्टियों तक होस्ट का भुगतान डिजिटल बैंक एस्क्रो में पूरी तरह सुरक्षित रहता है।",
        "शून्य डिडक्टिबल बीमा किसी भी क्षति या नुकसान पर 100% वित्तीय कवर देता है।",
      ],
      badgeEn: "ESCROW PROTECTED",
      badgeHi: "एस्क्रो सुरक्षा में",
      sensorStatus: isHi ? "सेंसर: सामान्य (24°C)" : "Sensors Nominal (24°C)",
      tempReading: "24.2°C",
      humidityReading: "41%",
      escrowStateEn: "Escrow Active (₹180 Host/mo)",
      escrowStateHi: "एस्क्रो सक्रिय (₹180 होस्ट/माह)",
      sealStatusEn: "VERIFIED INTACT",
      sealStatusHi: "सत्यापित अक्षुण्ण",
    },
    {
      step: 6,
      titleEn: "On-Demand Doorstep Return & Handover",
      titleHi: "मांग पर घर वापसी व एस्क्रो रिलीज़",
      subtitleEn: "1-tap return call + unbroken seal check at delivery",
      subtitleHi: "1-टैप कॉल पर वापसी एवं छात्र के सामने सील सत्यापन",
      icon: RotateCcw,
      accent: "#00F5A0",
      locationEn: "Returned to Hostel Doorstep",
      locationHi: "हॉस्टल कमरे पर सफलतापूर्वक सुपुर्द",
      slaEn: "Guaranteed On-Time",
      slaHi: "समय पर वापसी की गारंटी",
      detailsEn: [
        "1-tap return scheduling on your return date — delivered right back to your hostel room.",
        "Laser seal inspected & verified unbroken in student's presence before seal cut.",
        "Student 1-tap confirmation releases host payout from escrow and completes custody cycle.",
      ],
      detailsHi: [
        "वापसी की तिथि पर 1-टैप डिलीवरी — सामान आपके कमरे तक सुरक्षित पहुंचता है।",
        "सामान खोलने से पहले छात्र के सामने लेज़र सील की पूर्णता का सत्यापन।",
        "छात्र की संतुष्टि के बाद 1-टैप पुष्टि से एस्क्रो का भुगतान होस्ट को स्थानांतरित होता है।",
      ],
      badgeEn: "HANDOVER COMPLETE",
      badgeHi: "वापसी संपन्न",
      sensorStatus: isHi ? "सफलतापूर्वक हस्तांतरित" : "Delivered & Verified",
      tempReading: "28°C",
      humidityReading: "44%",
      escrowStateEn: "Escrow Released to Host",
      escrowStateHi: "होस्ट को एस्क्रो जारी",
      sealStatusEn: "VERIFIED INTACT AT HANDOVER",
      sealStatusHi: "डिलीवरी पर सील सत्यापित",
    },
  ];

  // Auto-play timer cycle
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, TIMELINE_STEPS.length]);

  const currentStep = (TIMELINE_STEPS[activeStep] || TIMELINE_STEPS[0])!;
  const IconComponent = currentStep.icon;

  return (
    <section id="timeline" className="relative mx-auto max-w-6xl px-4 py-6 sm:py-10 scroll-mt-20">
      {/* Header */}
      <AnimatedContent distance={30} direction="vertical" duration={0.6}>
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs uppercase font-mono tracking-widest px-3 py-1"
          >
            {isHi ? "सामान का पारदर्शी सफर" : "Interactive Journey of a Stash"}
          </Badge>
          <h2 className="mt-2 text-balance text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isHi ? (
              <>
                पिकअप से लेकर <span className="text-gradient">सुरक्षित भंडारण तक</span>
              </>
            ) : (
              <>
                From Pickup to <span className="text-gradient">Secure Custody</span>
              </>
            )}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            {isHi
              ? "देखें कि आपका सामान किस प्रकार 100% लेजर सील, जीपीएस ट्रैकिंग और एस्क्रो सुरक्षा के साथ आपके कमरे से सीनियर होस्ट के घर तक पहुंचता है।"
              : "Track how your bags move through 6 deterministic stages with unbroken custody proof, laser seals, and digital escrow."}
          </p>
        </div>
      </AnimatedContent>

      {/* Interactive Step Navigator Pills */}
      <div className="mt-6 sm:mt-8">
        <div className="glass flex items-center justify-between gap-1 overflow-x-auto rounded-2xl border border-white/10 p-1.5 no-scrollbar">
          {TIMELINE_STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = activeStep === idx;
            const isCompleted = idx < activeStep;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex flex-1 min-w-[130px] sm:min-w-[150px] items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : isCompleted
                      ? "text-emerald-400/80 hover:bg-white/5 bg-white/[0.02] border border-emerald-500/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                }`}
              >
                <div
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? "bg-emerald-400 text-black"
                      : isCompleted
                        ? "bg-emerald-500/30 text-emerald-300"
                        : "bg-white/10 text-white/60"
                  }`}
                >
                  {s.step}
                </div>
                <span className="truncate text-left font-medium">
                  {isHi ? s.titleHi.split(" ")[0] + " " + (s.titleHi.split(" ")[1] || "") : s.titleEn.split(" ")[0] + " " + (s.titleEn.split(" ")[1] || "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Column Interactive Panel */}
      <div className="mt-6 grid gap-6 md:grid-cols-12 items-stretch">
        {/* Left Column: Active Step Blueprint Card (7 Cols) */}
        <div className="md:col-span-7 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden flex-1 flex flex-col justify-between"
            >
              {/* Top Glow Accent */}
              <div
                className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: currentStep.accent }}
              />

              <div>
                {/* Stage Number & Badge Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10"
                      style={{ background: `${currentStep.accent}20` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: currentStep.accent }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                        {isHi ? `चरण ${currentStep.step} / 6` : `STAGE ${currentStep.step} OF 6`}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">
                        {isHi ? currentStep.titleHi : currentStep.titleEn}
                      </h3>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono font-semibold text-emerald-300">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{isHi ? currentStep.slaHi : currentStep.slaEn}</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="mt-4 text-xs sm:text-sm text-muted-foreground font-medium">
                  {isHi ? currentStep.subtitleHi : currentStep.subtitleEn}
                </p>

                {/* Detailed Action Bullet Points */}
                <div className="mt-5 space-y-3">
                  {(isHi ? currentStep.detailsHi : currentStep.detailsEn).map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-all hover:border-emerald-500/30"
                    >
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold mt-0.5">
                        ✓
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{isHi ? "सिमुलेशन रोकें" : "Pause Tour"}</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                        <span>{isHi ? "ऑटो सिमुलेशन चलाएं" : "Auto-Play Journey"}</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    {isPlaying
                      ? isHi ? "(4 सेकंड में ऑटो-स्टेप)" : "(Auto-stepping 4s)"
                      : isHi ? "(किसी भी चरण पर क्लिक करें)" : "(Click any step)"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeStep > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep((prev) => prev - 1);
                        setIsPlaying(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer"
                    >
                      {isHi ? "पिछला" : "Prev"}
                    </button>
                  )}

                  {activeStep < TIMELINE_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep((prev) => prev + 1);
                        setIsPlaying(false);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer"
                    >
                      <span>{isHi ? "अगला चरण" : "Next Stage"}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBook?.()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <span>{isHi ? "पिकअप बुक करें" : "Book Pickup Now"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Live Digital Custody Ticket Visualizer (5 Cols) */}
        <div className="md:col-span-5 flex flex-col">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-black/80 to-black p-6 relative overflow-hidden flex-1 flex flex-col justify-between shadow-2xl">
            {/* Header Stamp */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider">
                    STASH CUSTODY TICKET
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase animate-pulse"
                >
                  {isHi ? currentStep.badgeHi : currentStep.badgeEn}
                </Badge>
              </div>

              {/* Barcode Display */}
              <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3.5 text-center relative">
                <div className="flex items-center justify-center gap-1 py-1 font-mono text-xs text-emerald-400 tracking-widest font-extrabold">
                  ||||| | |||||| || | |||| |||||||| |||||
                </div>
                <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  PASS ID: <span className="text-foreground font-bold">#SS-KNP-8921-VERIFIED</span>
                </div>
              </div>

              {/* Dynamic Status Grid */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5 border border-white/5 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    {isHi ? "वर्तमान स्थिति" : "Current Location"}
                  </span>
                  <span className="font-medium text-foreground text-right truncate max-w-[160px]">
                    {isHi ? currentStep.locationHi : currentStep.locationEn}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5 border border-white/5 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    {isHi ? "लेजर सील कोड" : "Laser Seal Status"}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-right">
                    {isHi ? currentStep.sealStatusHi : currentStep.sealStatusEn}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5 border border-white/5 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    {isHi ? "सेंसर मॉनिटर (तापमान)" : "IoT Room Sensor"}
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {currentStep.tempReading} / {currentStep.humidityReading}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5 border border-white/5 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    {isHi ? "डिजिटल एस्क्रो स्थिति" : "Escrow Lock State"}
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {isHi ? currentStep.escrowStateHi : currentStep.escrowStateEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Insurance & Callout Box */}
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-300">
                  {isHi ? "₹10,000 माइक्रो-बीमा कवर सक्रिय" : "₹10,000 Insurance Cover Active"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isHi
                  ? "चोरी, पानी की क्षति या आग से पूर्ण सुरक्षा। बिना किसी छुपे शर्त के 100% शून्य-डिडक्टिबल सुरक्षा।"
                  : "Zero-deductible coverage against theft, water damage or fire. Handled directly by our Kanpur ops desk."}
              </p>

              <button
                type="button"
                onClick={() => onBook?.()}
                className="mt-3 w-full rounded-xl bg-emerald-500 py-2.5 text-center text-xs font-bold text-black hover:bg-emerald-400 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                {isHi ? "₹300/माह पर स्टैश बुक करें" : "Book Stash @ ₹300/month"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
