import React, { useState, useEffect, useMemo } from "react";
import {
  Boxes,
  Layers,
  Sparkles,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Home,
  IndianRupee,
  Maximize2,
  Minimize2,
  Grid,
  Eye,
  Sliders,
  Plus,
  Minus,
  X,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { playClick, playPop } from "@/lib/audio";

// ─── Slot Types & Interfaces ──────────────────────────────────────────────────
export type SlotState = "available" | "occupied" | "reserved";

export interface BoxSlot {
  id: string; // e.g. "A1", "A2", "B1"
  row: number;
  col: number;
  state: SlotState;
  boxCount: number; // 0..3 standard 40L boxes stacked
  maxCapacity: number; // default 3
  studentName?: string | undefined;
  bookingRef?: string | undefined;
  label?: string | undefined;
}

export interface RoomPreset {
  id: string;
  name: string;
  locality: string;
  rows: number;
  cols: number;
  maxStackPerSlot: number;
  description: string;
}

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: "kakadeo-hub",
    name: "Kakadeo Hub Host Suite",
    locality: "Kakadeo Coaching Belt",
    rows: 4,
    cols: 5,
    maxStackPerSlot: 3,
    description:
      "Standard 10x12 sq.ft host spare room optimized for student summer luggage storage.",
  },
  {
    id: "iitk-nankari",
    name: "IITK Nankari Studio",
    locality: "Nankari Gate 1, IIT Kanpur",
    rows: 3,
    cols: 4,
    maxStackPerSlot: 2,
    description:
      "Compact verified PG owner host lounge designed for quick vacation luggage drop-offs.",
  },
  {
    id: "csjmu-kalyanpur",
    name: "CSJMU Kalyanpur Warehouse",
    locality: "Kalyanpur Main Road",
    rows: 5,
    cols: 6,
    maxStackPerSlot: 3,
    description: "Spacious ground-floor host hall supporting up to 90 standard luggage boxes.",
  },
];

const LOCAL_STORAGE_KEY = "ss_host_inventory_grid_v1";
const HOST_PAYOUT_PER_BOX = 180; // Kanpur Host gets ₹180 out of ₹300/bag/mo

function generateDefaultGrid(preset: RoomPreset): BoxSlot[] {
  const slots: BoxSlot[] = [];
  const rowLabels = ["A", "B", "C", "D", "E", "F"];

  for (let r = 0; r < preset.rows; r++) {
    for (let c = 0; c < preset.cols; c++) {
      const slotId = `${rowLabels[r] || "R"}${c + 1}`;
      // Simulate realistic initial occupancy for demonstration
      const isOccupied = (r + c) % 3 === 0;
      const isReserved = !isOccupied && (r + c) % 5 === 1;

      const state: SlotState = isOccupied ? "occupied" : isReserved ? "reserved" : "available";
      const boxCount = isOccupied ? Math.floor(Math.random() * 2) + 1 : isReserved ? 1 : 0;

      slots.push({
        id: slotId,
        row: r,
        col: c,
        state,
        boxCount,
        maxCapacity: preset.maxStackPerSlot,
        studentName: isOccupied ? `Student #${101 + r * 5 + c}` : undefined,
        bookingRef: isOccupied ? `STASH-KNP-${202600 + r * 10 + c}` : undefined,
        label: `Slot ${slotId}`,
      });
    }
  }
  return slots;
}

// ─── Main Host Inventory Grid Component ──────────────────────────────────────
export function HostInventoryGrid({
  onClose,
  isModal = false,
}: {
  onClose?: () => void;
  isModal?: boolean;
}) {
  const [selectedPreset, setSelectedPreset] = useState<RoomPreset>(ROOM_PRESETS[0]!);
  const [slots, setSlots] = useState<BoxSlot[]>(() => generateDefaultGrid(ROOM_PRESETS[0]!));
  const [viewMode, setViewMode] = useState<"3d" | "2d" | "list">("3d");
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<"all" | SlotState>("all");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Load saved grid state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slots && Array.isArray(parsed.slots)) {
          setSlots(parsed.slots);
        }
        if (parsed.presetId) {
          const found = ROOM_PRESETS.find((p) => p.id === parsed.presetId);
          if (found) setSelectedPreset(found);
        }
      }
    } catch {
      // fallback to initial state
    }
  }, []);

  // Save state helper
  const handleSaveGrid = () => {
    playPop();
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          presetId: selectedPreset.id,
          slots,
          updatedAt: new Date().toISOString(),
        }),
      );
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    } catch (e) {
      console.error("Failed to save host grid:", e);
    }
  };

  // Change preset room
  const handleSelectPreset = (preset: RoomPreset) => {
    playClick();
    setSelectedPreset(preset);
    const newGrid = generateDefaultGrid(preset);
    setSlots(newGrid);
    setActiveSlotId(null);
  };

  // Reset grid
  const handleResetGrid = () => {
    playPop();
    const newGrid = generateDefaultGrid(selectedPreset);
    setSlots(newGrid);
    setActiveSlotId(null);
  };

  // Toggle slot state (Available -> Occupied -> Reserved -> Available)
  const handleCycleSlotState = (slotId: string) => {
    playClick();
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;

        let nextState: SlotState = "available";
        let nextCount = 0;

        if (slot.state === "available") {
          nextState = "occupied";
          nextCount = 1;
        } else if (slot.state === "occupied") {
          if (slot.boxCount < slot.maxCapacity) {
            nextState = "occupied";
            nextCount = slot.boxCount + 1;
          } else {
            nextState = "reserved";
            nextCount = 1;
          }
        } else if (slot.state === "reserved") {
          nextState = "available";
          nextCount = 0;
        }

        return {
          ...slot,
          state: nextState,
          boxCount: nextCount,
          studentName:
            nextState === "occupied" ? slot.studentName || "Verified Student" : undefined,
          bookingRef:
            nextState === "occupied"
              ? slot.bookingRef || `STASH-${Date.now().toString().slice(-6)}`
              : undefined,
        };
      }),
    );
  };

  // Adjust box count manually
  const handleSetBoxCount = (slotId: string, count: number) => {
    playClick();
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;
        const targetCount = Math.max(0, Math.min(slot.maxCapacity, count));
        const nextState: SlotState = targetCount === 0 ? "available" : "occupied";

        return {
          ...slot,
          state: nextState,
          boxCount: targetCount,
          studentName:
            nextState === "occupied" ? slot.studentName || "Verified Student" : undefined,
        };
      }),
    );
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    let totalBoxesStored = 0;
    let occupiedSlotsCount = 0;
    let availableSlotsCount = 0;
    let reservedSlotsCount = 0;
    const maxBoxesCapacity = slots.reduce((acc, s) => acc + s.maxCapacity, 0);

    slots.forEach((s) => {
      totalBoxesStored += s.boxCount;
      if (s.state === "occupied") occupiedSlotsCount++;
      else if (s.state === "available") availableSlotsCount++;
      else if (s.state === "reserved") reservedSlotsCount++;
    });

    const currentMonthlyIncome = totalBoxesStored * HOST_PAYOUT_PER_BOX;
    const potentialMonthlyIncome = maxBoxesCapacity * HOST_PAYOUT_PER_BOX;
    const occupancyRate =
      maxBoxesCapacity > 0 ? Math.round((totalBoxesStored / maxBoxesCapacity) * 100) : 0;

    return {
      totalSlots: slots.length,
      totalBoxesStored,
      maxBoxesCapacity,
      occupiedSlotsCount,
      availableSlotsCount,
      reservedSlotsCount,
      currentMonthlyIncome,
      potentialMonthlyIncome,
      occupancyRate,
    };
  }, [slots]);

  // Active slot object
  const activeSlot = useMemo(() => {
    return slots.find((s) => s.id === activeSlotId) || null;
  }, [slots, activeSlotId]);

  // Filtered slots for listing view
  const filteredSlots = useMemo(() => {
    if (filterState === "all") return slots;
    return slots.filter((s) => s.state === filterState);
  }, [slots, filterState]);

  return (
    <div
      className={`w-full bg-[#0A0D0F] text-foreground rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all ${
        isModal ? "p-4 sm:p-6" : "p-4 sm:p-6"
      }`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Boxes className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Isometric Host Inventory Grid
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                Host Portal
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Visual 3D room capacity manager & real-time box allocation tool
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset room picker */}
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = ROOM_PRESETS.find((item) => item.id === e.target.value);
              if (p) handleSelectPreset(p);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/40 cursor-pointer"
          >
            {ROOM_PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0A0D0F] text-foreground">
                {p.name} ({p.rows * p.cols * p.maxStackPerSlot} Boxes)
              </option>
            ))}
          </select>

          {/* Quick Actions */}
          <button
            onClick={handleSaveGrid}
            className="h-8 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Save grid state to localStorage"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={handleResetGrid}
            className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Grid"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Saved Toast Alert ── */}
      {isSavedToast && (
        <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-400 animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4" /> Grid capacity configuration saved locally!
          </span>
          <span className="text-[10px] font-mono opacity-80">IndexedDB / LocalStorage Sync</span>
        </div>
      )}

      {/* ── Metrics Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Card 1: Total Box Capacity */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 relative overflow-hidden">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-emerald-400" /> Storage Capacity
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {metrics.totalBoxesStored}{" "}
            <span className="text-xs text-muted-foreground font-normal">
              / {metrics.maxBoxesCapacity} Boxes
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${metrics.occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Slot Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Grid className="h-3 w-3 text-cyan-400" /> Slot Breakdown
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="text-xs">
              <span className="text-emerald-400 font-bold">{metrics.availableSlotsCount}</span> Free
            </div>
            <div className="text-xs">
              <span className="text-amber-400 font-bold">{metrics.occupiedSlotsCount}</span> Stashed
            </div>
            <div className="text-xs">
              <span className="text-violet-400 font-bold">{metrics.reservedSlotsCount}</span> Hold
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5">{selectedPreset.name}</div>
        </div>

        {/* Card 3: Monthly Host Income */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-amber-400" /> Active Monthly Income
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">
            ₹{metrics.currentMonthlyIncome.toLocaleString("en-IN")}
            <span className="text-xs text-amber-300/70 font-normal"> /mo</span>
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1">
            @ ₹{HOST_PAYOUT_PER_BOX}/box (60% Host Net Share)
          </div>
        </div>

        {/* Card 4: Potential Max Income */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400" /> Max Revenue Potential
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">
            ₹{metrics.potentialMonthlyIncome.toLocaleString("en-IN")}
            <span className="text-xs text-emerald-300/70 font-normal"> /mo</span>
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-1">
            {metrics.occupancyRate}% Room Utilization
          </div>
        </div>
      </div>

      {/* ── View Controls Bar ── */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white/5 border border-white/10 rounded-2xl p-2 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              playClick();
              setViewMode("3d");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "3d"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> 3D Isometric View
          </button>
          <button
            onClick={() => {
              playClick();
              setViewMode("2d");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "2d"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Grid className="h-3.5 w-3.5" /> 2D Floor Grid
          </button>
          <button
            onClick={() => {
              playClick();
              setViewMode("list");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "list"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Slot Ledger
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground text-[10px] uppercase font-bold mr-1 hidden sm:inline">
            Filter:
          </span>
          <button
            onClick={() => setFilterState("all")}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              filterState === "all"
                ? "bg-white/20 text-foreground"
                : "bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({slots.length})
          </button>
          <button
            onClick={() => setFilterState("available")}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              filterState === "available"
                ? "bg-emerald-500/30 text-emerald-300"
                : "bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            Free ({metrics.availableSlotsCount})
          </button>
          <button
            onClick={() => setFilterState("occupied")}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              filterState === "occupied"
                ? "bg-amber-500/30 text-amber-300"
                : "bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            Stashed ({metrics.occupiedSlotsCount})
          </button>
        </div>
      </div>

      {/* ── Main View Area ── */}
      {viewMode === "3d" && (
        <div className="relative w-full rounded-2xl bg-[#07090B] border border-white/10 p-6 sm:p-10 flex flex-col items-center justify-center overflow-x-auto min-h-[360px]">
          {/* Legend Banner */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-3 text-[10px] text-muted-foreground bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md z-10">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 border border-emerald-300 inline-block" />{" "}
              Free
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500 border border-amber-300 inline-block" />{" "}
              Stashed Box
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-violet-500 border border-violet-300 inline-block" />{" "}
              Reserved
            </span>
          </div>

          <div className="text-[10px] text-muted-foreground/60 absolute bottom-3 right-3 hidden sm:block font-mono">
            Click slot to toggle box stack count (0➔1➔2➔3)
          </div>

          {/* 3D Isometric Container */}
          <div
            className="my-6 transition-transform duration-500 hover:scale-[1.02]"
            style={{
              transform: "rotateX(52deg) rotateZ(-38deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="grid gap-3.5 p-4 rounded-3xl border-2 border-white/15 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              style={{
                gridTemplateColumns: `repeat(${selectedPreset.cols}, minmax(48px, 1fr))`,
              }}
            >
              {slots.map((slot) => {
                const isActive = slot.id === activeSlotId;
                const isFilteredOut = filterState !== "all" && slot.state !== filterState;

                // Dynamic CSS colors based on state
                const isOccupied = slot.state === "occupied";
                const isReserved = slot.state === "reserved";

                const topBg = isOccupied
                  ? "bg-gradient-to-br from-amber-400 to-amber-600"
                  : isReserved
                    ? "bg-gradient-to-br from-violet-400 to-violet-600"
                    : "bg-gradient-to-br from-emerald-500/30 to-emerald-700/20";

                const borderCol = isOccupied
                  ? "border-amber-300/80"
                  : isReserved
                    ? "border-violet-300/80"
                    : "border-emerald-500/40";

                const heightPx = slot.boxCount * 22 + 20;

                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setActiveSlotId(slot.id);
                      handleCycleSlotState(slot.id);
                    }}
                    className={`relative rounded-xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-2 group ${borderCol} ${
                      isFilteredOut ? "opacity-25" : "opacity-100"
                    } ${isActive ? "ring-2 ring-amber-400 scale-105" : "hover:scale-105"}`}
                    style={{
                      minHeight: "56px",
                      minWidth: "52px",
                      transformStyle: "preserve-3d",
                      boxShadow: isOccupied
                        ? "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
                        : "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                  >
                    {/* Isometric Top Surface */}
                    <div
                      className={`absolute inset-0 rounded-xl ${topBg} border ${borderCol} flex items-center justify-center text-center`}
                    >
                      <div className="text-[10px] font-bold tracking-wider text-white drop-shadow-md">
                        {slot.id}
                      </div>

                      {/* Box Stack Indicator */}
                      {slot.boxCount > 0 && (
                        <div className="absolute -top-2.5 right-0 bg-black/80 border border-white/20 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                          x{slot.boxCount}
                        </div>
                      )}
                    </div>

                    {/* 3D Stack Elevation simulation */}
                    {slot.boxCount > 0 && (
                      <div
                        className="absolute bottom-0 inset-x-0 bg-amber-700/80 rounded-b-xl border-t border-amber-400/40 pointer-events-none"
                        style={{
                          height: `${heightPx}px`,
                          transform: "translateZ(12px)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 2D Floor Plan Grid Mode ── */}
      {viewMode === "2d" && (
        <div className="rounded-2xl bg-[#07090B] border border-white/10 p-4 sm:p-6 mb-4">
          <div className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
            <span>
              2D Layout Matrix ({selectedPreset.rows} Rows × {selectedPreset.cols} Columns)
            </span>
            <span className="text-[10px] font-mono text-amber-400">
              Click any cell to update capacity
            </span>
          </div>

          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${selectedPreset.cols}, minmax(0, 1fr))`,
            }}
          >
            {slots.map((slot) => {
              const isOccupied = slot.state === "occupied";
              const isReserved = slot.state === "reserved";

              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    setActiveSlotId(slot.id);
                    handleCycleSlotState(slot.id);
                  }}
                  className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                    isOccupied
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
                      : isReserved
                        ? "bg-violet-500/10 border-violet-500/40 text-violet-300 hover:bg-violet-500/20"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{slot.id}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40">
                      {slot.state}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {slot.boxCount > 0
                      ? `${slot.boxCount} Box${slot.boxCount > 1 ? "es" : ""}`
                      : "Empty"}
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5 truncate">
                    {slot.studentName || "Tap to allocate"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Slot Ledger List View ── */}
      {viewMode === "list" && (
        <div className="rounded-2xl bg-[#07090B] border border-white/10 overflow-hidden mb-4">
          <div className="p-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-muted-foreground grid grid-cols-12 gap-2">
            <div className="col-span-2">Slot ID</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Box Stack Count</div>
            <div className="col-span-4 text-right">Actions / Controls</div>
          </div>

          <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
            {filteredSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-3 text-xs grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-2 font-bold text-foreground font-mono">{slot.id}</div>
                <div className="col-span-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      slot.state === "occupied"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : slot.state === "reserved"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {slot.state}
                  </span>
                </div>
                <div className="col-span-3 font-medium text-foreground">
                  {slot.boxCount} / {slot.maxCapacity} Boxes
                </div>
                <div className="col-span-4 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleSetBoxCount(slot.id, slot.boxCount - 1)}
                    className="h-6 w-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                    title="Decrease count"
                  >
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <span className="font-mono text-xs w-4 text-center">{slot.boxCount}</span>
                  <button
                    onClick={() => handleSetBoxCount(slot.id, slot.boxCount + 1)}
                    className="h-6 w-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                    title="Increase count"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Slot Inspector Drawer ── */}
      {activeSlot && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-bold text-sm text-amber-300">
                Slot {activeSlot.id} Details & Inspector
              </h3>
            </div>
            <button
              onClick={() => setActiveSlotId(null)}
              className="text-xs text-amber-300/70 hover:text-amber-300"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div className="bg-black/30 rounded-xl p-2.5 border border-amber-500/20">
              <div className="text-[10px] text-amber-300/70">Current State</div>
              <div className="font-bold text-amber-300 uppercase">{activeSlot.state}</div>
            </div>
            <div className="bg-black/30 rounded-xl p-2.5 border border-amber-500/20">
              <div className="text-[10px] text-amber-300/70">Box Stack</div>
              <div className="font-bold text-amber-300">
                {activeSlot.boxCount} / {activeSlot.maxCapacity} Boxes
              </div>
            </div>
            <div className="bg-black/30 rounded-xl p-2.5 border border-amber-500/20">
              <div className="text-[10px] text-amber-300/70">Allocated Student</div>
              <div className="font-bold text-amber-300 truncate">
                {activeSlot.studentName || "None"}
              </div>
            </div>
            <div className="bg-black/30 rounded-xl p-2.5 border border-amber-500/20">
              <div className="text-[10px] text-amber-300/70">Est. Host Payout</div>
              <div className="font-bold text-emerald-400">
                ₹{activeSlot.boxCount * HOST_PAYOUT_PER_BOX}/mo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCycleSlotState(activeSlot.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Cycle State ({activeSlot.state})
            </button>
            <button
              onClick={() => handleSetBoxCount(activeSlot.id, 0)}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition-colors"
            >
              Clear Slot
            </button>
          </div>
        </div>
      )}

      {/* ── Footer Charter ── */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-muted-foreground flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Verified Kanpur Host Unit Economics: ₹180 Host Payout per 40L standard box/mo</span>
        </div>
        <div className="font-mono text-[10px] opacity-70">StashSaarthi Host Engine v2.4</div>
      </div>
    </div>
  );
}

// ─── Modal Wrapper Component ──────────────────────────────────────────────────
export function HostInventoryGridModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <HostInventoryGrid onClose={onClose} isModal />
      </div>
    </div>
  );
}
