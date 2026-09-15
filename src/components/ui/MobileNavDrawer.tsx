import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Sparkles, Globe } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { LowDataToggle } from "./LowDataToggle";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { AuthButton } from "@/components/stash/AuthButton";
import { smoothScrollTo } from "@/components/stash/legal";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollLock } from "@/lib/useScrollLock";
import { playClick, playPop } from "@/lib/audio";
import { getMobileNavDrawerTokens } from "@/lib/designTokens";
import type { Role } from "@/components/stash/types";

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  role: Role;
  setRole: (role: Role) => void;
  activeHash?: string;
  setActiveHash?: ((hash: string) => void) | undefined;
  onBook?: (() => void) | undefined;
  onListRoom?: (() => void) | undefined;
  onEarlyAccess?: (() => void) | undefined;
  onRefer?: (() => void) | undefined;
}

export const MobileNavDrawer = memo(function MobileNavDrawer({
  open,
  onClose,
  role,
  setRole,
  activeHash = "#stash",
  setActiveHash,
  onBook,
  onListRoom,
  onEarlyAccess,
  onRefer,
}: MobileNavDrawerProps) {
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const tokens = getMobileNavDrawerTokens(role);
  const isHost = role === "host";

  // Lock body scroll when drawer is open
  useScrollLock(open);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    playClick();
    if (setActiveHash) {
      setActiveHash(href);
    }
    onClose();
    smoothScrollTo(href.replace(/^#/, ""))(e);
  };

  return (
    <AnimatePresence>
      {open && (
        <div id="mobile-nav-drawer-2.0-root" data-testid="mobile-nav-drawer-root">
          {/* 1. Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-nav-drawer-backdrop"
            onClick={() => {
              playPop();
              onClose();
            }}
            aria-hidden="true"
          />

          {/* 2. Slide-In Panel with Spring Physics */}
          <motion.aside
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={isHi ? tokens.header.titleHi : tokens.header.titleEn}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={tokens.transition}
            className={`mobile-nav-drawer-panel ${tokens.accent.border}`}
          >
            {/* Drawer Header */}
            <div className="mobile-nav-drawer-header">
              <div className="flex items-center gap-2">
                <BrandLogo height={26} className="h-6 w-auto" />
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${tokens.accent.headerBadge}`}
                >
                  {isHi ? tokens.header.badgeHi : tokens.header.badgeEn}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playPop();
                  onClose();
                }}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label={isHi ? "मेनू बंद करें" : "Close navigation drawer"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Subheader & Persona Control */}
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {isHi ? tokens.header.titleHi : tokens.header.titleEn}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {isHi ? tokens.header.subtitleHi : tokens.header.subtitleEn}
                  </p>
                </div>
              </div>

              {/* Persona Switcher Pill */}
              <PersonaSwitcher
                id="mobile-drawer-persona-switcher"
                role={role}
                onRoleChange={(r) => {
                  playClick();
                  setRole(r);
                }}
                variant="standard"
                className="w-full justify-center"
              />
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
              {/* Category Groups */}
              {tokens.categories.map((cat) => (
                <div key={cat.key} className="flex flex-col gap-2">
                  <div className="mobile-nav-drawer-category-title flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-slate-500" />
                    <span>{isHi ? cat.titleHi : cat.titleEn}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {cat.links.map((link) => {
                      const isActive = activeHash === link.href;
                      const label = isHi ? link.labelHi : link.labelEn;
                      const desc = isHi ? link.descHi : link.descEn;
                      const badge = isHi ? link.badgeHi : link.badgeEn;

                      return (
                        <a
                          key={link.key}
                          href={link.href}
                          onClick={(e) => handleLinkClick(link.href, e)}
                          className={`mobile-nav-drawer-link-card ${
                            isActive
                              ? `${tokens.accent.activeBg} ${tokens.accent.border} ${tokens.accent.activeText} font-semibold shadow-lg`
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg leading-none mt-0.5" aria-hidden="true">
                              {link.icon}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{label}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{desc}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-slate-300 border border-white/10">
                              {badge}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Language, Theme & Low-Data Controls */}
              <div className="mobile-nav-drawer-toggle-bar">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <div role="radiogroup" aria-label="Language selection" className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={language === "en"}
                      onClick={() => {
                        playClick();
                        setLanguage("en");
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        language === "en" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={language === "hi"}
                      onClick={() => {
                        playClick();
                        setLanguage("hi");
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        language === "hi" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      HI
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <ThemeToggle compact />
                  <LowDataToggle compact />
                </div>
              </div>
            </div>

            {/* Drawer Footer Action Area */}
            <div className="p-4 bg-slate-950/80 border-t border-white/10 flex flex-col gap-2.5">
              {/* Primary Dynamic Action Button */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                  if (role === "student" && onBook) onBook();
                  if (role === "host" && onListRoom) onListRoom();
                }}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 ${tokens.accent.btnClass}`}
              >
                {role === "student"
                  ? isHi
                    ? "🚀 अभी लगेज बुक करें (₹300/माह)"
                    : "🚀 Book Storage Now (@ ₹300/mo)"
                  : isHi
                    ? "🏠 अपना कमरा लिस्ट करें"
                    : "🏠 List Your Property Now"}
              </button>

              {/* Secondary Fast CTAs */}
              <div className="grid grid-cols-2 gap-2">
                {onEarlyAccess && (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onClose();
                      onEarlyAccess();
                    }}
                    className="py-2 px-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>⚡</span>
                    <span>{isHi ? "अर्ली एक्सेस" : "Early Access"}</span>
                  </button>
                )}

                {onRefer && (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onClose();
                      onRefer();
                    }}
                    className="py-2 px-2.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>🎁</span>
                    <span>{isHi ? "व्हाट्सएप रेफर" : "Refer & Earn"}</span>
                  </button>
                )}
              </div>

              {/* User Profile / Auth Button */}
              <div className="mt-1">
                <AuthButton compact />
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
});
