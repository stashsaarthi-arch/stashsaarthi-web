import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, GraduationCap, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./AuthButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LowDataToggle } from "@/components/ui/LowDataToggle";
import { smoothScrollTo } from "./legal";
import { useLanguage } from "@/context/LanguageContext";
import type { Role } from "./types";
import { StashWalletBadge, ZeroFeeTrialTokenModal } from "./ZeroFeeTrialTokenModal";
import { PersonaSwitcher } from "@/components/ui/PersonaSwitcher";
import {
  DYNAMIC_PERSONA_NAVBAR_TOKENS,
  getPersonaNavbarTokens,
  getNavbarBrandGlowClasses,
  getNavbarLinkIndicatorClasses,
} from "@/lib/designTokens";

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
  const [activeHash, setActiveHash] = useState("#stash");
  const { language, setLanguage, t } = useLanguage();
  const isHi = language === "hi";

  const tokens = getPersonaNavbarTokens(role);
  const isHost = role === "host";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <header
      data-persona={role}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? `bg-[#0A0D0F]/95 backdrop-blur-2xl ${tokens.scrolledBorder}`
          : isHost
          ? "bg-[#0A0D0F]/80 backdrop-blur-md border-b border-amber-500/15"
          : "bg-[#0A0D0F]/70 backdrop-blur-md border-b border-emerald-500/15"
      }`}
    >
      {/* Dynamic Persona Top Accent Gradient Line */}
      <div
        className={`h-0.5 w-full transition-all duration-500 ${tokens.topAccentLine}`}
      />

      <div
        className={`section-container-gutter mobile-gutter-safe max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-1 sm:gap-2 transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-15 sm:h-20"
        }`}
      >
        {/* 1. Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 xl:gap-4 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 shrink-0 cursor-pointer group bg-transparent border-0 p-0 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
            onClick={() => {
              setActiveHash("#stash");
              smoothScrollTo("top")(undefined as any);
            }}
            aria-label="Scroll to top of page"
            title="StashSaarthi - Back to top"
          >
            <div className={`navbar-brand-logo transition-all duration-300 ${getNavbarBrandGlowClasses(role)}`}>
              <BrandLogo height={28} className="h-6 sm:h-7 md:h-8 w-auto" />
            </div>
          </button>

          {/* Desktop Navigation Links with Dynamic Persona Underlines */}
          <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-0.5 shrink-0">
            {NAV_LINKS.map((l) => {
              const label = isHi ? l.labelHi : l.labelEn;
              const isActive = activeHash === l.href;

              return (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHash(l.href);
                    smoothScrollTo(l.href.replace(/^#/, ""))(e);
                  }}
                  className={`whitespace-nowrap rounded-lg px-2 min-[1650px]:px-3 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 relative group focus-visible:outline-none focus-visible:ring-2 ${
                    isHost ? "focus-visible:ring-amber-400" : "focus-visible:ring-emerald-400"
                  } ${
                    isActive
                      ? isHost
                        ? "text-amber-300 font-semibold bg-amber-500/10"
                        : "text-emerald-300 font-semibold bg-emerald-500/10"
                      : isHost
                      ? "text-slate-300 hover:text-amber-300 hover:bg-amber-500/10"
                      : "text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10"
                  }`}
                >
                  <span className="text-xs" aria-hidden="true">{l.icon}</span>
                  <span>{label}</span>

                  {/* Dynamic Persona Sliding Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-link-indicator"
                      className={`absolute bottom-0 left-1.5 right-1.5 h-0.5 rounded-full ${tokens.activeIndicator}`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* 2. Right: Action Controls (Responsive & Mobile Fitted) */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* Persona Toggle on Desktop */}
          <div className="hidden min-[1650px]:flex items-center shrink-0">
            <PersonaSwitcher
              id="navbar-desktop-persona-switcher"
              role={role}
              onRoleChange={setRole}
              variant="compact"
              showBadges
            />
          </div>

          {/* Compact Language Switcher & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div role="radiogroup" aria-label="Select Language" className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 shrink-0">
              <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                aria-label="Switch to English"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  isHost ? "focus-visible:ring-amber-400" : "focus-visible:ring-emerald-400"
                } ${
                  language === "en"
                    ? "bg-white/15 text-white"
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
                onClick={() => setLanguage("hi")}
                className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  isHost ? "focus-visible:ring-amber-400" : "focus-visible:ring-emerald-400"
                } ${
                  language === "hi"
                    ? "bg-white/15 text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                HI
              </button>
            </div>
            <ThemeToggle compact />
            <LowDataToggle compact />
          </div>

          {/* Stash Wallet Zero-Fee Trial Token Badge */}
          <div className="hidden sm:block shrink-0">
            <StashWalletBadge onClick={() => setShowTrialModal(true)} />
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
              className={`hidden min-[1650px]:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
                isHost
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 focus-visible:ring-amber-400"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 focus-visible:ring-emerald-400"
              }`}
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
              className="hidden min-[1650px]:inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-2.5 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-all shrink-0 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
              title={isHi ? "व्हाट्सएप पर शेयर करें" : "Refer & Share on WhatsApp"}
              aria-label={isHi ? "व्हाट्सएप पर शेयर करें" : "Refer & Share on WhatsApp"}
            >
              <span aria-hidden="true">🎁</span>
              <span>{isHi ? "रेफर करें" : "Refer"}</span>
            </button>
          )}

          {/* Dynamic Persona Action CTA Button */}
          <button
            type="button"
            onClick={role === "student" ? onBook : onListRoom}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              isHost ? "focus-visible:ring-amber-400" : "focus-visible:ring-emerald-400"
            } ${tokens.ctaButton}`}
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
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Persona Border */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-drawer"
            role="region"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`glass flex flex-col gap-2 px-4 py-4 xl:hidden bg-[#0A0D0F]/98 backdrop-blur-2xl overflow-hidden shadow-2xl ${tokens.mobileDrawerBorder}`}
          >
            {/* Mobile Persona Switcher in Menu */}
            <div className="flex justify-center mb-2">
              <PersonaSwitcher
                id="navbar-mobile-persona-switcher"
                role={role}
                onRoleChange={(r) => {
                  setRole(r);
                  setOpen(false);
                }}
                variant="standard"
                className="w-full justify-center"
              />
            </div>

            {/* Mobile Language & Theme Switcher in Menu */}
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
              <ThemeToggle compact className="shrink-0" />
              <LowDataToggle compact className="shrink-0" />
            </div>

            {/* Structured Navigation Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((l) => {
                const label = isHi ? l.labelHi : l.labelEn;
                const desc = isHi ? l.descHi : l.descEn;
                const isActive = activeHash === l.href;

                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={(e) => {
                      setOpen(false);
                      setActiveHash(l.href);
                      smoothScrollTo(l.href.replace(/^#/, ""))(e);
                    }}
                    className={`flex flex-col items-start rounded-xl p-2.5 border transition-all text-left cursor-pointer active:scale-98 ${
                      isActive
                        ? isHost
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                          : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                        : "bg-white/5 hover:bg-white/10 border-white/5 text-white"
                    }`}
                  >
                    <span className="text-base mb-1">{l.icon}</span>
                    <span className="text-xs font-bold">{label}</span>
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
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isHost
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                      : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  }`}
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-all cursor-pointer"
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
