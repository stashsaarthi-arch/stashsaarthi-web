/**
 * StashSaarthi — Local Submissions Store
 * Single source of truth for all form submissions saved to localStorage.
 * Admin dashboard reads from here — zero Supabase dependency.
 */

// ─── Storage Keys ────────────────────────────────────────────────────────────
export const LS_KEYS = {
  BOOKINGS: "ss_admin_bookings",
  WAITLIST: "ss_admin_waitlist",
  MEAL_ORDERS: "ss_admin_meal_orders",
  REVIEWS: "stash_user_reviews",
  SUGGESTIONS: "stash_user_suggestions",
  CONTACTED: "stash_contacted_leads",
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────
export type ServiceType =
  | "stash"
  | "spaces"
  | "kitchen"
  | "connect"
  | "trust"
  | "micro"
  | "waitlist"
  | "meal";

export interface BookingRecord {
  id: string;
  service: ServiceType;
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode?: string;
  token: string;
  amount: number;
  paymentMode: string;
  message: string; // full service meta string
  submittedAt: string;
  // Service-specific extras
  bags?: number;
  months?: number;
  roomType?: string;
  moveInDate?: string;
  mealPlan?: string;
  dietType?: string;
  personalizations?: string[];
  connectDomain?: string;
  auditType?: string;
  monetizeAsset?: string;
}

export interface WaitlistRecord {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  user_type: "student" | "host";
  college_or_locality?: string;
  submittedAt: string;
  source: string;
}

export interface MealOrderRecord {
  id: string;
  name: string;
  phone: string;
  mealType: string;
  kitchenNode: string;
  deliverySlot: string;
  address: string;
  amount: number;
  submittedAt: string;
}

export interface ReviewRecord {
  id: string;
  name: string;
  rating: number;
  service: string;
  comment: string;
  createdAt: string;
}

export interface SuggestionRecord {
  id: string;
  text: string;
  upvotes: number;
  createdAt: string;
}

// ─── Read helpers ─────────────────────────────────────────────────────────────
function readLS<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Write helpers ────────────────────────────────────────────────────────────
function writeLS<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded – silently fail
  }
}

// ─── Bookings ────────────────────────────────────────────────────────────────
export function saveBooking(record: BookingRecord): void {
  const existing = readLS<BookingRecord>(LS_KEYS.BOOKINGS);
  // deduplicate by token
  const deduped = existing.filter((r) => r.token !== record.token);
  writeLS(LS_KEYS.BOOKINGS, [record, ...deduped]);
}

export function getBookings(): BookingRecord[] {
  return readLS<BookingRecord>(LS_KEYS.BOOKINGS).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function deleteBooking(id: string): void {
  const existing = readLS<BookingRecord>(LS_KEYS.BOOKINGS);
  writeLS(LS_KEYS.BOOKINGS, existing.filter((r) => r.id !== id));
}

// ─── Waitlist ────────────────────────────────────────────────────────────────
export function saveWaitlistEntry(record: WaitlistRecord): void {
  const existing = readLS<WaitlistRecord>(LS_KEYS.WAITLIST);
  const deduped = existing.filter((r) => r.id !== record.id);
  writeLS(LS_KEYS.WAITLIST, [record, ...deduped]);
}

export function getWaitlistEntries(): WaitlistRecord[] {
  // merge with offline queue from waitlistService
  const main = readLS<WaitlistRecord>(LS_KEYS.WAITLIST);
  const offlineQueue = readLS<{ id: string; data: Record<string, unknown>; queuedAt?: string }>(
    "stash_offline_queue_users_waitlist",
  ).map((item) => ({
    id: item.id,
    full_name: (item.data?.full_name as string) || "Offline Lead",
    email: (item.data?.email as string) || "",
    phone_number: (item.data?.phone_number as string) || undefined,
    user_type: ((item.data?.user_type as "student" | "host") || "student") as "student" | "host",
    college_or_locality: (item.data?.college_or_locality as string) || undefined,
    submittedAt: item.queuedAt || new Date().toISOString(),
    source: "Offline Queue",
  }));
  const combined = [...main, ...offlineQueue];
  const seen = new Set<string>();
  return combined
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

// ─── Meal Orders ─────────────────────────────────────────────────────────────
export function saveMealOrder(record: MealOrderRecord): void {
  const existing = readLS<MealOrderRecord>(LS_KEYS.MEAL_ORDERS);
  writeLS(LS_KEYS.MEAL_ORDERS, [record, ...existing]);
}

export function getMealOrders(): MealOrderRecord[] {
  // also read ss_last_meal_order from TokenMealHub
  const main = readLS<MealOrderRecord>(LS_KEYS.MEAL_ORDERS);
  try {
    const lastRaw = localStorage.getItem("ss_last_meal_order");
    if (lastRaw) {
      const last = JSON.parse(lastRaw) as MealOrderRecord;
      if (last && last.id && !main.find((m) => m.id === last.id)) {
        return [last, ...main].sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
        );
      }
    }
  } catch {
    // ignore
  }
  return main.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export function getReviews(): ReviewRecord[] {
  return readLS<ReviewRecord>(LS_KEYS.REVIEWS).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ─── Suggestions ─────────────────────────────────────────────────────────────
export function getSuggestions(): SuggestionRecord[] {
  return readLS<SuggestionRecord>(LS_KEYS.SUGGESTIONS).sort(
    (a, b) => (b.upvotes || 0) - (a.upvotes || 0),
  );
}

// ─── Contacted Leads ─────────────────────────────────────────────────────────
export function getContactedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LS_KEYS.CONTACTED);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleContacted(id: string): Set<string> {
  const current = getContactedIds();
  if (current.has(id)) current.delete(id);
  else current.add(id);
  localStorage.setItem(LS_KEYS.CONTACTED, JSON.stringify(Array.from(current)));
  return current;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface AdminStats {
  totalBookings: number;
  totalWaitlist: number;
  totalMealOrders: number;
  totalReviews: number;
  totalSuggestions: number;
  revenueEstimate: number;
  serviceBreakdown: Record<string, number>;
}

export function getAdminStats(): AdminStats {
  const bookings = getBookings();
  const waitlist = getWaitlistEntries();
  const meals = getMealOrders();
  const reviews = getReviews();
  const suggestions = getSuggestions();

  const serviceBreakdown: Record<string, number> = {};
  for (const b of bookings) {
    serviceBreakdown[b.service] = (serviceBreakdown[b.service] || 0) + 1;
  }

  const revenueEstimate = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  return {
    totalBookings: bookings.length,
    totalWaitlist: waitlist.length,
    totalMealOrders: meals.length,
    totalReviews: reviews.length,
    totalSuggestions: suggestions.length,
    revenueEstimate,
    serviceBreakdown,
  };
}
