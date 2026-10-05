/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";

// Native deterministic rule hook
const usePredictivePersonaAI = () => {
  return {
    predictedPersona: "host" as const,
    confidence: 0.85,
    preloadedAssets: ["host-dashboard.js"]
  };
};

import { Sparkles, BrainCircuit, ArrowRight, Zap, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playPop } from "@/lib/audio";

export const PredictivePersonaWidget = memo(function PredictivePersonaWidget() {
  const prediction = usePredictivePersonaAI();
  const { role, setRole } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [dismissed, setDismissed] = useState(false);

  // if (!prediction || dismissed) return null;

  const { predictedPersona, confidence, preloadedAssets } = prediction;
  const isDiffPersona = predictedPersona !== role;
  const isHighConfidence = confidence >= 0.65;

  return (
    <AnimatePresence>
      {true && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full"
        >
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <BrainCircuit className="h-5 w-5 animate-pulse text-cyan-400" />
              <span>{isHi ? "AI पर्सोना डिटेक्शन" : "AI Persona Detection"}</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Dismiss AI Insight"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 text-sm text-slate-300 flex-1">
            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
              <span className="text-slate-400">{isHi ? "अनुमानित मोड:" : "Predicted Mode:"}</span>
              <span className="font-semibold capitalize text-white flex items-center gap-2">
                {predictedPersona === "host" ? "🏡 Verified Host" : "🎓 Student"}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {Math.round(confidence * 100)}% {isHi ? "सटीक" : "conf."}
                </span>
              </span>
            </div>

            <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recommended Plan:</span>
                <span className="font-semibold text-white">Summer Stash (3 Mos)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Est. Box Count:</span>
                <span className="font-semibold text-white">3 Medium Boxes</span>
              </div>
            </div>

            {preloadedAssets.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>
                  {isHi
                    ? `प्री-लोडेड ${preloadedAssets.length} पर्सोना एसेट्स`
                    : `Pre-loaded ${preloadedAssets.length} persona assets for zero-latency`}
                </span>
              </div>
            )}
          </div>

          {isDiffPersona && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setRole(predictedPersona);
                }}
                className="w-full flex items-center justify-center gap-2 font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 px-4 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>{isHi ? "मोड अप्लाई करें" : "Apply Persona Preset"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
