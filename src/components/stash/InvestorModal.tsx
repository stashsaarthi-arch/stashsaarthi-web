import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, KeyRound, ArrowRight, Eye, EyeOff, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleDownloadInvestorMemo } from "./legal";
import { FOUNDER_WHATSAPP } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface InvestorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestorModal({ open, onOpenChange }: InvestorModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  const EXPECTED_KEY =
    import.meta.env["VITE_INVESTOR_KEY"] ||
    import.meta.env["VITE_INVESTOR_ACCESS_KEY"] ||
    "STASH2026";

  const requestAccessWhatsAppUrl = `https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(
    isHi
      ? "नमस्ते, मैं एक निवेशक/निर्णायक हूं और स्टैशसारथी इन्वेस्टर मेमो तक पहुंच चाहता/चाहती हूं।"
      : "Hi Advik, I am an investor/judge and would like access to the StashSaarthi Investor Memo.",
  )}`;

  useEffect(() => {
    if (!open) {
      setAccessKey("");
      setShowPassword(false);
      setErrorMsg("");
      setShake(false);
    }
  }, [open]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = accessKey.trim();

    if (trimmed.toUpperCase() === EXPECTED_KEY.toUpperCase()) {
      setErrorMsg("");
      onOpenChange(false);
      handleDownloadInvestorMemo(language);
    } else {
      setAccessKey("");
      setErrorMsg(
        isHi
          ? "❌ अनधिकृत की (Key)। कृपया संस्थापक टीम से एक्सेस का अनुरोध करें।"
          : "❌ Unauthorized key. Please request access from the founding team.",
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] sm:max-w-md bg-[#0D1117]/95 backdrop-blur-xl border border-amber-500/30 p-6 shadow-2xl rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 45px -10px rgba(245, 158, 11, 0.2)",
        }}
      >
        {/* Subtle amber ambient glow in corner */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl" />

        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                {isHi ? "गोपनीय इन्वेस्टर पोर्टल" : "Confidential Investor Portal"}
              </DialogTitle>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-400">
                {isHi ? "स्टैशसारथी वित्तीय आंकड़े (2026)" : "StashSaarthi Financials (2026)"}
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-300 leading-relaxed mt-2">
            {isHi
              ? "स्टैशसारथी यूनिट इकोनॉमिक्स और वित्तीय विवरण देखने के लिए अधिकृत एक्सेस की (Key) दर्ज करें।"
              : "Enter authorized ecosystem access key to view StashSaarthi Unit Economics & Financial Brief."}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <form onSubmit={handleUnlock} className="space-y-4 mt-2">
            <div>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder={
                    isHi
                      ? "एक्सेस की दर्ज करें (उदा. STASH2026)"
                      : "Enter Access Key (e.g. STASH2026)"
                  }
                  aria-label={isHi ? "निवेशक एक्सेस की" : "Investor access key"}
                  className="pl-10 pr-10 py-5 bg-black/50 border-white/10 text-white rounded-xl placeholder:text-slate-400 font-mono text-sm focus-visible:ring-amber-500/50"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-400 mt-2 flex items-center gap-1.5">
                  {errorMsg}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isHi ? "इन्वेस्टर मेमो अनलॉक करें" : "Unlock Investor Memo"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>

        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 mb-2">
            {isHi ? "एक्सेस की नहीं है?" : "Don't have an access key?"}
          </p>
          <a
            href={requestAccessWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {isHi ? "फाउंडर से एक्सेस की का अनुरोध करें" : "Request Key from Founder on WhatsApp"}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
