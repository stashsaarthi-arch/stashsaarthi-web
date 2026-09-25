import { Suspense, lazy } from "react";
import { AmbientNodes } from "@/components/ui/AmbientNodes";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Navbar } from "@/components/stash/Navbar";
import { PremiumHero } from "@/components/stash/PremiumHero";
import { QuickCategoryNav } from "@/components/stash/QuickCategoryNav";
import { FloatingPersonaToggle } from "@/components/stash/FloatingPersonaToggle";
import { ServiceQuickJumpPill } from "@/components/stash/ServiceQuickJumpPill";
import type { BookingPrefill, Role } from "@/components/stash/types";

const RoleLane = lazy(() =>
  import("@/components/stash/RoleLane").then((m) => ({ default: m.RoleLane })),
);

interface HomeHeroSectionProps {
  role: Role;
  setRole: (role: Role) => void;
  onBookDefault: () => void;
  onBook: (p?: BookingPrefill) => void;
  onListRoom: () => void;
  onEarlyAccess: () => void;
  onRefer: () => void;
}

export function HomeHeroSection({
  role,
  setRole,
  onBookDefault,
  onBook,
  onListRoom,
  onEarlyAccess,
  onRefer,
}: HomeHeroSectionProps) {
  return (
    <>
      <AmbientNodes />
      <ErrorBoundary sectionName="Navbar" compact>
        <Navbar
          role={role}
          setRole={setRole}
          onBook={onBookDefault}
          onListRoom={onListRoom}
          onEarlyAccess={onEarlyAccess}
          onRefer={onRefer}
        />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Floating Persona Toggle Widget" compact>
        <FloatingPersonaToggle />
      </ErrorBoundary>

      {/* Floating in-page quick jump sub-nav pill */}
      <ServiceQuickJumpPill />

      <ErrorBoundary sectionName="Hero Section">
        <PremiumHero role={role} onBook={onBook} onRefer={onRefer} />
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
            <RoleLane role={role} onBook={onBook} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
