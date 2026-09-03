import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { Navbar } from "@/components/stash/Navbar";
import { Hero } from "@/components/stash/Hero";
import { QuickCategoryNav } from "@/components/stash/QuickCategoryNav";
import { DualCrisis } from "@/components/stash/DualCrisis";
import { SolutionsHub } from "@/components/stash/SolutionsHub";
import { CalculatorHub } from "@/components/stash/CalculatorHub";
import { TrustConsoleHub } from "@/components/stash/TrustConsoleHub";
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
import { WhatsAppButton } from "@/components/stash/WhatsAppButton";
import { ActivityTicker } from "@/components/stash/ActivityTicker";
import { ScrollProgress } from "@/components/stash/ScrollProgress";
import { FloatingPersonaToggle } from "@/components/stash/FloatingPersonaToggle";
import { MobileStickyCTA } from "@/components/stash/MobileStickyCTA";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "@/components/stash/types";

const TITLE = "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Co-Living";
const DESC =
  "Official website of StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform. Vacation luggage storage at ₹300/bag/mo, verified senior-hosted rooms, and homemade tiffins.";
const URL = "https://stashsaarthi-web.vercel.app/";
const OG_IMAGE = "https://stashsaarthi-web.vercel.app/images/og-banner.jpg";

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

  const open = (p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setBooking(true);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500">
      <AmbientNodes />
      <Navbar
        role={role}
        setRole={setRole}
        onBook={() => open()}
        onListRoom={() => setListing(true)}
        onEarlyAccess={() => setEarlyAccess(true)}
        onRefer={() => setReferralOpen(true)}
      />

      <ErrorBoundary>
        <Hero role={role} onBook={open} onRefer={() => setReferralOpen(true)} />
      </ErrorBoundary>

      {/* TI.com-inspired Quick Jump Sticky Category Bar */}
      <QuickCategoryNav />

      <ErrorBoundary>
        <RoleLane role={role} onBook={open} />
      </ErrorBoundary>

      <ErrorBoundary>
        <DualCrisis />
      </ErrorBoundary>

      {/* 1. Core Solutions Hub (Stash / Rooms / Kitchen / Connect) */}
      <ErrorBoundary>
        <SolutionsHub onBook={open} onListRoom={() => setListing(true)} />
      </ErrorBoundary>

      {/* 2. Interactive Calculator & Space Simulator Hub */}
      <ErrorBoundary>
        <CalculatorHub onBook={open} />
      </ErrorBoundary>

      {/* 3. 100% Radical Transparency & Custody Console Hub */}
      <ErrorBoundary>
        <TrustConsoleHub />
      </ErrorBoundary>

      {/* Host Specific Dashboard Norms */}
      {role === "host" && (
        <ErrorBoundary>
          <HostRules />
          <FamilyDashboard />
        </ErrorBoundary>
      )}

      {/* 4. Community Reviews & Improvement Suggestions Hub */}
      <ErrorBoundary>
        <FeedbackSuggestions />
      </ErrorBoundary>

      {/* 5. FAQ */}
      <ErrorBoundary>
        <FAQ />
      </ErrorBoundary>

      {/* Footer */}
      <ErrorBoundary>
        <FooterSection />
      </ErrorBoundary>

      {/* Global Modals & Overlay Triggers */}
      <BookingModal
        open={booking}
        onOpenChange={setBooking}
        service={prefill.service ?? "stash"}
        note={prefill.note}
        bags={prefill.bags}
        months={prefill.months}
        amount={prefill.amount}
      />
      <RoomListingModal open={listing} onOpenChange={setListing} />
      <EarlyAccessModal open={earlyAccess} onOpenChange={setEarlyAccess} initialRole={role} />
      <WhatsAppReferralModal open={referralOpen} onOpenChange={setReferralOpen} />
      <ScrollProgress />
      <ActivityTicker />
      <FloatingPersonaToggle />
      <FounderEscalationWidget />
      <MobileStickyCTA onBook={open} />
      <WhatsAppButton onBook={open} />
    </main>
  );
}
