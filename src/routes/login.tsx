import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { StudentLogin } from "@/components/auth/StudentLogin";
import { HostLogin } from "@/components/auth/HostLogin";
import { ModeToggle } from "@/components/home/ModeToggle";
import { motion, AnimatePresence } from "framer-motion";

interface LoginSearch {
  redirect?: string | undefined;
  error?: string | undefined;
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search['redirect'] as string | undefined,
      error: search['error'] as string | undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: search.redirect || '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<"student" | "host">("student");
  const { error } = Route.useSearch();

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col items-center justify-center relative z-10 pt-20 px-4">
      {/* Premium Unauthorized Bouncer Toast */}
      <AnimatePresence>
        {error === 'access_denied' && (
          <motion.div
            key="access_denied_toast"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-24 max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] flex items-center gap-4 z-50"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/40">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-bold" style={{ fontFamily: 'GTA6-Heading' }}>Access Denied</p>
              <p className="text-red-300/80 text-sm">Please authenticate to enter the Stash Vault.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <ModeToggle mode={role} setMode={setRole} />
      </div>

      <AnimatePresence mode="wait">
        {role === "student" ? (
          <motion.div
            key="student"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full w-full max-w-md"
          >
            <StudentLogin />
          </motion.div>
        ) : (
          <motion.div
            key="host"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full w-full max-w-md"
          >
            <HostLogin />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
