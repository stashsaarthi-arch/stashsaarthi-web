import { registerBackgroundPeriodicSync } from "./offlineBookingQueue";

export function registerServiceWorker(): void {
  if (typeof window === "undefined") return; // SSR guard
  if (!("serviceWorker" in navigator)) return;

  // In dev mode the Vite dev server handles everything via HMR;
  // registering a SW would break hot-reload and serve stale modules.
  const isDev =
    import.meta.env.DEV ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (isDev) {
    console.debug("[SW] Skipping registration in dev mode");
    return;
  }

  // Wait until the page finishes loading to avoid competing for bandwidth
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // always fetch fresh SW script
      });

      console.info("[SW] Registered:", registration.scope);

      // Register Background Sync & Periodic Sync for offline bookings
      await registerBackgroundPeriodicSync();

      // Listen for updates and notify user when a new version is available
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "activated" &&
            navigator.serviceWorker.controller
          ) {
            console.info(
              "[SW] New content available — reload for the latest version.",
            );
          }
        });
      });

      // Periodic cache trim (runs every 5 minutes while the page is open)
      setInterval(
        () => {
          registration.active?.postMessage({ type: "TRIM_CACHES" });
        },
        5 * 60 * 1000,
      );
    } catch (err) {
      console.warn("[SW] Registration failed:", err);
    }
  });
}

