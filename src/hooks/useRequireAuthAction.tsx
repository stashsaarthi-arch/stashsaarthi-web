import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

export function useRequireAuthAction() {
  const { user } = useAuth();
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  // If there's an action stored, execute it once logged in
  useEffect(() => {
    if (user) {
      const storedActionKey = sessionStorage.getItem("pending_auth_action");
      if (storedActionKey) {
        // We just dispatch a custom event to notify listeners
        window.dispatchEvent(new CustomEvent("execute_pending_action", { detail: storedActionKey }));
        sessionStorage.removeItem("pending_auth_action");
      }
    }
  }, [user]);

  const requireAuth = (
    actionKey: string,
    message: string,
    immediateAction: () => void
  ) => {
    if (user) {
      immediateAction();
    } else {
      sessionStorage.setItem("pending_auth_action", actionKey);
      openLoginModal(message);
    }
  };

  // Helper hook to register listeners in components
  const useActionReplay = (actionKey: string, action: () => void) => {
    useEffect(() => {
      const handler = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail === actionKey) {
          action();
        }
      };
      window.addEventListener("execute_pending_action", handler);
      return () => window.removeEventListener("execute_pending_action", handler);
    }, [actionKey, action]);
  };

  return { requireAuth, useActionReplay };
}
