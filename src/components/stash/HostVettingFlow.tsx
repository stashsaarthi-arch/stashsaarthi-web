import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  UserCheck,
  Building2,
  FileText,
  CheckCircle2,
  QrCode,
  Lock,
  ArrowRight,
  AlertTriangle,
  Award,
  Sparkles,
  PhoneCall,
  Search,
  Eye,
  FileCheck,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/Card3D";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { VisionAiPhotoVerifier } from "@/components/stash/VisionAiPhotoVerifier";
import { TpaLegalOverviewSection } from "@/components/stash/TpaLegalOverviewSection";

interface VettingStage {
  id: number;
  stepNum: string;
  titleEn: string;
  titleHi: string;
  badgeEn: string;
  badgeHi: string;
  descEn: string;
  descHi: string;
  icon: typeof ShieldCheck;
  checksEn: string[];
  checksHi: string[];
  securityGuaranteeEn: string;
  securityGuaranteeHi: string;
  accentColor: string;
}

export const HostVettingFlow = memo(function HostVettingFlow() {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  const [activeStage, setActiveStage] = useState<number>(0);

  const STAGES: VettingStage[] = [
    {
      id: 0,
      stepNum: "01",
      titleEn: "Biometric & Legal Verification",
      titleHi: "बायोमेट्रिक एवं कानूनी सत्यापन",
      badgeEn: "Aadhaar + Police Cleared",
      badgeHi: "आधार + पुलिस क्लीयरेंस",
      descEn: "Strict identity check and legal background clearance before any home inspection.",
      descHi: "किसी भी भौतिक निरीक्षण से पहले सख्त पहचान जांच और आपराधिक पृष्ठभूमि क्लीयरेंस।",
      icon: UserCheck,
      accentColor: "#10B981",
      checksEn: [
        "Instant biometric Aadhaar e-KYC verification",
        "Local Kanpur Police station background clearance audit",
        "Property ownership deed or registered long-term lease audit",
        "Verified PG Owner host family interview & neighborhood reference check",
      ],
      checksHi: [
        "तत्काल बायोमेट्रिक आधार e-KYC सत्यापन",
        "स्थानीय कानपुर पुलिस स्टेशन पृष्ठभूमि क्लीयरेंस जांच",
        "संपत्ति के स्वामित्व का मालिकाना हक या पंजीकृत लीज डीड ऑडिट",
        "वरिष्ठ होस्ट परिवार साक्षात्कार और पड़ोसी संदर्भ जांच",
      ],
      securityGuaranteeEn: "Zero anonymous listings: 100% verified identities on record.",
      securityGuaranteeHi: "शून्य अज्ञात लिस्टिंग: रिकॉर्ड में 100% सत्यापित पहचान।",
    },
    {
      id: 1,
      stepNum: "02",
      titleEn: "12-Point Physical Safety Audit",
      titleHi: "12-बिंदु भौतिक सुरक्षा ऑडिट",
      badgeEn: "On-Ground Audit Passed",
      badgeHi: "ऑन-ग्राउंड ऑडिट पास",
      descEn:
        "In-person physical inspection of room climate, structural integrity, and lock safety.",
      descHi: "कमरे की जलवायु, संरचनात्मक अखंडता और लॉक सुरक्षा की व्यक्तिगत भौतिक जांच।",
      icon: Building2,
      accentColor: "#38BDF8",
      checksEn: [
        "Elevated wooden pallet setup (zero ground moisture / dampness)",
        "Lockable dedicated room / closet space with keyless/key custody",
        "Ventilation & fire safety audit (smoke check + dry chemical safety)",
        "Hyperlocal safety profile audit (must score >4.2/5 in safety rating)",
      ],
      checksHi: [
        "ऊंचे लकड़ी के पैलेट की व्यवस्था (शून्य जमीनी नमी / सीपेज)",
        "लॉक योग्य समर्पित कमरा / अलमारी स्थान चाबी सुरक्षा के साथ",
        "वेंटीलेशन व अग्नि सुरक्षा ऑडिट (धुआं जांच व सुरक्षा उपकरण)",
        "हाइपरलोकल सुरक्षा प्रोफ़ाइल ऑडिट (सुरक्षा रेटिंग >4.2/5 आवश्यक)",
      ],
      securityGuaranteeEn: "Climate-safe, moisture-free storage guaranteed on elevated pallets.",
      securityGuaranteeHi: "ऊंचे पैलेट्स पर नमी-मुक्त, सुरक्षित माइक्रो-स्टोरेज की गारंटी।",
    },
    {
      id: 2,
      stepNum: "03",
      titleEn: "TPA Legal Charter & Escrow Binding",
      titleHi: "TPA कानूनी चार्टर व एस्क्रो अनुबंध",
      badgeEn: "Legal Charter Enforced",
      badgeHi: "कानूनी चार्टर लागू",
      descEn: "Legal waiver signing, house rules charter, and 100% digital escrow activation.",
      descHi: "कानूनी छूट हस्ताक्षर, गृह नियम चार्टर और 100% डिजिटल एस्क्रो का सक्रियण।",
      icon: FileText,
      accentColor: "#F59E0B",
      checksEn: [
        "TPA Section 105 host waiver & non-interference charter agreement",
        "Binding Verified PG Owner Host House Rules agreement (quiet hours, zero intrusion)",
        "₹10,000 damage & loss protection policy binding",
        "Direct digital bank escrow account link (0% listing fee guarantee)",
      ],
      checksHi: [
        "TPA धारा 105 होस्ट छूट और गैर-हस्तक्षेप चार्टर समझौता",
        "बाध्यकारी वरिष्ठ होस्ट गृह नियम (शांति का समय, शून्य हस्तक्षेप)",
        "₹10,000 क्षति व हानि सुरक्षा पॉलिसी कवरेज",
        "प्रत्यक्ष डिजिटल बैंक एस्क्रो खाता लिंक (0% लिस्टिंग शुल्क)",
      ],
      securityGuaranteeEn: "Strict legal contracts enforce student safety and zero intrusion.",
      securityGuaranteeHi:
        "सख्त कानूनी अनुबंध छात्र सुरक्षा और शून्य हस्तक्षेप सुनिश्चित करते हैं।",
    },
    {
      id: 3,
      stepNum: "04",
      titleEn: "Tamper Seal & 24/7 Monitoring",
      titleHi: "टैम्पर सील व 24/7 सतत निगरानी",
      badgeEn: "Node Verified & Active",
      badgeHi: "नोड सत्यापित व सक्रिय",
      descEn:
        "Issuance of verified node QR pass, laser tamper barcode seals, and 24/7 SOS helpline.",
      descHi: "सत्यापित नोड क्यूआर पास, लेजर टैम्पर बारकोड सील और 24/7 एसओएस सहायता जारी करना।",
      icon: ShieldCheck,
      accentColor: "#00F5A0",
      checksEn: [
        "Issuance of tamper-proof StashSaarthi Host Node QR Badge (#SS-KNP-8921)",
        "Laser-engraved barcode seal registration on all stashed inventory",
        "24/7 Bedside SOS Helpline and 15-minute Kanpur ground ops response SLA",
        "Surprise quarterly physical spot-audits by StashSaarthi operations team",
      ],
      checksHi: [
        "छेड़छाड़-रोधी स्टैशसारथी होस्ट नोड क्यूआर बैज जारी करना (#SS-KNP-8921)",
        "सभी संग्रहित सामान पर लेजर-उत्कीर्ण बारकोड सील पंजीकरण",
        "24/7 बेडसाइड SOS हेल्पलाइन और 15-मिनट कानपुर ग्राउंड टीम सहायता SLA",
        "स्टैशसारथी ऑपरेशंस टीम द्वारा त्रैमासिक आकस्मिक ऑन-ग्राउंड निरीक्षण",
      ],
      securityGuaranteeEn:
        "Unbroken chain of custody verified by digital barcode seals & 24/7 SOS.",
      securityGuaranteeHi: "डिजिटल बारकोड सील और 24/7 SOS द्वारा अटूट कस्टडी श्रृंखला।",
    },
  ];

  return (
    <div id="host-vetting" className="relative mx-auto max-w-5xl px-2 py-4 scroll-mt-20">
      {/* Title Header */}
      <AnimatedContent distance={20} direction="vertical" duration={0.5}>
        <div className="text-center mb-6">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs uppercase tracking-widest mb-2"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            {isHi ? "4-चरण सुरक्षा ऑडिट प्रक्रिया" : "4-Tier Host Verification Charter"}
          </Badge>
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {isHi ? (
              <>
                होस्ट सत्यापन <span className="text-gradient">प्रक्रिया चार्टर</span>
              </>
            ) : (
              <>
                Host Vetting <span className="text-gradient">Process & Safety Protocol</span>
              </>
            )}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {isHi
              ? "कानपुर में प्रत्येक सीनियर होस्ट नोड को हमारे नेटवर्क पर सूचीबद्ध होने से पहले 4-स्तरीय बायोमेट्रिक, कानूनी और भौतिक सुरक्षा जांच से गुजरना अनिवार्य है।"
              : "Every verified PG owner host node undergoes a mandatory 4-stage biometric, legal, and physical inspection before receiving active campus clearance."}
          </p>
        </div>
      </AnimatedContent>

      {/* Interactive 4-Step Diagram Connector */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`relative flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] scale-[1.02]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] opacity-80 hover:opacity-100"
                }`}
              >
                {/* Step Pill Header */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 border border-white/10">
                    STEP {stage.stepNum}
                  </span>
                  {isSelected && (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                <div
                  className="grid h-10 w-10 place-items-center rounded-xl mb-2"
                  style={{ background: `${stage.accentColor}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: stage.accentColor }} />
                </div>

                <span className="text-xs font-bold text-foreground line-clamp-1">
                  {isHi ? stage.titleHi : stage.titleEn}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 font-mono">
                  {isHi ? stage.badgeHi : stage.badgeEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Visual Box */}
      <AnimatePresence mode="wait">
        {STAGES.map((stage, idx) => {
          if (idx !== activeStage) return null;
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/15 bg-black/60 backdrop-blur-xl p-5 sm:p-8 relative overflow-hidden shadow-2xl"
            >
              <div
                className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: stage.accentColor }}
              />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 shadow-inner"
                    style={{ background: `${stage.accentColor}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: stage.accentColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        PHASE {stage.stepNum} OF 04
                      </span>
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-white/5 text-[10px] font-mono text-white"
                      >
                        {isHi ? stage.badgeHi : stage.badgeEn}
                      </Badge>
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-foreground mt-0.5">
                      {isHi ? stage.titleHi : stage.titleEn}
                    </h4>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 self-start md:self-auto">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isHi ? "100% अनिवार्य ऑडिट" : "100% Mandatory Audit"}</span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isHi ? stage.descHi : stage.descEn}
              </p>

              {/* 4 Inspection Points Grid */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(isHi ? stage.checksHi : stage.checksEn).map((check, checkIdx) => (
                  <div
                    key={checkIdx}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 transition-all hover:bg-white/[0.05]"
                  >
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/90 leading-snug">
                      {check}
                    </span>
                  </div>
                ))}
              </div>

              {/* Guarantee Bottom Bar */}
              <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{isHi ? stage.securityGuaranteeHi : stage.securityGuaranteeEn}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStage((prev) => (prev + 1) % 4)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer self-end sm:self-auto"
                >
                  <span>{isHi ? "अगला चरण ऑडिट देखें" : "View Next Audit Stage"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Interactive Google Cloud Vision AI Photo Verifier Widget */}
      <VisionAiPhotoVerifier />

      {/* Dedicated Legal Overview Section (Task 74: TPA Sec 105 Protections in Simple Hindi) */}
      <TpaLegalOverviewSection />

      {/* Summary Trust Stats Strip */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass rounded-2xl p-3 border border-white/10 bg-black/40 text-center">
          <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">100%</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isHi ? "आधार व पुलिस सत्यापित" : "Aadhaar & Police Verified"}
          </p>
        </div>
        <div className="glass rounded-2xl p-3 border border-white/10 bg-black/40 text-center">
          <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono">98.4%</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isHi ? "ऑडिट पासिंग दर" : "Rigorous Audit Pass Rate"}
          </p>
        </div>
        <div className="glass rounded-2xl p-3 border border-white/10 bg-black/40 text-center">
          <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
            ₹10,000
          </span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isHi ? "सुरक्षा कवर गारंटी" : "Embedded Safety Cover"}
          </p>
        </div>
        <div className="glass rounded-2xl p-3 border border-white/10 bg-black/40 text-center">
          <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">24/7</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isHi ? "बेडसाइड SOS और सहायता" : "Bedside SOS & Ops SLA"}
          </p>
        </div>
      </div>
    </div>
  );
});
