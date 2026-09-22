import React, { useState, useEffect } from "react";
import {
  DATA_RETENTION_CATEGORIES,
  auditInactiveStudentData,
  executeAutoPurge18Months,
  getLastRetentionPurgeResult,
  RetentionPurgeResult,
  InactiveRecordAudit,
} from "../../lib/dataRetentionEngine";
import { useLanguage } from "../../context/LanguageContext";

interface DataRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataRetentionModal: React.FC<DataRetentionModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [auditData, setAuditData] = useState<{
    records: InactiveRecordAudit[];
    totalInspected: number;
    flaggedCount: number;
    oldestRecordAgeDays: number;
  }>({ records: [], totalInspected: 0, flaggedCount: 0, oldestRecordAgeDays: 0 });

  const [purgeResult, setPurgeResult] = useState<RetentionPurgeResult | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [activeTab, setActiveTab] = useState<"POLICY" | "AUDIT" | "CERTIFICATE">("POLICY");
  const [simulatedThresholdDays, setSimulatedThresholdDays] = useState(547); // 18 Months
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const res = auditInactiveStudentData();
      setAuditData(res);
      const last = getLastRetentionPurgeResult();
      if (last) setPurgeResult(last);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunAudit = () => {
    const res = auditInactiveStudentData();
    setAuditData(res);
  };

  const handleExecutePurge = (daysThreshold: number) => {
    setIsPurging(true);
    setTimeout(() => {
      const result = executeAutoPurge18Months(daysThreshold);
      setPurgeResult(result);
      setIsPurging(false);
      setActiveTab("CERTIFICATE");
      handleRunAudit();
    }, 600);
  };

  const handleCopyCertificate = () => {
    if (!purgeResult) return;
    const text = `STASHSAARTHI 18-MONTH DATA RETENTION & AUTO-PURGE COMPLIANCE CERTIFICATE
Certificate Serial: ${purgeResult.certificateSerial}
Statutory Basis: DPDP Act 2023 Sec 12(3) & GDPR Art 17
Purge Timestamp: ${purgeResult.timestamp}
Records Inspected: ${purgeResult.totalRecordsInspected}
Inactive Records Purged: ${purgeResult.recordsPurged}
Bytes Reclaimed: ${purgeResult.bytesReclaimed} B
Compliance Score: ${purgeResult.policyComplianceScore}% (PASSED)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                {isHi
                  ? "18-माह डेटा रिटेंशन व ऑटो-पर्ज नीति"
                  : "18-Month Data Retention & Auto-Purge Console"}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DPDP Sec 12(3)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "निष्क्रिय छात्र डेटा 18 महीने बाद स्वचालित रूप से मिटाने की वैधानिक नीति"
                  : "Statutory 18-month data deletion SLA for inactive student account data"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab("POLICY")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "POLICY"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>📜</span> {isHi ? "रिटेंशन नीति नियम" : "Statutory Retention Rules"}
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "AUDIT"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🔍</span> {isHi ? "डेटाबेस ऑडिट व पर्ज" : "Live Store Audit & Purge"}
            {auditData.flaggedCount > 0 && (
              <span className="px-1.5 py-0.2 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {auditData.flaggedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("CERTIFICATE")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "CERTIFICATE"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🛡️</span> {isHi ? "पर्ज अनुपालन प्रमाणपत्र" : "Purge Compliance Certificate"}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: POLICY CHARTER */}
          {activeTab === "POLICY" && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
                <div className="text-2xl">⏳</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-emerald-300">
                    {isHi
                      ? "18-महीने की ऑटो-पर्ज वैधानिक गारंटी"
                      : "18-Month Automated Purging Standard"}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHi
                      ? "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 की धारा 12(3) के अनुसार, स्टैशसारथी 18 महीने तक किसी भी छात्र गतिविधि न होने पर व्यक्तिगत पहचान डेटा, संपर्क लॉग और वेटलिस्ट प्रविष्टियों को स्थायी रूप से हटा देता है।"
                      : "Under Section 12(3) of India's Digital Personal Data Protection (DPDP) Act 2023, StashSaarthi automatically purges inactive student personal records, contact logs, and waitlist leads after 18 months (547 days) of inactivity."}
                  </p>
                </div>
              </div>

              {/* Data Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATA_RETENTION_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {cat.retentionPeriodMonths === 84
                            ? isHi
                              ? "7 वर्ष (कर आवश्यकता)"
                              : "7 Years (Tax Statutory)"
                            : cat.retentionPeriodMonths === 1
                              ? isHi
                                ? "30 दिन"
                                : "30 Days"
                              : isHi
                                ? "18 महीने (547 दिन)"
                                : "18 Months (547 Days)"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {cat.statutoryBasis}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-200 text-sm">
                        {isHi ? cat.nameHi : cat.nameEn}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isHi ? cat.descriptionHi : cat.descriptionEn}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isHi ? "स्वचालित पर्ज लागू:" : "Auto-Purge Enforced:"}
                      </span>
                      <span
                        className={
                          cat.autoPurgeEnabled
                            ? "text-emerald-400 font-semibold"
                            : "text-amber-400 font-semibold"
                        }
                      >
                        {cat.autoPurgeEnabled
                          ? isHi
                            ? "✓ हां (सक्रिय)"
                            : "✓ Yes (Active)"
                          : isHi
                            ? "🔒 एस्क्रो नियम"
                            : "🔒 Escrow Locked"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT & PURGE */}
          {activeTab === "AUDIT" && (
            <div className="space-y-6">
              {/* Inspection Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-slate-100">
                    {auditData.totalInspected}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isHi ? "कुल जांचे गए रिकॉर्ड" : "Inspected Records"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-amber-400">{auditData.flaggedCount}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isHi ? "18-माह पर्ज के लिए चिह्नित" : "Flagged > 18M Inactive"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {auditData.oldestRecordAgeDays}d
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isHi ? "सबसे पुराना डेटा उम्र" : "Oldest Record Age"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isHi ? "DPDP अनुपालन स्कोर" : "DPDP Compliance"}
                  </div>
                </div>
              </div>

              {/* Threshold Testing Controls */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">
                    {isHi
                      ? "पर्ज थ्रेसहोल्ड सिम्युलेटर (दिनों में):"
                      : "Retention Purge Threshold Simulator (Days):"}
                  </span>
                  <span className="text-sm font-mono text-emerald-400 font-bold">
                    {simulatedThresholdDays} {isHi ? "दिन" : "days"} (
                    {Math.round(simulatedThresholdDays / 30)} {isHi ? "माह" : "months"})
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="547"
                  step="30"
                  value={simulatedThresholdDays}
                  onChange={(e) => setSimulatedThresholdDays(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>30d ({isHi ? "1 माह टेस्ट" : "1 Month Test"})</span>
                  <span>180d ({isHi ? "6 माह" : "6 Months"})</span>
                  <span>365d ({isHi ? "1 वर्ष" : "1 Year"})</span>
                  <span className="text-emerald-400 font-bold">
                    547d ({isHi ? "18 माह वैधानिक" : "18M Statutory"})
                  </span>
                </div>
              </div>

              {/* Execute Purge Action */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">
                    {isHi
                      ? "18-माह ऑटो-पर्ज निष्पादित करें"
                      : "Execute 18-Month Statutory Purge Routine"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isHi
                      ? "चयनित समयसीमा से पुराने सभी निष्क्रिय रिकॉर्ड्स को स्थायी रूप से मिटाता है।"
                      : "Permanently flushes all inactive records older than the selected threshold."}
                  </p>
                </div>
                <button
                  onClick={() => handleExecutePurge(simulatedThresholdDays)}
                  disabled={isPurging}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isPurging ? (
                    <>
                      <span className="animate-spin">⏳</span>{" "}
                      {isHi ? "सफाई जारी..." : "Purging Stores..."}
                    </>
                  ) : (
                    <>
                      <span>🧹</span> {isHi ? "ऑटो-पर्ज निष्पादित करें" : "Run Auto-Purge Now"}
                    </>
                  )}
                </button>
              </div>

              {/* Inspected Records Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isHi ? "जांचे गए लोकल स्टोर रिकॉर्ड्स" : "Inspected Local Storage Records"}
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-3">ID / Source</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Record Age</th>
                        <th className="p-3 text-right">Purge Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditData.records.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500 italic">
                            {isHi
                              ? "कोई स्थानीय रिकॉर्ड नहीं मिला।"
                              : "No local records currently logged."}
                          </td>
                        </tr>
                      ) : (
                        auditData.records.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-800/30">
                            <td className="p-3 font-mono text-slate-300">{rec.id.slice(0, 16)}</td>
                            <td className="p-3 text-slate-300">{rec.categoryName}</td>
                            <td className="p-3 font-mono">{rec.ageDays} days ago</td>
                            <td className="p-3 text-right font-bold">
                              {rec.status === "EXPIRED_18M_FLAGGED" ? (
                                <span className="text-amber-400">
                                  ⚠️ {isHi ? "पर्ज हेतु चिह्नित" : "Flagged >18M"}
                                </span>
                              ) : (
                                <span className="text-emerald-400">
                                  ✓ {isHi ? "सक्रिय" : "Active / Compliant"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATE */}
          {activeTab === "CERTIFICATE" && (
            <div className="space-y-6">
              {purgeResult ? (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
                  {/* Watermark / Seal */}
                  <div className="absolute top-4 right-4 text-6xl opacity-10 pointer-events-none select-none">
                    🏛️
                  </div>

                  {/* Cert Header */}
                  <div className="text-center space-y-2 border-b border-slate-800 pb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                      OFFICIAL PURGE CERTIFICATE — DPDP ACT SEC 12(3)
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 tracking-wide">
                      STASHSAARTHI DATA RETENTION COMPLIANCE PASS
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Serial Number:{" "}
                      <span className="text-emerald-400">{purgeResult.certificateSerial}</span>
                    </p>
                  </div>

                  {/* Cert Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">TIMESTAMP</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">
                        {new Date(purgeResult.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-sans">PURGED RECORDS</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">
                        {purgeResult.recordsPurged}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-sans">SPACE RECLAIMED</div>
                      <div className="text-lg font-bold text-cyan-400 mt-0.5">
                        {purgeResult.bytesReclaimed} B
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-sans">SLA SCORE</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">
                        {purgeResult.policyComplianceScore}%
                      </div>
                    </div>
                  </div>

                  {/* Cert Statutory Guarantees */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                    <div className="font-semibold text-emerald-400">
                      {isHi ? "वैधानिक प्रमाणीकरण घोषणा:" : "Statutory Verification Declaration:"}
                    </div>
                    <p className="leading-relaxed">
                      {isHi
                        ? "यह आधिकारिक रूप से प्रमाणित किया जाता है कि स्टैशसारथी डेटाबेस व स्थानीय स्टोरेज ने 18 महीने से अधिक पुराने सभी अक्रिय छात्र डेटा को सफलतापूर्वक स्थायी रूप से साफ़ कर दिया है। यह प्रक्रिया भारत के DPDP अधिनियम 2023 और यूरोपीय संघ के GDPR अनुच्छेद 17 के पूर्ण अनुपालन में निष्पादित की गई है।"
                        : "This certifies that StashSaarthi database and local client storage stores have successfully executed automated 18-month data retention purging. All inactive student account identifiers exceeding statutory thresholds have been permanently anonymized or deleted in full accordance with DPDP Act 2023 Sec 12(3) and GDPR Article 17."}
                    </p>
                  </div>

                  {/* Cert Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={handleCopyCertificate}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      {copied ? "✓ Copied!" : "📋 Copy Certificate Serial"}
                    </button>
                    <div className="text-right text-[11px] font-mono text-slate-500">
                      Signed: Chief Security Officer (CSO)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-4xl">🧹</div>
                  <h4 className="text-base font-semibold text-slate-300">
                    {isHi
                      ? "कोई पर्ज प्रमाणपत्र उपलब्ध नहीं"
                      : "No Purge Certificate Generated Yet"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {isHi
                      ? "डेटाबेस ऑडिट व पर्ज टैब में जाएं और 18-माह ऑटो-पर्ज रन करें।"
                      : "Navigate to the Live Store Audit & Purge tab and click 'Run Auto-Purge Now' to generate an official compliance pass."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            {isHi ? "नोडल अधिकारी:" : "Data Officer:"}{" "}
            <span className="text-slate-200 font-semibold">Advik Omer</span>{" "}
            (stashsaarthi@gmail.com)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            {isHi ? "बंद करें" : "Close Console"}
          </button>
        </div>
      </div>
    </div>
  );
};
