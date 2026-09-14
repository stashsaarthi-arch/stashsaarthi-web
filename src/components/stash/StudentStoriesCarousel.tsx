import { memo } from "react";
import { TestimonialCarousel2 } from "@/components/ui/TestimonialCarousel2";
import type { OpenBooking } from "./types";

export const StudentStoriesCarousel = memo(function StudentStoriesCarousel({
  onBook,
}: {
  onBook: OpenBooking;
}) {
  return (
    <TestimonialCarousel2
      onBook={({ service }) => {
        onBook({ service: service as any });
      }}
    />
  );
});
