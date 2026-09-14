import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar,
  MapPin,
  Zap,
  Navigation,
  ArrowRight,
  CheckCircle2,
  Footprints,
  Radio,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { playPop } from "@/lib/audio";
import type { OpenBooking } from "./types";
import { FindMyStashModal } from "./FindMyStashModal";

export interface CampusBeaconNode {
  id: string;
  name: string;
  name_hi?: string;
  campus: "Kakadeo" | "IIT Kanpur" | "HBTI" | "CSJMU";
  campus_hi: string;
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
  x: number; // percentage X on radar HUD
  y: number; // percentage Y on radar HUD
  beaconColor: "emerald" | "cyan" | "mint" | "amber";
  pingLatency: string;
}

export const HYPERLOCAL_BEACON_NODES: CampusBeaconNode[] = [
  {
    id: "radar-kakadeo-1",
    name: "Kakadeo PW Vidyapeeth Saarthi Hub",
    name_hi: "काकादेव पीडब्ल्यू विद्यापीठ सार्थी हब",
    campus: "Kakadeo",
    campus_hi: "काकादेव",
    locality: "Geeta Nagar / Kakadeo, Kanpur",
    locality_hi: "गीता नगर / काकादेव, कानपुर",
    pincode: "208002",
    distance: "150m",
    distance_hi: "150मी",
    walkTime: "2-min walk from PW Vidyapeeth",
    walkTime_hi: "पीडब्ल्यू विद्यापीठ से 2 मिनट पैदल",
    gateNearby: "PW Vidyapeeth & Allen Kakadeo",
    gateNearby_hi: "पीडब्ल्यू विद्यापीठ व एलन काकादेव",
    stashAvailable: 19,
    roomsAvailable: 5,
    pickupTime: "10-min pickup",
    pickupTime_hi: "10 मिनट पिकअप",
    rating: 4.9,
    x: 50,
    y: 44,
    beaconColor: "emerald",
    pingLatency: "12ms",
  },
  {
    id: "radar-iitk-1",
    name: "IIT Kanpur Nankari Vault Node",
    name_hi: "आईआईटी कानपुर नानकारी वॉल्ट नोड",
    campus: "IIT Kanpur",
    campus_hi: "आईआईटी कानपुर",
    locality: "Nankari Gate 1, Kanpur",
    locality_hi: "नानकारी गेट 1, कानपुर",
    pincode: "208016",
    distance: "300m",
    distance_hi: "300मी",
    walkTime: "4-min walk from Hall 13",
    walkTime_hi: "हॉल 13 से 4 मिनट पैदल",
    gateNearby: "Hall 13 & GH-1 Gate",
    gateNearby_hi: "हॉल 13 व जीएच-1 गेट",
    stashAvailable: 14,
    roomsAvailable: 3,
    pickupTime: "10-min pickup",
    pickupTime_hi: "10 मिनट पिकअप",
    rating: 4.9,
    x: 28,
    y: 32,
    beaconColor: "cyan",
    pingLatency: "18ms",
  },
  {
    id: "radar-hbti-1",
    name: "HBTI Nawabganj West Campus Node",
    name_hi: "एचबीटीआई नवाबगंज वेस्ट कैंपस नोड",
    campus: "HBTI",
    campus_hi: "एचबीटीआई",
    locality: "Nawabganj, Kanpur",
    locality_hi: "नवाबगंज, कानपुर",
    pincode: "208002",
    distance: "400m",
    distance_hi: "400मी",
    walkTime: "5-min walk from West Campus",
    walkTime_hi: "वेस्ट कैंपस से 5 मिनट पैदल",
    gateNearby: "West Campus Main Gate",
    gateNearby_hi: "वेस्ट कैंपस मेन गेट",
    stashAvailable: 16,
    roomsAvailable: 4,
    pickupTime: "12-min pickup",
    pickupTime_hi: "12 मिनट पिकअप",
    rating: 4.8,
    x: 74,
    y: 58,
    beaconColor: "mint",
    pingLatency: "22ms",
  },
  {
    id: "radar-csjmu-1",
    name: "CSJMU Main Gate Saarthi Stash",
    name_hi: "सीएसजेएमयू मेन गेट सार्थी स्टैश",
    campus: "CSJMU",
    campus_hi: "सीएसजेएमयू",
    locality: "Kalyanpur, Kanpur",
    locality_hi: "कल्याणपुर, कानपुर",
    pincode: "208024",
    distance: "450m",
    distance_hi: "450मी",
    walkTime: "6-min walk from CSJMU Admin",
    walkTime_hi: "सीएसजेएमयू एडमिन से 6 मिनट पैदल",
    gateNearby: "CSJMU Main Hostel Gate",
    gateNearby_hi: "सीएसजेएमयू मुख्य हॉस्टल गेट",
    stashAvailable: 22,
    roomsAvailable: 2,
    pickupTime: "15-min pickup",
    pickupTime_hi: "15 मिनट पिकअप",
    rating: 4.7,
    x: 22,
    y: 70,
    beaconColor: "amber",
    pingLatency: "26ms",
  },
];

const CAMPUS_FILTER_TABS: Array<{ id: "ALL" | "Kakadeo" | "IIT Kanpur" | "HBTI" | "CSJMU"; label: string; label_hi: string; badge: string }> = [
  { id: "ALL", label: "All Beacons (Kanpur)", label_hi: "सभी बीकन (कानपुर)", badge: "4 Active" },
  { id: "Kakadeo", label: "Kakadeo (PW/Allen)", label_hi: "काकादेव (कोचिंग हब)", badge: "208002" },
  { id: "IIT Kanpur", label: "IIT Kanpur (Hall 13)", label_hi: "आईआईटी कानपुर", badge: "208016" },
  { id: "HBTI", label: "HBTI (Nawabganj)", label_hi: "एचबीटीआई (नवाबगंज)", badge: "208001" },
  { id: "CSJMU", label: "CSJMU (Kalyanpur)", label_hi: "सीएसजेएमयू", badge: "208024" },
];

export function HeroCampusRadar({ onBook }: { onBook: OpenBooking }) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeCampus, setActiveCampus] = useState<"ALL" | "Kakadeo" | "IIT Kanpur" | "HBTI" | "CSJMU">("ALL");
  const [selectedNode, setSelectedNode] = useState<CampusBeaconNode>(HYPERLOCAL_BEACON_NODES[0] as CampusBeaconNode);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const filteredNodes = useMemo(() => {
    if (activeCampus === "ALL") return HYPERLOCAL_BEACON_NODES;
    return HYPERLOCAL_BEACON_NODES.filter((node) => node.campus === activeCampus);
  }, [activeCampus]);

  const handleTabChange = (campusId: typeof activeCampus) => {
    playPop();
    setActiveCampus(campusId);
    if (campusId !== "ALL") {
      const match = HYPERLOCAL_BEACON_NODES.find((n) => n.campus === campusId);
      if (match) setSelectedNode(match);
    }
  };

  const handleNodeSelect = (node: CampusBeaconNode) => {
    playPop();
    setSelectedNode(node);
  };

  const getBeaconBadgeStyle = (color: CampusBeaconNode["beaconColor"]) => {
    switch (color) {
      case "emerald":
        return "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      case "cyan":
        return "border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
      case "mint":
        return "border-emerald-400/40 bg-emerald-400/20 text-emerald-200 shadow-[0_0_15px_rgba(0,245,160,0.3)]";
      case "amber":
        return "border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
    }
  };

  return (
    <div className="section-isolated layout-isolated relative w-full my-4 text-left">
      <div className="glass overflow-hidden rounded-2xl border border-white/15 bg-black/50 backdrop-blur-2xl shadow-2xl">
        {/* Header HUD Bar */}
        <div className="p-3 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Radar className="h-4 w-4 animate-spin" style={{ animationDuration: "5s" }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider uppercase text-white">
                  {isHi ? "हाइपरलोकल कैंपस नोड रडार" : "Hyperlocal Campus Node Radar"}
                </span>
                <PrototypeBadge variant="text" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {isHi
                  ? "काकादेव • आईआईटीके • एचबीटीआई • सीएसजेएमयू रीयल-टाइम बीकन"
                  : "Kakadeo • IIT Kanpur • HBTI • CSJMU Live Beacons"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400">
              <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
              <span>{selectedNode.pingLatency} • LIVE SCAN</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-300">
              <Compass className="h-3 w-3 text-cyan-400" />
              <span>4 CAMPUSES COVERED</span>
            </div>
          </div>
        </div>

        {/* Campus Filter Pills */}
        <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/5">
          {CAMPUS_FILTER_TABS.map((tab) => {
            const isActive = activeCampus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg scale-[1.02]"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                <MapPin className={`h-3 w-3 ${isActive ? "text-black" : "text-cyan-400"}`} />
                <span>{isHi ? tab.label_hi : tab.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-black/30 text-white font-bold" : "bg-white/10 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2D Radar Canvas & Visualizer */}
        <div className="relative p-3">
          <div className="relative w-full h-[220px] sm:h-[260px] rounded-xl bg-[#06090D] border border-cyan-500/25 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Background Grid & Concentric Distance Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[88%] h-[88%] rounded-full border border-cyan-500/15 border-dashed" />
              <div className="absolute w-[62%] h-[62%] rounded-full border border-cyan-500/20" />
              <div className="absolute w-[36%] h-[36%] rounded-full border border-cyan-500/25" />
              <div className="absolute w-[12%] h-[12%] rounded-full bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.4)]" />

              {/* Crosshairs & Compass Cardinal Marks */}
              <div className="absolute w-full h-[1px] bg-cyan-500/15" />
              <div className="absolute h-full w-[1px] bg-cyan-500/15" />

              <span className="absolute top-2 text-[9px] font-mono text-cyan-400/60 font-bold">N • IITK</span>
              <span className="absolute bottom-2 text-[9px] font-mono text-emerald-400/60 font-bold">S • CSJMU</span>
              <span className="absolute left-2 text-[9px] font-mono text-cyan-400/60 font-bold">W • Kakadeo</span>
              <span className="absolute right-2 text-[9px] font-mono text-amber-400/60 font-bold">E • HBTI</span>
            </div>

            {/* Rotating 360° Radar Sweep Beam */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.5) 0deg, rgba(16, 185, 129, 0.2) 45deg, transparent 90deg)",
                animation: "spin 6s linear infinite",
              }}
            />

            {/* Pulsing Campus Node Beacons */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const nodeName = isHi && node.name_hi ? node.name_hi : node.name;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeSelect(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none"
                  aria-label={`Select radar node ${node.name}`}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      node.beaconColor === "emerald" ? "bg-emerald-400" :
                      node.beaconColor === "cyan" ? "bg-cyan-400" :
                      node.beaconColor === "mint" ? "bg-emerald-300" : "bg-amber-400"
                    }`} />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 ${
                        isSelected
                          ? "bg-white ring-4 ring-cyan-400 scale-125 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                          : node.beaconColor === "emerald" ? "bg-emerald-500" :
                            node.beaconColor === "cyan" ? "bg-cyan-500" :
                            node.beaconColor === "mint" ? "bg-emerald-400" : "bg-amber-500"
                      } transition-all duration-300`}
                    />
                  </span>

                  {/* Beacon Label Tooltip */}
                  <div
                    className={`absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 border text-[10px] font-mono font-bold shadow-xl transition-all ${
                      isSelected
                        ? "bg-black text-white border-cyan-400 ring-2 ring-cyan-400/40 z-30 scale-105"
                        : "bg-black/80 text-slate-200 border-white/20 group-hover:border-emerald-400"
                    }`}
                  >
                    <span>{node.campus}</span>
                    <span className="ml-1 text-emerald-400 font-extrabold">({node.stashAvailable} left)</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Node Inspection Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-3 p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-black/40 to-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-black uppercase tracking-wider ${getBeaconBadgeStyle(selectedNode.beaconColor)}`}>
                    📍 {isHi ? selectedNode.campus_hi : selectedNode.campus} Node
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {isHi && selectedNode.name_hi ? selectedNode.name_hi : selectedNode.name}
                  </h4>
                  <span className="inline-flex items-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    ★ {selectedNode.rating}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                  <span className="flex items-center font-semibold text-emerald-300">
                    <Navigation className="mr-1 h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    {isHi && selectedNode.distance_hi ? selectedNode.distance_hi : selectedNode.distance} (
                    {isHi && selectedNode.walkTime_hi ? selectedNode.walkTime_hi : selectedNode.walkTime})
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center text-amber-300 font-medium">
                    <MapPin className="mr-1 h-3.5 w-3.5 text-amber-400 shrink-0" />
                    {isHi && selectedNode.gateNearby_hi ? selectedNode.gateNearby_hi : selectedNode.gateNearby}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-mono">PIN {selectedNode.pincode}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300 font-bold">
                    <CheckCircle2 className="mr-1.5 h-3 w-3 text-emerald-400" />
                    {selectedNode.stashAvailable} {isHi ? "स्टोरेज बैग खाली" : "Lockers Free (@ ₹300/mo)"}
                  </div>
                  <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] text-cyan-300 font-bold">
                    <CheckCircle2 className="mr-1.5 h-3 w-3 text-cyan-400" />
                    {selectedNode.roomsAvailable} {isHi ? "कमरे उपलब्ध" : "Zero-Brokerage Rooms"}
                  </div>
                  <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300 font-bold">
                    <Zap className="mr-1.5 h-3 w-3 text-amber-400" />
                    {isHi && selectedNode.pickupTime_hi ? selectedNode.pickupTime_hi : selectedNode.pickupTime}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    playPop();
                    setNavModalOpen(true);
                  }}
                  className="w-full sm:w-auto border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold cursor-pointer gap-1.5 h-8"
                >
                  <Footprints className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isHi ? "दिशाएं देखें" : "Find Directions"}</span>
                </Button>

                <Button
                  size="sm"
                  variant="hero"
                  onClick={() => {
                    playPop();
                    onBook({
                      service: "stash",
                      note: `Hyperlocal Radar Reserved: ${selectedNode.name} (${selectedNode.campus}, ${selectedNode.distance})`,
                    });
                  }}
                  className="w-full sm:w-auto shrink-0 cursor-pointer text-xs font-bold h-8 group"
                >
                  <span>{isHi ? "यह नोड बुक करें (₹300)" : "Reserve Node @ ₹300"}</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <FindMyStashModal
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        initialNodeId={selectedNode.id}
      />
    </div>
  );
}
