import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ScrollProgress } from "@/components/stash/ScrollProgress";
import { MobileStickyCTA } from "@/components/stash/MobileStickyCTA";
import { WhatsAppButton } from "@/components/stash/WhatsAppButton";
import type { BookingPrefill, Role } from "@/components/stash/types";

const MobileSecondaryAccordions = lazy(() =>
  import("@/components/stash/MobileSecondaryAccordions").then((m) => ({
    default: m.MobileSecondaryAccordions,
  })),
);
const FAQ = lazy(() => import("@/components/stash/FAQ").then((m) => ({ default: m.FAQ })));
const FooterSection = lazy(() =>
  import("@/components/stash/FooterSection").then((m) => ({ default: m.FooterSection })),
);
const FounderEscalationWidget = lazy(() =>
  import("@/components/stash/FounderEscalationWidget").then((m) => ({
    default: m.FounderEscalationWidget,
  })),
);
const BookingModal = lazy(() =>
  import("@/components/stash/BookingModal").then((m) => ({ default: m.BookingModal })),
);
const RoomListingModal = lazy(() =>
  import("@/components/stash/RoomListingModal").then((m) => ({ default: m.RoomListingModal })),
);
const EarlyAccessModal = lazy(() =>
  import("@/components/stash/EarlyAccessModal").then((m) => ({ default: m.EarlyAccessModal })),
);
const WhatsAppReferralModal = lazy(() =>
  import("@/components/stash/WhatsAppReferralModal").then((m) => ({
    default: m.WhatsAppReferralModal,
  })),
);
const OfferPopup = lazy(() =>
  import("@/components/OfferPopup").then((m) => ({ default: m.OfferPopup })),
);
const RagChatbotWidget = lazy(() =>
  import("@/components/stash/RagChatbotWidget").then((m) => ({ default: m.RagChatbotWidget })),
);

interface HomeFooterAndModalsProps {
  role: Role;
  booking: boolean;
  setBooking: (open: boolean) => void;
  listing: boolean;
  setListing: (open: boolean) => void;
  earlyAccess: boolean;
  setEarlyAccess: (open: boolean) => void;
  referralOpen: boolean;
  setReferralOpen: (open: boolean) => void;
  prefill: BookingPrefill;
  onBook: (p?: BookingPrefill) => void;
  onRefer: () => void;
}

export function HomeFooterAndModals({
  role,
  booking,
  setBooking,
  listing,
  setListing,
  earlyAccess,
  setEarlyAccess,
  referralOpen,
  setReferralOpen,
  prefill,
  onBook,
  onRefer,
}: HomeFooterAndModalsProps) {
  return (
    <>
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
            <MobileSecondaryAccordions role={role} onBook={onBook} onRefer={onRefer} />
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
              onBook({
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
      
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="Founder Escalation Widget" compact>
          <FounderEscalationWidget />
        </ErrorBoundary>
      </Suspense>
      
      <ErrorBoundary sectionName="Mobile Sticky CTA Widget" compact>
        <MobileStickyCTA onBook={onBook} />
      </ErrorBoundary>
      
      <ErrorBoundary sectionName="WhatsApp Floating Action Button" compact>
        <WhatsAppButton onBook={onBook} />
      </ErrorBoundary>
      
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="RAG Chatbot Widget" compact>
          <RagChatbotWidget />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
