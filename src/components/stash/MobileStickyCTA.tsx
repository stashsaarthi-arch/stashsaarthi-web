import React from "react";
import { QuickActionFloatingDock } from "./QuickActionFloatingDock";
import type { OpenBooking } from "./types";

export const MobileStickyCTA = React.memo(function MobileStickyCTA({
  onBook,
  onListRoom,
}: {
  onBook: OpenBooking;
  onListRoom?: () => void;
}) {
  return <QuickActionFloatingDock onBook={onBook} onListRoom={onListRoom} />;
});

