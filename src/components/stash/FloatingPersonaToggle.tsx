import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { GraduationCap, HeartHandshake } from "lucide-react";

export function FloatingPersonaToggle() {
  const { role, setRole } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-[#0A0D0F]/90 p-1.5 shadow-2xl backdrop-blur-xl pointer-events-auto">
      <button
        type="button"
        onClick={() => setRole("student")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          role === "student"
            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>{isHi ? "छात्र मोड" : "Student Mode"}</span>
      </button>

      <button
        type="button"
        onClick={() => setRole("host")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          role === "host"
            ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <HeartHandshake className="h-3.5 w-3.5" />
        <span>{isHi ? "सीनियर होस्ट" : "Senior Host"}</span>
      </button>
    </div>
  );
}
