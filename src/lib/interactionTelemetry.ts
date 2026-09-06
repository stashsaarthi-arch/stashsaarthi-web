/**
 * StashSaarthi Component Interaction Telemetry & Hover-Dwell Analytics Engine
 *
 * Tracks granular, component-level user engagement metrics:
 * - Hover / Dwell duration (e.g. hover time on ₹50 vs ₹60 vs ₹70 thali)
 * - Click & View interactions
 * - Automatic batching (10s window or 5 records buffer)
 * - Zero Data Drop offline queueing via IndexedDB
 * - Supabase persistence (`component_interaction_telemetry` table)
 */

import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError, queueOfflineSubmission } from "@/lib/supabaseLogger";
import { useEffect, useRef, useCallback } from "react";

export interface ComponentInteractionRecord {
  id?: string;
  session_id: string;
  component_id: string; // e.g. "thali_standard_50", "thali_paneer_70", "room_kakadeo_5500"
  component_category: string; // e.g. "kitchen_thali", "spaces_room", "calculator_slider"
  interaction_type: "hover" | "click" | "dwell" | "view" | "drag";
  dwell_time_ms: number;
  persona?: "student" | "host";
  metadata?: Record<string, unknown>;
  created_at?: string;
}

// Global Telemetry Store & Buffer
const BUFFER_FLUSH_INTERVAL_MS = 10000;
const BUFFER_MAX_SIZE = 5;

let interactionBuffer: ComponentInteractionRecord[] = [];
let bufferTimer: NodeJS.Timeout | null = null;

/**
 * Get or create persistent session ID for telemetry tracking
 */
export function getTelemetrySessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    let sid = localStorage.getItem("ss_telemetry_session_id");
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("ss_telemetry_session_id", sid);
    }
    return sid;
  } catch {
    return `sess_fallback_${Date.now()}`;
  }
}

/**
 * Record a component interaction event
 */
export function recordInteraction(
  record: Omit<ComponentInteractionRecord, "session_id" | "created_at">
): void {
  if (typeof window === "undefined") return;

  // Ignore negligible hover noise (< 100ms)
  if (record.interaction_type === "hover" && record.dwell_time_ms < 100) {
    return;
  }

  const persona =
    (localStorage.getItem("ss_user_persona") as "student" | "host") || "student";

  const fullRecord: ComponentInteractionRecord = {
    ...record,
    session_id: getTelemetrySessionId(),
    persona,
    created_at: new Date().toISOString(),
  };

  interactionBuffer.push(fullRecord);

  // Print telemetry dev log
  if (import.meta.env.DEV) {
    console.debug(
      `[Telemetry:Interaction] Component: ${fullRecord.component_id} | Type: ${fullRecord.interaction_type} | Dwell: ${fullRecord.dwell_time_ms}ms`,
      fullRecord.metadata
    );
  }

  if (interactionBuffer.length >= BUFFER_MAX_SIZE) {
    void flushTelemetryBuffer();
  } else if (!bufferTimer) {
    bufferTimer = setTimeout(() => {
      void flushTelemetryBuffer();
    }, BUFFER_FLUSH_INTERVAL_MS);
  }
}

/**
 * Flush collected interaction telemetry buffer to Supabase / IndexedDB
 */
export async function flushTelemetryBuffer(): Promise<void> {
  if (bufferTimer) {
    clearTimeout(bufferTimer);
    bufferTimer = null;
  }

  if (interactionBuffer.length === 0) return;

  const recordsToFlush = [...interactionBuffer];
  interactionBuffer = [];

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    // Offline: queue immediately
    void queueOfflineSubmission("component_interaction_telemetry", recordsToFlush);
    return;
  }

  try {
    const { error } = await (supabase.from as any)(
      "component_interaction_telemetry"
    ).insert(recordsToFlush);

    if (error) {
      logSupabaseError({
        table: "component_interaction_telemetry",
        operation: "insert",
        error,
        context: "flushTelemetryBuffer",
      });
      // Zero Data Drop fallback
      void queueOfflineSubmission("component_interaction_telemetry", recordsToFlush);
    }
  } catch (err) {
    console.warn("[StashSaarthi:Telemetry] Batch flush caught exception, queueing offline:", err);
    void queueOfflineSubmission("component_interaction_telemetry", recordsToFlush);
  }
}

/**
 * Helper to start a timer for custom duration tracking
 */
export function startComponentTimer(
  componentId: string,
  category: string,
  metadata?: Record<string, unknown>
) {
  const startTime = performance.now();
  return (interactionType: "hover" | "dwell" | "view" = "hover") => {
    const endTime = performance.now();
    const dwellTimeMs = Math.round(endTime - startTime);
    recordInteraction({
      component_id: componentId,
      component_category: category,
      interaction_type: interactionType,
      dwell_time_ms: dwellTimeMs,
      ...(metadata ? { metadata } : {}),
    });
  };
}

/**
 * React Hook for binding hover/dwell tracking to individual UI components
 */
export function useComponentTelemetry(
  componentId: string,
  category: string,
  metadata?: Record<string, unknown>
) {
  const hoverStartRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    hoverStartRef.current = performance.now();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverStartRef.current !== null) {
      const dwellTimeMs = Math.round(performance.now() - hoverStartRef.current);
      hoverStartRef.current = null;

      recordInteraction({
        component_id: componentId,
        component_category: category,
        interaction_type: "hover",
        dwell_time_ms: dwellTimeMs,
        ...(metadata ? { metadata } : {}),
      });
    }
  }, [componentId, category, metadata]);

  const handleTouchStart = useCallback(() => {
    hoverStartRef.current = performance.now();
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (hoverStartRef.current !== null) {
      const dwellTimeMs = Math.round(performance.now() - hoverStartRef.current);
      hoverStartRef.current = null;

      recordInteraction({
        component_id: componentId,
        component_category: category,
        interaction_type: "dwell",
        dwell_time_ms: dwellTimeMs,
        ...(metadata ? { metadata } : {}),
      });
    }
  }, [componentId, category, metadata]);

  const trackClick = useCallback(
    (extraMetadata?: Record<string, unknown>) => {
      recordInteraction({
        component_id: componentId,
        component_category: category,
        interaction_type: "click",
        dwell_time_ms: 0,
        metadata: { ...metadata, ...extraMetadata },
      });
    },
    [componentId, category, metadata]
  );

  return {
    telemetryProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
    trackClick,
  };
}

// Auto flush on window unload or visibility change
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    void flushTelemetryBuffer();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      void flushTelemetryBuffer();
    }
  });
}
