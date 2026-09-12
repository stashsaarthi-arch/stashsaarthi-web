import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import {
  claimZeroFeeTrialToken,
  getStashWallet,
  type StashWalletState,
} from "@/lib/stashWallet";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Zap,
  GraduationCap,
  Wallet,
  ArrowRight,
  QrCode,
  Clock,
} from "lucide-react";
import { playClick, playPop } from "@/lib/audio";

import { checkSmsTokenRateLimit } from "@/lib/tokenRateLimiter";

const KANPUR_CAMPUSES = [
  "Kakadeo PW & Allen Belt",
  "IIT Kanpur (Hall 1-13)",
  "CSJMU Kalyanpur",
  "HBTI Nawabganj",
  "GSVM Medical College",
  "Other Kanpur Institute",
];

export function ZeroFeeTrialTokenModal({
  open,
  onOpenChange,
  onApplyTrial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTrial?: () => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [wallet, setWallet] = useState<StashWalletState>(getStashWallet());
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState(KANPUR_CAMPUSES[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      const current = getStashWallet();
      setWallet(current);
      if (current.trialToken) {
        setClaimSuccess(true);
      }
    }
  }, [open]);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error(
        isHi
          ? "कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें"
          : "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    // Task 90: Compliance Token Rate Limiting
    const rateCheck = checkSmsTokenRateLimit(phone);
    if (!rateCheck.allowed) {
      return;
    }

    setIsVerifying(true);
    playClick();

    setTimeout(() => {
      const res = claimZeroFeeTrialToken(phone, college);
      setIsVerifying(false);

      if (res.success) {
        setWallet(res.wallet);
        setClaimSuccess(true);
        toast.success(res.message);
        playPop();
      } else {
        toast.info(res.message);
      }
    }, 1000);
  };

  const handleUseTokenNow = () => {
    playClick();
    onOpenChange(false);
    if (onApplyTrial) {
      onApplyTrial();
    } else {
      window.dispatchEvent(
        new CustomEvent("stashsaarthi:open-booking", {
          detail: { service: "kitchen", bags: 1 },
        })
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0A0D0F] border border-emerald-500/30 text-white rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Glow Header Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Gift className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {isHi ? "फर्स्ट-टाइम स्टूडेंट रिवॉर्ड" : "First-Time Student Reward"}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            {isHi
              ? "⚡ ₹60 जीरो-फी ट्रायल टोकन क्लेम करें"
              : "⚡ Claim ₹60 Zero-Fee Trial Token"}
          </DialogTitle>
          <p className="text-xs text-slate-400">
            {isHi
              ? "कानपुर के नए छात्रों के लिए - पहले टिफिन याLuggage स्टैश ऑर्डर पर 100% जीरो प्लेटफॉर्म फीस!"
              : "For verified Kanpur students — get ₹60 instant credit for 100% zero-fee trial order!"}
          </p>
        </DialogHeader>

        <div className="relative z-10 mt-4 space-y-4">
          {claimSuccess && wallet.trialToken ? (
            /* CLAIMED SUCCESSFUL CARD */
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-sm text-emerald-300">
                    {isHi ? "ट्रायल टोकन वॉलेट में एक्टिव है!" : "Trial Token Active in Stash Wallet!"}
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {wallet.trialToken.tokenId}
                </span>
              </div>

              {/* Wallet Credit Visual */}
              <div className="p-3 bg-black/50 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">
                      {isHi ? "स्टैश वॉलेट बैलेंस" : "Stash Wallet Balance"}
                    </div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      ₹{wallet.balance}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400/80 font-mono">
                    100% Zero Fee
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {wallet.trialToken.studentCollege}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Valid For:
                  </span>
                  <span className="font-mono text-emerald-300">30 Days</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verification:
                  </span>
                  <span className="text-emerald-300 font-medium">Verified Student</span>
                </div>
              </div>

              <Button
                onClick={handleUseTokenNow}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <span>{isHi ? "ऑर्डर में ₹60 टोकन इस्तेमाल करें" : "Use ₹60 Trial Token on Order"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* CLAIM FORM */
            <form onSubmit={handleClaim} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? "आपका संस्थान / कोचिंग" : "Your Campus / Coaching Hub"}</span>
                </Label>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {KANPUR_CAMPUSES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? "व्हाट्सएप मोबाइल नंबर" : "WhatsApp Mobile Number"}</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900/90 border-slate-700/80 text-white text-xs rounded-xl focus:border-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300/90 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  {isHi ? "इंस्टेंट क्रेडिट बेनिफिट:" : "Instant Credit Benefits:"}
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>{isHi ? "₹60 इंस्टेंट क्रेडिट आपके स्टैश वॉलेट में" : "₹60 credited instantly to your Stash Wallet"}</li>
                  <li>{isHi ? "1st Tiffin / Storage ऑर्डर पर शून्य डिलीवरी या सर्विस फीस" : "Zero delivery/platform fee on 1st order"}</li>
                  <li>{isHi ? "कोई हिडन चार्ज नहीं, 100% रिफंडेबल गारंटी" : "No hidden charges, 100% money-back guarantee"}</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isHi ? "वेरिफाई हो रहा है..." : "Verifying Student Status..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isHi ? "₹60 जीरो-फी टोकन क्लेम करें" : "Claim ₹60 Zero-Fee Token"}</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Compact Header / Floating Stash Wallet Badge showing balance & trial token state
 */
export function StashWalletBadge({ onClick }: { onClick: () => void }) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [wallet, setWallet] = useState<StashWalletState>(getStashWallet());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StashWalletState>;
      setWallet(customEvent.detail);
    };

    window.addEventListener("stashsaarthi:wallet-updated", handleUpdate);
    return () => {
      window.removeEventListener("stashsaarthi:wallet-updated", handleUpdate);
    };
  }, []);

  const hasToken = !!wallet.trialToken;

  return (
    <button
      onClick={() => {
        playClick();
        onClick();
      }}
      className="group relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/30 hover:border-emerald-400 text-white text-xs font-medium transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer overflow-hidden"
      title={hasToken ? "Stash Wallet: Active Trial Token" : "Claim Zero-Fee Trial Token"}
    >
      <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
        <Wallet className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[10px] text-slate-300 dark:text-slate-400 font-mono uppercase font-semibold">
          {isHi ? "स्टैश वॉलेट" : "Stash Wallet"}
        </span>
        <span className="text-xs font-extrabold text-emerald-300 dark:text-emerald-400 font-mono tracking-wide">
          {hasToken ? `₹${wallet.balance} Trial` : "Claim ₹60 Free"}
        </span>
      </div>
      {!hasToken && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
    </button>
  );
}
