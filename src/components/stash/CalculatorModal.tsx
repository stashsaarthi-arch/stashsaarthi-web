import { X } from "lucide-react";
import { CalculatorHub } from "./CalculatorHub";
import { Suspense } from "react";

export function CalculatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0A0D0F] border-l border-white/10 w-full h-full md:max-w-xl md:rounded-3xl md:h-[90vh] p-6 shadow-2xl z-10 slide-in-from-right-8 animate-in duration-300 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-emerald-400">⚡ Vacation Savings Simulator</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <Suspense fallback={<div className="text-center text-white/50">Loading Simulator...</div>}>
          <CalculatorHub onBook={() => {}} />
        </Suspense>
      </div>
    </div>
  );
}
