import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Search, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Lead = {
  id: string;
  full_name: string | null;
  user_type: string | null;
  college_or_locality: string | null;
  phone_number: string | null;
  created_at: string;
};

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "stash2026") {
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      setError("Invalid password");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users_waitlist")
        .select("id, full_name, user_type, college_or_locality, phone_number, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="glass w-full max-w-sm rounded-2xl p-6 text-center border border-white/10">
          <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-cyan-500/10 text-cyan-400">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Admin Portal</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter operator password to access leads.</p>
          
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="mb-4 bg-white/5 border-white/10 text-center tracking-[0.2em]"
          />
          {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
          <Button type="submit" variant="hero" className="w-full">Unlock Dashboard</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-8 px-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-cyan-400 h-6 w-6" />
              Node Operator Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage waitlist leads and stash bookings.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 w-full sm:w-64 bg-white/5 border-white/10"
            />
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Locality</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                        {lead.full_name || "Anonymous"}
                        <div className="text-xs text-muted-foreground font-normal mt-0.5">{lead.phone_number || "No phone"}</div>
                      </td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">
                        {lead.user_type || "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {lead.college_or_locality || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                          Pending Contact
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {lead.phone_number ? (
                          <Button asChild size="sm" variant="outline" className="h-8 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50">
                            <a 
                              href={(() => {
                                const clean = lead.phone_number.replace(/\D/g, "");
                                const intl = clean.startsWith("91") ? clean : `91${clean}`;
                                return `https://wa.me/${intl}?text=${encodeURIComponent(`Hi ${lead.full_name}, this is your StashSaarthi Concierge.`)}`;
                              })()} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                              WhatsApp
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No phone</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
