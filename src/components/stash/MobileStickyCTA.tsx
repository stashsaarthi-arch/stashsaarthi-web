import React from "react";
import { Utensils, Package, Home, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const MobileStickyCTA = React.memo(function MobileStickyCTA() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 w-full !z-[999] !bg-[#0A0D0F]/40 !backdrop-blur-[24px] !backdrop-saturate-[180%] !border-t !border-white/10 !shadow-2xl pb-[env(safe-area-inset-bottom)] sm:hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/20 blur-[60px] -z-10 rounded-full pointer-events-none"></div>
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
