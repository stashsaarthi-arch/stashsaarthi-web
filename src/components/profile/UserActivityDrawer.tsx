import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUserCloud } from "@/context/UserCloudContext";
import { Button } from "@/components/ui/button";
import { LogOut, PackageCheck, Soup, Wallet, QrCode, Home, ShoppingBag, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export function UserActivityDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user, bookings, roomVisits, liquidationDeals, activityLogs, tokenBalance, isLoading } = useUserCloud();
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-[#0A0D0F] border-l border-white/10 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            My Saarthi Pass
          </SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5">
              <Skeleton className="h-6 w-2/3 rounded-md" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            {/* Meal Token Balance */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-xl">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Tokens Live</p>
                  <p className="text-3xl font-black text-white leading-none">{tokenBalance}</p>
                </div>
              </div>
              <Soup className="h-10 w-10 text-emerald-500/20" />
            </div>

            {/* 1. ACTIVE STASH PASSES */}
            <div>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-emerald-400" /> Active Stash Passes
              </h3>
              
              {bookings.length === 0 ? (
                <div className="text-center p-6 border border-white/5 bg-white/5 rounded-2xl text-white/50 text-sm">
                  No active stash bookings.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, idx) => (
                    <div key={idx} className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="inline-block px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-bold mb-2 uppercase border border-amber-500/30">
                            Secured at Host Vault
                          </div>
                          <p className="text-sm font-medium text-white/80">
                            <span className="font-bold text-white">Bags:</span> {booking.bag_count}
                          </p>
                          <p className="text-sm font-medium text-white/80">
                            <span className="font-bold text-white">Location:</span> Kakadeo/Kalyanpur
                          </p>
                        </div>
                        
                        {/* QR Code */}
                        {booking.qr_code && booking.qr_code.startsWith("http") ? (
                          <div className="bg-white p-1 rounded-lg">
                            <img src={booking.qr_code} alt="QR Code" className="w-16 h-16" loading="lazy" decoding="async" />
                          </div>
                        ) : (
                          <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                            <QrCode className="w-10 h-10 text-black" />
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                         <span className="text-[10px] font-mono text-white/40">ID: {booking.booking_id}</span>
                         <span className="text-[10px] font-mono text-white/40">₹{booking.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. MY ROOM VISITS */}
            <div>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Home className="h-4 w-4 text-emerald-400" /> My Room Visits
              </h3>
              
              {roomVisits.length === 0 ? (
                <div className="text-center p-6 border border-white/5 bg-white/5 rounded-2xl text-white/50 text-sm">
                  No scheduled room visits.
                </div>
              ) : (
                <div className="space-y-4">
                  {roomVisits.map((visit, idx) => (
                    <div key={idx} className="border border-white/10 bg-white/[0.02] rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold text-white text-sm truncate max-w-[70%]">{visit.room_id}</h4>
                         <span className="text-xs text-white/50">{new Date(visit.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-white/70">Contact owner or navigate via map directions.</p>
                      <div className="mt-3 flex gap-2">
                         <button onClick={() => alert("Contacting owner for " + visit.room_id)} className="text-[10px] uppercase font-bold px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">Call Owner</button>
                         <button onClick={() => alert("Opening map for " + visit.room_id)} className="text-[10px] uppercase font-bold px-3 py-1.5 bg-white/10 text-white rounded-lg">Map</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. LIQUIDATION DEALS RESERVED */}
            <div>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-400" /> Liquidation Deals
              </h3>
              
              {liquidationDeals.length === 0 ? (
                <div className="text-center p-6 border border-white/5 bg-white/5 rounded-2xl text-white/50 text-sm">
                  No claimed liquidation items.
                </div>
              ) : (
                <div className="space-y-4">
                  {liquidationDeals.map((deal, idx) => (
                    <div key={idx} className="border border-white/10 bg-white/[0.02] rounded-2xl p-4 flex justify-between items-center">
                      <div>
                         <h4 className="font-bold text-white text-sm">{deal.item_id}</h4>
                         <p className="text-xs text-white/50 mt-1">Pickup Code: <span className="font-mono text-emerald-400">{deal.id.slice(0, 6).toUpperCase()}</span></p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">CLAIMED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. ACTIVITY TIMELINE */}
            <div>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" /> Activity Timeline
              </h3>
              
              {activityLogs.length === 0 ? (
                <div className="text-center p-6 border border-white/5 bg-white/5 rounded-2xl text-white/50 text-sm">
                  No activity found.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                  {activityLogs.map((log, idx) => (
                    <div key={idx} className="relative pl-8 pb-3">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#0A0D0F] border-2 border-emerald-500/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-sm font-medium text-white/90">{log.description || log.activity_type}</p>
                      <span className="text-[10px] text-white/40">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0A0D0F] flex items-center justify-between">
          <Button 
            onClick={() => {
              logout();
              onOpenChange(false);
            }} 
            variant="ghost" 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
          <span className="text-[10px] text-white/40">Secured via Supabase</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
