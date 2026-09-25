import { createFileRoute, redirect } from '@tanstack/react-router';
import { StashVault } from '@/components/dashboard/StashVault';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // THE IRONCLAD FIREWALL: Direct Supabase session check to prevent Zustand hydration race conditions
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Access Denied: Boot the unauthenticated user back to login
      throw redirect({
        to: '/login',
        search: {
          redirect: '/dashboard',
          error: 'access_denied',
        },
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="w-full min-h-screen bg-transparent pt-24 pb-12 relative z-10">
      <StashVault />
    </div>
  );
}
