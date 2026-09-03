import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Star,
  Camera,
  CheckCircle2,
  X,
  AlertTriangle,
  Sparkles,
  Loader2,
  RotateCcw,
  ChefHat,
  Receipt,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  TasteShieldIssueCategory,
  getUserShieldQuota,
  submitTasteShieldClaim,
  UserShieldQuota,
} from "@/lib/tasteShieldService";

export interface TasteShieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    mealName: string;
    vendorName: string;
    vendorId?: string;
    tokensDebited: number;
    userPhone: string;
    userName?: string;
    orderCreatedAt?: string;
    pickupCode?: string | null;
  };
  onRefundSuccess?: (refundTokens: number) => void;
}

const POSITIVE_TAGS = [
  "Garama-Garam 🔥",
  "Ghar Jaisa Swad 🍲",
  "Fast Prep ⚡",
  "Generous Portion 🥣",
  "Fresh Salad & Roti 🥗",
  "Crisp & Clean 🧼",
];

const ISSUE_OPTIONS: { id: TasteShieldIssueCategory; label: string; icon: string }[] = [
  { id: "raw_or_burnt", label: "Roti was hard / burnt", icon: "🍞" },
  { id: "taste_quality", label: "Dal was watery / poor seasoning", icon: "🥣" },
  { id: "hygiene_foreign_object", label: "Hygiene concern / foreign object", icon: "⚠️" },
  { id: "taste_quality", label: "Cold food / unheated", icon: "❄️" },
  { id: "missing_items", label: "Missing items in thali", icon: "📦" },
  { id: "other", label: "Other taste / quality defect", icon: "📝" },
];

export const TasteShieldModal: React.FC<TasteShieldModalProps> = ({
  open,
  onOpenChange,
  booking,
  onRefundSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Garama-Garam 🔥"]);
  const [issueCategory, setIssueCategory] = useState<TasteShieldIssueCategory>("raw_or_burnt");
  const [selectedIssueLabel, setSelectedIssueLabel] = useState<string>("Roti was hard / burnt");
  const [feedbackText, setFeedbackText] = useState<string>("");

  // Photo Capture State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Quota & Submission State
  const [quota, setQuota] = useState<UserShieldQuota | null>(null);
  const [loadingQuota, setLoadingQuota] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    eligible: boolean;
    refundTokens: number;
    message: string;
    refundStatus: string;
  } | null>(null);

  const potentialRefund = Math.floor(booking.tokensDebited * 0.5);

  // Fetch quota whenever modal opens with user phone
  useEffect(() => {
    if (open && booking.userPhone) {
      setLoadingQuota(true);
      getUserShieldQuota(booking.userPhone)
        .then((q) => setQuota(q))
        .catch(() => setQuota(null))
        .finally(() => setLoadingQuota(false));
    }
  }, [open, booking.userPhone]);

  // Handle Photo selection from live mobile camera
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please provide an image file");
        return;
      }
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      toast.success("Camera evidence attached! 📸", {
        description: "Live proof registered for Taste Shield verification.",
      });
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleIssueSelect = (option: (typeof ISSUE_OPTIONS)[0]) => {
    setIssueCategory(option.id);
    setSelectedIssueLabel(option.label);
  };

  const isEligibleForRefund =
    rating <= 2 &&
    quota?.isQuotaAvailable &&
    !quota?.isShieldBlocked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating <= 2) {
      if (!photoFile) {
        toast.error("Live Camera Evidence Required", {
          description:
            "Anti-Fraud Charter requires a live camera photo of the defective meal to release the 50% token refund.",
        });
        cameraInputRef.current?.click();
        return;
      }

      if (!feedbackText || feedbackText.trim().length < 5) {
        toast.error("Please add details", {
          description: "Please share a few words about what went wrong with the meal.",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await submitTasteShieldClaim({
        bookingId: booking.id,
        userPhone: booking.userPhone,
        userName: booking.userName,
        vendorName: booking.vendorName,
        vendorId: booking.vendorId,
        rating,
        issueCategory: rating <= 2 ? issueCategory : undefined,
        feedbackText:
          rating <= 2
            ? `[${selectedIssueLabel}] ${feedbackText.trim()}`
            : selectedTags.join(", ") + (feedbackText ? ` — ${feedbackText.trim()}` : ""),
        photoFile,
        tokensDebited: booking.tokensDebited,
        orderCreatedAt: booking.orderCreatedAt,
      });

      setSubmissionResult({
        submitted: true,
        eligible: result.eligible,
        refundTokens: result.refundTokens,
        message: result.message,
        refundStatus: result.refundStatus,
      });

      if (result.eligible && result.refundTokens > 0) {
        toast.success("50% Token Refund Approved! ⚡", {
          description: `${result.refundTokens} Tokens have been instantly credited back to your wallet.`,
          duration: 6000,
        });
        if (onRefundSuccess) {
          onRefundSuccess(result.refundTokens);
        }
      } else {
        toast.info("Feedback Recorded", {
          description: result.message,
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Taste Shield submission failed:", err);
      toast.error("Could not record review", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setSubmissionResult(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFeedbackText("");
    setRating(5);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100"
      >
        {/* Header Ribbon Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${
            rating <= 2
              ? "bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500"
              : "bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500"
          }`}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close review dialog"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        {submissionResult?.submitted ? (
          /* =========================================================================
             SUCCESS / CONFIRMATION STATE
             ========================================================================= */
          <div className="p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            {submissionResult.eligible ? (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Taste Shield Claim Approved
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Auto-Refund Credited!
                </h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  Our anti-fraud engine verified your meal proof. The 50% guarantee has been settled automatically.
                </p>

                {/* Animated Tokens Badge */}
                <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 shadow-xl max-w-xs mx-auto">
                  <div className="text-xs text-emerald-300 uppercase tracking-wider font-bold">
                    Re-credited to Your Wallet
                  </div>
                  <div className="text-3xl font-black text-white mt-1 flex items-center justify-center gap-2">
                    <span className="text-emerald-400">+{submissionResult.refundTokens}</span>
                    <span className="text-sm font-semibold text-slate-300">Tokens ⚡</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">1 Token = ₹1 • Available for your next thali</div>
                </div>

                <p className="text-xs text-slate-400 italic max-w-xs mx-auto mb-6">
                  {booking.vendorName} quality supervisor has received your photo proof for mess inspection.
                </p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {rating >= 4 ? "Swad Verified! Shukriya 🙏" : "Feedback Logged"}
                </h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  {submissionResult.message}
                </p>
                <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto">
                  <div className="font-semibold text-slate-300 mb-1">Reviewed Node:</div>
                  <div>{booking.mealName} • {booking.vendorName}</div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Done & Return to Meal Hub
            </button>
          </div>
        ) : (
          /* =========================================================================
             ACTIVE REVIEW / TASTE SHIELD FORM
             ========================================================================= */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
            {/* Header / Order Summary */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Receipt className="w-3 h-3" /> Order Completed
                </span>
                <span className="text-xs text-slate-400">
                  {booking.tokensDebited} Tokens Debited
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-between">
                <span>Rate Your Meal</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  {booking.pickupCode ? `Token #${booking.pickupCode}` : ""}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {booking.mealName} from <span className="text-slate-300 font-medium">{booking.vendorName}</span>
              </p>
            </div>

            {/* Interactive 5-Star Rating Control */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                How was the taste & fresh preparation?
              </span>

              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating ?? rating) >= star;
                  const isLow = (hoverRating ?? rating) <= 2;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isActive
                            ? isLow
                              ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                              : "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                            : "text-slate-700 hover:text-slate-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Mood indicator text */}
              <div className="text-xs font-semibold h-5">
                {rating === 5 && <span className="text-emerald-400">🔥 Lajawab! Pure Ghar Ka Swad</span>}
                {rating === 4 && <span className="text-emerald-300">✨ Very Good & Fresh</span>}
                {rating === 3 && <span className="text-slate-400">🙂 Average / Thik Thaak</span>}
                {rating === 2 && <span className="text-rose-400">⚠️ Disappointing (Taste Shield Active)</span>}
                {rating === 1 && <span className="text-rose-500 font-bold">❌ Poor Quality / Burnt (Taste Shield Active)</span>}
              </div>
            </div>

            {/* 4-5 Stars: Positive Feedback Tags */}
            {rating >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  What made it special? (Tap tags)
                </label>
                <div className="flex flex-wrap gap-2">
                  {POSITIVE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Optional shoutout to the home host / chef:
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. Roti was soft, dal had great tadka..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* 3 Stars: Neutral Feedback */}
            {rating === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  How can the kitchen improve?
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what was missing or could be seasoned better..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </motion.div>
            )}

            {/* =========================================================================
               1-2 STARS: TASTE SHIELD PROTECTION DYNAMIC PANEL
               ========================================================================= */}
            {rating <= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4 bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden"
              >
                {/* Active Shield Badge Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1">
                        🛡️ StashSaarthi 50% Refund Shield
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        1 use/month anti-fraud protection
                      </span>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    50% Value: {potentialRefund} Tokens
                  </span>
                </div>

                {/* Defensive Status Messaging */}
                {loadingQuota ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Checking monthly Taste Shield quota...
                  </div>
                ) : quota?.isQuotaAvailable ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 animate-in fade-in duration-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-200">
                      <strong className="text-emerald-400 font-bold block mb-0.5">
                        Verified claim eligible!
                      </strong>
                      50% tokens (<strong>{potentialRefund} Tokens</strong>) will be instantly credited to your wallet upon live photo verification.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-200">
                      <strong className="text-amber-400 font-bold block mb-0.5">
                        Monthly Taste Shield used
                      </strong>
                      Your monthly claim quota is currently exhausted. Your review will be sent directly to mess management for quality penalties.
                    </div>
                  </div>
                )}

                {/* Issue Category Dropdown / Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    What was the primary issue? <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ISSUE_OPTIONS.map((opt) => {
                      const isSelected = selectedIssueLabel === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleIssueSelect(opt)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-rose-500/15 border-rose-500/60 text-white font-bold"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-sm">{opt.icon}</span>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Text Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Specific Details <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. The rotis were hard like cardboard, dal had no salt and arrived stone cold..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>

                {/* Real-time Camera Upload Button (Mobile-Enforced capture="environment") */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Live Meal Photo Evidence <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Real-time camera only
                    </span>
                  </div>

                  {/* Hidden input with capture="environment" to force live camera */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoCapture}
                  />

                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 p-2 flex items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Meal evidence proof"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Camera Proof Attached
                        </div>
                        <div className="text-[11px] text-slate-300 truncate mt-1">
                          {photoFile?.name || "live_camera_capture.jpg"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {photoFile ? `${Math.round(photoFile.size / 1024)} KB` : "Verified snapshot"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={clearPhoto}
                        aria-label="Remove photo"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-rose-500/40 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <Camera className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                      <span>Capture Food Photo (Camera Required)</span>
                    </button>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Uploads directly to StashSaarthi <code>review-proofs</code> bucket for verification audit.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {rating <= 2 ? (
                  <span>
                    Claiming for <strong>{booking.userPhone}</strong>
                  </span>
                ) : (
                  <span>Thanks for helping Kanpur hosts improve!</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer w-1/3 sm:w-auto text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    rating <= 2
                      ? isEligibleForRefund
                        ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 shadow-rose-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Proof...</span>
                    </>
                  ) : rating <= 2 ? (
                    isEligibleForRefund ? (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        <span>Submit & Auto-Refund {potentialRefund} T</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Quality Audit</span>
                      </>
                    )
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
