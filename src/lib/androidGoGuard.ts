/**
 * Android Go & Low-End Device Performance Safety Guard for StashSaarthi
 * Detects low-memory (<2GB RAM), low-CPU (<=4 cores), or Android Go edition devices
 * common among students in Kanpur (e.g., JioPhone Next, Redmi A1, Samsung A01 Core).
 * Applies lightweight CSS rendering, throttles heavy animations, and protects against crashes.
 */

export interface AndroidGoDiagnostics {
  isAndroidGo: boolean;
  deviceMemoryGb?: number | undefined;
  hardwareConcurrency?: number | undefined;
  shouldThrottleAnimations: boolean;
  reason: string;
}

let androidGoDiagnosticCache: AndroidGoDiagnostics | null = null;

/**
 * Evaluates whether the user's browser/hardware matches low-end Android Go profile.
 */
export function diagnoseAndroidGo(): AndroidGoDiagnostics {
  if (androidGoDiagnosticCache !== null) return androidGoDiagnosticCache;

  if (typeof window === "undefined" || typeof navigator === "undefined") {
    androidGoDiagnosticCache = {
      isAndroidGo: false,
      shouldThrottleAnimations: false,
      reason: "Server-side environment",
    };
    return androidGoDiagnosticCache;
  }

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isGoEdition = /Android.*(Go|Edition|JioPhone|Redmi\sA1|Realme\sC)/i.test(ua);

  // Check Web API device memory (in GB, available in Chrome/Android)
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const memoryGb = typeof memory === "number" ? memory : undefined;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency;

  let isAndroidGo = false;
  let shouldThrottleAnimations = false;
  let reason = "Standard device capabilities";

  if (isGoEdition) {
    isAndroidGo = true;
    shouldThrottleAnimations = true;
    reason = "Explicit Android Go / entry-level user-agent detected";
  } else if (isAndroid && memoryGb !== undefined && memoryGb <= 2) {
    isAndroidGo = true;
    shouldThrottleAnimations = true;
    reason = `Low device RAM detected (${memoryGb}GB <= 2GB)`;
  } else if (isAndroid && cores !== undefined && cores <= 4) {
    isAndroidGo = true;
    shouldThrottleAnimations = true;
    reason = `Low CPU concurrency detected (${cores} cores <= 4)`;
  }

  androidGoDiagnosticCache = {
    isAndroidGo,
    deviceMemoryGb: memoryGb,
    hardwareConcurrency: cores,
    shouldThrottleAnimations,
    reason,
  };

  return androidGoDiagnosticCache;
}

/**
 * Initializes global HTML attributes and performance observers for Android Go safety.
 */
export function initAndroidGoGuard(): void {
  if (typeof document === "undefined") return;

  const diag = diagnoseAndroidGo();
  const root = document.documentElement;

  root.setAttribute("data-android-go", diag.isAndroidGo ? "true" : "false");

  if (diag.shouldThrottleAnimations) {
    root.classList.add("android-go-mode");
    console.info(`[Android Go Guard] Active: ${diag.reason}`);
  }

  // Active FPS monitor: auto-throttle if severe lag (FPS < 20) persists for 3s
  if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCounter = 0;

    const checkFps = (now: number) => {
      frameCount++;
      const elapsed = now - lastTime;

      if (elapsed >= 1000) {
        const fps = (frameCount * 1000) / elapsed;
        frameCount = 0;
        lastTime = now;

        if (fps < 20) {
          lowFpsCounter++;
          if (lowFpsCounter >= 3 && !root.classList.contains("android-go-mode")) {
            console.warn("[Android Go Guard] Frame rate dropped below 20 FPS — enabling Android Go mode fallback.");
            root.classList.add("android-go-mode");
            root.setAttribute("data-android-go", "true");
          }
        } else {
          lowFpsCounter = 0;
        }
      }

      if (lowFpsCounter < 3) {
        requestAnimationFrame(checkFps);
      }
    };

    requestAnimationFrame(checkFps);
  }
}
