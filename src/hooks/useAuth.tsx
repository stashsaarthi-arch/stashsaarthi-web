import { createContext, useContext, useMemo } from "react";
import { toast } from "sonner";
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
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseUser = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);

  const user = useMemo<AuthUser | null>(() => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.["full_name"] || supabaseUser.email?.split("@")[0] || "User",
      avatar: supabaseUser.user_metadata?.["avatar_url"] || "",
      role: supabaseUser.user_metadata?.["role"] || "student",
      verified: !!supabaseUser.email_confirmed_at,
    };
  }, [supabaseUser]);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
    } catch (err) {
      toast.error("Google sign-in failed", { description: "Please try again in a moment." });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out. See you soon!");
  };

  const value = useMemo(() => ({ user, loading, loginWithGoogle, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
