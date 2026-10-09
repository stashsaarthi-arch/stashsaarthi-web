import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  initialize: () => () => void;
  loginModalOpen: boolean;
  loginModalMessage: string | undefined;
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  loginModalOpen: false,
  loginModalMessage: undefined,
  openLoginModal: (message) => set({ loginModalOpen: true, loginModalMessage: message }),
  closeLoginModal: () => set({ loginModalOpen: false, loginModalMessage: undefined }),
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),
  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  },
}));
