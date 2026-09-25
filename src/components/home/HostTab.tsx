import { memo } from "react";
import { motion } from "framer-motion";

export const HostTab = memo(function HostTab() {
  return (
    <div className="bg-transparent w-full">
      <div 
        className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"
        style={{ fontFamily: 'GTA6-Heading' }}
      >
        <div className="flex flex-col items-center justify-center space-y-6 lg:space-y-8">
          <h2 
            className="text-host-primary font-bold text-center tracking-tight" 
            style={{ fontSize: '5rem', lineHeight: '1.2', fontFamily: 'bootstrap-icons' }}
          >
            Premium Host Matrix
          </h2>
          <p className="text-white text-center max-w-2xl text-[16px] leading-[1.5]">
            Maximize your passive income. Zero capital expenditure, complete spatial control, and 100% verified tenants.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-host-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-host-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(255,215,64,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-host-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>High Yield</span>
                <span className="text-host-secondary text-xs uppercase tracking-widest font-bold">ROI</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                Earn ₹3,000–₹12,000 monthly passive income by monetizing your dead space.
              </p>
              <button className="mt-6 w-full bg-host-primary text-black font-bold py-2 px-4 rounded-[8px] transition-all hover:bg-host-secondary focus:outline-none focus:ring-2 focus:ring-host-primary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                Calculate Earnings
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-host-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-host-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(255,215,64,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-host-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>Zero Intrusion</span>
                <span className="text-host-secondary text-xs uppercase tracking-widest font-bold">Safety</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                100% control over house norms with guaranteed 24-hour SLA relocation if violated.
              </p>
              <button className="mt-6 w-full bg-transparent border border-host-primary text-host-primary font-bold py-2 px-4 rounded-[8px] transition-all hover:bg-host-primary/20 focus:outline-none focus:ring-2 focus:ring-host-primary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                View Charter
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-host-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-host-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(255,215,64,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-host-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>Verified Tenants</span>
                <span className="text-host-secondary text-xs uppercase tracking-widest font-bold">Trust</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                3-tier background verification. We only place respectful, disciplined students.
              </p>
              <button className="mt-6 w-full bg-host-secondary text-white font-bold py-2 px-4 rounded-[8px] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-host-secondary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                Host Network
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});
