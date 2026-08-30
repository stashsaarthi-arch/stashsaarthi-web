import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ClipboardList,
  Cpu,
  PackageCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  QrCode,
  FileCheck2,
  Lock,
  Eye,
  DollarSign,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export function ProcessTransparency() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeStage, setActiveStage] = useState<number>(0);

  const STAGES = [
    {
      id: 0,
      title: isHi ? "1. आपके द्वारा दी जाने वाली जानकारी" : "1. What You Provide",
      subtitle: isHi ? "केवल आवश्यक एवं सटीक विवरण" : "Exact Inputs & Requirements",
      icon: ClipboardList,
      accent: "#10B981",
      points: isHi
        ? [
            "सामान की संख्या एवं बैग का प्रकार (ट्रॉली / कार्टन / रकसैक)",
            "पिकअप एवं वापसी की सटीक तारीखें",
            "कैंपस या हॉस्टल स्थान (उदा. IITK हॉल 13, CSJMU, Kakadeo)",
            "छात्र पहचान पत्र / आधार सत्यापन (केवल सुरक्षा जांच हेतु)",
          ]
        : [
            "Bag count and luggage format (Trolley, Study Box, Rucksack)",
            "Exact drop-off and vacation return dates",
            "Campus origin or hostel location (e.g. IITK Hall 13, CSJMU, Kakadeo)",
            "University ID / Aadhaar verification (solely for safety clearance)",
          ],
      outputBadge: isHi ? "प्रविष्टि सत्यापित" : "Verified Input",
      outputDesc: isHi
        ? "कोई अनावश्यक फॉर्म नहीं — 60 सेकंड में पूरा होता है।"
        : "No unnecessary forms — takes under 60 seconds.",
    },
    {
      id: 1,
      title: isHi ? "2. हमारे सिस्टम में क्या होता है" : "2. Behind The Scenes",
      subtitle: isHi ? "पारदर्शी स्वचालित एवं ऑन-ग्राउंड संचालन" : "Deterministic Ground Mechanics",
      icon: Cpu,
      accent: "#00F5A0",
      points: isHi
        ? [
            "1.2 किमी दायरे में सत्यापित सीनियर होस्ट नोड का स्मार्ट असाइनमेंट",
            "ऑन-साइट भौतिक जांच: सूखे, ऊंचे लकड़ी के पैलेट पर सुरक्षित स्थान",
            "लेजर-उत्कीर्ण बारकोड सील (#SS-KNP-XXXXX) का उपयोग एवं जीपीएस फोटो लॉग",
            "100% डिजिटल एस्क्रो बैंक लॉक — सामान सुरक्षित लौटने तक भुगतान सुरक्षित",
          ]
        : [
            "Hyper-local matching to verified senior host node within 1.2 km",
            "Physical space audit: raised wooden pallets in climate-stable rooms",
            "Laser-engraved tamper barcode sealing (#SS-KNP-XXXXX) & GPS photo log",
            "100% digital bank escrow: host paid only after student confirms safe return",
          ],
      outputBadge: isHi ? "एस्क्रो व सील सक्रिय" : "Escrow & Seal Active",
      outputDesc: isHi
        ? "प्रत्येक चरण रीयल-टाइम डिजिटल रसीद के साथ प्रमाणित होता है।"
        : "Every step is cryptographically logged to your digital custody ticket.",
    },
    {
      id: 2,
      title: isHi ? "3. आपको क्या प्राप्त होता है" : "3. What You Receive",
      subtitle: isHi ? "गारंटीकृत आउटपुट एवं सुरक्षा" : "Guaranteed Deliverables",
      icon: PackageCheck,
      accent: "#38BDF8",
      points: isHi
        ? [
            "जीपीएस और टाइमस्टैम्प के साथ डिजिटल कस्टडी रसीद",
            "प्रति बैग ₹10,000 तक का प्रत्यक्ष माइक्रो-बीमा कवर",
            "1-टैप वापसी शेड्यूलिंग — आपके कमरे के दरवाजे पर समय पर डिलीवरी",
            "24/7 स्थानीय कानपुर ऑपरेशंस टीम की सीधी सहायता",
          ]
        : [
            "Timestamped digital custody receipt with unbroken seal verification",
            "₹10,000 embedded zero-deductible micro-insurance per bag",
            "1-tap return scheduling with doorstep delivery at vacation end",
            "Direct 15-minute response guarantee from our Kanpur operations crew",
          ],
      outputBadge: isHi ? "100% सुरक्षा गारंटी" : "100% Peace of Mind",
      outputDesc: isHi
        ? "सामान की पूरी जिम्मेदारी हमारी है, बिना किसी अस्पष्ट शर्त के।"
        : "Full chain-of-custody guarantee with zero ambiguous fine print.",
    },
  ];

  const WHAT_WE_DO = isHi
    ? [
        "सत्यापित बुजुर्गों के घरों में सूखे, ऊंचे लकड़ी के पैलेट्स पर माइक्रो-स्टोरेज",
        "छात्रों और सीनियर होस्ट्स के बीच 0% ब्रोकरेज सह-आवास और लिखित हाउस चार्टर",
        "पिकअप पर लेजर-उत्कीर्ण गैर-फाड़ने योग्य बारकोड सील और दोहरी फोटो इन्वेंट्री",
        "100% डिजिटल एस्क्रो भुगतान — छात्र की पुष्टि के बाद ही होस्ट को भुगतान",
        "पारदर्शी फिक्स मूल्य निर्धारण (₹300/बैग/माह, ₹5,500/कमरा औसत) — शून्य छुपे शुल्क",
        "कानपुर स्थानीय ग्राउंड टीम द्वारा 15 मिनट में मानवीय सहायता का वादा",
      ]
    : [
        "Peer-to-peer micro-storage on elevated pallets inside audited senior homes (< 1.2km)",
        "Zero-brokerage student co-living with verified local hosts and written house norms",
        "Tamper-evident laser barcode sealing + timestamped dual-photo check-in proof",
        "100% digital escrow: host payouts disbursed only after verified safe handover",
        "Transparent fixed unit economics (₹300/bag/mo, ₹5,500/mo stay) with zero hidden fees",
        "Direct 15-minute human response SLA from our dedicated Kanpur ground team",
      ];

  const WHAT_WE_DO_NOT = isHi
    ? [
        "हम कोई लावारिस, धूल भरे कमर्शियल वेयरहाउस या इंडस्ट्रियल गोदाम संचालित नहीं करते",
        "हम खुले या बिना सील किए पैकेज, नकद पैसे, सोना, गहने या ज्वलनशील वस्तुएं स्वीकार नहीं करते",
        "हम कोई ब्रोकर या बिचौलिया नहीं हैं जो 1-2 महीने का भारी ब्रोकरेज कमीशन वसूलते हों",
        "हम आपके फोन नंबर या पहचान दस्तावेजों को कभी किसी विज्ञापन एजेंसी को नहीं बेचते",
        "हम कभी कोई ऑटो-डेबिट नहीं करते और न ही कोई छिपा हुआ रद्दीकरण जुर्माना लगाते हैं",
        "हम ऑटोमेटेड रोबोटिक चैटबॉट के पीछे नहीं छिपते — सीधी मानवीय जवाबदेही देते हैं",
      ]
    : [
        "We do NOT operate dusty, unmonitored commercial industrial godowns or warehouses",
        "We do NOT accept unsealed bags, cash, gold jewelry, liquids, or hazardous chemicals",
        "We do NOT act as middleman brokers charging 1–2 months' security commissions",
        "We do NOT sell, rent, monetize, or share your contact info with advertisers",
        "We do NOT auto-debit bank accounts or enforce locked long-term contracts",
        "We do NOT hide behind automated bots — real humans take end-to-end accountability",
      ];

  return (
    <div
      id="how-it-works"
      className="relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20"
    >
      {/* ── 3-Stage Interactive Blueprint ── */}
      <div>
        {/* Stage Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 max-w-xl mx-auto mb-4">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-emerald-400" : ""}`} />
                <span className="truncate">{stage.title.split(".")[1]?.trim() || stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Content Card */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {STAGES.map((stage) => {
              if (stage.id !== activeStage) return null;
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden"
                >
                  <div
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: stage.accent }}
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl border border-white/10"
                        style={{ background: `${stage.accent}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: stage.accent }} />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                          {stage.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 self-start md:self-auto">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">
                        {stage.outputBadge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {stage.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-emerald-500/20"
                      >
                        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="italic">{stage.outputDesc}</span>
                    <button
                      type="button"
                      onClick={() => setActiveStage((prev) => (prev + 1) % 3)}
                      className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span>{isHi ? "अगला चरण" : "Next Stage"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── What We DO vs What We DO NOT Do Matrix (Radical Honesty) ── */}
      <div className="mt-16 sm:mt-24">
        <AnimatedContent distance={40} direction="vertical" duration={0.7}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isHi ? (
                <>
                  हम क्या करते हैं <span className="text-emerald-400">बनाम</span> हम क्या नहीं करते
                </>
              ) : (
                <>
                  What We DO <span className="text-emerald-400">vs.</span> What We DO NOT Do
                </>
              )}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              {isHi
                ? "स्पष्ट सीमाएं और प्रामाणिक वादे — ताकि कोई गलतफहमी न रहे।"
                : "Honest operational boundaries and zero fine-print ambiguity."}
            </p>
          </div>
        </AnimatedContent>

        <div className="grid gap-6 md:grid-cols-2">
          {/* What We DO */}
          <AnimatedContent distance={40} direction="horizontal" duration={0.7} delay={0.1}>
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/[0.12] p-6 sm:p-8 relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-emerald-300">
                    {isHi ? "हम क्या करते हैं (गारंटी)" : "What StashSaarthi DOES"}
                  </h4>
                  <span className="text-xs text-emerald-400/80 font-mono">
                    {isHi ? "100% सत्यापित एवं प्रतिबद्ध" : "Deterministic & Certified"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 flex-1">
                {WHAT_WE_DO.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContent>

          {/* What We DO NOT Do */}
          <AnimatedContent distance={40} direction="horizontal" duration={0.7} delay={0.2}>
            <div className="rounded-3xl border border-red-500/30 bg-red-950/[0.12] p-6 sm:p-8 relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-500/20 text-red-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-300">
                    {isHi ? "हम क्या नहीं करते (सख्त सीमाएं)" : "What We DO NOT Do"}
                  </h4>
                  <span className="text-xs text-red-400/80 font-mono">
                    {isHi ? "शून्य डार्क पैटर्न" : "Zero Dark Patterns"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 flex-1">
                {WHAT_WE_DO_NOT.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
