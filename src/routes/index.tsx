/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback, useEffect, lazy, Suspense, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

import { AmbientNodes } from "@/components/ui/AmbientNodes";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { usePersona } from "@/context/PersonaContext";
import type { BookingPrefill } from "@/components/stash/types";

import { ShieldAlert } from "lucide-react";
import { AadhaarKycModal } from "@/components/host/AadhaarKycModal";
import { HostStashVerificationModal } from "@/components/stash/HostStashVerificationModal";

import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeSolutions } from "@/components/home/HomeSolutions";
import { HomeDeepModules } from "@/components/home/HomeDeepModules";
import { HomeFooterAndModals } from "@/components/home/HomeFooterAndModals";
import { MascotGuide } from "@/components/common/MascotGuide";

const CalculatorHub = lazy(() =>
  import("@/components/stash/CalculatorHub").then((m) => ({ default: m.CalculatorHub })),
);
const PredictivePersonaWidget = lazy(() =>
  import("@/components/stash/PredictivePersonaWidget").then((m) => ({
    default: m.PredictivePersonaWidget,
  })),
);
const StashVault = lazy(() =>
  import("@/components/dashboard/StashVault").then((m) => ({ default: m.StashVault })),
);
const HostInventoryGrid = lazy(() =>
  import("@/components/stash/HostInventoryGrid").then((m) => ({ default: m.HostInventoryGrid })),
);

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

      {/* COMPACT TRUST BAR & TESTIMONIALS */}
      {role === 'student' && (
        <div className="max-w-[1600px] mx-auto px-4 mb-16 space-y-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏛️</span>
              <p className="text-white/80 font-medium">
                <strong className="text-white">Student-Governed Charter:</strong> Backed by verified student representatives across IITK, HBTI, CSJMU & Kakadeo.
              </p>
            </div>
            <button onClick={() => window.dispatchEvent(new Event('stashsaarthi:open-forum'))} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all whitespace-nowrap">
              View Council Resolutions & Forum
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white pl-2">Real Stories</h3>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x snap-mandatory">
              {[
                { name: 'Rahul S.', tag: 'IIT Kanpur', quote: 'Saved ₹12k over the summer. Totally seamless.' },
                { name: 'Anjali M.', tag: 'HBTI', quote: 'Zero brokerage rooms actually exist! Very safe.' },
                { name: 'Vikram K.', tag: 'Kakadeo', quote: 'Tiffin is exactly like home. No oil dripping.' },
                { name: 'Priya D.', tag: 'CSJMU', quote: 'Kept my luggage for 2 months. Not a scratch.' }
              ].map((t, i) => (
                <div key={i} className="min-w-[280px] bg-[#0A0D0F] border border-white/10 rounded-2xl p-5 snap-center">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs px-2 py-1 bg-white/10 text-emerald-400 rounded-md font-bold">{t.tag}</div>
                  </div>
                  <p className="text-white/60 text-sm italic">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
  { id: "storage", label: "📦 Micro-Storage" },
  { id: "rooms", label: "🏠 Broker-Free Rooms" },
  { id: "khana", label: "🍱 Ghar Ka Khana" },
] as const;

import { StorageServiceTab } from "@/components/stash/StorageServiceTab";
import { RoomsServiceTab } from "@/components/stash/RoomsServiceTab";
import { TokenMealHub } from "@/components/TokenMealHub";
import { CalculatorModal } from "@/components/stash/CalculatorModal";
import { ForumModal } from "@/components/stash/ForumModal";

function WorkspacePartitions({ role, onBook, onListRoom, onRefer }: any) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("storage");
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [forumOpen, setForumOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#rooms") setActiveTab("rooms");
      else if (hash === "#khana") setActiveTab("khana");
      else setActiveTab("storage");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    const handleCustomNav = (e: Event) => {
      const target = (e as CustomEvent).detail;
      if (target === "rooms") setActiveTab("rooms");
      else if (target === "khana") setActiveTab("khana");
      else setActiveTab("storage");
    };
    window.addEventListener("stashsaarthi:nav-tab", handleCustomNav);

    const openCalc = () => setCalculatorOpen(true);
    const openForum = () => setForumOpen(true);
    window.addEventListener("stashsaarthi:open-calculator", openCalc);
    window.addEventListener("stashsaarthi:open-forum", openForum);

    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("stashsaarthi:nav-tab", handleCustomNav);
      window.removeEventListener("stashsaarthi:open-calculator", openCalc);
      window.removeEventListener("stashsaarthi:open-forum", openForum);
    };
  }, []);

  if (role === "host") {
    return (
      <div className="w-full mt-8 mb-16 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 min-h-[650px]">
          <div className="space-y-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12">
              <h3 className="text-3xl font-bold text-amber-400 mb-6 text-center">
                Host Inventory Command
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl shadow-lg transition-colors"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Upload KYC ID Document
                </button>
                <button
                  onClick={() => setVerifyModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-colors"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Verify Host Stash Space
                </button>
                <button
                  onClick={onListRoom}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold rounded-xl shadow-lg transition-colors"
                >
                  <ShieldAlert className="w-5 h-5" />
                  List New Space / Become a Host
                </button>
              </div>
              <Suspense fallback={null}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <HostInventoryGrid />
                </motion.div>
              </Suspense>
            </div>
            <AadhaarKycModal
              isOpen={kycModalOpen}
              onClose={() => setKycModalOpen(false)}
              onSuccess={() => setKycModalOpen(false)}
            />
            <HostStashVerificationModal
              isOpen={verifyModalOpen}
              onClose={() => setVerifyModalOpen(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8 mb-16 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 mb-8">
        <div className="flex justify-center w-full pb-2">
          <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-full w-full max-w-2xl overflow-x-auto hide-scrollbar snap-x snap-mandatory">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 min-w-fit px-4 sm:px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center text-center snap-center ${
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4">
        <div className="min-h-[650px] w-full relative transition-all duration-300">
          <AnimatePresence mode="wait">
            {activeTab === 'storage' && (
              <motion.div
                key="storage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StorageServiceTab onBook={onBook} />
              </motion.div>
            )}
            {activeTab === 'rooms' && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RoomsServiceTab onBook={onBook} />
              </motion.div>
            )}
            {activeTab === 'khana' && (
              <motion.div
                key="khana"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TokenMealHub onBook={onBook} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <CalculatorModal open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
      <ForumModal open={forumOpen} onClose={() => setForumOpen(false)} />
      <MascotGuide activeTab={activeTab} calculatorOpen={calculatorOpen} forumOpen={forumOpen} />
    </div>
  );
}

