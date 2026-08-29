export type Role = "student" | "host";

export type BookingPrefill = {
  service?: string | undefined;
  note?: string | undefined;
  bags?: number | undefined;
  months?: number | undefined;
  amount?: number | undefined;
};

export type OpenBooking = (prefill?: BookingPrefill) => void;
