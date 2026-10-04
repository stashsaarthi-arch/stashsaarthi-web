import React from "react";
interface HostStashVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
}
export const HostStashVerificationModal: React.FC<HostStashVerificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-white mb-4">Host Verification</h2>
        <button onClick={onClose} className="w-full py-2 bg-emerald-500 text-black font-bold rounded-full">Close</button>
      </div>
    </div>
  );
};
