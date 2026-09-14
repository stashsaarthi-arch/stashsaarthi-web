import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Role = "student" | "host";

export type PersonaContextType = {
  role: Role;
  setRole: (role: Role) => void;
  isHost: boolean;
  isStudent: boolean;
  isPersonaTransitioning: boolean;
};

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

/**
 * Global Persona Provider — manages the student/host role toggle
 * and syncs it to `document.documentElement.dataset.role` for CSS theming,
 * applies `persona-transitioning` class for 250ms crossfade animation,
 * and syncs to `sessionStorage` for persistence across refreshes.
 */
export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("student");
  const [isPersonaTransitioning, setIsPersonaTransitioning] = useState<boolean>(false);

  // Ensure fresh page loads always start in Student mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.dataset["role"] = "student";
      try {
        const saved = sessionStorage.getItem("ss-role") as Role;
        if (saved === "student" || saved === "host") {
          setRoleState(saved);
          document.documentElement.dataset["role"] = saved;
        } else {
          setRoleState("student");
          document.documentElement.dataset["role"] = "student";
        }
      } catch {
        document.documentElement.dataset["role"] = "student";
      }
    }
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState((prevRole) => {
      if (prevRole === r) return prevRole;
      if (typeof window !== "undefined") {
        document.documentElement.classList.add("persona-transitioning");
        setIsPersonaTransitioning(true);
        try {
          sessionStorage.setItem("ss-role", r);
          document.documentElement.dataset["role"] = r;
        } catch {
          // Ignore storage errors
        }
        setTimeout(() => {
          document.documentElement.classList.remove("persona-transitioning");
          setIsPersonaTransitioning(false);
        }, 250);
      }
      return r;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      role,
      setRole,
      isHost: role === "host",
      isStudent: role === "student",
      isPersonaTransitioning,
    }),
    [role, setRole, isPersonaTransitioning],
  );

  return <PersonaContext.Provider value={contextValue}>{children}</PersonaContext.Provider>;
}

const defaultContextValue: PersonaContextType = {
  role: "student",
  setRole: () => {},
  isHost: false,
  isStudent: true,
  isPersonaTransitioning: false,
};

/**
 * Hook to access the global persona (role) state.
 * Works both inside and outside of PersonaProvider (falls back to student).
 */
export function usePersona() {
  const context = useContext(PersonaContext);
  return context || defaultContextValue;
}

