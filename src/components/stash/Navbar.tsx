import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, GraduationCap, HeartHandshake } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./AuthButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LowDataToggle } from "@/components/ui/LowDataToggle";
import { smoothScrollTo } from "./legal";
import { useLanguage } from "@/context/LanguageContext";
import type { Role } from "./types";
import { StashWalletBadge, ZeroFeeTrialTokenModal } from "./ZeroFeeTrialTokenModal";
import { playTab, playToggle, playConfirm, playMicroClick } from "@/lib/audio";

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

export const Navbar = memo(function Navbar({
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
  onListRoom?: () => void;
  onEarlyAccess?: () => void;
  onRefer?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
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
          ? "dark:bg-[#0A0D0F]/90 bg-white/95 backdrop-blur-2xl dark:border-b dark:border-white/[0.08] border-b border-slate-200/80 shadow-2xl dark:shadow-black/70 shadow-slate-900/5"
          : "dark:bg-[#0A0D0F]/70 bg-white/80 backdrop-blur-md dark:border-b dark:border-white/[0.05] border-b border-slate-200/40"
      }`}
    >
      <div
        className={`max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-4 xl:px-6 w-full flex items-center justify-between gap-1 sm:gap-2 transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-15 sm:h-20"
        }`}
      >
        {/* 1. Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 xl:gap-4 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 shrink-0 cursor-pointer group bg-transparent border-0 p-0 transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F] rounded-lg"
            onClick={() => smoothScrollTo("top")(undefined as any)}
            aria-label="Scroll to top of page"
            title="StashSaarthi - Back to top"
          >
            <BrandLogo height={28} className="h-6 sm:h-7 md:h-8 w-auto" />
          </button>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-0.5 shrink-0">
            {NAV_LINKS.map((l) => {
              const label = isHi ? l.labelHi : l.labelEn;

              return (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    playTab();
                    smoothScrollTo(l.href.replace(/^#/, ""))(e);
                  }}
                  className="whitespace-nowrap rounded-lg px-2 min-[1650px]:px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-white/[0.05] hover:text-foreground shrink-0 flex items-center gap-1.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F]"
                >
                  <span className="text-xs shrink-0" aria-hidden="true">{l.icon}</span>
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* 2. Right: Action Controls (Responsive & Mobile Fitted) */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* Persona Toggle on Desktop */}
          <div role="radiogroup" aria-label="User Persona Selector" className="hidden min-[1650px]:flex items-center p-0.5 bg-white/[0.03] border border-white/[0.08] rounded-full shrink-0 relative backdrop-blur-md shadow-inner">
            <motion.button
              type="button"
              role="radio"
              aria-checked={role === "student"}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playToggle();
                setRole("student");
              }}
              className={`relative px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F] z-10 ${
                role === "student"
                  ? "text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {role === "student" && (
                <motion.span
                  layoutId="navbarPersonaToggle"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-emerald-500 shadow-md -z-10"
                />
              )}
              <span aria-hidden="true">🎓</span>
              <span>{isHi ? "छात्र" : "Student"}</span>
              <span className="opacity-80 text-xs">({isHi ? "₹6.4k बचत" : "Save ₹6.4k"})</span>
            </motion.button>
            <motion.button
              type="button"
              role="radio"
              aria-checked={role === "host"}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playToggle();
                setRole("host");
              }}
              className={`relative px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F] z-10 ${
                role === "host"
                  ? "text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {role === "host" && (
                <motion.span
                  layoutId="navbarPersonaToggle"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-amber-500 shadow-md -z-10"
                />
              )}
              <span aria-hidden="true">🏡</span>
              <span>{isHi ? "होस्ट" : "Host"}</span>
              <span className="opacity-80 text-xs">({isHi ? "₹11.5k आय" : "Earn ₹11.5k"})</span>
            </motion.button>
          </div>

          {/* Compact Language Switcher, Theme Toggle & Sound Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div role="radiogroup" aria-label="Select Language" className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 shrink-0 backdrop-blur-md">
              <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                aria-label="Switch to English"
                onClick={() => {
                  playMicroClick();
                  setLanguage("en");
                }}
                className={`rounded-full px-2 py-0.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 active:scale-[0.98] ${
                  language === "en"
                    ? "bg-white/15 text-white shadow-xs"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={language === "hi"}
                aria-label="Switch to Hindi"
                onClick={() => {
                  playMicroClick();
                  setLanguage("hi");
                }}
                className={`rounded-full px-2 py-0.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 active:scale-[0.98] ${
                  language === "hi"
                    ? "bg-white/15 text-white shadow-xs"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                HI
              </button>
            </div>
            <ThemeToggle compact />
            <LowDataToggle compact />
          </div>

          {/* Stash Wallet Zero-Fee Trial Token Badge (Student Persona only) */}
          {role === "student" && (
            <div className="hidden sm:block shrink-0">
              <StashWalletBadge onClick={() => setShowTrialModal(true)} />
            </div>
          )}

          {/* Desktop Auth Button */}
          <div className="hidden lg:block shrink-0">
            <AuthButton compact />
          </div>

          {/* Desktop Early Access / Demo CTA */}
          {onEarlyAccess && (
            <button
              type="button"
              onClick={onEarlyAccess}
              className="hidden min-[1650px]:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shrink-0 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F]"
            >
              <span aria-hidden="true">⚡</span>
              <span>{isHi ? "अर्ली एक्सेस" : "Early Access"}</span>
            </button>
          )}

          {/* WhatsApp Referral Trigger */}
          {onRefer && (
            <button
              type="button"
              onClick={onRefer}
              className="hidden min-[1650px]:inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-2.5 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all shrink-0 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#25D366]/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0D0F]"
              title={isHi ? "व्हाट्सएप पर शेयर करें" : "Refer & Share on WhatsApp"}
              aria-label={isHi ? "व्हाट्सएप पर शेयर करें" : "Refer & Share on WhatsApp"}
            >
              <span aria-hidden="true">🎁</span>
              <span>{isHi ? "रेफर करें" : "Refer"}</span>
            </button>
          )}

          {/* Become a Host B2B Link */}
          <Link
            to="/host"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 sm:px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all shrink-0 active:scale-[0.98]"
          >
            <span aria-hidden="true">🏠</span>
            <span>{isHi ? "प्रॉपर्टी लिस्ट करें" : "Become a Host"}</span>
          </Link>


          {/* Mobile Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden min-h-[48px] min-w-[48px] h-12 w-12 text-white hover:bg-white/10 shrink-0 p-3 ml-1 flex items-center justify-center rounded-xl cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-drawer"
            role="region"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass border-t border-slate-800/80 flex flex-col gap-2 px-4 py-4 xl:hidden bg-[#0A0D0F]/98 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            {/* Mobile Persona Switcher in Menu */}
            <div className="p-1 bg-[#161B22] border border-slate-700/60 rounded-xl flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  playToggle();
                  setRole("student");
                  setOpen(false);
                }}
                className={`flex-1 min-h-[48px] py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                  playToggle();
                  setRole("host");
                  setOpen(false);
                }}
                className={`flex-1 min-h-[48px] py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === "host"
                    ? "bg-amber-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <HeartHandshake className="h-4 w-4" />
                <span>{isHi ? "सीनियर होस्ट" : "Senior Host"}</span>
              </button>
            </div>

            {/* Mobile Language & Theme Switcher in Menu */}
            <div className="p-1 bg-[#161B22] border border-slate-700/60 rounded-xl flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  playMicroClick();
                  setLanguage("en");
                }}
                className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  language === "en"
                    ? "bg-white/15 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  playMicroClick();
                  setLanguage("hi");
                }}
                className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  language === "hi"
                    ? "bg-white/15 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                हिंदी
              </button>
              <ThemeToggle compact className="shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center" />
              <LowDataToggle compact className="shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center" />
            </div>

            {/* Structured Navigation Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {NAV_LINKS.map((l) => {
                const label = isHi ? l.labelHi : l.labelEn;
                const desc = isHi ? l.descHi : l.descEn;

                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={(e) => {
                      playTab();
                      setOpen(false);
                      smoothScrollTo(l.href.replace(/^#/, ""))(e);
                    }}
                    className="flex flex-col items-start rounded-xl min-h-[64px] p-3 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left cursor-pointer active:scale-98"
                  >
                    <span className="text-base mb-1">{l.icon}</span>
                    <span className="text-xs font-bold text-white">{label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth & Priority CTAs */}
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                to="/host"
                onClick={() => setOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
              >
                <span>🏠</span>
                <span>{isHi ? "प्रॉपर्टी लिस्ट करें" : "Become a Host"}</span>
              </Link>
              {onEarlyAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onEarlyAccess();
                  }}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  <span>⚡</span>
                  <span>{isHi ? "प्राथमिकता अर्ली एक्सेस लें" : "Get Priority Early Access"}</span>
                </button>
              )}
              {onRefer && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onRefer();
                  }}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-all cursor-pointer"
                >
                  <span>🎁</span>
                  <span>
                    {isHi ? "व्हाट्सएप पर रेफर व शेयर करें" : "Refer & Share on WhatsApp"}
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

      <ZeroFeeTrialTokenModal
        open={showTrialModal}
        onOpenChange={setShowTrialModal}
        onApplyTrial={onBook}
      />
    </header>
  );
});
