import { memo, useState } from "react";
import { usePredictivePersonaAI } from "@/lib/predictiveAI";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, BrainCircuit, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playPop } from "@/lib/audio";

export const PredictivePersonaWidget = memo(function PredictivePersonaWidget() {
  const prediction = usePredictivePersonaAI();
  const { role, setRole } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [dismissed, setDismissed] = useState(false);

  if (!prediction || dismissed) return null;

  const { predictedPersona, confidence, preloadedAssets } = prediction;
  const isDiffPersona = predictedPersona !== role;
  const isHighConfidence = confidence >= 0.65;

  return (
    <AnimatePresence>
      {isHighConfidence && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="fixed bottom-20 right-5 z-40 max-w-xs rounded-2xl border border-emerald-500/30 bg-[#0A0D0F]/95 p-3.5 shadow-2xl backdrop-blur-xl pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <BrainCircuit className="h-4 w-4 animate-pulse text-cyan-400" />
              <span>{isHi ? "प्रेडिक्टिव AI पर्सोना इंसाइट" : "Predictive AI Persona"}</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white text-xs px-1"
              aria-label="Dismiss AI Insight"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isHi ? "अनुमानित मोड:" : "Predicted Role:"}</span>
              <span className="font-semibold capitalize text-white flex items-center gap-1">
                {predictedPersona === "host" ? "🏡 Verified PG Owner Host" : "🎓 Student"}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {Math.round(confidence * 100)}% {isHi ? "सटीकता" : "conf."}
                </span>
              </span>
            </div>

            {preloadedAssets.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-cyan-300">
                <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                <span>
                  {isHi
                    ? `प्री-लोडेड ${preloadedAssets.length} संपत्तियां`
                    : `Pre-loaded ${preloadedAssets.length} persona assets`}
                </span>
              </div>
            )}

            {isDiffPersona && (
              <div className="pt-1.5 border-t border-white/10 mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isHi ? "स्विच करने की अनुशंसा:" : "Switch persona view?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setRole(predictedPersona);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 px-2.5 py-1 rounded-full shadow-md transition-transform active:scale-95"
                >
                  <Zap className="h-3 w-3" />
                  <span>{isHi ? "स्वीकार करें" : "Adapt View"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
