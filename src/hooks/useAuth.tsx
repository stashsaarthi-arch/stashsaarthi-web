import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import { upsertGoogleUser } from "@/lib/waitlistService";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "host";
  verified: boolean;
  provider?: "google" | "local";
};

type AuthValue = {
  user: AuthUser | null;
  loading: boolean;
  authenticating: boolean;
  loginWithGoogle: (response: CredentialResponse, defaultRole?: "student" | "host") => void;
  loginWithProfile: (profile: AuthUser) => void;
  logout: () => void;
  setAuthenticating: (val: boolean) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    // Load session from localStorage on mount
    const storedUser = localStorage.getItem("stash_user_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("stash_user_session");
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = useCallback(
    (response: CredentialResponse, defaultRole: "student" | "host" = "student") => {
      setAuthenticating(true);
      try {
        if (!response.credential) {
          throw new Error("No credential received from Google");
        }

        const decoded = jwtDecode<{
          sub?: string;
          name?: string;
          email?: string;
          picture?: string;
          email_verified?: boolean;
        }>(response.credential);

        if (!decoded.email) {
          throw new Error("Email not found in Google credential");
        }

        const newUser: AuthUser = {
          id: decoded.sub || decoded.email || "guest",
          name: decoded.name || decoded.email?.split("@")[0] || "Saarthi",
          email: decoded.email,
          avatar: decoded.picture || "",
          role: defaultRole,
          verified: !!decoded.email_verified,
          provider: "google",
        };

        setUser(newUser);
        localStorage.setItem("stash_user_session", JSON.stringify(newUser));

        // Persist to Supabase users_waitlist (fire-and-forget)
        upsertGoogleUser({
          email: newUser.email,
          name: newUser.name,
          picture: newUser.avatar,
        });

        const firstName = newUser.name.split(" ")[0];
        toast.success(`Welcome back, ${firstName}!`, {
          description: `Logged in as ${newUser.role === "student" ? "Student" : "Elderly Host"}`,
        });
      } catch (err) {
        console.error("Google Auth Error:", err);
        toast.error("Google sign-in failed", { description: "Please try again in a moment." });
      } finally {
        setAuthenticating(false);
      }
    },
    [],
  );

  const loginWithProfile = useCallback((newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem("stash_user_session", JSON.stringify(newUser));

    // Persist to Supabase users_waitlist (fire-and-forget)
    upsertGoogleUser({
      email: newUser.email,
      name: newUser.name,
      picture: newUser.avatar,
    });

    const firstName = newUser.name.split(" ")[0];
    toast.success(`Welcome back, ${firstName}!`, {
      description: `Logged in as ${newUser.role === "student" ? "Student" : "Elderly Host"}`,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("stash_user_session");
    toast.success("Signed out. See you soon!");
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticating,
      loginWithGoogle,
      loginWithProfile,
      logout,
      setAuthenticating,
    }),
    [user, loading, authenticating, loginWithGoogle, loginWithProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
