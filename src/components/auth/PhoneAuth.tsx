import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { Smartphone, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { AadhaarKycModal } from "@/components/host/AadhaarKycModal";

export function PhoneAuth() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return setError("Enter a valid 10-digit number");
    if (!email || !email.includes("@")) return setError("Enter a valid email address");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      // 1. Try to login
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials") || signInError.message.toLowerCase().includes("not found") || signInError.status === 400) {
          // 2. Fallback to signup if account doesn't exist
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { phone: `+91${cleanPhone}` }
            }
          });
          if (signUpError) throw signUpError;
        } else {
          throw signInError;
        }
      }

      // Success - Immediately transition into KYC Upload Step!
      setShowKycModal(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10">
      {/* Ambient Apple Depth Glow strictly behind the auth container */}
      <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] -z-10 pointer-events-none rounded-[2rem]" />

      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-500"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-24 pr-6 py-4 bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-500"
                  placeholder="Enter 10 digit number"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                  <span className="text-slate-400 pl-2 pr-3 border-r border-white/10 mr-2 text-sm font-medium">
                    +91
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-2">
                Password / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-500"
                  placeholder="6-character PIN"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 10 || !email.includes("@") || password.length < 6}
            className="bg-emerald-500 text-black font-bold rounded-full py-4 w-full hover:bg-emerald-400 active:scale-95 transition-all ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue & Verify
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
      
      <AadhaarKycModal 
        isOpen={showKycModal}
        onClose={() => navigate({ to: "/host/dashboard" })}
        onSuccess={() => navigate({ to: "/host/dashboard" })}
      />
    </div>
  );
}
