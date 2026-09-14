import React, { useState, useRef, useEffect, useCallback } from "react";
import { CheckCircle2, Phone, ShieldCheck, AlertCircle, RotateCw, Lock, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { getPhoneOtpInputTokens } from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime, playWarningBeep } from "@/lib/audio";
import { isValidPhone } from "@/lib/waitlistService";

export interface IndianPhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  onValidComplete?: (phone: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  autoFocus?: boolean;
  id?: string;
  showSuccessBadge?: boolean;
  className?: string;
}

export function IndianPhoneInput({
  value,
  onChange,
  onValidComplete,
  label,
  placeholder,
  disabled = false,
  error = null,
  autoFocus = false,
  id = "indian-phone-input",
  showSuccessBadge = true,
  className = "",
}: IndianPhoneInputProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const tokens = getPhoneOtpInputTokens(role);
  const [touched, setTouched] = useState(false);

  // Extract clean 10-digit number
  const cleanDigits = value.replace(/\D/g, "").slice(0, 10);
  const isValid = isValidPhone(cleanDigits);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    onChange(digitsOnly);

    if (digitsOnly.length === 10 && isValidPhone(digitsOnly)) {
      playPop();
      onValidComplete?.(digitsOnly);
    } else {
      playClick();
    }
  };

  const formattedDisplay = cleanDigits.length > 5
    ? `${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
    : cleanDigits;

  const showValidationError = touched && cleanDigits.length > 0 && !isValid;

  return (
    <div className={`space-y-1.5 w-full ${className}`} data-persona={role}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-foreground/90 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            {label}
          </span>
          {showSuccessBadge && isValid && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isHi ? "सत्यापित" : "Verified +91"}
            </span>
          )}
        </label>
      )}

      <div className={`phone-input-wrapper relative ${showValidationError || error ? "border-destructive/60 focus-within:border-destructive shadow-[0_0_12px_rgba(239,68,68,0.3)]" : ""}`}>
        <div className="phone-prefix-pill">
          <span className="text-base leading-none">🇮🇳</span>
          <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">+91</span>
        </div>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          autoFocus={autoFocus}
          disabled={disabled}
          value={formattedDisplay}
          onBlur={() => setTouched(true)}
          onChange={handleInputChange}
          placeholder={placeholder || (isHi ? tokens.placeholders.phoneHi : tokens.placeholders.phoneEn)}
          className="w-full bg-transparent px-3.5 py-2.5 font-mono text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none tracking-widest disabled:opacity-50"
        />

        {showSuccessBadge && isValid && (
          <div className="pr-3 flex items-center shrink-0">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
          </div>
        )}
      </div>

      {(showValidationError || error) && (
        <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 pt-0.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
          <span>
            {error || (isHi ? tokens.errorHints.invalidPhoneHi : tokens.errorHints.invalidPhoneEn)}
          </span>
        </p>
      )}
    </div>
  );
}

export interface OtpSixDigitInputProps {
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  onResendOtp?: () => void;
  isError?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  resendCooldownSec?: number;
  label?: string;
  autoFocus?: boolean;
  className?: string;
}

export function OtpSixDigitInput({
  value,
  onChange,
  onComplete,
  onResendOtp,
  isError = false,
  errorMessage = null,
  disabled = false,
  resendCooldownSec = 30,
  label,
  autoFocus = true,
  className = "",
}: OtpSixDigitInputProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const tokens = getPhoneOtpInputTokens(role);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(resendCooldownSec);
  const [canResend, setCanResend] = useState(false);

  // Pad or trim value to 6 chars
  const digits = Array.from({ length: 6 }).map((_, i) => value[i] || "");

  // Timer countdown for Resend OTP
  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, val: string) => {
    const numericChar = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = numericChar;
    const newOtp = newDigits.join("").slice(0, 6);

    onChange(newOtp);

    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.length === 6) {
      playSuccessChime();
      onComplete?.(newOtp);
    } else {
      playPop();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
        playClick();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedDigits.length > 0) {
      onChange(pastedDigits);
      const nextFocusIdx = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextFocusIdx]?.focus();

      if (pastedDigits.length === 6) {
        playSuccessChime();
        onComplete?.(pastedDigits);
      } else {
        playPop();
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCooldown(resendCooldownSec);
    setCanResend(false);
    playClick();
    onResendOtp?.();
  };

  return (
    <div className={`space-y-3 w-full ${className}`} data-persona={role}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          {label || (isHi ? "6-अंकीय ओटीपी कोड दर्ज करें" : "Enter 6-Digit OTP Verification Code")}
        </label>
        <span className="text-[11px] font-mono text-muted-foreground">
          {digits.filter(Boolean).length}/6 {isHi ? "अंक" : "digits"}
        </span>
      </div>

      <div className="otp-digit-grid" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoFocus={autoFocus && idx === 0}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`otp-digit-cell ${digit ? "otp-digit-filled" : ""} ${isError ? "otp-digit-error" : ""}`}
            aria-label={`Digit ${idx + 1}`}
          />
        ))}
      </div>

      {errorMessage && (
        <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 pt-0.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}

      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-muted-foreground text-[11px]">
          {isHi ? "ओटीपी नहीं मिला?" : "Didn't receive OTP?"}
        </span>
        <button
          type="button"
          disabled={!canResend || disabled}
          onClick={handleResend}
          className={`font-semibold flex items-center gap-1.5 transition ${
            canResend
              ? role === "host"
                ? "text-amber-400 hover:underline cursor-pointer"
                : "text-emerald-400 hover:underline cursor-pointer"
              : "text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          <RotateCw className={`w-3 h-3 ${!canResend ? "animate-spin" : ""}`} />
          {canResend
            ? isHi
              ? "ओटीपी पुनः भेजें"
              : "Resend Code"
            : isHi
            ? `${cooldown}से बाद भेजें`
            : `Resend in ${cooldown}s`}
        </button>
      </div>
    </div>
  );
}

export interface PhoneOtpAuthFlowProps {
  onVerificationSuccess: (data: { phone: string; otp: string }) => void;
  initialPhone?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PhoneOtpAuthFlow({
  onVerificationSuccess,
  initialPhone = "",
  title,
  subtitle,
  className = "",
}: PhoneOtpAuthFlowProps) {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = () => {
    if (!isValidPhone(phone)) return;
    playPop();
    setStep("otp");
  };

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
    setIsSubmitting(true);
    setOtpError(null);

    // Simulate OTP verification (demo code "123456" or any 6 digits)
    setTimeout(() => {
      setIsSubmitting(false);
      onVerificationSuccess({ phone, otp: completedOtp });
    }, 600);
  };

  return (
    <div className={`space-y-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 ${className}`} data-persona={role}>
      {title && (
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${role === "host" ? "text-amber-400" : "text-emerald-400"}`} />
            {title}
          </h4>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {step === "phone" ? (
        <div className="space-y-3">
          <IndianPhoneInput
            value={phone}
            onChange={setPhone}
            onValidComplete={() => {}}
            label={isHi ? "मोबाइल नंबर" : "Indian Mobile Number"}
          />

          <button
            type="button"
            disabled={!isValidPhone(phone)}
            onClick={handleSendOtp}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              isValidPhone(phone)
                ? role === "host"
                  ? "bg-gradient-to-r from-amber-500 to-gold-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer hover:opacity-95"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer hover:opacity-95"
                : "bg-white/10 text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isHi ? "ओटीपी कोड भेजें" : "Send Verification OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-2">
          <div className="flex items-center justify-between text-xs bg-white/5 px-3 py-2 rounded-xl border border-white/10">
            <span className="text-muted-foreground font-mono">+91 {phone}</span>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                playClick();
              }}
              className="text-emerald-400 hover:underline text-[11px] font-semibold cursor-pointer"
            >
              {isHi ? "बदलें" : "Change Number"}
            </button>
          </div>

          <OtpSixDigitInput
            value={otp}
            onChange={setOtp}
            onComplete={handleOtpComplete}
            onResendOtp={() => {
              setOtp("");
              setOtpError(null);
            }}
            isError={Boolean(otpError)}
            errorMessage={otpError}
            disabled={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
