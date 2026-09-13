import { memo } from "react";
import { motion } from "motion/react";
import { Package, ShieldCheck, QrCode, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

export interface LuggageItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  sealId: string;
  iconType: "suitcase" | "box" | "vault";
  positionClass: string;
  animationDelay: number;
}

const LUGGAGE_MOCKUPS: LuggageItem[] = [
  {
    id: "stash-042",
    title: "Winter Suitcase #042",
    subtitle: "Jackets, Boots & Dorm Gear",
    price: "₹300/mo",
    tag: "IITK Campus Vault",
    sealId: "QR-SEAL-8839",
    iconType: "suitcase",
    positionClass: "hidden xl:flex absolute -left-12 top-8 w-64 z-20 pointer-events-auto",
    animationDelay: 0,
  },
  {
    id: "stash-108",
    title: "Study Carton #108",
    subtitle: "Books, Lab Notes & Monitor",
    price: "₹300/mo",
    tag: "Kakadeo Basement",
    sealId: "QR-SEAL-4412",
    iconType: "box",
    positionClass: "hidden xl:flex absolute -right-12 top-16 w-64 z-20 pointer-events-auto",
    animationDelay: 1.2,
  },
  {
    id: "stash-019",
    title: "Cooler Vault #019",
    subtitle: "Hostel Cooler & Mattress",
    price: "₹300/mo",
    tag: "HBTI Hub Verified",
    sealId: "QR-SEAL-9011",
    iconType: "vault",
    positionClass: "hidden lg:flex xl:hidden absolute -right-4 top-24 w-56 z-20 pointer-events-auto",
    animationDelay: 0.6,
  },
];

export const Floating3DLuggage = memo(function Floating3DLuggage() {
  return (
    <>
      {/* Desktop Floating 3D Cards */}
      {LUGGAGE_MOCKUPS.map((item) => (
        <motion.div
          key={item.id}
          className={item.positionClass}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
            scale: 1,
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.animationDelay,
            },
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
          }}
        >
          <Card3D maxTilt={10} className="w-full">
            <div className="glass-card relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-black/60 p-3.5 backdrop-blur-xl shadow-glow hover:border-emerald-400/60 transition-colors group">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/15 blur-xl group-hover:bg-emerald-400/25 transition-all" />
              
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {item.iconType === "suitcase" ? (
                      <Package className="h-4 w-4" />
                    ) : item.iconType === "box" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                      {item.tag}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300 border border-emerald-400/40 shadow-sm">
                  {item.price}
                </span>
              </div>

              {/* Card Description */}
              <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2 font-sans">
                {item.subtitle}
              </p>

              {/* Card Footer Seal Indicator */}
              <div className="flex items-center justify-between text-[10px] text-emerald-400/90 font-mono bg-emerald-950/40 rounded-lg px-2 py-1 border border-emerald-500/20">
                <span className="flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-emerald-400" />
                  <span>{item.sealId}</span>
                </span>
                <span className="flex items-center gap-0.5 text-emerald-300 font-semibold">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Sealed
                </span>
              </div>
            </div>
          </Card3D>
        </motion.div>
      ))}

      {/* Mobile / Tablet Compact Showcase Strip */}
      <div className="xl:hidden mt-4 w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-center gap-2 min-w-max px-2">
          {LUGGAGE_MOCKUPS.slice(0, 2).map((item) => (
            <div
              key={`mob-${item.id}`}
              className="glass inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-black/40 px-3 py-1.5 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-white leading-tight">
                  {item.title}
                </div>
                <div className="text-[9.5px] text-emerald-400 font-mono">
                  {item.price} • {item.sealId}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
