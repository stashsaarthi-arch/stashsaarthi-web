import React from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TamperHologramProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const TamperHologramProtocolModal: React.FC<TamperHologramProtocolModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-white mb-4">Tamper Hologram</h2>
        <button
          onClick={async () => {
            const { error } = await supabase.from('damage_reports').insert({ notes: "Hologram verified" });
            if (error) toast.error("Error submitting");
            else toast.success("Verified");
            onClose();
          }}
          className="w-full py-2 bg-emerald-500 text-black font-bold rounded-full mb-2"
        >
          Verify
        </button>
        <button onClick={onClose} className="w-full py-2 bg-white/10 text-white font-bold rounded-full">Close</button>
      </div>
    </div>
  );
};
