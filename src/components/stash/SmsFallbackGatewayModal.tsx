import React, { useState, useEffect } from "react";
import {
  Signal,
  WifiOff,
  Send,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Lock,
  RefreshCw,
  QrCode,
} from "lucide-react";
import {
  generateEncryptedSmsOtpPayload,
  parseAndVerifySmsOtpPayload,
  getSmsFallbackLogs,
  SmsOtpPayload,
  SmsVerificationResult,
  SmsFallbackLog,
} from "../../lib/smsFallbackGatewayEngine";
import { useLanguage } from "../../context/LanguageContext";
import { OfflineQrCode } from "../ui/OfflineQrCode";

interface SmsFallbackGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const SmsFallbackGatewayModal: React.FC<SmsFallbackGatewayModalProps> = ({
  isOpen,
  onClose,
  defaultBookingId = "STASH-KNP-8942",
}) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"generator" | "verifier" | "logs">("generator");

  // Generator State
  const [bookingId, setBookingId] = useState(defaultBookingId);
  const [otp, setOtp] = useState("8492");
  const [runnerId, setRunnerId] = useState("RUNNER-KAKADEO-01");
  const [payload, setPayload] = useState<SmsOtpPayload | null>(null);
  const [copied, setCopied] = useState(false);

  // Verifier State
  const [rawSmsInput, setRawSmsInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<SmsVerificationResult | null>(null);

  // Logs State
  const [logs, setLogs] = useState<SmsFallbackLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
      setLogs(getSmsFallbackLogs());
    }
  }, [isOpen]);

  const handleGenerate = () => {
    const newPayload = generateEncryptedSmsOtpPayload(bookingId, otp, runnerId);
    setPayload(newPayload);
  };

  const handleCopyPayload = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload.formattedSmsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    const result = parseAndVerifySmsOtpPayload(rawSmsInput);
    setVerifyResult(result);
    setLogs(getSmsFallbackLogs());
  };

  const handlePresetFill = (presetText: string) => {
    setRawSmsInput(presetText);
    const result = parseAndVerifySmsOtpPayload(presetText);
    setVerifyResult(result);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0A0D0F] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/40 via-[#0D1117] to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <WifiOff className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">
                  {isHi ? "एन्क्रिप्टेड एसएमएस फ़ॉलबैक गेटवे" : "Encrypted SMS Fallback Gateway"}
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  OFFLINE 2G/NO-DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHi
                  ? "सेलुलर डेटा विफल होने पर रनर ओटीपी सत्यापन प्रोटोकॉल (टास्क 129)"
                  : "Encrypted SMS protocol for runner OTP verification during data outages (Task 129)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#06080A] px-6">
          <button
            onClick={() => setActiveTab("generator")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "generator"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {isHi ? "1. रनर एसएमएस जनरेटर" : "1. Runner SMS Generator"}
          </button>

          <button
            onClick={() => setActiveTab("verifier")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "verifier"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isHi ? "2. गेटवे सत्यापनकर्ता" : "2. Gateway Verifier"}
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "logs"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {isHi ? "3. सुरक्षा ऑडिट लॉग्स" : "3. Telemetry & Charter"}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* TAB 1: GENERATOR */}
          {activeTab === "generator" && (
            <div className="space-y-6">
              {/* Data Loss Warning Banner */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300 text-xs">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <div>
                  <strong className="block text-amber-200 font-semibold">
                    {isHi
                      ? "सेलुलर डेटा डिस्कनेक्टेड"
                      : "Cellular Data Disconnected (2G / No Network Zone)"}
                  </strong>
                  {isHi
                    ? "काकादेव या कानपुर कैंपस बेसमेंट में सर्वर डिस्कनेक्ट होने पर यह एन्क्रिप्टेड एसएमएस भेजिऐ।"
                    : "Use this encrypted SMS payload to verify OTP with operator gateway when internet fails."}
                </div>
              </div>

              {/* Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">BOOKING ID</label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    VERIFICATION OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    RUNNER AGENT ID
                  </label>
                  <input
                    type="text"
                    value={runnerId}
                    onChange={(e) => setRunnerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                {isHi ? "एन्क्रिप्टेड एसएमएस पेलोड जनरेट करें" : "Generate Encrypted SMS Payload"}
              </button>

              {/* Payload Result Card */}
              {payload && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-300 font-bold">
                        HMAC-SHA256 ENCRYPTED PAYLOAD
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      GATEWAY: +91 9369454350
                    </span>
                  </div>

                  <div className="bg-black/60 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all leading-relaxed">
                    {payload.formattedSmsText}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <a
                      href={payload.smsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 bg-emerald-500 text-black hover:bg-emerald-400 font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Smartphone className="w-4 h-4" />
                      {isHi
                        ? "📱 एसएमएस ऐप में खोलें (smsto:)"
                        : "📱 Open SMS App (Send to +91 9369454350)"}
                    </a>

                    <button
                      onClick={handleCopyPayload}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                      {copied
                        ? isHi
                          ? "कॉपी किया गया!"
                          : "Copied Payload!"
                        : isHi
                          ? "पेलोड कॉपी करें"
                          : "Copy SMS Payload"}
                    </button>
                  </div>

                  {/* QR Backup Code */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                        <OfflineQrCode value={payload.formattedSmsText} size={56} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Offline Optical Pass
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Runner can also present this QR to Host scanner
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                      SIG: {payload.signature}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERIFIER */}
          {activeTab === "verifier" && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  {isHi
                    ? "प्राप्त एन्क्रिप्टेड एसएमएस पेलोड यहाँ पेस्ट करें:"
                    : "Paste Received Encrypted SMS Payload Here:"}
                </label>
                <textarea
                  rows={3}
                  value={rawSmsInput}
                  onChange={(e) => setRawSmsInput(e.target.value)}
                  placeholder="STASH-SMS-OTP|STASH-KNP-8942|8492|RUNNER-KAKADEO-01|1773289000000|..."
                  className="w-full bg-black/80 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Sample Presets:</span>
                    <button
                      onClick={() =>
                        handlePresetFill(
                          payload?.formattedSmsText ||
                            "STASH-SMS-OTP|STASH-KNP-9821|8492|RUNNER-KAKADEO-01|" +
                              Date.now() +
                              "|A84B-99C1",
                        )
                      }
                      className="text-[10px] font-mono text-cyan-400 underline hover:text-cyan-300"
                    >
                      Valid Active Sample
                    </button>
                    <button
                      onClick={() =>
                        handlePresetFill(
                          "STASH-SMS-OTP|STASH-KNP-9821|8492|RUNNER-TAMPERED|1770000000000|INVALID-SIG",
                        )
                      }
                      className="text-[10px] font-mono text-rose-400 underline hover:text-rose-300"
                    >
                      Tampered Sample
                    </button>
                  </div>

                  <button
                    onClick={handleVerify}
                    className="py-2 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isHi ? "एसएमएस सत्यापित करें" : "Verify SMS OTP"}
                  </button>
                </div>
              </div>

              {/* Verification Result Card */}
              {verifyResult && (
                <div
                  className={`p-5 rounded-xl border ${
                    verifyResult.success
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/20 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {verifyResult.success ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm">
                        {verifyResult.success
                          ? "OTP Verification Successful"
                          : "Verification Failed"}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">{verifyResult.message}</p>
                    </div>
                  </div>

                  {verifyResult.success && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">BOOKING</span>
                        <span className="text-white font-bold">{verifyResult.bookingId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">VERIFIED OTP</span>
                        <span className="text-emerald-400 font-bold">{verifyResult.otp}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">RUNNER ID</span>
                        <span className="text-cyan-300 font-bold">{verifyResult.runnerId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CLEARANCE CODE</span>
                        <span className="text-amber-300 font-bold">
                          {verifyResult.verificationCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOGS & CHARTER */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Signal className="w-4 h-4 text-emerald-400" />
                  SMS Gateway Audit Logs
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {logs.length} Recorded Logs
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{log.bookingId}</span>
                        <span className="text-slate-400">by {log.runnerId}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "VERIFIED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CSO Charter */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  CTO SMS Gateway Architecture Directives
                </h5>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>
                    HMAC-SHA256 salted signature prevents payload alteration or replay attacks.
                  </li>
                  <li>30-minute timestamp window prevents stale OTP reuse across campus nodes.</li>
                  <li>
                    Deep-linked <code className="text-emerald-300 font-mono">smsto:</code> format
                    enables single-tap dispatch without cellular data connection.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#06080A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>StashSaarthi Zero-Data Offline Verification System</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
