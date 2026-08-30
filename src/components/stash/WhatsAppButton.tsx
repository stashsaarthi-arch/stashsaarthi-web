import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, ShieldAlert, Home, Briefcase } from "lucide-react";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY, getWhatsAppUrl } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import type { OpenBooking } from "./types";

export function WhatsAppButton({ onBook }: { onBook: OpenBooking }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isHi = language === "hi";

  const handleWhatsAppClick = (text: string) => {
    const url = getWhatsAppUrl(text, FOUNDER_WHATSAPP);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-72 overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-1 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow:
                "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(37, 211, 102, 0.2)",
            }}
          >
            <div className="rounded-xl bg-[#25D366]/10 p-4 border border-[#25D366]/20">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isHi ? "त्वरित 24×7 कंसीयज" : "Instant Concierge"}
                  </h4>
                  <p className="text-xs text-[#25D366] font-mono">
                    {FOUNDER_PHONE_DISPLAY} · {isHi ? "औसत उत्तर: 3 मिनट" : "Avg reply: 3 mins"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/5 p-1 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label="Close concierge"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-white/80">
                {isHi ? "आज हम आपकी क्या सहायता कर सकते हैं?" : "How can we help you today?"}
              </p>
            </div>

            <div className="mt-1 flex flex-col gap-1 p-1">
              <button
                onClick={() =>
                  handleWhatsAppClick(
                    isHi
                      ? "नमस्ते StashSaarthi, मैं आपकी सेवाओं के बारे में जानकारी चाहता/चाहती हूं।"
                      : "Hi StashSaarthi, I want to know more about your services.",
                  )
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                {isHi ? "सामान्य पूछताछ व सहायता" : "General Enquiry & Support"}
              </button>
              <button
                onClick={() =>
                  handleWhatsAppClick(
                    isHi
                      ? "नमस्ते StashSaarthi, मैं वेकेशन स्टोरेज स्लॉट सुरक्षित करना चाहता/चाहती हूं।"
                      : "Hi StashSaarthi, I want to reserve a vacation storage spot.",
                  )
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-[#25D366]" />
                {isHi ? "लगेज स्पॉट बुक करें (₹300/माह)" : "Reserve Luggage Spot (₹300/mo)"}
              </button>
              <button
                onClick={() =>
                  handleWhatsAppClick(
                    isHi
                      ? "नमस्ते StashSaarthi, मैं सत्यापित सीनियर-होस्टेड कमरा ढूंढ रहा/रही हूं।"
                      : "Hi StashSaarthi, I'm looking for a verified senior-hosted room.",
                  )
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4 text-[#25D366]" />
                {isHi ? "सत्यापित सीनियर कमरा खोजें" : "Find Verified Senior Room"}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onBook({
                    service: "trust",
                    note: isHi ? "अभिभावक सुरक्षा पूछताछ" : "Parent Safety Inquiry",
                  });
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                {isHi ? "अभिभावक व सुरक्षा हेल्पलाइन" : "Parent & Safety Helpline"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Open WhatsApp concierge"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 blur-md transition-opacity group-hover:opacity-75 group-hover:blur-xl" />
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"
          style={{ animationDuration: "2.5s" }}
        />
        {isOpen ? (
          <X className="relative z-10 h-6 w-6" />
        ) : (
          <MessageCircle className="relative z-10 h-7 w-7" />
        )}
      </button>
    </div>
  );
}
