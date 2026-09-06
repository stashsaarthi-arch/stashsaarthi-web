import { createFileRoute } from "@tanstack/react-router";
import { KanpurStudentCouncil } from "@/components/stash/KanpurStudentCouncil";
import { Navbar } from "@/components/stash/Navbar";
import { FooterSection } from "@/components/stash/FooterSection";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { usePersona } from "@/context/PersonaContext";
import { useState, useCallback } from "react";
import { BookingModal } from "@/components/stash/BookingModal";
import { RoomListingModal } from "@/components/stash/RoomListingModal";
import { EarlyAccessModal } from "@/components/stash/EarlyAccessModal";
import { WhatsAppReferralModal } from "@/components/stash/WhatsAppReferralModal";

const COUNCIL_META = {
  metaTitle: "Kanpur Student Council (कानपुर छात्र परिषद) | StashSaarthi Governance",
  metaDescription:
    "Official Kanpur Student Council uniting student leaders from IIT Kanpur, HBTI, CSJMU, PW Vidyapeeth, Allen Kakadeo, & GSVM. Combat dead-rent waste, broker fees, and mess food issues.",
  metaKeywords:
    "Kanpur Student Council, IIT Kanpur student union, Kakadeo PW Vidyapeeth student rep, Allen Kakadeo student council, HBTI HBTU student leaders, CSJMU Kalyanpur student union, StashSaarthi student council",
  canonicalUrl: "https://stashsaarthi-web.vercel.app/kanpur-student-council",
};

export const Route = createFileRoute("/kanpur-student-council")({
  head: () => ({
    meta: [
      { title: COUNCIL_META.metaTitle },
      { name: "description", content: COUNCIL_META.metaDescription },
      { name: "keywords", content: COUNCIL_META.metaKeywords },
      { property: "og:title", content: COUNCIL_META.metaTitle },
      { property: "og:description", content: COUNCIL_META.metaDescription },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
      { property: "og:url", content: COUNCIL_META.canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: COUNCIL_META.metaTitle },
      { name: "twitter:description", content: COUNCIL_META.metaDescription },
      { name: "twitter:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
    ],
    links: [{ rel: "canonical", href: COUNCIL_META.canonicalUrl }],
  }),
  component: KanpurStudentCouncilRoute,
});

function KanpurStudentCouncilRoute() {
  const { role, setRole } = usePersona();
  const [booking, setBooking] = useState(false);
  const [listing, setListing] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  const handleBookDefault = useCallback(() => setBooking(true), []);
  const handleListRoom = useCallback(() => setListing(true), []);
  const handleEarlyAccess = useCallback(() => setEarlyAccess(true), []);
  const handleRefer = useCallback(() => setReferralOpen(true), []);

  return (
    <main id="main-content" className="relative min-h-screen bg-background text-foreground transition-colors duration-500">
      <AmbientNodes />
      <Navbar
        role={role}
        setRole={setRole}
        onBook={handleBookDefault}
        onListRoom={handleListRoom}
        onEarlyAccess={handleEarlyAccess}
        onRefer={handleRefer}
      />

      <div className="pt-16">
        <ErrorBoundary sectionName="Kanpur Student Council">
          <KanpurStudentCouncil />
        </ErrorBoundary>
      </div>

      <FooterSection />

      <BookingModal open={booking} onOpenChange={setBooking} service="stash" />
      <RoomListingModal open={listing} onOpenChange={setListing} />
      <EarlyAccessModal open={earlyAccess} onOpenChange={setEarlyAccess} initialRole={role} />
      <WhatsAppReferralModal open={referralOpen} onOpenChange={setReferralOpen} />
    </main>
  );
}
