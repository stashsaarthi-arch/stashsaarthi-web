import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CinematicPreLoader } from "@/components/ui/CinematicPreLoader";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { registerServiceWorker } from "../lib/sw-register";
import { Toaster, toast } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LowDataProvider, useLowData } from "@/context/LowDataContext";
import { useAuthStore } from "@/store/useAuthStore";
import { ToastProvider } from "@/context/ToastContext";
import { AccessibilityAnnouncer } from "@/components/ui/AccessibilityAnnouncer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { NetworkStatus } from "@/components/stash/NetworkStatus";
import { coLivingSpacesSchema, coLivingItemListSchema } from "@/lib/seo-coliving-schema";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "lenis/dist/lenis.css";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      },
      { name: "theme-color", content: "#0A0D0F" },
      { name: "color-scheme", content: "dark" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "StashSaarthi" },
      { name: "application-name", content: "StashSaarthi" },
      { name: "google-site-verification", content: "googlec3390cf96e97cc6c" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "format-detection", content: "telephone=no" },
      { title: "StashSaarthi | Student Storage, PG Rooms, Hostels & Kitchen Services in Kanpur" },
      {
        name: "title",
        content: "StashSaarthi | Student Storage, PG Rooms, Hostels & Kitchen Services in Kanpur",
      },
      {
        name: "description",
        content:
          "Affordable student luggage storage, verified PG rooms, student hostels, and tiffin/kitchen services near CSJMU Kanpur. Safe, verified, and budget-friendly.",
      },
      {
        name: "keywords",
        content:
          "student room kanpur, pg in kanpur, hostel near csjmu, student luggage storage, student kitchen tiffin kanpur, paying guest kanpur, student warehouse",
      },
      { name: "geo.region", content: "IN-UP" },
      { name: "geo.placename", content: "Kanpur, Kakadeo, Kalyanpur" },
      { name: "geo.position", content: "26.4797;80.3012" },
      { name: "ICBM", content: "26.4797, 80.3012" },
      { name: "author", content: "StashSaarthi" },
      { property: "og:site_name", content: "StashSaarthi" },
      { property: "og:locale", content: "en_IN" },
      {
        property: "og:title",
        content: "StashSaarthi | Student Storage, PG Rooms, Hostels & Kitchen Services in Kanpur",
      },
      {
        property: "og:description",
        content:
          "Affordable student luggage storage, verified PG rooms, student hostels, and tiffin/kitchen services near CSJMU Kanpur. Safe, verified, and budget-friendly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://stashsaarthi-web.vercel.app" },
      {
        property: "og:image",
        content: "https://stashsaarthi-web.vercel.app/images/og-banner-new.png",
      },
      {
        property: "og:image:alt",
        content: "StashSaarthi Intergenerational Living and Micro-Storage",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@StashSaarthi" },
      { name: "twitter:creator", content: "@StashSaarthi" },
      {
        name: "twitter:title",
        content: "StashSaarthi | Student Storage, PG Rooms, Hostels & Kitchen Services in Kanpur",
      },
      {
        name: "twitter:description",
        content:
          "Affordable student luggage storage, verified PG rooms, student hostels, and tiffin/kitchen services near CSJMU Kanpur. Safe, verified, and budget-friendly.",
      },
      {
        name: "twitter:image",
        content: "https://stashsaarthi-web.vercel.app/images/og-banner-new.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/app-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});



function RootShell({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://stashsaarthi-web.vercel.app/#localbusiness",
        name: "StashSaarthi",
        url: "https://stashsaarthi-web.vercel.app",
        areaServed: "Kanpur, Uttar Pradesh, India",
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Student Luggage Storage",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PG & Hostel Accommodation",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Student Kitchen & Meal Support",
            },
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "120",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://stashsaarthi-web.vercel.app/#website",
        url: "https://stashsaarthi-web.vercel.app/",
        name: "StashSaarthi",
        alternateName: ["Stash Saarthi", "StashSaarthi India"],
        description: "Official platform for StashSaarthi.",
        publisher: { "@id": "https://stashsaarthi-web.vercel.app/#organization" },
        image: "https://stashsaarthi-web.vercel.app/images/og-banner-new.png",
      },
      {
        "@type": "Organization",
        "@id": "https://stashsaarthi-web.vercel.app/#organization",
        name: "StashSaarthi",
        url: "https://stashsaarthi-web.vercel.app/",
        logo: "https://stashsaarthi-web.vercel.app/stashsaarthi-logo.png",
        image: "https://stashsaarthi-web.vercel.app/images/og-banner-new.png",
        description:
          "Official platform for StashSaarthi. India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform.",
        sameAs: ["https://instagram.com/stashsaarthi", "https://twitter.com/StashSaarthi"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9369454350",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
      },
      {
        "@type": "Product",
        "@id": "https://stashsaarthi-web.vercel.app/#product-microstorage",
        name: "Saarthi Stash - Campus Micro-Storage",
        description:
          "Secure, tamper-evident vacation luggage micro-storage for university students during semester breaks.",
        image: [
          "https://stashsaarthi-web.vercel.app/images/product-microstorage.jpg",
          "https://stashsaarthi-web.vercel.app/images/og-banner-new.png",
        ],
        brand: {
          "@type": "Brand",
          name: "StashSaarthi",
        },
        sku: "SS-KNP-STASH-01",
        mpn: "SS-300-KNP",
        gtin13: "8901234567890",
        offers: {
          "@type": "Offer",
          price: "300",
          priceCurrency: "INR",
          validFrom: "2026-01-01",
          priceValidUntil: "2027-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          url: "https://stashsaarthi-web.vercel.app",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "INR",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "IN",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 7,
            returnMethod: "https://schema.org/ReturnInStore",
            returnFees: "https://schema.org/FreeReturn",
          },
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://stashsaarthi-web.vercel.app/#hub-kanpur",
        name: "StashSaarthi Kanpur Campus Hub",
        image: "https://stashsaarthi-web.vercel.app/images/product-microstorage.jpg",
        telephone: "+91-9369454350",
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "12/504, Near Allen House Public School, Gwaltoli",
          addressLocality: "Kanpur",
          addressRegion: "Uttar Pradesh",
          postalCode: "208002",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "26.5123",
          longitude: "80.2329",
        },
        url: "https://stashsaarthi-web.vercel.app",
      },
      // ── Kanpur Entity: Kakadeo Hub ──────────────────────────────────────
      {
        "@type": "LocalBusiness",
        "@id": "https://stashsaarthi-web.vercel.app/#kakadeo-entity",
        name: "StashSaarthi — Kakadeo Student Hub",
        url: "https://stashsaarthi-web.vercel.app/",
        telephone: "+91-9369454350",
        priceRange: "\u20b950\u2013\u20b9300",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Chhapeda Pulia, Kakadeo",
          addressLocality: "Kanpur",
          addressRegion: "Uttar Pradesh",
          postalCode: "208025",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.4797,
          longitude: 80.3012,
        },
        areaServed: ["Kakadeo", "Kalyanpur", "Rawatpur", "Nawabganj", "Kanpur"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Kanpur Student Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Token Meal & Daily Tiffin Service Kakadeo",
                description:
                  "Flexible daily homestyle thali from \u20b950 with zero monthly lock-in, ₹10 room delivery in Kakadeo & Kalyanpur.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Vacation Luggage Micro-Storage Kanpur",
                description:
                  "Secure tamper-proof luggage storage at \u20b9300/month per bag during semester breaks.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Broker-Free Student Rooms Kakadeo",
                description:
                  "Verified PG and student rooms near Allen, Motion, Physics Wallah coaching centers in Kakadeo — zero brokerage.",
              },
            },
          ],
        },
      },
      // ── FAQPage: High-intent Kanpur search queries ──────────────────────
      {
        "@type": "FAQPage",
        "@id": "https://stashsaarthi-web.vercel.app/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which is the best flexible tiffin service in Kakadeo Kanpur?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StashSaarthi offers flexible daily token-based tiffin services in Kakadeo and Kalyanpur starting at \u20b950 with \u20b910 room delivery — no monthly lock-in required.",
            },
          },
          {
            "@type": "Question",
            name: "Where can students safely store luggage during semester breaks in Kanpur?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StashSaarthi provides secure micro-storage at \u20b9300/month per bag near CSJMU and IIT Kanpur with tamper-proof QR-sealed packing.",
            },
          },
          {
            "@type": "Question",
            name: "How to find broker-free student rooms near Allen coaching in Kakadeo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StashSaarthi Spaces lists verified student stays and PGs near Allen, Motion, and Physics Wallah coaching centers in Kakadeo without any brokerage fees.",
            },
          },
          {
            "@type": "Question",
            name: "What is the food delivery charge for hostels in Kakadeo Kanpur?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StashSaarthi Saarthi Kitchen delivers homestyle thalis directly to hostel rooms in Kakadeo and Kalyanpur for a flat \u20b910 delivery charge.",
            },
          },
        ],
      },
      coLivingItemListSchema,
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning={true} className="bg-transparent overflow-x-hidden w-full max-w-full">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="pb-24 sm:pb-0 bg-transparent text-white selection:bg-emerald-500/30 overflow-x-hidden w-full max-w-full md:cursor-none" suppressHydrationWarning={true}>
        <div className="relative min-h-screen w-full overflow-x-hidden max-w-full bg-transparent text-white selection:bg-emerald-500/30">
          <CinematicPreLoader />
          <CustomCursor />
          
          {/* THE SPATIAL VOID (STRICTLY z-0, NEVER NEGATIVE) */}
          <SpatialVoid />

          {/* THE FOREGROUND CONTENT (STRICTLY z-10) */}
          <main className="relative z-10 w-full max-w-full overflow-x-hidden flex flex-col min-h-screen">
            {children} 
          </main>

        </div>
        <Scripts />
      </body>
    </html>
  );
}

function SpatialVoid() {
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let rafId: number;

    const onScroll = () => {
      const currentScroll = (window as any).__lenis?.scroll ?? window.scrollY ?? document.documentElement.scrollTop ?? 0;
      setScrollY(currentScroll);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Subtle 3D camera pan based on mouse coordinates (-15px to +15px)
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };

    const updateLoop = () => {
      onScroll();
      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-0 pointer-events-none bg-[#030608]" />;

  // Dynamic 3D camera pitch that reacts to user scroll velocity
  const dynamicPitch = 64 + Math.sin(scrollY * 0.0012) * 2.5;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#030608] overflow-hidden max-w-full select-none" style={{ contain: "strict" }}>
      
      {/* ── UNIFIED 3D SPATIAL PARALLAX ENVIRONMENT (E-Summit 3D Cosmos DNA) ── */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`
        }}
      >
        
        {/* 1. DEEP COSMIC STARFIELD LAYER (Parallax Depth 1) */}
        <div 
          className="absolute inset-0 opacity-40 transform-gpu"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 140px 170px, rgba(0,245,160,0.8), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 260px 90px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 380px 240px, rgba(16,185,129,0.7), rgba(0,0,0,0)),
              radial-gradient(1.2px 1.2px at 510px 150px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 640px 320px, rgba(6,182,212,0.8), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 780px 70px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 910px 280px, rgba(0,245,160,0.7), rgba(0,0,0,0))
            `,
            backgroundSize: "950px 450px",
            transform: `translateY(${-(scrollY * 0.08)}px) translateZ(0)`,
            willChange: "transform"
          }}
        />

        {/* 2. THE ICONIC E-SUMMIT CURVED PLANETARY HORIZON DOME & CORONA AURORA */}
        <div 
          className="absolute top-[18%] sm:top-[20%] left-1/2 w-full sm:w-[120vw] h-[480px] sm:h-[580px] rounded-[100%] pointer-events-none transform-gpu"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.28) 0%, rgba(20, 184, 166, 0.16) 32%, rgba(6, 182, 212, 0.08) 58%, transparent 78%)",
            borderBottom: "1.5px solid rgba(0, 245, 160, 0.5)",
            boxShadow: "0 14px 70px -10px rgba(0, 245, 160, 0.4), inset 0 -20px 50px -10px rgba(16, 185, 129, 0.3)",
            transform: `translateX(-50%) translateY(${-(scrollY * 0.18)}px) scale(${1 + Math.min(scrollY * 0.00025, 0.12)}) translateZ(0)`,
            willChange: "transform"
          }}
        />

        {/* 3. HORIZONTAL HIGH-SPEED LASER PHOTONS & LIGHT STREAKS (E-Summit Light Streaks) */}
        <div className="absolute top-[28%] sm:top-[32%] inset-x-0 h-[3px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
          <div 
            className="photon-streak w-48 sm:w-96"
            style={{ 
              top: 0, 
              animationDuration: "5.5s", 
              transform: `translateY(${-(scrollY * 0.12) % 30}px)` 
            }} 
          />
          <div 
            className="photon-streak w-36 sm:w-72" 
            style={{ 
              top: 0, 
              animationDuration: "8s", 
              animationDelay: "2.8s", 
              transform: `translateY(${-(scrollY * 0.12) % 30}px)` 
            }} 
          />
        </div>

        {/* 4. 3D INFINITE PERSPECTIVE FLOOR GRID WITH DYNAMIC PITCH & GLIDE */}
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ perspective: "680px", perspectiveOrigin: "50% 27%" }}
        >
          <div 
            className="w-[140vw] sm:w-[160vw] h-[170vh] absolute top-[22%] sm:top-[26%] left-[-20vw] sm:left-[-30vw]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.18) 1.2px, transparent 1.2px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.18) 1.2px, transparent 1.2px),
                radial-gradient(circle 1.5px at 0 0, rgba(0, 245, 160, 0.6) 100%, transparent 0)
              `,
              backgroundSize: "48px 48px, 48px 48px, 48px 48px",
              transform: `rotateX(${dynamicPitch}deg) translateY(${-(scrollY * 0.42) % 48}px) translateZ(0)`,
              transformOrigin: "50% 0%",
              maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 85%, transparent 100%)",
              willChange: "transform"
            }}
          />
        </div>

        {/* 5. FLOATING TELEMETRY RADAR NODES (Mobile + Desktop Parallax Anchors) */}
        <div 
          className="hidden sm:flex absolute top-[32%] sm:top-[36%] left-[3%] sm:left-[8%] font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-emerald-400/70 border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-md px-2.5 py-1.5 rounded-lg items-center gap-2 transform-gpu shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          style={{
            transform: `translateY(${-(scrollY * 0.15)}px) translateZ(0)`,
            willChange: "transform"
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>NODE 01 // KANPUR [26.4°N]</span>
        </div>

        <div 
          className="hidden sm:flex absolute top-[46%] sm:top-[50%] right-[3%] sm:right-[10%] font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-teal-400/60 border border-teal-500/30 bg-teal-950/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg items-center gap-2 transform-gpu shadow-[0_0_15px_rgba(20,184,166,0.2)]"
          style={{
            transform: `translateY(${-(scrollY * 0.24)}px) translateZ(0)`,
            willChange: "transform"
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>VAULT ALPHA // ESCROW VERIFIED</span>
        </div>

        <div 
          className="hidden md:flex absolute top-[20%] right-[22%] font-mono text-[9px] tracking-widest text-cyan-400/40 border border-cyan-500/20 bg-cyan-950/20 px-2.5 py-1 rounded-md items-center gap-1.5 transform-gpu"
          style={{
            transform: `translateY(${-(scrollY * 0.09)}px) translateZ(0)`,
            willChange: "transform"
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
          <span>STASHSAARTHI // 3D SPATIAL MATRIX</span>
        </div>

        {/* 6. AMBIENT COMPOSITING RADIAL LIGHTS (Zero-Lag Composite Pass) */}
        <div 
          className="absolute top-[-10%] left-[-15%] sm:left-[-10%] w-[90vw] sm:w-[60vw] h-[90vw] sm:h-[60vw] bg-[radial-gradient(circle,rgba(16,185,129,0.16)_0%,transparent_70%)] transform-gpu pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 0.16}px) translateZ(0)`,
            willChange: "transform"
          }}
        />
        <div 
          className="absolute bottom-[-15%] right-[-15%] sm:right-[-10%] w-[90vw] sm:w-[70vw] h-[90vw] sm:h-[70vw] bg-[radial-gradient(circle,rgba(20,184,166,0.14)_0%,transparent_70%)] transform-gpu pointer-events-none"
          style={{
            transform: `translateY(${-(scrollY * 0.12)}px) translateZ(0)`,
            willChange: "transform"
          }}
        />

        {/* 7. ULTRA-SUBTLE FILM NOISE (Desktop only for pure clarity) */}
        <div 
          className="hidden md:block absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>
    </div>
  );
}

function LenisHandler() {
  const lenis = useLenis();
  const { isLowData } = useLowData();

  useEffect(() => {
    if (!lenis) return;
    (window as any).__lenis = lenis;

    // Scroll-Isolate Architecture: add .is-scrolling while scrolling, remove 100ms after scroll stops
    let isScrollingTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      document.body.classList.add("is-scrolling");
      clearTimeout(isScrollingTimeout);
      isScrollingTimeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 100);
    };

    lenis.on("scroll", handleScroll);

    // Force ultra-smooth 120 FPS scrolling via Lenis native mechanism if needed, 
    // but by default Lenis ties to browser refresh rate (which is usually ideal).
    // Native requestAnimationFrame handles it.

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
      }, 200);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      lenis.off("scroll", handleScroll);
      clearTimeout(resizeTimer);
      clearTimeout(isScrollingTimeout);
      if (typeof document !== "undefined") {
        document.body.classList.remove("is-scrolling");
      }
      window.removeEventListener("resize", handleResize);
      if (typeof window !== "undefined") {
        delete (window as any).__lenis;
      }
    };
  }, [lenis, isLowData]);

  return null;
}

import { DynamicOGHead } from "@/components/seo/DynamicOGHead";

import { initWebGLSafetyGuard } from "@/lib/webgl-fallback";
import { initSessionSecurityListener } from "@/lib/sessionSecurity";
import { initVisitorTracking, trackPageView } from "@/lib/visitorTracking";
import { initAutoDataRetentionPurge } from "@/lib/dataRetentionEngine";

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-center"
      richColors
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        className:
          "border border-border bg-card text-card-foreground backdrop-blur-xl shadow-2xl rounded-2xl",
      }}
    />
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const currentRoute = routerState.location.pathname;

  useEffect(() => {
    initWebGLSafetyGuard();
    initAutoDataRetentionPurge();
    const { unsubscribe } = initSessionSecurityListener();
    const stopTracking = initVisitorTracking();
    const unsubscribeAuthStore = useAuthStore.getState().initialize();
    return () => {
      unsubscribe();
      stopTracking();
      unsubscribeAuthStore();
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    const handleOffline = () => {
      toast.error("Connection lost", {
        description: "Please check your network connection.",
        duration: Infinity,
        id: "offline-toast",
      });
    };

    const handleOnline = () => {
      toast.dismiss("offline-toast");
      toast.success("Back online", {
        description: "Your connection has been restored.",
        duration: 3000,
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Register Service Worker for offline-first caching (production only)
  useEffect(() => {
    return registerServiceWorker();
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env["VITE_GOOGLE_CLIENT_ID"] || "fallback_client_id"}
    >
      <AuthProvider>
        <LanguageProvider>
          <PersonaProvider>
            <ThemeProvider>
              <LowDataProvider>
                <ToastProvider>
                  <QueryClientProvider client={queryClient}>
                    <DynamicOGHead />
                    <ErrorBoundary>
                      <ReactLenis
                        root
                        options={{
                          lerp: 0.07, // Apple-like momentum inertia
                          orientation: "vertical",
                          gestureOrientation: "vertical",
                          smoothWheel: true,
                          wheelMultiplier: 1.0,
                          syncTouch: true, // Force synthetic touch for consistent iPhone feel on Android
                          touchMultiplier: 2.5, // Mimic iOS flick velocity
                          infinite: false,
                          autoRaf: true, // Native rAF baseline
                        }}
                      >
                        <LenisHandler />
                        <AnimatePresence mode="wait" initial={false}>
                          <PageTransition key={currentRoute} routeKey={currentRoute}>
                            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                            <Outlet />
                          </PageTransition>
                        </AnimatePresence>
                        <NetworkStatus />
                        <AccessibilityAnnouncer />
                      </ReactLenis>
                    </ErrorBoundary>
                    <ThemedToaster />
                  </QueryClientProvider>
                </ToastProvider>
              </LowDataProvider>
            </ThemeProvider>
          </PersonaProvider>
        </LanguageProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
