import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Coins,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Maximize2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/Card3D";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { HostPayoutCharterModal } from "./HostPayoutCharterModal";
import { HostIncomeChart } from "./HostIncomeChart";

export function HostSimulator({ onBook }: { onBook: () => void }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({
    bedroom: true,
  });

  const [cornerBags, setCornerBags] = useState<number>(10);
  const [dailyTiffins, setDailyTiffins] = useState<number>(8);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Interactive Room Dimension & Location State (Task 117)
  const [roomDimension, setRoomDimension] = useState<number>(10);
  const [roomLocality, setRoomLocality] = useState<"kakadeo" | "kalyanpur" | "swaroop" | "other">(
    "kakadeo",
  );

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const cornerMonthly = useMemo(() => {
    // ₹180 net host payout per bag per month
    return cornerBags * 180;
  }, [cornerBags]);

  const kitchenMonthly = useMemo(() => {
    // ₹55 host payout per meal * 24 delivery days/month
    return dailyTiffins * 55 * 24;
  }, [dailyTiffins]);

  const roomSqFt = useMemo(() => roomDimension * roomDimension, [roomDimension]);

  const localityBonus = useMemo(() => {
    switch (roomLocality) {
      case "kakadeo":
        return 1000; // PW/Allen Coaching Hub High Demand
      case "swaroop":
        return 700;
      case "kalyanpur":
        return 500;
      default:
        return 0;
    }
  }, [roomLocality]);

  const roomMonthlyPayout = useMemo(() => {
    const base = Math.round((roomSqFt / 100) * 5200);
    return base + localityBonus;
  }, [roomSqFt, localityBonus]);

  const { totalMonthly, annualIncome } = useMemo(() => {
    let monthly = 0;
    if (selectedOptions["corner"]) monthly += cornerMonthly;
    if (selectedOptions["bedroom"]) monthly += roomMonthlyPayout;
    if (selectedOptions["kitchen"]) monthly += kitchenMonthly;

    return {
      totalMonthly: monthly,
      annualIncome: monthly * 12,
    };
  }, [selectedOptions, cornerMonthly, roomMonthlyPayout, kitchenMonthly]);

  const options = t.hostSimulator.options || [];

  return (
    <div
      id="host-earnings-calculator"
      className="relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20"
    >
      <AnimatedContent distance={40} scale={0.98} duration={0.6} ease="power2.out">
        {/* Interactive Kakadeo Room Earning Slider Banner (Task 117) */}
        <div className="mb-4 rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-black/60 to-black/80 p-4 sm:p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                <Sparkles className="h-3 w-3" />
                {isHi ? "⚡ काकादेव होस्ट कमाई सिम्युलेटर" : "⚡ KAKADEO HOST EARNING SLIDER"}
              </div>
              <h3 className="text-base sm:text-xl font-black tracking-tight text-white">
                {isHi ? (
                  <>
                    क्या काकादेव में आपके पास{" "}
                    <span className="text-amber-400 font-mono font-black">
                      {roomDimension}×{roomDimension} का खाली कमरा
                    </span>{" "}
                    है?{" "}
                    <span className="text-emerald-400 font-mono font-black">
                      {inr(roomMonthlyPayout)}/माह
                    </span>{" "}
                    निष्क्रिय कमाएं!
                  </>
                ) : (
                  <>
                    Have a{" "}
                    <span className="text-amber-400 font-mono font-black">
                      {roomDimension}×{roomDimension} empty room
                    </span>{" "}
                    in{" "}
                    {roomLocality === "kakadeo"
                      ? "Kakadeo"
                      : roomLocality === "kalyanpur"
                        ? "Kalyanpur"
                        : roomLocality === "swaroop"
                          ? "Swaroop Nagar"
                          : "Kanpur"}
                    ? Earn{" "}
                    <span className="text-emerald-400 font-mono font-black">
                      {inr(roomMonthlyPayout)}/month
                    </span>{" "}
                    passively!
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-300">
                {isHi
                  ? "कमरे का आकार और निकटतम कोचिंग हब बदलकर अपनी सटीक मासिक निष्क्रिय आय का अनुमान लगाएं।"
                  : "Adjust room dimensions and campus coaching hub proximity to calculate exact host earnings."}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-black/60 rounded-xl p-3 border border-amber-500/30 text-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {isHi ? "मासिक निष्क्रिय आय" : "Passive Monthly Income"}
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {inr(roomMonthlyPayout)}
                  <span className="text-xs font-normal text-slate-400">
                    {isHi ? "/माह" : "/mo"}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {isHi ? "वार्षिक कमाई" : "Annual Household"}
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                  {inr(roomMonthlyPayout * 12)}
                </div>
              </div>
            </div>
          </div>

          {/* Sliders & Controls */}
          <div className="mt-4 pt-4 border-t border-white/10 grid gap-4 sm:grid-cols-2">
            {/* Room Size Slider */}
            <div className="space-y-2 bg-black/40 rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-200 flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                  {isHi ? "कमरे का आकार (फीट):" : "Room Dimension (ft):"}
                </span>
                <span className="font-mono text-amber-400 text-sm font-black bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {roomDimension} × {roomDimension} ft ({roomSqFt} sq. ft)
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={15}
                step={1}
                value={roomDimension}
                onChange={(e) => setRoomDimension(Number(e.target.value))}
                aria-label={isHi ? "कमरे का आकार फीट में" : "Room dimension slider in feet"}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>8×8 ft (64 sq ft)</span>
                <span className="text-amber-400 font-bold">10×10 ft (100 sq ft)</span>
                <span>15×15 ft (225 sq ft)</span>
              </div>
            </div>

            {/* Location / Campus Proximity Selector */}
            <div className="space-y-2 bg-black/40 rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-200 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  {isHi ? "कानपुर कोचिंग हब इलाका:" : "Kanpur Coaching Hub Belt:"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  +{localityBonus > 0 ? `₹${localityBonus} Demand Bonus` : "Standard"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "kakadeo", label: "📍 Kakadeo (PW/Allen)", bonus: "+₹1,000" },
                  { id: "kalyanpur", label: "🏢 Kalyanpur (CSJMU)", bonus: "+₹500" },
                  { id: "swaroop", label: "🏫 Swaroop (HBTI)", bonus: "+₹700" },
                  { id: "other", label: "🏡 Other Kanpur", bonus: "Base" },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setRoomLocality(loc.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-[10.5px] font-bold text-left transition-all flex justify-between items-center cursor-pointer border ${
                      roomLocality === loc.id
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{loc.label}</span>
                    <span className="text-[9px] font-mono opacity-80 shrink-0 ml-1">
                      {loc.bonus}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {options.map((opt) => {
            const isSelected = selectedOptions[opt.id];
            return (
              <Card3D key={opt.id} maxTilt={5} className="h-full">
                <div
                  onClick={() => toggleOption(opt.id)}
                  className={`glass glass-hover relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 ${
                    isSelected ? "border-amber-400/50 bg-amber-400/5" : "border-white/10"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3 text-amber-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className="mb-1 text-[9px] font-bold uppercase tracking-wider text-amber-400"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {opt.tag}
                  </div>
                  <h3
                    className="mb-0.5 text-base font-bold text-foreground"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {opt.title}
                  </h3>
                  <div className="text-[11px] text-muted-foreground mb-3">
                    {t.hostSimulator.space}{" "}
                    {opt.id === "bedroom" ? `${roomDimension}x${roomDimension} sq ft` : opt.space}
                  </div>

                  <div className="mt-auto space-y-2" style={{ transform: "translateZ(15px)" }}>
                    <div className="flex-1 transition-all duration-300">
                      {isSelected && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{t.hostSimulator.effort}</span>
                            <span className="font-semibold text-foreground">{opt.effort}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {t.hostSimulator.capacity}
                            </span>
                            <span className="font-semibold text-foreground text-right">
                              {opt.id === "corner"
                                ? `${cornerBags} ${isHi ? "बैग क्षमता" : "Bags Capacity"}`
                                : opt.id === "kitchen"
                                  ? `${dailyTiffins} ${isHi ? "दैनिक टिफिन" : "Daily Tiffins"}`
                                  : `${roomDimension}×${roomDimension} ft (${roomSqFt} sq ft)`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {opt.id === "corner" && isSelected && (
                      <div
                        className="mt-2 rounded-xl bg-black/50 p-2.5 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-300 text-[11px]">
                            {isHi ? "बैग क्षमता समायोजन:" : "Adjust Bags Space:"}
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/70 rounded-lg px-2 py-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.max(4, b - 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white font-bold">
                              {cornerBags}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCornerBags((b) => Math.min(30, b + 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {opt.payoutNote ||
                            (isHi ? "⚡ ₹180 प्रति बैग/माह" : "⚡ ₹180 net / bag / mo")}
                        </div>
                      </div>
                    )}

                    {opt.id === "kitchen" && isSelected && (
                      <div
                        className="mt-2 rounded-xl bg-black/50 p-2.5 border border-amber-500/30 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-300 text-[11px]">
                            {isHi ? "दैनिक भोजन क्षमता:" : "Daily Meal Target:"}
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/70 rounded-lg px-2 py-0.5 border border-white/10">
                            <button
                              type="button"
                              onClick={() => setDailyTiffins((d) => Math.max(2, d - 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white font-bold">
                              {dailyTiffins}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDailyTiffins((d) => Math.min(25, d + 2))}
                              className="text-amber-400 hover:text-white cursor-pointer px-1 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {opt.payoutNote ||
                            (isHi
                              ? "⚡ ₹55 प्रति भोजन होस्ट भुगतान (24 दिन/माह)"
                              : "⚡ ₹55 host payout / meal (24 days/mo)")}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 border-t border-white/10 pt-3 text-center">
                      <div className="text-xs text-muted-foreground mb-0.5">
                        {t.hostSimulator.expectedIncome}
                      </div>
                      <div className="text-lg font-bold text-amber-400 font-mono">
                        {opt.id === "corner" && isSelected
                          ? `${inr(cornerMonthly)}${isHi ? "/माह" : "/mo"}`
                          : opt.id === "bedroom" && isSelected
                            ? `${inr(roomMonthlyPayout)}${isHi ? "/माह" : "/mo"}`
                            : opt.id === "kitchen" && isSelected
                              ? `${inr(kitchenMonthly)}${isHi ? "/माह" : "/mo"}`
                              : opt.incomeRange}
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        <HostIncomeChart
          cornerMonthly={cornerMonthly}
          roomMonthly={roomMonthlyPayout}
          kitchenMonthly={kitchenMonthly}
          totalMonthly={totalMonthly}
          annualIncome={annualIncome}
          cornerBags={cornerBags}
          dailyTiffins={dailyTiffins}
          hasCorner={!!selectedOptions["corner"]}
          hasRoom={!!selectedOptions["bedroom"]}
          hasKitchen={!!selectedOptions["kitchen"]}
        />

        <motion.div
          key={annualIncome}
          initial={{ scale: 0.96, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mt-4 mx-auto max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center sm:p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-50 blur-xl animate-[shimmer_3s_infinite]" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1.5">
              <Coins className="h-3.5 w-3.5" />
              {t.hostSimulator.annualTitle}
            </div>
            <div className="text-2xl font-extrabold tracking-tight sm:text-4xl text-foreground flex items-center justify-center gap-1.5">
              <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
              {inr(annualIncome)}{" "}
              <span className="text-lg sm:text-2xl text-muted-foreground">
                {t.hostSimulator.perYear}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                data-magnetic
                variant="warm"
                size="default"
                className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm cursor-pointer"
                onClick={onBook}
              >
                {t.hostSimulator.cta} ➔
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowPayoutModal(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                {t.hostSimulator.viewPayoutCharter}
              </Button>
            </div>
          </div>
        </motion.div>

        <HostPayoutCharterModal open={showPayoutModal} onOpenChange={setShowPayoutModal} />
      </AnimatedContent>
    </div>
  );
}
