import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ShieldAlert,
  PackageCheck,
  KeyRound,
  Lock,
  BadgeIndianRupee,
  Wallet,
  HeartHandshake,
  Activity,
  Camera,
  Eye,
  Check,
  ShieldCheck,
  Fingerprint,
  ScanBarcode,
  LockKeyhole,
  QrCode,
  X,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/Card3D";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Colour tokens ─────────────────────────────────────────── */
const EMERALD = "#10B981";
const GOLD = "#F59E0B";
const OBSIDIAN = "#0A0D0F";

/* ─── Risk Card data ────────────────────────────────────────── */
type RiskCard = {
  id: string;
  title: string;
  title_hi?: string;
  icons: [typeof ShieldAlert, typeof PackageCheck] | [typeof KeyRound, typeof Lock] | [typeof BadgeIndianRupee, typeof Wallet] | [typeof HeartHandshake, typeof Activity] | [typeof Camera, typeof Eye];
  problem: string;
  problem_hi?: string;
  mitigations: string[];
  mitigations_hi?: string[];
  accent: string;
};

const CARDS: RiskCard[] = [
  {
    id: "tamper",
    title: "Luggage Tampering & Theft Risk → Smart Barcode Seals & Insurance",
    title_hi: "सामान से छेड़छाड़ व चोरी का जोखिम → स्मार्ट बारकोड सील व बीमा",
    icons: [ShieldAlert, PackageCheck],
    problem: "What if my luggage is opened or misplaced during vacations?",
    problem_hi: "क्या होगा यदि छुट्टियों के दौरान मेरा सामान खोला जाए या गुम हो जाए?",
    mitigations: [
      "Laser-engraved, tamper-evident barcode numeric seals (₹2/unit)",
      "Timestamped dual-photo check-in & check-out logs via app",
      "Guaranteed embedded micro-insurance up to ₹10,000 per bag",
      "Dedicated dry, raised platform storage (no floor moisture damage)",
    ],
    mitigations_hi: [
      "लेजर-उत्कीर्ण, छेड़छाड़-रोधी बारकोड संख्यात्मक सील (₹2/इकाई)",
      "ऐप के माध्यम से समय-मुद्रित दोहरी फोटो चेक-इन व चेक-आउट लॉग",
      "प्रति बैग ₹10,000 तक की गारंटीकृत माइक्रो-बीमा सुरक्षा",
      "ऊंचे पैलेट पर सूखा भंडारण (जमीन की नमी से 100% बचाव)",
    ],
    accent: EMERALD,
  },
  {
    id: "privacy",
    title: "Elder Privacy & Intrusion Risk → Smart-Locked Master Zones",
    title_hi: "बुजुर्गों की निजता व दखलअंदाजी का जोखिम → स्मार्ट-लॉक्ड मास्टर ज़ोन",
    icons: [KeyRound, Lock],
    problem: "What if a student intrudes into the host's private living space?",
    problem_hi: "क्या होगा यदि कोई छात्र होस्ट के निजी रहने की जगह में दखल दे?",
    mitigations: [
      "Senior master bedrooms remain smart-locked/restricted master zones",
      "Interactions strictly limited to verified shared common spaces",
      "Mandatory 7-day trial period with structured \"House Norms Matrix\"",
    ],
    mitigations_hi: [
      "बुजुर्गों के मुख्य शयनकक्ष स्मार्ट-लॉक्ड और पूर्णतः निजी क्षेत्र रहते हैं",
      "बातचीत व आवाजाही केवल सत्यापित साझा क्षेत्रों तक सीमित",
      "पारिवारिक 'हाउस नॉर्म्स मैट्रिक्स' के साथ 7 दिनों की अनिवार्य ट्रायल अवधि",
    ],
    accent: GOLD,
  },
  {
    id: "fraud",
    title: "Financial Fraud & Non-Payment → 100% Digital Escrow",
    title_hi: "वित्तीय धोखाधड़ी व भुगतान न होने का जोखिम → 100% डिजिटल एस्क्रो",
    icons: [BadgeIndianRupee, Wallet],
    problem: "What if rent is delayed, or a senior gets scammed for cash?",
    problem_hi: "क्या होगा यदि किराया रुक जाए या नकद लेन-देन में कोई समस्या आए?",
    mitigations: [
      "Zero direct cash handling allowed on the platform",
      "100% digital escrow: rent/storage fee locked & disbursed to hosts weekly",
      "Automated dispute resolution before any payout release",
    ],
    mitigations_hi: [
      "प्लेटफॉर्म पर किसी भी तरह के प्रत्यक्ष नकद लेन-देन की अनुमति नहीं",
      "100% डिजिटल एस्क्रो: किराया/स्टोरेज शुल्क सुरक्षित और साप्ताहिक सीधे बैंक में",
      "भुगतान जारी करने से पहले स्वचालित विवाद समाधान सुरक्षा",
    ],
    accent: EMERALD,
  },
  {
    id: "medical",
    title: "Senior Medical & Safety Emergencies → Wearable SOS & Family Co-Pilot",
    title_hi: "बुजुर्गों की चिकित्सा व सुरक्षा आपातकाल → वियरेबल एसओएस व फैमिली को-पायलट",
    icons: [HeartHandshake, Activity],
    problem: "What if the elderly host faces a sudden health emergency?",
    problem_hi: "क्या होगा यदि बुजुर्ग होस्ट को अचानक कोई स्वास्थ्य आपातकाल आ जाए?",
    mitigations: [
      "1-Touch bedside/wearable emergency SOS button → local response & verified student roommate",
      "Remote Family Dashboard: sons/daughters monitor check-ins, ratings & safety logs in real time",
    ],
    mitigations_hi: [
      "1-टच बेडसाइड/वियरेबल इमरजेंसी एसओएस बटन → त्वरित स्थानीय मदद व छात्र साथी अलर्ट",
      "रिमोट फैमिली डैशबोर्ड: दूर रहने वाले बेटे/बेटियां रीयल-टाइम में सुरक्षा लॉग देख सकते हैं",
    ],
    accent: GOLD,
  },
  {
    id: "surveillance",
    title: "Storage Node Surveillance → AI Motion-Tripwire Monitoring",
    title_hi: "स्टोरेज नोड निगरानी → एआई मोशन-ट्रिपवायर सुरक्षा",
    icons: [Camera, Eye],
    problem: "Is the storage room safe from unauthorized entry 24/7?",
    problem_hi: "क्या स्टोरेज रूम चौबीसों घंटे अनधिकृत प्रवेश से सुरक्षित है?",
    mitigations: [
      "Low-cost, AI-enabled motion tripwire sensors alerting host & StashSaarthi ops",
      "Instant push notification on unauthorized movement near storage pods",
    ],
    mitigations_hi: [
      "एआई-सक्षम मोशन ट्रिपवायर सेंसर जो होस्ट और सार्थी टीम को तुरंत सतर्क करते हैं",
      "स्टोरेज पॉड्स के पास किसी भी अनधिकृत गतिविधि पर तत्काल अलर्ट नोटिफिकेशन",
    ],
    accent: EMERALD,
  },
];

/* ─── Chain of Custody steps ────────────────────────────────── */
type CustodyStep = {
  id: number;
  label: string;
  label_hi?: string;
  icon: typeof Fingerprint;
  detail: string;
  detail_hi?: string;
};

const CUSTODY_STEPS: CustodyStep[] = [
  {
    id: 1,
    label: "Aadhaar + University ID Biometric Clearance",
    label_hi: "आधार + विश्वविद्यालय आईडी बायोमेट्रिक क्लीयरेंस",
    icon: Fingerprint,
    detail: "Verified identity match with live biometric face scan",
    detail_hi: "लाइव बायोमेट्रिक फेस स्कैन के साथ सत्यापित पहचान मिलान",
  },
  {
    id: 2,
    label: "Tamper Seal Application & Geo-tagged Photo Log",
    label_hi: "टैम्पर सील लगाना व जियो-टैग्ड फोटो लॉग",
    icon: ScanBarcode,
    detail: "Barcode seal applied, dual-photo log with GPS timestamp",
    detail_hi: "बारकोड सील, जीपीएस टाइमस्टैम्प के साथ दोहरी फोटो लॉग",
  },
  {
    id: 3,
    label: "Escrow Lock & StashNode Secure Placement",
    label_hi: "एस्क्रो लॉक व स्टैश नोड में सुरक्षित भंडारण",
    icon: LockKeyhole,
    detail: "Payment locked in digital escrow, item placed in audited node",
    detail_hi: "डिजिटल एस्क्रो में भुगतान सुरक्षित, ऑडिटेड नोड में सामान रखा गया",
  },
  {
    id: 4,
    label: "QR-Scan Seal Integrity Check & Safe Handover",
    label_hi: "क्यूआर-स्कैन सील अखंडता जांच व सुरक्षित हैंडओवर",
    icon: QrCode,
    detail: "Seal verified unbroken before zero-contact student return",
    detail_hi: "छात्र को सामान लौटाने से पहले सील की अक्षुण्णता की जांच",
  },
];

function RiskMitigationCard({
  card,
  index,
}: {
  card: RiskCard;
  index: number;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [Icon1, Icon2] = card.icons;

  const title = isHi && card.title_hi ? card.title_hi : card.title;
  const problem = isHi && card.problem_hi ? card.problem_hi : card.problem;
  const mitigations = isHi && card.mitigations_hi ? card.mitigations_hi : card.mitigations;

  return (
    <AnimatedContent
      distance={50}
      direction="vertical"
      duration={0.7}
      threshold={0.12}
      delay={Math.min(index * 0.1, 0.4)}
    >
      <Card3D className="h-full rounded-3xl" maxTilt={8}>
        <div className="glass glass-hover flex h-full flex-col overflow-hidden rounded-3xl relative z-10 bg-black/40">
          {/* ── Header ── */}
          <div className="flex items-start gap-3 p-5 sm:p-6" style={{ transform: "translateZ(30px)" }}>
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10"
              style={{
                background: `color-mix(in oklab, ${card.accent} 18%, transparent)`,
              }}
            >
              <Icon1 className="h-5 w-5" style={{ color: card.accent }} />
            </span>
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10"
              style={{
                background: `color-mix(in oklab, ${card.accent} 12%, transparent)`,
              }}
            >
              <Icon2 className="h-5 w-5" style={{ color: card.accent }} />
            </span>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
            <h3 className="text-sm font-bold leading-snug sm:text-base break-words" style={{ transform: "translateZ(20px)" }}>
              {title}
            </h3>

            {/* ── Risk callout ── */}
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: GOLD }}
              />
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm break-words">
                {problem}
              </p>
            </div>

            {/* ── Mitigation engine ── */}
            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              >
                <ShieldCheck className="mr-1 h-3 w-3" /> {isHi ? "सुरक्षा निवारण प्रणाली" : "Mitigation Engine"}
              </Badge>
            </div>
            <ul className="mt-3 flex-1 space-y-2">
              {mitigations.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: EMERALD }}
                  />
                  <span className="text-muted-foreground break-words">{m}</span>
                </li>
              ))}
            </ul>

            {/* ── Active glow bar ── */}
            <motion.div
              className="mt-5 h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${card.accent}, transparent)`,
              }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </Card3D>
    </AnimatedContent>
  );
}

/* ─── Seal Verification Certificate Modal ───────────────────── */
function SealCertificate({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-4 max-w-sm overflow-hidden rounded-3xl border border-emerald-500/30 p-8 text-center"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in oklab, ${EMERALD} 18%, ${OBSIDIAN}), ${OBSIDIAN})`,
          boxShadow: `0 0 80px -20px ${EMERALD}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scanline */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-20"
          style={{
            background: `linear-gradient(180deg, ${EMERALD}, transparent)`,
            animation: "seal-scanline 2.5s ease-in-out infinite",
          }}
        />

        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border-2 border-emerald-500/40"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, ${EMERALD} 25%, transparent), transparent)`,
            boxShadow: `0 0 40px -8px ${EMERALD}60`,
          }}
        >
          <ShieldCheck className="h-10 w-10" style={{ color: EMERALD }} />
        </motion.div>

        <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
          {isHi ? "✓ सील 100% अक्षुण्ण" : "✓ Seal Intact"}
        </h3>
        <p
          className="mt-1 text-sm font-bold"
          style={{ color: EMERALD }}
        >
          {isHi ? "टैम्पर-प्रूफ बारकोड #SS-KNP-84920" : "Tamper-Proof Barcode #SS-KNP-84920"}
        </p>

        <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-left font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isHi ? "पिकअप स्थान:" : "Pickup Location:"}</span>
            <span className="font-semibold text-foreground">{isHi ? "आईआईटी कानपुर हॉल 13" : "IIT Kanpur Hall 13"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isHi ? "स्टोरेज नोड:" : "Storage Node:"}</span>
            <span className="font-semibold text-foreground">{isHi ? "कल्याणपुर सीनियर होम #04" : "Kalyanpur Senior Home #04"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isHi ? "सक्रिय बीमा:" : "Insurance Active:"}</span>
            <span className="font-bold text-emerald-400">₹10,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isHi ? "स्थिति:" : "Integrity Status:"}</span>
            <span className="font-bold text-emerald-400">{isHi ? "100% सुरक्षित एवं सीलबंद" : "100% Verified Sealed"}</span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          {isHi ? "यह विंडो 4 सेकंड में स्वतः बंद हो जाएगी।" : "This certificate auto-closes in 4 seconds."}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Chain of Custody Interactive Timeline ─────────────────── */
function CustodyTimeline() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeStep, setActiveStep] = useState(0);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % CUSTODY_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-14 sm:mt-20">
      <AnimatedContent distance={40} direction="vertical" duration={0.8}>
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                  {isHi ? "डिजिटल कस्टडी चेन प्रोटोकॉल" : "Digital Chain of Custody Protocol"}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                {isHi ? "सामान उठाने से वापसी तक 4-चरणीय सत्यापन" : "4-Stage Verifiable Custody from Doorstep to Return"}
              </h3>
            </div>

            <button
              onClick={() => setShowCert(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isHi ? "सील सत्यापन डेमो" : "Try Tamper Seal Demo"}</span>
            </button>
          </div>

          {/* Desktop Timeline */}
          <div className="mt-8 hidden md:grid md:grid-cols-4 gap-3">
            {CUSTODY_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCurrent = i === activeStep;
              const isPassed = i < activeStep;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(i)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                    isCurrent
                      ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                      : isPassed
                      ? "border-emerald-500/20 bg-white/[0.03]"
                      : "border-white/10 bg-white/[0.02] opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${
                      isCurrent || isPassed ? "bg-emerald-500 text-black font-mono" : "bg-white/10 text-white font-mono"
                    }`}>
                      0{step.id}
                    </span>
                    <Icon className={`h-4 w-4 ${isCurrent ? "text-emerald-400" : "text-slate-400"}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {isHi && step.label_hi ? step.label_hi : step.label}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {isHi && step.detail_hi ? step.detail_hi : step.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Timeline */}
          <div className="mt-6 md:hidden space-y-3">
            {CUSTODY_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCurrent = i === activeStep;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                    isCurrent
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    0{step.id}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isHi && step.label_hi ? step.label_hi : step.label}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {isHi && step.detail_hi ? step.detail_hi : step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedContent>

      <AnimatePresence>
        {showCert && <SealCertificate onClose={() => setShowCert(false)} />}
      </AnimatePresence>
    </div>
  );
}

export function ZeroRisk() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <section
      id="safety-protocol"
      data-section="zero-risk"
      className="relative overflow-hidden py-16 sm:py-24 scroll-mt-20"
      style={{
        background: `linear-gradient(180deg, transparent 0%, ${OBSIDIAN} 6%, ${OBSIDIAN} 94%, transparent 100%)`,
      }}
    >
      {/* ── Grid noise overlay ── */}
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-40" />

      {/* ── Ambient glow orbs ── */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: EMERALD }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full opacity-[0.05] blur-[100px]"
        style={{ background: GOLD }}
      />

      <div className="relative mx-auto max-w-5xl px-4">
        {/* ── Section Header ── */}
        <AnimatedContent distance={50} direction="vertical" duration={0.8}>
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-sm"
              style={{ color: EMERALD }}
            >
              {isHi ? "🛡️ शून्य-जोखिम इकोसिस्टम" : "🛡️ ZERO-RISK ECOSYSTEM"}
            </Badge>

            <h2 className="mt-6 text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
              {isHi ? (
                <>
                  <span className="text-gradient">100% मानसिक शांति</span> के लिए निर्मित।
                  <br />
                  <span className="mt-1 block text-lg font-bold text-muted-foreground sm:text-2xl">
                    हम हर एक संभावित जोखिम को कैसे समाप्त करते हैं।
                  </span>
                </>
              ) : (
                <>
                  Engineered for <span className="text-gradient">100% Peace of Mind.</span>
                  <br />
                  <span className="mt-1 block text-lg font-bold text-muted-foreground sm:text-2xl">
                    How We Eliminate Every Single Risk.
                  </span>
                </>
              )}
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {isHi
                ? "हमने ब्रोकर के अविश्वास को संस्थागत कस्टडी-चेन, डिजिटल वित्तीय एस्क्रो और वरिष्ठ नागरिक सुरक्षा तकनीक से बदल दिया है।"
                : "We replaced high-brokerage distrust with institutional-grade chain-of-custody, financial escrow, and elder safety tech."}
            </p>
          </div>
        </AnimatedContent>

        {/* ── 5 Risk-Mitigation Cards — Bento Grid ── */}
        <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2">
          {CARDS.slice(0, 4).map((card, i) => (
            <div key={card.id}>
              <RiskMitigationCard card={card} index={i} />
            </div>
          ))}
        </div>
        {/* Card 5 spans full width */}
        <div className="mt-4">
          <RiskMitigationCard card={CARDS[4]!} index={4} />
        </div>

        {/* ── Chain of Custody Timeline ── */}
        <CustodyTimeline />

        {/* ── Trust badge footer note ── */}
        <AnimatedContent distance={30} direction="vertical" duration={0.6} delay={0.2}>
          <div className="mt-14 text-center">
            <p className="text-xs text-muted-foreground sm:text-sm">
              {isHi ? (
                <>
                  सभी होस्ट पंजीकरण हमारे सुरक्षित डेटाबेस में{" "}
                  <span className="font-semibold" style={{ color: EMERALD }}>
                    सत्यापित
                  </span>{" "}
                  बैज से जुड़े हैं — 3-स्तरीय पहचान, पृष्ठभूमि और ऑन-साइट ऑडिट द्वारा समर्थित।
                </>
              ) : (
                <>
                  All host registrations are linked to{" "}
                  <span className="font-semibold" style={{ color: EMERALD }}>
                    verified
                  </span>{" "}
                  badges in our secure database — backed by 3-Tier identity, background & on-site verification.
                </>
              )}
            </p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
