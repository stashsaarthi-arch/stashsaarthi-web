import { useState, Suspense, lazy } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const StashVault = lazy(() =>
  import("../dashboard/StashVault").then((m) => ({ default: m.StashVault }))
);

const ROOMS = [
  { id: 1, title: "Premium Single Room", price: 5800, dist: "500m from IITK", zone: "Kalyanpur / IITK Zone", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "Shared Double (AC)", price: 4200, dist: "1km from HBTI", zone: "Rawatpur / HBTI", img: "https://images.unsplash.com/photo-1502672260266-1c1e52528373?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "Cozy Study Room", price: 6500, dist: "200m from Coaching", zone: "Kakadeo Coaching Belt", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400" },
];

const DEALS = [
  { id: 1, item: "Symphony Cooler (40L)", price: "₹2,500", oldPrice: "₹5,000", tag: "Moving out in 2 days" },
  { id: 2, item: "Study Table + Chair", price: "₹1,200", oldPrice: "₹3,000", tag: "Used 1 semester" },
  { id: 3, item: "Wakefit Mattress (Single)", price: "₹1,500", oldPrice: "₹4,000", tag: "Like new" },
  { id: 4, item: "Bajaj Induction Cooktop", price: "₹900", oldPrice: "₹2,200", tag: "Works perfectly" },
];

export function RoomsServiceTab({ onBook }: { onBook: () => void }) {
  const [filter, setFilter] = useState("All Kanpur");
  const FILTERS = ["All Kanpur", "Kakadeo Coaching Belt", "Kalyanpur / IITK Zone", "Rawatpur / HBTI"];

  const { user } = useAuth();
  const { requireAuth, useActionReplay } = useRequireAuthAction();

  const handleClaimDeal = async (dealId: number, itemName: string) => {
    if (!user) return;
    try {
      await supabase.from("liquidation_claims" as any).insert({
        user_id: user.id,
        item_id: dealId,
        item_name: itemName,
      });
      await supabase.from("user_activity_logs" as any).insert({
        user_id: user.id,
        activity_type: "CLAIMED_DEAL",
        description: `Claimed liquidation deal: ${itemName}`,
      });
      toast.success("Deal Claimed! Pick up instructions sent.");
    } catch (e) {
      toast.error("Failed to claim deal");
    }
  };

  const handleBookVisit = async (roomId: number, roomName: string, actionType: string) => {
    if (!user) return;
    try {
      await supabase.from("room_inquiries" as any).insert({
        user_id: user.id,
        room_id: roomId,
        room_name: roomName,
        action: actionType,
      });
      await supabase.from("user_activity_logs" as any).insert({
        user_id: user.id,
        activity_type: "ROOM_INQUIRY",
        description: `Scheduled a visit for: ${roomName}`,
      });
      toast.success("Visit Scheduled! The owner will contact you shortly.");
      onBook();
    } catch (e) {
      toast.error("Failed to schedule visit");
    }
  };

  DEALS.forEach((deal) => {
    useActionReplay(`claim_deal_${deal.id}`, () => handleClaimDeal(deal.id, deal.item));
  });

  ROOMS.forEach((r) => {
    useActionReplay(`book_visit_${r.id}`, () => handleBookVisit(r.id, r.title, "Visit"));
    useActionReplay(`contact_owner_${r.id}`, () => handleBookVisit(r.id, r.title, "Contact"));
  });

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Top Shelf: Liquidation Carousel */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
          <span>🏷️</span> Campus Liquidation Deals (50% Off)
        </h3>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
          {DEALS.map(deal => (
            <div 
              key={deal.id} 
              onClick={() => requireAuth(`claim_deal_${deal.id}`, "Login in 5 seconds to lock this deal to your account across all your devices.", () => handleClaimDeal(deal.id, deal.item))}
              className="min-w-[240px] bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 snap-center flex-shrink-0 cursor-pointer hover:bg-emerald-500/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-white font-bold text-sm truncate pr-2">{deal.item}</h4>
                <div className="text-emerald-400 font-bold">{deal.price}</div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50">{deal.tag}</span>
                <span className="text-white/40 line-through">{deal.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                <button 
                  onClick={() => requireAuth(`book_visit_${r.id}`, "Login in 5 seconds to schedule your room visit securely.", () => handleBookVisit(r.id, r.title, "Visit"))}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-colors text-sm"
                >
                  Book Free Visit
                </button>
                <button 
                  onClick={() => requireAuth(`contact_owner_${r.id}`, "Login in 5 seconds to connect directly with the owner.", () => handleBookVisit(r.id, r.title, "Contact"))}
                  className="flex-none bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] p-2 rounded-xl transition-colors"
                >
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
