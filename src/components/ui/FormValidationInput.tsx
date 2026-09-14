import React, { useState, useEffect, useRef } from "react";
import { usePersona } from "../../context/PersonaContext";
import { getFormValidationTokens, FORM_VALIDATION_TOKENS } from "../../lib/designTokens";
import { playClick, playPop, playWarningBeep } from "../../lib/audio";

export type ValidationInputType = "name" | "phone" | "email" | "pincode" | "custom";

export interface FormValidationInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  labelEn: string;
  labelHi?: string;
  fieldType?: ValidationInputType;
  value: string;
  onChange: (val: string, isValid: boolean) => void;
  lang?: "en" | "hi";
  customValidator?: (val: string) => boolean | string;
  customSuccessMsgEn?: string;
  customErrorMsgEn?: string;
  customSuccessMsgHi?: string;
  customErrorMsgHi?: string;
  shakeTrigger?: boolean;
  showValidationIcon?: boolean;
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
  containerClassName?: string;
}

export const FormValidationInput: React.FC<FormValidationInputProps> = ({
  labelEn,
  labelHi,
  fieldType = "custom",
  value,
  onChange,
  lang = "en",
  customValidator,
  customSuccessMsgEn,
  customErrorMsgEn,
  customSuccessMsgHi,
  customErrorMsgHi,
  shakeTrigger = false,
  showValidationIcon = true,
  prefixAddon,
  suffixAddon,
  containerClassName = "",
  id,
  placeholder,
  disabled,
  className = "",
  onBlur,
  onFocus,
  ...restInputProps
}) => {
  const { role } = usePersona();
  const tokens = getFormValidationTokens(role);
  const isHost = role === "host";

  const [touched, setTouched] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const prevShakeRef = useRef<boolean>(shakeTrigger);
  const prevValidRef = useRef<boolean>(false);

  // Derive validation status
  const validateField = (val: string): { isValid: boolean; messageEn: string; messageHi: string } => {
    const rawVal = val.trim();

    if (customValidator) {
      const res = customValidator(val);
      if (typeof res === "string") {
        return { isValid: false, messageEn: res, messageHi: res };
      }
      if (res === false) {
        return {
          isValid: false,
          messageEn: customErrorMsgEn || tokens.microCopy.custom.invalidEn,
          messageHi: customErrorMsgHi || tokens.microCopy.custom.invalidHi,
        };
      }
      return {
        isValid: true,
        messageEn: customSuccessMsgEn || tokens.microCopy.custom.validEn,
        messageHi: customSuccessMsgHi || tokens.microCopy.custom.validHi,
      };
    }

    switch (fieldType) {
      case "name": {
        const isValid = rawVal.length >= 2;
        return {
          isValid,
          messageEn: isValid
            ? customSuccessMsgEn || tokens.microCopy.name.validEn
            : customErrorMsgEn || tokens.microCopy.name.invalidEn,
          messageHi: isValid
            ? customSuccessMsgHi || tokens.microCopy.name.validHi
            : customErrorMsgHi || tokens.microCopy.name.invalidHi,
        };
      }
      case "phone": {
        const digits = val.replace(/\D/g, "");
        const isValid = digits.length === 10 && /^[6-9]/.test(digits);
        return {
          isValid,
          messageEn: isValid
            ? customSuccessMsgEn || tokens.microCopy.phone.validEn
            : customErrorMsgEn || tokens.microCopy.phone.invalidEn,
          messageHi: isValid
            ? customSuccessMsgHi || tokens.microCopy.phone.validHi
            : customErrorMsgHi || tokens.microCopy.phone.invalidHi,
        };
      }
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(rawVal);
        return {
          isValid,
          messageEn: isValid
            ? customSuccessMsgEn || tokens.microCopy.email.validEn
            : customErrorMsgEn || tokens.microCopy.email.invalidEn,
          messageHi: isValid
            ? customSuccessMsgHi || tokens.microCopy.email.validHi
            : customErrorMsgHi || tokens.microCopy.email.invalidHi,
        };
      }
      case "pincode": {
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        const isValid = pincodeRegex.test(rawVal);
        return {
          isValid,
          messageEn: isValid
            ? customSuccessMsgEn || tokens.microCopy.pincode.validEn
            : customErrorMsgEn || tokens.microCopy.pincode.invalidEn,
          messageHi: isValid
            ? customSuccessMsgHi || tokens.microCopy.pincode.validHi
            : customErrorMsgHi || tokens.microCopy.pincode.invalidHi,
        };
      }
      default: {
        const isValid = rawVal.length > 0;
        return {
          isValid,
          messageEn: isValid
            ? customSuccessMsgEn || tokens.microCopy.custom.validEn
            : customErrorMsgEn || tokens.microCopy.custom.invalidEn,
          messageHi: isValid
            ? customSuccessMsgHi || tokens.microCopy.custom.validHi
            : customErrorMsgHi || tokens.microCopy.custom.invalidHi,
        };
      }
    }
  };

  const validation = validateField(value);
  const isValid = validation.isValid;
  const isInvalid = touched && !isValid && value.length > 0;
  const isBlankError = touched && !isValid && value.length === 0;

  // React to shake trigger prop changes
  useEffect(() => {
    if (shakeTrigger && !prevShakeRef.current) {
      if (!isValid) {
        setTouched(true);
        triggerShake();
      }
    }
    prevShakeRef.current = shakeTrigger;
  }, [shakeTrigger, isValid]);

  // Audio feedback when validity state transitions
  useEffect(() => {
    if (touched && isValid && !prevValidRef.current) {
      playPop();
    } else if (touched && !isValid && prevValidRef.current) {
      playWarningBeep();
    }
    prevValidRef.current = isValid;
  }, [isValid, touched]);

  const triggerShake = () => {
    setIsShaking(true);
    playWarningBeep();
    setTimeout(() => {
      setIsShaking(false);
    }, tokens.shakeAnimationMs);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const res = validateField(newVal);
    onChange(newVal, res.isValid);
    if (!touched) setTouched(true);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    playClick();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setTouched(true);
    if (!isValid && value.length > 0) {
      triggerShake();
    }
    if (onBlur) onBlur(e);
  };

  const inputId = id || `form-input-${labelEn.toLowerCase().replace(/\s+/g, "-")}`;
  const hintId = `hint-${inputId}`;

  // Default helper micro-copy
  const getDefaultHint = () => {
    const defaultCopy = tokens.microCopy[fieldType] || tokens.microCopy.custom;
    if (lang === "hi") {
      return labelHi || defaultCopy.defaultHi;
    }
    return defaultCopy.defaultEn;
  };

  const activeMessage = lang === "hi" ? validation.messageHi : validation.messageEn;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {/* Field Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            isInvalid || isBlankError
              ? "text-rose-400"
              : touched && isValid
              ? isHost
                ? "text-amber-400"
                : "text-emerald-400"
              : "text-slate-300"
          }`}
        >
          {lang === "hi" && labelHi ? labelHi : labelEn}
        </label>
        {touched && isValid && showValidationIcon && (
          <span className={`text-xs font-bold flex items-center gap-1 ${tokens.accent.validText}`}>
            <span>✓</span> {lang === "hi" ? "सत्यापित" : "Verified"}
          </span>
        )}
      </div>

      {/* Input Outer Container */}
      <div
        className={`relative flex items-center rounded-xl bg-slate-900/90 border transition-all duration-200 ${
          isShaking ? "form-shake-active" : ""
        } ${
          isInvalid || isBlankError
            ? "form-input-invalid"
            : touched && isValid
            ? "form-input-valid"
            : isFocused
            ? isHost
              ? "border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              : "border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            : "border-slate-800 hover:border-slate-700"
        }`}
      >
        {prefixAddon && <div className="pl-3.5 pr-1 flex items-center text-slate-400">{prefixAddon}</div>}

        <input
          id={inputId}
          type={fieldType === "email" ? "email" : fieldType === "phone" ? "tel" : "text"}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder || (lang === "hi" ? "यहाँ दर्ज करें..." : "Enter details...")}
          aria-invalid={touched && !isValid}
          aria-describedby={hintId}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50 ${className}`}
          {...restInputProps}
        />

        {/* Validation Suffix Status Icon */}
        {showValidationIcon && (
          <div className="pr-3.5 flex items-center text-sm pointer-events-none">
            {touched && isValid ? (
              <span className={tokens.accent.validText} title="Valid input">
                ✓
              </span>
            ) : touched && !isValid && value.length > 0 ? (
              <span className="text-rose-400 animate-pulse" title="Invalid input">
                ⚠️
              </span>
            ) : suffixAddon ? (
              suffixAddon
            ) : null}
          </div>
        )}
      </div>

      {/* Inline Micro-Copy Hint */}
      <div id={hintId} role="alert" className="validation-hint-text min-h-[20px]">
        {touched && isValid ? (
          <span className={`flex items-center gap-1 font-medium ${tokens.accent.validText}`}>
            <span>✓</span> {activeMessage}
          </span>
        ) : touched && !isValid ? (
          <span className="flex items-center gap-1 font-medium text-rose-400">
            <span>⚠️</span> {activeMessage}
          </span>
        ) : (
          <span className="text-slate-400 font-normal text-xs">{getDefaultHint()}</span>
        )}
      </div>
    </div>
  );
};
