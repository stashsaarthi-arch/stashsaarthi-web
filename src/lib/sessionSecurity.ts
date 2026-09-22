import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError } from "./supabaseLogger";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export interface JwtClaims {
  sub?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  role?: string;
  email?: string;
  iss?: string;
  aud?: string | string[];
  [key: string]: unknown;
}

export interface SessionSecurityAudit {
  isValid: boolean;
  isExpiringSoon: boolean;
  expiresInSeconds: number;
  userId: string | null;
  role: string | null;
  email: string | null;
  issuedAt: Date | null;
  expiresAt: Date | null;
  hasRefreshToken: boolean;
  issues: string[];
}

/**
 * Safely decodes a JWT payload without external dependencies.
 */
export function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    if (!base64Url) return null;

    // Convert base64url to standard base64
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    // Decode base64 to UTF-8 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtClaims;
  } catch (error) {
    console.warn("[SessionSecurity] Failed to parse JWT token payload:", error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired or expiring within bufferSeconds (default 60s).
 */
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const claims = decodeJwtPayload(token);
  if (!claims || !claims.exp) return true;

  const currentUnix = Math.floor(Date.now() / 1000);
  return claims.exp - bufferSeconds <= currentUnix;
}

/**
 * Calculates remaining token validity in seconds.
 */
export function getTokenRemainingSeconds(token: string): number {
  const claims = decodeJwtPayload(token);
  if (!claims || !claims.exp) return 0;

  const currentUnix = Math.floor(Date.now() / 1000);
  return Math.max(0, claims.exp - currentUnix);
}

/**
 * Performs a comprehensive security audit of a Supabase session.
 */
export function auditSessionSecurity(session: Session | null): SessionSecurityAudit {
  const issues: string[] = [];

  if (!session) {
    return {
      isValid: false,
      isExpiringSoon: false,
      expiresInSeconds: 0,
      userId: null,
      role: null,
      email: null,
      issuedAt: null,
      expiresAt: null,
      hasRefreshToken: false,
      issues: ["No active session found"],
    };
  }

  const token = session.access_token;
  const claims = decodeJwtPayload(token);

  if (!claims) {
    issues.push("Invalid or unparseable JWT access token structure");
  }

  const currentUnix = Math.floor(Date.now() / 1000);
  const expiresInSeconds = claims?.exp ? Math.max(0, claims.exp - currentUnix) : 0;
  const isExpiringSoon = expiresInSeconds <= 120; // 2 minutes buffer
  const isExpired = claims?.exp ? claims.exp <= currentUnix : true;

  if (isExpired) {
    issues.push("JWT access token has expired");
  }

  if (claims?.nbf && claims.nbf > currentUnix) {
    issues.push("JWT token is not yet valid (nbf claim in future)");
  }

  if (!session.refresh_token) {
    issues.push("Missing refresh token in session");
  }

  if (!session.user?.id) {
    issues.push("Missing user ID in session metadata");
  }

  return {
    isValid: !isExpired && issues.length === 0,
    isExpiringSoon,
    expiresInSeconds,
    userId: session.user?.id || claims?.sub || null,
    role: claims?.role || session.user?.role || "authenticated",
    email: session.user?.email || claims?.email || null,
    issuedAt: claims?.iat ? new Date(claims.iat * 1000) : null,
    expiresAt: claims?.exp ? new Date(claims.exp * 1000) : null,
    hasRefreshToken: Boolean(session.refresh_token),
    issues,
  };
}

/**
 * Proactively verifies and refreshes session if token is expired or expiring soon (<120s).
 */
export async function ensureValidSession(): Promise<Session | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    const audit = auditSessionSecurity(session);

    if (audit.isExpiringSoon || !audit.isValid) {
      console.info(
        "[SessionSecurity] Session token expiring soon or invalid. Requesting proactive token refresh...",
      );
      const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !refreshedData.session) {
        console.warn("[SessionSecurity] Proactive token refresh failed:", refreshError?.message);
        logSupabaseError({
          table: "auth.sessions",
          operation: "select",
          error: refreshError || "Token refresh failed",
          context: "TOKEN_REFRESH_FAILED",
        });
        return null;
      }

      console.info(
        "[SessionSecurity] Session token proactively refreshed for user:",
        refreshedData.session.user.id,
      );
      return refreshedData.session;
    }

    return session;
  } catch (err) {
    console.error("[SessionSecurity] Error ensuring valid session:", err);
    return null;
  }
}

/**
 * Initializes global auth state security listener for token refreshes and clean sign-outs.
 */
export function initSessionSecurityListener(
  onTokenRefreshed?: (session: Session) => void,
  onSignedOut?: () => void,
): { unsubscribe: () => void } {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
    console.info(`[SessionSecurity] Auth state event triggered: ${event}`);

    switch (event) {
      case "TOKEN_REFRESHED":
        console.info("[SessionSecurity] Access token refreshed successfully.");
        if (session) {
          onTokenRefreshed?.(session);
        }
        break;

      case "SIGNED_OUT":
        console.info("[SessionSecurity] User signed out. Purging sensitive session artifacts.");
        if (typeof window !== "undefined") {
          // Clear any cached auth sensitive items if needed
          sessionStorage.removeItem("ss_exit_intent_dismissed");
        }
        onSignedOut?.();
        break;

      case "USER_UPDATED":
        console.info("[SessionSecurity] User metadata updated.");
        break;

      case "INITIAL_SESSION":
        if (session) {
          const audit = auditSessionSecurity(session);
          if (audit.isExpiringSoon) {
            void ensureValidSession();
          }
        }
        break;
    }
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}
