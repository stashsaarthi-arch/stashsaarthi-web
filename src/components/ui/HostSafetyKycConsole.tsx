import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  CheckSquare,
  Square,
  Award,
  Lock,
  Eye,
  UserCheck,
  Building2,
  Phone,
  MapPin,
  Sparkles,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { getHostSafetyKycTokens } from "@/lib/designTokens";
import {
  playClick,
  playPop,
  playSuccessChime,
  playWarningBeep,
} from "@/lib/audio";


export interface HostKycRecord {
  id: string;
  hostNameEn: string;
  hostNameHi: string;
  phone: string;
  addressEn: string;
  addressHi: string;
  aadhaarNumberMasked: string;
  digiLockerStatus: "VERIFIED" | "PENDING" | "REJECTED";
  policeCertificateId: string;
  policeStation: string;
  policeStatus: "VERIFIED" | "PENDING_REVIEW" | "REJECTED";
  issuanceDate: string;
  checklistCompleted: number;
  checklistTotal: number;
  inspectionScore: string;
  overallStatus: "APPROVED" | "PENDING_REVIEW" | "REJECTED";
  verifiedBadgeTextEn: string;
  verifiedBadgeTextHi: string;
  nodeHub: string;
}

export interface HostSafetyKycConsoleProps {
  initialHosts?: HostKycRecord[];
  onHostStatusChange?: (hostId: string, newStatus: "APPROVED" | "PENDING_REVIEW" | "REJECTED") => void;
  className?: string;
}

export function HostSafetyKycConsole({
  initialHosts,
  onHostStatusChange,
  className = "",
}: HostSafetyKycConsoleProps) {
  const { role } = usePersona();
  const tokens = useMemo(() => getHostSafetyKycTokens(role), [role]);
  const isHostPersona = role === "host";


  const [hosts, setHosts] = useState<HostKycRecord[]>(() => {
    return initialHosts && initialHosts.length > 0
      ? initialHosts
      : (tokens.sampleHostRecords as unknown as HostKycRecord[]);
  });

  const [selectedHostId, setSelectedHostId] = useState<string>(
    hosts[0]?.id || "host-kyc-101"
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState<boolean>(false);
  const [checkedItemsMap, setCheckedItemsMap] = useState<Record<string, boolean>>({
    c1: true, c2: true, c3: true, c4: true, c5: true, c6: true,
    c7: true, c8: true, c9: true, c10: true, c11: true, c12: true,
  });

  const selectedHost = useMemo(() => {
    return hosts.find((h) => h.id === selectedHostId) || hosts[0];
  }, [hosts, selectedHostId]);

  const filteredHosts = useMemo(() => {
    return hosts.filter((h) => {
      const matchesSearch =
        h.hostNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.hostNameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.policeCertificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.nodeHub.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "ALL" || h.overallStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [hosts, searchQuery, filterStatus]);

  const handleToggleChecklistItem = (itemId: string) => {
    playPop();
    setCheckedItemsMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleUpdateStatus = (
    hostId: string,
    newStatus: "APPROVED" | "PENDING_REVIEW" | "REJECTED"
  ) => {
    if (newStatus === "APPROVED") {
      playSuccessChime();
    } else if (newStatus === "REJECTED") {
      playWarningBeep();
    } else {
      playClick();
    }

    setHosts((prev) =>
      prev.map((h) =>
        h.id === hostId
          ? {
              ...h,
              overallStatus: newStatus,
              verifiedBadgeTextEn:
                newStatus === "APPROVED"
                  ? "CSO Verified Host Vault"
                  : newStatus === "REJECTED"
                  ? "Verification Rejected"
                  : "Inspection Pending",
              verifiedBadgeTextHi:
                newStatus === "APPROVED"
                  ? "सीएसओ सत्यापित होस्ट वॉल्ट"
                  : newStatus === "REJECTED"
                  ? "सत्यापन अस्वीकृत"
                  : "सत्यापन लंबित",
            }
          : h
      )
    );

    if (onHostStatusChange) {
      onHostStatusChange(hostId, newStatus);
    }
  };

  const checkedCount = useMemo(() => {
    return Object.values(checkedItemsMap).filter(Boolean).length;
  }, [checkedItemsMap]);

  return (
    <div
      className={`host-kyc-console-container p-5 sm:p-7 space-y-6 ${className}`}
      data-role={role}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                {tokens.header.titleEn}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  CSO Inspection
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {tokens.header.subtitleEn}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search host, Thana, ID..."
              className="h-9 pl-9 pr-3 w-40 sm:w-56 text-xs rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            {(["ALL", "APPROVED", "PENDING_REVIEW"] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  playClick();
                  setFilterStatus(st);
                }}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === st
                    ? "bg-amber-500/25 border border-amber-500/40 text-amber-300 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st === "ALL"
                  ? "All"
                  : st === "APPROVED"
                  ? "Verified"
                  : "Pending"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Host Selector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between px-1">
            <span>Verified Hosts ({filteredHosts.length})</span>
            <span className="text-[10px] text-amber-400 font-mono">100% Aadhaar Encrypted</span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredHosts.map((host) => {
              const isSelected = host.id === selectedHostId;
              return (
                <button
                  key={host.id}
                  onClick={() => {
                    playClick();
                    setSelectedHostId(host.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500/40 text-foreground shadow-lg shadow-amber-500/5"
                      : "bg-white/[0.02] border-white/10 text-muted-foreground hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-amber-400" />
                      {host.hostNameEn}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        host.overallStatus === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : host.overallStatus === "PENDING_REVIEW"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {host.overallStatus}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0 text-amber-400/70" />
                      <span className="truncate">{host.nodeHub}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                      <span className="text-cyan-400">Aadhaar: {host.aadhaarNumberMasked}</span>
                      <span className="text-emerald-400 font-bold">12-Pt: {host.checklistCompleted}/12</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Inspection Details Panel (8 Cols) */}
        {selectedHost && (
          <div className="lg:col-span-8 space-y-6 bg-white/[0.015] border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
            {/* Host Identity Badge & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedHost.hostNameEn}
                  </h3>
                  <span className="aadhaar-verified-badge">
                    <ShieldCheck className="h-3 w-3 text-cyan-400" />
                    DigiLocker Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <span>{selectedHost.addressEn}</span>
                  <span>•</span>
                  <span className="text-amber-400">{selectedHost.phone}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedHost.id, "APPROVED")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Vault
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedHost.id, "PENDING_REVIEW")}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
                >
                  <Clock className="h-4 w-4" />
                  Hold Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedHost.id, "REJECTED")}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/30 transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>

            {/* Document Inspection Cards: Aadhaar & Police Clearance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aadhaar Identity Card */}
              <div className="kyc-document-preview-stage space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    UIDAI Aadhaar Verification
                  </span>
                  <span className="text-[10px] bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono px-2 py-0.5 rounded-full">
                    DigiLocker XML Sealed
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Masked Aadhaar UID:</span>
                    <span className="font-mono text-foreground font-bold">
                      {selectedHost.aadhaarNumberMasked}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>DigiLocker e-Kyc Hash:</span>
                    <span className="font-mono text-emerald-400 text-[11px]">
                      0x8f2a...9c41 (Verified)
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>UIDAI Stamp Date:</span>
                    <span className="font-mono text-foreground">
                      2026-01-10
                    </span>
                  </div>
                </div>
              </div>

              {/* Police Clearance Certificate */}
              <div className="kyc-document-preview-stage space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    UP Police Verification Seal
                  </span>
                  <span className="police-verification-seal-badge">
                    UP Police Certified
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Cert Certificate ID:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {selectedHost.policeCertificateId}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Issuing Thana:</span>
                    <span className="font-mono text-foreground">
                      {selectedHost.policeStation}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Issuance Date:</span>
                    <span className="font-mono text-foreground">
                      {selectedHost.issuanceDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 12-Point Safety Audit Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">
                    12-Point Vault Safety Checklist ({checkedCount}/12 Passed)
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Score: {Math.round((checkedCount / 12) * 100)}%
                </span>
              </div>

              <div className="checklist-12point-grid">
                {tokens.checklist12Points.map((item) => {
                  const isChecked = Boolean(checkedItemsMap[item.id]);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className={`checklist-item-row cursor-pointer ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500/30 text-foreground"
                          : "bg-white/[0.02] border-white/10 text-muted-foreground opacity-60"
                      }`}
                    >
                      <button className="mt-0.5 text-amber-400 focus:outline-none">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="text-xs space-y-0.5">
                        <div className="font-semibold text-foreground leading-snug">
                          {item.labelEn}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
