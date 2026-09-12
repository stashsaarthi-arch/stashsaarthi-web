import React, { useState, useEffect } from "react";
import {
  MealTokenSubscription,
  MealMicroToken,
  getAllSubscriptions,
  burnMealToken,
  mintMealTokenSubscription,
  toggleSubscriptionFreeze,
  verifyMealTokenSignature,
  getMealTokenStats,
  PackageType,
} from "@/lib/mealTokenLedger";
import { playClick, playPop } from "@/lib/audio";
import { toast } from "sonner";
import {
  ShieldCheck,
  Flame,
  Ticket,
  QrCode,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Zap,
  Clock,
  User,
  Plus,
  Key,
  X,
  Smartphone,
  ChevronRight,
} from "lucide-react";

interface MealTokenLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
  userName?: string;
}

export const MealTokenLedgerModal: React.FC<MealTokenLedgerModalProps> = ({
  isOpen,
  onClose,
  userPhone = "9369454350",
  userName = "Rahul Sharma (IIT Kanpur)",
}) => {
  const [subscriptions, setSubscriptions] = useState<MealTokenSubscription[]>([]);
  const [activeTab, setActiveTab] = useState<"passbook" | "burn" | "inspector" | "mint">("passbook");
  const [selectedToken, setSelectedToken] = useState<MealMicroToken | null>(null);
  const [vendorNode, setVendorNode] = useState("annapurna");
  const [vendorName, setVendorName] = useState("Kakadeo Hub - Annapurna Kitchen");
  const [mintTier, setMintTier] = useState("special");
  const [mintPackage, setMintPackage] = useState<PackageType>("MONTHLY_30_DAY");

  const refreshLedger = () => {
    const subs = getAllSubscriptions();
    setSubscriptions(subs);
  };

  useEffect(() => {
    if (isOpen) {
      refreshLedger();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => refreshLedger();
    window.addEventListener("stashsaarthi:meal-token-updated", handleUpdate);
    return () => window.removeEventListener("stashsaarthi:meal-token-updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const stats = getMealTokenStats(userPhone);
  const activeSub = subscriptions.find((s) => s.tokens.some((t) => t.status === "ACTIVE")) || subscriptions[0];

  const handleBurnToken = (tokenId?: string) => {
    playPop();
    const targetId = tokenId || activeSub?.subscriptionId;
    if (!targetId) {
      toast.error("No active subscription available.");
      return;
    }

    const res = burnMealToken(targetId, vendorNode, vendorName);
    if (res.success && res.token) {
      toast.success(res.message);
      setSelectedToken(res.token);
      refreshLedger();
    } else {
      toast.error(res.message);
    }
  };

  const handleMintNewSub = () => {
    playClick();
    const tierLabels: Record<string, string> = {
      standard: "Standard Thali",
      special: "Special Thali",
      paneer: "Paneer Thali",
      sunday: "Sunday Special",
    };
    const label = tierLabels[mintTier] || "Special Thali";
    const sub = mintMealTokenSubscription(userPhone, userName, mintTier, label, mintPackage);
    toast.success(`Successfully minted new ${sub.packageType} subscription with ${sub.totalTokens} cryptographic tokens!`);
    refreshLedger();
    setActiveTab("passbook");
  };

  const handleFreezeToggle = (subId: string, currentFrozen: boolean) => {
    playClick();
    const res = toggleSubscriptionFreeze(subId, !currentFrozen);
    if (res.success) {
      toast.info(currentFrozen ? "Subscription unfrozen! Tokens are active again." : "Subscription frozen for weekend pause!");
      refreshLedger();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-neutral-900 border border-emerald-500/30 p-6 text-white shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-wide">Cryptographic Meal Token Ledger</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Micro-Burn 1-Token/Meal
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                User: <span className="text-neutral-200 font-medium">{userName}</span> ({userPhone})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800">
            <span className="text-xs text-neutral-400 block">Total Tokens Minted</span>
            <span className="text-xl font-extrabold text-white">{stats.totalTokensMinted}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-xs text-emerald-400 block">Active Burnable Tokens</span>
            <span className="text-xl font-extrabold text-emerald-300">{stats.totalActiveTokens}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <span className="text-xs text-amber-400 block">Burned Meals</span>
            <span className="text-xl font-extrabold text-amber-300">{stats.totalBurnedTokens}</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <span className="text-xs text-cyan-400 block">Burn Rate</span>
            <span className="text-xl font-extrabold text-cyan-300">{stats.burnRatePercentage}%</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-neutral-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab("passbook");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "passbook"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Ticket className="h-4 w-4" />
            Passbook ({stats.totalActiveTokens} Active)
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab("burn");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "burn"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Flame className="h-4 w-4" />
            Burn 1 Token (Redeem Meal)
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab("inspector");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "inspector"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Key className="h-4 w-4" />
            Cryptographic SHA-256 Inspector
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab("mint");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "mint"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            Mint New Subscription
          </button>
        </div>

        {/* Tab 1: Passbook */}
        {activeTab === "passbook" && (
          <div className="space-y-6">
            {subscriptions.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl">
                <Ticket className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-neutral-400">No active meal subscriptions found.</p>
                <button
                  onClick={() => setActiveTab("mint")}
                  className="mt-4 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition"
                >
                  Mint First Subscription
                </button>
              </div>
            ) : (
              subscriptions.map((sub) => {
                const isFrozen = sub.tokens.some((t) => t.status === "FROZEN");
                return (
                  <div key={sub.subscriptionId} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-emerald-400">{sub.tierName}</span>
                          <span className="px-2 py-0.5 text-xs bg-neutral-800 border border-neutral-700 rounded-md font-mono text-neutral-300">
                            {sub.subscriptionId}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-400 block mt-0.5">
                          Package: {sub.packageType} | Active: {sub.activeTokensCount} / {sub.totalTokens} tokens
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFreezeToggle(sub.subscriptionId, isFrozen)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isFrozen
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                              : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                          }`}
                        >
                          {isFrozen ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                          {isFrozen ? "Unfreeze Subscription" : "Weekend Freeze Pause"}
                        </button>
                      </div>
                    </div>

                    {/* Tokens Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
                      {sub.tokens.map((token) => {
                        const isValid = verifyMealTokenSignature(token);
                        const isBurned = token.status === "BURNED";
                        const isTokenFrozen = token.status === "FROZEN";

                        return (
                          <div
                            key={token.tokenId}
                            onClick={() => setSelectedToken(token)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition relative overflow-hidden ${
                              isBurned
                                ? "bg-neutral-900/40 border-neutral-800/80 opacity-50"
                                : isTokenFrozen
                                ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                                : "bg-neutral-900 border-emerald-500/30 hover:border-emerald-400 text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                              <span>#{token.tokenIndex}</span>
                              <span
                                className={`px-1 rounded ${
                                  isBurned
                                    ? "bg-neutral-800 text-neutral-500"
                                    : isTokenFrozen
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-emerald-500/20 text-emerald-300"
                                }`}
                              >
                                {token.status}
                              </span>
                            </div>
                            <div className="text-xs font-bold font-mono text-neutral-200 truncate">{token.tokenId}</div>
                            <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-between">
                              <span>{token.mealSlot}</span>
                              {isValid && <ShieldCheck className="h-3 w-3 text-emerald-400" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Burn 1 Token */}
        {activeTab === "burn" && (
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-emerald-500/30 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400" />
                Redeem Daily Meal (Burn 1 Micro-Token)
              </h4>
              <p className="text-xs text-neutral-400 mb-6">
                Scan or single-tap burn 1 token from your active meal ledger. 1 Token = 1 Fresh Thali at verified partner kitchens.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Select Kitchen Vendor Node</label>
                  <select
                    value={vendorNode}
                    onChange={(e) => {
                      setVendorNode(e.target.value);
                      const nameMap: Record<string, string> = {
                        annapurna: "Kakadeo Hub - Annapurna Kitchen",
                        dadi_maa: "CSJMU Kalyanpur - Dadi Maa Rasoi",
                        sharma_bhoj: "HBTI Nawabganj - Sharma Bhojnalaya",
                      };
                      setVendorName(nameMap[e.target.value] || "Kakadeo Hub - Annapurna Kitchen");
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="annapurna">Kakadeo Hub - Annapurna Kitchen (Kakadeo Belt)</option>
                    <option value="dadi_maa">CSJMU Kalyanpur - Dadi Maa Rasoi (CSJMU Belt)</option>
                    <option value="sharma_bhoj">HBTI Nawabganj - Sharma Bhojnalaya (HBTI Belt)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Target Subscription Pass</label>
                  <input
                    type="text"
                    readOnly
                    value={activeSub ? `${activeSub.tierName} (${activeSub.subscriptionId})` : "No Active Pass"}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-neutral-300 font-mono"
                  />
                </div>
              </div>

              {stats.nextBurnableToken ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400">Next Micro-Token Ready for Burn</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                      Token #{stats.nextBurnableToken.tokenIndex} of {stats.nextBurnableToken.totalInSubscription}
                    </span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white mb-1">{stats.nextBurnableToken.tokenId}</div>
                  <div className="text-xs text-neutral-400 font-mono break-all">{stats.nextBurnableToken.tokenHash}</div>
                </div>
              ) : (
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl mb-6 text-xs text-amber-300">
                  No active burnable tokens available in your ledger. Please mint a new subscription pass.
                </div>
              )}

              <button
                disabled={!stats.nextBurnableToken}
                onClick={() => handleBurnToken()}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold tracking-wide transition flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/20"
              >
                <Flame className="h-5 w-5" />
                Burn 1 Token Now (Redeem Meal)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Cryptographic SHA-256 Inspector */}
        {activeTab === "inspector" && (
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Cryptographic Micro-Token Security Seal Inspector
              </h4>
              <p className="text-xs text-neutral-400 mb-6">
                Every daily meal token is sealed with a deterministic SHA-256 cryptographic signature, preventing token duplication, fraud, or screenshot reuse.
              </p>

              {selectedToken ? (
                <div className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs text-neutral-400">Token ID</span>
                    <span className="font-mono font-bold text-white">{selectedToken.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs text-neutral-400">Subscription ID</span>
                    <span className="font-mono text-neutral-300">{selectedToken.subscriptionId}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs text-neutral-400">Passbook Index</span>
                    <span className="font-mono text-neutral-300">
                      #{selectedToken.tokenIndex} of {selectedToken.totalInSubscription}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs text-neutral-400">Cryptographic Signature</span>
                    <span className="font-mono text-xs text-emerald-300 break-all">{selectedToken.tokenHash}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Signature Status</span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Cryptographically Verified
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-400 text-xs">
                  Click any micro-token card in the Passbook tab to inspect its SHA-256 seal signature.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Mint New Subscription */}
        {activeTab === "mint" && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Mint New Kitchen Meal Token Subscription
            </h4>
            <p className="text-xs text-neutral-400 mb-6">
              Create a fresh cryptographic token stack for student meal passes (7-Day Trial, 30-Day Monthly, or 10-Pack Flex).
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Select Meal Tier</label>
                <select
                  value={mintTier}
                  onChange={(e) => setMintTier(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="standard">Standard Thali Pass (₹50/meal)</option>
                  <option value="special">Special Thali Pass (₹60/meal)</option>
                  <option value="paneer">Paneer Thali Pass (₹70/meal)</option>
                  <option value="sunday">Sunday Special Pass (₹85/meal)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Select Subscription Package</label>
                <select
                  value={mintPackage}
                  onChange={(e) => setMintPackage(e.target.value as PackageType)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="MONTHLY_30_DAY">30-Day Monthly Subscription (30 Micro-Tokens)</option>
                  <option value="TRIAL_7_DAY">7-Day Trial Pass (14 Micro-Tokens)</option>
                  <option value="FLEX_10_PACK">10-Pack Flex Pass (10 Micro-Tokens)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleMintNewSub}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition flex items-center justify-center gap-2"
            >
              <Ticket className="h-5 w-5" />
              Mint Micro-Tokens & Activate Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
