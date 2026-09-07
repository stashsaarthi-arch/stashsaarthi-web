import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  FileBadge,
  Building2,
  Home,
  X,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { playPop } from "@/lib/audio";
import {
  OFFICIAL_HOST_VETTING_POLICY,
  HostAgreementRecord,
  generateHostAgreementId,
  saveHostAgreement,
  getHostAgreement,
} from "@/lib/hostVettingPolicy";

interface HostOnboardingAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignedSuccess?: (record: HostAgreementRecord) => void;
}

export function HostOnboardingAgreementModal({
  open,
  onOpenChange,
  onSignedSuccess,
}: HostOnboardingAgreementModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"policy" | "sign" | "certificate">("policy");
  const [existingRecord, setExistingRecord] = useState<HostAgreementRecord | null>(null);

  // Form State
  const [hostName, setHostName] = useState("");
  const [hostPhone, setHostPhone] = useState("");
  const [nodeAddress, setNodeAddress] = useState("");
  const [campusNode, setCampusNode] = useState("Kakadeo Coaching Belt");

  // Checkboxes
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [policeClearanceAgreed, setPoliceClearanceAgreed] = useState(false);
  const [tpaSec105Accepted, setTpaSec105Accepted] = useState(false);
  const [houseRulesAccepted, setHouseRulesAccepted] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (open) {
      const rec = getHostAgreement();
      if (rec) {
        setExistingRecord(rec);
        setActiveTab("certificate");
      } else {
        setActiveTab("policy");
      }
    }
  }, [open]);

  const handleSignAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim() || !hostPhone.trim() || !nodeAddress.trim()) {
      setErrorMsg(
        isHi
          ? "कृपया अपना नाम, मोबाइल नंबर और पता दर्ज करें।"
          : "Please enter your name, phone number, and address."
      );
      return;
    }

    if (!aadhaarVerified || !policeClearanceAgreed || !tpaSec105Accepted || !houseRulesAccepted) {
      setErrorMsg(
        isHi
          ? "आगे बढ़ने के लिए सभी 4 अनिवार्य सुरक्षा शर्तों को स्वीकार करना आवश्यक है।"
          : "You must accept all 4 mandatory security clauses to proceed."
      );
      return;
    }

    setErrorMsg("");
    const newRecord: HostAgreementRecord = {
      agreementId: generateHostAgreementId(),
      hostName: hostName.trim(),
      hostPhone: hostPhone.trim(),
      nodeAddress: nodeAddress.trim(),
      campusNode,
      timestamp: new Date().toISOString(),
      aadhaarVerified: true,
      policeClearanceAgreed: true,
      tpaSec105Accepted: true,
      houseRulesAccepted: true,
    };

    saveHostAgreement(newRecord);
    setExistingRecord(newRecord);
    playPop();

    if (onSignedSuccess) {
      onSignedSuccess(newRecord);
    }

    setActiveTab("certificate");
  };

  const handleCopyId = () => {
    if (!existingRecord) return;
    navigator.clipboard.writeText(existingRecord.agreementId);
    setCopiedId(true);
    playPop();
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    playPop();
    window.print();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl border border-amber-500/30 bg-[#0A0D0F] p-5 sm:p-8 text-foreground shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] font-mono">
                    CEO & CSO DIRECTIVE v2.0-2026
                  </Badge>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {isHi ? OFFICIAL_HOST_VETTING_POLICY.titleHi : OFFICIAL_HOST_VETTING_POLICY.titleEn}
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

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-3 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab("policy");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "policy"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              📖 {isHi ? "1. नीति एवं सुरक्षा शर्तें" : "1. Security & Vetting Policy"}
            </button>

            <button
              type="button"
              onClick={() => {
                playPop();
                setActiveTab("sign");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "sign"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              ✍️ {isHi ? "2. ऑनबोर्डिंग व नीति समझौता" : "2. Sign Onboarding Agreement"}
            </button>

            {existingRecord && (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setActiveTab("certificate");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "certificate"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-emerald-400 hover:bg-white/10"
                }`}
              >
                🏆 {isHi ? "3. हस्ताक्षरित नीति प्रमाण पत्र" : "3. Signed Policy Certificate"}
              </button>
            )}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* TAB 1: POLICY BREAKDOWN */}
            {activeTab === "policy" && (
              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 leading-relaxed">
                  <p className="text-foreground/90 font-medium">
                    {isHi ? OFFICIAL_HOST_VETTING_POLICY.summaryHi : OFFICIAL_HOST_VETTING_POLICY.summaryEn}
                  </p>
                </div>

                {/* Legal Basis */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                  <h4 className="font-bold text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    {isHi ? "कानूनी आधार एवं सांविधिक संरक्षण" : "Statutory & Legal Framework"}
                  </h4>
                  <ul className="space-y-1.5 text-emerald-200/90 text-[11px]">
                    {(isHi ? OFFICIAL_HOST_VETTING_POLICY.legalBasisHi : OFFICIAL_HOST_VETTING_POLICY.legalBasisEn).map((lb, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{lb}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4 Tiers */}
                <div className="space-y-3">
                  <h4 className="font-bold text-amber-400 text-xs font-mono uppercase tracking-wider">
                    {isHi ? "अनिवार्य 4-स्तरीय होस्ट सत्यापन चरण" : "Mandatory 4-Tier Host Verification Protocol"}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {OFFICIAL_HOST_VETTING_POLICY.tiers.map((tier) => (
                      <div key={tier.tierNumber} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-xs">
                            {isHi ? tier.tierNameHi : tier.tierNameEn}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">T0{tier.tierNumber}</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-foreground/80">
                          {(isHi ? tier.mandatoryRequirementsHi : tier.mandatoryRequirementsEn).map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host Guarantees */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    {isHi ? "वरिष्ठ होस्ट सुरक्षा व वित्तीय गारंटी" : "Host Financial & Security Guarantees"}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 text-[11px] text-amber-200/90">
                    {(isHi ? OFFICIAL_HOST_VETTING_POLICY.hostGuaranteesHi : OFFICIAL_HOST_VETTING_POLICY.hostGuaranteesEn).map((g, gIdx) => (
                      <div key={gIdx} className="flex items-start gap-2 rounded-xl bg-black/40 p-2 border border-amber-500/20">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      setActiveTab("sign");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-black hover:bg-amber-400 transition-all shadow-lg cursor-pointer"
                  >
                    <span>{isHi ? "नीति स्वीकारें व ऑनबोर्डिंग फॉर्म भरें" : "Accept Policy & Proceed to Sign"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SIGN FORM */}
            {activeTab === "sign" && (
              <form onSubmit={handleSignAgreement} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-3 text-red-300 flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-mono text-[11px]">
                      {isHi ? "होस्ट का पूरा नाम *" : "Host Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isHi ? "उदा. श्रीमती सरिता शर्मा" : "e.g. Mrs. Sarita Sharma"}
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1 font-mono text-[11px]">
                      {isHi ? "मोबाइल नंबर (व्हाट्सएप/ओटीपी) *" : "Mobile Phone (WhatsApp/OTP) *"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98390XXXXX"
                      value={hostPhone}
                      onChange={(e) => setHostPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-mono text-[11px]">
                      {isHi ? "नोड पता (कानपुर) *" : "Host Node Address (Kanpur) *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isHi ? "उदा. 117/N/89 काकादेव, कानपुर" : "e.g. 117/N/89 Kakadeo, Kanpur"}
                      value={nodeAddress}
                      onChange={(e) => setNodeAddress(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1 font-mono text-[11px]">
                      {isHi ? "निकटतम कैंपस नोड *" : "Nearest Campus Node *"}
                    </label>
                    <select
                      value={campusNode}
                      onChange={(e) => setCampusNode(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Kakadeo Coaching Belt">Kakadeo Coaching Belt (PW/Motion/Allen)</option>
                      <option value="IIT Kanpur Gate 1">IIT Kanpur (Nankari / Gate 1)</option>
                      <option value="CSJMU Kalyanpur">CSJMU Kalyanpur Belt</option>
                      <option value="HBTI Nawabganj">HBTI Nawabganj Campus</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="rounded-2xl border border-amber-500/20 bg-black/50 p-4 space-y-3">
                  <h4 className="font-bold text-amber-400 text-xs font-mono uppercase tracking-wider">
                    {isHi ? "अनिवार्य कानूनी व सुरक्षा घोषणाएं (4 बिंदु)" : "Mandatory Security Declarations & Legal Assent"}
                  </h4>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-foreground/90">
                    <input
                      type="checkbox"
                      checked={aadhaarVerified}
                      onChange={(e) => setAadhaarVerified(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      {isHi
                        ? "1. आधार बायोमेट्रिक डिजिलॉकर e-KYC और लाइव कैमरा फेशियल सत्यापन सहमति देना।"
                        : "1. Consent to Aadhaar biometric DigiLocker e-KYC & live facial liveness verification."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-foreground/90">
                    <input
                      type="checkbox"
                      checked={policeClearanceAgreed}
                      onChange={(e) => setPoliceClearanceAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      {isHi
                        ? "2. स्थानीय कानपुर पुलिस स्टेशन चरित्र सत्यापन प्रमाणपत्र जमा करना तथा 0 एफआईआर घोषणा।"
                        : "2. Submission of Kanpur Police verification certificate & declaration of zero active FIR."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-foreground/90">
                    <input
                      type="checkbox"
                      checked={tpaSec105Accepted}
                      onChange={(e) => setTpaSec105Accepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      {isHi
                        ? "3. TPA धारा 105 (लीव एंड लाइसेंस) स्वीकारना — 100% संपत्ति मालिकाना हक सुरक्षा व शून्य किरायेदारी दावा अधिकार।"
                        : "3. Assent to TPA Sec 105 Leave & License model — 100% property title protection & zero leasehold claim risk."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-foreground/90">
                    <input
                      type="checkbox"
                      checked={houseRulesAccepted}
                      onChange={(e) => setHouseRulesAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      {isHi
                        ? "4. छात्र शांति नियम, 24/7 एसओएस सहायता, व स्टैशसारथी ₹10,000 क्षति कवर नीतियों का पालन।"
                        : "4. Agreement to quiet hours, 24/7 bedside SOS response, and StashSaarthi ₹10,000 damage cover terms."}
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-black hover:bg-amber-400 transition-all shadow-lg cursor-pointer"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>{isHi ? "आधिकारिक होस्ट नीति समझौता हस्ताक्षरित करें" : "Sign & Register Host Policy Agreement"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: CERTIFICATE */}
            {activeTab === "certificate" && existingRecord && (
              <div className="space-y-4 text-xs">
                <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-black to-black p-6 relative overflow-hidden text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <Badge className="bg-emerald-500 text-black font-extrabold text-[10px] mb-1">
                        ✓ VERIFIED SENIOR HOST CERTIFICATE
                      </Badge>
                      <h4 className="text-base sm:text-xl font-extrabold text-white">
                        {existingRecord.hostName}
                      </h4>
                      <p className="text-xs text-emerald-300 font-mono">
                        {existingRecord.nodeAddress} ({existingRecord.campusNode})
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/40 bg-black/80 px-4 py-2 text-center shrink-0">
                      <div className="text-[10px] font-mono text-muted-foreground">AGREEMENT ID</div>
                      <div className="text-xs font-bold font-mono text-amber-300">{existingRecord.agreementId}</div>
                    </div>
                  </div>

                  {/* Certificate Specs */}
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-[11px]">
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{isHi ? "बायोमेट्रिक e-KYC: डिजिलॉकर 100% पास" : "Biometric e-KYC: DigiLocker Verified"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{isHi ? "पुलिस क्लीयरेंस: 0 सक्रिय एफआईआर" : "Police Verification: 0 Active FIR"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{isHi ? "TPA Sec 105: लीव एंड लाइसेंस लागू" : "TPA Sec 105: Leave & License Active"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{isHi ? "सुरक्षा कवर: ₹10,000 सक्रिय" : "Damage Cover: ₹10,000 Active"}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-[10px] text-muted-foreground font-mono">
                    TIMESTAMP: {new Date(existingRecord.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                  >
                    {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "आईडी कॉपी करें" : "Copy Agreement ID")}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isHi ? "प्रमाणपत्र प्रिंट करें" : "Print Policy Certificate"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
                    >
                      <span>{isHi ? "संपन्न" : "Done"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
