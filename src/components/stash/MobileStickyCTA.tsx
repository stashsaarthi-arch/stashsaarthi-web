import React from "react";
import { QuickActionFloatingDock } from "./QuickActionFloatingDock";
import { StickyMobileBottomBar } from "@/components/ui/StickyMobileBottomBar";
import type { OpenBooking } from "./types";

export const MobileStickyCTA = React.memo(function MobileStickyCTA({
  onBook,
  onListRoom,
}: {
  onBook: OpenBooking;
  onListRoom?: () => void;
}) {
  return (
    <>
      <QuickActionFloatingDock onBook={onBook} onListRoom={onListRoom} />
      <StickyMobileBottomBar onBook={onBook} onListRoom={onListRoom} />
    </>
  );
});


