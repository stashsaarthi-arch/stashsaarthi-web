import React from "react";
export function BarcodeScanStressModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-white mb-4">Scan Barcode</h2>
        <input type="file" accept="image/*" capture="environment" className="mb-4 text-white w-full" />
        <button onClick={onClose} className="w-full py-2 bg-emerald-500 text-black font-bold rounded-full">Close</button>
      </div>
    </div>
  );
}
