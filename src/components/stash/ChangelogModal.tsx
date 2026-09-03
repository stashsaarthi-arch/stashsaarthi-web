import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  GitCommit,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export interface ChangelogItem {
  version: string;
  date: string;
  status: "live" | "in-progress" | "planned";
  title: string;
  title_hi?: string;
  highlights: string[];
  highlights_hi?: string[];
}

export const CHANGELOG_DATA: ChangelogItem[] = [
  {
    version: "v1.0 (Live)",
    date: "August 2026",
    status: "live",
    title: "Kanpur Corridor Genesis & Zero-Risk Custody Engine",
    title_hi: "कानपुर कॉरिडोर शुरुआत एवं शून्य-जोखिम कस्टडी इंजन",
    highlights: [
      "5 Verified Kanpur Academic Hubs Active (IIT Kanpur, CSJMU, HBTU, GSVM, Kakadeo)",
      "Tamper-evident serialized laser barcode seals deployed (#SS-KNP-84920)",
      "100% Digital Bank Escrow payout system for senior hosts",
      "Guaranteed 15-minute direct human response SLA during campus hours",
      "Radical Process Transparency & Zero Dark Patterns framework",
    ],
    highlights_hi: [
      "5 सत्यापित कानपुर कैंपस हब सक्रिय (IIT कानपुर, CSJMU, HBTU, GSVM, काकादेव)",
      "छेड़छाड़-रोधी लेजर बारकोड सील प्रणाली (#SS-KNP-84920) लाइव",
      "सीनियर होस्ट्स के लिए 100% डिजिटल बैंक एस्क्रो भुगतान व्यवस्था",
      "कैंपस समय के दौरान 15-मिनट की सीधी मानवीय सहायता गारंटी (SLA)",
      "पूर्ण प्रक्रिया पारदर्शिता एवं शून्य डार्क पैटर्न चार्टर लागू",
    ],
  },
  {
    version: "v1.1 (Next 30 Days)",
    date: "September 2026",
    status: "in-progress",
    title: "Regional Node Expansion & IoT Space Sensors",
    title_hi: "क्षेत्रीय नोड विस्तार एवं आईओटी स्पेस सेंसर्स",
    highlights: [
      "Lucknow (Hazratganj / Gomti Nagar) & Delhi NCR student corridor rollout",
      "IoT moisture & temperature tripwire sensors installed across host nodes",
      "Campus Captains student dashboard with instant ₹50/booking reward credits",
      "Automated WhatsApp luggage check-in photo receipts with GPS verification",
    ],
    highlights_hi: [
      "लखनऊ और दिल्ली एनसीआर छात्र कॉरिडोर में नोड्स का विस्तार",
      "होस्ट नोड्स में आईओटी नमी व तापमान सुरक्षा सेंसर की स्थापना",
      "कैंपस कैप्टन डैशबोर्ड व तत्काल ₹50/बुकिंग रिवॉर्ड क्रेडिट सिस्टम",
      "जीपीएस सत्यापन के साथ स्वचालित व्हाट्सएप फोटो रसीदें",
    ],
  },
  {
    version: "v1.2 (Q4 2026)",
    date: "November 2026",
    status: "planned",
    title: "Inter-City Luggage Shuttle & Unified Host Portal",
    title_hi: "अंतर-शहर लगेज शटल एवं एकीकृत होस्ट पोर्टल",
    highlights: [
      "Inter-city student luggage shuttle route (Kanpur ↔ Delhi ↔ Pune)",
      "Multi-language Voice AI assistant for senior hosts in Hindi & regional dialects",
      "Automated hostel-to-host move-in concierge with physical vehicle dispatch",
    ],
    highlights_hi: [
      "अंतर-शहर छात्र लगेज शटल रूट (कानपुर ↔ दिल्ली ↔ पुणे)",
      "बुजुर्गों के लिए हिंदी में मल्टी-लैंग्वेज वॉयस सपोर्ट",
      "हॉस्टल से सीधे कमरे तक स्वचालित पिकअप एवं वाहन सुविधा",
    ],
  },
];

export function ChangelogModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-[#0A0D0F] p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between border-b border-neutral-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {isHi ? "लाइव सार्वजनिक रोडमैप" : "PUBLIC CHANGELOG & ROADMAP"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {isHi ? "प्लेटफॉर्म प्रगति एवं रोडमैप" : "Active Development • v1.0 Live"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {isHi
                  ? "पारदर्शी उत्पाद विकास — देखें कि हाल ही में क्या लाइव हुआ है और आगे क्या आ रहा है।"
                  : "Transparent public updates. Track what is live in Kanpur and what we are shipping next."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-800 bg-neutral-900 text-muted-foreground hover:text-white transition-colors cursor-pointer"
              aria-label="Close changelog modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Timeline */}
          <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {CHANGELOG_DATA.map((item, index) => {
              const isLive = item.status === "live";
              const isInProgress = item.status === "in-progress";

              return (
                <div
                  key={item.version}
                  className={`rounded-2xl border p-4 sm:p-5 relative transition-all ${
                    isLive
                      ? "border-emerald-500/30 bg-emerald-950/[0.12]"
                      : isInProgress
                        ? "border-amber-500/30 bg-amber-950/[0.12]"
                        : "border-neutral-800 bg-neutral-900/30 opacity-75"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          isLive
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                            : isInProgress
                              ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                              : "border-neutral-700 bg-neutral-800 text-neutral-300"
                        }`}
                      >
                        {item.version}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isLive
                          ? "text-emerald-400"
                          : isInProgress
                            ? "text-amber-400"
                            : "text-neutral-400"
                      }`}
                    >
                      {isLive
                        ? isHi
                          ? "🟢 लाइव एवं सक्रिय"
                          : "🟢 Shipped & Live"
                        : isInProgress
                          ? isHi
                            ? "🟡 विकास में"
                            : "🟡 In Active Build"
                          : isHi
                            ? "⚪ योजनाबद्ध"
                            : "⚪ Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-foreground mt-2">
                    {isHi && item.title_hi ? item.title_hi : item.title}
                  </h3>

                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    {(isHi && item.highlights_hi ? item.highlights_hi : item.highlights).map(
                      (h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                              isLive
                                ? "text-emerald-400"
                                : isInProgress
                                  ? "text-amber-400"
                                  : "text-neutral-500"
                            }`}
                          />
                          <span>{h}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {isHi
                ? "कानपुर कोर टीम द्वारा लगातार अपडेट किया जाता है।"
                : "Continuous deployment by Kanpur core team."}
            </span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              {isHi ? "बंद करें" : "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function LiveChangelogBadge({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3 py-1 text-xs text-slate-300 backdrop-blur-md transition-all hover:border-emerald-500/60 hover:bg-emerald-950/20 hover:text-white cursor-pointer active:scale-95 shadow-sm ${className}`}
        title="View StashSaarthi Public Changelog & Roadmap"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono text-xs font-semibold text-emerald-300">
          {isHi ? "सक्रिय विकास • v1.0 लाइव" : "Active Development • v1.0 Live"}
        </span>
        <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>

      <ChangelogModal open={open} onOpenChange={setOpen} />
    </>
  );
}
