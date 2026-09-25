import { memo } from "react";
import { motion } from "framer-motion";

export const StudentTab = memo(function StudentTab() {
  return (
    <div className="bg-transparent w-full">
      <div 
        className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"
        style={{ fontFamily: 'GTA6-Heading' }}
      >
        <div className="flex flex-col items-center justify-center space-y-6 lg:space-y-8">
          <h2 
            className="text-student-primary font-bold text-center tracking-tight" 
            style={{ fontSize: '5rem', lineHeight: '1.2', fontFamily: 'bootstrap-icons' }}
          >
            Student Core
          </h2>
          <p className="text-white text-center max-w-2xl text-[16px] leading-[1.5]">
            Access military-grade inventory management, zero brokerage spaces, and verified living networks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-student-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-student-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(0,104,255,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-student-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>Zero Friction</span>
                <span className="text-student-secondary text-xs uppercase tracking-widest font-bold">Stash</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                Military-grade inventory management with absolute zero brokerage fees. 
              </p>
              <button className="mt-6 w-full bg-student-primary text-white font-bold py-2 px-4 rounded-[8px] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-student-primary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                Book Vault
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-student-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-student-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(0,104,255,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-student-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>Spatial Control</span>
                <span className="text-student-secondary text-xs uppercase tracking-widest font-bold">Rooms</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                Find the perfect dead-rent space with pure geometric precision and no hidden charges.
              </p>
              <button className="mt-6 w-full bg-transparent border border-student-primary text-student-primary font-bold py-2 px-4 rounded-[8px] transition-all hover:bg-student-primary/20 focus:outline-none focus:ring-2 focus:ring-student-primary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                Explore Spaces
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } }}
              className="bg-white/5 backdrop-blur-md border border-student-primary/20 rounded-lg p-6 transition-all duration-300 transform-gpu md:hover:border-student-primary/50 md:hover:shadow-[0_0_30px_-5px_rgba(0,104,255,0.3)]"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-student-primary text-[24px]" style={{ fontFamily: 'bootstrap-icons' }}>Premium Matrix</span>
                <span className="text-student-secondary text-xs uppercase tracking-widest font-bold">Network</span>
              </div>
              <p className="text-[#d1d5db] text-[16px] leading-[1.5]">
                Enter the exclusive student network. High yield savings, zero operational drag.
              </p>
              <button className="mt-6 w-full bg-student-secondary text-white font-bold py-2 px-4 rounded-[8px] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-student-secondary focus:ring-offset-2 focus:ring-offset-[#1f1f1f]">
                Join Council
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});
