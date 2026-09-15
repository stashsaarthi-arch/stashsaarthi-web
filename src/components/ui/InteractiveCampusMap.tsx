import React, { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { getCampusMapLayerTokens } from "@/lib/designTokens";
import {
  MapPin,
  Navigation,
  Compass,
  ShieldCheck,
  Building2,
  Utensils,
  Footprints,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  ChevronRight,
  PhoneCall,
  ExternalLink,
  Sparkles,
  Info,
  X,
  Lock,
} from "lucide-react";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";

export interface CampusMapNode {
  id: string;
  titleEn: string;
  titleHi: string;
  category: "hosts" | "coaching" | "routes" | "kitchens" | string;
  campusId: string;
  coords: { x: number; y: number };
  rating: number;
  capacityPct: number;
  priceMonthly: number;
  hostName: string;
  verifiedSeal: boolean;
  addressEn: string;
  addressHi: string;
  distanceEn: string;
  distanceHi: string;
  badgeEn?: string;
  badgeHi?: string;
  phone?: string;
  image?: string;
}

export interface WalkingRouteSpec {
  id: string;
  nameEn: string;
  nameHi: string;
  startNodeId: string;
  endNodeId: string;
  pathCoords: ReadonlyArray<{ readonly x: number; readonly y: number }>;
  distanceMeters: number;
  walkTimeMins: number;
  safetyScore: string;
  lightingEn: string;
  lightingHi: string;
}

export interface InteractiveCampusMapProps {
  onSelectNodeForBooking?: (node: CampusMapNode) => void;
  className?: string;
  lang?: "en" | "hi";
}

export const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({
  onSelectNodeForBooking,
  className = "",
  lang = "en",
}) => {
  const { role } = usePersona();
  const persona = role || "student";
  const isHost = persona === "host";
  const tokens = getCampusMapLayerTokens(persona);

  const [activeCampusId, setActiveCampusId] = useState<string>("kakadeo");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<CampusMapNode | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<WalkingRouteSpec | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewOffset, setViewOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter nodes based on active campus preset, category, and search text
  const filteredNodes = tokens.nodes.filter((node) => {
    const matchesCampus = node.campusId === activeCampusId || activeCampusId === "all";
    const matchesCategory = activeCategory === "all" || node.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      node.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.titleHi.includes(searchQuery) ||
      node.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCampus && matchesCategory && matchesSearch;
  });

  // Filter walking routes
  const filteredRoutes = tokens.walkingRoutes.filter((route) => {
    return activeCategory === "all" || activeCategory === "routes";
  });

  const handleZoomIn = () => {
    playClick();
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    playClick();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetView = () => {
    playClick();
    setZoomLevel(1);
    setViewOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedRoute(null);
  };

  const handleNodeClick = (node: CampusMapNode) => {
    playPop();
    setSelectedNode(node);
    setSelectedRoute(null);
  };

  const handleRouteClick = (route: WalkingRouteSpec) => {
    playPop();
    setSelectedRoute(route);
    setSelectedNode(null);
  };

  const handleBookNode = (node: CampusMapNode) => {
    playSuccessChime();
    if (onSelectNodeForBooking) {
      onSelectNodeForBooking(node);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hosts":
        return <ShieldCheck className="w-4 h-4" />;
      case "coaching":
        return <Building2 className="w-4 h-4" />;
      case "kitchens":
        return <Utensils className="w-4 h-4" />;
      case "routes":
        return <Footprints className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const isHindi = lang === "hi";

  return (
    <div
      className={`campus-map-container p-6 transition-all duration-300 ${className}`}
      data-role={persona}
    >
      {/* Header & Telemetry Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
            <span>{isHindi ? tokens.header.telemetryBadgeHi : tokens.header.telemetryBadgeEn}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {isHindi ? tokens.header.titleHi : tokens.header.titleEn}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isHindi ? tokens.header.subtitleHi : tokens.header.subtitleEn}
          </p>
        </div>

        {/* Live Search & Reset Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "खोजें वॉल्ट या कोचिंग हब..." : "Search vault or coaching hub..."}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            onClick={handleResetView}
            title={isHindi ? "व्यू रीसेट करें" : "Reset View"}
            className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Campus Hub Preset Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {tokens.campusPresets.map((preset) => {
          const isActive = activeCampusId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                playClick();
                setActiveCampusId(preset.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? isHost
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/20"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isHindi ? preset.nameHi : preset.nameEn}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/60 text-slate-400 border border-slate-800/80">
                {isHindi ? preset.tagHi : preset.tagEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Layer Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {tokens.layerFilters.map((filter) => {
          const isActive = activeCategory === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => {
                playClick();
                setActiveCategory(filter.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-800 text-white border border-slate-600 font-semibold"
                  : "bg-slate-950/60 text-slate-400 border border-slate-900 hover:text-slate-300"
              }`}
            >
              {getCategoryIcon(filter.id)}
              <span>{isHindi ? filter.labelHi : filter.labelEn}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-slate-400">
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Vector Map Stage */}
      <div className="campus-map-canvas-stage relative">
        {/* Floating Map Zoom Controls */}
        <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2.5 bg-slate-950/90 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 rounded-xl shadow-lg transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 bg-slate-950/90 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 rounded-xl shadow-lg transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Map Center Coordinate Indicator */}
        <div className="absolute left-4 top-4 z-30 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {isHindi ? "कानपुर नोड क्लस्टर" : "Kanpur Radar Hub"} • {(zoomLevel * 100).toFixed(0)}%
          </span>
        </div>

        {/* Zoom & Pan Wrapper */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${viewOffset.x}px, ${viewOffset.y}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Animated Safe Walking Routes SVG Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {filteredRoutes.map((route) => {
              const points = route.pathCoords.map((c) => `${c.x}%,${c.y}%`).join(" ");
              const isSelected = selectedRoute?.id === route.id;
              return (
                <g key={route.id} className="pointer-events-auto cursor-pointer" onClick={() => handleRouteClick(route)}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={isSelected ? "#06B6D4" : isHost ? "#F59E0B" : "#10B981"}
                    strokeWidth={isSelected ? "5" : "3"}
                    strokeDasharray="6 6"
                    className="map-walking-route-line"
                    opacity={isSelected ? "1" : "0.7"}
                  />
                  {/* Midpoint tag pill */}
                  {(() => {
                    const firstCoord = route.pathCoords[0];
                    const lastCoord = route.pathCoords[route.pathCoords.length - 1];
                    if (!firstCoord || !lastCoord) return null;
                    return (
                      <foreignObject
                        x={`${(firstCoord.x + lastCoord.x) / 2 - 8}%`}
                        y={`${(firstCoord.y + lastCoord.y) / 2 - 3}%`}
                        width="100"
                        height="30"
                      >
                        <div className="bg-slate-950/90 text-[10px] text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 text-center shadow-md font-semibold whitespace-nowrap">
                          🐾 {route.distanceMeters}m ({route.walkTimeMins}m)
                        </div>
                      </foreignObject>
                    );
                  })()}
                </g>
              );
            })}
          </svg>

          {/* Interactive Map Nodes (Host Vaults & Coaching Hub Pins) */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHostNode = node.category === "hosts";
            const isCoachingNode = node.category === "coaching";
            const isKitchenNode = node.category === "kitchens";

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="map-node-marker group"
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
              >
                {/* Pulsing Aura Ring */}
                <div
                  className={`absolute -inset-3 rounded-full pointer-events-none ${
                    isSelected ? "map-pulse-ring-active" : ""
                  }`}
                  style={{
                    backgroundColor: isHostNode
                      ? "rgba(16, 185, 129, 0.25)"
                      : isCoachingNode
                      ? "rgba(59, 130, 246, 0.25)"
                      : "rgba(236, 72, 153, 0.25)",
                  }}
                />

                {/* Node Pin Badge Button */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl transition-all ${
                    isHostNode
                      ? "map-marker-pin-host"
                      : isCoachingNode
                      ? "map-marker-pin-coaching"
                      : "map-marker-pin-kitchen"
                  } ${isSelected ? "ring-2 ring-white scale-110" : ""}`}
                >
                  {getCategoryIcon(node.category)}
                  <span className="truncate max-w-[110px] hidden sm:inline">
                    {isHindi ? node.titleHi : node.titleEn}
                  </span>
                  {node.priceMonthly > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/80 text-white border border-white/20">
                      ₹{node.priceMonthly}/mo
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Drawer / Popup Modal */}
        {selectedNode && (
          <div className="absolute left-4 right-4 bottom-4 z-40 map-drawer-popup-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {selectedNode.image && (
                  <img
                    src={selectedNode.image}
                    alt={selectedNode.titleEn}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 hidden sm:block"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedNode.badgeEn || "Verified Vault Node"}
                    </span>
                    {selectedNode.verifiedSeal && (
                      <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isHindi ? "आधार व लेजर सील्ड" : "Aadhaar & Laser Sealed"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {isHindi ? selectedNode.titleHi : selectedNode.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isHindi ? selectedNode.addressHi : selectedNode.addressEn}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="text-amber-400 font-bold">★ {selectedNode.rating}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{isHindi ? selectedNode.distanceHi : selectedNode.distanceEn}</span>
                    <span>•</span>
                    <span className="text-slate-300">
                      {isHindi ? "क्षमता भरपाई:" : "Locker Fill:"} {selectedNode.capacityPct}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedNode.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedNode.addressEn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isHindi ? "गूगल मैप्स दिशाएँ" : "Google Maps"}</span>
                </a>

                {selectedNode.priceMonthly > 0 && (
                  <button
                    onClick={() => handleBookNode(selectedNode)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isHindi ? `बुक वॉल्ट (₹${selectedNode.priceMonthly}/माह)` : `Book Storage @ ₹${selectedNode.priceMonthly}/mo`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected Walking Route Details Drawer */}
        {selectedRoute && (
          <div className="absolute left-4 right-4 bottom-4 z-40 map-drawer-popup-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  🐾 Safe 24/7 Walking Route
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {isHindi ? selectedRoute.nameHi : selectedRoute.nameEn}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {isHindi ? selectedRoute.lightingHi : selectedRoute.lightingEn}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                  <span className="text-emerald-400 font-bold">📏 {selectedRoute.distanceMeters}m</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-bold">⏱️ {selectedRoute.walkTimeMins} min walk</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">🛡️ Safety: {selectedRoute.safetyScore}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveCampusMap;
