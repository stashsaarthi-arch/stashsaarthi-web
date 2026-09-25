import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FadeUp } from "@/components/ui/FadeUp";
import type { BookingPrefill, Role } from "@/components/stash/types";

const DualCrisis = lazy(() =>
  import("@/components/stash/DualCrisis").then((m) => ({ default: m.DualCrisis })),
);
const PgComparisonTable = lazy(() =>
  import("@/components/stash/PgComparisonTable").then((m) => ({ default: m.PgComparisonTable })),
);
const ReferralLeaderboard = lazy(() =>
  import("@/components/stash/ReferralLeaderboard").then((m) => ({
    default: m.ReferralLeaderboard,
  })),
);
const TopRatedKitchensWidget = lazy(() =>
  import("@/components/stash/TopRatedKitchensWidget").then((m) => ({
    default: m.TopRatedKitchensWidget,
  })),
);
const KanpurStudentCouncil = lazy(() =>
  import("@/components/stash/KanpurStudentCouncil").then((m) => ({
    default: m.KanpurStudentCouncil,
  })),
);
const HostRules = lazy(() =>
  import("@/components/stash/HostRules").then((m) => ({ default: m.HostRules })),
);
const FamilyDashboard = lazy(() =>
  import("@/components/stash/FamilyDashboard").then((m) => ({ default: m.FamilyDashboard })),
);
const FeedbackSuggestions = lazy(() =>
  import("@/components/stash/FeedbackSuggestions").then((m) => ({
    default: m.FeedbackSuggestions,
  })),
);

interface HomeDeepModulesProps {
  role: Role;
  onBook: (p?: BookingPrefill) => void;
  onRefer: () => void;
}

export function HomeDeepModules({ role, onBook, onRefer }: HomeDeepModulesProps) {
  return (
    <div className="hidden md:block content-visibility-auto optimize-render">
      <FadeUp>
        <ErrorBoundary sectionName="Why StashSaarthi vs Traditional PGs">
          <Suspense fallback={null}>
            <PgComparisonTable onBook={onBook} />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      <FadeUp>
        <ErrorBoundary sectionName="Dual Crisis Overview">
          <Suspense fallback={null}>
            <DualCrisis />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      <ErrorBoundary sectionName="Top Rated Kitchens">
        <Suspense fallback={null}>
          <TopRatedKitchensWidget
            onOrderMeal={(kId) =>
              onBook({
                service: "kitchen",
                note: `Selected Top Rated Kitchen of the Week: ${kId}`,
              })
            }
          />
        </Suspense>
      </ErrorBoundary>

      <FadeUp>
        <ErrorBoundary sectionName="Kanpur Student Council">
          <Suspense fallback={null}>
            <KanpurStudentCouncil />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

      <FadeUp>
        <ErrorBoundary sectionName="Referral Leaderboard">
          <Suspense fallback={null}>
            <ReferralLeaderboard onRefer={onRefer} />
          </Suspense>
        </ErrorBoundary>
      </FadeUp>

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
  );
}
