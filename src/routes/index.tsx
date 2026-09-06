import { useState, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { Navbar } from "@/components/stash/Navbar";
import { Hero } from "@/components/stash/Hero";
import { QuickCategoryNav } from "@/components/stash/QuickCategoryNav";
import { DualCrisis } from "@/components/stash/DualCrisis";
import { SolutionsHub } from "@/components/stash/SolutionsHub";
import { PgComparisonTable } from "@/components/stash/PgComparisonTable";
import { CalculatorHub } from "@/components/stash/CalculatorHub";
import { TrustConsoleHub } from "@/components/stash/TrustConsoleHub";
import { StudentStoriesCarousel } from "@/components/stash/StudentStoriesCarousel";
import { HostRules } from "@/components/stash/HostRules";
import { FamilyDashboard } from "@/components/stash/FamilyDashboard";
import { FounderEscalationWidget } from "@/components/stash/FounderEscalationWidget";
import { FeedbackSuggestions } from "@/components/stash/FeedbackSuggestions";
import { FAQ } from "@/components/stash/FAQ";
import { FooterSection } from "@/components/stash/FooterSection";
import { EarlyAccessModal } from "@/components/stash/EarlyAccessModal";
import { WhatsAppReferralModal } from "@/components/stash/WhatsAppReferralModal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { BookingModal } from "@/components/stash/BookingModal";
import { RoomListingModal } from "@/components/stash/RoomListingModal";
import { RoleLane } from "@/components/stash/RoleLane";
import { StashTimeline } from "@/components/stash/StashTimeline";
import { ReferralLeaderboard } from "@/components/stash/ReferralLeaderboard";
import { KanpurStudentCouncil } from "@/components/stash/KanpurStudentCouncil";
import { TopRatedKitchensWidget } from "@/components/stash/TopRatedKitchensWidget";
import { WhatsAppButton } from "@/components/stash/WhatsAppButton";
import { ActivityTicker } from "@/components/stash/ActivityTicker";
import { ScrollProgress } from "@/components/stash/ScrollProgress";
import { FloatingPersonaToggle } from "@/components/stash/FloatingPersonaToggle";
import { MobileStickyCTA } from "@/components/stash/MobileStickyCTA";
import { ExitIntentModal } from "@/components/stash/ExitIntentModal";
import { PredictivePersonaWidget } from "@/components/stash/PredictivePersonaWidget";
import { RagChatbotWidget } from "@/components/stash/RagChatbotWidget";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "@/components/stash/types";

const TITLE = "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Co-Living";
const DESC =
  "Official website of StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform. Vacation luggage storage at ₹300/bag/mo, verified senior-hosted rooms, and homemade tiffins.";
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

      <ErrorBoundary sectionName="Hero Section">
        <Hero role={role} onBook={open} onRefer={handleRefer} />
      </ErrorBoundary>

      {/* TI.com-inspired Quick Jump Sticky Category Bar */}
      <ErrorBoundary sectionName="Category Navigation" compact>
        <QuickCategoryNav />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Role Switcher">
        <RoleLane role={role} onBook={open} />
      </ErrorBoundary>

      {/* High-Converting Savings Calculator Module placed high up for optimal scroll-depth conversion */}
      <ErrorBoundary sectionName="Calculator Hub">
        <CalculatorHub onBook={open} />
      </ErrorBoundary>

      {/* Core Solutions Hub (Stash / Rooms / Kitchen / Connect) */}
      <ErrorBoundary sectionName="Solutions Hub">
        <SolutionsHub onBook={open} onListRoom={handleListRoom} />
      </ErrorBoundary>

      {/* Why StashSaarthi vs. Traditional PGs Comparison Table */}
      <ErrorBoundary sectionName="Why StashSaarthi vs Traditional PGs">
        <PgComparisonTable onBook={open} />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Dual Crisis Overview">
        <DualCrisis />
      </ErrorBoundary>

      {/* Interactive Timeline of a Stash (Pickup -> Custody -> Return) */}
      <ErrorBoundary sectionName="Timeline of a Stash">
        <StashTimeline onBook={open} />
      </ErrorBoundary>

      {/* 3. 100% Radical Transparency & Custody Console Hub */}
      <ErrorBoundary sectionName="Trust & Custody Console">
        <TrustConsoleHub />
      </ErrorBoundary>

      {/* Dedicated Student & Host Success Stories Carousel */}
      <ErrorBoundary sectionName="Student Success Stories">
        <StudentStoriesCarousel onBook={open} />
      </ErrorBoundary>

      {/* Interactive Referral Leaderboard */}
      <ErrorBoundary sectionName="Referral Leaderboard">
        <ReferralLeaderboard onRefer={handleRefer} />
      </ErrorBoundary>

      {/* Top 3 Rated Kitchens of the Week Widget */}
      <ErrorBoundary sectionName="Top Rated Kitchens">
        <TopRatedKitchensWidget
          onOrderMeal={(kId) =>
            open({
              service: "kitchen",
              note: `Selected Top Rated Kitchen of the Week: ${kId}`,
            })
          }
        />
      </ErrorBoundary>

      {/* Official Kanpur Student Council Section */}
      <ErrorBoundary sectionName="Kanpur Student Council">
        <KanpurStudentCouncil />
      </ErrorBoundary>

      {/* Host Specific Dashboard Norms */}
      {role === "host" && (
        <>
          <ErrorBoundary sectionName="Host House Rules">
            <HostRules />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Family Dashboard">
            <FamilyDashboard />
          </ErrorBoundary>
        </>
      )}

      {/* 4. Community Reviews & Improvement Suggestions Hub */}
      <ErrorBoundary sectionName="Community Feedback & Suggestions">
        <FeedbackSuggestions />
      </ErrorBoundary>

      {/* 5. FAQ */}
      <ErrorBoundary sectionName="FAQ Section">
        <FAQ />
      </ErrorBoundary>

      {/* Footer */}
      <ErrorBoundary sectionName="Footer">
        <FooterSection />
      </ErrorBoundary>

      {/* Global Modals & Overlay Triggers */}
      <ErrorBoundary sectionName="Booking Modal" compact>
        <BookingModal
          open={booking}
          onOpenChange={setBooking}
          service={prefill.service ?? "stash"}
          note={prefill.note}
          bags={prefill.bags}
          months={prefill.months}
          amount={prefill.amount}
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
      <ErrorBoundary sectionName="Exit Intent Modal" compact>
        <ExitIntentModal
          onClaimDiscount={(code, service) => {
            open({
              service,
              note: `Applied Offer Code ${code}: Flat ₹50 Discount`,
            });
          }}
        />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Scroll Progress Indicator" compact>
        <ScrollProgress />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Activity Ticker Widget" compact>
        <ActivityTicker onBook={open} onListRoom={handleListRoom} />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Floating Persona Toggle Widget" compact>
        <FloatingPersonaToggle />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Founder Escalation Widget" compact>
        <FounderEscalationWidget />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Mobile Sticky CTA Widget" compact>
        <MobileStickyCTA onBook={open} />
      </ErrorBoundary>
      <ErrorBoundary sectionName="WhatsApp Floating Action Button" compact>
        <WhatsAppButton onBook={open} />
      </ErrorBoundary>
      <ErrorBoundary sectionName="RAG Chatbot Widget" compact>
        <RagChatbotWidget />
      </ErrorBoundary>
    </main>
  );
}

