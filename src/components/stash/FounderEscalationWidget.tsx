import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Mail, Phone, X, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import {
  FOUNDER_WHATSAPP,
  FOUNDER_PHONE_DISPLAY,
  FOUNDER_EMAIL,
  FOUNDER_LINKEDIN,
  getWhatsAppUrl,
} from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { smoothScrollTo } from "./legal";

export function FounderEscalationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isHi = language === "hi";

  const handleWhatsApp = (topic: string) => {
    const url = getWhatsAppUrl(topic, FOUNDER_WHATSAPP);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0A0D0F]/95 p-4 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow:
                "0 20px 40px -10px rgba(0,0,0,0.9), 0 0 30px -10px rgba(16, 185, 129, 0.15)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/founder_advik.jpg"
                  alt="Advik Omer"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 rounded-xl object-cover border border-neutral-700 aspect-square"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">Advik Omer</h4>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    {isHi ? "संस्थापक • 15 मिनट SLA" : "Founder • 15-Min Response SLA"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close founder widget"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
              {isHi
                ? "कोई बोट नहीं। यदि आपके पास सुरक्षा, नोड्स या बुकिंग के बारे में कोई सीधा सवाल है, तो सीधे मुझसे बात करें।"
                : "No chatbots or waitlists. If you have a question about security, Kanpur nodes, or booking guarantees, message me directly."}
            </p>

            {/* Quick Actions */}
            <div className="mt-3.5 space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  handleWhatsApp(
                    isHi
                      ? "नमस्ते Advik, मैं StashSaarthi के बारे में सीधा सवाल पूछना चाहता/चाहती हूं।"
                      : "Hi Advik, I have a direct question about StashSaarthi.",
                  )
                }
                className="w-full flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-left text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{isHi ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp"}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80">
                  {FOUNDER_PHONE_DISPLAY}
                </span>
              </button>

              <a
                href={`mailto:${FOUNDER_EMAIL}?subject=Direct%20Question%20for%20Founder`}
                className="w-full flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-left text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{isHi ? "सीधा ईमेल भेजें" : "Direct Email"}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">{FOUNDER_EMAIL}</span>
              </a>

              <a
                href="#feedback"
                onClick={(e) => {
                  smoothScrollTo("feedback")(e);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-2.5 text-left text-xs font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-xs">⭐</span>
                  <span>{isHi ? "रिव्यू या सुधार का सुझाव दें" : "Give Review & Suggestions"}</span>
                </div>
                <span className="text-[10px] font-mono text-yellow-400/80">#feedback</span>
              </a>

              <a
                href={FOUNDER_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-left text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold text-xs">in</span>
                  <span>{isHi ? "लिंक्डइन पर जुड़ें" : "Connect on LinkedIn"}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400/80">/in/advik-omer</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full border border-neutral-800 bg-[#0A0D0F]/90 px-3.5 py-2 shadow-xl backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-black hover:shadow-emerald-500/10 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>

        <span className="text-xs font-medium text-slate-300 group-hover:text-white">
          {isHi ? "सीधा सवाल? " : "Direct question? "}
          <strong className="font-semibold text-emerald-400">
            {isHi ? "फाउंडर से पूछें" : "Chat with the builder."}
          </strong>
        </span>

        <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">
          💬
        </span>
      </button>
    </div>
  );
}
