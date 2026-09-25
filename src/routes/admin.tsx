import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, Variants } from "framer-motion";

const FOUNDER_EMAILS = ['advik@stashsaarthi.com'];

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({ to: '/login', search: { error: 'access_denied' } });
    }

    if (!session.user.email || !FOUNDER_EMAILS.includes(session.user.email)) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminDashboard,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface MetricState {
  demandBoxes: number;
  supplyCapacity: number;
  recentLeads: any[];
  recentHosts: any[];
  loading: boolean;
}

function AdminDashboard() {
  const [metrics, setMetrics] = useState<MetricState>({
    demandBoxes: 0,
    supplyCapacity: 0,
    recentLeads: [],
    recentHosts: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchGodEyeData() {
      try {
        // Run concurrent fetches for God-Eye metrics
        const [leadsRes, hostsRes] = await Promise.all([
          supabase.from('stash_leads').select('*').order('created_at', { ascending: false }).limit(50),
          supabase.from('host_listings').select('*').order('created_at', { ascending: false }).limit(50)
        ]);

        const leads = leadsRes.data || [];
        const hosts = hostsRes.data || [];

        // Aggregate Supply and Demand
        const totalDemand = leads.reduce((acc, lead) => acc + (lead.items || 1), 0);
        const totalSupply = hosts.reduce((acc, host) => acc + (host.capacity || 0), 0);

        setMetrics({
          demandBoxes: totalDemand,
          supplyCapacity: totalSupply,
          recentLeads: leads.slice(0, 5),
          recentHosts: hosts.slice(0, 5),
          loading: false
        });
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    }

    fetchGodEyeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent pt-24 pb-12 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'GTA6-Heading' }}>God-Eye Command</h1>
          </div>
          <p className="text-red-200/60 font-mono text-sm uppercase tracking-widest">Level 10 Clearance Authorized</p>
        </motion.div>

        {metrics.loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Live Demand Card */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.1)]">
              <h3 className="text-red-400 font-medium mb-1 uppercase tracking-wider text-sm">Live Demand</h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold text-white tracking-tighter">{metrics.demandBoxes}</span>
                <span className="text-white/40 mb-1">Bags requested</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[75%]" />
              </div>
            </motion.div>

            {/* Live Supply Card */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.1)]">
              <h3 className="text-red-400 font-medium mb-1 uppercase tracking-wider text-sm">Live Supply</h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold text-white tracking-tighter">{metrics.supplyCapacity}</span>
                <span className="text-white/40 mb-1">Spaces available</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-host-primary w-[45%]" />
              </div>
            </motion.div>

            {/* Matchmaker Delta Card */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.1)]">
              <h3 className="text-red-400 font-medium mb-1 uppercase tracking-wider text-sm">Marketplace Delta</h3>
              <div className="flex items-end gap-3 mb-4">
                <span className={`text-5xl font-bold tracking-tighter ${metrics.supplyCapacity - metrics.demandBoxes >= 0 ? 'text-host-primary' : 'text-red-500'}`}>
                  {metrics.supplyCapacity - metrics.demandBoxes > 0 ? '+' : ''}{metrics.supplyCapacity - metrics.demandBoxes}
                </span>
                <span className="text-white/40 mb-1">Net capacity</span>
              </div>
              <p className="text-white/50 text-sm">Current gap between host availability and student demand.</p>
            </motion.div>

            {/* Recent Matchmaker Tables */}
            <motion.div variants={itemVariants} className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              
              {/* Student Leads */}
              <div className="bg-white/5 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-6 overflow-hidden flex flex-col h-full">
                <h3 className="text-red-400 font-medium mb-4 uppercase tracking-wider text-sm flex items-center justify-between">
                  <span>Recent Student Leads</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">Top 5</span>
                </h3>
                <div className="space-y-3 flex-grow">
                  {metrics.recentLeads.length > 0 ? metrics.recentLeads.map((lead, i) => (
                    <div key={lead.id || i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5 hover:border-red-500/30 transition-colors">
                      <div>
                        <p className="text-white font-medium text-sm">{lead.user_id ? lead.user_id.slice(0,8) + '...' : 'Anonymous Lead'}</p>
                        <p className="text-white/40 text-xs">{new Date(lead.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold">{lead.items} Bags</span>
                        <p className="text-red-400 text-xs capitalize">{lead.status || 'Pending'}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-white/30 text-sm text-center py-4">No recent leads found.</p>
                  )}
                </div>
              </div>

              {/* Host Spaces */}
              <div className="bg-white/5 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-6 overflow-hidden flex flex-col h-full">
                <h3 className="text-red-400 font-medium mb-4 uppercase tracking-wider text-sm flex items-center justify-between">
                  <span>Recent Host Listings</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">Top 5</span>
                </h3>
                <div className="space-y-3 flex-grow">
                  {metrics.recentHosts.length > 0 ? metrics.recentHosts.map((host, i) => (
                    <div key={host.id || i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5 hover:border-host-primary/30 transition-colors">
                      <div>
                        <p className="text-white font-medium text-sm">{host.location}</p>
                        <p className="text-white/40 text-xs">{host.space_type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-host-primary font-bold">{host.capacity} Cap</span>
                        <p className="text-host-primary/70 text-xs capitalize">{host.status?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-white/30 text-sm text-center py-4">No recent hosts found.</p>
                  )}
                </div>
              </div>

            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
