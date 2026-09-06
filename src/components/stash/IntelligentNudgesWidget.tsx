import React, { useState, useEffect } from "react";
import {
  StudentNudgeRecord,
  NudgeBatchSummary,
  runAutomatedNudgeBatchScan,
  getWhatsAppNudgeUrlForStudent,
  claimActiveNudgeToken,
  getActiveClaimedNudgeToken,
  getDaysSinceLastOrder,
  fetchSupabaseInactiveStudents,
  generateNudgeTokenCode,
} from "@/lib/intelligentNudges";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { playPop, playClick } from "@/lib/audio";
import {
  Sparkles,
  Gift,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Users,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface IntelligentNudgesWidgetProps {
  onTokenClaimed?: (code: string) => void;
}

export const IntelligentNudgesWidget: React.FC<IntelligentNudgesWidgetProps> = ({
  onTokenClaimed,
}) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [daysInactive, setDaysInactive] = useState<number>(4);
  const [claimedToken, setClaimedToken] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentNudgeRecord[]>([]);
  const [batchSummary, setBatchSummary] = useState<NudgeBatchSummary>({
    totalAnalyzed: 148,
    inactiveCandidates: 5,
    nudgesDispatched: 2,
    freeDeliveryTokensIssued: 5,
    projectedReengagementRate: 38.2,
  });

  useEffect(() => {
    // Check days inactive
    const days = getDaysSinceLastOrder();
    setDaysInactive(days);

    // Check existing claimed token
    const activeToken = getActiveClaimedNudgeToken();
    if (activeToken) {
      setClaimedToken(activeToken.code);
    }

    // Load initial student records
    fetchSupabaseInactiveStudents().then((res) => {
      setStudents(res);
    });
  }, []);

  const handleClaimToken = () => {
    playPop();
    const tokenCode = "FREE-DELIV-3D";
    claimActiveNudgeToken(tokenCode);
    setClaimedToken(tokenCode);
    if (onTokenClaimed) {
      onTokenClaimed(tokenCode);
    }
    toast.success(
      isHi
        ? "🎉 1-डे फ्री डिलीवरी टोकन सक्रिय हो गया! Delivery शुल्क ₹0 रहेगा."
        : "🎉 1-Day Free Delivery Token Activated! ₹0 Delivery Fee applied."
    );
  };

  const handleRunBatchScan = () => {
    playClick();
    setIsScanning(true);

    setTimeout(() => {
      const { summary, students: updatedStudents } = runAutomatedNudgeBatchScan();
      setBatchSummary(summary);
      setStudents(updatedStudents);
      setIsScanning(false);
      playPop();
      toast.success(
        isHi
          ? `✅ Backend Scan Complete: ${summary.nudgesDispatched} WhatsApp Re-engagement Nudges Sent!`
          : `✅ Backend Scan Complete: ${summary.nudgesDispatched} WhatsApp Re-engagement Nudges Dispatched!`
      );
    }, 1200);
  };

  const handleSingleDispatch = (student: StudentNudgeRecord) => {
    playClick();
    // Update local record
    const updated = students.map((s) => {
      if (s.id === student.id) {
        return {
          ...s,
          nudgeSent: true,
          lastNudgeDate: new Date().toISOString(),
          tokenCode: s.tokenCode || generateNudgeTokenCode(s.phone),
        };
      }
      return s;
    });
    setStudents(updated);

    // Open WhatsApp URL
    const url = getWhatsAppNudgeUrlForStudent(student);
    window.open(url, "_blank", "noopener,noreferrer");

    toast.info(
      isHi
        ? `📲 ${student.name} के लिए WhatsApp Re-engagement Nudge तैयार है.`
        : `📲 WhatsApp Re-engagement Nudge opened for ${student.name}.`
    );
  };

  return (
    <div className="w-full my-6 font-sans">
      {/* 1. Student-Facing Inactivity Banner */}
      {daysInactive >= 3 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/20 backdrop-blur-md">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Gift className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isHi ? `${daysInactive} दिनों से ऑर्डर नहीं किया` : `Inactive for ${daysInactive} days`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isHi ? "री-एंगेजमेंट ऑफर" : "Re-engagement Special"}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
                  {isHi
                    ? "🍲 घर का खाना मिस कर रहे हैं? आपके लिए 1-डे फ्री डिलीवरी टोकन अनलॉक्ड!"
                    : "🍲 Miss Homemade Meals? 1-Day Free Delivery Token Unlocked!"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {isHi
                    ? "3 दिन या उससे अधिक समय से ऑर्डर न करने वाले छात्रों के लिए स्टैशसारथी की विशेष सौगात."
                    : "Exclusive StashSaarthi reward for students ordering after 3+ days gap. Saved ₹10 delivery fee!"}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {claimedToken ? (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isHi ? `टोकन सक्रिय: ${claimedToken}` : `Active: ${claimedToken}`} (₹0 Delivery)
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleClaimToken}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{isHi ? "फ्री डिलीवरी क्लेम करें (₹0)" : "Claim Free Delivery (₹0)"}</span>
                </button>
              )}

              <button
                onClick={() => setShowConsole(!showConsole)}
                className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                title="Toggle CAO Nudge Console"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isHi ? "नज कंसोल" : "Nudge Console"}</span>
                {showConsole ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin / CAO Intelligent Nudge Control Console */}
      {showConsole && (
        <div className="mt-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    {isHi
                      ? "इंटेलीजेंट री-एंगेजमेंट व्हाट्सएप नज सिस्टम (CAO Engine)"
                      : "Intelligent Re-engagement WhatsApp Nudge Console"}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Automated
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHi
                    ? "3 दिन से अधिक निष्क्रिय छात्रों को स्वचलित WhatsApp संदेश और 1-डे फ्री डिलीवरी कूपन भेजें."
                    : "Trigger personalized WhatsApp messages & 1-day free delivery codes for students inactive >= 3 days."}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunBatchScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>
                {isScanning
                  ? isHi
                    ? "स्कैन जारी है..."
                    : "Scanning Database..."
                  : isHi
                  ? "स्वचालित क्रोन बैच रन करें"
                  : "Run Auto Cron Batch Scan"}
              </span>
            </button>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>{isHi ? "कुल विश्लेषित" : "Analyzed Students"}</span>
              </div>
              <div className="text-xl font-bold text-slate-100 mt-1">{batchSummary.totalAnalyzed}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Campus Order History</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
              <div className="text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{isHi ? "निष्क्रिय छात्र (3+ दिन)" : "Inactive Candidates"}</span>
              </div>
              <div className="text-xl font-bold text-amber-300 mt-1">{students.length}</div>
              <div className="text-[10px] text-amber-400/70 mt-0.5">Requires Nudge</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Send className="w-3 h-3" />
                <span>{isHi ? "भेजे गए WhatsApp नजेस" : "Dispatched Nudges"}</span>
              </div>
              <div className="text-xl font-bold text-emerald-300 mt-1">{batchSummary.nudgesDispatched}</div>
              <div className="text-[10px] text-emerald-400/70 mt-0.5">1-Day Tokens Attached</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{isHi ? "अनुमानित री-एंगेजमेंट" : "Re-engagement Rate"}</span>
              </div>
              <div className="text-xl font-bold text-cyan-300 mt-1">{batchSummary.projectedReengagementRate}%</div>
              <div className="text-[10px] text-cyan-400/70 mt-0.5">Conversion Uplift</div>
            </div>
          </div>

          {/* Candidate Student List */}
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>{isHi ? "निष्क्रिय छात्र सूची (3+ दिन)" : "Inactive Student Queue (3+ Days Inactive)"}</span>
              <span className="text-slate-500 font-normal text-[11px]">Auto-Refreshed Realtime</span>
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                      {student.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-200">{student.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {isHi ? `${student.daysInactive} दिन से निष्क्रिय` : `${student.daysInactive}d Inactive`}
                        </span>
                        <span className="text-xs text-slate-500">{student.hostelCampus}</span>
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5">
                        {isHi ? "अंतिम मील:" : "Last Ordered:"}{" "}
                        <span className="text-slate-300 font-medium">{student.lastMealName}</span> •{" "}
                        <span className="text-emerald-400">{student.favoriteKitchenNode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {student.nudgeSent ? (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isHi ? "नज भेजा गया" : "Nudge Sent"}</span>
                        {student.tokenCode && (
                          <span className="text-[10px] font-mono text-emerald-300/80">({student.tokenCode.slice(-8)})</span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSingleDispatch(student)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all transform active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isHi ? "WhatsApp नज भेजें" : "Dispatch WhatsApp Nudge"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
