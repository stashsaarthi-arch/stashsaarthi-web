import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Sparkles,
  Flame,
  ShieldCheck,
  TrendingDown,
  Clock,
  ArrowRight,
  Utensils,
  Leaf,
  HeartHandshake,
} from "lucide-react";

interface MealPricingProps {
  onSelectPlan?: (planId: string, billingCycle: "single" | "monthly") => void;
  className?: string;
}

export function MealPricing({ onSelectPlan, className = "" }: MealPricingProps) {
  const [billingCycle, setBillingCycle] = useState<"single" | "monthly">("monthly");

  const plans = [
    {
      id: "standard",
      name: "Standard Everyday",
      tag: "Daily Essential",
      tagColor: "text-slate-400 bg-slate-800/60 border-slate-700/50",
      description:
        "Simple, wholesome, low-oil everyday meals crafted for healthy daily sustenance.",
      singlePrice: 69,
      singlePeriod: "/ meal",
      monthlyPrice: 3499,
      monthlyPeriod: "/ mo (2 meals/day)",
      monthlySavings: "Save ₹641/mo",
      popular: false,
      features: [
        "4 Fresh Whole Wheat Rotis (No Maida)",
        "Dal Tadka / Homestyle Yellow Dal",
        "1 Seasonal Sabzi (Dry / Sukhi Sabzi)",
        "Steamed Basmati Rice",
        "Fresh Onion-Cucumber Salad & Pickle",
        "Eco-friendly, recyclable food-grade packaging",
      ],
      ctaText: "Choose Standard",
      accent: "slate",
    },
    {
      id: "executive",
      name: "Executive Special",
      tag: "🔥 Most Popular & Balanced",
      tagColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      description:
        "Richer variety, premium ingredients & curated rotation menus for working professionals.",
      singlePrice: 90,
      singlePeriod: "/ meal",
      monthlyPrice: 4599,
      monthlyPeriod: "/ mo (2 meals/day)",
      monthlySavings: "Save ₹801/mo · Top Choice",
      popular: true,
      features: [
        "4 Ghee-brushed Soft Wheat Rotis",
        "1 Special Gravy (Paneer / Kofta / Dal Makhani)",
        "1 Dry Seasonal Sabzi",
        "Long Grain Jeera / Vegetable Pulao Rice",
        "Fresh Curd (Dahi) or Dessert on alternate days",
        "Leak-proof 4-compartment hot-seal meal tray",
        "Priority Doorstep Delivery (Hot & Fresh)",
      ],
      ctaText: "Order Executive Meal",
      accent: "amber",
    },
    {
      id: "corporate",
      name: "Custom Flexi / Corporate",
      tag: "Flexible & Bulk",
      tagColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      description:
        "Tailored for teams, PG accommodations, or specialized dietary needs (Jain / High-Protein).",
      singlePrice: 75,
      singlePeriod: "starting / meal",
      monthlyPrice: "Custom",
      monthlyPeriod: "based on volume & team size",
      monthlySavings: "Volume Tier Discounts",
      popular: false,
      features: [
        "Fully customizable daily menu rotation",
        "High-protein & special dietary options (No onion-garlic available)",
        "1-Click pause / resume subscription anytime",
        "Dedicated campus & office delivery window",
        "Centralized monthly GST invoicing & billing",
        "Dedicated relationship manager & tasting trial",
      ],
      ctaText: "Contact for Custom Plan",
      accent: "emerald",
    },
  ];

  const handleSelect = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId, billingCycle);
    }
  };

  return (
    <section
      id="meal-plans"
      className={`relative w-full py-2 px-2 sm:px-4 text-slate-100 font-sans ${className}`}
    >
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Billing Switcher */}
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center justify-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setBillingCycle("single")}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                billingCycle === "single"
                  ? "bg-slate-800 text-white shadow-md border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Single Meal Trial
            </button>

            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Monthly Subscription</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  billingCycle === "monthly"
                    ? "bg-slate-950/90 text-amber-300"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* PRICING CARDS GRID (3 Responsive Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mb-6">
          {plans.map((plan) => {
            const isFeatured = plan.popular;

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                  isFeatured
                    ? "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#121A2D] border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30"
                    : "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 shadow-lg"
                }`}
              >
                {/* Popular Highlight Ribbon */}
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-500/30">
                      <Flame className="w-3 h-3 fill-current" />
                      Most Popular & Balanced
                    </span>
                  </div>
                )}

                {/* Card Header & Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${plan.tagColor}`}
                  >
                    {plan.tag}
                  </span>
                  {plan.id === "standard" && (
                    <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Budget Pick
                    </span>
                  )}
                  {plan.id === "corporate" && (
                    <span className="text-[11px] text-cyan-400 font-mono font-medium flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3" /> For Teams
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black tracking-tight text-white font-mono">
                      ₹{billingCycle === "single" ? plan.singlePrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5 font-medium">
                      {billingCycle === "single" ? plan.singlePeriod : plan.monthlyPeriod}
                    </span>
                  </div>
                  {billingCycle === "monthly" && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {plan.monthlySavings}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-4 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelect(plan.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* VALUE JUSTIFICATION & TRUST BAR (3-Column ROI Strip) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Value Pillar 1 */}
            <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3 first:pl-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">100% Home Hygiene</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cooked with cold-pressed oils, zero soda, in RO-purified water kitchens.
                </p>
              </div>
            </div>

            {/* Value Pillar 2 */}
            <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Cheaper than Ordering Out</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Save ₹100+ per meal compared to food delivery apps while eating light home food.
                </p>
              </div>
            </div>

            {/* Value Pillar 3 */}
            <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3 last:pr-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Punctual Hot Delivery</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Guaranteed arrival before standard lunch (12:30 PM) and dinner (8:00 PM) slots.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Sub-Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Utensils className="w-3 h-3" />
            <span>
              All meals are prepared fresh in small batches by verified senior homemakers & trained cooks. No preservatives.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
