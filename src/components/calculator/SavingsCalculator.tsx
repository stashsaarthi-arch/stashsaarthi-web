import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import * as z from "zod";

// Zod Schema for strict typing
const leadSchema = z.object({
  items: z.number().min(1),
  durationMonths: z.number().min(1),
  estimatedPrice: z.number().min(0),
  savings: z.number().min(0),
});

type LeadData = z.infer<typeof leadSchema>;

// Verified Kanpur Unit Economics
const PRICE_PER_BAG = 300;
const COMPETITOR_PRICE = 800; // Estimated generic warehousing competitor

export function SavingsCalculator() {
  const [items, setItems] = useState(2);
  const [duration, setDuration] = useState(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Motion values for real-time fluid number ticking
  const animatedCost = useMotionValue(items * duration * PRICE_PER_BAG);
  const animatedSavings = useMotionValue(items * duration * (COMPETITOR_PRICE - PRICE_PER_BAG));

  const displayCost = useTransform(animatedCost, (value) => `₹${Math.round(value).toLocaleString()}`);
  const displaySavings = useTransform(animatedSavings, (value) => `₹${Math.round(value).toLocaleString()}`);

  // Animate the ticking numbers whenever the sliders change
  useEffect(() => {
    const cost = items * duration * PRICE_PER_BAG;
    const savings = items * duration * (COMPETITOR_PRICE - PRICE_PER_BAG);
    
    animate(animatedCost, cost, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    animate(animatedSavings, savings, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  }, [items, duration, animatedCost, animatedSavings]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const leadData: LeadData = {
      items,
      durationMonths: duration,
      estimatedPrice: items * duration * PRICE_PER_BAG,
      savings: items * duration * (COMPETITOR_PRICE - PRICE_PER_BAG)
    };

    // 1. Zod Validation before backend hit
    const parsed = leadSchema.safeParse(leadData);
    if (!parsed.success) {
      setError("Invalid calculation data.");
      setLoading(false);
      return;
    }

    // 2. Push to Supabase Engine
    try {
      const { error: dbError } = await supabase.from('stash_leads').insert([{
        items: parsed.data.items,
        duration_months: parsed.data.durationMonths,
        estimated_price: parsed.data.estimatedPrice,
        savings: parsed.data.savings,
        created_at: new Date().toISOString()
      }]);

      if (dbError) throw dbError;
      
      // 3. Trigger UI success state
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to secure stash. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-transparent p-4 flex items-center justify-center relative z-10">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-student-primary mb-2 text-center" style={{ fontFamily: 'GTA6-Heading' }}>Savings Matrix</h2>
            <p className="text-white/60 text-center mb-8">Calculate your dead-rent savings instantly.</p>

            <div className="space-y-8">
              <FramerSlider label="Number of Bags/Boxes" min={1} max={10} value={items} onChange={setItems} suffix=" items" />
              <FramerSlider label="Storage Duration" min={1} max={12} value={duration} onChange={setDuration} suffix=" months" />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-white/60 text-sm mb-1">Total Cost</p>
                <motion.p className="text-2xl font-bold text-white tracking-tight">{displayCost}</motion.p>
              </div>
              <div className="bg-student-primary/10 rounded-2xl p-4 border border-student-primary/20 text-center">
                <p className="text-student-primary/80 text-sm mb-1 font-semibold uppercase tracking-wider text-[10px]">Total Savings</p>
                <motion.p className="text-2xl font-bold text-student-primary tracking-tight">{displaySavings}</motion.p>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full bg-student-primary text-black font-bold py-4 px-6 rounded-xl transition-all hover:bg-white hover:text-black hover:scale-[1.02] transform-gpu disabled:opacity-50 shadow-[0_0_20px_rgba(0,245,160,0.2)]"
            >
              {loading ? "Calculating Lead..." : "Secure My Stash"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-student-primary/30 rounded-3xl p-10 shadow-[0_0_50px_-12px_rgba(0,245,160,0.2)] text-center"
          >
            <div className="w-20 h-20 bg-student-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-student-primary/40">
              <svg className="w-10 h-10 text-student-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'GTA6-Heading' }}>Stash Secured</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Your savings have been locked in the matrix. Our logistics team will contact you shortly.</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors w-full"
            >
              Recalculate Matrix
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Premium Framer Motion Fluid Slider Component
function FramerSlider({ label, min, max, value, onChange, suffix }: { label: string, min: number, max: number, value: number, onChange: (val: number) => void, suffix: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  
  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - left) / width));
    const newValue = Math.round(min + percent * (max - min));
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default to stop scrolling on mobile while sliding
    e.preventDefault();
    updateValue(e.clientX);
    
    const handlePointerMove = (ev: PointerEvent) => {
      ev.preventDefault();
      updateValue(ev.clientX);
    };
    
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <span className="text-sm font-bold text-student-primary bg-student-primary/10 px-2 py-1 rounded-md">
          {value}{suffix}
        </span>
      </div>
      <div 
        ref={trackRef}
        className="relative h-3 bg-white/10 rounded-full cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
      >
        {/* Animated Fill Track */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-student-primary rounded-full pointer-events-none"
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
        {/* Animated Knob */}
        <motion.div
          className="absolute top-1/2 -mt-3 -ml-3 w-6 h-6 bg-[#0a0a0a] rounded-full shadow-[0_0_15px_rgba(0,245,160,0.6)] cursor-grab active:cursor-grabbing border-2 border-student-primary flex items-center justify-center pointer-events-none"
          animate={{ left: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
           <div className="w-2 h-2 bg-student-primary rounded-full shadow-[0_0_5px_rgba(0,245,160,0.8)]" />
        </motion.div>
      </div>
    </div>
  );
}
