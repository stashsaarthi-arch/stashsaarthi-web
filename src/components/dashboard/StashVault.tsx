import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

interface ActiveStash {
  id: string;
  items: number;
  status: string;
  created_at: string;
}

// Cinematic Reveal Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s delay between each card cascading
      delayChildren: 0.15,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

export function StashVault() {
  const { user } = useAuthStore();
  const [stashes, setStashes] = useState<ActiveStash[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStashes = async () => {
      // Return early if no user is authenticated
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // RLS Consideration: The policy should only allow users to select rows where auth.uid() = user_id
        const { data, error } = await supabase
          .from('stash_leads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Map data to Vault UI structure
        const activeStashes = (data || []).map((lead: any) => ({
          id: lead.id,
          items: lead.items,
          status: "Secured at Host Facility",
          created_at: lead.created_at,
        }));
        
        setStashes(activeStashes);
      } catch (err) {
        console.error("Vault Synchronization Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStashes();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] bg-transparent flex flex-col items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0.6 }}
              transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse", ease: "easeInOut" }}
              className="h-[250px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  const totalItems = stashes.reduce((sum, stash) => sum + stash.items, 0);
  const latestStatus = stashes.length > 0 && stashes[0] ? stashes[0].status : "No Active Stashes";

  return (
    <div className="w-full min-h-[60vh] bg-transparent flex flex-col items-center justify-center relative z-10 p-6">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'GTA6-Heading' }}>The Stash Vault</h1>
          <p className="text-white/60">Command center for your verified inventory.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Bento Grid Card 1: Active Stashes */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between transform-gpu transition-all duration-300 md:hover:border-student-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(0,245,160,0.2)]"
          >
            <div>
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Active Capacity</p>
              <p className="text-6xl font-bold text-white tracking-tighter">{totalItems}</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-student-primary text-sm font-semibold bg-student-primary/10 w-fit px-3 py-1.5 rounded-full border border-student-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-student-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-student-primary"></span>
              </span>
              Live Synced
            </div>
          </motion.div>

          {/* Bento Grid Card 2: Current Status */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between transform-gpu transition-all duration-300 md:hover:border-white/30 md:hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
          >
            <div>
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Security Protocol</p>
              <p className="text-2xl font-bold text-white leading-tight mt-2">{latestStatus}</p>
            </div>
            <div className="mt-8 w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Bento Grid Card 3: Quick Action */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center transform-gpu transition-all duration-300 group hover:bg-white/10"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-student-primary/50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-8 h-8 text-white group-hover:text-student-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-6 bg-white text-black font-bold rounded-xl transition-colors hover:bg-student-primary hover:shadow-[0_0_20px_rgba(0,245,160,0.4)]"
            >
              Request Retrieval
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
