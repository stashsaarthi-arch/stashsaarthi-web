import React from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DamageClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const DamageClaimsModal: React.FC<DamageClaimsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-white mb-4">Damage Claim</h2>
        <button
          onClick={async () => {
            const { error } = await supabase.from('damage_reports').insert({ notes: "Damage claimed" });
            if (error) toast.error("Error submitting claim");
            else toast.success("Claim submitted");
            onClose();
          }}
          className="w-full py-2 bg-rose-500 text-white font-bold rounded-full mb-2"
        >
          Submit Claim
        </button>
        <button onClick={onClose} className="w-full py-2 bg-white/10 text-white font-bold rounded-full">Close</button>
      </div>
    </div>
  );
};
