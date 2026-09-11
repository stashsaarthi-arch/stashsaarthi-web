import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  X,
  Crown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { playPop } from "@/lib/audio";
import {
  HostEvaluationResult,
  HostMetrics,
  evaluateHostTier,
} from "@/lib/superHostRatingEngine";

interface SuperHostBadgeProps {
  metrics: HostMetrics;
  showDetailsOnClick?: boolean;
  className?: string;
}

export function SuperHostBadge({
  metrics,
  showDetailsOnClick = true,
  className = "",
}: SuperHostBadgeProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [detailsOpen, setDetailsOpen] = useState(false);
  const evaluation: HostEvaluationResult = evaluateHostTier(metrics);

  const isSuperHost = evaluation.superHostBadgeGranted;
  const isMaster = evaluation.tier === "Master SuperHost";

  const handleBadgeClick = () => {
    if (!showDetailsOnClick) return;
    playPop();
    setDetailsOpen(true);
  };

  return (
    <>
      <div
        onClick={handleBadgeClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer select-none shadow-md ${
          isMaster
            ? "border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 text-amber-300 shadow-amber-500/20 hover:scale-105"
            : isSuperHost
            ? "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-amber-500/10 hover:scale-105"
            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
        } ${className}`}
      >
        {isMaster ? (
          <Crown className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
        ) : isSuperHost ? (
          <Award className="h-3.5 w-3.5 text-amber-400" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        )}

        <span className="text-[11px] font-extrabold font-mono tracking-tight">
          {evaluation.tier === "Master SuperHost"
            ? isHi ? "👑 मास्टर सुपरहोस्ट" : "👑 Master SuperHost"
            : evaluation.tier === "SuperHost"
            ? isHi ? "⭐ सुपरहोस्ट नोड" : "⭐ SuperHost Node"
            : isHi ? "✓ सत्यापित नोड" : "✓ Verified Host"}
        </span>

        {isSuperHost && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-black/40 text-amber-300 border border-amber-500/30 font-mono">
            {evaluation.checkInAccuracyPercentage}% SLA
          </span>
        )}
      </div>

      {/* Details Breakdown Modal */}
      <AnimatePresence>
        {detailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-[#0A0D0F] p-6 text-foreground shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {metrics.hostName}
                    </h3>
                    <p className="text-xs text-amber-400 font-mono">
                      {metrics.nodeAddress}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-black to-amber-950/40 p-4 text-center mb-4">
                <Badge className="bg-amber-500 text-black font-extrabold text-[10px] mb-1">
                  OFFICIAL CPO TIER STATUS
                </Badge>
                <div className="text-xl font-extrabold text-amber-300 flex items-center justify-center gap-2">
                  {evaluation.tier === "Master SuperHost" ? (
                    <Crown className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  )}
                  <span>{evaluation.tier}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {isHi ? "कंपोज़िट होस्ट स्कोर:" : "Composite Host Score:"}{" "}
                  <span className="text-emerald-400 font-bold">{evaluation.score} / 100</span>
                </div>
              </div>

              {/* 4 Criteria Grid */}
              <div className="space-y-2 mb-4 text-xs">
                <h4 className="font-bold text-amber-400 font-mono text-[11px] uppercase tracking-wider">
                  {isHi ? "सुपरहोस्ट मान्यता मानदंड जांच" : "SuperHost Accreditation Criteria"}
                </h4>

                <div className="grid gap-2 sm:grid-cols-2 text-[11px]">
                  {/* Criterion 1 */}
                  <div
                    className={`rounded-xl p-2.5 border flex items-center justify-between ${
                      evaluation.qualifiesCriteria.checkInAccuracyPass
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-red-950/20 border-red-500/30 text-red-200"
                    }`}
                  >
                    <span>{isHi ? "चेक-इन सटीकता (≥99%)" : "Check-in SLA (≥99%)"}</span>
                    <span className="font-bold font-mono">
                      {evaluation.checkInAccuracyPercentage}%
                    </span>
                  </div>

                  {/* Criterion 2 */}
                  <div
                    className={`rounded-xl p-2.5 border flex items-center justify-between ${
                      evaluation.qualifiesCriteria.zeroDisputePass
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-red-950/20 border-red-500/30 text-red-200"
                    }`}
                  >
                    <span>{isHi ? "विवाद रिकॉर्ड (0 विवाद)" : "Dispute Record (0 Disputes)"}</span>
                    <span className="font-bold font-mono">
                      {metrics.totalDisputes} {isHi ? "विवाद" : "Disputes"}
                    </span>
                  </div>

                  {/* Criterion 3 */}
                  <div
                    className={`rounded-xl p-2.5 border flex items-center justify-between ${
                      evaluation.qualifiesCriteria.ratingPass
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-red-950/20 border-red-500/30 text-red-200"
                    }`}
                  >
                    <span>{isHi ? "छात्र रेटिंग (≥4.8★)" : "Student Rating (≥4.8★)"}</span>
                    <span className="font-bold font-mono">
                      {metrics.averageRating.toFixed(2)} ★
                    </span>
                  </div>

                  {/* Criterion 4 */}
                  <div
                    className={`rounded-xl p-2.5 border flex items-center justify-between ${
                      evaluation.qualifiesCriteria.volumePass
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-red-950/20 border-red-500/30 text-red-200"
                    }`}
                  >
                    <span>{isHi ? "पूर्ण चेक-इन (≥10)" : "Completed Check-ins (≥10)"}</span>
                    <span className="font-bold font-mono">
                      {metrics.totalCheckIns} {isHi ? "चेक-इन" : "Check-ins"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perks List */}
              <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-3.5 space-y-2 text-xs mb-4">
                <h4 className="font-bold text-amber-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isHi ? "सुपरहोस्ट विशेषाधिकार व लाभ" : "SuperHost Platform Privileges"}
                </h4>
                <ul className="space-y-1.5 text-[11px] text-amber-200/90">
                  {(isHi ? evaluation.badgePerksHi : evaluation.badgePerksEn).map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
                >
                  {isHi ? "ठीक है" : "Got It"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
