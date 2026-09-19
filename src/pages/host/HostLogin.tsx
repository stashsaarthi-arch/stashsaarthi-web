import React, { useState } from 'react';
import { ArrowRight, Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function HostLogin() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Partner with StashSaarthi</h1>
            <p className="text-sm text-muted-foreground">Join our network of verified premium hosts and earn tech-enabled passive income.</p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-5">
              <div className="space-y-2 text-left">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-24 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-slate-500 transition-all"
                    placeholder="Enter 10 digit number"
                  />
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-slate-400 pl-1 pr-2 border-r border-white/10 mr-2 text-sm">+91</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => phone.length === 10 && setStep('otp')}
                disabled={phone.length !== 10}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-amber-950 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Send OTP
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <button 
                onClick={() => setStep('phone')}
                className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors mb-4"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              <div className="space-y-2 text-left">
                <label htmlFor="otp" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Enter OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-slate-500 transition-all tracking-[0.5em] font-mono text-lg text-center"
                    placeholder="••••••"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Code sent to +91 {phone}</p>
              </div>
              <Link
                to="/host/dashboard"
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-amber-950 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                style={{ opacity: otp.length === 6 ? 1 : 0.5, pointerEvents: otp.length === 6 ? 'auto' : 'none' }}
              >
                Verify & Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
