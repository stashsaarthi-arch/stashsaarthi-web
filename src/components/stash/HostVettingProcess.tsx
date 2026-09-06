import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  UserCheck,
  FileBadge,
  Building2,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Search,
  BadgeCheck,
  RotateCcw,
  Sliders,
  Play,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/Card3D";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";

interface TierDetail {
  id: number;
  titleEn: string;
  titleHi: string;
  badgeEn: string;
  badgeHi: string;
  icon: typeof UserCheck;
  methodEn: string;
  methodHi: string;
  checksEn: string[];
  checksHi: string[];
  failConditionEn: string;
  failConditionHi: string;
  slaEn: string;
  slaHi: string;
  accent: string;
}

const VETTING_TIERS: TierDetail[] = [
  {
    id: 1,
    titleEn: "Tier 1: Digital Identity & Biometric Match",
    titleHi: "टियर 1: डिजिटल पहचान व बायोमेट्रिक मिलान",
    badgeEn: "Instant DigiLocker Sync",
    badgeHi: "तत्काल डिजिलॉकर सिंक",
    icon: UserCheck,
    methodEn: "Aadhaar Card QR Scan + Live Facial Liveness Match via Camera",
    methodHi: "आधार कार्ड क्यूआर स्कैन + कैमरा द्वारा लाइव फेशियल मैच",
    checksEn: [
      "Government-issued Aadhaar identity verification via DigiLocker",
      "Live selfie liveness check preventing static photo spoofing",
      "Biometric facial similarity match threshold (≥85% score required)",
      "Automated phone number & Aadhaar linkage audit",
    ],
    checksHi: [
      "डिजिलॉकर के माध्यम से सरकारी आधार पहचान सत्यापन",
      "लाइव सेल्फ़ी जांच जो फोटो धोखाधड़ी को रोकती है",
      "बायोमेट्रिक चेहरे का मिलान थ्रेशोल्ड (≥85% स्कोर अनिवार्य)",
      "स्वचालित फोन नंबर व आधार जुड़ाव ऑडिट",
    ],
    failConditionEn: "Mismatch > 15% in facial similarity → Instant Auto-Rejection",
    failConditionHi: "चेहरे के मिलान में 15% से अधिक अंतर → तत्काल स्वचालित अस्वीकृति",
    slaEn: "Instant Automated (< 2 mins)",
    slaHi: "तत्काल स्वचालित (< 2 मिनट)",
    accent: "#10B981", // Electric Mint
  },
  {
    id: 2,
    titleEn: "Tier 2: Police Station Verification Certificate",
    titleHi: "टियर 2: पुलिस स्टेशन सत्यापन प्रमाणपत्र",
    badgeEn: "Zero Criminal Record",
    badgeHi: "शून्य आपराधिक रिकॉर्ड",
    icon: FileBadge,
    methodEn: "Local Police Station Character Verification & FIR Clearance Check",
    methodHi: "स्थानीय पुलिस स्टेशन चरित्र सत्यापन और प्राथमिकी जांच",
    checksEn: [
      "Official Police Verification Certificate for registered home address",
      "Criminal record check across local police station database",
      "Zero active FIR / litigation clearance declaration",
      "Legal indemnity & safety waiver registration",
    ],
    checksHi: [
      "पंजीकृत घर के पते के लिए आधिकारिक पुलिस सत्यापन प्रमाणपत्र",
      "स्थानीय पुलिस स्टेशन डेटाबेस से आपराधिक रिकॉर्ड जांच",
      "शून्य सक्रिय प्राथमिकी / मुकदमों की घोषणा",
      "कानूनी क्षतिपूर्ति व सुरक्षा छूट पंजीकरण",
    ],
    failConditionEn: "Any criminal record or active FIR → Permanent Lifetime Ban",
    failConditionHi: "कोई भी आपराधिक रिकॉर्ड या सक्रिय एफआईआर → स्थायी आजीवन प्रतिबंध",
    slaEn: "3 to 7 Business Days",
    slaHi: "3 से 7 कार्य दिवस",
    accent: "#38BDF8", // Cyan
  },
  {
    id: 3,
    titleEn: "Tier 3: University & Community Reference Check",
    titleHi: "टियर 3: विश्वविद्यालय व समाज संदर्भ जांच",
    badgeEn: "Campus & RWA Verified",
    badgeHi: "कैंपस व आरडब्ल्यूए सत्यापित",
    icon: Building2,
    methodEn: "Direct Telephone & Reference Verification with Local RWA / University",
    methodHi: "स्थानीय आरडब्ल्यूए / विश्वविद्यालय के साथ फोन व संदर्भ सत्यापन",
    checksEn: [
      "Verification calls to 2 independent local academic/community references",
      "RWA / Municipal address stability check (minimum 2+ years residency)",
      "Neighborhood reputation assessment & safety survey",
      "Host availability & student hospitality commitment audit",
    ],
    checksHi: [
      "2 स्वतंत्र स्थानीय शैक्षणिक/सामुदायिक संदर्भों को सत्यापन कॉल",
      "आरडब्ल्यूए / नगर निगम पता स्थिरता की जांच (न्यूनतम 2+ वर्ष का निवास)",
      "पड़ोस की प्रतिष्ठा मूल्यांकन व सुरक्षा सर्वेक्षण",
      "होस्ट की उपलब्धता व छात्र आतिथ्य प्रतिबद्धता का ऑडिट",
    ],
    failConditionEn: "Inconsistent address duration or unverifiable references → Rejected",
    failConditionHi: "असंगत पता अवधि या असत्यापित संदर्भ → अस्वीकृत",
    slaEn: "1 to 3 Business Days",
    slaHi: "1 से 3 कार्य दिवस",
    accent: "#F59E0B", // Warm Amber
  },
  {
    id: 4,
    titleEn: "Tier 4: 360° Physical Space & Safety Audit",
    titleHi: "टियर 4: 360° भौतिक स्थान व सुरक्षा ऑडिट",
    badgeEn: "On-Site Field Inspection",
    badgeHi: "ऑन-साइट फील्ड निरीक्षण",
    icon: Home,
    methodEn: "In-Person Field Visit by StashSaarthi Operations Team",
    methodHi: "सार्थी ऑपरेशंस टीम द्वारा व्यक्तिगत फील्ड निरीक्षण",
    checksEn: [
      "Storage node condition: dry, elevated wooden pallets (zero floor moisture)",
      "Co-living room inspection: lock quality, ventilation, natural lighting",
      "Kitchen hygiene audit (for Saarthi Kitchen meal hosts): pure ghee, zero palm oil",
      "CCTV / Smart motion sensor installation & emergency SOS trigger test",
    ],
    checksHi: [
      "भंडारण नोड स्थिति: सूखे, ऊंचे लकड़ी के पैलेट (ज़मीन नमी रहित)",
      "सह-आवास कमरा निरीक्षण: ताला गुणवत्ता, वेंटिलेशन, प्राकृतिक रोशनी",
      "रसोई स्वच्छता ऑडिट (भोजन होस्ट हेतु): शुद्ध देसी घी, शून्य पाम ऑयल",
      "सीसीटीवी / मोशन सेंसर स्थापना व आपातकालीन एसओएस टेस्ट",
    ],
    failConditionEn: "Any critical safety deficiency → Required Remediation before Re-Audit",
    failConditionHi: "कोई भी गंभीर सुरक्षा कमी → पुन: ऑडिट से पहले सुधार आवश्यक",
    slaEn: "Scheduled within 48 Hours",
    slaHi: "48 घंटों के भीतर निर्धारित",
    accent: "#00F5A0", // Neon Emerald
  },
];

export function HostVettingProcess() {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  const [activeTier, setActiveTier] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Simulation runner
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulatedStep(1);
    setSimLogs([
      isHi
        ? "🚀 उम्मीदवार होस्ट सत्यापन प्रक्रिया प्रारंभ (#SS-HOST-KNP-892)..."
        : "🚀 Candidate Host Audit Initialized (#SS-HOST-KNP-892)...",
    ]);

    const stepTimers = [
      setTimeout(() => {
        setSimulatedStep(1);
        setSimLogs((prev) => [
          ...prev,
          isHi
            ? "✅ [टियर 1 पास] आधार डिजिलॉकर सिंक सफल। बायोमेट्रिक चेहरा मिलान: 98.4% (पास)।"
            : "✅ [Tier 1 Passed] DigiLocker Sync Complete. Biometric Match: 98.4% (Pass).",
        ]);
      }, 1200),

      setTimeout(() => {
        setSimulatedStep(2);
        setSimLogs((prev) => [
          ...prev,
          isHi
            ? "✅ [टियर 2 पास] कल्याणपुर पुलिस स्टेशन चरित्र प्रमाणपत्र सत्यापित। 0 एफआईआर रिकॉर्ड।"
            : "✅ [Tier 2 Passed] Kalyanpur Police Verification Verified. 0 Active FIR Records.",
        ]);
      }, 2600),

      setTimeout(() => {
        setSimulatedStep(3);
        setSimulatedStep(3);
        setSimLogs((prev) => [
          ...prev,
          isHi
            ? "✅ [टियर 3 पास] IITK प्रोफेसर व आरडब्ल्यूए अध्यक्ष संदर्भ की पुष्टि हुई। निवास: 6 वर्ष।"
            : "✅ [Tier 3 Passed] IITK Faculty & RWA President References Verified. Tenure: 6 Yrs.",
        ]);
      }, 4000),

      setTimeout(() => {
        setSimulatedStep(4);
        setSimLogs((prev) => [
          ...prev,
          isHi
            ? "✅ [टियर 4 पास] ऑन-साइट ऑडिट पूर्ण। लकड़ी के पैलेट्स सूखे, स्मार्ट एसओएस परीक्षण पास।"
            : "✅ [Tier 4 Passed] On-Site Field Audit Clear. Pallets Dry, Smart SOS Test Passed.",
        ]);
      }, 5400),

      setTimeout(() => {
        setSimulatedStep(5);
        setIsSimulating(false);
        setSimLogs((prev) => [
          ...prev,
          isHi
            ? "🏆 [सत्यापन सील जारी] 100% सत्यापित सीनियर होस्ट बैज जारी (#SS-HOST-VERIFIED)!"
            : "🏆 [Verified Host Seal Dispatched] 100% Verified Host Pass Active (#SS-HOST-VERIFIED)!",
        ]);
      }, 6800),
    ];

    return () => stepTimers.forEach((t) => clearTimeout(t));
  };

  const activeTierData = VETTING_TIERS.find((t) => t.id === activeTier) ?? VETTING_TIERS[0];
  if (!activeTierData) return null;

  return (
    <div
      id="host-vetting-flow"
      data-section="host-vetting"
      className="relative overflow-hidden py-3 sm:py-6"
    >
      {/* ── Section Title & Badge ── */}
      <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-2"
        >
          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
          {isHi ? "CSO 4-स्तरीय शून्य-समझौता प्रोटोकॉल" : "CSO 4-Tier Zero-Tolerance Protocol"}
        </Badge>
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isHi ? (
            <>
              होस्ट सत्यापन <span className="text-gradient">प्रक्रिया एवं फ्लोचार्ट</span>
            </>
          ) : (
            <>
              Host Vetting <span className="text-gradient">Process & Flow Architecture</span>
            </>
          )}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          {isHi
            ? "कोई भी सीनियर होस्ट या कमरा तब तक लिस्ट नहीं होता जब तक वह इन सभी 4 कड़े सुरक्षा चरणों को 100% पास न कर ले।"
            : "No senior host or room is listed on StashSaarthi without clearing 100% of all 4 verification tiers."}
        </p>
      </div>

      {/* ── Visual Flowchart / Stepper Diagram ── */}
      <div className="mx-auto max-w-5xl px-2">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-4 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
            <span>{isHi ? "सत्यापन अनुक्रम (फ्लोचार्ट)" : "Verification Sequence (Flowchart)"}</span>
            <span className="text-emerald-400 font-bold">
              {isHi ? "शून्य फर्जी प्रोफाइल नीति" : "Zero Fake Profile Guarantee"}
            </span>
          </div>

          {/* Stepper Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 relative z-10">
            {VETTING_TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              const isSelected = activeTier === tier.id;
              const isSimActive = isSimulating && simulatedStep === tier.id;
              const isSimDone = simulatedStep > tier.id;

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTier(tier.id)}
                  className={`flex flex-col items-center justify-between text-center p-3 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/15 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                      : isSimDone
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  {/* Step Number Pill */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
                      0{tier.id}
                    </span>
                    {isSimDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: tier.accent }}
                      />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl my-1"
                    style={{
                      background: isSelected
                        ? "color-mix(in oklab, var(--emerald) 25%, transparent)"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: isSelected ? "var(--emerald)" : tier.accent }}
                    />
                  </div>

                  <span className="text-xs font-bold text-foreground mt-1 line-clamp-1">
                    {isHi ? `टियर ${tier.id}` : `Tier ${tier.id}`}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {isHi ? tier.titleHi.split(":")[1] : tier.titleEn.split(":")[1]}
                  </span>
                </button>
              );
            })}

            {/* Node 5: Final Verified Seal Node */}
            <button
              type="button"
              onClick={() => setActiveTier(5)}
              className={`flex flex-col items-center justify-between text-center p-3 rounded-2xl border transition-all cursor-pointer col-span-2 md:col-span-1 ${
                activeTier === 5 || simulatedStep === 5
                  ? "border-amber-500 bg-amber-500/20 shadow-[0_0_25px_-5px_rgba(245,158,11,0.5)]"
                  : "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  SEAL
                </span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 my-1">
                <BadgeCheck className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-xs font-extrabold text-amber-300 mt-1">
                {isHi ? "सत्यापित सील" : "Verified Seal"}
              </span>
              <span className="text-[10px] text-amber-400/80 mt-0.5">#SS-HOST</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Tier Detailed Deep-Dive Card ── */}
      <div className="mx-auto max-w-5xl px-2 mt-6">
        <AnimatePresence mode="wait">
          {activeTier <= 4 ? (
            <motion.div
              key={activeTierData.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden"
            >
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: activeTierData.accent }}
              />

              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10"
                    style={{ background: `${activeTierData.accent}20` }}
                  >
                    <activeTierData.icon
                      className="h-6 w-6"
                      style={{ color: activeTierData.accent }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-foreground">
                      {isHi ? activeTierData.titleHi : activeTierData.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {isHi ? activeTierData.methodHi : activeTierData.methodEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs py-1 px-3"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {isHi ? activeTierData.slaHi : activeTierData.slaEn}
                  </Badge>
                </div>
              </div>

              {/* Grid: Audit Checks vs Fail Condition */}
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {/* Audit Checks (Spans 2 cols) */}
                <div className="md:col-span-2 space-y-3">
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4" />
                    {isHi ? "अनिवार्य जांच सूची (4 बिंदु)" : "Mandatory Audit Checklist (4 Points)"}
                  </h5>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {(isHi ? activeTierData.checksHi : activeTierData.checksEn).map(
                      (check, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-foreground/90"
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 mt-0.5"
                            style={{ color: activeTierData.accent }}
                          />
                          <span>{check}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Strict Fail Condition (Spans 1 col) */}
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">
                      <XCircle className="h-4 w-4 shrink-0" />
                      {isHi ? "अस्वीकृति शर्त (0 सहिष्णुता)" : "Strict Rejection Trigger"}
                    </div>
                    <p className="text-xs sm:text-sm text-red-200 leading-relaxed font-semibold">
                      {isHi ? activeTierData.failConditionHi : activeTierData.failConditionEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-red-500/20 text-[11px] text-red-300/80 italic">
                    {isHi
                      ? "सुरक्षा से कोई समझौता नहीं। असफल होने पर कोई अपील नहीं।"
                      : "Zero-compromise security. Rejection is final and non-negotiable."}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Node 5: Verified Host Seal Overview */
            <motion.div
              key="seal-node"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-black/80 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <Badge className="bg-amber-500 text-black font-extrabold text-xs">
                    🏆 {isHi ? "100% सत्यापित होस्ट कस्टडी" : "100% Verified Host Custody"}
                  </Badge>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {isHi
                      ? "सत्यापित होस्ट पास (#SS-HOST-VERIFIED)"
                      : "Verified Senior Host Shield (#SS-HOST-VERIFIED)"}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl">
                    {isHi
                      ? "सभी 4 टियर पास करने वाले सीनियर होस्ट्स को 0% लिस्टिंग शुल्क, ₹10,000 होस्ट क्षति कवर, और बेडसाइड 24/7 आपातकालीन एसओएस एक्सेस प्राप्त होता है।"
                      : "Hosts passing all 4 tiers unlock 0% listing fee, ₹10,000 host damage protection, and 24/7 bedside emergency SOS hotline."}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/40 bg-black/60 p-5 text-center shrink-0 max-w-xs w-full">
                  <BadgeCheck className="h-10 w-10 text-amber-400 mx-auto mb-2" />
                  <div className="text-xs font-mono font-bold text-amber-300">
                    ID: #SS-HOST-KANPUR
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-1">
                    ✓ 4-Tier Audit Complete
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-2">
                    {isHi ? "प्रत्येक 6 महीने में पुन: ऑडिट" : "Re-audited every 6 months"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Interactive Live Host Audit Simulator ── */}
      <div className="mx-auto max-w-5xl px-2 mt-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-black/50 p-5 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {isHi ? "लाइव होस्ट सत्यापन सिमुलेटर" : "Live Host Audit Simulator"}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                {isHi
                  ? "परीक्षण करें कि एक उम्मीदवार होस्ट कैसे सत्यापित होता है"
                  : "Test How a Candidate Host Passes Tiers 1 to 4"}
              </h4>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-black hover:bg-emerald-400 transition-all shadow-lg cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span>{isHi ? "सत्यापन चल रहा है..." : "Auditing Host Tiers..."}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>{isHi ? "सिमुलेशन चलाएं" : "Run Verification Test"}</span>
                </>
              )}
            </button>
          </div>

          {/* Console Output Screen */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-emerald-300 min-h-[120px] max-h-[180px] overflow-y-auto space-y-1.5 shadow-inner">
            {simLogs.length === 0 ? (
              <div className="text-muted-foreground italic flex items-center justify-center h-20">
                {isHi
                  ? "सिमुलेशन शुरू करने के लिए ऊपर दिए गए बटन पर क्लिक करें..."
                  : "Click 'Run Verification Test' to simulate real-time host audit..."}
              </div>
            ) : (
              simLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-muted-foreground font-mono">[{i + 1}]</span>
                  <span className={log.includes("🏆") ? "text-amber-300 font-bold" : ""}>
                    {log}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
