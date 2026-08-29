import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./AuthButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { smoothScrollTo } from "./legal";
import { useLanguage } from "@/context/LanguageContext";
import type { Role } from "./types";

const LINKS = [
  { key: "ecosystem", href: "#ecosystem" },
  { key: "rooms", href: "#rooms" },
  { key: "stash", href: "#calculator" },
  { key: "connect", href: "#connect" },
  { key: "trust", href: "#trust" },
];

export function Navbar({
  role,
  setRole,
  onBook,
  onListRoom,
}: {
  role: Role;
  setRole: (r: Role) => void;
  onBook: () => void;
  onListRoom: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const DESKTOP_LINKS = LINKS.filter((l) => ["rooms", "stash", "trust"].includes(l.key));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0D0F]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/70"
          : "bg-[#0A0D0F]/45 backdrop-blur-md border-b border-white/[0.04]"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        
        {/* 1. Left: Logo & Desktop nav */}
        <div className="flex items-center gap-6 shrink-0">
          <div 
            className="flex items-center gap-2 shrink-0 cursor-pointer group" 
            onClick={() => smoothScrollTo("top")(undefined as any)}
          >
            <BrandLogo height={38} className="h-8 sm:h-9" />
          </div>
          
          {/* Desktop Nav Links (Consolidated to 3 essential items) */}
          <nav className="hidden xl:flex items-center gap-1">
            {DESKTOP_LINKS.map((l) => {
              const isStash = l.key === "stash";
              const isTrust = l.key === "trust";
              const targetHref = isStash 
                ? (role === "host" ? "#host-earnings-calculator" : "#student-calculator")
                : l.href;
              const buttonText = isStash 
                ? (role === "student" 
                    ? (language === "hi" ? "बचत कैलकुलेटर" : "Savings Calculator") 
                    : (language === "hi" ? "कमाई कैलकुलेटर" : "Earning Simulator"))
                : isTrust 
                  ? (language === "hi" ? "सुरक्षा प्रोटोकॉल" : "Safety Protocol")
                  : t.nav[l.key as keyof typeof t.nav];

              return (
                <a
                  key={l.href}
                  href={targetHref}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(targetHref.replace(/^#/, ""))(e);
                  }}
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {buttonText}
                </a>
              );
            })}
          </nav>
        </div>

        {/* 2. Right: Persona Toggle, Language Switcher, Google Auth, and CTA (Unified, clean container) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          
          {/* Persona Toggle */}
          <div className="flex items-center p-0.5 sm:p-1 bg-[#161B22] border border-slate-700/60 rounded-full shrink min-w-0">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all truncate ${
                role === 'student'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === "hi" ? (
                <>
                  <span className="hidden sm:inline">छात्र: </span>₹6.4k बचाएं
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Student: </span>Save ₹6.4k
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setRole('host')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all truncate ${
                role === 'host'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === "hi" ? (
                <>
                  <span className="hidden sm:inline">होस्ट: </span>₹11.5k कमाएं
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Host: </span>Earn ₹11.5k
                </>
              )}
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 sm:p-1 shrink-0">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-bold transition-colors ${
                language === "en" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-bold transition-colors ${
                language === "hi" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              HI
            </button>
          </div>

          {/* Auth Button for Desktop */}
          <div className="hidden md:block shrink-0">
            <AuthButton compact />
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={role === 'student' ? onBook : onListRoom}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              role === 'student'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 active:scale-95'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95'
            }`}
          >
            {role === 'student' ? t.nav.explore : (language === "hi" ? "कमरा लिस्ट करें" : "List Space")}
          </button>

          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-t border-slate-800/60 flex flex-col gap-1 px-4 py-3 xl:hidden bg-[#0A0D0F]/95 backdrop-blur-xl"
        >
          {LINKS.map((l) => {
            const isStash = l.key === "stash";
            const isTrust = l.key === "trust";
            const targetHref = isStash 
              ? (role === "host" ? "#host-earnings-calculator" : "#student-calculator")
              : l.href;
            const buttonText = isStash 
              ? (role === "student" 
                  ? (language === "hi" ? "बचत कैलकुलेटर" : "Savings Calculator") 
                  : (language === "hi" ? "कमाई कैलकुलेटर" : "Earning Simulator"))
              : isTrust 
                ? (language === "hi" ? "सुरक्षा प्रोटोकॉल" : "Safety Protocol")
                : t.nav[l.key as keyof typeof t.nav];

            return (
              <a
                key={l.href}
                href={targetHref}
                onClick={(e) => {
                  if (isStash) {
                    e.preventDefault();
                    setOpen(false);
                    const targetId = role === "host" ? "host-earnings-calculator" : "student-calculator";
                    const element = document.getElementById(targetId);
                    if (element) {
                      const navHeight = 80;
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                      const offsetPosition = elementPosition - navHeight;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }
                  } else {
                    smoothScrollTo(l.href.slice(1))(e);
                    setOpen(false);
                  }
                }}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {buttonText}
              </a>
            );
          })}
          
          <div className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-2">
            <div className="px-1">
              <AuthButton compact />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
