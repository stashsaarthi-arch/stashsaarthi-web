import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { Navbar } from "@/components/stash/Navbar";
import { Hero } from "@/components/stash/Hero";
import { DualCrisis } from "@/components/stash/DualCrisis";
import { Ecosystem } from "@/components/stash/Ecosystem";
import { StashCalculator } from "@/components/stash/Calculator";
import { HostSimulator } from "@/components/stash/HostSimulator";
import { HostRules } from "@/components/stash/HostRules";
import { FamilyDashboard } from "@/components/stash/FamilyDashboard";
import { Rooms } from "@/components/stash/Rooms";
import { Connect } from "@/components/stash/Connect";
import { Trust } from "@/components/stash/Trust";
import { ZeroRisk } from "@/components/stash/ZeroRisk";
import { ProcessTransparency } from "@/components/stash/ProcessTransparency";
import { ProductSandbox } from "@/components/stash/ProductSandbox";
import { DataPrivacyCommitment } from "@/components/stash/DataPrivacyCommitment";
import { FounderAccountability } from "@/components/stash/FounderAccountability";
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
import { usePersona } from "@/context/PersonaContext";
import AnimatedContent from "@/components/ui/AnimatedContent";
import type { BookingPrefill, Role } from "@/components/stash/types";

const TITLE = "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Co-Living";
const DESC =
  "Official website of StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform. Vacation luggage storage at ₹300/bag/mo, verified senior-hosted rooms, and homemade tiffins.";
const URL = "https://stashsaarthi-web.vercel.app/";
const OG_IMAGE = "https://stashsaarthi-web.vercel.app/stashsaarthi-logo.png";

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
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <RoleLane role={role} onBook={open} />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <DualCrisis />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <Ecosystem onBook={open} />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          {role === "student" ? <StashCalculator onBook={open} /> : <HostSimulator onBook={open} />}
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <Rooms onList={() => setListing(true)} />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <Connect onBook={open} />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <ProcessTransparency />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <ProductSandbox />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <Trust />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <ZeroRisk />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <DataPrivacyCommitment />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <FounderAccountability />
        </AnimatedContent>
      </ErrorBoundary>
      {role === "host" && (
        <ErrorBoundary>
          <AnimatedContent distance={20} threshold={0.06}>
            <HostRules />
            <FamilyDashboard />
          </AnimatedContent>
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <FeedbackSuggestions />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedContent distance={20} threshold={0.06}>
          <FAQ />
        </AnimatedContent>
      </ErrorBoundary>
      <ErrorBoundary>
        <FooterSection />
      </ErrorBoundary>

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
      <WhatsAppButton onBook={open} />
    </main>
  );
}
