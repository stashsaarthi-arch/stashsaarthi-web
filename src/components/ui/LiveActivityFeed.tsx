import React, { useState, useMemo, useEffect } from "react";
import {
  Activity,
  Boxes,
  ShieldCheck,
  Truck,
  Lock,
  Search,
  RefreshCw,
  PlusCircle,
  Play,
  Pause,
  MapPin,
  Clock,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import {
  getLiveActivityFeedTokens,
  LIVE_ACTIVITY_FEED_TOKENS,
} from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";

export interface ActivityFeedItem {
  id: string;
  category: "booking" | "approval" | "dispatch" | "checkin";
  titleEn: string;
  titleHi: string;
  actorName: string;
  actorRole: "Student" | "Senior Host" | "System Operator";
  locationEn: string;
  locationHi: string;
  timestamp: string;
  status: string;
  statusColor: string;
  detailsEn: string;
  detailsHi: string;
  amount?: string;
  payoutEst?: string;
  driverName?: string;
  vaultSealCode?: string;
  actionEn: string;
  actionHi: string;
}

export interface LiveActivityFeedProps {
  initialItems?: ActivityFeedItem[];
  lang?: "en" | "hi";
  onInspectItem?: (item: ActivityFeedItem) => void;
  className?: string;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  initialItems,
  lang = "en",
  onInspectItem,
  className = "",
}) => {
  const { role, isHost } = usePersona();
  const persona = role;

  const tokens = useMemo(
    () => getLiveActivityFeedTokens(persona),
    [persona]
  );

  const [items, setItems] = useState<ActivityFeedItem[]>(() =>
    initialItems && initialItems.length > 0
      ? initialItems
      : (tokens.feedItems as unknown as ActivityFeedItem[])
  );

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [activeTabLang, setActiveTabLang] = useState<"en" | "hi">(lang);
  const [selectedItemForModal, setSelectedItemForModal] = useState<ActivityFeedItem | null>(null);

  // Sync lang if prop updates
  useEffect(() => {
    setActiveTabLang(lang);
  }, [lang]);

  // Simulated live event ticker
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const simulatedNodes = [
        { en: "Kakadeo Hub Node #3", hi: "काकादेव हब नोड #3" },
        { en: "Kalyanpur Campus Gate 1", hi: "कल्याणपुर कैंपस गेट 1" },
        { en: "Nawabganj Locker Vault", hi: "नवाबगंज लॉकर वॉल्ट" },
        { en: "Gurudev Palace Circle", hi: "गुरुदेव पैलेस सर्किल" },
      ];
      const idx = Math.floor(Math.random() * simulatedNodes.length);
      const randomNode = simulatedNodes[idx] ?? simulatedNodes[0] ?? { en: "Kakadeo Hub Node #3", hi: "काकादेव हब नोड #3" };
      const randomId = `act-sim-${Date.now().toString().slice(-4)}`;

      const newSimulatedItem: ActivityFeedItem = {
        id: randomId,
        category: "booking",
        titleEn: "Instant Micro-Storage Order",
        titleHi: "तत्काल माइक्रो-स्टोरेज ऑर्डर",
        actorName: `Student ${Math.floor(Math.random() * 900 + 100)}`,
        actorRole: "Student",
        locationEn: randomNode.en,
        locationHi: randomNode.hi,
        timestamp: "Just now",
        status: "LIVE BOOKED",
        statusColor: "#10B981",
        detailsEn: "1 Backpack + 1 Suitcase reserved for Doorstep Pickup",
        detailsHi: "1 बैकपैक + 1 सूटकेस डोरस्टेप पिकअप के लिए आरक्षित",
        amount: "₹350/mo",
        vaultSealCode: `QR-LIVE-${Math.floor(Math.random() * 8999 + 1000)}`,
        actionEn: "Inspect Order",
        actionHi: "ऑर्डर देखें",
      };

      setItems((prev) => [newSimulatedItem, ...prev.slice(0, 19)]);
    }, 18000); // add simulated live event every 18 seconds

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleFilterChange = (filterKey: string) => {
    playClick();
    setSelectedFilter(filterKey);
  };

  const handleManualSimulateEvent = () => {
    playSuccessChime();
    const newManualEvent: ActivityFeedItem = {
      id: `act-manual-${Date.now()}`,
      category: "approval",
      titleEn: "Senior Host Verification Cleared",
      titleHi: "वरिष्ठ मेज़बान सत्यापन स्वीकृत",
      actorName: "Smt. Sarojini Devi (Retd. Principal)",
      actorRole: "Senior Host",
      locationEn: "Swaroop Nagar Vault",
      locationHi: "स्वरूप नगर वॉल्ट",
      timestamp: "Just now",
      status: "APPROVED",
      statusColor: "#F59E0B",
      detailsEn: "TPA Sec 105 Seal Verified, ₹10k Insurance Shield Active",
      detailsHi: "टीपीए धारा 105 सील सत्यापित, ₹10 हजार बीमा शील्ड सक्रिय",
      payoutEst: "₹12,800/mo",
      vaultSealCode: "SEAL-PASS-990",
      actionEn: "View Certificate",
      actionHi: "प्रमाणपत्र देखें",
    };
    setItems((prev) => [newManualEvent, ...prev]);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter =
        selectedFilter === "all" || item.category === selectedFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.titleEn.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q) ||
        item.actorName.toLowerCase().includes(q) ||
        item.locationEn.toLowerCase().includes(q) ||
        item.locationHi.toLowerCase().includes(q) ||
        (item.vaultSealCode && item.vaultSealCode.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [items, selectedFilter, searchQuery]);

  const getCategoryIcon = (category: ActivityFeedItem["category"]) => {
    switch (category) {
      case "booking":
        return <Boxes className="w-4 h-4 text-emerald-400" />;
      case "approval":
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case "dispatch":
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case "checkin":
        return <Lock className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div
      className={`live-activity-feed-container p-5 sm:p-6 text-white ${className}`}
      data-persona={persona}
    >
      {/* Top Header & Telemetry Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="relative flex h-3 w-3">
              {isLiveStreaming && (
                <span className="activity-beacon-pulse-active absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isLiveStreaming ? "bg-emerald-500" : "bg-zinc-500"
                }`}
              ></span>
            </span>
            <span className="text-[11px] font-mono tracking-wider font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {activeTabLang === "hi"
                ? tokens.header.statusBadgeHi
                : tokens.header.statusBadgeEn}
            </span>
            <button
              onClick={() => setActiveTabLang((l) => (l === "en" ? "hi" : "en"))}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              {activeTabLang === "en" ? "हिंदी" : "EN"}
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            {activeTabLang === "hi"
              ? tokens.header.titleHi
              : tokens.header.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {activeTabLang === "hi"
              ? tokens.header.subtitleHi
              : tokens.header.subtitleEn}
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              playPop();
              setIsLiveStreaming((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLiveStreaming
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{activeTabLang === "hi" ? "पॉज रीम" : "Pause Stream"}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{activeTabLang === "hi" ? "लाइव चालू" : "Resume Stream"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleManualSimulateEvent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>
              {activeTabLang === "hi" ? "+ नया इवेंट सिमुलेट" : "+ Simulate Event"}
            </span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            {activeTabLang === "hi" ? "आज के कुल इवेंट्स" : "Today Events"}
          </span>
          <span className="text-lg font-black text-emerald-400 mt-0.5 block">
            {items.length + 20}
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            {activeTabLang === "hi" ? "सक्रिय बुकिंग्स" : "Active Bookings"}
          </span>
          <span className="text-lg font-black text-cyan-400 mt-0.5 block">
            {tokens.statsSummary.activeBookingsCount}
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            {activeTabLang === "hi" ? "सत्यापित मेज़बान" : "Verified Hosts"}
          </span>
          <span className="text-lg font-black text-amber-400 mt-0.5 block">
            {tokens.statsSummary.verifiedHostsCount}
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            {activeTabLang === "hi" ? "एक्टिव डिस्पैच" : "Active Dispatches"}
          </span>
          <span className="text-lg font-black text-purple-400 mt-0.5 block">
            {tokens.statsSummary.activeDispatchesCount}
          </span>
        </div>
      </div>

      {/* Category Filters & Live Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {tokens.filters.map((f) => {
            const isActive = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`feed-filter-pill-modern whitespace-nowrap ${
                  isActive
                    ? isHost
                      ? "active-filter-host"
                      : "active-filter-student"
                    : ""
                }`}
              >
                <span>{activeTabLang === "hi" ? f.labelHi : f.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTabLang === "hi"
                ? "नाम, नोड या सील कोड खोजें..."
                : "Search name, node or seal..."
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Activity Feed List */}
      <div className="space-y-3 mt-4 max-h-[520px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-400">
              {activeTabLang === "hi"
                ? "कोई गतिविधि नहीं मिली"
                : "No matching activity stream entries found"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {activeTabLang === "hi"
                ? "फिल्टर या खोज शब्द बदलें"
                : "Try adjusting your filter or search criteria"}
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`activity-feed-item-card ${
                idx === 0 ? "feed-item-entrance-anim" : ""
              }`}
            >
              {/* Card Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      {activeTabLang === "hi" ? item.titleHi : item.titleEn}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="font-semibold text-zinc-300">
                        {item.actorName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {activeTabLang === "hi"
                          ? item.locationHi
                          : item.locationEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badge & Timestamp */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                    style={{
                      backgroundColor: `${item.statusColor}18`,
                      color: item.statusColor,
                      border: `1px solid ${item.statusColor}40`,
                    }}
                  >
                    {item.status}
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <p className="text-zinc-300 font-medium">
                  {activeTabLang === "hi" ? item.detailsHi : item.detailsEn}
                </p>

                <div className="flex items-center gap-3 shrink-0">
                  {item.amount && (
                    <span className="font-mono font-bold text-emerald-400">
                      {item.amount}
                    </span>
                  )}
                  {item.payoutEst && (
                    <span className="font-mono font-bold text-amber-400">
                      {item.payoutEst}
                    </span>
                  )}
                  {item.vaultSealCode && (
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                      {item.vaultSealCode}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      playClick();
                      if (onInspectItem) onInspectItem(item);
                      setSelectedItemForModal(item);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>
                      {activeTabLang === "hi" ? item.actionHi : item.actionEn}
                    </span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Item Inspection Modal Dialog */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-obsidian border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-bold">
                  {activeTabLang === "hi"
                    ? selectedItemForModal.titleHi
                    : selectedItemForModal.titleEn}
                </h4>
              </div>
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Actor</span>
                <span className="font-semibold text-white">
                  {selectedItemForModal.actorName} ({selectedItemForModal.actorRole})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Node Location</span>
                <span className="font-semibold text-emerald-400">
                  {activeTabLang === "hi"
                    ? selectedItemForModal.locationHi
                    : selectedItemForModal.locationEn}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Status</span>
                <span className="font-bold text-amber-400">
                  {selectedItemForModal.status}
                </span>
              </div>
              {selectedItemForModal.vaultSealCode && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Vault Barcode Seal</span>
                  <span className="font-mono text-cyan-400">
                    {selectedItemForModal.vaultSealCode}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-zinc-400 block mb-1">Details Summary</span>
                <p className="bg-white/5 p-3 rounded-lg text-zinc-300 font-medium">
                  {activeTabLang === "hi"
                    ? selectedItemForModal.detailsHi
                    : selectedItemForModal.detailsEn}
                </p>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => {
                  playSuccessChime();
                  setSelectedItemForModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs transition-colors"
              >
                {activeTabLang === "hi" ? "पुष्टि व बंद करें" : "Acknowledge & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
