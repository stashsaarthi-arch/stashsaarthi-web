import { motion } from "framer-motion";

export function EsummitPremiumCard() {
  return (
    <section className="relative w-full max-w-5xl mx-auto py-16 px-6 bg-transparent">
      {/* 
        CRITICAL ARCHITECTURE RULE: 
        Outer wrapper is bg-transparent so the animated spatial background shines through.
        We use the new SkillUI translucent surface token with glassmorphism for the actual card.
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-surface backdrop-blur-xl border border-border p-8 md:p-12 shadow-2xl"
      >
        {/* Decorative E-Summit Accents */}
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <div className="w-64 h-64 bg-cyan rounded-full mix-blend-screen filter blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-20 pointer-events-none">
          <div className="w-64 h-64 bg-emerald rounded-full mix-blend-screen filter blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          
          {/* Content Left */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              E-Summit Premium Feature
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Unlock the True Potential of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-emerald">Micro-Storage</span>
            </h2>
            
            <p className="font-body text-lg text-foreground/80 leading-relaxed">
              Experience the pinnacle of intergenerational living and seamless luggage management. Engineered with radical transparency, real-time custody tracking, and a zero-brokerage philosophy.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="rounded-md bg-primary px-6 py-3 font-body font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all active:scale-95">
                Explore Premium
              </button>
              <button className="rounded-md bg-transparent border border-border px-6 py-3 font-body font-semibold text-foreground hover:bg-white/5 transition-all active:scale-95">
                View Documentation
              </button>
            </div>
          </div>

          {/* Visual Right (Mockup/Stats) */}
          <div className="flex-1 w-full relative">
            <div className="aspect-square md:aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center p-6 shadow-inner overflow-hidden relative">
              {/* Grid Background inside the card */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              
              <div className="relative z-10 text-center space-y-4">
                <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan to-amber">
                  ₹0
                </div>
                <div className="font-body text-sm font-medium text-foreground/70 uppercase tracking-widest">
                  Hidden Fees
                </div>
                <div className="h-px w-12 bg-border mx-auto my-4" />
                <div className="text-3xl font-display font-bold text-foreground">
                  100%
                </div>
                <div className="font-body text-sm font-medium text-foreground/70 uppercase tracking-widest">
                  Transparency
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
