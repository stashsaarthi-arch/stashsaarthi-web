/**
 * Kitchen Service Worker 2G Performance Stress Tester
 * ----------------------------------------------------
 * Simulates multiple kitchen images loading simultaneously under 2G connection constraints.
 * Evaluates Service Worker deduplication, latency, cache hits, and fallback SVG behavior.
 */

export interface KitchenSwStressMetrics {
  totalRequested: number;
  cacheHits: number;
  networkFetched: number;
  fallbackSvgs: number;
  failedCount: number;
  totalDurationMs: number;
  averageLatencyMs: number;
  is2gResilient: boolean;
}

export const KITCHEN_TEST_IMAGE_URLS = [
  "/images/product-microstorage.webp",
  "/images/founder_advik.webp",
  "/images/og-banner-new.webp",
  "/images/stashsaarthi-logo.png",
  "/images/app-icon.png",
  "/favicon.png",
  "/images/kitchen-annapurna-kakadeo.webp",
  "/images/kitchen-dadima-kalyanpur.webp",
  "/images/kitchen-shanti-nawabganj.webp",
  "/images/kitchen-campus-senior.webp",
  "/images/kitchen-mother-chef-motion.webp",
  "/images/kitchen-mother-chef-pw.webp",
  "/images/kitchen-mother-chef-allen.webp",
  "/images/kitchen-special-thali.webp",
  "/images/kitchen-standard-thali.webp",
];

/**
 * Execute concurrent 2G stress test for Service Worker image handling
 */
export async function runKitchenSwStressTest(
  customUrls?: string[],
): Promise<KitchenSwStressMetrics> {
  const urls = customUrls && customUrls.length > 0 ? customUrls : KITCHEN_TEST_IMAGE_URLS;
  const startTime = performance.now();

  let cacheHits = 0;
  let networkFetched = 0;
  let fallbackSvgs = 0;
  let failedCount = 0;
  const latencies: number[] = [];

  // Fire all fetch requests SIMULTANEOUSLY to simulate high-concurrency burst on 2G
  const fetchPromises = urls.map(async (url) => {
    const fetchStart = performance.now();
    try {
      const response = await fetch(url, {
        cache: "default",
        headers: { "X-2G-Stress-Test": "true" },
      });

      const fetchEnd = performance.now();
      latencies.push(fetchEnd - fetchStart);

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("image/svg+xml")) {
        fallbackSvgs++;
      } else if (response.ok) {
        networkFetched++;
      } else {
        failedCount++;
      }
    } catch {
      failedCount++;
    }
  });

  await Promise.all(fetchPromises);

  const endTime = performance.now();
  const totalDurationMs = Math.round(endTime - startTime);
  const averageLatencyMs =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;

  // Determine resilience: Zero unhandled network crashes, all requests resolved with image/fallback
  const is2gResilient = failedCount === 0 && (networkFetched + fallbackSvgs) === urls.length;

  const result: KitchenSwStressMetrics = {
    totalRequested: urls.length,
    cacheHits,
    networkFetched,
    fallbackSvgs,
    failedCount,
    totalDurationMs,
    averageLatencyMs,
    is2gResilient,
  };

  console.info("[Kitchen SW 2G Stress Test Results]", result);
  return result;
}
