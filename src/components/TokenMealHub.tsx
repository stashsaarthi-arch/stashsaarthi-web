import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSupabaseError } from "@/lib/supabaseLogger";
import { toast } from 'sonner';
import { TasteShieldModal } from './TasteShieldModal';

type FulfillmentType = 'DineIn_Pickup' | 'RoomDelivery';

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
        id: 'standard',
        name: 'Standard Thali',
        costPickup: 50,
        costDelivery: 60,
        vendorPayout: 44,
        description: '4 Roti, Dal, Sabzi, Rice, Salad',
        badge: 'Everyday Basic',
    },
    {
        id: 'special',
        name: 'Special Thali',
        costPickup: 60,
        costDelivery: 70,
        vendorPayout: 53,
        description: 'Butter Roti, Special Curry, Dal, Rice, Sweet',
        badge: 'Student Choice',
        popular: true,
    },
    {
        id: 'paneer',
        name: 'Paneer Thali',
        costPickup: 70,
        costDelivery: 80,
        vendorPayout: 61,
        description: 'Premium Paneer Sabzi, Butter Roti, Dal Makhani, Jeera Rice, Sweet',
        badge: 'High Protein',
    },
    {
        id: 'sunday',
        name: 'Sunday Cheat Meal',
        costPickup: 85,
        costDelivery: 95,
        vendorPayout: 73,
        description: 'Chef\'s Special Feast (Menu changes weekly)',
        badge: 'Weekend Special',
    },
];

const RECHARGE_PACKS = [
    { id: 'trial', name: 'Starter Trial', price: 300, tokens: 300, desc: '15 Days Validity' },
    { id: 'smart', name: 'Smart Hopper', price: 599, tokens: 625, desc: '30 Days Validity', recommended: true },
    { id: 'freedom', name: 'Monthly Freedom', price: 1449, tokens: 1550, desc: '45 Days Validity' },
    { id: 'semester', name: 'Semester Pro', price: 2799, tokens: 3050, desc: '60 Days Validity' },
];

export const TokenMealHub: React.FC = () => {
    // Wallet State
    const [tokenBalance, setTokenBalance] = useState<number>(450); // Demo user balance
    const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('DineIn_Pickup');
    const [selectedMeal, setSelectedMeal] = useState<MealOption>(MEAL_TIERS[1] as MealOption);
    const [vendorNode, setVendorNode] = useState<string>('Kakadeo Hub - Annapurna Kitchen');
    const [deliverySlot, setDeliverySlot] = useState<'Lunch' | 'Dinner'>('Dinner');
    const [phone, setPhone] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [deliveryAddress, setDeliveryAddress] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Taste Shield Protection State
    const [isTasteShieldOpen, setIsTasteShieldOpen] = useState<boolean>(false);
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
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isLocked: boolean }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isLocked: false,
    });

    useEffect(() => {
        const calculateCutoff = () => {
            const now = new Date();
            const target = new Date();

            if (deliverySlot === 'Lunch') {
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

    const currentCost = fulfillmentType === 'RoomDelivery' ? selectedMeal.costDelivery : selectedMeal.costPickup;

    // Handle Token Redemption
    const handleRedeemMeal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (tokenBalance < currentCost) {
            toast.error('Insufficient tokens', {
                description: `Need ${currentCost} tokens. Your balance is ${tokenBalance}. Please recharge your wallet below.`,
            });
            return;
        }

        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            toast.error('Invalid Phone Number', {
                description: 'Please enter a valid 10-digit Indian mobile number.',
            });
            return;
        }

        if (fulfillmentType === 'RoomDelivery' && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
            toast.error('Delivery Address Required', {
                description: 'Please provide a complete Hostel/PG name and room number.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            const cutoffTime = new Date();
            cutoffTime.setHours(deliverySlot === 'Lunch' ? 7 : 14, 0, 0, 0);

            let generatedPickupCode = null;
            if (fulfillmentType === 'DineIn_Pickup') {
                generatedPickupCode = 'K-' + Math.floor(10 + Math.random() * 90);
            }

            // Strictly typed payload insert
            const { data: insertedBooking, error } = await supabase
                .from('meal_bookings')
                .insert([
                    {
                        user_name: userName.trim(),
                        user_phone: phone.trim(),
                        menu_id: selectedMeal.id,
                        vendor_selected: vendorNode,
                        fulfillment_type: fulfillmentType,
                        delivery_address: fulfillmentType === 'RoomDelivery' ? deliveryAddress.trim() : null,
                        pickup_code: generatedPickupCode,
                        meal_date: today ?? null,
                        meal_slot: deliverySlot,
                        tokens_debited: currentCost,
                        vendor_payout: selectedMeal.vendorPayout,
                        delivery_runner_payout: fulfillmentType === 'RoomDelivery' ? 7 : 0,
                        cutoff_time: cutoffTime.toISOString(),
                        order_status: 'confirmed',
                    },
                ])
                .select('id, created_at')
                .maybeSingle();

            if (error) {
                logSupabaseError({ table: "meal_bookings", operation: "insert", error: error, context: "TokenMealHub_submitOrder" });
                throw error;
            }

            // Deduct balance locally
            setTokenBalance((prev) => prev - currentCost);

            // Register active booking for review & Taste Shield
            const activeBooking = {
                id: insertedBooking?.id || ("bk-" + Date.now().toString(36)),
                mealName: selectedMeal.name,
                vendorName: vendorNode,
                tokensDebited: currentCost,
                userPhone: phone.trim(),
                userName: userName.trim(),
                orderCreatedAt: insertedBooking?.created_at || new Date().toISOString(),
                pickupCode: generatedPickupCode,
            };
            setRecentBooking(activeBooking);

            toast.success('Order Confirmed! 🎉', {
                description: `${currentCost} Tokens debited. Delivery scheduled for ${deliverySlot} slot. ${generatedPickupCode ? `Your Fast-Track Pickup Code is ${generatedPickupCode}.` : ''} Protected by 50% Taste Shield.`,
                action: {
                    label: '🛡️ Rate & Shield',
                    onClick: () => setIsTasteShieldOpen(true),
                },
                duration: 7000,
            });

            setUserName('');
            setPhone('');
            setDeliveryAddress('');
        } catch (err: unknown) {
            console.error('Failed to submit order', err);
            logSupabaseError({ table: "meal_bookings", operation: "insert", error: err, context: "TokenMealHub_submitOrder_catch" });
            toast.error('Failed to submit order', {
                description: (err as Error)?.message || 'Check your internet connection.',
            });
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

    return (
        <section className="relative w-full max-w-6xl mx-auto px-4 py-12 text-slate-100 font-sans">
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
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">1 Claim/Mo</span>
                            </button>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">
                            Hyperlocal <span className="text-emerald-400">Token Meal Engine</span>
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-xl">
                            Zero monthly lock-ins. Pick up yourself for free or get it delivered to your room for +10 tokens. 1 Token = ₹1.
                        </p>
                    </div>

                    {/* Cut-Off Timer Widget */}
                    <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Window:</span>
                            <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
                                <button
                                    type="button"
                                    onClick={() => setDeliverySlot('Lunch')}
                                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${deliverySlot === 'Lunch' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Lunch (1 PM)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliverySlot('Dinner')}
                                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${deliverySlot === 'Dinner' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Dinner (8 PM)
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Order cutoff in:</span>
                            <span className={`font-mono text-base font-bold ${timeLeft.isLocked ? 'text-red-400' : 'text-amber-400'}`}>
                                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Live Token Wallet Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
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
                        <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Top-Up Packages:</span>
                        <div className="grid grid-cols-2 gap-2">
                            {RECHARGE_PACKS.map((pack) => (
                                <button
                                    key={pack.id}
                                    type="button"
                                    onClick={() => handleQuickRecharge(pack.tokens, pack.price)}
                                    className={`p-2 text-center rounded-xl bg-slate-950 border transition-all text-xs cursor-pointer ${pack.recommended ? 'border-emerald-500/50 hover:bg-emerald-500/10' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}`}
                                >
                                    <div className="font-bold text-white">+{pack.tokens} Tokens</div>
                                    <div className="text-[10px] text-emerald-400 font-medium">₹{pack.price}</div>
                                    <div className="text-[9px] text-slate-500 mt-0.5">{pack.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Taste Shield Active Protection Banner */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
                        🛡️
                    </div>
                    <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-2">
                            <span>StashSaarthi Anti-Fraud Taste Shield Active</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                50% Token Refund Guarantee
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            Burnt roti, watery dal, hygiene concern, or cold meal? Snap live camera proof within 2 hours of meal completion for instant 50% token auto-refund to your wallet (1 verified use/month).
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsTasteShieldOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 hover:scale-102"
                >
                    <span>⭐ Rate Meal & Taste Shield</span>
                </button>
            </div>

            {/* Main Interactive Booking Flow */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                
                {/* Fulfillment Segmented Control */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
                                1
                            </span>
                            Fulfillment Preference
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 ml-8">Choose how you want to receive your meal.</p>
                    </div>
                    <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                        <button
                            type="button"
                            onClick={() => setFulfillmentType('DineIn_Pickup')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold text-sm ${fulfillmentType === 'DineIn_Pickup' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            🏪 Self-Pickup (Free)
                        </button>
                        <button
                            type="button"
                            onClick={() => setFulfillmentType('RoomDelivery')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold text-sm ${fulfillmentType === 'RoomDelivery' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            🛵 Room Delivery (+10 T)
                        </button>
                    </div>
                </div>

                {/* Step 2: Meal Tier Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
                            2
                        </span>
                        Select Your Menu Tier
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MEAL_TIERS.map((tier) => {
                            const isSelected = selectedMeal.id === tier.id;
                            const tierCost = fulfillmentType === 'RoomDelivery' ? tier.costDelivery : tier.costPickup;
                            
                            return (
                                <div
                                    key={tier.id}
                                    onClick={() => setSelectedMeal(tier)}
                                    className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${isSelected
                                            ? 'bg-slate-900 border-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] transform -translate-y-1'
                                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                        }`}
                                >
                                    {tier.badge && (
                                        <span
                                            className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${tier.popular
                                                    ? 'bg-emerald-500 text-slate-950'
                                                    : 'bg-slate-800 text-slate-300'
                                                }`}
                                        >
                                            {tier.badge}
                                        </span>
                                    )}

                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4">
                                        {tier.name}
                                    </div>
                                    <div className="text-3xl font-black text-white mb-3">
                                        {tierCost} <span className="text-xs font-bold text-emerald-400">Tokens</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{tier.description}</p>
                                </div>
                            );
                        })}
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

                    <form onSubmit={handleRedeemMeal} className="space-y-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
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
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Select Master Kitchen Node
                                </label>
                                <select
                                    value={vendorNode}
                                    onChange={(e) => setVendorNode(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm cursor-pointer appearance-none"
                                >
                                    <option value="Kakadeo Hub - Annapurna Kitchen">Kakadeo Hub - Annapurna Kitchen</option>
                                    <option value="CSJMU Kalyanpur - Dadi Maa Rasoi">CSJMU Kalyanpur - Dadi Maa Rasoi</option>
                                    <option value="IIT Kanpur Gate 1 - Campus Senior Mess">IIT Kanpur Gate 1 - Campus Senior Mess</option>
                                    <option value="HBTI Nawabganj - Shanti Home Food">HBTI Nawabganj - Shanti Home Food</option>
                                </select>
                            </div>
                            
                            {fulfillmentType === 'RoomDelivery' ? (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        Delivery Address <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Room 204, Sharda PG, Chhapeda Pulia"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                                    />
                                </div>
                            ) : (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in duration-300">
                                    <div className="text-emerald-400 mt-0.5">🏪</div>
                                    <div>
                                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Self-Pickup Active</div>
                                        <div className="text-xs text-slate-400">Fast-track pickup available at StashShelf with your auto-generated 3-digit pickup code.</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col gap-1 w-full md:w-auto">
                                <div className="flex justify-between md:justify-start items-center gap-4 text-sm text-slate-400">
                                    <span>Total Deduction: <strong className="text-white ml-1">{currentCost} Tokens</strong></span>
                                    <span className="hidden md:inline text-slate-600">|</span>
                                    <span>Closing Balance: <strong className={tokenBalance - currentCost >= 0 ? "text-emerald-400 ml-1" : "text-rose-400 ml-1"}>{Math.max(0, tokenBalance - currentCost)} Tokens</strong></span>
                                </div>
                                {timeLeft.isLocked && (
                                    <div className="text-xs text-rose-400 font-medium">Cutoff time passed. Please select a different slot or try tomorrow.</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || timeLeft.isLocked}
                                className={`w-full md:w-auto px-10 py-3.5 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${isSubmitting || timeLeft.isLocked ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 border border-transparent cursor-pointer'}`}
                            >
                                {isSubmitting ? 'Processing Ledger...' : timeLeft.isLocked ? 'Slot Locked' : `Redeem Meal & Pay ${currentCost} T`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
        </section>
    );
};