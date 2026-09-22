import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ShieldCheck,
  Clock,
  Scale,
  MessageSquareQuote,
  Soup,
  AlertCircle,
  Trophy,
  Award,
  Users,
  Home,
  Lightbulb,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { playTab } from "@/lib/audio";
import type { BookingPrefill, OpenBooking } from "./types";

// Lazy-load the secondary modules inside accordions so unexpanded accordions consume zero DOM/render overhead
const PgComparisonTable = lazy(() =>
  import("./PgComparisonTable").then((m) => ({ default: m.PgComparisonTable })),
);
const DualCrisis = lazy(() => import("./DualCrisis").then((m) => ({ default: m.DualCrisis })));
const StashTimeline = lazy(() =>
  import("./StashTimeline").then((m) => ({ default: m.StashTimeline })),
);
const TrustConsoleHub = lazy(() =>
  import("./TrustConsoleHub").then((m) => ({ default: m.TrustConsoleHub })),
);
const StudentStoriesCarousel = lazy(() =>
  import("./StudentStoriesCarousel").then((m) => ({ default: m.StudentStoriesCarousel })),
);
const ReferralLeaderboard = lazy(() =>
  import("./ReferralLeaderboard").then((m) => ({ default: m.ReferralLeaderboard })),
);
const TopRatedKitchensWidget = lazy(() =>
  import("./TopRatedKitchensWidget").then((m) => ({ default: m.TopRatedKitchensWidget })),
);
const KanpurStudentCouncil = lazy(() =>
  import("./KanpurStudentCouncil").then((m) => ({ default: m.KanpurStudentCouncil })),
);
const HostRules = lazy(() => import("./HostRules").then((m) => ({ default: m.HostRules })));
const FamilyDashboard = lazy(() =>
  import("./FamilyDashboard").then((m) => ({ default: m.FamilyDashboard })),
);
const FeedbackSuggestions = lazy(() =>
  import("./FeedbackSuggestions").then((m) => ({ default: m.FeedbackSuggestions })),
);
const FAQ = lazy(() => import("./FAQ").then((m) => ({ default: m.FAQ })));

interface MobileSecondaryAccordionsProps {
  role: "student" | "host";
  onBook: OpenBooking;
  onRefer: () => void;
}

export const MobileSecondaryAccordions = React.memo(function MobileSecondaryAccordions({
  role,
  onBook,
  onRefer,
}: MobileSecondaryAccordionsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { language } = useLanguage();
  const isHi = language === "hi";

  const toggleSection = (id: string) => {
    playTab();
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const groups = [
    {
      id: "economics-comparison",
      icon: Scale,
      titleEn: "PG vs StashSaarthi & Housing Mission",
      titleHi: "पारंपरिक पीजी बनाम स्टैशसारथी व मिशन",
      badgeEn: "Save 80% • Zero Brokerage",
      badgeHi: "80% बचत • शून्य ब्रोकरेज",
      accent: "var(--cyan)",
      render: () => (
        <div className="space-y-6">
          <PgComparisonTable onBook={onBook} />
          <div className="border-t border-white/10 pt-4">
            <DualCrisis />
          </div>
        </div>
      ),
    },
    {
      id: "council-kitchens",
      icon: Award,
      titleEn: "Student Council & Weekly Top Kitchens",
      titleHi: "छात्र परिषद समर्थन व शीर्ष रसोई",
      badgeEn: "IITK & CSJMU Endorsed",
      badgeHi: "आईआईटीके व सीएसजेएमयू",
      accent: "var(--emerald)",
      render: () => (
        <div className="space-y-6">
          <KanpurStudentCouncil />
          <div className="border-t border-white/10 pt-4">
            <TopRatedKitchensWidget
              onOrderMeal={(kId) =>
                onBook({
                  service: "kitchen",
                  note: `Selected Top Rated Kitchen: ${kId}`,
                })
              }
            />
          </div>
        </div>
      ),
    },
    {
      id: "rewards-governance",
      icon: Trophy,
      titleEn: "Referral Rewards & Community Feedback",
      titleHi: "रेफरल रिवॉर्ड्स व समुदाय सुझाव",
      badgeEn: "Win Storage • Open Ledger",
      badgeHi: "फ्री स्टोरेज • ओपन लेजर",
      accent: "var(--amber)",
      render: () => (
        <div className="space-y-6">
          <ReferralLeaderboard onRefer={onRefer} />
          <div className="border-t border-white/10 pt-4">
            <FeedbackSuggestions />
          </div>
          {role === "host" && (
            <div className="border-t border-white/10 pt-4 space-y-4">
              <HostRules />
              <FamilyDashboard />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-2 scroll-mt-20">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {isHi ? "त्वरित अन्वेषण ट्रे" : "Collapsible Trays"}
          </span>
          <h3 className="text-xs font-extrabold text-white">
            {isHi ? "विस्तृत विवरण, सुरक्षा व प्रश्न" : "Specifications, Trust & FAQs"}
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {isHi ? "टैप करें" : "Tap to expand"}
        </span>
      </div>

      <div className="space-y-1.5">
        {groups.map((s) => {
          const Icon = s.icon;
          const isOpen = openSection === s.id;
          const title = isHi ? s.titleHi : s.titleEn;
          const badge = isHi ? s.badgeHi : s.badgeEn;

          return (
            <div
              key={s.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-white/20 bg-white/[0.04] shadow-xl"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(s.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-2.5 p-2.5 text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10"
                    style={{ background: `color-mix(in oklab, ${s.accent} 15%, transparent)` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: s.accent }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{title}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span
                        className="inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold"
                        style={{
                          background: `color-mix(in oklab, ${s.accent} 15%, transparent)`,
                          color: s.accent,
                        }}
                      >
                        {badge}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-muted-foreground"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t border-white/[0.06] p-2 sm:p-4"
                  >
                    <Suspense
                      fallback={
                        <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                          Loading content...
                        </div>
                      }
                    >
                      {s.render()}
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
});
