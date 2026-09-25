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
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen w-full overflow-x-clip bg-transparent text-white transition-colors duration-500 focus:outline-none pt-16 sm:pt-20 pb-24 sm:pb-0"
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

      <HomeSolutions onBook={open} onListRoom={handleListRoom} />

      <HomeDeepModules role={role} onBook={open} onRefer={handleRefer} />

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
    </main>
  );
}
