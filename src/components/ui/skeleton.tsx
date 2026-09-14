import React from "react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/context/PersonaContext";
import { SKELETON_LOADER_TOKENS } from "@/lib/designTokens";

export interface ShimmerWaveSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  role?: "student" | "host";
  pulse?: boolean;
}

/**
 * Base ShimmerWaveSkeleton primitive with 1.8s glowing wave shimmer sweep
 * supporting persona themes (Emerald/Cyan Student vs Amber/Gold Host).
 */
function ShimmerWaveSkeleton({
  className,
  role,
  pulse = true,
  ...props
}: ShimmerWaveSkeletonProps) {
  const { role: contextRole } = usePersona();
  const activeRole = role || contextRole || "student";
  const isHost = activeRole === "host";

  const shimmerClass = isHost
    ? "shimmer-wave-host border-amber-500/20"
    : "shimmer-wave-student border-emerald-500/20";

  return (
    <div
      className={cn(
        "shimmer-wave-skeleton relative overflow-hidden rounded-xl bg-slate-900/60 border border-white/5",
        shimmerClass,
        pulse && "animate-pulse",
        className
      )}
      data-persona={activeRole}
      {...props}
    />
  );
}

/**
 * Basic pulse skeleton fallback (Backward Compatible)
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10 dark:bg-slate-800/80", className)}
      {...props}
    />
  );
}

/**
 * Legacy CardSkeleton (Backward Compatible)
 */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 border border-white/10 space-y-4 animate-pulse bg-slate-900/60",
        className
      )}
    >
      <ShimmerWaveSkeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <ShimmerWaveSkeleton className="h-5 w-3/5 rounded-md" />
          <ShimmerWaveSkeleton className="h-5 w-1/4 rounded-full" />
        </div>
        <ShimmerWaveSkeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="space-y-2 pt-2 border-t border-white/5">
        <ShimmerWaveSkeleton className="h-3 w-full rounded-md" />
        <ShimmerWaveSkeleton className="h-3 w-5/6 rounded-md" />
      </div>
      <div className="flex gap-2 pt-2">
        <ShimmerWaveSkeleton className="h-10 flex-1 rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Legacy RoomCardSkeleton (Backward Compatible)
 */
function RoomCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10 animate-pulse bg-slate-900/60 flex flex-col h-full">
      <ShimmerWaveSkeleton className="h-48 w-full rounded-none" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <ShimmerWaveSkeleton className="h-6 w-2/5 rounded-lg" />
            <ShimmerWaveSkeleton className="h-7 w-1/3 rounded-full" />
          </div>
          <ShimmerWaveSkeleton className="h-4 w-4/5 rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-3/4 rounded-md" />
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
          <ShimmerWaveSkeleton className="h-3 w-full rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-4/5 rounded-md" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <ShimmerWaveSkeleton className="h-10 flex-1 rounded-xl" />
          <ShimmerWaveSkeleton className="h-10 h-10 w-10 shrink-0 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Legacy ReviewCardSkeleton (Backward Compatible)
 */
function ReviewCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 animate-pulse bg-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShimmerWaveSkeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <ShimmerWaveSkeleton className="h-4 w-32 rounded-md" />
            <ShimmerWaveSkeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
        <ShimmerWaveSkeleton className="h-6 w-16 rounded-full" />
      </div>
      <ShimmerWaveSkeleton className="h-4 w-3/4 rounded-md" />
      <div className="space-y-1.5 pt-1">
        <ShimmerWaveSkeleton className="h-3.5 w-full rounded-md" />
        <ShimmerWaveSkeleton className="h-3.5 w-5/6 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Legacy MealCardSkeleton (Backward Compatible)
 */
function MealCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 animate-pulse bg-slate-900/60 space-y-4">
      <div className="flex gap-4 items-center">
        <ShimmerWaveSkeleton className="h-20 w-20 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-start">
            <ShimmerWaveSkeleton className="h-5 w-32 rounded-md" />
            <ShimmerWaveSkeleton className="h-6 w-16 rounded-full" />
          </div>
          <ShimmerWaveSkeleton className="h-3.5 w-full rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-3/4 rounded-md" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <ShimmerWaveSkeleton className="h-4 w-28 rounded-md" />
        <ShimmerWaveSkeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Legacy NodeSkeleton (Backward Compatible)
 */
function NodeSkeleton() {
  return (
    <div className="glass rounded-xl p-3.5 border border-white/10 animate-pulse bg-slate-900/60 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <ShimmerWaveSkeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="space-y-1.5">
          <ShimmerWaveSkeleton className="h-4 w-36 rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-28 rounded-md" />
        </div>
      </div>
      <ShimmerWaveSkeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

/**
 * TableRowSkeleton (Backward Compatible)
 */
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <ShimmerWaveSkeleton
            className={cn(
              "h-4 rounded-md",
              i === 0
                ? "w-36"
                : i === 1
                ? "w-24"
                : i === 2
                ? "w-40"
                : i === 3
                ? "w-20"
                : "w-16 ml-auto"
            )}
          />
        </td>
      ))}
    </tr>
  );
}

/**
 * TableSkeleton (Backward Compatible)
 */
function TableSkeleton({ rows = 4, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}

/* ==========================================================================
   Task 150: Geometrically Exact Card Skeleton Loaders
   Matching SaarthiStashCard2, SaarthiSpacesCard2, SaarthiKitchenCard2, 
   SaarthiConnectCard2, FaqAccordion2, TestimonialCarousel2, & ComparisonMatrix
   ========================================================================== */

export function SaarthiStashCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 border border-white/10 space-y-5 bg-slate-900/80 w-full max-w-xl mx-auto shadow-2xl",
        className
      )}
    >
      {/* Top Header & Tamper Seal Pill */}
      <div className="flex justify-between items-center gap-3">
        <ShimmerWaveSkeleton className="h-7 w-36 rounded-full" />
        <ShimmerWaveSkeleton className="h-8 w-44 rounded-full" />
      </div>

      {/* 3D Depth Luggage Stage */}
      <div className="h-44 w-full rounded-2xl p-4 bg-slate-950/80 border border-white/5 flex flex-col justify-around">
        <ShimmerWaveSkeleton className="h-10 w-full rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 w-5/6 mx-auto rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 w-2/3 mx-auto rounded-xl" />
      </div>

      {/* Price Pill Block */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <ShimmerWaveSkeleton className="h-8 w-32 rounded-lg" />
          <ShimmerWaveSkeleton className="h-3 w-48 rounded-md" />
        </div>
        <ShimmerWaveSkeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* CTA Button */}
      <ShimmerWaveSkeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function SaarthiSpacesCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden border border-white/10 bg-slate-900/80 flex flex-col h-full w-full shadow-2xl",
        className
      )}
    >
      {/* 16:9 Image Carousel Stage */}
      <div className="aspect-[16/9] w-full relative">
        <ShimmerWaveSkeleton className="w-full h-full rounded-none" />
        <div className="absolute top-3 left-3 flex gap-2">
          <ShimmerWaveSkeleton className="h-7 w-32 rounded-full" />
          <ShimmerWaveSkeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <ShimmerWaveSkeleton className="h-7 w-1/2 rounded-lg" />
            <ShimmerWaveSkeleton className="h-7 w-24 rounded-full" />
          </div>
          <ShimmerWaveSkeleton className="h-4 w-3/4 rounded-md" />
          <ShimmerWaveSkeleton className="h-8 w-full rounded-full" />
        </div>

        {/* Host Review Snippet */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
          <ShimmerWaveSkeleton className="h-3 w-full rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-4/5 rounded-md" />
        </div>

        {/* CTAs */}
        <div className="flex gap-2 pt-1">
          <ShimmerWaveSkeleton className="h-11 flex-1 rounded-xl" />
          <ShimmerWaveSkeleton className="h-11 w-11 shrink-0 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SaarthiKitchenCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 border border-white/10 space-y-4 bg-slate-900/80 w-full shadow-2xl",
        className
      )}
    >
      {/* Timer Pulse Header */}
      <div className="flex justify-between items-center">
        <ShimmerWaveSkeleton className="h-7 w-40 rounded-full" />
        <ShimmerWaveSkeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Thali Rotating Preview Stage */}
      <div className="h-40 w-full rounded-2xl bg-slate-950/80 border border-white/5 p-4 flex gap-4 items-center">
        <ShimmerWaveSkeleton className="h-28 w-28 shrink-0 rounded-2xl" />
        <div className="space-y-3 flex-1">
          <ShimmerWaveSkeleton className="h-6 w-3/4 rounded-md" />
          <ShimmerWaveSkeleton className="h-4 w-full rounded-md" />
          <ShimmerWaveSkeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </div>

      {/* Macro Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2">
        <ShimmerWaveSkeleton className="h-10 w-full rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 w-full rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 w-full rounded-xl" />
        <ShimmerWaveSkeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Chef Bio Pill */}
      <ShimmerWaveSkeleton className="h-9 w-full rounded-full" />

      {/* CTA Button */}
      <ShimmerWaveSkeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function SaarthiConnectCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 border border-white/10 space-y-5 bg-slate-900/80 w-full shadow-2xl",
        className
      )}
    >
      {/* Dual Profile Avatars */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShimmerWaveSkeleton className="h-14 w-14 rounded-full shrink-0" />
          <div className="space-y-2">
            <ShimmerWaveSkeleton className="h-5 w-28 rounded-md" />
            <ShimmerWaveSkeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
        <ShimmerWaveSkeleton className="h-8 w-24 rounded-full" />
        <div className="flex items-center gap-3">
          <div className="space-y-2 text-right">
            <ShimmerWaveSkeleton className="h-5 w-28 rounded-md ml-auto" />
            <ShimmerWaveSkeleton className="h-3 w-20 rounded-md ml-auto" />
          </div>
          <ShimmerWaveSkeleton className="h-14 w-14 rounded-full shrink-0" />
        </div>
      </div>

      {/* Senior Hobbies & Student Skill Chips */}
      <div className="space-y-3 pt-2">
        <ShimmerWaveSkeleton className="h-8 w-full rounded-lg" />
        <ShimmerWaveSkeleton className="h-8 w-5/6 rounded-lg" />
      </div>

      {/* Karma Points Counter Pill */}
      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
        <ShimmerWaveSkeleton className="h-6 w-36 rounded-md" />
        <ShimmerWaveSkeleton className="h-7 w-28 rounded-full" />
      </div>

      {/* CTA Button */}
      <ShimmerWaveSkeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function FaqAccordionSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4 w-full">
      {/* Search & Category Chips */}
      <div className="space-y-3">
        <ShimmerWaveSkeleton className="h-13 w-full rounded-xl" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerWaveSkeleton key={i} className="h-9 w-28 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      {/* Accordion Triggers */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/10 bg-slate-900/60 space-y-2"
          >
            <div className="flex justify-between items-center">
              <ShimmerWaveSkeleton className="h-5 w-3/4 rounded-md" />
              <ShimmerWaveSkeleton className="h-5 w-5 rounded-full" />
            </div>
            {i === 0 && (
              <div className="space-y-2 pt-3 border-t border-white/5">
                <ShimmerWaveSkeleton className="h-4 w-full rounded-md" />
                <ShimmerWaveSkeleton className="h-4 w-5/6 rounded-md" />
                <ShimmerWaveSkeleton className="h-4 w-2/3 rounded-md" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialCarouselSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-5 bg-slate-900/80 w-full max-w-3xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShimmerWaveSkeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="space-y-2">
            <ShimmerWaveSkeleton className="h-5 w-36 rounded-md" />
            <ShimmerWaveSkeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
        <ShimmerWaveSkeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Equalizer Waveform Player */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center gap-3">
        <ShimmerWaveSkeleton className="h-10 w-10 rounded-full shrink-0" />
        <ShimmerWaveSkeleton className="h-8 flex-1 rounded-lg" />
        <ShimmerWaveSkeleton className="h-4 w-12 rounded-md" />
      </div>

      {/* Quote Body */}
      <div className="space-y-2">
        <ShimmerWaveSkeleton className="h-5 w-full rounded-md" />
        <ShimmerWaveSkeleton className="h-5 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

export function ComparisonMatrixSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 space-y-4">
            <ShimmerWaveSkeleton className="h-8 w-full rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <ShimmerWaveSkeleton key={j} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  Skeleton,
  ShimmerWaveSkeleton,
  CardSkeleton,
  RoomCardSkeleton,
  ReviewCardSkeleton,
  MealCardSkeleton,
  NodeSkeleton,
  TableRowSkeleton,
  TableSkeleton,
};
