import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError } from "@/lib/supabaseLogger";
import { saveMealOrder } from "@/lib/localSubmissions";
import { enqueueOfflineSubmission } from "@/lib/offlineSubmissionQueue";
import { useComponentTelemetry } from "@/lib/interactionTelemetry";
import { toast } from "sonner";
import { TasteShieldModal } from "./TasteShieldModal";
import { PeacockFeatherMatkiDusting } from "./stash/PeacockFeatherMatkiDusting";
import { RoommateMenuShareModal, MenuShareDetails } from "./stash/RoommateMenuShareModal";
import {
  ShieldCheck,
  Repeat,
  Zap,
  Check,
  X,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Share2,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { playClick, playPop, playMicroClick, playToggle, playConfirm } from "@/lib/audio";
import { SaarthiKitchenSchema } from "@/components/seo/SaarthiKitchenSchema";
import { IntelligentNudgesWidget } from "./stash/IntelligentNudgesWidget";
import { MealPersonalizationSelector } from "./stash/MealPersonalizationSelector";
import { formatPersonalizationsSummary } from "@/lib/mealPersonalization";
import { DeliveryCutoffCountdown } from "./stash/DeliveryCutoffCountdown";
import {
  useThaliPriceLabelVariant,
  trackThaliPriceClick,
  ThaliPriceLabelVariant,
} from "@/lib/abTesting";
import { CsoKitchenSealModal } from "./stash/CsoKitchenSealModal";
import { MealTokenLedgerModal } from "./stash/MealTokenLedgerModal";
import { motion, AnimatePresence } from "motion/react";
import type { OpenBooking } from "./stash/types";

type FulfillmentType = "DineIn_Pickup" | "RoomDelivery";

export interface LastMealOrder {
  mealId: string;
  mealName: string;
  vendorNode: string;
  fulfillmentType: FulfillmentType;
  deliverySlot: "Lunch" | "Dinner";
  cost: number;
  phone: string;
  userName: string;
  deliveryAddress: string;
  timestamp: string;
}

const DEFAULT_LAST_MEAL: LastMealOrder = {
  mealId: "special",
  mealName: "Special Thali",
  vendorNode: "Kakadeo Hub - Annapurna Kitchen",
  fulfillmentType: "RoomDelivery",
  deliverySlot: "Lunch",
  cost: 70,
  phone: "9876543210",
  userName: "Campus Student",
  deliveryAddress: "Hostel 4, Room 204, CSJMU / Kakadeo Belt",
  timestamp: new Date().toISOString(),
};

interface MealOption {
  id: string;
  name: string;
  costPickup: number;
  costDelivery: number;
  vendorPayout: number;
  description: string;
  badge?: string;
  popular?: boolean;
}

const MEAL_TIERS: MealOption[] = [
  {
    id: "standard",
    name: "Standard Thali",
    costPickup: 50,
    costDelivery: 60,
    vendorPayout: 44,
    description: "4 Roti, Dal, Sabzi, Rice, Salad",
    badge: "Everyday Basic",
  },
  {
    id: "special",
    name: "Special Thali",
    costPickup: 60,
    costDelivery: 70,
    vendorPayout: 53,
    description: "Butter Roti, Special Curry, Dal, Rice, Sweet",
    badge: "Student Choice",
    popular: true,
  },
  {
    id: "paneer",
    name: "Paneer Thali",
    costPickup: 70,
    costDelivery: 80,
    vendorPayout: 61,
    description: "Premium Paneer Sabzi, Butter Roti, Dal Makhani, Jeera Rice, Sweet",
    badge: "High Protein",
  },
  {
    id: "sunday",
    name: "Sunday Cheat Meal",
    costPickup: 85,
    costDelivery: 95,
    vendorPayout: 73,
    description: "Chef's Special Feast (Menu changes weekly)",
    badge: "Weekend Special",
  },
];

interface KitchenNodeInfo {
  id: string;
  name: string;
  campus: string;
  distance: string;
  rating: number;
  totalTokensLunch: number;
  tokensSoldLunch: number;
  percentSoldLunch: number;
  totalTokensDinner: number;
  tokensSoldDinner: number;
  percentSoldDinner: number;
  chefName: string;
  specialty: string;
  badge?: string;
}

const KITCHEN_NODES: KitchenNodeInfo[] = [
  {
    id: "annapurna",
    name: "Kakadeo Hub - Annapurna Kitchen",
    campus: "Kakadeo PW & Allen Hub",
    distance: "0.4 km",
    rating: 4.9,
    totalTokensLunch: 150,
    tokensSoldLunch: 117,
    percentSoldLunch: 78,
    totalTokensDinner: 150,
    tokensSoldDinner: 82,
    percentSoldDinner: 55,
    chefName: "Sunita Sharma (Verified PG Owner Host)",
    specialty: "Ghar Jaisa Desi Ghee Tiffin",
    badge: "⚡ 78% Sold",
  },
  {
    id: "dadi_maa",
    name: "CSJMU Kalyanpur - Dadi Maa Rasoi",
    campus: "CSJMU & Chhapeda Pulia",
    distance: "0.8 km",
    rating: 4.8,
    totalTokensLunch: 120,
    tokensSoldLunch: 102,
    percentSoldLunch: 85,
    totalTokensDinner: 120,
    tokensSoldDinner: 48,
    percentSoldDinner: 40,
    chefName: "Geeta Devi (Verified PG Owner Host)",
    specialty: "Satvik Arhar Dal & Phulka",
    badge: "🔥 85% Sold",
  },
  {
    id: "iitk_mess",
    name: "IIT Kanpur Gate 1 - Campus Verified PG Owner Mess",
    campus: "IIT Kanpur Gate 1",
    distance: "1.2 km",
    rating: 4.9,
    totalTokensLunch: 200,
    tokensSoldLunch: 128,
    percentSoldLunch: 64,
    totalTokensDinner: 200,
    tokensSoldDinner: 144,
    percentSoldDinner: 72,
    chefName: "Rameshwar Ji (Verified PG Owner Host)",
    specialty: "Paneer Masala & Desi Kheer",
    badge: "⭐ 64% Sold",
  },
  {
    id: "hbti_shanti",
    name: "HBTI Nawabganj - Shanti Home Food",
    campus: "HBTI Nawabganj Hub",
    distance: "1.5 km",
    rating: 4.7,
    totalTokensLunch: 100,
    tokensSoldLunch: 45,
    percentSoldLunch: 45,
    totalTokensDinner: 100,
    tokensSoldDinner: 30,
    percentSoldDinner: 30,
    chefName: "Shanti Verma (Verified PG Owner Host)",
    specialty: "Homestyle Kadhi Chawal",
    badge: "🏡 45% Sold",
  },
];

const RECHARGE_PACKS = [
  { id: "trial", name: "Starter Trial", price: 300, tokens: 300, desc: "15 Days Validity" },
  {
    id: "smart",
    name: "Smart Hopper",
    price: 599,
    tokens: 625,
    desc: "30 Days Validity",
    recommended: true,
  },
  { id: "freedom", name: "Monthly Freedom", price: 1449, tokens: 1550, desc: "45 Days Validity" },
  { id: "semester", name: "Semester Pro", price: 2799, tokens: 3050, desc: "60 Days Validity" },
];

interface MealTierCardProps {
  tier: MealOption;
  isSelected: boolean;
  tierCost: number;
  onSelect: (tier: MealOption) => void;
}

const ThaliPriceVariantToggle: React.FC = () => {
  const { variant, setVariant } = useThaliPriceLabelVariant();
  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
      <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
        A/B Price Label:
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          playClick();
          const next = variant === "classic" ? "value_save" : "classic";
          setVariant(next);
          trackThaliPriceClick(next, `toggle_to_${next}`);
        }}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          variant === "value_save"
            ? "bg-emerald-500 text-slate-950 shadow-sm"
            : "bg-slate-800 text-emerald-300 hover:bg-slate-700"
        }`}
      >
        {variant === "value_save" ? "✨ From ₹50, save more..." : "₹50 (pickup) / ₹60 (delivery)"}
      </motion.button>
    </div>
  );
};

const MealTierCard: React.FC<MealTierCardProps> = ({ tier, isSelected, tierCost, onSelect }) => {
  const { telemetryProps, trackClick } = useComponentTelemetry(
    `thali_${tier.id}_${tier.costPickup}`,
    "kitchen_thali",
    {
      meal_id: tier.id,
      meal_name: tier.name,
      cost_pickup: tier.costPickup,
      cost_delivery: tier.costDelivery,
      effective_cost: tierCost,
      badge: tier.badge,
    },
  );
  const { variant, getLabel } = useThaliPriceLabelVariant();

  return (
    <motion.div
      {...telemetryProps}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => {
        playToggle();
        if (tier.id === "standard") {
          trackThaliPriceClick(variant, `select_thali_${variant}`);
        }
        trackClick({ action: "select_thali_tier" });
        onSelect(tier);
      }}
      className={`relative overflow-hidden backdrop-blur-md rounded-3xl group p-5 border transition-colors duration-300 ${
        isSelected
          ? "bg-[#0a0a0a]/80 border-emerald-500/80 shadow-[0_8px_25px_-5px_rgba(16,185,129,0.35)]"
          : "bg-[#0a0a0a]/40 border-white/10 hover:border-emerald-500/40 hover:bg-[#0a0a0a]/60 cursor-pointer"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-emerald-500/10 blur-[30px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      {tier.badge && (
        <span
          className={`absolute top-3 right-3 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider pointer-events-none z-20 ${
            tier.popular ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
          }`}
        >
          {tier.badge}
        </span>
      )}

      <div className="relative z-10 flex items-center justify-between gap-2 mb-1 mt-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {tier.name}
        </div>
        {tier.id === "standard" && (
          <PeacockFeatherMatkiDusting compact isAutoTriggered={isSelected} />
        )}
      </div>
      <div className="relative z-10 text-3xl font-black text-white mb-2">
        {tierCost} <span className="text-xs font-bold text-emerald-400">Tokens</span>
      </div>

      {tier.id === "standard" && (
        <div className="mb-3 text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center justify-between shadow-sm">
          <span>{getLabel(false)}</span>
          <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
            {variant === "classic" ? "Classic" : "Value-Save"}
          </span>
        </div>
      )}

      <p className="relative z-10 text-xs text-slate-400 leading-relaxed font-medium">{tier.description}</p>
    </motion.div>
  );
};

export const TokenMealHub: React.FC<{ onBook?: OpenBooking }> = ({ onBook }) => {
  // Wallet State
  const [tokenBalance, setTokenBalance] = useState<number>(450); // Demo user balance
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("DineIn_Pickup");
  const [selectedMeal, setSelectedMeal] = useState<MealOption>(MEAL_TIERS[1] as MealOption);
  const [vendorNode, setVendorNode] = useState<string>("Kakadeo Hub - Annapurna Kitchen");
  const [deliverySlot, setDeliverySlot] = useState<"Lunch" | "Dinner">("Dinner");
  const [phone, setPhone] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Meal Personalization State (Task 78)
  const [selectedPersonalizations, setSelectedPersonalizations] = useState<string[]>([]);
  const [personalizationDelta, setPersonalizationDelta] = useState<number>(0);

  // Roommate Menu Share Modal State (Task 73)
  const [isRoommateShareOpen, setIsRoommateShareOpen] = useState<boolean>(false);
  const [roommateShareDetails, setRoommateShareDetails] = useState<MenuShareDetails | undefined>(
    undefined,
  );

  // 2-Step "Re-order My Last Meal" Shortcut State (Task 61)
  const [lastMeal, setLastMeal] = useState<LastMealOrder>(() => {
    if (typeof window === "undefined") return DEFAULT_LAST_MEAL;
    try {
      const saved = localStorage.getItem("ss_last_meal_order");
      return saved ? JSON.parse(saved) : DEFAULT_LAST_MEAL;
    } catch {
      return DEFAULT_LAST_MEAL;
    }
  });

  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);
  const [reorderStep, setReorderStep] = useState<1 | 2>(1);
  const [reorderSlot, setReorderSlot] = useState<"Lunch" | "Dinner">(
    lastMeal.deliverySlot || "Lunch",
  );
  const [reorderFulfillment, setReorderFulfillment] = useState<FulfillmentType>(
    lastMeal.fulfillmentType || "RoomDelivery",
  );
  const [reorderPhone, setReorderPhone] = useState<string>(lastMeal.phone || "9876543210");
  const [reorderAddress, setReorderAddress] = useState<string>(
    lastMeal.deliveryAddress || "Hostel 4, Room 204, CSJMU / Kakadeo Belt",
  );
  const [isReorderSubmitting, setIsReorderSubmitting] = useState<boolean>(false);

  const saveLastMeal = (orderData: LastMealOrder) => {
    setLastMeal(orderData);
    try {
      localStorage.setItem("ss_last_meal_order", JSON.stringify(orderData));
      // Also persist to admin meal orders store
      saveMealOrder({
        id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: orderData.userName,
        phone: orderData.phone,
        mealType: orderData.mealName,
        kitchenNode: orderData.vendorNode,
        deliverySlot: orderData.deliverySlot,
        address: orderData.deliveryAddress,
        amount: orderData.cost,
        submittedAt: orderData.timestamp,
      });
    } catch (err) {
      console.error("Failed to save last meal order", err);
    }
  };

  const handleQuickReorderSubmit = async () => {
    const mealTier = MEAL_TIERS.find((m) => m.id === lastMeal.mealId) || MEAL_TIERS[1]!;
    const reorderCost =
      reorderFulfillment === "RoomDelivery" ? mealTier.costDelivery : mealTier.costPickup;

    if (tokenBalance < reorderCost) {
      toast.error("Insufficient tokens for Re-order", {
        description: `Need ${reorderCost} tokens. Balance: ${tokenBalance}. Please recharge wallet.`,
      });
      return;
    }

    if (!reorderPhone || !/^[6-9]\d{9}$/.test(reorderPhone)) {
      toast.error("Invalid Mobile Number", {
        description: "Please enter a valid 10-digit Indian phone number.",
      });
      return;
    }

    if (
      reorderFulfillment === "RoomDelivery" &&
      (!reorderAddress || reorderAddress.trim().length < 4)
    ) {
      toast.error("Delivery Address Required", {
        description: "Please enter room number & hostel/PG name.",
      });
      return;
    }

    const prevBalance = tokenBalance;
    // Optimistic balance update for instant perception
    setTokenBalance((prev) => prev - reorderCost);
    setIsReorderSubmitting(true);
    playPop();

    try {
      const today = new Date().toISOString().split("T")[0]!;
      const cutoffTime = new Date();
      cutoffTime.setHours(reorderSlot === "Lunch" ? 7 : 14, 0, 0, 0);

      let generatedPickupCode: string | null = null;
      if (reorderFulfillment === "DineIn_Pickup") {
        generatedPickupCode = "K-" + Math.floor(10 + Math.random() * 90);
      }

      const { data: insertedBooking, error } = await supabase
        .from("meal_bookings")
        .insert([
          {
            user_name: lastMeal.userName || "Campus Student",
            user_phone: reorderPhone.trim(),
            menu_id: mealTier.id,
            vendor_selected: lastMeal.vendorNode,
            fulfillment_type: reorderFulfillment,
            delivery_address: reorderFulfillment === "RoomDelivery" ? reorderAddress.trim() : null,
            pickup_code: generatedPickupCode,
            meal_date: today,
            meal_slot: reorderSlot,
            tokens_debited: reorderCost,
            vendor_payout: mealTier.vendorPayout,
            delivery_runner_payout: reorderFulfillment === "RoomDelivery" ? 7 : 0,
            cutoff_time: cutoffTime.toISOString(),
            order_status: "confirmed",
          },
        ])
        .select("id, created_at")
        .maybeSingle();

      if (error) {
        logSupabaseError({
          table: "meal_bookings",
          operation: "insert",
          error,
          context: "TokenMealHub_quickReorder",
        });
        throw error;
      }

      // Save updated last order
      const updatedOrder: LastMealOrder = {
        ...lastMeal,
        fulfillmentType: reorderFulfillment,
        deliverySlot: reorderSlot,
        cost: reorderCost,
        phone: reorderPhone.trim(),
        deliveryAddress: reorderAddress.trim(),
        timestamp: new Date().toISOString(),
      };
      saveLastMeal(updatedOrder);

      // Set recent booking for Taste Shield
      const activeBooking = {
        id: insertedBooking?.id || "reorder-" + Date.now().toString(36),
        mealName: mealTier.name,
        vendorName: lastMeal.vendorNode,
        tokensDebited: reorderCost,
        userPhone: reorderPhone.trim(),
        userName: lastMeal.userName || "Campus Student",
        orderCreatedAt: insertedBooking?.created_at || new Date().toISOString(),
        pickupCode: generatedPickupCode,
      };
      setRecentBooking(activeBooking);

      playConfirm();
      toast.success("Last Meal Re-Ordered! ⚡", {
        description: `${reorderCost} Tokens debited for ${reorderSlot} slot at ${lastMeal.vendorNode}. ${generatedPickupCode ? `Fast-Track Code: ${generatedPickupCode}.` : ""} Protected by 50% Taste Shield.`,
        action: {
          label: "🛡️ Rate & Shield",
          onClick: () => setIsTasteShieldOpen(true),
        },
        duration: 7000,
      });

      setIsReorderModalOpen(false);
      setReorderStep(1);
    } catch (err: unknown) {
      console.error("Failed to quick re-order", err);
      // Rollback optimistic balance
      setTokenBalance(prevBalance);
      toast.error("Re-order Failed", {
        description: (err as Error)?.message || "Check network connection.",
      });
    } finally {
      setIsReorderSubmitting(false);
    }
  };

  // Taste Shield Protection State
  const [isTasteShieldOpen, setIsTasteShieldOpen] = useState<boolean>(false);
  const [isCsoSealModalOpen, setIsCsoSealModalOpen] = useState<boolean>(false);
  const [isMealTokenLedgerOpen, setIsMealTokenLedgerOpen] = useState<boolean>(false);
  const [selectedCsoNodeId, setSelectedCsoNodeId] = useState<string | undefined>(undefined);
  const [recentBooking, setRecentBooking] = useState<{
    id: string;
    mealName: string;
    vendorName: string;
    vendorId?: string;
    tokensDebited: number;
    userPhone: string;
    userName?: string;
    orderCreatedAt?: string;
    pickupCode?: string | null;
  }>({
    id: "d3b07384-d113-4c92-9922-a8f828a2b534",
    mealName: "Special Thali",
    vendorName: "Kakadeo Hub - Annapurna Kitchen",
    vendorId: "11111111-1111-1111-1111-111111111111",
    tokensDebited: 60,
    userPhone: "9876543210",
    userName: "Advik Student",
    orderCreatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    pickupCode: "K-42",
  });

  // Cut-off Timer Engine
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isLocked: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLocked: false,
  });

  useEffect(() => {
    const calculateCutoff = () => {
      const now = new Date();
      const target = new Date();

      if (deliverySlot === "Lunch") {
        // Lunch delivery -> Cutoff is 7:00 AM same day
        target.setHours(7, 0, 0, 0);
        if (now.getTime() > target.getTime()) {
          // If past 7 AM today, cutoff moves to tomorrow 7 AM
          target.setDate(target.getDate() + 1);
        }
      } else {
        // Dinner delivery -> Cutoff is 2:00 PM (14:00) same day
        target.setHours(14, 0, 0, 0);
        if (now.getTime() > target.getTime()) {
          target.setDate(target.getDate() + 1);
        }
      }

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isLocked: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isLocked: false });
      }
    };

    calculateCutoff();
    const timer = setInterval(calculateCutoff, 1000);
    return () => clearInterval(timer);
  }, [deliverySlot]);

  const baseCost =
    fulfillmentType === "RoomDelivery" ? selectedMeal.costDelivery : selectedMeal.costPickup;
  const currentCost = baseCost + personalizationDelta;

  // Handle Token Redemption
  const handleRedeemMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tokenBalance < currentCost) {
      toast.error("Insufficient tokens", {
        description: `Need ${currentCost} tokens. Your balance is ${tokenBalance}. Please recharge your wallet below.`,
      });
      return;
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Invalid Phone Number", {
        description: "Please enter a valid 10-digit Indian mobile number.",
      });
      return;
    }

    if (
      fulfillmentType === "RoomDelivery" &&
      (!deliveryAddress || deliveryAddress.trim().length < 5)
    ) {
      toast.error("Delivery Address Required", {
        description: "Please provide a complete Hostel/PG name and room number.",
      });
      return;
    }

    const prevBalance = tokenBalance;
    // Optimistic balance debit for zero perceived latency
    setTokenBalance((prev) => prev - currentCost);
    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const cutoffTime = new Date();
      cutoffTime.setHours(deliverySlot === "Lunch" ? 7 : 14, 0, 0, 0);

      let generatedPickupCode = null;
      if (fulfillmentType === "DineIn_Pickup") {
        generatedPickupCode = "K-" + Math.floor(10 + Math.random() * 90);
      }

      // Capture payload for both supabase and offline queue fallback
      const mealPayload = {
        user_name: userName.trim(),
        user_phone: phone.trim(),
        menu_id: selectedMeal.id,
        vendor_selected: vendorNode,
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === "RoomDelivery" ? deliveryAddress.trim() : null,
        pickup_code: generatedPickupCode,
        meal_date: today ?? null,
        meal_slot: deliverySlot,
        tokens_debited: currentCost,
        vendor_payout: selectedMeal.vendorPayout,
        delivery_runner_payout: fulfillmentType === "RoomDelivery" ? 7 : 0,
        cutoff_time: cutoffTime.toISOString(),
        order_status: "confirmed",
      };

      const { data: insertedBooking, error } = await supabase
        .from("meal_bookings")
        .insert([mealPayload])
        .select("id, created_at")
        .maybeSingle();

      if (error) {
        logSupabaseError({
          table: "meal_bookings",
          operation: "insert",
          error: error,
          context: "TokenMealHub_submitOrder",
        });
        enqueueOfflineSubmission("meal", mealPayload);
      }

      // Register active booking for review & Taste Shield
      const activeBooking = {
        id: insertedBooking?.id || "bk-" + Date.now().toString(36),
        mealName: selectedMeal.name,
        vendorName: vendorNode,
        tokensDebited: currentCost,
        userPhone: phone.trim(),
        userName: userName.trim(),
        orderCreatedAt: insertedBooking?.created_at || new Date().toISOString(),
        pickupCode: generatedPickupCode,
      };
      setRecentBooking(activeBooking);

      // Save last order for 2-step shortcut (Task 61)
      saveLastMeal({
        mealId: selectedMeal.id,
        mealName: selectedMeal.name,
        vendorNode: vendorNode,
        fulfillmentType: fulfillmentType,
        deliverySlot: deliverySlot,
        cost: currentCost,
        phone: phone.trim(),
        userName: userName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        timestamp: new Date().toISOString(),
      });

      playConfirm();
      toast.success("Order Confirmed! 🎉", {
        description: `${currentCost} Tokens debited. Delivery scheduled for ${deliverySlot} slot. ${generatedPickupCode ? `Your Fast-Track Pickup Code is ${generatedPickupCode}.` : ""} Protected by 50% Taste Shield.`,
        action: {
          label: "🛡️ Rate & Shield",
          onClick: () => setIsTasteShieldOpen(true),
        },
        duration: 7000,
      });

      setUserName("");
      setPhone("");
      setDeliveryAddress("");
    } catch (err: unknown) {
      console.error("Failed to submit order", err);
      // Rollback optimistic balance
      setTokenBalance(prevBalance);
      logSupabaseError({
        table: "meal_bookings",
        operation: "insert",
        error: err,
        context: "TokenMealHub_submitOrder_catch",
      });

      const fallbackMealPayload = {
        user_name: userName.trim(),
        user_phone: phone.trim(),
        menu_id: selectedMeal.id,
        vendor_selected: vendorNode,
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === "RoomDelivery" ? deliveryAddress.trim() : null,
        pickup_code: "K-" + Math.floor(10 + Math.random() * 90),
        meal_date: new Date().toISOString().split("T")[0] ?? null,
        meal_slot: deliverySlot,
        tokens_debited: currentCost,
        vendor_payout: selectedMeal.vendorPayout,
        delivery_runner_payout: fulfillmentType === "RoomDelivery" ? 7 : 0,
        cutoff_time: new Date().toISOString(),
        order_status: "confirmed",
      };
      enqueueOfflineSubmission("meal", fallbackMealPayload);

      toast.info("Offline: Order Queued! 📡", {
        description:
          "Your meal token order has been saved locally and will auto-sync once back online.",
      });
      setUserName("");
      setPhone("");
      setDeliveryAddress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRecharge = (tokensToAdd: number, price: number) => {
    setTokenBalance((prev) => prev + tokensToAdd);
    toast.success(`Wallet Recharged!`, {
      description: `Successfully added ${tokensToAdd} Tokens for ₹${price}. (Demo mode)`,
    });
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-12 text-slate-100 font-sans">
      {/* Dynamic Schema.org JSON-LD for Google Search Results (Task 75) */}
      <SaarthiKitchenSchema />

      {/* CAO Intelligent Nudges for Inactive Students (Task 77) */}
      <div className="hidden md:block">
        <IntelligentNudgesWidget />
      </div>

      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Wallet Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                6-Hour Flexible Cut-Off Protocol
              </div>
              <button
                type="button"
                onClick={() => setIsTasteShieldOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
              >
                <span>🛡️ 50% Taste Shield</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  1 Claim/Mo
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setRoommateShareDetails({
                    menuName: selectedMeal.name,
                    price: currentCost,
                    kitchenNode: vendorNode,
                    slot: deliverySlot,
                    description: selectedMeal.description,
                  });
                  setIsRoommateShareOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-teal-500/40 hover:border-teal-400 hover:scale-105 text-teal-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                <span>Share Menu with Roommate 📱</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedCsoNodeId(undefined);
                  setIsCsoSealModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/40 hover:border-amber-400 hover:scale-105 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>CSO Barcode Seal 🛡️</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsMealTokenLedgerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 hover:scale-105 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                <span>Meal Token Ledger 🎟️</span>
              </button>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Hyperlocal <span className="text-emerald-400">Home-Cooked Meals</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Zero monthly lock-ins. Pick up yourself for free or get it delivered to your room for
              +10 tokens. 1 Token = ₹1.
            </p>
          </div>

          {/* Cut-Off Timer Widget (Task 83) */}
          <DeliveryCutoffCountdown
            initialSlot={deliverySlot}
            onSelectSlot={(slot) => setDeliverySlot(slot)}
            className="mt-6"
          />
        </div>

        {/* Live Token Wallet Card (Desktop) */}
        <div className="hidden md:flex bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              <span>Token Wallet</span>
              <span className="text-emerald-400">1 Token = ₹1</span>
            </div>
            <div className="text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
              {tokenBalance} <span className="text-emerald-400 text-lg font-bold">Tokens</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-2 font-medium">
              Quick Top-Up Packages:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {RECHARGE_PACKS.map((pack) => (
                <motion.button
                  key={pack.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    playMicroClick();
                    if (onBook) {
                      onBook({
                        service: "kitchen",
                        note: `Subscription Pack: ${pack.name} (+${pack.tokens} Tokens · ${pack.desc})`,
                        amount: pack.price,
                        mealPlan: pack.id as any,
                      });
                    } else {
                      handleQuickRecharge(pack.tokens, pack.price);
                    }
                  }}
                  className={`p-3 sm:py-3.5 text-center rounded-xl bg-slate-950 border transition-all text-xs cursor-pointer flex flex-col justify-between ${pack.recommended ? "border-emerald-500/50 hover:bg-emerald-500/10" : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"}`}
                >
                  <div className="font-bold text-white text-xs">+{pack.tokens} Tokens</div>
                  <div className="text-xs text-emerald-400 font-semibold mt-1">₹{pack.price}</div>
                  <div className="text-xs text-slate-400 mt-1">{pack.desc}</div>
                </motion.button>
              ))}
            </div>

            {onBook && (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onBook({
                    service: "kitchen",
                    note: "Monthly Homestyle Tiffin Subscription with 100% Escrow",
                    amount: 599,
                    mealPlan: "smart",
                  });
                }}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Subscribe via Official Escrow & StashPass →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Taste Shield Active Protection Banner */}
      <div className="hidden md:flex bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 mb-8 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
            🛡️
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2 flex-wrap">
              <span>StashSaarthi Anti-Fraud Taste Shield Active</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                50% Token Refund Guarantee
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Burnt roti, watery dal, hygiene concern, or cold meal? Snap live camera proof within 2
              hours of meal completion for instant 50% token auto-refund to your wallet (1 verified
              use/month).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsTasteShieldOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Rate Meal & Taste Shield</span>
        </button>
      </div>

      {/* 2-Step "Re-order My Last Meal" Shortcut Bar (Task 61) */}
      <div className="hidden md:block mb-8 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Repeat className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  2-Step Dashboard Shortcut
                </span>
                <span className="text-xs text-slate-400 font-mono">Saved in Session</span>
              </div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Re-Order My Last Meal: <span className="text-emerald-400">{lastMeal.mealName}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-2">
                <span>📍 {lastMeal.vendorNode}</span>
                <span className="text-slate-600">•</span>
                <span>
                  {lastMeal.fulfillmentType === "RoomDelivery"
                    ? "🛵 Room Delivery"
                    : "🏃 Dine-In Pickup"}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-bold text-emerald-300">{lastMeal.cost} Tokens</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPop();
              setReorderStep(1);
              setIsReorderModalOpen(true);
            }}
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>⚡ Re-Order in 2 Taps</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Booking Flow */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-3.5 sm:p-6 shadow-2xl backdrop-blur-sm w-full max-w-full overflow-hidden">
        {/* Fulfillment Segmented Control */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
                1
              </span>
              Fulfillment Preference
            </h3>
            <p className="text-xs text-slate-400 mt-1 ml-8">
              Choose how you want to receive your meal.
            </p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 relative">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playToggle();
                setFulfillmentType("DineIn_Pickup");
              }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors cursor-pointer font-bold text-sm z-10 ${
                fulfillmentType === "DineIn_Pickup"
                  ? "text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {fulfillmentType === "DineIn_Pickup" && (
                <motion.span
                  layoutId="activeFulfillmentType"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-md -z-10"
                />
              )}
              🏪 Self-Pickup (Free)
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playToggle();
                setFulfillmentType("RoomDelivery");
              }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors cursor-pointer font-bold text-sm z-10 ${
                fulfillmentType === "RoomDelivery"
                  ? "text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {fulfillmentType === "RoomDelivery" && (
                <motion.span
                  layoutId="activeFulfillmentType"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-md -z-10"
                />
              )}
              🛵 Room Delivery (+10 T)
            </motion.button>
          </div>
        </div>

        {/* Real-Time Kitchen Node Availability Percentage Bars (Task 60) */}
        <div className="mb-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Real-Time Kitchen Node Availability ({deliverySlot} Slot)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Live token allocation per kitchen node. Select a kitchen node below to order.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
              Live Token Ledger Active
            </span>
          </div>

          <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:grid-cols-2 lg:grid-cols-4 pb-3 no-scrollbar touch-pan-x overscroll-x-contain">
            {KITCHEN_NODES.map((node) => {
              const isSelected = vendorNode === node.name;
              const percentSold =
                deliverySlot === "Lunch" ? node.percentSoldLunch : node.percentSoldDinner;
              const totalTokens =
                deliverySlot === "Lunch" ? node.totalTokensLunch : node.totalTokensDinner;
              const tokensSold =
                deliverySlot === "Lunch" ? node.tokensSoldLunch : node.tokensSoldDinner;
              const tokensLeft = totalTokens - tokensSold;

              return (
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${node.name}, ${node.campus}, ${percentSold}% of ${deliverySlot.toLowerCase()} tokens sold, ${tokensLeft} tokens remaining`}
                  onClick={() => setVendorNode(node.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setVendorNode(node.name);
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-4 border transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 snap-center min-w-[85vw] max-w-[88vw] sm:min-w-0 sm:max-w-none shrink-0 sm:shrink ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 truncate">
                        {node.campus}
                      </span>
                      {node.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${percentSold > 80 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"}`}
                        >
                          {node.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug mb-1 line-clamp-1">
                      {node.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3 line-clamp-1">{node.chefName}</p>
                  </div>

                  <div>
                    {/* Availability Percentage Bar */}
                    <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
                      <span
                        className={
                          percentSold > 80
                            ? "text-rose-400"
                            : percentSold > 60
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }
                      >
                        {percentSold}% of {deliverySlot.toLowerCase()} tokens sold
                      </span>
                      <span className="text-slate-400 font-mono">{tokensLeft} left</span>
                    </div>

                    <div
                      role="progressbar"
                      aria-valuenow={percentSold}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${node.name} ${deliverySlot.toLowerCase()} token availability: ${percentSold}% sold`}
                      className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentSold > 80
                            ? "bg-gradient-to-r from-rose-500 to-amber-500"
                            : percentSold > 60
                              ? "bg-gradient-to-r from-amber-400 to-emerald-400"
                              : "bg-gradient-to-r from-emerald-500 to-teal-400"
                        }`}
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 bg-emerald-500/10 py-0.5 rounded border border-emerald-500/20">
                        <span>✓ Selected Kitchen Node</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        setSelectedCsoNodeId(node.id);
                        setIsCsoSealModalOpen(true);
                      }}
                      className="mt-2 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded flex items-center justify-between w-full transition-all cursor-pointer"
                    >
                      <span>🛡️ CSO Verified Seal</span>
                      <span className="text-[9px] text-amber-400 font-extrabold">
                        Inspect Barcode
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Meal Tier Selection */}
        <div className="mb-8 w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
                2
              </span>
              Select Your Menu Tier
            </h3>
            <ThaliPriceVariantToggle />
          </div>

          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 pb-3 no-scrollbar touch-pan-x overscroll-x-contain">
            {MEAL_TIERS.map((tier) => {
              const isSelected = selectedMeal.id === tier.id;
              const tierCost =
                fulfillmentType === "RoomDelivery" ? tier.costDelivery : tier.costPickup;

              return (
                <div
                  key={tier.id}
                  className="snap-center min-w-[85vw] max-w-[88vw] md:min-w-0 md:max-w-none shrink-0 md:shrink"
                >
                  <MealTierCard
                    tier={tier}
                    isSelected={isSelected}
                    tierCost={tierCost}
                    onSelect={setSelectedMeal}
                  />
                </div>
              );
            })}
          </div>

          {/* Micro-Interaction: Peacock Feather Matki Butter Dusting & Personalization (Desktop) */}
          <div className="hidden md:block">
            <PeacockFeatherMatkiDusting
              isAutoTriggered={selectedMeal.id === "standard"}
              className="mt-5"
            />

            {/* Step 2.5: Meal Personalization (Task 78) */}
            <div className="mt-6">
              <MealPersonalizationSelector
                selectedIds={selectedPersonalizations}
                onChange={(ids, delta) => {
                  setSelectedPersonalizations(ids);
                  setPersonalizationDelta(delta);
                }}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Checkout Details */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
              3
            </span>
            Confirm Details & Deduct Tokens
          </h3>

          <form
            onSubmit={handleRedeemMeal}
            className="space-y-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/80"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advik Omer"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="^[6-9]\d{9}$"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="master-kitchen-node"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 cursor-pointer"
                >
                  Select Master Kitchen Node
                </label>
                <select
                  id="master-kitchen-node"
                  aria-label="Select Master Kitchen Node"
                  value={vendorNode}
                  onChange={(e) => setVendorNode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm cursor-pointer appearance-none"
                >
                  {KITCHEN_NODES.map((node) => {
                    const percentSold =
                      deliverySlot === "Lunch" ? node.percentSoldLunch : node.percentSoldDinner;
                    const totalTokens =
                      deliverySlot === "Lunch" ? node.totalTokensLunch : node.totalTokensDinner;
                    const tokensSold =
                      deliverySlot === "Lunch" ? node.tokensSoldLunch : node.tokensSoldDinner;
                    const tokensLeft = totalTokens - tokensSold;
                    return (
                      <option key={node.id} value={node.name}>
                        {node.name} ({percentSold}% {deliverySlot} Sold • {tokensLeft} Tokens Left)
                      </option>
                    );
                  })}
                </select>
              </div>

              {fulfillmentType === "RoomDelivery" ? (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label
                    htmlFor="delivery-address-input"
                    className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="delivery-address-input"
                    type="text"
                    required
                    aria-label="Room delivery address"
                    placeholder="e.g. Room 204, Sharda PG, Chhapeda Pulia"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
              ) : (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fulfillment Status
                  </label>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 min-h-[46px] flex items-center gap-3">
                    <div className="text-emerald-400 text-lg shrink-0">🏪</div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400">Self-Pickup Active</div>
                      <div className="text-xs text-slate-400">
                        Fast-track pickup at StashShelf with auto-generated 3-digit code.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <div className="flex justify-between md:justify-start items-center gap-4 text-sm text-slate-400">
                  <span>
                    Total Deduction:{" "}
                    <strong className="text-white ml-1">{currentCost} Tokens</strong>
                  </span>
                  <span className="hidden md:inline text-slate-600">|</span>
                  <span>
                    Closing Balance:{" "}
                    <strong
                      className={
                        tokenBalance - currentCost >= 0
                          ? "text-emerald-400 ml-1"
                          : "text-rose-400 ml-1"
                      }
                    >
                      {Math.max(0, tokenBalance - currentCost)} Tokens
                    </strong>
                  </span>
                </div>
                {timeLeft.isLocked && (
                  <div className="text-xs text-rose-400 font-medium">
                    Cutoff time passed. Please select a different slot or try tomorrow.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || timeLeft.isLocked}
                className={`w-full md:w-auto px-10 py-3.5 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${isSubmitting || timeLeft.isLocked ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700" : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 border border-transparent cursor-pointer"}`}
              >
                {isSubmitting
                  ? "Processing Ledger..."
                  : timeLeft.isLocked
                    ? "Slot Locked"
                    : `Redeem Meal & Pay ${currentCost} T`}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2-Step "Re-Order My Last Meal" Shortcut Modal (Task 61) */}
      {isReorderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* Top Header & Close */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Shortcut Step {reorderStep} of 2
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {reorderStep === 1 ? "1. Review & Config" : "2. One-Tap Confirmation"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-emerald-400" />
                  Quick Re-Order Last Meal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full mb-6 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: reorderStep === 1 ? "50%" : "100%" }}
              />
            </div>

            {/* Step 1: Config & Review */}
            {reorderStep === 1 ? (
              <div className="space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{lastMeal.mealName}</h4>
                      <p className="text-xs text-slate-400">{lastMeal.vendorNode}</p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {reorderFulfillment === "RoomDelivery"
                        ? lastMeal.cost
                        : Math.max(50, lastMeal.cost - 10)}{" "}
                      Tokens
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic border-t border-slate-900 pt-2 mt-2">
                    Includes Desi Ghee Phulka, Dal, Sabzi & Homestyle Salad. Protected by 50% Taste
                    Shield.
                  </p>
                </div>

                {/* Slot Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Delivery Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setReorderSlot("Lunch");
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${reorderSlot === "Lunch" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      <span>☀️ Lunch Slot</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setReorderSlot("Dinner");
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${reorderSlot === "Dinner" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      <span>🌙 Dinner Slot</span>
                    </button>
                  </div>
                </div>

                {/* Fulfillment Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setReorderFulfillment("RoomDelivery");
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${reorderFulfillment === "RoomDelivery" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      <span>🛵 Room Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setReorderFulfillment("DineIn_Pickup");
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${reorderFulfillment === "DineIn_Pickup" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      <span>🏃 Fast Pickup (-10 T)</span>
                    </button>
                  </div>
                </div>

                {/* Phone & Address Inputs */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={reorderPhone}
                      onChange={(e) => setReorderPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  {reorderFulfillment === "RoomDelivery" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Room / Hostel Address
                      </label>
                      <input
                        type="text"
                        value={reorderAddress}
                        onChange={(e) => setReorderAddress(e.target.value)}
                        placeholder="e.g. Room 204, Hostel 4, CSJMU / IITK Belt"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setReorderStep(2);
                  }}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <span>Proceed to Step 2: One-Tap Confirm →</span>
                </button>
              </div>
            ) : (
              /* Step 2: One-Tap Confirmation */
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Ready for 1-Tap Execution</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Re-ordering <strong className="text-emerald-400">{lastMeal.mealName}</strong>{" "}
                    for <strong className="text-emerald-400">{reorderSlot} slot</strong> at{" "}
                    {lastMeal.vendorNode}.
                  </p>
                </div>

                {/* Token Deduction Visualizer */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Current Balance:</span>
                    <span className="text-white font-bold">{tokenBalance} Tokens</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Re-order Deduction:</span>
                    <span className="font-bold">
                      -
                      {reorderFulfillment === "RoomDelivery"
                        ? lastMeal.cost
                        : Math.max(50, lastMeal.cost - 10)}{" "}
                      Tokens
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-emerald-400 text-sm font-extrabold">
                    <span>Remaining Balance:</span>
                    <span>
                      {tokenBalance -
                        (reorderFulfillment === "RoomDelivery"
                          ? lastMeal.cost
                          : Math.max(50, lastMeal.cost - 10))}{" "}
                      Tokens
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReorderStep(1)}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={isReorderSubmitting}
                    onClick={handleQuickReorderSubmit}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    {isReorderSubmitting ? "Debiting Ledger..." : "⚡ Tap 2: Confirm Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* StashSaarthi Anti-Fraud Taste Shield & Meal Review Modal */}
      {recentBooking && (
        <TasteShieldModal
          open={isTasteShieldOpen}
          onOpenChange={setIsTasteShieldOpen}
          booking={recentBooking}
          onRefundSuccess={(refundTokens) => {
            setTokenBalance((prev) => prev + refundTokens);
          }}
        />
      )}

      {/* Customizable WhatsApp Roommate Menu Share Modal (Task 73) */}
      <RoommateMenuShareModal
        open={isRoommateShareOpen}
        onOpenChange={setIsRoommateShareOpen}
        defaultDetails={roommateShareDetails}
      />

      {/* CSO Kitchen Review & Barcode Seal Modal (Task 89) */}
      <CsoKitchenSealModal
        isOpen={isCsoSealModalOpen}
        onClose={() => setIsCsoSealModalOpen(false)}
        initialNodeId={selectedCsoNodeId}
      />

      {/* Cryptographic Meal Token Ledger Modal (Task 132) */}
      <MealTokenLedgerModal
        isOpen={isMealTokenLedgerOpen}
        onClose={() => setIsMealTokenLedgerOpen(false)}
        userPhone={phone || "9369454350"}
        userName={userName || "Rahul Sharma (IIT Kanpur)"}
      />
    </section>
  );
};
