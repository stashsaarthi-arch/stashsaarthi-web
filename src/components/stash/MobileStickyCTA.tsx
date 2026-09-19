import React from "react";
import { Utensils, Package, Home, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const MobileStickyCTA = React.memo(function MobileStickyCTA() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 w-full z-50 bg-[#0A0D0F]/95 backdrop-blur-xl border-t border-white/[0.12] pb-[env(safe-area-inset-bottom)] sm:hidden shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between items-center px-6 py-3">
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
