import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, Lock, PackageCheck } from "lucide-react";

const StashTimeline = lazy(() =>
  import("./StashTimeline").then((m) => ({ default: m.StashTimeline })),
);

export function StorageServiceTab({ onBook }: { onBook: () => void }) {
  return (
    <div className="w-full space-y-8 pb-10">
      {/* Block A & B: Pricing and Booking form combined */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold mb-4">
              STUDENT FAVORITE
            </div>
            <h2 className="text-4xl font-black text-white mb-2">₹300<span className="text-lg text-white/60">/bag/mo</span></h2>
            <p className="text-white/80 mb-6 font-medium">Zero-CapEx Micro-Storage for Vacations</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent('stashsaarthi:open-calculator'))} className="w-full flex items-center justify-center gap-2 mb-6 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-xl hover:bg-amber-500/20 transition-colors">
              <span className="text-lg">⚡</span> Calculate My Vacation Savings <span className="hidden sm:block text-[10px] text-amber-500/70 ml-2">(See ₹8,000+ Dead-Rent Reduction)</span>
            </button>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Truck className="w-5 h-5 text-emerald-400" /> Free Doorstep Pickup & Drop
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> ₹10,000 Verified Safety Cover
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Lock className="w-5 h-5 text-emerald-400" /> Tamper-Proof QR Seals
              </li>
            </ul>
          </div>
          <button 
            onClick={() => onBook()}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Book Pickup / Reserve Slot
          </button>
        </div>
        
        <div className="bg-[#0A0D0F] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
          <h3 className="text-2xl font-bold text-white mb-4">Don't carry heavy luggage.</h3>
          <p className="text-white/60 mb-6 max-w-sm relative z-10">Reserve your slot now before the vacation rush. Only limited hostel-approved stash nodes available.</p>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 z-10 relative">
            <PackageCheck className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-[#0A0D0F] border border-white/10 rounded-3xl p-6 md:p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-3xl" />
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Custody Tracking</h3>
        <p className="text-white/60 mb-6 text-sm relative z-10">100% Radical Transparency. Track your luggage at every stage.</p>
        <Suspense fallback={<div className="min-h-[300px] text-center flex items-center justify-center text-white/50">Loading Tracker...</div>}>
          <div className="-mx-4 sm:mx-0">
            <StashTimeline />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
