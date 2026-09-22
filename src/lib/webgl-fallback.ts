/**
 * WebGL Safety & Legacy Android Compatibility Guard for StashSaarthi
 * Prevents WebGL context crashes, handles context loss on low-spec GPUs,
 * and enforces safe 2D CSS fallbacks on older Android devices (Android < 8.0, older WebKit/Chrome).
 */

export interface WebGLDiagnosticResult {
  isWebGLSupported: boolean;
  isLegacyAndroid: boolean;
  contextType: "webgl2" | "webgl" | "experimental-webgl" | "none";
  rendererName?: string | undefined;
  vendorName?: string | undefined;
}

let diagnosticCache: WebGLDiagnosticResult | null = null;

/**
 * Checks if the current client is running an older Android OS version (Android < 8.0 / low GPU memory).
 */
export function isLegacyAndroidUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const androidMatch = ua.match(/Android\s([0-9\.]+)/i);
  if (androidMatch && androidMatch[1]) {
    const majorVersion = parseFloat(androidMatch[1]);
    return majorVersion < 8.0;
  }
  return false;
}

/**
 * Diagnostics runner for WebGL context support and hardware safety.
 */
export function diagnoseWebGL(): WebGLDiagnosticResult {
  if (diagnosticCache !== null) return diagnosticCache;

  if (typeof window === "undefined" || typeof document === "undefined") {
    diagnosticCache = {
      isWebGLSupported: false,
      isLegacyAndroid: false,
      contextType: "none",
    };
    return diagnosticCache;
  }

  const isLegacyAndroid = isLegacyAndroidUserAgent();
  let isWebGLSupported = false;
  let contextType: WebGLDiagnosticResult["contextType"] = "none";
  let rendererName: string | undefined = undefined;
  let vendorName: string | undefined = undefined;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (gl) {
      isWebGLSupported = true;
      if (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext) {
        contextType = "webgl2";
      } else {
        contextType = "webgl";
      }

      // Query debug info renderer if available
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        vendorName = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || undefined;
        rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || undefined;
      }
    }
  } catch (err) {
    console.warn("[WebGL Guard] WebGL context initialization threw exception:", err);
    isWebGLSupported = false;
  }

  diagnosticCache = {
    isWebGLSupported: isWebGLSupported && !isLegacyAndroid, // Force safe fallback mode on older Android
    isLegacyAndroid,
    contextType,
    rendererName,
    vendorName,
  };

  return diagnosticCache;
}

/**
 * Initializes global HTML data attributes and attaches context loss listeners to any canvas elements.
 */
export function initWebGLSafetyGuard(): void {
  if (typeof document === "undefined") return;

  const diag = diagnoseWebGL();
  const root = document.documentElement;

  root.setAttribute("data-webgl-supported", diag.isWebGLSupported ? "true" : "false");
  root.setAttribute("data-legacy-android", diag.isLegacyAndroid ? "true" : "false");

  if (!diag.isWebGLSupported || diag.isLegacyAndroid) {
    root.classList.add("legacy-android-fallback");
  }

  // Listen for WebGL context lost globally on any canvas elements
  window.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      console.warn(
        "[WebGL Guard] WebGL context lost detected! Fallback to 2D CSS safe rendering mode.",
      );
      root.setAttribute("data-webgl-supported", "false");
      root.classList.add("legacy-android-fallback");
    },
    false,
  );
}
