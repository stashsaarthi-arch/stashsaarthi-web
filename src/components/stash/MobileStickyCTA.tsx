import React from "react";
import { Utensils, Package, Home, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const MobileStickyCTA = React.memo(function MobileStickyCTA() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 w-full z-50 bg-black/30 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] sm:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] -z-10 pointer-events-none" />
      <div className="flex justify-between items-center px-6 py-3 relative z-10">
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-emerald-400 transition-colors">
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Kitchen</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-emerald-400 transition-colors">
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Stash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-emerald-400 transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Spaces</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-emerald-400 transition-colors">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Connect</span>
        </button>
      </div>
    </div>
  );
});
