import React, { useState, useRef, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from '@tanstack/react-router';
import { Smartphone, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
  const grecaptcha: any;
}

export function PhoneAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }

    // Cleanup to prevent memory leaks on unmount/refresh
    return () => {
      if (typeof window !== "undefined" && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined as any;
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [isMounted]);

  if (!isMounted) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = `+91${cleanPhone}`;
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        setError("Security verifier not ready. Please refresh the page.");
        setLoading(false);
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err: any) {
      console.error("Phone Auth Error:", err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      const isBlocked = 
        errCode === 'auth/network-request-failed' ||
        errCode === 'auth/captcha-check-failed' ||
        errCode === 'auth/web-storage-unsupported' ||
        errMsg.includes('reCAPTCHA') ||
        errMsg.includes('network') ||
        errMsg.includes('Timeout') ||
        errMsg.includes('blocked');

      if (isBlocked) {
        setError('Verification was blocked by your browser extension or shield. Please disable Ad-Blocker/Shields and try again.');
      } else if (errCode === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few moments and try again.');
      } else if (errCode === 'auth/invalid-phone-number') {
        setError('Invalid mobile number format. Please check the 10 digits.');
      } else if (errCode === 'auth/quota-exceeded') {
        setError('SMS quota exceeded for today. Please try again later.');
      } else {
        setError(errMsg || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Auto-focus previous input on backspace if current is empty
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6 || !confirmationResult) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(otpCode);
      // Successful login, redirect to dashboard
      navigate({ to: '/host/dashboard' });
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      const errCode = err?.code || '';
      if (errCode === 'auth/invalid-verification-code') {
        setError('Incorrect OTP. Please enter the valid 6-digit code.');
      } else if (errCode === 'auth/code-expired') {
        setError('OTP has expired. Please go back and request a new code.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10">
      {/* Hidden recaptcha container placed at the absolute root to avoid conditional re-rendering */}
      <div id="recaptcha-container" className="absolute pointer-events-none opacity-0" />

      {/* Ambient Apple Depth Glow strictly behind the auth container */}
      <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] -z-10 pointer-events-none rounded-[2rem]" />
      
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-24 pr-6 py-4 bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-500"
                  placeholder="Enter 10 digit number"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                  <span className="text-slate-400 pl-2 pr-3 border-r border-white/10 mr-2 text-sm font-medium">+91</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="bg-emerald-500 text-black font-bold rounded-full py-4 w-full hover:bg-emerald-400 active:scale-95 transition-all ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Send OTP
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Enter OTP</h3>
              <p className="text-sm text-slate-400">
                We've sent a 6-digit code to +91 {phone}
              </p>
            </div>
            
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="bg-emerald-500 text-black font-bold rounded-full py-4 w-full hover:bg-emerald-400 active:scale-95 transition-all ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
              className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors mx-auto mt-4"
            >
              <ArrowLeft className="w-3 h-3" /> Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
