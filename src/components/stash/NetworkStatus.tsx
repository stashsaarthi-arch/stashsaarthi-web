import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const { language } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOffline = () => {
      setIsOffline(true);
      toast.error(isHi ? "ऑफ़लाइन मोड सक्रिय" : "Offline Mode Activated", {
        description: isHi
          ? "आप इंटरनेट से डिस्कनेक्ट हैं। सुरक्षित डेटा और स्टैशपास अभी भी ऑफ़लाइन उपलब्ध हैं।"
          : "You're disconnected. Cached campus data and StashPass are still available offline.",
        duration: 5000,
      });
    };

    const handleOnline = () => {
      setIsOffline(false);
      toast.success(isHi ? "इंटरनेट कनेक्शन बहाल" : "Connection Restored", {
        description: isHi
          ? "लाइव स्टैशसारथी कैंपस नोड्स के साथ पुनः समन्वयित।"
          : "Re-synced with live StashSaarthi campus nodes.",
        duration: 3000,
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isHi]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-amber-500/90 text-black py-2 px-4 text-xs font-bold shadow-lg backdrop-blur-md"
        >
          <WifiOff className="h-4 w-4" />
          <span>
            {isHi
              ? "आप वर्तमान में ऑफ़लाइन ब्राउज़ कर रहे हैं। पुनः कनेक्ट होने पर लाइव आरक्षण सिंक हो जाएंगे।"
              : "You are currently browsing offline. Live node reservations will sync upon reconnecting."}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
