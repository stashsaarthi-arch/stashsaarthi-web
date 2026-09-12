export type Role = "student" | "host";

export type BookingPrefill = {
  service?: string | undefined;
  note?: string | undefined;
  bags?: number | undefined;
  months?: number | undefined;
  amount?: number | undefined;
  address?: string | undefined;
  roomType?: "single" | "shared" | "floor" | undefined;
  mealPlan?: "trial" | "smart" | "freedom" | "semester" | undefined;
};

export type OpenBooking = (prefill?: BookingPrefill) => void;

