import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "@/components/stash/types";

// ─── Above-the-fold (eagerly loaded for instant first paint) ─────────────────
import { Navbar } from "@/components/stash/Navbar";
import { Hero } from "@/components/stash/Hero";
import { QuickCategoryNav } from "@/components/stash/QuickCategoryNav";
import { SolutionsHub } from "@/components/stash/SolutionsHub";

import { ScrollProgress } from "@/components/stash/ScrollProgress";
import { FloatingPersonaToggle } from "@/components/stash/FloatingPersonaToggle";
import { MobileStickyCTA } from "@/components/stash/MobileStickyCTA";
import { WhatsAppButton } from "@/components/stash/WhatsAppButton";
import { ServiceQuickJumpPill } from "@/components/stash/ServiceQuickJumpPill";

const MobileSecondaryAccordions = lazy(() =>
  import("@/components/stash/MobileSecondaryAccordions").then((m) => ({ default: m.MobileSecondaryAccordions }))
);
const RoleLane = lazy(() => import("@/components/stash/RoleLane").then((m) => ({ default: m.RoleLane })));
const CalculatorHub = lazy(() => import("@/components/stash/CalculatorHub").then((m) => ({ default: m.CalculatorHub })));
const DualCrisis = lazy(() => import("@/components/stash/DualCrisis").then((m) => ({ default: m.DualCrisis })));
const PgComparisonTable = lazy(() => import("@/components/stash/PgComparisonTable").then((m) => ({ default: m.PgComparisonTable })));
const StashTimeline = lazy(() => import("@/components/stash/StashTimeline").then((m) => ({ default: m.StashTimeline })));
const TrustConsoleHub = lazy(() => import("@/components/stash/TrustConsoleHub").then((m) => ({ default: m.TrustConsoleHub })));
const StudentStoriesCarousel = lazy(() => import("@/components/stash/StudentStoriesCarousel").then((m) => ({ default: m.StudentStoriesCarousel })));
const ReferralLeaderboard = lazy(() => import("@/components/stash/ReferralLeaderboard").then((m) => ({ default: m.ReferralLeaderboard })));
const TopRatedKitchensWidget = lazy(() => import("@/components/stash/TopRatedKitchensWidget").then((m) => ({ default: m.TopRatedKitchensWidget })));
const KanpurStudentCouncil = lazy(() => import("@/components/stash/KanpurStudentCouncil").then((m) => ({ default: m.KanpurStudentCouncil })));
const HostRules = lazy(() => import("@/components/stash/HostRules").then((m) => ({ default: m.HostRules })));
const FamilyDashboard = lazy(() => import("@/components/stash/FamilyDashboard").then((m) => ({ default: m.FamilyDashboard })));
const FeedbackSuggestions = lazy(() => import("@/components/stash/FeedbackSuggestions").then((m) => ({ default: m.FeedbackSuggestions })));
const FAQ = lazy(() => import("@/components/stash/FAQ").then((m) => ({ default: m.FAQ })));
const FooterSection = lazy(() => import("@/components/stash/FooterSection").then((m) => ({ default: m.FooterSection })));
const FounderEscalationWidget = lazy(() => import("@/components/stash/FounderEscalationWidget").then((m) => ({ default: m.FounderEscalationWidget })));

// ─── Modals & overlays (lazy — only loaded on user interaction) ──────────────
const BookingModal = lazy(() => import("@/components/stash/BookingModal").then((m) => ({ default: m.BookingModal })));
const RoomListingModal = lazy(() => import("@/components/stash/RoomListingModal").then((m) => ({ default: m.RoomListingModal })));
const EarlyAccessModal = lazy(() => import("@/components/stash/EarlyAccessModal").then((m) => ({ default: m.EarlyAccessModal })));
const WhatsAppReferralModal = lazy(() => import("@/components/stash/WhatsAppReferralModal").then((m) => ({ default: m.WhatsAppReferralModal })));
const OfferPopup = lazy(() => import("@/components/OfferPopup").then((m) => ({ default: m.OfferPopup })));
const RagChatbotWidget = lazy(() => import("@/components/stash/RagChatbotWidget").then((m) => ({ default: m.RagChatbotWidget })));
const PredictivePersonaWidget = lazy(() => import("@/components/stash/PredictivePersonaWidget").then((m) => ({ default: m.PredictivePersonaWidget })));

const TITLE = "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Co-Living";
const DESC =
  "Official website of StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform. Vacation luggage storage at ₹300/bag/mo, verified verified PG owner-hosted rooms, and homemade tiffins.";
const URL = "https://stashsaarthi-web.vercel.app/";
const OG_IMAGE = "https://stashsaarthi-web.vercel.app/images/og-banner-new.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "StashSaarthi" },
      { property: "og:site_name", content: "StashSaarthi" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Index,
});

function Index() {
  const { role, setRole } = usePersona();
  const [booking, setBooking] = useState(false);
  const [listing, setListing] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const open = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setBooking(true);
  }, []);

  const handleBookDefault = useCallback(() => {
    open();
  }, [open]);

  const handleListRoom = useCallback(() => setListing(true), []);
  const handleEarlyAccess = useCallback(() => setEarlyAccess(true), []);
  const handleRefer = useCallback(() => setReferralOpen(true), []);

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEv = e as CustomEvent<{ service?: string; promoCode?: string; note?: string }>;
      if (customEv.detail) {
        open({
          service: customEv.detail.service,
          note:
            customEv.detail.note ||
            (customEv.detail.promoCode
              ? `Applied Offer Code ${customEv.detail.promoCode}: Flat ₹50 Discount`
              : undefined),
        });
      } else {
        open();
      }
    };
    window.addEventListener("stashsaarthi:open-booking", handleOpenBooking);
    return () => window.removeEventListener("stashsaarthi:open-booking", handleOpenBooking);
  }, [open]);

  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500 focus:outline-none">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <AmbientNodes />
      <ErrorBoundary sectionName="Navbar" compact>
        <Navbar
          role={role}
          setRole={setRole}
          onBook={handleBookDefault}
          onListRoom={handleListRoom}
          onEarlyAccess={handleEarlyAccess}
          onRefer={handleRefer}
        />
      </ErrorBoundary>

      {/* Floating in-page quick jump sub-nav pill */}
      <ServiceQuickJumpPill />

      <ErrorBoundary sectionName="Hero Section">
        <Hero role={role} onBook={open} onRefer={handleRefer} />
      </ErrorBoundary>

      {/* TI.com-inspired Quick Jump Sticky Category Bar (Desktop only — mobile uses sticky bottom dock) */}
      <div className="hidden md:block">
        <ErrorBoundary sectionName="Category Navigation" compact>
          <QuickCategoryNav />
        </ErrorBoundary>
      </div>

      <div className="hidden md:block">
        <ErrorBoundary sectionName="Role Switcher">
          <Suspense fallback={null}>
            <RoleLane role={role} onBook={open} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* High-Converting Savings Calculator Module placed high up for optimal scroll-depth conversion */}
      <ErrorBoundary sectionName="Calculator Hub">
        <Suspense fallback={null}>
          <CalculatorHub onBook={open} />
        </Suspense>
      </ErrorBoundary>

      {/* Core Solutions Hub (Stash / Rooms / Kitchen / Connect) */}
      <ErrorBoundary sectionName="Solutions Hub">
        <SolutionsHub onBook={open} onListRoom={handleListRoom} />
      </ErrorBoundary>

      {/* Interactive Timeline of a Stash (Pickup -> Custody -> Return) */}
      <ErrorBoundary sectionName="Timeline of a Stash">
        <Suspense fallback={null}>
          <StashTimeline onBook={open} />
        </Suspense>
      </ErrorBoundary>

      {/* 3. 100% Radical Transparency & Custody Console Hub */}
      <ErrorBoundary sectionName="Trust & Custody Console">
        <Suspense fallback={null}>
          <TrustConsoleHub />
        </Suspense>
      </ErrorBoundary>

      {/* Dedicated Student & Host Success Stories Carousel */}
      <ErrorBoundary sectionName="Student Success Stories">
        <Suspense fallback={null}>
          <StudentStoriesCarousel onBook={open} />
        </Suspense>
      </ErrorBoundary>

      {/* FAQ Section */}
      <ErrorBoundary sectionName="FAQ Section">
        <Suspense fallback={null}>
          <FAQ />
        </Suspense>
      </ErrorBoundary>

      {/* Mobile Collapsible Resource Trays for Deep Comparison & Council (< md) */}
      <div className="block md:hidden">
        <ErrorBoundary sectionName="Mobile Resource Trays" compact>
          <Suspense fallback={null}>
            <MobileSecondaryAccordions role={role} onBook={open} onRefer={handleRefer} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Desktop Inline Deep Modules (>= md) */}
      <div className="hidden md:block content-visibility-auto">
        <ErrorBoundary sectionName="Why StashSaarthi vs Traditional PGs">
          <Suspense fallback={null}>
            <PgComparisonTable onBook={open} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary sectionName="Dual Crisis Overview">
          <Suspense fallback={null}>
            <DualCrisis />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary sectionName="Top Rated Kitchens">
          <Suspense fallback={null}>
            <TopRatedKitchensWidget
              onOrderMeal={(kId) =>
                open({
                  service: "kitchen",
                  note: `Selected Top Rated Kitchen of the Week: ${kId}`,
                })
              }
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary sectionName="Kanpur Student Council">
          <Suspense fallback={null}>
            <KanpurStudentCouncil />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary sectionName="Referral Leaderboard">
          <Suspense fallback={null}>
            <ReferralLeaderboard onRefer={handleRefer} />
          </Suspense>
        </ErrorBoundary>

        {/* Host Specific Dashboard Norms */}
        {role === "host" && (
          <>
            <ErrorBoundary sectionName="Host House Rules">
              <Suspense fallback={null}>
                <HostRules />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary sectionName="Family Dashboard">
              <Suspense fallback={null}>
                <FamilyDashboard />
              </Suspense>
            </ErrorBoundary>
          </>
        )}

        <ErrorBoundary sectionName="Community Feedback & Suggestions">
          <Suspense fallback={null}>
            <FeedbackSuggestions />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Footer */}
      <ErrorBoundary sectionName="Footer">
        <Suspense fallback={null}>
          <FooterSection />
        </Suspense>
      </ErrorBoundary>

      {/* Global Modals & Overlay Triggers */}
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="Booking Modal" compact>
          <BookingModal
            open={booking}
            onOpenChange={setBooking}
            service={prefill.service ?? "stash"}
            note={prefill.note}
            bags={prefill.bags}
            months={prefill.months}
            amount={prefill.amount}
            address={prefill.address}
            roomType={prefill.roomType}
            mealPlan={prefill.mealPlan}
          />
        </ErrorBoundary>
        <ErrorBoundary sectionName="Room Listing Modal" compact>
          <RoomListingModal open={listing} onOpenChange={setListing} />
        </ErrorBoundary>
        <ErrorBoundary sectionName="Early Access Modal" compact>
          <EarlyAccessModal open={earlyAccess} onOpenChange={setEarlyAccess} initialRole={role} />
        </ErrorBoundary>
        <ErrorBoundary sectionName="WhatsApp Referral Modal" compact>
          <WhatsAppReferralModal open={referralOpen} onOpenChange={setReferralOpen} />
        </ErrorBoundary>
        <ErrorBoundary sectionName="Offer Popup" compact>
          <OfferPopup
            onClaimDiscount={(code, service) => {
              open({
                service,
                note: `Applied Offer Code ${code}: Flat ₹50 Discount`,
              });
            }}
          />
        </ErrorBoundary>
      </Suspense>
      <ErrorBoundary sectionName="Scroll Progress Indicator" compact>
        <ScrollProgress />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Floating Persona Toggle Widget" compact>
        <FloatingPersonaToggle />
      </ErrorBoundary>
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="Founder Escalation Widget" compact>
          <FounderEscalationWidget />
        </ErrorBoundary>
      </Suspense>
      <ErrorBoundary sectionName="Mobile Sticky CTA Widget" compact>
        <MobileStickyCTA />
      </ErrorBoundary>
      <ErrorBoundary sectionName="WhatsApp Floating Action Button" compact>
        <WhatsAppButton onBook={open} />
      </ErrorBoundary>
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="RAG Chatbot Widget" compact>
          <RagChatbotWidget />
        </ErrorBoundary>
      </Suspense>
    </main>
  );
}

