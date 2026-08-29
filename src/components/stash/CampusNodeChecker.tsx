import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Zap, Navigation, ArrowRight, Activity, CheckCircle2, Radar, ListFilter, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import type { OpenBooking } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface NodeData {
  id: string;
  name: string;
  name_hi?: string;
  locality: string;
  locality_hi?: string;
  pincode: string;
  distance: string;
  distance_hi?: string;
  walkTime: string;
  walkTime_hi?: string;
  gateNearby: string;
  gateNearby_hi?: string;
  stashAvailable: number;
  roomsAvailable: number;
  pickupTime: string;
  pickupTime_hi?: string;
  rating: number;
  x?: number; // % coordinates for radar
  y?: number;
}

const MOCK_NODES: Record<string, NodeData[]> = {
  "CSJMU Kanpur": [
    { 
      id: "knp-1", 
      name: "IIT Gate 1 Saarthi Stash Hub", 
      name_hi: "आईआईटी गेट 1 सार्थी स्टैश हब",
      locality: "Kalyanpur, Kanpur", 
      locality_hi: "कल्याणपुर, कानपुर",
      pincode: "208024", 
      distance: "650m", 
      distance_hi: "650मी",
      walkTime: "7-min walk", 
      walkTime_hi: "7 मिनट पैदल",
      gateNearby: "Main Hostel Gate / Gate 1", 
      gateNearby_hi: "मुख्य हॉस्टल गेट / गेट 1",
      stashAvailable: 14, 
      roomsAvailable: 3, 
      pickupTime: "15-min", 
      pickupTime_hi: "15 मिनट",
      rating: 4.9,
      x: 35,
      y: 42,
    },
    { 
      id: "knp-2", 
      name: "Kalyanpur Awas Vikas Node", 
      name_hi: "कल्याणपुर आवास विकास नोड",
      locality: "Kalyanpur, Kanpur", 
      locality_hi: "कल्याणपुर, कानपुर",
      pincode: "208025", 
      distance: "1.2 km", 
      distance_hi: "1.2 किमी",
      walkTime: "12-min walk", 
      walkTime_hi: "12 मिनट पैदल",
      gateNearby: "Campus North Boundary", 
      gateNearby_hi: "कैंपस उत्तरी सीमा",
      stashAvailable: 22, 
      roomsAvailable: 1, 
      pickupTime: "20-min", 
      pickupTime_hi: "20 मिनट",
      rating: 4.7,
      x: 25,
      y: 30,
    }
  ],
  "IIT Kanpur": [
    { 
      id: "iit-1", 
      name: "Nankari Stash Node", 
      name_hi: "नानकारी स्टैश नोड",
      locality: "Nankari, Kanpur", 
      locality_hi: "नानकारी, कानपुर",
      pincode: "208016", 
      distance: "300m", 
      distance_hi: "300मी",
      walkTime: "4-min walk", 
      walkTime_hi: "4 मिनट पैदल",
      gateNearby: "Hall 13 & GH-1 Gate", 
      gateNearby_hi: "हॉल 13 व जीएच-1 गेट",
      stashAvailable: 8, 
      roomsAvailable: 2, 
      pickupTime: "10-min", 
      pickupTime_hi: "10 मिनट",
      rating: 4.8,
      x: 52,
      y: 28,
    },
    { 
      id: "iit-2", 
      name: "Barra Cross Node", 
      name_hi: "बर्रा क्रॉस नोड",
      locality: "GT Road, Kanpur", 
      locality_hi: "जीटी रोड, कानपुर",
      pincode: "208016", 
      distance: "850m", 
      distance_hi: "850मी",
      walkTime: "9-min walk", 
      walkTime_hi: "9 मिनट पैदल",
      gateNearby: "Main Entry Gate", 
      gateNearby_hi: "मुख्य प्रवेश द्वार",
      stashAvailable: 16, 
      roomsAvailable: 1, 
      pickupTime: "15-min", 
      pickupTime_hi: "15 मिनट",
      rating: 4.7,
      x: 68,
      y: 38,
    }
  ],
  "HBTI Kanpur": [
    { 
      id: "hbti-1", 
      name: "Nawabganj Central Hub", 
      name_hi: "नवाबगंज सेंट्रल हब",
      locality: "Nawabganj, Kanpur", 
      locality_hi: "नवाबगंज, कानपुर",
      pincode: "208001", 
      distance: "800m", 
      distance_hi: "800मी",
      walkTime: "8-min walk", 
      walkTime_hi: "8 मिनट पैदल",
      gateNearby: "West Campus Gate", 
      gateNearby_hi: "पश्चिम कैंपस गेट",
      stashAvailable: 12, 
      roomsAvailable: 4, 
      pickupTime: "12-min", 
      pickupTime_hi: "12 मिनट",
      rating: 4.6,
      x: 75,
      y: 65,
    }
  ],
  "GSVM Medical College": [
    { 
      id: "gsvm-1", 
      name: "Swaroop Nagar Node", 
      name_hi: "स्वरूप नगर नोड",
      locality: "Swaroop Nagar, Kanpur", 
      locality_hi: "स्वरूप नगर, कानपुर",
      pincode: "208002", 
      distance: "450m", 
      distance_hi: "450मी",
      walkTime: "5-min walk", 
      walkTime_hi: "5 मिनट पैदल",
      gateNearby: "Resident Doctors Hostel", 
      gateNearby_hi: "रेजिडेंट डॉक्टर्स हॉस्टल",
      stashAvailable: 18, 
      roomsAvailable: 1, 
      pickupTime: "10-min", 
      pickupTime_hi: "10 मिनट",
      rating: 4.9,
      x: 48,
      y: 72,
    }
  ],
  "Lucknow University": [
    { 
      id: "lu-1", 
      name: "Babuganj Node", 
      name_hi: "बाबूगंज नोड",
      locality: "Babuganj, Lucknow", 
      locality_hi: "बाबूगंज, लखनऊ",
      pincode: "226007", 
      distance: "500m", 
      distance_hi: "500मी",
      walkTime: "6-min walk", 
      walkTime_hi: "6 मिनट पैदल",
      gateNearby: "Gate 2 Hostel Block", 
      gateNearby_hi: "गेट 2 हॉस्टल ब्लॉक",
      stashAvailable: 10, 
      roomsAvailable: 3, 
      pickupTime: "15-min", 
      pickupTime_hi: "15 मिनट",
      rating: 4.7,
      x: 82,
      y: 20,
    }
  ]
};

const POPULAR_CHIPS = [
  { label: "IITK (208016)", label_hi: "आईआईटीके (208016)", q: "208016" },
  { label: "CSJMU (208024)", label_hi: "सीएसजेएमयू (208024)", q: "208024" },
  { label: "Kakadeo (208002)", label_hi: "काकादेव (208002)", q: "208002" },
  { label: "Kalyanpur (208025)", label_hi: "कल्याणपुर (208025)", q: "208025" },
  { label: "Lucknow (226007)", label_hi: "लखनऊ (226007)", q: "226007" }
];

export function CampusNodeChecker({ onBook }: { onBook: OpenBooking }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [viewMode, setViewMode] = useState<"search" | "radar">("search");
  const [selectedRadarNode, setSelectedRadarNode] = useState<NodeData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsSearching(true);
    setHasInteracted(true);
  };

  const handleChipClick = (q: string, label: string) => {
    setQuery(label);
    setDebouncedQuery(q);
    setIsSearching(false);
    setHasInteracted(true);
  };

  const allRadarNodes = useMemo(() => Object.values(MOCK_NODES).flat(), []);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    const searchLower = debouncedQuery.toLowerCase().trim();
    
    // Find matching keys or nodes with matching locality/pincode/name
    const allNodes = Object.values(MOCK_NODES).flat();
    const matched = allNodes.filter((node) => {
      return (
        node.name.toLowerCase().includes(searchLower) ||
        (node.name_hi && node.name_hi.includes(searchLower)) ||
        node.locality.toLowerCase().includes(searchLower) ||
        (node.locality_hi && node.locality_hi.includes(searchLower)) ||
        node.pincode.includes(searchLower) ||
        node.gateNearby.toLowerCase().includes(searchLower)
      );
    });

    if (matched.length > 0) return matched;

    // Check college name matching
    const matchedColleges = Object.keys(MOCK_NODES).filter((key) =>
      key.toLowerCase().includes(searchLower)
    );
    if (matchedColleges.length > 0) {
      return matchedColleges.flatMap((k) => MOCK_NODES[k] || []);
    }

    return [];
  }, [debouncedQuery]);

  return (
    <div className="relative mx-auto mt-12 max-w-2xl text-left z-20">
      <AnimatedContent distance={30} direction="vertical" duration={0.6} delay={0.2}>
        <div className="glass overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
          
          {/* Top Control Header with Search/Radar toggle */}
          <div className="p-2 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("search")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "search"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
                <span>{isHi ? "खोज सूची" : "Search List"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("radar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "radar"
                    ? "bg-cyan-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Radar className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{isHi ? "लाइव कैंपस रडार" : "Live Campus Radar"}</span>
              </button>
            </div>

            <div className="flex shrink-0 items-center justify-center rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {t.campusNodeChecker.liveNetwork}
              </span>
            </div>
          </div>

          {viewMode === "search" ? (
            <>
              <div className="p-1.5 sm:p-2">
                <div className="relative flex items-center rounded-2xl bg-white/5 px-4 py-2 sm:px-5 sm:py-3 border border-white/10 focus-within:border-emerald-500/50 transition-colors">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    value={query}
                    onChange={handleSearch}
                    placeholder={t.campusNodeChecker.placeholder}
                    className="border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 text-foreground h-10 w-full ml-2 outline-none"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!hasInteracted || !debouncedQuery.trim() ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 pt-3"
                  >
                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                      {t.campusNodeChecker.popularHubs}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_CHIPS.map(chip => (
                        <button
                          key={chip.q}
                          onClick={() => handleChipClick(chip.q, isHi ? (chip.label_hi || chip.label) : chip.label)}
                          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground cursor-pointer"
                        >
                          <MapPin className="mr-1.5 h-3 w-3" />
                          {isHi ? (chip.label_hi || chip.label) : chip.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : isSearching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center py-10"
                  >
                    <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
                    <span className="ml-3 text-sm text-muted-foreground">
                      {t.campusNodeChecker.scanning}
                    </span>
                  </motion.div>
                ) : results && results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-h-[320px] overflow-y-auto px-2 pb-2"
                  >
                    <div className="space-y-2">
                      {results.map((node, i) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-white/[0.07]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-foreground">
                                  {isHi && node.name_hi ? node.name_hi : node.name}
                                </h4>
                                <span className="inline-flex items-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                  ★ {node.rating}
                                </span>
                                <PrototypeBadge variant="text" />
                              </div>
                              <div className="mt-1.5 flex flex-col gap-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="flex items-center text-foreground font-semibold">
                                    <MapPin className="mr-1 h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                    {isHi && node.distance_hi ? node.distance_hi : node.distance} ({isHi && node.walkTime_hi ? node.walkTime_hi : node.walkTime})
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-emerald-400 font-medium">
                                    {isHi && node.gateNearby_hi ? node.gateNearby_hi : node.gateNearby}
                                  </span>
                                </div>
                                <div className="flex items-center text-slate-400">
                                  <Navigation className="mr-1.5 h-3.5 w-3.5 text-emerald-500/70 shrink-0" />
                                  {t.campusNodeChecker.hostZone}: {isHi && node.locality_hi ? node.locality_hi : node.locality} · {t.campusNodeChecker.pinPrefix} {node.pincode}
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {node.stashAvailable > 0 && (
                                  <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300 font-medium">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    {node.stashAvailable} {t.campusNodeChecker.lockersLeft}
                                  </div>
                                )}
                                {node.roomsAvailable > 0 && (
                                  <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-300 font-medium">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    {node.roomsAvailable} {t.campusNodeChecker.roomsLeft}
                                  </div>
                                )}
                                <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300 font-medium">
                                  <Zap className="mr-1 h-3 w-3" />
                                  {isHi && node.pickupTime_hi ? node.pickupTime_hi : node.pickupTime} {t.campusNodeChecker.pickupSuffix}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                              <Button 
                                size="sm" 
                                variant="hero"
                                className="w-full sm:w-auto shrink-0 group/btn cursor-pointer"
                                onClick={() => onBook({ service: "stash", note: `Reserved Node: ${node.name} (${node.gateNearby}, ${node.distance})` })}
                              >
                                {t.campusNodeChecker.reserveBtn}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-xs cursor-pointer"
                                asChild
                              >
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${node.locality}, Kanpur`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={t.campusNodeChecker.viewMap}
                                >
                                  {t.campusNodeChecker.viewMap}
                                </a>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 px-4 text-center text-sm text-muted-foreground"
                  >
                    {t.campusNodeChecker.noResults}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Interactive Visual Campus Radar Map */
            <div className="p-4 space-y-4">
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-[#070A0D] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
                {/* Radar Grid Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[85%] h-[85%] rounded-full border border-cyan-500/15" />
                  <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-500/20" />
                  <div className="absolute w-[35%] h-[35%] rounded-full border border-cyan-500/25" />
                  <div className="absolute w-[10%] h-[10%] rounded-full bg-cyan-500/20 border border-cyan-400/40" />
                  {/* Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-cyan-500/10" />
                  <div className="absolute h-full w-[1px] bg-cyan-500/10" />
                </div>

                {/* Rotating Radar Beam Sweep */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background: "conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.4) 0deg, transparent 60deg)",
                    animation: "spin 5s linear infinite",
                  }}
                />

                {/* Interactive Node Pins */}
                {allRadarNodes.map((node) => {
                  const isSelected = selectedRadarNode?.id === node.id;
                  const nodeName = isHi && node.name_hi ? node.name_hi : node.name;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedRadarNode(node)}
                      style={{ left: `${node.x || 50}%`, top: `${node.y || 50}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
                    >
                      <span className="relative flex h-5 w-5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isSelected ? 'bg-cyan-400 ring-4 ring-cyan-400/30 scale-125' : 'bg-emerald-500'} transition-all`} />
                      </span>
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold font-mono bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/20 shadow-md">
                        {nodeName.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Radar Node Inspection Box */}
              {selectedRadarNode ? (
                <div className="p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {isHi && selectedRadarNode.name_hi ? selectedRadarNode.name_hi : selectedRadarNode.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        {selectedRadarNode.stashAvailable} {isHi ? "स्पॉट उपलब्ध" : "spots left"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isHi && selectedRadarNode.locality_hi ? selectedRadarNode.locality_hi : selectedRadarNode.locality} · {selectedRadarNode.distance} ({selectedRadarNode.walkTime})
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="hero"
                    onClick={() => onBook({ service: "stash", note: `Radar Booked: ${selectedRadarNode.name}` })}
                    className="w-full sm:w-auto shrink-0 cursor-pointer"
                  >
                    {isHi ? "यह नोड बुक करें" : "Reserve This Node"}
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-center text-slate-400 italic">
                  {isHi ? "👆 विवरण और स्लॉट उपलब्धता देखने के लिए रडार पर किसी भी नोड पर क्लिक करें।" : "👆 Click any radar pin above to inspect live storage capacity and reserve instantly."}
                </p>
              )}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
