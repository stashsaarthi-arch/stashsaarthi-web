import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, GraduationCap, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./AuthButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { smoothScrollTo } from "./legal";
import { useLanguage } from "@/context/LanguageContext";
import type { Role } from "./types";

const NAV_LINKS = [
  {
    key: "stash",
    href: "#stash",
    icon: "🎒",
    labelEn: "Micro-Storage",
    labelHi: "लगेज स्टोरेज",
    descEn: "From ₹300/bag/mo",
    descHi: "₹300/बैग से शुरू",
  },
  {
    key: "rooms",
    href: "#rooms",
    icon: "🏠",
    labelEn: "Verified Rooms",
    labelHi: "सत्यापित कमरे",
    descEn: "0% Brokerage stays",
    descHi: "शून्य ब्रोकरेज आवास",
  },
  {
    key: "kitchen",
    href: "#kitchen",
    icon: "🍲",
    labelEn: "Ghar Ka Khana",
    labelHi: "घर का खाना",
    descEn: "Homestyle tiffins ₹90",
    descHi: "घर जैसा शुद्ध भोजन",
  },
  {
    key: "calculator",
    href: "#calculator",
    icon: "🧮",
    labelEn: "Savings Simulator",
    labelHi: "बचत कैलकुलेटर",
    descEn: "Instant profit/savings",
    descHi: "बचत व कमाई का हिसाब",
  },
  {
    key: "trust",
    href: "#trust",
    icon: "🛡️",
    labelEn: "Safety & Custody",
    labelHi: "सुरक्षा व कस्टडी",
    descEn: "QR seals & ₹10k cover",
    descHi: "QR सील व ₹10k बीमा",
  },
  {
    key: "faq",
    href: "#faq",
    icon: "❓",
    labelEn: "FAQ & Help",
    labelHi: "अक्सर पूछे जाने वाले सवाल",
    descEn: "24×7 Answers",
    descHi: "पारदर्शी उत्तर",
  },
];

export function Navbar({
  role,
  setRole,
  onBook,
  onListRoom,
  onEarlyAccess,
  onRefer,
}: {
  role: Role;
  setRole: (r: Role) => void;
  onBook: () => void;
  onListRoom: () => void;
  onEarlyAccess?: () => void;
  onRefer?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0D0F]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80"
          : "bg-[#0A0D0F]/70 backdrop-blur-md border-b border-white/[0.04]"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-1 sm:gap-4 transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-15 sm:h-20"
        }`}
      >
        {/* 1. Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 shrink-0 cursor-pointer group bg-transparent border-0 p-0 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
            onClick={() => smoothScrollTo("top")(undefined as any)}
            aria-label="Scroll to top of page"
            title="StashSaarthi - Back to top"
          >
            <BrandLogo height={28} className="h-6 sm:h-7 md:h-8 w-auto" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 shrink-0">
            {NAV_LINKS.map((l) => {
              const label = isHi ? l.labelHi : l.labelEn;

              return (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(l.href.replace(/^#/, ""))(e);
                  }}
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground shrink-0 flex items-center gap-1"
                >
                  <span className="text-xs">{l.icon}</span>
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* 2. Right: Action Controls (Responsive & Mobile Fitted) */}
        <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-3 shrink-0">
          {/* Persona Toggle on Desktop */}
          <div className="hidden 2xl:flex items-center p-0.5 bg-[#161B22] border border-slate-700/60 rounded-full shrink-0">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                role === "student"
                  ? "bg-emerald-500 text-black shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🎓</span>
              <span>{isHi ? "छात्र" : "Student"}</span>
              <span className="opacity-80 text-[10px]">{isHi ? "₹6.4k बचत" : "Save ₹6.4k"}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("host")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                role === "host"
                  ? "bg-amber-500 text-black shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏡</span>
              <span>{isHi ? "होस्ट" : "Host"}</span>
              <span className="opacity-80 text-[10px]">{isHi ? "₹11.5k आय" : "Earn ₹11.5k"}</span>
            </button>
          </div>

          {/* Compact Language Switcher */}
          <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-1.5 py-0.5 text-[9px] sm:text-xs font-bold transition-colors ${
                language === "en"
                  ? "bg-white/15 text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`rounded-full px-1.5 py-0.5 text-[9px] sm:text-xs font-bold transition-colors ${
                language === "hi"
                  ? "bg-white/15 text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              HI
            </button>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden lg:block shrink-0">
            <AuthButton compact />
          </div>

          {/* Desktop Early Access / Demo CTA */}
          {onEarlyAccess && (
            <button
              type="button"
              onClick={onEarlyAccess}
              className="hidden 2xl:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              <span>⚡</span>
              <span>{isHi ? "अर्ली एक्सेस" : "Early Access"}</span>
            </button>
          )}

          {/* WhatsApp Referral Trigger */}
          {onRefer && (
            <button
              type="button"
              onClick={onRefer}
              className="hidden 2xl:inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-2.5 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-all shrink-0 cursor-pointer active:scale-95"
              title={isHi ? "व्हाट्सएप पर शेयर करें" : "Refer & Share on WhatsApp"}
            >
              <span>🎁</span>
              <span>{isHi ? "रेफर करें" : "Refer"}</span>
            </button>
          )}

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={role === "student" ? onBook : onListRoom}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              role === "student"
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 active:scale-95"
                : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95"
            }`}
          >
            {role === "student"
              ? isHi
                ? "इकोसिस्टम देखें"
                : "Explore"
              : isHi
                ? "कमरा लिस्ट करें"
                : "List Space"}
          </button>

          {/* Mobile Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/10 shrink-0 p-0 ml-0.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-t border-slate-800/80 flex flex-col gap-2 px-4 py-4 xl:hidden bg-[#0A0D0F]/98 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            {/* Mobile Persona Switcher in Menu */}
            <div className="p-1 bg-[#161B22] border border-slate-700/60 rounded-xl flex items-center gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  setOpen(false);
                }}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "student"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>{isHi ? "छात्र मोड" : "Student Mode"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("host");
                  setOpen(false);
                }}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "host"
                    ? "bg-amber-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <HeartHandshake className="h-4 w-4" />
                <span>{isHi ? "सीनियर होस्ट" : "Senior Host"}</span>
              </button>
            </div>

            {/* Mobile Language Switcher in Menu */}
            <div className="p-1 bg-[#161B22] border border-slate-700/60 rounded-xl flex items-center gap-1 mb-2">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  language === "en"
                    ? "bg-white/15 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  language === "hi"
                    ? "bg-white/15 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Structured Navigation Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((l) => {
                const label = isHi ? l.labelHi : l.labelEn;
                const desc = isHi ? l.descHi : l.descEn;

                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={(e) => {
                      setOpen(false);
                      smoothScrollTo(l.href.replace(/^#/, ""))(e);
                    }}
                    className="flex flex-col items-start rounded-xl p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left cursor-pointer active:scale-98"
                  >
                    <span className="text-base mb-1">{l.icon}</span>
                    <span className="text-xs font-bold text-white">{label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth & Priority CTAs */}
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
              {onEarlyAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onEarlyAccess();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  <span>⚡</span>
                  <span>
                    {isHi
                      ? "प्राथमिकता अर्ली एक्सेस लें"
                      : "Get Priority Early Access"}
                  </span>
                </button>
              )}
              {onRefer && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onRefer();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-all cursor-pointer"
                >
                  <span>🎁</span>
                  <span>
                    {isHi
                      ? "व्हाट्सएप पर रेफर व शेयर करें"
                      : "Refer & Share on WhatsApp"}
                  </span>
                </button>
              )}
              <div className="px-1">
                <AuthButton compact />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
