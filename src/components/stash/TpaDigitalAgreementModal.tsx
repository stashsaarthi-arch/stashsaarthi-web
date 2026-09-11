import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  X,
  Lock,
  Award,
  Sparkles,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { playPop } from "@/lib/audio";
import {
  TpaDigitalAgreementRecord,
  verifyTpaStampHash,
} from "@/lib/tpaDigitalAgreementEngine";

interface TpaDigitalAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: TpaDigitalAgreementRecord | null;
}

export function TpaDigitalAgreementModal({
  open,
  onOpenChange,
  record,
}: TpaDigitalAgreementModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"stamp" | "clauses">("stamp");

  if (!open || !record) return null;

  const isHashValid = verifyTpaStampHash(record);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(
      `TPA Sec 105 e-Stamp Certificate: ${record.stampCertificateNo}\nGRN: ${record.grnNo}\nHost: ${record.secondPartyHostName}\nHash: ${record.verificationHash}`
    );
    setCopied(true);
    playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playPop();
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-[#0A0D0F] p-4 sm:p-7 text-foreground shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] font-mono">
                    GOVT OF UP • e-STAMP CERTIFICATE ₹100
                  </Badge>
                  {isHashValid && (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono">
                      ✓ SEAL VERIFIED
                    </Badge>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {isHi
                    ? "TPA धारा 105 डिजिटल लीव एंड लाइसेंस स्टांप समझौता"
                    : "TPA Sec 105 Digital Leave & License Stamp Agreement"}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playPop();
                onOpenChange(false);
              }}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 my-3 border-b border-white/10 pb-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab("stamp");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "stamp"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              📜 {isHi ? "ई-स्टांप प्रमाणपत्र" : "e-Stamp Certificate"}
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab("clauses");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "clauses"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              ⚖️ {isHi ? "कानूनी धाराएं (5 बिंदु)" : "Legal Clauses (5 Points)"}
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
            {activeTab === "stamp" && (
              <div className="space-y-4">
                {/* Official e-Stamp Certificate Box */}
                <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#18140C] via-[#0E0C08] to-[#0A0D0F] p-4 sm:p-6 relative overflow-hidden text-amber-100 shadow-inner">
                  {/* Watermark Logo */}
                  <div className="absolute right-4 top-4 opacity-10 pointer-events-none text-right font-serif text-6xl font-black text-amber-500 select-none">
                    UP STAMP
                  </div>

                  {/* Stamp Header */}
                  <div className="text-center border-b border-amber-500/30 pb-3 mb-4 space-y-1">
                    <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      GOVERNMENT OF UTTAR PRADESH
                    </div>
                    <h2 className="text-base sm:text-xl font-extrabold text-amber-300 font-serif tracking-wide">
                      e-STAMP CERTIFICATE OF LEAVE & LICENSE
                    </h2>
                    <p className="text-[10px] text-amber-200/70 font-mono">
                      Issued under Transfer of Property Act (TPA) 1882, Section 105
                    </p>
                  </div>

                  {/* Stamp Details Grid */}
                  <div className="grid gap-2.5 sm:grid-cols-2 text-[11px] font-mono">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">CERTIFICATE NO:</span>
                      <span className="text-white font-bold">{record.stampCertificateNo}</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">GOVT GRN NO:</span>
                      <span className="text-white font-bold">{record.grnNo}</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">FIRST PARTY (LICENSOR):</span>
                      <span className="text-white font-bold">{record.firstParty}</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">SECOND PARTY (HOST LICENSEE):</span>
                      <span className="text-white font-bold">{record.secondPartyHostName} ({record.secondPartyHostPhone})</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20 sm:col-span-2">
                      <span className="text-amber-400 font-semibold block text-[10px]">PROPERTY NODE ADDRESS (KANPUR):</span>
                      <span className="text-white font-bold">{record.nodeAddress} — ({record.campusNode})</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">STAMP DUTY PAID:</span>
                      <span className="text-emerald-400 font-bold">₹{record.stampDutyAmount} (UP Non-Judicial)</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-semibold block text-[10px]">TERM & VALIDITY:</span>
                      <span className="text-white font-bold">{record.validityMonths} Months (Revocable at Will)</span>
                    </div>
                  </div>

                  {/* Verification Cryptographic Hash Bar */}
                  <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" />
                        SHA-256 DIGITAL VERIFICATION SEAL
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300">STATUS: VALID</span>
                    </div>
                    <div className="text-[10px] font-mono text-white/90 break-all bg-black/60 p-2 rounded-lg border border-emerald-500/20">
                      {record.verificationHash}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "clauses" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-foreground/90">
                  <p className="font-medium">
                    {isHi
                      ? "यह 5-स्तरीय कानूनी समझौता भारतीय संपत्ति हस्तांतरण अधिनियम 1882 की धारा 105 के तहत लीव एंड लाइसेंस मॉडल को परिभाषित करता है:"
                      : "This 5-point legal charter enforces the Permissive Leave & License model under Section 105 of the Transfer of Property Act (TPA) 1882:"}
                  </p>
                </div>

                <div className="space-y-3">
                  {record.clauses.map((clause) => (
                    <div
                      key={clause.clauseNumber}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-bold text-amber-300 text-xs">
                          {clause.clauseNumber}. {isHi ? clause.titleHi : clause.titleEn}
                        </span>
                        <Badge variant="outline" className="border-amber-500/30 text-[10px] text-amber-400">
                          CLAUSE {clause.clauseNumber}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {isHi ? clause.contentHi : clause.contentEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "स्टांप हैश कॉपी करें" : "Copy Stamp Details")}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{isHi ? "ई-स्टांप प्रिंट / PDF सहेजें" : "Print / Save PDF Stamp"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  onOpenChange(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
              >
                <span>{isHi ? "संपन्न" : "Close"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
