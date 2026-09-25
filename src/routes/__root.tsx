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
        content: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
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
    <html lang="en" suppressHydrationWarning={true} className="bg-transparent">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="pb-24 sm:pb-0 bg-transparent text-white selection:bg-emerald-500/30 cursor-none" suppressHydrationWarning={true}>
        <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent text-white selection:bg-emerald-500/30 cursor-none">
          <CinematicPreLoader />
          <CustomCursor />
          
          {/* THE SPATIAL VOID (STRICTLY z-0, NEVER NEGATIVE) */}
          <SpatialVoid />

          {/* THE FOREGROUND CONTENT (STRICTLY z-10) */}
          <main className="relative z-10 w-full flex flex-col min-h-screen">
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let rafId: number;
    
    // Create a unified scroll updater that works with both native scroll and Lenis
    const updateScroll = () => {
      // Prioritize Lenis scroll if available, fallback to window.scrollY
      const currentScroll = (window as any).__lenis?.scroll || window.scrollY;
      setScrollY(currentScroll);
      rafId = requestAnimationFrame(updateScroll);
    };
    
    rafId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-0 pointer-events-none bg-[#030303]" />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#030303] overflow-hidden">
      {/* 3D Scrolling Grid Layer (E-Summit Style) */}
      <div 
        className="absolute w-[200vw] h-[200vh] left-[-50vw] top-[-50vh] opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: `translateY(${-(scrollY * 0.15) % 50}px) perspective(1000px) rotateX(45deg)`,
          transformOrigin: 'top center',
          willChange: 'transform'
        }}
      />
      
      {/* Dynamic Scrolling Glow Orbs */}
      <div 
        className="absolute top-0 left-[-10%] w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] bg-emerald-500/15 md:bg-emerald-500/30 blur-[60px] md:blur-[120px] rounded-full mix-blend-screen transform-gpu"
        style={{
          transform: `translateY(${scrollY * 0.2}px) translateZ(0)`,
          willChange: 'transform'
        }}
      />
      <div 
        className="absolute bottom-0 right-[-10%] w-[120vw] h-[120vw] md:w-[70vw] md:h-[70vw] bg-teal-500/10 md:bg-teal-500/20 blur-[60px] md:blur-[150px] rounded-full mix-blend-screen transform-gpu"
        style={{
          transform: `translateY(${-(scrollY * 0.1)}px) translateZ(0)`,
          willChange: 'transform'
        }}
      />
      
      {/* Film Grain Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
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
                          duration: 1.1,
                          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                          orientation: "vertical",
                          gestureOrientation: "vertical",
                          smoothWheel: true,
                          wheelMultiplier: 0.9,
                          syncTouch: false, // CRITICAL: Disable Lenis synthetic touch hijacking
                          touchMultiplier: 1.0,
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
