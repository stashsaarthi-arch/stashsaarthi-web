import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Copy,
  Printer,
  Search,
  RotateCcw,
  Check,
  FileBadge,
  Award,
  Lock,
  PlusCircle,
  Building2,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { playPop, playClick } from "@/lib/audio";
import {
  CsoKitchenSealCertificate,
  getAllSealedKitchenNodes,
  sealKitchenNode,
  verifyBarcodeSerial,
  getSealForNode,
} from "@/lib/csoKitchenSealingService";

interface CsoKitchenSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNodeId?: string | undefined;
}

export function CsoKitchenSealModal({ isOpen, onClose, initialNodeId }: CsoKitchenSealModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"sealed_list" | "audit_new" | "verify">("sealed_list");

  // Sealed nodes state
  const [sealedNodes, setSealedNodes] = useState<Record<string, CsoKitchenSealCertificate>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId || "annapurna");
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null);

  // Form state for auditing & sealing a new kitchen node
  const [newKitchenName, setNewKitchenName] = useState<string>("");
  const [newChefName, setNewChefName] = useState<string>("");
  const [newCampus, setNewCampus] = useState<string>("Kakadeo PW & Allen Hub");
  const [checkRoWater, setCheckRoWater] = useState<boolean>(true);
  const [checkFssai, setCheckFssai] = useState<boolean>(true);
  const [checkPolice, setCheckPolice] = useState<boolean>(true);
  const [checkLaserSeal, setCheckLaserSeal] = useState<boolean>(true);
  const [auditNotes, setAuditNotes] = useState<string>("");

  // Audit animation state
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<number>(0);

  // Barcode search query
  const [searchSerial, setSearchSerial] = useState<string>("");
  const [verifyResult, setVerifyResult] = useState<{
    tested: boolean;
    isValid: boolean;
    cert: CsoKitchenSealCertificate | null;
  }>({ tested: false, isValid: false, cert: null });

  useEffect(() => {
    if (isOpen) {
      const nodes = getAllSealedKitchenNodes();
      setSealedNodes(nodes);
      if (initialNodeId && nodes[initialNodeId]) {
        setSelectedNodeId(initialNodeId);
      }
    }
  }, [isOpen, initialNodeId]);

  useEffect(() => {
    const handleUpdate = () => {
      setSealedNodes(getAllSealedKitchenNodes());
    };
    window.addEventListener("stashsaarthi:cso-seal-updated", handleUpdate);
    return () => window.removeEventListener("stashsaarthi:cso-seal-updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const currentCert =
    sealedNodes[selectedNodeId] || Object.values(sealedNodes)[0] || getSealForNode("annapurna");

  const handleCopySerial = (serial: string) => {
    playClick();
    navigator.clipboard.writeText(serial);
    setCopiedSerial(serial);
    setTimeout(() => setCopiedSerial(null), 2500);
  };

  const handlePrintCertificate = () => {
    playClick();
    window.print();
  };

  // Run CSO Audit & Barcode Sealing process for a new kitchen node
  const handleRunAuditAndSeal = () => {
    if (!newKitchenName.trim() || !newChefName.trim()) {
      alert(
        isHi
          ? "कृपया रसोई का नाम और सीनियर शेफ का नाम दर्ज करें।"
          : "Please enter Kitchen Name and Verified PG Owner Chef Name.",
      );
      return;
    }

    playClick();
    setIsAuditing(true);
    setAuditStep(1);

    const t1 = setTimeout(() => setAuditStep(2), 800);
    const t2 = setTimeout(() => setAuditStep(3), 1600);
    const t3 = setTimeout(() => setAuditStep(4), 2400);
    const t4 = setTimeout(() => {
      setAuditStep(5);
      const minted = sealKitchenNode({
        nodeName: newKitchenName.trim(),
        chefName: newChefName.trim(),
        campus: newCampus,
        roWaterAudit: checkRoWater,
        fssaiHygienePass: checkFssai,
        policeClearance: checkPolice,
        laserBarcodeSeal: checkLaserSeal,
        notes: auditNotes.trim() || "Automated CSO Kitchen Audit & Barcode Seal Issued.",
      });

      playPop();
      setIsAuditing(false);
      setSealedNodes(getAllSealedKitchenNodes());
      setSelectedNodeId(minted.nodeId);
      setActiveTab("sealed_list");
      setNewKitchenName("");
      setNewChefName("");
      setAuditNotes("");
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const res = verifyBarcodeSerial(searchSerial);
    setVerifyResult({ tested: true, isValid: res.isValid, cert: res.certificate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-950 p-4 sm:p-6 text-foreground shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/10 pb-4 pr-10">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider"
            >
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              {isHi ? "CSO सुरक्षा व बारकोड सीलिंग ब्यूरो" : "CSO Safety & Barcode Sealing Bureau"}
            </Badge>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-white mt-1">
            {isHi ? (
              <>
                रसोई नोड <span className="text-gradient">ऑडिट एवं बारकोड सील कंसोल</span>
              </>
            ) : (
              <>
                Vetted Kitchen Node <span className="text-gradient">CSO Audit & Barcode Seal</span>
              </>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isHi
              ? "कानपुर की प्रत्येक भोजन रसोई का CSO द्वारा 4-स्तरीय स्वच्छता व सुरक्षा परीक्षण कर डिजिटल लेज़र बारकोड सील जारी की जाती है।"
              : "Formal Chief Security Officer (CSO) review protocol for issuing tamper-evident barcode seals to verified home kitchen nodes."}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-2">
          <button
            onClick={() => {
              playClick();
              setActiveTab("sealed_list");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sealed_list"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <FileBadge className="h-3.5 w-3.5" />
            <span>{isHi ? "सत्यापित एवं सीलबंद रसोई" : "Vetted & Sealed Kitchens"}</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab("audit_new");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "audit_new"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{isHi ? "नई रसोई ऑडिट एवं सील करें" : "Audit & Seal New Kitchen"}</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab("verify");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "verify"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>{isHi ? "बारकोड सील जांचें" : "Verify Barcode Serial"}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: Sealed Kitchen Nodes List & Certificate Viewer */}
          {activeTab === "sealed_list" && (
            <div className="grid gap-6 md:grid-cols-12">
              {/* Left Column: List of Kitchen Nodes */}
              <div className="md:col-span-5 space-y-2.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {isHi ? "सत्यापित कानपुर रसोई नोड्स" : "CSO Audited Kanpur Nodes"}
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {Object.values(sealedNodes).map((node) => {
                    const isSelected = node.nodeId === selectedNodeId;
                    return (
                      <button
                        key={node.sealId}
                        onClick={() => {
                          playClick();
                          setSelectedNodeId(node.nodeId);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {node.nodeName}
                          </span>
                          <Badge
                            className={`text-[9px] font-mono ${
                              node.status === "SEALED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            ✓ {node.status}
                          </Badge>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">👤 {node.chefName}</div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px] font-mono text-emerald-400">
                          <span>{node.sealId}</span>
                          <span>Score: {node.auditScore}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Laser Barcode Certificate Display */}
              <div className="md:col-span-7">
                {currentCert ? (
                  <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-5 relative overflow-hidden shadow-2xl">
                    {/* Official CSO Seal Watermark */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                          STASHSAARTHI CSO OFFICIAL AUDIT PASS
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                          {currentCert.nodeName}
                        </h4>
                        <div className="text-xs text-slate-300">
                          Chef:{" "}
                          <span className="font-semibold text-white">{currentCert.chefName}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-extrabold text-amber-400">
                          {currentCert.sealId}
                        </div>
                        <Badge className="bg-emerald-500 text-black text-[10px] font-bold mt-1">
                          100% CSO APPROVED
                        </Badge>
                      </div>
                    </div>

                    {/* Simulated Laser Barcode Visual */}
                    <div className="my-4 rounded-2xl border border-white/15 bg-black/80 p-4 text-center">
                      <div className="text-[10px] font-mono text-slate-400 mb-1">
                        TAMPER-EVIDENT LASER PACKAGING SEAL
                      </div>
                      <div className="font-mono text-xl sm:text-2xl text-emerald-400 tracking-[0.3em] select-none my-1 font-extrabold">
                        {currentCert.barcodeSequence}
                      </div>
                      <div className="text-xs font-mono text-slate-300 tracking-wider">
                        SERIAL:{" "}
                        <span className="text-emerald-300 font-bold">{currentCert.sealId}</span>
                      </div>
                    </div>

                    {/* 4 Hygiene & Safety Checkpoints Status */}
                    <div className="space-y-2 my-4">
                      <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                        CSO MANDATORY HYGIENE CHECKPOINTS
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>RO Water & Pure Ghee</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>FSSAI Hygiene Standard</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>Police Character Clear</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>Laser Barcode Trained</span>
                        </div>
                      </div>
                    </div>

                    {/* Audit Signature & Authority Footer */}
                    <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <div>
                          Authority:{" "}
                          <span className="text-slate-200">{currentCert.csoSignature}</span>
                        </div>
                        <div>
                          Valid Until:{" "}
                          <span className="text-emerald-400">
                            {new Date(currentCert.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopySerial(currentCert.sealId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                          {copiedSerial === currentCert.sealId ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handlePrintCertificate}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Print Seal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-400 italic">
                    Select a kitchen node to view CSO Audit Seal...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Audit & Seal New Kitchen Node Form */}
          {activeTab === "audit_new" && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-bold text-white">CSO Formal Kitchen Node Inspection</div>
                  <div>
                    {isHi
                      ? "यह फॉर्म CSO द्वारा नई भोजन रसोई का 4-स्तरीय सुरक्षा ऑडिट करने और लेज़र बारकोड सील जारी करने के लिए उपयोग किया जाता है।"
                      : "Fill kitchen details and evaluate all 4 CSO safety checkpoints to mint an official barcode seal."}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? "रसोई नोड का नाम" : "Kitchen Node Title"}
                  </label>
                  <input
                    type="text"
                    value={newKitchenName}
                    onChange={(e) => setNewKitchenName(e.target.value)}
                    placeholder="e.g. Kakadeo Gali #4 - Shanti Rasoi"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? "सीनियर शेफ / होस्ट का नाम" : "Verified PG Owner Chef / Host Name"}
                  </label>
                  <input
                    type="text"
                    value={newChefName}
                    onChange={(e) => setNewChefName(e.target.value)}
                    placeholder="e.g. Pushpa Devi (Verified PG Owner Host)"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? "कैंपस नोड / इलाका" : "Campus Location / Zone"}
                </label>
                <select
                  value={newCampus}
                  onChange={(e) => setNewCampus(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Kakadeo PW & Allen Hub">Kakadeo PW & Allen Hub</option>
                  <option value="CSJMU Kalyanpur Belt">CSJMU Kalyanpur Belt</option>
                  <option value="IIT Kanpur Gate 1 Corridor">IIT Kanpur Gate 1 Corridor</option>
                  <option value="HBTI Nawabganj Campus">HBTI Nawabganj Campus</option>
                </select>
              </div>

              {/* 4 Mandatory CSO Audit Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {isHi
                    ? "CSO अनिवार्य सुरक्षा एवं स्वच्छता जांच (4 बिंदु)"
                    : "Mandatory CSO Safety Checkpoints"}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-slate-200 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={checkRoWater}
                      onChange={(e) => setCheckRoWater(e.target.checked)}
                      className="rounded border-white/20 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>1. RO Filtered Water & Pure Ghee</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-slate-200 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={checkFssai}
                      onChange={(e) => setCheckFssai(e.target.checked)}
                      className="rounded border-white/20 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>2. FSSAI / Home Kitchen Cert</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-slate-200 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={checkPolice}
                      onChange={(e) => setCheckPolice(e.target.checked)}
                      className="rounded border-white/20 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>3. Police Station Clearance Pass</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-slate-200 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={checkLaserSeal}
                      onChange={(e) => setCheckLaserSeal(e.target.checked)}
                      className="rounded border-white/20 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>4. Laser Barcode Packaging Seal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? "CSO ऑडिट टिप्पणियाँ" : "Audit Remarks / Notes"}
                </label>
                <input
                  type="text"
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="e.g. On-site kitchen inspection passed with 100% hygiene score."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleRunAuditAndSeal}
                  disabled={isAuditing}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-extrabold text-black hover:bg-emerald-400 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      <span>
                        {auditStep === 1 && "Auditing RO Water & Hygiene..."}
                        {auditStep === 2 && "Verifying Police Clearance..."}
                        {auditStep === 3 && "Configuring Laser Barcode Seal..."}
                        {auditStep >= 4 && "Minting CSO Certificate..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>
                        {isHi
                          ? "ऑडिट पूर्ण करें एवं बारकोड सील जारी करें 🛡️"
                          : "Run CSO Review & Dispatch Barcode Seal 🛡️"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Verify Barcode Serial */}
          {activeTab === "verify" && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center">
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {isHi ? "बारकोड सील प्रामाणिकता जांचें" : "Verify Barcode Serial Authenticity"}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isHi
                    ? "टिफिन डिब्बे या स्टैश बैग पर मुद्रित सील आईडी (#CSO-SEAL-KNP-XXXX) दर्ज करें।"
                    : "Enter barcode serial ID printed on tiffin box or custody seal tag to verify CSO clearance."}
                </p>
              </div>

              <form onSubmit={handleVerifySerial} className="flex gap-2">
                <input
                  type="text"
                  value={searchSerial}
                  onChange={(e) => setSearchSerial(e.target.value)}
                  placeholder="e.g. #CSO-SEAL-KNP-8921"
                  className="flex-1 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Verify
                </button>
              </form>

              {verifyResult.tested && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border ${
                    verifyResult.isValid
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                      : "border-red-500/40 bg-red-950/30 text-red-300"
                  }`}
                >
                  {verifyResult.isValid && verifyResult.cert ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-white text-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span>Authentic CSO Barcode Seal Verified!</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          Kitchen:{" "}
                          <span className="text-white font-semibold">
                            {verifyResult.cert.nodeName}
                          </span>
                        </div>
                        <div>
                          Chef:{" "}
                          <span className="text-white font-semibold">
                            {verifyResult.cert.chefName}
                          </span>
                        </div>
                        <div>
                          Seal ID:{" "}
                          <span className="font-mono text-emerald-300">
                            {verifyResult.cert.sealId}
                          </span>
                        </div>
                        <div>
                          Status:{" "}
                          <Badge className="bg-emerald-500 text-black text-[9px] font-bold">
                            100% VERIFIED
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 font-bold text-red-300 text-sm">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span>Unrecognized Barcode Serial ID. Please verify spelling.</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
