import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  ShieldCheck,
  QrCode,
  Send,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileText,
  UserCheck,
  Share2,
  Clock,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  ProxyHandoverRecord,
  ProxyDelegationPayload,
  getProxyHandoverRecords,
  createProxyDelegation,
  verifyAndCompleteProxyHandover,
  getProxyWhatsAppShareUrl,
  cancelProxyDelegation,
} from "../../lib/proxyHandoverEngine";

interface ProxyHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const ProxyHandoverModal: React.FC<ProxyHandoverModalProps> = ({
  isOpen,
  onClose,
  defaultBookingId,
}) => {
  const [activeTab, setActiveTab] = useState<"delegate" | "verify" | "charter">("delegate");

  // Delegation Form State
  const [bookingId, setBookingId] = useState(defaultBookingId || "ST-948201");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [proxyName, setProxyName] = useState("");
  const [proxyPhone, setProxyPhone] = useState("");
  const [proxyIdType, setProxyIdType] = useState<"COLLEGE_ID" | "AADHAAR" | "DRIVING_LICENSE">(
    "COLLEGE_ID",
  );
  const [proxyIdLast4, setProxyIdLast4] = useState("");
  const [relationship, setRelationship] = useState("Hostel Roommate");
  const [notes, setNotes] = useState("");
  const [createdPass, setCreatedPass] = useState<ProxyHandoverRecord | null>(null);

  // Verification Form State
  const [verifySearchId, setVerifySearchId] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [inputIdLast4, setInputIdLast4] = useState("");
  const [records, setRecords] = useState<ProxyHandoverRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const loaded = getProxyHandoverRecords();
      setRecords(loaded);
      if (defaultBookingId) {
        setBookingId(defaultBookingId);
      }
    }
  }, [isOpen, defaultBookingId]);

  if (!isOpen) return null;

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!proxyName.trim() || !proxyPhone.trim() || proxyIdLast4.length !== 4) {
      toast.error("Validation Error", {
        description: "Please enter proxy name, phone number, and exact 4-digit ID number.",
      });
      return;
    }

    const payload: ProxyDelegationPayload = {
      bookingId: bookingId || `ST-${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: studentName.trim() || "Aman Sharma",
      studentPhone: studentPhone.trim() || "+91 9876543210",
      proxyName: proxyName.trim(),
      proxyPhone: proxyPhone.trim(),
      proxyIdType,
      proxyIdLast4: proxyIdLast4.trim(),
      relationship: relationship.trim() || "Friend",
      notes: notes.trim(),
    };

    const pass = createProxyDelegation(payload);
    setCreatedPass(pass);
    setRecords(getProxyHandoverRecords());
    toast.success("Proxy Delegation Pass Created!", {
      description: `OTP Code: ${pass.verificationOtp}. Share this pass with ${pass.proxyName}.`,
    });
  };

  const handleVerifyHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifySearchId.trim() || !inputOtp.trim() || !inputIdLast4.trim()) {
      toast.error("Missing Verification Fields", {
        description: "Please fill Pass/Booking ID, 6-digit OTP, and Proxy ID last 4 digits.",
      });
      return;
    }

    const res = verifyAndCompleteProxyHandover(
      verifySearchId.trim(),
      inputOtp.trim(),
      inputIdLast4.trim(),
    );

    if (res.success) {
      toast.success("Proxy Handover Verified!", {
        description: res.message,
      });
      setRecords(getProxyHandoverRecords());
      setInputOtp("");
      setInputIdLast4("");
    } else {
      toast.error("Handover Verification Failed", {
        description: res.message,
      });
    }
  };

  const handleCancelPass = (id: string) => {
    if (cancelProxyDelegation(id)) {
      setRecords(getProxyHandoverRecords());
      toast.info("Proxy Pass Cancelled", {
        description: "Luggage can now only be claimed by original student.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0F141C] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Reverse Logistics Proxy Handover
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  QA Tested
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Delegate luggage box pickup to a trusted friend if you cannot return to campus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg bg-gray-800/50 hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-emerald-500/20 bg-gray-900/50 p-1">
          <button
            onClick={() => setActiveTab("delegate")}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === "delegate"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            1. Delegate to Friend
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === "verify"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            2. Host/Runner OTP Verification
          </button>
          <button
            onClick={() => setActiveTab("charter")}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === "charter"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. Security Charter
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DELEGATE TO FRIEND */}
          {activeTab === "delegate" && (
            <div className="space-y-6">
              {!createdPass ? (
                <form onSubmit={handleCreateDelegation} className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Not returning to Kanpur city?</strong> Fill out your proxy friend's
                      details below. We will generate a 6-digit retrieval OTP and encrypted pass for
                      your friend to collect your box from the host node.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Booking ID to Handover
                      </label>
                      <input
                        type="text"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g. ST-948201"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Your Name (Student)
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="Aman Sharma"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Proxy Friend Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Proxy Friend's Full Name *
                        </label>
                        <input
                          type="text"
                          value={proxyName}
                          onChange={(e) => setProxyName(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. Rohan Verma"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Proxy Friend's Mobile Number *
                        </label>
                        <input
                          type="text"
                          value={proxyPhone}
                          onChange={(e) => setProxyPhone(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="+91 9123456789"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          ID Proof Type *
                        </label>
                        <select
                          value={proxyIdType}
                          onChange={(e) => setProxyIdType(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="COLLEGE_ID">College Student ID</option>
                          <option value="AADHAAR">Aadhaar Card</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          ID Last 4 Digits *
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={proxyIdLast4}
                          onChange={(e) => setProxyIdLast4(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="4829"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Relationship / Note
                        </label>
                        <input
                          type="text"
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. Roommate, Hall 4"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Generate Proxy Handover Pass
                  </button>
                </form>
              ) : (
                /* Created Pass Result */
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Proxy Retrieval Pass Generated!
                    </h3>
                    <p className="text-xs text-gray-300">
                      Share this verification pass & OTP with {createdPass.proxyName} to collect
                      your luggage.
                    </p>

                    <div className="p-3 bg-black/60 rounded-xl border border-emerald-500/30 flex items-center justify-around font-mono">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Pass ID</span>
                        <span className="text-sm font-bold text-emerald-400">{createdPass.id}</span>
                      </div>
                      <div className="h-8 w-px bg-gray-800" />
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">
                          Verification OTP
                        </span>
                        <span className="text-xl font-extrabold text-white tracking-widest">
                          {createdPass.verificationOtp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={getProxyWhatsAppShareUrl(createdPass)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg transition"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Pass via WhatsApp
                    </a>
                    <button
                      onClick={() => setCreatedPass(null)}
                      className="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-xs transition"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              )}

              {/* Active Delegations List */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Active Proxy Delegations ({records.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {records.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-gray-900/60 border border-gray-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{r.proxyName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                            {r.relationship}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              r.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : r.status === "CANCELLED"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-gray-400">
                          Booking: <span className="text-emerald-400">{r.bookingId}</span> • OTP:{" "}
                          <span className="text-white font-mono">{r.verificationOtp}</span> • ID
                          Last 4: <span className="text-white font-mono">{r.proxyIdLast4}</span>
                        </p>
                      </div>
                      {r.status === "VERIFIED_READY" && (
                        <button
                          onClick={() => handleCancelPass(r.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-medium underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFY RETRIEVAL (RUNNER/HOST MODE) */}
          {activeTab === "verify" && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Runner & Host Handover Gatekeeper:</strong> Input the student's
                  Pass/Booking ID along with the proxy friend's 6-digit OTP code and physical ID
                  last 4 digits to release the box.
                </div>
              </div>

              <form
                onSubmit={handleVerifyHandover}
                className="space-y-4 p-5 bg-gray-900/80 border border-gray-800 rounded-2xl"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Pass ID or Booking ID *
                  </label>
                  <input
                    type="text"
                    value={verifySearchId}
                    onChange={(e) => setVerifySearchId(e.target.value)}
                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. STASH-PROXY-882194 or ST-948201"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      6-Digit Student OTP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-base text-white font-mono tracking-widest focus:border-emerald-500 focus:outline-none"
                      placeholder="749201"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Proxy Physical ID Last 4 Digits *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={inputIdLast4}
                      onChange={(e) => setInputIdLast4(e.target.value)}
                      className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-base text-white font-mono tracking-widest focus:border-emerald-500 focus:outline-none"
                      placeholder="4829"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Verify & Unlock Proxy Release
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: CHARTER & REVERSE LOGISTICS */}
          {activeTab === "charter" && (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
                <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  StashSaarthi Proxy Handover Protocol (Indian Contract Act Sec 182)
                </h3>
                <p>
                  When a student delegates box retrieval to a proxy, StashSaarthi executes an
                  agent-principal relationship validation. The 6-digit OTP code serves as legal
                  authorization from the original owner.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                  <span className="font-bold text-white block mb-1">
                    1. Dual-Factor Verification
                  </span>
                  OTP code + Physical ID last 4 digits matching ensures unauthorized third parties
                  cannot claim luggage boxes.
                </div>
                <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                  <span className="font-bold text-white block mb-1">2. Tamper-Seal Integrity</span>
                  The proxy friend must inspect the intact laser barcode seal before sign-off.
                </div>
                <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                  <span className="font-bold text-white block mb-1">3. Immutable Audit Log</span>
                  All proxy handovers post digital audit receipts to the student's registered
                  WhatsApp number.
                </div>
                <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                  <span className="font-bold text-white block mb-1">
                    4. Zero Brokerage Guarantee
                  </span>
                  Proxy pickup incurs ₹0 additional fee for the student or proxy.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
