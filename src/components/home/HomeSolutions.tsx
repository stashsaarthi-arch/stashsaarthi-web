import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FadeUp } from "@/components/ui/FadeUp";
import { SolutionsHub } from "@/components/stash/SolutionsHub";
import type { BookingPrefill } from "@/components/stash/types";

const CalculatorHub = lazy(() =>
  import("@/components/stash/CalculatorHub").then((m) => ({ default: m.CalculatorHub })),
);
const StashTimeline = lazy(() =>
  import("@/components/stash/StashTimeline").then((m) => ({ default: m.StashTimeline })),
);
const TrustConsoleHub = lazy(() =>
  import("@/components/stash/TrustConsoleHub").then((m) => ({ default: m.TrustConsoleHub })),
);
const StudentStoriesCarousel = lazy(() =>
  import("@/components/stash/StudentStoriesCarousel").then((m) => ({
    default: m.StudentStoriesCarousel,
  })),
);

interface HomeSolutionsProps {
  onBook: (p?: BookingPrefill) => void;
  onListRoom: () => void;
}

export function HomeSolutions({ onBook, onListRoom }: HomeSolutionsProps) {
  return (
    <>
      {/* High-Converting Savings Calculator Module placed high up for optimal scroll-depth conversion */}
      <FadeUp>
        <ErrorBoundary sectionName="Calculator Hub">
          <Suspense fallback={null}>
            <CalculatorHub onBook={onBook} />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      {/* Core Solutions Hub (Stash / Rooms / Kitchen / Connect) */}
      <FadeUp>
        <ErrorBoundary sectionName="Solutions Hub">
          <SolutionsHub onBook={onBook} onListRoom={onListRoom} />
        </ErrorBoundary>
      </FadeUp>

      {/* Interactive Timeline of a Stash (Pickup -> Custody -> Return) */}
      <FadeUp>
        <ErrorBoundary sectionName="Timeline of a Stash">
          <Suspense fallback={null}>
            <StashTimeline onBook={onBook} />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      {/* 100% Radical Transparency & Custody Console Hub */}
      <FadeUp>
        <ErrorBoundary sectionName="Trust & Custody Console">
          <Suspense fallback={null}>
            <TrustConsoleHub />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      {/* Dedicated Student & Host Success Stories Carousel */}
      <FadeUp>
        <ErrorBoundary sectionName="Student Success Stories">
          <Suspense fallback={null}>
            <StudentStoriesCarousel onBook={onBook} />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>
    </>
  );
}
