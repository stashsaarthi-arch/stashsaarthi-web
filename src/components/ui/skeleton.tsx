import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer-skeleton rounded-lg bg-white/[0.04] dark:bg-white/[0.04]", className)}
      {...props}
    />
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 border border-white/[0.06] space-y-4 bg-[#0D1216]/80 backdrop-blur-xl",
        className
      )}
    >
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-5 w-1/4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-5/6 rounded-md" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0D1216]/80 backdrop-blur-xl flex flex-col h-full">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-2/5 rounded-lg" />
            <Skeleton className="h-7 w-1/3 rounded-full" />
          </div>
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-white/[0.06] bg-[#0D1216]/80 backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-5/6 rounded-md" />
      </div>
    </div>
  );
}

function MealCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-white/[0.06] bg-[#0D1216]/80 backdrop-blur-xl space-y-4">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

function NodeSkeleton() {
  return (
    <div className="rounded-xl p-3.5 border border-white/[0.06] bg-[#0D1216]/80 backdrop-blur-xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-3 w-28 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton
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

function TableSkeleton({ rows = 4, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}

export {
  Skeleton,
  CardSkeleton,
  RoomCardSkeleton,
  ReviewCardSkeleton,
  MealCardSkeleton,
  NodeSkeleton,
  TableRowSkeleton,
  TableSkeleton,
};

