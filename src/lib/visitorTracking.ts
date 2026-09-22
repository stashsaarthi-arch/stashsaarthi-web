/**
 * StashSaarthi — Visitor Tracking Engine
 * Captures device, browser, geo, and behavioral signals from every visitor
 * and persists them to Supabase for cross-device admin visibility.
 *
 * Data captured: session ID, device type, OS, browser, screen, timezone,
 * language, referrer, UTM params, pages visited, services clicked, time spent.
 *
 * Privacy: No PII is captured. IP is resolved server-side by Supabase.
 * This is analytics-only — fully DPDP 2023 compliant.
 */

import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface VisitorSession {
  session_id: string;
  device_type: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  pages_visited: string[];
  services_clicked: string[];
  time_on_site_seconds: number;
  first_seen_at: string;
  last_seen_at: string;
  country?: string;
  city_hint?: string; // derived from timezone
}

// ─── Session ID ──────────────────────────────────────────────────────────────
const SESSION_KEY = "ss_visitor_session_id";
const SESSION_DATA_KEY = "ss_visitor_session_data";
const SESSION_START_KEY = "ss_visitor_session_start";
const FLUSH_INTERVAL_MS = 30_000; // flush to Supabase every 30s

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `vs-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ─── Device detection ─────────────────────────────────────────────────────────
function detectDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua))
    return "mobile";
  return "desktop";
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  if (/Windows NT 6/.test(ua)) return "Windows 8/8.1";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android (\d+\.\d+)/.test(ua)) return `Android ${RegExp.$1}`;
  if (/iPhone OS (\d+)/.test(ua)) return `iOS ${RegExp.$1.replace(/_/g, ".")}`;
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown OS";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/OPR|Opera/.test(ua)) return "Opera";
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\/(\d+)/.test(ua) && !/Chromium/.test(ua)) return `Chrome ${RegExp.$1}`;
  if (/Firefox\/(\d+)/.test(ua)) return `Firefox ${RegExp.$1}`;
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/MSIE|Trident/.test(ua)) return "IE";
  return "Unknown Browser";
}

function getCityHintFromTimezone(tz: string): string {
  // Map common Indian timezones / IST
  const TZ_MAP: Record<string, string> = {
    "Asia/Kolkata": "India (IST)",
    "Asia/Calcutta": "India (IST)",
    "Asia/Dubai": "UAE",
    "Asia/Singapore": "Singapore",
    "America/New_York": "US East",
    "America/Los_Angeles": "US West",
    "Europe/London": "UK",
    "Europe/Berlin": "Germany",
  };
  return TZ_MAP[tz] || tz;
}

function parseUTM(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  if (params.get("utm_source")) result["utm_source"] = params.get("utm_source")!;
  if (params.get("utm_medium")) result["utm_medium"] = params.get("utm_medium")!;
  if (params.get("utm_campaign")) result["utm_campaign"] = params.get("utm_campaign")!;
  return result;
}

// ─── Session data management ──────────────────────────────────────────────────
function loadSessionData(): VisitorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_DATA_KEY);
    return raw ? (JSON.parse(raw) as VisitorSession) : null;
  } catch {
    return null;
  }
}

function saveSessionData(data: VisitorSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data));
  } catch {
    // quota
  }
}

function buildInitialSession(): VisitorSession {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utm = parseUTM();
  const now = new Date().toISOString();
  return {
    session_id: getOrCreateSessionId(),
    device_type: detectDeviceType(),
    os: detectOS(),
    browser: detectBrowser(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: tz,
    language: navigator.language || "en",
    referrer: document.referrer || "direct",
    pages_visited: [window.location.pathname],
    services_clicked: [],
    time_on_site_seconds: 0,
    first_seen_at: now,
    last_seen_at: now,
    city_hint: getCityHintFromTimezone(tz),
    ...utm,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _session: VisitorSession | null = null;
let _flushTimer: ReturnType<typeof setInterval> | null = null;

/** Track a page navigation */
export function trackPageView(path: string): void {
  if (!_session) return;
  if (!_session.pages_visited.includes(path)) {
    _session.pages_visited = [..._session.pages_visited, path];
  }
  _session.last_seen_at = new Date().toISOString();
  saveSessionData(_session);
}

/** Track a service interaction (booking/waitlist/meal/etc.) */
export function trackServiceClick(service: string): void {
  if (!_session) return;
  if (!_session.services_clicked.includes(service)) {
    _session.services_clicked = [..._session.services_clicked, service];
  }
  _session.last_seen_at = new Date().toISOString();
  saveSessionData(_session);
  // Immediate flush on service interaction
  flushToSupabase();
}

/** Flush session data to Supabase visitor_sessions table */
async function flushToSupabase(): Promise<void> {
  if (!_session || typeof window === "undefined") return;
  const startTime = parseInt(sessionStorage.getItem(SESSION_START_KEY) || "0");
  _session.time_on_site_seconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  _session.last_seen_at = new Date().toISOString();
  saveSessionData(_session);

  try {
    await (supabase as any).from("visitor_sessions").upsert(
      {
        session_id: _session.session_id,
        device_type: _session.device_type,
        os: _session.os,
        browser: _session.browser,
        screen_resolution: _session.screen_resolution,
        timezone: _session.timezone,
        language: _session.language,
        referrer: _session.referrer,
        utm_source: _session.utm_source ?? null,
        utm_medium: _session.utm_medium ?? null,
        utm_campaign: _session.utm_campaign ?? null,
        pages_visited: _session.pages_visited,
        services_clicked: _session.services_clicked,
        time_on_site_seconds: _session.time_on_site_seconds,
        first_seen_at: _session.first_seen_at,
        last_seen_at: _session.last_seen_at,
        city_hint: _session.city_hint ?? null,
      },
      { onConflict: "session_id" },
    );
  } catch {
    // silent — visitor tracking should never break the app
  }
}

/**
 * Initialize visitor tracking.
 * Call once in RootComponent on mount.
 * Returns a cleanup function.
 */
export function initVisitorTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  // Restore or create session
  _session = loadSessionData() ?? buildInitialSession();

  // Record session start time
  if (!sessionStorage.getItem(SESSION_START_KEY)) {
    sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
  }

  saveSessionData(_session);

  // Immediate flush on first visit
  flushToSupabase();

  // Periodic flush every 30s
  _flushTimer = setInterval(flushToSupabase, FLUSH_INTERVAL_MS);

  // Flush on page unload
  const handleUnload = () => {
    flushToSupabase();
  };
  window.addEventListener("beforeunload", handleUnload);

  return () => {
    if (_flushTimer) clearInterval(_flushTimer);
    window.removeEventListener("beforeunload", handleUnload);
    flushToSupabase();
  };
}

/**
 * Fetch all visitor sessions from Supabase for the admin dashboard.
 * Returns them sorted by last_seen_at desc.
 */
export interface VisitorRow {
  session_id: string;
  device_type: string;
  os: string;
  browser: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  pages_visited: string[];
  services_clicked: string[];
  time_on_site_seconds: number;
  first_seen_at: string;
  last_seen_at: string;
  city_hint: string | null;
}

export async function fetchVisitorSessions(limit = 200): Promise<VisitorRow[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("visitor_sessions")
      .select("*")
      .order("last_seen_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as VisitorRow[];
  } catch {
    return [];
  }
}
