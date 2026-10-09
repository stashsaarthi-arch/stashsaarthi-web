import { useEffect, useState, useRef } from "react";
import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "@/assets/saarthi.avatar.json";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Need to typecast or pass unknown definition if not perfectly matching library types
const MascotAvatar = createAvatar(definition as any);

export function MascotGuide() {
  const [minimized, setMinimized] = useState(false);
  const [expression, setExpression] = useState("sleepy-squint");
  const [speech, setSpeech] = useState("Hey Kanpur! Looking for safe luggage storage?");
  
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      setExpression("drowsy-closed");
    }, 30000);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setExpression("joyful-wide");
    } else {
      setTimeout(() => {
        setExpression("neutral");
      }, 1500);
    }
    
    resetIdleTimer();

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#calculator") {
        setSpeech("Slide bags & duration to see your ₹8,000+ savings!");
        setExpression("small-attentive");
      } else if (hash === "#liquidation") {
        setSpeech("Get pre-owned coolers & study tables at 50% off!");
        setExpression("joyful-wide");
      } else if (hash === "#host") {
        setSpeech("Turn empty rooms into ₹10k+/mo passive income.");
        setExpression("joyful-down-right");
      } else {
        setSpeech("Hey Kanpur! Looking for safe luggage storage?");
        setExpression("neutral");
      }
      resetIdleTimer();
    };

    // Listen to changes
    window.addEventListener("hashchange", handleHash);

    const handleCustomNav = (e: Event) => {
      const target = (e as CustomEvent).detail;
      if (target === "calculator") {
        setSpeech("Slide bags & duration to see your ₹8,000+ savings!");
        setExpression("small-attentive");
      } else if (target === "liquidation") {
        setSpeech("Get pre-owned coolers & study tables at 50% off!");
        setExpression("joyful-wide");
      } else if (target === "host") {
        setSpeech("Turn empty rooms into ₹10k+/mo passive income.");
        setExpression("joyful-down-right");
      } else {
        setSpeech("Hey Kanpur! Looking for safe luggage storage?");
        setExpression("neutral");
      }
      resetIdleTimer();
    };
    window.addEventListener("stashsaarthi:nav-tab", handleCustomNav);
    
    const handleBooking = () => {
      setExpression("joyful-wide");
      setSpeech("Awesome! Setting up your booking! 🎉");
      resetIdleTimer();
    };
    window.addEventListener("stashsaarthi:open-booking", handleBooking);

    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("stashsaarthi:nav-tab", handleCustomNav);
      window.removeEventListener("stashsaarthi:open-booking", handleBooking);
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  const handleClick = () => {
    setExpression("joyful-wide");
    resetIdleTimer();
    setTimeout(() => {
      setExpression("neutral");
    }, 2000);
  };

  if (minimized) {
    return (
      <button 
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 left-5 z-30 p-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 rounded-full shadow-lg hover:bg-emerald-500/30 transition-colors pointer-events-auto"
        aria-label="Restore mascot helper"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-30 flex items-end gap-2.5 pointer-events-none select-none">
      <div className="flex flex-col gap-2 items-start">
        <AnimatePresence>
          {speech && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white text-xs sm:text-sm p-3 rounded-2xl rounded-bl-none shadow-xl pointer-events-auto max-w-[200px] relative"
            >
              <button 
                onClick={() => setMinimized(true)}
                className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 border border-white/20 hover:bg-slate-700 transition-colors"
                aria-label="Minimize helper"
              >
                <X className="w-3 h-3" />
              </button>
              {speech}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          onClick={handleClick}
          className="pointer-events-auto cursor-pointer w-[65px] md:w-[95px] drop-shadow-2xl transition-transform hover:scale-105"
        >
          <MascotAvatar expression={expression} className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  );
}
