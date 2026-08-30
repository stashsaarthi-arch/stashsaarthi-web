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
      className={`relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-slate-100 overflow-hidden font-sans ${className}`}
    >
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* =================================================================== */}
        {/* 1. HEADER SECTION                                                  */}
        {/* =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Eyebrow Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent & Value-Driven Pricing</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ghar Jaisa Khana,{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              Pocket-Friendly Daam.
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Freshly prepared, balanced nutrition, delivered hot to your doorstep. Choose a flexible
            plan that fits your everyday appetite and schedule.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center justify-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setBillingCycle("single")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                billingCycle === "single"
                  ? "bg-slate-800 text-white shadow-md border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Single Meal Trial
            </button>

            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Monthly Subscription</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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

        {/* =================================================================== */}
        {/* 2. PRICING CARDS GRID (3 Responsive Columns)                        */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {plans.map((plan) => {
            const isFeatured = plan.popular;

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col rounded-3xl p-7 transition-all duration-300 transform hover:-translate-y-1.5 ${
                  isFeatured
                    ? "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#121A2D] border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/30 lg:-translate-y-2 lg:hover:-translate-y-3.5"
                    : "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 shadow-xl hover:shadow-2xl"
                }`}
              >
                {/* Popular Highlight Ribbon */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      Most Popular & Balanced
                    </span>
                  </div>
                )}

                {/* Card Header & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${plan.tagColor}`}
                  >
                    {plan.tag}
                  </span>
                  {plan.id === "standard" && (
                    <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Budget Pick
                    </span>
                  )}
                  {plan.id === "corporate" && (
                    <span className="text-xs text-cyan-400 font-mono font-medium flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5" /> For Teams
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <div className="flex items-baseline gap-1.5">
                        {billingCycle === "single" ? (
                          <>
                            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                              ₹{plan.singlePrice}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-400 font-medium">
                              {plan.singlePeriod}
                            </span>
                          </>
                        ) : (
                          <>
                            {typeof plan.monthlyPrice === "number" ? (
                              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                                ₹{plan.monthlyPrice.toLocaleString("en-IN")}
                              </span>
                            ) : (
                              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                                {plan.monthlyPrice}
                              </span>
                            )}
                            <span className="text-xs sm:text-sm text-slate-400 font-medium">
                              {plan.monthlyPeriod}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="mt-1 text-xs font-mono font-semibold text-emerald-400">
                        {plan.monthlySavings}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Features Divider */}
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-2">
                  <span>What&apos;s Included</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isFeatured
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Call-To-Action Button */}
                <button
                  onClick={() => handleSelect(plan.id)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* 3. VALUE JUSTIFICATION & TRUST BAR (3-Column ROI Strip)             */}
        {/* =================================================================== */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Value Pillar 1 */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4 first:pl-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">100% Home Hygiene</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Cooked with cold-pressed oils, zero soda or artificial food colors, and prepared
                  in RO-purified water kitchens.
                </p>
              </div>
            </div>

            {/* Value Pillar 2 */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Cheaper than Ordering Out</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Save ₹100+ per meal compared to restaurant food delivery apps while eating light,
                  easy-to-digest daily food.
                </p>
              </div>
            </div>

            {/* Value Pillar 3 */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4 last:pr-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Punctual Hot Delivery</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Guaranteed arrival 15 minutes before standard lunch (12:30 PM) and dinner (8:00
                  PM) slots in thermal insulated boxes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Sub-Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            <span>
              All meals are prepared fresh in small batches by verified senior homemakers & trained
              cooks. No preservatives.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
