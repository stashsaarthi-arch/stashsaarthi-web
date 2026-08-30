import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ScanBarcode,
  ShieldCheck,
  Building,
  Calculator,
  CheckCircle2,
  Lock,
  QrCode,
  MapPin,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/Card3D";
import { useLanguage } from "@/context/LanguageContext";

export function ProductSandbox() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"custody" | "node" | "economics">("custody");
  const [showSampleCert, setShowSampleCert] = useState(false);

  // Custody Tab state
  const [bagType, setBagType] = useState<string>("trolley");
  const [bagCount, setBagCount] = useState<number>(2);
  const [months, setMonths] = useState<number>(2);

  // Economics Math
  const ratePerBag = 300;
  const hostSharePerBag = 180;
  const insurancePoolPerBag = 40;
  const platformMarginPerBag = 80;

  const totalPaid = bagCount * months * ratePerBag;
  const hostTotal = bagCount * months * hostSharePerBag;
  const insuranceTotal = bagCount * months * insurancePoolPerBag;
  const platformTotal = bagCount * months * platformMarginPerBag;

  return (
    <section
      id="product-sandbox"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 scroll-mt-20"
    >
      <AnimatedContent distance={40} direction="vertical" duration={0.7}>
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono"
          >
            {isHi ? "🧪 इंटरएक्टिव सैंडबॉक्स" : "🧪 INTERACTIVE PRODUCT PREVIEW"}
          </Badge>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {isHi ? (
              <>
                जुड़ने से पहले <span className="text-gradient">स्वयं जांचें</span>
              </>
            ) : (
              <>
                Inspect the Real Engine <span className="text-gradient">Before You Commit</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {isHi
              ? "कोई काल्पनिक 3D मॉडल नहीं — वास्तविक डिजिटल कस्टडी, नोड सत्यापन और पारदर्शी अर्थशास्त्र का लाइव परीक्षण करें।"
              : "No generic abstract mockups. Test our real custody tracker, verified node audit view, and zero-hidden-fee escrow math right here."}
          </p>
        </div>
      </AnimatedContent>

      {/* ── Tab Switcher ── */}
      <div className="mt-10 sm:mt-14 flex justify-center">
        <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("custody")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "custody"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                : "text-muted-foreground hover:text-white border border-transparent"
            }`}
          >
            <ScanBarcode className="h-4 w-4" />
            <span>{isHi ? "1. कस्टडी व सील ट्रैकर" : "1. Live Custody & Seal Tracker"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("node")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "node"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]"
                : "text-muted-foreground hover:text-white border border-transparent"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>{isHi ? "2. सत्यापित नोड व रूम व्यू" : "2. Verified Node & Room Audit"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("economics")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "economics"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]"
                : "text-muted-foreground hover:text-white border border-transparent"
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>{isHi ? "3. पारदर्शी गणित (₹0 छुपा शुल्क)" : "3. Transparent Rupee Split"}</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Viewport ── */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: Live Custody Tracker */}
          {activeTab === "custody" && (
            <motion.div
              key="custody"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden"
            >
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                {/* Simulator Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    <ScanBarcode className="h-4 w-4" />
                    <span>{isHi ? "सील परीक्षण कंसोल" : "Seal Verification Simulator"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {isHi
                      ? "सामान का प्रकार चुनें और लाइव सील आईडी देखें"
                      : "Select Luggage Format to Preview Seal State"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isHi
                      ? "पिकअप के समय प्रत्येक बैग पर लेजर-उत्कीर्ण गैर-फाड़ने योग्य बारकोड सील लगाई जाती है, जिसे केवल छात्र वापसी पर क्यूआर स्कैन द्वारा अनलॉक कर सकता है।"
                      : "At doorstep pickup, a non-tearable serialized barcode seal is affixed. Only the verified student can release the custody ticket upon return."}
                  </p>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {isHi ? "सामान का प्रकार:" : "Luggage Type:"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "trolley",
                          label: isHi ? "ट्रॉली बैग" : "Trolley Bag",
                          size: "24-28 inch",
                        },
                        {
                          id: "carton",
                          label: isHi ? "स्टडी कार्टन" : "Study Box",
                          size: "Up to 25kg",
                        },
                        {
                          id: "rucksack",
                          label: isHi ? "रकसैक" : "Rucksack",
                          size: "65L Trek",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBagType(item.id)}
                          className={`rounded-xl border p-2.5 text-center text-xs transition-all cursor-pointer ${
                            bagType === item.id
                              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-bold"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                          }`}
                        >
                          <div>{item.label}</div>
                          <div className="text-[10px] opacity-70 font-mono mt-0.5">{item.size}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Digital Custody Pass Preview */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-6 relative font-mono shadow-2xl">
                    {/* Top status bar */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          CHAIN OF CUSTODY // VERIFIED
                        </span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">₹10,000 COVERED</span>
                    </div>

                    {/* Barcode & Serial */}
                    <div className="my-5 p-4 rounded-xl border border-white/10 bg-black/60 text-center">
                      <div className="text-2xl sm:text-3xl tracking-[0.3em] font-extrabold text-emerald-400">
                        ||| | |||| | || ||| ||
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground tracking-widest">
                        TAG ID:{" "}
                        <span className="text-white font-bold">
                          #SS-KNP-
                          {bagType === "trolley"
                            ? "84920"
                            : bagType === "carton"
                              ? "91044"
                              : "72318"}
                        </span>
                      </div>
                    </div>

                    {/* Verifiable Diagnostics Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <span className="text-muted-foreground block text-[10px]">
                          {isHi ? "नोड स्थान" : "NODE LOCATION"}
                        </span>
                        <span className="text-foreground font-semibold">
                          {isHi ? "कल्याणपुर सीनियर होम #04" : "Kalyanpur Senior Home #04"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <span className="text-muted-foreground block text-[10px]">
                          {isHi ? "स्टोरेज प्लेटफॉर्म" : "STORAGE PLATFORM"}
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {isHi ? "ऊंचा सूखा पैलेट (सुरक्षित)" : "Elevated Dry Pallet (2.5ft)"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <span className="text-muted-foreground block text-[10px]">
                          {isHi ? "दोहरी फोटो लॉग" : "DUAL PHOTO LOG"}
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {isHi ? "जीपीएस टाइमस्टैम्प प्रमाणित" : "GPS Timestamp Verified"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <span className="text-muted-foreground block text-[10px]">
                          {isHi ? "एस्क्रो स्थिति" : "ESCROW STATUS"}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          {isHi ? "बैंक एस्क्रो में लॉक" : "Locked in Escrow"}
                        </span>
                      </div>
                    </div>

                    {/* Interactive 1-Click Sandbox Action */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground italic">
                        {isHi
                          ? "✓ बिना लॉगिन के लाइव आउटपुट परखें"
                          : "✓ Live interactive output • No login required"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSampleCert(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer active:scale-95"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{isHi ? "डिजिटल कस्टडी पास देखें" : "View Live Custody Pass"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Verified Node & Room Audit */}
          {activeTab === "node" && (
            <motion.div
              key="node"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden"
            >
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                {/* Node Profile */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    <Building className="h-4 w-4" />
                    <span>{isHi ? "ऑन-साइट ऑडिटेड नोड" : "On-Site Audited Host Node"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Kalyanpur Senior Nodal Haven #04
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>
                      {isHi
                        ? "आईआईटी कानपुर गेट 1 से 600 मीटर (5 मिनट पैदल)"
                        : "600m from IIT Kanpur Gate 1 (5 min walk)"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isHi
                      ? "मेजबान: डॉ. आर.के. मिश्रा (सेवानिवृत्त प्राध्यापक, 68 वर्ष)। ऑन-साइट सत्यापित कमरा, समर्पित स्टोरेज कोना एवं पारिवारिक वातावरण।"
                      : "Host: Dr. R.K. Mishra (Retd. Academician, 68 yrs). Audited private room, dedicated climate-safe corner, and respectful guardian-like environment."}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-foreground">
                      {isHi ? "3-स्तरीय सत्यापन चेकलिस्ट:" : "3-Tier Verification Checklist:"}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        isHi ? "✓ आधार एवं पुलिस बैकग्राउंड क्लीयर" : "✓ Aadhaar & Police Checked",
                        isHi ? "✓ बाहरी गेट सीसीटीवी सक्रिय" : "✓ Exterior Gate CCTV Active",
                        isHi ? "✓ लकड़ी का ऊंचा स्टोरेज पैलेट" : "✓ Raised Storage Pallet",
                        isHi ? "✓ 0% ब्रोकरेज प्रत्यक्ष किराया" : "✓ Zero Brokerage Direct Rent",
                      ].map((chk, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 font-medium"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transparent Node Financials */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs text-muted-foreground">
                        {isHi ? "कमरा किराया (मासिक)" : "Room Rent (Monthly)"}
                      </span>
                      <span className="text-xl font-bold text-foreground">₹5,200 / mo</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{isHi ? "ब्रोकरेज कमीशन" : "Brokerage Commission"}</span>
                        <span className="text-emerald-400 font-bold">₹0 (100% Free)</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {isHi ? "सुरक्षा जमा (रिफंडेबल)" : "Security Deposit (Refundable)"}
                        </span>
                        <span className="text-foreground">₹2,000 (Standard)</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{isHi ? "हाउस नॉर्म्स समझौता" : "House Norms Agreement"}</span>
                        <span className="text-emerald-400 font-bold">Sec 105 TPA Protected</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300 border border-amber-500/20">
                      💡{" "}
                      {isHi
                        ? "सभी भुगतान डिजिटल एस्क्रो के माध्यम से होते हैं। कोई नकद लेन-देन नहीं।"
                        : "All stay dues flow through digital escrow. Direct bank payouts to senior hosts weekly."}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Transparent Rupee Split */}
          {activeTab === "economics" && (
            <motion.div
              key="economics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden"
            >
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                {/* Sliders */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    <Calculator className="h-4 w-4" />
                    <span>{isHi ? "पारदर्शी वित्तीय सिमुलेटर" : "Transparent Unit Economics"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {isHi
                      ? "आपके प्रत्येक ₹300 का सटीक विभाजन"
                      : "Exact Breakdown for Every ₹300 You Pay"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isHi
                      ? "हमारा मानना है कि विश्वास की शुरुआत 100% वित्तीय ईमानदारी से होती है। देखें कि आपका भुगतान कहां जाता है।"
                      : "Trust begins with total financial honesty. Inspect where every single rupee goes — from host payout to platform operations."}
                  </p>

                  {/* Bags slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">
                        {isHi ? "बैग की संख्या:" : "Luggage Count:"}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {bagCount} {isHi ? "बैग" : "Bags"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={bagCount}
                      onChange={(e) => setBagCount(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-white/10 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Months slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">
                        {isHi ? "अवधि (माह):" : "Storage Duration:"}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {months} {isHi ? "माह" : "Months"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-white/10 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Breakdown Display */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          {isHi ? "कुल छात्र शुल्क" : "Total Student Paid"}
                        </span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-white">
                          ₹{totalPaid}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 font-bold">
                        ₹300 / BAG / MO
                      </span>
                    </div>

                    {/* Split details */}
                    <div className="space-y-3 pt-2">
                      {/* Host Payout */}
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-amber-300">
                            {isHi
                              ? "सीनियर होस्ट सीधा भुगतान (60.0%)"
                              : "Senior Host Direct Payout (60.0%)"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {isHi
                              ? "बुजुर्ग परिवार को सीधी सम्मानजनक आय"
                              : "Direct passive income to Kanpur host family"}
                          </div>
                        </div>
                        <span className="text-base font-bold text-amber-400">₹{hostTotal}</span>
                      </div>

                      {/* Insurance Pool */}
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-emerald-300">
                            {isHi
                              ? "लेजर सील व ₹10,000 बीमा पूल (13.3%)"
                              : "Laser Seal & ₹10k Insurance Pool (13.3%)"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {isHi
                              ? "भौतिक टैम्पर सील एवं क्षति सुरक्षा गारंटी"
                              : "Physical barcode seals and damage protection reserve"}
                          </div>
                        </div>
                        <span className="text-base font-bold text-emerald-400">
                          ₹{insuranceTotal}
                        </span>
                      </div>

                      {/* Platform Margin */}
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-cyan-300">
                            {isHi
                              ? "प्लेटफॉर्म संचालन व ग्राउंड फ्लीट (26.7%)"
                              : "Platform Ops & Ground Fleet (26.7%)"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {isHi
                              ? "सत्यापन, जीपीएस ट्रैकिंग एवं 15-मिनट सपोर्ट"
                              : "On-site audits, GPS logs & 15-min ground SLA"}
                          </div>
                        </div>
                        <span className="text-base font-bold text-cyan-400">₹{platformTotal}</span>
                      </div>

                      {/* Zero Hidden Fees */}
                      <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isHi
                            ? "छुपे हुए शुल्क / कन्वीनियंस फीस:"
                            : "Hidden Surcharges / Convenience Fees:"}
                        </span>
                        <span className="text-emerald-400 font-bold font-mono">₹0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Interactive Custody Pass Modal (Zero-Signup Sandbox) ── */}
      <AnimatePresence>
        {showSampleCert && (
          <div className="fixed inset-0 z-[150] grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0A0D0F] p-6 sm:p-7 shadow-2xl overflow-hidden font-mono"
            >
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    STASHSAARTHI // DIGITAL CUSTODY
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSampleCert(false)}
                  className="rounded-full bg-white/5 p-1 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Close pass modal"
                >
                  ✕
                </button>
              </div>

              {/* Barcode graphic */}
              <div className="my-5 p-4 rounded-2xl border border-white/10 bg-black/80 text-center">
                <div className="text-2xl sm:text-3xl tracking-[0.3em] font-extrabold text-emerald-400">
                  |||| | || |||| | ||| ||
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  SERIAL SEAL ID: <span className="text-emerald-400 font-bold">#SS-KNP-84920</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-muted-foreground">
                    {isHi ? "स्थान:" : "Origin Campus:"}
                  </span>
                  <span className="text-foreground font-semibold">IIT Kanpur (Hall 13)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-muted-foreground">
                    {isHi ? "नोड हब:" : "Assigned Node:"}
                  </span>
                  <span className="text-foreground font-semibold">Kalyanpur Senior Home #04</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-muted-foreground">
                    {isHi ? "सुरक्षा ऊंचाई:" : "Platform Elevation:"}
                  </span>
                  <span className="text-emerald-400 font-semibold">2.5 ft Dry Pallet</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-muted-foreground">
                    {isHi ? "बीमा सुरक्षा:" : "Insurance Active:"}
                  </span>
                  <span className="text-emerald-400 font-bold">₹10,000 Zero-Deductible</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-muted-foreground">
                    {isHi ? "एस्क्रो स्थिति:" : "Digital Escrow:"}
                  </span>
                  <span className="text-cyan-400 font-bold">100% Bank Protected</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {isHi ? "🔒 नोडल ब्लॉकचेन हैश सत्यापित" : "🔒 Cryptographic Log #SS-AUTH-9204"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSampleCert(false)}
                  className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  {isHi ? "सत्यापित एवं ठीक है" : "Close Sandbox Pass"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
