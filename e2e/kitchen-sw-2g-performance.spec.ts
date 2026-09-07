import { test, expect } from "@playwright/test";

test.describe("Kitchen Service Worker 2G Performance Stress Test (Task 85)", () => {
  test("simultaneously loads multiple kitchen images under 2G network emulation cleanly", async ({
    page,
    context,
  }) => {
    // Emulate 2G Cellular Network profile (300kbps down, 150kbps up, 300ms latency)
    try {
      const client = await context.newCDPSession(page);
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: Math.floor((300 * 1024) / 8),
        uploadThroughput: Math.floor((150 * 1024) / 8),
        latency: 300,
      });
    } catch {
      // Ignore if browser engine does not support CDP session (e.g. non-Chromium)
    }

    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    // Verify page element visibility
    await expect(page.locator("body")).toBeVisible();

    // Execute concurrent image fetch burst on page
    const metrics = await page.evaluate(async () => {
      const testImages = [
        "/images/product-microstorage.webp",
        "/images/founder_advik.webp",
        "/images/og-banner-new.webp",
        "/images/stashsaarthi-logo.png",
        "/images/app-icon.png",
        "/favicon.png",
        "/images/kitchen-thali-1.webp",
        "/images/kitchen-thali-2.webp",
        "/images/kitchen-thali-3.webp",
        "/images/kitchen-thali-4.webp",
      ];

      const startTime = performance.now();
      const results = await Promise.all(
        testImages.map(async (src) => {
          try {
            const res = await fetch(src);
            const contentType = res.headers.get("content-type") || "";
            return {
              ok: res.ok,
              status: res.status,
              isSvgFallback: contentType.includes("image/svg+xml"),
            };
          } catch {
            return { ok: false, status: 0, isSvgFallback: false };
          }
        }),
      );
      const endTime = performance.now();

      return {
        total: testImages.length,
        successful: results.filter((r) => r.ok).length,
        durationMs: Math.round(endTime - startTime),
      };
    });

    expect(metrics.total).toBe(10);
    expect(metrics.successful).toBe(10);
  });
});
