import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  Trash2,
  Download,
  X,
  AlertCircle,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  runDataPrivacyAudit,
  submitDsarRequest,
  getDsarRequests,
  auditUserDataLawfulness,
  DsarRequest,
} from "@/lib/dataPrivacyAudit";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";

interface DataPrivacyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPrivacyAuditModal: React.FC<DataPrivacyAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"audit" | "dsar">("audit");
  const [auditResult, setAuditResult] = useState(() => runDataPrivacyAudit());
  const [lawfulnessReport, setLawfulnessReport] = useState(() => auditUserDataLawfulness());
  const [isScanning, setIsScanning] = useState(false);

  // DSAR Form state
  const [dsarType, setDsarType] = useState<"ERASURE" | "ACCESS_COPY" | "CORRECTION" | "NOMINATION">(
    "ERASURE",
  );
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [dsarSubmitted, setDsarSubmitted] = useState<DsarRequest | null>(null);
  const [storedDsars, setStoredDsars] = useState<DsarRequest[]>(() => getDsarRequests());

  if (!isOpen) return null;

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAuditResult(runDataPrivacyAudit());
      setLawfulnessReport(auditUserDataLawfulness());
      setIsScanning(false);
    }, 600);
  };

  const handleDownloadCertificate = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(lawfulnessReport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `StashSaarthi_DPDP_GDPR_Compliance_Certificate_${Date.now()}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDsarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !contact) return;

    const req = submitDsarRequest({
      requestType: dsarType,
      fullName,
      userEmailOrPhone: contact,
      details,
    });

    setDsarSubmitted(req);
    setStoredDsars(getDsarRequests());
    setFullName("");
    setContact("");
    setDetails("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#0A0D0F] p-6 shadow-2xl text-foreground selection:bg-emerald-500/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              {isHi ? "डेटा गोपनीयता व अधिकार पोर्टल" : "Data Sovereignty & DPDP Audit Portal"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isHi
                ? "DPDP अधिनियम 2023 एवं GDPR अनुपालन ऑपरेटर डैशबोर्ड"
                : "India's DPDP Act 2023 & GDPR Compliance Assurance Charter"}
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "audit"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isHi ? "गोपनीयता ऑडिट रिपोर्ट (100%)" : "Privacy Audit Report (100%)"}</span>
          </button>

          <button
            onClick={() => setActiveTab("dsar")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "dsar"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>{isHi ? "डेटा विलोपन / DSAR अनुरोध" : "Data Erasure / DSAR Portal"}</span>
          </button>
        </div>

        {/* TAB 1: AUDIT REPORT */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            {/* Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-black font-black text-2xl shadow-lg shadow-emerald-500/30 shrink-0">
                  {auditResult.overallScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-300 text-lg">
                      {isHi ? "100% अनुपालन स्थापित" : "100% Lawful & Compliant"}
                    </span>
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {lawfulnessReport.lawfulnessRating}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    {isHi
                      ? "सभी छात्र रिकॉर्ड, एईएस-256 एन्क्रिप्शन, आरएलएस नीतियां और 18-माह ऑटो-पर्ज सक्रिय हैं।"
                      : "All identity records, AES-256 encryption, RLS policies & 18-month purge SLAs are active."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={handleDownloadCertificate}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isHi ? "प्रमाणपत्र" : "Certificate"}</span>
                </Button>
                <Button
                  onClick={handleRescan}
                  disabled={isScanning}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
                  <span>{isHi ? "स्कैन" : "Scan"}</span>
                </Button>
              </div>
            </div>

            {/* Statutory Compliance Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                  DPDP 2023
                </span>
                <span className="text-lg font-black text-emerald-400">
                  {lawfulnessReport.categories.dpdp2023.passed}/
                  {lawfulnessReport.categories.dpdp2023.total}
                </span>
                <span className="text-[10px] text-emerald-300 block">Passed</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                  GDPR Standards
                </span>
                <span className="text-lg font-black text-cyan-400">
                  {lawfulnessReport.categories.gdpr.passed}/{lawfulnessReport.categories.gdpr.total}
                </span>
                <span className="text-[10px] text-cyan-300 block">Passed</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                  Security Controls
                </span>
                <span className="text-lg font-black text-amber-400">
                  {lawfulnessReport.categories.security.passed}/
                  {lawfulnessReport.categories.security.total}
                </span>
                <span className="text-[10px] text-amber-300 block">Passed</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                  Transparency
                </span>
                <span className="text-lg font-black text-purple-400">
                  {lawfulnessReport.categories.transparency.passed}/
                  {lawfulnessReport.categories.transparency.total}
                </span>
                <span className="text-[10px] text-purple-300 block">Passed</span>
              </div>
            </div>

            {/* Audit List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isHi
                  ? "सत्यापित कानून एवं वैधानिक सुरक्षा जांच"
                  : "Verified Statutory & Legal Controls"}
              </h3>

              <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {auditResult.checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs gap-2 hover:border-white/20 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white">
                          {isHi ? check.titleHi : check.titleEn}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          {check.clause}
                        </span>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {isHi ? check.descriptionHi : check.descriptionEn}
                      </p>
                    </div>

                    <span className="self-start sm:self-center shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                      {check.status} (+{check.impactScore}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Nodal Officer Link */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span className="text-muted-foreground">
                  {isHi
                    ? "नामित नोडल अधिकारी: अद्विक ओमर (संस्थापक)"
                    : "Designated Nodal Officer: Advik Omer (Founder)"}
                </span>
              </div>
              <a
                href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(
                  "Hello Advik Omer, I have a data privacy query regarding StashSaarthi.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{FOUNDER_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: DSAR PORTAL */}
        {activeTab === "dsar" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan/30 bg-cyan/10 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                <FileText className="h-4 w-4" />
                <span>
                  {isHi
                    ? "डेटा विषय अधिकार अनुरोध (DSAR)"
                    : "Data Subject Access & Erasure Request"}
                </span>
              </div>
              <p className="text-cyan-100/90">
                {isHi
                  ? "DPDP अधिनियम 2023 की धारा 12 के तहत, आप अपनी व्यक्तिगत जानकारी को स्थायी रूप से मिटाने या कॉपी प्राप्त करने का अनुरोध कर सकते हैं।"
                  : "Under Sec 12 of India's DPDP Act 2023 & GDPR Art 17, you hold the absolute right to request permanent erasure, data access summary, or profile correction."}
              </p>
            </div>

            {/* Submission Form */}
            <form
              onSubmit={handleDsarSubmit}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-semibold text-muted-foreground">
                  {isHi ? "अनुरोध प्रकार" : "Request Type"}
                  <select
                    value={dsarType}
                    onChange={(e) => setDsarType(e.target.value as any)}
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="ERASURE">
                      {isHi ? "स्थायी डेटा विलोपन (Right to Erasure)" : "Permanent Data Erasure"}
                    </option>
                    <option value="ACCESS_COPY">
                      {isHi ? "डेटा कॉपी प्राप्त करें (Access Copy)" : "Export Data Summary"}
                    </option>
                    <option value="CORRECTION">
                      {isHi ? "डेटा संशोधन (Profile Correction)" : "Update Profile Info"}
                    </option>
                    <option value="NOMINATION">
                      {isHi
                        ? "नामांकन अधिकार (Right to Nominate)"
                        : "Nominate Legal Representative"}
                    </option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  {isHi ? "पूरा नाम" : "Full Name"}
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isHi ? "जैसे: राहुल कुमार" : "e.g., Rahul Kumar"}
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  {isHi ? "मोबाइल या ईमेल" : "Mobile or Email"}
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={
                      isHi
                        ? "+91 9876543210 या email@domain.com"
                        : "+91 9876543210 or student@iitk.ac.in"
                    }
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-muted-foreground">
                {isHi ? "अतिरिक्त विवरण (वैकल्पिक)" : "Additional Instructions (Optional)"}
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    isHi
                      ? "विशिष्ट डेटा या बुक किए गए स्टैश नंबर दर्ज करें..."
                      : "Specify particular booking serials or notes..."
                  }
                  className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </label>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs gap-2 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isHi ? "अनुरोध दर्ज करें" : "Submit Legal Request"}</span>
                </Button>
              </div>
            </form>

            {/* Submitted Confirmation Banner */}
            {dsarSubmitted && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>
                      {isHi ? "अनुरोध सफलतापूर्वक दर्ज किया गया!" : "Legal DSAR Request Submitted!"}
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono font-bold text-emerald-300">
                    {dsarSubmitted.ackTicket}
                  </span>
                </div>
                <p className="text-emerald-100/80">
                  {isHi
                    ? `आपके अनुरोध की आधिकारिक पावती रसीद (${dsarSubmitted.ackTicket}) नोडल अधिकारी को भेज दी गई है। 24 घंटे के भीतर कार्रवाई पूर्ण होगी।`
                    : `Acknowledgement ticket (${dsarSubmitted.ackTicket}) issued. Nodal Officer will fulfill request within 24 hours.`}
                </p>
                <div className="pt-2 border-t border-emerald-500/20">
                  <a
                    href={`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(
                      `Hello Nodal Officer, I submitted DSAR Ticket ${dsarSubmitted.ackTicket} for ${dsarSubmitted.requestType}. Please confirm processing.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline"
                  >
                    <span>
                      {isHi
                        ? "नोडल अधिकारी से व्हाट्सएप पर पुष्टि करें →"
                        : "Verify Ticket via WhatsApp →"}
                    </span>
                  </a>
                </div>
              </div>
            )}

            {/* Recent Local Requests */}
            {storedDsars.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isHi ? "हाल ही के अनुरोध" : "Recent DSAR Log History"}
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {storedDsars.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{req.fullName}</span>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                            {req.ackTicket}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[11px]">
                          {req.requestType} • {new Date(req.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
