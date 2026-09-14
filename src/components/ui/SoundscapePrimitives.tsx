import React from "react";
import { usePersona } from "@/context/PersonaContext";
import {
  playToggleSwitch,
  playCounterIncrement,
  playCounterDecrement,
  playPaymentConfirmation,
} from "@/lib/audio";
import { Check, Plus, Minus } from "lucide-react";

export interface SoundscapeToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  sublabel?: string;
  id?: string;
  className?: string;
}

/**
 * SoundscapeToggleSwitch - Accessible interactive toggle switch with distinct Web Audio ON/OFF feedback
 */
export function SoundscapeToggleSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  sublabel,
  id,
  className = "",
}: SoundscapeToggleSwitchProps) {
  const { role } = usePersona();
  const isHost = role === "host";

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !checked;
    playToggleSwitch(nextState);
    onCheckedChange(nextState);
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${
          checked
            ? isHost
              ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] focus-visible:ring-amber-500"
              : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] focus-visible:ring-emerald-500"
            : "bg-white/10 focus-visible:ring-white/30"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        >
          {checked && (
            <Check
              className={`h-3 w-3 m-1 ${
                isHost ? "text-amber-900" : "text-emerald-900"
              }`}
            />
          )}
        </span>
      </button>
      {(label || sublabel) && (
        <div className="flex flex-col text-left cursor-pointer" onClick={handleToggle}>
          {label && (
            <span className="text-xs sm:text-sm font-medium text-white/90">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] sm:text-xs text-white/50">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface HapticItemCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * HapticItemCounter - Micro-counter control with cheerful pitch-shifting Web Audio feedback
 */
export function HapticItemCounter({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label,
  unit,
  disabled = false,
  className = "",
}: HapticItemCounterProps) {
  const { role } = usePersona();
  const isHost = role === "host";

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    const nextValue = value + step;
    playCounterIncrement(nextValue);
    onChange(nextValue);
  };

  const handleDecrement = () => {
    if (disabled || value <= min) return;
    const nextValue = value - step;
    playCounterDecrement(nextValue);
    onChange(nextValue);
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {label && (
        <span className="text-xs sm:text-sm font-medium text-white/80">
          {label}
        </span>
      )}
      <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1 shadow-inner">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label="Decrement"
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
            value <= min || disabled
              ? "opacity-30 cursor-not-allowed text-white/40"
              : "text-white hover:bg-white/10 active:scale-95"
          }`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-center min-w-[2.5rem] px-2 text-center">
          <span className="font-mono text-base font-bold text-white">
            {value}
          </span>
          {unit && (
            <span className="text-[10px] text-white/50 ml-1">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label="Increment"
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
            value >= max || disabled
              ? "opacity-30 cursor-not-allowed text-white/40"
              : isHost
              ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 active:scale-95"
              : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 active:scale-95"
          }`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export interface HapticPaymentButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  className?: string;
  variant?: "primary" | "secondary" | "success";
}

/**
 * HapticPaymentButton - Payment and booking CTA button with triumphant 4-note Web Audio major chord feedback
 */
export function HapticPaymentButton({
  onClick,
  children,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  variant = "primary",
}: HapticPaymentButtonProps) {
  const { role } = usePersona();
  const isHost = role === "host";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    playPaymentConfirmation();
    if (onClick) onClick(e);
  };

  const getVariantClasses = () => {
    if (variant === "success") {
      return "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110";
    }
    if (variant === "secondary") {
      return "bg-white/10 text-white hover:bg-white/15 border border-white/20";
    }
    return isHost
      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110"
      : "bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110";
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVariantClasses()} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
