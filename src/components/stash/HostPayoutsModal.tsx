import React, { useState, useEffect } from "react";
import {
  getHostBankAccounts,
  registerHostBankAccount,
  getPayoutScheduleRecords,
  scheduleRazorpayRoutePayout,
  processPendingPayouts,
  forceInstantPayout,
  calculateSplitPayout,
  HostBankAccountDetails,
  PayoutScheduleRecord,
} from "../../lib/razorpayRouteEngine";
import { toast } from "../../context/ToastContext";
import { playClick, playPop } from "../../lib/audio";
import { Shield, Building2, CheckCircle2, Clock, ArrowUpRight, Zap, RefreshCw, X, Download } from "lucide-react";

interface HostPayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHostPhone?: string;
}

export const HostPayoutsModal: React.FC<HostPayoutsModalProps> = ({
  isOpen,
  onClose,
  initialHostPhone = "+91 9369454350",
}) => {
  const [activeTab, setActiveTab] = useState<"payouts" | "bank" | "calculator">("payouts");
  const [accounts, setAccounts] = useState<HostBankAccountDetails[]>([]);
  const [payouts, setPayouts] = useState<PayoutScheduleRecord[]>([]);

  // Bank Form State
  const [hostName, setHostName] = useState("Kamla Arora Ji");
  const [hostPhone, setHostPhone] = useState(initialHostPhone);
  const [bankAccountNumber, setBankAccountNumber] = useState("02911010002934");
  const [ifscCode, setIfscCode] = useState("PUNB0029100");
  const [upiVpa, setUpiVpa] = useState("kamlaarora@icici");

  // Calculator State
  const [calcService, setCalcService] = useState<"stash" | "spaces" | "kitchen" | "connect">("stash");
  const [calcAmount, setCalcAmount] = useState<number>(300);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const loadedAccounts = getHostBankAccounts();
    const loadedPayouts = processPendingPayouts();
    setAccounts(loadedAccounts);
    setPayouts(loadedPayouts);

    // Pre-fill active host details if found
    const currentHost = loadedAccounts.find((a) => a.hostPhone === hostPhone) || loadedAccounts[0];
    if (currentHost) {
      setHostName(currentHost.hostName);
      setBankAccountNumber(currentHost.bankAccountNumber);
      setIfscCode(currentHost.ifscCode);
      setUpiVpa(currentHost.upiVpa);
    }
  };

  if (!isOpen) return null;

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!hostName || !bankAccountNumber || !ifscCode || !upiVpa) {
      toast.error("Required Fields", "Please fill in all bank details.");
      return;
    }

    const updated = registerHostBankAccount({
      hostId: `HOST-KNP-${Math.floor(100 + Math.random() * 900)}`,
      hostName,
      hostPhone,
      bankAccountNumber,
      ifscCode,
      upiVpa,
      razorpayAccountId: `acc_KnpHost${Math.floor(100000 + Math.random() * 900000)}`,
    });

    setAccounts(getHostBankAccounts());
    playPop();
    toast.success(
      "Bank Account Linked",
      `Verified Razorpay Route Account created for ${updated.hostName}`
    );
  };

  const handleSimulateNewBookingPayout = () => {
    playClick();
    const record = scheduleRazorpayRoutePayout({
      bookingId: `STASH-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: calcService,
      totalAmount: calcAmount,
      hostName,
      hostPhone,
      upiVpa,
    });
    setPayouts(getPayoutScheduleRecords());
    playPop();
    toast.success(
      "24-Hr Payout Scheduled",
      `₹${record.hostPayoutAmount} scheduled for ${record.hostName} via Razorpay Route`
    );
  };

  const handleForceInstantTransfer = (payoutId: string) => {
    playClick();
    const updated = forceInstantPayout(payoutId);
    if (updated) {
      setPayouts(getPayoutScheduleRecords());
      playPop();
      toast.success(
        "Instant Transfer Complete",
        `₹${updated.hostPayoutAmount} transferred to ${updated.upiVpa} (${updated.razorpayTransferId})`
      );
    }
  };

  const calcResult = calculateSplitPayout(calcService, calcAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A0D0F] border border-amber-500/30 rounded-2xl shadow-2xl text-slate-100">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-[#0A0D0F]/95 border-b border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Razorpay Route Split-Payout Engine
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full">
                  24-Hour Settlement SLA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated verified host payouts for StashSaarthi Kanpur nodes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 px-6 bg-slate-950/50">
          <button
            onClick={() => {
              playClick();
              setActiveTab("payouts");
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "payouts"
                ? "border-amber-400 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Scheduled Payouts ({payouts.length})</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab("bank");
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "bank"
                ? "border-amber-400 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Host Bank Account & UPI</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab("calculator");
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "calculator"
                ? "border-amber-400 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Unit Economics Split Calculator</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">

          {/* TAB 1: Scheduled Payouts */}
          {activeTab === "payouts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200">
                      Razorpay Route Automated Escrow Payouts
                    </h3>
                    <p className="text-xs text-amber-300/80">
                      Bookings automatically schedule host payout 24h after pickup/completion.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    loadData();
                    toast.success("Refreshed", "Scanned Razorpay Route queue.");
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Queue</span>
                </button>
              </div>

              {payouts.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
                  <Clock className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">No scheduled payouts found in queue.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-amber-400 font-bold">
                            {payout.id}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-300 font-medium">
                            {payout.serviceType}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              payout.status === "transferred"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {payout.status === "transferred" ? "✓ Transferred" : "⏳ 24h Scheduled"}
                          </span>
                        </div>

                        <div className="text-sm font-semibold text-white">
                          {payout.hostName} ({payout.upiVpa})
                        </div>
                        <p className="text-xs text-slate-400">
                          Booking ID: <span className="text-slate-200">{payout.bookingId}</span> • 
                          Settlement: {payout.settlementNotes}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-base font-bold text-emerald-400">
                            ₹{payout.hostPayoutAmount.toLocaleString("en-IN")}
                          </div>
                          <div className="text-xs text-slate-400">
                            Total: ₹{payout.totalBookingAmount} (Fee: ₹{payout.platformCommission})
                          </div>
                        </div>

                        {payout.status === "scheduled" && (
                          <button
                            onClick={() => handleForceInstantTransfer(payout.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
                          >
                            <Zap className="w-3.5 h-3.5 fill-black" />
                            <span>Instant Transfer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Host Bank & UPI Setup */}
          {activeTab === "bank" && (
            <div className="space-y-6">
              <form onSubmit={handleSaveBankDetails} className="space-y-4 bg-slate-900/50 p-5 border border-slate-800 rounded-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Verified Host Bank Account & UPI Configuration</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Host Full Name</label>
                    <input
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Host Phone Number</label>
                    <input
                      type="text"
                      value={hostPhone}
                      onChange={(e) => setHostPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Bank IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Verified UPI ID (VPA)</label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Link Verified Bank Account & Razorpay Route ID
                </button>
              </form>

              {/* Active Linked Host Accounts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Active Linked Razorpay Route Host Accounts ({accounts.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accounts.map((acc) => (
                    <div key={acc.razorpayAccountId} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{acc.hostName}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-xs font-mono text-amber-400">Account: {acc.razorpayAccountId}</p>
                      <p className="text-xs text-slate-400">UPI VPA: {acc.upiVpa} • A/C: ****{acc.bankAccountNumber.slice(-4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Unit Economics Calculator */}
          {activeTab === "calculator" && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Kanpur Verified Unit Economics Split Simulator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Service Type</label>
                    <select
                      value={calcService}
                      onChange={(e) => setCalcService(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="stash">Saarthi Stash (Luggage Micro-Storage @ 60% Host Share)</option>
                      <option value="spaces">Saarthi Spaces (Zero-Brokerage Room @ 95% Host Share)</option>
                      <option value="kitchen">Saarthi Kitchen (Home Tiffin @ ₹55/meal Host Share)</option>
                      <option value="connect">Saarthi Connect (Senior Mentorship @ 80% Host Share)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Total Booking Value (₹)</label>
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs text-slate-400">Host Net Direct Payout (24h)</span>
                    <div className="text-xl font-extrabold text-emerald-400">
                      ₹{calcResult.hostPayoutAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Platform Operating Margin</span>
                    <div className="text-xl font-extrabold text-amber-400">
                      ₹{calcResult.platformCommission.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSimulateNewBookingPayout}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Schedule Test Split-Payout for this Booking
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
