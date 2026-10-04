/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback, useEffect, lazy, Suspense, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { motion, useScroll, useTransform } from "framer-motion";

import { AmbientNodes } from "@/components/ui/AmbientNodes";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "@/components/stash/types";

import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeSolutions } from "@/components/home/HomeSolutions";
import { HomeDeepModules } from "@/components/home/HomeDeepModules";
import { HomeFooterAndModals } from "@/components/home/HomeFooterAndModals";

const CalculatorHub = lazy(() => import("@/components/stash/CalculatorHub").then((m) => ({ default: m.CalculatorHub })));
const PredictivePersonaWidget = lazy(() => import("@/components/stash/PredictivePersonaWidget").then((m) => ({ default: m.PredictivePersonaWidget })));
const StashVault = lazy(() => import("@/components/dashboard/StashVault").then((m) => ({ default: m.StashVault })));
const HostInventoryGrid = lazy(() => import("@/components/stash/HostInventoryGrid").then((m) => ({ default: m.HostInventoryGrid })));

const TITLE = "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Co-Living";
const DESC =
  "Official website of StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform. Vacation luggage storage at ₹300/bag/mo, verified verified PG owner-hosted rooms, and homemade tiffins.";
const URL = "https://stashsaarthi-web.vercel.app/";
const OG_IMAGE = "https://stashsaarthi-web.vercel.app/images/og-banner-new.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "StashSaarthi" },
      { property: "og:site_name", content: "StashSaarthi" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Index,
});

function Index() {
  const { role, setRole } = usePersona();
  const [booking, setBooking] = useState(false);
  const [listing, setListing] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const open = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setBooking(true);
  }, []);

  const handleBookDefault = useCallback(() => {
    open();
  }, [open]);

  const handleListRoom = useCallback(() => setListing(true), []);
  const handleEarlyAccess = useCallback(() => setEarlyAccess(true), []);
  const handleRefer = useCallback(() => setReferralOpen(true), []);

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEv = e as CustomEvent<{ service?: string; promoCode?: string; note?: string }>;
      if (customEv.detail) {
        open({
          service: customEv.detail.service,
          note:
            customEv.detail.note ||
            (customEv.detail.promoCode
              ? `Applied Offer Code ${customEv.detail.promoCode}: Flat ₹50 Discount`
              : undefined),
        });
      } else {
        open();
      }
    };
    window.addEventListener("stashsaarthi:open-booking", handleOpenBooking);
    return () => window.removeEventListener("stashsaarthi:open-booking", handleOpenBooking);
  }, [open]);

  return (
    <motion.main
      id="main-content"
      tabIndex={-1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen w-full max-w-full overflow-x-clip bg-transparent text-white transition-colors duration-500 focus:outline-none pt-16 sm:pt-20 pb-24 sm:pb-0"
    >
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <HomeHeroSection
        role={role}
        setRole={setRole}
        onBookDefault={handleBookDefault}
        onBook={open}
        onListRoom={handleListRoom}
        onEarlyAccess={handleEarlyAccess}
        onRefer={handleRefer}
      />

      <WorkspacePartitions 
        role={role} 
        onBook={open} 
        onListRoom={handleListRoom} 
        onRefer={handleRefer} 
      />

      <HomeFooterAndModals
        role={role}
        booking={booking}
        setBooking={setBooking}
        listing={listing}
        setListing={setListing}
        earlyAccess={earlyAccess}
        setEarlyAccess={setEarlyAccess}
        referralOpen={referralOpen}
        setReferralOpen={setReferralOpen}
        prefill={prefill}
        onBook={open}
        onRefer={handleRefer}
      />
    </motion.main>
  );
}

const TABS = [
  { id: "explore", label: "📦 Explore Stashes & Rooms" },
  { id: "savings", label: "🧮 Savings & AI Estimator" },
  { id: "liquidation", label: "🔥 Campus Liquidation (50% Off)" },
  { id: "host", label: "🏠 Host & Earn" },
] as const;

function WorkspacePartitions({ role, onBook, onListRoom, onRefer }: any) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("explore");

  return (
    <div className="w-full mt-8 mb-16 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 mb-8">
        <div className="flex overflow-x-auto snap-x space-x-3 pb-2 scrollbar-hide items-center justify-start md:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap snap-center transition-all ${
                activeTab === tab.id ? "text-black shadow-lg" : "text-white/60 hover:text-white bg-white/5 border border-white/10"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeWorkspaceTab"
                  className="absolute inset-0 bg-emerald-400 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 min-h-[50vh]">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === "explore" && (
            <div className="space-y-16">
              <HomeSolutions onBook={onBook} onListRoom={onListRoom} />
              <HomeDeepModules role={role} onBook={onBook} onRefer={onRefer} />
            </div>
          )}

          {activeTab === "savings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">Live Calculator</h3>
                <Suspense fallback={null}>
                  <CalculatorHub onBook={onBook} />
                </Suspense>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Predictive Persona</h3>
                <Suspense fallback={null}>
                  <PredictivePersonaWidget />
                </Suspense>
              </div>
            </div>
          )}

          {activeTab === "liquidation" && (
            <div className="w-full">
              <Suspense fallback={null}>
                <StashVault />
              </Suspense>
            </div>
          )}

          {activeTab === "host" && (
            <div className="space-y-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12">
                <h3 className="text-3xl font-bold text-amber-400 mb-6 text-center">Host Inventory Command</h3>
                <Suspense fallback={null}>
                  <HostInventoryGrid />
                </Suspense>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
