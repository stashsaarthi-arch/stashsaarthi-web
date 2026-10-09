import { useEffect, useState } from "react";
import { X, Package, Zap, Utensils, Home, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MascotGuideProps {
  activeTab?: "storage" | "rooms" | "khana";
  calculatorOpen?: boolean;
  forumOpen?: boolean;
}

export function MascotGuide({ activeTab = "storage", calculatorOpen = false, forumOpen = false }: MascotGuideProps) {
  const [bubbleHidden, setBubbleHidden] = useState(false);
  const [speech, setSpeech] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 4000 + 2000); // Blink every 2-6 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (activeTab === "storage") {
      setSpeech("Stash bags at ₹300/mo with tamper-proof QR seals. Tap me if you need help!");
    } else if (activeTab === "rooms") {
      setSpeech("Graduating or moving? Check 50% off coolers & tables before buying new!");
    } else if (activeTab === "khana") {
      setSpeech("1 Token = ₹1. Eat only when you want—zero wasted monthly mess fees.");
    }
    setBubbleHidden(false);
  }, [activeTab]);

  const handleAction = (actionId: string) => {
    setDrawerOpen(false);
    if (actionId === 'calculator') {
      window.dispatchEvent(new Event("stashsaarthi:open-calculator"));
    } else if (actionId === 'storage') {
      window.dispatchEvent(new CustomEvent("stashsaarthi:nav-tab", { detail: 'storage' }));
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
      }, 300);
    } else if (actionId === 'khana') {
      window.dispatchEvent(new CustomEvent("stashsaarthi:nav-tab", { detail: 'khana' }));
    } else if (actionId === 'rooms') {
      window.dispatchEvent(new CustomEvent("stashsaarthi:nav-tab", { detail: 'rooms' }));
    } else if (actionId === 'whatsapp') {
      window.open('https://wa.me/919369454350?text=Hey,%20I%20need%20help%20with%20StashSaarthi!', '_blank');
    }
  };

  return (
    <>
      {/* 
        SAARTHI QUICK HELP DRAWER (Slide Over)
      */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-sm bg-[#0A0D0F] border-l border-white/10 h-full shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Saarthi Assistant</h2>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <button onClick={() => handleAction('storage')} className="w-full group text-left p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all flex items-start gap-4">
                    <Package className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">How do I store my luggage?</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">See the 3-step secure custody tagging process.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 shrink-0" />
                  </button>
                  
                  <button onClick={() => handleAction('calculator')} className="w-full group text-left p-4 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all flex items-start gap-4">
                    <Zap className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Calculate my vacation rent savings</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">Interactive simulator for zero dead-rent.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-400 shrink-0" />
                  </button>

                  <button onClick={() => handleAction('khana')} className="w-full group text-left p-4 rounded-2xl bg-white/5 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all flex items-start gap-4">
                    <Utensils className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">How do flexi-meal tokens work?</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">0 monthly mess lock-in + 1 tap recharge.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 shrink-0" />
                  </button>
                  
                  <button onClick={() => handleAction('rooms')} className="w-full group text-left p-4 rounded-2xl bg-white/5 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all flex items-start gap-4">
                    <Home className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">How do I visit a zero-brokerage room?</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">Verified listings in Kakadeo & Kalyanpur.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 shrink-0" />
                  </button>

                  <button onClick={() => handleAction('whatsapp')} className="w-full group text-left p-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all flex items-start gap-4 mt-8">
                    <MessageCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-emerald-300">Direct WhatsApp Founder Desk</h4>
                      <p className="text-xs text-emerald-300/70 mt-1 leading-relaxed">One-tap direct human help via WhatsApp.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        MASCOT BADGE & BUBBLE
      */}
      <div className="fixed bottom-5 left-4 z-40 flex items-end gap-3 pointer-events-none select-none">
        <div className="flex flex-col gap-2 items-start relative">
          <AnimatePresence>
            {!bubbleHidden && speech && !calculatorOpen && !drawerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md text-slate-100 text-xs p-3.5 rounded-2xl rounded-bl-none shadow-2xl pointer-events-auto max-w-[250px] mb-2 relative font-medium leading-relaxed"
              >
                <button 
                  onClick={() => setBubbleHidden(true)}
                  className="absolute -top-2.5 -right-2.5 bg-slate-800 text-white rounded-full p-1 border border-emerald-500/30 hover:bg-slate-700 transition-colors shadow-xl"
                  aria-label="Hide bubble"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {speech}
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Assistant"
            className="pointer-events-auto cursor-pointer group relative block"
          >
            {/* Emerald Glowing Aura */}
            <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-xl group-hover:bg-emerald-400/40 transition-colors duration-500" />
            
            {/* The Badge Container (Soft-square 72x72 Desktop, 58x58 Mobile) */}
            <div className="w-[58px] h-[58px] md:w-[72px] md:h-[72px] bg-gradient-to-b from-[#1a1f26] to-[#0A0D0F] border border-white/10 group-hover:border-emerald-500/50 rounded-[1.2rem] shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300">
              
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              {/* Animated SVG Strobi/Cubee Character */}
              <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-lg">
                <motion.g 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  {/* Body/Head */}
                  <rect x="20" y="25" width="60" height="45" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
                  
                  {/* Glass Screen */}
                  <rect x="25" y="30" width="50" height="25" rx="6" fill="#1e293b" />
                  
                  {/* Eyes (Blinking Logic) */}
                  <g fill="#34d399">
                    {isBlinking ? (
                      <>
                        <rect x="35" y="42" width="10" height="2" rx="1" />
                        <rect x="55" y="42" width="10" height="2" rx="1" />
                      </>
                    ) : (
                      <>
                        <circle cx="40" cy="42" r="4" />
                        <circle cx="60" cy="42" r="4" />
                      </>
                    )}
                  </g>
                  
                  {/* Cute Antenna */}
                  <line x1="50" y1="25" x2="50" y2="15" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="50" cy="12" r="3" fill="#34d399" />
                  <motion.circle 
                    cx="50" cy="12" r="5" 
                    fill="none" stroke="#34d399" strokeWidth="1"
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  
                  {/* Arms */}
                  <path d="M 20 45 Q 10 50 15 60" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 80 45 Q 90 50 85 60" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
                
                {/* Ground Shadow */}
                <ellipse cx="50" cy="85" rx="20" ry="4" fill="#000000" opacity="0.4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
