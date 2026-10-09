import { X } from "lucide-react";
import { TrustConsoleHub } from "./TrustConsoleHub";
import { Suspense } from "react";

export function ForumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0A0D0F] border border-white/10 w-full max-w-4xl rounded-3xl max-h-[90vh] shadow-2xl z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏛️</span> Student Council Resolutions & Safety Charter
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 md:p-6 flex-1">
          <Suspense fallback={<div className="text-center text-white/50">Loading Council Data...</div>}>
            <TrustConsoleHub />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
