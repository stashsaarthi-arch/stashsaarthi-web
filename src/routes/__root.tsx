import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Toaster, toast } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { NetworkStatus } from "@/components/stash/NetworkStatus";
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "theme-color", content: "#0A0D0F" },
      { name: "color-scheme", content: "dark" },
      { title: "StashSaarthi | Intergenerational Living & Micro-Storage" },
      { name: "description", content: "Vacation luggage storage at ₹300/bag/mo, zero-brokerage verified senior-hosted rooms, and homemade tiffins near top Indian campuses." },
      { name: "keywords", content: "student luggage storage, campus micro-storage, Kanpur student room, broker-free PG, IIT Kanpur luggage stash, vacation dead rent, intergenerational co-living India" },
      { name: "author", content: "StashSaarthi" },
      { property: "og:site_name", content: "StashSaarthi" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: "StashSaarthi | Intergenerational Living & Micro-Storage" },
      { property: "og:description", content: "Store vacation luggage securely from ₹300/mo. Find 100% verified, broker-free senior-hosted living across India." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://stashsaarthi-web.vercel.app" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@StashSaarthi" },
      { name: "twitter:creator", content: "@StashSaarthi" },
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
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
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
        "@type": "Organization",
        "@id": "https://stashsaarthi-web.vercel.app/#organization",
        "name": "StashSaarthi",
        "url": "https://stashsaarthi-web.vercel.app",
        "logo": "https://stashsaarthi-web.vercel.app/favicon.png",
        "description": "India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform.",
        "sameAs": [
          "https://instagram.com/stashsaarthi",
          "https://twitter.com/StashSaarthi"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9369454350",
          "contactType": "customer support",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://stashsaarthi-web.vercel.app/#website",
        "url": "https://stashsaarthi-web.vercel.app",
        "name": "StashSaarthi",
        "publisher": { "@id": "https://stashsaarthi-web.vercel.app/#organization" }
      },
      {
        "@type": "Product",
        "@id": "https://stashsaarthi-web.vercel.app/#product-microstorage",
        "name": "Saarthi Stash - Campus Micro-Storage",
        "description": "Secure, tamper-evident vacation luggage micro-storage for university students during semester breaks.",
        "offers": {
          "@type": "Offer",
          "price": "300",
          "priceCurrency": "INR",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://stashsaarthi-web.vercel.app"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://stashsaarthi-web.vercel.app/#hub-kanpur",
        "name": "StashSaarthi Kanpur Campus Hub",
        "image": "https://stashsaarthi-web.vercel.app/favicon.png",
        "telephone": "+91-9369454350",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kanpur",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "208016",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.5123",
          "longitude": "80.2329"
        },
        "url": "https://stashsaarthi-web.vercel.app"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "MOCK_CLARITY_ID");
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LenisHandler() {
  useLenis((lenis) => {
    (window as any).__lenis = lenis;
    ScrollTrigger.update();
  });

  useEffect(() => {
    const handleResize = () => {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const handleOffline = () => {
      toast.error("Connection lost", {
        description: "Please check your network connection.",
        duration: Infinity,
        id: "offline-toast"
      });
    };
    
    const handleOnline = () => {
      toast.dismiss("offline-toast");
      toast.success("Back online", {
        description: "Your connection has been restored.",
        duration: 3000
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env['VITE_GOOGLE_CLIENT_ID'] || "fallback_client_id"}>
      <AuthProvider>
        <LanguageProvider>
          <PersonaProvider>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                <ReactLenis
                  root
                  options={{
                    lerp: 0.14,
                    duration: 0.9,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1.0,
                    touchMultiplier: 1.0,
                    syncTouch: false,
                    autoRaf: true,
                  }}
                >
                  <LenisHandler />
                  {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                  <Outlet />
                  <NetworkStatus />
                </ReactLenis>
              </ErrorBoundary>
              <Toaster
                position="top-center"
                richColors
                theme="dark"
                toastOptions={{
                  className: "border border-white/10 bg-[#0A0D0F]/95 text-white backdrop-blur-xl shadow-2xl rounded-2xl",
                }}
              />
            </QueryClientProvider>
          </PersonaProvider>
        </LanguageProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
