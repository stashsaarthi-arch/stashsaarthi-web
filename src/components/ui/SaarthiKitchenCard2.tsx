import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, Flame, Utensils, Award, ChevronRight, Check, Sparkles, HeartHandshake } from "lucide-react";
import { playPop, playHeroCtaClick, playClick } from "@/lib/audio";
import { getSaarthiKitchenCardTokens } from "@/lib/designTokens";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { PeacockFeatherMatkiDusting } from "../stash/PeacockFeatherMatkiDusting";


export interface MacroBreakdownSpec {
  calories: number; // e.g. 680
  proteinGrams: number; // e.g. 26
  carbsGrams: number; // e.g. 84
  fatsGrams: number; // e.g. 20
}

export interface ChefBioSpec {
  name: string; // e.g. "Sunita Sharma"
  roleTitle: string; // e.g. "Senior Host Chef"
  experienceYears: number; // e.g. 22
  specialty: string; // e.g. "Desi Ghee Satvik Thali"
  avatarUrl?: string;
  isVerifiedHost?: boolean;
}

export interface ThaliPreviewDish {
  id: string;
  nameEn: string;
  nameHi: string;
  imageUrl?: string;
  icon?: string;
}

export interface SaarthiKitchenThali {
  id: string;
  name: string;
  nameHi?: string;
  costPickup: number;
  costDelivery: number;
  vendorPayout: number;
  description: string;
  descriptionHi?: string;
  badge?: string;
  popular?: boolean;
  macros?: MacroBreakdownSpec;
  chef?: ChefBioSpec;
  dishes?: ThaliPreviewDish[];
}

export interface SaarthiKitchenCard2Props {
  thali: SaarthiKitchenThali;
  isSelected?: boolean;
  selectedFulfillment?: "DineIn_Pickup" | "RoomDelivery";
  onSelect?: (thali: SaarthiKitchenThali) => void;
  onOrder?: (thali: SaarthiKitchenThali, fulfillment: "DineIn_Pickup" | "RoomDelivery") => void;
  className?: string;
}

const DEFAULT_DISHES: ThaliPreviewDish[] = [
  { id: "roti", nameEn: "4x Desi Ghee Butter Roti", nameHi: "4x देसी घी बटर रोटी", icon: "🫓" },
  { id: "dal", nameEn: "Slow-Cooked Dal Tadka", nameHi: "धीमी आंच पर पकी दाल तड़का", icon: "🍲" },
  { id: "paneer", nameEn: "Fresh Matar Paneer", nameHi: "ताजा मटर पनीर सब्‍जी", icon: "🥘" },
  { id: "rice", nameEn: "Jeera Basmati Rice", nameHi: "जीरा बास्मती चावल", icon: "🍚" },
  { id: "sweet", nameEn: "Homestyle Gulab Jamun", nameHi: "घरेलू गुलाब जामुन", icon: "🥮" },
];

const DEFAULT_CHEF: ChefBioSpec = {
  name: "Sunita Sharma",
  roleTitle: "Senior Host Chef",
  experienceYears: 22,
  specialty: "Desi Ghee Satvik Thali",
  isVerifiedHost: true,
};

const DEFAULT_MACROS: Record<string, MacroBreakdownSpec> = {
  standard: { calories: 620, proteinGrams: 20, carbsGrams: 78, fatsGrams: 16 },
  special: { calories: 720, proteinGrams: 26, carbsGrams: 88, fatsGrams: 22 },
  paneer: { calories: 810, proteinGrams: 34, carbsGrams: 84, fatsGrams: 26 },
  sunday: { calories: 890, proteinGrams: 32, carbsGrams: 98, fatsGrams: 30 },
};

export const SaarthiKitchenCard2: React.FC<SaarthiKitchenCard2Props> = ({
  thali,
  isSelected = false,
  selectedFulfillment = "DineIn_Pickup",
  onSelect,
  onOrder,
  className = "",
}) => {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const tokens = getSaarthiKitchenCardTokens(role);

  const [activeSlot, setActiveSlot] = useState<"Lunch" | "Dinner">("Lunch");
  const [activeDishIndex, setActiveDishIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 42,
    seconds: 30,
  });

  const macros = thali.macros || DEFAULT_MACROS[thali.id] || DEFAULT_MACROS["special"]!;
  const chef = thali.chef || DEFAULT_CHEF;
  const dishes = thali.dishes || DEFAULT_DISHES;

  // Countdown timer calculator
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();

      if (activeSlot === "Lunch") {
        target.setHours(7, 0, 0, 0);
        if (now.getTime() > target.getTime()) {
          target.setDate(target.getDate() + 1);
        }
      } else {
        target.setHours(14, 0, 0, 0);
        if (now.getTime() > target.getTime()) {
          target.setDate(target.getDate() + 1);
        }
      }

      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeSlot]);

  // Dish rotation timer (auto loop preview every 3.5s)
  useEffect(() => {
    if (dishes.length <= 1) return;
    const interval = setInterval(() => {
      setActiveDishIndex((prev) => (prev + 1) % dishes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [dishes.length]);

  const effectiveCost = selectedFulfillment === "RoomDelivery" ? thali.costDelivery : thali.costPickup;

  const handleCardClick = () => {
    playPop();
    onSelect?.(thali);
  };

  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHeroCtaClick();
    onOrder?.(thali, selectedFulfillment);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 overflow-hidden ${
        isSelected
          ? "bg-slate-900 border-emerald-500 shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]"
          : "bg-slate-950/85 border-white/15 hover:border-emerald-500/40 hover:bg-slate-900/90"
      } ${className}`}
    >
      {/* Top Accent Gradient Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 ${
          isSelected ? "opacity-100 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" : "opacity-40 bg-gradient-to-r from-slate-700 to-slate-800 group-hover:opacity-80"
        }`}
      />

      {/* Badge & Popular Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {thali.badge ? (
          <span
            className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              thali.popular
                ? "bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_#10B981]"
                : "bg-slate-800 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {thali.badge}
          </span>
        ) : (
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Saarthi Tiffin 2.0
          </span>
        )}

        {/* Slot Switcher (Lunch / Dinner Countdown) */}
        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setActiveSlot("Lunch");
            }}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeSlot === "Lunch"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isHindi ? "दोपहर" : "Lunch"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setActiveSlot("Dinner");
            }}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeSlot === "Dinner"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isHindi ? "रात" : "Dinner"}
          </button>
        </div>
      </div>

      {/* Title & Pricing Pill */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
              {isHindi && thali.nameHi ? thali.nameHi : thali.name}
            </h3>
            {thali.id === "standard" && (
              <PeacockFeatherMatkiDusting compact isAutoTriggered={isSelected} />
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {isHindi && thali.descriptionHi ? thali.descriptionHi : thali.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-black text-white">
            {effectiveCost} <span className="text-xs font-bold text-emerald-400">Tokens</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            {tokens.pricePill.tokenRateEn}
          </span>
        </div>
      </div>

      {/* 1. Daily Meal Countdown Timer Bar */}
      <div className="mb-4 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/25 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {activeSlot === "Lunch"
              ? isHindi
                ? "दोपहर कट-ऑफ:"
                : "Lunch Cutoff:"
              : isHindi
              ? "रात कट-ऑफ:"
              : "Dinner Cutoff:"}
          </span>
        </div>
        <div className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
        </div>
      </div>

      {/* 2. Rotating Homestyle Thali Dish Preview Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            {isHindi ? "थाली व्यंजन पूर्वावलोकन:" : "Thali Dish Breakdown:"}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {activeDishIndex + 1}/{dishes.length}
          </span>
        </div>

        <div className="relative h-11 bg-slate-900/90 border border-white/10 rounded-xl px-3 flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDishIndex}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-xs font-semibold text-white"
            >
              <span className="text-base">{dishes[activeDishIndex]?.icon || "🍲"}</span>
              <span>
                {isHindi && dishes[activeDishIndex]?.nameHi
                  ? dishes[activeDishIndex]?.nameHi
                  : dishes[activeDishIndex]?.nameEn}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Dot Indicators */}
          <div className="flex items-center gap-1">
            {dishes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setActiveDishIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeDishIndex ? "bg-amber-400 w-3" : "bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Calorie & Macro Breakdown Grid */}
      <div className="mb-4 grid grid-cols-4 gap-1.5">
        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <Flame className="w-3 h-3 text-orange-400" />
            {isHindi ? "कैलोरी" : "Calories"}
          </div>
          <div className="text-xs font-black text-white font-mono mt-0.5">
            {macros.calories} <span className="text-[9px] text-slate-400">kcal</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {isHindi ? "प्रोटीन" : "Protein"}
          </div>
          <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
            {macros.proteinGrams}g
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {isHindi ? "कार्ब्स" : "Carbs"}
          </div>
          <div className="text-xs font-black text-cyan-400 font-mono mt-0.5">
            {macros.carbsGrams}g
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {isHindi ? "फैट्स" : "Fats"}
          </div>
          <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
            {macros.fatsGrams}g
          </div>
        </div>
      </div>

      {/* 4. Senior Host Chef Bio Tag */}
      <div className="mb-4 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="font-bold text-amber-200 flex items-center gap-1 text-[11px]">
              <span>{chef.name}</span>
              {chef.isVerifiedHost && (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              )}
            </div>
            <div className="text-[10px] text-amber-300/80 font-medium">
              {chef.experienceYears} Yrs Exp • {chef.specialty}
            </div>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
          Ghar Jaisa 🏡
        </span>
      </div>

      {/* 5. Pricing Breakdown & 1-Click Order CTA */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <div className="text-[11px] text-slate-400 font-medium">
          <span className="block text-slate-300 font-bold">
            Pickup: {thali.costPickup} Tokens
          </span>
          <span>Delivery: {thali.costDelivery} Tokens</span>
        </div>

        <button
          type="button"
          onClick={handleOrderClick}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            isSelected
              ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-slate-800 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30"
          }`}
        >
          <span>{isHindi ? tokens.ctaHi : tokens.ctaEn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
