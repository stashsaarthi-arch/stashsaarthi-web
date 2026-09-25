import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import { upsertGoogleUser } from "@/lib/waitlistService";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "host";
  verified: boolean;
  provider?: "google" | "local";
  phone_number?: string;
  college_or_locality?: string;
  bio?: string;
  address?: string;
  emergency_contact?: string;
};

type AuthValue = {
  user: AuthUser | null;
  loading: boolean;
  authenticating: boolean;
  loginWithGoogle: (response: CredentialResponse, defaultRole?: "student" | "host") => Promise<void>;
  loginWithProfile: (profile: AuthUser) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  setAuthenticating: (val: boolean) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userLocal, setUserLocal] = useState<AuthUser | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  
  // Single source of truth from Supabase
  const supabaseUser = useAuthStore(state => state.user);
  const isLoadingSupabase = useAuthStore(state => state.isLoading);

  useEffect(() => {
    // Load local override for mock users from localStorage
    const storedUser = localStorage.getItem("stash_user_session");
    if (storedUser) {
      try {
        setUserLocal(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("stash_user_session");
      }
    }
    setLoadingLocal(false);
  }, []);

  // Compute derived user state: Supabase takes precedence over local mock
  const user = useMemo<AuthUser | null>(() => {
    if (supabaseUser) {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.['full_name'] || supabaseUser.email?.split("@")[0] || "User",
        avatar: supabaseUser.user_metadata?.['avatar_url'] || "",
        role: supabaseUser.user_metadata?.['role'] || "student",
        verified: !!supabaseUser.email_confirmed_at,
        provider: supabaseUser.app_metadata?.provider === 'google' ? 'google' : 'local'
      };
    }
    return userLocal;
  }, [supabaseUser, userLocal]);

  const loading = loadingLocal || isLoadingSupabase;

  const loginWithGoogle = useCallback(
    async (response: CredentialResponse, defaultRole: "student" | "host" = "student") => {
      setAuthenticating(true);
      try {
        if (!response.credential) {
          throw new Error("No credential received from Google");
        }

        // Establish real Supabase session using the Google ID Token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (error) throw error;

        // Optionally update metadata if newly created
        await supabase.auth.updateUser({ data: { role: defaultRole } });

        const decoded = jwtDecode<{
          sub?: string;
          name?: string;
          email?: string;
          picture?: string;
          email_verified?: boolean;
        }>(response.credential);

        const userEmail = decoded.email;
        if (!userEmail) {
          throw new Error("Email not found in Google credential");
        }

        // Persist to Supabase users_waitlist (fire-and-forget)
        upsertGoogleUser({
          email: userEmail,
          name: decoded.name || userEmail.split("@")[0] || "User",
          picture: decoded.picture || "",
        });

        const firstName = (decoded.name || userEmail.split("@")[0] || "User").split(" ")[0] || "User";
        toast.success(`Welcome back, ${firstName}!`, {
          description: `Logged in as ${defaultRole === "student" ? "Student" : "High-Margin ROI Host"}`,
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
    // Local mock fallback for profile login
    setUserLocal(newUser);
    localStorage.setItem("stash_user_session", JSON.stringify(newUser));

    upsertGoogleUser({
      email: newUser.email,
      name: newUser.name,
      picture: newUser.avatar,
    });

    const firstName = newUser.name.split(" ")[0];
    toast.success(`Welcome back, ${firstName}!`, {
      description: `Logged in as ${newUser.role === "student" ? "Student" : "High-Margin ROI Host"}`,
    });
  }, []);

  const logout = useCallback(async () => {
    setUserLocal(null);
    localStorage.removeItem("stash_user_session");
    await supabase.auth.signOut();
    toast.success("Signed out. See you soon!");
  }, []);

  const updateUser = useCallback(async (updates: Partial<AuthUser>) => {
    setUserLocal((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem("stash_user_session", JSON.stringify(updatedUser));
      window.dispatchEvent(
        new CustomEvent("stashsaarthi:profile-updated", { detail: updatedUser }),
      );
      return updatedUser;
    });
    
    // Also update Supabase metadata if logged in via Supabase
    if (supabaseUser) {
       await supabase.auth.updateUser({ data: updates });
    }
  }, [supabaseUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticating,
      loginWithGoogle,
      loginWithProfile,
      updateUser,
      logout,
      setAuthenticating,
    }),
    [user, loading, authenticating, loginWithGoogle, loginWithProfile, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
