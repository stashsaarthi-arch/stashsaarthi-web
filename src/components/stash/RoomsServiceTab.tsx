import { useState, Suspense, lazy } from "react";
import { MapPin, MessageCircle } from "lucide-react";

const StashVault = lazy(() =>
  import("../dashboard/StashVault").then((m) => ({ default: m.StashVault }))
);

const ROOMS = [
  { id: 1, title: "Premium Single Room", price: 5800, dist: "500m from IITK", zone: "Kalyanpur / IITK Zone", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "Shared Double (AC)", price: 4200, dist: "1km from HBTI", zone: "Rawatpur / HBTI", img: "https://images.unsplash.com/photo-1502672260266-1c1e52528373?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "Cozy Study Room", price: 6500, dist: "200m from Coaching", zone: "Kakadeo Coaching Belt", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400" },
];

export function RoomsServiceTab({ onBook }: { onBook: () => void }) {
  const [filter, setFilter] = useState("All Kanpur");
  const FILTERS = ["All Kanpur", "Kakadeo Coaching Belt", "Kalyanpur / IITK Zone", "Rawatpur / HBTI"];

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Top Shelf: Liquidation Carousel & Vault (Restored Logic) */}
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-white/50">Loading Deals...</div>}>
        <StashVault />
      </Suspense>

      {/* Locality Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
              ${filter === f ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROOMS.filter(r => filter === "All Kanpur" || r.zone === filter).map(r => (
          <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="h-48 w-full relative overflow-hidden">
              <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                ZERO BROKERAGE
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{r.title}</h3>
                <div className="text-lg font-black text-emerald-400">₹{r.price}<span className="text-xs text-white/50 font-normal">/mo</span></div>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/60 mb-6">
                <MapPin className="w-3 h-3" /> {r.dist}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={onBook} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-colors text-sm">
                  Book Free Visit
                </button>
                <button onClick={onBook} className="flex-none bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] p-2 rounded-xl transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
