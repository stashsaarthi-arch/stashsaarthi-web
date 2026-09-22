/**
 * StashSaarthi — Unified User Master Bookings Engine
 * Compiles Storage (stash_bookings), Kitchen Tokens (meal_bookings),
 * and Spaces Lease Agreements (co_living_inquiries) into a single
 * queryable data structure with instant pagination and offline local fallback.
 */

import { supabase } from "@/integrations/supabase/client";
import {
  getBookings,
  getMealOrders,
  type BookingRecord,
  type MealOrderRecord,
} from "./localSubmissions";

export type MasterBookingType = "storage" | "kitchen" | "spaces";

export interface MasterBookingRecord {
  id: string;
  booking_type: MasterBookingType;
  user_id: string | null;
  user_name: string | null;
  user_phone: string | null;
  user_email: string | null;
  title: string;
  service_details: Record<string, any>;
  total_amount: number;
  status: "active" | "completed" | "cancelled" | "confirmed";
  created_at: string;
}

export interface PaginationOptions {
  email?: string;
  phone?: string;
  page?: number;
  pageSize?: number;
  bookingType?: "all" | MasterBookingType;
  status?: "all" | "active" | "completed" | "cancelled";
}

export interface PaginatedMasterBookings {
  records: MasterBookingRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/**
 * Converts local storage submission records into unified MasterBookingRecord objects.
 */
export function getLocalMasterBookings(userEmail?: string): MasterBookingRecord[] {
  const masterRecords: MasterBookingRecord[] = [];

  // 1. Storage & Spaces Bookings from localSubmissions
  const rawBookings: BookingRecord[] = getBookings();
  const filteredBookings = userEmail
    ? rawBookings.filter((b) => b.email && b.email.toLowerCase() === userEmail.toLowerCase())
    : rawBookings;

  for (const b of filteredBookings) {
    const type: MasterBookingType = b.service === "spaces" ? "spaces" : "storage";

    masterRecords.push({
      id: b.id,
      booking_type: type,
      user_id: null,
      user_name: b.name || "Student User",
      user_phone: b.phone || null,
      user_email: b.email || null,
      title:
        type === "spaces"
          ? `Co-Living Room Lease (${b.city || "Kakadeo"})`
          : `${b.bags || 1} Bag(s) Luggage Storage (${b.city || "Kanpur"})`,
      service_details: {
        token: b.token,
        bags: b.bags,
        months: b.months,
        city: b.city,
        paymentMode: b.paymentMode,
        message: b.message,
      },
      total_amount: b.amount || (type === "spaces" ? 5500 : 300),
      status: b.status || "active",
      created_at: b.submittedAt || new Date().toISOString(),
    });
  }

  // 2. Kitchen Meal Orders from localSubmissions
  const rawMeals: MealOrderRecord[] = getMealOrders();
  for (const m of rawMeals) {
    masterRecords.push({
      id: m.id,
      booking_type: "kitchen",
      user_id: null,
      user_name: "Student User",
      user_phone: null,
      user_email: userEmail || null,
      title: `${m.kitchenNode || "Home Kitchen"} - ${m.mealType || "Meal Token"}`,
      service_details: {
        kitchenNode: m.kitchenNode,
        deliverySlot: m.deliverySlot,
        address: m.address,
      },
      total_amount: m.amount || 50,
      status: "confirmed",
      created_at: m.submittedAt || new Date().toISOString(),
    });
  }

  // Sort descending by created_at
  return masterRecords.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/**
 * Merges Supabase view results with local storage submissions to ensure 100% offline resilience.
 * Removes duplicates by ID.
 */
export function compileUnifiedUserMasterBookings(
  supabaseData: MasterBookingRecord[],
  localData: MasterBookingRecord[],
): MasterBookingRecord[] {
  const map = new Map<string, MasterBookingRecord>();

  // Add local data first
  for (const item of localData) {
    map.set(item.id, item);
  }

  // Supabase data overrides or adds
  for (const item of supabaseData) {
    map.set(item.id, item);
  }

  const merged = Array.from(map.values());
  return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Fetches user_master_bookings from Supabase with instant pagination, fallback to local storage.
 */
export async function getUserMasterBookings(
  options: PaginationOptions = {},
): Promise<PaginatedMasterBookings> {
  const { email, phone, page = 1, pageSize = 10, bookingType = "all", status = "all" } = options;

  let supabaseRecords: MasterBookingRecord[] = [];

  try {
    let query = (supabase as any).from("user_master_bookings").select("*");

    if (email) {
      query = query.eq("user_email", email);
    }
    if (phone) {
      query = query.eq("user_phone", phone);
    }
    if (bookingType !== "all") {
      query = query.eq("booking_type", bookingType);
    }
    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      supabaseRecords = data as MasterBookingRecord[];
    }
  } catch {
    // Supabase offline or view unavailable — fallback gracefully
  }

  const localRecords = getLocalMasterBookings(email);
  let allRecords = compileUnifiedUserMasterBookings(supabaseRecords, localRecords);

  // Apply in-memory filters if needed
  if (bookingType !== "all") {
    allRecords = allRecords.filter((r) => r.booking_type === bookingType);
  }
  if (status !== "all") {
    allRecords = allRecords.filter((r) => r.status === status);
  }

  const totalCount = allRecords.length;
  const pageCount = Math.ceil(totalCount / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, pageCount));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = allRecords.slice(startIndex, startIndex + pageSize);

  return {
    records: paginatedRecords,
    totalCount,
    page: currentPage,
    pageSize,
    pageCount,
  };
}
